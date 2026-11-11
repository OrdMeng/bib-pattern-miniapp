Page({
  openCategory(event) {
    const category = event.currentTarget.dataset.category;
    if (category === "carrot") {
      wx.navigateTo({ url: "/pages/index/index?kind=carrot" });
    } else if (category === "apple") {
      wx.navigateTo({ url: "/pages/index/index?kind=apple" });
    } else if (category === "frog") {
      wx.navigateTo({ url: "/pages/index/index?kind=frog" });
    } else if (category === "persimmon") {
      wx.navigateTo({ url: "/pages/index/index?kind=persimmon" });
    }
  }
});
