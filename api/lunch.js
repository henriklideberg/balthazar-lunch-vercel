import fetch from 'node-fetch';
import { JSDOM } from 'jsdom';

export default async function handler(req, res) {
  const url = 'https://balthazar.se/lunch';
  try {
    const response = await fetch(url);
    const html = await response.text();
    const dom = new JSDOM(html);
    const document = dom.window.document;

    const targetDiv = document.querySelector("div.elementor-element.elementor-element-80a5835.e-con-full.e-flex.e-con.e-child");

    let dagens = '';
    let vegetarisk = '';
    let fisk = '';

    if (targetDiv) {
      const today = new Date().toLocaleDateString('sv-SE', { weekday: 'long' }).toLowerCase();
      const blocks = [...targetDiv.querySelectorAll('p, span, div')];

      blocks.forEach(el => {
        const text = el.textContent.toLowerCase().trim();
        if (text.includes(today) && !dagens) {
          dagens = el.textContent.trim();
        }
        if (text.includes('veckans vegetariska') && !vegetarisk) {
          vegetarisk = el.textContent.trim();
        }
        if (text.includes('veckans fisk') && !fisk) {
          fisk = el.textContent.trim();
        }
      });
    }

    const htmlOutput = `
      <div style="font-family: Arial; padding: 10px;">
        <h2>Dagens Lunch (${new Date().toLocaleDateString('sv-SE', { weekday: 'long' })})</h2>
        <p>${dagens || 'Ingen dagens lunch hittades.'}</p>
        <h3>Veckans Vegetariska</h3>
        <p>${vegetarisk || 'Ingen vegetarisk rätt hittades.'}</p>
        <h3>Veckans Fisk</h3>
        <p>${fisk || 'Ingen fiskrätt hittades.'}</p>
      </div>
    `;

    res.setHeader('Content-Type', 'text/html');
    res.status(200).send(htmlOutput);
  } catch (error) {
    console.error('Fel vid hämtning:', error);
    res.status(500).send('Kunde inte hämta lunchmenyn.');
  }
}
