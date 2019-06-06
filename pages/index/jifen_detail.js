// pages/index/jifen_detail.js
var util = require('../../utils/util.js');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isIPX: getApp().globalData.isIPX,
    detailData: {},
    goods_id: '',
    recommend: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var userInfo = wx.getStorageSync('userInfo');
    this.setData({
      userInfo: userInfo,
      goods_id: options.id
    })
    if (!userInfo) {
      wx.navigateTo({
        url: '/pages/login/index',
      })
    }

    this.getInfo(options.id)
    this.getRecommend()
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
  click_dui: function (e) {
    var goods_id = this.data.goods_id
    var reqBody = {
      token: this.data.userInfo.token,
      goods_id: goods_id
    };
    util.post(util.url.goodsOrder, reqBody, (res) => {
      // console.log(res)
      wx.hideLoading()
      if (res.state == 1) {
        wx.navigateTo({
          url: 'order?id=' + res.order_id,
        })
      }else{
        wx.showToast({
          title: res.info,
          icon: 'none',
          duration: 1000
        })
      }
    })
  },
  click_index: function (e) {
    wx.switchTab({
      url: 'index',
    })
  },
  getInfo: function (id) {
    var that = this
    wx.showLoading({
      title: '加载中',
    })
    var reqBody = {
      token: that.data.userInfo.token,
      id: id
    };
    util.post(util.url.goodsInfo, reqBody, (res) => {
      // console.log(res)
      wx.hideLoading()
      if (res.state == 1) {
        that.setData({
          detailData: res.data,
        })
      }
    })
  },
  getRecommend: function (id) {
    var that = this
    var reqBody = {
      token: that.data.userInfo.token
    };
    util.post(util.url.recommend, reqBody, (res) => {
      // console.log(res)
      if (res.state == 1) {
        that.setData({
          recommend: res.data,
        })
      }
    })
  },
  click_detail: function (e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: 'jifen_detail?id=' + id,
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
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      // console.log("111", res);
    }else{
      // console.log("222", res);
    }
    return {
      title: this.data.detailData.goods_name,
      path: 'pages/index/jifen_detail?id=' + this.data.goods_id
    }
  },
})