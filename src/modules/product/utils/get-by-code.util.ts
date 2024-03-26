const query = (code: string) => `select * from product where code = '${code}';`

export default query;