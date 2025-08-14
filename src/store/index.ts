import { defineStore } from "pinia"
import Color from "color"
import { getStorageItem } from "@/utils"
import $bus from "@/bus"

const useStore = defineStore("main", {
    state: () => {
        return {
            token: getStorageItem<string>("token") || "",   //
            isDarkTheme: getStorageItem<boolean>("isDarkTheme") || false,   //是否为深色主题
            primaryColor: getStorageItem<string>("primaryColor") || "#E66740", //主题色
            isCollapse: getStorageItem<boolean>("isCollapse") || false,   //菜单展开状态
            userInfo: getStorageItem<object>("userInfo") || {}, //用户信息
        }
    },
    actions: {
        /**
         * 切换主题 明亮/黑暗
         */
        changeTheme(isDark?: boolean) {
            if (typeof isDark === 'boolean') {
                this.setStorageState("isDarkTheme", isDark)
            } else {
                this.setStorageState("isDarkTheme", !this.isDarkTheme)
            }
            if (this.isDarkTheme) {
                document.documentElement.classList.add("dark")
            } else {
                document.documentElement.classList.remove("dark")
            }
            $bus.emit("themeChange", this.isDarkTheme)
        },
        /**
         * 修改主题色
         * @param val 颜色值
         */
        changePrimaryColor(val?: string) {
            this.setStorageState("primaryColor", val || this.primaryColor)
            const rgb = Color(this.primaryColor).rgb().array().join(",")
            document.documentElement.style.setProperty("--color-primary-rgb", rgb)
            $bus.emit("primaryColorChange", this.primaryColor)
        },
        /**
         * 修改菜单展开状态
         * @param val 
         */
        changeCollapse(val: boolean) {
            if (typeof val === 'boolean') {
                this.setStorageState("isCollapse", val)
            } else {
                this.setStorageState("isCollapse", !this.isCollapse)
            }
        },
        /**
         * 修改持久化数据
         * @param key 键
         * @param value 值
         * @param type "local" | "session" ，默认为 "local"
         */
        setStorageState<T extends { $state: any }>(this: T, key: keyof T['$state'], value: any, type: 'local' | 'session' = 'local') {
            this[key] = value
            if (type === "local") {
                if (typeof value === 'object') {
                    localStorage.setItem(key as string, JSON.stringify(value))
                } else {
                    localStorage.setItem(key as string, value)
                }
            }
            if (type === "session") {
                if (typeof value === 'object') {
                    sessionStorage.setItem(key as string, JSON.stringify(value))
                } else {
                    sessionStorage.setItem(key as string, value)
                }
            }
        }
    }
})

export default useStore