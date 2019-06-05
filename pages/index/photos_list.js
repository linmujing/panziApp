// pages/index/photos_list.js
var util = require('../../utils/util.js');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: []
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
    var reqBody = {
      token: that.data.userInfo.token
    };
    wx.showLoading({
      title: '加载中',
    })
    util.post(util.url.erporder, reqBody, (res) => {
      wx.hideLoading()
      wx.hideNavigationBarLoading() //完成停止加载
      wx.stopPullDownRefresh() //停止下拉刷新
      if (res.state == 1) {
        that.setData({
          list: res.data
        })
      }
    })
  },
  click_photo: function (e) {
    var tel = e.currentTarget.dataset.tel;
    var state = e.currentTarget.dataset.state;
    var order = e.currentTarget.dataset.order;
    // if (state != 5){
    //   wx.showToast({
    //     title: '订单还未完成哦~',
    //     icon: 'none',
    //     duration: 1000
    //   })
    //   return
    // }
    wx.navigateTo({
      url: 'my_photos?tel=' +tel + '&order=' + order,
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

  }
})