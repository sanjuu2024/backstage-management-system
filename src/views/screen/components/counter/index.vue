<template>
	<div class="box">
		<div class="title">
			<p>游客消费统计</p>
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
			text: '游客消费统计',
			textStyle: {
				color: '#fff',
				fontSize: '16px',
			},
		},
		legend: {
			data: ['购物', '饮食'],
		},
		radar: {
			// shape: 'circle',
			indicator: [
				{ name: '峨眉山', max: 6500 },
				{ name: '万里长城', max: 16000 },
				{ name: '北京天安门', max: 30000 },
				{ name: '长隆动物园', max: 38000 },
				{ name: '三星堆博物馆', max: 52000 },
				{ name: '北京故宫', max: 25000 },
			],
			axisName: {
				// 以上indicator们的name的配置
				color: '#fff',
				fontSize: '15px',
			},
			nameGap: 8, // 调整以上indicator们的name距离雷达图的距离
		},
		series: [
			{
				type: 'radar',
				data: [
					{
						value: [4200, 3000, 20000, 35000, 50000, 18000],
						name: '购物',
					},
					{
						value: [5000, 14000, 28000, 26000, 42000, 21000],
						name: '饮食',
					},
				],
				// 图太小label显示出来挤一块了
				// label:{
				// 	show: true,
				// 	color: '#fff'
				// }
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
