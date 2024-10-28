import { Const } from "@/libs/const";
import BaseService from "./base-service";
import { Brand } from "@/types/product";

class BrandService extends BaseService<Brand> {
    constructor() {
        super(Const.API_BRAND);
    }
}

export default new BrandService();``