// pages/personal/personal_info.js
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    date: "2000-08-24",
    focus: false,
    show: false,
    focus1: false,
    show1: false,
    comment_reply: '',
    wx_number: "",
    change: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // var userInfo = wx.getStorageSync('userInfo');
    // console.log(userInfo)
    // this.setData({
    //   userInfo: userInfo
    // })
    this.getInfo()
  },


  getInfo() {
    var userInfo = wx.getStorageSync('userInfo');
    var reqBody = {
      token: userInfo.token,
      // id: list[index].id,
      // type: "zan"
    };
    util.post(util.url.Player, reqBody, (res) => {
      console.log(res)
      var data = res.data
      if (res.state == 1) {
        this.setData({
          userInfo: data
        })
      }
    })
  },

  bindBlur(e) {
    this.setData({
      comment_reply: e.detail.value,
      focus: false,
      show: false,
      change: false
    })
  },
  bindBlur1(e) {
    this.setData({
      wx_number: e.detail.value,
      focus1: false,
      show1: false,
      change: false
    })
  },
  on_input(e) {
    console.log(e)
    this.setData({
      // comment_id: id,
      focus: true,
      show: true,
      change: true
    })
  },
  on_input1() {
    this.setData({
      // comment_id: id,
      focus1: true,
      show1: true,
      change: true
    })
  },

  confirm_send: function (e) {
    var msg = e.detail.value
    this.setData({
      comment_reply: msg,
    })
  },
  confirm_send1(e) {
    var msg = e.detail.value
    this.setData({
      wx_number: msg
    })
  },


  bindDateChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      date: e.detail.value
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