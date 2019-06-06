// pages/personal/my_QRcode.js
var util = require('../../utils/util.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    qrImg: '',
    bgImg: app.globalData.imgUrl + 'qrcode.jpg',
    poster:''
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
    this.myewm()
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
  myewm: function () {
    var reqBody = {
      token: this.data.userInfo.token
    };
    wx.showLoading({
      title: '加载中',
    })
    util.post(util.url.myewm, reqBody, (res) => {
      if (res.state == 1) {
        this.setData({
          qrImg: res.data
        })
        this.canvasdraw()
      }
    })
  },
  canvasdraw: function () {
    let that = this;
    let promise1 = new Promise(function (resolve, reject) {
      wx.getImageInfo({
        src: that.data.bgImg,
        success: function (res) {
          resolve(res)
        }
      })
    });
    let promise2 = new Promise(function (resolve, reject) {
      wx.getImageInfo({
        src: that.data.qrImg,
        success: function (res) {
          resolve(res)
        }
      })
    });
    Promise.all([promise1, promise2]).then(res => {
      const ctx = wx.createCanvasContext('shareImg');
      ctx.drawImage(res[0].path, 0, 0, 650, 1080);
      ctx.drawImage(res[1].path, 10, 660, 160, 160);
      ctx.draw();
      setTimeout(function () {
        that.create_img()
      }, 200)
    })
  },
  create_img: function () {
    var that = this;
    wx.canvasToTempFilePath({
      x: 0,
      y: 0,
      width: 650,
      height: 1080,
      destWidth: 650,
      destHeight: 1080,
      canvasId: 'shareImg',
      success: function (res) {
        wx.hideLoading()
        that.setData({
          poster: res.tempFilePath
        })
      },
      fail: function (res) {
        wx.hideLoading()
        wx.showToast({
          title: '图片处理失败，请重试',
          icon: 'none',
          duration: 2000
        })
      }
    })
  },
  click_save: function () {
    var that = this
    var poster = that.data.poster
    console.log(poster)
    wx.authorize({
      scope: 'scope.writePhotosAlbum',
      success() {
        console.log(1212121)
        wx.saveImageToPhotosAlbum({
          filePath: poster,
          success: function (res) {
            console.log(res, 222)
            wx.showToast({
              title: '下载完成',
              duration: 1000
            })
          },
          fail: function () {
            wx.showToast({
              title: '下载失败',
            })
          }
        })
      }
    })
  },
  // 预览图片
  previewImg: function (e) {
    // var poster = this.data.poster
    // var lists = []
    // lists.push(poster)
    // wx.previewImage({
    //   current: lists[0], // 当前显示图片的http链接
    //   urls: lists // 需要预览的图片http链接列表
    // })
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