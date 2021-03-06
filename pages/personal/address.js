// pages/personal/address.js
var util = require('../../utils/util.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    count: 0,
    source: false, //1000等于选择地址
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.source) {
      this.setData({
        source: JSON.parse(options.source)
      })
      console.log(this.data.source)
    }
    // 大转盘抽奖
    if (options.types) {
      this.setData({
        types: options.types
      })
    }
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
    this.getList()
  },
  click_delAddr: function (e) {
    var id = e.currentTarget.dataset.id;
    var that = this
    wx.showModal({
      title: '提示',
      content: '确认删除该地址吗？',
      success(res) {
        if (res.confirm) {
          console.log('用户点击确定')
          var reqBody = {
            id: id,
            token: that.data.userInfo.token
          };
          util.post(util.url.delAddr, reqBody, (res) => {
            if (res.state == 1) {
              wx.showToast({
                title: '删除成功~',
                icon: "none",
                duration: 1000
              })
              that.getList()
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  click_xjdz: function (e) {
    var mode = e.currentTarget.dataset.mode;
    var url = ''
    if (mode == 0) {
      var count = this.data.count;
      if (count >= 5) {
        wx.showToast({
          title: '新增地址已到上限~',
          icon: "none",
          duration: 1000
        })
        return
      }
      url = 'add_address'
    } else {
      var index = e.currentTarget.dataset.index;
      var info = this.data.list[index]
      url = 'add_address?info=' + JSON.stringify(info)
    }
    wx.navigateTo({
      url: url
    })
  },
  getList: function () {
    var reqBody = {
      token: this.data.userInfo.token
    };
    wx.showLoading({
      title: '加载中',
    })
    util.post(util.url.addrList, reqBody, (res) => {
      // console.log(res)
      if (res.state == 1) {
        this.setData({
          count: res.count,
          list: res.info
        })
      }
      wx.hideLoading()
    })
  },
  select_addr: function (e) {
    if (this.data.source == 1000) {
      console.log('选择地址')
      var index = e.currentTarget.dataset.index;
      var datar = this.data.list[index];
      app.globalData.Select_address = datar;
      wx.navigateBack();
      return
    }
    // 大转盘抽奖选择地址
    if (this.data.types == 666) {
      app.globalData.Select_address = datar;
      wx.navigateBack();
      return
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

})