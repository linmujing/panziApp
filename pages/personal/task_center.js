// pages/personal/task_center.js
var util = require('../../utils/util.js');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    arr: [],
    sysW: null,
    lastDay: null,
    firstDay: null,
    weekArr: ['日', '一', '二', '三', '四', '五', '六'],
    year: null,
    active: [
      { name: '新用户大礼包', jf: 100, img: app.globalData.imgUrl + 'msg4.png', info: '第一次注册并登陆' }, 
      { name: '新用户大礼包', jf: 100, img: app.globalData.imgUrl + 'msg2.png', info: '第一次注册并登陆'}
    ],
    popup_state: true,
    checkIn_text: '签 到'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.dataTime();

    //根据得到今月的最后一天日期遍历 得到所有日期
    for (var i = 1; i < this.data.lastDay + 1; i++) {
      this.data.arr.push(i);
    }
    var res = wx.getSystemInfoSync();
    this.setData({
      //更具屏幕宽度变化自动设置宽度
      sysW: res.windowHeight * 0.95 / 12,
      marLet: this.data.firstDay,
      arr: this.data.arr,
      year: this.data.year,
      getDate: this.data.getDate,
      month: this.data.month
    });
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
  //获取日历相关参数
  dataTime: function () {
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth();
    var months = date.getMonth() + 1;

    //获取现今年份
    this.data.year = year;

    //获取现今月份
    this.data.month = months;

    //获取今日日期
    this.data.getDate = date.getDate();

    //最后一天是几号
    var d = new Date(year, months, 0);
    this.data.lastDay = d.getDate();

    //第一天星期几
    let firstDay = new Date(year, month, 1);
    this.data.firstDay = firstDay.getDay();
  },
  click_jifen: function(){
    wx.navigateTo({
      url: '/pages/index/jifen_mall',
    })
  },
  click_close: function () {
    this.setData({
      popup_state: true
    })
  },
  click_checkIn: function () {
    var reqBody = {};
    util.post(util.url.playerssign, reqBody, (res) => {
      console.log(res)
      if (res.state == 1) {
        this.setData({
          popup_state: false,
          checkIn_text: '已签到'
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
  onShareAppMessage: function () {

  }
})