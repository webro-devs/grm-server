const excelDataParser = (data) => {
  const transformedObj = data.reduce((acc, curr) => {
    const {
      collection,
      model,
      size,
      color,
      code,
      count,
      imgUrl,
      m2,
      otherImgs = [],
    } = curr;
    const datas = {
      size,
      color,
      code,
      count,
      imgUrl,
      price: 0,
      commingPrice: 0,
      shape: '',
      style: '',
      filial: '',
      m2,
      otherImgs,
    };

    const collectionItem = acc.find((item) => item.title === collection);

    if (collectionItem) {
      const modelItem = collectionItem.models.find(
        (item) => item.title === model,
      );

      if (modelItem) {
        modelItem.products.push(datas);
      } else {
        collectionItem.models.push({
          title: model,
          products: [datas],
        });
      }

      collectionItem.totalM2 = (collectionItem.totalM2 || 0) + m2;
    } else {
      acc.push({
        title: collection,
        models: [
          {
            title: model,
            products: [datas],
          },
        ],
        totalM2: m2,
      });
    }

    return acc;
  }, []);

  return transformedObj;
};

export default excelDataParser;
