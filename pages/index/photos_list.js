// pages/index/photos_list.js
var util = require('../../utils/util.js');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    search: '',
    dpimg: app.globalData.imgUrl + 'noDp.png',
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
  getList: function () {
    var that = this
    var reqBody = {
      token: that.data.userInfo.token
      // token: 'df9f16b25033103a001b1d84ffe92441'

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
    var that = this
    var index = e.currentTarget.dataset.index;
    var data = that.data.list
    var tel = data[index].MOBILE;
    var state = data[index].STATUS;
    var order = data[index].ORDERSN;
    var ems = data[index].KDDH;
    if (state < 4){
      wx.showToast({
        title: '订单还未完成哦~',
        icon: 'none',
        duration: 1000
      })
      return
    }
    wx.navigateTo({
      url: 'my_photos?tel=' +tel + '&order=' + order + '&ems=' + ems,
    })
  },
  blur_search: function (e) {
    this.setData({
      search: e.detail.value
    })
  },
  confirm_search: function () {
    var tel = this.data.userInfo.tel
    var order = this.data.search
    // var order = '2019071500055'
    // var tel = '18774092987'
    wx.navigateTo({
      url: 'my_photos?tel=' + tel + '&order=' + order + '&ems=' + '',
    })
  },
  click_getDp: function (e) {
    var that = this
    var index = e.currentTarget.dataset.index;
    var data = that.data.list
    var order = data[index].ORDERSN;
    var dipian = data[index].dipian;
    if (dipian != 0){return}
    var reqBody = {
      token: that.data.userInfo.token,
      erpindent: order
    };
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    util.post(util.url.addnegative, reqBody, (res) => {
      if (res.state == 1) {
        wx.showToast({
          title: '领取成功~',
          icon: 'none'
        })
        setTimeout(function () {
          wx.hideLoading()
          that.getList()
        }, 1000)
      }else{
        wx.hideLoading()
        wx.showToast({
          title: res.info,
          icon: 'none'
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


})