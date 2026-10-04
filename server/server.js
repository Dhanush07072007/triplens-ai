import express from "express";
import cors from "cors";
import multer from "multer";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ==========================================
// MIDDLEWARE
// ==========================================

app.use(cors());
app.use(express.json());

// ==========================================
// IMAGE UPLOAD
// ==========================================

const upload = multer({
  storage: multer.memoryStorage(),

  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});

// ==========================================
// GEMINI
// ==========================================

if (!process.env.GEMINI_API_KEY) {
  console.error("");
  console.error("❌ GEMINI_API_KEY is missing.");
  console.error("Check your .env file.");
  console.error("");

  process.exit(1);
}

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// Primary model + fallbacks
const MODELS = [
  "gemini-3.8-flash",
  "gemini-3.7-flash",
  "gemini-3.6-flash",
  "gemini-3.5-flash",
];

// ==========================================
// WAIT FUNCTION
// ==========================================

function wait(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

// ==========================================
// GEMINI REQUEST WITH RETRY + FALLBACK
// ==========================================

async function generateWithFallback(contents) {
  let lastError = null;

  for (const model of MODELS) {
    console.log("");
    console.log("=================================");
    console.log("🤖 Trying Gemini model:");
    console.log(model);
    console.log("=================================");

    // Retry each model up to 3 times
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        console.log(
          `Attempt ${attempt}/3 using ${model}`
        );

        const response =
          await ai.models.generateContent({
            model,
            contents,
          });

        console.log(
          `✅ ${model} responded successfully`
        );

        return {
          response,
          model,
        };
      } catch (error) {
        lastError = error;

        const status = error?.status;

        const message =
          error?.message ||
          "Unknown Gemini error";

        console.error("");
        console.error(
          `❌ ${model} failed`
        );
        console.error(
          `Status: ${status}`
        );
        console.error(message);

        // Only retry temporary server/rate-limit errors
        const shouldRetry =
          status === 503 ||
          status === 429 ||
          status === 500 ||
          status === 502 ||
          status === 504;

        if (!shouldRetry) {
          console.error(
            "❌ This is not a temporary error."
          );

          throw error;
        }

        if (attempt < 3) {
          const delay =
            Math.pow(2, attempt) * 1000;

          console.log(
            `⏳ Waiting ${delay / 1000} seconds before retry...`
          );

          await wait(delay);
        }
      }
    }

    console.log("");
    console.log(
      `⚠️ ${model} unavailable after 3 attempts.`
    );

    console.log(
      "➡️ Trying next Gemini model..."
    );
  }

  throw lastError;
}

// ==========================================
// CLEAN GEMINI JSON
// ==========================================

function cleanJson(text) {
  return text
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();
}

// ==========================================
// TEST ROUTE
// ==========================================

app.get("/", (req, res) => {
  res.json({
    message:
      "TripLens AI backend is running!",
    models: MODELS,
  });
});

// ==========================================
// VERSION 3
// AI IMAGE ANALYSIS
// ==========================================

