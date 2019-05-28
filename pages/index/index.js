//index.js
//获取应用实例
const app = getApp()
var util = require('../../utils/util.js');
Page({
  data: {
    imgUrl: app.globalData.imgUrl2,
    indicatorDots: true,
    cindicatorColor: '#fff',
    autoplay: true,
    interval: 5000,
    duration: 1000,
    carouselData: [],
    navData: [],
    hotList: [
      {
        id: 4,
        xilie: '个人写真系列' ,
        title: '琉璃翠',
        img: app.globalData.imgUrl + 'ad1.jpg'
      },
      {
        id: 4,
        xilie: '个人写真系列',
        title: '琉璃翠',
        img: app.globalData.imgUrl + 'ad2.jpg'
      },
      {
        id: 4,
        xilie: '个人写真系列',
        title: '琉璃翠',
        img: app.globalData.imgUrl + 'ad3.jpg'
      }
    ],
    videoData: app.globalData.imgUrl + 'video.jpg',
    experience: app.globalData.imgUrl + 'experience.jpg',
    weekData: {
      weekList: [
        { img: app.globalData.imgUrl + 'week1.jpg' },
        { img: app.globalData.imgUrl + 'week2.jpg' },
        { img: app.globalData.imgUrl + 'week3.jpg' },
        { img: app.globalData.imgUrl + 'week4.jpg' }
      ],
      week_logo: app.globalData.imgUrl + 'week_logo.png'
    },
    storeData: {
      storeList: [
        { img: app.globalData.imgUrl + 'store1.jpg', name: '北京总店' },
        { img: app.globalData.imgUrl + 'store2.jpg', name: '北京朝阳' },
        { img: app.globalData.imgUrl + 'store3.jpg', name: '上海总店' },
        { img: app.globalData.imgUrl + 'store1.jpg', name: '北京总店' },
        { img: app.globalData.imgUrl + 'store2.jpg', name: '北京朝阳' },
        { img: app.globalData.imgUrl + 'store3.jpg', name: '上海总店' },
        { img: app.globalData.imgUrl + 'store1.jpg', name: '北京总店' },
        { img: app.globalData.imgUrl + 'store2.jpg', name: '北京朝阳' },
        { img: app.globalData.imgUrl + 'store3.jpg', name: '上海总店' },
        { img: app.globalData.imgUrl + 'store4.jpg', name: '上海静安' }
      ],
      banner: app.globalData.imgUrl + 'store.jpg'
    },
    commentsList: [
      { img: app.globalData.imgUrl + 'week1.jpg', name: 'Sunny', info: '喜欢盘子女人坊啊啊' },
      { img: app.globalData.imgUrl + 'week2.jpg', name: 'Tom', info: '哈哈哈喜欢盘子女人坊' },
      { img: app.globalData.imgUrl + 'week3.jpg', name: 'Amy', info: '好喜欢盘子女人坊' },
      { img: app.globalData.imgUrl + 'week4.jpg', name: 'Sunny', info: '凄凄切喜欢盘子女人坊' }
    ],
    current: 0,
    animationData: {},
    animationData2: {}
  },
  onLoad: function () {
    this.stretch(300 + 'rpx')
    this.shrink(260 + 'rpx')
    this.getIndex()
  },
  getIndex: function(){
    var that = this
    var reqBody = {};
    util.post(util.url.index, reqBody, (res) => {
      // console.log(res)
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
      url: '../theme/detail?id=' + id
    })
  },
})
