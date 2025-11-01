<template>
	<div>
		<Category :scene="scene"></Category>
		<!-- scene = 0,查看SPU状态 -->
		<div v-show="scene === 0" style="margin: 10px 0">
			<el-card>
				<el-button
					type="primary"
					icon="Plus"
					:disabled="!c3Id"
					@click="addSpu"
				>
					添加SPU
				</el-button>
				<el-table border style="margin: 10px 0" :data="spuList">
					<el-table-column
						label="序号"
						type="index"
						align="center"
						width="80px"
					></el-table-column>
					<el-table-column
						label="SPU名称"
						align="center"
						prop="spuName"
					></el-table-column>
					<el-table-column
						label="SPU描述"
						align="center"
						prop="description"
					>
						<template #="{ row }">
							<div>
								<span v-show="!row.expanded">
									{{ row.description.substring(0, 30) }}...
								</span>
								<span v-show="row.expanded">
									{{ row.description }}
								</span>
								<el-button
									link
									type="primary"
									@click="row.expanded = !row.expanded"
								>
									{{ row.expanded ? '收起' : '展开' }}
								</el-button>
							</div>
						</template>
					</el-table-column>
					<el-table-column label="SPU操作" align="center">
						<template #="{ row }">
							<el-button
								type="primary"
								icon="Plus"
								title="添加SKU"
								@click="addSku(row)"
							></el-button>
							<el-button
								type="warning"
								icon="Edit"
								title="修改SPU"
								@click="updateSpu(row)"
							></el-button>
							<el-button
								type="info"
								icon="View"
								title="查看SKU列表"
								@click="viewSku(row)"
							></el-button>
							<el-popconfirm
								title="确定删除该SPU吗？"
								@confirm="deleteSpu(row)"
								icon="Delete"
								icon-color="red"
								width="200px"
							>
								<template #reference>
									<el-button
										type="danger"
										icon="Delete"
										title="删除SPU"
									></el-button>
								</template>
							</el-popconfirm>
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
				@current-change="getExistingSpu"
				@size-change="getExistingSpu"
				style="margin: 10px 0"
			/>
		</div>

		<!-- scene = 1,添加/修改SPU -->
		<div v-show="scene === 1" style="margin: 10px 0">
			<SpuForm
				ref="spuForm"
				@change-scene="scene = 0"
				:getExistingSpu="getExistingSpu"
			/>
		</div>

		<!-- scene = 2,添加/修改SKU -->
		<div v-show="scene === 2" style="margin: 10px 0">
			<SkuForm
				ref="skuForm"
				@change-scene="scene = 0"
				:getExistingSpu="getExistingSpu"
			/>
		</div>

		<!-- 显示所有sku列表的对话框 -->
		<el-dialog v-model="skuListVisible">
			<el-table label-width="auto" label-position="right" :data="skuList">
				<el-table-column
					label="SKU名字"
					align="center"
					prop="skuName"
					width="100px"
				></el-table-column>
				<el-table-column
					label="SKU价格"
					align="center"
					prop="price"
					width="100px"
				></el-table-column>
				<el-table-column
					label="SKU重量"
					align="center"
					prop="weight"
					width="100px"
				></el-table-column>
				<el-table-column label="SKU图片" align="center">
					<template #="{ row }">
						<img :src="row.skuDefaultImg" alt="sku图片" />
					</template>
				</el-table-column>
			</el-table>
		</el-dialog>
	</div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, ref, watch } from 'vue';
import { useCategoryStore } from '@/store/modules/category';
import { storeToRefs } from 'pinia';
import type {
	SkuData,
	SkuInfoListResponseData,
	SpuData,
	SpuResponseData,
} from '@/api/product/spu/type';
import {
	reqDeleteSpu,
	reqExistingSpu,
	reqSkuInfoList,
} from '@/api/product/spu';
import { ElMessage } from 'element-plus';
import SkuForm from './SkuForm.vue';
import SpuForm from './SpuForm.vue';

defineOptions({
	name: 'Spu',
});

const categoryStore = useCategoryStore();
let { c3Id } = storeToRefs(categoryStore);

let scene = ref<number>(0);
// 分页器相关
let currentPage = ref<number>(1);
let pageSize = ref<number>(5); // 一页多少条数据
let total = ref<number>(0);
// spu列表
let spuList = ref<SpuData[]>([]);

// 根据spu的id获取到的sku列表
let skuList = ref<SkuData[]>([]);
let skuListVisible = ref<boolean>(false);

// 子组件spuForm和skuForm实例
let spuForm = ref<InstanceType<typeof SpuForm>>();
let skuForm = ref<InstanceType<typeof SkuForm>>();

watch(c3Id, () => {
	if (c3Id.value) {
		currentPage.value = 1; // 切换分类时重置页码
		getExistingSpu();
	}
});

// 获取Spu分页列表
async function getExistingSpu() {
	let res: SpuResponseData = await reqExistingSpu(
		currentPage.value,
		pageSize.value,
		c3Id.value,
	);
	if (res.code == 200) {
		spuList.value = res.data.records;
		total.value = res.data.total;
	} else {
		ElMessage.error('获取SPU列表失败:' + res.message);
	}
}

// 点击“添加SPU”
function addSpu() {
	scene.value = 1;
	// 🔺调用子组件实例身上的方法获取完整已有的spu的数据
	spuForm.value?.init({
		id: 0 as number,
		spuName: '',
		description: '',
		category3Id: c3Id.value,
		spuSaleAttrList: [],
		spuImageList: [],
	});
}

// 点击修改按钮（“修改SPU”）
function updateSpu(row: SpuData) {
	scene.value = 1;
	// 🔺调用子组件实例身上的方法获取完整已有的spu的数据
	spuForm.value?.init(row);
}

// 点击添加按钮（“添加SKU”）
function addSku(row: SpuData) {
	scene.value = 2;
	skuForm.value?.init(row);
}

// 点击查看按钮（“查看SKU列表”）
async function viewSku(row: SpuData) {
	let res: SkuInfoListResponseData = await reqSkuInfoList(row.id as number);
	if (res.code === 200) {
		skuList.value = res.data;
		skuListVisible.value = true;
	} else {
		ElMessage.error('获取SKU列表失败：' + res.message);
	}
}

// 点击删除按钮（“删除SPU”）
async function deleteSpu(row: SpuData) {
	let res = await reqDeleteSpu(row.id as number);
	if (res.code === 200) {
		ElMessage.success('删除SPU成功');
		// 重新获取SPU列表
		getExistingSpu();
	} else {
		ElMessage.error('删除SPU失败：' + res.message);
	}
}

// 🍉每次路由跳转离开前清空store暂存数据
onBeforeUnmount(() => {
	categoryStore.$reset();
});
</script>

<style scoped lang="scss">
.el-button {
	margin: 3px;
}
</style>
