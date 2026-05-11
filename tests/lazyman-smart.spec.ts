import { test, expect } from '@playwright/test';

const LAZYMAN_URL = 'https://lazymanchat.com';

// 模型推荐配置
const MODEL_RECOMMENDATIONS = {
  '代码生成': {
    models: ['Claude 4.7 Opus', 'Claude 4.6 sonnet', 'GPT-4.1', 'GPT-4o'],
    reason: '代码能力强，逻辑清晰，适合复杂编程任务'
  },
  '创意写作': {
    models: ['Claude 4.7 Opus', 'Claude 4.6 sonnet', 'GPT-4o', 'Gemini 2.5 Pro'],
    reason: '文笔自然，创意丰富，适合内容创作'
  },
  '简单问答': {
    models: ['GPT-4o mini', 'GPT-4.1 mini', 'Gemini 3 Flash'],
    reason: '成本低，速度快，适合简单任务'
  },
  '长文本分析': {
    models: ['Claude 4.7 Opus', 'Claude 4.6 sonnet', 'GPT-4.1', 'Gemini 2.5 Pro'],
    reason: '上下文窗口大，理解能力强'
  },
  '翻译任务': {
    models: ['GPT-4o', 'Claude 4.6 sonnet', 'Gemini 2.5 Pro'],
    reason: '多语言能力强，翻译准确'
  },
  '数据分析': {
    models: ['GPT-4.1', 'Claude 4.7 Opus', 'Gemini 2.5 Pro'],
    reason: '逻辑推理强，数据处理能力好'
  }
};

test.describe('Lazy Man 智能模型选择', () => {
  test('根据任务类型自动选择最佳模型', async ({ page }) => {
    console.log('\n=== Lazy Man 智能模型选择系统 ===\n');
    
    // 访问平台
    await page.goto(LAZYMAN_URL);
    await page.waitForTimeout(3000);

    // 关闭系统公告弹窗
    const okButton = page.locator('button:has-text("OK")').first();
    if (await okButton.count() > 0) {
      await okButton.click();
      await page.waitForTimeout(1000);
    }

    // 打印可用的模型推荐
    console.log('📋 任务类型与推荐模型:\n');
    Object.entries(MODEL_RECOMMENDATIONS).forEach(([task, config]) => {
      console.log(`【${task}】`);
      console.log(`  推荐模型: ${config.models.join(', ')}`);
      console.log(`  原因: ${config.reason}\n`);
    });

    // 示例任务：生成文章大纲
    const taskType = '创意写作';
    const prompt = '请帮我生成一篇关于"AI Agent在企业中的应用"的文章大纲，包括：1. 引言 2. 核心概念 3. 应用场景 4. 实施步骤 5. 挑战与展望 6. 结论';

    console.log(`\n🎯 执行任务: ${taskType}`);
    console.log(`📝 提示词: ${prompt}\n`);

    // 获取推荐模型
    const recommendedModels = MODEL_RECOMMENDATIONS[taskType].models;
    console.log(`💡 推荐模型: ${recommendedModels.join(', ')}`);
    console.log(`📖 原因: ${MODEL_RECOMMENDATIONS[taskType].reason}\n`);

    // 查找输入框
    const messageInput = page.locator('textarea, [contenteditable="true"]').first();
    
    if (await messageInput.count() > 0) {
      console.log('✅ 找到输入框，准备输入任务...');
      
      // 输入提示词
      await messageInput.fill(prompt);
      await page.waitForTimeout(1000);

      // 截图
      await page.screenshot({ path: 'test-results/lazyman-smart-task.png', fullPage: true });
      console.log('📸 已保存任务截图');

      // 查找模型选择器
      console.log('\n🔍 查找模型选择器...');
      const modelButton = page.locator('text=GPT-4o mini, button:has-text("mini")').first();
      
      if (await modelButton.count() > 0) {
        console.log('✅ 找到当前模型标签');
        
        // 点击模型选择器
        await modelButton.click();
        await page.waitForTimeout(2000);

        // 截图模型选择界面
        await page.screenshot({ path: 'test-results/lazyman-model-selector-open.png', fullPage: true });
        console.log('📸 已保存模型选择界面截图');

        // 尝试选择推荐的第一个模型
        for (const modelName of recommendedModels) {
          const modelOption = page.locator(`text="${modelName}"`).first();
          if (await modelOption.count() > 0) {
            console.log(`✅ 找到推荐模型: ${modelName}`);
            await modelOption.click();
            await page.waitForTimeout(1000);
            break;
          }
        }

        // 截图选择后的状态
        await page.screenshot({ path: 'test-results/lazyman-model-selected.png', fullPage: true });
        console.log('📸 已保存模型选择后截图');
      }

      // 查找发送按钮
      const sendButton = page.locator('button[type="submit"], button:has-text("Send")').first();
      
      if (await sendButton.count() > 0) {
        console.log('\n🚀 点击发送按钮...');
        await sendButton.click();
        
        // 等待AI回复
        console.log('⏳ 等待AI生成回复...');
        await page.waitForTimeout(15000);

        // 截图回复
        await page.screenshot({ path: 'test-results/lazyman-ai-response.png', fullPage: true });
        console.log('📸 已保存AI回复截图');

        // 获取回复内容
        const responseText = await page.locator('body').innerText();
        console.log('\n📊 回复统计:');
        console.log(`  总字符数: ${responseText.length}`);
        console.log(`  总行数: ${responseText.split('\n').length}`);
      }
    } else {
      console.log('❌ 未找到输入框');
    }

    // 保存认证状态
    await page.context().storageState({ path: 'test-results/lazyman-auth.json' });
    console.log('\n✅ 已保存认证状态');
  });

  test('批量生成不同类型的内容', async ({ page }) => {
    console.log('\n=== 批量内容生成测试 ===\n');
    
    await page.goto(LAZYMAN_URL);
    await page.waitForTimeout(3000);

    // 关闭弹窗
    const okButton = page.locator('button:has-text("OK")').first();
    if (await okButton.count() > 0) {
      await okButton.click();
      await page.waitForTimeout(1000);
    }

    // 定义批量任务
    const tasks = [
      {
        type: '简单问答',
        prompt: '什么是AI Agent？请用3句话简要说明。',
        expectedModel: 'GPT-4o mini'
      },
      {
        type: '代码生成',
        prompt: '请写一个Python函数，实现斐波那契数列',
        expectedModel: 'Claude 4.6 sonnet'
      },
      {
        type: '创意写作',
        prompt: '请写一段100字的产品介绍，主题是"智能客服机器人"',
        expectedModel: 'Claude 4.7 Opus'
      }
    ];

    console.log('📋 批量任务列表:\n');
    tasks.forEach((task, index) => {
      console.log(`${index + 1}. 【${task.type}】`);
      console.log(`   推荐模型: ${task.expectedModel}`);
      console.log(`   提示词: ${task.prompt}\n`);
    });

    // 执行第一个任务作为示例
    const task = tasks[0];
    console.log(`\n🎯 执行任务: ${task.type}`);
    
    const messageInput = page.locator('textarea, [contenteditable="true"]').first();
    if (await messageInput.count() > 0) {
      await messageInput.fill(task.prompt);
      await page.waitForTimeout(1000);
      
      await page.screenshot({ path: `test-results/lazyman-batch-task-1.png` });
      console.log('📸 已保存任务截图');
    }
  });
});
