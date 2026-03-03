

# 后台管理系统模板

## 演示地址

> [https://template.webfh.top](https://template.webfh.top)

## 项目介绍

基于 Vue 3 + Vite + TypeScript + Vue Router + Pinia + Axios + Element Plus + Sass 构建的后台管理系统模板，为开发者提供快速搭建管理后台的起点。

### 技术栈

- **Vue 3** - 渐进式前端框架
- **Vite** - 下一代前端构建工具
- **TypeScript** - JavaScript 的超集
- **Vue Router** - 路由管理
- **Pinia** - 状态管理
- **Axios** - HTTP 请求库
- **Element Plus** - UI 组件库
- **Sass** - CSS 预处理器

### 项目结构

```
src/
├── api/                 # API 接口定义
│   ├── ai.ts
│   └── user.ts
├── assets/              # 静态资源
│   ├── css/            # 样式文件
│   ├── font/           # 字体文件
│   ├── iconfont/       # 图标字体
│   └── imgs/           # 图片资源
├── bus/                # 事件总线 (eventBus)
├── layout/             # 布局组件
│   ├── headerLayout.vue
│   ├── layout.vue
│   ├── menuItem.vue
│   ├── pageTabs.vue
│   ├── setting.vue
│   └── sidebarLayout.vue
├── request/            # 网络请求封装
├── router/             # 路由配置
├── store/              # 状态管理 (Pinia)
├── utils/              # 工具函数
└── views/              # 页面视图
    ├── 404/
    ├── aiChat/
    ├── guide/
    ├── home/
    ├── inventory/
    ├── login/
    ├── permission/
    ├── role/
    └── user/
```

## 快速开始

### 安装依赖

```sh
pnpm install
```

### 启动项目

```sh
pnpm run dev
```

### 构建生产版本

```sh
pnpm run build
```

## 核心功能

### 1. 网络请求封装

基于 Axios 封装，提供简洁易用的 API，支持加载动画、错误提示、请求取消等功能。

```typescript
interface ConfigType extends AxiosRequestConfig {
  // 是否显示加载动画
  loading?: boolean
  // 是否显示错误提示
  showError?: boolean
  // 是否取消相同历史未完成接口
  cancelSame?: boolean
}

// 发起 POST 请求
const testAjax = $ajax.post('/user/getUserInfo', {}, { 
  cancelSame: true, 
  showError: true 
}).then(res => {
  console.log(res);
})

// 取消网络请求
abortAjax(testAjax)
```

### 2. 事件总线 (EventBus)

提供组件间通信能力，方便跨组件数据传递。

```typescript
import { $bus } from '@/bus'

// 发送事件
$bus.emit('eventName', data)

// 监听事件
$bus.on('eventName', (data) => {
  console.log(data)
})

// 移除事件
$bus.off('eventName')
```

### 3. 动态路由与菜单

菜单路由基于路由自动渲染，配置简单，扩展性强。

## 开发规范 (重要)

1. **文件命名**：使用小驼峰命名法
   - 示例：`home.vue`、`systemUser.vue`

2. **路由命名**：路由组件文件名必须与路由 `name` 一致，否则 `keepAlive: true` 不生效

3. **name 唯一性**：路由中的 `name` 必须唯一，且须渲染的路由 `name` 必填

4. **接口返回格式**：后端接口统一返回以下格式，如返回格式不同请修改网络请求封装

```json
{
  "code": 200,
  "data": {},
  "message": "success"
}
```

## 许可证

MIT License