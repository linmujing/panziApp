// pages/webH5/onlinePhoto.js
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
    console.log(options)
    var userInfo = wx.getStorageSync('userInfo')

    if (options.uid) {
      this.setData({
        src: "https://vip2.pznrfsy.com/bin/changeQueen/index.html" + '?token=' + userInfo.token + '&scene=' + userInfo.tel + '&uid=' + options.uid,
        userInfo
      })
    } else {
      this.setData({
        src: "https://vip2.pznrfsy.com/bin/changeQueen/index.html" + '?token=' + userInfo.token + '&scene=' + userInfo.tel + '&uid=' + userInfo.uid,
        userInfo
      })
    }


    // if (options.uid) {
    //   this.setData({
    //     src: "https://vip2.pznrfsy.com/bin/onlinePhoto/index.html" + '?token=' + userInfo.token + '&scene=' + userInfo.tel + '&uid=' + options.uid,
    //     userInfo
    //   })
    // } else {
    //   this.setData({
    //     src: "https://vip2.pznrfsy.com/bin/onlinePhoto/index.html" + '?token=' + userInfo.token + '&scene=' + userInfo.tel + '&uid=' + userInfo.uid,
    //     userInfo
    //   })
    // }


    // this.setData({
    //   src: "https://vip2.pznrfsy.com/bin/onlinePhoto/index.html" + '?token=' + userInfo.token + '&scene=' + userInfo.tel + '&uid=' + userInfo.uid,
    //   userInfo
    // })

    if (options.type == 2) {
      var reBody = {
        token: userInfo.token,
        helpid: options.uid,
        qudao: "bbnw"
      };
      util.post(util.url.camera, reBody, (res) => {
        console.log(res)
        if (res.state === 1) {}
      })
    }

    if (!userInfo) {
      wx.navigateTo({
        url: '/pages/login/index?scene=' + options.scene + '&qudao=bbnw' + '&uid=' + options.uid,
      })
    }


    // if (options.scene) {
    // }
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
  onShareAppMessage: function () {
    var userInfo = wx.getStorageSync('userInfo')
    console.log(userInfo)
    return {
      title: '盘子女人坊官方',
      path: 'pages/webH5/onlinePhoto?uid=' + userInfo.uid + '&scene=' + userInfo.tel + '&qudao=bbnw'

    }
  }
})