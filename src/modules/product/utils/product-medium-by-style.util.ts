export default

`WITH ranked_products AS (
  SELECT DISTINCT
price,
  LOWER(style) AS normalized_style,
  ROW_NUMBER() OVER (PARTITION BY LOWER(style) ORDER BY price) AS row_num,
COUNT(*) OVER (PARTITION BY LOWER(style)) AS total_rows
FROM
product
where "isInternetShop" = true
)
SELECT
price,
  UPPER(normalized_style) AS style
FROM
ranked_products
WHERE
row_num = CEIL(total_rows / 2.0);
`;