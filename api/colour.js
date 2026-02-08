export default async function handler(req, res){
    const { colour } = req.query;
    if (!colour || !/^[a-zA-Z]+$/.test(colour)) {
        return res.status(400).json({ error: "Invalid colour" });
    }

    try{
        const response = await fetch(`https://csscolorsapi.com/api/colors/${encodeURIComponent(colour)}`);
        if(!response.ok){
            return res.status(404).json({ error: "Colour not found" });
        }
        const data = await r.json();
        res.json(data);
    }catch{
        res.status(500).json({ error: "Failed to fetch colour" });
    }
}