<!-- 左上——游客统计 -->
<template>
	<div class="box">
		<div class="top">
			<p class="title">实时游客统计</p>
			<p class="bg"></p>
			<p class="right">
				可预约总量
				<span>999900</span>
				人
			</p>
		</div>
		<div class="number">
			<span v-for="(item, idx) in people + '人'" :key="idx">
				{{ item }}
			</span>
		</div>
		<!-- 装echarts展示图形图标的节点 -->
		<div class="charts" ref="theCharts"></div>
	</div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import * as echarts from 'echarts';
import 'echarts-liquidfill';

let people = ref<number>(262144);
let theCharts = ref();
onMounted(() => {
	// 获取echarts类的实例，设置实例的配置对象
	// 水球图
	echarts.init(theCharts.value).setOption({
		series: [
			{
				type: 'liquidFill',
				data: [0.7, 0.6, 0.5], // 多少个数字水球里就有几道波浪，数值是波浪的平均位置
				radius: '85%',
			},
		],
	});
});
</script>

<style scoped lang="scss">
.box {
	background-image: url('../../images/dataScreen-main-lb.png');
	background-size: 100% 100%;
	margin-top: 10px;
	.top {
		padding: 18px;
		.title {
			color: white;
			font-size: 20px;
		}
		.bg {
			width: 68px;
			height: 7px;
			background-image: url('../../images/dataScreen-title.png');
			background-size: 100% 100%;
			margin-top: 10px;
		}
		.right {
			float: right;
			color: #fff;
			font-size: 20px;
			span {
				color: yellowgreen;
			}
		}
	}
	// 🔺注意要清浮动元素！！！否则会影响.number的显示...(比如当padding=19px时)
	.top::after {
		content: '';
		display: block;
		clear: both;
	}

	.number {
		display: flex;
		span {
			flex: 1;
			height: 55px;
			background-image: url('../../images/total.png');
			background-size: 100% 100%;
			text-align: center;
			line-height: 55px;
			font-size: 40px;
			color: #29fcff;
			font-weight: bold;
			margin: 0 2px;
		}
	}

	.charts {
		width: 100%;
		height: 200px;
	}
}
</style>
