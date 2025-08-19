import fetch from 'node-fetch';
import { JSDOM } from 'jsdom';

export default async function handler(req, res) {
  const url = 'https://balthazar.se/';
  try {
    const response = await fetch(url);
    const html = await response.text();
    const dom = new JSDOM(html);
    const document = dom.window.document;

    const lunchColumn = [...document.querySelectorAll('div')]
      .find(div => div.textContent && div.textContent.includes('DAGENS LUNCH'));

    let dagens = '';
    let vegetarisk = '';
    let fisk = '';

    if (lunchColumn) {
      const items = [...lunchColumn.querySelectorAll('p, span, div')];
      items.forEach(el => {
        const text = el.textContent.trim();
        if (text.toLowerCase().includes('dagens lunch') && !dagens) {
          dagens = text;
        }
        if (text.toLowerCase().includes('veckans vegetariska') && !vegetarisk) {
          vegetarisk = text;
        }
        if (text.toLowerCase().includes('veckans fisk') && !fisk) {
          fisk = text;
        }
      });
    }

    const htmlOutput = `
      <div style="font-family: Arial; padding: 10px;">
        <h2>Dagens Lunch</h2>
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
