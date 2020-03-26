// pages/community/task.js
var util = require('../../utils/util.js');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    msgData: [],
    banner: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var userInfo = wx.getStorageSync('userInfo');
    this.setData({
      userInfo,
    })
    if (!userInfo) {
      wx.navigateTo({
        url: '/pages/login/index',
      })
    }
    this.getTask()
    this.getBanner()
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
  getTask: function(){
    var userInfo = this.data.userInfo;
    var reBody = {
      token: userInfo.token,
    };
    util.post(util.url.dailytasks, reBody, (res) => {
      if (res.state == 1) {
        this.setData({
          msgData: res.data
        })
      }
    })
  },
  getBanner: function () {
    var that = this
    var reqBody = {
      token: that.data.userInfo.token,
      seat: 6
    };
    util.post(util.url.ad, reqBody, (res) => {
      if (res.state == 1) {
        this.setData({
          banner: res.data
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
 
})