export const angelToRadian = (angleInDegrees: number) => {
  "worklet";
  return ((angleInDegrees - 90) * Math.PI) / 180;
};

export const polarToCartesian = (
  centerX: number,
  centerY: number,
  radius: number,
  angleInDegrees: number,
) => {
  "worklet";
  const angleInRadians = angelToRadian(angleInDegrees);

  return [
    centerX + radius * Math.cos(angleInRadians),
    centerY + radius * Math.sin(angleInRadians),
  ];
};

export const segmentPath = (
  x: number,
  y: number,
  r0: number,
  r1: number,
  d0: number,
  d1: number,
) => {
  const arc = Math.abs(d0 - d1) > 180 ? 1 : 0;
  const point = (radius: number, degree: number) =>
    polarToCartesian(x, y, radius, degree)
      .map((n) => n.toPrecision(5))
      .join(",");

  const start = -90 + d0;
  const end = -90 + d1;

  return [
    `M${point(r0, start)}`,
    `A${r0},${r0},0,${arc},1,${point(r0, end)}`,
    `L${point(r1, end)}`,
    `A${r1},${r1},0,${arc},0,${point(r1, start)}`,
    "Z",
  ].join("");
};

export const segmentPathLinear = (
  x: number,
  y: number,
  width: number,
  height: number,
) => {
  const point = (x: number, y: number) =>
    [x, y].map((n) => n.toPrecision(5)).join(",");

  return [
    `M${point(x, y)}`,
    `L${point(x + width, y)}`,
    `L${point(x + width, y + height)}`,
    `L${point(x, y + height)}`,
    "Z",
  ].join("");
};

export const circlePath = (
  x: number,
  y: number,
  radius: number,
  startAngle: number,
  endAngle: number,
) => {
  "worklet";
  const [startX, startY] = polarToCartesian(x, y, radius, endAngle * 0.9999);
  const [endX, endY] = polarToCartesian(x, y, radius, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
  const d = [
    "M",
    startX,
    startY,
    "A",
    radius,
    radius,
    0,
    largeArcFlag,
    0,
    endX,
    endY,
  ];
  return d.join(" ");
};
