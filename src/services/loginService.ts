// Serviço para buscar logins da aba 'logins' da planilha Google Sheets

const LOGINS_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vR1_Jjwof_6KC9NJcYyh1svu26TdWjuosE91LQVIx1gdXRhAEVSQSa0g0CQiV697A/pub?gid=1739134220&single=true&output=csv'; // Troque o gid se necessário

export async function fetchLogins() {
  const response = await fetch(LOGINS_CSV_URL);
  const text = await response.text();
  console.log('CSV logins bruto:', text); // DEBUG
  const lines = text.split('\n').filter(Boolean);
  if (lines.length < 2) return [];
  const [header, ...rows] = lines;
  const headers = header.split(',').map(h => h.trim().toLowerCase());
  const logins = rows.map(row => {
    const cols = row.split(',');
    return {
      usuario: cols[headers.indexOf('usuario')]?.trim(),
      senha: cols[headers.indexOf('senha')]?.trim(),
      tipo: headers.includes('tipo') ? cols[headers.indexOf('tipo')]?.trim() : undefined,
    };
  });
  console.log('Logins processados:', logins); // DEBUG
  return logins;
} 