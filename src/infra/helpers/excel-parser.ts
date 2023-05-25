const ExcelDataParser = (data) => {
  const transformedObj = data.reduce((acc, curr) => {
    const { collection, model, count, color } = curr;

    const collectionItem = acc.find((item) => item.title === collection);

    if (collectionItem) {
      const modelItem = collectionItem.items.find(
        (item) => item.title === model,
      );

      if (modelItem) {
        modelItem.items.push({ color, count });
      } else {
        collectionItem.items.push({ title: model, items: [{ color, count }] });
      }
    } else {
      acc.push({
        title: collection,
        items: [{ title: model, items: [{ color, count }] }],
      });
    }

    return acc;
  }, []);

  return transformedObj;
};

export default ExcelDataParser;
