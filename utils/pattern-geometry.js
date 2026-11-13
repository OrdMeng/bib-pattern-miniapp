const TAU = Math.PI * 2;

const STYLE_LIST = [
  { id: "triangle", label: "三角巾" },
  { id: "bib", label: "围兜款" },
  { id: "petal", label: "花瓣款" },
  { id: "o", label: "O型款-new" }
];

const DEFAULTS = {
  kind: "o",
  neck: 30,
  seam: true,
  length: 10,
  width: 5,
  count: 4,
  size: 2.5,
  overlap: 2.5
};

const PARAMS = {
  length: { label: "围兜长度", min: 4, max: 30, step: 0.5, unit: "cm" },
  width: { label: "围兜宽度", min: 2, max: 12, step: 0.5, unit: "cm" },
  oWidth: { label: "围兜宽度", min: 3, max: 10, step: 0.5, unit: "cm" },
  count: { label: "花瓣总数", min: 0, max: 8, step: 1, unit: "个" },
  oCount: { label: "花瓣总数", min: 0, max: 16, step: 1, unit: "个" },
  size: { label: "花瓣大小", min: 1.2, max: 4, step: 0.1, unit: "cm" },
  overlap: { label: "搭片交叠量", min: 2, max: 3, step: 0.5, unit: "cm" }
};

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function round(value) {
  return Number(value.toFixed(4));
}

function normalize(point) {
  const length = Math.hypot(point[0], point[1]);
  return length ? [point[0] / length, point[1] / length] : [0, 0];
}

function subtract(a, b) {
  return [a[0] - b[0], a[1] - b[1]];
}

function cross(a, b) {
  return a[0] * b[1] - a[1] * b[0];
}

function signedArea(points) {
  return points.reduce((area, point, index) => {
    const next = points[(index + 1) % points.length];
    return area + point[0] * next[1] - next[0] * point[1];
  }, 0) / 2;
}

function arcPoints(radius, start, end, samples) {
  const points = [];
  for (let index = 0; index <= samples; index += 1) {
    const angle = start + (end - start) * index / samples;
    points.push([radius * Math.cos(angle), radius * Math.sin(angle)]);
  }
  return points;
}

function cubicPoints(start, control1, control2, end, samples) {
  const points = [];
  for (let index = 0; index <= samples; index += 1) {
    const t = index / samples;
    const u = 1 - t;
    points.push([
      u ** 3 * start[0] + 3 * u * u * t * control1[0] + 3 * u * t * t * control2[0] + t ** 3 * end[0],
      u ** 3 * start[1] + 3 * u * u * t * control1[1] + 3 * u * t * t * control2[1] + t ** 3 * end[1]
    ]);
  }
  return points;
}

function scallopRadius(theta, count, size) {
  if (!count) return 0;
  return size * (1 - Math.cos(2 * count * theta)) / 2;
}

function makeOuterArc(radiusX, radiusY, count, size) {
  const samples = Math.max(64, count * 18);
  const points = [];
  for (let index = 0; index <= samples; index += 1) {
    const theta = Math.PI * index / samples;
    const petal = scallopRadius(theta, count, size);
    points.push([(radiusX + petal) * Math.cos(theta), (radiusY + petal) * Math.sin(theta)]);
  }
  return points;
}

function oNeckArcPoints(radius, openingHalfAngle, samples) {
  const points = [];
  const start = Math.PI * 1.5 - openingHalfAngle;
  const end = -Math.PI * 0.5 + openingHalfAngle;
  for (let index = 0; index <= samples; index += 1) {
    const angle = start + (end - start) * index / samples;
    points.push([radius * Math.cos(angle), radius * Math.sin(angle)]);
  }
  return points;
}

function lineIntersection(pointA, directionA, pointB, directionB) {
  const denominator = cross(directionA, directionB);
  if (Math.abs(denominator) < 1e-7) return null;
  const distance = cross(subtract(pointB, pointA), directionB) / denominator;
  return [pointA[0] + directionA[0] * distance, pointA[1] + directionA[1] * distance];
}

