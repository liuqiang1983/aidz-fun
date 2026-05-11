import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import { execSync } from 'child_process';

const LAZYMAN_URL = 'https://lazymanchat.com';
const PROJECT_PATH = '/home/administrator000000/aidz-fun';

test.describe('Lazy Man 自动化内容生成与部署 v4', () => {
  test('完整流程：生成内容 → 智能等待(600秒) → 下载 → 推送 → 部署', async ({ page }) => {
    console.log('\n=== 自动化流程 v4：智能等待内容生成（最长600秒）===\n');

    // 步骤1: 访问Lazy Man平台
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
    console.log('\n📍 步骤2: 生成文章内容');
    const messageInput = page.locator('textarea, [contenteditable="true"]').first();

    if (await messageInput.count() > 0) {
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

      console.log(`  提示词: ${prompt.substring(0, 100)}...`);
      await messageInput.fill(prompt);
      await page.waitForTimeout(1000);

      // 发送消息
      const sendButton = page.locator('button[type="submit"]').first();
      if (await sendButton.count() > 0) {
        console.log('  点击发送按钮');
        await sendButton.click();

        // 智能等待：检测内容生成完成
        console.log('  ⏳ 等待AI生成内容（最长600秒）...');

        let contentGenerated = false;
        let previousLength = 0;
        let stableCount = 0;
        const maxWaitTime = 600000; // 最大等待10分钟
        const checkInterval = 5000; // 每5秒检查一次
        const startTime = Date.now();

        while (Date.now() - startTime < maxWaitTime) {
          await page.waitForTimeout(checkInterval);

          // 检查是否有"停止生成"或"Stop"按钮
          const stopButton = page.locator('button:has-text("Stop"), button:has-text("停止")').first();
          const hasStopButton = await stopButton.count() > 0;

          // 检查内容长度
          const bodyText = await page.locator('body').innerText();
          const currentLength = bodyText.length;

          const elapsedSeconds = Math.floor((Date.now() - startTime) / 1000);
          console.log(`  📊 [${elapsedSeconds}s] 内容长度=${currentLength}, 停止按钮=${hasStopButton}, 稳定计数=${stableCount}`);

          // 如果没有停止按钮且内容长度稳定，说明生成完成
          if (!hasStopButton) {
            if (currentLength === previousLength) {
              stableCount++;
              if (stableCount >= 3) {
                console.log('  ✅ 内容生成完成（内容长度稳定且无停止按钮）');
                contentGenerated = true;
                break;
              }
            } else {
              stableCount = 0;
            }
          } else {
            stableCount = 0;
          }

          previousLength = currentLength;
        }

        if (!contentGenerated) {
          console.log('  ⚠️ 等待超时，继续执行...');
        }

        // 最终内容检查
        const finalBodyText = await page.locator('body').innerText();
        console.log(`  📊 最终内容长度: ${finalBodyText.length} 字符`);

        // 截图生成的内容
        await page.screenshot({ path: 'test-results/lazyman-generated-content-v4.png', fullPage: true });
        console.log('  📸 已保存生成内容截图');
      }
    }

    // 步骤3: 点击分享按钮
    console.log('\n📍 步骤3: 打开导出界面');
    const shareButton = page.locator('[class*="share"]').first();

    if (await shareButton.count() > 0) {
      console.log('  ✅ 找到分享按钮');
      await shareButton.click();
      await page.waitForTimeout(3000);

      // 步骤4: 选择Text格式
      console.log('\n📍 步骤4: 选择Text导出格式');
      const textTab = page.locator('text=Text').first();
      if (await textTab.count() > 0) {
        console.log('  点击Text选项卡');
        await textTab.click();
        await page.waitForTimeout(3000);

        // 截图Text选项
        await page.screenshot({ path: 'test-results/lazyman-text-export-v4.png', fullPage: true });
        console.log('  📸 已保存Text导出截图');

        // 步骤5: 下载文本文件
        console.log('\n📍 步骤5: 下载文本文件');

        // 查找下载按钮
        const downloadButton = page.locator('button:has-text("Download File")').first();

        if (await downloadButton.count() > 0) {
          console.log('  找到Download按钮');

          // 监听下载事件
          const downloadPromise = page.waitForEvent('download', { timeout: 60000 });

          await downloadButton.click();
          console.log('  点击Download按钮');

          try {
            const download = await downloadPromise;
            const fileName = download.suggestedFilename();
            console.log(`  📥 下载文件名: ${fileName}`);

            // 保存到项目目录
            const downloadPath = `${PROJECT_PATH}/content/docs/agent-platforms/coze/coze-workflow-practice-v4.mdx`;
            await download.saveAs(downloadPath);
            console.log(`  ✅ 文件已保存: ${downloadPath}`);

            // 检查文件大小
            const stats = fs.statSync(downloadPath);
            console.log(`  📊 文件大小: ${(stats.size / 1024).toFixed(2)} KB`);

            // 读取文件内容
            const fileContent = fs.readFileSync(downloadPath, 'utf-8');
            console.log(`  📄 文件内容长度: ${fileContent.length} 字符`);

            if (fileContent.length < 100) {
              console.log('  ⚠️ 文件内容过短，可能下载失败');
              console.log(`  📝 文件内容: ${fileContent}`);
            } else {
              console.log(`  📝 文件前200字符: ${fileContent.substring(0, 200)}...`);
            }

            // 步骤6: 添加frontmatter
            console.log('\n📍 步骤6: 添加Contentlayer frontmatter');
            const frontmatter = `---
title: "Coze工作流实战指南"
description: "深入掌握Coze工作流的核心节点、实战案例和最佳实践"
slug: "coze-workflow-practice-v4"
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

            // 合并frontmatter和内容
            const fullContent = frontmatter + fileContent;
            fs.writeFileSync(downloadPath, fullContent, 'utf-8');
            console.log('  ✅ 已添加frontmatter');

            // 步骤7: Git提交和推送
            console.log('\n📍 步骤7: Git提交和推送');

            try {
              // 检查Git状态
              console.log('  检查Git状态...');
              const gitStatus = execSync('cd ~/aidz-fun && git status --short', { encoding: 'utf-8' });
              console.log(`  Git状态:\n${gitStatus}`);

              // 添加文件到Git
              console.log('  添加文件到Git...');
              execSync('cd ~/aidz-fun && git add content/docs/agent-platforms/coze/coze-workflow-practice-v4.mdx');
              console.log('  ✅ 文件已添加到Git');

              // 提交
              console.log('  提交更改...');
              const commitMessage = 'feat: 添加Coze工作流实战指南文章(v4)';
              execSync(`cd ~/aidz-fun && git commit -m "${commitMessage}"`);
              console.log(`  ✅ 已提交: ${commitMessage}`);

              // 推送到远程仓库
              console.log('  推送到远程仓库...');
              try {
                const pushResult = execSync('cd ~/aidz-fun && timeout 90 git push origin main 2>&1', {
                  encoding: 'utf-8',
                  timeout: 100000
                });
                console.log(`  ✅ 推送成功:\n${pushResult}`);

                console.log('\n🎉 自动化流程完成！');
                console.log('  📝 文章已生成并保存');
                console.log('  💾 已提交到Git仓库');
                console.log('  🚀 已推送到GitHub');
                console.log('  🌐 Vercel将自动部署');
                console.log('\n  访问地址: https://aidz.fun/docs/agent-platforms/coze/coze-workflow-practice-v4');

              } catch (pushError) {
                console.log(`  ⚠️ 推送超时或失败: ${pushError}`);
                console.log('  请手动执行: cd ~/aidz-fun && git push origin main');
              }

            } catch (gitError) {
              console.log(`  ❌ Git操作失败: ${gitError}`);
            }

          } catch (error) {
            console.log(`  ⚠️ 下载超时: ${error}`);
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

    console.log('\n✅ 内容生成和下载完成');
  });
});
