const bagImages = require("../../utils/bag-images");

const bagItems = [
  {
    id: "tote",
    kind: "guide",
    title: "托特包",
    cover: "../../assets/tote-reference.png"
  },
  {
    id: "mini",
    kind: "image",
    title: "手提迷你包",
    image: bagImages[0]
  }
];

Page({
  data: {
    bagItems,
    bagCount: bagItems.length
  },

  openBag(event) {
    const kind = event.currentTarget.dataset.kind;
    const url = kind === "guide" ? "/pages/tote-bag/tote-bag" : "/pages/mini-bag/mini-bag";
    wx.navigateTo({ url });
  },

  handleImageError(event) {
    const index = Number(event.currentTarget.dataset.index);
    if (!Number.isInteger(index) || !this.data.bagItems[index] || this.data.bagItems[index].kind !== "image") return;
    if (this.data.bagItems[index].image === "../../assets/mini-bag.jpg") return;
    this.setData({ [`bagItems[${index}].image`]: "../../assets/mini-bag.jpg" });
  },

  openGuide() {
    wx.navigateTo({ url: "/pages/bag-guide/bag-guide" });
  }
});
