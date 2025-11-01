<template>
	<el-card>
		<el-form label-width="auto" label-position="right" :model="theSku">
			<el-form-item label="SKU名称" prop="skuName">
				<el-input
					placeholder="SKU名称"
					v-model="theSku.skuName"
				></el-input>
			</el-form-item>
			<el-form-item label="价格（元）" prop="price">
				<el-input
					placeholder="价格（元）"
					type="number"
					v-model="theSku.price"
				></el-input>
			</el-form-item>
			<el-form-item label="重量（克）" prop="weight">
				<el-input
					placeholder="重量（克）"
					type="number"
					v-model="theSku.weight"
				></el-input>
			</el-form-item>
			<el-form-item label="SKU描述" prop="skuDesc">
				<el-input
					type="textarea"
					placeholder="SKU描述"
					v-model="theSku.skuDesc"
				></el-input>
			</el-form-item>
			<el-form-item label="平台属性">
				<el-form inline>
					<el-form-item
						v-for="(item, idx) in allBaseAttrList"
						:key="item.id"
						:label="item.attrName"
					>
						<el-select
							placeholder="请选择"
							style="width: 200px"
							v-model="item.attrIdAndValueId"
						>
							<!-- 写成{{ val.valueName }}和:label="val.valueName"是有差别的，大部分时候比较推荐直接写label -->
							<!-- 以及其实觉得:value这么写不是很合理...但是感觉视频的这个后端也乱糟糟的，将就一下() -->
							<!-- 噢，传id就够了啊！接口文档怎么不写清楚一点，我以为各种name什么的也要前端补齐传过去...... -->
							<el-option
								v-for="(val, idx) in item.attrValueList"
								:key="val.id"
								:value="`${item.id}:${val.id}`"
								:label="val.valueName"
							></el-option>
						</el-select>
					</el-form-item>
				</el-form>
			</el-form-item>
			<el-form-item label="销售属性">
				<el-form inline>
					<el-form-item
						v-for="(item, idx) in allSaleAttrList"
						:key="item.id"
						:label="item.saleAttrName"
					>
						<el-select
							placeholder="请选择"
							style="width: 200px"
							v-model="item.saleIdAndValueId"
						>
							<el-option
								v-for="(val, idx) in item.spuSaleAttrValueList"
								:key="val.id"
								:value="`${item.id}:${val.id}`"
								:label="val.saleAttrValueName"
							></el-option>
						</el-select>
					</el-form-item>
				</el-form>
			</el-form-item>
			<el-form-item label="图片列表" prop="skuDefaultImg">
				<el-table
					border
					:data="spuImageList"
					ref="imgTable"
					@select="handleSelectImg"
				>
					<el-table-column
						type="selection"
						align="center"
						width="80px"
					></el-table-column>
					<el-table-column label="图片" align="center">
						<template #="{ row }">
							<img
								:src="row.imgUrl"
								alt="sku图片"
								style="width: 100px; height: 100px"
							/>
						</template>
					</el-table-column>
					<el-table-column
						label="图片名称"
						align="center"
						prop="imgName"
					></el-table-column>
					<el-table-column label="操作" align="center">
						<template #="{ row }">
							<el-button
								v-show="row.imgUrl !== theSku.skuDefaultImg"
								type="warning"
								size="small"
								@click="handleChooseImg(row)"
								style="margin: 10px 0"
							>
								设置默认
							</el-button>
							<el-button
								v-show="row.imgUrl === theSku.skuDefaultImg"
								type="success"
								size="small"
								style="margin: 10px 0"
							>
								默认图片
							</el-button>
						</template>
					</el-table-column>
				</el-table>
			</el-form-item>
			<el-form-item label=" ">
				<el-button type="primary" @click="handleSaveSku">
					保存
				</el-button>
				<el-button @click="emit('change-scene')">取消</el-button>
			</el-form-item>
		</el-form>
	</el-card>
</template>

<script setup lang="ts">
import {
	reqAddSku,
	reqSpuImgList,
	reqSpuSaleAttrList,
} from '@/api/product/spu';
import type {
	skuAttrValue,
	SkuData,
	skuSaleAttrValue,
	SpuData,
	SpuImg,
	SpuSaleAttr,
	SpuSaleAttrListResponseData,
} from '@/api/product/spu/type';
import { ElMessage } from 'element-plus';
import { reactive, ref } from 'vue';
import { useCategoryStore } from '@/store/modules/category';
import type { Attr, AttrResponseData } from '@/api/product/attr/type';

