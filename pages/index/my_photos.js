// pages/index/my_photos.js
var util = require('../../utils/util.js');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgData: [],
    imgArr: [],
    lists: [],
    allCheck: false,
    percent_n: 0,
    preview: {
      preview_state: true,
      imgSrc: ''
    },
    order: '',
    survey: {
      popup_state: true,
    },
    total: {
      one: 0,
      two: 5
    },
    gradeList: [
      { title: '摄影服务', one: 0, two: 5 },
      { title: '化妆服务', one: 0, two: 5 },
      { title: '数码服务', one: 0, two: 5 },
      { title: '选片体验', one: 0, two: 5 },
      { title: '产品品质', one: 0, two: 5 },
      { title: '服务态度', one: 0, two: 5 },
    ],
    radioData: [
      { name: '是', value: 1 },
      { name: '否', value: 2 }
    ],
    intro: '',
    advise: ''
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
      // tel: this.data.options.tel
      order: 'Abc9999999999',
      tel: '18774092987'
    };
    wx.showLoading({
      title: '加载中',
    })
    util.post(util.url.wx_list, reqBody, (res) => {
      wx.hideLoading()
      if (res.code == 1) {
        if (res.data.status == 0){
          this.setData({
            'survey.popup_state': false
          })
        }
        for (var i = 0; i < res.data.list.length; i++) {
          res.data.list[i].check = false
        }
        this.setData({
          imgData: res.data.list
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
  click_close: function () {
    this.setData({
      'survey.popup_state': true
    })
  },
  // 星星评分
  in_xin: function (e) {
    var in_xin = e.currentTarget.dataset.in;
    var gradeList = this.data.gradeList;
    var index = e.currentTarget.dataset.index;
    var one;
    if (in_xin === 'use_sc2') {
      one = Number(e.currentTarget.id);
    } else {
      one = Number(e.currentTarget.id) + gradeList[index].one;
    }
    gradeList[index].one = one
    gradeList[index].two = 5 - one
    this.setData({
      gradeList: gradeList
    })
    this.calculate()
  },
  // 计算总分
  calculate: function () {
    var gradeList = this.data.gradeList;
    var score = 0;
    var fullNum = 0;
    for (var i = 0; i < gradeList.length; i++) {
      score += gradeList[i].one
    }
    var totalScore = (score / 30 * 10) / 2;
    if (totalScore >= 1 && totalScore < 2) {
      fullNum = 1
    } else if (totalScore >= 2 && totalScore < 3) {
      fullNum = 2
    } else if (totalScore >= 3 && totalScore < 4) {
      fullNum = 3
    } else if (totalScore >= 4 && totalScore < 5) {
      fullNum = 4
    } else if (totalScore == 5) {
      fullNum = 5
    }
    this.setData({
      'total.one': fullNum,
      'total.two': 5 - fullNum
    })
  },
  radioChange: function (e) {
    this.setData({
      intro: e.detail.value
    })
  },
  blur_advise: function (e) {
    this.setData({
      advise: e.detail.value
    })
  },
  // 提交
  click_submit: function () {
    var that = this
    var gradeList = that.data.gradeList;
    var totle = that.data.total.one
    var intro = that.data.intro
    var advise = that.data.advise
    var flag = false
    var score = []
    for (var i = 0; i < gradeList.length; i++) {
      score.push(gradeList[i].one)
      if (gradeList[i].one == 0) {
        wx.showToast({
          title: '请为' + gradeList[i].title + '评分~',
          icon: "none",
          duration: 800
        })
        flag = false
        return
      } else {
        flag = true
      }
    }
    if (!flag) {
      wx.showToast({
        title: '请完善信息~',
        icon: "none",
        duration: 800
      })
      return
    }
    if (intro == '') {
      wx.showToast({
        title: '请完善信息~',
        icon: "none",
        duration: 800
      })
      return
    }
    var reqBody = {
      order: that.data.options.order,
      ztpf: totle,
      score: JSON.stringify(score),
      recommend: intro,
      content: advise
    };
    wx.showLoading({
      title: '加载中',
    })
    util.post(util.url.survey, reqBody, (res) => {
      wx.hideLoading()
      this.setData({
        'survey.popup_state': true
      })
      wx.showToast({
        title: res.msg,
        icon: "none",
        duration: 800
      })
    })
    // console.log(score)
    // console.log(intro)
    // console.log(advise)

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