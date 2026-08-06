Page({
  data: {
    active: 1,
    images: [],
    location: '',
    violationType: 'illegal_parking',
    description: '',
    submitting: false
  },

  // TabBar切换
  onChange(event) {
    const index = event.detail;
    const paths = ['/pages/home/home', '/pages/report/report', '/pages/mine/mine'];
    wx.redirectTo({
      url: paths[index]
    });
  },

  // 选择图片
  chooseImage() {
    const remain = 3 - this.data.images.length;
    wx.chooseMedia({
      count: remain,
      mediaType: ['image'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        const newImages = res.tempFiles.map(f => f.tempFilePath);
        this.setData({
          images: [...this.data.images, ...newImages]
        });
      }
    });
  },

  // 删除图片
  deleteImage(e) {
    const index = e.currentTarget.dataset.index;
    const images = [...this.data.images];
    images.splice(index, 1);
    this.setData({ images });
  },

  // 选择位置
  chooseLocation() {
    wx.chooseLocation({
      success: (res) => {
        this.setData({
          location: res.address || res.name
        });
      },
      fail: () => {
        wx.showToast({
          title: '获取位置失败',
          icon: 'none'
        });
      }
    });
  },

  // 违规类型改变
  onTypeChange(event) {
    this.setData({
      violationType: event.detail
    });
  },

  // 描述改变
  onDescChange(event) {
    this.setData({
      description: event.detail
    });
  },

  // 提交上报
  submitReport() {
    // 校验
    if (this.data.images.length === 0) {
      wx.showToast({
        title: '请至少上传一张照片',
        icon: 'none'
      });
      return;
    }
    if (!this.data.location) {
      wx.showToast({
        title: '请选择违规地点',
        icon: 'none'
      });
      return;
    }

    this.setData({ submitting: true });

    // TODO: 这里后面接真实云函数提交
    setTimeout(() => {
      this.setData({ submitting: false });
      wx.showToast({
        title: '提交成功！',
        icon: 'success'
      });
      // 提交成功后清空表单
      this.setData({
        images: [],
        location: '',
        description: ''
      });
      // 2秒后跳回首页
      setTimeout(() => {
        wx.redirectTo({
          url: '/pages/home/home'
        });
      }, 1500);
    }, 1000);
  }
});