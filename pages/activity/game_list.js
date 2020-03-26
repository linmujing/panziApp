// pages/activity/game_list.js
var util = require('../../utils/util.js');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    gameList: []
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
      cid: that.data.options.id
    };
    wx.showLoading({
      title: '加载中',
    })
    util.post(util.url.game_list, reqBody, (res) => {
      wx.hideLoading()
      wx.hideNavigationBarLoading() //完成停止加载
      wx.stopPullDownRefresh() //停止下拉刷新
      if (res.state == 1) {
        that.setData({
          gameList: res.data
        })
      }
    })
  },
  click_h5: function (e) {
    var that = this
    var userInfo = wx.getStorageSync('userInfo');
    var src = e.currentTarget.dataset.url
    var id = e.currentTarget.dataset.id
    var cid = e.currentTarget.dataset.cid
    var reqBody = {
      token: userInfo.token,
      id: id,
      cid: cid,
      type: 0
    };
    wx.showLoading({
      title: '加载中',
    })
    util.post(util.url.game_count, reqBody, (res) => {
      wx.hideLoading()
      if (res.state == 1) {
        if(res.data.num > 0){
          var url = '/pages/activity/webView?src=' + src + '&token=' + userInfo.token + '&id=' + id + '&cid=' + cid
          // console.log(url)
          wx.navigateTo({
            url: url
          })
        }
      } else {
        wx.showToast({
          title: '游戏次数不够，分享给好友可获得一次游戏机会~',
          icon: 'none',
          duration: 2000
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
  onShareAppMessage: function () {
    var userInfo = wx.getStorageSync('userInfo');
    return {
      title: '游戏助力复活~',
      path: 'pages/personal/assist?id=' + this.data.options.id + '&uid=' + userInfo.uid,
      imageUrl: getApp().globalData.jfBgImg
    }
  }
})