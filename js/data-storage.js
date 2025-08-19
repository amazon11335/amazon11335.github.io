// 数据存储和管理模块 - 第九条任务

class DataManager {
    constructor() {
        this.storageKeys = {
            userStats: 'userStats',
            analysisHistory: 'analysisHistory',
            keywordStats: 'keywordStats',
            userProfile: 'userProfile',
            settings: 'appSettings',
            bookmarks: 'bookmarks',
            customKeywords: 'customKeywords'
        };
        
        this.maxHistorySize = 100;
        this.maxBookmarkSize = 50;
        
        this.initializeStorage();
    }

    // 初始化存储
    initializeStorage() {
        // 检查并创建默认数据结构
        Object.values(this.storageKeys).forEach(key => {
            if (!localStorage.getItem(key)) {
                this.setDefaultData(key);
            }
        });
        
        // 数据迁移和清理
        this.migrateOldData();
        this.cleanupOldData();
    }

    // 设置默认数据
    setDefaultData(key) {
        const defaults = {
            userStats: {
                detectionCount: 0,
                riskCount: 0,
                safetyScore: 100,
                totalAnalysisTime: 0,
                averageRiskScore: 0,
                lastActiveDate: new Date().toISOString()
            },
            analysisHistory: [],
            keywordStats: {},
            userProfile: {
                ageGroup: null,
                occupation: null,
                riskTolerance: 'medium',
                preferredLanguage: 'zh-CN',
                notificationEnabled: true
            },
            appSettings: {
                theme: 'auto',
                autoSave: true,
                showAdvancedAnalysis: true,
                enableAI: true,
                dataRetentionDays: 30
            },
            bookmarks: [],
            customKeywords: []
        };

        if (defaults[key]) {
            localStorage.setItem(key, JSON.stringify(defaults[key]));
        }
    }

    // 获取数据
    getData(key, defaultValue = null) {
        try {
            const data = localStorage.getItem(this.storageKeys[key] || key);
            return data ? JSON.parse(data) : defaultValue;
        } catch (error) {
            console.error(`获取数据失败 (${key}):`, error);
            return defaultValue;
        }
    }

    // 设置数据
    setData(key, value) {
        try {
            const storageKey = this.storageKeys[key] || key;
            localStorage.setItem(storageKey, JSON.stringify(value));
            return true;
        } catch (error) {
            console.error(`保存数据失败 (${key}):`, error);
            return false;
        }
    }

    // 更新用户统计
    updateUserStats(updates) {
        const stats = this.getData('userStats');
        const updatedStats = { ...stats, ...updates };
        updatedStats.lastActiveDate = new Date().toISOString();
        
        // 计算平均风险分数
        if (updates.newRiskScore !== undefined) {
            const totalDetections = updatedStats.detectionCount;
            const currentAvg = stats.averageRiskScore || 0;
            updatedStats.averageRiskScore = 
                ((currentAvg * (totalDetections - 1)) + updates.newRiskScore) / totalDetections;
        }
        
        this.setData('userStats', updatedStats);
        return updatedStats;
    }

    // 添加分析历史
    addAnalysisHistory(record) {
        const history = this.getData('analysisHistory', []);
        
        // 添加时间戳和ID
        record.id = Date.now() + Math.random().toString(36).substr(2, 9);
        record.timestamp = record.timestamp || new Date().toISOString();
        
        history.unshift(record);
        
        // 限制历史记录数量
        if (history.length > this.maxHistorySize) {
            history.splice(this.maxHistorySize);
        }
        
        this.setData('analysisHistory', history);
        return record.id;
    }

