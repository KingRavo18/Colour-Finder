export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");

  const { colour } = req.query;

  if (!colour || !/^[a-zA-Z]+$/.test(colour)) {
    return res.status(400).json({ error: "Invalid colour" });
  }

  try {
    const r = await fetch(`https://csscolorsapi.com/api/colors/${encodeURIComponent(colour)}`);

    if(!r.ok){
      return res.status(404).json({ error: "Colour not found" });
    }

    const data = await r.json();
    res.json(data);
  } catch {
    res.status(500).json({ error: "Failed to fetch colour" });
  }
}