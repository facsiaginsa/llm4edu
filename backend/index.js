const express = require('express');
const bodyParser = require('body-parser');
const { analyzeText } = require('./textAnalyzer'); // Custom text analyzer logic

const cors = require('cors');


const app = express();
app.use(cors());  // Enable CORS for all routes
app.use(bodyParser.json());
app.post('/analyze', (req, res) => {
    const { text } = req.body;
    const suggestions = analyzeText(text); // Analyze the text and return suggestions
    res.json({ suggestions });
});

app.listen(3001, () => {
  console.log('Server is running on port 3000');
});
