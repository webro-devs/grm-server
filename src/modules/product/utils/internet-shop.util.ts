const query = ()=> `
select distinct array_agg("imgUrl") as images, c.title, min("secondPrice") as price
from product as p
         left join model as m on p."modelId" = m.id
         left join collection as c on m."collectionId" = c.id
where 
    "isInternetShop" = true 
and 
    count > 0
group by c.title;
`

export default query