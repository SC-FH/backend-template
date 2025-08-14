<template>
    <el-sub-menu v-if="!isEmpty(route.children) && !route.meta?.menuHide" :index="route.name">
        <template #title>
            <div class="cell">
                <i :class="['iconfont', route.meta?.iconfont]"></i>
                <div class="title">{{ route.meta?.title }}</div>
            </div>
        </template>
        <menuItem v-for="(el, idx) in route.children" :route="el">
        </menuItem>
    </el-sub-menu>
    <el-menu-item v-else-if="!route.meta?.menuHide" :index="route.name" @click="router.push({ name: route.name })">
        <el-tooltip effect="dark" :content="route.meta?.title" :disabled="tooltipDisabled" placement="right"
            :offset="12">
            <div class="cell">
                <i :class="['iconfont', route.meta?.iconfont]"></i>
                <div class="title">{{ route.meta?.title }}</div>
            </div>
        </el-tooltip>
    </el-menu-item>
</template>
<script lang="ts" setup>
import { useRouter } from 'vue-router';
import menuItem from "./menuItem.vue"
import { isEmpty } from "@/utils/index.ts"
import useStore from '@/store';
import { RouteRecord } from "@/router"
import { computed } from 'vue';
const store = useStore()
const router = useRouter()

const props = defineProps<{
    route: RouteRecord
}>()

// 判断是否显示tooltip
const tooltipDisabled = computed(() => {
    //获取layout的routerId
    const target = router.getRoutes().find(v => v.path == "/")
    return !store.isCollapse || props.route.children?.length || target?.meta?.id != props.route.meta?.parentId
})


</script>
<style lang="scss" scoped>
:deep(.cell) {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;

    .iconfont {
        font-size: 20px;
    }
}
</style>