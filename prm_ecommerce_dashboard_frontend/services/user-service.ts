import { Const } from "@/libs/const";
import BaseService from "./base-service";
import { User } from "@/types/user";

class UserService extends BaseService<User> {
    constructor() {
        super(Const.API_USER);
    }
}

export default new UserService();