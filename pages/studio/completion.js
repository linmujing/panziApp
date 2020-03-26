// pages/studio/completion.js
var util = require('../../utils/util.js');
Page({
  data: {
    Obtaintel_state: false, //判断是否有手机
    page_jz: false,
    text: '',
    oid: '',
    hcdata: '',
    hcimg: '',
    userinfo: '',
    imgUrls: "",
    swindex: 0,
    tjlist: [],
    url: '',
    shareData: {
      title: '',
      desc: '',
      path: '/pages/studio/share'
    },
    down_state: true,
  },
  onLoad: function (options) {
    var shareData = this.data.shareData;
    shareData.path = '/pages/studio/share?hcimg=' + options.hcimg;
    shareData.title = '快来看我的变装 - ' + wx.getStorageSync('title');
    this.setData({
      shareData
    });
    if (options.type === 0) {
      var text = '购买成功'
    } else {
      var text = '生成成功'
    }
    this.setData({
      oid: options.oid,
      hcimg: options.hcimg,
      text
    });
    var thda = this;
    wx.getStorage({
      key: 'userInfo',
      success: function (res) {
        var userinfo = res.data;
        thda.setData({
          userinfo
        });
        if (userinfo.tel) {
          thda.setData({
            Obtaintel_state: true
          })
        } else {
          thda.setData({
            Obtaintel_state: false
          })
        }
        thda.getKimg()
      },
      fail: function () {
        wx.redirectTo({
          url: '/pages/login/index'
        })
      }
    });
    wx.getStorage({
      key: 'hcdata',
      success: function (res) {
        var hcdata = res.data;
        thda.setData({
          hcdata
        })
      }
    })
  },
  Obtain_tel: function (e) {
    var url = e.currentTarget.dataset.url;
    getApp().globalData.webView = url
    var userinfo = this.data.userinfo;
    //console.log(e.detail.errMsg)
    //console.log(e.detail.iv)
    //console.log(e.detail.encryptedData)
    if (e.detail.errMsg == 'getPhoneNumber:fail user deny') {
      console.log('不同意')
    } else {
      console.log('同意')
      var reqBody = {
        openid: userinfo.openid,
        session_key: userinfo.session_key,
        iv: e.detail.iv,
        encryptedData: e.detail.encryptedData
      }
      this.getPhone(reqBody);
      this.setData({
        Obtaintel_state: true
      })
    }
    wx.navigateTo({
      url: '/pages/index/webView'
    })

  },
  getPhone: function (e) {
    var userinfo = this.data.userinfo;
    var that = this;
    var reqBody = e;
    util.post(util.url.getPhone, reqBody, (data) => {
      if (data.state == 1002) {
        userinfo.tel = data.phone;
        wx.setStorage({
          key: "userInfo",
          data: userinfo
        });
      }
    })
  },
  webviews: function (e) {
    var url = e.currentTarget.dataset.url;
    getApp().globalData.webView = url
    console.log(url)
    wx.navigateTo({
      url: '/pages/index/webView'
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
          console.log(value)
          wx.getImageInfo({
            src: value,
            success: function (res) {
              resolve(res)
            }
          })
        });
        let promise2 = new Promise(function (resolve, reject) {
          console.log(thda.data.hcimg)
          wx.getImageInfo({
            src: thda.data.hcimg,
            success: function (res) {
              resolve(res)
            }
          })
        });
        Promise.all([promise1, promise2]).then(res => {
          var title = wx.getStorageSync('title');
          console.log(res);
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
          hcimgr: res.tempFilePath,
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
  onSlideChangeEnd: function (e) {
    var swindex = e.detail.current;
    var that = this;
    that.setData({
      swindex
    })
  },
  preservation: function () {
    var thda = this;
    
    if (thda.data.prurl) {
      wx.saveImageToPhotosAlbum({
        filePath: thda.data.prurl,
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
  getKimg: function () {
    var thda = this;
    var reqBody = {
      openid: this.data.userinfo.openid,
      oid: this.data.oid
    };
    util.post(util.url.getKimg, reqBody, (data) => {
      if (data.state == 1002) {
        var tjlist = data.list;
        var imgUrls = data.himg;
        var url = data.url;
        var lurl = data.lurl;
        thda.setData({
          imgUrls,
          tjlist,
          url,
          lurl
        })
      }
    })
  },
  // 授权设置
  set_callback: function (e) {
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