// 当用户点击插件图标时触发
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "extractList") {
    extractAndCopyList();
    sendResponse({ status: "done" });
  }
});

function extractAndCopyList() {
  // Use your specific selector: 'div.result a.title'
  const links = document.querySelectorAll('div.result a.title');
  
  if (links.length === 0) {
    showNotification("未找到匹配的元素");
    return;
  }

  // Extract text content from each link
  const texts = Array.from(links)
    .map(link => link.textContent.trim())
    .filter(text => text.length > 0);

  if (texts.length === 0) {
    showNotification("未提取到有效文本");
    return;
  }

  const result = texts.join('\n');

  // Copy to clipboard
  navigator.clipboard.writeText(result)
    .then(() => {
      showNotification(`✅ 已复制 ${texts.length} 项到剪贴板\n\n预览:\n${result.substring(0, 100)}...`);
    })
    .catch(err => {
      console.error('复制失败:', err);
      showNotification('❌ 复制失败，请手动复制');
    });
}

function showNotification(message) {
  // 创建一个临时浮动提示
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    background: #333;
    color: white;
    padding: 12px 16px;
    border-radius: 6px;
    font-family: -apple-system, BlinkMacSystemFont, sans-serif;
    font-size: 14px;
    max-width: 300px;
    z-index: 2147483647;
    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    white-space: pre-wrap;
  `;

  // 创建包含消息和关闭按钮的容器
  const container = document.createElement('div');
  container.style.cssText = `
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
  `;

  // 消息文本
  const textElement = document.createElement('div');
  textElement.textContent = message;
  textElement.style.cssText = `
    flex: 1;
    margin-right: 10px;
  `;

  // 关闭按钮
  const closeButton = document.createElement('button');
  closeButton.textContent = '×';
  closeButton.style.cssText = `
    background: none;
    border: none;
    color: white;
    font-size: 18px;
    cursor: pointer;
    padding: 0;
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    transition: background-color 0.2s;
  `;

  // 鼠标悬停效果
  closeButton.addEventListener('mouseenter', () => {
    closeButton.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
  });
  
  closeButton.addEventListener('mouseleave', () => {
    closeButton.style.backgroundColor = 'transparent';
  });

  // 关闭功能
  closeButton.addEventListener('click', () => {
    if (notification.parentNode) {
      notification.parentNode.removeChild(notification);
    }
  });

  // 组装元素
  container.appendChild(textElement);
  container.appendChild(closeButton);
  notification.appendChild(container);
  document.body.appendChild(notification);
}
