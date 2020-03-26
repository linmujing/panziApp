// pages/studio/material.js
let util = require('../../utils/util.js');
Page({
  data: {
    imgload: false,
    userinfo: '',
    scid: '',
    scimg: '',
    shanchuzt: false,
    pagezt: false,
    Loadstate: false,
    cid: '',
    getUserImg: []
  },
  onLoad: function (options) {
    var thda = this;
    wx.getStorage({
      key: 'userInfo',
      success: function (res) {
        var userinfo = res.data;
        thda.setData({
          userinfo: userinfo
        });
        thda.ewm(userinfo.openid);
        thda.cache()
      },
      fail: function () {
        wx.redirectTo({
          url: '/pages/login/index'
        })
      }
    });
    thda.setData({
      scid: options.scid,
      scimg: options.scimg,
      cid: options.cid
    })

  },
  onReady: function () {
    
  },
  ewm: function (e) {
    var thda = this;
    var reqBody = {
      openid: e
    };
    util.post(util.url.zx_ewm, reqBody, (data) => {
      if (data.state == 1002) {
        wx.setStorage({
          key: "xcx_code",
          data: data.img
        })
      } else {
        wx.setStorage({
          key: "xcx_code",
          data: false
        })
      }
    })
  },
  request: function (e, type) {
    var reqBody = {
      openid: e.openid
    };
    util.post(util.url.zx_getUserImg, reqBody, (data) => {
      var list = data.data;
      var listr = data.data;
      if (data.state == 1002) {
        for (var i = 0; i < list.length; i += 1) {
          if (type) {
            list[i].load = true
          } else {
            list[i].load = false
          }
        }
        this.setData({
          getUserImg: list
        });
        wx.setStorageSync('getUserImg', list)
      }
    })
  },
  paizhao: function (e) {
    this.setData({
      shanchuzt: false
    })
  },
  imageLoad: function (e) {
    var index = e.currentTarget.dataset.index;
    var list = this.data.getUserImg;
    list[index].load = true;
    this.setData({
      getUserImg: list
    })
  },
  imageLoadr: function (e) {
    this.setData({
      imgload: true
    })
  },
  clickimg: function (e) {
    var that = this;
    this.setData({
      Loadstate: true
    });
    var reqBody = {
      openid: this.data.userinfo.openid,
      mid: e.currentTarget.dataset.id,
      gid: this.data.scid
    };
    util.post(util.url.zx_getImg, reqBody, (res) => {
      if (res.state == 1002) {
        console.log(121212)
        wx.navigateTo({
          url: 'preview?scid=' + that.data.scid + '&cid=' + that.data.cid + '&hcid=' + res.rid + '&hcimg=' + res.image + '&pagezt=1&yhimgid=' + res.mid
        })
      } else {
        setTimeout(function () {
          if (res.ret) {
            wx.showModal({
              content: "出现错误，错误码" + res.ret,
              showCancel: false,
              confirmText: "我知道了"
            })
          } else {
            if (res.info) {
              wx.showModal({
                content: res.info,
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
          }
        }, 200)
      }
      this.setData({
        Loadstate: false
      })
    });
    setTimeout(function () {
      that.setData({
        Loadstate: false
      })
    }, 3000)
  },
  cache: function () {
    var thda = this;
    wx.getStorage({
      key: 'getUserImg',
      success: function (res) {
        for (var i = 0; i < res.data.length; i += 1) {
          res.data[i].load = true
        }
        thda.setData({
          getUserImg: res.data
        });
        thda.request(thda.data.userinfo, 1)
      },
      fail: function (res) {
        console.log('res');
        thda.request(thda.data.userinfo)
      }
    })
  },
  onShow: function () {
    if (this.data.pagezt) {
      this.request(this.data.userinfo, 1)
    }
    this.setData({
      pagezt: true
    })
  },
  xianshi: function () {
    if (this.data.shanchuzt) {
      this.setData({
        shanchuzt: false
      })
    } else {
      this.setData({
        shanchuzt: true
      })
    }
  },
  shanchu: function (e) {
    var id = e.currentTarget.dataset.id;
    var index = e.currentTarget.dataset.index;
    var list = this.data.array;
    console.log('删除');
    var reqBody = {
      openid: this.data.userinfo.openid,
      mid: id
    };
    util.post(util.url.zx_del_img, reqBody, (data) => {
      if (data.state == 1002) {
        this.request(this.data.userinfo, 1);
      }
    })
  },
  scroll: function (e) { },
  // 绑定手机号
  Obtain_tel: function (e) {
    console.log(e.detail.errMsg)
    console.log(e.detail.iv)
    console.log(e.detail.encryptedData)
    var userinfo = this.data.userinfo;
    if (e.detail.errMsg == 'getPhoneNumber:fail user deny') {
      console.log('不同意')
      wx.showModal({
        title: "为了您更好的体验,请先同意授权",
      });
    } else {
      console.log('同意')
      this.setData({
        Tel_state: true
      })
      var reqBody = {
        openid: userinfo.openid,
        session_key: userinfo.session_key,
        iv: e.detail.iv,
        encryptedData: e.detail.encryptedData
      }
      this.getPhone(reqBody);
    }
  },

});