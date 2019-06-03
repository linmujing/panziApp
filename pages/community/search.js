// pages/search/search.js
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    value: '',
    history: ['客片', '样片'],
    recommend: ['影视同款', '个人写真', '知否']
  },


  onSearch(e) {
    var userInfo = wx.getStorageSync('userInfo');
    var reBody = {
      token: userInfo.token,
    };
    util.post(util.url.search, reBody, (res) => {
      console.log(res)
      if (res.state == 1) {
        var data = res.data.opular
        console.log(data)
        this.setData({
          recommend: data
        })

        wx.navigateTo({
          url: `/pages/community/community`
        })
      }
    })

    const value = e.detail.value || this.data.value;

    // if (value !== '读书') {

    //   wx.showToast({
    //     title: '只能搜索 读书 哦~',
    //     icon: 'none'
    //   })

    //   return;
    // }

    // wx.navigateTo({
    //   url: `/pages/community/community?searchWord=${value}`
    // })
  },

  onBlur(e) {
    const value = e.detail.value;

    this.setData({
      value
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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