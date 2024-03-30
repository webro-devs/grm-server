const query = (code: string) => `
select c.id as collection, code, product.id from product
         left join model as m on product."modelId" = m.id
         left join collection as c on m."collectionId" = c.id 
where code = '${code}' 
order by date ASC;`

export default query;