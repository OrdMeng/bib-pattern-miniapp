Page({
  openItem(event) {
    const item = event.currentTarget.dataset.item;
    if (item === "petal-bib") {
      wx.navigateTo({ url: "/subpackages/patterns/petal-bib/petal-bib" });
    } else if (item === "sunhat") {
      wx.navigateTo({ url: "/pages/sunhat/sunhat" });
    } else if (item === "vest") {
      wx.navigateTo({ url: "/subpackages/patterns/vest/vest" });
    } else if (item === "bee-vest") {
      wx.navigateTo({ url: "/subpackages/patterns/bee-vest/bee-vest" });
    }
  }
});