function offsetPolygon(points, distance) {
  const direction = signedArea(points) >= 0 ? 1 : -1;
  const result = [];
  for (let index = 0; index < points.length; index += 1) {
    const previous = points[(index - 1 + points.length) % points.length];
    const current = points[index];
    const next = points[(index + 1) % points.length];
    const incoming = normalize(subtract(current, previous));
    const outgoing = normalize(subtract(next, current));
    const normalIn = [direction * incoming[1], direction * -incoming[0]];
    const normalOut = [direction * outgoing[1], direction * -outgoing[0]];
    const first = [current[0] + normalIn[0] * distance, current[1] + normalIn[1] * distance];
    const second = [current[0] + normalOut[0] * distance, current[1] + normalOut[1] * distance];
    const intersection = lineIntersection(first, incoming, second, outgoing);
    if (!intersection || Math.hypot(intersection[0] - current[0], intersection[1] - current[1]) > distance * 4) {
      result.push(first, second);
    } else {
      result.push(intersection);
    }
  }
  return result;
}

function segmentsCross(a, b, c, d) {
  const orient = (p, q, r) => cross(subtract(q, p), subtract(r, p));
  const ab1 = orient(a, b, c);
  const ab2 = orient(a, b, d);
  const cd1 = orient(c, d, a);
  const cd2 = orient(c, d, b);
  return ab1 * ab2 < -1e-8 && cd1 * cd2 < -1e-8;
}

function contourSelfCrosses(points) {
  for (let i = 0; i < points.length; i += 1) {
    const a = points[i];
    const b = points[(i + 1) % points.length];
    for (let j = i + 2; j < points.length; j += 1) {
      if (i === 0 && j === points.length - 1) continue;
      if (segmentsCross(a, b, points[j], points[(j + 1) % points.length])) return true;
    }
  }
  return false;
}

function contoursCross(first, second) {
  for (let i = 0; i < first.length; i += 1) {
    const a = first[i];
    const b = first[(i + 1) % first.length];
    for (let j = 0; j < second.length; j += 1) {
      if (segmentsCross(a, b, second[j], second[(j + 1) % second.length])) return true;
    }
  }
  return false;
}

function pointInPolygon(point, points) {
  let inside = false;
  for (let i = 0, j = points.length - 1; i < points.length; j = i, i += 1) {
    const [x1, y1] = points[i];
    const [x2, y2] = points[j];
    const crosses = (y1 > point[1]) !== (y2 > point[1])
      && point[0] < (x2 - x1) * (point[1] - y1) / (y2 - y1) + x1;
    if (crosses) inside = !inside;
  }
  return inside;
}

function distanceToContour(point, points) {
  let minimum = Infinity;
  for (let index = 0; index < points.length; index += 1) {
    const start = points[index];
    const end = points[(index + 1) % points.length];
    const dx = end[0] - start[0];
    const dy = end[1] - start[1];
    const denominator = dx * dx + dy * dy || 1;
    const amount = clamp(((point[0] - start[0]) * dx + (point[1] - start[1]) * dy) / denominator, 0, 1);
    minimum = Math.min(minimum, Math.hypot(point[0] - start[0] - amount * dx, point[1] - start[1] - amount * dy));
  }
  return minimum;
}

function findInteriorMarker(points, minX, maxX, minY, maxY) {
  let best = null;
  for (let xStep = 0; xStep <= 24; xStep += 1) {
    const x = minX + (maxX - minX) * xStep / 24;
    for (let yStep = 0; yStep <= 16; yStep += 1) {
      const y = minY + (maxY - minY) * yStep / 16;
      const candidate = [x, y];
      if (!pointInPolygon(candidate, points)) continue;
      const clearance = distanceToContour(candidate, points);
      if (!best || clearance > best.clearance) best = { x, y, clearance };
    }
  }
  return best || { x: (minX + maxX) / 2, y: (minY + maxY) / 2, clearance: 0 };
}

function polygonBounds(points, padding) {
  const xs = points.map((point) => point[0]);
  const ys = points.map((point) => point[1]);
  const minX = Math.min.apply(null, xs) - padding;
  const maxX = Math.max.apply(null, xs) + padding;
  const minY = Math.min.apply(null, ys) - padding;
  const maxY = Math.max.apply(null, ys) + padding;
  return { minX, maxX, minY, maxY, width: maxX - minX, height: maxY - minY };
}

