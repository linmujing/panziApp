// pages/personal/invitation_list.js
const app = getApp()
var util = require('../../utils/util.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    themeData: {
      search: '',
      page: 1,
      themeList: []
    },
    Page_slide: true,
    quan:{
      img: app.globalData.imgUrl + 'quan.png',
      img1: app.globalData.imgUrl + 'quan1.png',
      img2: app.globalData.imgUrl + 'quan2.png',
    },
    date: '',
    menDian: [],
    mindex: 0,
    form:{
      name: '',
      tel: '',
      code: ''
    },
    info_state: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取当前日期
    var timestamp = Date.parse(new Date());
    var date = new Date(timestamp);
    //获取年份  
    var Y =date.getFullYear();
    //获取月份  
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
    //获取当日日期 
    var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate(); 
    var nowDate = Y+'-'+M+'-'+D

    var userInfo = wx.getStorageSync('userInfo');
    this.setData({
      userInfo: userInfo,
      'themeData.themeList': [],
      'themeData.page': 1,
      date: nowDate
    })
    if (!userInfo) {
      wx.navigateTo({
        url: '/pages/login/index',
      })
    }
    this.getList()
    this.getMendian()
    
  },

  click_details(e) {
    console.log(e)
    var id = e.currentTarget.dataset.id

    wx.navigateTo({
      url: './invitation?id=' + id
    })
  },

  getList: function () {
    var that = this
    var userInfo = this.data.userInfo
    var reqBody = {
      token: userInfo.token,
      // token:'d53589c7df29cf8a31d4b6ac165e398d',
      pageSize: 10,
      pageNumber: that.data.themeData.page,
    };
    wx.showLoading({
      title: '加载中',
    })
    util.post(util.url.invite_list, reqBody, (res) => {
      wx.hideLoading()
      wx.hideNavigationBarLoading() //完成停止加载
      wx.stopPullDownRefresh() //停止下拉刷新
      if(res.state === 0) {
        this.click_info()
        return
      }else if (res.state === 1) {
        var list = that.data.themeData.themeList
        list = list.concat(res.data);
        this.setData({
          'themeData.themeList': list,
          'themeData.page': that.data.themeData.page + 1
        })
      }
      var leg = that.data.themeData.themeList.length
      if (leg <= res.count) {
        that.setData({
          Page_slide: true,
        })
      } else {
        that.setData({
          Page_slide: false
        })
      }
    })
  },
  getMendian: function () {
    var reqBody = {
      token: this.data.userInfo.token
    };
    util.post(util.url.code_mendian, reqBody, (res) => {
      if (res.state == 1) {
        this.setData({
          menDian: res.data
        })
      }
    })
  },
  blur_name: function(e) {
    this.setData({
      'form.name': e.detail.value
    })
  },
  blur_tel: function(e) {
    this.setData({
      'form.tel': e.detail.value
    })
  },
  blur_code: function(e) {
    this.setData({
      'form.code': e.detail.value
    })
  },
  bindPickerChange: function(e) {
    this.setData({
      mindex: e.detail.value
    })
  },
  bindDateChange: function(e) {
    this.setData({
      date: e.detail.value
    })
  },
  click_dui: function () {
    var name = this.data.form.name
    var outlet = this.data.menDian[this.data.mindex].mendian
    var tel = this.data.form.tel
    var date = this.data.date
    var code = this.data.form.code
    if (name == '') {
      wx.showToast({
        title: '请输入姓名~',
        icon: "none",
        duration: 800
      })
      return
    }
    if (tel == '') {
      wx.showToast({
        title: '请输入联系方式~',
        icon: "none",
        duration: 800
      })
      return
    }
    var re = /^1\d{10}$/
    if (!re.test(tel)) {
      wx.showToast({
        title: '请输入正确的手机号码',
        icon: "none",
        duration: 800
      })
      return
    }
    if (code == '') {
      wx.showToast({
        title: '请输入兑换券码~',
        icon: "none",
        duration: 800
      })
      return
    }
    var reqBody = {
      token: this.data.userInfo.token,
      outlet: outlet,
      name: name,
      tel: tel,
      invitationtime: date,
      code: code
    };
    wx.showLoading({
      title: '加载中',
    })
    util.post(util.url.code_add, reqBody, (res) => {
      wx.hideLoading()
      wx.showToast({
        title: res.info,
        icon: "none",
        duration: 1000
      })
      if (res.state == 1) {
        this.click_info()
      }
    })
  },
  click_info: function () {
    var state = this.data.info_state
    this.setData({
      info_state: !state
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
    this.setData({
      'themeData.themeList': [],
      'themeData.page': 1,
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