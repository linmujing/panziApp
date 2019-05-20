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
      week_logo: app.globalData.imgUrl + 'week_logo.jpg'
    },

  },
  onLoad: function () {
  
  },
  blur_search: function (e) {
    // this.setData({
    //   'tel': e.detail.value
    // })
  },
})
