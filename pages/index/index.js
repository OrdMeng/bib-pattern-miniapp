const savePatternImages = require("../../utils/pattern-image-download");

const patternData = {
  carrot: {
    title: "胡萝卜纸样",
    subtitle: "主体 1片 · 叶片 6片",
    coverImage: "https://sewing-1303601055.cos.ap-beijing.myqcloud.com/assets/carrot-result.jpg",
    patternImage: "https://sewing-1303601055.cos.ap-beijing.myqcloud.com/assets/carrot-pattern.png",
    note: "A4 竖版，打印时请选择“实际大小”或“100%”。"
  },
  apple: {
    title: "苹果纸样",
    subtitle: "苹果片 6片 · 叶子 2片",
    coverImage: "https://sewing-1303601055.cos.ap-beijing.myqcloud.com/assets/apple-result.png",
    patternImage: "https://sewing-1303601055.cos.ap-beijing.myqcloud.com/assets/apple-result.jpg",
    note: "纸样图含苹果主体和叶片裁片，打印前请按 A4 100% 比例输出。"
  },
  frog: {
    title: "小青蛙纸样",
    subtitle: "头 · 身体 · 眼皮 · 眼球 · 胳膊 · 背带裤",
    coverImage: "https://sewing-1303601055.cos.ap-beijing.myqcloud.com/assets/frog-result.jpg",
    patternImage: "https://sewing-1303601055.cos.ap-beijing.myqcloud.com/assets/frog-pattern.jpg",
    note: "原图纸样没有尺寸标尺，打印前请先自行校准比例。"
  },
  persimmon: {
    title: "柿子纸样",
    subtitle: "果实 4片 · 叶子 8片 · 果蒂 1片",
    coverImage: "https://sewing-1303601055.cos.ap-beijing.myqcloud.com/assets/persimmon-result.jpg",
    patternImage: "https://sewing-1303601055.cos.ap-beijing.myqcloud.com/assets/persimmon-pattern.jpg",
    note: "原图纸样已预留缝份，打印前请按 A4 100% 比例输出。"
  }
};

Page({
  data: {
    kind: "carrot",
    title: patternData.carrot.title,
    subtitle: patternData.carrot.subtitle,
    coverImage: patternData.carrot.coverImage,
    patternImage: patternData.carrot.patternImage,
    note: patternData.carrot.note
  },

  onLoad(options) {
    const kind = options && patternData[options.kind] ? options.kind : "carrot";
    const item = patternData[kind];
    this.setData(Object.assign({ kind }, item));
    wx.setNavigationBarTitle({ title: item.title });
  },

  previewImage(event) {
    const image = event.currentTarget.dataset.src;
    wx.previewImage({ current: image, urls: [image] });
  },

  downloadPattern() {
    savePatternImages([this.data.patternImage]);
  }
});
