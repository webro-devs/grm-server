const query = (collection: string, model: string, shape: string, color: string, size: string) => {
  const formattedCollection = collection ? `(${collection.split(',').map(item => `'${item.trim()}'`).join(', ')})` : null;
  const formattedShape = shape ? `(${shape.split(',').map(item => `'${item.trim()}'`).join(', ')})` : null;
  const formattedColor = color ? `(${color.split(',').map(item => `'${item.trim()}'`).join(', ')})` : null;
  const formattedSize = size ? `(${size.split(',').map(item => `'${item.trim()}'`).join(', ')})` : null;

  return `
    SELECT
        json_agg(DISTINCT model) AS model,
        json_agg(DISTINCT collection) AS collection,
        json_agg(DISTINCT country) AS country,
        json_agg(DISTINCT style) AS style,
        json_agg(DISTINCT shape) AS shape,
        json_agg(DISTINCT jsonb_build_object('title', color, 'code', code)) AS color,
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
                cl.code AS code,
                si.title AS size
            FROM
                product p
                LEFT JOIN model m ON p."modelId" = m.id
                LEFT JOIN collection c ON m."collectionId" = c.id
                LEFT JOIN country co ON p.country = co.title
                LEFT JOIN style s ON p.style = s.title
                LEFT JOIN shape sh ON p.shape = sh.title
                JOIN color cl ON p."colorId" = cl.id
                LEFT JOIN size si ON p.size = si.title
            WHERE
                p."isInternetShop" = true
                AND p.count > 0
                AND p.y > 0
                ${formattedCollection ? `AND c.title IN ${formattedCollection}` : ''} 
                ${model ? `AND m.title = '${model}'` : ''} 
                ${formattedShape ? `AND sh.title IN ${formattedShape}` : ''} 
                ${formattedColor ? `AND cl.title IN ${formattedColor}` : ''} 
                ${formattedSize ? `AND s.title IN ${formattedSize}` : ''}
            GROUP BY
                m.title, c.title, co.title, s.title, sh.title, cl.title, si.title, cl.code
        ) AS subquery;
  `;
};
export default query;
