import { Const } from "@/libs/const";
import BaseService from "./base-service";
import { Image_ } from "@/types/product";

class ImageService extends BaseService<Image_> {
    constructor() {
        super(Const.API_IMAGE);
    }
}

export default new ImageService();