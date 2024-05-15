import { OrderBasket } from '../../../order-basket/order-basket.entity';
import { priceSpliter } from './index';

const util = (orderBasket: OrderBasket[], totalRevenue) => {
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
    const { decimalPart } = priceSpliter(proportion);
    additional_sum += decimalPart;
    return {
      product: basket.product.id,
      seller: basket.seller,
      price: basket.product.price + productProfit,
      x: basket.x,
      isMetric: basket.isMetric,
      kv: 0,
    };
  });
  while (additional_sum) {
    if (proportionalProfits[index]) {
      proportionalProfits[index].price += 1;
    } else {
      index = 0;
      proportionalProfits[index].price += 1;
    }
    index++;
    additional_sum--;
  }

  return proportionalProfits;
};

export default util;