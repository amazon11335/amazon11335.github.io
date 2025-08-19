// 内容脚本 - 页面诈骗检测
class PageScamDetector {
    constructor() {
        this.scamKeywords = [
            '占卜', '算命', '预测未来', '转运', '消灾',
            '高收益', '稳赚不赔', '内幕消息', '投资理财',
            '真爱', '缘分', '命中注定', '借钱', '转账',
            '公检法', '银行客服', '账户异常', '冻结',
            '中奖', '免费领取', '限时优惠', '点击领取'
        ];
        this.init();
    }

    init() {
        this.scanPage();
        this.observeChanges();
        this.addContextMenu();
    }

    scanPage() {
        const textContent = document.body.innerText;
        const riskScore = this.calculateRisk(textContent);
        
        if (riskScore > 30) {
            this.showWarning(riskScore);
        }
    }

    calculateRisk(text) {
        let score = 0;
        let matchCount = 0;
        
        this.scamKeywords.forEach(keyword => {
            const regex = new RegExp(keyword, 'gi');
            const matches = text.match(regex);
            if (matches) {
                matchCount += matches.length;
                score += matches.length * 10;
            }
        });

        // 检测可疑模式
        if (text.includes('微信') && text.includes('转账')) score += 20;
        if (text.includes('QQ') && text.includes('红包')) score += 15;
        if (text.match(/\d{11}/g)) score += 10; // 手机号
        if (text.match(/\d{4,}/g)) score += 5; // 数字串

        return Math.min(score, 100);
    }

    showWarning(riskScore) {
        if (document.getElementById('scam-warning')) return;

        const warning = document.createElement('div');
        warning.id = 'scam-warning';
        warning.className = 'scam-warning';
        warning.innerHTML = `
            <div class="warning-content">
                <div class="warning-icon">⚠️</div>
                <div class="warning-text">
                    <strong>诈骗风险提醒</strong>
                    <p>检测到可疑内容，风险等级: ${riskScore}%</p>
                </div>
                <div class="warning-actions">
                    <button onclick="this.parentElement.parentElement.parentElement.remove()">忽略</button>
                    <button onclick="window.open('https://110.qq.com/')">举报</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(warning);
        
        // 3秒后自动隐藏
        setTimeout(() => {
            if (warning.parentNode) {
                warning.style.opacity = '0';
                setTimeout(() => warning.remove(), 500);
            }
        }, 10000);
    }

    observeChanges() {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === Node.TEXT_NODE || node.nodeType === Node.ELEMENT_NODE) {
                            const text = node.textContent || '';
                            const riskScore = this.calculateRisk(text);
                            if (riskScore > 50) {
                                this.highlightSuspiciousContent(node);
                            }
                        }
                    });
                }
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    highlightSuspiciousContent(node) {
        if (node.nodeType === Node.ELEMENT_NODE) {
            node.style.border = '2px solid #ff6b6b';
            node.style.backgroundColor = 'rgba(255, 107, 107, 0.1)';
            node.title = '检测到可疑内容';
        }
    }

    addContextMenu() {
        document.addEventListener('contextmenu', (e) => {
            const selectedText = window.getSelection().toString();
            if (selectedText) {
                chrome.runtime.sendMessage({
                    action: 'analyzeText',
                    text: selectedText
                });
            }
        });
    }
}

// 页面加载完成后启动检测
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new PageScamDetector();
    });
} else {
    new PageScamDetector();
}