function angleBetween(first, second) {
  const firstLength = Math.hypot(first[0], first[1]);
  const secondLength = Math.hypot(second[0], second[1]);
  if (!firstLength || !secondLength) return 0;
  const cosine = clamp((first[0] * second[0] + first[1] * second[1]) / (firstLength * secondLength), -1, 1);
  return Math.acos(cosine) * 180 / Math.PI;
}

function carrotOutline(state) {
  const width = state.width;
  const length = state.length;
  const bodyLeft = -width / 2 - 4;
  const bodyRight = width / 2 - 4;
  const topY = -length / 2;
  const tipY = length / 2;
  const bodyTop = cubicPoints(
    [bodyLeft, topY],
    [bodyLeft + width * 0.3, topY - 1.2],
    [bodyRight - width * 0.3, topY - 1.2],
    [bodyRight, topY],
    24
  );
  const body = [...bodyTop, [0 - 4, tipY]];
  const leftTop = body[0];
  const rightTop = body[body.length - 2];
  const tip = body[body.length - 1];
  const leftSide = [leftTop[0] - tip[0], leftTop[1] - tip[1]];
  const rightSide = [rightTop[0] - tip[0], rightTop[1] - tip[1]];
  const leafWidth = Math.max(4, width * 0.62);
  const leafHeight = Math.max(7, length * 0.44);
  const leafX = width / 2 + leafWidth / 2 + 1;
  const leafBottom = length / 2;
  const radius = leafWidth / 2;
  const leaf = [
    [leafX - radius, leafBottom],
    [leafX - radius, leafBottom - leafHeight + radius],
    ...arcPoints(radius, Math.PI, Math.PI * 2, 32).map((point) => [point[0] + leafX, point[1] + leafBottom - leafHeight + radius]),
    [leafX + radius, leafBottom]
  ];
  const pieces = [
    { points: body, count: "1片", label: "主体" },
    { points: leaf, count: "6片", label: "叶片" }
  ].map((piece) => ({
    ...piece,
    seamPoints: state.seam ? offsetPolygon(piece.points, 1) : []
  }));
  const allPoints = pieces.flatMap((piece) => state.seam ? piece.seamPoints : piece.points);
  return {
    pieces,
    carrotTip: {
      point: tip,
      leftTop,
      rightTop,
      angle: angleBetween(leftSide, rightSide),
      leftSideLength: Math.hypot(leftSide[0], leftSide[1]),
      rightSideLength: Math.hypot(rightSide[0], rightSide[1])
    },
    carrotLeaf: {
      width: leafWidth,
      height: leafHeight,
      left: leafX - radius,
      right: leafX + radius,
      top: leafBottom - leafHeight,
      bottom: leafBottom
    },
    bounds: polygonBounds(allPoints, 1),
    valid: true,
    outlineInvalid: false,
    seamInvalid: false,
    markerInvalid: false,
    error: "",
    carrot: true
  };
}

function lensPoints(centerX, centerY, width, length, bulge) {
  const top = [centerX, centerY - length / 2];
  const bottom = [centerX, centerY + length / 2];
  const side = width * bulge;
  return [
    ...cubicPoints(top, [centerX + side, top[1] + length * 0.24], [centerX + side, bottom[1] - length * 0.24], bottom, 28),
    ...cubicPoints(bottom, [centerX - side, bottom[1] - length * 0.24], [centerX - side, top[1] + length * 0.24], top, 28).slice(1, -1)
  ];
}

function capsulePoints(centerX, centerY, width, length) {
  const radius = width / 2;
  const straight = Math.max(0, length - width);
  const topCenterY = centerY - straight / 2;
  const bottomCenterY = centerY + straight / 2;
  return [
    ...arcPoints(radius, 0, -Math.PI, 24).map((point) => [point[0] + centerX, point[1] + topCenterY]),
    ...arcPoints(radius, Math.PI, 0, 24).map((point) => [point[0] + centerX, point[1] + bottomCenterY]).slice(1)
  ];
}

