// 语音提醒功能
class VoiceAlerts {
    constructor() {
        this.synthesis = window.speechSynthesis;
        this.enabled = localStorage.getItem('voiceEnabled') === 'true';
        this.init();
    }

    init() {
        this.addVoiceToggle();
    }

    speak(text, priority = 'normal') {
        if (!this.enabled || !this.synthesis) return;

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'zh-CN';
        utterance.rate = priority === 'urgent' ? 1.2 : 0.9;
        utterance.pitch = priority === 'urgent' ? 1.2 : 1.0;
        utterance.volume = priority === 'urgent' ? 1.0 : 0.8;

        this.synthesis.speak(utterance);
    }

    addVoiceToggle() {
        const header = document.querySelector('.header .container');
        if (!header) return;

        const toggle = document.createElement('div');
        toggle.className = 'voice-toggle';
        toggle.innerHTML = `
            <label class="voice-switch">
                <input type="checkbox" ${this.enabled ? 'checked' : ''} onchange="voiceAlerts.toggleVoice(this)">
                <span>🔊 语音提醒</span>
            </label>
        `;
        header.appendChild(toggle);
    }

    toggleVoice(checkbox) {
        this.enabled = checkbox.checked;
        localStorage.setItem('voiceEnabled', this.enabled);
        
        if (this.enabled) {
            this.speak('语音提醒已开启');
        }
    }

    alertRisk(riskLevel) {
        const messages = {
            high: '检测到高风险内容，请立即停止操作！',
            medium: '发现可疑内容，请谨慎处理',
            low: '内容相对安全'
        };
        
        const priority = riskLevel === 'high' ? 'urgent' : 'normal';
        this.speak(messages[riskLevel] || messages.low, priority);
    }
}

const voiceAlerts = new VoiceAlerts();