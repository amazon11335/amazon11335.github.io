// 诈骗关键词数据库

const FRAUD_KEYWORDS = {
    // 占卜算命类
    divination: {
        name: '占卜算命诈骗',
        weight: 25,
        keywords: [
            '占卜', '算命', '看相', '风水', '塔罗牌', '水晶球', '紫微斗数',
            '八字', '面相', '手相', '星座运势', '命理', '预测未来', '改运',
            '转运', '消灾', '破财免灾', '大师', '神算', '仙人指路', '开光',
            '法事', '做法', '符咒', '护身符', '招财', '辟邪', '化解',
            '桃花运', '财运', '事业运', '学业运', '健康运', '婚姻运'
        ]
    },

    // 投资理财类
    investment: {
        name: '投资理财诈骗',
        weight: 30,
        keywords: [
            '投资', '理财', '炒股', '期货', '外汇', '数字货币', '比特币',
            '稳赚不赔', '保本保息', '高收益', '低风险', '内幕消息', '庄家',
            '拉升', '涨停', '翻倍', '暴利', '一夜暴富', '躺赚', '被动收入',
            '资金盘', '传销币', '空气币', '割韭菜', '接盘', '套牢',
            '融资融券', '配资', '杠杆', '爆仓', '强平', '追加保证金'
        ]
    },

    // 网络购物类
    shopping: {
        name: '网络购物诈骗',
        weight: 20,
        keywords: [
            '刷单', '兼职', '代购', '海淘', '直播带货', '限时抢购',
            '秒杀', '清仓', '亏本甩卖', '厂家直销', '一折', '免费送',
            '货到付款', '先付定金', '预付款', '保证金', '激活费',
            '快递到付', '包邮', '七天无理由', '假一赔十', '正品保证'
        ]
    },

    // 情感诈骗类
    romance: {
        name: '情感诈骗',
        weight: 25,
        keywords: [
            '交友', '征婚', '相亲', '单身', '寂寞', '空虚', '陪伴',
            '真爱', '缘分', '命中注定', '一见钟情', '白头偕老', '永远爱你',
            '出国', '签证', '机票', '住院', '手术费', '救命钱', '急用钱',
            '家人生病', '车祸', '意外', '困难', '帮忙', '借钱', '周转'
        ]
    },

    // 身份冒充类
    identity: {
        name: '身份冒充诈骗',
        weight: 35,
        keywords: [
            '公安局', '检察院', '法院', '警察', '办案', '传唤', '逮捕令',
            '洗钱', '涉案', '冻结', '查封', '配合调查', '清白', '证明',
            '银行', '客服', '升级', '维护', '验证', '身份证', '银行卡',
            '密码', '验证码', '短信', '链接', '网址', '下载', 'APP',
            '中奖', '恭喜', '幸运', '抽奖', '奖金', '税费', '手续费',
            '快递', '包裹', '签收', '派件', '地址', '联系方式'
        ]
    },

    // 网络兼职类
    parttime: {
        name: '网络兼职诈骗',
        weight: 20,
        keywords: [
            '兼职', '副业', '在家赚钱', '轻松赚钱', '日赚', '月入',
            '打字员', '录入员', '客服', '推广', '拉人头', '下线',
            '会员费', '培训费', '材料费', '押金', '保证金', '入会费',
            '刷好评', '刷信誉', '刷流量', '点赞', '关注', '转发'
        ]
    },

    // 虚假慈善类
    charity: {
        name: '虚假慈善诈骗',
        weight: 15,
        keywords: [
            '慈善', '捐款', '救助', '贫困', '失学', '重病', '天灾',
            '爱心', '善款', '募捐', '基金会', '公益', '志愿者',
            '转账', '汇款', '支付宝', '微信', '银行账户'
        ]
    }
};

// 敏感词汇补充
const SENSITIVE_WORDS = [
    '转账', '汇款', '打款', '付款', '收款', '到账', '提现',
    '银行卡号', '账号', '密码', '验证码', '身份证号',
    '紧急', '急用', '马上', '立即', '赶紧', '快点',
    '保密', '不要告诉别人', '删除记录', '清空聊天',
    '安全账户', '资金监管', '第三方托管', '担保交易'
];

// 地区相关词汇
const LOCATION_WORDS = [
    '北京', '上海', '广州', '深圳', '杭州', '成都', '重庆',
    '香港', '澳门', '台湾', '美国', '英国', '澳洲', '加拿大'
];

// 时间紧迫词汇
const URGENCY_WORDS = [
    '今天', '明天', '现在', '立刻', '马上', '赶紧', '抓紧',
    '最后一天', '截止', '过期', '失效', '错过', '机会难得'
];

