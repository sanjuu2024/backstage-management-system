<template>
	<div class="layout_container">
		<!-- 左侧菜单 -->
		<div class="layout_slider">
            <Logo/>
            <!-- 展示菜单，包装在一个滚动组件里 -->
            <el-scrollbar class="scrollbar">
                <!-- 菜单组件 -->
                <el-menu background-color="#001529" text-color="#fff">
                    <!-- 🔺封装成组件！可以根据路由动态生成多级菜单！！！ -->
                    <Menu :menuList="userStore.menuRoutes"></Menu>
                </el-menu>
            </el-scrollbar>
        </div>

		<!-- 顶部导航 -->
		<div class="layout_tabbar">

        </div>

		<!-- 内容展示区域 -->
		<div class="layout_main">
			<Main></Main>
			<!-- <p style="height: 100000px">test</p> -->
		</div>
	</div>
</template>

<script setup lang="ts">
import Logo from './logo/index.vue';
// 对哦，写一半才想起来element-plus全引入了，不用写。
// import { ElScrollbar,ElMenu,ElMenuItem,ElSubMenu } from 'element-plus';
import Menu from './menu/index.vue';
import Main from './main/index.vue';
// 不同用户对应的路由菜单不同；所以路由数组存在store中
import { useUserStore } from '@/store/modules/user';
let userStore = useUserStore();
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
        .scrollbar {
            width: 100%;
            height: calc(100vh - $base-menu-logo-height);
            .el-menu{
                border-right: none;
            }
        }
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
