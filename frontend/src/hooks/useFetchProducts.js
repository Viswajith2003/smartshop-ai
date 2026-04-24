import { productAPI } from "../services/api";

const usefetchProducts = async (params = {}) => {
    try {
        const res = await productAPI.getProducts(params);
        return res;
    } catch (error) {
        console.log(error);
    }
}

export default usefetchProducts;