Page({
  data: {
    images: [],
    location: '',
    violationType: 'illegal_parking',
    description: '',
    submitting: false
  },

  // 上传图片
  chooseImage() {
    wx.chooseMedia({
      count: 3,
      mediaType: ['image'],
      sourceType: ['album', 'camera'],
      success: res => {
        const tempPaths = res.tempFiles.map(item => item.tempFilePath)
        this.setData({
          images: [...this.data.images, ...tempPaths]
        })
      }
    })
  },

  // 删除单张图片
  delImage(e) {
    const idx = e.currentTarget.dataset.index
    let arr = this.data.images
    arr.splice(idx, 1)
    this.setData({ images: arr })
  },

  // 地点输入绑定
  onLocInput(e) {
    this.setData({ location: e.detail.value })
  },

  // 描述输入绑定
  onDescInput(e) {
    this.setData({ description: e.detail.value })
  },

  // 违规类型单选切换
  onTypeChange(e) {
    this.setData({
      violationType: e.detail
    })
  },

  // 提交表单存入云开发数据库
  submitReport() {
    const { images, location, description, submitting } = this.data
    // 防重复提交
    if (submitting) return
    // 表单校验
    if (!location.trim()) {
      wx.showToast({ title: '请填写违规地点', icon: 'none' })
      return
    }
    if (!description.trim()) {
      wx.showToast({ title: '请描述违规情况', icon: 'none' })
      return
    }
    if (images.length === 0) {
      wx.showToast({ title: '至少上传一张照片', icon: 'none' })
      return
    }

    this.setData({ submitting: true })
    wx.showLoading({ title: '提交中...' })

    const db = wx.cloud.database()
    db.collection('report_list').add({
      data: {
        location: location,
        description: description,
        violationType: this.data.violationType,
        imgList: images,
        createTime: new Date(),
        status: 'pending'
      }
    }).then(res => {
      wx.hideLoading()
      wx.showToast({ title: '上报成功' })
      // 清空表单
      this.setData({
        images: [],
        location: '',
        description: '',
        submitting: false
      })
      // 提交后自动切回首页tab
      setTimeout(() => {
        wx.switchTab({ url: '/pages/home/home' })
      }, 1200)
    }).catch(err => {
      wx.hideLoading()
      wx.showToast({ title: '提交失败', icon: 'none' })
      this.setData({ submitting: false })
      console.error('提交报错', err)
    })
  }
})