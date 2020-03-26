// pages/index/product_list.js
var util = require('../../utils/util.js');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    Page_slide: true,
    sortData: {
      sortList: [
        { title: '综合', id: '' },
        { title: '销量', id: 'xl' },
        { title: '新品', id: 'xp' },
        { title: '价格', id: 'jgx', cur: '' },
        { title: '筛选'},
      ],
      current: 0,
      page: 1,
      search: '',
      list: []
    },
    selectData: {
      selectList: [
        { title: '1000以下', id: 1 },
        { title: '1000-2000', id: 2 },
        { title: '2000-5000', id: 3 },
        { title: '5000-10000', id: 4 },
        { title: '10000以上', id: 5 },
      ],
      select_state: false,
      cur: ''
    },
    lotto_ad: app.globalData.imgUrl + 'lotto.png',
    jfGame: {
      jf1: app.globalData.imgUrl + 'jf1.png',
      jf2: app.globalData.imgUrl + 'jf2.png'
    },
    notice: [],
    ad: {
      img: '',
      state: true,
      seat: 2
    }
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
    if (!userInfo.uid) {
      wx.clearStorageSync()
      setTimeout(function () {
        wx.navigateTo({
          url: '/pages/login/index',
        })
      }, 1000)
    }
    if (options.type) {
      this.setData({
        type: options.type
      })
      wx.setNavigationBarTitle({
        title: '积分抽奖'
      })
      this.getNotice()
    }
    this.ad()
    this.getList()
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
  // 广告弹窗
  ad: function () {
    var that = this
    var reqBody = {
      token: that.data.userInfo.token,
      seat: that.data.ad.seat
    };
    util.post(util.url.ad, reqBody, (res) => {
      if (res.state == 1) {
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
  click_url: function (e) {
    var that = this
    //type = 1 外链  2 内链
    var type = e.currentTarget.dataset.type
    var url = e.currentTarget.dataset.url
    var reqBody = {
      token: that.data.userInfo.token,
      seat: that.data.ad.seat
    };
    util.post(util.url.ad_log, reqBody, (res) => {
      if (url == '') { return }
      if (type == 1) {
        getApp().globalData.webView = url;
        wx.navigateTo({
          url: 'webView'
        })
      } else {
        wx.navigateTo({
          url: url,
        })
      }
    })
  },
  bindPickerChange: function (e) {
    this.setData({
      rangeIndex: e.detail.value,
      'sortData.list': [],
      'sortData.page': 1,
    })
    this.getList()
  },
  blur_search: function (e) {
    this.setData({
      'sortData.search': e.detail.value
    })
  },
  confirm_search: function () {
    this.setData({
      'sortData.list': [],
      'sortData.page': 1
    })
    this.getList()
  },
  click_sort: function (e) {
    var index = e.currentTarget.dataset.index;
    var data = this.data.sortData.sortList
    data[3].cur = ''
    if (data[index].id == 'jgs') {
      data[index].id = 'jgx'
      data[index].cur = 2
    } else if (data[index].id == 'jgx'){
      data[index].id = 'jgs'
      data[index].cur = 1
    }
    if (index == 4) {
      this.seletToggle()
      return
    }
    this.setData({
      'sortData.list': [],
      'sortData.page': 1,
      'sortData.current': index,
      'sortData.type': data[index].id,
      'sortData.sortList': data,
      'selectData.cur': '',
      'selectData.select_state': false
    })
    this.getList()
  },
  click_detail: function (e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: 'jifen_detail?id=' + id,
    })
  },
  getList: function () {
    var that = this
    var reqBody = {
      pageSize: 10,
      pageNum: that.data.sortData.page,
      name: that.data.sortData.search,
      type: that.data.sortData.type,
      integ: that.data.selectData.cur,
      token: that.data.userInfo.token,
    };
    var url = ''
    if (that.data.type == 3) {
      url = util.url.lottoList
    } else {
      url = util.url.goodsList
    }
    wx.showLoading({
      title: '加载中',
    })
    util.post(url, reqBody, (res) => {
      wx.hideLoading()
      wx.hideNavigationBarLoading() //完成停止加载
      wx.stopPullDownRefresh() //停止下拉刷新
      if (res.state == 1) {
        var list = that.data.sortData.list
        list = list.concat(res.data);
        that.setData({
          'sortData.list': list,
          'sortData.page': that.data.sortData.page + 1
        })
        // 判断上拉加载
        var leg = that.data.sortData.list.length
        if (leg < res.count) {
          this.setData({
            Page_slide: true
          })
        } else {
          this.setData({
            Page_slide: false
          })
        }
        // 获取列表高度
        var query = wx.createSelectorQuery();
        query.select('.product').boundingClientRect(function (res) {
          that.setData({
            winHeight: res.height + 80
          })
        }).exec();
      }
    })
  },
  click_lotto: function (e) {
    wx.showLoading({
      title: '抽奖中',
      mask: true
    })
    var that = this
    var index = e.currentTarget.dataset.index;
    var list = that.data.sortData.list
    if (list[index].stock == 0) {
      wx.showToast({
        title: '库存为0~',
        icon: 'none',
        duration: 1000
      })
      return
    }
    var reqBody = {
      token: that.data.userInfo.token,
      goods_id: list[index].id
    };
    util.post(util.url.goods_lotto, reqBody, (res) => {
      // console.log(res)
      wx.hideLoading()
      if (res.state == 1) {
        wx.navigateTo({
          url: 'order?id=' + res.order_id,
        })
      } else {
        wx.showToast({
          title: res.info,
          icon: 'none',
          duration: 1000
        })
      }
    })
  },
  getNotice: function () {
    var that = this
    var reqBody = {
      token: that.data.userInfo.token
    };
    util.post(util.url.lotto_list, reqBody, (res) => {
      if (res.state == 1) {
        that.setData({
          notice: res.data
        })
      }
    })
  },
  seletToggle: function () {
    this.setData({
      'selectData.select_state': !this.data.selectData.select_state
    })
  },
  click_fenlei: function (e) {
    var id = e.currentTarget.dataset.id;
    var index = e.currentTarget.dataset.index;
    this.setData({
      'selectData.cur': id,
      'selectData.index': index,
      'selectData.select_state': false,
      'sortData.current': 4,
      'sortData.sortList[3].cur': '',
      'sortData.type': '',
      'sortData.list': [],
      'sortData.page': 1
    })
    this.getList()
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
      'sortData.search': '',
      'sortData.list': [],
      'sortData.page': 1
    })
    this.getList()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.Page_slide) {
      this.setData({
        Page_slide: false
      })
      this.getList()
    }
  },

})