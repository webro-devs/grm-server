const partiyaDateSort = (data) => {
  data.forEach((item) => {
    item.date = new Date(item.date);
  });

  const res = [];
  let currentDate = null;
  let currentGroup = null;

  data.forEach((item) => {
    const itemDate = item.date.toISOString().substr(0, 10);
    if (itemDate !== currentDate) {
      currentGroup = { date: itemDate, items: [] };
      res.push(currentGroup);
      currentDate = itemDate;
    }
    currentGroup.items.push(item);
  });

  return res;
};

export default partiyaDateSort;
