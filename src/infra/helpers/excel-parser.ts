const excelDataParser = async (data) => {
  const transformedObj = data.reduce((acc, curr) => {
    const { Collection, Model, Size, Color, Code, Count, Img, M2 } = curr;
    const datas = {
      Size,
      Color,
      Code,
      Count,
      Img,
      price: 0,
      commingPrice: 0,
      shape: '',
      style: '',
      model: '',
      filial: '',
    };

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

      collectionItem.totalM2 = (collectionItem.totalM2 || 0) + M2;
    } else {
      acc.push({
        title: Collection,
        models: [
          {
            title: Model,
            products: [datas],
          },
        ],
        totalM2: M2,
      });
    }

    return acc;
  }, []);

  return transformedObj;
};

export default excelDataParser;
