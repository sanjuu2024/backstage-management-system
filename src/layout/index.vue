<template>
    <div class="layout_container">
        <!-- 左侧菜单 -->
        <div class="layout_slider"></div>
        <!-- 顶部导航 -->
        <div class="layout_tabbar"></div>
        <!-- 内容展示区域 -->
        <div class="layout_main">
            <p style="height: 1000px;">test</p>
        </div>
    </div>
</template>
    
<script setup lang='ts'>
    
</script>
    
<style scoped lang="scss">
.layout_container {
    width: 100%;
    height: 100vh;
    background: red;
    .layout_slider {
        height: 100vh;
        width: $base-menu-width;
        background-color: $base-menu-background-color;
    }
    .layout_tabbar {
        position: fixed;
        // width: 100%;   // 不能遮住左边的侧栏
        width: calc(100% - $base-menu-width);
        height: $base-tabbar-height;
        background-color: yellow;
        top: 0;
        right: 0;
    }
    .layout_main {
        position: absolute;
        width: calc(100% - $base-menu-width);
        height: calc(100vh - $base-tabbar-height);
        right: 0;
        top: $base-tabbar-height;
        padding: 20px;
        background-color: green;
        box-sizing: border-box;
        overflow: auto;
    }
}
</style>