<template>
	<div class="layout_container">
		<!-- 左侧菜单 -->
		<!-- 🍉🔺🔺🔺学到了，还可以这样用对象写法动态绑定样式类；为true则标签绑定该类否则不绑 -->
		<div class="layout_slider" :class="{ fold: settingStore.fold }">
			<Logo />
			<!-- 展示菜单，包装在一个滚动组件里 -->
			<el-scrollbar class="scrollbar">
				<!-- 菜单组件 -->
				<!-- active-text-color可以设置当前被点击的路由的文字的颜色(橙色心暖暖,suki。) -->
				<!-- 使用default-active解决一些菜单高亮的小问题，需要动态绑定，绑定的是菜单项的index!（我设置为了路由名字。）设置之后默认重定向时home也能高亮了、刷新页面后子路由所在菜单也还是展开的。good。 -->
				<el-menu
					background-color="#001529"
					text-color="#fff"
					active-text-color="orange"
					:default-active="route.name"
					:collapse="settingStore.fold"
				>
					<!-- 🔺封装成组件！可以根据路由动态生成多级菜单！！！ -->
					<Menu :menuList="userStore.menuRoutes"></Menu>
				</el-menu>
			</el-scrollbar>
		</div>

		<!-- 顶部导航 -->
		<div class="layout_tabbar" :class="{ expand: settingStore.fold }">
			<Tabbar></Tabbar>
		</div>

		<!-- 内容展示区域 -->
		<div class="layout_main" :class="{ expand: settingStore.fold }">
			<MainArea></MainArea>
			<!-- <p style="height: 100000px">test</p> -->
		</div>
	</div>
</template>

<script lang="ts">
export default {
	name: 'Layout',
};
</script>

<script setup lang="ts">
import Logo from './logo/index.vue';
// 对哦，写一半才想起来element-plus全引入了，不用写。
// import { ElScrollbar,ElMenu,ElMenuItem,ElSubMenu } from 'element-plus';
import Menu from './menu/index.vue';
import Tabbar from './tabbar/index.vue';
import MainArea from './mainarea/index.vue';
// 不同用户对应的路由菜单不同；所以路由数组存在store中
import { useUserStore } from '@/store/modules/user';
// 引入路由，然后借助路由的el-menu的default-active属性解决菜单高亮的一些bug/不太满意的地方
import { useRoute } from 'vue-router';
// 引入布局配置仓库
import { useSettingStore } from '@/store/modules/setting';
let userStore = useUserStore();
const route = useRoute();
const settingStore = useSettingStore();
</script>

<style scoped lang="scss">
.layout_container {
	overflow: hidden;
	width: 100%;
	height: 100vh;
	// background: red;
	// background-color: #fff;
	.layout_slider {
		height: 100vh;
		width: $base-menu-width;
		background-color: $base-menu-background-color;
		transition: all 0.3s;
		// color: #fff;   // 陷入沉思...才发现自己没写fff，但是我的左侧菜单怎么能展示白色文字？
		.scrollbar {
			width: 100%;
			height: calc(100vh - $base-menu-logo-height);
			.el-menu {
				border-right: none;
			}
		}
		// 🍉scss新语法学到+1
		&.fold {
			width: $base-menu-min-width;
		}
	}
	.layout_tabbar {
		position: fixed;
		// width: 100%;   // 不能遮住左边的侧栏
		width: calc(100% - $base-menu-width);
		height: $base-tabbar-height;
		// background-color: #fff;
		top: 0;
		transition: all 0.3s;
		// right: 0;
		left: $base-menu-width;
		&.expand {
			width: calc(100vw - $base-menu-min-width);
			left: $base-menu-min-width;
		}
	}
	.layout_main {
		position: absolute;
		width: calc(100% - $base-menu-width);
		height: calc(100vh - $base-tabbar-height);
		transition: all 0.3s;
		left: $base-menu-width; // 并不适合写right:0！否则当比如用控制台把页面视口拉剩很窄的时候，内容区域会突出、覆盖菜单栏。
		top: $base-tabbar-height;
		padding: 20px;
		// background-color: green;
		// background-color: #fff;
		box-sizing: border-box;
		overflow: auto;
		&.expand {
			width: calc(100vw - $base-menu-min-width);
			left: $base-menu-min-width;
		}
	}
}
</style>
