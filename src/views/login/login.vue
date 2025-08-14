<template>
    <div class="login">
        <div class="imgBox">
            <img class="img" src="@/assets/imgs/login/bg.png" alt="">
        </div>
        <div class="box">
            <div class="header">FH Admin</div>
            <div class="form">
                <div class="cell">
                    <div class="label">用户名</div>
                    <div class="content">
                        <el-input v-model="formData.account" placeholder="请输入用户名" />
                    </div>
                </div>
                <div class="cell">
                    <div class="label">密码</div>
                    <div class="content">
                        <el-input v-model="formData.password" type="password" placeholder="请输入密码"
                            :show-password="true" />
                    </div>
                </div>
                <div class="note">
                    <el-checkbox value="Value 1" />
                    已阅读
                    <span style="color: var(--el-color-primary);cursor: pointer;">《隐私条例》</span>
                </div>
                <div class="loginBtn" @click="login">登录</div>
                <div class="signBtn">去注册</div>
            </div>
        </div>
    </div>
</template>
<script lang="ts" setup>
import useStore from '@/store';
import { reactive } from 'vue';
import { useRouter } from 'vue-router';
import { loginApi } from "@/api/user.ts"

const store = useStore()
const router = useRouter()

const formData = reactive({
    account: 'admin',
    password: '123456'
})
function login() {
    loginApi(formData, { showError: true }).then(res => {
        store.setStorageState('token', res.token)
        store.setStorageState('userInfo', res.userInfo)
        // store.setStorageState('userInfo', {
        //     name: "FH"
        // })
        //恢复主题（避免黑暗主题未生效）
        store.changeTheme(store.isDarkTheme)
        router.push('/')
    })
}

//防止dark主题退出登录导致样式错误
document.documentElement.classList.remove('dark')
</script>
<style lang="scss" scoped>
.login {
    --el-color-primary: #409eff !important;
    height: 100vh;
    display: flex;
    align-items: center;
    padding: 10vw;
    box-sizing: border-box;

    .imgBox {
        flex: 2;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;

        .img {
            width: 800px;
            height: 400px;
        }
    }

    .box {
        flex-shrink: 0;
        width: 400px;
        // height: 800px;
        border-radius: 16px;
        box-shadow: 0 0 16px rgba(0, 0, 0, 0.1);
        padding: 32px;
        box-sizing: border-box;

        .header {
            color: var(--el-color-primary);
            text-align: center;
            font-size: 32px;
            font-weight: bold;
        }

        .form {
            margin-top: 40px;
            display: flex;
            flex-direction: column;
            gap: 20px;

            .cell {
                display: flex;
                flex-direction: column;
                gap: 8px;

                :deep(.el-input__wrapper) {
                    background: transparent;
                }

                :deep(.is-focus) {
                    box-shadow: 0 0 0 1px var(--el-color-primary);
                }
            }

            .note {
                font-size: 14px;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .loginBtn {
                background-color: var(--el-color-primary);
                color: #fff;
                padding: 10px;
                text-align: center;
                border-radius: 4px;
                cursor: pointer;

                &:hover {
                    background-color: rgba(64, 158, 255, .8);
                }
            }

            .signBtn {
                width: fit-content;
                color: var(--el-color-primary);
                cursor: pointer;
            }
        }
    }
}
</style>