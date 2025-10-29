// 品牌管理模块接口

import request from "@/utils/request";
import type { ExistingBrandsResponseData } from "./type";

// 各接口地址
const API = {
    // 获取已有品牌接口
    EXISTING_BRANDS_URL: `/admin/product/baseTrademark/`,

}

export const reqExistingBrands = async (page:number = 1,limit:number) => {
    return await request.get<any,ExistingBrandsResponseData>(API.EXISTING_BRANDS_URL+`${page}/${limit}`);
}