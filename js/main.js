// 全能反诈骗防护中心 - 主要JavaScript文件

// 全局变量
let detectionCount = 0;
let riskCount = 0;
let safetyScore = 100;

// 清除旧的localStorage数据并重置安全评分
localStorage.removeItem('userStats');
safetyScore = 100;

// DOM加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// 初始化应用
function initializeApp() {
    setupTabSwitching();
    setupEventListeners();
    loadSavedStats();
    
    // 初始化新模块
    initializeNewModules();
    
    // 初始化图表
    initializeCharts();
    
    // 显示欢迎消息
    setTimeout(() => {
        showNotification('🛡️ 防护系统已启动，为您提供全方位保护', 'success');
    }, 500);
    
    // 检查是否是首次访问
    if (!localStorage.getItem('hasVisited')) {
        showWelcomeGuide();
        localStorage.setItem('hasVisited', 'true');
    }
}

// 显示欢迎指南
function showWelcomeGuide() {
    setTimeout(() => {
        showNotification('👋 欢迎使用反诈骗防护中心！点击各个标签页探索功能', 'info');
    }, 2000);
    
    setTimeout(() => {
        showNotification('💡 提示：使用Ctrl+数字键可快速切换标签页', 'info');
    }, 4000);
}

// 初始化图表
function initializeCharts() {
    if (typeof chartsModule !== 'undefined') {
        const analysisTab = document.querySelector('[data-tab="analysis"]');
        if (analysisTab) {
            analysisTab.addEventListener('click', () => {
                setTimeout(() => {
                    chartsModule.renderTrendChart('trendChart');
                    chartsModule.renderPieChart('pieChart');
                }, 100);
            });
        }
    }
}

// 初始化新模块
function initializeNewModules() {
    // 初始化教育模块
    if (typeof educationModule !== 'undefined') {
        const educationTab = document.querySelector('[data-tab="education"]');
        if (educationTab) {
            educationTab.addEventListener('click', () => {
                setTimeout(() => educationModule.displayKnowledge(), 100);
            });
        }
        // 如果当前就在教育标签页，立即显示内容
        if (document.getElementById('education').classList.contains('active')) {
            educationModule.displayKnowledge();
        }
    }
    
    // 初始化举报系统
    if (typeof reportSystem !== 'undefined') {
        const reportTab = document.querySelector('[data-tab="report"]');
        if (reportTab) {
            reportTab.addEventListener('click', () => {
                setTimeout(() => reportSystem.showReportForm(), 100);
            });
        }
    }
}

// 设置标签页切换功能
function setupTabSwitching() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab');
            
            // 移除所有活动状态
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => {
                content.classList.remove('active');
                content.style.opacity = '0';
            });
            
            // 添加活动状态
            this.classList.add('active');
            const targetContent = document.getElementById(targetTab);
            targetContent.classList.add('active');
            
            // 添加淡入效果
            setTimeout(() => {
                targetContent.style.opacity = '1';
                targetContent.classList.add('fade-in');
                
                // 初始化对应模块内容
                if (targetTab === 'education' && typeof educationModule !== 'undefined') {
                    educationModule.displayKnowledge();
                }
                if (targetTab === 'report' && typeof reportSystem !== 'undefined') {
                    reportSystem.showReportForm();
                }
            }, 50);
            
            // 记录当前标签页
            localStorage.setItem('currentTab', targetTab);
        });
    });
    
    // 恢复上次访问的标签页
    const savedTab = localStorage.getItem('currentTab');
    if (savedTab && document.getElementById(savedTab)) {
        const savedButton = document.querySelector(`[data-tab="${savedTab}"]`);
        if (savedButton) {
            savedButton.click();
        }
    }
}

// 设置事件监听器
function setupEventListeners() {
    // 智能分析按钮
    const analyzeBtn = document.getElementById('analyzeBtn');
    if (analyzeBtn) {
        analyzeBtn.addEventListener('click', analyzeContent);
    }

    // 紧急拦截按钮
    const emergencyBtn = document.getElementById('emergencyBtn');
    if (emergencyBtn) {
        emergencyBtn.addEventListener('click', emergencyBlock);
    }

    // 启动监控按钮
    const startMonitorBtn = document.getElementById('startMonitorBtn');
    if (startMonitorBtn) {
        startMonitorBtn.addEventListener('click', startMonitoring);
    }

    // 聊天发送按钮
    const sendBtn = document.getElementById('sendBtn');
    if (sendBtn) {
        sendBtn.addEventListener('click', sendChatMessage);
    }

    // 聊天输入框回车事件
    const chatInput = document.getElementById('chatInput');
    if (chatInput) {
        chatInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendChatMessage();
            }
        });
    }

    // 举报表单提交
    const reportForm = document.querySelector('.report-form');
    if (reportForm) {
        reportForm.addEventListener('submit', function(e) {
            e.preventDefault();
            submitReport();
        });
    }
    
    // 教育模块按钮
    setupEducationButtons();
    
    // 工具按钮
    setupToolButtons();
    
    // 紧急求助按钮
    setupEmergencyButtons();
    
    // 键盘导航支持
    setupKeyboardNavigation();
}

