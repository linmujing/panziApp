 // pages/community/community.js
 var util = require('../../utils/util.js');
 const app = getApp()
 Page({

   /**
    * 页面的初始数据
    */
   data: {
     winWidth: '',
     themeData: {
       search: '',
       page: 1,
       themeList: []
     },
     Page_slide: true,
     // 瀑布流
     scrollH: 0,
     imgWidth: 0,
     col1: [],
     col2: [],
     hotListLeftHeight: 0,
     hotListRightHeight: 0,
     // 广告
     ad: {
       img: '',
       state: true,
       seat: 4
     },
     banner: [],
     navData: [{
         img: app.globalData.imgUrl + 'n1.png',
         title: '每日任务'
       },
       {
         img: app.globalData.imgUrl + 'n2.png',
         title: '每周榜单'
       },
       {
         img: app.globalData.imgUrl + 'n3.png',
         title: '热门话题'
       },
       {
         img: app.globalData.imgUrl + 'n5.png',
         title: '我的晒图'
       },
     ],
     shai: app.globalData.imgUrl + 'shai.png',
     field: 'zan'
   },

   /**
    * 生命周期函数--监听页面加载
    */
   onLoad: function (options) {
     var that = this
     var userInfo = wx.getStorageSync('userInfo');
     this.setData({
       userInfo: userInfo
     })
     if (!userInfo) {
       wx.showToast({
         title: '为了更好的体验小程序，同时保障账户的安全性，请登陆~',
         icon: 'none',
         duration: 2000
       })
       setTimeout(function () {
         wx.redirectTo({
           url: '/pages/login/index',
         })
       }, 2000)
       return
     }
     if (userInfo.tel == '' || userInfo.tel == 0) {
       wx.showToast({
         title: '为了更好的体验小程序，同时保障账户的安全性，请先绑定手机号',
         icon: 'none',
         duration: 2000
       })
       setTimeout(function () {
         wx.redirectTo({
           url: '/pages/login/index',
         })
       }, 2000)
       return
     }
     this.setData({
       'themeData.themeList': [],
       'themeData.page': 1,
       'themeData.search': '',
       col1: [],
       col2: []
     })
     that.ad()
     that.getThemeList()
     that.getBanner()
     // 瀑布流计算
     wx.getSystemInfo({
       success: (res) => {
         let ww = res.windowWidth;
         let wh = res.windowHeight;
         let imgWidth = ww * 0.48;
         let scrollH = wh;

         this.setData({
           scrollH: scrollH,
           imgWidth: imgWidth
         });
       }
     })
   },
   // 广告弹窗
   ad: function () {
     console.log('晒图')
     var userInfo = wx.getStorageSync('userInfo');
     var that = this
     var reqBody = {
       token: userInfo.token,
       seat: that.data.ad.seat
     };
     util.post(util.url.ad, reqBody, (res) => {
       console.log(res)
       if (res.state == 1) {
         console.log(21212)
         var data = res.data[0]
         this.setData({
           'ad.img': data.img,
           'ad.state': false,
           'ad.url': data.url,
           'ad.type': data.type
         })
       } else {
         this.setData({
           'ad.state': true
         })
       }
     })
   },
   click_url: function (e) {
     var that = this
     var reqBody = {
       token: that.data.userInfo.token,
       seat: that.data.ad.seat
     };
     util.post(util.url.ad_log, reqBody, (res) => {
       that.click_banner(e)
     })
   },
   close_ad: function (e) {
     var that = this
     var reqBody = {
       token: that.data.userInfo.token,
       seat: that.data.ad.seat
     };
     util.post(util.url.ad_log, reqBody, (res) => {
       that.setData({
         'ad.state': true
       })
     })
   },
   click_banner: function (e) {
     var that = this
     //type = 1 外链  2 内链
     var type = e.currentTarget.dataset.type
     var url = e.currentTarget.dataset.url
     if (url == '') {
       return
     }
     if (type == 1) {
       getApp().globalData.webView = url;
       wx.navigateTo({
         url: '/pages/index/webView'
       })
     } else {
       wx.navigateTo({
         url: url,
       })
     }
   },
   getBanner: function () {
     var that = this
     var reqBody = {
       token: that.data.userInfo.token,
       seat: 5
     };
     util.post(util.url.ad, reqBody, (res) => {
       if (res.state == 1) {
         this.setData({
           banner: res.data
         })
       }
     })
   },
   // 顶部搜索
   blur_search: function (e) {
     this.setData({
       'themeData.search': e.detail.value
     })
   },
   confirm_search: function () {
     this.setData({
       'themeData.themeList': [],
       'themeData.page': 1,
       col1: [],
       col2: []
     })
     this.getThemeList()
   },

   // 加载列表数据
   getThemeList: function () {
     var userInfo = wx.getStorageSync('userInfo');
     var that = this
     var reqBody = {
       token: userInfo.token,
       pageSize: 10,
       pageNumber: that.data.themeData.page,
       searchText: that.data.themeData.search,
       field: that.data.field
     };
     wx.showLoading({
       title: '加载中',
     })
     util.post(util.url.index_lists, reqBody, (res) => {
       wx.hideLoading()
       wx.hideNavigationBarLoading() //完成停止加载
       wx.stopPullDownRefresh() //停止下拉刷新
       if (res.state == 1) {
         // var list = that.data.themeData.themeList
         // list = list.concat(res.data.list);
         var imageList = res.data.list
         for (let i = 0; i < imageList.length; i++) {
           if (imageList[i].size.w == '') {
             imageList[i].size.w = 1
             imageList[i].size.h = 1
           }
           let imgWidth = that.data.imgWidth;
           let oImgW = imageList[i].size.w
           let oImgH = imageList[i].size.h
           let col1 = that.data.col1;
           let col2 = that.data.col2;
           var hotListLeftHeightTemp = that.data.hotListLeftHeight;
           var hotListRightHeightTemp = that.data.hotListRightHeight;
           //比例计算
           let scale = imgWidth / oImgW;
           oImgH = oImgH * scale; //自适应高度
           oImgH += 60;
           if (hotListLeftHeightTemp <= hotListRightHeightTemp) {
             hotListLeftHeightTemp += oImgH;
             col1.push(imageList[i])
           } else {
             hotListRightHeightTemp += oImgH;
             col2.push(imageList[i])
           }
           that.setData({
             hotListLeftHeight: hotListLeftHeightTemp,
             hotListRightHeight: hotListRightHeightTemp,
             col1: col1,
             col2: col2
           })
         }
         that.setData({
           // 'themeData.themeList': list,
           'themeData.page': that.data.themeData.page + 1
         })
         // 判断上拉加载
         var leg = that.data.themeData.themeList.length
         if (leg < res.data.total) {
           that.setData({
             Page_slide: true,
           })
         } else {
           that.setData({
             Page_slide: false
           })
         }
       }
     })
   },
   // 图片预览
   handleImagePreview(e) {
     var that = this
     var id = e.currentTarget.dataset.id
     const current = e.currentTarget.dataset.current
     // var detail = that.data.detail[id]
     var detail = that.data.themeData.themeList[id]
     wx.previewImage({
       current: detail.images[current], // 当前显示图片的http链接
       urls: detail.images // 需要预览的图片http链接列表
     })
   },

   // 点赞
   click_zan: function (e) {
     // console.log(e)
     var that = this
     var type = e.currentTarget.dataset.type;
     var index = e.currentTarget.dataset.index;
     var col1 = that.data.col1
     var col2 = that.data.col2
     var id
     if (type == 1) {
       if (col1[index].my_zan) {
         return
       }
       // col1[index].my_zan ? --col1[index].zan : ++col1[index].zan
       // col1[index].my_zan = !col1[index].my_zan
       ++col1[index].zan
       col1[index].my_zan = true
       id = col1[index].id
     } else {
       if (col2[index].my_zan) {
         return
       }
       // col2[index].my_zan ? --col2[index].zan : ++col2[index].zan
       // col2[index].my_zan = !col2[index].my_zan
       ++col2[index].zan
       col2[index].my_zan = true
       id = col2[index].id
     }
     // if (list[index].my_zan) {
     //   // type = 'del'
     //   --list[index].zan
     // } else {
     //   // type = 'add'
     //   ++list[index].zan
     // }
     // list[index].my_zan = !list[index].my_zan
     var userInfo = that.data.userInfo;
     // var id = e.currentTarget.dataset.id

     var reqBody = {
       token: userInfo.token,
       id: id,
       type: "zan"
     };
     util.post(util.url.edit_sns, reqBody, (res) => {
       console.log(res)
       if (res.state == 1) {
         // console.log(list)
         that.setData({
           col1: col1,
           col2: col2
         })
       }
     })
   },

   // 跳转发布动态页面
   link_release: function () {
     wx.navigateTo({
       url: './release'
     })
   },

   // 跳转动态详情页面
   link_details(e) {
     var id = e.currentTarget.dataset.id
     wx.navigateTo({
       url: './dongtai_details?id=' + id
     })
   },
   // 导航列表
   click_nav: function (e) {
     var index = e.currentTarget.dataset.index;
     switch (index) {
       case 0:
         wx.navigateTo({
           url: '/pages/community/task',
         })
         break
       case 1:
         getApp().globalData.webView = 'https://vip2.pznrfsy.com/lmj/hotTopic/weekly.html';
         wx.navigateTo({
           url: '/pages/index/webView'
         })
         break
       case 2:
         wx.navigateTo({
           url: '/pages/community/hot_topic',
         })
         break
       case 3:
         wx.navigateTo({
           url: "/pages/personal/my_fabu",
         })
         break
     }
   },
   click_sort: function (e) {
     var type = e.currentTarget.dataset.type;
     this.setData({
       field: type,
       'themeData.themeList': [],
       'themeData.page': 1,
       col1: [],
       col2: []
     })
     this.getThemeList()
   },


   /**
    * 生命周期函数--监听页面初次渲染完成
    */
   onReady: function () {

   },

   /**
    * 生命周期函数--监听页面显示
    */
   onShow: function () {},

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
     console.log('下拉')
     this.setData({
       'themeData.search': '',
       'themeData.themeList': [],
       'themeData.page': 1,
       col1: [],
       col2: []
     })
     this.getThemeList()
     this.getBanner()
   },

   /**
    * 页面上拉触底事件的处理函数
    */
   onReachBottom: function () {
     if (this.data.Page_slide) {
       this.setData({
         Page_slide: false
       })
       this.getThemeList()
     }
   },

   /**
    * 用户点击右上角分享
    */
   onShareAppMessage: function (res) {
     console.log(res)
     if (res.from === 'button') {
       // 来自页面内转发按钮

       var that = this
       var index = res.target.dataset.index;
       var id = res.target.dataset.id
       console.log(index)
       var list = that.data.themeData.themeList
       console.log(list)
         ++list[index].share

       var userInfo = that.data.userInfo
       var id = res.target.dataset.id

       var reBody = {
         token: userInfo.token,
         id: id,
         type: "share"
       };
       util.post(util.url.edit_sns, reBody, (res) => {
         console.log(res)
         if (res.state == 1) {
           // var data = res.data
           that.setData({
             'themeData.themeList': list
           })
         }
       })
     }
     return {
       title: this.data.detailData,
       path: 'pages/community/community?scene=' + userInfo.tel
     }
   }
 })