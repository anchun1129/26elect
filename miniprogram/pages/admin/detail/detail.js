// pages/admin/detail/detail.js
Page({
  data: {
    info: {},
    statusIndex: 0,
    statusList: ["待处理", "处理中", "已办结"],
    remark: "",
    uploadFileId: ""
  },


  /**
   * 加载工单详情 - 请求后端接口
   */
  onLoad(options) {
    // ----------------临时关闭权限校验，仅用来测试业务功能----------------
    const isAdmin = true


    const workId = options.id;
    if (!workId) {
      wx.showToast({ title: "工单ID缺失", icon: "none" });
      wx.navigateBack();
      return;
    }
    wx.cloud.callFunction({
      name: "getWorkOrderDetail",
      data: {
        id: workId
      },
      success: (res) => {
        if (res.result.success) {
          console.log("后端返回完整工单数据：", res.result.data)
          const data = res.result.data
          // 和后端对齐：pending=待处理，processing=处理中，processed=已办结
          const statusMap = {
            "pending": 0,
            "processing": 1,
            "processed": 2
          }


          const idx = statusMap[data.statusEng] ?? 0
          this.setData({
            info: data,
            statusIndex: idx,
            remark: data.remark || "",
            uploadFileId: data.processImageFileID || ""
          })
        } else {
          wx.showToast({ title: res.result.msg || "获取详情失败", icon: "none" })
        }
      },
      fail: () => {
        wx.showToast({ title: "云函数调用失败", icon: "none" })
      }
    })
  },


  /**
   * 确认处理工单 → status传中文：处理中
   */
  handleConfirmWork() {
    const { info, remark, uploadFileId } = this.data;
    if (!info._id) return;


    console.log("【确认处理待提交参数】", {
      id: info._id,
      status: "处理中",
      remark: remark || "已确认接收工单",
      processImageFileID: uploadFileId || ""
    })


    wx.showLoading({ title: "提交中" })
    wx.cloud.callFunction({
      name: "updateWorkOrder",
      data: {
        id: info._id,
        status: "处理中",
        remark: remark || "已确认接收工单",
        processImageFileID: uploadFileId || ""
      },
      success: (res) => {
        wx.hideLoading()
        if (res.result.success) {
          wx.showToast({ title: "操作成功" });
          setTimeout(() => {
            wx.navigateBack();
          }, 1200)
        } else {
          wx.showToast({ title: res.result.msg || "失败", icon: "none" })
        }
      },
      fail: () => {
        wx.hideLoading()
        wx.showToast({ title: "云函数调用失败", icon: "none" })
      }
    })
  },


  /**
   * 办结工单 → status传中文：已办结
   */
  handleFinishWork() {
    const { info, remark, uploadFileId } = this.data;
    if (!info._id) return;


    console.log("【办结待提交参数】", {
      id: info._id,
      status: "已办结",
      remark: remark || "工单已办结",
      processImageFileID: uploadFileId || ""
    })


    wx.showLoading({ title: "提交中" })
    wx.cloud.callFunction({
      name: "updateWorkOrder",
      data: {
        id: info._id,
        status: "已办结",
        remark: remark || "工单已办结",
        processImageFileID: uploadFileId || ""
      },
      success: (res) => {
        wx.hideLoading()
        if (res.result.success) {
          wx.showToast({ title: "办结成功" });
          setTimeout(() => {
            wx.navigateBack();
          }, 1200)
        } else {
          wx.showToast({ title: res.result.msg || "失败", icon: "none" })
        }
      },
      fail: () => {
        wx.hideLoading()
        wx.showToast({ title: "云函数调用失败", icon: "none" })
      }
    })
  },


  //图片预览
  previewImage(e) {
    const src = e.currentTarget.dataset.src;
    wx.previewImage({
      urls: [src]
    })
  },


  /**
   * 图片上传云存储
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
              uploadFileId: fileId
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


  onInputRemark(e) {
    this.setData({
      remark: e.detail.value
    })
  },


  onReady() { },
  onHide() { },
  onUnload() { },
  onPullDownRefresh() { },
  onReachBottom() { },
  onShareAppMessage() { }
})
