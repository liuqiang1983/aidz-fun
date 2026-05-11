import { test, expect } from '@playwright/test';

const LAZYMAN_URL = 'https://lazymanchat.com';

test.describe('Lazy Man 模型选择测试', () => {
  test('探索可用的AI模型', async ({ page }) => {
    console.log('\n=== 探索Lazy Man模型选择功能 ===');
    
    // 访问平台
    await page.goto(LAZYMAN_URL);
    await page.waitForTimeout(3000);

    // 关闭系统公告弹窗
    const okButton = page.locator('button:has-text("OK")').first();
    if (await okButton.count() > 0) {
      await okButton.click();
      await page.waitForTimeout(1000);
    }

    // 截图初始状态
    await page.screenshot({ path: 'test-results/lazyman-models-initial.png', fullPage: true });

    // 查找模型选择器（通常在输入框附近或顶部）
    console.log('\n查找模型选择器...');
    
    // 尝试多种可能的模型选择器位置
    const modelSelector1 = page.locator('button:has-text("GPT"), button:has-text("Claude"), button:has-text("模型")').first();
    const modelSelector2 = page.locator('[class*="model"], [class*="selector"]').first();
    const modelSelector3 = page.locator('text=GPT-4o mini').first();

    // 点击模型选择器
    if (await modelSelector1.count() > 0) {
      console.log('找到模型选择器1，点击...');
      await modelSelector1.click();
      await page.waitForTimeout(2000);
    } else if (await modelSelector3.count() > 0) {
      console.log('找到模型标签，尝试点击...');
      await modelSelector3.click();
      await page.waitForTimeout(2000);
    }

    // 截图模型选择界面
    await page.screenshot({ path: 'test-results/lazyman-models-selector.png', fullPage: true });

    // 查找所有模型选项
    console.log('\n查找可用的模型...');
    const modelOptions = await page.locator('button, [role="option"], [class*="model"]').allTextContents();
    console.log('找到的元素:', modelOptions.slice(0, 20));

    // 尝试查找模型列表
    const gptModels = await page.locator('text=/GPT-4|GPT-3.5|GPT-4o/i').count();
    const claudeModels = await page.locator('text=/Claude|Claude-3|Claude-3.5/i').count();
    const geminiModels = await page.locator('text=/Gemini|Gemini-Pro/i').count();
    const otherModels = await page.locator('text=/Llama|Mistral|Qwen|DeepSeek/i').count();

    console.log('\n模型统计:');
    console.log('- GPT系列:', gptModels);
    console.log('- Claude系列:', claudeModels);
    console.log('- Gemini系列:', geminiModels);
    console.log('- 其他模型:', otherModels);

    // 截图
    await page.screenshot({ path: 'test-results/lazyman-models-list.png', fullPage: true });

    // 打印页面HTML（部分）
    const bodyHTML = await page.locator('body').innerHTML();
    console.log('\n页面HTML长度:', bodyHTML.length);

    // 保存页面内容到文件
    const fs = require('fs');
    fs.writeFileSync('test-results/lazyman-page-content.txt', bodyHTML);
    console.log('已保存页面内容到 test-results/lazyman-page-content.txt');
  });

  test('测试不同模型的任务', async ({ page }) => {
    console.log('\n=== 测试不同模型执行任务 ===');
    
    await page.goto(LAZYMAN_URL);
    await page.waitForTimeout(3000);

    // 关闭弹窗
    const okButton = page.locator('button:has-text("OK")').first();
    if (await okButton.count() > 0) {
      await okButton.click();
      await page.waitForTimeout(1000);
    }

    // 定义不同任务和推荐的模型
    const tasks = [
      {
        name: '代码生成',
        prompt: '请用Python写一个快速排序算法',
        recommendedModel: 'Claude-3.5-Sonnet 或 GPT-4o',
        reason: '代码能力强，逻辑清晰'
      },
      {
        name: '创意写作',
        prompt: '请写一段关于AI未来的科幻小说开头',
        recommendedModel: 'Claude-3.5-Sonnet 或 GPT-4o',
        reason: '文笔自然，创意丰富'
      },
      {
        name: '简单问答',
        prompt: '什么是机器学习？',
        recommendedModel: 'GPT-4o-mini 或 GPT-3.5',
        reason: '成本低，速度快'
      },
      {
        name: '长文本分析',
        prompt: '请分析以下文章的核心观点...',
        recommendedModel: 'Claude-3.5-Sonnet 或 GPT-4o',
        reason: '上下文窗口大，理解能力强'
      }
    ];

    console.log('\n任务和推荐模型:');
    tasks.forEach((task, index) => {
      console.log(`\n${index + 1}. ${task.name}`);
      console.log(`   推荐模型: ${task.recommendedModel}`);
      console.log(`   原因: ${task.reason}`);
    });

    // 执行第一个任务作为示例
    const task = tasks[0];
    console.log(`\n执行任务: ${task.name}`);
    console.log(`提示词: ${task.prompt}`);

    // 查找输入框
    const messageInput = page.locator('textarea, [contenteditable="true"]').first();
    
    if (await messageInput.count() > 0) {
      await messageInput.fill(task.prompt);
      await page.waitForTimeout(1000);
      
      await page.screenshot({ path: `test-results/lazyman-task-${task.name}.png` });
      console.log(`已保存任务截图: lazyman-task-${task.name}.png`);
    }
  });
});
