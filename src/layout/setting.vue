<template>
    <div class="setting">
        <el-drawer v-model="drawerShow" title="设置">
            <div class="body">
                <div class="box">
                    <div class="title">主题色</div>
                    <div class="form">
                        <div class="cell">
                            <div class="label">推荐主题色</div>
                            <div class="content">
                                <div v-for="(item, index) in recommendTheme" :key="index"
                                    :class="{ themeBtn: true, themeBtn_active: store.primaryColor == item.color }"
                                    :style="{ '--recommend-color': item.color }" @click="colorChange(item.color)">{{
                                    item.name }}</div>
                            </div>
                        </div>
                        <div class="cell">
                            <div class="label">自定义主题色</div>
                            <div class="content">
                                <el-color-picker :model-value="store.primaryColor" @change="colorChange" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </el-drawer>
    </div>
</template>
<script lang="ts" setup>
import useStore from '@/store';
import { reactive, ref } from 'vue';
const store = useStore()
const drawerShow = ref(false)
function open() {
    drawerShow.value = true
}

function close() {
    drawerShow.value = false
}

const recommendTheme = reactive([{
    name: "科技蓝",
    color: "#409eff"
}, {
    name: "紫罗兰",
    color: "#ba93ff"
}, {
    name: "果粒橙",
    color: "#E66740"
}])
function colorChange(e: any) {
    store.changePrimaryColor(e)
}
defineExpose({
    open,
    close
})
</script>
<style lang="scss" scoped>
.setting {
    :deep(.el-drawer__header) {
        padding: 10px;
        margin: 0;
    }

    .body {
        display: flex;
        flex-direction: column;
        gap: 20px;

        .box {
            display: flex;
            flex-direction: column;
            gap: 10px;

            .title {
                width: fit-content;
                display: flex;
                align-items: center;
                gap: 4px;
                height: 20px;

                // background: linear-gradient(90deg, var(--color-primary), rgba(255, 255, 255, 0));
                &::before {
                    content: " ";
                    width: 6px;
                    height: 100%;
                    background-color: var(--color-primary);
                }
            }

            .form {
                margin-top: 8px;
                margin-left: 20px;
                display: flex;
                flex-direction: column;
                gap: 16px;

                .cell {
                    gap: 10px;

                    .label {
                        margin-bottom: 4px;
                    }

                    .content {
                        display: flex;
                        align-items: center;
                        gap: 10px;

                        .themeBtn {
                            width: 100px;
                            padding: 4px 0;
                            text-align: center;
                            color: var(--recommend-color);
                            border: 1px solid var(--recommend-color);
                            transition: all 0.3s;
                            cursor: pointer;

                            &:hover {
                                background-color: var(--recommend-color);
                                color: #fff;
                            }
                        }

                        .themeBtn_active {
                            background-color: var(--recommend-color);
                            color: #fff;
                        }
                    }
                }
            }
        }
    }
}
</style>