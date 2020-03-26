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
    change: false,
    userInfo: {
      name: "",
      weixin: "",
      birthday: ''
    },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var userInfo = wx.getStorageSync('userInfo');
    this.setData({
      UserInfo: userInfo
    })
    if (!userInfo) {
      wx.navigateTo({
        url: '/pages/login/index',
      })
    }
    var reqBody = {
      token: userInfo.token,
    };
    util.post(util.url.getUserInfo, reqBody, (res) => {
      var data = res.data
      data.nickname = data.nickname.replace(/\"/g,"");
      this.setData({
        userInfo: data
      })
    })
  },

  getInfo() {
    var userInfo = wx.getStorageSync('userInfo');
    var data = this.data.userInfo;
    var reqBody = {
      token: userInfo.token,
      name: data.name,
      weixin: data.weixin,
      birthday: data.birthday
    };
    util.post(util.url.amendindex, reqBody, (res) => {
      // console.log(res)
      // var data = res.data
      if (res.state == 1) {
        wx.showToast({
          title: '修改成功',
          icon: 'none',
          duration: 2000
        })
      } else {
        wx.showToast({
          title: '修改失败',
          icon: 'none',
          duration: 2000
        })
      }
    })
  },

  bindBlur(e) {
    this.setData({
      focus: false,
      show: false,
      change: false
    })
  },
  bindBlur1(e) {
    this.setData({
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
    this.setData({
      'userInfo.name': e.detail.value,
      focus: false,
      show: false,
      change: false
    })
    this.getInfo()
  },
  confirm_send1(e) {
    this.setData({
      'userInfo.weixin': e.detail.value,
      focus1: false,
      show1: false,
      change: false
    })
    this.getInfo()
  },

  // 出生日期修改
  bindDateChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value, typeof (e.detail.value))
    this.setData({
      'userInfo.birthday': e.detail.value
    })
    this.getInfo()
  },
  // 修改电话
  getPhoneNumber: function (e) {
    var that = this
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        var code = res.code
        if (e.detail.errMsg == "getPhoneNumber:ok") {
          var reqBody = {
            code: res.code,
            encryptedData: e.detail.encryptedData,
            iv: e.detail.iv,
            token: that.data.UserInfo.token
          };
          util.post(util.url.settel, reqBody, (res) => {
            // console.log(res)
            if (res.state == 1) {
              that.setData({
                'UserInfo.tel': res.tel,
                'userInfo.tel': res.tel,
              })
              var UserInfo = that.data.UserInfo
              wx.setStorageSync('userInfo', UserInfo);
              wx.showToast({
                title: '修改成功',
                icon: 'none',
                duration: 2000
              })
            }else{
              wx.showToast({
                title: res.info,
                icon: 'none',
                duration: 2000
              })
            }
          })

        } else if (e.detail.errMsg == "getPhoneNumber:fail user deny") {
          console.log('不同意')
        }
      }
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
    // this.getInfo()
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


})