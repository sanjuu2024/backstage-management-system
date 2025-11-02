<template>
	<div>
		<el-card style="margin: 10px 0">
			<el-table
				border
				label-width="auto"
				label-position="right"
				:data="skuList"
			>
				<el-table-column
					label="序号"
					type="index"
					align="center"
					width="80px"
				></el-table-column>
				<el-table-column
					label="名称"
					align="center"
					width="100px"
					prop="skuName"
				></el-table-column>
				<el-table-column
					label="描述"
					align="center"
					prop="skuDesc"
				></el-table-column>
				<el-table-column label="默认图片" align="center">
					<template #="{ row }">
						<img
							:src="row.skuDefaultImg"
							:alt="row.skuName"
							style="height: 100px"
						/>
					</template>
				</el-table-column>
				<el-table-column
					label="重量"
					align="center"
					width="100px"
					prop="weight"
				></el-table-column>
				<el-table-column
					label="价格"
					align="center"
					width="100px"
					prop="price"
				></el-table-column>
				<el-table-column
					label="操作"
					align="center"
					fixed="right"
					width="200px"
				>
					<template #="{ row }">
						<el-button
							v-show="!row.isSale"
							type="success"
							icon="Upload"
							@click="handleOnsale(row)"
						></el-button>
						<el-button
							v-show="row.isSale"
							type="danger"
							icon="Download"
							@click="handleCancelSale(row)"
						></el-button>
						<el-button
							type="warning"
							icon="Edit"
							@click="ElMessage.success('程序猿努力加班中...')"
						></el-button>
						<el-button
							type="info"
							icon="View"
							@click="handleView(row)"
						></el-button>
						<el-button
							type="danger"
							icon="Delete"
							@click="handleDelete(row.id)"
						></el-button>
					</template>
				</el-table-column>
			</el-table>
		</el-card>

		<el-pagination
			v-model:current-page="currentPage"
			v-model:page-size="pageSize"
			:page-sizes="[3, 5, 7, 9]"
			:pager-count="7"
			background
			layout="prev, pager, next, jumper, ->, sizes, total"
			:total="total"
			@size-change="getSkuList"
			@current-change="getSkuList"
		/>

		<el-drawer v-model="drawerVisible" direction="rtl" resizable>
			<template #header>
				<h3>查看商品详情</h3>
			</template>
			<template #default>
				<el-row>
					<el-col :span="6">名称</el-col>
					<el-col :span="18">{{ theSku.skuName }}</el-col>
				</el-row>
				<el-row>
					<el-col :span="6">描述</el-col>
					<el-col :span="18">{{ theSku.skuDesc }}</el-col>
				</el-row>
				<el-row>
					<el-col :span="6">价格</el-col>
					<el-col :span="18">{{ theSku.price }}</el-col>
				</el-row>
				<el-row>
					<el-col :span="6">平台属性</el-col>
					<el-col :span="18">
						<el-tag
							v-for="(item, idx) in theSku.skuAttrValueList"
							:key="idx"
						>
							{{ item.attrName }}
						</el-tag>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="6">销售属性</el-col>
					<el-col :span="18">
						<el-tag
							v-for="(item, idx) in theSku.skuSaleAttrValueList"
							:key="idx"
						>
							{{ item.saleAttrName }}
						</el-tag>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="6">图片</el-col>
					<el-col :span="18">
						<el-carousel type="card">
							<el-carousel-item
								v-for="(item, idx) in theSku.skuImageList"
								:key="idx"
							>
								<img :src="item.imgUrl" :alt="item.imgName" />
							</el-carousel-item>
						</el-carousel>
					</el-col>
				</el-row>
			</template>
		</el-drawer>
	</div>
</template>

<script setup lang="ts">
import {
	reqCancelSale,
	reqDeleteSku,
	reqExistingSku,
	reqOnsale,
	reqSkuDetail,
} from '@/api/product/sku';
import type {
	SkuData,
	SkuDetail,
	SkuListResponseData,
} from '@/api/product/sku/type';
import { ElMessage } from 'element-plus';
import { onMounted, ref } from 'vue';

defineOptions({
	name: 'Sku',
});

// 分页器相关
let currentPage = ref<number>(1);
let pageSize = ref<number>(5);
let total = ref<number>(0);

// 展示的sku列表
let skuList = ref<SkuData[]>([]);

// 是否查看sku详情
let drawerVisible = ref<boolean>(false);
// 正在被展示的sku(因为只有一个所以不用响应式！！！用了反倒增加性能开销~(因为用对了被claude夸了开心中(❁´◡`❁))
let theSku: SkuDetail;

// 获取SKU列表
async function getSkuList() {
	let res: SkuListResponseData = await reqExistingSku(
		currentPage.value,
		pageSize.value,
	);
	if (res.code === 200) {
		skuList.value = res.data.records;
		total.value = res.data.total;
	} else {
		ElMessage.error('获取SKU列表失败：' + res.message);
	}
}

onMounted(() => {
	getSkuList();
});

// 上架SKU
async function handleOnsale(row: SkuData) {
	let res = await reqOnsale(row.id);
	if (res.code === 200) {
		ElMessage.success('上架成功！');
		// getSkuList();
		// 虽然获取一遍数据库也可以得到isSale已经更改了，但是频繁请求不好，所以还是只手动更改吧
		row.isSale = !row.isSale;
	} else {
		ElMessage.error('上架失败！' + res.message);
	}
}

// 下架SKU
async function handleCancelSale(row: SkuData) {
	let res = await reqCancelSale(row.id);
	if (res.code === 200) {
		ElMessage.success('下架成功！');
		// getSkuList();
		// 虽然获取一遍数据库也可以得到isSale已经更改了，但是频繁请求不好，所以还是只手动更改吧
		row.isSale = !row.isSale;
	} else {
		ElMessage.error('下架失败！' + res.message);
	}
}

// 查看SKU详情
async function handleView(row: SkuData) {
	let res = await reqSkuDetail(row.id);
	if (res.code === 200) {
		theSku = res.data;
		drawerVisible.value = true;
	} else {
		ElMessage.error('商品详情获取失败！' + res.message);
	}
}

// 删除SKU
async function handleDelete(skuId: number) {
	let res = await reqDeleteSku(skuId);
	if (res.code === 200) {
		ElMessage.success('删除成功！');
		getSkuList();
	} else {
		ElMessage.error('删除失败！' + res.message);
	}
}
</script>

<style>
.el-button {
	margin: 10px;
}
.el-row {
	padding: 10px;
}
.el-tag {
	margin: 5px;
}
</style>
