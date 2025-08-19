// UI组件交互功能

// 折叠面板功能
function toggleAccordion(index) {
    const accordionItems = document.querySelectorAll('.accordion-content');
    const accordionIcons = document.querySelectorAll('.accordion-icon');
    
    // 关闭其他面板
    accordionItems.forEach((item, i) => {
        if (i !== index) {
            item.classList.remove('active');
            accordionIcons[i].classList.remove('active');
        }
    });
    
    // 切换当前面板
    accordionItems[index].classList.toggle('active');
    accordionIcons[index].classList.toggle('active');
}

// 模态框功能
function showModal(title, content) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="modal-close" onclick="closeModal(this)">&times;</span>
            <h2>${title}</h2>
            <div>${content}</div>
        </div>
    `;
    
    document.body.appendChild(modal);
    modal.style.display = 'block';
    
    // 点击背景关闭
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal(modal.querySelector('.modal-close'));
        }
    });
}

function closeModal(closeBtn) {
    const modal = closeBtn.closest('.modal');
    modal.style.display = 'none';
    setTimeout(() => {
        document.body.removeChild(modal);
    }, 300);
}

// 开关组件功能
function setupSwitches() {
    const switches = document.querySelectorAll('.switch input');
    switches.forEach(switchEl => {
        switchEl.addEventListener('change', function() {
            const label = this.closest('.switch-label');
            const badge = label.querySelector('.badge');
            
            if (this.checked) {
                badge.textContent = '已启用';
                badge.className = 'badge badge-success';
            } else {
                badge.textContent = '未启用';
                badge.className = 'badge badge-danger';
            }
        });
    });
}

// 评分组件功能
function setupRating() {
    const ratings = document.querySelectorAll('.rating');
    ratings.forEach(rating => {
        const stars = rating.querySelectorAll('.star');
        stars.forEach((star, index) => {
            star.addEventListener('click', function() {
                // 清除所有星星
                stars.forEach(s => s.classList.remove('active'));
                // 点亮当前及之前的星星
                for (let i = 0; i <= index; i++) {
                    stars[i].classList.add('active');
                }
            });
        });
    });
}

// 步骤条功能
function updateSteps(currentStep) {
    const steps = document.querySelectorAll('.step');
    steps.forEach((step, index) => {
        step.classList.remove('active', 'completed');
        if (index < currentStep) {
            step.classList.add('completed');
        } else if (index === currentStep) {
            step.classList.add('active');
        }
    });
}

// 分页功能
function createPagination(container, totalPages, currentPage, onPageChange) {
    const pagination = document.createElement('div');
    pagination.className = 'pagination';
    
    // 上一页按钮
    const prevBtn = document.createElement('button');
    prevBtn.textContent = '上一页';
    prevBtn.disabled = currentPage === 0;
    prevBtn.addEventListener('click', () => {
        if (currentPage > 0) {
            onPageChange(currentPage - 1);
        }
    });
    pagination.appendChild(prevBtn);
    
    // 页码按钮
    for (let i = 0; i < totalPages; i++) {
        const pageBtn = document.createElement('button');
        pageBtn.textContent = i + 1;
        pageBtn.className = i === currentPage ? 'active' : '';
        pageBtn.addEventListener('click', () => onPageChange(i));
        pagination.appendChild(pageBtn);
    }
    
    // 下一页按钮
    const nextBtn = document.createElement('button');
    nextBtn.textContent = '下一页';
    nextBtn.disabled = currentPage === totalPages - 1;
    nextBtn.addEventListener('click', () => {
        if (currentPage < totalPages - 1) {
            onPageChange(currentPage + 1);
        }
    });
    pagination.appendChild(nextBtn);
    
    container.appendChild(pagination);
}

// 面包屑导航
function updateBreadcrumb(path) {
    const breadcrumb = document.querySelector('.breadcrumb');
    if (!breadcrumb) return;
    
    breadcrumb.innerHTML = '';
    path.forEach((item, index) => {
        const breadcrumbItem = document.createElement('div');
        breadcrumbItem.className = 'breadcrumb-item';
        
        if (index === path.length - 1) {
            breadcrumbItem.textContent = item.name;
        } else {
            const link = document.createElement('a');
            link.href = item.url || '#';
            link.textContent = item.name;
            breadcrumbItem.appendChild(link);
        }
        
        breadcrumb.appendChild(breadcrumbItem);
    });
}

// 时间轴添加项目
function addTimelineItem(container, date, title, content) {
    const timelineItem = document.createElement('div');
    timelineItem.className = 'timeline-item';
    timelineItem.innerHTML = `
        <div class="timeline-date">${date}</div>
        <div class="timeline-content">
            <strong>${title}</strong>
            <p>${content}</p>
        </div>
    `;
    
    container.insertBefore(timelineItem, container.firstChild);
}

// 卡片网格动态添加
function addMiniCard(container, title, content, type = 'info') {
    const card = document.createElement('div');
    card.className = 'mini-card';
    card.style.borderLeftColor = {
        'success': '#27ae60',
        'warning': '#f39c12',
        'danger': '#e74c3c',
        'info': '#3498db'
    }[type];
    
    card.innerHTML = `
        <div class="mini-card-title">${title}</div>
        <div class="mini-card-content">${content}</div>
    `;
    
    container.appendChild(card);
}

// 工具提示初始化
function initTooltips() {
    const tooltips = document.querySelectorAll('.tooltip');
    tooltips.forEach(tooltip => {
        tooltip.addEventListener('mouseenter', function() {
            const tooltipText = this.querySelector('.tooltiptext');
            if (tooltipText) {
                tooltipText.style.visibility = 'visible';
                tooltipText.style.opacity = '1';
            }
        });
        
        tooltip.addEventListener('mouseleave', function() {
            const tooltipText = this.querySelector('.tooltiptext');
            if (tooltipText) {
                tooltipText.style.visibility = 'hidden';
                tooltipText.style.opacity = '0';
            }
        });
    });
}

// 标签管理
function addTag(container, text, type = 'primary') {
    const tag = document.createElement('span');
    tag.className = `tag tag-${type}`;
    tag.textContent = text;
    
    // 添加删除功能
    tag.addEventListener('click', function() {
        this.remove();
    });
    
    container.appendChild(tag);
}

// 进度条动画
function animateProgressBar(progressBar, targetWidth, duration = 1000) {
    const startWidth = 0;
    const startTime = performance.now();
    
    function animate(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const currentWidth = startWidth + (targetWidth - startWidth) * progress;
        
        progressBar.style.width = currentWidth + '%';
        
        if (progress < 1) {
            requestAnimationFrame(animate);
        }
    }
    
    requestAnimationFrame(animate);
}

// 初始化所有组件
function initComponents() {
    setupSwitches();
    setupRating();
    initTooltips();
    
    // 添加键盘支持
    document.addEventListener('keydown', function(e) {
        // ESC关闭模态框
        if (e.key === 'Escape') {
            const modals = document.querySelectorAll('.modal');
            modals.forEach(modal => {
                const closeBtn = modal.querySelector('.modal-close');
                if (closeBtn) closeModal(closeBtn);
            });
        }
    });
}

// 页面加载时初始化组件
document.addEventListener('DOMContentLoaded', function() {
    initComponents();
});

// 导出函数供其他模块使用
window.UIComponents = {
    showModal,
    closeModal,
    toggleAccordion,
    updateSteps,
    createPagination,
    updateBreadcrumb,
    addTimelineItem,
    addMiniCard,
    addTag,
    animateProgressBar
};