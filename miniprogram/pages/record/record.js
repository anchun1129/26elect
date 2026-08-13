Page({
  data: {
    // 初始为空，后续云函数返回结果赋值给这里
    recordList: []
  },

  // 图片放大预览
  previewImage(e) {
    const src = e.currentTarget.dataset.src
    wx.previewImage({
      urls: [src]
    })
  },

  // 待对接云函数：获取我的上报记录
  async getRecordList() {
    wx.showLoading({ title: "加载中" })
    try {
      const res = await wx.cloud.callFunction({
        name: "getMyReports" 
      })

      if (res.result.success) {
        // 遍历数据，把英文状态变成好看的颜色和中文
        const formattedList = res.result.data.map(item => {
          let tagType = 'default';
          let statusText = '';

          // 根据不同的 status 翻译成 Vant 的 tag 颜色类型和中文字
          switch(item.status) {
            case 'pending':
              tagType = 'warning';
              statusText = '待处理';
              break;
            case 'ai_reviewed':
              tagType = 'primary';
              statusText = '审核中';
              break;
            case 'confirmed':
            case 'processed':
              tagType = 'success';
              statusText = '已处理';
              break;
            case 'rejected':
              tagType = 'danger';
              statusText = '已驳回';
              break;
            default:
              tagType = 'default';
              statusText = '未知状态';
          }

          return {
            ...item,
            tagType: tagType,
            status: statusText,
            // 为了页面不显太空，我们临时加这两个假字段
            type: '电动车违停',
            address: '测试小区 1 号楼'
          }
        })

        this.setData({
          recordList: formattedList
        })
      }
    } catch (err) {
      console.error("请求失败：", err)
    }
    wx.hideLoading()
  },

  onLoad() {    
    this.getRecordList()
  }
})