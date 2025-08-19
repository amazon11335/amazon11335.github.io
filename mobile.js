// 移动端专用JavaScript功能

// 移动端检测
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

// 移动端初始化
function initMobile() {
    if (isMobile || isTouch) {
        setupTouchEvents();
        setupMobileNavigation();
        setupMobileOptimizations();
        preventZoom();
    }
}

// 设置触摸事件
function setupTouchEvents() {
    let touchStartY = 0;
    let touchEndY = 0;
    
    // 下拉刷新
    document.addEventListener('touchstart', function(e) {
        touchStartY = e.changedTouches[0].screenY;
    });
    
    document.addEventListener('touchend', function(e) {
        touchEndY = e.changedTouches[0].screenY;
        handleSwipe();
    });
    
    function handleSwipe() {
        const swipeDistance = touchEndY - touchStartY;
        const minSwipeDistance = 100;
        
        // 下拉刷新
        if (swipeDistance > minSwipeDistance && window.scrollY === 0) {
            showNotification('页面已刷新', 'success');
            setTimeout(() => {
                location.reload();
            }, 500);
        }
    }
    
    // 长按菜单
    let longPressTimer;
    document.addEventListener('touchstart', function(e) {
        const target = e.target;
        if (target.classList.contains('card') || target.classList.contains('btn')) {
            longPressTimer = setTimeout(() => {
                showContextMenu(e, target);
            }, 800);
        }
    });
    
    document.addEventListener('touchend', function() {
        clearTimeout(longPressTimer);
    });
    
    document.addEventListener('touchmove', function() {
        clearTimeout(longPressTimer);
    });
}

// 显示上下文菜单
function showContextMenu(e, target) {
    const menu = document.createElement('div');
    menu.className = 'context-menu';
    menu.style.cssText = `
        position: fixed;
        background: white;
        border-radius: 8px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.3);
        padding: 10px 0;
        z-index: 2000;
        min-width: 150px;
    `;
    
    const menuItems = [
        { text: '复制', action: () => copyToClipboard(target.textContent) },
        { text: '分享', action: () => shareContent(target) },
        { text: '收藏', action: () => bookmarkItem(target) }
    ];
    
    menuItems.forEach(item => {
        const menuItem = document.createElement('div');
        menuItem.textContent = item.text;
        menuItem.style.cssText = `
            padding: 10px 20px;
            cursor: pointer;
            border-bottom: 1px solid #eee;
        `;
        menuItem.addEventListener('click', () => {
            item.action();
            document.body.removeChild(menu);
        });
        menu.appendChild(menuItem);
    });
    
    // 定位菜单
    const touch = e.changedTouches[0];
    menu.style.left = touch.clientX + 'px';
    menu.style.top = touch.clientY + 'px';
    
    document.body.appendChild(menu);
    
    // 点击其他地方关闭菜单
    setTimeout(() => {
        document.addEventListener('click', function closeMenu() {
            if (document.body.contains(menu)) {
                document.body.removeChild(menu);
            }
            document.removeEventListener('click', closeMenu);
        });
    }, 100);
}

// 设置移动端导航
function setupMobileNavigation() {
    const navTabs = document.querySelector('.nav-tabs .container');
    let isScrolling = false;
    
    // 平滑滚动到活动标签
    function scrollToActiveTab() {
        const activeTab = document.querySelector('.tab-btn.active');
        if (activeTab && navTabs) {
            const tabRect = activeTab.getBoundingClientRect();
            const containerRect = navTabs.getBoundingClientRect();
            
            if (tabRect.left < containerRect.left || tabRect.right > containerRect.right) {
                activeTab.scrollIntoView({ 
                    behavior: 'smooth', 
                    inline: 'center',
                    block: 'nearest'
                });
            }
        }
    }
    
    // 监听标签切换
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('tab-btn')) {
            setTimeout(scrollToActiveTab, 100);
        }
    });
    
    // 添加滚动指示器
    if (navTabs) {
        const scrollIndicator = document.createElement('div');
        scrollIndicator.style.cssText = `
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            height: 2px;
            background: linear-gradient(90deg, transparent, #3498db, transparent);
            opacity: 0;
            transition: opacity 0.3s;
        `;
        navTabs.style.position = 'relative';
        navTabs.appendChild(scrollIndicator);
        
        navTabs.addEventListener('scroll', function() {
            scrollIndicator.style.opacity = '1';
            clearTimeout(isScrolling);
            isScrolling = setTimeout(() => {
                scrollIndicator.style.opacity = '0';
            }, 1000);
        });
    }
}

// 移动端优化
function setupMobileOptimizations() {
    // 优化输入框体验
    const inputs = document.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        // 防止输入时页面缩放
        input.addEventListener('focus', function() {
            if (window.innerWidth < 768) {
                document.querySelector('meta[name=viewport]').setAttribute(
                    'content', 
                    'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no'
                );
            }
        });
        
        input.addEventListener('blur', function() {
            document.querySelector('meta[name=viewport]').setAttribute(
                'content', 
                'width=device-width, initial-scale=1.0'
            );
        });
    });
    
    // 优化按钮点击反馈
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('touchstart', function() {
            this.style.transform = 'scale(0.95)';
        });
        
        button.addEventListener('touchend', function() {
            this.style.transform = 'scale(1)';
        });
    });
    
    // 添加返回顶部按钮
    createBackToTopButton();
    
    // 优化模态框
    optimizeModalsForMobile();
}

