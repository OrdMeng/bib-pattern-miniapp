const savePatternImages = require("../../utils/pattern-image-download");

Page({
  previewImage(event) {
    const image = event.currentTarget.dataset.src;
    wx.previewImage({ current: image, urls: [image] });
  },

  downloadPattern() {
    savePatternImages(["https://sewing-1303601055.cos.ap-beijing.myqcloud.com/assets/sheep-pattern.jpg"]);
  }
});
