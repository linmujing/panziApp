//index.js
//获取应用实例
const app = getApp()
var util = require('../../utils/util.js');
Page({
  data: {
    service: app.globalData.imgUrl + 'zx.png',
    indicatorDots: true,
    cindicatorColor: '#fff',
    autoplay: true,
    interval: 5000,
    duration: 1000,
    carouselData: [],
    navData: [],
    hotList: [
      {
        id: 5,
        xilie: '个人写真系列' ,
        title: '琉璃翠',
        img: app.globalData.imgUrl + 'theme.jpg'
      },{
        id: 5,
        xilie: '个人写真系列',
        title: '琉璃翠',
        img: app.globalData.imgUrl + 'theme.jpg'
      }, {
        id: 5,
        xilie: '个人写真系列',
        title: '琉璃翠',
        img: app.globalData.imgUrl + 'theme.jpg'
      }, {
        id: 5,
        xilie: '个人写真系列',
        title: '琉璃翠',
        img: app.globalData.imgUrl + 'theme.jpg'
      }
    ],
    starList: [
      {
        id: 4,
        xilie: '个人写真系列',
        title: '琉璃翠',
        img: app.globalData.imgUrl + 'ad1.jpg'
      }
    ],
    videoData: { title: '强势登陆湖南卫视', info: '客片比样片更唯美', img: 'http://mmm.pznrfsy.com//uploads/20181230/d16f0c7963596c51d22e6cb265e8602f.png', url: 'http://mmm.pznrfsy.com//uploads/20181230/229a23ff3f60017a3ba3e8f3c8b8d35a.mp4' },
    experience: app.globalData.imgUrl + 'experience.jpg',
    weekData: {
      weekList: [
        { img: app.globalData.imgUrl + 'theme.jpg' },
        { img: app.globalData.imgUrl + 'theme.jpg' },
        { img: app.globalData.imgUrl + 'theme.jpg' },
        { img: app.globalData.imgUrl + 'theme.jpg' }
      ],
      week_logo: app.globalData.imgUrl + 'week_logo.png'
    },
    storeData: {
      storeList: [
        { img: app.globalData.imgUrl + 'store1.jpg', name: '北京总店' }
      ],
      banner: app.globalData.imgUrl + 'store.jpg'
    },
    commentsList: [
      
    ],
    current: 0,
    animationData: {},
    animationData2: {}
  },
  onLoad: function () {
    this.myVideo = wx.createVideoContext('myVideo')
    this.stretch(300 + 'rpx')
    this.shrink(260 + 'rpx')
    this.getIndex()
  },
  getIndex: function(){
    var that = this
    wx.showLoading({
      title: '加载中',
    })
    var reqBody = {};
    util.post(util.url.index, reqBody, (res) => {
      // console.log(res)
      wx.hideLoading()
      if (res.state == 1){
        that.setData({
          carouselData: res.banner,
          navData: res.data
        })
      }
    })
  },
  blur_search: function (e) {
    // this.setData({
    //   'tel': e.detail.value
    // })
  },
  change(e){
    this.setData({
      current: e.detail.current
    })
    this.stretch(300 + 'rpx')
    this.shrink(260 + 'rpx')
  },
  animationChange(e) {
    this.setData({
      current: e.detail.current
    })
  },
  // 收缩
  stretch(h){
    var animation = wx.createAnimation({
      duration: 600,
      timingFunction: 'ease',
    })
    this.animation = animation
    animation.height(h).step()
    this.setData({
      animationData: animation.export(),
    })
  },
  // 展开
  shrink(h){
    var animation2 = wx.createAnimation({
      duration: 600,
      timingFunction: 'ease',
    })
    this.animation2 = animation2
    animation2.height(h).step()
    this.setData({
      animationData2: animation2.export()
    })
  },
  // 导航列表
  click_nav: function (e) {
    var index = e.currentTarget.dataset.index;
    var title = e.currentTarget.dataset.title;
    switch (index) {
      case 0:
        wx.navigateTo({
          url: '/pages/index/store',
        })
        break
      case 1:
        wx.switchTab({
          url: '/pages/theme/index',
        })
        break
      case 2:
        wx.navigateTo({
          url: '/pages/index/showcase',
        })
        break
      case 3:
        wx.navigateTo({
          url: '/pages/index/video',
        })
        break
      case 7:
        wx.navigateTo({
          url: '/pages/index/jifen_mall',
        })
        break
      case 8:
        wx.navigateToMiniProgram({
          appId: 'wx5ba0b0241434741e',
          path: 'page/home/index',
          envVersion: 'release',
          success(res) {
            // 打开成功
          },
          fail(res) {
            console.log(res)
          }
        })
        break
      case 9:
        wx.navigateTo({
          url: '/pages/index/my_photos',
        })
        break
      default:
        wx.navigateTo({
          url: '/pages/index/star?title=' + title
        })
    }
  },
  click_msg: function(){
    wx.navigateTo({
      url: 'message'
    })
  },
  click_theme: function (e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../theme/detail?id=' + 5 + '&type=1',
    })
  },
  click_store: function (e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: 'store_detail?id=' + 6,
    })
  },
  click_kepian: function (e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      // url: 'showcase?id=' + 4,
      url: '../theme/detail?id=' + 7 + '&type=2',
    })
  },
  click_star: function (e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: 'star_detail',
    })
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.getIndex()
  },

})
