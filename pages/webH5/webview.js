// pages/webH5/webview.js
var util = require('../../utils/util.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isIPX: getApp().globalData.isIPX,
    src: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var userInfo = wx.getStorageSync('userInfo')
    // var o_uid = null
    if (options.uid) {
      // o_uid = options.uid
      this.setData({
        src: "https://vip2.pznrfsy.com/bin/puzzle/index.html" + '?token=' + userInfo.token + '&uid=' + options.uid,
        userInfo
      })
    } else {
      this.setData({
        src: "https://vip2.pznrfsy.com/bin/puzzle/index.html" + '?token=' + userInfo.token + '&uid=' + userInfo.uid,
        userInfo
      })
      // o_uid = userInfo.uid
    }

    // this.setData({
    //   // src: "https://vip2.pznrfsy.com/bin/puzzle/index.html" + '?token=' + userInfo.token + '&uid=' + options.uid,
    //   src: "https://vip2.pznrfsy.com/bin/puzzle/index.html" + '?token=' + userInfo.token + '&uid=' + o_uid,
    //   userInfo
    // })

    if (!userInfo) {
      wx.navigateTo({
        url: '/pages/login/index',
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
  onShareAppMessage: function (res) {
    var userInfo = wx.getStorageSync('userInfo')
    return {
      title: '盘子女人坊官方',
      path: 'pages/webH5/webview?uid=' + userInfo.uid
      // path: 'pages/community/community?scene=' + userInfo.tel
    }
  }
})