const { chromium } = require("playwright-chromium");
const express = require("express");
const { json } = require("express");
const cors = require("cors");
require("dotenv").config();

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
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto("https://es.savefrom.net/259iw/");

  // Establece el valor del input
  await page.fill('[id="sf_url"]', urlSocial);

  await page.screenshot({ path: "screenshot1.png" });

  // Haz clic en el botón con el id "sf_submit"
  await page.click('[id="sf_submit"]');
  await page.screenshot({ path: "screenshot2.png" });

  //Esperar 10 segundos
  await page.waitForTimeout(10000);
  await page.screenshot({ path: "screenshot3.png" });

  // Espera hasta que el elemento con la clase "def-btn-box" esté presente
  await page.waitForSelector(".def-btn-box");
  await page.screenshot({ path: "screenshot3.png" });

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
