// pages/admin/admin.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loading: false,
    // 默认选中第一个tab：待处理
    activeTab: 0,
    workList: [],

    showHandlePopup: false,
    showRejectPopup: false,
    currentReportId: "",
    remark: "",
    uploadImgList: []
  },

  // Tab点击切换方法
  changeTab(e) {
    const idx = Number(e.currentTarget.dataset.index)
    console.log('当前选中tab下标：', idx)
    this.setData({
      activeTab: idx
    })
    // tab切换，调用云函数获取对应状态列表
    this.getList(idx)
  },

  // 调用云函数获取工单列表 status:0待处理 1处理中 2已办结
 // 调用云函数获取工单列表 status:0待处理 1处理中 2已办结
// 调用云函数获取工单列表 status:0待处理 1处理中 2已办结
async getList(status) {
  this.setData({ loading: true })
  const res = await wx.cloud.callFunction({
    name: "getWorkOrderList",
    data: { status: status }
  })
  this.setData({ loading: false })
  if (res.result.success) {
    this.setData({
      workList: res.result.data
    })
  } else {
    wx.showToast({
      title: res.result.msg || "获取列表失败",
      icon: "none"
    })
  }
  
},



  // 下拉刷新逻辑
  onPullDownRefresh() {
    console.log('触发下拉刷新')
    // 刷新当前tab的数据
    this.getList(this.data.activeTab)
    setTimeout(() => {
      wx.stopPullDownRefresh()
    }, 800)
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log('页面加载了');
    // 页面加载，默认加载待处理 status=0
    this.getList(0)
  },

  // 点击卡片跳转详情
  goDetail(e){
    console.log("点击卡片拿到的id：", e.currentTarget.dataset.id)
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url:'/pages/admin/detail/detail?id=' + id
    })
  },
  

  // 打开处理弹窗
  openHandlePopup(e) {
    this.setData({
      showHandlePopup: true,
      currentReportId: e.currentTarget.dataset.id,
      remark: ""
    })
  },

  closeHandlePopup() {
    this.setData({ showHandlePopup: false })
  },

  // 打开驳回弹窗
  openRejectPopup(e) {
    this.setData({
      showRejectPopup: true,
      currentReportId: e.currentTarget.dataset.id,
      remark: ""
    })
  },

  closeRejectPopup() {
    this.setData({ showRejectPopup: false })
  },

  // 监听备注输入
  onRemarkChange(e) {
    this.setData({
      remark: e.detail
    })
  },

  submitHandle() {
    wx.showToast({ title: "请到详情页执行处理操作", icon: "none" })
    this.closeHandlePopup()
  },

  submitReject() {
    wx.showToast({ title: "请到详情页执行处理操作", icon: "none" })
    this.closeRejectPopup()
  }
})
