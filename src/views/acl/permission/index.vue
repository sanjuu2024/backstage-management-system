<template>
	<div>
		<!-- 菜单列表通过el-table展示 -->
		<el-table
			border
			:data="menuList"
			row-key="id"
			style="margin: 10px 0"
			default-expand-all
		>
			<el-table-column
				label="名称"
				align="center"
				prop="name"
			></el-table-column>
			<el-table-column
				label="权限值"
				align="center"
				prop="code"
			></el-table-column>
			<el-table-column
				label="修改时间"
				align="center"
				prop="updateTime"
			></el-table-column>
			<el-table-column label="操作" align="center">
				<template #="{ row }">
					<el-button
						:type="row.level === 4 ? 'info' : 'primary'"
						size="small"
						:disabled="row.level === 4"
						@click="addMenu(row)"
					>
						{{ row.level === 3 ? '添加功能' : '添加菜单' }}
					</el-button>
					<el-button
						:type="row.level === 1 ? 'info' : 'warning'"
						size="small"
						:disabled="row.level === 1"
						@click="updateMenu(row)"
					>
						编辑
					</el-button>
					<el-popconfirm
						:title="`确定要删除角色${row.name}吗？`"
						@confirm="deleteMenu(row.id)"
						icon="Delete"
						icon-color="red"
						width="200px"
					>
						<template #reference>
							<el-button
								:type="row.level === 1 ? 'info' : 'danger'"
								size="small"
								:disabled="row.level === 1"
							>
								删除
							</el-button>
						</template>
					</el-popconfirm>
				</template>
			</el-table-column>
		</el-table>

		<!-- 表单通过el-dialog展示 -->
		<el-dialog v-model="menuDialogVisible" title="Tips">
			<el-form
				label-width="auto"
				label-position="right"
				:model="menuForm"
				:rules="rules"
				ref="theMenuForm"
			>
				<el-form-item label="名称" prop="name">
					<el-input
						v-model.trim="menuForm.name"
						placeholder="请填写名称"
					></el-input>
				</el-form-item>
				<el-form-item label="权限值" prop="code">
					<el-input
						v-model.trim="menuForm.code"
						placeholder="请填写权限值"
					></el-input>
				</el-form-item>
			</el-form>
			<template #footer>
				<el-button @click="menuDialogVisible = false">取消</el-button>
				<el-button type="primary" @click="confirmMenuForm">
					确定
				</el-button>
			</template>
		</el-dialog>
	</div>
</template>

<script setup lang="ts">
import {
	reqAddMenu,
	reqDeleteMenu,
	reqGetMenuList,
	reqUpdateMenu,
} from '@/api/acl/menu';
import type { MenuData, MenuFormData } from '@/api/acl/menu/type';
import { ElMessage } from 'element-plus';
import { nextTick, onMounted, reactive, ref } from 'vue';

defineOptions({
	name: 'AclPermission',
});

// 菜单列表
let menuList = ref<MenuData[]>([]);

// 菜单表单相关
let menuDialogVisible = ref<boolean>(false);
let theMenuForm = ref();
let menuInitValue = {
	id: 0,
	children: [],
	code: '',
	level: 0,
	name: '',
	pid: 0,
	select: false,
	status: '',
	toCode: '',
	type: 0,
};
let menuForm = reactive<MenuFormData>({
	id: 0,
	code: '',
	level: 0,
	name: '',
	pid: 0,
	type: 0,
});

// 获取菜单列表
async function getMenuList() {
	let res = await reqGetMenuList();
	if (res.code === 200) {
		menuList.value = res.data;
		// console.log(res.data);
	} else {
		ElMessage.error('获取菜单列表失败：' + res.message);
	}
}

onMounted(() => {
	getMenuList();
});

// 添加菜单 / 功能
function addMenu(row: MenuData) {
	menuDialogVisible.value = true;
	Object.assign(menuForm, menuInitValue);
	menuForm.level = row.level + 1;
	menuForm.pid = row.id as number;
	nextTick(() => {
		// 🔺因为要等到下一次DOM更新时theMenuForm才会被渲染到页面上，此时ref才有值(而不是undefined)，才能重置表单
		theMenuForm.value.resetFields();
	});
}

// 修改菜单 / 功能
function updateMenu(row: MenuData) {
	menuDialogVisible.value = true;
	Object.assign(menuForm, row);
}

// 删除菜单 / 功能
async function deleteMenu(id: number) {
	let res = await reqDeleteMenu(id);
	if (res.code === 200) {
		ElMessage.success('删除成功');
		getMenuList();
	} else {
		ElMessage.error('删除失败：' + res.message);
	}
}

// 表单校验
const namePattern = /^[\u4e00-\u9fa5a-zA-Z0-9_]{2,20}$/;
const codePattern = /^[a-zA-Z]{1,20}$/;
const rules = {
	name: [
		{
			required: true,
			message: '名称只能包含中英文、数字和下划线，且长度在2-20个字符之间',
			trigger: 'change',
			validator(rule: any, value: string, callback: any) {
				value = value.trim();
				if (namePattern.test(value)) {
					callback();
				} else {
					callback(
						new Error(
							'名称只能包含中英文、数字和下划线，且长度在2-20个字符之间',
						),
					);
				}
			},
		},
	],
	code: [
		{
			required: true,
			message: '权限值只能包含英文，且长度在1-20个字符之间',
			trigger: 'change',
			validator(rule: any, value: string, callback: any) {
				value = value.trim();
				if (codePattern.test(value)) {
					callback();
				} else {
					callback(
						new Error('权限值只能包含英文，且长度在1-20个字符之间'),
					);
				}
			},
		},
	],
};

// 点击表单对话框确定按钮
async function confirmMenuForm() {
	try {
		await theMenuForm.value.validate();
	} catch (err: any) {
		// console.log(err);
		ElMessage.error('表单格式错误！');
		return;
	}
	// 校验通过后再关闭对话框
	menuDialogVisible.value = false;
	if (menuForm.id) {
		// 修改
		let res = await reqUpdateMenu(menuForm);
		if (res.code === 200) {
			ElMessage.success('修改成功');
			getMenuList();
		} else {
			ElMessage.error('修改失败：' + res.message);
		}
	} else {
		// 添加
		let res = await reqAddMenu(menuForm);
		if (res.code === 200) {
			ElMessage.success('添加成功');
			getMenuList();
		} else {
			ElMessage.error('添加失败：' + res.message);
		}
	}
}
</script>

<style scoped lang="scss">
.el-button {
	margin: 5px;
}
</style>
