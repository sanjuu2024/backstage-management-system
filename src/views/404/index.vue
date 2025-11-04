<template>
	<div class="box">
		<img src="../../assets/images/error_images/404.png" alt="" />
		<button @click="goHome">返回首页</button>
	</div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
const router = useRouter();
function goHome() {
	router.replace('/home');
}
</script>

<style scoped lang="scss">
.box {
	width: 100vw;
	height: 100vh;
	// display: flex;
	// justify-content: center;
	// align-items: center;
	button {
		display: block;
		margin: auto;
	}
}
</style>
