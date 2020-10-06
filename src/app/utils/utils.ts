export const computeTva = (price: number | undefined) => {
  return (((price || 0) * 5.5) / 100).toFixed(2);
};
