Page({
  openCategory(event) {
    const category = event.currentTarget.dataset.category;
    if (category === "baby") {
      wx.navigateTo({ url: "/pages/baby/baby" });
    } else if (category === "toy") {
      wx.navigateTo({ url: "/pages/toy/toy" });
    } else if (category === "bags") {
      wx.navigateTo({ url: "/pages/bags/bags" });
    } else if (category === "dictionary") {
      wx.navigateTo({ url: "/pages/dictionary/dictionary" });
    } else if (category === "beginner-guide") {
      wx.navigateTo({ url: "/pages/beginner-guide/beginner-guide" });
    }
  }
});
