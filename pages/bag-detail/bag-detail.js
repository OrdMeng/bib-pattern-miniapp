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
  }
});
