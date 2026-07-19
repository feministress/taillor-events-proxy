export default async function handler(req, res) {
  const token = process.env.EVENTBRITE_TOKEN;
  const orgId = process.env.EVENTBRITE_ORG_ID;

  let events = [];
  let continuation = null;
  let pageCount = 0;
  const maxPages = 10; // safety cap, ~500 events

  do {
    let url = `https://www.eventbriteapi.com/v3/organizations/${orgId}/events/?token=${token}&expand=venue&status=live&order_by=start_asc`;
    if (continuation) url += `&continuation=${continuation}`;

    const ebRes = await fetch(url);
    const data = await ebRes.json();

    events = events.concat(data.events || []);
    continuation = data.pagination?.has_more_items ? data.pagination.continuation : null;
    pageCount++;
  } while (continuation && pageCount < maxPages);

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 's-maxage=600');
  res.status(200).json({ events });
}
