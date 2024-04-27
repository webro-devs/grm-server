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
      secondPrice = 0,
      priceMeter = 0,
      commingPrice = 0,
      otherImgs,
    } = inputProduct;

    // Extracting the size from the title
    const sizeMatch = size.title.match(/\d+\.*\d*/g);
    const m2 = sizeMatch ? sizeMatch.reduce((acc, val) => acc * parseFloat(val), 1) / 10000 : 0;

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

    const collectionOutput = collections[collection.id];
    collectionOutput.m2 += m2;

    let modelOutput = collectionOutput.models.find((m) => m.id === model.id);

    if (!modelOutput) {
      modelOutput = {
        id: model.id,
        title: model.title,
        commingPrice: commingPrice,
        priceMeter: priceMeter,
        products: [],
      };
      collectionOutput.models.push(modelOutput);
    }

    modelOutput.products.push({
      ...inputProduct,
      price: (priceMeter + secondPrice) * m2,
      m2: m2,
    });
  });

  return Object.values(collections);
}


function convertOutputToInput(output: OutputProduct[]): InputProduct[] {
  const input: InputProduct[] = [];

  return input;
}

