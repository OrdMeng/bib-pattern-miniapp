const miniBagPatternPdf = require("../../utils/mini-bag-pattern-pdf");
const bagImages = require("../../utils/bag-images");

Page({
  data: {
    index: 0,
    number: "001",
    image: "",
    title: "包包 001"
  },

  onLoad(options) {
    const rawIndex = Number(options && options.index);
    const index = Number.isInteger(rawIndex) && rawIndex >= 0 && rawIndex < bagImages.length ? rawIndex : 0;
    const number = String(index + 1).padStart(3, "0");
    const image = bagImages[index];
    this.setData({ index, number, image, title: `包包 ${number}` });
    wx.setNavigationBarTitle({ title: `包包 ${number}` });
  },

  previewImage() {
    wx.previewImage({ current: this.data.image, urls: [this.data.image] });
  },

  openPattern() {
    const filePath = `${wx.env.USER_DATA_PATH}/mini-handbag-23x15-5cm.pdf`;
    wx.showLoading({ title: "准备纸样" });

    wx.getFileSystemManager().writeFile({
      filePath,
      data: miniBagPatternPdf,
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