// 设置教育模块按钮
function setupEducationButtons() {
    const topicButtons = document.querySelectorAll('.topic-buttons .btn');
    topicButtons.forEach(button => {
        button.addEventListener('click', function() {
            const topic = this.textContent;
            loadEducationTopic(topic);
        });
    });
}

// 设置工具按钮
function setupToolButtons() {
    const toolButtons = document.querySelectorAll('.tool-buttons .btn');
    toolButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tool = this.textContent;
            activateTool(tool);
        });
    });
}

// 设置紧急求助按钮
function setupEmergencyButtons() {
    const emergencyButtons = document.querySelectorAll('.emergency-buttons .btn');
    emergencyButtons.forEach(button => {
        button.addEventListener('click', function() {
            const service = this.textContent;
            callEmergencyService(service);
        });
    });
}

// 键盘导航支持
function setupKeyboardNavigation() {
    document.addEventListener('keydown', function(e) {
        // Ctrl + 数字键切换标签页
        if (e.ctrlKey && e.key >= '1' && e.key <= '6') {
            e.preventDefault();
            const tabIndex = parseInt(e.key) - 1;
            const tabButtons = document.querySelectorAll('.tab-btn');
            if (tabButtons[tabIndex]) {
                tabButtons[tabIndex].click();
            }
        }
        
        // ESC键关闭通知
        if (e.key === 'Escape') {
            const notifications = document.querySelectorAll('.notification');
            notifications.forEach(notification => {
                notification.remove();
            });
        }
    });
}

// 内容分析功能
function analyzeContent() {
    const contentInput = document.getElementById('contentInput');
    const content = contentInput.value.trim();
    
    if (!content) {
        showNotification('请输入要分析的内容', 'warning');
        contentInput.focus();
        return;
    }

    // 更新统计数据
    detectionCount++;
    updateStats();

    // 显示分析中状态
    const analyzeBtn = document.getElementById('analyzeBtn');
    const originalText = analyzeBtn.textContent;
    analyzeBtn.textContent = '分析中...';
    analyzeBtn.disabled = true;
    analyzeBtn.classList.add('loading');

    // 添加分析进度效果
    let progress = 0;
    const progressInterval = setInterval(() => {
        progress += 10;
        analyzeBtn.textContent = `分析中... ${progress}%`;
        if (progress >= 100) {
            clearInterval(progressInterval);
        }
    }, 150);

    // 模拟分析过程
    setTimeout(() => {
        clearInterval(progressInterval);
        const riskLevel = calculateRiskLevel(content);
        displayRiskResult(riskLevel, content);
        
        // 恢复按钮状态
        analyzeBtn.textContent = originalText;
        analyzeBtn.disabled = false;
        analyzeBtn.classList.remove('loading');
        
        // 保存分析历史
        saveAnalysisHistory(content, riskLevel);
    }, 1500);
}

// 计算风险等级（使用新的关键词检测引擎）
function calculateRiskLevel(content) {
    const result = keywordDetector.detectRisk(content);
    
    return {
        score: Math.min(result.totalScore, 100),
        types: result.detectedTypes.map(type => type.name),
        riskLevel: result.riskLevel,
        matchedKeywords: result.matchedKeywords,
        suggestions: result.suggestions,
        detailedTypes: result.detectedTypes
    };
}

// 显示风险分析结果
function displayRiskResult(riskData, content) {
    const resultBox = document.getElementById('riskResult');
    const riskFill = document.getElementById('riskFill');
    const riskDetails = document.getElementById('riskDetails');

    // 显示结果区域
    resultBox.classList.remove('hidden');

    // 设置风险条颜色和宽度
    riskFill.style.width = riskData.score + '%';
    
    if (riskData.score >= 70) {
        riskFill.style.background = '#e74c3c';
        riskCount++;
        showNotification('检测到高风险内容！', 'error');
        if (typeof voiceAlerts !== 'undefined') voiceAlerts.alertRisk('high');
    } else if (riskData.score >= 30) {
        riskFill.style.background = '#f39c12';
        riskCount++;
        showNotification('检测到可疑内容', 'warning');
        if (typeof voiceAlerts !== 'undefined') voiceAlerts.alertRisk('medium');
    } else {
        riskFill.style.background = '#27ae60';
        showNotification('内容相对安全', 'success');
        if (typeof voiceAlerts !== 'undefined') voiceAlerts.alertRisk('low');
    }
    
    // 安全评分保持稳定，不再根据检测结果变化

    // 更新统计数据
    updateStats();

    // 显示详细信息
    let riskLevel = '';
    let suggestion = '';

    if (riskData.score >= 70) {
        riskLevel = '🚨 高风险';
        suggestion = '疑似诈骗内容，建议立即停止交流并举报';
    } else if (riskData.score >= 30) {
        riskLevel = '⚠️ 中风险';
        suggestion = '存在可疑内容，请谨慎对待';
    } else {
        riskLevel = '✅ 低风险';
        suggestion = '内容相对安全，但仍需保持警惕';
    }

    riskDetails.innerHTML = `
        <p><strong>风险等级:</strong> ${riskLevel} (${riskData.score}%)</p>
        <p><strong>安全建议:</strong> ${suggestion}</p>
        <p><strong>检测到的风险类型:</strong> ${riskData.types.join(', ') || '无明显风险'}</p>
        <p><strong>分析时间:</strong> ${new Date().toLocaleString()}</p>
    `;
}

