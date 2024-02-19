const slugMaker = (data) => {
  let slug = [];
  if (data?.model) {
    slug.push(data.model);
  }
  if (data?.color?.title) {
    slug.push(data.color.title);
  }
  if (data?.shape) {
    slug.push(data.shape);
  }
  if (data?.model?.collection?.title) {
    slug.push(data.model.collection.title);
  }
  if (data?.style) {
    slug.push(data.style);
  }
  if (data?.size) {
    slug.push(data.size);
  }
  if (data?.country) {
    slug.push(data.country);
  }
  if (data?.code) {
    slug.push(data.code);
  }
  return slug.join(' ');
};