    // 获取分析历史
    getAnalysisHistory(filters = {}) {
        const history = this.getData('analysisHistory', []);
        
        let filtered = history;
        
        // 按日期过滤
        if (filters.startDate) {
            filtered = filtered.filter(record => 
                new Date(record.timestamp) >= new Date(filters.startDate)
            );
        }
        
        if (filters.endDate) {
            filtered = filtered.filter(record => 
                new Date(record.timestamp) <= new Date(filters.endDate)
            );
        }
        
        // 按风险等级过滤
        if (filters.riskLevel) {
            filtered = filtered.filter(record => 
                record.riskLevel === filters.riskLevel
            );
        }
        
        // 按关键词过滤
        if (filters.keyword) {
            filtered = filtered.filter(record => 
                record.content.toLowerCase().includes(filters.keyword.toLowerCase())
            );
        }
        
        return filtered;
    }

    // 更新关键词统计
    updateKeywordStats(keywords) {
        const stats = this.getData('keywordStats', {});
        
        keywords.forEach(keyword => {
            stats[keyword] = (stats[keyword] || 0) + 1;
        });
        
        this.setData('keywordStats', stats);
        return stats;
    }

    // 获取热门关键词
    getTopKeywords(limit = 10) {
        const stats = this.getData('keywordStats', {});
        return Object.entries(stats)
            .sort(([,a], [,b]) => b - a)
            .slice(0, limit)
            .map(([keyword, count]) => ({ keyword, count }));
    }

    // 添加书签
    addBookmark(item) {
        const bookmarks = this.getData('bookmarks', []);
        
        const bookmark = {
            id: Date.now() + Math.random().toString(36).substr(2, 9),
            title: item.title || '未命名书签',
            content: item.content || '',
            type: item.type || 'general',
            tags: item.tags || [],
            timestamp: new Date().toISOString()
        };
        
        bookmarks.unshift(bookmark);
        
        // 限制书签数量
        if (bookmarks.length > this.maxBookmarkSize) {
            bookmarks.splice(this.maxBookmarkSize);
        }
        
        this.setData('bookmarks', bookmarks);
        return bookmark.id;
    }

    // 删除书签
    removeBookmark(id) {
        const bookmarks = this.getData('bookmarks', []);
        const filtered = bookmarks.filter(bookmark => bookmark.id !== id);
        this.setData('bookmarks', filtered);
        return filtered.length < bookmarks.length;
    }

    // 导出数据
    exportData(options = {}) {
        const data = {
            exportInfo: {
                version: '1.0',
                timestamp: new Date().toISOString(),
                source: '反诈骗防护中心'
            }
        };

        // 选择要导出的数据
        if (options.includeStats !== false) {
            data.userStats = this.getData('userStats');
        }
        
        if (options.includeHistory !== false) {
            data.analysisHistory = this.getData('analysisHistory');
        }
        
        if (options.includeKeywords !== false) {
            data.keywordStats = this.getData('keywordStats');
        }
        
        if (options.includeProfile !== false) {
            data.userProfile = this.getData('userProfile');
        }
        
        if (options.includeBookmarks !== false) {
            data.bookmarks = this.getData('bookmarks');
        }
        
        if (options.includeSettings !== false) {
            data.settings = this.getData('appSettings');
        }

        return data;
    }

    // 导入数据
    importData(data, options = {}) {
        try {
            if (!data || typeof data !== 'object') {
                throw new Error('无效的数据格式');
            }

            const results = {
                success: [],
                failed: [],
                skipped: []
            };

            // 导入各类数据
            const importMap = {
                userStats: 'userStats',
                analysisHistory: 'analysisHistory',
                keywordStats: 'keywordStats',
                userProfile: 'userProfile',
                bookmarks: 'bookmarks',
                settings: 'appSettings'
            };

            Object.entries(importMap).forEach(([dataKey, storageKey]) => {
                if (data[dataKey]) {
                    try {
                        if (options.merge && (dataKey === 'analysisHistory' || dataKey === 'bookmarks')) {
                            // 合并模式
                            const existing = this.getData(storageKey, []);
                            const merged = this.mergeArrayData(existing, data[dataKey]);
                            this.setData(storageKey, merged);
                        } else {
                            // 覆盖模式
                            this.setData(storageKey, data[dataKey]);
                        }
                        results.success.push(dataKey);
                    } catch (error) {
                        results.failed.push({ key: dataKey, error: error.message });
                    }
                } else {
                    results.skipped.push(dataKey);
                }
            });

            return results;
        } catch (error) {
            throw new Error(`导入数据失败: ${error.message}`);
        }
    }

