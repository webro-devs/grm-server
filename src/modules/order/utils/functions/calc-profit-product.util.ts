import { OrderBasket } from '../../../order-basket/order-basket.entity';

const util = (orderBasket: OrderBasket[], totalRevenue: number, plasticSum: number) => {
  let additional_sum = 0, index = 0;
  let totalCost = orderBasket.reduce((accumulator, basket) => {
    const price = basket['isMetric'] ? (basket.x / 100) * basket.product.x * basket.product.priceMeter : basket['product'].x * basket.product.y * basket.x * basket.product.priceMeter;
    return accumulator + price;
  }, 0);
  let profit = 300 - totalCost;  // Total profit

  console.log(totalCost);

  let proportionalProfits = orderBasket.map(basket => {
    const price = basket['isMetric'] ? (basket.x / 100) * basket.product.x * basket.product.priceMeter : basket['product'].x * basket.product.y * basket.x * basket.product.priceMeter;
    let proportion = price / totalCost;
    let productProfit = proportion * profit;
    console.log(price);
    return {
      product: basket.product.id,
      seller: basket.seller,
      price: price + productProfit,
      x: basket.x,
      isMetric: basket.isMetric,
      kv: 0,
      plasticSum: 0
    };
  });
  // proportionalProfits = proportionalProfits.sort((a, b) => a.price - b.price);
  // additional_sum = Math.trunc(additional_sum);
  // console.log('test');
  // while (additional_sum && additional_sum > 0) {
  //   console.log('while');
  //   if (proportionalProfits[index]) {
  //     proportionalProfits[index].price += 1;
  //   } else {
  //     index = 0;
  //     proportionalProfits[index].price += 1;
  //   }
  //   index++;
  //   additional_sum--;
  //   console.log(additional_sum);
  // }

  console.log(additional_sum);
  if (plasticSum > 0) {
  for (let i = proportionalProfits.length - 1; i >= 0; i--) {
    console.log('for after while');
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