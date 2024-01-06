const excelDataParser = (products, rasxod) => {
  let fullKv = 0;

  products = products.map((prod) => {
    const [width, height] = prod.size?.title?.match(/\d+\.*\d*/g) || [0, 0];
    const kvInNumber = (width / 100) * (height / 100) * (prod?.count || 0);
    fullKv += kvInNumber;
    return { ...prod, kvInNumber };
  });

  const rasxodNaKv = rasxod / fullKv;

  const res = products.reduce((acc, curr) => {
    const collectionTitle = curr?.collection?.title || null;
    const modelTitle = curr?.model?.title || null;

    const collection = acc[collectionTitle] || {
      id: curr.collection.id,
      title: collectionTitle,
      kv: 0,
      rasxod: 0,
      summ: 0,
      cost: curr.collectionPrice || 0,
      models: {},
    };

    const model = collection.models[modelTitle] || {
      id: curr.model.id,
      title: modelTitle,
      costMeter: curr.displayPrice || 0,
      kv: 0,
      cost: curr.collectionPrice || 0,
      products: [],
    };

    const kv = collection.kv + curr.kvInNumber;
    const modelKv = model.kv + curr.kvInNumber;

    collection.models[modelTitle] = {
      ...model,
      kv: modelKv,
      cost: rasxodNaKv + curr.collectionPrice || 0,
      products: [...model.products, curr],
    };

    return {
      ...acc,
      [collectionTitle]: {
        ...collection,
        kv,
        rasxod: rasxodNaKv * kv || 0,
        summ: curr.collectionPrice * kv || 0,
        models: {
          ...collection.models,
          [modelTitle]: collection.models[modelTitle],
        },
      },
    };
  }, {});

  const result = Object.keys(res).map((coll) => {
    return {
      ...res[coll],
      models: Object.values(res[coll].models),
    };
  });

  return result;
};

export default excelDataParser;
