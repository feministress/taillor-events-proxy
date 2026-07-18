export default async function handler(req, res) {
  const token = process.env.EVENTBRITE_TOKEN;
  const orgId = process.env.EVENTBRITE_ORG_ID;

  const ebRes = await fetch(
    `https://www.eventbriteapi.com/v3/organizations/${orgId}/events/?token=${token}&expand=venue&status=live`
  );
  const data = await ebRes.json();

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 's-maxage=600');
  res.status(200).json(data);
}
