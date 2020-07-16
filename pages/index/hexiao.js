// pages/index/hexiao.js
var util = require('../../utils/util.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    login: false,
    account: "",
    password: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    var userInfo = wx.getStorageSync('userInfo');
    that.setData({
      userInfo: userInfo
    })
  },

  // 商户登录
  login() {
    var that = this
    var account = that.data.account
    var password = that.data.password
    var userInfo = that.data.userInfo
    if (!account) {
      wx.showToast({
        title: '请输入您的账户名',
        icon: 'none',
        duration: 1000
      })
      return false
    }
    if (!password) {
      wx.showToast({
        title: '请输入密码',
        icon: 'none',
        duration: 1000
      })
      return false
    }
    var reqBody = {
      token: userInfo.token,
      account,
      password
    };
    util.post(util.url.shopLogin, reqBody, (res) => {
      console.log(res)
      if (res.state === 1) {
        wx.navigateTo({
          url: '/pages/index/hexiao_details?status=1' + '&id=' + res.data.commodity_id,
        })
      } else {
        wx.showToast({
          title: res.info,
          icon: 'none',
          duration: 1000
        })
      }
    })
  },

  // 账户名
  blur_account: function (e) {
    this.setData({
      'account': e.detail.value
    })
  },

  // 密码
  blur_password: function (e) {
    this.setData({
      'password': e.detail.value
    })
  },

  link_details(e) {
    const status = e.currentTarget.dataset.status
    if (status == 1) {
      this.setData({
        login: true
      })
    } else {
      wx.navigateTo({
        url: '/pages/index/hexiao_details?status=' + status,
      })
    }
  },

  close() {
    this.setData({
      login: false
    })
  },

  // is_client() {
  //   var that = this
  //   var reqBody = {
  //     token: that.data.userInfo.token,
  //   };
  //   util.post(util.url.verification, reqBody, (res) => {
  //     console.log(res)
  //   })
  // },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // this.is_client()
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