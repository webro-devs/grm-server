const partiyaDateSort = (data) => {
  let res = [];
  let uniqueDate = [...new Set(data.map((d) => d.date))];
  for (let i = 0, j = 0; i < uniqueDate.length; i++) {
    let d = { date: uniqueDate[i], items: [] };
    for (let k = j; k < data.length; k++) {
      if (data[k].date == uniqueDate[i]) {
        d.items.push(data[k]);
        if (k == data.length - 1) {
          res.push(d);
        }
      } else {
        j = k;
        res.push(d);
        break;
      }
    }
  }
  return res;
};

export default partiyaDateSort;
