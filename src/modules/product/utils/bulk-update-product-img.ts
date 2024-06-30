const query = (url: string, model: string, color: string, shape: string) => `
update
    product
set "imgUrl" = '${url}'
from product
         join
     color as c on product."colorId" = c.id
         join
     model as m on product."modelId" = m.id
where m.title = '${model}'
  ${color ? `and c.title = '${color}'`: ''}
  ${shape ? `and product.shape = '${shape}'`: ''}
`;

export default query;