function appleOutline(state) {
  const appleLength = 14.17;
  const appleWidth = 4.99;
  const leafLength = 4.72;
  const leafWidth = 2.7;
  const appleX = -4.5;
  const leafX = appleX + appleWidth / 2 + leafWidth / 2 + 3;
  const pieces = [
    { points: lensPoints(appleX, 0, appleWidth, appleLength, 2 / 3), count: "6片", label: "苹果片" },
    { points: lensPoints(leafX, 0, leafWidth, leafLength, 2 / 3), count: "2片", label: "叶子" }
  ].map((piece) => ({
    ...piece,
    seamPoints: state.seam ? offsetPolygon(piece.points, 1) : []
  }));
  const allPoints = pieces.flatMap((piece) => state.seam ? piece.seamPoints : piece.points);
  return {
    pieces,
    apple: { x: appleX, length: appleLength, width: appleWidth },
    bounds: polygonBounds(allPoints, 1),
    valid: true,
    outlineInvalid: false,
    seamInvalid: false,
    markerInvalid: false,
    error: "",
    isFruitPattern: true
  };
}

function frogOutline(state) {
  const headX = -7;
  const headY = -15;
  const headWidth = 20;
  const headHeight = 14;
  const headLeft = [headX - headWidth / 2, headY + 2];
  const headTop = [headX, headY - headHeight / 2];
  const headRight = [headX + headWidth / 2, headY + 2];
  const head = [
    ...cubicPoints(headLeft, [headX - headWidth * 0.3, headY - 2], [headX - headWidth * 0.2, headTop[1]], headTop, 16),
    ...cubicPoints(headTop, [headX + headWidth * 0.2, headTop[1]], [headX + headWidth * 0.3, headY - 2], headRight, 16).slice(1),
    ...cubicPoints(headRight, [headX + headWidth * 0.65, headY + 8], [headX - headWidth * 0.65, headY + 8], headLeft, 24).slice(1, -1)
  ];
  const headGuide = cubicPoints(
    [headX - headWidth * 0.47, headY + 1.5],
    [headX - headWidth * 0.2, headY + 6],
    [headX - headWidth * 0.2, headY - 4],
    [headX, headY - 3],
    16
  ).concat(cubicPoints(
    [headX, headY - 3],
    [headX + headWidth * 0.2, headY - 4],
    [headX + headWidth * 0.2, headY + 6],
    [headX + headWidth * 0.47, headY + 1.5],
    16
  ).slice(1));

  const bodyX = -7;
  const bodyTop = -3;
  const body = [
    [bodyX - 6, bodyTop], [bodyX + 6, bodyTop],
    ...cubicPoints([bodyX + 6, bodyTop], [bodyX + 10, bodyTop + 8], [bodyX + 10, bodyTop + 16], [bodyX + 8, bodyTop + 20], 16).slice(1),
    ...cubicPoints([bodyX + 8, bodyTop + 20], [bodyX + 6, bodyTop + 23], [bodyX + 1, bodyTop + 21], [bodyX + 2, bodyTop + 17], 12).slice(1),
    ...cubicPoints([bodyX + 2, bodyTop + 17], [bodyX + 3, bodyTop + 12], [bodyX - 3, bodyTop + 12], [bodyX - 2, bodyTop + 17], 12).slice(1),
    ...cubicPoints([bodyX - 2, bodyTop + 17], [bodyX - 1, bodyTop + 21], [bodyX - 6, bodyTop + 23], [bodyX - 8, bodyTop + 20], 12).slice(1),
    ...cubicPoints([bodyX - 8, bodyTop + 20], [bodyX - 10, bodyTop + 16], [bodyX - 10, bodyTop + 8], [bodyX - 6, bodyTop], 16).slice(1)
  ];

  const overallsX = 8;
  const overallsY = 30;
  const overallsWidth = 23;
  const overallsHeight = 14;
  const overallsLeft = overallsX - overallsWidth / 2;
  const overallsRight = overallsX + overallsWidth / 2;
  const overallsTop = overallsY - overallsHeight / 2;
  const overallsBottom = overallsY + overallsHeight / 2;
  const overalls = [
    [overallsX - 5, overallsTop],
    [overallsX + 5, overallsTop],
    ...cubicPoints([overallsX + 5, overallsTop], [overallsX + 8, overallsTop + 5], [overallsRight - 1, overallsY - 1], [overallsRight, overallsY + 1], 12).slice(1),
    ...cubicPoints([overallsRight, overallsY + 1], [overallsRight + 2, overallsY + 5], [overallsRight + 2, overallsBottom - 1], [overallsRight, overallsBottom], 12).slice(1),
    [overallsX + 1.2, overallsBottom],
    [overallsX + 0.5, overallsY + 2],
    [overallsX - 0.5, overallsY + 2],
    [overallsX - 1.2, overallsBottom],
    ...cubicPoints([overallsLeft, overallsBottom], [overallsLeft - 2, overallsBottom - 1], [overallsLeft - 2, overallsY + 5], [overallsLeft, overallsY + 1], 12).slice(1),
    ...cubicPoints([overallsLeft, overallsY + 1], [overallsLeft + 1, overallsY - 1], [overallsX - 8, overallsTop + 5], [overallsX - 5, overallsTop], 12).slice(1)
  ];

  const pieces = [
    { points: head, guides: [headGuide], count: "2片", label: "头" },
    { points: body, count: "2片", label: "身体" },
    { points: arcPoints(4.1, 0, TAU, 48).map((point) => [point[0] + 9, point[1] + headY]), count: "2片", label: "眼皮" },
    { points: arcPoints(3.3, 0, TAU, 48).map((point) => [point[0] + 13, point[1] + 5]), count: "2片", label: "眼球" },
    { points: capsulePoints(6.5, 5, 4.5, 13), count: "4片", label: "胳膊" },
    { points: overalls, count: "2片", label: "背带裤" }
  ].map((piece) => ({
    ...piece,
    seamPoints: state.seam ? offsetPolygon(piece.points, 1) : []
  }));
  const allPoints = pieces.flatMap((piece) => state.seam ? piece.seamPoints : piece.points);
  return {
    pieces,
    bounds: polygonBounds(allPoints, 1),
    valid: true,
    outlineInvalid: false,
    seamInvalid: false,
    markerInvalid: false,
    error: "",
    isFruitPattern: false
  };
}

