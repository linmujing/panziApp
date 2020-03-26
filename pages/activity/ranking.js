// pages/activity/ranking.js
var util = require('../../utils/util.js');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    img: {
      jfr1: app.globalData.imgUrl + 'jfr1.png',
      jfr2: app.globalData.imgUrl + 'jfr2.png',
      jfr3: app.globalData.imgUrl + 'jfr3.png',
      jfr: app.globalData.imgUrl + 'jfr.jpg',
    },
    rankList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      options: options
    })
    this.getList()
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
  getList: function () {
    var that = this
    var userInfo = wx.getStorageSync('userInfo');
    var reqBody = {
      token: userInfo.token,
      cid: that.data.options.cid
    };
    wx.showLoading({
      title: '加载中',
    })
    util.post(util.url.game_ranking, reqBody, (res) => {
      wx.hideLoading()
      wx.hideNavigationBarLoading() //完成停止加载
      wx.stopPullDownRefresh() //停止下拉刷新
      if (res.state == 1) {
        that.setData({
          rankList: res.data
        })
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
    this.getList()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function () {

  // }
})