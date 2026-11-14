const hippoPatternPdf = require("../../utils/hippo-pattern-pdf");

Page({
  previewImage(event) {
    const image = event.currentTarget.dataset.src;
    wx.previewImage({ current: image, urls: [image] });
  },

  openPattern() {
    const filePath = `${wx.env.USER_DATA_PATH}/hippo-pattern.pdf`;
    wx.showLoading({ title: "准备纸样" });

    wx.getFileSystemManager().writeFile({
      filePath,
      data: hippoPatternPdf,
      encoding: "base64",
      success: () => {
        wx.openDocument({
          filePath,
          fileType: "pdf",
          showMenu: true,
          fail: () => wx.showToast({ title: "纸样打开失败", icon: "none" })
        });
      },
      fail: () => wx.showToast({ title: "纸样准备失败", icon: "none" }),
      complete: () => wx.hideLoading()
    });
  }
});
