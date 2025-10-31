<template>
    <el-card>
        <el-form label-width="auto" label-position="right">
            <el-form-item label="SPU名称">
                <el-input placeholder="请输入SPU名称" v-model="theSpu.spuName"></el-input>
            </el-form-item>

            <el-form-item label="SPU品牌">
                <el-select placeholder="请选择SPU品牌" style="width: 200px;" v-model="theSpu.tmId">
                    <el-option v-for="(item,idx) in allBrands" :key="idx" :label="item.tmName" :value="item.id"></el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="SPU描述">
                <el-input type="textarea" placeholder="请输入SPU描述" v-model="theSpu.description"></el-input>
            </el-form-item>

            <el-form-item label="SPU图片">
                <!-- 🔺🔺🔺啊啊啊服了测试的时候把v-model改成v-bind的简写形式了,最后saveSpu的时候调半天...！！！ -->
                <el-upload
                    v-model:file-list="spuImageList"
                    :headers="uploadHeaders"
                    action="/api/admin/product/fileUpload"
                    list-type="picture-card"
                    :on-preview="handlePictueCardPreview"
                    :on-remove="handleRemove"
                    :before-upload="handleBeforeUpload"
                    :on-success="handleAvatarSuccess"
                >
                    <el-icon><Plus/></el-icon>
                </el-upload>
                <!-- 用来放大图片的 -->
                <el-dialog v-model="dialogVisible">
                    <img w-full :src="dialogImageUrl" alt="图片放大预览" style="width: 100%;"/>
                </el-dialog>
            </el-form-item>

            <el-form-item label="SPU销售属性">
                <el-select :placeholder="unSelectedSaleAttr.length ? `剩余${unSelectedSaleAttr.length}个可添加销售属性` : '无'" style="width: 200px;" v-model="theSaleAttr">
                    <el-option v-for="(item,idx) in unSelectedSaleAttr" :key="idx" :label="item.name" :value="`${item.id}:${item.name}`"></el-option>
                </el-select>
                <el-button type="primary" icon="Plus" style="margin: 10px;" :disabled="!theSaleAttr" @click="addSaleAttr">添加销售属性</el-button>
                <!-- 属性表 -->
                <el-table border :data="spuSaleAttrList">
                    <el-table-column label="序号" type="index" align="center" width="80px;"></el-table-column>
                    <el-table-column label="属性名" align="center" width="120px;" prop="saleAttrName"></el-table-column>
                    <el-table-column label="属性值" align="center">
                        <template #="{row,$index}">
                            <el-tag v-for="(item,idx) in row.spuSaleAttrValueList" :key="idx" style="margin: 10px;" closable @close="handleAttrValueClose($index,idx)">{{ item.saleAttrValueName }}</el-tag>
                            <!-- row.flag为true说明处在编辑状态 -->
                            <el-input v-if="row.flag" ref="attrValueInput" size="small" width="100px" @blur="handleAttrValueInputBlur(row)" v-model="newAttrValue"></el-input>
                            <el-button v-else type="success" icon="Plus" size="small" style="margin: 10px;" @click="addSaleAttrValue(row)"></el-button>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" align="center" width="80px;">
                        <template #="{row,$index}">
                            <el-button type="danger" icon="Delete" size="small" @click="deleteSaleAttr($index)"></el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-form-item>
            <el-form-item label=" ">
                <el-button type="primary" @click="saveSpu">保存</el-button>
                <el-button @click="emit('change-scene')">取消</el-button>
            </el-form-item>
        </el-form>
    </el-card>
</template>
    
<script setup lang="ts">
import { useUserStore } from '@/store/modules/user';
import { reqAddSpu, reqAllBrands, reqAllSaleAttr, reqSpuImgList, reqSpuSaleAttrList, reqUpdateSpu, } from '@/api/product/spu';
import type { SaleAttr, SpuData, AllBrandsResponseData, AllSaleAttrResponseData, SpuImgListResponseData, SpuSaleAttrListResponseData, SpuImg, SpuSaleAttr } from '@/api/product/spu/type';
import type { Brand, ResponseData } from '@/api/product/brands/type';
import { ElMessage, type UploadFile, type UploadProps } from 'element-plus';
import { computed, nextTick, ref } from 'vue';
defineOptions({
    name: 'SpuForm'
});

const x = defineProps(['getExistingSpu']);

const userStore = useUserStore();
const emit = defineEmits(['change-scene']);

const uploadHeaders = computed(() => ({
	Token: userStore.token || ''  // 注意：使用大写的 'Token'
}));

// 对话框可见
let dialogVisible = ref<boolean>(false);
// 对话框内预览的图片地址
let dialogImageUrl = ref<string>('');

// 所需展示的数据
let theSpu = ref<SpuData>({
    spuName: '',
    description: '',
    category3Id: '',
    tmId: 0,
    spuImageList: null,
    spuSaleAttrList: null
});
let allBrands = ref<Brand[]>([]);
let allSaleAttr = ref<SaleAttr[]>([]);
let spuImageList = ref<SpuImg[]>([]);
let spuSaleAttrList = ref<SpuSaleAttr[]>([]);

// 添加中的属性
let theSaleAttr = ref<string>('');

// 获取添加属性值的那个input
let attrValueInput = ref();
// 添加属性值时输入的值
let newAttrValue = ref<string>('');

// 计算出当前SPU还可选的销售属性
let unSelectedSaleAttr = computed(() => {
    let res = allSaleAttr.value.filter((item) => {
        return spuSaleAttrList.value.every((tmp) => {
            return tmp.saleAttrName !== item.name;
        });
    });
    return res;
});

