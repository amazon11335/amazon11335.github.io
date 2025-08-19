// 快捷键功能
class ShortcutsManager {
    constructor() {
        this.shortcuts = {
            'ctrl+1': () => this.switchTab('detection'),
            'ctrl+2': () => this.switchTab('analysis'),
            'ctrl+3': () => this.switchTab('education'),
            'ctrl+4': () => this.switchTab('report'),
            'ctrl+5': () => this.switchTab('consultation'),
            'ctrl+6': () => this.switchTab('tools'),
            'ctrl+enter': () => this.quickAnalyze(),
            'f1': () => this.showHelp(),
            'escape': () => this.closeModals()
        };
        this.init();
    }

    init() {
        document.addEventListener('keydown', (e) => {
            const key = this.getKeyCombo(e);
            if (this.shortcuts[key]) {
                e.preventDefault();
                this.shortcuts[key]();
            }
        });
        
        this.showShortcutsHint();
    }

    getKeyCombo(e) {
        const parts = [];
        if (e.ctrlKey) parts.push('ctrl');
        if (e.altKey) parts.push('alt');
        if (e.shiftKey) parts.push('shift');
        
        const key = e.key.toLowerCase();
        if (key !== 'control' && key !== 'alt' && key !== 'shift') {
            parts.push(key);
        }
        
        return parts.join('+');
    }

    switchTab(tabName) {
        const tabBtn = document.querySelector(`[data-tab="${tabName}"]`);
        if (tabBtn) {
            tabBtn.click();
            this.showNotification(`切换到${tabBtn.textContent}`, 'info');
        }
    }

    quickAnalyze() {
        const contentInput = document.getElementById('contentInput');
        const analyzeBtn = document.getElementById('analyzeBtn');
        
        if (contentInput && contentInput.value.trim() && analyzeBtn) {
            analyzeBtn.click();
        } else if (contentInput) {
            contentInput.focus();
            this.showNotification('请先输入要分析的内容', 'warning');
        }
    }

    showHelp() {
        const helpModal = document.createElement('div');
        helpModal.className = 'help-modal';
        helpModal.innerHTML = `
            <div class="modal-content">
                <span class="close" onclick="this.parentElement.parentElement.remove()">&times;</span>
                <h3>快捷键帮助</h3>
                <div class="shortcuts-list">
                    <div class="shortcut-item">
                        <kbd>Ctrl + 1-6</kbd>
                        <span>切换标签页</span>
                    </div>
                    <div class="shortcut-item">
                        <kbd>Ctrl + Enter</kbd>
                        <span>快速分析</span>
                    </div>
                    <div class="shortcut-item">
                        <kbd>F1</kbd>
                        <span>显示帮助</span>
                    </div>
                    <div class="shortcut-item">
                        <kbd>Esc</kbd>
                        <span>关闭弹窗</span>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(helpModal);
    }

    closeModals() {
        const modals = document.querySelectorAll('.education-modal, .emergency-modal, .help-modal');
        modals.forEach(modal => modal.remove());
    }

    showShortcutsHint() {
        setTimeout(() => {
            this.showNotification('💡 按F1查看快捷键帮助', 'info');
        }, 3000);
    }

    showNotification(message, type) {
        if (typeof showNotification === 'function') {
            showNotification(message, type);
        }
    }
}

new ShortcutsManager();