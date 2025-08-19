// 防骗教育模块
class EducationModule {
    constructor() {
        this.knowledgeBase = [
            {
                id: 1,
                title: "电信诈骗识别",
                content: "常见电信诈骗手段包括冒充公检法、银行客服等...",
                category: "电信诈骗",
                difficulty: "初级",
                quiz: [
                    {
                        question: "接到自称银行客服的电话要求提供密码，应该？",
                        options: ["立即提供", "挂断电话", "询问详情", "转账验证"],
                        correct: 1
                    }
                ]
            },
            {
                id: 2,
                title: "网络投资陷阱",
                content: "高收益投资平台的识别方法...",
                category: "投资诈骗",
                difficulty: "中级",
                quiz: [
                    {
                        question: "看到"日收益20%"的投资广告，应该？",
                        options: ["立即投资", "谨慎评估", "小额尝试", "忽略广告"],
                        correct: 1
                    }
                ]
            }
        ];
        this.userProgress = JSON.parse(localStorage.getItem('educationProgress') || '{}');
    }

    displayKnowledge() {
        const container = document.getElementById('education-content');
        if (!container) return;

        container.innerHTML = `
            <div class="knowledge-grid">
                ${this.knowledgeBase.map(item => `
                    <div class="knowledge-card" onclick="educationModule.showDetail(${item.id})">
                        <h3>${item.title}</h3>
                        <span class="category">${item.category}</span>
                        <span class="difficulty ${item.difficulty}">${item.difficulty}</span>
                        <div class="progress-bar">
                            <div class="progress" style="width: ${this.userProgress[item.id] || 0}%"></div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    showDetail(id) {
        const item = this.knowledgeBase.find(k => k.id === id);
        if (!item) return;

        const modal = document.createElement('div');
        modal.className = 'education-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close" onclick="this.parentElement.parentElement.remove()">&times;</span>
                <h2>${item.title}</h2>
                <div class="content">${item.content}</div>
                <button onclick="educationModule.startQuiz(${id})" class="quiz-btn">开始测试</button>
            </div>
        `;
        document.body.appendChild(modal);
    }

    startQuiz(id) {
        const item = this.knowledgeBase.find(k => k.id === id);
        let currentQuestion = 0;
        let score = 0;

        const showQuestion = () => {
            if (currentQuestion >= item.quiz.length) {
                this.completeQuiz(id, score, item.quiz.length);
                return;
            }

            const q = item.quiz[currentQuestion];
            const modal = document.querySelector('.education-modal .modal-content');
            modal.innerHTML = `
                <h3>问题 ${currentQuestion + 1}/${item.quiz.length}</h3>
                <p>${q.question}</p>
                <div class="quiz-options">
                    ${q.options.map((option, index) => `
                        <button onclick="educationModule.answerQuestion(${index}, ${q.correct})" class="option-btn">
                            ${option}
                        </button>
                    `).join('')}
                </div>
            `;
        };

        showQuestion();
        
        this.answerQuestion = (selected, correct) => {
            if (selected === correct) score++;
            currentQuestion++;
            setTimeout(showQuestion, 1000);
        };
    }

    completeQuiz(id, score, total) {
        const percentage = Math.round((score / total) * 100);
        this.userProgress[id] = percentage;
        localStorage.setItem('educationProgress', JSON.stringify(this.userProgress));

        const modal = document.querySelector('.education-modal .modal-content');
        modal.innerHTML = `
            <h3>测试完成！</h3>
            <p>得分: ${score}/${total} (${percentage}%)</p>
            <button onclick="this.parentElement.parentElement.remove()" class="close-btn">关闭</button>
        `;
    }
}

const educationModule = new EducationModule();