// 获取所有所需数据
async function init(row:SpuData){
    spuImageList.value = [];  // 清空图片列表
    spuSaleAttrList.value = []; // 清空销售属性列表
    // 1.row:基础的spu数据
    theSpu.value = row;
    // 2.获取所有品牌
    let res2:AllBrandsResponseData = await reqAllBrands();
    if (res2.code === 200) {
        allBrands.value = res2.data;
    }
    else{
        ElMessage.error('获取品牌列表失败：'+res2.message);
        return;
    }

    // 3.获取所有销售属性
    let res3:AllSaleAttrResponseData = await reqAllSaleAttr();
    if (res3.code === 200) {
        allSaleAttr.value = res3.data;
    }
    else{
        ElMessage.error('获取销售属性列表失败：'+res3.message);
        return;
    }

    // 4.获取已有的spu图片
    let res4:SpuImgListResponseData = await reqSpuImgList(row.id as number);
    if (res4.code === 200){
        if (!res4.data) {
            spuImageList.value = [];
            return;
        }
        // 🔺🔺🔺为了让各照片在el-upload中按照UploadFile的ts类型成功展示为照片墙(需要name和url字段)，需要map修改一下
        spuImageList.value = res4.data.map(item => {
            return {
                name: item.imgName,
                url: item.imgUrl,
                ...item
            }
        });
    }
    else{
        ElMessage.error('图片获取失败：'+res4.message);
    }

    // 5.获取已有的spu销售属性值
    let res5:SpuSaleAttrListResponseData = await reqSpuSaleAttrList(row.id as number);
    if (res5.code === 200){
        spuSaleAttrList.value = res5.data;
    }
    else{
        ElMessage.error('销售属性获取失败：'+res5.message);
    }
}

// 子组件暴露该方法
defineExpose({
    init
});

// 照片墙图片点开放大预览的钩子(参数会传过来一个file对象)
function handlePictueCardPreview(file: UploadFile){
    dialogVisible.value = true;
    dialogImageUrl.value = file.url as string;
}

// 照片墙删除图片的钩子
function handleRemove(){

}

// 照片墙中照片上传成功之前的钩子(比如可以约束上传文件的类型和大小)
const handleBeforeUpload:UploadProps['beforeUpload'] = (rawFile) => {
	if (rawFile.type !== 'image/jpeg' && rawFile.type !== 'image/png' && rawFile.type !== 'image/jpg' && rawFile.type !== 'image/gif') {
		ElMessage.error('上传文件格式必须是 JPG/PNG/JPG/GIF 格式之一。');
		return false;
	} else if (rawFile.size / 1024 / 1024 > 2) {   // 最大2MB
		ElMessage.error('上传文件大小不能超过 2MB。');
		return false;
	}
	return true;
}

// 照片墙中照片上传成功之后的钩子(比如返回了上传的图片在服务器中的请求地址)
const handleAvatarSuccess: UploadProps['onSuccess'] = (res, file) => {
	// console.log(res);
	if (res.code === 200) {
        // console.log(spuImageList.value.length);
        file.url = res.data;  // 后端返回的图片URL在res.data中
        ElMessage.success('图片上传成功');
	} else {
		ElMessage.error('图片上传失败: ' + res.message);
	}
};

// 删除属性
function deleteSaleAttr(idx:number){
    spuSaleAttrList.value.splice(idx,1);
}

// 删除属性值
function handleAttrValueClose(rowIndex: number, idx: number){
    spuSaleAttrList.value[rowIndex]?.spuSaleAttrValueList.splice(idx, 1);
}

// 添加属性
function addSaleAttr(){
    const [s1,s2] = theSaleAttr.value.split(':');
    spuSaleAttrList.value.push({
        baseSaleAttrId: Number(s1),
        saleAttrName: s2 as string,
        spuSaleAttrValueList: []
    } as SpuSaleAttr);
    theSaleAttr.value = '';
}

// 添加属性值
function addSaleAttrValue(row: SpuSaleAttr){
    row.flag = true;
    nextTick(() => {
        attrValueInput.value?.focus();
    });
}

// 添加属性值输入框失去焦点时
function handleAttrValueInputBlur(row: SpuSaleAttr){
    row.flag = false;
    const val = newAttrValue.value.trim();

    // 非法情况1.为空
    if(val === ''){
        ElMessage.error('属性值名称不能为空！');
        newAttrValue.value = '';
        return;
    }

    // 非法情况2.重复
    let ok = true;
    row.spuSaleAttrValueList.forEach((item) => {
        if (item.saleAttrValueName === val) {
            ElMessage.error('属性值名称不能重复！');
            ok = false;
            newAttrValue.value = '';
            return;
        }
    });
    if (!ok) return;

    // 添加属性值
    row.spuSaleAttrValueList.push({
        spuId: theSpu.value.id as number,
        baseSaleAttrId: row.baseSaleAttrId,
        saleAttrValueName: val
    });
    newAttrValue.value = '';
}

// 提交spu新数据
async function saveSpu(){
    let data:SpuData = {
        ...theSpu.value,
        spuSaleAttrList: spuSaleAttrList.value,
        spuImageList: spuImageList.value.map(item => {
            // console.log("item: ",item);
            return {
                spuId: theSpu.value.id as number,
                imgName: item.name as string,
                imgUrl: item.url as string
            };
        })
    };
    let res: ResponseData;
    if (data.id){   // 修改
        res = await reqUpdateSpu(data);
    }
    else{   // 添加
        res = await reqAddSpu(data);
    }
    if (res.code === 200){
        ElMessage.success(`${data.id ? '修改' : '添加'}SPU成功！`);
        emit('change-scene');
        x.getExistingSpu();
    }
    else{
        ElMessage.error(`${data.id ? '修改' : '添加'}SPU失败：`+res.message);
    }
}


</script>

<style scoped>

</style>