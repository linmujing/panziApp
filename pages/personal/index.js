// pages/personal/index.js
var util = require('../../utils/util.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(options)
    // const scene = decodeURIComponent(options.scene) // 介绍人电话
    // const qudao = decodeURIComponent(options.qudao)
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
    var userInfo = wx.getStorageSync('userInfo');
    this.setData({
      userInfo: userInfo
    })
    // if (!userInfo) {
    //   wx.navigateTo({
    //     url: '/pages/login/index',
    //   })
    // }
    this.getJifen()
    this.isVip()
  },
  getJifen: function () {
    var userInfo = this.data.userInfo
    var reqBody = {
      token: userInfo.token
    };
    // wx.showLoading({
    //   title: '加载中',
    // })
    util.post(util.url.getUserInfo, reqBody, (res) => {
      if (res.state == 1) {
        this.setData({
          'userInfo.integral': res.data.integral,
          'userInfo.grade': res.data.grade
        })
      }
      // wx.hideLoading()
    })
  },
  // 跳转所有订单
  link_allOrder(e) {
    var type = e.currentTarget.dataset.type
    wx.navigateTo({
      url: './my_order?type=' + type
    })
  },
  link_orderComment() {
    wx.navigateTo({
      url: './order_comment'
    })
  },

  // 跳转外呼邀约
  link_invitation() {
    wx.navigateTo({
      url: './invitation_list'
    })
  },


  // 跳转设置
  link_setting() {
    wx.navigateTo({
      url: './zh_setting'
    })
  },
  // 跳转我发布的
  link_release() {
    wx.navigateTo({
      url: './my_fabu'
    })
  },
  // 
  link_rank() {
    wx.navigateTo({
      url: './ranking'
    })
  },
  // 跳转任务中心
  link_task() {
    wx.navigateTo({
      url: 'task_center'
    })
  },
  to_QRcode: function () {
    wx.navigateTo({
      url: 'my_QRcode'
    })
  },
  my_integral: function () {
    wx.navigateTo({
      url: 'my_integral'
    })
  },
  my_customer: function () {
    wx.navigateTo({
      url: 'my_customer'
    })
  },
  about_us: function () {
    wx.navigateTo({
      url: 'about_us'
    })
  },
  click_vip: function () {
    wx.navigateTo({
      url: 'welfare'
    })
  },
  my_shopcart: function () {
    wx.navigateTo({
      url: '/pages/shopCart/index'
    })
  },
  to_trivia: function () {
    wx.navigateTo({
      url: 'trivia'
    })
  },
  photos_list: function () {
    wx.navigateTo({
      url: '/pages/index/photos_list'
    })
  },

  // 跳转盘粉达人
  my_pfMaster() {
    var userInfo = wx.getStorageSync('userInfo');
    var reqBody = {
      token: userInfo.token
    };
    util.post(util.url.check, reqBody, (res) => {
      if (res.code == 1111) { // 已经通过
        wx.navigateTo({
          url: '/pages/personal/audit_status?status=2'
        })
      } else if (res.code === 1112) { //未通过
        wx.navigateTo({
          url: '/pages/personal/audit_status?status=0'
        })
      } else if (res.code === 1113) { //正在审核
        wx.navigateTo({
          url: '/pages/personal/audit_status?status=1'
        })
      } else {
        wx.navigateTo({
          url: '/pages/personal/pf_master'
        })
      }
    })
  },

  // 判断是否通过审核条件刷新盘粉达人状态
  isVip() {
    var that = this
    var userInfo = wx.getStorageSync('userInfo');
    var reqBody = {
      token: userInfo.token
    };
    util.post(util.url.check, reqBody, (res) => {
      if (res.code == 1111) { // 已经通过
        that.setData({
          'userInfo.vip': res.data
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

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function () {

  // }
})