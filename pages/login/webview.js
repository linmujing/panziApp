// pages/login/webview.js
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    src: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    var userInfo = wx.getStorageSync('userInfo')
    if (options.type == 1) {
      var reBody = {
        token: userInfo.token,
        channel: options.scene,
        // qudao: ""
      };
      util.post(util.url.exchange, reBody, (res) => {
        console.log(res)
        if (res.state === 1) {}
      })
    }

    this.setData({
      src: "https://vip2.pznrfsy.com/bin/jf-exchange/index.html" + '?token=' + userInfo.token + '&scene=' + userInfo.tel,
      userInfo
    })
    if (options.scene) {
      if (!userInfo) {
        wx.navigateTo({
          url: '/pages/login/index?scene=' + options.scene + '&qudao=20200512',
        })
      }
    }

    // wx.navigateTo({
    //   url: '/pages/login/index?scene=188888888' + '&qudao=20200512',
    // })
    // wx.showLoading({
    //   title: options.scene,
    // })
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
    console.log(res)
    var userInfo = wx.getStorageSync('userInfo')
    return {
      title: '盘子女人坊官方',
      path: 'pages/login/webview?scene=' + userInfo.tel
      // path: 'pages/community/community?scene=' + userInfo.tel
    }
  }
})