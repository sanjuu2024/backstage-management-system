<template>
	<div class="tabbar_right">
		<!-- 刷新按钮 -->
		<el-button :icon="Refresh" circle @click="updateRefresh"></el-button>
		<!-- 全屏按钮 -->
		<el-button :icon="FullScreen" circle @click="fullScreen"></el-button>
		<!-- el-popover形式显示主题切换 -->
		<el-popover
			placement="bottom"
			title="主题设置"
			width="300px"
			trigger="hover"
			popper-class="theme-setting-popover"
		>
			<template #reference>
				<el-button :icon="Setting" circle @click=""></el-button>
			</template>
			<el-form>
				<el-form-item label="主题颜色">
					<div class="color-picker-wrapper">
						<!-- 🔺🔺🔺必须写`:teleported="false"`，冒号也不能漏，否则鼠标hover到popover框之外的地方时拾色器面板就会关闭 -->
						<el-color-picker
							:predefine="predefineColors"
							size="small"
							:teleported="false"
							@change="setTheme"
						/>
					</div>
				</el-form-item>
				<el-form-item label="暗黑模式">
					<!-- active-icon和inactive-icon会覆盖掉active-text和inactive-text -->
					<el-switch
						v-model="dark"
						active-text="开"
						active-icon="Moon"
						inactive-text="关"
						inactive-icon="Sunny"
						inline-prompt
						@change="changeDark"
					/>
				</el-form-item>
			</el-form>
		</el-popover>

		<img
			:src="userStore.userInfo.avatar"
			alt="头像"
			height="40px"
			style="border-radius: 50%"
		/>
		<el-dropdown>
			<span class="el-dropdown-link">
				<span>{{ userStore.userInfo.username }}</span>
				<el-icon class="el-icon--right">
					<arrow-down />
				</el-icon>
			</span>
			<template #dropdown>
				<el-dropdown-menu>
					<el-dropdown-item @click="logout">
						<el-icon>
							<SwitchButton />
						</el-icon>
						退出登录
					</el-dropdown-item>
				</el-dropdown-menu>
			</template>
		</el-dropdown>
	</div>
</template>

<script lang="ts">
export default {
	name: 'Setting',
};
</script>

<script setup lang="ts">
import { FullScreen, Refresh, Setting } from '@element-plus/icons-vue';
import { useSettingStore } from '@/store/modules/setting';
import { useUserStore } from '@/store/modules/user';
import { useRouter } from 'vue-router';
import { ref } from 'vue';

const settingStore = useSettingStore();
let userStore = useUserStore();
const router = useRouter();

// 主题切换相关
let dark = ref(false); // 暗黑模式开关
const predefineColors = [
	'#ff4500',
	'#ff8c00',
	'#ffd700',
	'#90ee90',
	'#00ced1',
	'#1e90ff',
	'#c71585',
	'rgba(255, 69, 0, 0.68)',
	'rgb(255, 120, 0)',
	'hsv(51, 100, 98)',
	'hsva(120, 40, 94, 0.5)',
	'hsl(181, 100%, 37%)',
	'hsla(209, 100%, 56%, 0.73)',
	'#c7158577',
];

function updateRefresh() {
	settingStore.refresh = !settingStore.refresh;
}

// 🍉完全用bom和dom就可以实现全屏和退出全屏！
function fullScreen() {
	// dom对象的一个用来判断当前是不是全屏模式的属性(true/false)
	let full = document.fullscreenElement;
	if (!full) {
		document.documentElement.requestFullscreen();
	} else {
		document.exitFullscreen();
	}
}

async function logout() {
	// 1.🔺其实需要向服务器发送请求[退出登录接口,通知服务器本地用户token失效],后面自己试试实现吧。
	// 2.清除小仓库和本地存储的用户信息
	// 3.跳转到登录页面
	// 🌷以后可以优化的点：其实应该是区分：1)token过期的话，可以写成：`router.push({name:'Login',query:{redirect:router.path}})`，2)主动退出的话才不带参数。这样可能合理一点（？）
	// 🌷也许在login界面判断，如果url带redirect参数就redirect，否则首页：`router.push({path:redirect||'/'})`
	await userStore.userLogout();
	router.push('/login');
}

// 切换暗黑模式
function changeDark(val: boolean) {
	let html = document.documentElement;
	// 切换 Element Plus 暗黑模式类
	if (val) {
		html.classList.add('dark');
	} else {
		html.classList.remove('dark');
	}
}

// 切换主题
function setTheme(val: string) {
	let html = document.documentElement;
	html.style.setProperty('--el-color-primary', val);
}
</script>

<style scoped lang="scss">
.tabbar_right {
	display: flex;
	align-items: center;

	img {
		/* 🔺必须宽高都限定了，再加上border-radius的时候才能实现圆形，否则可能呈现椭圆形。 */
		width: 30px;
		height: 30px;
		margin: 0 10px;
	}

	.el-dropdown {
		margin: 10px;
	}
}

// 无效❌
// .el-popover{
// 	overflow: hidden;
// 	max-width: 280px;
// }

// 有效✅
.color-picker-wrapper {
	overflow: hidden;
	max-width: 280px;
}
</style>
