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
      collection_cost,
      collection_exp,
      collection_m,
      model_cost,
      shape,
      style,
      filial,
      price,
      commingPrice,
    } = curr;
    const datas = {
      size,
      color,
      code,
      count,
      imgUrl,
      price: price ? price : 0,
      commingPrice: commingPrice ? commingPrice : 0,
      shape: shape ? shape : '',
      style: style ? style : '',
      filial: filial ? filial : '',
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
          cost: model_cost,
          products: [datas],
        });
      }

      collectionItem.totalM2 = (collectionItem.totalM2 || 0) + m2;
    } else {
      acc.push({
        title: collection,
        collection_cost,
        collection_exp,
        collection_m,
        models: [
          {
            title: model,
            cost: model_cost,
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
