function getParts(num) {
  let integerPart = Math.trunc(num);
  let decimalPart = Math.abs(num - integerPart);

  return {
    integerPart: integerPart,
    decimalPart: decimalPart
  };
}

export default getParts;