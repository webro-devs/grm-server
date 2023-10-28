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
      collection_exp = 0,
      model_cost = 0,
      shape,
      style,
      filial = '',
      price,
      commingPrice = 0,
      priceMeter = 0,
      id,
    } = curr;
    const datas = {
      id,
      size,
      color,
      code,
      count,
      imgUrl,
      price,
      commingPrice,
      shape,
      style,
      filial,
      m2,
      otherImgs,
      priceMeter,
    };

    const collectionItem = acc.find(
      (item) => item.title === model.collection.title,
    );

    if (collectionItem) {
      const modelItem = collectionItem.models.find(
        (item) => item.title === model.title,
      );

      if (modelItem) {
        modelItem.products.push(datas);
        collectionItem.collection_m += m2;
        collectionItem.collection_cost += priceMeter;
      } else {
        collectionItem.models.push({
          id: model.id,
          title: model.title,
          cost: model_cost,
          products: [datas],
        });
        collectionItem.collection_m += m2;
        collectionItem.collection_cost += priceMeter;
      }
    } else {
      acc.push({
        id: model.collection.id,
        title: model.collection.title,
        collection_cost: priceMeter,
        collection_exp,
        collection_m: m2,
        models: [
          {
            id: model.id,
            title: model.title,
            cost: model_cost,
            products: [datas],
          },
        ],
      });
    }

    return acc;
  }, []);

  return transformedObj;
};

export default excelDataParser;
