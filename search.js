// 全局搜索功能
class SearchModule {
    constructor() {
        this.searchData = [
            { title: '电信诈骗', content: '冒充公检法银行客服', category: 'education', keywords: ['电话', '转账', '验证码'] },
            { title: '投资诈骗', content: '高收益低风险投资平台', category: 'education', keywords: ['理财', '股票', '收益'] },
            { title: '情感诈骗', content: '网络交友骗取钱财', category: 'education', keywords: ['交友', '恋爱', '借钱'] },
            { title: '举报诈骗', content: '提交诈骗信息举报', category: 'report', keywords: ['举报', '报警', '投诉'] },
            { title: '智能检测', content: 'AI分析可疑内容', category: 'detection', keywords: ['检测', '分析', '识别'] }
        ];
        this.init();
    }

    init() {
        this.addSearchBox();
    }

    addSearchBox() {
        const nav = document.querySelector('.nav-tabs .container');
        if (!nav) return;

        const searchBox = document.createElement('div');
        searchBox.className = 'search-box';
        searchBox.innerHTML = `
            <input type="text" placeholder="搜索功能..." onkeyup="searchModule.search(this.value)" onfocus="searchModule.showResults()">
            <div class="search-results" id="searchResults"></div>
        `;
        nav.appendChild(searchBox);
    }

    search(query) {
        const results = document.getElementById('searchResults');
        if (!query.trim()) {
            results.style.display = 'none';
            return;
        }

        const matches = this.searchData.filter(item => 
            item.title.includes(query) || 
            item.content.includes(query) ||
            item.keywords.some(keyword => keyword.includes(query))
        );

        if (matches.length === 0) {
            results.innerHTML = '<div class="no-results">未找到相关内容</div>';
        } else {
            results.innerHTML = matches.map(item => `
                <div class="search-item" onclick="searchModule.goTo('${item.category}')">
                    <strong>${item.title}</strong>
                    <p>${item.content}</p>
                </div>
            `).join('');
        }
        
        results.style.display = 'block';
    }

    showResults() {
        const results = document.getElementById('searchResults');
        if (results.innerHTML) {
            results.style.display = 'block';
        }
    }

    goTo(category) {
        const tabBtn = document.querySelector(`[data-tab="${category}"]`);
        if (tabBtn) {
            tabBtn.click();
            document.getElementById('searchResults').style.display = 'none';
        }
    }
}

const searchModule = new SearchModule();