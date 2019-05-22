//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    indicatorDots: true,
    cindicatorColor: '#fff',
    autoplay: true,
    interval: 5000,
    duration: 1000,
    carouselData: [
      app.globalData.imgUrl + 'ad1.jpg',
      app.globalData.imgUrl + 'ad2.jpg',
      app.globalData.imgUrl + 'ad3.jpg',
      app.globalData.imgUrl + 'ad4.jpg',
    ],
    navData: [
      { img: app.globalData.imgUrl + 'nav1.png', title: '门店' },
      { img: app.globalData.imgUrl + 'nav2.png', title: '主题' },
      { img: app.globalData.imgUrl + 'nav3.png', title: '客片' },
      { img: app.globalData.imgUrl + 'nav4.png', title: '视频' },
      { img: app.globalData.imgUrl + 'nav5.png', title: '汉服' },
      { img: app.globalData.imgUrl + 'nav6.png', title: '影视合作' },
      { img: app.globalData.imgUrl + 'nav7.png', title: '明星合作' },
      { img: app.globalData.imgUrl + 'nav8.png', title: '积分兑换' },
      { img: app.globalData.imgUrl + 'nav9.png', title: '变一变' },
      { img: app.globalData.imgUrl + 'nav10.png',title: '我的照片'},
    ],
    hotList: [
      {
        xilie: '个人写真系列' ,
        title: '琉璃翠',
        img: app.globalData.imgUrl + 'ad1.jpg'
      },
      {
        xilie: '个人写真系列',
        title: '琉璃翠',
        img: app.globalData.imgUrl + 'ad2.jpg'
      },
      {
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
    this.stretch(150)
    this.shrink(130)
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
    this.stretch(150)
    
    this.shrink(130)
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
          url: 'store',
        })
        break
      case 1:
        wx.switchTab({
          url: '../theme/index',
        })
        break
      case 7:
        wx.navigateTo({
          url: 'jifen_mall',
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
          url: 'my_photos',
        })
        break
      default:
        wx.navigateTo({
          url: 'star?title=' + title
        })
    }
  },

})
