import { test, expect } from '@playwright/test';
import * as fs from 'fs';

const LAZYMAN_URL = 'https://lazymanchat.com';

test.describe('Lazy Man 内容生成与导出', () => {
  test('生成文章并导出为PDF', async ({ page }) => {
    console.log('\n=== Lazy Man 内容生成与PDF导出 ===\n');
    
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
      const prompt = `请帮我写一篇关于"AI Agent在企业数字化转型中的应用"的文章，包括以下内容：

1. 引言：AI Agent的定义和发展背景
2. AI Agent的核心能力：自主决策、任务执行、持续学习
3. 企业应用场景：
   - 智能客服
   - 流程自动化
   - 数据分析
   - 知识管理
4. 实施建议：技术选型、团队建设、风险控制
5. 未来展望：技术趋势和挑战
6. 结论

请详细展开每个部分，总字数约1500字。`;

      await messageInput.fill(prompt);
      await page.waitForTimeout(1000);

      // 发送消息
      const sendButton = page.locator('button[type="submit"]').first();
      if (await sendButton.count() > 0) {
        console.log('🚀 发送消息...');
        await sendButton.click();
        
        // 等待AI生成内容
        console.log('⏳ 等待AI生成内容（约30秒）...');
        await page.waitForTimeout(30000);

        // 截图生成的内容
        await page.screenshot({ path: 'test-results/lazyman-article-generated.png', fullPage: true });
        console.log('📸 已保存生成内容截图');

        // 获取生成的内容长度
        const bodyText = await page.locator('body').innerText();
        console.log(`📊 生成内容长度: ${bodyText.length} 字符`);
      }
    }

    // 点击分享按钮
    console.log('\n🔍 查找分享按钮...');
    const shareButton = page.locator('[class*="share"]').first();
    
    if (await shareButton.count() > 0) {
      console.log('✅ 找到分享按钮，点击...');
      await shareButton.click();
      await page.waitForTimeout(2000);

      // 截图分享弹窗
      await page.screenshot({ path: 'test-results/lazyman-share-dialog.png', fullPage: true });
      console.log('📸 已保存分享弹窗截图');

      // 点击PDF选项卡
      console.log('\n📄 选择PDF导出格式...');
      const pdfTab = page.locator('text=PDF').first();
      if (await pdfTab.count() > 0) {
        await pdfTab.click();
        await page.waitForTimeout(2000);

        // 截图PDF选项
        await page.screenshot({ path: 'test-results/lazyman-pdf-options.png', fullPage: true });
        console.log('📸 已保存PDF选项截图');

        // 设置导出选项
        console.log('\n⚙️ 配置PDF导出选项...');

        // 尝试设置宽度模式为Wide
        const wideOption = page.locator('text=Wide').first();
        if (await wideOption.count() > 0) {
          await wideOption.click();
          console.log('✅ 设置宽度模式: Wide');
        }

        // 等待预览更新
        await page.waitForTimeout(1000);

        // 截图最终预览
        await page.screenshot({ path: 'test-results/lazyman-pdf-preview.png', fullPage: true });
        console.log('📸 已保存PDF预览截图');

        // 点击下载按钮
        console.log('\n⬇️ 点击下载PDF按钮...');
        const downloadButton = page.locator('button:has-text("Download"), button:has-text("下载")').first();
        
        if (await downloadButton.count() > 0) {
          // 监听下载事件
          const downloadPromise = page.waitForEvent('download', { timeout: 30000 });
          
          await downloadButton.click();
          console.log('✅ 已点击下载按钮');

          try {
            const download = await downloadPromise;
            const fileName = download.suggestedFilename();
            console.log(`📥 下载文件名: ${fileName}`);

            // 保存下载的文件
            const downloadPath = `test-results/${fileName}`;
            await download.saveAs(downloadPath);
            console.log(`✅ 文件已保存到: ${downloadPath}`);

            // 检查文件大小
            const stats = fs.statSync(downloadPath);
            console.log(`📊 文件大小: ${(stats.size / 1024).toFixed(2)} KB`);
          } catch (error) {
            console.log('⚠️ 下载事件超时，可能需要手动确认下载');
          }
        } else {
          console.log('❌ 未找到下载按钮');
        }
      } else {
        console.log('❌ 未找到PDF选项卡');
      }
    } else {
      console.log('❌ 未找到分享按钮');
    }

    console.log('\n✅ 测试完成');
  });

  test('生成内容并导出为Text', async ({ page }) => {
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
    const messageInput = page.locator('textarea, [contenteditable="true"]').first();
    if (await messageInput.count() > 0) {
      await messageInput.fill('请写一段关于AI Agent的简短介绍，约200字');
      const sendButton = page.locator('button[type="submit"]').first();
      if (await sendButton.count() > 0) {
        await sendButton.click();
        await page.waitForTimeout(15000);
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

        await page.screenshot({ path: 'test-results/lazyman-text-export.png', fullPage: true });
        console.log('📸 已保存Text导出截图');

        // 点击复制按钮
        const copyButton = page.locator('button:has-text("Copy")').first();
        if (await copyButton.count() > 0) {
          await copyButton.click();
          console.log('✅ 已复制文本到剪贴板');
        }
      }
    }
  });

  test('生成内容并导出为JSON', async ({ page }) => {
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
    const messageInput = page.locator('textarea, [contenteditable="true"]').first();
    if (await messageInput.count() > 0) {
      await messageInput.fill('请列出3个AI Agent的应用场景');
      const sendButton = page.locator('button[type="submit"]').first();
      if (await sendButton.count() > 0) {
        await sendButton.click();
        await page.waitForTimeout(15000);
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

        await page.screenshot({ path: 'test-results/lazyman-json-export.png', fullPage: true });
        console.log('📸 已保存JSON导出截图');

        // 点击下载按钮
        const downloadButton = page.locator('button:has-text("Download")').first();
        if (await downloadButton.count() > 0) {
          const downloadPromise = page.waitForEvent('download', { timeout: 30000 });
          await downloadButton.click();
          
          try {
            const download = await downloadPromise;
            const fileName = download.suggestedFilename();
            console.log(`📥 下载文件名: ${fileName}`);
            
            const downloadPath = `test-results/${fileName}`;
            await download.saveAs(downloadPath);
            console.log(`✅ JSON文件已保存到: ${downloadPath}`);
          } catch (error) {
            console.log('⚠️ 下载超时');
          }
        }
      }
    }
  });
});
