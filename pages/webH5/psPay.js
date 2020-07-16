// pages/webH5/psPay.js
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    src: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var userInfo = wx.getStorageSync('userInfo');
    console.log(options)
    this.setData({
      values: options,
      userInfo: userInfo
    })
    var reqBody = {
      token: userInfo.token,
      order_id: options.order_id, //订单id
      eye: options.eye,
      face: options.face,
      remove: options.remove,
      reference: options.reference,
      remark: options.remark,
      filename_path: options.filename_path
    };

    util.post(util.url.payment, reqBody, (res) => {
      console.log(res)
      wx.requestPayment({
        'timeStamp': res.data.timeStamp,
        'nonceStr': res.data.nonceStr,
        'package': res.data.package,
        'signType': res.data.signType,
        'paySign': res.data.paySign,
        'success': function (res) {
          console.log(res)
          wx.showToast({
            title: "完成订单支付"
          })
          const url = 'https://vip2.pznrfsy.com/bin/ps-monster/order.html'
          getApp().globalData.webView = url;
          wx.navigateTo({
            url: '/pages/index/webView'
          })
          // wx.switchTab({
          //   url: '/pages/index/index'
          // })
        },
        'fail': function (res) {
          console.log(res)
          // wx.redirectTo({
          //   url: '/pages/personal/my_order'
          // })
        }
      })
    })

    // wx.requestPayment({
    //   'timeStamp': options.timeStamp,
    //   'nonceStr': options.nonceStr,
    //   'package': options.package,
    //   'signType': options.signType,
    //   'paySign': options.paySign,
    //   'success': function (res) {
    //     console.log(res)
    //     wx.showToast({
    //       title: "完成订单支付"
    //     })
    //   },
    //   'fail': function (res) {
    //     console.log(res)
    //     wx.showToast({
    //       title: "支付失败"
    //     })
    //   }
    // })
  },

  payment: function () {
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    var that = this
    var val = that.data.values
    var userInfo = that.data.userInfo

    // wx.showLoading({
    //   title: '加载中',
    //   mask: true
    // })
    var reqBody = {
      token: userInfo.token,
      order_id: val.order_id, //订单id
      eye: val.eye,
      face: val.face,
      remove: val.remove,
      reference: val.reference,
      remark: val.remark,
      filename_path: val.filename_path
    };

    util.post(util.url.payment, reqBody, (res) => {
      wx.hideLoading()
      console.log(res)
      wx.requestPayment({
        'timeStamp': res.data.timeStamp,
        'nonceStr': res.data.nonceStr,
        'package': res.data.package,
        'signType': res.data.signType,
        'paySign': res.data.paySign,
        'success': function (res) {
          console.log(res)
          wx.showToast({
            title: "完成订单支付"
          })
          const url = 'https://vip2.pznrfsy.com/bin/ps-monster/order.html'
          getApp().globalData.webView = url;
          wx.navigateTo({
            url: '/pages/index/webView'
          })
        },
        'fail': function (res) {
          console.log(res)
          // wx.redirectTo({
          //   url: '/pages/personal/my_order'
          // })
        }
      })
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