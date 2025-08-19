# 开发工具配置指南

## 1. 基础开发环境

### VS Code 配置
```json
// settings.json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "emmet.includeLanguages": {
    "javascript": "javascriptreact"
  }
}
```

### 必装扩展
- Live Server (实时预览)
- Prettier (代码格式化)
- ESLint (代码检查)
- Auto Rename Tag (标签重命名)
- Bracket Pair Colorizer (括号配色)

## 2. 项目结构初始化

### 创建项目目录
```bash
mkdir anti-fraud-center
cd anti-fraud-center
mkdir src css js assets docs tests
```

### 基础文件创建
```bash
touch index.html
touch css/style.css
touch js/main.js
touch js/detector.js
touch js/ai-service.js
touch README.md
```

## 3. Git 版本控制

### 初始化仓库
```bash
git init
git add .
git commit -m "Initial commit"
```

### .gitignore 配置
```
node_modules/
.env
*.log
dist/
.DS_Store
```

## 4. 包管理器配置

### package.json
```json
{
  "name": "anti-fraud-center",
  "version": "1.0.0",
  "scripts": {
    "start": "live-server",
    "build": "webpack --mode production",
    "test": "jest"
  },
  "devDependencies": {
    "live-server": "^1.2.2",
    "webpack": "^5.0.0",
    "jest": "^29.0.0"
  }
}
```

## 5. API 服务配置

### 环境变量 (.env)
```
DEEPSEEK_API_KEY=your_api_key_here
DEEPSEEK_BASE_URL=https://api.deepseek.com/v1
NODE_ENV=development
```

### API 服务封装
```javascript
// js/api-config.js
const API_CONFIG = {
  DEEPSEEK_KEY: 'your_key',
  BASE_URL: 'https://api.deepseek.com/v1',
  TIMEOUT: 10000
};
```

## 6. 测试环境配置

### Jest 配置
```json
// jest.config.js
{
  "testEnvironment": "jsdom",
  "setupFilesAfterEnv": ["<rootDir>/tests/setup.js"],
  "collectCoverageFrom": [
    "js/**/*.js",
    "!js/vendor/**"
  ]
}
```

## 7. 构建工具配置

### Webpack 基础配置
```javascript
// webpack.config.js
module.exports = {
  entry: './js/main.js',
  output: {
    path: __dirname + '/dist',
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  }
};
```

## 8. 代码质量工具

### ESLint 配置
```json
// .eslintrc.json
{
  "env": {
    "browser": true,
    "es2021": true
  },
  "extends": ["eslint:recommended"],
  "rules": {
    "no-unused-vars": "warn",
    "no-console": "off"
  }
}
```

### Prettier 配置
```json
// .prettierrc
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2
}
```

## 9. 浏览器扩展开发

### manifest.json 模板
```json
{
  "manifest_version": 3,
  "name": "反诈骗防护助手",
  "version": "1.0.0",
  "permissions": ["activeTab", "storage"],
  "content_scripts": [{
    "matches": ["<all_urls>"],
    "js": ["content.js"]
  }],
  "action": {
    "default_popup": "popup.html"
  }
}
```

## 10. 移动端开发准备

### React Native 环境
```bash
npm install -g @react-native-community/cli
npx react-native init AntifraudApp
```

### Flutter 环境
```bash
flutter create antifraud_app
cd antifraud_app
flutter run
```

## 11. 部署工具配置

### Docker 配置
```dockerfile
# Dockerfile
FROM nginx:alpine
COPY . /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### GitHub Actions
```yaml
# .github/workflows/deploy.yml
name: Deploy
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to server
        run: echo "Deploying..."
```

## 12. 监控和分析

### 错误监控
```javascript
// js/error-tracking.js
window.addEventListener('error', function(e) {
  console.error('Error caught:', e.error);
  // 发送错误报告到服务器
});
```

### 用户行为分析
```javascript
// js/analytics.js
function trackEvent(action, category) {
  // 发送分析数据
  console.log(`Event: ${action} in ${category}`);
}
```

## 快速启动命令

```bash
# 1. 克隆项目
git clone <repository-url>
cd anti-fraud-center

# 2. 安装依赖
npm install

# 3. 启动开发服务器
npm start

# 4. 运行测试
npm test

# 5. 构建生产版本
npm run build
```