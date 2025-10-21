<template>
    <div class="tabbar_left">
        <!-- 收起/打开菜单 -->
        <el-icon @click="changeIcon">
            <component :is="settingStore.fold ? 'Fold' : 'Expand'"/>
        </el-icon>
        <!-- 其实感觉element-plus的Expand和Fold图标不好看() -->
        <!-- <img src="/public/list.ico" width="40px"/> -->
        <!-- 🍉面包屑，根据router的matched属性实现 -->
        <!-- 面包屑的属性也可以separator="/"等。 -->
        <!-- <button @click="console.log(router);">test</button> -->
        <el-breadcrumb :separator-icon="ArrowRight">
            <template v-for="(item,i) in router.matched" :key="item.name">
                <el-breadcrumb-item v-if="item.name !== 'Layout'">
                    <el-icon>
                        <component :is="item.meta.icon"/>
                    </el-icon>
                    <a :href="item.path">{{ item.meta.title }}</a>
                </el-breadcrumb-item>
            </template>
        </el-breadcrumb>
    </div>
</template>

<script lang="ts">
export default {
    name: 'Breadcrumb'
}
</script>
    
<script setup lang='ts'>
import { ArrowRight } from '@element-plus/icons-vue';
import { useSettingStore } from '@/store/modules/setting';
import { useRoute } from 'vue-router';    // 🍉注意是useRoute而不是useRouter！！！
const router = useRoute();
const settingStore = useSettingStore();
function changeIcon(){
    settingStore.fold = !settingStore.fold;
}    
</script>
    
<style>
.tabbar_left{
    display: flex;
    align-items: center;
    .el-icon {
        margin: 20px;
    }
} 
</style>