// 保存分析历史
function saveAnalysisHistory(content, riskLevel) {
    const history = JSON.parse(localStorage.getItem('analysisHistory') || '[]');
    history.unshift({
        content: content.substring(0, 100) + (content.length > 100 ? '...' : ''),
        riskLevel: riskLevel.score,
        timestamp: new Date().toISOString(),
        types: riskLevel.types
    });
    
    // 只保留最近50条记录
    if (history.length > 50) {
        history.splice(50);
    }
    
    localStorage.setItem('analysisHistory', JSON.stringify(history));
}

// 紧急拦截功能
function emergencyBlock() {
    const contentInput = document.getElementById('contentInput');
    contentInput.value = '[内容已被安全系统紧急拦截]';
    contentInput.disabled = true;
    
    showNotification('紧急拦截已启动！内容已被屏蔽', 'error');
    
    // 3秒后恢复
    setTimeout(() => {
        contentInput.disabled = false;
        contentInput.value = '';
    }, 3000);
}

// 启动监控功能
function startMonitoring() {
    const monitorStatus = document.getElementById('monitorStatus');
    const startMonitorBtn = document.getElementById('startMonitorBtn');
    
    monitorStatus.classList.remove('hidden');
    startMonitorBtn.textContent = '监控运行中...';
    startMonitorBtn.disabled = true;
    
    showNotification('全面监控已启动，正在保护您的安全', 'success');
}

// 发送聊天消息
function sendChatMessage() {
    const chatInput = document.getElementById('chatInput');
    const chatHistory = document.getElementById('chatHistory');
    const message = chatInput.value.trim();
    
    if (!message) {
        showNotification('请输入消息内容', 'warning');
        return;
    }

    // 添加用户消息
    addChatMessage('用户', message, 'user');
    chatInput.value = '';

    // 模拟AI回复
    setTimeout(() => {
        const aiResponse = generateAIResponse(message);
        addChatMessage('AI咨询师', aiResponse, 'ai');
    }, 1000);
}

// 添加聊天消息到历史记录
function addChatMessage(sender, message, type) {
    const chatHistory = document.getElementById('chatHistory');
    const messageDiv = document.createElement('div');
    messageDiv.className = `chat-message ${type}`;
    messageDiv.innerHTML = `
        <strong>${sender}:</strong> ${message}
        <small style="display: block; color: #666; font-size: 0.8em; margin-top: 5px;">
            ${new Date().toLocaleTimeString()}
        </small>
    `;
    
    chatHistory.appendChild(messageDiv);
    chatHistory.scrollTop = chatHistory.scrollHeight;
}

// 生成AI回复
function generateAIResponse(userMessage) {
    const responses = {
        '占卜': '我理解您对未来的好奇，但占卜并没有科学依据。建议您通过努力和规划来创造美好的未来。',
        '算命': '算命是一种迷信活动，可能被不法分子利用进行诈骗。相信自己的能力，通过学习和努力改变命运。',
        '投资': '投资需要谨慎，建议选择正规的金融机构。警惕任何承诺高收益、低风险的投资项目。',
        '理财': '理财要选择正规渠道，不要相信网络上的高收益理财产品。如需投资建议，请咨询专业的理财顾问。',
        '困扰': '每个人都会遇到困扰，这很正常。建议您与信任的朋友交流，或寻求专业心理咨询师的帮助。',
        '迷茫': '人生迷茫是成长的一部分。建议制定短期目标，逐步行动，同时可以寻求专业指导。'
    };

    // 检查关键词并返回相应回复
    for (const [keyword, response] of Object.entries(responses)) {
        if (userMessage.includes(keyword)) {
            return response;
        }
    }

    // 默认回复
    return '感谢您的信任。如果您遇到任何可疑的诈骗信息，请保持警惕并及时举报。如需专业帮助，建议联系相关部门或心理咨询师。';
}

