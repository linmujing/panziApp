// pages/studio/add_photo.js
let util = require('../../utils/util.js');
Page({
  data: {
    imgload: false,
    Loadstate: false,
    scid: '',
    cid: '',
    userinfo: '',
    img: '',
    text: '测试'
  },
  onLoad: function (options) {
    var thda = this;
    thda.setData({
      scid: options.scid,
      cid: options.cid
    });
    wx.getStorage({
      key: 'userInfo',
      success: function (res) {
        var userinfo = res.data;
        thda.plate(userinfo);
        thda.setData({
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
  imageLoad: function (e) {
    this.setData({
      imgload: true
    })
  },
  plate: function (e) {
    var reqBody = {
      openid: e.openid
    };
    util.post(util.url.plate, reqBody, (data) => {
      if (data.state == 1002) {
        this.setData({
          img: data.img
        })
      }
    })
  },
  chooseImage: function (e) {
    var that = this;
    var e = e.currentTarget.dataset.lx;
    if (e == 1) {
      var Type = ['album']
    } else {
      var Type = ['camera']
    }
    wx.chooseImage({
      sourceType: Type,
      sizeType: ['compressed'],
      count: 1,
      success: function (res) {
        that.setData({
          Loadstate: true
        });
        var tempFilePath = res;
        var tempFilePaths = res.tempFilePaths;
        that.setData({
          img: tempFilePaths[0]
        });
        wx.getSystemInfo({
          success: function (res) {
            wx.getSystemInfo({
              success: function (res) {
                if (res.platform == "devtools") {
                  that.userUpload(tempFilePath, 0)
                } else if (res.platform == "ios") {
                  that.userUpload(tempFilePath, 0)
                } else if (res.platform == "android") {
                  that.userUpload(tempFilePath, 0)
                }
              }
            })
          }
        })
      },
      fail: function (res) {
        that.setData({
          Loadstate: false
        })
      }
    })
  },
  compress: function (photo) {
    var _this = this;
    wx.getImageInfo({
      src: photo.tempFilePaths[0],
      success: function (res) {
        var ctx = wx.createCanvasContext('photo_canvas');
        var ratio = 10;
        var canvasWidth = res.width;
        var canvasHeight = res.height;
        _this.setData({
          aaa: photo.tempFilePaths[0],
          canvasWidth2: res.width,
          canvasHeight2: res.height
        });
        while (canvasWidth > 1500 || canvasHeight > 1500) {
          canvasWidth = Math.trunc(res.width / ratio);
          canvasHeight = Math.trunc(res.height / ratio);
          ratio += 1
        }
        _this.setData({
          canvasWidth: canvasWidth,
          canvasHeight: canvasHeight
        });
        ctx.drawImage(photo.tempFilePaths[0], 0, 0, canvasWidth, canvasHeight);
        ctx.draw();
        setTimeout(function () {
          wx.canvasToTempFilePath({
            canvasId: 'photo_canvas',
            success: function (res) {
              photo.tempFilePaths[0] = res.tempFilePath;
              photo.tempFiles[0].path = res.tempFilePath;
              _this.userUpload(photo, 1)
            },
            fail: function (error) { }
          })
        }, 100)
      },
      fail: function (error) { }
    })
  },
  userUpload: function (res, tye) {
    var that = this;
    if (tye == 1) {
      var tempFilePath = res.tempFilePaths[0]
    } else {
      var tempFilePath = res.tempFilePaths[0]
    }
    wx.uploadFile({
      url: util.url.userUpload,
      filePath: tempFilePath,
      name: 'file',
      formData: {
        'openid': this.data.userinfo.openid,
        'gid': this.data.scid
      },
      success: function (res) {
        var data = res.data;
        var data = JSON.parse(res.data);
        console.log(data)
        if (data.state == 1002) {
          wx.navigateTo({
            url: 'preview?scid=' + that.data.scid + '&cid=' + that.data.cid + '&hcid=' + data.rid + '&hcimg=' + data.image + '&pagezt=1&yhimgid=' + data.mid
          })
        } else {
          setTimeout(function () {
            if (data.ret == 1000) {
              wx.showModal({
                content: "选择的照片不是正面照，为了 达到更好的写真效果，请上传正脸自拍",
                showCancel: false,
                confirmText: "我知道了"
              })
            } else if (data.ret) {
              wx.showModal({
                content: "出现错误，错误码" + data.ret,
                showCancel: false,
                confirmText: "我知道了"
              })
            } else if (data.info) {
              wx.showModal({
                content: data.info,
                showCancel: false,
                confirmText: "我知道了"
              })
            } else {
              wx.showModal({
                content: '请求失败,请重试',
                showCancel: false,
                confirmText: "我知道了"
              })
            }
          }, 200)
        }
      },
      complete: function (res) {
        that.setData({
          Loadstate: false
        })
      }
    })
  }
});