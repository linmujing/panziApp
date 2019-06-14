// pages/index/product_list.js
var util = require('../../utils/util.js');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    Page_slide: true,
    sortData: {
      sortList: [
        { title: '综合', id: '' },
        { title: '销量', id: 'xl' },
        { title: '新品', id: 'xp' },
        { title: '价格', id: 'jgx', cur: '' }
      ],
      current: 0,
      page: 1,
      search: '',
      list: [],
      type: ''
    },

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
    this.getList()
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
      'sortData.search': e.detail.value
    })
  },
  confirm_search: function () {
    this.setData({
      'sortData.list': [],
      'sortData.page': 1
    })
    this.getList()
  },
  click_sort: function (e) {
    var index = e.currentTarget.dataset.index;
    var data = this.data.sortData.sortList
    data[data.length - 1].cur = ''
    if (data[index].id == 'jgs') {
      data[index].id = 'jgx'
      data[index].cur = 2
    } else if (data[index].id == 'jgx') {
      data[index].id = 'jgs'
      data[index].cur = 1
    }
    this.setData({
      'sortData.list': [],
      'sortData.page': 1,
      'sortData.current': index,
      'sortData.type': data[index].id,
      'sortData.sortList': data
    })
    this.getList()
  },
  click_detail: function (e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: 'hanFu_detail?id=' + id,
    })
  },
  getList: function () {
    var that = this
    var reqBody = {
      pageSize: 10,
      pageNum: that.data.sortData.page,
      name: that.data.sortData.search,
      type: that.data.sortData.type,
      token: that.data.userInfo.token,
    };
    wx.showLoading({
      title: '加载中',
    })
    util.post(util.url.hanfuList, reqBody, (res) => {
      wx.hideLoading()
      wx.hideNavigationBarLoading() //完成停止加载
      wx.stopPullDownRefresh() //停止下拉刷新
      if (res.state == 1) {
        var list = that.data.sortData.list
        list = list.concat(res.data);
        that.setData({
          'sortData.list': list,
          'sortData.page': that.data.sortData.page + 1
        })
        // 判断上拉加载
        var leg = that.data.sortData.list.length
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
      'sortData.search': '',
      'sortData.list': [],
      'sortData.page': 1
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