    // 合并数组数据
    mergeArrayData(existing, imported) {
        const existingIds = new Set(existing.map(item => item.id).filter(Boolean));
        const newItems = imported.filter(item => !existingIds.has(item.id));
        
        return [...existing, ...newItems].slice(0, this.maxHistorySize);
    }

    // 清理过期数据
    cleanupExpiredData() {
        const settings = this.getData('appSettings');
        const retentionDays = settings.dataRetentionDays || 30;
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - retentionDays);

        // 清理分析历史
        const history = this.getData('analysisHistory', []);
        const filteredHistory = history.filter(record => 
            new Date(record.timestamp) > cutoffDate
        );
        
        if (filteredHistory.length !== history.length) {
            this.setData('analysisHistory', filteredHistory);
        }

        // 清理书签
        const bookmarks = this.getData('bookmarks', []);
        const filteredBookmarks = bookmarks.filter(bookmark => 
            new Date(bookmark.timestamp) > cutoffDate
        );
        
        if (filteredBookmarks.length !== bookmarks.length) {
            this.setData('bookmarks', filteredBookmarks);
        }

        return {
            historyRemoved: history.length - filteredHistory.length,
            bookmarksRemoved: bookmarks.length - filteredBookmarks.length
        };
    }

    // 数据迁移
    migrateOldData() {
        // 检查旧版本数据并迁移
        const oldKeys = ['detectionCount', 'riskCount', 'safetyScore'];
        const hasOldData = oldKeys.some(key => localStorage.getItem(key));
        
        if (hasOldData) {
            const userStats = this.getData('userStats');
            oldKeys.forEach(key => {
                const value = localStorage.getItem(key);
                if (value) {
                    userStats[key] = parseInt(value) || 0;
                    localStorage.removeItem(key);
                }
            });
            this.setData('userStats', userStats);
        }
    }

    // 清理旧数据
    cleanupOldData() {
        // 清理可能存在的临时或无效数据
        const keysToCheck = Object.keys(localStorage);
        keysToCheck.forEach(key => {
            if (key.startsWith('temp_') || key.startsWith('cache_')) {
                localStorage.removeItem(key);
            }
        });
    }

    // 获取存储使用情况
    getStorageUsage() {
        let totalSize = 0;
        const usage = {};

        Object.entries(this.storageKeys).forEach(([name, key]) => {
            const data = localStorage.getItem(key);
            const size = data ? new Blob([data]).size : 0;
            usage[name] = {
                size: size,
                sizeFormatted: this.formatBytes(size),
                itemCount: this.getItemCount(name)
            };
            totalSize += size;
        });

        return {
            total: {
                size: totalSize,
                sizeFormatted: this.formatBytes(totalSize),
                percentage: Math.round((totalSize / (5 * 1024 * 1024)) * 100) // 假设5MB限制
            },
            breakdown: usage
        };
    }

    // 获取项目数量
    getItemCount(dataType) {
        const data = this.getData(dataType);
        if (Array.isArray(data)) return data.length;
        if (typeof data === 'object' && data !== null) return Object.keys(data).length;
        return 1;
    }

    // 格式化字节数
    formatBytes(bytes) {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    // 重置所有数据
    resetAllData() {
        Object.values(this.storageKeys).forEach(key => {
            localStorage.removeItem(key);
        });
        this.initializeStorage();
    }
}

// 创建全局数据管理器实例
const dataManager = new DataManager();

// 导出
window.DataManager = DataManager;
window.dataManager = dataManager;