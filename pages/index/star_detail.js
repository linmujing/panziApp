// pages/index/star_detail.js
var util = require('../../utils/util.js');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ad: app.globalData.imgUrl + 'star_ad.jpg',
    logo: app.globalData.imgUrl + 'tip1.png',
    logo2: app.globalData.imgUrl + 'tip2.png',
    info: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var userInfo = wx.getStorageSync('userInfo');
    this.setData({
      userInfo: userInfo,
      type: options.type
    })
    if (!userInfo) {
      wx.navigateTo({
        url: '/pages/login/index',
      })
    }
    this.getInfo(options.id)
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
  getInfo: function (id) {
    var that = this
    var reqBody = {
      id: id,
      token: that.data.userInfo.token
    };
    wx.showLoading({
      title: '加载中',
    })
    util.post(util.url.starInfo, reqBody, (res) => {
      wx.hideLoading()
      if (res.state == 1) {
        that.setData({
          info: res.data
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