app.post(
  "/api/analyze-image",
  upload.single("image"),
  async (req, res) => {
    console.log("");
    console.log("=================================");
    console.log("📸 IMAGE ANALYSIS REQUEST");
    console.log("=================================");

    try {
      // -------------------------------
      // Check image
      // -------------------------------

      if (!req.file) {
        return res.status(400).json({
          error:
            "Please upload an image.",
        });
      }

      console.log(
        "✅ Image received"
      );

      console.log(
        "File name:",
        req.file.originalname
      );

      console.log(
        "File type:",
        req.file.mimetype
      );

      console.log(
        "File size:",
        req.file.size
      );

      // -------------------------------
      // Check image type
      // -------------------------------

      const allowedTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/webp",
        "image/heic",
        "image/heif",
        "image/gif",
        "image/avif",
      ];

      if (
        !allowedTypes.includes(
          req.file.mimetype
        )
      ) {
        return res.status(400).json({
          error:
            "Unsupported image type. Please upload JPG, PNG, WEBP, HEIC, HEIF, GIF or AVIF.",
        });
      }

      // -------------------------------
      // Base64
      // -------------------------------

      const base64Image =
        req.file.buffer.toString(
          "base64"
        );

      console.log(
        "✅ Image converted to Base64"
      );

      console.log(
        "Base64 length:",
        base64Image.length
      );

      // -------------------------------
      // Prompt
      // -------------------------------

      const prompt = `
You are TripLens AI, an AI-powered travel discovery assistant.

Analyze the uploaded travel photograph.

Tasks:

1. Identify what type of place is shown.
2. Describe what can be seen.
3. Suggest three destinations in India with a similar travel experience.
4. Give a short reason for each recommendation.

Rules:

- Do not claim the exact location unless there is strong evidence.
- Do not invent landmarks.
- Keep recommendations realistic.
- Return ONLY valid JSON.
- Do not use Markdown.
- Do not use code fences.

Return exactly:

{
  "placeType": "string",
  "description": "string",
  "suggestedPlaces": [
    {
      "name": "string",
      "reason": "string"
    },
    {
      "name": "string",
      "reason": "string"
    },
    {
      "name": "string",
      "reason": "string"
    }
  ]
}
`;

      // -------------------------------
      // Gemini
      // -------------------------------

      const result =
        await generateWithFallback([
          {
            inlineData: {
              mimeType:
                req.file.mimetype,
              data: base64Image,
            },
          },
          {
            text: prompt,
          },
        ]);

      const response =
        result.response;

      console.log(
        "✅ AI model used:",
        result.model
      );

      let resultText =
        response.text || "";

      console.log("");
      console.log(
        "RAW GEMINI RESPONSE:"
      );
      console.log(resultText);

      if (!resultText) {
        return res.status(500).json({
          error:
            "Gemini returned an empty response.",
        });
      }

      // -------------------------------
      // Clean JSON
      // -------------------------------

      resultText =
        cleanJson(resultText);

      // -------------------------------
      // Parse JSON
      // -------------------------------

      let data;

      try {
        data =
          JSON.parse(resultText);
      } catch (error) {
        console.error(
          "❌ JSON parsing failed."
        );

        return res.status(500).json({
          error:
            "AI returned invalid JSON.",
          rawResponse: resultText,
        });
      }

      // -------------------------------
      // Validate
      // -------------------------------

      if (
        !data.placeType ||
        !data.description ||
        !Array.isArray(
          data.suggestedPlaces
        )
      ) {
        return res.status(500).json({
          error:
            "AI returned an unexpected response format.",
          result: data,
        });
      }

      console.log("");
      console.log(
        "================================="
      );
      console.log(
        "✅ IMAGE ANALYSIS SUCCESS"
      );
      console.log(
        "================================="
      );

      return res.json({
        ...data,
        modelUsed: result.model,
      });
    } catch (error) {
      console.error("");
      console.error(
        "================================="
      );
      console.error(
        "❌ IMAGE AI ERROR"
      );
      console.error(
        "================================="
      );

      console.error(error);

      return res.status(500).json({
        error:
          "Image analysis failed.",
        details:
          error?.message ||
          "Gemini service is temporarily unavailable.",
      });
    }
  }
);

// ==========================================
// VERSION 4 / 5
// AI ITINERARY
// ==========================================

