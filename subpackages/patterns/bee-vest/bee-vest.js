const beeVestPatternPdf = require("../utils/bee-vest-pattern-pdf");

Page({
  data: {
    steps: [
      { title: "打印并拼接纸样", note: "共 9 页 A4，选择实际尺寸 / 100% 打印；先用纸样上的校准标记确认比例。" },
      { title: "裁剪表布、里布与铺棉", note: "按纸样标注裁剪前片、后片和装饰裁片，留意左右前片方向。" },
      { title: "完成装饰", note: "先贴布或绣好挖掘机、小蜜蜂等图案，再处理口袋和其他装饰，成品会更平整。" },
      { title: "缝合肩部和侧缝", note: "表布与里布分别完成肩部、侧缝，再按纸样方向预留侧开扣位置。" },
      { title: "处理领口、袖笼和下摆", note: "沿边缘包边或翻到里布，缝一圈固定；弧线处剪小牙口，翻转后更服帖。" },
      { title: "安装侧开扣", note: "对齐左右前片的扣位，逐个安装按扣，最后试穿检查开合和活动量。" }
    ]
  },

  previewImage(event) {
    const image = event.currentTarget.dataset.src;
    wx.previewImage({ current: image, urls: [image] });
  },

  openPattern() {
    const filePath = `${wx.env.USER_DATA_PATH}/bee-vest-side-snap-6m-1y.pdf`;
    wx.showLoading({ title: "准备纸样" });

    wx.getFileSystemManager().writeFile({
      filePath,
      data: beeVestPatternPdf,
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
