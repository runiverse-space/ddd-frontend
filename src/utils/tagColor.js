// 태그 타입별 색상 정의
export const TAG_COLORS = {
  USER: {
    bg: "#F1E8FF", // 배경
    color: "#9A6DB1", // 글자색
    border: "#9A6DB1",
  },
  PROJECT: {
    bg: "#E8F1FF",
    color: "#4789B5",
    border: "#4789B5",
  },
  KNOWLEDGE: {
    bg: "#FFF5E8",
    color: "#D79B4D",
    border: "#D79B4D",
  },
  DEFAULT: {
    bg: "#E5E5E5",
    color: "#474747",
    border: "#474747",
  },
};

// tagType을 받아 색상 객체 반환
export function getTagColors(tagType) {
  const key = (tagType || "").toUpperCase();
  return TAG_COLORS[key] || TAG_COLORS.DEFAULT;
}
