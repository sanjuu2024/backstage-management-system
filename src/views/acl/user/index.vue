<template>
	<div>
		<!-- 搜索部分 -->
		<el-card style="height: 70px">
			<el-form inline class="form">
				<el-form-item label="用户名">
					<el-input placeholder="请输入搜索用户名"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary">搜索</el-button>
					<el-button type="default">重置</el-button>
				</el-form-item>
			</el-form>
		</el-card>

		<!-- 数据表格部分 -->
		<el-card>
			<el-button type="primary" @click="addUser">添加用户</el-button>
			<el-button
				type="primary"
				:disabled="!selectedUsers.length"
				@click="deleteUsers"
			>
				批量删除
			</el-button>

			<el-table
				border
				style="margin: 10px 0"
				:data="userList"
				@selection-change="handleSelectionChange"
			>
				<el-table-column
					type="selection"
					align="center"
					width="80px"
				></el-table-column>
				<el-table-column
					type="index"
					label="序号"
					align="center"
					width="80px"
				></el-table-column>
				<el-table-column
					label="用户名"
					align="center"
					prop="username"
				></el-table-column>
				<el-table-column
					label="用户昵称"
					align="center"
					prop="name"
				></el-table-column>
				<el-table-column
					label="用户角色"
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
							title="分配角色"
							size="small"
						>
							分配角色
						</el-button>
						<el-button
							type="warning"
							icon="Edit"
							title="编辑"
							size="small"
							@click="updateUser(row)"
						>
							编辑
						</el-button>
						<!-- 删除按钮套一个气泡确认框 -->
						<el-popconfirm
							:title="`确定要删除用户${row.username}吗？`"
							@confirm="deleteUser(row.id)"
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
			@size-change="getUserList"
			@current-change="getUserList"
		/>

		<!-- 添加用户时表单以抽屉形式出现(其实对话框更好啊抽屉是懒渲染好麻烦啊喂...当练习一下抽屉吧) -->
		<el-drawer
			v-model="userDrawerVisible"
			resizable
			direction="rtl"
			:key="drawerKey"
		>
			<template #title>
				<h3>{{ userForm.id ? '修改' : '添加' }}用户</h3>
			</template>
			<template #default>
				<el-form
					label-width="auto"
					label-position="right"
					:model="userForm"
					:rules="rules"
					ref="theUserForm"
				>
					<el-form-item label="用户名" prop="username">
						<el-input
							placeholder="请输入用户名"
							v-model="userForm.username"
						></el-input>
					</el-form-item>
					<el-form-item label="用户昵称" prop="name">
						<el-input
							placeholder="请输入用户昵称"
							v-model="userForm.name"
						></el-input>
					</el-form-item>
					<!-- 修改用户并不能修改密码(别管了这些业务逻辑不太现实,就当学代码实现而已。) -->
					<el-form-item
						label="用户密码"
						prop="password"
						v-show="!userForm.id"
					>
						<el-input
							placeholder="请输入用户密码"
							type="password"
							v-model="userForm.password"
							show-password
						></el-input>
					</el-form-item>
				</el-form>
			</template>
			<template #footer>
				<el-button @click="userDrawerVisible = false">取消</el-button>
				<el-button
					type="primary"
					@click="confirmUserForm"
					:disabled="!validated"
				>
					确定
				</el-button>
			</template>
		</el-drawer>
	</div>
</template>

<script setup lang="ts">
import {
	reqAddUser,
	reqAllUser,
	reqDeleteUser,
	reqUpdateUser,
} from '@/api/acl/user';
import type {
	ResponseData,
	UserData,
	UserResponseDate,
} from '@/api/acl/user/type';
import { ElMessage } from 'element-plus';
import { nextTick, onMounted, reactive, ref, watch } from 'vue';
import { useUserStore } from '@/store/modules/user';

const userStore = useUserStore();

defineOptions({
	name: 'AclUser',
});

// 分页器相关
let currentPage = ref<number>(1);
let pageSize = ref<number>(5);
let total = ref<number>(0);
let userForm = reactive<UserData>({} as UserData);
let userInitForm = {
	id: '',
	name: '',
	password: '',
	phone: '',
	roleName: '',
	username: '',
} as UserData;

// 控制添加用户抽屉显示隐藏
let userDrawerVisible = ref<boolean>(false);
// 强制重新渲染抽屉的key
let drawerKey = ref<number>(0);

// 用户列表数据
let userList = ref<UserData[]>([]);

// 选中用户列表
let selectedUsers = ref<UserData[]>([]);

// 修改前存一下用户名和昵称
let updatingUserName = ref<string>('');
let updatingName = ref<string>('');

// 表单校验是否通过
let theUserForm = ref();
let validated = ref<boolean>(false);

