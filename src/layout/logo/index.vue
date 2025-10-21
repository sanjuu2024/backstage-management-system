<template>
	<div class="logo" v-show="!setting.logoHidden">
		<img :src="setting.logo" width="200px" alt="logo" :class="{fold:settingStore.fold}"/>
		<p>{{ setting.title }}</p>
	</div>
</template>

<script lang="ts">
export default {
	name: 'Logo',
};
</script>

<script setup lang="ts">
// 引入标题文字和logo路径的配置
import setting from '@/setting';
import { useSettingStore } from '@/store/modules/setting';
const settingStore = useSettingStore();
</script>

<style scoped lang="scss">
.logo {
	width: 100%;
	height: $base-menu-logo-height;
	color: #fff;
	display: flex;
	align-items: center; // 竖直对齐
	padding: 20px;
	img {
		width: 50px;
		&.fold {
			width: 40px;
			margin-left: -9px;
		}
	}
	p {
		margin-left: 10px;
		font-size: $base-logo-title-size;
		white-space: nowrap;   // 为了后面菜单打开/收起时候logo的文字不会换行(虽然只看得见0.几秒)
	}
}
</style>