// 提交举报
function submitReport() {
    showNotification('举报信息已提交，感谢您的配合！我们会尽快处理。', 'success');
    
    // 清空表单
    const form = document.querySelector('.report-form');
    form.reset();
}

// 加载教育主题
function loadEducationTopic(topic) {
    const topics = {
        '占卜算命诈骗': {
            content: '占卜算命诈骗常见手段：声称能预测未来、收取高额费用、制造焦虑情绪、推销转运产品。',
            tips: ['不要相信任何预测未来的说法', '警惕要求付费的占卜服务', '遇到困扰寻求专业心理咨询']
        },
        '投资理财诈骗': {
            content: '投资理财诈骗特点：承诺高收益低风险、虚假投资平台、内幕消息诱导、要求追加投资。',
            tips: ['选择正规金融机构', '不相信保证收益的投资', '投资前充分了解风险']
        },
        '情感诈骗': {
            content: '情感诈骗套路：虚假身份交友、快速建立感情、编造困难要钱、拒绝见面通话。',
            tips: ['网络交友要谨慎', '不要轻易转账给网友', '见面前核实身份']
        },
        '身份冒充诈骗': {
            content: '身份冒充诈骗形式：冒充公检法、银行客服、快递员、亲友等要求转账或提供信息。',
            tips: ['官方不会电话要求转账', '遇到可疑电话挂断核实', '保护个人信息安全']
        }
    };
    
    const topicData = topics[topic];
    if (topicData) {
        showNotification(`正在学习：${topic}`, 'info');
        console.log('教育内容:', topicData);
    }
}

// 激活工具
function activateTool(toolName) {
    const tools = {
        '安装浏览器防护插件': '浏览器防护插件安装包已准备就绪',
        '下载手机防护APP': '手机防护APP下载链接已生成',
        '设置短信拦截': '短信拦截功能已配置',
        '配置来电识别': '来电识别服务已启用'
    };
    
    const message = tools[toolName] || '工具激活成功';
    showNotification(message, 'success');
}

// 紧急求助服务
function callEmergencyService(service) {
    const services = {
        '报警 110': '正在为您拨打110报警电话',
        '网络举报 12321': '正在连接12321网络举报中心',
        '反诈专线 96110': '正在拨打96110反诈骗专线'
    };
    
    const message = services[service] || '正在连接紧急服务';
    showNotification(message, 'error');
    
    // 模拟拨打电话
    setTimeout(() => {
        showNotification('如果这是真实紧急情况，请直接拨打相应电话号码', 'warning');
    }, 2000);
}

// 更新统计数据
function updateStats() {
    // 添加数字动画效果
    animateNumber('detectionCount', detectionCount);
    animateNumber('riskCount', riskCount);
    animateNumber('safetyScore', 100); // 安全评分始终显示100
    
    // 保存统计数据（不包含安全评分）
    const stats = { detectionCount, riskCount };
    localStorage.setItem('userStats', JSON.stringify(stats));
}

// 数字动画效果
function animateNumber(elementId, targetValue) {
    const element = document.getElementById(elementId);
    const currentValue = parseInt(element.textContent) || 0;
    const increment = targetValue > currentValue ? 1 : -1;
    const duration = 500; // 动画持续时间
    const steps = Math.abs(targetValue - currentValue);
    const stepDuration = duration / Math.max(steps, 1);
    
    let current = currentValue;
    const timer = setInterval(() => {
        current += increment;
        element.textContent = current;
        
        if (current === targetValue) {
            clearInterval(timer);
            // 添加脉冲效果
            element.parentElement.classList.add('pulse');
            setTimeout(() => {
                element.parentElement.classList.remove('pulse');
            }, 1000);
        }
    }, stepDuration);
}

// 加载保存的统计数据
function loadSavedStats() {
    const savedStats = JSON.parse(localStorage.getItem('userStats') || '{}');
    if (savedStats.detectionCount !== undefined) {
        detectionCount = savedStats.detectionCount;
        riskCount = savedStats.riskCount;
        // 安全评分固定为100，不再从存储中加载
        safetyScore = 100;
        updateStats();
    }
}

// 显示通知
function showNotification(message, type = 'info') {
    const notifications = document.getElementById('notifications');
    const notification = document.createElement('div');
    
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    notifications.appendChild(notification);
    
    // 3秒后自动移除通知
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 3000);
    
    // 浏览器通知（如果用户已授权）
    if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('反诈骗提醒', {
            body: message,
            icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">🛡️</text></svg>'
        });
    }
}

// 请求通知权限
function requestNotificationPermission() {
    if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
                showNotification('浏览器通知已启用', 'success');
            }
        });
    }
}

// 页面加载时请求通知权限
window.addEventListener('load', function() {
    requestNotificationPermission();
    
    // 添加页面加载动画
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
});