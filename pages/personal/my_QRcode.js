// pages/personal/my_QRcode.js
var util = require('../../utils/util.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    qrImg: [],
    bgImg: app.globalData.imgUrl + 'qrcode2.jpg',
    icon: {
      ask1: app.globalData.imgUrl + 'ask1.png',
      ask2: app.globalData.imgUrl + 'ask2.png',
      ask3: app.globalData.imgUrl + 'ask3.png'
    },
    poster:'',
    text: '',
    down_state: true,
    // 提示
    notes: {
      txt: '',
      state: true
    },
    current: 0,
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
    // this.myewm()
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
    var userInfo = wx.getStorageSync('userInfo');
    this.setData({
      userInfo: userInfo
    })
    if (!userInfo) {
      wx.navigateTo({
        url: '/pages/login/index',
      })
    }
    this.myewmlist()
  },
  change(e) {
    console.log(e)
    console.log(this.data.qrImg[e.detail.current]['title'])
    console.log(this.data.qrImg[e.detail.current]['img'])
    this.setData({
      current: e.detail.current,
      poster: this.data.qrImg[e.detail.current]['img'],
      text: this.data.qrImg[e.detail.current]['title']
    })
  },
  myewmlist: function () {
    var reqBody = {
      token: this.data.userInfo.token
    };
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    util.post(util.url.myewmlist, reqBody, (res) => {
      if (res.state == 1) {
        this.setData({
          qrImg: res.data.list,
          'notes.txt': res.data.content,
          poster: res.data.list[0]['img'],
          text: res.data.list[0]['title']
        })
        //this.canvasdraw()
      }
      wx.hideLoading()
    })
  },
  canvasdraw: function () {
    let that = this;
    var userInfo = that.data.userInfo
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
      ctx.drawImage(res[0].path, 0, 0, 650, 920);
      ctx.drawImage(res[1].path, 10, 760, 160, 160);
      ctx.setFontSize(32);
      ctx.fillText(userInfo.nickName, 200, 820);
      ctx.stroke();
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
      height: 920,
      destWidth: 650,
      destHeight: 920,
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
    console.log('wwww'+poster)
    wx.showLoading({
      title: '下载中',
      mask: true
    })
    wx.authorize({
      scope: 'scope.writePhotosAlbum',
      success () {
        wx.getImageInfo({
          src: poster,
          success: function (sres) {
            console.log(sres.path);
            wx.saveImageToPhotosAlbum({
              filePath: sres.path,
              success: function (res) {
                wx.hideLoading()
                wx.showToast({
                  title: '下载完成',
                  duration: 1000
                })
              },
              fail: function (err) {
                console.log(err);
                wx.hideLoading()
                wx.showToast({
                  title: '下载失败',
                  icon: 'none'
                })
              }
            })
          }

        })
        
      },
      fail: function () {
        wx.showToast({
          title: '下载失败',
          icon: 'none'
        })
        wx.getSetting({
          success(res) {
            console.log(res)
            if (!res.authSetting['scope.writePhotosAlbum']) {
              that.setData({
                down_state: false
              })
            }
          }
        })
      }
    })
  },
  set_callback: function (e) {
    console.log(e)
    var data = e.detail, authSetting
    if (!data['scope.writePhotosAlbum']) {
      this.setData({
        down_state: false
      })
    }else{
      wx.showToast({
        title: '授权成功！',
        duration: 1000
      })
      this.setData({
        down_state: true
      })
    }
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
  my_customer: function () {
    wx.navigateTo({
      url: 'my_customer'
    })
  },
  click_notes: function () {
    var state = this.data.notes.state
    this.setData({
      'notes.state': !state
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
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      // console.log("111", res);
    } else {
      // console.log("222", res);
    }
    return {
      path: 'pages/login/index?scene=' + this.data.userInfo.tel
    }
  }
})