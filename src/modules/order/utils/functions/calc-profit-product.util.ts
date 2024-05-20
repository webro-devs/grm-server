import { OrderBasket } from '../../../order-basket/order-basket.entity';
import { priceSpliter } from "./index"

const util = (orderBasket: OrderBasket[], totalRevenue: number, plasticSum: number) => {
  let additional_sum = 0, index = 0;
  let totalCost = orderBasket.reduce((accumulator, basket) => {
    const price = basket['isMetric'] ? (basket.x / 100) * basket.product.x * basket.product.priceMeter : basket['product'].x * basket.product.y * basket.x * basket.product.priceMeter;
    return accumulator + price;
  }, 0);
  let profit = totalRevenue - totalCost;  // Total profit

  let proportionalProfits = orderBasket.map(basket => {
    const price = basket['isMetric'] ? (basket.x / 100) * basket.product.x * basket.product.priceMeter : basket['product'].x * basket.product.y * basket.x * basket.product.priceMeter;
    let proportion = price / totalCost;
    let productProfit = proportion * profit;
    const { decimalPart, integerPart } = priceSpliter(productProfit);
    additional_sum += decimalPart;

    return {
      product: basket.product.id,
      seller: basket.seller,
      price: price + integerPart,
      x: basket.x,
      isMetric: basket.isMetric,
      kv: 0,
      plasticSum: 0
    };
  });

  additional_sum = Math.trunc(additional_sum);
  while (additional_sum && additional_sum > 0) {
    if (proportionalProfits[index]) {
      proportionalProfits[index].price += 1;
    } else {
      index = 0;
      proportionalProfits[index].price += 1;
    }
    index++;
    additional_sum--;
  }

  proportionalProfits = proportionalProfits.sort((a, b) => a.price - b.price);
  if (plasticSum > 0) {
  for (let i = proportionalProfits.length - 1; i >= 0; i--) {
    const remainingPlastic = Math.min(plasticSum, proportionalProfits[i].price);
    proportionalProfits[i].plasticSum = remainingPlastic;
    proportionalProfits[i].price -= remainingPlastic;
    plasticSum -= remainingPlastic;
    if (plasticSum === 0) break;
  }
  }


  return proportionalProfits;
};

export default util;