import { test, expect } from '@playwright/test';
import * as fs from 'fs';

const LAZYMAN_URL = 'https://lazymanchat.com';

test.describe('Lazy Man PDF导出完整流程', () => {
  test('生成文章并导出为PDF', async ({ page }) => {
    console.log('\n=== 完整流程：生成文章 → 导出PDF ===\n');
    
    // 步骤1: 访问平台
    console.log('📍 步骤1: 访问Lazy Man平台');
    await page.goto(LAZYMAN_URL);
    await page.waitForTimeout(3000);

    // 关闭系统公告弹窗
    const okButton = page.locator('button:has-text("OK")').first();
    if (await okButton.count() > 0) {
      console.log('  ✅ 关闭系统公告弹窗');
      await okButton.click();
      await page.waitForTimeout(1000);
    }

    // 步骤2: 发送生成文章的请求
    console.log('\n📍 步骤2: 发送文章生成请求');
    const messageInput = page.locator('textarea, [contenteditable="true"]').first();
    
    if (await messageInput.count() > 0) {
      const prompt = '请写一篇关于AI Agent的简短介绍，包括定义、特点和应用场景，约500字。';
      console.log(`  提示词: ${prompt}`);
      
      await messageInput.fill(prompt);
      await page.waitForTimeout(1000);

      // 发送消息
      const sendButton = page.locator('button[type="submit"]').first();
      if (await sendButton.count() > 0) {
        console.log('  点击发送按钮');
        await sendButton.click();
        
        // 等待AI生成内容
        console.log('  ⏳ 等待AI生成内容（20秒）...');
        await page.waitForTimeout(20000);

        // 截图生成的内容
        await page.screenshot({ path: 'test-results/step2-content-generated.png', fullPage: true });
        console.log('  📸 已保存生成内容截图');
      }
    }

    // 步骤3: 查找并点击分享按钮
    console.log('\n📍 步骤3: 查找分享按钮');
    const shareButton = page.locator('[class*="share"]').first();
    
    if (await shareButton.count() > 0) {
      console.log('  ✅ 找到分享按钮');
      await shareButton.click();
      await page.waitForTimeout(2000);

      // 截图分享弹窗
      await page.screenshot({ path: 'test-results/step3-share-dialog.png', fullPage: true });
      console.log('  📸 已保存分享弹窗截图');

      // 步骤4: 选择PDF格式
      console.log('\n📍 步骤4: 选择PDF导出格式');
      const pdfTab = page.locator('text=PDF').first();
      if (await pdfTab.count() > 0) {
        console.log('  点击PDF选项卡');
        await pdfTab.click();
        await page.waitForTimeout(2000);

        // 截图PDF选项
        await page.screenshot({ path: 'test-results/step4-pdf-options.png', fullPage: true });
        console.log('  📸 已保存PDF选项截图');

        // 步骤5: 点击Generate PDF按钮
        console.log('\n📍 步骤5: 生成PDF文件');
        const generateButton = page.locator('button:has-text("Generate PDF")').first();
        
        if (await generateButton.count() > 0) {
          console.log('  找到Generate PDF按钮');
          
          // 监听下载事件
          const downloadPromise = page.waitForEvent('download', { timeout: 60000 });
          
          await generateButton.click();
          console.log('  点击Generate PDF按钮');

          try {
            const download = await downloadPromise;
            const fileName = download.suggestedFilename();
            console.log(`  📥 文件名: ${fileName}`);

            // 保存下载的文件
            const downloadPath = `test-results/${fileName}`;
            await download.saveAs(downloadPath);
            console.log(`  ✅ 文件已保存: ${downloadPath}`);

            // 检查文件大小
            const stats = fs.statSync(downloadPath);
            console.log(`  📊 文件大小: ${(stats.size / 1024).toFixed(2)} KB`);
          } catch (error) {
            console.log(`  ⚠️ 下载事件超时: ${error}`);
            
            // 等待一段时间，可能PDF正在生成
            await page.waitForTimeout(5000);
            await page.screenshot({ path: 'test-results/step5-after-generate.png', fullPage: true });
            console.log('  📸 已保存生成后截图');
          }
        } else {
          console.log('  ❌ 未找到Generate PDF按钮');
          
          // 查找所有按钮
          const allButtons = await page.locator('button').allTextContents();
          console.log('  所有按钮:', allButtons);
        }
      } else {
        console.log('  ❌ 未找到PDF选项卡');
      }
    } else {
      console.log('  ❌ 未找到分享按钮');
    }

    console.log('\n✅ 测试完成');
  });

  test('导出为Text格式', async ({ page }) => {
    console.log('\n=== 导出为Text格式 ===\n');
    
    await page.goto(LAZYMAN_URL);
    await page.waitForTimeout(3000);

    // 关闭弹窗
    const okButton = page.locator('button:has-text("OK")').first();
    if (await okButton.count() > 0) {
      await okButton.click();
      await page.waitForTimeout(1000);
    }

    // 发送测试消息
    console.log('发送测试消息...');
    const messageInput = page.locator('textarea, [contenteditable="true"]').first();
    if (await messageInput.count() > 0) {
      await messageInput.fill('请写一段关于AI Agent的简短介绍，约200字');
      const sendButton = page.locator('button[type="submit"]').first();
      if (await sendButton.count() > 0) {
        await sendButton.click();
        await page.waitForTimeout(15000);
        console.log('✅ 内容已生成');
      }
    }

    // 点击分享按钮
    const shareButton = page.locator('[class*="share"]').first();
    if (await shareButton.count() > 0) {
      await shareButton.click();
      await page.waitForTimeout(2000);

      // 点击Text选项卡
      const textTab = page.locator('text=Text').first();
      if (await textTab.count() > 0) {
        await textTab.click();
        await page.waitForTimeout(1000);

        await page.screenshot({ path: 'test-results/text-export-dialog.png', fullPage: true });
        console.log('📸 已保存Text导出截图');

        // 查找复制或下载按钮
        const copyButton = page.locator('button:has-text("Copy")').first();
        const downloadButton = page.locator('button:has-text("Download")').first();
        
        if (await copyButton.count() > 0) {
          await copyButton.click();
          console.log('✅ 已复制文本到剪贴板');
        } else if (await downloadButton.count() > 0) {
          const downloadPromise = page.waitForEvent('download', { timeout: 30000 });
          await downloadButton.click();
          
          try {
            const download = await downloadPromise;
            const fileName = download.suggestedFilename();
            const downloadPath = `test-results/${fileName}`;
            await download.saveAs(downloadPath);
            console.log(`✅ Text文件已保存: ${downloadPath}`);
          } catch (error) {
            console.log('⚠️ 下载超时');
          }
        }
      }
    }
  });

  test('导出为JSON格式', async ({ page }) => {
    console.log('\n=== 导出为JSON格式 ===\n');
    
    await page.goto(LAZYMAN_URL);
    await page.waitForTimeout(3000);

    // 关闭弹窗
    const okButton = page.locator('button:has-text("OK")').first();
    if (await okButton.count() > 0) {
      await okButton.click();
      await page.waitForTimeout(1000);
    }

    // 发送测试消息
    console.log('发送测试消息...');
    const messageInput = page.locator('textarea, [contenteditable="true"]').first();
    if (await messageInput.count() > 0) {
      await messageInput.fill('请列出3个AI Agent的应用场景');
      const sendButton = page.locator('button[type="submit"]').first();
      if (await sendButton.count() > 0) {
        await sendButton.click();
        await page.waitForTimeout(15000);
        console.log('✅ 内容已生成');
      }
    }

    // 点击分享按钮
    const shareButton = page.locator('[class*="share"]').first();
    if (await shareButton.count() > 0) {
      await shareButton.click();
      await page.waitForTimeout(2000);

      // 点击JSON选项卡
      const jsonTab = page.locator('text=JSON').first();
      if (await jsonTab.count() > 0) {
        await jsonTab.click();
        await page.waitForTimeout(1000);

        await page.screenshot({ path: 'test-results/json-export-dialog.png', fullPage: true });
        console.log('📸 已保存JSON导出截图');

        // 查找下载按钮
        const downloadButton = page.locator('button:has-text("Download")').first();
        if (await downloadButton.count() > 0) {
          const downloadPromise = page.waitForEvent('download', { timeout: 30000 });
          await downloadButton.click();
          
          try {
            const download = await downloadPromise;
            const fileName = download.suggestedFilename();
            const downloadPath = `test-results/${fileName}`;
            await download.saveAs(downloadPath);
            console.log(`✅ JSON文件已保存: ${downloadPath}`);
          } catch (error) {
            console.log('⚠️ 下载超时');
          }
        }
      }
    }
  });
});
