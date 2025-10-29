<template>
	<!-- 🍉加一个div标签是因为警告说根节点标签为多个的不能transition动画渲染。 -->
	<div>
	<el-card shadow="hover">
		<el-button type="primary" size="default" icon="Plus" @click="" style="display: inline;">添加品牌</el-button>
		<el-table border stripe :data="brandsArr" style="margin: 10px 0px;">
			<el-table-column label="序号" align="center" width="80px;" type="index"></el-table-column>
			<el-table-column label="品牌名称" align="center" prop="tmName"></el-table-column>
			<el-table-column label="品牌LOGO" align="center">
				<template #="{row,$index}">
					<img :src="row.logoUrl" height="100px;" alt="图片缺失"/>
				</template>
			</el-table-column>
			<el-table-column label="品牌操作" align="center">
				<template #="{row}">
					<el-button type="warning" icon="Edit" @click=""></el-button>
					<el-button type="danger" icon="Delete" @click=""></el-button>
				</template>
			</el-table-column>
		</el-table>
	</el-card>
	<!-- 
		:page-sizes="[100, 200 , 300, 400]"   用于设置下拉菜单中的xxx条/页，或者用v-model:page-size(实际上每当下拉菜单改变时就会触发更新limit值)
		:background boolean,是否为分页器中下方点击xxx页的那些按钮添加背景
		:layout,设置分页器6个子组件布局位置,比如如果想要交换位置，在layout中修改字符串顺序即可。(🔺可以添加一个`->`字符串，意思是在他右边的都靠右布局。)

		分页器当前页码发生变化时会触发current-change事件。(无论通过直接点击页码 / 跳转页码 / 上一页 / 下一页都会触发)
	-->
	<!-- 🔺🔺🔺注意都是v-model双向绑定的！！！ -->
	<br/>	
	<el-pagination
		v-model:current-page="currentPage"
		v-model:page-size="limit"
		:background="true"
		layout="prev, pager, next, jumper, ->, sizes, total"
		:total="total"
		:pager-count="pagerCount"
		:page-sizes="[3, 5, 7, 9]"

		@current-change="changeCurrentPage"
		@size-change="getExistingBrands"
	/>
	</div>
</template>

<script setup lang="ts">
import { ref,onMounted } from 'vue';
import { reqExistingBrands } from '@/api/product/brands';
import type { Brand, ExistingBrandsResponseData } from '@/api/product/brands/type';

// 当前页码
let currentPage = ref<number>(1);
// 每一页多少条数据
let limit = ref<number>(5);
// 数据库中一共有多少条数据
let total = ref<number>(0);
// 当前分页器显示多少个页码按钮
let pagerCount = ref<number>(7);
// 当前数据数组
let brandsArr = ref<Brand[]>([]);

async function getExistingBrands(){
	let res: ExistingBrandsResponseData = await reqExistingBrands(currentPage.value,limit.value);
	if (res.code == 200){
		brandsArr.value = res.data.records;
		total.value = res.data.total;
	}
}

onMounted(() => {
	getExistingBrands();
});

// 分页器当前页码发生变化时会触发current-change事件
// newPage是触发@current-change事件后，pagination父组件给回调函数回传的参数，为改变后的当前页码；只不过用不上，因为用的是v-model。
// 其实@size-change也一样回传了新的pageSize。同样因为用的是v-model所以用不上。
// 其实也可以直接@current-change="getExistingBrands"来着()
function changeCurrentPage(newPage: number){
	getExistingBrands();
}

</script>

<style></style>
