// AI集成模块 - 第八条任务

class AIIntegration {
    constructor() {
        this.apiKey = 'sk-0340d946851046c1a0cef9cc7d435276';
        this.baseURL = 'https://api.deepseek.com/v1';
        this.model = 'deepseek-chat';
        this.isOnline = false;
        this.requestCount = 0;
        this.maxRequests = 100; // 每日限制
    }

    // 检查API状态
    async checkAPIStatus() {
        try {
            const response = await fetch(`${this.baseURL}/chat/completions`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    model: this.model,
                    messages: [{ role: 'user', content: 'test' }],
                    max_tokens: 1
                })
            });
            
            this.isOnline = response.ok || response.status === 400;
            return this.isOnline;
        } catch (error) {
            this.isOnline = false;
            return false;
        }
    }

    // 智能内容分析
    async analyzeContent(text) {
        if (!this.isOnline || this.requestCount >= this.maxRequests) {
            return this.fallbackAnalysis(text);
        }

        try {
            const response = await fetch(`${this.baseURL}/chat/completions`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    model: this.model,
                    messages: [{
                        role: 'user',
                        content: `请分析以下文本的诈骗风险，返回JSON格式：
                        {
                            "riskScore": 0-100的风险评分,
                            "riskLevel": "safe/low/medium/high/critical",
                            "fraudTypes": ["检测到的诈骗类型"],
                            "keyIndicators": ["关键风险指标"],
                            "recommendation": "安全建议"
                        }
                        
                        文本内容："${text}"`
                    }],
                    max_tokens: 300,
                    temperature: 0.3
                })
            });

            if (response.ok) {
                this.requestCount++;
                const data = await response.json();
                const content = data.choices[0].message.content.trim();
                
                try {
                    return JSON.parse(content);
                } catch {
                    return this.parseAIResponse(content);
                }
            } else {
                return this.fallbackAnalysis(text);
            }
        } catch (error) {
            console.error('AI分析失败:', error);
            return this.fallbackAnalysis(text);
        }
    }

    // 解析AI响应
    parseAIResponse(content) {
        const riskScore = this.extractNumber(content, /风险.*?(\d+)/i) || 
                         this.extractNumber(content, /评分.*?(\d+)/i) || 50;
        
        const riskLevel = content.includes('高风险') || content.includes('critical') ? 'high' :
                         content.includes('中风险') || content.includes('medium') ? 'medium' :
                         content.includes('低风险') || content.includes('low') ? 'low' : 'safe';

        return {
            riskScore: Math.min(riskScore, 100),
            riskLevel: riskLevel,
            fraudTypes: this.extractFraudTypes(content),
            keyIndicators: this.extractIndicators(content),
            recommendation: this.extractRecommendation(content)
        };
    }

    // 提取数字
    extractNumber(text, regex) {
        const match = text.match(regex);
        return match ? parseInt(match[1]) : null;
    }

    // 提取诈骗类型
    extractFraudTypes(content) {
        const types = [];
        if (content.includes('占卜') || content.includes('算命')) types.push('占卜算命诈骗');
        if (content.includes('投资') || content.includes('理财')) types.push('投资理财诈骗');
        if (content.includes('情感') || content.includes('交友')) types.push('情感诈骗');
        if (content.includes('身份') || content.includes('冒充')) types.push('身份冒充诈骗');
        return types;
    }

    // 提取关键指标
    extractIndicators(content) {
        const indicators = [];
        if (content.includes('金额')) indicators.push('涉及金额');
        if (content.includes('转账')) indicators.push('要求转账');
        if (content.includes('紧急')) indicators.push('制造紧迫感');
        if (content.includes('保密')) indicators.push('要求保密');
        return indicators;
    }

    // 提取建议
    extractRecommendation(content) {
        if (content.includes('停止')) return '建议立即停止交流';
        if (content.includes('谨慎')) return '请谨慎对待，核实信息';
        if (content.includes('警惕')) return '保持警惕，注意防范';
        return '继续保持防范意识';
    }

    // 降级分析（离线模式）
    fallbackAnalysis(text) {
        const basicResult = keywordDetector.detectRisk(text);
        const advancedResult = advancedRiskAnalyzer.getDetailedReport(text, basicResult);
        
        return {
            riskScore: advancedResult.summary.finalScore,
            riskLevel: advancedResult.summary.riskLevel,
            fraudTypes: basicResult.detectedTypes.map(t => t.name),
            keyIndicators: basicResult.matchedKeywords.slice(0, 5),
            recommendation: advancedResult.summary.recommendation,
            isOffline: true
        };
    }

    // 生成个性化建议
    async generatePersonalizedAdvice(userProfile, riskHistory) {
        if (!this.isOnline) {
            return this.getDefaultAdvice(userProfile);
        }

        try {
            const response = await fetch(`${this.baseURL}/chat/completions`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    model: this.model,
                    messages: [{
                        role: 'user',
                        content: `基于用户画像生成个性化防诈骗建议：
                        用户年龄段：${userProfile.ageGroup || '未知'}
                        职业类型：${userProfile.occupation || '未知'}
                        风险历史：检测${riskHistory.totalDetections || 0}次，发现风险${riskHistory.riskCount || 0}次
                        
                        请提供3-5条针对性的防诈骗建议，每条不超过30字。`
                    }],
                    max_tokens: 200,
                    temperature: 0.7
                })
            });

            if (response.ok) {
                const data = await response.json();
                return this.parseAdviceResponse(data.choices[0].message.content);
            }
        } catch (error) {
            console.error('生成建议失败:', error);
        }

        return this.getDefaultAdvice(userProfile);
    }

    // 解析建议响应
    parseAdviceResponse(content) {
        const lines = content.split('\n').filter(line => line.trim());
        return lines.slice(0, 5).map(line => line.replace(/^\d+\.?\s*/, '').trim());
    }

    // 默认建议
    getDefaultAdvice(userProfile) {
        const advice = [
            '不要轻信任何要求转账的信息',
            '遇到可疑情况及时咨询家人朋友',
            '保护个人信息，不随意透露',
            '投资理财选择正规机构',
            '网络交友要谨慎核实身份'
        ];

        // 根据用户画像调整建议
        if (userProfile.ageGroup === 'elderly') {
            advice.unshift('子女要多关心老人，防范养生保健诈骗');
        } else if (userProfile.ageGroup === 'young') {
            advice.unshift('年轻人要警惕网络兼职和校园贷诈骗');
        }

        return advice.slice(0, 5);
    }

    // 情感分析
    async analyzeEmotion(text) {
        if (!this.isOnline) {
            return this.basicEmotionAnalysis(text);
        }

        try {
            const response = await fetch(`${this.baseURL}/chat/completions`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    model: this.model,
                    messages: [{
                        role: 'user',
                        content: `分析这句话的情绪，只回答以下选项之一：开心、平静、伤心、愤怒、惊讶、恐惧、焦虑。句子："${text}"`
                    }],
                    max_tokens: 10,
                    temperature: 0.3
                })
            });

            if (response.ok) {
                const data = await response.json();
                return data.choices[0].message.content.trim();
            }
        } catch (error) {
            console.error('情感分析失败:', error);
        }

        return this.basicEmotionAnalysis(text);
    }

    // 基础情感分析
    basicEmotionAnalysis(text) {
        const emotions = {
            '开心': ['开心', '快乐', '高兴', '兴奋', '愉快', '哈哈', '嘻嘻'],
            '伤心': ['伤心', '难过', '悲伤', '沮丧', '失望', '哭', '泪'],
            '愤怒': ['愤怒', '生气', '恼火', '气愤', '讨厌', '烦', '怒'],
            '恐惧': ['害怕', '恐惧', '担心', '紧张', '焦虑', '不安'],
            '惊讶': ['惊讶', '震惊', '意外', '吃惊', '哇', '天哪']
        };

        for (const [emotion, keywords] of Object.entries(emotions)) {
            if (keywords.some(keyword => text.includes(keyword))) {
                return emotion;
            }
        }

        return '平静';
    }

    // 获取使用统计
    getUsageStats() {
        return {
            isOnline: this.isOnline,
            requestCount: this.requestCount,
            maxRequests: this.maxRequests,
            remainingRequests: Math.max(0, this.maxRequests - this.requestCount),
            usagePercentage: Math.round((this.requestCount / this.maxRequests) * 100)
        };
    }

    // 重置请求计数（每日重置）
    resetDailyCount() {
        this.requestCount = 0;
        localStorage.setItem('aiRequestCount', '0');
        localStorage.setItem('lastResetDate', new Date().toDateString());
    }

    // 检查是否需要重置计数
    checkDailyReset() {
        const lastReset = localStorage.getItem('lastResetDate');
        const today = new Date().toDateString();
        
        if (lastReset !== today) {
            this.resetDailyCount();
        } else {
            this.requestCount = parseInt(localStorage.getItem('aiRequestCount') || '0');
        }
    }
}

// 创建全局AI集成实例
const aiIntegration = new AIIntegration();

// 初始化
aiIntegration.checkDailyReset();
aiIntegration.checkAPIStatus();

// 禁用实时监控（默认关闭）
realtimeMonitor.isActive = false;

// 导出
window.AIIntegration = AIIntegration;
window.aiIntegration = aiIntegration;