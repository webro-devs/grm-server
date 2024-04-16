// const query =  `
// with color as (select distinct title, count(title), jsonb_agg(distinct color.id) as id
//                from color
//                         left join product as p on color.id = p."colorId"
//                where "isInternetShop" = true
//                group by title),
//      style as (select distinct title, count(title), jsonb_agg(distinct style.id) as id
//                from style
//                         left join product as p on style.title = p.style
//                where "isInternetShop" = true
//                group by title),
//      shape as (select distinct title, count(title), jsonb_agg(distinct shape.id) as id
//                from shape
//                         left join product as p on shape.title = p.shape
//                where "isInternetShop" = true
//                group by title),
//      size as (select distinct title, count(title), jsonb_agg(distinct size.id) as id
//               from size
//                        left join product as p on size.title = p.size
//               where "isInternetShop" = true
//               group by title),
//      country as (select distinct title, count(title), jsonb_agg(distinct country.id) as id
//                  from country
//                           left join product as p on country.title = p.country
//                  where "isInternetShop" = true
//                  group by title),
//      collection as (select distinct collection.title, count(collection.title), jsonb_agg(distinct collection.id) as id, jsonb_agg(distinct m.title) as model
//                     from collection
//                              left join model as m on collection.id = m."collectionId"
//                              left join product as p on m.id = p."modelId"
//                     where "isInternetShop" = true
//                     group by collection.title),
//      model as (select distinct title, count(title), jsonb_agg(distinct model.id) as id
//                from model
//                         left join product as p on model.id = p."modelId"
//                where "isInternetShop" = true
//                group by title)
// select json_agg(distinct model)      as model,
//        json_agg(distinct collection) as collection,
//        json_agg(distinct country)    as country,
//        json_agg(distinct style)      as style,
//        json_agg(distinct shape)      as shape,
//        json_agg(distinct color)      as color,
//        json_agg(distinct size)       as size
// from model,
//      collection,
//      country,
//      style,
//      shape,
//      color,
//      size;
// `

const query = `SELECT
    json_agg(DISTINCT model) AS model,
    json_agg(DISTINCT collection) AS collection,
    json_agg(DISTINCT country) AS country,
    json_agg(DISTINCT style) AS style,
    json_agg(DISTINCT shape) AS shape,
    json_agg(DISTINCT color) AS color,
    json_agg(DISTINCT size) AS size
FROM
    (
        SELECT
            m.title AS model,
            c.title AS collection,
            co.title AS country,
            s.title AS style,
            sh.title AS shape,
            cl.title AS color,
            si.title AS size
        FROM
            product p
            LEFT JOIN model m ON p."modelId" = m.id
            LEFT JOIN collection c ON m."collectionId" = c.id
            LEFT JOIN country co ON p.country = co.title
            LEFT JOIN style s ON p.style = s.title
            LEFT JOIN shape sh ON p.shape = sh.title
            LEFT JOIN color cl ON p."colorId" = cl.id
            LEFT JOIN size si ON p.size = si.title
        WHERE
            p."isInternetShop" = true
        GROUP BY
            m.title, c.title, co.title, s.title, sh.title, cl.title, si.title 
        ) AS subquery;
`
export default query;