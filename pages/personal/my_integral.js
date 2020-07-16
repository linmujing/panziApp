// pages/personal/my_integral.js
var util = require('../../utils/util.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    Page_slide: true,
    page: 1,
    expire_jf: {
      data: null,
      time: ""
    }
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
    this.getList()
    this.jfTime()
  },
  add_jf() {
    wx.navigateTo({
      url: '/pages/personal/my_QRcode'
    })
  },
  look_gz() {
    wx.navigateTo({
      url: 'welfare?type=jf'
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
  getJifen: function () {
    var userInfo = this.data.userInfo
    var reqBody = {
      token: userInfo.token
    };
    wx.showLoading({
      title: '加载中',
    })
    util.post(util.url.getUserInfo, reqBody, (res) => {
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
  getList: function () {
    var that = this
    var userInfo = that.data.userInfo
    var reqBody = {
      token: userInfo.token,
      page: that.data.page
    };
    util.post(util.url.myjifen, reqBody, (res) => {
      wx.hideLoading()
      wx.hideNavigationBarLoading() //完成停止加载
      wx.stopPullDownRefresh() //停止下拉刷新
      if (res.state == 1) {
        var list = that.data.list
        list = list.concat(res.data);
        that.setData({
          list: list,
          page: that.data.page + 1,
          Page_slide: true
        })
      } else {
        that.setData({
          Page_slide: false
        })
      }
    })
  },

  // 过期积分
  jfTime: function () {
    var userInfo = this.data.userInfo
    var reqBody = {
      token: userInfo.token
    };
    wx.showLoading({
      title: '加载中',
    })
    util.post(util.url.expire, reqBody, (res) => {
      console.log(res)
      if (res.state == 1) {
        this.setData({
          have_expire: true,
          'expire_jf.data': res.data,
          'expire_jf.time': res.time
        })
      } else {
        this.setData({
          have_expire: false
        })
      }
      wx.hideLoading()
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
    this.setData({
      list: [],
      page: 1
    })
    this.getList()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.Page_slide) {
      this.setData({
        Page_slide: false
      })
      this.getList()
    }
  },


})