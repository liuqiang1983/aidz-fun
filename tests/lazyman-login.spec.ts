import { test, expect } from '@playwright/test';

const LAZYMAN_URL = 'https://lazymanchat.com';
const EMAIL = '363845354@qq.com';
const PASSWORD = 'liuqiang1';

test.describe('Lazy Man 登录测试', () => {
  test('使用邮箱密码登录付费账户', async ({ page }) => {
    console.log('访问Lazy Man登录页面...');
    await page.goto(LAZYMAN_URL);
    await page.waitForTimeout(3000);

    // 截图初始状态
    await page.screenshot({ path: 'test-results/lazyman-initial.png' });

    // 检查是否已经登录
    const alreadyLoggedIn = await page.locator('text=Default Assistant, text=Just Chat').count();
    
    if (alreadyLoggedIn > 0) {
      console.log('✅ 已经登录，无需重新登录');
      await page.screenshot({ path: 'test-results/lazyman-already-logged-in.png', fullPage: true });
      
      // 保存认证状态
      await page.context().storageState({ path: 'test-results/lazyman-auth.json' });
      console.log('已保存认证状态');
      return;
    }

    // 查找登录按钮或Sign In弹窗
    const signInButton = page.locator('button:has-text("Sign In")').first();
    const signInModal = await page.locator('text=Sign In').count();

    if (signInModal > 0 || await signInButton.count() > 0) {
      console.log('检测到登录界面');
      
      // 如果有Sign In按钮，点击它
      if (await signInButton.count() > 0) {
        await signInButton.click();
        await page.waitForTimeout(2000);
      }

      // 截图登录弹窗
      await page.screenshot({ path: 'test-results/lazyman-login-modal.png' });

      // 查找邮箱输入框
      const emailInput = page.locator('input[placeholder*="email"], input[placeholder*="username"], input[type="email"], input[type="text"]').first();
      
      if (await emailInput.count() > 0) {
        console.log('填写邮箱:', EMAIL);
        await emailInput.fill(EMAIL);
        await page.waitForTimeout(1000);

        // 截图
        await page.screenshot({ path: 'test-results/lazyman-email-filled.png' });

        // 查找继续按钮
        const continueButton = page.locator('button:has-text("Continue"), button[type="submit"], button:has-text("下一步")').first();
        
        if (await continueButton.count() > 0) {
          console.log('点击继续按钮');
          await continueButton.click();
          await page.waitForTimeout(2000);

          // 截图
          await page.screenshot({ path: 'test-results/lazyman-after-continue.png' });
        }

        // 查找密码输入框
        const passwordInput = page.locator('input[type="password"]').first();
        
        if (await passwordInput.count() > 0) {
          console.log('填写密码');
          await passwordInput.fill(PASSWORD);
          await page.waitForTimeout(1000);

          // 截图
          await page.screenshot({ path: 'test-results/lazyman-password-filled.png' });

          // 点击登录按钮
          const loginButton = page.locator('button:has-text("Sign In"), button:has-text("Login"), button:has-text("登录"), button[type="submit"]').first();
          
          if (await loginButton.count() > 0) {
            console.log('点击登录按钮');
            await loginButton.click();
            
            // 等待登录完成
            console.log('等待登录完成...');
            await page.waitForTimeout(5000);

            // 截图登录后
            await page.screenshot({ path: 'test-results/lazyman-after-login.png', fullPage: true });

            // 检查是否登录成功
            const url = page.url();
            console.log('登录后URL:', url);

            // 检查是否有错误消息
            const errorMessage = await page.locator('text=/incorrect|invalid|错误|失败/i').count();
            if (errorMessage > 0) {
              console.log('❌ 登录失败，检测到错误消息');
              const errorText = await page.locator('text=/incorrect|invalid|错误|失败/i').first().textContent();
              console.log('错误信息:', errorText);
              
              // 尝试第二个密码
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
                  await page.screenshot({ path: 'test-results/lazyman-after-login-retry.png', fullPage: true });
                }
              }
            }

            // 检查是否进入主界面
            const chatInterface = await page.locator('text=Default Assistant, text=Just Chat, textarea, [contenteditable="true"]').count();
            
            if (chatInterface > 0) {
              console.log('✅ 登录成功！');
              
              // 关闭可能的弹窗
              const okButton = page.locator('button:has-text("OK"), button:has-text("Cancel")').first();
              if (await okButton.count() > 0) {
                await okButton.click();
                await page.waitForTimeout(1000);
              }

              // 截图主界面
              await page.screenshot({ path: 'test-results/lazyman-main-interface-success.png', fullPage: true });
              
              // 保存认证状态
              await page.context().storageState({ path: 'test-results/lazyman-auth.json' });
              console.log('✅ 已保存认证状态到 test-results/lazyman-auth.json');
              
              // 打印账户信息
              const pageTitle = await page.title();
              console.log('页面标题:', pageTitle);
              console.log('当前URL:', page.url());
            } else {
              console.log('❌ 登录可能失败，未检测到聊天界面');
            }
          }
        } else {
          console.log('❌ 未找到密码输入框');
        }
      } else {
        console.log('❌ 未找到邮箱输入框');
      }
    } else {
      console.log('未检测到登录界面');
    }
  });
});
