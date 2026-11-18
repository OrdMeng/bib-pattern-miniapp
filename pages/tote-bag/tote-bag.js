const hoboPatternPdf = require("../../utils/hobo-pattern-pdf");

Page({
  data: {
    coverImage: "../../assets/tote-reference.png",
    patternImages: [
      "../../assets/hobo-pattern-1.png",
      "../../assets/hobo-pattern-2.png"
    ],
    facts: [
      { label: "纸样", value: "A01-a / A01-b / A01-c" },
      { label: "裁片", value: "a、b、c 各 4 片" },
      { label: "面料", value: "资料建议牛仔面料" }
    ],
    materials: [
      { name: "表布", note: "按纸样裁 A01-a、b、c，各 4 片" },
      { name: "里布", note: "按对应包身裁片准备，想做轻薄款可省略" },
      { name: "定型辅料", note: "薄铺棉或布衬，按面料厚度选择" },
      { name: "工具", note: "缝纫机、剪刀、直尺、珠针或夹子、熨斗" }
    ],
    steps: [
      { title: "按 100% 比例打印", note: "PDF 纸样按 A4 打印，关闭缩放。每页边缘保留完整，不要用“适合页面”缩小。" },
      { title: "拼合 a、b、c 三块", note: "沿纸样上的拼接线把三块接成完整纸样，先对齐直边和定位线，再固定纸胶带。" },
      { title: "裁剪并标记", note: "A01-a、A01-b、A01-c 各裁 4 片；标出中心线、对称点和拼接顺序。纸样未标缝份时，外沿统一加约 1cm。" },
      { title: "拼合包面", note: "按 a→b→c 的顺序缝合包面，左右两组保持对称。每完成一道缝都从反面压平，再检查弧线是否顺滑。" },
      { title: "处理袋口和提手弧线", note: "沿袋口、提手内外弧线慢速车缝；弧度处剪牙口或分段夹剪，但不要剪到缝线。" },
      { title: "组装里布并翻面", note: "有里布时，先分别完成表布和里布，再把袋口正面对正缝合，留返口后翻到正面并熨平。" },
      { title: "压线与加固", note: "袋口压明线，提手根部和弧线两端来回加固。最后修剪线头，检查两侧高度和开口是否平整。" }
    ]
  },

  previewCover() {
    wx.previewImage({ current: this.data.coverImage, urls: [this.data.coverImage] });
  },

  previewPattern(event) {
    const index = Number(event.currentTarget.dataset.index);
    const current = this.data.patternImages[index] || this.data.patternImages[0];
    wx.previewImage({ current, urls: this.data.patternImages });
  },

  openPattern() {
    const filePath = `${wx.env.USER_DATA_PATH}/hobo-tote-pattern.pdf`;
    wx.showLoading({ title: "准备纸样" });

    wx.getFileSystemManager().writeFile({
      filePath,
      data: hoboPatternPdf,
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
