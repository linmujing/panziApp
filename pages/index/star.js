// pages/theme/index.js
var util = require('../../utils/util.js');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    banner: app.globalData.imgUrl + 'c-star.png',
    Page_slide: true,
    page: 1,
    list: [],
    type: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: options.title
    })
    if (options.title == '明星合作'){
      this.setData({
        type: 1
      })
    }else{
      this.setData({
        type: 2
      })
    }
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
  click_detail: function(e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: 'star_detail?id=' + id,
    })
  },
  getList: function () {
    var that = this
    var url = util.url.starList
    if(that.data.type == 1){
      url = util.url.starList
    }else{
      url = util.url.movieList
    }
    var reqBody = {
      pageNum: that.data.page,
      token: that.data.userInfo.token
    };
    wx.showLoading({
      title: '加载中',
    })
    util.post(url, reqBody, (res) => {
      wx.hideLoading()
      wx.hideNavigationBarLoading() //完成停止加载
      wx.stopPullDownRefresh() //停止下拉刷新
      if (res.state == 1) {
        var list = that.data.list
        list = list.concat(res.data);
        that.setData({
          list: list,
          page: that.data.page + 1
        })
        // 判断上拉加载
        var leg = that.data.list.length
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
      list: [],
      page: 1
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