// 获取用户列表
async function getUserList() {
	let res: UserResponseDate = await reqAllUser(
		currentPage.value,
		pageSize.value,
	);
	if (res.code === 200) {
		userList.value = res.data.records;
		total.value = res.data.total;
		// console.log('userlist:',userList,'total:',total);
	} else {
		ElMessage.error('获取用户列表失败：' + res.message);
	}
}

onMounted(() => {
	getUserList();
});

// 点击了“添加用户”按钮
function addUser() {
	Object.assign(userForm, userInitForm);
	drawerKey.value++; // 强制重新渲染抽屉
	nextTick(() => {
		userDrawerVisible.value = true;
		theUserForm.value?.resetFields(); // 重置表单校验状态(要不然第二次点击添加的时候一上来就会有两条message警告表单格式了。)
	});
}

// 用户表单校验规则
const userNamePattern = /^\w{4,10}$/; // 需要添加开始和结束锚点！
const namePattern = /^[^"']{2,20}$/;
const passwordPattern = /^\w{6,18}$/;
const rules = {
	username: [
		{
			required: true,
			message: '4-10位，只允许英文大小写、数字和下划线。',
			trigger: 'change', // 禁用自动触发，改为手动触发
			validator: (rule: any, value: string, callback: any) => {
				if (userNamePattern.test(value)) {
					callback(); // 校验通过放行
				} else {
					callback(new Error('账号格式不正确')); // 校验不通过的提示信息
				}
			},
		},
	],
	name: [
		{
			required: true,
			message: '2-20位，只允许非单引号、非双引号字符。',
			trigger: 'change', // 禁用自动触发，改为手动触发
			validator: (rule: any, value: string, callback: any) => {
				if (namePattern.test(value)) {
					callback();
				} else {
					callback(new Error('用户昵称格式不正确'));
				}
			},
		},
	],
	password: [
		{
			required: true,
			message: '6-18位，只允许英文大小写、数字和下划线。',
			trigger: 'change', // 禁用自动触发，改为手动触发
			validator: (rule: any, value: string, callback: any) => {
				if (passwordPattern.test(value)) {
					callback();
				} else {
					callback(new Error('用户密码格式不正确'));
				}
			},
		},
	],
};

// 静默校验(只检查格式,禁用确认提交按钮而不显示错误信息)(显示错误让el-form封装的rules去干)
function silentValidation() {
	const { username, name, password } = userForm;

	// 检查每个字段是否符合格式要求
	const usernameValid = userNamePattern.test(username);
	const nameValid = namePattern.test(name as string);
	const passwordValid = userForm.id || passwordPattern.test(password); // 修改用户的话密码不能改也不显示也不校验(奇葩业务逻辑,别管。)

	// 只要有一个不通过就禁用按钮
	validated.value = !!(usernameValid && nameValid && passwordValid);
}

watch(
	() => userForm,
	() => {
		silentValidation(); // 实时更新按钮状态，但不显示错误(显示错误让el-form封装的rules去干)
	},
	{ deep: true, immediate: true },
);

// 点击了“编辑”按钮
function updateUser(row: UserData) {
	drawerKey.value++; // 强制重新渲染抽屉
	userDrawerVisible.value = true;
	updatingUserName.value = row.username as string;
	updatingName.value = row.name as string;
	Object.assign(userForm, row);
}

// 点击了“删除”按钮
async function deleteUser(id: string | number) {
	let res = await reqDeleteUser(id);
	if (res.code === 200) {
		ElMessage.success('删除用户成功');
		getUserList();
	} else {
		ElMessage.error('删除用户失败：' + res.message);
	}
}

// 点击了添加用户抽屉中确认按钮 / 修改用户后点击了确认按钮
async function confirmUserForm() {
	let res: ResponseData;
	if (userForm.id) {
		// 修改
		res = await reqUpdateUser(userForm);
	} else {
		// 添加
		res = await reqAddUser(userForm);
	}
	if (res.code === 200) {
		ElMessage.success((userForm.id ? '修改' : '添加') + '用户成功');
		userDrawerVisible.value = false;
		getUserList();
		if (
			updatingUserName.value === userStore.userInfo.username &&
			userForm.username !== userStore.userInfo.username
		) {
			// 如果修改了当前登录用户的用户名，需要退出重新登录
			await userStore.userLogout(); // 别忘了await！！！
			window.location.reload();
			return;
		}
		if (updatingName.value !== userForm.name) {
			// 如果修改了当前登录用户的昵称，页面需要重新渲染(重新获取用户信息)(然后忽然发现渲染的本来就是userName......这个项目视频我只能给80分，太多地方不能自洽了。)
			window.location.reload();
		}
	} else {
		ElMessage.error(
			(userForm.id ? '修改' : '添加') + '用户失败：' + res.message,
		);
	}
}

// 监听多选框变化
function handleSelectionChange(val: UserData[]) {
	selectedUsers.value = val;
}

// 批量删除用户
function deleteUsers() {}
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
