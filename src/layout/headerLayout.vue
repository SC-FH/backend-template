<template>
    <div class="headerLayout">
        <div class="left">
            <el-icon size="16" style="cursor: pointer;" @click="store.changeCollapse">
                <Fold v-if="!store.isCollapse" />
                <Expand v-else />
            </el-icon>
            <!-- 面包屑 -->
            <el-breadcrumb separator="/">
                <el-breadcrumb-item v-for="(item, index) in route.matched.filter(v => v.meta.title)"
                    :to="{ name: item.name }" :key="index">{{ item.meta.title }}</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="right">
            <el-tooltip effect="dark" content="搜索" placement="bottom">
                <div class="icon" @click="openSearchDialog">
                    <el-icon size="18">
                        <Search />
                    </el-icon>
                </div>
            </el-tooltip>
            <el-tooltip effect="dark" content="全屏" placement="bottom">
                <div class="icon" @click="fullScreen">
                    <el-icon size="18">
                        <FullScreen />
                    </el-icon>
                </div>
            </el-tooltip>
            <el-tooltip effect="dark" :content="!store.isDarkTheme ? '明亮' : '黑暗'" placement="bottom">
                <div class="icon" @click="store.changeTheme(!store.isDarkTheme, { show: true, pointe: $event })">
                    <el-icon size="18">
                        <Sunny v-if="store.isDarkTheme" />
                        <Moon v-else />
                    </el-icon>
                </div>
            </el-tooltip>
            <el-tooltip effect="dark" content="设置" placement="bottom">
                <div class="icon" @click="settingRef?.open">
                    <el-icon size="18">
                        <Setting />
                    </el-icon>
                </div>
            </el-tooltip>

            <!-- 用户信息 -->
            <el-dropdown placement="bottom">
                <div class="userBox">
                    <el-image class="avatar"
                        src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" />
                    <div>F.H.</div>
                </div>
                <template #dropdown>
                    <el-dropdown-menu>
                        <el-dropdown-item>
                            <div class="dropdown-item">个人中心</div>
                        </el-dropdown-item>
                        <el-dropdown-item @click="logout">
                            <div class="dropdown-item">退出</div>
                        </el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>

            <!-- 时间 -->
            <div class="timeBox">
                <div class="left">
                    <div class="week">{{ dateInfo.week }}</div>
                    <div class="day">{{ dateInfo.day }}</div>
                </div>
                <div class="right">
                    <div class="time">{{ dateInfo.time }}</div>
                </div>
            </div>
        </div>
        <el-dialog v-model="searchDialogVisible" title="搜索" width="30%" top="8vh" :show-close="false">
            <el-input v-model="searchStr" placeholder="请输入搜索内容" clearable @input="remoteMethod"></el-input>
            <div class="searchList">
                <div class="cell" v-for="(item, index) in searchResult" :key="item.content"
                    @click="searchItemClick(item)">
                    <div>{{ item.breadcrumb }}</div>
                    <div v-html="item.content" style="margin-top: 4px;"></div>
                </div>
                <div v-if="searchStr.trim() && isEmpty(searchResult)" class="empty">未搜索到内容</div>
            </div>
        </el-dialog>
    </div>
    <setting ref="settingRef" />
</template>
<script lang="ts" setup>
import { onBeforeUnmount, reactive, ref } from "vue"
import useStore from "@/store";
import dayjs from "dayjs";
import { useRoute, useRouter } from "vue-router";
import { debounce, deepClone, isEmpty } from "@/utils";
import setting from "./setting.vue";
const store = useStore()
const route = useRoute()
const router = useRouter()

//全屏
function fullScreen() {
    if (document.fullscreenElement) {
        document.exitFullscreen()
    } else {
        document.documentElement.requestFullscreen()
    }
}



//时间显示
const weekMap = new Map([
    [0, '星期日'],
    [1, '星期一'],
    [2, '星期二'],
    [3, '星期三'],
    [4, '星期四'],
    [5, '星期五'],
    [6, '星期六']
])
const dateInfo = reactive({
    week: '',
    day: '',
    time: ''
})
let timer: number
function getTime() {
    dateInfo.week = weekMap.get(new Date().getDay()) || ""
    dateInfo.day = dayjs().format('MM-DD')
    dateInfo.time = dayjs().format('HH:mm')
    timer = setTimeout(getTime, 1000);
}
getTime()
onBeforeUnmount(() => {
    clearTimeout(timer)
})


//搜索按钮
const searchDialogVisible = ref(false)
const searchStr = ref("")
// const searchLoading = ref(false)
const searchResult = ref<any[]>([])    //搜索结果
function openSearchDialog() {
    searchStr.value = ""
    searchResult.value = []
    searchDialogVisible.value = true
}

function closeSearchDialog() {
    searchDialogVisible.value = false
}

const remoteMethod = debounce(() => {
    const routes = deepClone(router.options.routes) as any[]
    if (searchStr.value.trim()) {
        searchResult.value = findRoutes(routes, searchStr.value.trim())
    } else {
        searchResult.value = []
    }
}, 150)

function findRoutes(routes: any[], query: string, parentList: any[] = []): any[] {
    let arr: any[] = []
    for (let i = 0; i < routes.length; i++) {
        const route = routes[i];
        if (route.children) {
            arr = arr.concat(findRoutes(route.children, query, [...parentList, route]))
        } else {
            if (route.meta?.title?.indexOf(query) > -1) {
                const content = route.meta?.title.replaceAll(query, `<span style="color: var(--color-primary);">${query}</span>`)
                arr.push({
                    breadcrumb: [...parentList, route].filter(v => v.meta.title).map(v => v.meta.title).join(" -> "), //面包屑
                    content,
                    route,
                    chainList: [...parentList, route]
                })
            }
        }
    }
    return arr
}

function searchItemClick(item: any) {
    router.push(item.route.meta.fullPath)
    closeSearchDialog()
}

const settingRef = ref<InstanceType<typeof setting>>()


function logout() {
    store.setStorageState("userInfo", {})
    store.setStorageState("token", "")
    router.push('/login')
}
</script>
<style lang="scss" scoped>
html.dark {
    .headerLayout {
        border-bottom: none;
    }
}

.headerLayout {
    height: var(--header-height);
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px;
    box-sizing: border-box;
    background-color: var(--box-bg-color);
    box-shadow: rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(29, 35, 41, 0.05) 2px 0px 8px 0px;
    border-bottom: 1px solid rgba(238, 238, 238, .4);

    >.left {
        display: flex;
        align-items: center;
        gap: 16px;
    }

    >.right {
        display: flex;
        align-items: center;
        gap: 16px;

        .icon {
            padding: 6px 6px;
            border-radius: 4px;
            cursor: pointer;

            &:hover {
                background-color: var(--hover-bg-color);
            }
        }
    }

    .userBox {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 6px;
        border-radius: 4px;

        &:hover {
            background-color: var(--hover-bg-color);
        }

        &:focus-visible {
            outline: none;
        }

        .avatar {
            width: 24px;
            height: 24px;
            border-radius: 50%;
            overflow: hidden;
        }
    }

    .timeBox {
        display: flex;
        align-items: center;
        gap: 10px;
        margin-left: 10px;

        .left {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 4px;
            font-size: 12px;

            .week {}

            .day {}
        }

        .right {
            font-size: 26px;
        }
    }

    .searchList {
        margin-top: 10px;

        .cell {
            padding: 10px;
            cursor: pointer;
            border-radius: 4px;

            &:hover {
                background-color: var(--hover-bg-color);
            }
        }

        .empty {
            text-align: center;
            padding: 20px;
        }
    }
}
</style>