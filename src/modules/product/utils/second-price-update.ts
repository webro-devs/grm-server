const query = (collection: string, size: string, text: number) => `
WITH model_cte AS (
  SELECT id
FROM model
WHERE "collectionId" = '${collection}'
)
UPDATE product
SET "secondPrice" = ${text}
WHERE "modelId" IN (SELECT id FROM model_cte) and size Ilike '${size}';
`;

export default query