defineOptions({
	name: 'SkuForm',
});

const emit = defineEmits(['change-scene']);
const x = defineProps(['getExistingSpu']);
const categoryStore = useCategoryStore();

// 展示的图片列表、平台属性列表、销售属性列表
let spuImageList = ref<SpuImg[]>([]);
let allBaseAttrList = ref<Attr[]>([]);
let allSaleAttrList = ref<SpuSaleAttr[]>([]);

// 选择默认图片的列表
let imgTable = ref();

// 收集sku数据
let theSku = reactive<SkuData>({
	category3Id: '',
	spuID: '',
	tmId: '',
	skuName: '',
	price: '',
	weight: '',
	skuDesc: '', // 描述
	skuDefaultImg: '',
	skuAttrValueList: [],
	skuSaleAttrValueList: [],
	skuImageList: [],
	id: 0,
	isSale: 0, // 是否上架
});

// 获取所有所需数据
async function init(row: SpuData) {
	// 固定值
	theSku.category3Id = row.category3Id;
	theSku.spuID = row.id as number;
	theSku.tmId = row.tmId as number;

	// 图片列表
	let res = await reqSpuImgList(row.id as number);
	if (res.code === 200) {
		spuImageList.value = res.data;
	} else {
		ElMessage.error('获取图片列表失败');
	}

	// 平台属性列表
	let res2: AttrResponseData = await categoryStore.getAttr();
	if (res2.code === 200) {
		allBaseAttrList.value = res2.data;
	} else {
		ElMessage.error('获取平台属性列表失败');
	}

	// 销售属性列表
	let res3: SpuSaleAttrListResponseData = await reqSpuSaleAttrList(
		row.id as number,
	);
	if (res3.code === 200) {
		allSaleAttrList.value = res3.data;
	} else {
		ElMessage.error('获取销售属性列表失败');
	}
}

// 子组件对外暴露该方法
defineExpose({
	init,
});

// 设置默认图片
function handleChooseImg(row: SpuImg) {
	// console.log('row: ',row);
	imgTable.value.clearSelection();
	imgTable.value.toggleRowSelection(row);
	theSku.skuDefaultImg = row.imgUrl;
}

function handleSelectImg(selection: any, row: SpuImg) {
	imgTable.value.clearSelection();
	imgTable.value.toggleRowSelection(row);
	if (selection.length === 0) {
		theSku.skuDefaultImg = '';
		return;
	}
	theSku.skuDefaultImg = row.imgUrl;
}

// 保存SKU
async function handleSaveSku() {
	// 类型处理
	theSku.price = Number(theSku.price);
	theSku.weight = Number(theSku.weight);

	// 平台属性
	theSku.skuAttrValueList = allBaseAttrList.value.reduce(
		(pre: any, nxt: any) => {
			if (nxt.attrIdAndValueId) {
				let [attrId, attrValueId] = nxt.attrIdAndValueId.split(':');
				pre.push({
					attrId: Number(attrId),
					valueId: Number(attrValueId),
				} as skuAttrValue);
			}
			return pre;
		},
		[],
	);

	// 销售属性
	theSku.skuSaleAttrValueList = allSaleAttrList.value.reduce(
		(pre: any, nxt: any) => {
			if (nxt.saleIdAndValueId) {
				let [saleAttrId, saleAttrValueId] =
					nxt.saleIdAndValueId.split(':');
				pre.push({
					saleAttrId: Number(saleAttrId),
					saleAttrValueId: Number(saleAttrValueId),
				} as skuSaleAttrValue);
			}
			return pre;
		},
		[],
	);

	// 保存请求
	let res = await reqAddSku(theSku);
	if (res.code === 200) {
		ElMessage.success('添加SKU成功');
		emit('change-scene');
		// x.getExistingSpu();   // 貌似不需要因为sku并不在scene0展示
	} else {
		ElMessage.error('添加SKU失败：' + res.message);
	}
}
</script>

<style></style>
