// pages/index/my_photos.js
var util = require('../../utils/util.js');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgData: [
      { img: app.globalData.imgUrl + 'week1.jpg', check: false },
      { img: app.globalData.imgUrl + 'week2.jpg', check: false },
      { img: app.globalData.imgUrl + 'week3.jpg', check: false },
      { img: app.globalData.imgUrl + 'week4.jpg', check: false },
      { img: app.globalData.imgUrl + 'week3.jpg', check: false },
      { img: app.globalData.imgUrl + 'week1.jpg', check: false }
    ],
    imgArr: [],
    lists: [],
    allCheck: false,
    percent_n: 0,
    preview: {
      preview_state: true,
      imgSrc: ''
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      options: options
    })
    this.getPhoto()
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
  getPhoto: function(){
    var reqBody = {
      // order: this.data.options.order,
      // tel: this.data.options.tel,
      order: 'Abc9999999999',
      tel: '18774092987'
    };
    wx.showLoading({
      title: '加载中',
    })
    var url = 'https://kpgl.pznrfsy.com/index/index/wx_list'
    util.post(url, reqBody, (res) => {
      wx.hideLoading()
      if (res.code == 1) {
        for (var i = 0; i < res.data.length; i++) {
          res.data[i].check = false
        }
       this.setData({
         imgData: res.data
       })
      }else{
        wx.showToast({
          title: res.msg,
          icon: "none",
          duration: 1000
        })
      }
    })
  },
  checkboxChange(e) {
    var imgArr = e.detail.value
    var len = this.data.imgData.length
    var allCheck = false
    if (imgArr.length == len) {
      allCheck = true
    } else {
      allCheck = false
    }
    this.setData({
      imgArr: imgArr,
      allCheck: allCheck
    })
  },
  // 全选
  checkboxAll(e) {
    var allCheck = this.data.allCheck
    var imgData = this.data.imgData
    var lists = []
    for (var i = 0; i < imgData.length; i++) {
      imgData[i].check = !imgData[i].check
    }
    if (!allCheck) {
      lists = this.data.lists
    } else {
      lists = []
    }
    this.setData({
      allCheck: !allCheck,
      imgData: imgData,
      imgArr: lists
    })
  },
  // 预览图片
  previewImg: function(e){
    var src = e.currentTarget.dataset.src
    this.setData({
      'preview.preview_state': false,
      'preview.imgSrc': src
    })
  },
  hide: function (e) {
    this.setData({
      'preview.preview_state': true,
      'preview.imgSrc': ''
    })
  },
  // 下载图片
  downloadImg(src, index, total, callback) {
    var that = this
    wx.authorize({
      scope: 'scope.writePhotosAlbum',
      success() {
        // 用户已经同意小程序使用保存到相册功能
        const downloadTask = wx.downloadFile({
          url: src,
          success: function (res) {
            var temp = res.tempFilePath
            wx.saveImageToPhotosAlbum({
              filePath: temp,
              success: function () {
              },
              fail: function () {
                wx.showToast({
                  title: '第' + index + '下载失败',
                })
              }
            })
          },
          fail: function (res) {
            wx.showToast({
              title: '下载失败',
            })
          }
        })

        downloadTask.onProgressUpdate((res) => {
          if (res.progress == 100) {
            callback(res.progress);
            var count = that.data.percent_n;//统计下载多少次了
            that.setData({
              percent_n: count + 1
            })
            if (that.data.percent_n == total) {//判断是否下载完成
              that.setData({//完成后，清空percent-N,防止多次下载后，出错
                percent_n: 0
              })
            }
          }
        })

      }
    })
  },
  savePic: function () {
    // console.log(this.data.imgArr)
    var that = this
    // var reqBody = {
    //   indent: that.data.order,
    //   token: that.data.userInfo.token
    // };
    // util.post(util.url.xiazaicu, reqBody, (res) => {
      // if (res.state == 1) {
        var data = that.data.imgArr
        if (data.length === 0) {
          wx.showToast({
            title: '您还未选择图片！',
            icon: 'none',
            duration: 2000
          })
          return
        }
        wx.showToast({
          title: "图片保存中……",
          icon: 'loading',
          duration: 3000
        });
        var total = data.length
        for (let i = 0, j = 1; i < total; i++ , j++) {
          that.downloadImg(data[i], j, total, (text) => {
            if (text == 100) {
              wx.showLoading({
                title: j + '/' + total + '下载中',
                icon: 'none',
                duration: 10000
              })
              if (j == total) {
                wx.showToast({
                  title: '下载完成',
                  duration: 1000
                })
                setTimeout(function () {
                  wx.switchTab({
                    url: 'index'
                  })
                }, 2000)
              }
            } else {
              wx.showToast({
                title: '下载失败',
                icon: 'none'
              })
            }
            console.log('拿到值了是' + text);
          })
        }
    //   } else {
    //     wx.showToast({
    //       title: "下载失败",
    //       duration: 2000
    //     });
    //   }
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