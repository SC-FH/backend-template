<template>
    <div class="sidebarLayout">
        <div class="header">{{ store.isCollapse ? "FH" : "FH Admin" }}</div>
        <div class="menu">
            <el-menu :default-active="route.name" :collapse="store.isCollapse">
                <menuItem v-for="(route, index) in routes" :key="index" :route="route">
                </menuItem>
            </el-menu>
        </div>
    </div>
</template>
<script lang="ts" setup>
import { useRouter, useRoute } from "vue-router"
import menuItem from "./menuItem.vue";
import useStore from "@/store/index"
const router = useRouter()
const route = useRoute()
const routes = router.options.routes[0].children

const store = useStore()

</script>
<style lang="scss" scoped>
.sidebarLayout {
    height: 100vh;
    box-shadow: rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(29, 35, 41, 0.05) 2px 0px 8px 0px;
    background-color: var(--box-bg-color);
    z-index: 10;

    .header {
        text-align: center;
        font-size: 18px;
        font-weight: bold;
        color: var(--color-primary);
        height: var(--header-height);
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .menu {
        :deep(.el-menu) {
            flex-shrink: 0;
            border-right: none !important;
            overflow: hidden;

            &:not(.el-menu--collapse) {
                width: 220px;

                .cell {
                    .title {
                        display: flex;
                    }
                }
            }

            .cell {
                .title {
                    display: none;
                }
            }
        }
    }
}
</style>