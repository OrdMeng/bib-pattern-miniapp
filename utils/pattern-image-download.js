function savePatternImages(urls) {
  const sources = Array.isArray(urls) ? urls.filter(Boolean) : [];
  if (!sources.length) {
    wx.showToast({ title: "没有可下载的纸样", icon: "none" });
    return;
  }

  wx.showLoading({ title: "准备纸样" });
  let index = 0;

  const finish = (message, icon) => {
    wx.hideLoading();
    wx.showToast({ title: message, icon: icon || "none" });
  };

  const handleFailure = (error, message) => {
    wx.hideLoading();
    if (error && /auth deny|authorize denied|permission denied/i.test(error.errMsg || "")) {
      wx.showModal({
        title: "需要相册权限",
        content: "请允许保存图片到相册，授权后即可下载纸样。",
        confirmText: "去设置",
        success: (result) => {
          if (result.confirm) wx.openSetting();
        }
      });
      return;
    }
    wx.showToast({ title: message, icon: "none" });
  };

  const saveNext = () => {
    if (index >= sources.length) {
      finish("纸样已保存到相册", "success");
      return;
    }

    wx.getImageInfo({
      src: sources[index],
      success: (result) => {
        wx.saveImageToPhotosAlbum({
          filePath: result.path,
          success: () => {
            index += 1;
            saveNext();
          },
          fail: (error) => handleFailure(error, "纸样保存失败，请稍后重试")
        });
      },
      fail: (error) => handleFailure(error, "纸样准备失败，请稍后重试")
    });
  };

  saveNext();
}

module.exports = savePatternImages;
