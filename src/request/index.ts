import router from "@/router";
import useStore from "@/store";
import axios, { AxiosRequestConfig } from "axios"
import { ElMessage, ElLoading } from "element-plus"
const request = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL,
})

request.interceptors.request.use((config) => {
    //携带token
    config.headers.Authorization = "Bearer " + localStorage.getItem("token")
    return config
})

request.interceptors.response.use((res) => {
    //
    if (res.data.code !== 200) {
        return Promise.reject(res.data.message)
    }
    //针对 {code:200,data:xxx} 的数据
    return Promise.resolve(res.data.data)
    //否则
    // return Promise.resolve(res.data)
}, (err) => {
    if (err.status === 401) {
        useStore().setStorageState("token", "")
        router.push("/login")
        return Promise.reject("登录过期")
    } else if (err.status === 403) {
        return Promise.reject("无权限")
    } else if (err.status === 500) {
        return Promise.reject("服务器异常")
    } else if (err.code == "ERR_NETWORK") {
        return Promise.reject("网络异常")
    } else {
        return Promise.reject(err)
    }
})

export interface configType extends AxiosRequestConfig<any> {
    //是否显示加载动画
    loading?: boolean
    //是否显示错误提示
    showError?: boolean
    //是否取消相同历史未完成接口
    cancelSame?: boolean
}

//用于取消网络请求
const requestMap = new Map()

//用于记录请求url+method
const requestUrlMap = new Map()

const $ajax = (config: configType): Promise<any> => {
    let loadingInstance: any
    if (config.loading) {
        loadingInstance = ElLoading.service({ fullscreen: true, text: '加载中...' })
    }
    const controller = new AbortController()
    const key = `${config.url}->${config.method}`

    //发送网络请求
    const sender = request({
        ...config,
        signal: controller.signal
    }).then(res => {
        loadingInstance?.close()
        requestMap.delete(sender)

        if (requestUrlMap.has(key)) {
            const promiseList = requestUrlMap.get(key) as Promise<any>[]
            const index = promiseList.indexOf(sender)
            if (index !== -1) {
                promiseList.splice(index, 1)
            }
        }
        return res
    }).catch(err => {
        loadingInstance?.close()

        //针对取消网络请求（无需提示）
        if (err?.name == "CanceledError") {
            return Promise.reject("请求已取消")
        }

        if (config.showError) {
            ElMessage.error(err)
        }
        requestMap.delete(sender)
        return Promise.reject(err)
    })
    requestMap.set(sender, controller)

    //取消历史未完成的相同接口
    if (config.cancelSame) {
        if (requestUrlMap.has(key)) {
            const promiseList = requestUrlMap.get(key) as Promise<any>[]
            promiseList.forEach(promise => {
                abortAjax(promise)
            })
            requestUrlMap.delete(key)
        }
    }
    if (requestUrlMap.has(key)) {
        requestUrlMap.get(key).push(sender)
    } else {
        requestUrlMap.set(key, [sender])
    }
    //
    return sender
}

$ajax.get = (url: string, params?: any, config: configType = {}) => {
    return $ajax({
        url,
        method: "get",
        params,
        ...config
    })
}

$ajax.post = (url: string, data?: any, config: configType = {}) => {
    return $ajax({
        url,
        method: "post",
        data,
        ...config
    })
}
$ajax.put = (url: string, data?: any, config: configType = {}) => {
    return $ajax({
        url,
        method: "put",
        data,
        ...config
    })
}
$ajax.delete = (url: string, params?: any, config: configType = {}) => {
    return $ajax({
        url,
        method: "delete",
        params,
        ...config
    })
}

/**
 * 取消网络请求
 * @param promise promise对象
 */
function abortAjax(promise: Promise<any>) {
    const controller = requestMap.get(promise)
    controller?.abort()
    requestMap.delete(promise)
}
export {
    $ajax,
    abortAjax
}