function persimmonOutline(state) {
  const fruitWidth = 5.5;
  const fruitLength = 9.1;
  const fruitX = -7;
  const fruitY = -8;
  const topLeft = [fruitX - fruitWidth / 2, fruitY - fruitLength / 2 + 0.35];
  const topRight = [fruitX + fruitWidth / 2, fruitY - fruitLength / 2 + 0.35];
  const fruit = [
    ...cubicPoints(topLeft, [fruitX - fruitWidth * 0.2, topLeft[1] + 1.05], [fruitX + fruitWidth * 0.2, topRight[1] + 1.05], topRight, 20),
    ...cubicPoints(topRight, [fruitX + fruitWidth * 0.72, fruitY - 1], [fruitX + fruitWidth * 0.62, fruitY + fruitLength * 0.28], [fruitX, fruitY + fruitLength / 2], 24).slice(1),
    ...cubicPoints([fruitX, fruitY + fruitLength / 2], [fruitX - fruitWidth * 0.62, fruitY + fruitLength * 0.28], [fruitX - fruitWidth * 0.72, fruitY - 1], topLeft, 24).slice(1, -1)
  ];

  const leafWidth = 4.6;
  const leafLength = 4;
  const leafX = 6;
  const leafY = -8;
  const leafLeft = [leafX - leafWidth / 2, leafY - leafLength / 2 + 0.2];
  const leafRight = [leafX + leafWidth / 2, leafY - leafLength / 2 + 0.2];
  const leaf = [
    ...cubicPoints(leafLeft, [leafX - leafWidth * 0.2, leafLeft[1] + 0.7], [leafX + leafWidth * 0.2, leafRight[1] + 0.7], leafRight, 16),
    ...cubicPoints(leafRight, [leafX + leafWidth * 0.62, leafY], [leafX + leafWidth * 0.5, leafY + 1.2], [leafX, leafY + leafLength / 2], 18).slice(1),
    ...cubicPoints([leafX, leafY + leafLength / 2], [leafX - leafWidth * 0.5, leafY + 1.2], [leafX - leafWidth * 0.62, leafY], leafLeft, 18).slice(1, -1)
  ];

  const calyxRadius = 4;
  const calyxX = 1;
  const calyxY = 11;
  const calyx = arcPoints(calyxRadius, 0, TAU, 64).slice(0, -1).map((point) => [point[0] + calyxX, point[1] + calyxY]);
  const pieces = [
    { points: fruit, count: "4片", label: "果实" },
    { points: leaf, count: "8片", label: "叶子" },
    {
      points: calyx,
      count: "1片",
      label: "果蒂",
      solidGuides: [
        [[calyxX - calyxRadius, calyxY], [calyxX + calyxRadius, calyxY]]
      ]
    }
  ].map((piece) => ({
    ...piece,
    seamPoints: state.seam ? offsetPolygon(piece.points, 1) : []
  }));
  const allPoints = pieces.flatMap((piece) => state.seam ? piece.seamPoints : piece.points);
  return {
    pieces,
    bounds: polygonBounds(allPoints, 1),
    valid: true,
    outlineInvalid: false,
    seamInvalid: false,
    markerInvalid: false,
    error: "",
    isFruitPattern: true
  };
}

