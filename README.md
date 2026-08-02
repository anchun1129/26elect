# 违规电动车识别小程序 · 团队开发手册

> **环境 ID**
> **AppID**：`wxc17854521997dc1c`

---

## 一、起步：环境与工具

### 1. 必须安装的软件（可能会有链接打不开的情况，可以直接搜官网）
- [微信开发者工具](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)（最新稳定版）
- [Node.js](https://nodejs.org/)（≥14，建议 LTS）
- [Git](https://git-scm.com/)
- 注册github账户

### 2. 克隆项目（从github上克隆到本地）

### 3. 用微信开发者工具打开项目
启动微信开发者工具，扫码登录。

点击 “导入项目”，选择刚才克隆下来的文件夹。

填入 AppID（已在 project.config.json 中，一般自动识别）。

后端服务选择 “微信云开发”。

点击“确定”，进入项目。

### 4. 安装前端依赖（居民端 / 管理员端 / UI 同学必做）
在终端中进入项目内的 miniprogram 目录：

bash
cd miniprogram
npm install
然后回到微信开发者工具，点击菜单栏 “工具” → “构建 npm”，等待提示“构建完成”。

云函数同学（AI、后端）如果只写云函数，可以暂时跳过这步。

### 5. 确认云开发环境
点击开发者工具顶部的 “云开发” 按钮，能正常打开云开发控制台表示环境已连接。

如果提示“环境未找到”，请在 miniprogram/app.js 中将 env 的值改为正确的环境 ID。

## 二、项目结构说明
text
ebike-detection/
├── miniprogram/                 # 小程序前端（页面、组件、样式）
│   ├── pages/                   # 页面目录
│   ├── components/              # 公共组件
│   ├── app.js / .json / .wxss   # 全局入口与配置
│   └── ...
├── cloudfunctions/              # 所有云函数
│   ├── login/                   # 示例：用户登录
│   ├── aiAudit/                 # AI 审核
│   └── ...
├── project.config.json          # 项目配置（勿删）
├── .gitignore                   # Git 忽略规则
└── README.md                    # 你正在看的文档
## 三、日常开发流程
### 1. 开工前：拉取最新代码
bash
git checkout main
git pull origin main
### 2. 创建你的开发分支（首次）
分支命名建议：feature/名字缩写-功能

feature/wyx-ai

bash
git checkout -b feature/你的分支名
### 3. 开始写代码
前端：在 miniprogram/pages 下编写页面，可使用 Vant Weapp 组件（用法见后文）。

云函数：在 cloudfunctions/ 下新建或修改云函数。

注意：每次修改云函数后，需右键该云函数文件夹 → “上传并部署：云端安装依赖” 才能生效。

### 4. 提交代码
bash
git add .
git commit -m "简要描述你的改动"
git push -u origin feature/你的分支名
每天至少提交一次，避免代码丢失。

### 5. 发起 Pull Request（合并到 main）(后续步骤暂时不需要)
在 GitHub 页面上切换到你的分支，点击 “Compare & pull request”。

填写改了什么、测试情况。

指定一位管理员（项目经理或后端负责人）作为 reviewer。

审核通过后由管理员 Merge。

## 四、各角色开发指引（部分，具体看实际操作）
🖥️ 前端同学（居民端 / 工作人员端）
所有页面使用 Vant Weapp 组件库，文档：https://vant-contrib.gitee.io/vant-weapp/

在 app.json 中按需注册组件：

json
"usingComponents": {
  "van-button": "@vant/weapp/button/index"
}
调试时点击“预览”生成二维码，手机扫码测试；真机调试 可查看手机端日志。

☁️ 后端同学（云开发）
数据库集合已创建：users、reports，字段设计见内部文档。

云函数模板：

javascript
exports.main = async (event, context) => {
  const { OPENID } = cloud.getWXContext()
  return { openid: OPENID }
}
所有业务云函数需校验权限（如只能查自己的记录）。

🤖 AI 同学
已在云函数中封装百度图像识别 API，见 cloudfunctions/aiAudit/。

需要 API Key 和 Secret Key（私密，不要上传 Git）。

测试方式：在云开发控制台 → 云函数 → 选择 aiAudit → 填写测试参数 {"fileID": "云存储图片ID"}。

🎨 UI / Web 看板同学
看板为纯静态页面，位于 web-dashboard/ 目录（或约定的位置）。

使用云开发 Web SDK（CDN）和 Chart.js。

本地调试用 Live Server 打开 index.html。

🧪 测试同学
在 docs/测试用例.md 中维护测试场景。

每次有新功能部署，在“真机调试”模式下逐条验证。

Bug 直接提 GitHub Issue，写清复现步骤。

## 五、常见问题
Q：提示“未找到云开发环境”怎么办？
A：检查 miniprogram/app.js 中 env 是否填对了环境 ID，并确保在工具顶部已切换至该环境。

Q：Vant 组件样式不生效？
A：必须执行过 npm install 并点击 “工具 → 构建 npm”，且模拟器重启一下。

Q：云函数部署失败？
A：确认云函数目录下有自己的 package.json，并在对应目录里 npm install 了依赖（如 axios）。然后右键云函数文件夹 → “上传并部署：云端安装依赖”。

Q：如何添加新成员？
A：管理员登录 微信公众平台，在“成员管理”中添加微信号。同时把 GitHub 仓库设为公开或添加协作者。

## 六、日常总结

遇到了什么阻碍？
更新进度

待更新

260802
