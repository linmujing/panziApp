// pages/activity/lottery_ history.js
var util = require('../../utils/util.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    type: "",
    cjData: {
      cjList: [],
      page: 1,
      cid: 13
    },
    zjData: {
      zjList: [],
      page: 1,
      cid: 13
    },
    Page_slide: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    var userInfo = wx.getStorageSync('userInfo');
    this.setData({
      type: options.type,
      userInfo: userInfo,
      'cjData.cjList': [],
      'cjData.page': 1,
      'zjData.zjList': [],
      'zjData.page': 1,
    })
    if (options.type == "cj") {
      this.cjHistory()
    } else if (options.type == "zj") {
      this.zjHistory()
    }
  },

  // 中奖记录
  zjHistory() {
    var that = this
    var reqBody = {
      token: this.data.userInfo.token,
      cid: that.data.zjData.cid,
      pageSize: 8,
      pageNum: that.data.zjData.page
    };
    wx.showLoading({
      title: '加载中',
    })
    util.post(util.url.dial_prize, reqBody, (res) => {
      wx.hideLoading()
      wx.hideNavigationBarLoading() //完成停止加载
      wx.stopPullDownRefresh() //停止下拉刷新
      console.log(res)
      if (res.state == 1) {
        var list = that.data.zjData.zjList
        list = list.concat(res.data);
        this.setData({
          'zjData.zjList': list,
          'zjData.page': that.data.zjData.page + 1,
        })
        // 判断上拉加载
        var leg = that.data.zjData.zjList.length
        if (leg <= res.count) {
          that.setData({
            Page_slide: true,
          })
        } else {
          that.setData({
            Page_slide: false
          })
        }
      } else {
        wx.showToast({
          title: res.info,
          icon: 'none',
          duration: 1000
        })
      }
    })
  },
  // 抽奖记录
  cjHistory() {
    var that = this
    var reqBody = {
      token: this.data.userInfo.token,
      cid: that.data.cjData.cid,
      pageSize: 8,
      pageNum: that.data.cjData.page
    };
    wx.showLoading({
      title: '加载中',
    })
    util.post(util.url.dial_log, reqBody, (res) => {
      wx.hideLoading()
      wx.hideNavigationBarLoading() //完成停止加载
      wx.stopPullDownRefresh() //停止下拉刷新
      console.log(res)
      if (res.state == 1) {
        var list = that.data.cjData.cjList
        list = list.concat(res.data);
        this.setData({
          'cjData.cjList': list,
          'cjData.page': that.data.cjData.page + 1,
        })
        // 判断上拉加载
        var leg = that.data.cjData.cjList.length
        if (leg <= res.count) {
          that.setData({
            Page_slide: true,
          })
        } else {
          that.setData({
            Page_slide: false
          })
        }
      } else {
        wx.showToast({
          title: res.info,
          icon: 'none',
          duration: 1000
        })
      }
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
    if (this.data.type == "cj") {
      this.setData({
        'cjData.cjList': [],
        'cjData.page': 1,
        'themeData.cid': 13,
      })
      this.cjHistory()
    } else if (this.data.type == "zj") {
      this.setData({
        'zjData.zjList': [],
        'zjData.page': 1,
        'themeData.cid': 13,
      })
      this.zjHistory()
    }
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.Page_slide) {
      this.setData({
        Page_slide: false
      })
      if (this.data.type == "zj") {
        this.zjHistory()
      } else if (this.data.type == "cj") {
        this.cjHistory()
      }
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})