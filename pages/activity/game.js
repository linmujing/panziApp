// pages/activity/game.js
var util = require('../../utils/util.js');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    img: {
      jfShare: app.globalData.imgUrl + 'jfShare.png',
      jfRank: app.globalData.imgUrl + 'jfRank.png',
    },
    // 提示
    notes: {
      txt: '',
      state: true
    },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var param = JSON.parse(options.param)
    wx.setNavigationBarTitle({
      title: param.title
    })
    
    this.setData({
      param: param
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
  click_notes: function () {
    var state = this.data.notes.state
    this.setData({
      'notes.state': !state
    })
  },
  click_rank: function () {
    wx.navigateTo({
      url: '/pages/activity/ranking?cid=' + this.data.param.id,
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
    var userInfo = wx.getStorageSync('userInfo');
    
    return {
      title: '游戏助力复活~',
      path: 'pages/personal/assist?id=' + this.data.param.id + '&uid=' + userInfo.uid,
      imageUrl: getApp().globalData.jfBgImg
    }
  }
})