// pages/admin/admin.js
Page({

  /**
   * 页面的初始数据
   */
    data: {
      loading: false,
      // 默认选中第一个tab：待处理
      activeTab: 0,
      // 三条测试工单数据
      orderList: [  {
        id: 1,
        type: 0,
        title: '待处理',
        status: '待审核',
        tagColor: 'warning',
        desc: '多辆电动车占用消防通道违规停放，堵塞出入口',
        time: '2026-08-07 09:20'
      },
      {
        id: 2,
        type: 1,
        title: '处理中',
        status: '处理中',
        tagColor: 'primary',
        desc: '业主将电动车推进楼道内停放充电',
        time: '2026-08-07 14:15'
      },
      {
        id: 3,
        type: 2,
        title: '已办结',
        status: '已办结',
        tagColor: 'success',
        desc: '电动车乱停占用人行通道',
        time: '2026-08-06 18:40'
      }
      
      ],
      showHandlePopup: false,
      showRejectPopup: false,
      currentReportId: "",
      remark: "",
      uploadImgList: []
    },
  
    // Tab点击切换方法
    changeTab(e) {
      const idx = e.currentTarget.dataset.index
      console.log('当前选中tab下标：', idx)
      this.setData({
        activeTab: idx
      })
    },
  
    // 下拉刷新逻辑
    onPullDownRefresh() {
      console.log('触发下拉刷新')
      // 模拟加载1秒结束刷新
      setTimeout(() => {
        wx.stopPullDownRefresh()
      }, 1000)
    },
  

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log('页面加载了');
    // 把工单列表存入全局，给详情页面读取
    getApp().globalData.workList = this.data.orderList
  },
  

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  },

  // 点击卡片跳转详情
goDetail(e) {
  const reportId = e.currentTarget.dataset.id
  wx.navigateTo({
    url: `/pages/admin/detail/detail?id=${reportId}`
  })
},

// 打开处理弹窗
openHandlePopup(e){
  this.setData({
    showHandlePopup:true,
    currentReportId:e.currentTarget.dataset.id,
    remark:""
  })
},
closeHandlePopup(){
  this.setData({showHandlePopup:false})
},

// 打开驳回弹窗
openRejectPopup(e){
  this.setData({
    showRejectPopup:true,
    currentReportId:e.currentTarget.dataset.id,
    remark:""
  })
},
closeRejectPopup(){
  this.setData({showRejectPopup:false})
},

// 监听备注输入
onRemarkChange(e){
  this.setData({
    remark:e.detail
  })
},

submitHandle(){
  wx.showToast({title:"静态页面，待对接接口"})
  this.closeHandlePopup()
},
submitReject(){
  wx.showToast({title:"静态页面，待对接接口"})
  this.closeRejectPopup()
}

})