// pages/personal/download_detail.js
var util = require('../../utils/util.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    indent: '',
    money: 0,
    lists: [],
    checkArr: [],
    percent_n: 0,
    allCheck: false,
    preview: {
      state: true,
      img: '',
      num: 0
    },
    tip: {
      state: true,
      price: 0,
      type: 1
    },
    down_state: true,
    rule: {
      state: true,
      text: '',
      img: app.globalData.imgUrl + 'hxdown.png',
    },
    // current: 0
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    var userInfo = wx.getStorageSync('userInfo');
    that.setData({
      userInfo: userInfo,
      indent: options.indent,
      // indent: 12345678,
      // 'userInfo.token': 'a0bf4ef38897783ed5c4c007aef07232'
    })
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          winHeight: res.windowHeight
        });
      },
    })
    that.getHuaxuItem()
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
  checkboxChange(e) {
    var that = this
    var arr = e.detail.value
    var lists = that.data.lists
    var checkArr = []
    for (var i = 0; i < lists.length; i++) {
      lists[i].check = false
      for (var j = 0; j < arr.length; j++) {
        if (arr[j] == i) {
          lists[i].check = true
          checkArr.push(lists[i])
        }
      }
    }
    that.setData({
      checkArr: checkArr
    })
  },
  select_all: function () {
    var that = this
    var allCheck = that.data.allCheck
    var lists = that.data.lists
    var checkArr = []
    if (allCheck){
      for (var i = 0; i < lists.length; i++) {
        lists[i].check = false
      }
      checkArr = []
      allCheck = false
    }else{
      for (var i = 0; i < lists.length; i++) {
        if (!lists[i].num>0){
          lists[i].check = true
        }
      }
      checkArr = lists
      allCheck = true
    }
    console.log(checkArr)
    that.setData({
      checkArr: checkArr,
      allCheck: allCheck,
      lists: lists
    })
  },
  previewImg: function (e) {
    var that = this
    var index = e.currentTarget.dataset.index
    var img = that.data.lists[index]
    wx.setNavigationBarTitle({
      title: '花絮照预览'
    })
    that.setData({
      'preview.state': false,
      'preview.img': img.pics,
      'preview.url': img.url,
      'preview.num': img.num,
      'preview.oid': img.order_id, 
      'preview.wxorder': img.wxorder, 
    })
  },
  close_imgPopup: function (e) {
    wx.setNavigationBarTitle({
      title: '我的花絮照'
    })
    this.setData({
      'preview.state': true
    })
  },
  cancel_tip: function (e) {
    this.setData({
      'tip.state': true
    })
  },
  show_tip: function (e) {
    var type = e.currentTarget.dataset.type
    var price = 0
    if(type == 1){
      var checkArr = this.data.checkArr
      if (checkArr.length == 0) {
        wx.showToast({
          title: '请选择花絮照~',
          icon: "none",
          duration: 1000
        })
        return
      }
      price = checkArr.length * this.data.money
    }else{
      price = this.data.money
    }
    this.setData({
      'tip.state': false,
      'tip.type': type,
      'tip.price': price
    })
  },
  getHuaxuItem: function () {
    var that = this
    var reqBody = {
      indent: that.data.indent,
      token: that.data.userInfo.token
    };
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    util.post(util.url.getHuaxuItem, reqBody, (res) => {
      wx.hideLoading()
      if(res.state == 1){
        var lists = res.data.list
        for (var i = 0; i < lists.length; i++) {
          lists[i].check = false
        }
        that.setData({
          lists: lists,
          money: res.data.money,
          'rule.text': res.data.rule,
          zlnum: res.data.zlnum
        })
      }else{
        wx.showToast({
          title: res.info,
          icon: "none",
          duration: 1000
        })
      }
    })
  },
  // 付费
  payment: function (oid) {
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    var that = this
    var reqBody = {
      token: that.data.userInfo.token,
      order_id: oid
    };
    util.post(util.url.goods_pay, reqBody, (res) => {
      wx.hideLoading()
      wx.requestPayment({
        'timeStamp': res.timeStamp,
        'nonceStr': res.nonceStr,
        'package': res.package,
        'signType': 'MD5',
        'paySign': res.paySign,
        'success': function (res) {
          wx.showToast({
            title: "完成订单支付"
          })
          that.getHuaxuItem()
          that.setData({
            'preview.state': true,
            'tip.state': true,
          })
        },
        'fail': function (res) {
          wx.showToast({
            title: '支付失败',
            icon: "none",
            duration: 1000
          })
          wx.redirectTo({
            url: '/pages/personal/trivia'
          })

        }
      })
    })
  },
  // 生成订单
  create_order: function () {
    var that = this
    var checkArr = that.data.checkArr
    var type = that.data.tip.type
    var arr = []
    if(type == 1){
      for (var i = 0; i < checkArr.length; i++) {
        arr.push(checkArr[i].url)
      }
    }else{
      arr.push(that.data.preview.url)
    }
    var reqBody = {
      indent: that.data.indent,
      type: 1,
      images: arr,
      token: that.data.userInfo.token
      // token: 'cbf8ed838757565e9efc7fb417e50890'
    };
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    util.post(util.url.goods_order, reqBody, (res) => {
      wx.hideLoading()
      if(res.state == 1){
        that.payment(res.data.order_id)
      }else{
        wx.showToast({
          title: res.info,
          icon: "none",
          duration: 1000
        })
      }
    })
  },

  // 下载图片
  save_gqImg: function (index) {
    var that = this
    var reqBody = {
      indent: that.data.indent,
      order_id: that.data.preview.oid,
      wxorder: that.data.preview.wxorder,
      images: that.data.preview.url,
      token: that.data.userInfo.token
      // token: 'cbf8ed838757565e9efc7fb417e50890'
    };
    wx.authorize({
      scope: 'scope.writePhotosAlbum',
      success() {
        wx.showLoading({
          title: '下载中',
          mask: true
        })
        // 用户已经同意小程序使用保存到相册功能
        util.post(util.url.hxDownload, reqBody, (res) => {
          if (res.state == 1) {
            that.downloadImg(res.data.url, 1, 1, (text) => {
              if (text == 100) {
                wx.showToast({
                  title: '下载完成',
                  icon: 'none'
                })
                that.downloadnum()
                that.getHuaxuItem()
                that.setData({
                  'preview.state': true
                })
              } else {
                wx.showToast({
                  title: '下载失败',
                  icon: 'none'
                })
              }
              console.log('拿到值了是' + text);
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
  // 下载图片
  downloadImg(src, index, total, callback) {
    var that = this
    wx.setKeepScreenOn({
      keepScreenOn: true
    })
    const downloadTask = wx.downloadFile({
      url: src,
      success: function (res) {
        var temp = res.tempFilePath
        wx.saveImageToPhotosAlbum({
          filePath: temp,
          success: function () { },
          fail: function () {
            wx.showToast({
              title: '第' + index + '下载失败',
              icon: "none",
              mask: true
            })
          }
        })
      },
      fail: function (res) {
        wx.showToast({
          title: '下载失败',
          icon: "none"
        })
      }
    })

    downloadTask.onProgressUpdate((res) => {
      wx.showLoading({
        title: '下载进度' + res.progress + '%',
        mask: true
      })
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

  },
  // 统计下载次数
  downloadnum: function () {
    var that = this
    var reqBody = {
      indent: that.data.indent,
      order_id: that.data.preview.oid, 
      wxorder: that.data.preview.wxorder, 
      images: that.data.preview.url,
      type: 1,
      token: that.data.userInfo.token
      // token: 'cbf8ed838757565e9efc7fb417e50890'
    };
    util.post(util.url.hxDownloadSucc, reqBody, (res) => {
      if (res.code == 1) {}
    })
  },
  // 授权设置
  set_callback: function (e) {
    console.log(e)
    var data = e.detail.authSetting
    if (!data['scope.writePhotosAlbum']) {
      this.setData({
        down_state: false
      })
    } else {
      wx.showToast({
        title: '授权成功！',
        duration: 1000
      })
      this.setData({
        down_state: true
      })
    }
  },
  click_notes: function () {
    var state = this.data.rule.state
    this.setData({
      'rule.state': !state
    })
  },
  click_unlock: function () {
    var that = this
    var arr = []
    arr.push(that.data.preview.url)
    var reqBody = {
      indent: that.data.indent,
      images: arr,
      type: 1,
      token: that.data.userInfo.token
    };
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    util.post(util.url.unlock, reqBody, (res) => {
      wx.hideLoading()
      if (res.state == 1) {
        wx.showToast({
          title: '解锁成功~',
          icon: 'none',
          duration: 1200
        })
        that.getHuaxuItem()
        that.close_imgPopup()
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
  onShareAppMessage: function (e) {
    var title = '@ ' + this.data.userInfo.nickName+'在盘子女人坊拍摄了超赞古装照~邀请你为她助力，免费下载高清古装花絮照~'
    var url = 'pages/personal/assist?huaxuindent=' + this.data.indent + '&scene=' + this.data.userInfo.tel
    return {
      title: title,
      path: url
    }
  }
})