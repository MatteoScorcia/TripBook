import { JwtDto, ResponseApi, UserDto } from "@aindo/dto";
import axios from "axios";

const apiRootURL = "/api";

export class AuthApi {
    static async login(user: Omit<UserDto, "email">): Promise<ResponseApi<JwtDto>> {
        return (await axios.post(`${apiRootURL}/auth/login`, { user: user })).data;
    }

    static async signUp(user: UserDto): Promise<ResponseApi<JwtDto>> {
        return (await axios.post(`${apiRootURL}/auth/signup`, { user: user })).data;
    }
}
