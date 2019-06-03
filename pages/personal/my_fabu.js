// pages/personal/my_fabu.js
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var userInfo = wx.getStorageSync('userInfo');
    var reBody = {
      token: userInfo.token,
      pageSize: 9,
      pageNumber: 1
    }
    util.post(util.url.my_list, reBody, (res) => {
      console.log(res)
      var data = res.data
      if (res.state == 1) {
        this.setData({
          list: data
        })
        // wx.showToast({
        //   title: '发布成功',
        //   icon: 'success',
        //   duration: 2000
        // })
      }
    })
  },

  delate(e) {
    console.log(e)
    const id = e.currentTarget.dataset.id
    var idx = e.currentTarget.dataset.idx
    var userInfo = wx.getStorageSync('userInfo');
    var reBody = {
      token: userInfo.token,
      id: id
    }
    util.post(util.url.del_sns, reBody, (res) => {
      console.log(res)
      var list = this.data.list
      console.log(list)
      list[idx].status = 2
      console.log(list)
      this.setData({
        list: list
      })
      // var data = res.data
      // if (res.state == 1) {
      //   var list = this.data.list
      //   console.log(list)
      //   this.setData({
      //     list: data
      //   })
      // }
    })
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