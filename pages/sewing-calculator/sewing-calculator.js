const CALCULATORS = {
  elastic: {
    title: "松紧带长度",
    description: "按围度估算，最后请根据松紧度试戴调整。",
    fields: [{ key: "body", label: "实际围度", unit: "cm", placeholder: "例如 45" }, { key: "overlap", label: "接口重叠", unit: "cm", placeholder: "例如 2" }],
    resultLabel: "建议剪裁长度",
    formula: (values) => values.body * 0.85 + values.overlap
  },
  binding: {
    title: "包边条长度",
    description: "按需要包边的长度估算，并预留两端收口余量。",
    fields: [{ key: "edge", label: "需要包边的长度", unit: "cm", placeholder: "例如 60" }, { key: "allowance", label: "两端余量", unit: "cm", placeholder: "例如 3" }],
    resultLabel: "建议准备长度",
    formula: (values) => values.edge + values.allowance
  },
  circle: {
    title: "圆形底布周长",
    description: "输入圆形底布直径，计算侧围需要的基础长度。",
    fields: [{ key: "diameter", label: "底布直径", unit: "cm", placeholder: "例如 20" }],
    resultLabel: "圆周长度",
    formula: (values) => values.diameter * Math.PI
  }
};

Page({
  data: { active: "elastic", calculator: CALCULATORS.elastic, values: {}, result: "—" },

  switchCalculator(event) {
    const active = event.currentTarget.dataset.type;
    this.setData({ active, calculator: CALCULATORS[active], values: {}, result: "—" });
  },

  inputValue(event) {
    const key = event.currentTarget.dataset.key;
    this.setData({ [`values.${key}`]: event.detail.value });
  },

  calculate() {
    const values = {};
    this.data.calculator.fields.forEach((field) => { values[field.key] = parseFloat(this.data.values[field.key]) || 0; });
    if (!Object.values(values).some((value) => value > 0)) {
      wx.showToast({ title: "请先填写尺寸", icon: "none" });
      return;
    }
    const result = this.data.calculator.formula(values);
    this.setData({ result: result.toFixed(1) });
  }
});
