import { InputProduct, OutputProduct } from '../interfaces/products.interface';

function convertInputToOutput(
  input: InputProduct[],
  expenseAll: number,
): OutputProduct[] {
  const collections: { [id: string]: OutputProduct } = {};
  let totalM2AllCollections = 0;
  input.forEach((inputProduct) => {
    const {
      collection,
      model,
      size,
      count,
      secondPrice,
      priceMeter,
      commingPrice,
      otherImgs,
    } = inputProduct;
    const m2 = eval(size.title.match(/\d+\.*\d*/g).join('*')) / 10000;
    // Track total m2 across all collections
    totalM2AllCollections += m2;

    if (!collections[collection.id]) {
      collections[collection.id] = {
        id: collection.id,
        title: collection.title,
        m2: 0,
        expense: 0,
        commingSum: 0,
        models: [],
      };
    }

    collections[collection.id].m2 += m2;

    const collectionOutput = collections[collection.id];

    const modelIndex = collectionOutput.models.findIndex(
      (m) => m.id === model.id,
    );
    if (modelIndex === -1) {
      collectionOutput.models.push({
        id: model.id,
        title: model.title,
        commingPrice: commingPrice || 0,
        priceMeter: priceMeter || 0,
        products: [],
      });
    }

    const modelOutput = collectionOutput.models.find((m) => m.id === model.id)!;
    modelOutput.products.push({
      color: inputProduct.color,
      style: inputProduct.style,
      shape: inputProduct.shape,
      size: inputProduct.size,
      code: inputProduct.code,
      count: count,
      img: inputProduct.img,
      price: (priceMeter + secondPrice) * m2 || 0,
      secondPrice: secondPrice || 0,
      priceMeter: priceMeter || 0,
      commingPrice: commingPrice || 0,
      filial: inputProduct.filial,
      partiya: inputProduct.partiya,
      otherImgs: otherImgs,
      m2: m2,
    });
  });

  return Object.values(collections);
}

function convertOutputToInput(output: OutputProduct[]): InputProduct[] {
  const input: InputProduct[] = [];

  return input;
}

