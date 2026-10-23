// Returns the list of website themes stored in Vercel Global Config.
// The store ID and read token are server-side environment variables, so they never reach the browser.
export default async function handler(req, res) {
  const id = process.env.GLOBAL_CONFIG_ID;
  const token = process.env.GLOBAL_CONFIG_TOKEN;
  if (!id || !token) {
    res.status(500).json({ error: 'Themes are not configured' });
    return;
  }
  try {
    const url = `https://global-config.vercel.com/${id}/item/themes?token=${encodeURIComponent(token)}`;
    const upstream = await fetch(url);
    if (!upstream.ok) {
      res.status(502).json({ error: 'Could not load themes' });
      return;
    }
    const themes = await upstream.json();
    res.setHeader('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=300');
    // The desktop app runs from its own origin, so it needs permission to read this list.
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.status(200).json(themes);
  } catch {
    res.status(502).json({ error: 'Could not load themes' });
  }
}
