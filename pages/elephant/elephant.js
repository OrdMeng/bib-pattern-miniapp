const elephantPatternPdf = require("../../utils/elephant-pattern-pdf");

Page({
  openPattern() {
    const filePath = `${wx.env.USER_DATA_PATH}/parent-elephant-pattern.pdf`;
    wx.showLoading({ title: "准备纸样" });

    wx.getFileSystemManager().writeFile({
      filePath,
      data: elephantPatternPdf,
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
