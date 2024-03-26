const query = (code: string) => `select * from product where code = '${code}' order by date ASC;`

export default query;