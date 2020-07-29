// pages/shopCart/order.js
var util = require('../../utils/util.js');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isIPX: app.globalData.isIPX,
    popup_state: true,
    gift: app.globalData.imgUrl + 'gift.jpg',
    addr: {},
    addr_state: true,
    list: [],
    totle_price: 0,
    postage: 0,
    goodscount: 0,
    remark: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var userInfo = wx.getStorageSync('userInfo');
    this.setData({
      userInfo: userInfo,
      // id: '156922130298240877'
      id: options.id
    })
    if (!userInfo) {
      wx.navigateTo({
        url: '/pages/login/index',
      })
    }
    this.getOrder()
    this.getAddrList()
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
    console.log(app.globalData.Select_address)
    if (app.globalData.Select_address) {
      this.setData({
        addr: app.globalData.Select_address,
        addr_state: false
      })
    }
  },
  getOrder: function (id) {
    var that = this
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    var reqBody = {
      token: that.data.userInfo.token,
      convert_no: that.data.id
    };
    util.post(util.url.order_info_car, reqBody, (res) => {
      // console.log(res)
      wx.hideLoading()
      if (res.state == 1) {
        that.setData({
          list: res.data.list,
          postage: res.data.postage,
          goodscount: res.data.goodscount,
          totle_price: (res.data.pricecount + res.data.postage).toFixed(2),
        })
      }
    })
  },
  getAddrList: function () {
    var that = this
    var reqBody = {
      token: that.data.userInfo.token
    };
    util.post(util.url.addrList, reqBody, (res) => {
      if (res.state == 1) {
        for (var i = 0; i < res.info.length; i++) {
          if (res.info[i].type == 1) {
            that.setData({
              addr: res.info[i],
              addr_state: false
            })
          }
        }
      }
    })
  },
  select_addr: function () {
    wx.navigateTo({
      url: '/pages/personal/address?source=1000',
    })
  },
  click_order: function () {
    wx.navigateTo({
      url: '/pages/personal/my_order',
    })
  },
  click_index: function () {
    wx.switchTab({
      url: '/pages/index/index',
    })
  },
  click_tijiao: function (e) {
    var that = this
    var type = that.data.list[0].type
    if(type == 5){
      that.payment()
      return
    }
    if (that.data.addr_state) {
      wx.showToast({
        title: '请选择收货地址~',
        icon: 'none',
        duration: 1000
      })
      return false
    }
    that.payment()
  },
  payment: function () {
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    var that = this
    var reqBody = {
      token: that.data.userInfo.token,
      // goods_id: that.data.info.goods_id,
      address_id: that.data.addr.id,
      money: that.data.totle_price,
      remark: that.data.remark,
      convert_no: that.data.id,
      num: that.data.goodscount
    };
    util.post(util.url.pay_car, reqBody, (res) => {
      wx.hideLoading()
      wx.requestPayment({
        'timeStamp': res.timeStamp,
        'nonceStr': res.nonceStr,
        'package': res.package,
        'signType': 'MD5',
        'paySign': res.paySign,
        'success': function (res) {
          wx.showToast({
            title: "完成订单支付"
          })
          var popup_state = that.data.popup_state
          that.setData({
            popup_state: !popup_state
          })
        },
        'fail': function (res) {
          wx.showToast({
            title: '支付失败~',
            icon: 'none',
            duration: 1000
          })
          setTimeout(function(){
            wx.redirectTo({
              url: '/pages/personal/my_order'
            })
          },1000)
        }
      })
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