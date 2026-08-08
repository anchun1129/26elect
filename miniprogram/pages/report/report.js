Page({
  data: {
    // 你的原有表单字段（和wxml一一对应）
    images: [],         //前端预览图片临时路径
    location: "",       //违规地点
    violationType: "",  //违规类型radio值
    description: "",    //补充描述
    submitting: false,
    active:1,

    //新增后端对接字段
    userId:"",
    fileIdList:[]       //云存储fileID数组，给AI审核+存入数据库
  },

  onLoad(options) {
    //页面打开执行登录云函数
    this.doLogin()
  },

  // =========对接刘：login登录云函数========
  doLogin(){
    wx.cloud.callFunction({
      name:"login",
      success:res=>{
        const uid = res.result.userId
        this.setData({userId: uid})
        wx.setStorageSync("userId", uid)
      },
      fail:err=>{
        wx.showToast({title:"登录失败，请重试",icon:"none"})
        console.error("login云函数错误",err)
      }
    })
  },

  // =========选择图片（你原有chooseImage）========
  chooseImage(){
    wx.chooseImage({
      count: 3 - this.data.images.length,
      sourceType:['album','camera'],
      success: async (res)=>{
        const tempPaths = res.tempFilePaths
        for(let tempUrl of tempPaths){
          await this.uploadOneImage(tempUrl)
        }
      }
    })
  },

  /**
   * 单张图片上传云存储
   * @param {String} tempFilePath 小程序本地临时图片路径
   */
  async uploadOneImage(tempFilePath){
    wx.showLoading({title:"上传图片"})
    try{
      const suffix = tempFilePath.split(".").pop()
      const cloudPath = `reportImg/${Date.now()}-${Math.random().toString(16).slice(2)}.${suffix}`
      const uploadRes = await wx.cloud.uploadFile({
        cloudPath: cloudPath,
        filePath: tempFilePath
      })
      //1.前端预览用本地临时路径
      let imgArr = this.data.images
      imgArr.push(tempFilePath)
      //2.存fileID，用于AI审核、存数据库
      let fidArr = this.data.fileIdList
      fidArr.push(uploadRes.fileID)

      this.setData({
        images:imgArr,
        fileIdList:fidArr
      })
      wx.hideLoading()
    }catch(err){
      wx.hideLoading()
      wx.showToast({title:"图片上传失败",icon:"none"})
      console.error("上传失败",err)
    }
  },

  // 删除图片：同时删除预览数组 + fileId数组，下标对齐
  deleteImage(e){
    const idx = Number(e.currentTarget.dataset.index)
    let imgArr = this.data.images
    let fidArr = this.data.fileIdList
    imgArr.splice(idx,1)
    fidArr.splice(idx,1)
    this.setData({
      images:imgArr,
      fileIdList:fidArr
    })
  },

  // 选择位置
  chooseLocation(){
    wx.chooseLocation({
      success:(res)=>{
        console.log("选位置成功",res)
        this.setData({location: res.name || res.address})
      },
      fail:(err)=>{
        console.error("选择位置失败",err)
        wx.showToast({title:"地点选择失败，请检查权限",icon:"none"})
      }
    })
  },

  // radio切换违规类型
  onTypeChange(e){
    this.setData({violationType:e.detail})
  },

  //补充描述
  onDescChange(e){
    this.setData({description:e.detail})
  },

  // =========对接王：AI审核单张图片========
  auditSingleImg(fileID){
    return new Promise((resolve,reject)=>{
      wx.cloud.callFunction({
        name:"aiAudit",
        data:{fileID},
        success:res=>{
          resolve(res.result.data)
        },
        fail:err=>reject(err)
      })
    })
  },

  // =========提交上报核心========
  async submitReport(){
    //表单校验
    if(this.data.images.length===0){
      return wx.showToast({title:"请上传现场照片",icon:"none"})
    }
    if(!this.data.location){
      return wx.showToast({title:"请选择违规地点",icon:"none"})
    }
    if(!this.data.violationType){
      return wx.showToast({title:"请选择违规类型",icon:"none"})
    }
    if(!this.data.userId){
      return wx.showToast({title:"正在登录，请稍后提交",icon:"none"})
    }

    this.setData({submitting:true})
    wx.showLoading({title:"AI审核图片中"})

    //循环全部图片做AI内容审核
    for(const fid of this.data.fileIdList){
      try{
        const auditRes = await this.auditSingleImg(fid)
        if(auditRes.isViolation){
          wx.hideLoading()
          this.setData({submitting:false})
          return wx.showToast({
            title:`图片违规：${auditRes.detail}`,
            icon:"none",
            duration:3000
          })
        }
      }catch(err){
        wx.hideLoading()
        this.setData({submitting:false})
        return wx.showToast({title:"AI审核异常",icon:"none"})
      }
    }

    //全部审核通过，写入reports集合
    const db = wx.cloud.database()
    try{
      await db.collection("reports").add({
        data:{
          userId: this.data.userId,
          location: this.data.location,
          violationType: this.data.violationType,
          description: this.data.description,
          imgFileIds: this.data.fileIdList,
          createTime: db.serverDate()
        }
      })
      wx.hideLoading()
      wx.showToast({title:"上报成功"})
      //提交成功清空表单
      this.setData({
        images:[],
        fileIdList:[],
        location:"",
        violationType:"",
        description:"",
        submitting:false
      })
    }catch(err){
      wx.hideLoading()
      this.setData({submitting:false})
      wx.showToast({title:"提交保存失败",icon:"none"})
      console.error("写入reports报错",err)
    }
  },

  //底部tab切换
  onChange(e) {
    const index = e.detail
    if (index === 0) {
      wx.reLaunch({ url: '/pages/home/home' })
    } else if (index === 1) {
      console.log('当前在上报页')
    } else if (index === 2) {
      wx.reLaunch({ url: '/pages/mine/mine' })
    }
  }
})