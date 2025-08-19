// 高级风险评分算法

class AdvancedRiskAnalyzer {
    constructor() {
        this.patterns = {
            // 数字模式（金额、电话等）
            money: /(\d+(?:\.\d+)?)\s*(?:元|块|万|千|百|¥|\$)/g,
            phone: /1[3-9]\d{9}/g,
            bankCard: /\d{16,19}/g,
            idCard: /\d{17}[\dxX]/g,
            
            // 时间紧迫模式
            urgency: /(今天|明天|立即|马上|赶紧|快点|截止|过期)/g,
            
            // 情感操控模式
            emotion: /(可怜|救救|帮帮|求求|拜托|感谢|报答)/g,
            
            // 保密要求模式
            secrecy: /(保密|不要告诉|删除|清空|秘密)/g
        };
        
        this.riskFactors = {
            // 基础风险因子
            highRiskAmount: 1000,    // 高风险金额阈值
            phonePresence: 20,       // 包含电话号码
            bankCardPresence: 30,    // 包含银行卡号
            idCardPresence: 25,      // 包含身份证号
            
            // 行为模式风险
            urgencyMultiplier: 1.5,  // 紧迫性倍数
            emotionMultiplier: 1.3,  // 情感操控倍数
            secrecyMultiplier: 2.0,  // 保密要求倍数
            
            // 文本特征风险
            lengthFactor: 0.1,       // 文本长度因子
            repeatFactor: 1.2        // 重复词汇因子
        };
    }

    // 高级风险分析
    analyzeAdvancedRisk(text, basicResult) {
        const analysis = {
            basicScore: basicResult.totalScore,
            patternScore: this.analyzePatterns(text),
            behaviorScore: this.analyzeBehavior(text),
            linguisticScore: this.analyzeLinguistic(text),
            contextScore: this.analyzeContext(text, basicResult),
            finalScore: 0,
            riskFactors: [],
            confidence: 0
        };

        // 计算最终得分
        analysis.finalScore = this.calculateFinalScore(analysis);
        
        // 计算置信度
        analysis.confidence = this.calculateConfidence(analysis, text);
        
        // 生成风险因子说明
        analysis.riskFactors = this.generateRiskFactors(analysis, text);

        return analysis;
    }

    // 模式分析
    analyzePatterns(text) {
        let score = 0;
        const factors = [];

        // 金额检测
        const moneyMatches = text.match(this.patterns.money);
        if (moneyMatches) {
            moneyMatches.forEach(match => {
                const amount = parseFloat(match.replace(/[^\d.]/g, ''));
                if (amount > this.riskFactors.highRiskAmount) {
                    score += Math.min(amount / 100, 50);
                    factors.push(`高额金额: ${match}`);
                }
            });
        }

        // 敏感信息检测
        if (this.patterns.phone.test(text)) {
            score += this.riskFactors.phonePresence;
            factors.push('包含电话号码');
        }

        if (this.patterns.bankCard.test(text)) {
            score += this.riskFactors.bankCardPresence;
            factors.push('包含银行卡号');
        }

        if (this.patterns.idCard.test(text)) {
            score += this.riskFactors.idCardPresence;
            factors.push('包含身份证号');
        }

        return { score, factors };
    }

    // 行为模式分析
    analyzeBehavior(text) {
        let score = 0;
        const factors = [];

        // 紧迫性分析
        const urgencyMatches = text.match(this.patterns.urgency);
        if (urgencyMatches) {
            score += urgencyMatches.length * 15 * this.riskFactors.urgencyMultiplier;
            factors.push(`紧迫性词汇: ${urgencyMatches.join(', ')}`);
        }

        // 情感操控分析
        const emotionMatches = text.match(this.patterns.emotion);
        if (emotionMatches) {
            score += emotionMatches.length * 10 * this.riskFactors.emotionMultiplier;
            factors.push(`情感操控: ${emotionMatches.join(', ')}`);
        }

        // 保密要求分析
        const secrecyMatches = text.match(this.patterns.secrecy);
        if (secrecyMatches) {
            score += secrecyMatches.length * 20 * this.riskFactors.secrecyMultiplier;
            factors.push(`保密要求: ${secrecyMatches.join(', ')}`);
        }

        return { score, factors };
    }

    // 语言学分析
    analyzeLinguistic(text) {
        let score = 0;
        const factors = [];

        // 文本长度分析
        const length = text.length;
        if (length > 500) {
            score += (length - 500) * this.riskFactors.lengthFactor;
            factors.push('文本过长，可能包含复杂诈骗信息');
        }

        // 重复词汇分析
        const words = text.split(/\s+/);
        const wordCount = {};
        words.forEach(word => {
            if (word.length > 1) {
                wordCount[word] = (wordCount[word] || 0) + 1;
            }
        });

        const repeatedWords = Object.entries(wordCount)
            .filter(([word, count]) => count > 2)
            .map(([word, count]) => ({ word, count }));

        if (repeatedWords.length > 0) {
            score += repeatedWords.length * 5 * this.riskFactors.repeatFactor;
            factors.push(`重复词汇: ${repeatedWords.map(r => `${r.word}(${r.count}次)`).join(', ')}`);
        }

        // 标点符号分析
        const exclamationCount = (text.match(/!/g) || []).length;
        const questionCount = (text.match(/\?/g) || []).length;
        
        if (exclamationCount > 3) {
            score += exclamationCount * 2;
            factors.push('过多感叹号，情绪化表达');
        }

        if (questionCount > 5) {
            score += questionCount * 1.5;
            factors.push('过多疑问句，可能为诱导性提问');
        }

        return { score, factors };
    }

