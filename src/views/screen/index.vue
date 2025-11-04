<template>
	<div class="container">
		<div class="screen" ref="theScreen">
			<div class="top">
				<Top />
			</div>
			<div class="bottom">
				<div class="left">
					<Tourist class="tourist" />
					<Sex class="sex" />
					<Age class="age" />
				</div>
				<div class="center">
					<Map class="map"></Map>
					<Line class="line"></Line>
				</div>
				<div class="right">
					<Rank class="rank"></Rank>
					<Year class="year"></Year>
					<Counter class="counter"></Counter>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
// 引入顶部组件
import Top from './components/top/index.vue';
// 引入左侧组件
import Tourist from './components/tourist/index.vue';
import Sex from './components/sex/index.vue';
import Age from './components/age/index.vue';
// 引入中间组件
import Map from './components/map/index.vue';
import Line from './components/line/index.vue';
// 引入右侧组件
import Rank from './components/rank/index.vue';
import Year from './components/year/index.vue';
import Counter from './components/counter/index.vue';

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
	position: fixed;
	left: 0;
	top: 0;
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
		// background-color: orange;
		// div{
		// 	overflow: hidden;
		// }
		.top {
			width: 100%;
			height: 40px;
		}
		.bottom {
			display: flex;
			.left {
				flex: 1;
				height: 1040px;
				display: flex;
				flex-direction: column;
				.tourist {
					flex: 1.5;
				}
				.sex {
					flex: 1;
				}
				.age {
					flex: 1;
				}
			}
			.center {
				flex: 2.5;
				height: 1040px;
				display: flex;
				flex-direction: column;
				margin: 0 10px;
				.map {
					flex: 3.5;
				}
				.line {
					flex: 1;
				}
			}
			.right {
				flex: 1;
				height: 1040px;
				display: flex;
				flex-direction: column;
				.rank {
					flex: 1.5;
				}
				.year {
					flex: 1;
				}
				.counter {
					flex: 1;
				}
			}
		}
	}
}
</style>
