const json_parser = (data) => {
  const result = data.flatMap(({ title: collection, models }) =>
    models.flatMap(({ title: model, products }) =>
      products.map(({ color, size, count }) => ({
        collection,
        model,
        color,
        size,
        count,
      })),
    ),
  );

  return result;
};

export default json_parser;
