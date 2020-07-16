// pages/index/photographer.js
var util = require('../../utils/util.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    baseUrl: "http://mmm.pznrfsy.com/",
    currentTab: null,
    storeList: [],
    level1: [],
    level2: [],
    level3: [],
    level4: [],
    dresser1: [],
    dresser2: [],
    dresser3: [],
    dresser4: [],
    dresser5: [],
    dresser6: [],
    dresser7: [],
    winHeight: "",
    // id: 1,
    // type: 2,
    isyf: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // wx.hideTabBar({})
    var that = this;
    var userInfo = wx.getStorageSync('userInfo');
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          winHeight: res.windowHeight - 10
        });
      },
    })
    that.setData({
      userInfo
    })
  },

  // 获取门店列表
  getStore() {
    let that = this
    let userInfo = that.data.userInfo
    var reqBody = {
      id: 1,
      type: 1,
      token: userInfo.token
    };
    util.post(util.url.photoStoreList, reqBody, (res) => {
      console.log(res)
      if (res.code === 1) {
        that.setData({
          storeList: res.data
        })
      } else {
        wx.showToast({
          title: res.msg,
          icon: 'none',
          duration: 1000
        })
      }
    })
  },

  // 详情列表
  getDetail(id, type) {
    let that = this
    // let id = that.data.id
    // let type = that.data.type
    let userInfo = that.data.userInfo

    var reqBody = {
      id,
      type,
      token: userInfo.token
    };
    util.post(util.url.photoList, reqBody, (res) => {
      if (res.code === 1) {
        that.setData({
          level1: res.data.level1,
          level2: res.data.level2,
          level3: res.data.level3,
          level4: res.data.level4,
          dresser1: res.data.dresser1,
          dresser2: res.data.dresser2,
          dresser3: res.data.dresser3,
          dresser4: res.data.dresser4,
          dresser5: res.data.dresser5,
          dresser6: res.data.dresser6,
          dresser7: res.data.dresser7,
        })
      } else {
        wx.showToast({
          title: res.msg,
          icon: 'none',
          duration: 1000
        })
      }
    })
  },

  // 导航栏切换
  switchNav(e) {
    var that = this;
    let id = e.currentTarget.dataset.id
    that.setData({
      // id,
      // type: 1,
      isyf: false,
      level1: [],
      level2: [],
      level3: [],
      level4: [],
      dresser1: [],
      dresser2: [],
      dresser3: [],
      dresser4: [],
      dresser5: [],
      dresser6: [],
      dresser7: [],
    })
    if (that.data.currentTab === e.target.dataset.current) {
      return false
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      })
    }
    that.getDetail(id, 1)
  },

  // 研发中心
  yfTap() {
    this.setData({
      // id: 1,
      // type: 2,
      isyf: true,
      currentTab: null,
      level1: [],
      level2: [],
      level3: [],
      level4: [],
      dresser1: [],
      dresser2: [],
      dresser3: [],
      dresser4: [],
      dresser5: [],
      dresser6: [],
      dresser7: [],
    })
    this.getDetail(1, 2)
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
    this.getStore()
    this.getDetail(1, 2)
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
  onShareAppMessage: function () {

  }
})