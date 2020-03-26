// pages/personal/assist.js
var util = require('../../utils/util.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    info: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      options: options,
      // 'options.huaxuindent': 12345678
      // 'options.uid': 225757,
      // 'options.id': 1
    })
    
    if (options.uid) {
      wx.setNavigationBarTitle({
        title: '游戏助力复活~'
      })
    }
    
    var userInfo = wx.getStorageSync('userInfo');
    if (!userInfo) {
      var url = ''
      if (options.uid) {
        url = '/pages/login/index?back=1'
      } else {
        url = '/pages/login/index?huaxuindent=' + options.huaxuindent + '&scene=' + options.scene + '&back=1'
      }
      setTimeout(function () {
        wx.navigateTo({
          url: url,
        })
      }, 1200)
    }
    this.share_info()
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
  // 花絮分享数据
  share_info: function () {
    var that = this
    var options = that.data.options
    var url = ''
    var reqBody = {}
     // 从游戏页面进入
    if (options.uid) {
      url = util.url.game_share
      reqBody = {
        uid: options.uid
      };
    }else{
      // 从花絮页面进入
      url = util.url.huaxu_share
      reqBody = {
        huaxuindent: that.data.options.huaxuindent
      };
    }
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    util.post(url, reqBody, (res) => {
      if (res.state == 1) {
        var info
        if (options.uid) {
          info = res.data
        }else{
          info = res.data.huaxu
        }
        that.setData({
          info: info
        })
      }
      wx.hideLoading()
    })
  },
  // 点击助力
  assist: function () {
    var that = this
    var options = that.data.options
    var userInfo = wx.getStorageSync('userInfo');
    var url = ''
    var reqBody = {}
    // 从游戏页面进入
    if (options.uid) {
      url = util.url.game_assist
      reqBody = {
        token: userInfo.token,
        id: that.data.options.id,
        uid: options.uid
      };
    } else {
      // 从花絮页面进入
      url = util.url.assist;
      reqBody = {
        token: userInfo.token,
        huaxuindent: that.data.options.huaxuindent,
        openid: userInfo.openid
      };
    }
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    util.post(url, reqBody, (res) => {
      wx.hideLoading()
      if (res.state == 1){
        wx.showToast({
          title: res.info,
          icon: 'none',
          duration: 1200
        })
        setTimeout(function () {
          wx.switchTab({
            url: '/pages/index/index',
          })
        }, 1200)
      }else{
        wx.showToast({
          title: res.info,
          icon: 'none',
          duration: 1200
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


})