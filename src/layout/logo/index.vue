<template>
    <div class="logo" v-show="!setting.logoHidden">
        <img :src="setting.logo" width="200px" alt="logo"/>
        <p>{{ setting.title }}</p>
    </div>
</template>

<script lang="ts">
export default {
    name:'Logo'
}
</script>
    
<script setup lang='ts'>
// 引入标题文字和logo路径的配置
import setting from '@/setting';
</script>
    
<style scoped lang="scss">
.logo {
    width: 100%;
    height: $base-menu-logo-height;
    color: #fff;
    display: flex;  
    align-items: center;   // 竖直对齐
    padding: 20px;
    img{
        width: 50px;
    }
    p{
        margin-left: 10px;
        font-size: $base-logo-title-size;
    }
}
</style>