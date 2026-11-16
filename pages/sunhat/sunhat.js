const sunhatPatternPdf = require("../../utils/sunhat-pattern-pdf");

Page({
  data: {
    sizes: ["39", "42", "45", "48", "50", "52", "55"],
    selectedSize: "39",
    patternImage: "https://sewing-1303601055.cos.ap-beijing.myqcloud.com/assets/sunhat-pattern-39.png"
  },

  previewTutorial() {
    const image = "https://sewing-1303601055.cos.ap-beijing.myqcloud.com/assets/sunhat-tutorial.jpg";
    wx.previewImage({
      current: image,
      urls: [image]
    });
  },

  selectSize(event) {
    const size = String(event.currentTarget.dataset.size);
    this.setData({
      selectedSize: size,
      patternImage: `https://sewing-1303601055.cos.ap-beijing.myqcloud.com/assets/sunhat-pattern-${size}.png`
    });
  },

  previewPattern() {
    const image = this.data.patternImage;
    wx.previewImage({ current: image, urls: [image] });
  },

  openSelectedPattern() {
    const size = this.data.selectedSize;
    const pattern = sunhatPatternPdf[size];
    if (!pattern) {
      wx.showToast({ title: "未找到该尺寸纸样", icon: "none" });
      return;
    }

    const filePath = `${wx.env.USER_DATA_PATH}/sunhat-pattern-${size}cm.pdf`;
    wx.showLoading({ title: "准备纸样" });

    wx.getFileSystemManager().writeFile({
      filePath,
      data: pattern,
      encoding: "base64",
      success: () => {
        wx.openDocument({
          filePath,
          fileType: "pdf",
          showMenu: true,
          fail: () => wx.showToast({ title: `${size}cm 纸样打开失败`, icon: "none" })
        });
      },
      fail: () => wx.showToast({ title: "纸样准备失败", icon: "none" }),
      complete: () => wx.hideLoading()
    });
  }
});
