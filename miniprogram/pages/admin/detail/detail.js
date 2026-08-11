// pages/admin/detail/detail.js
// pages/admin/detail/detail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    info: {},
    statusIndex: 0,
    statusList: ["待处理", "处理中", "已完成"]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // 接收列表页面传过来的工单id
    const workId = options.id;
    console.log("获取工单ID：", workId);

    // 获取全局工单数组
    const workList = getApp().globalData.workList;
    // 根据ID找到对应工单
    const targetWork = workList.find(item => item.id == workId);

    if (targetWork) {
      // 匹配状态下拉框下标
      let idx = this.data.statusList.indexOf(targetWork.statusName);
      this.setData({
        info: targetWork,
        statusIndex: idx >= 0 ? idx : 0
      })
    }
  },

  // 切换工单状态
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

  // 输入处置备注
  inputRemark(e) {
    let info = this.data.info;
    info.remark = e.detail.value;
    this.setData({ info })
  },

  // 保存修改，同步更新全局工单列表
  saveWorkInfo() {
    const workList = getApp().globalData.workList;
    const editData = this.data.info;
    // 找到这条工单在数组中的位置
    const findIndex = workList.findIndex(item => item.id == editData.id);
    if (findIndex !== -1) {
      // 覆盖更新全局数据
      workList[findIndex] = editData;
      getApp().globalData.workList = workList;

      wx.showToast({
        title: "修改成功"
      })
      // 延迟返回列表页
      setTimeout(() => {
        wx.navigateBack()
      }, 1200)
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
// 接收列表页面传过来的工单id
const workId = options.id;
console.log("获取工单ID：", workId);

// 模拟请求工单详情数据，后续对接数据库直接替换此处
const list = getApp().globalData.workList;
const target = list.find(item => item.id == workId);
if (target) {
  let statusName = "";
  if (target.type === 0) statusName = "待处理";
  if (target.type === 1) statusName = "处理中";
  if (target.type === 2) statusName = "已办结";

  this.setData({
    info: {
      id: target.id,
      statusName,
      time: target.time,
      desc: target.desc,
      remark: target.remark
    }
  })
}
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

  }
})