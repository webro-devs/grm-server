function paginateArray(array, page, limit) {
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;

  return array.slice(startIndex, endIndex);
}

export default paginateArray;
