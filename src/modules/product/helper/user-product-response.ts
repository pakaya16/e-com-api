export const productResponseHelper = ({ rawProducts }) => {
  const products = rawProducts.map(product => {
    let response;
    const { createdAt, updatedAt, cost, ...result }: any = product;
    response = result;
    if (result?.category) {
      const { createdAt, updatedAt, status, ...resultCategory }: any = result.category;
      response = {
        ...response,
        category: resultCategory
      };
    }
    if (result?.seller) {
      const { createdAt, updatedAt, email, status, password, ...resultSeller }: any = result.seller;
      response = {
        ...response,
        seller: resultSeller
      };
    }

    return {
      ...response
    };
  });

  return products;
};