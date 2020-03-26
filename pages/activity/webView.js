// pages/index/webView.js
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
    var src = options.src + '?token=' + options.token + '&id=' + options.id + '&cid=' + options.cid
    // console.log(src)
    this.setData({
      src: src
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
  onShareAppMessage: function () {
    var userInfo = wx.getStorageSync('userInfo');
    return {
      title: '游戏助力复活~',
      path: 'pages/personal/assist?id=' + this.data.param.id + '&uid=' + userInfo.uid,
      imageUrl: getApp().globalData.jfBgImg
    }
  }
})