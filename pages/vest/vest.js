const vestPatternPdf = require("../../utils/vest-pattern-pdf");

Page({
  data: {
    steps: [
      { title: "打印并拼接纸样", note: "共 9 页 A4，按实际尺寸打印；对齐纸样边线后依次拼接。" },
      { title: "裁剪表布和里布", note: "按纸样上的前片、后片和领口部件标注裁剪，注意左右前片方向。" },
      { title: "先完成前片装饰", note: "在合拢衣身前缝好小熊贴布和口袋，方便压线并保持正面平整。" },
      { title: "缝合肩部和侧边", note: "分别拼合表布与里布，缝合前先确认对襟方向和领口位置。" },
      { title: "整理领口、袖笼和下摆", note: "按纸样结构包边或翻合边缘，弧线位置细心修剪后再翻整。" },
      { title: "安装前襟扣件", note: "对齐左右前片的扣位安装扣件，试合确认前襟平整、开合顺畅。" }
    ]
  },

  previewImage(event) {
    const image = event.currentTarget.dataset.src;
    wx.previewImage({ current: image, urls: [image] });
  },

  openPattern() {
    const filePath = `${wx.env.USER_DATA_PATH}/vest-pattern-6m-1y.pdf`;
    wx.showLoading({ title: "准备纸样" });

    wx.getFileSystemManager().writeFile({
      filePath,
      data: vestPatternPdf,
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
