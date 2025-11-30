// 监听来自 popup 的消息
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "extractList") {
    // 提取所有 ul > li 的文本
    const liTexts = Array.from(document.querySelectorAll('ul li'))
      .map(li => li.textContent.trim())
      .filter(text => text.length > 0);

    if (liTexts.length === 0) {
      sendResponse({ error: "未找到有效的 <li> 元素" });
      return true; // 即使同步也要 return true 保持一致性
    }

    const result = liTexts.join('\n');

    // 异步复制到剪贴板
    navigator.clipboard.writeText(result)
      .then(() => {
        sendResponse({ count: liTexts.length });
      })
      .catch(err => {
        sendResponse({ error: "复制失败: " + err.message });
      });

    return true; // 告诉 Chrome 我们会异步调用 sendResponse
  }
});