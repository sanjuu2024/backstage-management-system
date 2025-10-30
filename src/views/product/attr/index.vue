<template>
    <div>
        <Category :scene="scene"></Category>
        <el-card style="margin: 10px 0;">

            <div v-show="scene === 0">
                <el-button type="primary" icon="Plus" :disabled="!categoryStore.c3Id" @click="addAttr">添加新的属性</el-button>
                <el-table border style="margin:10px 0;" :data="attrList">
                    <el-table-column label="序号" type="index" align="center" width="80px"></el-table-column>
                    <el-table-column label="属性名称" align="center" width="100px" prop="attrName"></el-table-column>
                    <el-table-column label="属性值" align="center">
                        <template #="{ row }">
                            <el-tag v-for="(item, idx) in row.attrValueList" :key="item.id" style="margin: 5px;">
                                {{ item.valueName }}
                            </el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" align="center">
                        <template #="{ row }">
                            <el-button type="warning" icon="Edit" @click="updateAttr(row)"></el-button>
                            <!-- 给删除按钮加一个气泡确认框 -->
                            <el-popconfirm title="确认删除该属性？" width="200" icon="Delete" icon-color="red" @confirm="deleteArr(row.id)">
                                <template #reference>
                                    <el-button type="danger" icon="Delete"></el-button>
                                </template>
                            </el-popconfirm>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            
            <!-- 点击添加属性按钮后出现的部分 -->
            <div v-show="scene === 1">
                <el-form inline>
                    <el-form-item label="属性名称">
                        <el-input placeholder="请输入属性名称" v-model="attrParams.attrName"></el-input>
                    </el-form-item>
                </el-form>
                <el-button type="primary" icon="Plus" :disabled="!attrParams.attrName" @click="addAttrValueRow">添加属性值</el-button>
                <el-button @click="scene = 0">取消</el-button>
                <el-table border style="margin: 10px 0;" :data="attrParams.attrValueList">
                    <el-table-column label="序号" width="80px" type="index" align="center"></el-table-column>
                    <el-table-column label="属性值名称"  align="center" prop="valueName">
                        <template #="{row,$index}">
                            <el-input v-show="row.flag" @blur="handleBlur(row, $index)" v-model="row.valueName" placeholder="请输入属性值名称" required></el-input>
                            <div v-show="!row.flag" @click="row.flag = true" class="view">{{ row.valueName }}</div>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" align="center"></el-table-column>
                </el-table>
                <el-button type="primary" icon="Document" @click="saveAttr" :disabled="Boolean(!attrParams.attrValueList.length)">保存</el-button>
                <el-button type="primary" icon="CircleClose" @click="scene = 0">取消</el-button>
            </div>

        </el-card>
    </div>
</template>

<script setup lang="ts">
import { reqAddOrUpdateAttr, reqDeleteAttr } from '@/api/product/attr';
import type { AttrResponseData, Attr, AttrValue } from '@/api/product/attr/type';
import { useCategoryStore } from '@/store/modules/category';
import { ElMessage } from 'element-plus';
import { storeToRefs } from 'pinia';
import { reactive, ref, watch } from 'vue';

const categoryStore = useCategoryStore();

let { c3Id } = storeToRefs(categoryStore);
let attrList = reactive<Attr[]>([]);
let scene = ref<number>(0);
let attrParams = reactive<Attr>({
    attrName: '',
    attrValueList: [],
    categoryId: '',   // 三级分类的id
    categoryLevel: 3
});

// 获取属性列表到AttrList中
async function getAttr2(){
    // 应该每次重新获取值之前清空：
    attrList.length = 0;   // 🔺🔺🔺正确的清空响应式数组的方法
    let res: AttrResponseData = await categoryStore.getAttr();
    if (res.code === 200) {
        Object.assign(attrList, res.data);
    }
    else {
        ElMessage.error('获取属性数据失败！'+res.message);
    }
}

watch(c3Id, async () => {
    if (c3Id.value) {
        getAttr2();
    }
});

// 点击了“添加新的属性”按钮
function addAttr() {
    scene.value = 1;
    attrParams.attrName = '';
    attrParams.attrValueList = [];
    attrParams.categoryId = c3Id.value;
}

// 点击了属性行后面的修改按钮
function updateAttr(row:Attr) {
    scene.value = 1;
    scene.value = 1;
    attrParams.id = row.id;
    attrParams.attrName = row.attrName;
    attrParams.attrValueList = row.attrValueList;
    attrParams.categoryId = c3Id.value;
}

// 点击了属性行后面的删除气泡的确认按钮
async function deleteArr(attrId:number) {
    let res:any = await reqDeleteAttr(attrId);
    if (res.code == 200){
        ElMessage.success('删除属性成功！');
        getAttr2();
    }
    else{
        ElMessage.error('删除属性失败：'+res.message);
    }
}

// 点击了“添加属性值”按钮
function addAttrValueRow(){
    attrParams.attrValueList.push({
        valueName: '',
        flag: true
    } as AttrValue);
}

// 点击了"保存"按钮
async function saveAttr(){
    // 需要检查空和重复(因为有可能添加属性值时没blur直接点了保存，那么此时为空也会被存储的。)
    // 姑且套了一个nextTick()试试
    // await nextTick();   // 然后发现没用。不得不手动检查了
    const m = new Map<string, boolean>();
    let ok = true;
    attrParams.attrValueList.forEach((item,idx) => {
        if (item.valueName.trim() === '') {
            ElMessage.error('属性值名称不能为空！');
            attrParams.attrValueList.splice(idx, 1);
            ok = false;
            return;
        }
        if (m.has(item.valueName)) {
            ElMessage.error('属性值名称不能重复！');
            attrParams.attrValueList.splice(idx, 1);
            ok = false;
            return;
        }
        m.set(item.valueName, true);
    });
    if (!ok) return;
    let res = await reqAddOrUpdateAttr(attrParams);
    if (res.code === 200){
        ElMessage.success(`${attrParams.id ? '修改' : '添加'}属性成功！`);
        scene.value = 0;

        getAttr2();
    }
    else{
        ElMessage({
            type: 'error',
            message: attrParams.id ? '修改失败！' : '添加失败！'
        });
    }
}

// 添加属性值时如果从编辑模式触发blur了
function handleBlur(row:AttrValue,idx:number){
    console.log('asdf');
    // console.log("row: ",row);
    row.valueName = row.valueName.trim();
    row.flag = false;
    if (row.valueName === '') {
        ElMessage.error('属性值名称不能为空！');
        attrParams.attrValueList.splice(idx, 1);
        return;
    }
    
    // 检查重复
    let ok = true;
    attrParams.attrValueList.forEach((item) => {
        if (item !== row && item.valueName === row.valueName) {
            ok = false;
            return;
        }
    });
    if (!ok) {
        ElMessage.error('属性值名称不能重复！');
        attrParams.attrValueList.splice(idx, 1);
        return;
    }
}

</script>

<style scoped>
div.view{
    background: linear-gradient(to right,pink,skyblue);
    padding: 5px;
}
</style>