// pages/index/myMovies.js
var util = require('../../utils/util.js');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentTab: 0,
    tabArr: [],
    videoPlay: null,
    list: [],
    lists: [],
    tip: {
      state: true,
      price: 0,
    },
    checkData: {},
    down_state: true,
    _index: '',
    dyimg: app.globalData.imgUrl + 'noDy.png',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var userInfo = wx.getStorageSync('userInfo');
    this.setData({
      userInfo: userInfo,
      // 'userInfo.token':'bcbee2ac86fefd1b95613ac23e7ce377'
    })
    if (!userInfo) {
      wx.navigateTo({
        url: '/pages/login/index',
      })
    }
    this.getList()
    this.ad(7)
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
  ad: function(num){
    util.appointment(num, (res) => {
      this.setData({
        ad: res.data[0]
      })
    });
  },
  click_btn: function () {
    var ad = this.data.ad
    util.click_url(ad.type, ad.url)
  },
  // 导航切换
  switchNav(e) {
    var that = this;
    var index = e.target.dataset.current
    var type = that.data.tabArr[index].type
    var list = that.data.lists
    var res = []
    if (that.data.currentTab === index) {
      return false
    } else {
      if(type == ''){
        res = list
      }else{
        for (var i = 0; i < list.length; i++) {
          if (type == list[i].type) {
            res.push(list[i])
          }
        }
      }
      that.setData({
        currentTab: index,
        list: res
      })
    }
  },
  // 点击cover播放，其它视频结束
  videoPlay: function (e) {
    var _index = e.currentTarget.id
    this.setData({
      _index: _index
    })
    //停止正在播放的视频
    var videoContextPrev = wx.createVideoContext(this.data._index)
    videoContextPrev.stop();
    setTimeout(function () {
      //将点击视频进行播放
      var videoContext = wx.createVideoContext(_index)
      videoContext.play();
    }, 500)
  },
  bindtimeupdate: function (e) {
    var _index = e.currentTarget.id
    var currentTime = e.detail.currentTime
    var data = this.data.list[_index]
    if (data.num>0)return
    if (currentTime > data.time){
      wx.showToast({
        title: '请购买后再观看完整版~',
        icon: 'none',
        duration: 2000
      })
      //停止正在播放的视频
      var videoContextPrev = wx.createVideoContext(_index)
      videoContextPrev.stop()
    }
  },
  getList: function () {
    var that = this
    var reqBody = {
      token: that.data.userInfo.token
    };
    wx.showLoading({
      title: '加载中',
    })
    util.post(util.url.getMovies, reqBody, (res) => {
      wx.hideLoading()
      wx.stopPullDownRefresh() //停止下拉刷新
      if (res.state == 1) {
        var arr = [{
          name: '全部',
          type: ''
        }]
        arr = arr.concat(res.data.type);
        that.setData({
          list: res.data.list,
          lists: res.data.list,
          tabArr: arr
        })
      }
    })
  },
  show_tip: function (e) {
    var that = this
    var index = e.currentTarget.dataset.index
    var data = that.data.list[index]
    that.setData({
      checkData: data,
      'tip.state': false,
      'tip.price': data.money
    })
  },
  cancel_tip: function (e) {
    this.setData({
      'tip.state': true
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
          that.getList()
          that.setData({
            'tip.state': true,
          })
        },
        'fail': function (res) {
          wx.showToast({
            title: '支付失败',
            icon: "none",
            duration: 1000
          })
          wx.switchTab({
            url: '/pages/index/index',
          })
        }
      })
    })
  },
  // 生成订单
  create_order: function () {
    var that = this
    var checkData = that.data.checkData
    var reqBody = {
      indent: checkData.indent,
      images: [checkData.url],
      money: checkData.money,
      token: that.data.userInfo.token
    };
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    util.post(util.url.order_video, reqBody, (res) => {
      if (res.state == 1) {
        that.payment(res.data.order_id)
      } else {
        wx.showToast({
          title: res.info,
          icon: "none",
          duration: 1000
        })
      }
    })
  },
  // 授权设置
  set_callback: function (e) {
    var that = this
    console.log(e)
    var data = e.detail.authSetting
    if (!data['scope.writePhotosAlbum']) {
      that.setData({
        down_state: false
      })
    } else {
      wx.showToast({
        title: '授权成功！',
        duration: 1000
      })
      that.setData({
        down_state: true
      })
    }
  },
  judgeWifi: function (e) {
    var that = this
    var index = e.currentTarget.dataset.index
    var data = that.data.list[index]
    that.setData({
      checkData: data
    })
    wx.getConnectedWifi({
      success(res) {
        that.save_video()
      },
      fail(res) {
        wx.showModal({
          title: '提示',
          content: '您当前的网络是4G网络，是否确认用4G网络下载？(ps:建议连接wifi后下载哦~)',
          success(res) {
            if (res.confirm) {
              // console.log('用户点击确定')
              that.save_video()
            } else if (res.cancel) {
              // console.log('用户点击取消')
            }
          }
        })
      }
    })
  },
  // 视频下载
  save_video: function (e) {
    var that = this
    var data = that.data.checkData
    wx.showLoading({
      title: '下载中',
      mask: true
    })
    wx.authorize({
      scope: 'scope.writePhotosAlbum',
      success() {
        wx.setKeepScreenOn({
          keepScreenOn: true
        })
        // 用户已经同意小程序使用保存到相册功能
        const downloadTask = wx.downloadFile({
          url: data.videourl,
          success: function (res) {
            var temp = res.tempFilePath
            console.log(res)
            wx.saveVideoToPhotosAlbum({
              filePath: temp,
              success: function () {},
              fail: function () {
                wx.showToast({
                  title: '下载失败',
                  icon: "none"
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
            wx.showToast({
              title: '下载完成',
            })
            that.downloadnum()
            wx.hideLoading()
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
  // 统计下载次数
  downloadnum: function () {
    var that = this
    var checkData = that.data.checkData
    var reqBody = {
      indent: checkData.indent,
      order_id: checkData.order_id,
      wxorder: checkData.wxorder,
      images: checkData.url,
      type: 2,
      token: that.data.userInfo.token
      // token: 'cbf8ed838757565e9efc7fb417e50890'
    };
    util.post(util.url.hxDownloadSucc, reqBody, (res) => {
      if (res.code == 1) { }
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
    this.setData({
      list: [],
      lists: [],
      tabArr: [],
      _index: ''
    })
    this.getList()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    
  },

})