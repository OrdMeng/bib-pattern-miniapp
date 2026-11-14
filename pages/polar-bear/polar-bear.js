Page({
  data: {
    patterns: [
      { src: "/assets/polar-bear-pattern-1.jpeg", label: "头部裁片" },
      { src: "/assets/polar-bear-pattern-2.jpeg", label: "身体侧片" },
      { src: "/assets/polar-bear-pattern-3.jpeg", label: "腹部裁片" },
      { src: "/assets/polar-bear-pattern-4.jpeg", label: "内腿与尾巴" }
    ]
  },

  previewImage(event) {
    const image = event.currentTarget.dataset.src;
    const urls = ["/assets/polar-bear-cover.jpeg"].concat(this.data.patterns.map((item) => item.src));
    wx.previewImage({ current: image, urls });
  }
});
