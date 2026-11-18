const miniBagPatternPdf = require("../../utils/mini-bag-pattern-pdf");

Page({
  data: {
    coverImage: "https://sewing-1303601055.cos.ap-beijing.myqcloud.com/assets/mini-bag.jpg",
    fallbackImage: "../../assets/mini-bag.jpg",
    steps: [
      { title: "打印并确认纸样", note: "共 3 页 A4，选择实际大小打印，并用 PDF 页面上的 3×3cm 校准框检查比例。" },
      { title: "裁剪提手和包身", note: "按 PDF 标注裁剪提手表布 1 片、里布 1 片（均对折）；包身表布 2 片、里布 2 片。" },
      { title: "完成提手", note: "先缝合提手表布和里布，翻转后压平并整理两端，再连接到包身指定位置。" },
      { title: "缝合包身和里布", note: "分别完成表布和里布的弧形包身，按纸样标注预留内袋翻口，翻转后整理上口弧线。" },
      { title: "收口并压线", note: "关闭翻口，沿包口和提手边缘压线；需要装饰时，再按 PDF 的可选装饰带裁片制作。" }
    ]
  },

  previewImage() {
    const image = this.data.coverImage;
    if (/^https?:/.test(image)) {
      wx.previewImage({ current: image, urls: [image] });
      return;
    }
    wx.getImageInfo({
      src: image,
      success: (result) => wx.previewImage({ current: result.path, urls: [result.path] }),
      fail: () => wx.showToast({ title: "图片预览失败", icon: "none" })
    });
  },

  handleCoverError() {
    if (this.data.coverImage !== this.data.fallbackImage) this.setData({ coverImage: this.data.fallbackImage });
  },

  openPattern() {
    const filePath = `${wx.env.USER_DATA_PATH}/mini-handbag-23x15-5cm.pdf`;
    wx.showLoading({ title: "准备纸样" });

    wx.getFileSystemManager().writeFile({
      filePath,
      data: miniBagPatternPdf,
      encoding: "base64",
      success: () => {
        wx.openDocument({
          filePath,
          fileType: "pdf",
          showMenu: true,
          fail: () => wx.showToast({ title: "纸样打开失败", icon: "none" })
        });
      },
      fail: () => wx.showToast({ title: "纸样准备失败", icon: "none" }),
      complete: () => wx.hideLoading()
    });
  }
});
