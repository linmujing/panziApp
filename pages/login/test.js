// pages/login/test.js
// pages/recognition/recognition.js
Page({
  data: {
    height: '360',
    status: false,
    scanStatus: 'none',
    msg: "请点击识别图片"
  },

  onLoad: function (options) {
    this.ctx = wx.createCameraContext();

    wx.getSystemInfo({
      success: res => {
        this.setData({ height: res.windowHeight * 0.8 });
      }
    });
  },

  stopScan: function () {
    this.setData({ scanStatus: 'none' });
  },

  onShow: function () {
    this.setData({ msg: '请点击识别图片' });
  },

  error: function (e) {
    this.setData({ msg: '打开摄像头失败，请点击“立即体验' });
  },

  searchPhoto: function (filePath) {
    console.log(filePath);
    var userInfo = wx.getStorageSync('userInfo');
    wx.uploadFile({
      url: 'https://vip2.pznrfsy.com/index/h5/ar?token=' + userInfo.token,
      filePath,
      name: 'image',
      success: res => {
        console.log(res)
        this.status = false;

        let msg = JSON.parse(res.data);
        console.log(msg)

        if (msg.state != 1) {
          this.setData({ msg: '未识别到目标，请点击屏幕继续识别' });
        } else {
          this.setData({ msg: '识别成功' });
          setTimeout(() => {
            console.info('go to webar');
            if (msg.data.type == 1) {
              wx.navigateTo({
                url: '/pages/login/video_test?tel=' + msg.data.tel+'&order=' + msg.data.order
              })
            } else if (msg.data.type == 2) {
              wx.navigateTo({
                url: '/pages/login/photo_test?tel=' + msg.data.tel +'&order=' + msg.data.order
              })
            }
          }, 500);
        }
      },
      fail: err => {
        this.status = false;
        this.setData({ msg: JSON.stringify(err) });
      }
    });
  },

  takePhoto: function (e) {
    console.log(111);
    if (this.status) return;

    this.status = true;

    this.ctx.takePhoto({
      quality: 'normal',
      success: res => {
        this.setData({ msg: '识别中...' });
        this.searchPhoto(res.tempImagePath)
      },
      fail: err => {
        this.stopScan();
        this.setData({ msg: '未识别到目标' });
      }
    });
  }
})