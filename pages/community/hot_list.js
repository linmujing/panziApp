// pages/community/hot_list.js
var util = require('../../utils/util.js');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    listData: {
      page: 1,
      list: []
    },
    Page_slide: true,
    field: 'zan',
    huati: app.globalData.imgUrl + 'huati.png',
    // 瀑布流
    scrollH: 0,
    imgWidth: 0,
    col1: [],
    col2: [],
    hotListLeftHeight: 0,
    hotListRightHeight: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var userInfo = wx.getStorageSync('userInfo');
    this.setData({
      userInfo,
      options
    })
    if (!userInfo) {
      wx.navigateTo({
        url: '/pages/login/index',
      })
    }
    this.setData({
      'listData.page': 1,
      'listData.list': []
    })
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
  // 加载列表数据
  getList: function () {
    var userInfo = wx.getStorageSync('userInfo');
    var that = this
    var reqBody = {
      token: userInfo.token,
      pageSize: 10,
      pageNumber: that.data.listData.page,
      searchText: '',
      field: that.data.field,
      category_id: that.options.id
    };
    wx.showLoading({
      title: '加载中',
    })
    util.post(util.url.index_lists, reqBody, (res) => {
      wx.hideLoading()
      wx.hideNavigationBarLoading() //完成停止加载
      wx.stopPullDownRefresh() //停止下拉刷新
      if (res.state == 1) {
        var imageList = res.data.list
        for (let i = 0; i < imageList.length; i++) {
          if (imageList[i].size.w == '') {
            imageList[i].size.w = 1
            imageList[i].size.h = 1
          }
          let imgWidth = that.data.imgWidth;
          let oImgW = imageList[i].size.w
          let oImgH = imageList[i].size.h
          let col1 = that.data.col1;
          let col2 = that.data.col2;
          var hotListLeftHeightTemp = that.data.hotListLeftHeight;
          var hotListRightHeightTemp = that.data.hotListRightHeight;
          //比例计算
          let scale = imgWidth / oImgW;
          oImgH = oImgH * scale;      //自适应高度
          oImgH += 60;
          if (hotListLeftHeightTemp <= hotListRightHeightTemp) {
            hotListLeftHeightTemp += oImgH;
            col1.push(imageList[i])
          } else {
            hotListRightHeightTemp += oImgH;
            col2.push(imageList[i])
          }
          that.setData({
            hotListLeftHeight: hotListLeftHeightTemp,
            hotListRightHeight: hotListRightHeightTemp,
            col1: col1,
            col2: col2
          })
        }
        var list = that.data.listData.list
        list = list.concat(res.data.list);
        that.setData({
          'listData.list': list,
          'listData.page': that.data.listData.page + 1,
          category: res.data.category
        })
        // 判断上拉加载
        var leg = list.length
        if (leg < res.data.total) {
          that.setData({
            Page_slide: true,
          })
        } else {
          that.setData({
            Page_slide: false
          })
        }
      }
    })
  },
  click_sort: function (e) {
    var type = e.currentTarget.dataset.type;
    this.setData({
      field: type,
      'listData.page': 1,
      'listData.list': [],
      col1: [],
      col2: []
    })
    this.getList()
  },
  // 跳转动态详情页面
  link_details(e) {
    var id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: './dongtai_details?id=' + id
    })
  },
  // 跳转发布动态页面
  link_release: function () {
    wx.navigateTo({
      url: './release?id=' + this.data.options.id
    })
  },
  // 点赞
  click_zan: function (e) {
    var that = this
    var type = e.currentTarget.dataset.type;
    var index = e.currentTarget.dataset.index;
    var col1 = that.data.col1
    var col2 = that.data.col2
    var id
    if (type == 1) {
      if (col1[index].my_zan) {
        return
      }
      ++col1[index].zan
      col1[index].my_zan = true
      id = col1[index].id
    } else {
      if (col2[index].my_zan) {
        return
      }
      ++col2[index].zan
      col2[index].my_zan = true
      id = col2[index].id
    }
    var userInfo = that.data.userInfo;
    var reqBody = {
      token: userInfo.token,
      id: id,
      type: "zan"
    };
    util.post(util.url.edit_sns, reqBody, (res) => {
      console.log(res)
      if (res.state == 1) {
        that.setData({
          col1: col1,
          col2: col2
        })
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
      'listData.page': 1,
      'listData.list': [],
      col1: [],
      col2: []
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
  
})