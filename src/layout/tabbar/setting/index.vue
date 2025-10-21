<template>
    <div class="tabbar_right">
        <el-button :icon="Refresh" circle></el-button>
        <el-button :icon="FullScreen" circle></el-button>
        <el-button :icon="Setting" circle></el-button>
        <img src="/public/logo.png" alt="头像" height="40px"/>
        <el-dropdown>
            <span class="el-dropdown-link">admin<el-icon class="el-icon--right">
                <arrow-down />
            </el-icon>
            </span>
            <template #dropdown>
                <el-dropdown-menu>
                    <el-dropdown-item>
                        <el-icon>
                            <SwitchButton/>
                        </el-icon>
                        退出登录
                    </el-dropdown-item>
                </el-dropdown-menu>
            </template>
        </el-dropdown>
    </div>
</template>

<script lang="ts">
export default {
    name: 'Setting'
}
</script>
    
<script setup lang='ts'>
import { FullScreen, Refresh, Setting } from '@element-plus/icons-vue';
    
</script>
    
<style>
.tabbar_right{
    display: flex;
    align-items: center;
    img{
        margin: 0 10px;
    }
    .el-dropdown {
        margin: 10px;
    }
}
</style>