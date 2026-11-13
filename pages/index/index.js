const geometry = require("../../utils/pattern-geometry");
const renderer = require("../../utils/pattern-renderer");

Page({
  data: {
    styles: geometry.STYLE_LIST,
    paramsConfig: geometry.PARAMS,
    kind: geometry.DEFAULTS.kind,
    kindLabel: "O型款-new",
    neck: geometry.DEFAULTS.neck,
    seam: geometry.DEFAULTS.seam,
    length: geometry.DEFAULTS.length,
    width: geometry.DEFAULTS.width,
    count: geometry.DEFAULTS.count,
    size: geometry.DEFAULTS.size,
    overlap: geometry.DEFAULTS.overlap,
    isCarrot: false,
    isApple: false,
    isFrog: false,
    isPersimmon: false,
    readout: "",
    feedback: "",
    feedbackType: "",
    patternValid: true,
    canvasDescription: "",
    isExporting: false
  },

  onReady() {
    this.initCanvas();
  },

  onLoad(options) {
    if (options && options.kind === "carrot") {
      this.setData({
        kind: "carrot",
        kindLabel: "胡萝卜纸样",
        isCarrot: true,
        length: 18,
        width: 12
      });
      wx.setNavigationBarTitle({ title: "胡萝卜纸样" });
    } else if (options && options.kind === "apple") {
      this.setData({ kind: "apple", kindLabel: "苹果纸样", isApple: true });
      wx.setNavigationBarTitle({ title: "苹果纸样" });
    } else if (options && options.kind === "frog") {
      this.setData({ kind: "frog", kindLabel: "小青蛙纸样", isFrog: true });
      wx.setNavigationBarTitle({ title: "小青蛙纸样" });
    } else if (options && options.kind === "persimmon") {
      this.setData({ kind: "persimmon", kindLabel: "柿子纸样", isPersimmon: true });
      wx.setNavigationBarTitle({ title: "柿子纸样" });
    }
  },

  initCanvas() {
    const query = wx.createSelectorQuery();
    query.select("#patternCanvas").fields({ node: true, size: true }).exec((result) => {
      const item = result && result[0];
      if (!item || !item.node) {
        this.setFeedback("Canvas 初始化失败，请重新打开页面。", "error");
        return;
      }
      const dpr = wx.getWindowInfo ? wx.getWindowInfo().pixelRatio : wx.getSystemInfoSync().pixelRatio;
      this.canvasNode = item.node;
      this.canvasContext = item.node.getContext("2d");
      this.canvasWidth = item.width;
      this.canvasHeight = item.height;
      this.pixelRatio = dpr || 1;
      item.node.width = item.width * this.pixelRatio;
      item.node.height = item.height * this.pixelRatio;
      if (this.data.isFrog || this.data.isPersimmon) {
        const image = item.node.createImage();
        image.onload = () => {
          if (this.data.isFrog) this.frogReferenceImage = image;
          if (this.data.isPersimmon) this.persimmonReferenceImage = image;
          this.renderPattern();
        };
        image.onerror = () => this.setFeedback(
          this.data.isPersimmon ? "柿子纸样图片加载失败，请重新打开页面。" : "青蛙纸样图片加载失败，请重新打开页面。",
          "error"
        );
        image.src = this.data.isPersimmon ? "/assets/persimmon-pattern.jpg" : "/assets/frog-pattern.jpg";
        return;
      }
      this.renderPattern();
    });
  },

  getState() {
    return {
      kind: this.data.kind,
      neck: Number(this.data.neck),
      seam: Boolean(this.data.seam),
      length: Number(this.data.length),
      width: Number(this.data.width),
      count: Number(this.data.count),
      size: Number(this.data.size),
      overlap: Number(this.data.overlap),
      referenceImage: this.data.isPersimmon
        ? this.persimmonReferenceImage || null
        : this.frogReferenceImage || null
    };
  },

  renderPattern() {
    if (!this.canvasContext || !this.canvasNode) return;
    const state = this.getState();
    const details = geometry.calculatePattern(state);
    const ctx = this.canvasContext;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, this.canvasNode.width, this.canvasNode.height);
    ctx.scale(this.pixelRatio, this.pixelRatio);
    renderer.drawPattern(ctx, this.canvasWidth, this.canvasHeight, state, details);
    this.setData({
      readout: geometry.getReadout(state, details),
      patternValid: details.valid,
      canvasDescription: this.data.isPersimmon
        ? "柿子原图纸样，包含果实4片、叶子8片和果蒂1片，图片已预留1厘米缝份。"
        : this.data.isFrog
        ? "小青蛙纸样，显示用户提供的原始纸样图片；该图片没有尺寸标尺，请打印前自行校准。"
        : this.data.isApple
        ? "苹果纸样，包含6片苹果主体和2片叶子，绿色实线为裁剪线，灰色虚线为1厘米缝份，包含5厘米比例尺。"
        : this.data.isCarrot
        ? "胡萝卜纸样，包含1片主体和6片叶片，标注尖角角度及左右边长，绿色实线为裁剪线，灰色虚线为1厘米缝份，包含5厘米比例尺。"
        : `${this.data.kindLabel}，${state.neck}厘米脖围，绿色实线为成品线，灰色虚线为1厘米缝份，包含5厘米比例尺。`
    });
    if (details.error) this.setFeedback(details.error, "error");
    else if (this.data.feedbackType === "error") this.clearFeedback();
  },

  setFeedback(message, type) {
    this.setData({ feedback: message, feedbackType: type || "" });
  },

  clearFeedback() {
    this.setData({ feedback: "", feedbackType: "" });
  },

  selectKind(event) {
    const kind = event.currentTarget.dataset.kind;
    const style = geometry.STYLE_LIST.find((item) => item.id === kind);
    if (!style) return;
    const previous = this.getState();
    const defaults = Object.assign({}, geometry.DEFAULTS, { kind });
    this.setData({
      kind,
      kindLabel: style.label,
      neck: previous.neck,
      seam: previous.seam,
      length: defaults.length,
      width: kind === "o" ? 5 : defaults.width,
      count: kind === "bib" ? 2 : kind === "triangle" ? 0 : defaults.count,
      size: defaults.size,
      overlap: defaults.overlap,
      feedback: "",
      feedbackType: ""
    }, () => this.renderPattern());
  },

  changeSlider(event) {
    const key = event.currentTarget.dataset.key;
    const value = Number(event.detail.value);
    if (!key || !Number.isFinite(value)) return;
    this.setData({ [key]: value, feedback: "", feedbackType: "" }, () => this.renderPattern());
  },

  changeNeck(event) {
    const raw = String(event.detail.value || "").trim();
    const value = Number(raw);
    if (!raw || !Number.isFinite(value) || value < 20 || value > 50 || Math.round(value * 2) !== value * 2) {
      this.setFeedback("脖围请输入20–50cm，且以0.5cm为步进。", "error");
      return;
    }
    this.setData({ neck: value, feedback: "", feedbackType: "" }, () => this.renderPattern());
  },

  toggleSeam(event) {
    this.setData({ seam: Boolean(event.detail.value), feedback: "", feedbackType: "" }, () => this.renderPattern());
  },

  handleBack() {
    wx.navigateBack({ delta: 1 });
  },

  handleMore() {
    wx.showActionSheet({
      itemList: ["查看当前参数", "使用说明"],
      success: (result) => {
        if (result.tapIndex === 0) {
          const state = this.getState();
          this.setFeedback(`当前为${this.data.kindLabel}，脖围 ${state.neck}cm。`, "info");
        } else {
          wx.showModal({
            title: "使用说明",
            content: "调整参数后纸样会即时更新。打印前请确认5cm校准框，并按100%比例输出。",
            showCancel: false
          });
        }
      }
    });
  },

  handleSave() {
    this.exportPattern("save");
  },

  handlePrint() {
    this.exportPattern("print");
  },

  exportPattern(action) {
    if (this.data.isExporting) return;
    const state = this.getState();
    const details = geometry.calculatePattern(state);
    if (!details.valid) {
      this.setFeedback(details.error || "当前纸样参数无效，请调整后再导出。", "error");
      return;
    }
    if (!this.canvasNode || !this.canvasContext) {
      this.setFeedback("纸样还在生成，请稍后再试。", "error");
      return;
    }
    this.setData({ isExporting: true, feedback: "正在生成图片，请稍候...", feedbackType: "info" });
    wx.canvasToTempFilePath({
      canvas: this.canvasNode,
      fileType: "png",
      quality: 1,
      destWidth: Math.round(this.canvasWidth * this.pixelRatio),
      destHeight: Math.round(this.canvasHeight * this.pixelRatio),
      success: (result) => {
        if (action === "print") {
          this.setData({ isExporting: false });
          wx.showModal({
            title: "打印图片已生成",
            content: "请保存高清图片后，以100%实际大小打印，并用5cm校准框检查比例。",
            confirmText: "保存图片",
            success: (modalResult) => {
              if (modalResult.confirm) this.saveToAlbum(result.tempFilePath);
              else this.clearExportFeedback();
            }
          });
        } else {
          this.saveToAlbum(result.tempFilePath);
        }
      },
      fail: (error) => {
        this.setData({ isExporting: false });
        this.setFeedback("图片生成失败，请稍后重试。", "error");
      }
    }, this);
  },

  saveToAlbum(filePath) {
    this.setData({ isExporting: true, feedback: "正在保存到相册，请稍候...", feedbackType: "info" });
    wx.saveImageToPhotosAlbum({
      filePath,
      success: () => {
        this.setData({ isExporting: false });
        this.setFeedback("图片已保存到相册。", "info");
        wx.showToast({ title: "已保存到相册", icon: "success", duration: 1800 });
      },
      fail: (error) => {
        this.setData({ isExporting: false });
        if (error && /auth deny|authorize denied|permission denied/i.test(error.errMsg || "")) {
          wx.showModal({
            title: "需要相册权限",
            content: "请允许保存图片到相册，授权后即可继续保存。",
            confirmText: "去设置",
            success: (result) => {
              if (result.confirm) wx.openSetting();
            }
          });
        } else {
          this.setFeedback("保存失败，请检查相册权限后重试。", "error");
        }
      }
    });
  },

  clearExportFeedback() {
    if (this.data.feedback === "正在生成图片，请稍候..." || this.data.feedback === "正在保存到相册，请稍候...") {
      this.setFeedback("", "");
    }
  }
});
