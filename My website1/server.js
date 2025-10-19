// server.js
const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static frontend
app.use(express.static(path.join(__dirname, 'public')));

// Simple API: list of items (videos/links)
const items = [
  { id: 1, title: "مثال - فيديو يوتيوب", type: "youtube", url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" },
  { id: 2, title: "مثال - صفحة داخلية", type: "page", url: "/pages/sample.html" }
];

app.get('/api/items', (req, res) => {
  res.json(items);
});

// Healthcheck
app.get('/health', (req, res) => res.send('ok'));

// Fallback to index.html for SPA routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
