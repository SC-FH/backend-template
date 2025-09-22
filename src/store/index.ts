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
        changeTheme(isDark?: boolean, animationOption?: { show: boolean, pointe: { clientX: number, clientY: number } }) {
            if (typeof isDark === 'boolean') {
                this.setStorageState("isDarkTheme", isDark)
            } else {
                this.setStorageState("isDarkTheme", !this.isDarkTheme)
            }
            const fn = () => {
                // 动画过渡切换主题色
                if (this.isDarkTheme) {
                    document.documentElement.classList.add("dark")
                } else {
                    document.documentElement.classList.remove("dark")
                }
                $bus.emit("themeChange", this.isDarkTheme)
            }
            if (animationOption?.show && document.startViewTransition) {
                // 执行切换主题的操作
                const transition = document.startViewTransition(() => {
                    fn()
                });

                transition.ready.then(() => {
                    // 获取鼠标的坐标
                    const { clientX, clientY } = animationOption.pointe;

                    // 计算最大半径
                    const radius = Math.hypot(
                        Math.max(clientX, innerWidth - clientX),
                        Math.max(clientY, innerHeight - clientY)
                    );

                    const clipPath = [
                        `circle(0% at ${clientX}px ${clientY}px)`,
                        `circle(${radius}px at ${clientX}px ${clientY}px)`,
                    ]
                    // 圆形动画扩散开始
                    document.documentElement.animate(
                        {
                            clipPath: this.isDarkTheme ? clipPath : [...clipPath].reverse(),
                        },
                        // 设置时间，已经目标伪元素
                        {
                            duration: 300,
                            fill: "both",
                            pseudoElement: this.isDarkTheme ? "::view-transition-new(root)" : "::view-transition-old(root)",
                        }
                    );
                });
            } else {
                fn()
            }
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