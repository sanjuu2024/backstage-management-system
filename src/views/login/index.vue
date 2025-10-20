<template>
    <div class="login_container">
        <el-row>
            <!-- 🔺响应式布局 -->
            <!-- 占位,el-row貌似一行24。
             然后:xs="0"指明当屏幕小于768的时候不显示这个标签，
             也就是只剩本来右侧的那部分内容了 -->
            <el-col :span="12" :xs="0"></el-col>
            <el-col :span="12">
                <!-- 如果要进行表单校验，element-plus要求要有:model和:rules属性 -->
                <el-form class="login_form" :model="loginForm" :rules="rules" ref="loginForms">
                    <h1>后台管理系统</h1>
                    <h2>欢迎来到sanjuu甄选</h2>
                    <!-- 🔺表单校验还需要所有需要表达校验的标签需要给一个prop(注意是prop不是props) -->
                    <el-form-item prop="username">
                        <el-input :prefix-icon="User" v-model="loginForm.username"></el-input>
                    </el-form-item>
                    <el-form-item prop="password">
                        <!-- !!!居然这么方便，写一个show-password的属性就可以实现点击眼睛图标切换密码是否可见...还以为要v-model呢... -->
                        <el-input type="password" :prefix-icon="Lock" v-model="loginForm.password" show-password></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button class="login_btn" type="primary" size="default" @click="login" :disabled="!validated">登录</el-button>
                    </el-form-item>
                </el-form>
            </el-col>
        </el-row>
    </div>
</template>

<script lang="ts">
export default {
    name: 'Login',
};
</script>
    
<script setup lang='ts'>
import {User,Lock} from '@element-plus/icons-vue';
import { reactive,ref,watch,nextTick } from 'vue';
import { type loginFormData } from '@/api/user/type';
import { useRouter } from 'vue-router';   // 为了实现编程式路由跳转
import { ElNotification } from 'element-plus';
import { getTime } from '@/utils/timeStr';
// 引入小仓库
import { useUserStore } from '@/store/modules/user';
let userStore = useUserStore();
const router = useRouter();

// 定义变量控制登录按钮是否显示正在加载的圆圈
let loading = ref(false);
let loginForms = ref();
let loginForm = reactive({
    username: 'admin',
    password: '111111'
});
let validated = ref(false);

// 通用的表单校验函数 - 不管有多少字段都能自动处理
async function checkFormValidation() {
    if (!loginForms.value) return;
    
    try {
        // 使用 Promise 版本的 validate，更简洁
        await loginForms.value.validate();
        validated.value = true;
    } catch {
        validated.value = false;
    }
}

// 监听表单数据变化，自动校验 - 通用方案，不需要写具体字段名
watch(
    () => loginForm, // 监听整个表单对象
    () => {
        // 使用 nextTick 确保 DOM 更新后再校验
        nextTick(() => {
            checkFormValidation();
        });
    },
    { deep: true, immediate: true } // deep: 深度监听对象内部变化，immediate: 立即执行一次
);

async function login(){
    loading.value = true;
    try{
        await userStore.userLogin({
            username: loginForm.username,
            password: loginForm.password
        } as loginFormData);
        router.push('/');
        ElNotification({
            type:'success',
            message:'登录成功',
            title: `${getTime()}好，${loginForm.username}`
        });
    } catch(err){
        ElNotification({
            type:'error',
            message:(err as Error).message
        });
    }
    loading.value = false;
}

const userNamePattern = /^\w{4,10}$/;   // 需要添加开始和结束锚点
const passwordPattern = /^\w{6,18}$/;    // 需要添加开始和结束锚点

// 定义表单校验格式rules(按照el-form要求写)
// min:文本长度至少多少位，max:文本长度最多多少位,message:错误的提示信息,trigger:触发校验表单的时机(change或blur)
const rules = {
    username: [{
        required:true,
        // 还是正则香
        // min: 4,
        // max:10,
        // message:'账号长度应在4-10位之间',
        trigger:"change",
        // 只要字段内容发生了变化(change)就会调用校验(validator)
        validator: (rule:any,value:string,callback:(any)) => {
            if (userNamePattern.test(value)){
                callback();   // 校验通过放行
            } else {
                callback(new Error('账号格式不正确'));   // 校验不通过的提示信息
            }
        }
    }],
    password: [{
        required:true,
        // min: 6,
        // max:18,
        // message:'密码长度应在6-18位之间',
        trigger:"change",
        // 只要字段内容发生了变化(change)就会调用校验(validator)
        validator: (rule:any,value:string,callback:(any)) => {
            if (passwordPattern.test(value)){
                callback();   // 校验通过放行
            } else {
                callback(new Error('密码格式不正确'));   // 校验不通过的提示信息
            }
        }
    }]
};
</script>
    
<style scoped lang='scss'>
.login_container {
    width: 100%;
    height: 100vh;   // 视口高度
    background: url('@/assets/images/background.jpg') no-repeat;
    background-size: cover;   // 嗯...前端真是越学越有
}

.login_form{
    position: relative;
    width: 80%;
    top: 30vh;
    background: url('@/assets/images/login_form.png') no-repeat;
    background-size: cover;
    padding: 40px;
    h1{
        color: #fff;
        font-size: 40px;
    }
    h2{
        color: #fff;
        font-size: 20px;
        margin: 20px 0;
    }
}


.login_btn{
    width: 100%;
}
</style>