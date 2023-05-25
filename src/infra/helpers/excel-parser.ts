const ExcelDataParser = (data) => {
  const transformedObj = data.reduce((acc, curr) => {
    const { Collection, Model, Size, Color, Code, Shape, Style, Count, M2 } =
      curr;

    const collectionItem = acc.find((item) => item.title === Collection);

    if (collectionItem) {
      const modelItem = collectionItem.models.find(
        (item) => item.title === Model,
      );

      if (modelItem) {
        modelItem.products.push({ Color, Count, Size, Code, Shape, Style, M2 });
      } else {
        collectionItem.models.push({
          title: Model,
          products: [{ Color, Count, Size, Code, Shape, Style, M2 }],
        });
      }
    } else {
      acc.push({
        title: Collection,
        models: [
          {
            title: Model,
            products: [{ Color, Count, Size, Code, Shape, Style, M2 }],
          },
        ],
      });
    }

    return acc;
  }, []);

  return transformedObj;
};

export default ExcelDataParser;
