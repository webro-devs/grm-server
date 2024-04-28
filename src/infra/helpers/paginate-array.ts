function  paginateArray(array, page, limit) {
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;

  // @ts-ignore
  return array.sort((a: { date: string | number | Date; }, b: { date: string | number | Date; }) => new Date(b.date) - new Date(a.date)).slice(startIndex, endIndex);
}

export default paginateArray;
