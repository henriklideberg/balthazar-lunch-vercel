import fetch from 'node-fetch';
import { JSDOM } from 'jsdom';

export default async function handler(req, res) {
  const url = 'https://balthazar.se/veckans-lunch/';
  try {
    const response = await fetch(url);
    const html = await response.text();
    const dom = new JSDOM(html);
    const document = dom.window.document;

    const sections = [...document.querySelectorAll('.elementor-widget-container')];
    const today = new Date().toLocaleDateString('sv-SE', { weekday: 'long' }).toLowerCase();

    let dagens = '';
    let vegetarisk = '';
    let fisk = '';

    sections.forEach(section => {
      const text = section.textContent.toLowerCase();
      if (text.includes(today)) {
        dagens = section.textContent.trim();
      }
      if (text.includes('veckans vegetariska')) {
        vegetarisk = section.textContent.trim();
      }
      if (text.includes('veckans fisk')) {
        fisk = section.textContent.trim();
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
   
