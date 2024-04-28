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

return transformedObj;
};

export default excelDataParser;
//
// const excelDataParser = (data) => {
//   const transformedObj = data.reduce((acc, curr) => {
//     const {
//       id,
//       code,
//       size,
//       plate,
//       color,
//       count,
//       shape,
//       style,
//       model,
//       imgUrl,
//       otherImgs = [],
//       collection,
//       filial = '',
//       commingPrice = 0,
//       priceMeter = 0,
//       secondPrice = 0,
//       country = 'пустой',
//       isEdite = false,
//     } = curr;
//
//     // Check if size data is valid
//     const sizeMatches = size && size.title.match(/\d+\.*\d*/g);
//     if (!sizeMatches) return acc;
//
//     // Calculate m2
//     const m2 = sizeMatches.reduce((acc, val) => acc * parseFloat(val), 1) / 10000 * count;
//
//     // Update total m2
//     acc.totalM2 += m2;
//
//     const datas = {
//       isEdite,
//       id,
//       size,
//       color,
//       code,
//       count,
//       imgUrl,
//       commingPrice,
//       shape,
//       style,
//       filial,
//       plate,
//       m2,
//       otherImgs,
//       priceMeter,
//       secondPrice,
//       price: (priceMeter + secondPrice) * m2,
//       country,
//     };
//
//     const collectionTitle = collection ? collection.title : null;
//     const modelTitle = model ? model.title : null;
//
//     let collectionItem = acc.collections[collectionTitle];
//     if (!collectionItem) {
//       collectionItem = {
//         id: collection ? collection.id : null,
//         title: collectionTitle,
//         collection_cost: 0,
//         collection_exp: 0,
//         collection_m: 0,
//         models: {},
//       };
//       acc.collections[collectionTitle] = collectionItem;
//     }
//
//     let modelItem = collectionItem.models[modelTitle];
//     if (!modelItem) {
//       modelItem = {
//         id: model ? model.id : null,
//         title: modelTitle,
//         cost: priceMeter,
//         commingPrice: commingPrice,
//         m2: 0,
//         products: [],
//       };
//       collectionItem.models[modelTitle] = modelItem;
//     }
//
//     modelItem.m2 += m2;
//     modelItem.products.push(datas);
//     collectionItem.collection_m += m2;
//
//     return acc;
//   }, { totalM2: 0, collections: {} });
//
//   transformedObj.totalM2 = Math.round(transformedObj.totalM2 * 100) / 100;
//
//   // Convert collections object to array
//   const transformedArray = Object.values(transformedObj.collections).map(collection => {
//     if (collection?.['models']) {
//       collection['models'] = Object.values(collection['models']);
//       return collection;
//     }
//   });
//
//   return transformedArray;
// };
//
// export default excelDataParser;

