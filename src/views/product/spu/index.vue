<template>
	<div>
		<Category :scene="scene"></Category>
		<!-- scene = 0,查看SPU状态 -->
		<div v-show="scene === 0" style="margin: 10px 0;">
			<el-card>
				<el-button type="primary" icon="Plus" :disabled="!c3Id" @click="addSpu">添加SPU</el-button>
				<el-table border style="margin: 10px 0;" :data="spuList">
					<el-table-column label="序号" type="index" align="center" width="80px"></el-table-column>
					<el-table-column label="SPU名称" align="center" prop="spuName"></el-table-column>
					<el-table-column label="SPU描述" align="center" prop="description">
						<template #="{row}">
							<div>
								<span v-show="!row.expanded">
									{{ row.description.substring(0, 30) }}...
								</span>
								<span v-show="row.expanded">{{ row.description }}</span>
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
							<el-button type="primary" icon="Plus" title="添加SKU"></el-button>
							<el-button type="warning" icon="Edit" title="修改SPU" @click="updateSpu(row)"></el-button>
							<el-button type="info" icon="View" title="查看SKU列表"></el-button>
							<el-button type="danger" icon="Delete" title="删除SPU"></el-button>
						</template>
					</el-table-column>
				</el-table>
			</el-card>
			<el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize" :page-sizes="[3, 5, 7, 9]"
				:pager-count="7" background layout="prev, pager, next, jumper, ->, sizes, total" :total="total"
				@current-change="getExistingSpu" @size-change="getExistingSpu" 
				style="margin: 10px 0;"
			/>
		</div>

		<!-- scene = 1,添加SPU -->
		<div v-show="scene === 1" style="margin: 10px 0;">
			<SpuForm ref="spuForm" @change-scene="scene = 0" :getExistingSpu="getExistingSpu"/>
		</div>

		<!-- scene = 2,添加SKU -->
		<div v-show="scene === 2" style="margin: 10px 0;">
			<SkuForm/>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useCategoryStore } from '@/store/modules/category';
import { storeToRefs } from 'pinia';
import type { SpuData, SpuResponseData } from '@/api/product/spu/type';
import { reqExistingSpu } from '@/api/product/spu';
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
let pageSize = ref<number>(5);   // 一页多少条数据
let total = ref<number>(0);
// spu列表
let spuList = ref<SpuData[]>([]);

// 子组件SpuForm实例
let spuForm = ref<InstanceType<typeof SpuForm>>();

watch(c3Id, () => {
	if (c3Id.value) {
		currentPage.value = 1; // 切换分类时重置页码
		getExistingSpu();
	}
});

// 获取Spu分页列表
async function getExistingSpu() {
	let res: SpuResponseData = await reqExistingSpu(currentPage.value, pageSize.value, c3Id.value);
	if (res.code == 200) {
		spuList.value = res.data.records;
		total.value = res.data.total;
	}
	else {
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

</script>

<style scoped lang="scss">
.el-button {
	margin: 3px;
}
</style>