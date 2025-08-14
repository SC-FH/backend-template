import { $ajax, configType } from "@/request";

export const loginApi = (data: { account: string, password: string }, config?: configType) => $ajax.post("/user/login", data, config)
export const getSelfInfoApi = () => $ajax.post("/user/getSelfInfo")

export const getUserListApi = (data: { page: number, pageSize: number, name?: string, role?: string }, config?: configType) => $ajax.post("/user/getUserList", data, config)
