// pages/personal/invitation_list.js
var util = require('../../utils/util.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    themeData: {
      search: '',
      page: 1,
      themeList: []
    },
    Page_slide: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var userInfo = wx.getStorageSync('userInfo');
    this.setData({
      userInfo: userInfo,
      'themeData.themeList': [],
      'themeData.page': 1,
    })
    if (!userInfo) {
      wx.navigateTo({
        url: '/pages/login/index',
      })
    }
    this.getList()
  },

  click_details(e) {
    console.log(e)
    var id = e.currentTarget.dataset.id

    wx.navigateTo({
      url: './invitation?id=' + id
    })
  },

  getList: function () {
    var that = this
    var userInfo = this.data.userInfo
    var reqBody = {
      token: userInfo.token,
      // token:'d53589c7df29cf8a31d4b6ac165e398d',
      pageSize: 10,
      pageNumber: that.data.themeData.page,
    };
    wx.showLoading({
      title: '加载中',
    })
    util.post(util.url.invite_list, reqBody, (res) => {
      wx.hideLoading()
      wx.hideNavigationBarLoading() //完成停止加载
      wx.stopPullDownRefresh() //停止下拉刷新
      if (res.state === 1) {
        var list = that.data.themeData.themeList
        list = list.concat(res.data);
        this.setData({
          'themeData.themeList': list,
          'themeData.page': that.data.themeData.page + 1
        })
      }
      var leg = that.data.themeData.themeList.length
      if (leg <= res.count) {
        that.setData({
          Page_slide: true,
        })
      } else {
        that.setData({
          Page_slide: false
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
    this.setData({
      'themeData.themeList': [],
      'themeData.page': 1,
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})