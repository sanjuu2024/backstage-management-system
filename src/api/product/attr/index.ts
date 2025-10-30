// 属性管理模块相关的api接口
import request from "@/utils/request";
import type { CategoryResponseData, AttrResponseData, Attr } from "./type";

// 各接口地址
const API = {
    // 获取一级分类接口地址
    C1_URL: '/admin/product/getCategory1',
    // 获取二级分类接口地址
    C2_URL: '/admin/product/getCategory2/',   // {id}
    // 获取三级分类接口地址
    C3_URL: '/admin/product/getCategory3/',   // {id}
    // 获取分类下已有的属性和属性值接口地址
    ATTR_URL: '/admin/product/attrInfoList/',   // {c1Id}/{c2Id}/{c3Id},
    // 添加 / 修改属性的接口地址
    ADD_OR_UPDATE_ATTR_URL: '/admin/product/saveAttrInfo',
    // 删除属性接口
    DELETE_ATTR_URL: '/admin/product/deleteAttr/'   // {attrId}
}

// 获取一级分类
export const reqC1 = () => request.get<any,CategoryResponseData>(API.C1_URL);

// 获取二级分类
export const reqC2 = (c1Id: number|string) => request.get<any,CategoryResponseData>(API.C2_URL + c1Id);

// 获取三级分类
export const reqC3 = (c2Id: number|string) => request.get<any,CategoryResponseData>(API.C3_URL + c2Id);

// 获取属性和属性值
export const reqAttr = (c1Id: number|string, c2Id: number|string, c3Id: number|string) => {
    return request.get<any, AttrResponseData>(API.ATTR_URL + `${c1Id}/${c2Id}/${c3Id}`);
}

// 新增 / 修改属性
export const reqAddOrUpdateAttr = (data:Attr) => {
    return request.post<Attr,any>(API.ADD_OR_UPDATE_ATTR_URL, data);
}

// 删除属性
export const reqDeleteAttr = (attrId:number) => {
    return request.delete(API.DELETE_ATTR_URL+attrId);
}