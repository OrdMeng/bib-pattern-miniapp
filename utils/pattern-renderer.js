const geometry = require("./pattern-geometry");

const COLORS = {
  paper: "#fffefa",
  green: "#246346",
  seam: "#a5a69e",
  clay: "#9e603d",
  muted: "#827567"
};

function drawPolyline(ctx, points, close) {
  if (!points || !points.length) return;
  ctx.beginPath();
  ctx.moveTo(points[0][0], points[0][1]);
  for (let index = 1; index < points.length; index += 1) ctx.lineTo(points[index][0], points[index][1]);
  if (close) ctx.closePath();
  ctx.stroke();
}

function drawArrow(ctx, x1, y1, x2, y2) {
  const angle = Math.atan2(y2 - y1, x2 - x1);
  const size = 3;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x1 + Math.cos(angle + 0.55) * size, y1 + Math.sin(angle + 0.55) * size);
  ctx.moveTo(x1, y1);
  ctx.lineTo(x1 + Math.cos(angle - 0.55) * size, y1 + Math.sin(angle - 0.55) * size);
  ctx.moveTo(x2, y2);
  ctx.lineTo(x2 - Math.cos(angle + 0.55) * size, y2 - Math.sin(angle + 0.55) * size);
  ctx.moveTo(x2, y2);
  ctx.lineTo(x2 - Math.cos(angle - 0.55) * size, y2 - Math.sin(angle - 0.55) * size);
  ctx.stroke();
}

function drawLabel(ctx, text, x, y, align) {
  ctx.save();
  ctx.fillStyle = COLORS.clay;
  ctx.font = "12px sans-serif";
  ctx.textAlign = align || "left";
  ctx.textBaseline = "middle";
  ctx.fillText(text, x, y);
  ctx.restore();
}

function drawDimensions(ctx, state, details, scale, originX, originY) {
  if (state.kind === "triangle") return;
  const y = originY;
  const startX = originX + details.neck * scale;
  const endX = originX + details.outerX * scale;
  ctx.save();
  ctx.strokeStyle = COLORS.clay;
  ctx.lineWidth = 1;
  drawArrow(ctx, startX, y, endX, y);
  drawLabel(ctx, `围兜宽度 ${geometry.format(state.width)}cm`, endX + 8, y, "left");
  if (details.hasLength) {
    const startY = originY + details.neck * scale;
    const endY = originY + details.outerY * scale;
    drawArrow(ctx, originX, startY, originX, endY);
    drawLabel(ctx, `围兜长度 ${geometry.format(state.length)}cm`, originX + 8, (startY + endY) / 2, "left");
  }
  ctx.restore();
}

function drawScale(ctx, width, height, scale) {
  const size = 5 * scale;
  const x = width - size - 18;
  const y = height - size - 18;
  ctx.save();
  ctx.strokeStyle = COLORS.seam;
  ctx.lineWidth = 1;
  ctx.setLineDash([5, 3]);
  ctx.strokeRect(x, y, size, size);
  ctx.setLineDash([]);
  ctx.fillStyle = COLORS.muted;
  ctx.font = "12px sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("5cm", x + size / 2, y + size / 2);
  ctx.restore();
}