function triangleOutline(state) {
  const neck = state.neck / 2 + 1;
  const depth = state.neck * 0.7;
  const points = [
    [0, -depth / 2],
    [neck / 2, -depth * 0.15],
    [neck / 2, depth * 0.15],
    [0, depth / 2],
    [-neck / 2, depth * 0.15],
    [-neck / 2, -depth * 0.15]
  ];
  return { points, neck, depth, fold: 0 };
}

function outlineFor(state) {
  if (state.kind === "triangle") {
    const triangle = triangleOutline(state);
    return Object.assign(triangle, { bounds: polygonBounds(triangle.points, 1), oStyle: false });
  }

  let neck = state.kind === "o" ? (state.neck + 3) / TAU : (state.neck + 1) / Math.PI;
  const width = state.width;
  const overlap = state.kind === "o" ? state.overlap : 2.5;
  const count = state.kind === "bib" ? 2 : state.kind === "petal" || state.kind === "o" ? state.count : 0;
  const petal = count ? state.kind === "bib" ? 2.5 : state.size : 0;
  const outerX = neck + width;
  const hasLength = state.kind === "bib" || state.kind === "petal";
  const outerY = hasLength ? neck + state.length : outerX;

  if (state.kind === "o") {
    const openingHalfAngle = Math.min(0.72, Math.max(0.32, overlap / neck));
    neck = (state.neck + 3) / (TAU - 2 * openingHalfAngle);
    const adjustedOuterX = neck + width;
    const innerArc = oNeckArcPoints(neck, openingHalfAngle, 180);
    const outerArc = makeOuterArc(adjustedOuterX, adjustedOuterX, count, petal);
    const rightNeckEnd = innerArc[innerArc.length - 1];
    const leftNeckEnd = innerArc[0];
    const joinHandle = Math.min(1.5, overlap * 0.5);
    const shoulderHeight = adjustedOuterX * 0.82;
    const rightShoulder = cubicPoints(
      rightNeckEnd,
      [rightNeckEnd[0] - joinHandle * Math.cos(openingHalfAngle), rightNeckEnd[1] - joinHandle * Math.sin(openingHalfAngle)],
      [adjustedOuterX, -shoulderHeight],
      [adjustedOuterX, 0],
      64
    );
    const leftShoulder = cubicPoints(
      [-adjustedOuterX, 0],
      [-adjustedOuterX, -shoulderHeight],
      [leftNeckEnd[0] + joinHandle * Math.cos(openingHalfAngle), leftNeckEnd[1] - joinHandle * Math.sin(openingHalfAngle)],
      leftNeckEnd,
      64
    );
    const points = [
      ...innerArc,
      ...rightShoulder.slice(1),
      ...outerArc.slice(1),
      ...leftShoulder.slice(1, -1)
    ];
    const rightCrown = points.reduce((top, point) => (
      point[0] > 0 && point[1] < top[1] ? point : top
    ), [0, Infinity]);
    let button = findInteriorMarker(
      points,
      rightCrown[0] - 0.55,
      rightCrown[0] + 0.55,
      rightCrown[1] + 0.45,
      rightCrown[1] + 1.3
    );
    if (button.clearance < 0.55) {
      button = findInteriorMarker(
        points,
        rightCrown[0] - 1.5,
        rightCrown[0] + 1.5,
        rightCrown[1] + 0.45,
        rightCrown[1] + 2.5
      );
    }
    return {
      points,
      bounds: polygonBounds(points, 1),
      neck,
      neckArc: state.neck + 3,
      depth: width,
      outerX: adjustedOuterX,
      outerY: adjustedOuterX,
      topY: -shoulderHeight,
      hasLength: false,
      count,
      tab: overlap,
      oStyle: true,
      lockX: button.x,
      lockY: button.y,
      lockClearance: button.clearance
    };
  }

  const innerArc = arcPoints(neck, Math.PI, 0, 96);
  const outerArc = makeOuterArc(outerX, outerY, count, petal);
  const tabTop = -2.4;
  const points = [
    ...innerArc,
    [neck, tabTop],
    [outerX, tabTop],
    [outerX, 0],
    ...outerArc.slice(1),
    [-outerX, tabTop],
    [-neck, tabTop]
  ];
  return {
    points,
    bounds: polygonBounds(points, 1),
    neck,
    neckArc: state.neck + 1,
    depth: hasLength ? state.length : width,
    outerX,
    outerY,
    topY: tabTop,
    hasLength,
    count,
    tab: Math.min(3, width),
    oStyle: false
  };
}

