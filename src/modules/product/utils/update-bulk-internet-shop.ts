const query = (collection, text) => `
update product
set "internetInfo" = '${text}'
from model
         join collection on model."collectionId" = collection.id
where collection.id = '${collection}';
`;

export default query;