app.post(
  "/api/generate-itinerary",
  async (req, res) => {
    console.log("");
    console.log(
      "================================="
    );
    console.log(
      "🗺️ ITINERARY REQUEST"
    );
    console.log(
      "================================="
    );

    try {
      const {
        destination,
        budget,
        days,
        people,
        interests,
      } = req.body;

      // -------------------------------
      // Validation
      // -------------------------------

      if (
        !destination ||
        !Number.isFinite(
          Number(budget)
        ) ||
        Number(budget) <= 0 ||
        !Number.isInteger(
          Number(days)
        ) ||
        Number(days) < 1 ||
        Number(days) > 14 ||
        !Number.isInteger(
          Number(people)
        ) ||
        Number(people) < 1 ||
        Number(people) > 20 ||
        !Array.isArray(interests) ||
        interests.length === 0
      ) {
        return res.status(400).json({
          error:
            "Please provide a valid destination, budget, duration, travelers and interests.",
        });
      }

      const safeDestination =
        String(destination).slice(
          0,
          100
        );

      const safeInterests =
        interests
          .map((item) =>
            String(item).slice(
              0,
              40
            )
          )
          .slice(0, 10);

      // -------------------------------
      // Prompt
      // -------------------------------

      const prompt = `
You are TripLens AI, a smart travel itinerary planner.

Create a practical travel itinerary.

Destination:
${safeDestination}

Total budget:
₹${Number(budget)}

Number of days:
${Number(days)}

Number of travelers:
${Number(people)}

Interests:
${safeInterests.join(", ")}

Requirements:

- Plan each day logically.
- Include approximate times.
- Include places and activities.
- Include descriptions.
- Include approximate costs in INR.
- Keep the plan within the user's budget where reasonably possible.
- Mention if the budget may be insufficient.
- Do not claim live booking availability.
- Do not claim exact live prices.
- Return ONLY valid JSON.
- Do not use Markdown.
- Do not use code fences.

Return exactly:

{
  "title": "string",
  "summary": "string",
  "budgetNote": "string",
  "estimatedTotal": 0,
  "days": [
    {
      "day": 1,
      "theme": "string",
      "activities": [
        {
          "time": "string",
          "place": "string",
          "description": "string",
          "estimatedCost": 0
        }
      ]
    }
  ],
  "moneyTips": [
    "string"
  ]
}
`;

      // -------------------------------
      // Gemini with fallback
      // -------------------------------

      const result =
        await generateWithFallback([
          {
            text: prompt,
          },
        ]);

      const response =
        result.response;

      console.log(
        "✅ AI model used:",
        result.model
      );

      let resultText =
        response.text || "";

      if (!resultText) {
        return res.status(500).json({
          error:
            "AI returned an empty itinerary.",
        });
      }

      resultText =
        cleanJson(resultText);

      // -------------------------------
      // Parse
      // -------------------------------

      let itinerary;

      try {
        itinerary =
          JSON.parse(resultText);
      } catch (error) {
        console.error(
          "❌ Itinerary JSON parsing failed."
        );

        return res.status(500).json({
          error:
            "AI returned invalid itinerary JSON.",
          rawResponse: resultText,
        });
      }

      console.log("");
      console.log(
        "================================="
      );
      console.log(
        "✅ ITINERARY GENERATED"
      );
      console.log(
        "================================="
      );

      return res.json({
        ...itinerary,
        modelUsed: result.model,
      });
    } catch (error) {
      console.error("");
      console.error(
        "================================="
      );
      console.error(
        "❌ ITINERARY AI ERROR"
      );
      console.error(
        "================================="
      );

      console.error(error);

      let message =
        "Could not generate the itinerary.";

      if (error?.status === 503) {
        message =
          "Gemini is temporarily busy. Please try again in a moment.";
      }

      if (error?.status === 429) {
        message =
          "Gemini request limit reached. Please wait and try again.";
      }

      return res.status(500).json({
        error: message,
        details:
          error?.message ||
          "Unknown Gemini error.",
      });
    }
  }
);

// ==========================================
// START SERVER
// ==========================================

app.listen(
  PORT,
   "0.0.0.0",
  () => {
    console.log("");
    console.log(
      "================================="
    );
    console.log(
      "🌍 TRIPLENS AI BACKEND"
    );
    console.log(
      "================================="
    );

    console.log(
      `🚀 Server: http://localhost:${PORT}`
    );

    console.log(
      "🤖 Gemini models:"
    );

    MODELS.forEach(
      (model, index) => {
        console.log(
          `${index + 1}. ${model}`
        );
      }
    );

    console.log(
      "📸 Image AI: /api/analyze-image"
    );

    console.log(
      "🗺️ Itinerary AI: /api/generate-itinerary"
    );

    console.log(
      "================================="
    );

    console.log("");
  }
);