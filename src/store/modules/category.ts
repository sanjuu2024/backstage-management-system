// 一级二级三级分类的全局组件的仓库
import {reqC1, reqC2, reqC3, reqAttr} from '@/api/product/attr';
import { ElMessage } from 'element-plus';
import { defineStore } from 'pinia';
import type { CategoryResponseData } from '@/api/product/attr/type';
import type { CategoryState } from './types/type';

export const useCategoryStore = defineStore('category',{
    state:(): CategoryState => {
        return {
            l1: [],
            l2: [],
            l3: [],
            c1Id: '',
            c2Id: '',
            c3Id: ''
        }
    },
    actions: {
        async getC1(){
            let res:CategoryResponseData = await reqC1();
            if (res.code == 200){
                this.l1 = res.data;
            }
            else{
                ElMessage.error('获取一级分类失败');
            }
        },

        async getC2(id:number|string){
            let res:CategoryResponseData = await reqC2(id);
            if (res.code == 200){
                this.l2 = res.data;
            }
            else{
                ElMessage.error('获取二级分类失败');
            }
        },

        async getC3(id:number|string){
            let res:CategoryResponseData = await reqC3(id);
            if (res.code == 200){
                this.l3 = res.data;
            }
            else{
                ElMessage.error('获取三级分类失败');
            }
        },

        async getAttr(){
            return await reqAttr(this.c1Id, this.c2Id, this.c3Id);
        }
    }
});