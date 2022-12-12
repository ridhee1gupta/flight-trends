const puppeteer = require('puppeteer');
const limit = 4000;
const isReturn = true;

async function flight_scrape(to, from, curr, out, ret) {
    let prices = [];
    const browser = await puppeteer.launch({ headless: false});
    const page = await browser.newPage();
    await page.setDefaultTimeout(60*1000);

    const url = isReturn
        ? 'https://www.google.com/flights#flt=${from}.${to}.${out}*${to}.${from}.${ret};c:${curr};e:1;p:${limit*100.2.${curr};sc:b;sd:1;t:f'
        : 'https://www.google.com/flights?flt=${from}.${to}.${out};c:${curr};e:1;p:${limit*100}.2.${curr};sc:b;sd:1;t:f;tt:o'
    try {
        await page.goto(url, {waitUntil: "networkidle2"});
        //await page.waitFor(300);
        const selector = isReturn
            ? 'div.flt-input.gws-flights__flex-box.gws-flights__flex-filler.gws-flights-from__return-input'
            : 'div.flt-input.gws-flights__flex-box.gws-flights__flex-filler.gws-flights-from__departure-input'
        //await page.waitFor(selector);
        //await page.waitFor(300);
        await page.click(selector);
        await page.evaluate(selector => {
            document.querySelector(selector).click();
        }, selector);

        //await page.waitFor(2000);

        await page.waitForSelector('span.gws-travel-calendar__loading', {hidden: true, timeout: 120000});
        const days = await page.$$('calendar-day');
        for (let day of days) {
            const price = await day.$('div span.gws-travel-calendar__annotation');
            if(price){
                const p = await price.evaluate(node => node.innerText);
                if(p){
                    const _d = await day.evaluate(d => d.dataset.day);
                    prices.push({
                        date: _d,
                        price: p,
                        from: tuple.origins,
                        to: tuple.destinations,
                        url: url
                    })
                }
            }
        }
    } catch(e){
        console.log(e)
        //console.log(tuple)
        console.log(url)
    };
    await Promise.all(promises);

    await browser.close();
    
    console.log(prices)
};

var results = flight_scrape.call(this, 'YYZ', 'HKG', 'CAD', '2022-12-15', '2023-01-15');
console.log(results);
