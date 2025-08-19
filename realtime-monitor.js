// 实时监控系统

class RealtimeMonitor {
    constructor() {
        this.isActive = false;
        this.monitors = new Map();
        this.alertQueue = [];
        this.settings = {
            sensitivity: 'medium',
            autoBlock: false,
            soundAlert: true,
            visualAlert: true,
            logActivity: true
        };
        
        this.initializeMonitors();
    }

    // 初始化监控器
    initializeMonitors() {
        // 剪贴板监控
        this.monitors.set('clipboard', {
            name: '剪贴板监控',
            active: false,
            lastCheck: null,
            handler: this.monitorClipboard.bind(this)
        });

        // 输入框监控
        this.monitors.set('input', {
            name: '输入框监控',
            active: false,
            elements: new Set(),
            handler: this.monitorInputs.bind(this)
        });

        // 页面内容监控
        this.monitors.set('content', {
            name: '页面内容监控',
            active: false,
            observer: null,
            handler: this.monitorPageContent.bind(this)
        });

        // 网络请求监控
        this.monitors.set('network', {
            name: '网络请求监控',
            active: false,
            intercepted: new Set(),
            handler: this.monitorNetwork.bind(this)
        });
    }

    // 启动实时监控
    startMonitoring(options = {}) {
        if (this.isActive) return;

        this.isActive = true;
        this.settings = { ...this.settings, ...options };

        // 启动各个监控器
        this.startClipboardMonitor();
        this.startInputMonitor();
        this.startContentMonitor();
        this.startNetworkMonitor();

        // 创建监控面板
        this.createMonitorPanel();

        showNotification('🛡️ 实时监控已启动', 'success');
        this.logActivity('监控系统启动');
    }

    // 停止监控
    stopMonitoring() {
        if (!this.isActive) return;

        this.isActive = false;
        
        // 停止所有监控器
        this.monitors.forEach(monitor => {
            monitor.active = false;
            if (monitor.observer) {
                monitor.observer.disconnect();
            }
        });

        // 移除监控面板
        this.removeMonitorPanel();

        showNotification('监控已停止', 'info');
        this.logActivity('监控系统停止');
    }

    // 剪贴板监控
    async monitorClipboard() {
        if (!navigator.clipboard) return;

        try {
            const text = await navigator.clipboard.readText();
            if (text && text !== this.monitors.get('clipboard').lastCheck) {
                this.monitors.get('clipboard').lastCheck = text;
                this.analyzeContent(text, 'clipboard');
            }
        } catch (error) {
            // 权限不足或其他错误
        }
    }

    // 启动剪贴板监控
    startClipboardMonitor() {
        const monitor = this.monitors.get('clipboard');
        monitor.active = true;
        
        // 每2秒检查一次剪贴板
        monitor.interval = setInterval(() => {
            if (monitor.active) {
                this.monitorClipboard();
            }
        }, 2000);
    }

