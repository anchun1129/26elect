Page({
  data: {
    id: null,
    info: {},
    showDealPopup: false,
    showRejectPopup: false,
    dealRemark: "",
    rejectRemark: "",
    timerId: null
  },
  onUnload(){
    if(this.data.timerId !== null){
      clearTimeout(this.data.timerId)
    }
  },


  onLoad(options) {
    console.log("onLoad拿到options", options)
    const id = Number(options.id)
    const allOrder = [
      {
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
    ]
    const currOrder = allOrder.find(item => item.id === id)
    if(currOrder){
      this.setData({
        info: currOrder
      })
    }
  },
  

  openDealPopup() {
    this.setData({ showDealPopup: true, dealRemark:"" })
  },
  closeDealPopup() {
    this.setData({ showDealPopup: false })
  },
  onDealInput(e){
    this.setData({dealRemark:e.detail.value})
  },
  submitDeal(){
    console.log("处理备注：", this.data.dealRemark)
    wx.showToast({title:"处理成功"})
    const timerId = setTimeout(()=>{
      wx.navigateBack()
    },1000)
    this.setData({ timerId })
  },
  
  submitReject(){
    console.log("驳回原因：", this.data.rejectRemark)
    wx.showToast({title:"已驳回"})
    const timerId = setTimeout(()=>{
      wx.navigateBack()
    },1000)
    this.setData({ timerId })
  },
  

  openRejectPopup() {
    this.setData({ showRejectPopup: true, rejectRemark:"" })
  },
  closeRejectPopup() {
    this.setData({ showRejectPopup: false })
  },
  onRejectInput(e){
    this.setData({rejectRemark:e.detail.value})
  }
})