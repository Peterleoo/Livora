import { chromium } from 'playwright';

(async () => {
    console.log('🚀 正在启动浏览器测试...');
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();

    try {
        console.log('🌐 正在访问 http://localhost:3000/ ...');
        await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' });

        // 检查标题
        const title = await page.title();
        console.log(`📌 页面标题: ${title}`);

        if (title.includes('智寓')) {
            console.log('✅ 验证成功: 标题包含 "智寓"');
        } else {
            console.log('❌ 验证失败: 标题不匹配');
        }

        // 检查关键内容
        const content = await page.textContent('body');
        if (content.includes('登录') || content.includes('Login')) {
            console.log('✅ 验证成功: 页面已渲染登录相关内容');
        }

        // 截图保存
        await page.screenshot({ path: 'smoke-test-result.png' });
        console.log('📸 截图已保存至 smoke-test-result.png');

    } catch (error) {
        console.error('❌ 测试过程中出错:', error);
    } finally {
        await browser.close();
        console.log('🏁 测试结束。');
    }
})();
