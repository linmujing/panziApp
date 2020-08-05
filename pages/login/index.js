// pages/login/index.js
const app = getApp()
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone: 0,
    userInfo: {},
    change: false,
    login_state: false,
    scene: '',
    qudao: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('login:' + options)
    const scene = decodeURIComponent(options.scene) // 介绍人电话
    const qudao = decodeURIComponent(options.qudao)
    const uid = decodeURIComponent(options.uid)

    const huaxuindent = options.huaxuindent
    this.setData({
      scene: scene,
      qudao: qudao,
      huaxuindent: huaxuindent,
      options: options,
      uid: uid
    })
    var userInfo = wx.getStorageSync('userInfo');
    if (userInfo) {
      this.setData({
        userInfo
      })
      if (!userInfo.tel) {
        this.setData({
          phone: true
        })
      } else {
        wx.switchTab({
          url: '/pages/index/index'
        })
      }
    } else {
      // this.setData({
      //   login_state: true,
      // })
    }
  },

  // 拒绝登录
  reject_login() {
    wx.switchTab({
      url: '/pages/index/index'
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var userInfo = wx.getStorageSync('userInfo');
    if (userInfo) {
      this.setData({
        userInfo
      })
      if (!userInfo.tel) {
        this.setData({
          phone: true
        })
      } else {
        wx.switchTab({
          url: '/pages/index/index'
        })
      }
    } else {

      // this.setData({
      //   login_state: true,
      // })

    }
  },
  click_userInfo: function (e) {
    var that = this;
    var codes = '';
    wx.login({
      success: res => {
        var userInfo = e.detail.userInfo;
        // console.log(userInfo)
        if (userInfo) {
          wx.showToast({
            title: '登录中……',
            // title: that.data.uid,
            icon: 'none',
            duration: 500
          })
          if (that.data.scene == 'undefined') {
            that.setData({
              scene: ''
            })
          }
          if (that.data.qudao == 'undefined') {
            that.setData({
              qudao: ''
            })
          }
          // else {
          //   that.setData({
          //     qudao: "20200512"
          //   })
          // }
          if (that.data.huaxuindent == 'undefined') {
            that.setData({
              huaxuindent: ''
            })
          }
          var reqBody = {
            code: res.code,
            userInfo: userInfo,
            encryptedData: e.detail.encryptedData,
            iv: e.detail.iv,
            channel: that.data.scene,
            qudao: that.data.qudao,
            huaxuindent: that.data.huaxuindent
          };
          util.post(util.url.login, reqBody, (res) => {
            if (res.state == 1) {
              userInfo.token = res.data.token
              userInfo.openid = res.data.openid
              userInfo.uid = res.data.uid
              userInfo.session_key = res.data.session_key
              userInfo.vip = res.data.vip
              userInfo.unionId = res.data.unionId //优惠券
              if (res.data.tel == 0 || res.data.tel == '') {
                that.setData({
                  phone: true
                })
              } else {
                userInfo.tel = res.data.tel
              }
              wx.setStorageSync('userInfo', userInfo);
              that.setData({
                login_state: false,
                userInfo: userInfo
              })

              if (!userInfo.tel) {
                that.setData({
                  phone: true
                })
              } else {
                if (that.data.qudao == "20200512") {
                  wx.navigateTo({
                    url: '/pages/login/webview?scene=' + that.data.scene + '&type=1'
                  })
                  return
                }
                if (that.data.qudao == "bbnw") {
                  wx.navigateTo({
                    url: '/pages/webH5/onlinePhoto?scene=' + that.data.scene + '&type=2' + '&uid=' + that.data.uid
                  })
                  return
                }
                if (that.data.options.back) {
                  wx.navigateBack()
                } else {
                  wx.switchTab({
                    url: '/pages/index/index'
                  })
                }
              }

            }

          })

        } else {
          wx.showModal({
            title: "为了您更好的体验,请先同意授权",
          });
        }
      }
    })
  },
  getPhoneNumber: function (e) {
    this.setData({
      phone: false
    })
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        var code = res.code
        if (e.detail.errMsg == "getPhoneNumber:ok") {
          var reqBody = {
            code: res.code,
            encryptedData: e.detail.encryptedData,
            iv: e.detail.iv,
            token: this.data.userInfo.token
          };
          util.post(util.url.settel, reqBody, (res) => {
            // console.log(res)
            if (res.state == 0 || res.state == 1) {
              this.setData({
                'userInfo.tel': res.tel
              })
              var userInfo = this.data.userInfo
              // console.log(userInfo)
              wx.setStorageSync('userInfo', userInfo);
              if (that.data.options.back) {
                wx.navigateBack()
              } else {
                wx.switchTab({
                  url: '/pages/index/index'
                })
              }
            }
          })

        } else if (e.detail.errMsg == "getPhoneNumber:fail user deny") {
          console.log('不同意')
          this.setData({
            phone: true
          })
        }
      }
    })
  },
  click_login: function () {
    this.setData({
      login_state: true,
    })
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

})