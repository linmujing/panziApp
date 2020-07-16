// pages/index/hexiao_details.js
var util = require('../../utils/util.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentTab: 1,
    cardList: [{
      name: '桃子',
      status: '已核销'
    }, {
      name: '李子',
      status: '已核销'
    }, {
      name: '锤子',
      status: '未核销'
    }, {
      name: '钉子',
      status: '已核销'
    }],
    code_img: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    var userInfo = wx.getStorageSync('userInfo');

    that.setData({
      Identity: options.status,
      userInfo: userInfo,
      id: options.id // 商户id
    })
  },
  saveImage(e) {
    console.log(e)
    wx.showToast({
      title: '长按保存',
      icon: 'none',
      duration: 1000
    })
  },
  // 客户信息
  is_client() {
    var that = this
    var reqBody = {
      token: that.data.userInfo.token,
    };
    util.post(util.url.verification, reqBody, (res) => {
      console.log(res)
      if (res.state === 1) {
        that.setData({
          code_img: res.data.code_img,
          hx_code: res.data.code,
          cardList: res.data.commodity
        })
      } else {
        wx.showToast({
          title: res.info,
          icon: 'none',
          duration: 1000
        })
      }
    })
  },

  // 输入完成核销
  handleCheck() {
    this.check()
  },

  // 核销接口
  check() {
    var that = this
    var code = that.data.code
    var tel = that.data.tel
    if (!tel) {
      wx.showToast({
        title: '请输入您的手机号码',
        icon: 'none',
        duration: 1000
      })
      return false
    }
    if (!code) {
      wx.showToast({
        title: '请输入核销字符',
        icon: 'none',
        duration: 1000
      })
      return false
    }
    var reqBody = {
      token: that.data.userInfo.token,
      id: that.data.id,
      code,
      tel
    };
    util.post(util.url.hxcheck, reqBody, (res) => {
      console.log(res)
      wx.showToast({
        title: res.info,
        icon: 'none',
        duration: 1000
      })
    })
  },

  // 商户信息
  getData() {
    var that = this
    var id = that.data.id
    var userInfo = that.data.userInfo
    var reqBody = {
      token: userInfo.token,
      id
    };
    util.post(util.url.businessInfo, reqBody, (res) => {
      console.log(res)
      if (res.state === 1) {
        that.setData({
          buyData: res.data
        })
      } else {
        wx.showToast({
          title: res.info,
          icon: 'none',
          duration: 1000
        })
      }
    })
  },

  switchNav(e) {
    var that = this
    if (that.data.currentTab === e.target.dataset.cur) {
      return false
    } else {
      that.setData({
        currentTab: e.target.dataset.cur
      })
    }
    if (e.target.dataset.cur == 2) {
      wx.scanCode({ // 允许从相机和相册扫码
        success(res) {
          console.log(res)
          // console.log(res.result)
          var data = JSON.parse(res.result)
          that.setData({
            currentTab: 1,
            code: data.code,
            tel: data.tel
          })
          that.check() // 扫码核销接口
        },
        complete(res) {}
      })

    }
  },

  // 账户名
  blur_tel: function (e) {
    this.setData({
      'tel': e.detail.value
    })
  },

  // 密码
  blur_code: function (e) {
    this.setData({
      'code': e.detail.value
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
    var that = this
    var Identity = that.data.Identity
    if (Identity == 0) {
      that.is_client()
    } else {
      this.getData()
    }
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