    // 上下文分析
    analyzeContext(text, basicResult) {
        let score = 0;
        const factors = [];

        // 多类型诈骗组合
        if (basicResult.detectedTypes.length > 2) {
            score += basicResult.detectedTypes.length * 15;
            factors.push('检测到多种诈骗类型组合');
        }

        // 关键词密度分析
        const keywordDensity = basicResult.matchedKeywords.length / text.length * 1000;
        if (keywordDensity > 10) {
            score += keywordDensity * 2;
            factors.push(`关键词密度过高: ${keywordDensity.toFixed(2)}‰`);
        }

        // 特殊字符分析
        const specialChars = text.match(/[★☆♦♠♣♥※]/g);
        if (specialChars && specialChars.length > 3) {
            score += specialChars.length * 3;
            factors.push('包含大量特殊符号');
        }

        return { score, factors };
    }

    // 计算最终得分
    calculateFinalScore(analysis) {
        const weights = {
            basic: 0.4,
            pattern: 0.25,
            behavior: 0.2,
            linguistic: 0.1,
            context: 0.05
        };

        return Math.min(
            analysis.basicScore * weights.basic +
            analysis.patternScore.score * weights.pattern +
            analysis.behaviorScore.score * weights.behavior +
            analysis.linguisticScore.score * weights.linguistic +
            analysis.contextScore.score * weights.context,
            100
        );
    }

    // 计算置信度
    calculateConfidence(analysis, text) {
        let confidence = 50; // 基础置信度

        // 基于检测到的模式数量
        const totalFactors = 
            analysis.patternScore.factors.length +
            analysis.behaviorScore.factors.length +
            analysis.linguisticScore.factors.length +
            analysis.contextScore.factors.length;

        confidence += Math.min(totalFactors * 5, 30);

        // 基于文本长度
        if (text.length > 50) {
            confidence += Math.min((text.length - 50) / 10, 15);
        }

        // 基于得分一致性
        const scores = [
            analysis.basicScore,
            analysis.patternScore.score,
            analysis.behaviorScore.score
        ];
        
        const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length;
        const variance = scores.reduce((sum, score) => sum + Math.pow(score - avgScore, 2), 0) / scores.length;
        
        if (variance < 100) {
            confidence += 5; // 得分一致性高
        }

        return Math.min(confidence, 95);
    }

    // 生成风险因子说明
    generateRiskFactors(analysis, text) {
        const factors = [];

        // 合并所有因子
        factors.push(...analysis.patternScore.factors);
        factors.push(...analysis.behaviorScore.factors);
        factors.push(...analysis.linguisticScore.factors);
        factors.push(...analysis.contextScore.factors);

        // 添加综合评估
        if (analysis.finalScore > 80) {
            factors.push('🚨 综合评估：极高风险，强烈建议停止交流');
        } else if (analysis.finalScore > 60) {
            factors.push('⚠️ 综合评估：高风险，需要谨慎对待');
        } else if (analysis.finalScore > 40) {
            factors.push('💡 综合评估：中等风险，建议核实信息');
        } else if (analysis.finalScore > 20) {
            factors.push('✓ 综合评估：低风险，保持警惕即可');
        } else {
            factors.push('✅ 综合评估：风险较低，相对安全');
        }

        return factors;
    }

    // 获取详细报告
    getDetailedReport(text, basicResult) {
        const analysis = this.analyzeAdvancedRisk(text, basicResult);
        
        return {
            summary: {
                finalScore: Math.round(analysis.finalScore),
                confidence: Math.round(analysis.confidence),
                riskLevel: this.getRiskLevel(analysis.finalScore),
                recommendation: this.getRecommendation(analysis.finalScore)
            },
            breakdown: {
                基础检测: Math.round(analysis.basicScore),
                模式识别: Math.round(analysis.patternScore.score),
                行为分析: Math.round(analysis.behaviorScore.score),
                语言特征: Math.round(analysis.linguisticScore.score),
                上下文: Math.round(analysis.contextScore.score)
            },
            riskFactors: analysis.riskFactors,
            technicalDetails: analysis
        };
    }

    // 获取风险等级
    getRiskLevel(score) {
        if (score >= 80) return 'critical';
        if (score >= 60) return 'high';
        if (score >= 40) return 'medium';
        if (score >= 20) return 'low';
        return 'safe';
    }

    // 获取建议
    getRecommendation(score) {
        if (score >= 80) return '立即停止交流，疑似严重诈骗';
        if (score >= 60) return '高度警惕，建议举报相关信息';
        if (score >= 40) return '谨慎对待，核实信息来源';
        if (score >= 20) return '保持警惕，注意防范';
        return '相对安全，继续保持防范意识';
    }
}

// 创建全局分析器实例
const advancedRiskAnalyzer = new AdvancedRiskAnalyzer();

// 导出
window.AdvancedRiskAnalyzer = AdvancedRiskAnalyzer;
window.advancedRiskAnalyzer = advancedRiskAnalyzer;