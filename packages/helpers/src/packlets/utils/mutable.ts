export const removeFromArray = <T>(arr: T[], item: T): T[] => {
  const index = arr.indexOf(item);
  if (index > -1) {
    arr.splice(index, 1);
  }
  return arr;
};
