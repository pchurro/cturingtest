const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    await page.goto('https://6b.eleuther.ai')

    await page.focus('.prompt-textarea')
    await page.keyboard.type('The future of humanity is')

    await page.click('.button-primary')

    await page.waitForTimeout(30000).then(() => console.log('Waited a second!'));

    const name = await page.$eval('.result-text', el => el.innerText)
    console.log(name)

    await page.screenshot({ path: 'keyboard.png' })
    await browser.close()
})()