<template>
	<!-- 🍉加一个div标签是因为警告说根节点标签为多个的不能transition动画渲染。 -->
	<div>
		<el-card shadow="hover">
			<el-button
				type="primary"
				size="default"
				icon="Plus"
				@click="addBrand"
				style="display: inline"
				v-has="'btn.Trademark.add'"
			>
				添加品牌
			</el-button>
			<el-table border stripe :data="brandsArr" style="margin: 10px 0px">
				<el-table-column
					label="序号"
					align="center"
					width="80px;"
					type="index"
				></el-table-column>
				<el-table-column
					label="品牌名称"
					align="center"
					prop="tmName"
				></el-table-column>
				<el-table-column label="品牌LOGO" align="center">
					<template #="{ row, $index }">
						<img
							:src="row.logoUrl"
							height="100px;"
							alt="图片缺失"
						/>
					</template>
				</el-table-column>
				<el-table-column label="品牌操作" align="center">
					<template #="{ row }">
						<el-button
							type="warning"
							icon="Edit"
							@click="updateBrand(row)"
							v-has="'btn.Trademark.update'"
						></el-button>

						<!-- 给删除按钮加一个气泡确认框 -->
						<el-popconfirm
							title="确认删除该品牌？"
							width="200"
							@confirm="deleteBrand(row.id)"
							icon="Delete"
							icon-color="red"
						>
							<template #reference>
								<el-button
									type="danger"
									icon="Delete"
								></el-button>
							</template>
						</el-popconfirm>
					</template>
				</el-table-column>
			</el-table>

			<!-- 
			:page-sizes="[100, 200 , 300, 400]"   用于设置下拉菜单中的xxx条/页，或者用v-model:page-size(实际上每当下拉菜单改变时就会触发更新limit值)
			:background boolean,是否为分页器中下方点击xxx页的那些按钮添加背景
			:layout,设置分页器6个子组件布局位置,比如如果想要交换位置，在layout中修改字符串顺序即可。(🔺可以添加一个`->`字符串，意思是在他右边的都靠右布局。)

			分页器当前页码发生变化时会触发current-change事件。(无论通过直接点击页码 / 跳转页码 / 上一页 / 下一页都会触发)
		-->
			<!-- 🔺🔺🔺注意都是v-model双向绑定的！！！ -->
			<br />
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
		</el-card>

		<!-- 🍉对话框 -->
		<el-dialog
			v-model="dialogFormVisible"
			:title="st == 1 ? '添加品牌' : '修改品牌'"
			width="500"
		>
			<el-form
				:model="form"
				:rules="rules"
				ref="theform"
				style="width: 80%"
				label-width="auto"
				label-position="right"
			>
				<el-form-item label="品牌名称" prop="tmName">
					<el-input
						v-model="form.tmName"
						placeholder="请输入品牌名称"
					></el-input>
				</el-form-item>

				<!-- show-file-list是显示上传过的文件名都显示出来 -->
				<el-form-item label="品牌LOGO" prop="logoUrl">
					<el-upload
						class="avatar-uploader"
						action="/api/admin/product/fileUpload"
						:headers="uploadHeaders"
						:show-file-list="false"
						:drag="true"
						:before-upload="beforeAvatarUpload"
						:on-success="handleAvatarSuccess"
						:multiple="false"
					>
						<img
							v-if="form.logoUrl"
							:src="form.logoUrl"
							class="avatar"
						/>
						<el-icon v-else class="avatar-uploader-icon">
							<Plus />
						</el-icon>
					</el-upload>
				</el-form-item>
			</el-form>

			<template #footer>
				<el-button type="danger" @click="cancel">取消</el-button>
				<el-button
					type="primary"
					@click="confirm"
					:disabled="!validated"
				>
					确定
				</el-button>
			</template>
		</el-dialog>
	</div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick, watch, reactive, computed } from 'vue';
import {
	reqExistingBrands,
	reqAddBrand,
	reqUpdateBrand,
	reqDeleteBrand,
} from '@/api/product/brands';
import type {
	Brand,
	ExistingBrandsResponseData,
} from '@/api/product/brands/type';
import { useUserStore } from '@/store/modules/user'; // 为了获取token让el-upload发送请求时带上,以及获取按钮权限
import { ElMessage, type UploadProps } from 'element-plus';

// 获取用户store
const userStore = useUserStore();

// 上传文件的请求头
const uploadHeaders = computed(() => ({
	Token: userStore.token || '', // 注意：使用大写的 'Token'
}));

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

// 对话框是否显示
let dialogFormVisible = ref<boolean>(false);
// 对话框类型：1-添加，2-修改
let st = ref<number>(0);

// 表单数据
let form = reactive<Brand>({
	id: 0,
	tmName: '',
	logoUrl: '',
});
// 表单实例
let theform = ref();
// 表单校验
let validated = ref<boolean>(false);

