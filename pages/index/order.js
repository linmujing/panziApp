// pages/index/order.js
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
    num: 1,
    addr: {},
    addr_state: true,
    info: {},
    totle_cost: 0,
    remark: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var userInfo = wx.getStorageSync('userInfo');
    this.setData({
      userInfo: userInfo,
      id: options.id
    })
    if (!userInfo) {
      wx.navigateTo({
        url: '/pages/login/index',
      })
    }
    this.getOrder(options.id)
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
    })
    var reqBody = {
      token: that.data.userInfo.token,
      order_id: id
    };
    util.post(util.url.orderInfo, reqBody, (res) => {
      // console.log(res)
      wx.hideLoading()
      if (res.state == 1) {
        that.setData({
          info: res.order,
          totle_cost: res.order.money
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
        for (var i = 0; i < res.info.length; i++){
          if(res.info[i].type == 1){
            that.setData({
              addr: res.info[i],
              addr_state: false
            })
          }
        }
      }
    })
  },
  blur_remark: function (e) {
    this.setData({
      'remark': e.detail.value
    })
  },
  //增加数量
  click_plus: function () {
    var that = this;
    var num = that.data.num;
    num++;
    var totle_cost = parseInt(that.data.info.money * num)
    that.setData({ 
      num: num,
      totle_cost: totle_cost
    })
  },
  //减少数量
  click_minus: function () {
    var that = this;
    var num = that.data.num;
    if (num <= 1) {
      wx.showToast({
        title: '已经不能再少啦~',
        icon: 'none',
        duration: 800
      })
      return false
    }
    num--;
    var totle_cost = parseInt(that.data.info.money * num)
    that.setData({
      num: num,
      totle_cost: totle_cost
    })
  },
  click_tijiao: function (e) {
    var that = this
    if (that.data.addr_state){
      wx.showToast({
        title: '请选择收货地址~',
        icon: 'none',
        duration: 800
      })
      return false
    }
    wx.showModal({
      title: '提示',
      content: '是否确认兑换该商品？',
      success(res) {
        if (res.confirm) {
          console.log('用户点击确定')
          var reqBody = {
            token: that.data.userInfo.token,
            goods_id: that.data.info.goods_id,
            address_id: that.data.addr.id,
            money: that.data.totle_cost,
            remark: that.data.remark,
            convert_no: that.data.info.convert_no,
            num: that.data.num
          };
          wx.showLoading({
            title: '加载中',
          })
          util.post(util.url.orderConvert, reqBody, (res) => {
            wx.hideLoading()
            if (res.state == 1) {
              var popup_state = that.data.popup_state
              that.setData({
                popup_state: !popup_state
              })
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
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