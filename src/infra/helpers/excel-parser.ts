const excelDataParser = (data, expense) => {
	let allM2 = 0;
	const transformedObj = data.reduce((acc, curr) => {
		const {
			collection,
			plate,
			model,
			size,
			color,
			code,
			count,
			imgUrl,
			otherImgs = [],
			shape,
			style,
			filial = "",
			commingPrice = 0,
			priceMeter = 0,
			id,
			price2 = 0,
		} = curr;
		const m2 = eval(size.title.match(/\d+\.*\d*/g).join("*")) / 10000;
		allM2 += m2;

		const datas = {
			id,
			size,
			color,
			code,
			count,
			imgUrl,
			commingPrice,
			shape,
			style,
			filial,
			plate,
			m2,
			otherImgs,
			priceMeter,
			price2,
			price: (priceMeter + price2) * m2,
		};

		const collectionItem = acc.find((item) => item.title === collection.title);

		if (collectionItem) {
			const modelItem = collectionItem.models.find(
				(item) => item.title === model.title,
			);

			if (modelItem) {
				modelItem.products.push(datas);
				collectionItem.collection_m += m2;
			} else {
				collectionItem.models.push({
					id: model.id,
					title: model.title,
					cost: priceMeter,
					commingPrice: commingPrice,
					products: [datas],
				});
				collectionItem.collection_m += m2;
			}
		} else {
			acc.push({
				id: collection.id,
				title: collection.title,
				collection_cost: 0,
				collection_exp: 0,
				collection_m: m2,
				models: [
					{
						id: model.id,
						title: model.title,
						cost: priceMeter,
						commingPrice: commingPrice,
						products: [datas],
					},
				],
			});
		}

		return acc;
	}, []);

	for (const collection of transformedObj) {
		collection.collection_exp = (collection.collection_m * expense) / allM2;
		collection.collection_cost =
			(collection.models[0].commingPrice * collection.collection_m -
				collection.collection_exp) /
			collection.collection_m;
		collection.price =
			collection.models[0].commingPrice * collection.collection_m -
			collection.collection_exp;
	}

	return transformedObj;
};

export default excelDataParser;
