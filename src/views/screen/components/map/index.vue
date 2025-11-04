<!-- 数据大屏的地图显示 -->
<template>
	<div class="box" ref="map"></div>
</template>

<script setup lang="ts">
import * as echarts from 'echarts';
import { onMounted, ref } from 'vue';
import chinaJson from './china.json';

let map = ref();

// 注册中国地图
echarts.registerMap('china', chinaJson as any);

onMounted(() => {
	echarts.init(map.value).setOption({
		// 地图配置
		geo: {
			map: 'china',
			roam: true, // 可以鼠标放大地图和拖拽
			zoom: 1.2, // 地图大小缩放
			label: {
				// 各数据名称（比如我的json的数据精度是省份）是否显示等配置
				show: true,
				color: '#fff',
				fontSize: 12,
			},
			top: 100,
			itemStyle: {
				// 地图区域每个多边形的配置
				borderColor: 'rgba(0, 255, 236, 1)',
				borderWidth: 1,
				areaColor: {
					type: 'radial', // 径向渐变，三个参数分别是圆心的x,y和半径,取值都是0~1，相当于百分比
					x: 0.5,
					y: 0.5,
					r: 0.8,
					colorStops: [
						{
							offset: 0,
							color: 'rgba(0, 255, 236, 0)', // 0% 处的颜色
						},
						{
							offset: 1,
							color: 'rgba(0, 255, 236, .2)', // 100% 处的颜色
						},
					],
					globalCoord: false, // 缺省为 false
				},
				// shadowColor: 'rgba(0, 255, 236, 1)',   // ！这个颜色加上跟发光效果一样，非常刻板印象中的智能数据科技面板(bushi)
				shadowBlur: 10,
			},
			emphasis: {
				// 高亮配置
				itemStyle: {
					// 唔，我觉得默认的高亮样式搭配现在的样式挺合适的就不改了
				},
				label: {
					// 不果高亮区域的文字大小可以再大一点
					fontSize: 30,
					color: '#fff',
				},
			},
		},
		// 折线(飞机航线)配置
		grid: {
			top: 0,
			bottom: 0,
			left: 0,
			right: 0,
		},
		series: [
			{
				type: 'lines',
				data: [
					{
						coords: [
							[116.405285, 39.904989], // 起点(北京)
							[120.153576, 30.272152], // 终点(杭州)
						],
					},
					{
						coords: [
							[104.065735, 30.659462], // 起点(成都)
							[113.280637, 23.125178], // 终点(广州)
						],
					},
				],
				lineStyle: {
					color: '#fff',
					width: 5,
					curveness: 0.2, // 线条曲度
				},
				effect: {
					show: true,
					period: 2, // 箭头运动时间，值越小速度越快
					trailLength: 0.2, // 箭头尾迹长度，值越大尾迹越长
					symbol: 'arrow', // 箭头样式
					symbolSize: 20, // 箭头大小
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
}
</style>
