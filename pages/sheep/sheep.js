Page({
  previewImage(event) {
    const image = event.currentTarget.dataset.src;
    wx.previewImage({ current: image, urls: [image] });
  }
});