// 关键词检测引擎
class KeywordDetector {
    constructor() {
        this.fraudKeywords = FRAUD_KEYWORDS;
        this.sensitiveWords = SENSITIVE_WORDS;
        this.locationWords = LOCATION_WORDS;
        this.urgencyWords = URGENCY_WORDS;
    }

    // 检测文本风险
    detectRisk(text) {
        const result = {
            totalScore: 0,
            riskLevel: 'low',
            detectedTypes: [],
            matchedKeywords: [],
            suggestions: []
        };

        // 检测各类诈骗关键词
        for (const [type, data] of Object.entries(this.fraudKeywords)) {
            const matches = this.findMatches(text, data.keywords);
            if (matches.length > 0) {
                const score = matches.length * data.weight;
                result.totalScore += score;
                result.detectedTypes.push({
                    type: type,
                    name: data.name,
                    matches: matches,
                    score: score
                });
                result.matchedKeywords.push(...matches);
            }
        }

        // 检测敏感词汇
        const sensitiveMatches = this.findMatches(text, this.sensitiveWords);
        if (sensitiveMatches.length > 0) {
            result.totalScore += sensitiveMatches.length * 15;
            result.matchedKeywords.push(...sensitiveMatches);
        }

        // 检测紧迫性词汇
        const urgencyMatches = this.findMatches(text, this.urgencyWords);
        if (urgencyMatches.length > 0) {
            result.totalScore += urgencyMatches.length * 10;
            result.matchedKeywords.push(...urgencyMatches);
        }

        // 计算风险等级
        result.riskLevel = this.calculateRiskLevel(result.totalScore);
        result.suggestions = this.generateSuggestions(result);

        return result;
    }

    // 查找匹配的关键词
    findMatches(text, keywords) {
        const matches = [];
        const lowerText = text.toLowerCase();
        
        keywords.forEach(keyword => {
            if (lowerText.includes(keyword.toLowerCase())) {
                matches.push(keyword);
            }
        });

        return [...new Set(matches)]; // 去重
    }

    // 计算风险等级
    calculateRiskLevel(score) {
        if (score >= 100) return 'critical';
        if (score >= 70) return 'high';
        if (score >= 40) return 'medium';
        if (score >= 20) return 'low';
        return 'safe';
    }

    // 生成建议
    generateSuggestions(result) {
        const suggestions = [];

        if (result.riskLevel === 'critical' || result.riskLevel === 'high') {
            suggestions.push('🚨 高度警惕：疑似诈骗信息，建议立即停止交流');
            suggestions.push('📞 如有疑问，请拨打96110反诈专线咨询');
            suggestions.push('🚫 切勿转账汇款或提供个人信息');
        } else if (result.riskLevel === 'medium') {
            suggestions.push('⚠️ 请谨慎：内容存在风险，建议核实信息真实性');
            suggestions.push('🔍 通过官方渠道验证相关信息');
        } else if (result.riskLevel === 'low') {
            suggestions.push('💡 保持警惕：虽然风险较低，但仍需注意防范');
        } else {
            suggestions.push('✅ 内容相对安全，但请继续保持防范意识');
        }

        // 根据检测到的类型添加特定建议
        result.detectedTypes.forEach(type => {
            switch (type.type) {
                case 'divination':
                    suggestions.push('🔮 占卜算命多为迷信，请理性对待');
                    break;
                case 'investment':
                    suggestions.push('💰 投资需谨慎，选择正规金融机构');
                    break;
                case 'romance':
                    suggestions.push('💕 网络交友需谨慎，见面前务必核实身份');
                    break;
                case 'identity':
                    suggestions.push('🆔 官方机构不会通过电话要求转账');
                    break;
            }
        });

        return [...new Set(suggestions)]; // 去重
    }

    // 添加自定义关键词
    addCustomKeywords(type, keywords) {
        if (this.fraudKeywords[type]) {
            this.fraudKeywords[type].keywords.push(...keywords);
        }
    }

    // 获取统计信息
    getStatistics() {
        const stats = {};
        for (const [type, data] of Object.entries(this.fraudKeywords)) {
            stats[type] = {
                name: data.name,
                keywordCount: data.keywords.length,
                weight: data.weight
            };
        }
        return stats;
    }

    // 导出关键词库
    exportKeywords() {
        return {
            fraudKeywords: this.fraudKeywords,
            sensitiveWords: this.sensitiveWords,
            locationWords: this.locationWords,
            urgencyWords: this.urgencyWords,
            exportTime: new Date().toISOString()
        };
    }
}

// 创建全局检测器实例
const keywordDetector = new KeywordDetector();

// 导出给其他模块使用
window.KeywordDetector = KeywordDetector;
window.keywordDetector = keywordDetector;
window.FRAUD_KEYWORDS = FRAUD_KEYWORDS;