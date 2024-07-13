const query = (collection: string, text: string) => `
WITH model_cte AS (
    SELECT id
    FROM model
    WHERE "collectionId" = '${collection}'
)
UPDATE product
SET "internetInfo" = '${text}'
WHERE "modelId" IN (SELECT id FROM model_cte);
`;

export default query;