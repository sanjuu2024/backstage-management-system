<template>
	<div class="tabbar_right">
		<el-button :icon="Refresh" circle @click="updateRefresh"></el-button>
		<el-button :icon="FullScreen" circle @click="fullScreen"></el-button>
		<el-button :icon="Setting" circle @click=""></el-button>
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
const settingStore = useSettingStore();
let userStore = useUserStore();
const router = useRouter();

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
</script>

<style>
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
</style>
