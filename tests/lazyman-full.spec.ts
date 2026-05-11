import { test, expect } from '@playwright/test';

const LAZYMAN_URL = 'https://lazymanchat.com';
const EMAIL = '363845354@qq.com';
const PASSWORD = 'liuqiang1';

test.describe('Lazy Man 平台完整测试', () => {
  test('登录并测试聊天功能', async ({ page }) => {
    console.log('\n=== 步骤1: 访问Lazy Man平台 ===');
    await page.goto(LAZYMAN_URL);
    await page.waitForTimeout(3000);

    // 关闭系统公告弹窗
    const okButton = page.locator('button:has-text("OK")').first();
    if (await okButton.count() > 0) {
      console.log('关闭系统公告弹窗');
      await okButton.click();
      await page.waitForTimeout(1000);
    }

    // 截图初始状态
    await page.screenshot({ path: 'test-results/lazyman-step1-initial.png', fullPage: true });
    console.log('已保存初始状态截图');

    // 检查是否需要登录
    const signInModal = await page.locator('text=Sign In').count();
    console.log('登录弹窗检测:', signInModal > 0 ? '需要登录' : '已登录');

    if (signInModal > 0) {
      console.log('\n=== 步骤2: 开始登录流程 ===');
      
      // 截图登录弹窗
      await page.screenshot({ path: 'test-results/lazyman-step2-signin-modal.png' });

      // 查找邮箱输入框
      const emailInput = page.locator('input[placeholder*="email"], input[placeholder*="username"], input[type="email"]').first();
      
      if (await emailInput.count() > 0) {
        console.log('填写邮箱:', EMAIL);
        await emailInput.fill(EMAIL);
        await page.waitForTimeout(1000);

        // 点击继续按钮
        const continueButton = page.locator('button:has-text("Continue"), button[type="submit"]').first();
        if (await continueButton.count() > 0) {
          console.log('点击继续按钮');
          await continueButton.click();
          await page.waitForTimeout(2000);
        }

        // 查找密码输入框
        const passwordInput = page.locator('input[type="password"]').first();
        
        if (await passwordInput.count() > 0) {
          console.log('填写密码');
          await passwordInput.fill(PASSWORD);
          await page.waitForTimeout(1000);

          // 点击登录按钮
          const loginButton = page.locator('button:has-text("Sign In"), button[type="submit"]').first();
          if (await loginButton.count() > 0) {
            console.log('点击登录按钮');
            await loginButton.click();
            await page.waitForTimeout(5000);

            // 检查错误
            const errorMessage = await page.locator('text=/incorrect|invalid|错误|失败/i').count();
            if (errorMessage > 0) {
              console.log('尝试第二个密码: liuqiang1@');
              const pwdInput2 = page.locator('input[type="password"]').first();
              if (await pwdInput2.count() > 0) {
                await pwdInput2.clear();
                await pwdInput2.fill('liuqiang1@');
                await page.waitForTimeout(500);
                
                const loginBtn2 = page.locator('button:has-text("Sign In"), button[type="submit"]').first();
                if (await loginBtn2.count() > 0) {
                  await loginBtn2.click();
                  await page.waitForTimeout(5000);
                }
              }
            }
          }
        }
      }

      // 关闭可能的弹窗
      const okBtn = page.locator('button:has-text("OK")').first();
      if (await okBtn.count() > 0) {
        await okBtn.click();
        await page.waitForTimeout(1000);
      }
    }

    console.log('\n=== 步骤3: 测试聊天功能 ===');
    
    // 截图当前状态
    await page.screenshot({ path: 'test-results/lazyman-step3-ready.png', fullPage: true });

    // 查找消息输入框
    const messageInput = page.locator('textarea, [contenteditable="true"]').first();
    
    if (await messageInput.count() > 0) {
      console.log('✅ 找到消息输入框');
      
      // 输入测试消息
      const testMessage = '你好，请帮我生成一篇关于AI Agent的文章大纲';
      console.log('输入测试消息:', testMessage);
      await messageInput.fill(testMessage);
      await page.waitForTimeout(1000);

      // 截图
      await page.screenshot({ path: 'test-results/lazyman-step4-message-typed.png' });

      // 查找发送按钮
      const sendButton = page.locator('button[type="submit"], button:has-text("Send"), button:has-text("发送")').first();
      
      if (await sendButton.count() > 0) {
        console.log('点击发送按钮');
        await sendButton.click();
        
        // 等待AI回复
        console.log('等待AI回复...');
        await page.waitForTimeout(10000);

        // 截图回复
        await page.screenshot({ path: 'test-results/lazyman-step5-ai-response.png', fullPage: true });
        console.log('✅ 已保存AI回复截图');

        // 获取回复内容
        const responseText = await page.locator('body').innerText();
        console.log('回复内容长度:', responseText.length);
      }
    } else {
      console.log('❌ 未找到消息输入框');
    }

    // 保存认证状态
    await page.context().storageState({ path: 'test-results/lazyman-auth.json' });
    console.log('\n✅ 已保存认证状态到 test-results/lazyman-auth.json');

    // 打印最终状态
    console.log('\n=== 最终状态 ===');
    console.log('页面标题:', await page.title());
    console.log('当前URL:', page.url());
  });
});
