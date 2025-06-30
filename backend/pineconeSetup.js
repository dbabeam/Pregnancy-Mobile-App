require('dotenv').config();
const { Pinecone } = require('@pinecone-database/pinecone');
const axios = require('axios');

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const PINECONE_API_KEY = process.env.PINECONE_API_KEY;
const PINECONE_ENVIRONMENT = process.env.PINECONE_ENVIRONMENT;
const PINECONE_INDEX_NAME = process.env.PINECONE_INDEX_NAME;

const pinecone = new Pinecone({
  apiKey: PINECONE_API_KEY,
  controllerHostUrl: `https://controller.${PINECONE_ENVIRONMENT}.pinecone.io`,
});

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function getEmbedding(text, retries = 3, backoff = 2000) {
  try {
    const response = await axios.post(
      'https://api.openai.com/v1/embeddings',
      {
        input: text,
        model: 'text-embedding-3-small',
      },
      {
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data.data[0].embedding;
  } catch (err) {
    if (err.response && err.response.status === 429 && retries > 0) {
      console.warn(`⚠️ Rate limit hit. Retrying in ${backoff}ms...`);
      await delay(backoff);
      return getEmbedding(text, retries - 1, backoff * 2); // exponential backoff
    }
    throw err;
  }
}

async function upsertSymptoms(symptoms) {
  const index = pinecone.Index(PINECONE_INDEX_NAME);

  for (const symptom of symptoms) {
    try {
      const embedding = await getEmbedding(symptom.description);
      await index.upsert([
        {
          id: symptom.symptom.toLowerCase().replace(/\s+/g, '-'),
          values: embedding,
          metadata: {
            symptom: symptom.symptom,
            advice: symptom.advice,
          },
        },
      ]);
      console.log(`✅ Upserted: ${symptom.symptom}`);

      // Add a delay between each upsert to avoid hitting rate limits
      await delay(1500);
    } catch (err) {
      console.error(`❌ Skipped ${symptom.symptom} due to error:`, err.message);
    }
  }
}

// Example symptoms
const symptoms = [
  {
    symptom: 'Morning Sickness',
    description: 'Nausea and vomiting in early pregnancy.',
    advice: 'Eat small meals frequently and stay hydrated.',
  },
  {
    symptom: 'Fatigue',
    description: 'Feeling tired and exhausted during pregnancy.',
    advice: 'Take naps and eat energy-rich foods.',
  },
];

upsertSymptoms(symptoms).catch(err => console.error('❌ Error during upsert:', err));
