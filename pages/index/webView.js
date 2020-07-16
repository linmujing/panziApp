// pages/index/webView.js
var util = require('../../utils/util.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isIPX: getApp().globalData.isIPX,
    src: getApp().globalData.webView,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var userInfo = wx.getStorageSync('userInfo')
    this.setData({
      src: getApp().globalData.webView + '?token=' + userInfo.token
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


  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    var userInfo = wx.getStorageSync('userInfo');

    return {
      title: '盘子女人坊官方',
      path: 'pages/index/webView?uid=' + userInfo.uid,
      imageUrl: getApp().globalData.jfBgImg
    }

    // var userInfo = this.data.userInfo
    // return {
    //   title: '盘子女人坊官方',
    //   // path: 'pages/index/webView?tel=' + userInfo.tel
    //   path: 'pages/community/community?scene=' + userInfo.tel
    // }
  }
})