const query = (url: string, model: string, color: string, shape: string) => `
WITH product_ids AS (
    SELECT product.id
    FROM product
    JOIN color AS c ON product."colorId" = c.id
    JOIN model AS m ON product."modelId" = m.id
    WHERE m.title Ilike '${model}'
      ${color ? `AND c.title Ilike '${color}'` : ''}
      ${shape ? `AND shape Ilike '${shape}'` : ''}
)
UPDATE product
SET "imgUrl" = '${url}'
FROM product_ids
WHERE product.id = product_ids.id;
`;

export default query;