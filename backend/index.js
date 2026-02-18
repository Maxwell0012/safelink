require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const admin = require('firebase-admin');
const rateLimit = require('express-rate-limit');

// Import the Master Key
const serviceAccount = require('./serviceAccountKey.json');

// Connect to Database
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
const db = admin.firestore();

const app = express();
app.use(cors());
app.use(express.json());

// SECURITY: Limit each IP to 100 requests per 15 minutes
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later."
});

// Apply to all requests
app.use(limiter);

const API_KEY = process.env.GOOGLE_API_KEY;

// 1. Homepage
app.get('/', (req, res) => {
  res.send('SafeLink Backend is Alive! 🚀');
});

// 2. Shorten URL (Virus Check + Save)
app.post('/shorten', async (req, res) => {
  const originalUrl = req.body.url;
  console.log("🔍 Checking:", originalUrl);

  try {
    // A. Virus Check
    const googleResponse = await axios.post(
      `https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${API_KEY}`,
      {
        client: { clientId: "safelink", clientVersion: "1.0.0" },
        threatInfo: {
          threatTypes: ["MALWARE", "SOCIAL_ENGINEERING"],
          platformTypes: ["ANY_PLATFORM"],
          threatEntryTypes: ["URL"],
          threatEntries: [{ url: originalUrl }]
        }
      }
    );

    if (googleResponse.data.matches) {
      console.log("⚠️ THREAT DETECTED!");
      return res.json({ status: "Unsafe", message: "🚫 Dangerous URL Detected!" });
    }

    // B. Save to DB (Start Clicks at 0)
    const shortId = Math.random().toString(36).substring(2, 8);
    await db.collection('urls').doc(shortId).set({
      originalUrl: originalUrl,
      clicks: 0, 
      createdAt: new Date()
    });

    console.log(`✅ Saved: ${shortId}`);
    
    // Send back the full short URL
    res.json({ 
      status: "Safe", 
      message: "Link shortened!",
      shortUrl: `http://localhost:8080/${shortId}` 
    });

  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ status: "Error", message: "Server Error" });
  }
});

// 3. Redirect (AND COUNT CLICKS)
app.get('/:shortId', async (req, res) => {
  const shortId = req.params.shortId;
  const docRef = db.collection('urls').doc(shortId);
  const doc = await docRef.get();

  if (!doc.exists) return res.status(404).send('Link not found 😢');

  // Increment Click Count
  await docRef.update({
    clicks: admin.firestore.FieldValue.increment(1)
  });

  res.redirect(doc.data().originalUrl);
});

// 4. Get Stats (For the Dashboard)
app.get('/stats/:shortId', async (req, res) => {
  const shortId = req.params.shortId;
  const doc = await db.collection('urls').doc(shortId).get();

  if (!doc.exists) return res.status(404).json({ error: "Not found" });

  res.json({ 
    clicks: doc.data().clicks, 
    originalUrl: doc.data().originalUrl 
  });
});

const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});