function drawPattern(ctx, width, height, state, details) {
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = COLORS.paper;
  ctx.fillRect(0, 0, width, height);
  const bounds = details.bounds;
  const scale = Math.min(12, (width - 110) / bounds.width, (height - 95) / bounds.height);
  const originX = width / 2;
  const originY = 36 - bounds.minY * scale;

  if (state.kind === "carrot" || state.kind === "apple" || state.kind === "frog" || state.kind === "persimmon") {
    const carrotScale = Math.min(12, (width - 76) / bounds.width, (height - 110) / bounds.height);
    const carrotOriginX = width / 2 - (bounds.minX + bounds.maxX) / 2 * carrotScale;
    const carrotOriginY = (height - bounds.height * carrotScale) / 2 - bounds.minY * carrotScale;
    ctx.save();
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    details.pieces.forEach((piece) => {
      if (state.seam) {
        ctx.strokeStyle = COLORS.seam;
        ctx.lineWidth = 1.2;
        ctx.setLineDash([5, 4]);
        drawPolyline(ctx, piece.seamPoints.map((point) => [carrotOriginX + point[0] * carrotScale, carrotOriginY + point[1] * carrotScale]), true);
        ctx.setLineDash([]);
      }
      ctx.strokeStyle = COLORS.green;
      ctx.lineWidth = 1.7;
      drawPolyline(ctx, piece.points.map((point) => [carrotOriginX + point[0] * carrotScale, carrotOriginY + point[1] * carrotScale]), true);
      if (piece.guides) {
        ctx.strokeStyle = COLORS.seam;
        ctx.lineWidth = 1.2;
        ctx.setLineDash([5, 4]);
        piece.guides.forEach((guide) => drawPolyline(ctx, guide.map((point) => [carrotOriginX + point[0] * carrotScale, carrotOriginY + point[1] * carrotScale]), false));
        ctx.setLineDash([]);
      }
      if (piece.solidGuides) {
        ctx.strokeStyle = COLORS.clay;
        ctx.lineWidth = 1;
        piece.solidGuides.forEach((guide) => drawPolyline(ctx, guide.map((point) => [carrotOriginX + point[0] * carrotScale, carrotOriginY + point[1] * carrotScale]), false));
      }
      const centerX = piece.points.reduce((sum, point) => sum + point[0], 0) / piece.points.length;
      const centerY = piece.points.reduce((sum, point) => sum + point[1], 0) / piece.points.length;
      ctx.fillStyle = COLORS.clay;
      ctx.font = state.kind === "frog" ? "10px sans-serif" : "13px sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      const labelOffset = state.kind === "apple" && piece.label === "苹果片" ? 30 : 0;
      ctx.fillText(piece.count, carrotOriginX + centerX * carrotScale, carrotOriginY + centerY * carrotScale + labelOffset);
      ctx.fillStyle = COLORS.muted;
      ctx.font = "11px sans-serif";
      ctx.fillText(piece.label, carrotOriginX + centerX * carrotScale, carrotOriginY + centerY * carrotScale + 18 + labelOffset);
    });
    if (state.kind === "carrot" || state.kind === "apple") {
      const widthLeft = state.kind === "apple" ? details.apple.x - details.apple.width / 2 : -state.width / 2 - 4;
      const widthRight = state.kind === "apple" ? details.apple.x + details.apple.width / 2 : state.width / 2 - 4;
      const widthY = state.kind === "apple" ? 0 : -state.length / 2 - 2.4;
      const widthStartX = carrotOriginX + widthLeft * carrotScale;
      const widthEndX = carrotOriginX + widthRight * carrotScale;
      const widthLineY = carrotOriginY + widthY * carrotScale;
      ctx.strokeStyle = COLORS.clay;
      ctx.lineWidth = 1;
      drawArrow(ctx, widthStartX, widthLineY, widthEndX, widthLineY);
      const widthLabel = state.kind === "apple"
        ? `最大宽度 ${details.apple.width.toFixed(2)}cm`
        : `最大宽度 ${geometry.format(state.width)}cm`;
      drawLabel(ctx, widthLabel, (widthStartX + widthEndX) / 2, widthLineY - 10, "center");
    }
    if (state.kind === "carrot") {
      const tip = details.carrotTip;
      const tipX = carrotOriginX + tip.point[0] * carrotScale;
      const tipY = carrotOriginY + tip.point[1] * carrotScale;
      const leftX = carrotOriginX + tip.leftTop[0] * carrotScale;
      const leftY = carrotOriginY + tip.leftTop[1] * carrotScale;
      const rightX = carrotOriginX + tip.rightTop[0] * carrotScale;
      const rightY = carrotOriginY + tip.rightTop[1] * carrotScale;
      const leftAngle = Math.atan2(leftY - tipY, leftX - tipX);
      const rightAngle = Math.atan2(rightY - tipY, rightX - tipX);
      const arcRadius = Math.max(10, Math.min(22, carrotScale * 1.6));
      ctx.strokeStyle = COLORS.clay;
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.arc(tipX, tipY, arcRadius, leftAngle, rightAngle);
      ctx.stroke();

      const leftMidX = (tipX + leftX) / 2 - 14;
      const leftMidY = (tipY + leftY) / 2;
      const rightMidX = (tipX + rightX) / 2 + 14;
      const rightMidY = (tipY + rightY) / 2;
      drawLabel(ctx, `左边 ${tip.leftSideLength.toFixed(1)}cm`, leftMidX, leftMidY, "right");
      drawLabel(ctx, `右边 ${tip.rightSideLength.toFixed(1)}cm`, rightMidX, rightMidY, "left");
      const angleMid = (leftAngle + rightAngle) / 2;
      drawLabel(
        ctx,
        `尖角 ${tip.angle.toFixed(1)}°`,
        tipX + Math.cos(angleMid) * (arcRadius + 17),
        tipY + Math.sin(angleMid) * (arcRadius + 17),
        "center"
      );

      const leaf = details.carrotLeaf;
      const leafLeftX = carrotOriginX + leaf.left * carrotScale;
      const leafRightX = carrotOriginX + leaf.right * carrotScale;
      const leafTopY = carrotOriginY + leaf.top * carrotScale;
      const leafBottomY = carrotOriginY + leaf.bottom * carrotScale;
      const leafWidthY = leafTopY - 12;
      const leafHeightX = leafRightX + 14;
      ctx.strokeStyle = COLORS.clay;
      ctx.lineWidth = 1;
      drawArrow(ctx, leafLeftX, leafWidthY, leafRightX, leafWidthY);
      drawLabel(ctx, `叶片宽 ${leaf.width.toFixed(1)}cm`, (leafLeftX + leafRightX) / 2, leafWidthY - 9, "center");
      drawArrow(ctx, leafHeightX, leafTopY, leafHeightX, leafBottomY);
      ctx.save();
      ctx.translate(leafHeightX + 10, (leafTopY + leafBottomY) / 2);
      ctx.rotate(Math.PI / 2);
      drawLabel(ctx, `叶片高 ${leaf.height.toFixed(1)}cm`, 0, 0, "center");
      ctx.restore();
    }
    if (state.kind === "apple") {
      const lengthX = carrotOriginX + (details.apple.x - details.apple.width / 2 - 1.8) * carrotScale;
      const lengthStartY = carrotOriginY - details.apple.length / 2 * carrotScale;
      const lengthEndY = carrotOriginY + details.apple.length / 2 * carrotScale;
      drawArrow(ctx, lengthX, lengthStartY, lengthX, lengthEndY);
      ctx.save();
      ctx.translate(lengthX - 10, (lengthStartY + lengthEndY) / 2);
      ctx.rotate(-Math.PI / 2);
      drawLabel(ctx, `长度 ${details.apple.length.toFixed(2)}cm`, 0, 0, "center");
      ctx.restore();
    }
    ctx.restore();
    drawScale(ctx, width, height, carrotScale);
    return;
  }

  function transform(points) {
    return points.map((point) => [originX + point[0] * scale, originY + point[1] * scale]);
  }

  ctx.save();
  ctx.lineJoin = "round";
  ctx.lineCap = "round";
  if (state.seam && details.valid) {
    ctx.strokeStyle = COLORS.seam;
    ctx.lineWidth = 1.2;
    ctx.setLineDash([5, 4]);
    drawPolyline(ctx, transform(details.seamPoints), true);
    ctx.setLineDash([]);
  }
  if (!details.outlineInvalid) {
    ctx.strokeStyle = COLORS.green;
    ctx.lineWidth = 1.7;
    drawPolyline(ctx, transform(details.points), true);
  }
  if (!details.outlineInvalid && (state.kind === "bib" || state.kind === "petal" || state.kind === "o")) {
    const lockX = details.oStyle ? details.lockX : (details.neck + details.outerX) / 2;
    const lockY = details.oStyle ? details.lockY : details.topY + 1;
    ctx.strokeStyle = COLORS.green;
    ctx.lineWidth = 1.6;
    [originX - lockX * scale, originX + lockX * scale].forEach((x) => {
      ctx.beginPath();
      ctx.arc(x, originY + lockY * scale, 4.5, 0, Math.PI * 2);
      ctx.stroke();
    });
    if (state.kind === "o") {
      ctx.fillStyle = COLORS.muted;
      ctx.font = "11px sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "bottom";
      ctx.fillText("纽扣位置", originX - lockX * scale, originY + lockY * scale - 8);
      ctx.fillText("纽扣位置", originX + lockX * scale, originY + lockY * scale - 8);
    }
  }
  if (state.kind === "triangle") {
    ctx.strokeStyle = COLORS.seam;
    ctx.lineWidth = 1.2;
    ctx.setLineDash([5, 4]);
    const neck = details.neck;
    ctx.beginPath();
    ctx.moveTo(originX - neck / 2 * scale, originY);
    ctx.lineTo(originX + neck / 2 * scale, originY);
    ctx.stroke();
    ctx.setLineDash([]);
  }
  drawDimensions(ctx, state, details, scale, originX, originY);
  ctx.restore();
  drawScale(ctx, width, height, scale);
}

module.exports = { drawPattern };
