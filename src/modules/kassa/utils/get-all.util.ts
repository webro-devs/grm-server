const query = () => `
SELECT k.*,
       f.*,
       (SELECT json_agg(json_build_object('id', u.id, 'role', u.role, 'firstName', u."firstName", 'lastName',
                                          u."lastName", 'avatar', u.avatar))
        FROM users u
        WHERE u."filialId" = f.id
          AND u.role = 2) AS cashiers
FROM kassa k
         LEFT JOIN
     filial f
     ON
         k."filialId" = f.id;
`

export default query;