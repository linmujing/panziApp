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
    login_state: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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

      this.setData({
        login_state: true,
      })

    }
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

      this.setData({
        login_state: true,
      })

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
            icon: 'none',
            duration: 500
          })
          var reqBody = {
            code: res.code,
            userInfo: userInfo,
            encryptedData: e.detail.encryptedData,
            iv: e.detail.iv
          };
          util.post(util.url.login, reqBody, (res) => {
            console.log(res)
            if (res.state == 1) {
              userInfo.token = res.data.token
              if (res.data.tel == 0 || res.data.tel == ''){
                that.setData({
                  phone: true
                })
              }else{
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
              }else{
                wx.switchTab({
                  url: '/pages/index/index'
                })
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
              wx.switchTab({
                url: '/pages/index/index'
              })
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})