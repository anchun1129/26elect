// pages/admin/detail/detail.js
Page({
  data: {
    info: {},
    statusIndex: 0,
    statusList: ["待处理", "处理中", "已办结"],
    showRejectPopup: false,
    rejectRemark: "",
    uploadFileId: "",   //这个就是存处置图片fileId，直接用它
    remark: ""
  },
  

  /**
   * 加载工单详情 - 请求后端接口，不再读取globalData假数据
   */
  onLoad(options) {
    const workId = options.id;
    if (!workId) {
      wx.showToast({ title: "工单ID缺失", icon: "none" });
      wx.navigateBack();
      return;
    }
    // 调用云函数 getWorkOrderDetail
    wx.cloud.callFunction({
      name:"getWorkOrderDetail",
      data:{
        id: workId
      },
      success:(res)=>{
        if(res.result.success){
          console.log("后端返回完整工单数据：", res.result.data) 
          this.setData({
            info: res.result.data
          })
        }else{
          wx.showToast({title:res.result.msg||"获取详情失败",icon:"none"})
        }
      },
      fail:()=>{
        wx.showToast({title:"云函数调用失败",icon:"none"})
      }
    })
  },


  /**
   * 确认处理工单（新增加）
   */
  /**
   * 确认处理工单（云函数）
   */
/**
 * 确认处理工单
 */
handleConfirmWork() {
  const { info, remark, uploadFileId } = this.data;
  if (!info.id) return;

  console.log("【确认处理待提交参数】",{
    id: info.id,
    status: "处理中",
    remark: remark || "已确认接收工单",
    processImageFileID: uploadFileId
  })

  // ========== 晚上后端接口好了再打开下面云函数代码，现在全部注释 ==========
  /*
  wx.cloud.callFunction({
    name:"operateWorkOrder",
    data:{
      id: info.id,
      status: 1,
      remark: remark || "已确认接收工单"
    },
    success:(res)=>{
      if(res.result.success){
        wx.showToast({ title: "操作成功" });
        setTimeout(() => {
          wx.navigateBack();
        }, 1200)
      }else{
        wx.showToast({ title: res.result.msg, icon: "none" })
      }
    },
    fail:()=>{
      wx.showToast({ title: "云函数调用失败", icon:"none" })
    }
  })
  */
},


  /**
   * 驳回工单（云函数）
   */
/**
 * 驳回工单提交
 */
handleRejectSubmit() {
  const { info, rejectRemark, uploadFileId } = this.data;
  if (!rejectRemark.trim()) {
    wx.showToast({ title: "请填写驳回理由", icon: 'none' })
    return
  }

  console.log("【驳回待提交参数】",{
    id: info.id,
    status: "已驳回",
    remark: rejectRemark,
    processImageFileID: uploadFileId
  })

  // ========== 晚上后端接口好了再打开下面云函数代码，现在全部注释 ==========
  /*
  wx.cloud.callFunction({
    name:"operateWorkOrder",
    data: {
      id: info.id,
      status: 0,
      remark: rejectRemark
    },
    success:(res)=>{
      if(res.result.success){
        this.setData({ showRejectPopup: false })
        wx.showToast({ title: "驳回成功" })
        setTimeout(()=> wx.navigateBack(),1200)
      }else{
        wx.showToast({ title: res.result.msg, icon: 'none' })
      }
    },
    fail:()=>{
      wx.showToast({ title: "云函数调用失败", icon:"none" })
    }
  })
  */
},

//图片预览
previewImage(e){
  const src = e.currentTarget.dataset.src;
  wx.previewImage({
    urls:[src]
  })
},

  /**
   * 图片上传云存储，保留
   */
  chooseAndUploadImg() {
    wx.chooseImage({
      count: 1,
      sourceType: ['album', 'camera'],
      success: (res) => {
        const tempPath = res.tempFilePaths[0]
        wx.cloud.uploadFile({
          cloudPath: 'work/' + Date.now() + '.png',
          filePath: tempPath,
          success: res => {
            const fileId = res.fileID
            this.setData({
              uploadFileId: fileId   //👉这里用你已有的变量
            })
            wx.showToast({ title: "图片上传成功" })
            console.log("处置图片fileId：", fileId)
          },
          fail: err => {
            wx.showToast({ title: "图片上传失败", icon: "none" })
          }
        })
      }
    })
  },
  

  changeStatus(e) {
    const index = e.detail.value;
    const newStatus = this.data.statusList[index];
    let info = this.data.info;
    info.statusName = newStatus;
    this.setData({
      statusIndex: index,
      info
    })
  },

// 替换原来的 inputRemark
onInputRemark(e){
  this.setData({
    remark:e.detail.value
  })
},

  //打开驳回弹窗
  handleRejectOpen(){
    this.setData({
      showRejectPopup:true,
      rejectRemark:""
    })
  },
  //关闭驳回弹窗
  handleRejectClose(){
    this.setData({
      showRejectPopup:false,
      rejectRemark:""
    })
  },
  //驳回理由输入
  onRejectInput(e){
    this.setData({
      rejectRemark:e.detail.value
    })
  },

  /**
   * 页面显示：管理员权限拦截
   */
 // onShow() {
 //  const app = getApp();
   // if (app.globalData.userInfo?.role !== 'admin') {
    //  wx.showToast({ title: "无管理员权限", icon: "none" });
     // setTimeout(() => {
       // wx.reLaunch({ url: '/pages/login/login' })
     // }, 1000)
   // }
 // },

  onReady() { },
  onHide() { },
  onUnload() { },
  onPullDownRefresh() { },
  onReachBottom() { },
  onShareAppMessage() { }
})
