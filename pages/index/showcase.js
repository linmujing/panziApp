// pages/index/showcase.js
var util = require('../../utils/util.js');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    heng: app.globalData.imgUrl + 'heng.png',
    week_logo: app.globalData.imgUrl + 'week_logo.png',
    caseData: {
      page: 1,
      list: [],
      navList: [],
      current: 0,
      search: '',
      cid: ''
    },
    banner: [],
    Page_slide: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getNav()
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
      'caseData.search': e.detail.value
    })
  },
  confirm_search: function () {
    this.setData({
      'caseData.list': [],
      'caseData.page': 1,
      'caseData.cid': '',
      'caseData.current': 0
    })
    this.getList()
  },
  click_nav: function (e) {
    var index = e.currentTarget.dataset.index;
    var id = e.currentTarget.dataset.id;
    this.setData({
      'caseData.current': index,
      'caseData.search': '',
      'caseData.list': [],
      'caseData.page': 1,
      'caseData.cid': id,
      Page_slide: true
    })
    this.getList()
  },

  getNav: function () {
    var that = this
    var reqBody = {
      id: 4
    };
    util.post(util.url.slicesCat, reqBody, (res) => {
      if (res.state == 1) {
        // wx.setNavigationBarTitle({
        //   title: res.data.title
        // })
        var list = [{
          name: '全部',
          id: ''
        }]
        list = list.concat(res.data);
        that.getList()
        that.setData({
          banner: res.banner,
          'caseData.navList': list
        })
      }
    })
  },
  getList: function () {
    var that = this
    var reqBody = {
      pageNum: that.data.caseData.page,
      seach: that.data.caseData.search,
      cid: that.data.caseData.cid
    };
    wx.showLoading({
      title: '加载中',
    })
    util.post(util.url.slicesList, reqBody, (res) => {
      wx.hideLoading()
      wx.hideNavigationBarLoading() //完成停止加载
      wx.stopPullDownRefresh() //停止下拉刷新
      if (res.state == 1) {
        var list = that.data.caseData.list
        list = list.concat(res.data);
        that.setData({
          'caseData.list': list,
          'caseData.page': that.data.caseData.page + 1
        })
        // 判断上拉加载
        var leg = that.data.caseData.list.length
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
  click_detail: function (e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/theme/detail?id=' + id + '&type=2',
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
      'caseData.list': [],
      'caseData.page': 1,
      'caseData.search': '',
      'caseData.cid': '',
      'caseData.current': 0
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