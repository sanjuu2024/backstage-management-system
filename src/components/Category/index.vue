<template>
	<div>
		<el-card>
			<el-form inline>
				<el-form-item label="一级分类">
					<!-- 🍉比起直接使用watch监视c1Id、c2Id、c3Id，watch可能过度触发，所以更推荐用el-select自带的事件change。 -->
					<el-select
						style="width: 200px"
						v-model="c1Id"
						@change="handleC1Change"
						:disabled="Boolean(scene)"
					>
						<!-- el-option:label为显示文字，value是收集到的值 -->
						<el-option
							v-for="(c1, idx) in l1"
							:key="c1.id"
							:value="c1.id"
							:label="c1.name"
						/>
					</el-select>
				</el-form-item>
				<el-form-item label="二级分类">
					<el-select
						style="width: 200px"
						v-model="c2Id"
						@change="handleC2Change"
						:disabled="Boolean(scene)"
					>
						<el-option
							v-for="(c2, idx) in l2"
							:key="c2.id"
							:value="c2.id"
							:label="c2.name"
						/>
					</el-select>
				</el-form-item>
				<el-form-item label="三级分类">
					<el-select
						style="width: 200px"
						v-model="c3Id"
						:disabled="Boolean(scene)"
					>
						<el-option
							v-for="(c3, idx) in l3"
							:key="c3.id"
							:value="c3.id"
							:label="c3.name"
						/>
					</el-select>
				</el-form-item>
			</el-form>
		</el-card>
	</div>
</template>

<script lang="ts">
export default {
	name: 'Category',
};
</script>

<script setup lang="ts">
import { useCategoryStore } from '@/store/modules/category';
import { storeToRefs } from 'pinia';
import { onMounted } from 'vue';
import { defineProps } from 'vue';
const categoryStore = useCategoryStore();
let { l1, l2, l3, c1Id, c2Id, c3Id } = storeToRefs(categoryStore);
defineProps(['scene']);

onMounted(() => {
	categoryStore.getC1();
});

// 一级分类变化处理
const handleC1Change = (value: string | number) => {
	if (value) {
		categoryStore.getC2(value);
		c2Id.value = ''; // 清空子选择
		c3Id.value = '';
		l3.value = [];
	}
};

// 二级分类变化处理
const handleC2Change = (value: string | number) => {
	if (value) {
		categoryStore.getC3(value);
		c3Id.value = '';
	}
};
</script>

<style></style>
