import { test, expect } from '@playwright/test';

const LAZYMAN_URL = 'https://lazymanchat.com/chat?session=ssn_3jCOEQJrEcW2&showMobileWorkspace=true&topic=tpc_oHHQN40XTkli';

test.describe('Lazy Man Platform', () => {
  test('访问Lazy Man平台并等待加载完成', async ({ page }) => {
    console.log('正在访问:', LAZYMAN_URL);

    // 访问页面
    await page.goto(LAZYMAN_URL, { waitUntil: 'domcontentloaded' });

    // 等待加载动画消失
    console.log('等待页面加载...');
    try {
      await page.waitForSelector('text=Loading', { state: 'hidden', timeout: 30000 });
      console.log('加载动画已消失');
    } catch (e) {
      console.log('等待加载动画超时，继续...');
    }

    // 额外等待确保内容加载
    await page.waitForTimeout(5000);

    // 截图
    await page.screenshot({ path: 'test-results/lazyman-loaded.png', fullPage: true });
    console.log('已保存截图: test-results/lazyman-loaded.png');

    // 打印页面信息
    const title = await page.title();
    console.log('页面标题:', title);
    console.log('当前URL:', page.url());

    // 检查页面内容
    const bodyText = await page.locator('body').innerText();
    console.log('页面内容长度:', bodyText.length);

    // 查找主要元素
    const chatInput = await page.locator('textarea, input[type="text"], [contenteditable="true"]').count();
    const buttons = await page.locator('button').count();
    const links = await page.locator('a').count();

    console.log('页面元素统计:', { chatInput, buttons, links });

    // 如果有聊天输入框，打印其placeholder
    if (chatInput > 0) {
      const inputElement = page.locator('textarea, input[type="text"], [contenteditable="true"]').first();
      const placeholder = await inputElement.getAttribute('placeholder');
      console.log('输入框placeholder:', placeholder);
    }

    // 保存storage state
    await page.context().storageState({ path: 'test-results/lazyman-auth.json' });
    console.log('已保存认证状态');
  });

  test('测试聊天功能', async ({ page }) => {
    console.log('访问Lazy Man...');
    await page.goto(LAZYMAN_URL);

    // 等待页面加载
    await page.waitForTimeout(8000);

    // 查找聊天输入框
    const chatInput = page.locator('textarea, input[type="text"], [contenteditable="true"]').first();

    if (await chatInput.count() > 0) {
      console.log('找到聊天输入框');

      // 输入测试消息
      await chatInput.fill('你好，这是一个测试消息');
      await page.waitForTimeout(1000);

      // 截图
      await page.screenshot({ path: 'test-results/lazyman-with-message.png' });
      console.log('已输入测试消息并截图');

      // 查找发送按钮
      const sendButton = page.locator('button:has-text("发送"), button:has-text("Send"), button[type="submit"]').first();
      if (await sendButton.count() > 0) {
        console.log('找到发送按钮');
        // 注意：这里不实际点击发送，只是测试是否能找到
      }
    } else {
      console.log('未找到聊天输入框');
      await page.screenshot({ path: 'test-results/lazyman-no-input.png', fullPage: true });
    }
  });
});
