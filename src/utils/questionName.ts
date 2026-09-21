export const calculateNumberAnswer = (num: number) => {
  if (num <= 35) {
    return `${num}`;
  } else {
    const aorb = num % 2 == 0 ? "a" : "b";
    return `${Math.round((num - 35) / 2) + 35}${aorb}`;
  }
};
