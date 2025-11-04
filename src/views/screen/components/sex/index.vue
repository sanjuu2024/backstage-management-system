<!-- 左中——性别比例 -->
<template>
	<div class="box">
		<div class="title">
			<p>男女比例</p>
			<img src="../../images/dataScreen-title.png" />
		</div>
		<div class="sex">
			<div class="man">
				<img src="../../images/man.png" alt="man" />
			</div>
			<div class="woman">
				<img src="../../images/woman.png" alt="women" />
			</div>
		</div>
		<div class="rate">
			<p>男士58%</p>
			<p>女士42%</p>
		</div>
		<!-- 装echarts展示图形图标的节点 -->
		<div class="charts" ref="theCharts"></div>
	</div>
</template>

<script setup lang="ts">
import * as echarts from 'echarts';
import { onMounted, ref } from 'vue';
let theCharts = ref();
onMounted(() => {
	// 其实算两步走，但是也可以写一起成一行
	let myChart = echarts.init(theCharts.value);
	myChart.setOption({
		title: {
			text: '男女比例',
			textStyle: {
				color: '#999',
			},
			top: '-3', // px
		},
		xAxis: {
			show: false,
			min: 0,
			max: 100,
		},
		yAxis: {
			show: false,
			type: 'category', // 居然是用的y轴实现的，我还以为有专门的api
		},
		series: [
			// 用两个实现了一左一右不同颜色的pk图
			{
				type: 'bar',
				data: [58],
				barWidth: 20,
				itemStyle: {
					color: 'blue',
					borderRadius: 10,
				},
				z: 100, // 设为更高层，要不然就被下面的100%的女士横条整个覆盖了
			},
			{
				type: 'bar',
				data: [100],
				barWidth: 20,
				// 调整第二个横条,让他和第一条同一行(然后因为女士横条的设为100%，放下面会覆盖男士的，所以往上放了)
				barGap: '-100%',
				itemStyle: {
					color: 'hotpink',
					borderRadius: 10,
				},
			},
		],
		grid: {
			top: 0,
			bottom: 0,
			left: 30,
			right: 40,
		},
	});
});
</script>

<style scoped lang="scss">
.box {
	width: 100%;
	height: 100%;
	background-image: url('../../images/dataScreen-main-cb.png');
	background-size: 100% 100%;
	margin: 20px 0;
	.title {
		padding-left: 10px;
		padding-top: 10px;
		p {
			color: #fff;
			font-size: 20px;
		}
	}
	.sex {
		margin-top: 40px;
		display: flex;
		justify-content: space-evenly;
		align-items: center;
		.man {
			width: 111px;
			height: 115px;
			background: url('../../images/man-bg.png') no-repeat;
			display: flex;
			align-items: center;
			justify-content: center;
		}
		.woman {
			width: 111px;
			height: 115px;
			background: url('../../images/woman-bg.png') no-repeat;
			display: flex;
			align-items: center;
			justify-content: center;
		}
	}
	.rate {
		position: relative;
		width: 70%;
		left: 15%;
		margin-top: 10px;
		display: flex;
		justify-content: space-between;
		align-items: center;
		color: #fff;
		font-size: 18px;
	}
	.charts {
		height: 100px;
	}
}
</style>
