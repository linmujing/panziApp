// pages/index/photos_list.js
var util = require('../../utils/util.js');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    survey: {
      popup_state: true,
    },
    tel: '',
    order: '',
    total: {
      one: 0,
      two: 5
    },
    gradeList: [
      { title: '摄影服务', one: 0, two: 5 },
      { title: '化妆服务', one: 0, two: 5 },
      { title: '数码服务', one: 0, two: 5 },
      { title: '选片体验', one: 0, two: 5 },
      { title: '产品品质', one: 0, two: 5 },
      {title: '服务态度', one: 0, two: 5},
    ],
    radioData: [
      { name: '是', value: '是' },
      { name: '否', value: '否'}
    ],
    intro: '',
    advise: ''
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
  getList: function () {
    var that = this
    var reqBody = {
      token: that.data.userInfo.token
    };
    wx.showLoading({
      title: '加载中',
    })
    util.post(util.url.erporder, reqBody, (res) => {
      wx.hideLoading()
      wx.hideNavigationBarLoading() //完成停止加载
      wx.stopPullDownRefresh() //停止下拉刷新
      if (res.state == 1) {
        that.setData({
          list: res.data
        })
      }
    })
  },
  click_photo: function (e) {
    var tel = e.currentTarget.dataset.tel;
    var state = e.currentTarget.dataset.state;
    var order = e.currentTarget.dataset.order;
    // if (state != 5){
    //   wx.showToast({
    //     title: '订单还未完成哦~',
    //     icon: 'none',
    //     duration: 1000
    //   })
    //   return
    // }
    this.setData({
      tel: tel,
      order: order,
      'survey.popup_state': false
    })
  },
  click_close: function () {
    this.setData({
      'survey.popup_state': true
    })
    wx.navigateTo({
      url: 'my_photos?tel=' + this.data.tel + '&order=' + this.data.order,
    })
  },
  // 星星评分
  in_xin: function (e) {
    var in_xin = e.currentTarget.dataset.in;
    var gradeList = this.data.gradeList;
    var index = e.currentTarget.dataset.index;
    var one;
    if (in_xin === 'use_sc2') {
      one = Number(e.currentTarget.id);
    } else { 
      one = Number(e.currentTarget.id) + gradeList[index].one; 
    }
    gradeList[index].one = one
    gradeList[index].two = 5 - one
    this.setData({ 
      gradeList: gradeList
    })
    this.calculate()
  },
  // 计算总分
  calculate: function () {
    var gradeList = this.data.gradeList;
    var score = 0;
    var fullNum = 0;
    for (var i = 0; i < gradeList.length;i++){
      score += gradeList[i].one
    }
    var totalScore = (score / 30 * 10) / 2;
    if (totalScore >= 1 && totalScore < 2) {
      fullNum = 1
    } else if (totalScore >= 2 && totalScore < 3) {
      fullNum = 2
    } else if (totalScore >= 3 && totalScore < 4) {
      fullNum = 3
    } else if (totalScore >= 4 && totalScore < 5) {
      fullNum = 4
    } else if (totalScore == 5) {
      fullNum = 5
    }
    this.setData({
      'total.one': fullNum,
      'total.two': 5-fullNum
    })
  },
  radioChange: function (e) {
    this.setData({
      intro: e.detail.value
    })
  },
  blur_advise: function (e) {
    this.setData({
      advise: e.detail.value
    })
  },
  // 提交
  click_submit: function () {
    var that = this
    var gradeList = this.data.gradeList;
    var totle = that.data.total.one
    var intro = that.data.intro
    var advise = that.data.advise
    var flag = false
    var score = []
    for (var i = 0; i < gradeList.length; i++) {
      score.push(gradeList[i].one)
      if (gradeList[i].one == 0) {
        wx.showToast({
          title: '请为' + gradeList[i].title + '评分~',
          icon: "none",
          duration: 800
        })
        flag = false
        return
      } else {
        flag = true
      }
    }
    if (!flag) {
      wx.showToast({
        title: '请完善信息~',
        icon: "none",
        duration: 800
      })
      return
    }
    if (intro == '') {
      wx.showToast({
        title: '请完善信息~',
        icon: "none",
        duration: 800
      })
      return
    }
    var reqBody = {
      order: that.data.order,
      ztpf: totle,
      score: JSON.stringify(score),
      recommend: intro,
      content: advise
    };
    wx.showLoading({
      title: '加载中',
    })
    util.post(util.url.survey, reqBody, (res) => {
      wx.hideLoading()
      if (res.state == 1) {
        wx.navigateTo({
          url: 'my_photos?tel=' + this.data.tel + '&order=' + order,
        })
      }
    })
    // console.log(score)
    // console.log(intro)
    // console.log(advise)
    
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
    this.getList()
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