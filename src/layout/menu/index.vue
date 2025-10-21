<!-- 🔺根据项目路由动态生成菜单 -->
<template>
	<!-- 一级菜单不被折叠，直接展示；这外面的template其实是拿来包每一组一级路由的，
        因为要不要展示折叠菜单，跟一级路由有无二级子路由等相关，
        而逻辑代码需要包裹起来复用的，但是一级菜单又只是一个标签，不像div之类的。
        所以最后使用template包装 -->
	<!-- 显示的是处理过后的扁平化菜单 -->
	<template v-for="(route, i) in flattenedMenuList" :key="route.path">
		<!-- 🍰如果没有子路由那就是普通菜单 -->
		<template v-if="!route.children">
			<el-menu-item
				:index="route.name"
				v-if="!route.meta?.hidden"
				@click="goRoute"
			>
				<el-icon>
					<!-- 🍉学到了，原来vue还能这么写 -->
					<component :is="route.meta?.icon"></component>
				</el-icon>
				<template #title>
					<span>{{ route.meta?.title }}</span>
				</template>
			</el-menu-item>
		</template>

		<!-- 🍰如果有子路由那就是折叠菜单 -->
		<template v-else>
			<el-sub-menu
				:index="route.name"
				v-if="!route.meta?.hidden"
				@click="goRoute"
			>
				<template #title>
					<el-icon>
						<!-- 🍉学到了，原来vue还能这么写 -->
						<component :is="route.meta?.icon"></component>
					</el-icon>
					<span>{{ route.meta?.title }}</span>
				</template>
				<Menu :menuList="route.children"></Menu>
			</el-sub-menu>
		</template>
	</template>
</template>

<script lang="ts">
export default {
	name: 'Menu',
};
</script>

<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';

const router = useRouter();
const props = defineProps<{
	menuList: RouteRecordRaw[];
}>();

// 扁平化菜单，把Layout的子路由提升为一级菜单，这样就不会在左侧菜单栏上展示Layout了
const flattenedMenuList = computed(() => {
	const result: RouteRecordRaw[] = [];

	props.menuList.forEach((route) => {
		// 如果是Layout路由且被隐藏，将其子路由提升为一级菜单
		if (route.name === 'Layout' && route.meta?.hidden && route.children) {
			// 直接添加 Layout 的子路由到结果中
			result.push(...route.children);
		} else {
			// 其他路由正常添加
			result.push(route);
		}
	});

	return result;
});

function goRoute(menuItem: any) {
	// 点击菜单项时跳转路由
	if (menuItem.index) {
		router.push({ name: menuItem.index });
	}
}
</script>

<style></style>
