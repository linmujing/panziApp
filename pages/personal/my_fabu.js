// pages/personal/my_fabu.js
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    themeData: {
      navList: [],
      current: 0,
      search: '',
      page: 1,
      themeList: [],
      cid: ''
    },
    Page_slide: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    that.getThemeList()
    // var userInfo = wx.getStorageSync('userInfo');
    // var reBody = {
    //   token: userInfo.token,
    //   pageSize: 9,
    //   pageNumber: 1
    // }
    // util.post(util.url.my_list, reBody, (res) => {
    //   console.log(res)
    //   var data = res.data
    //   if (res.state == 1) {
    //     this.setData({
    //       list: data
    //     })
    //   }
    // })
  },

  // 加载列表数据
  getThemeList: function () {
    var userInfo = wx.getStorageSync('userInfo');
    var that = this
    console.log(that.data.themeData.page)
    var reqBody = {
      token: userInfo.token,
      pageSize: 5,
      pageNumber: that.data.themeData.page,
      // searchText: that.data.themeData.search,
      // pageNum: that.data.themeData.page,
      // seach: that.data.themeData.search,
      // cid: that.data.themeData.cid
    };
    wx.showLoading({
      title: '加载中',
    })
    util.post(util.url.my_list, reqBody, (res) => {
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
        console.log(leg)
        // if (leg < res.count) {
        if (leg < 100) {
          console.log('可以')
          that.setData({
            Page_slide: true,
            // 'themeData.page': that.data.themeData.page + 1
          })
        } else {
          console.log('不可以')
          that.setData({
            Page_slide: false
          })
        }
      }
    })
  },

  delate(e) {
    console.log(e)
    const id = e.currentTarget.dataset.id
    var idx = e.currentTarget.dataset.idx
    var userInfo = wx.getStorageSync('userInfo');
    var reBody = {
      token: userInfo.token,
      id: id
    }
    util.post(util.url.del_sns, reBody, (res) => {
      console.log(res)
      var list = this.data.list
      console.log(list)
      list[idx].status = 2
      console.log(list)
      this.setData({
        list: list
      })
      // var data = res.data
      // if (res.state == 1) {
      //   var list = this.data.list
      //   console.log(list)
      //   this.setData({
      //     list: data
      //   })
      // }
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
    console.log('下拉')
    this.setData({
      'themeData.search': '',
      'themeData.themeList': [],
      'themeData.page': 1,
      'themeData.cid': '',
      'themeData.current': 0
    })
    this.getThemeList()
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