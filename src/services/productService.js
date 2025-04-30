const createNew = async (reqBody) => {
  try {
    const newProduct = {
      ...reqBody,
    };
    return newProduct;
  } catch (error) {
    throw error;
  }
};
export const productService = {
  createNew,
};
