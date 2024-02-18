function paginateArray(array, page, limit) {
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  console.log(array.length);

  return array.slice(startIndex, endIndex);
}

export default paginateArray;
