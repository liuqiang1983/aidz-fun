import { test, expect } from '@playwright/test';

const LAZYMAN_URL = 'https://lazymanchat.com/chat?session=ssn_3jCOEQJrEcW2&showMobileWorkspace=true&topic=tpc_oHHQN40XTkli';

test.describe('Lazy Man 平台功能测试', () => {
  test('探索Lazy Man平台', async ({ page }) => {
    console.log('访问Lazy Man...');
    await page.goto(LAZYMAN_URL);
    await page.waitForTimeout(5000);

    // 关闭系统公告弹窗（如果有）
    const okButton = page.locator('button:has-text("OK"), button:has-text("Cancel")').first();
    if (await okButton.count() > 0) {
      console.log('关闭系统公告弹窗');
      await okButton.click();
      await page.waitForTimeout(1000);
    }

    // 截图主界面
    await page.screenshot({ path: 'test-results/lazyman-main-interface.png', fullPage: true });
    console.log('已保存主界面截图');

    // 打印页面信息
    const title = await page.title();
    console.log('页面标题:', title);
    console.log('当前URL:', page.url());

    // 查找主要元素
    const buttons = await page.locator('button').count();
    const links = await page.locator('a').count();
    const inputs = await page.locator('input, textarea, [contenteditable="true"]').count();

    console.log('页面元素统计:', { buttons, links, inputs });

    // 查找侧边栏导航
    const sidebarItems = await page.locator('nav button, nav a, [role="navigation"] button, [role="navigation"] a').count();
    console.log('侧边栏导航项数量:', sidebarItems);

    // 查找聊天列表
    const chatList = await page.locator('text=Just Chat, text=Chat, [class*="chat"]').count();
    console.log('聊天相关元素:', chatList);

    // 尝试查找消息输入框
    const messageInput = page.locator('textarea[placeholder*="message"], textarea[placeholder*="输入"], input[placeholder*="message"], [contenteditable="true"]').first();

    if (await messageInput.count() > 0) {
      console.log('✅ 找到消息输入框');
      const placeholder = await messageInput.getAttribute('placeholder');
      console.log('输入框placeholder:', placeholder);

      // 尝试输入测试消息
      await messageInput.fill('你好，这是来自Playwright的测试消息！');
      await page.waitForTimeout(1000);

      await page.screenshot({ path: 'test-results/lazyman-with-test-message.png' });
      console.log('已输入测试消息并截图');

      // 查找发送按钮
      const sendButton = page.locator('button:has-text("发送"), button:has-text("Send"), button[type="submit"], button[aria-label*="send"]').first();
      if (await sendButton.count() > 0) {
        console.log('找到发送按钮');
        // 不实际发送，只是测试
      }
    } else {
      console.log('❌ 未找到消息输入框');
    }

    // 保存认证状态
    await page.context().storageState({ path: 'test-results/lazyman-auth-state.json' });
    console.log('已保存认证状态');

    // 打印页面HTML结构（部分）
    const bodyHTML = await page.locator('body').innerHTML();
    console.log('页面HTML长度:', bodyHTML.length);
  });

  test('查看聊天历史', async ({ page }) => {
    console.log('访问Lazy Man...');
    await page.goto(LAZYMAN_URL);
    await page.waitForTimeout(5000);

    // 关闭弹窗
    const okButton = page.locator('button:has-text("OK")').first();
    if (await okButton.count() > 0) {
      await okButton.click();
      await page.waitForTimeout(1000);
    }

    // 查找聊天消息
    const messages = await page.locator('[class*="message"], [role="listitem"]').count();
    console.log('消息数量:', messages);

    // 查找用户列表或助手列表
    const assistants = await page.locator('text=/Claude|GPT|AI|Assistant/i').count();
    console.log('AI助手相关元素:', assistants);

    // 截图
    await page.screenshot({ path: 'test-results/lazyman-chat-history.png', fullPage: true });
  });
});
