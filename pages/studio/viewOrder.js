// pages/studio/viewOrder.js
Page({
  data: {
    page_jz: false,
    userinfo: '',
    resimg: '',
    shareData: {
      title: '快来看我的变装',
      desc: '自定义分享描述',
      path: '/pages/studio/share'
    },
    down_state: true,
  },
  onLoad: function (options) {
    var thda = this;
    var shareData = this.data.shareData;
    shareData.path = '/pages/studio/share?hcimg=' + options.resimg;
    shareData.title = '快来看我的变装 - ' + wx.getStorageSync('title');
    this.setData({
      shareData
    });
    wx.getStorage({
      key: 'userInfo',
      success: function (res) {
        var userinfo = res.data;
        thda.setData({
          resimg: options.resimg,
          userinfo
        })
      },
      fail: function () {
        wx.redirectTo({
          url: '/pages/login/index'
        })
      }
    })
  },
  canvas: function () {
    var thda = this;
    wx.authorize({
      scope: 'scope.writePhotosAlbum',
      success() {
        thda.setData({
          page_jz: true
        })
        wx.setKeepScreenOn({
          keepScreenOn: true
        })
        wx.showLoading({
          title: '图片保存中……',
          mask: true
        })

        let promise1 = new Promise(function (resolve, reject) {
          var value = wx.getStorageSync('xcx_code');
          wx.getImageInfo({
            src: value,
            success: function (res) {
              resolve(res)
            }
          })
        });
        let promise2 = new Promise(function (resolve, reject) {
          wx.getImageInfo({
            src: thda.data.resimg,
            success: function (res) {
              resolve(res)
            }
          })
        });
        Promise.all([promise1, promise2]).then(res => {
          var title = wx.getStorageSync('title');
          const ctx = wx.createCanvasContext('shareImg');
          ctx.drawImage(res[1].path, 0, 0, 1080, 1612);
          ctx.drawImage(res[0].path, 0, 1612, 1080, 150);
          ctx.setTextAlign('left');
          ctx.setFillStyle('#333');
          ctx.setFontSize(48);
          ctx.fillText(title, 361, 1700);
          ctx.stroke();
          ctx.draw();
          setTimeout(function () {
            thda.clikimg()
          }, 200)
        })
      },
      fail: function () {
        wx.showToast({
          title: '下载失败',
          icon: 'none'
        })
        wx.getSetting({
          success(res) {
            console.log(res)
            if (!res.authSetting['scope.writePhotosAlbum']) {
              thda.setData({
                down_state: false
              })
            }
          }
        })
      }
    })
    
  },
  clikimg: function () {
    var that = this;
    wx.canvasToTempFilePath({
      x: 0,
      y: 0,
      width: 1080,
      height: 1762,
      destWidth: 1080,
      destHeight: 1762,
      canvasId: 'shareImg',
      success: function (res) {
        that.setData({
          hcimg: res.tempFilePath,
          prurl: res.tempFilePath,
          hidden: false
        });
        that.preservation(res.tempFilePath)
      },
      fail: function (res) {
        console.log(res)
      }
    })
  },
  imageLoad: function () {
    this.setData({
      load: true
    })
  },
  onReady: function () { },
  preservation: function (prurl) {
    var thda = this;
    if (prurl) {
      wx.saveImageToPhotosAlbum({
        filePath: prurl,
        success(res) {
          wx.showToast({
            title: "保存成功",
            duration: 1000
          })
        },
        fail(res) {
          wx.showToast({
            title: "保存失败",
            image: '/image/cancel.png',
            duration: 1000
          })
        },
        complete(res) {
          setTimeout(function () {
            thda.setData({
              page_jz: false
            })
          }, 1000);
        }
      })
    }
  },
  // 授权设置
  set_callback: function (e) {
    console.log(e)
    var that = this
    var data = e.detail.authSetting
    if (!data['scope.writePhotosAlbum']) {
      that.setData({
        down_state: false
      })
    } else {
      wx.showToast({
        title: '授权成功！',
        duration: 1000
      })
      that.setData({
        down_state: true
      })
    }
  },
  onShareAppMessage: function () {
    return this.data.shareData
  }
});