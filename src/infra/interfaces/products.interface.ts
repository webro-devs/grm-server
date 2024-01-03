export interface InputProduct {
  collection: {
    id: string;
    title: string;
  };
  model: {
    id: string;
    title: string;
  };
  color: {
    id: string;
    title: string;
    code: string;
  };
  style: {
    id: string;
    title: string;
  };
  shape: {
    id: string;
    title: string;
  };
  size: {
    id: string;
    title: string;
  };
  code: string;
  count: number;
  img: string;
  secondPrice: number;
  priceMeter: number;
  commingPrice: number;
  filial: string;
  partiya: string;
  otherImgs: string[];
}

export interface OutputProduct {
  id: string;
  title: string;
  m2: number;
  expense: number;
  commingSum: number;
  models: OutputModel[];
}

interface OutputModel {
  id: string;
  title: string;
  commingPrice: number;
  priceMeter: number;
  products: OutputProductDetail[];
}

interface OutputProductDetail {
  color: {
    id: string;
    title: string;
    code: string;
  };
  style: {
    id: string;
    title: string;
  };
  shape: {
    id: string;
    title: string;
  };
  size: {
    id: string;
    title: string;
  };
  code: string;
  count: number;
  img: string;
  price: number;
  secondPrice: number;
  priceMeter: number;
  commingPrice: number;
  filial: string;
  partiya: string;
  otherImgs: string[];
  m2: number;
}
