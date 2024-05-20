function getParts(num) {
  let integerPart = Math.trunc(num);
  let decimalPart = +(String(num).split('.')[1]) || 0;

  return {
    integerPart: integerPart,
    decimalPart: decimalPart
  };
}

export default getParts;