// 防止意外缩放
function preventZoom() {
    document.addEventListener('gesturestart', function(e) {
        e.preventDefault();
    });
    
    document.addEventListener('gesturechange', function(e) {
        e.preventDefault();
    });
    
    document.addEventListener('gestureend', function(e) {
        e.preventDefault();
    });
}

// 创建返回顶部按钮
function createBackToTopButton() {
    const backToTop = document.createElement('button');
    backToTop.innerHTML = '↑';
    backToTop.className = 'back-to-top';
    backToTop.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: #3498db;
        color: white;
        border: none;
        font-size: 20px;
        cursor: pointer;
        z-index: 1000;
        opacity: 0;
        transform: translateY(100px);
        transition: all 0.3s ease;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
    `;
    
    document.body.appendChild(backToTop);
    
    // 显示/隐藏按钮
    window.addEventListener('scroll', function() {
        if (window.scrollY > 300) {
            backToTop.style.opacity = '1';
            backToTop.style.transform = 'translateY(0)';
        } else {
            backToTop.style.opacity = '0';
            backToTop.style.transform = 'translateY(100px)';
        }
    });
    
    // 点击返回顶部
    backToTop.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// 优化移动端模态框
function optimizeModalsForMobile() {
    const originalShowModal = window.UIComponents?.showModal;
    if (originalShowModal) {
        window.UIComponents.showModal = function(title, content) {
            const modal = originalShowModal(title, content);
            
            if (isMobile) {
                const modalContent = modal.querySelector('.modal-content');
                modalContent.style.cssText += `
                    max-height: 90vh;
                    overflow-y: auto;
                    -webkit-overflow-scrolling: touch;
                `;
                
                // 添加滑动关闭
                let startY = 0;
                modalContent.addEventListener('touchstart', function(e) {
                    startY = e.touches[0].clientY;
                });
                
                modalContent.addEventListener('touchmove', function(e) {
                    const currentY = e.touches[0].clientY;
                    const diff = currentY - startY;
                    
                    if (diff > 0 && modalContent.scrollTop === 0) {
                        modalContent.style.transform = `translateY(${diff * 0.5}px)`;
                    }
                });
                
                modalContent.addEventListener('touchend', function(e) {
                    const currentY = e.changedTouches[0].clientY;
                    const diff = currentY - startY;
                    
                    if (diff > 100) {
                        window.UIComponents.closeModal(modal.querySelector('.modal-close'));
                    } else {
                        modalContent.style.transform = 'translateY(0)';
                    }
                });
            }
            
            return modal;
        };
    }
}

// 复制到剪贴板
function copyToClipboard(text) {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(() => {
            showNotification('已复制到剪贴板', 'success');
        });
    } else {
        // 降级方案
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        showNotification('已复制到剪贴板', 'success');
    }
}

// 分享内容
function shareContent(element) {
    if (navigator.share) {
        navigator.share({
            title: '反诈骗防护中心',
            text: element.textContent,
            url: window.location.href
        });
    } else {
        copyToClipboard(window.location.href);
        showNotification('链接已复制，可以分享给朋友', 'info');
    }
}

// 收藏项目
function bookmarkItem(element) {
    const bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]');
    const bookmark = {
        text: element.textContent.substring(0, 100),
        timestamp: new Date().toISOString(),
        type: element.className
    };
    
    bookmarks.unshift(bookmark);
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks.slice(0, 50)));
    showNotification('已添加到收藏', 'success');
}

// 获取设备信息
function getDeviceInfo() {
    return {
        isMobile: isMobile,
        isTouch: isTouch,
        screenWidth: window.screen.width,
        screenHeight: window.screen.height,
        viewportWidth: window.innerWidth,
        viewportHeight: window.innerHeight,
        devicePixelRatio: window.devicePixelRatio || 1,
        orientation: window.orientation || 0,
        userAgent: navigator.userAgent
    };
}

// 性能监控
function monitorPerformance() {
    if ('performance' in window) {
        window.addEventListener('load', function() {
            setTimeout(() => {
                const perfData = performance.getEntriesByType('navigation')[0];
                const loadTime = perfData.loadEventEnd - perfData.loadEventStart;
                
                if (loadTime > 3000) {
                    console.warn('页面加载时间较长:', loadTime + 'ms');
                }
            }, 0);
        });
    }
}

// 初始化移动端功能
document.addEventListener('DOMContentLoaded', function() {
    initMobile();
    monitorPerformance();
    
    // 添加移动端样式类
    if (isMobile) {
        document.body.classList.add('mobile-device');
    }
    
    if (isTouch) {
        document.body.classList.add('touch-device');
    }
});

// 导出移动端工具函数
window.MobileUtils = {
    isMobile,
    isTouch,
    getDeviceInfo,
    copyToClipboard,
    shareContent,
    bookmarkItem
};