// server.mjs
import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const NYTIMES_API_KEY = process.env.NYTIMES_API_KEY;

app.use(cors());
app.use(express.json());


app.get('/api/search', async (req, res) => {
  try {
    const { query = '', begin_date = '', end_date = '', page = 0 } = req.query;
    const encodedQuery = encodeURIComponent(query);
    const apiUrl = `https://api.nytimes.com/svc/search/v2/articlesearch.json?api-key=${NYTIMES_API_KEY}&q=${encodedQuery}`;

    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error(`NYT API Error: ${response.statusText}`);
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/article/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const apiUrl = `https://api.nytimes.com/svc/search/v2/articlesearch.json?api-key=${NYTIMES_API_KEY}&fq=_id:("${id}")`;

    const response = await fetch(apiUrl);
    if (!response.ok) throw new Error(`NYT API Error: ${response.statusText}`);

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: error.message });
  }
});


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
