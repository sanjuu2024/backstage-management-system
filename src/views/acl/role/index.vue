<template>
	<div>
		<!-- 搜索部分 -->
		<el-card style="height: 70px">
			<el-form inline class="form">
				<el-form-item label="角色名">
					<el-input
						placeholder="请输入搜索角色名"
						v-model="keyword"
					></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="searchRole">
						搜索
					</el-button>
					<el-button type="default" @click="resetSearch">
						重置
					</el-button>
				</el-form-item>
			</el-form>
		</el-card>

		<!-- 数据表格部分 -->
		<el-card>
			<el-button type="primary" @click="addRole">添加角色</el-button>

			<el-table border style="margin: 10px 0" :data="roleList">
				<el-table-column
					type="index"
					label="#"
					align="center"
					width="80px"
				></el-table-column>
				<el-table-column
					type="index"
					label="id"
					align="center"
					width="80px"
					prop="id"
				></el-table-column>
				<el-table-column
					label="角色名"
					align="center"
					prop="roleName"
				></el-table-column>
				<el-table-column
					label="创建时间"
					align="center"
					prop="createTime"
				></el-table-column>
				<el-table-column
					label="更新时间"
					align="center"
					prop="updateTime"
				></el-table-column>
				<el-table-column label="操作" align="center" width="300px">
					<template #="{ row }">
						<el-button
							type="primary"
							icon="User"
							title="分配权限"
							size="small"
							@click="setPermission(row)"
						>
							分配权限
						</el-button>
						<el-button
							type="warning"
							icon="Edit"
							title="编辑"
							size="small"
							@click="updateRole(row)"
						>
							编辑
						</el-button>
						<!-- 删除按钮套一个气泡确认框 -->
						<el-popconfirm
							:title="`确定要删除角色${row.roleName}吗？`"
							@confirm="deleteRole(row.id)"
							width="250px"
							icon="Delete"
							icon-color="red"
						>
							<template #reference>
								<el-button
									type="danger"
									icon="Delete"
									title="删除"
									size="small"
								>
									删除
								</el-button>
							</template>
						</el-popconfirm>
					</template>
				</el-table-column>
			</el-table>
		</el-card>

		<!-- 分页器部分 -->
		<el-pagination
			v-model:current-page="currentPage"
			v-model:page-size="pageSize"
			:page-sizes="[3, 5, 7, 9]"
			:pager-cont="7"
			background
			layout="prev, pager, next, jumper, ->, sizes, total"
			:total="total"
			@size-change="getRoleList"
			@current-change="getRoleList"
		/>

		<!-- 对话框形式添加/修改用户 -->
		<el-dialog
			v-model="roleDialogVisible"
			:title="`${roleForm.id ? '修改' : '添加'}角色`"
		>
			<el-form
				label-width="auto"
				label-position="right"
				:model="roleForm"
				:rules="rules"
				ref="theRoleForm"
			>
				<el-form-item label="角色名" prop="roleName">
					<el-input
						placeholder="请输角色名"
						v-model.trim="roleForm.roleName"
					></el-input>
				</el-form-item>
			</el-form>
			<template #footer>
				<el-button @click="roleDialogVisible = false">取消</el-button>
				<el-button
					type="primary"
					@click="confirmRoleForm"
					:disabled="!validated"
				>
					确定
				</el-button>
			</template>
		</el-dialog>

		<!-- 抽屉形式分配权限 -->
		<el-drawer v-model="aclDrawerVisible">
			<template #header>
				<h3>分配权限</h3>
			</template>
			<template #default>
				<el-tree
					show-checkbox
					default-expand-all
					:data="permissionList"
					:props="props"
					node-key="id"
					:default-checked-keys="selectedList"
					ref="permissionTree"
				></el-tree>
			</template>
			<template #footer>
				<el-button @click="aclDrawerVisible = false">取消</el-button>
				<el-button type="primary" @click="savePermission">
					保存
				</el-button>
			</template>
		</el-drawer>
	</div>
</template>

<script setup lang="ts">
import {
	reqAddRole,
	reqAllPermission,
	reqAllRole,
	reqAssignPermission,
	reqDeleteRole,
	reqUpdateRole,
} from '@/api/acl/role';
import type {
	PermissionData,
	ResponseData,
	RoleData,
	RoleResponseData,
} from '@/api/acl/role/type';
import { ElMessage } from 'element-plus';
import { nextTick, onMounted, reactive, ref, watch } from 'vue';

defineOptions({
	name: 'AclRole',
});

// 分页器相关
let currentPage = ref<number>(1);
let pageSize = ref<number>(5);
let total = ref<number>(0);
let roleForm = reactive<RoleData>({} as RoleData);
let roleInitForm = {
	id: '',
	roleName: '',
} as RoleData;

// 控制添加/修改角色抽屉显示隐藏
let roleDialogVisible = ref<boolean>(false);

// 角色列表数据
let roleList = ref<RoleData[]>([]);

// 表单校验是否通过
let theRoleForm = ref();
let validated = ref<boolean>(false);

// 搜索相关
let keyword = ref<string>('');

