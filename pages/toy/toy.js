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
    } else if (category === "sheep") {
      wx.navigateTo({ url: "/pages/sheep/sheep" });
    } else if (category === "hippo") {
      wx.navigateTo({ url: "/pages/hippo/hippo" });
    } else if (category === "owl") {
      wx.navigateTo({ url: "/pages/owl/owl" });
    } else if (category === "deer") {
      wx.navigateTo({ url: "/pages/deer/deer" });
    } else if (category === "polar-bear") {
      wx.navigateTo({ url: "/pages/polar-bear/polar-bear" });
    }
  }
});
