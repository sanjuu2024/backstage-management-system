<template>
	<div class="container">
		<div class="screen" ref="theScreen">
			<div class="top"></div>
			<div class="bottom">
				<div class="left"></div>
				<div class="center"></div>
				<div class="right"></div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';

defineOptions({
	name: 'Screen',
});

// 获取数据大屏盒子实例
let theScreen = ref();

// 计算缩放比例
function getScale(w = 1920, h = 1080) {
	let scaleX = window.innerWidth / w;
	let scaleY = window.innerHeight / h;
	return Math.min(scaleX, scaleY);
}

// 缩放
onMounted(() => {
	theScreen.value.style.transform = `scale(${getScale()}) translate(-50%, -50%)`;
});
window.onresize = () => {
	theScreen.value.style.transform = `scale(${getScale()}) translate(-50%, -50%)`;
};
</script>

<style scoped lang="scss">
.container {
	position: relative;
	width: 100vw;
	height: 100vh;
	background: url(./images/bg.png) no-repeat;
	background-size: cover;
	.screen {
		position: fixed;
		width: 1920px;
		height: 1080px;
		left: 50%;
		top: 50%;
		transform-origin: left top;
		background-color: orange;
	}
}
</style>
