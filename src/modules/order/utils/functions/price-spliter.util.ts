function getParts(num) {
  let integerPart = Math.trunc(num);
  let decimalPart = Number( "0." + String(num).split('.')[1]) || 0;

  return {
    integerPart: integerPart,
    decimalPart: decimalPart
  };
}

export default getParts;