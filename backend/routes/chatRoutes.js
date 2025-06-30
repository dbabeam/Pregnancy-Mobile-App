const express = require('express');
const router = express.Router();
const { Configuration, OpenAIApi } = require('openai');

// Load your OpenAI key from environment variable
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// AI chat endpoint
router.post('/ask', async (req, res) => {
  const { question } = req.body;

  if (!question) {
    return res.status(400).json({ error: 'Question is required' });
  }

  try {
    const completion = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful medical assistant focused on pregnancy-related symptoms.',
        },
        {
          role: 'user',
          content: question,
        },
      ],
    });

    const aiResponse = completion.data.choices[0].message.content;
    res.status(200).json({ answer: aiResponse });
  } catch (error) {
    console.error('OpenAI API Error:', error);
    res.status(500).json({ error: 'Failed to fetch AI response' });
  }
});

module.exports = router;
