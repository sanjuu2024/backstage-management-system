<template>
	<div class="container">
		<!-- 这里的样式有几个坑点：info-box不能写在el-card上，也不能放在外层的div上，必须在el-card中新开一个div放.info-box -->
		<el-card>
			<div class="info-box">
				<img :src="userStore.userInfo.avatar" class="avatar" />
				<!-- 然后h3和p既然是同一块显示的，那就要作为同一个flex块被分配位置，所以还要开一个div放他们 -->
				<div class="p-box">
					<h3 class="username">
						{{ getTime() }}好，{{ userStore.userInfo.username }}。
					</h3>
					<p class="app-name">{{ appName }}</p>
				</div>
			</div>
		</el-card>
		<!-- <svg-icon name="welcome" width="70vh" height="70vh" style="position: absolute; left: 50%; margin-left: -250px;"></svg-icon> -->
		<!-- 或者用flex盒子装实现水平居中效果 -->
		<div class="svg-box">
			<svg-icon name="welcome" width="600px" height="600px"></svg-icon>
		</div>
	</div>
</template>

<script setup lang="ts">
// 后面路由鉴权顺带获取用户信息了，这里应该不需要了。
// import { onMounted } from 'vue';
// import { useUserStore } from '@/store/modules/user';
// const userStore = useUserStore();
// onMounted(() => {
// 	// 🍉在首页调用api，获取用户名和头像
// 	userStore.getUserInfo();
// })

import { useUserStore } from '@/store/modules/user';
import { getTime } from '@/utils/timeStr';
const userStore = useUserStore();
const appName = import.meta.env.VITE_APP_TITLE;
</script>

<style scoped lang="scss">
.container {
	position: relative;
}
.info-box {
	display: flex;
	// justify-content: space-between;
	align-content: center;
	margin-bottom: 10px;
}
.p-box {
	padding-left: 20px;
}
.avatar {
	width: 120px;
	height: 120px;
	border-radius: 50%;
}
.username {
	font-size: 27px;
}
.app-name {
	font-size: 20px;
}
.svg-box {
	display: flex;
	justify-content: center;
}
</style>
