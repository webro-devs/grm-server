const search = ({ text, filialId, base, limit, offset, total, shop, collection }) => `
SELECT 
${ 
       total ? 'COUNT(*) AS total' : 
       `p.id,
       p.code,
       p.size,
       p.x,
       p.y,
       p.style,
       p.country,
       p.shape,
       p."imgUrl",
       p."isInternetShop",
       p."secondPrice",
       p.count,
       p.price,
       p."priceMeter",
       p."comingPrice",
       to_json(c) AS color,
       json_build_object('id', m.id, 'title', m.title, 'collection', to_json(col)) AS model,
       to_json(f) AS filial`
}
FROM product AS p
LEFT JOIN model AS m ON p."modelId" = m.id
LEFT JOIN public.collection col ON col.id = m."collectionId"
LEFT JOIN color AS c ON p."colorId" = c.id
LEFT JOIN public.filial AS f ON f.id = p."filialId"
WHERE (SELECT COUNT(*)
       FROM (SELECT DISTINCT LOWER(word) AS word
             FROM (SELECT REGEXP_SPLIT_TO_TABLE(LOWER('%${text}%'), ' ') AS word) AS words) AS unique_words
       WHERE CONCAT_WS(' ', c.title, m.title, p.size, p.shape, p.style, p.code, col.title) ILIKE
             '%' || unique_words.word || '%') = (SELECT COUNT(*)
                                                 FROM (SELECT LOWER(word) AS word
                                                       FROM (SELECT REGEXP_SPLIT_TO_TABLE(LOWER('%${text}%'), ' ') AS word) AS words) AS unique_words)
  AND p.count > 0
  AND p.y > 0
  AND f."isActive" = true
  ${filialId ? `AND f.id = '${filialId}'` : ''}
  ${collection ? `AND col.id = '${collection}'` : ''} 
  ${base ? '' : `AND f.title != 'baza'`}
  ${shop === 'true' || shop === 'false' ? `AND p."isInternetShop" = ${shop}` : ''}
${total ? '' : `ORDER BY p.id DESC OFFSET ${offset} LIMIT ${limit}`}
`;

export default search;