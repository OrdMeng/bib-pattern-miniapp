const bagImages = require("../../utils/bag-images");

Page({
  data: {
    bagImages,
    bagCount: bagImages.length
  },

  openBag(event) {
    const index = Number(event.currentTarget.dataset.index);
    if (!Number.isInteger(index) || !bagImages[index]) return;
    wx.navigateTo({ url: `/pages/bag-detail/bag-detail?index=${index}` });
  },

  openGuide() {
    wx.navigateTo({ url: "/pages/bag-guide/bag-guide" });
  }
});
