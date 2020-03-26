// pages/index/message.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    msgData: [
      { title: '盘子公告', info: '4.23世界读书日，福利社每满100减50', date: '2019.04.15 10:00', type: 1, read: 0, img: app.globalData.imgUrl + 'msg1.png' },
      { title: '盘子公告', info: '4.23世界读书日，福利社每满100减50', date: '2019.04.15 10:00', type: 1, read: 22, img: app.globalData.imgUrl + 'msg2.png' },
      { title: '盘子公告', info: '4.23世界读书日，福利社每满100减50', date: '2019.04.15 10:00', type: 1, read: 1, img: app.globalData.imgUrl + 'msg3.png' },
      { title: '盘子公告', info: '4.23世界读书日，福利社每满100减50', date: '2019.04.15 10:00', type: 1, read: 0, img: app.globalData.imgUrl + 'msg4.png'},
    ],
    active: false,
    
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
  touchS: function (e) {
    var slide = {
      x: e.changedTouches[0].clientX,
      y: e.changedTouches[0].clientY
    }
    this.setData({
      slide
    })
  },
  touchE: function (e) {
    if (this.data.active || this.data.active === 0) {
      this.setData({
        active: false
      })
      return
    } else {
      var index = e.currentTarget.dataset.index;
      var slide = this.data.slide;
      var data = {
        x: e.changedTouches[0].clientX,
        y: e.changedTouches[0].clientY
      }
      if (data.x + 50 < slide.x ) {
        console.log('向左滑')
        this.setData({
          active: index
        })

      } else if (data.x - 50 > slide.x ) {
        console.log('向右滑')
        this.setData({
          active: false
        })
      } else if (data.x === slide.x && data.y === slide.y) {
        console.log('点击查看详情')
        this.setData({
          active: false
        })
        // var datar = this.data.list[index];
        // wx.navigateTo({
        //   url: 'add_address?type=2&data=' + JSON.stringify(datar)
        // })
      }
    }
  },
  // 删除消息
  click_del: function(e){
    var index = e.currentTarget.dataset.index;
    var list = this.data.msgData
    list.splice(index, 1)
    this.setData({
      msgData: list
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

 
})