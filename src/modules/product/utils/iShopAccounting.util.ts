const query = (query: { by: string }) =>
  `
WITH shop_products AS (
    SELECT COUNT(*) AS total_shop_products
    FROM product
    WHERE "isInternetShop" = TRUE
),
sold_shop_products AS (
    SELECT COUNT(*) AS sold_shop_products
    FROM "order"
    WHERE "order"."productId" IN (
        SELECT id
        FROM product
        WHERE "isInternetShop" = TRUE
    )
    AND "date" >= CURRENT_DATE - INTERVAL ${query?.by == 'week' ? `'1 week'` : query?.by == 'month' ? `'1 month'` : `'10 year'`}
),
sold_shop_products_first AS (
    SELECT COUNT(*) AS sold_shop_products_first
    FROM "order"
    WHERE "order"."productId" IN (
        SELECT id
        FROM product
        WHERE "isInternetShop" = TRUE
    )
    -- Bro you can add your any condition here
)
SELECT
    total_shop_products,
    sold_shop_products,
    sold_shop_products_first,
    CASE
        WHEN total_shop_products = 0 THEN 0
        ELSE (sold_shop_products * 100.0 / total_shop_products)
    END AS percentage_sold
FROM
    shop_products,
    sold_shop_products,
    sold_shop_products_first;
`;
export default query;