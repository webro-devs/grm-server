const jsonParser = (data) => {
  const result = data.flatMap(({ title: collection, models }) =>
    models.flatMap(({ title: model, products }) =>
      products.map(
        ({ Color, Size, Count, imgUrl, price, shape, filial, Code, date }) => ({
          collection,
          model,
          Color,
          Size,
          Count,
          imgUrl,
          price,
          shape,
          filial,
          Code,
          date,
        }),
      ),
    ),
  );

  return result;
};

export default jsonParser;
