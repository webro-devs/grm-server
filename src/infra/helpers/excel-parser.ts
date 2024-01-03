const excelDataParser = (data, expense) => {
  let allM2 = 0;
  const transformedObj = data.reduce((acc, curr) => {
    const {
      id,
      code,
      size,
      plate,
      color,
      count,
      shape,
      style,
      model,
      imgUrl,
      otherImgs = [],
      collection,
      filial = '',
      commingPrice = 0,
      priceMeter = 0,
      secondPrice = 0,
      palette,
      country = 'пустой',
      isEdite = false,
    } = curr;
    const m2 =
      (eval(size.title.match(/\d+\.*\d*/g).join('*')) / 10000) * count || 0;
    allM2 += m2;

    const datas = {
      isEdite,
      id,
      size,
      color,
      code,
      count,
      imgUrl,
      commingPrice,
      shape,
      style,
      filial,
      plate,
      m2,
      otherImgs,
      priceMeter,
      secondPrice,
      price: (priceMeter + secondPrice) * m2,
      palette,
      country,
    };

    const collectionItem = acc.find((item) => item.title === collection.title);

    if (collectionItem) {
      const modelItem = collectionItem.models.find(
        (item) => item.title === model.title,
      );

      if (modelItem) {
        modelItem.m2 += m2;
        modelItem.products.push(datas);
        collectionItem.collection_m += m2;
      } else {
        collectionItem.models.push({
          id: model.id,
          title: model.title,
          cost: priceMeter,
          commingPrice: commingPrice,
          m2: m2,
          products: [datas],
        });
      }
      collectionItem.collection_m += m2;
    } else {
      acc.push({
        id: collection.id,
        title: collection.title,
        collection_cost: 0,
        collection_exp: 0,
        collection_m: m2,
        models: [
          {
            id: model.id,
            title: model.title,
            cost: priceMeter,
            commingPrice: commingPrice,
            m2: m2,
            products: [datas],
          },
        ],
      });
    }

    return acc;
  }, []);
  transformedObj.forEach((el, index) => {});

  return transformedObj;
};

export default excelDataParser;
