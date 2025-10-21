<template>
	<div class="tabbar_right">
		<el-button :icon="Refresh" circle @click="updateRefresh"></el-button>
		<el-button :icon="FullScreen" circle @click="fullScreen"></el-button>
		<el-button :icon="Setting" circle @click=""></el-button>
		<img src="/public/logo.png" alt="头像" height="40px" />
		<el-dropdown>
			<span class="el-dropdown-link">
				admin
				<el-icon class="el-icon--right">
					<arrow-down />
				</el-icon>
			</span>
			<template #dropdown>
				<el-dropdown-menu>
					<el-dropdown-item>
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
const settingStore = useSettingStore();

function updateRefresh(){
    settingStore.refresh = !settingStore.refresh;
}

// 🍉完全用bom和dom就可以实现全屏和退出全屏！
function fullScreen(){
	// dom对象的一个用来判断当前是不是全屏模式的属性(true/false)
	let full = document.fullscreenElement;
	if (!full){
		document.documentElement.requestFullscreen();
	}
	else{
		document.exitFullscreen();
	}
}
</script>

<style>
.tabbar_right {
	display: flex;
	align-items: center;
	img {
		margin: 0 10px;
	}
	.el-dropdown {
		margin: 10px;
	}
}
</style>
