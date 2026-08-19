// pages/report/report.js
Page({
  data: {
    active: 1,
    images: [],
    location: "",
    violationType: "",
    description: "",
    submitting: false,
    userId: "",
    fileIdList: []
  },

  onLoad(options) {
    // 先从缓存读取 userId
    const cachedUserId = wx.getStorageSync('userId')
    if (cachedUserId) {
      this.setData({ userId: cachedUserId })
    }
    // 再调云函数刷新
    this.doLogin()
  },

  // =========登录获取 userId=========
  doLogin() {
    wx.cloud.callFunction({
      name: "login",
      success: res => {
        console.log('doLogin返回：', res)
        const uid = res.result.userId || res.result.openid
        if (uid) {
          this.setData({ userId: uid })
          wx.setStorageSync("userId", uid)
          console.log('userId已保存：', uid)
        } else {
          console.error('未获取到uid，完整返回：', JSON.stringify(res))
        }
      },
      fail: err => {
        wx.showToast({ title: "登录失败，请重试", icon: "none" })
        console.error("login云函数错误", err)
      }
    })
  },



  // =========选择图片=========
  chooseImage() {
    const remain = 3 - this.data.images.length
    wx.chooseMedia({
      count: remain,
      mediaType: ['image'],
      sourceType: ['album', 'camera'],
      success: async (res) => {
        const tempPaths = res.tempFiles.map(f => f.tempFilePath)
        for (let tempUrl of tempPaths) {
          await this.uploadOneImage(tempUrl)
        }
      }
    })
  },

  // =========单张图片上传云存储=========
  async uploadOneImage(tempFilePath) {
    wx.showLoading({ title: "上传图片" })
    try {
      const suffix = tempFilePath.split(".").pop()
      const cloudPath = `reportImg/${Date.now()}-${Math.random().toString(16).slice(2)}.${suffix}`
      const uploadRes = await wx.cloud.uploadFile({
        cloudPath: cloudPath,
        filePath: tempFilePath
      })
      let imgArr = this.data.images
      imgArr.push(tempFilePath)
      let fidArr = this.data.fileIdList
      fidArr.push(uploadRes.fileID)

      this.setData({
        images: imgArr,
        fileIdList: fidArr
      })
      wx.hideLoading()
    } catch (err) {
      wx.hideLoading()
      wx.showToast({ title: "图片上传失败", icon: "none" })
      console.error("上传失败", err)
    }
  },

  // =========删除图片=========
  deleteImage(e) {
    const idx = Number(e.currentTarget.dataset.index)
    let imgArr = this.data.images
    let fidArr = this.data.fileIdList
    imgArr.splice(idx, 1)
    fidArr.splice(idx, 1)
    this.setData({
      images: imgArr,
      fileIdList: fidArr
    })
  },

  // =========选择位置=========
  chooseLocation() {
    wx.chooseLocation({
      success: (res) => {
        console.log("选位置成功", res)
        this.setData({ location: res.name || res.address })
      },
      fail: (err) => {
        console.error("选择位置失败", err)
        wx.showToast({ title: "地点选择失败，请检查权限", icon: "none" })
      }
    })
  },

  // =========违规类型切换=========
  onTypeChange(e) {
    this.setData({ violationType: e.detail })
  },

  // =========补充描述=========
  onDescChange(e) {
    this.setData({ description: e.detail })
  },

  // =========AI审核单张图片=========
  auditSingleImg(fileID) {
    return new Promise((resolve, reject) => {
      wx.cloud.callFunction({
        name: "aiAudit",
        data: { fileID },
        success: res => {
          resolve(res.result.data)
        },
        fail: err => reject(err)
      })
    })
  },

  // =========提交上报=========
  async submitReport() {
    // 表单校验
    if (this.data.images.length === 0) {
      return wx.showToast({ title: "请上传现场照片", icon: "none" })
    }
    if (!this.data.location) {
      return wx.showToast({ title: "请选择违规地点", icon: "none" })
    }
    if (!this.data.violationType) {
      return wx.showToast({ title: "请选择违规类型", icon: "none" })
    }
    if (!this.data.userId) {
      return wx.showToast({ title: "正在登录，请稍后提交", icon: "none" })
    }

    this.setData({ submitting: true })
    wx.showLoading({ title: "AI审核图片中" })

    // 循环全部图片做AI内容审核
    for (const fid of this.data.fileIdList) {
      try {
        const auditRes = await this.auditSingleImg(fid)
        if (auditRes.isViolation) {
          wx.hideLoading()
          this.setData({ submitting: false })
          return wx.showToast({
            title: `图片违规：${auditRes.detail}`,
            icon: "none",
            duration: 3000
          })
        }
      } catch (err) {
        wx.hideLoading()
        this.setData({ submitting: false })
        return wx.showToast({ title: "AI审核异常", icon: "none" })
      }
    }

    // 全部审核通过，写入reports集合
    const db = wx.cloud.database()
    try {
      await db.collection("reports").add({
        data: {
          userId: this.data.userId,
          location: this.data.location,
          violationType: this.data.violationType,
          description: this.data.description,
          imgFileIds: this.data.fileIdList,
          status: "pending",
          createTime: db.serverDate()
        }
      })
      wx.hideLoading()
      wx.showToast({ title: "上报成功！", icon: "success" })

      // 提交成功清空表单
      this.setData({
        images: [],
        fileIdList: [],
        location: "",
        violationType: "",
        description: "",
        submitting: false
      })

      // 2秒后跳转到"我的上报记录"
      setTimeout(() => {
        wx.navigateTo({
          url: '/pages/record/record'
        })
      }, 1500)

    } catch (err) {
      wx.hideLoading()
      this.setData({ submitting: false })
      wx.showToast({ title: "提交保存失败", icon: "none" })
      console.error("写入reports报错", err)
    }
  }
})