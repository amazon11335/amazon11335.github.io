// 主题切换功能
class ThemeManager {
    constructor() {
        this.currentTheme = localStorage.getItem('theme') || 'light';
        this.init();
    }

    init() {
        this.applyTheme(this.currentTheme);
        this.addThemeToggle();
    }

    addThemeToggle() {
        const header = document.querySelector('.header .container');
        if (!header) return;

        const toggle = document.createElement('div');
        toggle.className = 'theme-toggle';
        toggle.innerHTML = `
            <button onclick="themeManager.toggleTheme()" class="theme-btn">
                ${this.currentTheme === 'dark' ? '☀️' : '🌙'}
            </button>
        `;
        header.appendChild(toggle);
    }

    toggleTheme() {
        this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.applyTheme(this.currentTheme);
        localStorage.setItem('theme', this.currentTheme);
        
        const btn = document.querySelector('.theme-btn');
        btn.textContent = this.currentTheme === 'dark' ? '☀️' : '🌙';
    }

    applyTheme(theme) {
        document.body.className = theme === 'dark' ? 'dark-theme' : '';
    }
}

const themeManager = new ThemeManager();