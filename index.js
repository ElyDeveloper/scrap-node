const { chromium } = require("playwright-chromium");

module.exports = async function (context, req) {
  context.log("JavaScript HTTP trigger function processed a request.");

  const url = req.query.url || (req.body && req.body.url);

  try {
    const urlDownload = await getUrlDownload(url);
    context.res = {
      // status: 200, /* Defaults to 200 */
      body: urlDownload,
    };
  } catch (error) {
    context.res = {
      status: 401,
      body: error,
    };
  }
};
const getUrlDownload = async (urlSocial) => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto("https://es.savefrom.net/258JB/");

  // Establece el valor del input
  await page.fill('[id="sf_url"]', urlSocial);

  // Haz clic en el botón con el id "sf_submit"
  await page.click('[id="sf_submit"]');

  // Espera hasta que el elemento con la clase "def-btn-box" esté presente
  await page.waitForSelector(".def-btn-box");

  // Selecciona el enlace <a> dentro del div por su posición (primer enlace)
  const linkSelector = ".def-btn-box a";
  await page.waitForSelector(linkSelector);

  // Obtén la URL del enlace <a>
  const linkElement = await page.$(linkSelector);
  const linkUrl = await linkElement.getAttribute("href");

  // await page.screenshot({ path: "screenshot.png" });
  await browser.close();
  return linkUrl;
};