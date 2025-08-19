// 举报系统
class ReportSystem {
    constructor() {
        this.reports = JSON.parse(localStorage.getItem('userReports') || '[]');
        this.emergencyContacts = [
            { name: "反诈中心", phone: "96110", type: "官方" },
            { name: "公安报警", phone: "110", type: "紧急" },
            { name: "消费者投诉", phone: "12315", type: "消费" }
        ];
    }

    showReportForm() {
        const container = document.getElementById('report-content');
        if (!container) return;

        container.innerHTML = `
            <div class="report-form">
                <h3>诈骗举报</h3>
                <form id="reportForm">
                    <div class="form-group">
                        <label>诈骗类型</label>
                        <select name="type" required>
                            <option value="">请选择</option>
                            <option value="电信诈骗">电信诈骗</option>
                            <option value="网络诈骗">网络诈骗</option>
                            <option value="投资诈骗">投资诈骗</option>
                            <option value="其他">其他</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>诈骗内容</label>
                        <textarea name="content" placeholder="请详细描述诈骗过程..." required></textarea>
                    </div>
                    <div class="form-group">
                        <label>联系方式</label>
                        <input type="text" name="contact" placeholder="诈骗者电话/网址等">
                    </div>
                    <div class="form-group">
                        <label>证据文件</label>
                        <input type="file" name="evidence" multiple accept="image/*,.pdf,.doc,.docx">
                    </div>
                    <div class="form-actions">
                        <button type="submit">提交举报</button>
                        <button type="button" onclick="reportSystem.showEmergencyContacts()">紧急求助</button>
                    </div>
                </form>
            </div>
            <div class="report-history">
                <h3>举报记录</h3>
                <div id="reportList">${this.renderReportList()}</div>
            </div>
        `;

        document.getElementById('reportForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.submitReport(new FormData(e.target));
        });
    }

    submitReport(formData) {
        const report = {
            id: Date.now(),
            type: formData.get('type'),
            content: formData.get('content'),
            contact: formData.get('contact'),
            timestamp: new Date().toLocaleString(),
            status: '已提交'
        };

        this.reports.unshift(report);
        localStorage.setItem('userReports', JSON.stringify(this.reports));
        
        this.showSuccess('举报已提交，感谢您的配合！');
        document.getElementById('reportList').innerHTML = this.renderReportList();
        document.getElementById('reportForm').reset();
    }

    renderReportList() {
        if (this.reports.length === 0) {
            return '<p class="no-reports">暂无举报记录</p>';
        }

        return this.reports.map(report => `
            <div class="report-item">
                <div class="report-header">
                    <span class="report-type">${report.type}</span>
                    <span class="report-time">${report.timestamp}</span>
                    <span class="report-status ${report.status}">${report.status}</span>
                </div>
                <div class="report-content">${report.content.substring(0, 100)}...</div>
            </div>
        `).join('');
    }

    showEmergencyContacts() {
        const modal = document.createElement('div');
        modal.className = 'emergency-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close" onclick="this.parentElement.parentElement.remove()">&times;</span>
                <h3>紧急联系方式</h3>
                <div class="contacts-list">
                    ${this.emergencyContacts.map(contact => `
                        <div class="contact-item">
                            <div class="contact-info">
                                <strong>${contact.name}</strong>
                                <span class="contact-type">${contact.type}</span>
                            </div>
                            <div class="contact-actions">
                                <span class="phone">${contact.phone}</span>
                                <button onclick="window.open('tel:${contact.phone}')" class="call-btn">拨打</button>
                            </div>
                        </div>
                    `).join('')}
                </div>
                <div class="emergency-tips">
                    <h4>紧急提醒</h4>
                    <ul>
                        <li>如正在遭受诈骗，请立即停止转账</li>
                        <li>保存所有聊天记录和转账凭证</li>
                        <li>及时报警，配合调查</li>
                    </ul>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }

    showSuccess(message) {
        const toast = document.createElement('div');
        toast.className = 'success-toast';
        toast.textContent = message;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
    }
}

const reportSystem = new ReportSystem();