<template>
    <div class="tabbar">
        <!-- 左侧 -->
        <BreadCrumb/>
        <!-- 右侧 -->
        <Settings/>
    </div>
</template>

<script lang="ts">
export default {
    name: 'Tabbar'
}
</script>
    
<script setup lang='ts'>
import BreadCrumb from './breadcrumb/index.vue';
import Settings from './setting/index.vue';
</script>
    
<style scoped lang="scss">
.tabbar {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: space-between;
}  
</style>