const search = ({ text, filialId, base, limit, offset, total, shop }) => `
SELECT 
${ 
       total ? 'count(*)' : 
       `p.id,
       p.code,
       p.size,
       p.style,
       p.country,
       p.shape,
       p."imgUrl",
       p."isInternetShop",
       p."secondPrice",
       p.count,
       p.price,
       p.x,
       p.y,
       p."priceMeter",
       p."comingPrice",
       to_json(c) AS color,
       json_build_object('id', c.id, 'title', m.title, 'collection', to_json(col)) AS model,
       to_json(f) AS filial`
}
FROM product AS p
         LEFT JOIN
     model AS m ON p."modelId" = m.id
         LEFT OUTER JOIN
     public.collection col on col.id = m."collectionId"
         LEFT JOIN
     color AS c ON p."colorId" = c.id
         LEFT JOIN
     public.filial AS f ON f.id = p."filialId"
WHERE (SELECT COUNT(*)
       FROM (SELECT DISTINCT LOWER(word) AS word
             FROM (SELECT REGEXP_SPLIT_TO_TABLE(LOWER('%${text}%'), ' ') AS word) AS words) AS unique_words
       WHERE CONCAT_WS('  ', c.title, m.title, p.size, p.shape, p.style, p.code, col.title) ILIKE
             '%' || unique_words.word || '%') = (SELECT COUNT(*)
                                                 FROM (SELECT LOWER(word) AS word
                                                       FROM (SELECT REGEXP_SPLIT_TO_TABLE(LOWER('%${text}%'), ' ') AS word) AS words) AS unique_words)
  and p.count > 0
  ${filialId ? `and f.id = '${filialId}'` : ''} 
  ${ base ? '' : `and f.title != 'baza'`}
  ${ shop == 'true' || shop == 'false' ? `and p."isInternetShop" = ${shop}` : '' }
  ${total ? '' : `offset ${offset} limit ${limit}`};
`;

export default search;