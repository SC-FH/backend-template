/**
 * 判断是否为空数据
 * @param data 数据
 * @returns boolean
 */
export function isEmpty(data: any): boolean {
    if (typeof data === 'object' && data != null) {
        return Object.keys(data).length === 0;
    } else {
        return data ? false : true
    }
}

/**
 * 深拷贝
 * @param obj 对象
 * @param reserveFn 是否保留函数
 * @returns 
 */
export function deepClone<T extends Object>(obj: T, reserveFn: boolean = true): T {
    if (reserveFn) {
        let newObj = (obj instanceof Array ? [] : {}) as T
        for (let key in obj) {
            const val = obj[key]
            newObj[key] = (typeof val === 'object' && val != null) ? deepClone(val) : val
        }
        return newObj
    } else {
        return JSON.parse(JSON.stringify(obj))
    }
}

/**
 * 防抖函数
 * @param fn 
 * @param delay 
 * @returns 
 */
export function debounce<T extends (...args: any[]) => void>(fn: T, delay: number) {
    let timer: any = null
    return function (...args: Parameters<T>) {
        if (timer) clearTimeout(timer)
        timer = setTimeout(() => {
            fn(...args)
        }, delay)
    }
}

/**
 * 节流函数
 * @param fn 
 * @param delay 
 * @returns 
 */
export function throttle<T extends (...args: any[]) => void>(fn: T, delay: number) {
    let timer: any = null
    return function (...args: Parameters<T>) {
        if (timer) return
        timer = setTimeout(() => {
            fn(...args)
            timer = null
        }, delay)
    }
}

/**
 * 获取本地缓存数据
 * @param key 
 * @returns 
 */
export function getStorageItem<T>(key: string, type: "local" | "session" = "local"): T {
    let data: any
    if (type == "local") {
        data = localStorage.getItem(key)
    } else if (type == "session") {
        data = sessionStorage.getItem(key)
    }
    try {
        return JSON.parse(data)
    } catch (err) {
        if (data == "true") {
            return true as T
        } else if (data == "false") {
            return false as T
        } else {
            return data
        }
    }
}