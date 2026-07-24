// api/academy-events.js
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 's-maxage=600, stale-while-revalidate');

  const BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;
  const GUILD_ID = process.env.DISCORD_GUILD_ID;

  if (!BOT_TOKEN || !GUILD_ID) {
    return res.status(500).json({ error: 'Missing Discord env vars' });
  }

  try {
    const discordRes = await fetch(
      `https://discord.com/api/v10/guilds/${GUILD_ID}/scheduled-events?with_user_count=false`,
      { headers: { Authorization: `Bot ${BOT_TOKEN}` } }
    );

    if (!discordRes.ok) {
      const errText = await discordRes.text();
      return res.status(discordRes.status).json({ error: 'Discord API error', detail: errText });
    }

    const rawEvents = await discordRes.json();

    const events = rawEvents.map(ev => ({
      title: ev.name || 'Untitled Academy event',
      start: ev.scheduled_start_time,
      venue: 'Academy — The Crown',
      url: `https://discord.com/events/${GUILD_ID}/${ev.id}`,
      description: ev.description || '',
      image: ev.image
        ? `https://cdn.discordapp.com/guild-events/${ev.id}/${ev.image}.png?size=512`
        : null,
      source: 'academy'
    }));

    res.status(200).json({ events });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