// 分配权限相关
let aclDrawerVisible = ref<boolean>(false);
let permissionList = ref<PermissionData[]>([]);
const props = {
	label: 'name',
	children: 'children',
};
let selectedList = ref<number[]>([]); // 存储勾选了的节点的id
let permissionTree = ref(); // el-tree实例
let roleId = 0; // 目前选中(再分配权限)的角色

// 获取角色列表
async function getRoleList() {
	let res: RoleResponseData = await reqAllRole(
		currentPage.value,
		pageSize.value,
	);
	if (res.code === 200) {
		roleList.value = res.data.records;
		total.value = res.data.total;
	} else {
		ElMessage.error('获取角色列表失败：' + res.message);
	}
}

onMounted(() => {
	getRoleList();
});

// 点击了“添加角色”按钮
function addRole() {
	Object.assign(roleForm, roleInitForm);
	nextTick(() => {
		roleDialogVisible.value = true;
		theRoleForm.value?.resetFields(); // 重置表单校验状态(要不然第二次点击添加的时候一上来就会有两条message警告表单格式了。)
	});
}

// 角色表单校验规则
const roleNamePattern = /^[^"' ]{2,10}$/;
const rules = {
	roleName: [
		{
			required: true,
			message: '2-10位，只允许非单引号/双引号的非空字符',
			trigger: 'change',
			validator: (rule: any, value: string, callback: any) => {
				if (roleNamePattern.test(value)) {
					callback(); // 校验通过放行
				} else {
					callback(new Error('角色名格式不正确')); // 校验不通过的提示信息
				}
			},
		},
	],
};

// 静默校验(只检查格式,禁用确认提交按钮而不显示错误信息)(显示错误让el-form封装的rules去干)
function silentValidation() {
	const { roleName } = roleForm;

	// 检查每个字段是否符合格式要求
	const roleNameValid = roleNamePattern.test(roleForm.roleName);
	// 只要有一个不通过就禁用按钮
	validated.value = !!roleNameValid;
}

watch(
	() => roleForm,
	() => {
		silentValidation(); // 实时更新按钮状态，但不显示错误(显示错误让el-form封装的rules去干)
	},
	{ deep: true, immediate: true },
);

// 点击了“编辑”按钮
function updateRole(row: RoleData) {
	roleDialogVisible.value = true;
	Object.assign(roleForm, row);
}

// 点击了“删除”按钮
async function deleteRole(id: string | number) {
	let res = await reqDeleteRole(id);
	if (res.code === 200) {
		ElMessage.success('删除角色成功');
		getRoleList();
	} else {
		ElMessage.error('删除角色失败：' + res.message);
	}
}

// 点击了对话框中确认按钮
async function confirmRoleForm() {
	let res: ResponseData;
	if (roleForm.id) {
		// 修改
		res = await reqUpdateRole(roleForm);
	} else {
		// 添加
		res = await reqAddRole(roleForm);
	}
	if (res.code === 200) {
		ElMessage.success((roleForm.id ? '修改' : '添加') + '角色成功');
		roleDialogVisible.value = false;
		getRoleList();
	} else {
		ElMessage.error(
			(roleForm.id ? '修改' : '添加') + '角色失败：' + res.message,
		);
	}
}

// 点击“搜索”按钮
async function searchRole() {
	let res: RoleResponseData = await reqAllRole(
		currentPage.value,
		pageSize.value,
		keyword.value,
	);
	if (res.code === 200) {
		ElMessage.success('搜索成功~');
		roleList.value = res.data.records;
	} else {
		ElMessage.error('搜索失败：' + res.message);
	}
}

// 点击“重置”按钮
function resetSearch() {
	window.location.reload();
	// 或者把keyword置空，以及正常请求一次userList就行。
}

// 点击“分配权限”按钮
async function setPermission(row: RoleData) {
	aclDrawerVisible.value = true;
	roleId = row.id as number;
	let res = await reqAllPermission(row.id as number);
	if (res.code === 200) {
		permissionList.value = res.data;
		selectedList.value = filterSelectedList(permissionList.value); // 递归找出已勾选的节点id
	} else {
		ElMessage.error('获取权限列表失败：' + res.message);
	}
}

// 递归找出已勾选的节点id
function filterSelectedList(cur: PermissionData[], targetList: number[] = []) {
	cur.forEach((item) => {
		if (item.children && item.children.length > 0) {
			filterSelectedList(item.children, targetList);
		} else if (item.select) {
			targetList.push(item.id as number);
		}
	});
	return targetList;
}

// 点击分配权限抽屉中的保存按钮
async function savePermission(row: PermissionData) {
	// console.log(permissionTree.value.getCheckedKeys());
	// console.log(permissionTree.value.getHalfCheckedKeys());
	aclDrawerVisible.value = false;
	let permissionIdList = permissionTree.value
		.getCheckedKeys()
		.concat(permissionTree.value.getHalfCheckedKeys());
	let res: ResponseData = await reqAssignPermission(roleId, permissionIdList);
	if (res.code === 200) {
		ElMessage.success('分配权限成功！');
	} else {
		ElMessage.error('分配权限失败！' + res.message);
	}
}
</script>

<style lang="css" scoped>
.form {
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.el-card {
	margin: 10px 0;
}
</style>
