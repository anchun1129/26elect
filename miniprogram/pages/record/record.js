Page({
  data: {
    // 初始为空，后续云函数返回结果赋值给这里
    recordList: []
  },

   // 图片放大预览
   previewImage(e) {
    const src = e.currentTarget.dataset.src
    const list = e.currentTarget.dataset.list || [src] // 如果没传list，就把当前图当成单图数组
    wx.previewImage({
      urls: list,      // 传全部图片，支持左右滑动查看
      current: src     // 当前点击的那张图作为第一张
    })
  },

  // 待对接云函数：获取我的上报记录
  // 升级版：获取我的上报记录 (融合了myOrder的格式化写法)
  async getRecordList() {
    wx.showLoading({ title: "加载中" })
    try {
      const res = await wx.cloud.callFunction({
        name: "getMyReports",
        data: {
          page: 1,
          pageSize: 20
        }
      })

      if (res.result.success) {
        const rawList = res.result.data || []

        const formattedList = rawList.map(item => {
          let tagType = 'default';
          let statusText = '';
          switch(item.status) {
            case 'pending': tagType = 'warning'; statusText = '待处理'; break;
            case 'ai_reviewed': tagType = 'primary'; statusText = '审核中'; break;
            case 'confirmed':
            case 'processed': tagType = 'success'; statusText = '已处理'; break;
            case 'rejected': tagType = 'danger'; statusText = '已驳回'; break;
            default: tagType = 'default'; statusText = '未知状态';
          }

          let formattedTime = '';
          if (item.createTime) {
            const t = new Date(item.createTime);
            const y = t.getFullYear();
            const m = (t.getMonth() + 1).toString().padStart(2, '0');
            const d = t.getDate().toString().padStart(2, '0');
            const h = t.getHours().toString().padStart(2, '0');
            const min = t.getMinutes().toString().padStart(2, '0');
            formattedTime = `${y}-${m}-${d} ${h}:${min}`;
          }

          return {
            ...item,
            tagType: tagType,
            status: statusText,
            createTime: formattedTime
          }
        })

        this.setData({
          recordList: formattedList
        })
      }
    } catch (err) {
      wx.showToast({ title: "获取记录失败", icon: "none" })
      console.error(err)
    }
    wx.hideLoading()
  },

  onLoad() {    
    this.getRecordList()
  }
})