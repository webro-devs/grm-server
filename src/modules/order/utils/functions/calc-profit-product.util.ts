import { OrderBasket } from '../../../order-basket/order-basket.entity';
import { priceSpliter } from './index';

const util = (orderBasket: OrderBasket[], totalRevenue: number, plasticSum: number) => {
  let additional_sum = 0, index = 0;
  let totalCost = orderBasket.reduce((accumulator: any, basket: any) => {
    return accumulator + +basket['product'].price;
  }, 0);  // Total cost of the products
  console.log(totalCost);
  let profit = totalRevenue - totalCost;  // Total profit

// Calculate the proportion of each product price in the total cost
  let proportionalProfits = orderBasket.map(basket => {
    let proportion = basket.product.price / totalCost;
    let productProfit = proportion * profit;
    const { decimalPart, integerPart } = priceSpliter(productProfit);
    additional_sum += decimalPart;
    return {
      product: basket.product.id,
      seller: basket.seller,
      price: basket.product.price + integerPart,
      x: basket.x,
      isMetric: basket.isMetric,
      kv: 0,
      plasticSum: 0
    };
  });
  proportionalProfits = proportionalProfits.sort((a, b) => a.price - b.price);
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

  for (let i = proportionalProfits.length - 1; i >= 0; i--) {
    const remainingPlastic = Math.min(plasticSum, proportionalProfits[i].price);
    proportionalProfits[i].plasticSum = remainingPlastic;
    proportionalProfits[i].price -= remainingPlastic;
    plasticSum -= remainingPlastic;
    if (plasticSum === 0) break;
  }


  return proportionalProfits;
};

export default util;