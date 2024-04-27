const query = (search: string, page, limit, total: boolean) => `
SELECT 
    ${
      total ? 
       `
        count(*)
       ` 
      : 
       `
        p.id,
        p.code,
        p.date,
        to_json(m) as model,
        to_json(c) as color,
        to_json(col) as collection,
        to_json(s) as size,
        to_json(sh) as shape,
        to_json(st) as style,
        to_json(cou) as country
       ` 
    }
FROM qrbase AS p
         LEFT JOIN
     model AS m ON p."modelId" = m.id
         LEFT OUTER JOIN
     collection col on col.id = m."collectionId"
         LEFT JOIN
     color AS c ON p."colorId" = c.id
         LEFT JOIN
     size AS s ON p."sizeId" = s.id
         LEFT JOIN
     shape AS sh ON p."shapeId" = sh.id
         LEFT JOIN
     style AS st ON p."styleId" = st.id
         LEFT JOIN
     country AS cou ON p."countryId" = c.id
WHERE (SELECT COUNT(*)
       FROM (SELECT DISTINCT LOWER(word) AS word
             FROM (SELECT REGEXP_SPLIT_TO_TABLE(LOWER('%${search}%'), ' ') AS word) AS words) AS unique_words
       WHERE CONCAT_WS('  ', c.title, m.title, s.title, sh.title, st.title, p.code, col.title, m.title, cou.title) ILIKE
             '%' || unique_words.word || '%') = (SELECT COUNT(*)
                                                 FROM (SELECT LOWER(word) AS word
                                                       FROM (SELECT REGEXP_SPLIT_TO_TABLE(LOWER('%a005b%'), ' ') AS word) AS words) AS unique_words)
${total ? '' : `offset ${page} limit ${limit}`};
`;
export default query;