    // 输入框监控
    startInputMonitor() {
        const monitor = this.monitors.get('input');
        monitor.active = true;

        // 监控所有输入框
        const inputs = document.querySelectorAll('input[type="text"], textarea');
        inputs.forEach(input => {
            if (!monitor.elements.has(input)) {
                monitor.elements.add(input);
                
                let timeout;
                input.addEventListener('input', (e) => {
                    if (!monitor.active) return;
                    
                    clearTimeout(timeout);
                    timeout = setTimeout(() => {
                        if (e.target.value.length > 10) {
                            this.analyzeContent(e.target.value, 'input', e.target);
                        }
                    }, 1000);
                });
            }
        });

        // 监控动态添加的输入框
        const observer = new MutationObserver((mutations) => {
            mutations.forEach(mutation => {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === 1) {
                        const newInputs = node.querySelectorAll ? 
                            node.querySelectorAll('input[type="text"], textarea') : [];
                        newInputs.forEach(input => {
                            if (!monitor.elements.has(input)) {
                                monitor.elements.add(input);
                                // 添加监听器...
                            }
                        });
                    }
                });
            });
        });

        observer.observe(document.body, { childList: true, subtree: true });
        monitor.observer = observer;
    }

    // 页面内容监控
    startContentMonitor() {
        const monitor = this.monitors.get('content');
        monitor.active = true;

        const observer = new MutationObserver((mutations) => {
            if (!monitor.active) return;

            mutations.forEach(mutation => {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === 3) { // 文本节点
                        const text = node.textContent.trim();
                        if (text.length > 20) {
                            this.analyzeContent(text, 'content');
                        }
                    } else if (node.nodeType === 1) { // 元素节点
                        const text = node.textContent;
                        if (text && text.length > 20) {
                            this.analyzeContent(text, 'content');
                        }
                    }
                });
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
            characterData: true
        });

        monitor.observer = observer;
    }

    // 网络请求监控
    startNetworkMonitor() {
        const monitor = this.monitors.get('network');
        monitor.active = true;

        // 拦截fetch请求
        const originalFetch = window.fetch;
        window.fetch = async (...args) => {
            if (monitor.active) {
                const url = args[0];
                this.analyzeURL(url, 'network');
            }
            return originalFetch.apply(window, args);
        };

        // 拦截XMLHttpRequest
        const originalOpen = XMLHttpRequest.prototype.open;
        XMLHttpRequest.prototype.open = function(method, url) {
            if (monitor.active) {
                realtimeMonitor.analyzeURL(url, 'network');
            }
            return originalOpen.apply(this, arguments);
        };
    }

    // 分析内容
    async analyzeContent(text, source, element = null) {
        if (!text || text.length < 5) return;

        try {
            // 使用AI分析（如果可用）
            let result;
            if (aiIntegration.isOnline) {
                result = await aiIntegration.analyzeContent(text);
            } else {
                // 使用本地算法
                const basicResult = keywordDetector.detectRisk(text);
                result = advancedRiskAnalyzer.getDetailedReport(text, basicResult);
            }

            const riskScore = result.riskScore || result.summary?.finalScore || 0;

            // 根据风险等级处理
            if (riskScore > 70) {
                this.handleHighRisk(text, source, riskScore, element);
            } else if (riskScore > 40) {
                this.handleMediumRisk(text, source, riskScore, element);
            }

            // 记录活动
            if (this.settings.logActivity && riskScore > 20) {
                this.logActivity(`${source}检测到风险内容 (${riskScore}分)`);
            }

        } catch (error) {
            console.error('实时分析失败:', error);
        }
    }

    // 分析URL
    analyzeURL(url, source) {
        const suspiciousPatterns = [
            /phishing/i,
            /scam/i,
            /fake/i,
            /\d{10,}/,  // 长数字串
            /[a-z]{20,}/, // 长随机字符串
        ];

        const isSuspicious = suspiciousPatterns.some(pattern => pattern.test(url));
        
        if (isSuspicious) {
            this.handleMediumRisk(url, source, 60);
            this.logActivity(`检测到可疑URL: ${url}`);
        }
    }

    // 处理高风险
    handleHighRisk(content, source, score, element = null) {
        const alert = {
            id: Date.now(),
            level: 'high',
            content: content.substring(0, 100),
            source: source,
            score: score,
            timestamp: new Date(),
            element: element
        };

        this.alertQueue.push(alert);
        this.showRiskAlert(alert);

        // 自动阻断
        if (this.settings.autoBlock && element) {
            this.blockElement(element);
        }

        // 声音警报
        if (this.settings.soundAlert) {
            this.playAlertSound('high');
        }
    }

    // 处理中等风险
    handleMediumRisk(content, source, score, element = null) {
        const alert = {
            id: Date.now(),
            level: 'medium',
            content: content.substring(0, 100),
            source: source,
            score: score,
            timestamp: new Date(),
            element: element
        };

        this.alertQueue.push(alert);
        
        if (this.settings.visualAlert) {
            this.showRiskAlert(alert);
        }

        if (this.settings.soundAlert) {
            this.playAlertSound('medium');
        }
    }

    // 显示风险警报
    showRiskAlert(alert) {
        const alertElement = document.createElement('div');
        alertElement.className = `realtime-alert alert-${alert.level}`;
        alertElement.innerHTML = `
            <div class="alert-header">
                <span class="alert-icon">${alert.level === 'high' ? '🚨' : '⚠️'}</span>
                <span class="alert-title">实时检测警报</span>
                <button class="alert-close" onclick="this.parentElement.parentElement.remove()">×</button>
            </div>
            <div class="alert-body">
                <p><strong>来源:</strong> ${alert.source}</p>
                <p><strong>风险分数:</strong> ${alert.score}</p>
                <p><strong>内容:</strong> ${alert.content}...</p>
                <p><strong>时间:</strong> ${alert.timestamp.toLocaleTimeString()}</p>
            </div>
            <div class="alert-actions">
                <button class="btn btn-sm btn-danger" onclick="realtimeMonitor.blockContent('${alert.id}')">阻断</button>
                <button class="btn btn-sm btn-warning" onclick="realtimeMonitor.reportContent('${alert.id}')">举报</button>
                <button class="btn btn-sm btn-info" onclick="realtimeMonitor.analyzeMore('${alert.id}')">详细分析</button>
            </div>
        `;

        // 添加样式
        alertElement.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            width: 350px;
            background: white;
            border-radius: 8px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.3);
            z-index: 10000;
            animation: slideInRight 0.3s ease;
        `;

        document.body.appendChild(alertElement);

        // 自动移除
        setTimeout(() => {
            if (alertElement.parentNode) {
                alertElement.remove();
            }
        }, 10000);
    }

    // 阻断元素
    blockElement(element) {
        if (!element) return;

        element.style.cssText += `
            background: #ff4757 !important;
            color: white !important;
            pointer-events: none !important;
            opacity: 0.5 !important;
        `;

        element.setAttribute('data-blocked', 'true');
        element.title = '此内容已被安全系统阻断';
    }

    // 播放警报声音
    playAlertSound(level) {
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            oscillator.frequency.setValueAtTime(level === 'high' ? 800 : 600, audioContext.currentTime);
            oscillator.type = 'sine';

            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.5);
        } catch (error) {
            // 音频播放失败
        }
    }

    // 创建监控面板
    createMonitorPanel() {
        const panel = document.createElement('div');
        panel.id = 'monitor-panel';
        panel.innerHTML = `
            <div class="monitor-header">
                <span>🛡️ 实时监控</span>
                <button onclick="realtimeMonitor.togglePanel()">−</button>
            </div>
            <div class="monitor-body">
                <div class="monitor-status">
                    <div class="status-item">
                        <span>剪贴板:</span>
                        <span class="status-active">●</span>
                    </div>
                    <div class="status-item">
                        <span>输入框:</span>
                        <span class="status-active">●</span>
                    </div>
                    <div class="status-item">
                        <span>页面内容:</span>
                        <span class="status-active">●</span>
                    </div>
                </div>
                <div class="monitor-stats">
                    <div>检测次数: <span id="detection-count">0</span></div>
                    <div>风险拦截: <span id="risk-blocks">0</span></div>
                </div>
            </div>
        `;

        panel.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 200px;
            background: rgba(0,0,0,0.8);
            color: white;
            border-radius: 8px;
            padding: 10px;
            z-index: 9999;
            font-size: 12px;
        `;

        document.body.appendChild(panel);
    }

    // 移除监控面板
    removeMonitorPanel() {
        const panel = document.getElementById('monitor-panel');
        if (panel) {
            panel.remove();
        }
    }

    // 切换面板显示
    togglePanel() {
        const panel = document.getElementById('monitor-panel');
        const body = panel.querySelector('.monitor-body');
        if (body.style.display === 'none') {
            body.style.display = 'block';
            panel.querySelector('button').textContent = '−';
        } else {
            body.style.display = 'none';
            panel.querySelector('button').textContent = '+';
        }
    }

    // 记录活动
    logActivity(message) {
        if (!this.settings.logActivity) return;

        const log = {
            timestamp: new Date().toISOString(),
            message: message,
            type: 'monitor'
        };

        const logs = JSON.parse(localStorage.getItem('monitorLogs') || '[]');
        logs.unshift(log);
        
        // 只保留最近100条
        if (logs.length > 100) {
            logs.splice(100);
        }

        localStorage.setItem('monitorLogs', JSON.stringify(logs));
    }

    // 获取监控统计
    getStats() {
        return {
            isActive: this.isActive,
            alertCount: this.alertQueue.length,
            monitors: Array.from(this.monitors.entries()).map(([key, monitor]) => ({
                name: monitor.name,
                active: monitor.active
            })),
            settings: this.settings
        };
    }

    // 更新设置
    updateSettings(newSettings) {
        this.settings = { ...this.settings, ...newSettings };
        localStorage.setItem('monitorSettings', JSON.stringify(this.settings));
    }
}

// 创建全局实时监控实例
const realtimeMonitor = new RealtimeMonitor();

// 导出
window.RealtimeMonitor = RealtimeMonitor;
window.realtimeMonitor = realtimeMonitor;