const excelDataParser = (products, rasxod) => {
  let fullKv = 0;

  products = products.map((prod) => {
    const [width, height] = prod.size.title.match(/\d+\.*\d*/g);
    const kvInNumber = (width / 100) * (height / 100) * (prod?.count || 1);
    fullKv += kvInNumber;
    return { ...prod, kvInNumber };
  });
  const rasxodNaKv = rasxod / fullKv;

  const res = products.reduce((acc, curr) => {
    const kv = (acc?.[curr?.collection]?.kv || 0) + curr?.kvInNumber;
    return {
      ...acc,
      [curr?.collection]: {
        id: curr?.collection.id,
        title: curr?.collection.title,
        kv,
        rasxod: rasxodNaKv * kv,
        summ: curr?.collectionPrice * kv,
        models: {
          ...(acc?.[curr?.collection]?.models || []),
          [curr?.model]: {
            id: curr?.model.id,
            title: curr?.model.title,
            costMeter: curr?.displayPrice,
            kv:
              (acc?.[curr?.collection]?.models?.[curr?.model]?.kv || 0) +
              curr?.kvInNumber,
            cost: rasxodNaKv + curr?.collectionPrice,
            products: [
              ...(acc?.[curr?.collection]?.models?.[curr?.model]?.products ||
                []),
              curr,
            ],
          },
        },
      },
    };
  }, {});

  const result = Object.keys(res).map((coll) => {
    return {
      ...res[coll],
      models: Object.keys(res[coll]?.models).map((model) => ({
        ...res?.[coll]?.models?.[model],
      })),
    };
  });

  return result;
};

export default excelDataParser;