function calculatePattern(state) {
  if (state.kind === "carrot") return carrotOutline(state);
  if (state.kind === "apple") return appleOutline(state);
  if (state.kind === "frog") return frogOutline(state);
  if (state.kind === "persimmon") return persimmonOutline(state);
  const details = outlineFor(state);
  const outlineInvalid = state.kind === "o" && contourSelfCrosses(details.points);
  const seamPoints = state.seam ? offsetPolygon(details.points, 1) : [];
  const seamInvalid = state.seam && !outlineInvalid && (
    contoursCross(details.points, seamPoints) || contourSelfCrosses(seamPoints)
  );
  const markerInvalid = state.kind === "o" && (!Number.isFinite(details.lockClearance) || details.lockClearance < 0.4);
  return Object.assign(details, {
    seamPoints,
    valid: !outlineInvalid && !seamInvalid && !markerInvalid,
    outlineInvalid,
    seamInvalid,
    markerInvalid,
    error: outlineInvalid
      ? "当前脖围与围兜宽度无法形成不自交的 O 型轮廓，请增大围兜宽度后再生成。"
      : markerInvalid
        ? "纽扣位置过于靠近轮廓，请调整 O 型围兜宽度或搭片交叠量。"
        : seamInvalid
          ? "当前参数会使 1cm 缝份线交叉，请调整围兜宽度或花瓣参数。"
          : ""
  });
}

function format(value) {
  return Number.isInteger(Number(value)) ? String(Number(value)) : Number(value).toFixed(1).replace(/\.0$/, "");
}

function getReadout(state, details) {
  if (state.kind === "apple") {
    return "苹果片 14.17 × 4.99cm（6片） · 叶子 4.72 × 2.70cm（2片）";
  }
  if (state.kind === "frog") {
    return "头 2片 · 身体 2片 · 眼皮 2片 · 眼球 2片 · 胳膊 4片 · 背带裤 2片";
  }
  if (state.kind === "persimmon") {
    return "果实 9.1 × 5.5cm（4片） · 叶子 4 × 4.6cm（8片） · 果蒂直径 8cm（1片）";
  }
  if (state.kind === "carrot") {
    return `主体 1片 · 叶片 6片 · 叶片 ${details.carrotLeaf.width.toFixed(1)} × ${details.carrotLeaf.height.toFixed(1)}cm · 尖角 ${details.carrotTip.angle.toFixed(1)}° · 左边 ${details.carrotTip.leftSideLength.toFixed(1)}cm · 右边 ${details.carrotTip.rightSideLength.toFixed(1)}cm`;
  }
  if (state.kind === "triangle") {
    return `成品领口 ${format(state.neck / 2 + 1)} cm · 中心前长 ${format(state.neck * 0.7)} cm`;
  }
  const neckArc = state.neck + (state.kind === "o" ? 3 : 1);
  if (state.kind === "o") return `领口弧长 ${format(neckArc)} cm · 交叠 ${format(state.overlap)} cm`;
  if (state.kind === "petal") return `领口弧长 ${format(neckArc)} cm · 花瓣总数 ${format(state.count)} 瓣`;
  return `领口弧长 ${format(neckArc)} cm · 成品长度 ${format(state.length)} cm · 花瓣总数 ${format(details.count)} 瓣`;
}

module.exports = {
  DEFAULTS,
  PARAMS,
  STYLE_LIST,
  calculatePattern,
  format,
  getReadout,
  offsetPolygon,
  polygonBounds
};
