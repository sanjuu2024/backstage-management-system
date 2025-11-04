<template>
	<div class="box">
		<div class="title">
			<p>热门景区排行</p>
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
			text: '热门景区排行',
			link: 'https://www.baidu.com',
			textStyle: {
				color: 'yellowgreen',
				fontSize: 18,
			},
			subtext: '各大景区',
			subtextStyle: {
				color: 'yellowgreen',
				fontSize: 14,
			},
			top: 20,
		},
		xAxis: {
			max: 500,
		},
		yAxis: {
			type: 'category',
			data: [
				'峨眉山',
				'稻城亚丁',
				'九寨沟',
				'万里长城',
				'北京故宫',
				'长隆动物园',
			],
			axisLabel: {
				color: '#fff',
				fontSize: '16px',
			},
		},
		grid: {
			top: 80,
			bottom: 40,
			left: 100,
			right: 50,
		},
		series: [
			{
				type: 'bar',
				data: [100, 200, 300, 200, 150, 400],
				label: {
					show: true,
					position: 'insideRight',
					color: '#fff',
					fontSize: '16px',
				},
				showBackground: true,
				backgroundStyle: {
					// 数据条背景渐变(比如该数据条40%，则背景在41%到100%可见)
					color: {
						type: 'linear', // 线性渐变
						x: 1, // 水平方向渐变
						y: 0,
						x2: 0,
						y2: 0,
						colorStops: [
							{
								offset: 0,
								color: 'black', // 0处
							},
							{
								offset: 1,
								color: 'blue', // 1处
							},
						],
					},
				},
				itemStyle: {
					// 数据条样式
					borderRadius: [0, 10, 10, 0], // 顺时针左上，右上，右下，左下
					color: function (data: any) {
						// 有点好玩，color可以返回一个函数动态决定颜色
						// console.log(data);
						let arr = [
							'red',
							'orange',
							'yellowgreen',
							'green',
							'purple',
							'hotpink',
						];
						return arr[data.dataIndex];
					},
				},
			},
		],
		tooltip: {},
	});
});
</script>

<style scoped lang="scss">
.box {
	width: 100%;
	height: 100%;
	background: url('../../images/dataScreen-main-rb.png') no-repeat;
	background-size: 100% 100%;
	.title {
		padding-left: 10px;
		padding-top: 20px;
		p {
			color: #fff;
			font-size: 20px;
		}
	}
	.chart {
		height: 300px;
	}
}
</style>