// 表单校验
async function checkFormValidation() {
	// console.log("theform:",theform);
	// console.log("form: ",form);
	if (!theform.value) return false;
	try {
		await theform.value.validate();
		validated.value = true;
	} catch (err) {
		validated.value = false;
	}
}

// 监视表单校验
watch(
	() => form,
	() => nextTick(() => checkFormValidation()),
	{
		deep: true,
		immediate: true,
	},
);

// 表单校验规则
const rules = {
	tmName: [
		{
			required: true,
			min: 1,
			max: 20,
			message: '品牌名称长度应该在1到20个字符之间',
			// trigger: 'blur'
			// 实际上因为下面写了一个watch，所以trigger无论写什么实际都类似change的效果。
		},
	],
	logoUrl: [
		{
			required: true,
			message: '品牌LOGO图片不能为空',
			// trigger: 'change'
		},
	],
};

// 获取品牌数据来呈现在页面上
async function getExistingBrands() {
	console.log('currentPage:', currentPage.value, ' limit:', limit.value);
	let res: ExistingBrandsResponseData = await reqExistingBrands(
		currentPage.value,
		limit.value,
	);
	if (res.code == 200) {
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
function changeCurrentPage(newPage: number) {
	getExistingBrands();
}

// 增改删品牌
function addBrand() {
	// 点击添加之后，弹出对话框。
	form.tmName = form.logoUrl = '';
	st.value = 1;
	nextTick(() => {
		dialogFormVisible.value = true;
		theform.value?.resetFields(); // 重置表单校验状态(要不然第二次点击添加的时候一上来就会有两条message警告表单格式了。)
	});
}

function updateBrand(data: Brand) {
	Object.assign(form, data);
	st.value = 2;
	dialogFormVisible.value = true;
}

async function deleteBrand(id: number) {
	let res: any = await reqDeleteBrand(id);
	console.log(res);
	if (res.code == 200) {
		ElMessage.success('品牌删除成功');
		getExistingBrands(); // 重新获取品牌列表
	} else {
		ElMessage.error('品牌删除失败：' + res.message);
	}
}

// 对话框取消
function cancel() {
	dialogFormVisible.value = false;
	// 清除验证状态，避免下次打开对话框时显示之前的验证错误
	nextTick(() => {
		theform.value?.clearValidate();
	});
}

// 对话框确认
async function confirm() {
	// 1:Add,2:Update
	dialogFormVisible.value = false;

	if (st.value == 1) {
		let res: any = await reqAddBrand(form);
		if (res.code == 200) {
			ElMessage.success('品牌添加成功');
			getExistingBrands(); // 重新获取品牌列表
		} else {
			ElMessage.error('品牌添加失败：' + res.message);
		}
	} else {
		let res: any = await reqUpdateBrand(form);
		if (res.code == 200) {
			ElMessage.success('品牌修改成功');
			getExistingBrands(); // 重新获取品牌列表
		} else {
			ElMessage.error('品牌修改失败：' + res.message);
		}
	}
}

// 图片上传之前触发钩子函数
// UploadProps['beforeUpload']是该钩子函数的ts类型限制
// rawFile是上传的原始文件对象
const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
	console.log(rawFile);
	if (
		rawFile.type !== 'image/jpeg' &&
		rawFile.type !== 'image/png' &&
		rawFile.type !== 'image/jpg' &&
		rawFile.type !== 'image/gif'
	) {
		ElMessage.error('上传文件格式必须是 JPG/PNG/JPG/GIF 格式之一。');
		return false;
	} else if (rawFile.size / 1024 / 1024 > 2) {
		// 最大2MB
		ElMessage.error('上传文件大小不能超过 2MB。');
		return false;
	}
	return true;
};

// 图片上传成功后触发钩子函数
const handleAvatarSuccess: UploadProps['onSuccess'] = (res, file) => {
	console.log(res);
	if (res.code === 200) {
		form.logoUrl = res.data; // 假设后端返回的图片URL在res.data.url中
		ElMessage.success('图片上传成功');
	} else {
		ElMessage.error('图片上传失败: ' + res.message);
	}
};
</script>

<style scoped>
.avatar-uploader .avatar {
	width: 178px;
	height: 178px;
	display: block;
}
</style>

<!-- 🔺这里照搬官网的，因为el-upload是另一个组件，所以如果这部分style写成scoped就没作用了！ -->
<style>
.avatar-uploader .el-upload {
	border: 1px dashed var(--el-border-color);
	border-radius: 6px;
	cursor: pointer;
	position: relative;
	overflow: hidden;
	transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
	border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
	font-size: 28px;
	color: #8c939d;
	width: 178px;
	height: 178px;
	text-align: center;
}
</style>
