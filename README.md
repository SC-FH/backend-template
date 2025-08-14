# 后台管理系统模板

## 演示地址
> [http://template.webfh.top](http://template.webfh.top)

## 介绍
> 基于vue3 + vite + TS + vue-router + pinia + axios + element plus + sass 构建的后台管理系统模板  
> 作者：FH

## 开始
1.安装依赖
```sh
pnpm i 
```

2.启动项目
```sh
pnpm run dev
```

## 使用

> 1.附带有基于axios网络请求封装，使用简单，易于扩展  

> 2.附带有eventBus事件通信，方便组件间通信

> 3.菜单路由可扩展性高，基于路由自动渲染菜单栏，易于配置

### 网络请求配置使用

```ts
interface configType extends AxiosRequestConfig<any> {
    //是否显示加载动画
    loading?: boolean
    //是否显示错误提示
    showError?: boolean
    //是否取消相同历史未完成接口
    cancelSame?: boolean
}

const testAjax = $ajax.post('/user/getUserInfo', {}, { cancelSame: true, showError: true }).then(res => {
    console.log(res);
})

//取消网络请求
abortAjax(testAjax)
```

## 规范（重点）

> 1.文件使用小驼峰命名法命名，例：home.vue、systemUser.vue

> 2.路由组件文件名必须与路由name一致，否则 keepAlive: true 不生效

> 3.路由中name必须唯一，且须渲染的路由name必填

> 4.后端接口统一返回格式，若后端返回格式不同，请自行修改网络请求封装

```json
{
    "code": 200,
    "data": {},
    "message": "success"
}
```