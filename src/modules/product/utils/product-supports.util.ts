const query =  `
with color as (select distinct title, count(title), jsonb_agg(distinct color.id) as id
               from color
                        left join product as p on color.id = p."colorId"
               where "isInternetShop" = true
               group by title),
     style as (select distinct title, count(title), jsonb_agg(distinct style.id) as id
               from style
                        left join product as p on style.title = p.style
               where "isInternetShop" = true
               group by title),
     shape as (select distinct title, count(title), jsonb_agg(distinct shape.id) as id
               from shape
                        left join product as p on shape.title = p.shape
               where "isInternetShop" = true
               group by title),
     size as (select distinct title, count(title), jsonb_agg(distinct size.id) as id
              from size
                       left join product as p on size.title = p.size
              where "isInternetShop" = true
              group by title),
     country as (select distinct title, count(title), jsonb_agg(distinct country.id) as id
                 from country
                          left join product as p on country.title = p.country
                 where "isInternetShop" = true
                 group by title),
     collection as (select distinct collection.title, count(collection.title), jsonb_agg(distinct collection.id) as id, jsonb_agg(distinct m.title) as model
                    from collection
                             left join model as m on collection.id = m."collectionId"
                             left join product as p on m.id = p."modelId"
                    where "isInternetShop" = true
                    group by collection.title),
     model as (select distinct title, count(title), jsonb_agg(distinct model.id) as id
               from model
                        left join product as p on model.id = p."modelId"
               where "isInternetShop" = true
               group by title)
select json_agg(distinct model)      as model,
       json_agg(distinct collection) as collection,
       json_agg(distinct country)    as country,
       json_agg(distinct style)      as style,
       json_agg(distinct shape)      as shape,
       json_agg(distinct color)      as color,
       json_agg(distinct size)       as size
from model,
     collection,
     country,
     style,
     shape,
     color,
     size;
`

export default query;