<template>
    <div class="pageTabs" ref="pageTabsRef" @wheel="wheelHandle">
        <div :class="{ cell: true, cell_active: route.name == item.name }" v-for="(item, index) in tabList"
            :key="item.name" @click="tabClick(index)">
            <i :class="['iconfont', item.meta.iconfont]"></i>
            <div class="title">
                {{ item.meta.title }}
            </div>
            <div v-if="!item.meta.foreverTab" class="closeIcon" @click.stop="closeTab(index)">
                <el-icon>
                    <Close />
                </el-icon>
            </div>
        </div>
    </div>
</template>
<script lang="ts" setup>
import { ref, toRaw, watch } from 'vue';
import { deepClone } from '@/utils';
import { useRoute, useRouter } from 'vue-router';
const router = useRouter()
const route = useRoute()

const routes = router.getRoutes()

const tabList = ref<any[]>(deepClone(routes.filter(item => item.meta.foreverTab).reverse()))

watch(() => route.path, () => {
    const isLayoutChildren = route.matched.find(v => v.name == "layout") ? true : false
    if (isLayoutChildren) {
        const haveTab = tabList.value.find(item => item.meta.id == route.meta.id) ? true : false
        if (!haveTab) {
            const currentRoute = routes.find(item => item.meta.id == route.meta.id)
            tabList.value.push(currentRoute)
        }
    }
}, {
    immediate: true
})

function tabClick(index: number) {
    const data = tabList.value[index]
    router.push(data)
}
function closeTab(index: number) {
    tabList.value.splice(index, 1)
    if (index > tabList.value.length - 1) {
        tabClick(tabList.value.length - 1)
    } else {
        tabClick(index)
    }
}

const pageTabsRef = ref<HTMLDivElement>()
function wheelHandle(e: WheelEvent) {
    const scrollLeft = pageTabsRef.value?.scrollLeft as number

    document.querySelector(".pageTabs")?.scrollTo({
        left: scrollLeft + e.deltaY,
    })
}

</script>
<style lang="scss" scoped>
.pageTabs {
    --box-height: 36px;

    height: var(--box-height);
    background-color: var(--box-bg-color);
    padding: 10px 8px;
    padding-bottom: 0;
    box-shadow: rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(29, 35, 41, 0.05) 2px 0px 8px 0px;
    display: flex;
    align-items: flex-end;
    gap: 8px;
    border-bottom: 1px solid var(--hover-bg-color);
    box-sizing: content-box;
    overflow: auto;

    &::-webkit-scrollbar {
        display: none;
    }

    @keyframes cellShow {
        from {
            height: 0;
        }

        to {
            height: var(--box-height);
        }
    }

    .cell {
        padding: 0px 16px;
        height: var(--box-height);
        font-size: 15px;
        border-radius: 4px 4px 0 0;
        display: flex;
        align-items: center;
        gap: 8px;
        white-space: nowrap;
        cursor: pointer;
        overflow: hidden;
        animation: cellShow 0.3s ease-in-out;

        &:hover {
            background-color: #eee;
        }

        .closeIcon {
            border-radius: 50%;
            width: 16px;
            height: 16px;
            display: flex;
            justify-content: center;
            align-items: center;
            margin-left: 12px;
            font-size: 14px;

            &:hover {
                background-color: #999;
                color: #fff;
            }
        }
    }

    .cell_active {
        // background-color: rgb(231 238 255);
        background-color: rgba(var(--color-primary-rgb), 0.2);
        color: var(--color-primary);

        &:hover {
            // background-color: rgb(231 238 255);
            background-color: rgba(var(--color-primary-rgb), 0.2);
        }

        .closeIcon {

            &:hover {
                background-color: var(--color-primary);
                color: #fff;
            }
        }
    }
}

html.dark {
    .cell {
        background-color: #2e2e2e;

        &:hover {
            background-color: rgba(46, 46, 46, .5);
        }

        .iconfont {
            // color: ;
        }
    }

    .cell_active {
        background-color: #2e2e2e;
    }
}
</style>