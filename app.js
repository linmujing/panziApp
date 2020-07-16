//app.js
App({
  globalData: {
    isIPX: false
  },
  onLaunch: function () {
    wx.getSystemInfo({
      success: res => {
        wx.setStorageSync('xitong', res.platform);

        this.globalData.equipment = res
        // 根据 model 进行判断
        if (res.model.search('iPhone X') != -1) {
          this.globalData.isIPX = true
        }
      }
    })

    //版本是否有更新
    const updateManager = wx.getUpdateManager()
    updateManager.onCheckForUpdate(function (res) {
      // console.log(res.hasUpdate)
    })
    updateManager.onUpdateReady(function () {
      wx.showModal({
        title: '更新提示',
        content: '新版本已经准备好，是否重启应用？',
        success: function (res) {
          if (res.confirm) {
            updateManager.applyUpdate()
          }
        }
      })
    })
    updateManager.onUpdateFailed(function () {
      wx.showModal({
        title: '更新提示',
        content: '新版本下载失败',
        showCancel: false
      })
    })
    //版本是否有更新 end
  },
  globalData: {
    userInfo: null,
    imgUrl: 'https://vip2.pznrfsy.com/lmj/panziApp/'
  }
})