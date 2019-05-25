// pages/index/store_detail.js
var util = require('../../utils/util.js');
const app = getApp()         
Page({

  /**
   * 页面的初始数据
   */
  data: {
    info: {},
    logo: app.globalData.imgUrl + 'pznrf.png',
    copyright: app.globalData.imgUrl + 'beian.png'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.myVideo = wx.createVideoContext('myVideo')
    this.storeInfo(options.id)
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
  //拨电话
  callUp: function () {
    wx.makePhoneCall({
      phoneNumber: this.data.info.tel
    })
  },
  callSale: function () {
    wx.makePhoneCall({
      phoneNumber: '400-9011-888'
    })
  },
  storeInfo: function(id){
    var that = this
    var reqBody = {
      id: id
    };
    util.post(util.url.storeInfo, reqBody, (res) => {
      console.log(res)
      if (res.state == 1) {
        res.data.content = res.data.content.replace(/\<img/gi, '<img style="width:100%;height:auto" ')
        wx.setNavigationBarTitle({
          title: res.data.title
        })
        that.setData({
          info: res.data
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