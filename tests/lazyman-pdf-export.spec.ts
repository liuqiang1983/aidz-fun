import { test, expect } from '@playwright/test';
import * as fs from 'fs';

const LAZYMAN_URL = 'https://lazymanchat.com';

test.describe('Lazy Man PDF导出', () => {
  test('完整流程：生成内容并导出PDF', async ({ page }) => {
    console.log('\n=== Lazy Man PDF导出完整流程 ===\n');
    
    // 访问平台
    await page.goto(LAZYMAN_URL);
    await page.waitForTimeout(3000);

    // 关闭系统公告弹窗
    const okButton = page.locator('button:has-text("OK")').first();
    if (await okButton.count() > 0) {
      await okButton.click();
      await page.waitForTimeout(1000);
    }

    // 发送生成文章的请求
    console.log('📝 发送文章生成请求...');
    const messageInput = page.locator('textarea, [contenteditable="true"]').first();
    
    if (await messageInput.count() > 0) {
      const prompt = '请写一篇关于AI Agent的简短介绍，约300字';
      await messageInput.fill(prompt);
      await page.waitForTimeout(1000);

      // 发送消息
      const sendButton = page.locator('button[type="submit"]').first();
      if (await sendButton.count() > 0) {
        await sendButton.click();
        console.log('✅ 已发送消息');
        
        // 等待AI生成内容
        console.log('⏳ 等待AI生成内容（30秒）...');
        await page.waitForTimeout(30000);

        // 检查是否有AI回复
        const bodyText = await page.locator('body').innerText();
        console.log(`📊 页面内容长度: ${bodyText.length} 字符`);

        // 截图当前状态
        await page.screenshot({ path: 'test-results/lazyman-content.png', fullPage: true });
        console.log('📸 已保存内容截图');
      }
    }

    // 查找分享按钮 - 尝试多种方式
    console.log('\n🔍 查找分享按钮...');
    
    // 方式1: 通过class查找
    let shareButton = page.locator('[class*="share"]').first();
    let found = await shareButton.count() > 0;
    
    if (found) {
      console.log('✅ 通过class找到分享按钮');
    } else {
      // 方式2: 查找所有按钮并打印
      const allButtons = await page.locator('button').allTextContents();
      console.log('所有按钮文本:', allButtons);
      
      // 方式3: 查找图标按钮
      const iconButtons = await page.locator('button:has(svg)').count();
      console.log(`图标按钮数量: ${iconButtons}`);
      
      // 方式4: 查找顶部工具栏
      const header = page.locator('header').first();
      if (await header.count() > 0) {
        const headerButtons = await header.locator('button').allTextContents();
        console.log('顶部按钮:', headerButtons);
      }
    }

    if (found) {
      console.log('点击分享按钮...');
      await shareButton.click();
      await page.waitForTimeout(2000);

      // 截图分享弹窗
      await page.screenshot({ path: 'test-results/lazyman-share.png', fullPage: true });
      console.log('📸 已保存分享弹窗截图');

      // 选择PDF格式
      const pdfTab = page.locator('text=PDF').first();
      if (await pdfTab.count() > 0) {
        await pdfTab.click();
        await page.waitForTimeout(2000);
        console.log('✅ 已选择PDF格式');

        // 截图PDF选项
        await page.screenshot({ path: 'test-results/lazyman-pdf.png', fullPage: true });
        console.log('📸 已保存PDF选项截图');

        // 点击Generate PDF按钮
        const generateButton = page.locator('button:has-text("Generate PDF")').first();
        if (await generateButton.count() > 0) {
          console.log('点击Generate PDF按钮...');
          
          // 监听下载事件
          const downloadPromise = page.waitForEvent('download', { timeout: 60000 });
          await generateButton.click();

          try {
            const download = await downloadPromise;
            const fileName = download.suggestedFilename();
            console.log(`📥 文件名: ${fileName}`);

            const downloadPath = `test-results/${fileName}`;
            await download.saveAs(downloadPath);
            console.log(`✅ 文件已保存: ${downloadPath}`);

            const stats = fs.statSync(downloadPath);
            console.log(`📊 文件大小: ${(stats.size / 1024).toFixed(2)} KB`);
          } catch (error) {
            console.log(`⚠️ 下载超时: ${error}`);
          }
        }
      }
    } else {
      console.log('❌ 未找到分享按钮');
    }

    console.log('\n✅ 测试完成');
  });
});
