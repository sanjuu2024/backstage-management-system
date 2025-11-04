<!-- 左下——年龄比例 -->
<template>
	<div class="box">
		<div class="title">
			<p>年龄比例</p>
			<img src="../../images/dataScreen-title.png" />
		</div>
		<!-- 装echarts展示图形图标的节点 -->
		<div class="charts" ref="theCharts"></div>
	</div>
</template>

<script setup lang="ts">
import type { Right } from '@element-plus/icons-vue';
import * as echarts from 'echarts';
import { onMounted, ref } from 'vue';
let theCharts = ref();
onMounted(() => {
	echarts.init(theCharts.value).setOption({
		tooltip: {
			trigger: 'item',
		},
		legend: {
			// 旁边那个表明什么颜色代表什么数据的注解块
			top: 50,
			right: 30,
			orient: 'vertical',
			textStyle: {
				color: '#fff',
				fontSize: 16,
			},
		},
		series: [
			{
				name: 'Access From',
				type: 'pie',
				radius: ['40%', '80%'], // 调整该饼环图的半径大小和整个饼环图的大小
				center: ['30%', '50%'], // 图表的位置，[距离左边,距离右边],[50%,50%]就是中心。
				avoidLabelOverlap: false,
				itemStyle: {
					borderRadius: 3,
					borderColor: '#fff',
					borderWidth: 2,
				},
				label: {
					// 每一个颜色块上带着的文字
					show: true,
					position: 'inside',
					color: '#fff',
				},
				// 以下是放大效果,可以要可以不要
				// emphasis: {
				//     label: {
				//         show: true,
				//         fontSize: 40,
				//         fontWeight: 'bold'
				//     }
				// },
				labelLine: {
					show: false,
				},
				data: [
					// 要展示的数据
					{ value: 16, name: '10岁以下' },
					{ value: 8, name: '10-18岁' },
					{ value: 12, name: '19-30岁' },
					{ value: 24, name: '31-40岁' },
					{ value: 20, name: '41-60岁' },
					{ value: 20, name: '60岁以上' },
				],
				grid: {
					top: 0,
					bottom: 0,
					left: 0,
					right: 0,
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
	background-image: url('../../images/dataScreen-main-cb.png');
	background-size: 100% 100%;

	.title {
		padding-left: 10px;
		padding-top: 10px;

		p {
			color: #fff;
			font-size: 20px;
		}
	}

	.charts {
		margin-top: 30px;
		height: 250px;
	}
}
</style>
