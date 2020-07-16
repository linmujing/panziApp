// pages/personal/welfare.js
var util = require('../../utils/util.js');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    jf_gz: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options.type)
    var userInfo = wx.getStorageSync('userInfo');
    this.setData({
      userInfo: userInfo
    })
    if (!userInfo) {
      wx.navigateTo({
        url: '/pages/login/index',
      })
    }
    if (options.type == 'jf') {
      this.welfare1()
      this.setData({
        jf_gz: true
      })

      wx.setNavigationBarTitle({
        title: '积分规则'
      })
    } else {
      this.welfare()
      this.setData({
        jf_gz: false
      })
      wx.setNavigationBarTitle({
        title: '会员福利'
      })
    }
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
  welfare: function () {
    var userInfo = this.data.userInfo
    var reqBody = {
      token: userInfo.token
    };
    wx.showLoading({
      title: '加载中',
    })
    util.post(util.url.welfare, reqBody, (res) => {
      if (res.state == 1) {
        res.data = res.data.replace(/\<img/gi, '<img style="width:100%;height:auto" ')
        this.setData({
          info: res.data
        })
      }
      wx.hideLoading()
    })
  },

  // 积分规则
  welfare1: function () {
    var userInfo = this.data.userInfo
    var reqBody = {
      token: userInfo.token,
      // welfare: ""
    };
    wx.showLoading({
      title: '加载中',
    })
    util.post(util.url.welfare, reqBody, (res) => {
      if (res.state == 1) {
        res.data = res.welfare2.replace(/\<img/gi, '<img style="width:100%;height:auto" ')
        this.setData({
          info: res.data
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

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },


})