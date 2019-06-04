// pages/theme/index.js
//获取应用实例
var util = require('../../utils/util.js');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    banner: [],
    themeData: {
      navList: [],
      current: 0,
      search: '',
      page: 1,
      themeList: [],
      cid: ''
    },
    Page_slide: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getTheme()
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
  blur_search: function (e) {
    this.setData({
      'themeData.search': e.detail.value
    })
  },
  confirm_search: function () {
    this.setData({
      'themeData.themeList': [],
      'themeData.page': 1,
      'themeData.cid': '',
      'themeData.current': 0
    })
    this.getThemeList()
  },
  click_nav: function (e) {
    var index = e.currentTarget.dataset.index;
    var id = e.currentTarget.dataset.id;
    this.setData({
      'themeData.current': index,
      'themeData.search': '',
      'themeData.themeList': [],
      'themeData.page': 1,
      'themeData.cid': id,
      Page_slide: true
    })
    this.getThemeList()
  },

  getTheme: function () {
    var that = this
    var reqBody = {
      id: 3
    };
    util.post(util.url.themeCat, reqBody, (res) => {
      if (res.state == 1) {
        // wx.setNavigationBarTitle({
        //   title: res.data.title
        // })
        var list = [{
          name: '全部',
          id: ''
        }]
        list = list.concat(res.data);
        that.getThemeList()
        that.setData({
          banner: res.banner,
          'themeData.navList': list
        })
      }
    })
  },
  getThemeList: function () {
    var that = this
    console.log(that.data.themeData.page)
    var reqBody = {
      pageNum: that.data.themeData.page,
      seach: that.data.themeData.search,
      cid: that.data.themeData.cid
    };
    wx.showLoading({
      title: '加载中',
    })
    util.post(util.url.themeList, reqBody, (res) => {
      console.log(res)
      wx.hideLoading()
      wx.hideNavigationBarLoading() //完成停止加载
      wx.stopPullDownRefresh() //停止下拉刷新
      if (res.state == 1) {
        for (var i = 0; i < res.data.length; i++) {
          res.data[i].check = false
        }
        var list = that.data.themeData.themeList
        list = list.concat(res.data);
        console.log(list)
        that.setData({
          'themeData.themeList': list,
          'themeData.page': that.data.themeData.page + 1
        })
        // 判断上拉加载
        var leg = that.data.themeData.themeList.length
        if (leg < res.count) {
          this.setData({
            Page_slide: true
          })
        } else {
          this.setData({
            Page_slide: false
          })
        }
      }
    })
  },
  // 点赞
  click_zan: function (e) {
    var that = this
    var index = e.currentTarget.dataset.index;
    var list = that.data.themeData.themeList
    console.log(list)
    var type = 'add'
    if (list[index].check) {
      type = 'del'
        --list[index].zan
    } else {
      type = 'add'
        ++list[index].zan
    }
    list[index].check = !list[index].check
    var reqBody = {
      id: list[index].id,
      type: type
    };
    util.post(util.url.themeZan, reqBody, (res) => {
      if (res.state == 1) {
        that.setData({
          'themeData.themeList': list
        })
      }
    })
  },
  click_detail: function (e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: 'detail?id=' + id + '&type=1',
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
      'themeData.search': '',
      'themeData.themeList': [],
      'themeData.page': 1,
      'themeData.cid': '',
      'themeData.current': 0
    })
    this.getTheme()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.Page_slide) {
      this.setData({
        Page_slide: false
      })
      this.getThemeList()
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})