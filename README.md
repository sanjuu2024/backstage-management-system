# 硅谷甄选后台管理系统 (Backstage Management System)（前端项目）

## （一）📚 简介

### 1. 项目内容

一个基于 Vue 3 + TypeScript + Element Plus 构建的现代化后台管理系统，提供完整的权限管理、商品管理和数据可视化功能。

### 2. 说明

- 本项目是根据 b站视频：[【尚硅谷Vue项目实战硅谷甄选，vue3项目+TypeScript前端项目一套通关】](https://www.bilibili.com/video/BV1Xh411V7b5/?share_source=copy_web&vd_source=7d10c60901f43a08b48ab385dbceea41) 敲出来的前端练习项目，感谢尚硅谷和贾成豪老师免费提供给大家的前端学习视频\_(:з)∠)\_。
- 不过官方接口貌似~~挂了~~不太好用，服务端我使用的是：[这位大佬部署的后端（github仓库链接）](https://github.com/WangJian3306/vue3_admin_backend)，接口完全符合视频教学内容，感谢大佬提供的服务端接口(´▽`ʃ♡ƪ)（建议用wsl2+docker部署，很方便。）
- 以及项目与视频的差别：最后的按钮权限根据视频需要手动一个个添加`v-has="xxx"`的指令，我测试了一下按钮权限功能能实现就没再全部添加。

<br/>

## （二）✨ 项目特性

- 🚀 **技术栈前沿**: Vue 3 + TypeScript + Vite + Pinia
- 🎨 **UI 组件丰富**: Element Plus 组件库，支持暗黑模式
- 🔐 **权限管理完善**: 基于 RBAC 的角色权限控制，支持菜单权限和按钮权限
- 📊 **数据可视化**: 集成 ECharts 图表库，提供丰富的数据展示
- 🏗️ **架构清晰**: 模块化设计，代码结构清晰易维护
- 📱 **响应式设计**: 支持多端适配
- 🔧 **开发体验优秀**: 热重载、ESLint、Prettier、Husky 等开发工具完善

<br/>

## （三）📦 主要依赖

- **Vue 3**: 渐进式 JavaScript 框架
- **TypeScript**: JavaScript 的超集，提供类型安全
- **Element Plus**: Vue 3 的桌面端组件库
- **Vue Router**: Vue.js 官方路由管理器
- **Pinia**: Vue 的状态管理库
- **Axios**: 基于 Promise 的 HTTP 库
- **ECharts**: 数据可视化图表库
- **Vite**: 下一代前端构建工具

<br/>

## （四）🚀 快速开始

#### 1. 环境要求

- `Node.js` >= 16.0.0（网络搜索下载安装）
- `pnpm` >= 8.0.0（安装好 `node.js` 之后运行 `npm i -g pnpm` 来安装 `pnpm` 包即可）

<br/>

#### 2. 安装依赖

```bash
# 使用 pnpm 安装依赖
pnpm install
```

<br/>

#### 3. 开发模式

```bash
# 启动开发服务器
pnpm run dev
```

然后浏览器访问`http://localhost:5173`即可。（5173是vite默认端口，实际情况可能有变）

<br/>

#### 4. 构建部署

项目有部分声明但未使用的变量，如el-table中的`<template #={row,idx}>` 的 `idx`，可能导致直接`pnpm run build`会警告、打包失败。

- 建议改为使用该命令：`pnpm vite build --mode production`。
- 或者手动修改掉eslint所有警告。（基本都是声明但未使用导致的警告）
  ~~开发不规范，eslint两行泪~~

```bash
# 测试环境构建
pnpm build:test

# 生产环境构建
pnpm build:pro
```

<br/>

## （五）📁 项目结构

```
src/
├── api/                   # API 接口管理
│   ├── acl/               # 权限相关接口
│   ├── product/           # 商品相关接口
│   └── user/              # 用户相关接口
├── assets/                # 静态资源
│   ├── icons/             # 图标资源
│   ├── images/            # 图片资源
│   └── styles/            # 样式文件
├── components/            # 全局组件
│   ├── Category/          # 分类组件
│   ├── Pagination/        # 分页组件
│   └── SvgIcon/           # SVG 图标组件
├── directive/             # 自定义指令
├── layout/                # 布局组件
├── router/                # 路由配置
├── store/                 # 状态管理
├── utils/                 # 工具函数
└── views/                 # 页面组件
    ├── acl/               # 权限管理页面
    ├── home/              # 首页
    ├── login/             # 登录页面
    ├── product/           # 商品管理页面
    └── screen/            # 数据大屏
```

<br/>

## （六）🎯 核心功能模块

### 1. 用户认证与权限管理

- **登录认证**: 支持用户名密码登录，JWT Token 认证
- **角色管理**: 支持多角色分配，角色权限动态配置
- **菜单权限**: 基于用户角色动态生成菜单
- **按钮权限**: 细粒度的按钮级别权限控制
- **路由守卫**: 自动根据权限控制页面访问

### 2. 商品管理系统

- **品牌管理**: 品牌信息的增删改查，支持品牌 LOGO 上传
- **属性管理**: 商品属性的分类管理，支持属性值配置
- **SPU 管理**: 标准产品单元管理，商品基础信息维护
- **SKU 管理**: 库存单元管理，具体商品规格和库存控制

### 3. 数据可视化大屏

- **实时数据展示**: 基于 ECharts 的数据可视化
- **多图表类型**: 柱状图、折线图、饼图、地图等
- **响应式布局**: 适配不同屏幕尺寸的数据大屏

### 4. 系统管理

- **用户管理**: 用户信息管理，账号状态控制
- **角色分配**: 用户角色分配和权限设置
- **菜单管理**: 系统菜单的动态配置

<br/>

## （七）🛠️ 开发规范

#### 1. 代码规范

- ESLint + Prettier 代码格式化
- Husky + Commitlint 提交规范
- TypeScript 类型检查

#### 2. 命名规范

- 组件名使用 PascalCase
- 文件名使用 kebab-case
- 变量名使用 camelCase

<br/>

## （八）ℹ️ 版本信息

### v1.0.0

根据学习视频实现了硅谷甄选平台的所有功能，略有删改。

### v2.0.0

修改了API前缀（vite配置文件），使之能作为名为app的项目部署在tomcat上。
此外解决了全局前置路由守卫跳转部分路径缺失的问题，修改了生产环境配置文件等。

<br/>

## 最后

如有问题或建议，欢迎提交 Issue 或 Pull Request。

> 以及如果有打算跟着这个视频学习该项目类型的朋友，以下是个人一点建议：<br/>
> （1）​前面一些工具的部署可以使用ai帮忙写配置项（视频版本和现在的一些配置写法不是特别匹配）；<br/>
> （2）官方接口不太好用，我自己是用的这个大佬的后端（github上）：WangJian3306/vue3_admin_backend，（wsl2+docker部署的）；<br/>
> ​（3）关于命名规范，老师有一些不算特别规范，比如自定义事件其实建议使用kebab-case命名（羊肉串命名，比如get-toy），建议可以网络搜索 / ai询问vue项目各类命名规范（路由命名、文件命名、自定义事件命名等）再开始写项目；

<br/>

## 附录

### （1）部署Tomcat相关

> 另外事先说明，项目并没有处理部署之后，服务端返回图片为相对路径的url问题。（因为真实生产环境中后端返回绝对路径偏多）

如果要把该项目部署到Tomcat上，请使用该项目 v2.0.0 以上 release 版本。

<br/>

#### tomcat版本

tomcat 10.0（配置文件与 tomcat8 和 tomcat9 都不兼容）

<br/>

#### tomcat配置文件

- `tomcat安装目录/conf/Catalina/localhost/app.xml`

```xml
<?xml version="1.0" encoding="UTF-8"?>
<Context docBase="...\app(请替换为该项目的部署目录)" reloadable="true">
</Context>
```

- `app(项目部署目录)/WEB_INF/web.xml`

```xml
<?xml version="1.0" encoding="UTF-8"?>
<web-app xmlns="http://xmlns.jcp.org/xml/ns/javaee"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://xmlns.jcp.org/xml/ns/javaee
         http://xmlns.jcp.org/xml/ns/javaee/web-app_4_0.xsd"
         version="4.0">

  <display-name>Vue App</display-name>

  <!-- Vue SPA 支持 - 所有404错误重定向到index.html -->
  <error-page>
    <error-code>404</error-code>
    <location>/index.html</location>
  </error-page>

  <welcome-file-list>
    <welcome-file>index.html</welcome-file>
  </welcome-file-list>

  <!-- 防止直接访问WEB-INF目录 -->
  <security-constraint>
    <web-resource-collection>
      <web-resource-name>Forbidden</web-resource-name>
      <url-pattern>/WEB-INF/*</url-pattern>
    </web-resource-collection>
    <auth-constraint/>
  </security-constraint>
</web-app>
```

- `app(项目部署目录)/WEB_INF/rewrite.config`

```
RewriteCond %{REQUEST_URI} ^/api/(.*)$
RewriteRule ^/api/(.*)$ http://127.0.0.1:10086/api/$1 [P,L]
```

<br/>

#### 部署步骤

##### 1.下载和安装tomcat10

##### 2. 打包项目

项目根目录下运行：

```bash
pnpm vite build --mode production
```

##### 3. 把生成的dist目录改名为app

##### 4. 在app目录下新增WEB-INF文件夹，并放入上面配置文件中的`web.xml`和`rewrite.config`

##### 5. 在tomcat的安装目录下，找到`conf/Catalina/localhost`，然后在其中创建`app.xml`，内容同上方配置文件

##### 6. 运行tomcat安装目录下的`bin/startup.bat`

##### 7. 浏览器地址栏输入`http://localhost:8080/app/`即可访问
