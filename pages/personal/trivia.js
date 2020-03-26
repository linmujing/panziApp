
var util = require('../../utils/util.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    lists: [],
    isIPX: getApp().globalData.isIPX,
    hximg: app.globalData.imgUrl + 'noHx.png',
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var userInfo = wx.getStorageSync('userInfo');
    this.setData({
      userInfo: userInfo,
      // 'userInfo.token': 'a0bf4ef38897783ed5c4c007aef07232'
    })
    this.getHuaxuList()
    this.ad(7)
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
  ad: function (num) {
    util.appointment(num, (res) => {
      this.setData({
        ad: res.data[0]
      })
    });
  },
  click_btn: function () {
    var ad = this.data.ad
    util.click_url(ad.type, ad.url)
  },
  click_detail: function (e) {
    var indent = e.currentTarget.dataset.indent
    wx.navigateTo({
      url: 'trivia_download?indent=' + indent
    })
  },
  getHuaxuList: function (e) {
    var that = this
    var reqBody = {
      token: that.data.userInfo.token
    };
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    util.post(util.url.getHuaxuList, reqBody, (res) => {
      wx.hideLoading()
      if (res.state == 1) {
        that.setData({
          lists: res.data
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
  // onShareAppMessage: function () {

  // }
})