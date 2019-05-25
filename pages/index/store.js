// pages/index/store.js
var util = require('../../utils/util.js');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    storeData: {
      page: 1,
      search: '',
      storeList: []
    },
    Page_slide: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getStoreList()
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
      'storeData.search': e.detail.value
    })
  },
  confirm_search: function(){
    this.setData({
      'storeData.storeList': [],
      'storeData.page': 1
    })
    this.getStoreList()
  },
  getStoreList: function () {
    var that = this
    var reqBody = {
      pageNum: that.data.storeData.page,
      seach: that.data.storeData.search
    };
    wx.showLoading({
      title: '加载中',
    })
    util.post(util.url.storeList, reqBody, (res) => {
      wx.hideLoading()
      wx.hideNavigationBarLoading() //完成停止加载
      wx.stopPullDownRefresh() //停止下拉刷新
      if (res.state == 1) {
        var list = that.data.storeData.storeList
        list = list.concat(res.data);
        that.setData({
          'storeData.storeList': list,
          'storeData.page': that.data.storeData.page + 1
        })
        // 判断上拉加载
        var leg = that.data.storeData.storeList.length
        if (leg < res.count){
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
  click_detail: function(e){
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: 'store_detail?id=' + id,
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
      'storeData.search': '',
      'storeData.storeList': [],
      'storeData.page': 1
    })
    this.getStoreList()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.Page_slide) {
      this.setData({
        Page_slide: false
      })
      this.getStoreList()
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})