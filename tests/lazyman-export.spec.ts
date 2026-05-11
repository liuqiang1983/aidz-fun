import { test, expect } from '@playwright/test';

const LAZYMAN_URL = 'https://lazymanchat.com';

test.describe('Lazy Man 内容导出功能探索', () => {
  test('生成内容并查找导出下载功能', async ({ page }) => {
    console.log('\n=== 探索Lazy Man内容导出功能 ===\n');
    
    // 访问平台
    await page.goto(LAZYMAN_URL);
    await page.waitForTimeout(3000);

    // 关闭系统公告弹窗
    const okButton = page.locator('button:has-text("OK")').first();
    if (await okButton.count() > 0) {
      await okButton.click();
      await page.waitForTimeout(1000);
    }

    // 发送一个测试消息，让AI生成内容
    console.log('📝 发送测试消息...');
    const messageInput = page.locator('textarea, [contenteditable="true"]').first();
    
    if (await messageInput.count() > 0) {
      const testPrompt = '请写一篇关于AI Agent的简短介绍，包括定义、特点和应用场景，约300字。';
      await messageInput.fill(testPrompt);
      await page.waitForTimeout(1000);

      // 发送消息
      const sendButton = page.locator('button[type="submit"], button:has-text("Send")').first();
      if (await sendButton.count() > 0) {
        console.log('🚀 发送消息...');
        await sendButton.click();
        
        // 等待AI回复
        console.log('⏳ 等待AI生成内容（约15秒）...');
        await page.waitForTimeout(15000);

        // 截图生成的内容
        await page.screenshot({ path: 'test-results/lazyman-generated-content.png', fullPage: true });
        console.log('📸 已保存生成内容截图');
      }
    }

    // 查找导出/下载相关的按钮和功能
    console.log('\n🔍 查找导出和下载功能...\n');

    // 可能的导出按钮位置
    const exportButtons = [
      'button:has-text("导出")',
      'button:has-text("下载")',
      'button:has-text("Export")',
      'button:has-text("Download")',
      'button:has-text("PDF")',
      'button:has-text("Word")',
      'button:has-text("Markdown")',
      'button:has-text("保存")',
      'button:has-text("Save")',
      '[class*="export"]',
      '[class*="download"]',
      '[class*="share"]',
      'button[aria-label*="export"]',
      'button[aria-label*="download"]',
      'button[aria-label*="share"]'
    ];

    for (const selector of exportButtons) {
      const count = await page.locator(selector).count();
      if (count > 0) {
        console.log(`✅ 找到: ${selector} (${count}个)`);
      }
    }

    // 查找顶部工具栏
    console.log('\n🔍 检查顶部工具栏...');
    const topToolbar = page.locator('header, nav, [class*="toolbar"], [class*="header"]').first();
    if (await topToolbar.count() > 0) {
      const toolbarButtons = await topToolbar.locator('button, [role="button"]').allTextContents();
      console.log('顶部工具栏按钮:', toolbarButtons);
    }

    // 查找消息区域的操作按钮
    console.log('\n🔍 检查消息区域操作按钮...');
    const messageArea = page.locator('[class*="message"], [class*="chat"]').first();
    if (await messageArea.count() > 0) {
      // 悬停在消息上可能会显示操作按钮
      await messageArea.hover();
      await page.waitForTimeout(1000);
      
      await page.screenshot({ path: 'test-results/lazyman-message-hover.png', fullPage: true });
      console.log('📸 已保存悬停状态截图');
    }

    // 查找右侧面板的功能
    console.log('\n🔍 检查右侧面板...');
    const rightPanel = page.locator('[class*="sidebar"], [class*="panel"]').last();
    if (await rightPanel.count() > 0) {
      const panelContent = await rightPanel.locator('button, a').allTextContents();
      console.log('右侧面板按钮:', panelContent);
    }

    // 查找所有图标按钮（可能是下载、分享等）
    console.log('\n🔍 查找所有图标按钮...');
    const iconButtons = await page.locator('button:has(svg), button:has(img)').count();
    console.log(`找到 ${iconButtons} 个图标按钮`);

    // 尝试点击更多菜单（通常是三个点）
    console.log('\n🔍 查找更多菜单...');
    const moreButton = page.locator('button[aria-label*="more"], button:has-text("···"), button:has-text("⋯")').first();
    if (await moreButton.count() > 0) {
      console.log('✅ 找到更多菜单按钮');
      await moreButton.click();
      await page.waitForTimeout(1000);
      
      await page.screenshot({ path: 'test-results/lazyman-more-menu.png', fullPage: true });
      console.log('📸 已保存更多菜单截图');
      
      // 查找菜单项
      const menuItems = await page.locator('[role="menu"] button, [role="menuitem"]').allTextContents();
      console.log('菜单项:', menuItems);
    }

    // 查找分享按钮
    console.log('\n🔍 查找分享功能...');
    const shareButton = page.locator('button:has-text("分享"), button:has-text("Share"), [class*="share"]').first();
    if (await shareButton.count() > 0) {
      console.log('✅ 找到分享按钮');
      await shareButton.click();
      await page.waitForTimeout(1000);
      
      await page.screenshot({ path: 'test-results/lazyman-share-options.png', fullPage: true });
      console.log('📸 已保存分享选项截图');
    }

    // 保存页面HTML以便分析
    const bodyHTML = await page.locator('body').innerHTML();
    const fs = require('fs');
    fs.writeFileSync('test-results/lazyman-export-page.html', bodyHTML);
    console.log('\n📄 已保存页面HTML到 test-results/lazyman-export-page.html');

    // 打印当前URL
    console.log('\n📍 当前URL:', page.url());
  });

  test('测试右键菜单功能', async ({ page }) => {
    console.log('\n=== 测试右键菜单 ===\n');
    
    await page.goto(LAZYMAN_URL);
    await page.waitForTimeout(3000);

    // 关闭弹窗
    const okButton = page.locator('button:has-text("OK")').first();
    if (await okButton.count() > 0) {
      await okButton.click();
      await page.waitForTimeout(1000);
    }

    // 发送测试消息
    const messageInput = page.locator('textarea, [contenteditable="true"]').first();
    if (await messageInput.count() > 0) {
      await messageInput.fill('写一段简短的AI介绍');
      const sendButton = page.locator('button[type="submit"]').first();
      if (await sendButton.count() > 0) {
        await sendButton.click();
        await page.waitForTimeout(10000);
      }
    }

    // 在消息区域右键点击
    console.log('🖱️ 在消息区域右键点击...');
    const messageArea = page.locator('[class*="message"], [class*="assistant"]').first();
    if (await messageArea.count() > 0) {
      await messageArea.click({ button: 'right' });
      await page.waitForTimeout(1000);
      
      await page.screenshot({ path: 'test-results/lazyman-right-click-menu.png', fullPage: true });
      console.log('📸 已保存右键菜单截图');
      
      // 查找右键菜单项
      const contextMenu = page.locator('[role="menu"], [class*="context-menu"], [class*="dropdown"]');
      if (await contextMenu.count() > 0) {
        const menuItems = await contextMenu.locator('button, [role="menuitem"]').allTextContents();
        console.log('右键菜单项:', menuItems);
      }
    }
  });
});
