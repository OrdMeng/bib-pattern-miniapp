const petalBibPatternPdf = require("../utils/petal-bib-pattern-pdf");

Page({
  data: {
    steps: [
      { title: "打印并确认纸样", note: "PDF 为 1 页 A4，选择实际大小 / 100% 打印；先检查页面中的 5cm 比例和领口标注。" },
      { title: "按对折线裁剪主体", note: "沿点划线对折布料，按粗实线裁剪主体；纸样中的主体裁片标注为 2 片。" },
      { title: "标记缝纫明线和经向", note: "细虚线是缝纫明线，箭头表示面料经向；裁剪前把这些标记转到布料上。" },
      { title: "缝合花瓣外轮廓", note: "沿领口和花瓣外轮廓缝合，弧线位置放慢速度，翻转后逐段整理花瓣边缘。" },
      { title: "安装按扣并检查", note: "按 PDF 的按扣符号对齐两侧位置，完成后检查领口弧长、开合方向和贴合度。" }
    ]
  },

  previewImage(event) {
    this.showRemoteImage(event.currentTarget.dataset.src);
  },

  previewPattern() {
    this.showRemoteImage("https://sewing-1303601055.cos.ap-beijing.myqcloud.com/assets/petal-bib-pattern.png");
  },

  downloadPattern() {
    const filePath = `${wx.env.USER_DATA_PATH}/petal-bib-pattern.pdf`;
    wx.showLoading({ title: "准备纸样" });

    wx.getFileSystemManager().writeFile({
      filePath,
      data: petalBibPatternPdf,
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
  },

  showRemoteImage(source) {
    wx.previewImage({ current: source, urls: [source] });
  }
});
