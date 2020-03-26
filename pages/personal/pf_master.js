// pages/personal/pf_master.js
var util = require('../../utils/util.js');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // title: app.globalData.imgUrl + 'pf_img/pf-titlePic.png',
    applyData: [
      // {
      //   img: app.globalData.imgUrl + 'pf_img/pf-p1.jpg',
      //   status: 0
      // },
      // {
      //   img: app.globalData.imgUrl + 'pf_img/pf-p2.jpg',
      //   status: 1
      // },
      // {
      //   img: app.globalData.imgUrl + 'pf_img/pf-p3.jpg',
      //   status: 0
      // },
      // {
      //   img: app.globalData.imgUrl + 'pf_img/pf-p4.jpg',
      //   status: 0
      // },
      // {
      //   img: app.globalData.imgUrl + 'pf_img/pf-p5.jpg',
      //   status: 1
      // },
      // {
      //   img: app.globalData.imgUrl + 'pf_img/pf-p6.jpg',
      //   status: 0
      // },
      // {
      //   img: app.globalData.imgUrl + 'pf_img/pf-p7.jpg',
      //   status: 0
      // },
      // {
      //   img: app.globalData.imgUrl + 'pf_img/pf-p8.jpg',
      //   status: 1
      // },
    ],
  },



  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },


  // 获取申请条件
  getData() {
    var userInfo = wx.getStorageSync('userInfo');
    var reqBody = {
      token: userInfo.token
    };

    util.post(util.url.check, reqBody, (res) => {
      // console.log(res)
      if (res.state === 1) {
        this.setData({
          show: true,
        })
      } else {
        this.setData({
          show: false,
        })
      }
      this.setData({
        applyData: res.data,
      })
    })
  },

  // 申请认证判断
  apply_info() {

    var userInfo = wx.getStorageSync('userInfo');
    var reqBody = {
      token: userInfo.token
    };
    wx.showLoading({
      title: '加载中',
    })
    util.post(util.url.check, reqBody, (res) => {
      console.log(res)
      wx.hideLoading()
      if (res.state === 1) {
        wx.navigateTo({
          url: '/pages/personal/pfApply_info'
        })
      } else {
        wx.showToast({
          title: "未达到申请条件！",
          icon: 'none',
          duration: 1000
        })
      }
      // if (res.code == 1111) { // 已经通过
      //   wx.navigateTo({
      //     url: '/pages/personal/audit_status?status=2'
      //   })
      // } else if (res.code === 1112) { //未通过
      //   wx.navigateTo({
      //     url: '/pages/personal/audit_status?status=0'
      //   })
      // } else if (res.code === 1113) { //正在审核
      //   wx.navigateTo({
      //     url: '/pages/personal/audit_status?status=1'
      //   })
      // }

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
    this.getData()
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