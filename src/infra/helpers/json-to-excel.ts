const jsonParser = (data) => {
  const result = data.flatMap(({ title: collection, models }) =>
    models.flatMap(({ title: model, products }) =>
      products.map(
        ({ color, size, count, imgUrl, price, shape, filial, code, date }) => ({
          collection,
          model,
          color,
          size,
          count,
          imgUrl,
          price,
          shape,
          filial,
          code,
          date,
        }),
      ),
    ),
  );

  return result;
};

export default jsonParser;
