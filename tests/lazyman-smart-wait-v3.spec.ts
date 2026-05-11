import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import { execSync } from 'child_process';

const LAZYMAN_URL = 'https://lazymanchat.com';
const PROJECT_PATH = '/home/administrator000000/aidz-fun';

test.describe('Lazy Man 智能自动化部署', () => {
  test('智能等待：动态检测内容生成完成', async ({ page }) => {
    test.setTimeout(700000); // 设置测试超时为700秒
    console.log('\n=== 智能自动化流程：动态检测内容生成 ===\n');

    // 步骤1: 访问Lazy Man平台并等待完全加载
    console.log('📍 步骤1: 访问Lazy Man平台');
    await page.goto(LAZYMAN_URL, { waitUntil: 'domcontentloaded' });

    // 等待页面完全加载（检测Loading消失）
    console.log('  ⏳ 等待页面完全加载...');
    try {
      await page.waitForFunction(
        () => !document.body.innerText.includes('Loading...'),
        { timeout: 30000 }
      );
      console.log('  ✅ 页面加载完成');
    } catch (e) {
      console.log('  ⚠️ 页面加载超时，继续执行');
    }

    await page.waitForTimeout(3000);

    // 截图初始状态
    await page.screenshot({ path: 'test-results/01-initial.png', fullPage: true });
    console.log('  📸 已保存初始状态截图');

    // 关闭系统公告弹窗
    const okButton = page.locator('button:has-text("OK")').first();
    if (await okButton.count() > 0) {
      console.log('  ✅ 关闭系统公告弹窗');
      await okButton.click();
      await page.waitForTimeout(1000);
    }

    // 步骤2: 发送生成文章的请求
    console.log('\n📍 步骤2: 生成文章内容');

    // 智能查找输入框 - 等待输入框出现
    let messageInput = null;
    const inputSelectors = [
      'textarea',
      '[contenteditable="true"]',
      'input[type="text"]'
    ];

    console.log('  🔍 查找输入框...');
    for (const selector of inputSelectors) {
      try {
        await page.waitForSelector(selector, { timeout: 5000, state: 'visible' });
        const input = page.locator(selector).first();
        if (await input.count() > 0 && await input.isVisible()) {
          messageInput = input;
          console.log(`  ✅ 找到输入框: ${selector}`);
          break;
        }
      } catch (e) {
        console.log(`  ⚠️ 未找到: ${selector}`);
      }
    }

    if (messageInput) {
      const prompt = `请帮我写一篇关于"Coze工作流实战指南"的技术文章，包括以下内容：

## 概述
介绍Coze工作流的基本概念和优势

## 核心节点详解
1. LLM节点 - 模型选择和参数配置
2. 代码节点 - JavaScript/Python实战
3. 插件节点 - 集成外部API
4. 选择器节点 - 条件分支逻辑
5. 循环节点 - 批处理技巧

## 实战案例
案例1：智能客服工作流
案例2：内容生成流水线

## 最佳实践
- 性能优化技巧
- 调试方法
- 错误处理

请详细展开每个部分，总字数约2000字。`;

      console.log(`  📝 提示词长度: ${prompt.length} 字符`);
      await messageInput.fill(prompt);
      console.log('  ✅ 已填充提示词');
      await page.waitForTimeout(1000);

      // 截图填充后的状态
      await page.screenshot({ path: 'test-results/02-filled.png', fullPage: true });
      console.log('  📸 已保存填充后截图');

      // 智能查找发送按钮 - 使用更精确的选择器
      let sendButton = null;

      // 先尝试按Enter键发送
      console.log('  🖱️ 尝试按Enter键发送...');
      await messageInput.press('Enter');
      await page.waitForTimeout(2000);

      // 截图发送后的状态
      await page.screenshot({ path: 'test-results/03-after-send.png', fullPage: true });
      console.log('  📸 已保存发送后截图');

      // 步骤3: 智能等待内容生成完成
      console.log('\n📍 步骤3: 智能等待内容生成');
      console.log('  ⏳ 开始智能检测（最长600秒，动态检测完成状态）...');

      const startTime = Date.now();
      const maxWaitTime = 600000; // 最大等待10分钟
      const checkInterval = 3000; // 每3秒检查一次
      let isGenerating = false;
      let previousBodyLength = 0;
      let stableCount = 0;

      while (Date.now() - startTime < maxWaitTime) {
        await page.waitForTimeout(checkInterval);

        // 检测1: 查找停止按钮（表示正在生成）
        const stopButton = page.locator('button:has-text("Stop"), button:has-text("停止"), button:has-text("Stop Generating")').first();
        const hasStopButton = await stopButton.count() > 0;

        // 检测2: 查找加载指示器
        const loadingIndicator = page.locator('[class*="loading"], [class*="spinner"], [class*="typing"]').first();
        const hasLoading = await loadingIndicator.count() > 0;

        // 检测3: 检查整个页面内容长度
        const bodyText = await page.locator('body').innerText();
        const bodyLength = bodyText.length;

        const elapsedSeconds = Math.floor((Date.now() - startTime) / 1000);

        console.log(`  📊 [${elapsedSeconds}s] 停止按钮=${hasStopButton}, 加载中=${hasLoading}, 页面长度=${bodyLength}, 稳定=${stableCount}`);

        // 判断生成状态
        if (hasStopButton || hasLoading) {
          isGenerating = true;
          stableCount = 0;
          console.log('  🔄 检测到正在生成...');
        } else if (isGenerating) {
          // 曾经在生成，现在没有停止按钮和加载指示器
          if (bodyLength === previousBodyLength) {
            stableCount++;
            console.log(`  ✅ 内容稳定 (${stableCount}/3)`);

            if (stableCount >= 3) {
              console.log('  ✅✅✅ 内容生成完成！内容长度稳定且无生成指示器');
              break;
            }
          } else {
            stableCount = 0;
            console.log('  📝 内容仍在变化...');
          }
        } else {
          // 从未检测到生成状态
          if (elapsedSeconds > 15) {
            console.log('  ⚠️ 未检测到生成状态，可能已生成完成或未开始生成');
            break;
          }
        }

        previousBodyLength = bodyLength;
      }

      const totalTime = Math.floor((Date.now() - startTime) / 1000);
      console.log(`  ⏱️ 总等待时间: ${totalTime}秒`);

      // 截图最终状态
      await page.screenshot({ path: 'test-results/04-generated-content.png', fullPage: true });
      console.log('  📸 已保存生成内容截图');

      // 步骤4: 打开导出界面
      console.log('\n📍 步骤4: 打开导出界面');

      // 智能查找分享按钮
      let shareButton = null;
      const shareSelectors = [
        'button[class*="share"]',
        '[class*="share"]',
        'button:has-text("分享")',
        'button:has-text("Share")'
      ];

      for (const selector of shareSelectors) {
        const btn = page.locator(selector).first();
        if (await btn.count() > 0 && await btn.isVisible()) {
          shareButton = btn;
          console.log(`  ✅ 找到分享按钮: ${selector}`);
          break;
        }
      }

      if (shareButton) {
        await shareButton.click();
        await page.waitForTimeout(2000);

        // 截图分享界面
        await page.screenshot({ path: 'test-results/05-share-modal.png', fullPage: true });
        console.log('  📸 已保存分享界面截图');

        // 步骤5: 选择Text格式
        console.log('\n📍 步骤5: 选择Text导出格式');
        const textTab = page.locator('button:has-text("Text"), [role="tab"]:has-text("Text")').first();
        if (await textTab.count() > 0) {
          await textTab.click();
          await page.waitForTimeout(2000);

          // 截图Text选项
          await page.screenshot({ path: 'test-results/06-text-export.png', fullPage: true });
          console.log('  📸 已保存Text导出截图');

          // 步骤6: 下载文本文件
          console.log('\n📍 步骤6: 下载文本文件');
          const downloadButton = page.locator('button:has-text("Download File"), button:has-text("Download")').first();

          if (await downloadButton.count() > 0) {
            console.log('  ✅ 找到Download按钮');

            const downloadPromise = page.waitForEvent('download', { timeout: 60000 });
            await downloadButton.click();
            console.log('  🖱️ 点击Download按钮');

            try {
              const download = await downloadPromise;
              const fileName = download.suggestedFilename();
              console.log(`  📥 下载文件名: ${fileName}`);

              // 保存到项目目录
              const downloadPath = `${PROJECT_PATH}/content/docs/agent-platforms/coze/coze-workflow-practice.mdx`;
              await download.saveAs(downloadPath);
              console.log(`  ✅ 文件已保存: ${downloadPath}`);

              // 检查文件
              const stats = fs.statSync(downloadPath);
              const fileContent = fs.readFileSync(downloadPath, 'utf-8');
              console.log(`  📊 文件大小: ${(stats.size / 1024).toFixed(2)} KB`);
              console.log(`  📄 内容长度: ${fileContent.length} 字符`);

              if (fileContent.length > 100) {
                console.log(`  📝 内容预览: ${fileContent.substring(0, 200)}...`);

                // 添加frontmatter
                console.log('\n📍 步骤7: 添加Contentlayer frontmatter');
                const frontmatter = `---
title: "Coze工作流实战指南"
description: "深入掌握Coze工作流的核心节点、实战案例和最佳实践"
slug: "coze-workflow-practice"
category: "agent-platforms"
subcategory: "coze"
date: "${new Date().toISOString().split('T')[0]}"
author: "AI搭子"
tags: ["Coze", "工作流", "节点编排", "Agent实战", "自动化"]
contentType: "tutorial"
status: "published"
featured: true
---

`;

                const fullContent = frontmatter + fileContent;
                fs.writeFileSync(downloadPath, fullContent, 'utf-8');
                console.log('  ✅ 已添加frontmatter');

                // Git提交和推送
                console.log('\n📍 步骤8: Git提交和推送');
                try {
                  execSync('cd ~/aidz-fun && git add content/docs/agent-platforms/coze/coze-workflow-practice.mdx');
                  execSync('cd ~/aidz-fun && git commit -m "feat: 添加Coze工作流实战指南文章"');
                  const pushResult = execSync('cd ~/aidz-fun && timeout 90 git push origin main 2>&1', {
                    encoding: 'utf-8',
                    timeout: 100000
                  });
                  console.log(`  ✅ 推送成功:\n${pushResult}`);
                  console.log('\n🎉 自动化流程完成！');
                  console.log('  🌐 访问地址: https://aidz.fun/docs/agent-platforms/coze/coze-workflow-practice');
                } catch (gitError) {
                  console.log(`  ⚠️ Git操作失败: ${gitError}`);
                }
              } else {
                console.log('  ⚠️ 文件内容过短，可能下载失败');
                console.log(`  📝 文件内容: ${fileContent}`);
              }
            } catch (error) {
              console.log(`  ⚠️ 下载失败: ${error}`);
            }
          } else {
            console.log('  ❌ 未找到Download按钮');
          }
        } else {
          console.log('  ❌ 未找到Text选项卡');
        }
      } else {
        console.log('  ❌ 未找到分享按钮');
      }
    } else {
      console.log('  ❌ 未找到输入框');
    }

    console.log('\n✅ 测试完成');
  });
});
