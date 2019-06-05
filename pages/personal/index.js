// pages/personal/index.js
var util = require('../../utils/util.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var userInfo = wx.getStorageSync('userInfo');
    this.setData({
      userInfo: userInfo
    })
    if (!userInfo) {
      wx.navigateTo({
        url: '/pages/login/index',
      })
    }
    this.getJifen()
  },
  getJifen: function () {
    var userInfo = this.data.userInfo
    var reqBody = {
      token: userInfo.token
    };
    wx.showLoading({
      title: '加载中',
    })
    util.post(util.url.getJifen, reqBody, (res) => {
      if (res.state == 1) {
        this.setData({
          'userInfo.integral': res.data.integral,
          'userInfo.grade': res.data.grade
        })
        wx.setStorageSync('userInfo.integral', res.data.integral);
        wx.setStorageSync('userInfo.grade', res.data.grade);
      }
      wx.hideLoading()
    })
  },
  // 跳转所有订单
  link_allOrder(e) {
    var type = e.currentTarget.dataset.type
    console.log(type)
    wx.navigateTo({
      url: './my_order?type=' + type
    })
  },
  link_orderComment() {
    wx.navigateTo({
      url: './order_comment'
    })
  },
  // 跳转设置
  link_setting() {
    wx.navigateTo({
      url: './zh_setting'
    })
  },
  // 跳转我发布的
  link_release() {
    wx.navigateTo({
      url: './my_fabu'
    })
  },
  // 
  link_rank() {
    wx.navigateTo({
      url: './ranking'
    })
  },
  // 跳转任务中心
  link_task() {
    wx.navigateTo({
      url: 'task_center'
    })
  },
  to_QRcode: function () {
    wx.navigateTo({
      url: 'my_QRcode'
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
  onShareAppMessage: function () {

  }
})