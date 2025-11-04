<template>
	<div class="box">
		<div class="title">
			<p>年度游客量对比</p>
			<img src="../../images/dataScreen-title.png" />
		</div>
		<div class="chart" ref="theChart"></div>
	</div>
</template>

<script setup lang="ts">
import * as echarts from 'echarts';
import { onMounted, ref } from 'vue';
let theChart = ref();
onMounted(() => {
	echarts.init(theChart.value).setOption({
		title: {
			text: '年度游客量对比',
			textStyle: {
				color: '#fff',
				fontSize: '18px',
			},
			top: 30,
		},
		xAxis: {
			type: 'category',
			show: true,
			splitLine: {
				show: false,
			},
		},
		yAxis: {},
		grid: {
			top: 30,
			bottom: 40,
			left: 40,
			right: 30,
		},
		series: [
			{
				type: 'scatter',
				data: [
					33, 44, 234, 421, 45, 543, 234, 467, 76, 56, 234, 453, 444,
				],
				symbol: 'arrow',
				label: {
					show: true,
					position: 'top',
					color: '#fff',
				},
				itemStyle: {
					// 散点图标
					color: 'cyan', // 也可以渐变,这里没写。
				},
			},
		],
	});
});
</script>

<style scoped lang="scss">
.box {
	width: 100%;
	height: 100%;
	background: url('../../images/dataScreen-main-rb.png') no-repeat;
	background-size: 100% 100%;
	box-sizing: border-box;
	margin: 20px 0;
	.title {
		padding-left: 10px;
		padding-top: 10px;
		p {
			color: #fff;
			font-size: 20px;
		}
	}
	.chart {
		height: 100%;
	}
}
</style>
