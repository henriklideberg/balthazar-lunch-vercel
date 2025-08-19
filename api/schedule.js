export const config = {
  schedule: '0 8 * * 1-5' // Kör varje vardag kl. 08:00
};

export default async function handler(req, res) {
  const response = await fetch('https://balthazar-lunch-vercel.vercel.app/api/lunch');
  const html = await response.text();

  // Här kan du lägga till kod för att:
  // - Skicka lunchmenyn till SharePoint
  // - Spara till en databas
  // - Skicka e-post eller Teams-meddelande

  console.log('Lunchmeny hämtad:', html);
  res.status(200).send('Lunchmeny hämtad och bearbetad.');
}
