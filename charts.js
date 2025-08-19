// 数据可视化图表模块
class ChartsModule {
    constructor() {
        this.fraudData = this.generateFraudData();
    }

    generateFraudData() {
        return {
            trends: [
                { month: '1月', count: 120 },
                { month: '2月', count: 98 },
                { month: '3月', count: 156 },
                { month: '4月', count: 134 },
                { month: '5月', count: 89 },
                { month: '6月', count: 167 }
            ],
            types: [
                { name: '电信诈骗', value: 35, color: '#e74c3c' },
                { name: '投资诈骗', value: 28, color: '#f39c12' },
                { name: '情感诈骗', value: 20, color: '#9b59b6' },
                { name: '身份冒充', value: 17, color: '#3498db' }
            ]
        };
    }

    renderTrendChart(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const maxValue = Math.max(...this.fraudData.trends.map(d => d.count));
        
        container.innerHTML = `
            <div class="chart-container">
                <h4>诈骗趋势分析</h4>
                <div class="trend-chart">
                    ${this.fraudData.trends.map(item => `
                        <div class="trend-bar">
                            <div class="bar" style="height: ${(item.count / maxValue) * 100}%"></div>
                            <span class="label">${item.month}</span>
                            <span class="value">${item.count}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    renderPieChart(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const total = this.fraudData.types.reduce((sum, item) => sum + item.value, 0);
        let currentAngle = 0;

        container.innerHTML = `
            <div class="chart-container">
                <h4>诈骗类型分布</h4>
                <div class="pie-chart-container">
                    <svg class="pie-chart" viewBox="0 0 200 200">
                        ${this.fraudData.types.map(item => {
                            const percentage = (item.value / total) * 100;
                            const angle = (item.value / total) * 360;
                            const x1 = 100 + 80 * Math.cos((currentAngle - 90) * Math.PI / 180);
                            const y1 = 100 + 80 * Math.sin((currentAngle - 90) * Math.PI / 180);
                            const x2 = 100 + 80 * Math.cos((currentAngle + angle - 90) * Math.PI / 180);
                            const y2 = 100 + 80 * Math.sin((currentAngle + angle - 90) * Math.PI / 180);
                            const largeArc = angle > 180 ? 1 : 0;
                            
                            const path = `M 100 100 L ${x1} ${y1} A 80 80 0 ${largeArc} 1 ${x2} ${y2} Z`;
                            currentAngle += angle;
                            
                            return `<path d="${path}" fill="${item.color}" stroke="white" stroke-width="2"/>`;
                        }).join('')}
                    </svg>
                    <div class="pie-legend">
                        ${this.fraudData.types.map(item => `
                            <div class="legend-item">
                                <span class="legend-color" style="background: ${item.color}"></span>
                                <span>${item.name}: ${item.value}%</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
    }
}

const chartsModule = new ChartsModule();