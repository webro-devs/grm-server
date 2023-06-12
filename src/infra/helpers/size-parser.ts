const sizeParser = (item) => {
  const regex = /\d+\.*\d*/g;
  const matches = item.match(regex);
  if (matches) {
    console.log(matches.map((match) => parseFloat(match)));

    return matches.map((match) => parseFloat(match));
  }
  return [];
};

export default sizeParser;
