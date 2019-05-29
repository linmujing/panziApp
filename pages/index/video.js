// pages/index/video.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    videoPlay: null,
    videoData: {
      list: [
        { title: '强势登陆湖南卫视', info: '客片比样片更唯美', img: 'http://mmm.pznrfsy.com//uploads/20181230/d16f0c7963596c51d22e6cb265e8602f.png', url: 'http://mmm.pznrfsy.com//uploads/20181230/229a23ff3f60017a3ba3e8f3c8b8d35a.mp4' },
        { title: '强势登陆湖南卫视', info: '客片比样片更唯美', img: 'http://mmm.pznrfsy.com//uploads/20181230/d16f0c7963596c51d22e6cb265e8602f.png', url: 'http://mmm.pznrfsy.com//uploads/20181230/229a23ff3f60017a3ba3e8f3c8b8d35a.mp4' }
      ]
    }
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