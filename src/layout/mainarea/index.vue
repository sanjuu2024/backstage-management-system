<template>
	<router-view v-slot="{ Component }">
		<transition name="fade">
			<component :is="Component" />
		</transition>
	</router-view>
</template>

<script lang="ts">
export default {
	name: 'MainArea'
}
</script>

<script setup lang="ts"></script>

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
