<template>
	<div class="top">
		<div class="left">
			<span class="lbtn" @click="goHome">首页</span>
		</div>
		<div class="center">
			<div class="title">智慧旅游可视化大数据平台</div>
		</div>
		<div class="right">
			<span class="rbtn">统计报告</span>
			<span class="time">当前时间：{{ currentTime }}</span>
		</div>
	</div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import moment from 'moment';
import { onBeforeUnmount, onMounted, ref } from 'vue';
const router = useRouter();

// 当前时间
const currentTime = ref(moment().format('YYYY年MM月DD日 HH:mm:ss'));
// 记录计时器
let timer: number = 0;

onMounted(() => {
	timer = setInterval(() => {
		currentTime.value = moment().format('YYYY年MM月DD日 HH:mm:ss');
	}, 1000);
});

onBeforeUnmount(() => {
	clearInterval(timer);
});

// 跳转首页
function goHome() {
	router.push('/home');
}
</script>

<style scoped lang="scss">
.top {
	width: 100%;
	height: 40px;
	display: flex;
	.left {
		flex: 1.5;
		background-image: url('../../images/dataScreen-header-left-bg.png');
		background-size: cover;
		.lbtn {
			width: 150px;
			height: 40px;
			float: right;
			background-image: url('../../images/dataScreen-header-btn-bg-l.png');
			background-size: cover;
			text-align: center;
			color: #29fcff;
			line-height: 40px;
			font-size: 20px;
		}
	}
	.center {
		flex: 2;
		.title {
			width: 100%;
			height: 74px;
			text-align: center;
			line-height: 74px;
			background: url('../../images/dataScreen-header-center-bg.png');
			background-size: cover;
			color: #29fcff;
			font-size: 30px;
		}
	}
	.right {
		flex: 1.5;
		background-image: url('../../images/dataScreen-header-right-bg.png');
		background-size: cover;
		display: flex;
		justify-content: space-between;
		align-items: center;
		.rbtn {
			width: 150px;
			height: 40px;
			background-image: url('../../images/dataScreen-header-btn-bg-r.png');
			background-size: cover;
			text-align: center;
			color: #29fcff;
			line-height: 40px;
			font-size: 20px;
		}
		.time {
			color: #29fcff;
			font-size: 20px;
			margin-right: 10px;
		}
	}
}
</style>
