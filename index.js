const { chromium } = require("playwright");
const express = require("express");
const { json } = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(json());

app.listen(process.env.PORT || 4000, () => {
  console.log("Servidor corriendo en el puerto: " + process.env.PORT || 4000);
});
app.get("/", async (req, res) => {
  res.status(200).send({
    message: "API DOWNLOADER",
  });
});

app.get("/download", async (req, res) => {
  const url = req.query.url;
  try {
    const urlDownload = await getUrlDownload(url);
    res.status(200).send({
      url: urlDownload,
    });
  } catch (error) {
    res.status(500).send({
      error: error.message,
    });
  }
});

const getUrlDownload = async (urlSocial) => {
  const browser = await chromium.launch();
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

  await page.screenshot({ path: "screenshot.png" });
  await browser.close();
  return linkUrl;
};
