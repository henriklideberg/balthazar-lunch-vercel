import fetch from 'node-fetch';
import { JSDOM } from 'jsdom';

export default async function handler(req, res) {
  const url = 'https://balthazar.se/lunch';
  try {
    const response = await fetch(url);
    const html = await response.text();
    const dom = new JSDOM(html);
    const document = dom.window.document;

    const today = new Date().toLocaleDateString('sv-SE', { weekday: 'long' }).toLowerCase();

    let dagens = '';
    let vegetarisk = '';
    let fisk = '';

    const elements = [...document.querySelectorAll('p, div, span')];

    elements.forEach(el => {
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

    const htmlOutput = `
      <div style="font-family: Arial; padding: 10px;">
        <h2>Dagens Lunch (${today.charAt(0).toUpperCase() + today.slice(1)})</h2>
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
