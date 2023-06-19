const ExcelDataParser = async (data) => {
  const transformedObj = data.reduce((acc, curr) => {
    const { Collection, Model, Size, Color, Code, Count, Img } = curr;
    const datas = { Size, Color, Code, Count, Img };

    const collectionItem = acc.find((item) => item.title === Collection);

    if (collectionItem) {
      const modelItem = collectionItem.models.find(
        (item) => item.title === Model,
      );

      if (modelItem) {
        modelItem.products.push(datas);
      } else {
        collectionItem.models.push({
          title: Model,
          products: [datas],
        });
      }
    } else {
      acc.push({
        title: Collection,
        models: [
          {
            title: Model,
            products: [datas],
          },
        ],
      });
    }

    return acc;
  }, []);

  return transformedObj;
};

export default ExcelDataParser;
