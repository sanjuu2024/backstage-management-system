<template>
	<!-- 🔺🔺🔺展示和消失添加过渡动画。（要说的话确实高级很多） -->
	<router-view v-slot="{ Component }">
		<transition name="fade">
			<component :is="Component" v-if="flag" />
		</transition>
	</router-view>
</template>

<script lang="ts">
export default {
	name: 'MainArea',
};
</script>

<script setup lang="ts">
import { useSettingStore } from '@/store/modules/setting';
import { nextTick, ref, watch } from 'vue';
const settingStore = useSettingStore();
let flag = ref(true);
watch(
	() => settingStore.refresh,
	() => {
		flag.value = false;
		nextTick(() => {
			flag.value = true;
		});
	},
);
</script>

<style>
.fade-enter-from {
	opacity: 0;
	transform: scale(0);
}
.fade-enter-active {
	transition: all 0.5s ease;
}
.fade-enter-to {
	opacity: 1;
	transform: scale(1);
}
</style>
