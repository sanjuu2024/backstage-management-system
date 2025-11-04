<!-- 数据大屏的游客数量趋势折线图 -->
<template>
	<div class="box">
		<div class="title">
			<p>未来七天游客数量趋势图</p>
			<img src="../../images/dataScreen-title.png" />
		</div>
		<div class="charts" ref="theCharts"></div>
	</div>
</template>

<script setup lang="ts">
import * as echarts from 'echarts';
import { onMounted, ref } from 'vue';
let theCharts = ref();
onMounted(() => {
	echarts.init(theCharts.value).setOption({
		grid: {
			top: 40,
			bottom: 40,
			left: 80,
			right: 60,
		},
		title: {
			text: '游客访问量趋势图',
			textStyle: {
				color: '#fff',
				fontSize: 18,
			},
		},
		xAxis: {
			type: 'category',
			boundaryGap: false, // 两侧不留白
			splitLine: {
				show: false, // 去除网格线
			},
			data: [
				'周一',
				'周二',
				'周三',
				'周四',
				'周五',
				'周六',
				'周日',
				'周一',
				'周二',
			], // 坐标轴上的刻度
			axisLabel: {
				color: '#fff', // 坐标轴文字颜色
				fontSize: 15,
			},
			axisLine: {
				// 轴线的设置
				show: true, // 轴线显示出来
			},
			axisTick: {
				// 刻度的设置
				show: true, // 刻度线显示出来
			},
		},
		yAxis: {
			splitLine: {
				show: false, // 去除网格线
			},
			axisLabel: {
				color: '#fff', // 坐标轴文字颜色
				fontSize: 15,
			},
			axisLine: {
				// 轴线的设置
				show: true, // 轴线显示出来
			},
			axisTick: {
				// 刻度的设置
				show: true, // 刻度线显示出来
			},
		},
		series: [
			{
				type: 'line', // 折线图
				data: [150, 260, 120, 240, 100, 390, 250, 460, 400],
				smooth: true, // 折线平滑
				areaStyle: {
					// 区域填充样式
					color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
						{
							offset: 0,
							color: 'orange', // 渐变色的起始颜色
						},
						{
							offset: 1,
							color: 'rgba(255, 255, 255, 0)', // 渐变色的结束颜色
						},
					]),
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
	background: url('../../images/dataScreen-main-cb.png') no-repeat;
	background-size: 100% 100%;
	box-sizing: border-box;
	.title {
		padding-left: 10px;
		padding-top: 10px;

		p {
			color: #fff;
			font-size: 20px;
		}
	}
	.charts {
		// height: 100%
		height: 200px;
	}
}
</style>
