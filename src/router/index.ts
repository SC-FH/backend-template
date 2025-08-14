import { deepClone, isEmpty } from "@/utils"
import { createRouter, createWebHashHistory, createWebHistory, RouteRecordRaw } from "vue-router"
import { nanoid } from "nanoid"
import useStore from "@/store"


export type RouteRecord = RouteRecordRaw & {
    children?: RouteRecord[],
    meta?: {
        id?: string,
        /**
         * 全路径
         */
        fullPath?: string,
        /**
         * 父级路由id
         */
        parentId?: string

        /**
        * 是否为永久tab
        */
        foreverTab?: boolean;
        /**
         * 图标
         */
        iconfont?: string;
        /**
         * 菜单标题
         */
        title?: string,
        /**
         * 是否在菜单中隐藏
         */
        menuHide?: boolean;
        /**
         * 是否启用keepAlive
         */
        keepAlive?: boolean;
    }
}

const routes: RouteRecord[] = [{
    path: "/",
    name: "layout",
    component: () => import("@/layout/layout.vue"),
    redirect: "/home",
    children: [{
        path: "home",
        name: "home",
        component: () => import("@/views/home/home.vue"),
        meta: {
            foreverTab: true,   // 是否永久tab
            iconfont: "icon-shouye",
            title: "首页",
            menuHide: false, //是否在菜单中隐藏
            keepAlive: false,
        }
    }, {
        path: "user",
        name: "user",
        component: () => import("@/views/user/user.vue"),
        meta: {
            title: "用户管理",
            iconfont: "icon-yonghuguanli",
        },
    },
    // {
    //     path: "role",
    //     name: "role",
    //     component: () => import("@/views/role/role.vue"),
    //     meta: {
    //         title: "角色管理",
    //         iconfont: "icon-jiaoseguanli",
    //     },
    // }, 
    {
        path: "permission",
        name: "permission",
        component: () => import("@/views/permission/permission.vue"),
        meta: {
            title: "权限管理",
            iconfont: "icon-quanxian",
        },
    }, {
        path: "inventory",
        name: "inventory",
        component: () => import("@/views/inventory/inventory.vue"),
        meta: {
            title: "库存管理",
            iconfont: "icon-kucunguanli",
        }
    }, {
        path: "aiChat",
        name: "aiChat",
        component: () => import("@/views/aiChat/aiChat.vue"),
        meta: {
            title: "ai聊天",
            iconfont: "icon-robot-2-fill",
        }
    }, {
        path: "guide",
        name: "guide",
        component: () => import("@/views/guide/guide.vue"),
        meta: {
            title: "指南",
            iconfont: "icon-zhinanzhidao",
        }
    }]
}, {
    path: "/login",
    name: "login",
    component: () => import("@/views/login/login.vue"),
}, {
    path: "/404",
    name: "404",
    component: () => import("@/views/404/404.vue")
}]

//初始化routes
function initRoutes(routes: RouteRecord[] = [], matched: any[] = []) {
    for (let item of routes) {
        const currentMatched: RouteRecord[] = deepClone(matched)
        currentMatched.push(item)

        const fullPath = currentMatched.map(v => v.path).join("/").replace(/\/\//g, "/") || "/"

        item.meta = {
            ...(item.meta || {}),
            id: nanoid(),    //唯一标识
            fullPath,    //全路径
            parentId: currentMatched[currentMatched.length - 2]?.meta?.id
        }
        if (!isEmpty(item.children)) {
            initRoutes(item.children, currentMatched)
        }
    }
}
initRoutes(routes)

const router = createRouter({
    routes,
    history: createWebHistory()
})

//路由拦截器
router.beforeEach((to, from, next) => {

    const store = useStore()
    const routes = router.getRoutes()

    if (!routes.some(item => item.meta.fullPath == to.path)) {
        next("/404")
        return
    }

    //白名单
    const whiteList = ['/login', '/404']
    if (whiteList.includes(to.path)) {
        next()
    } else {
        if (!isEmpty(store.userInfo)) {
            next()
        } else {
            next('/login')
        }
    }
})
export default router