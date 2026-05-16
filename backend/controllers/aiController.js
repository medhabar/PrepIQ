const { GoogleGenAI } = require("@google/genai");
const { conceptExplainPrompt, questionAnswerPrompt } = require("../utils/prompt");

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const models = [
    "gemini-3-flash-preview", // primary
    "gemini-2.5-pro", // fallback 1
    "gemini-2.5-flash", // fallback 2
];

// @desc generate interview questions and answers using Gemini 
// @route POST /api/ai/generate-questions
// @access Private
const generateInterviewQuestions = async (req, res) => {
    try {
        const { role, experience, topicsToFocus, numberOfQuestions } = req.body;

        if(!role || !experience || !topicsToFocus || !numberOfQuestions) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const prompt = questionAnswerPrompt( role, experience, topicsToFocus, numberOfQuestions );

        let response;

        for (let model of models) {
            try {
                console.log("Trying:", model);

                response = await ai.models.generateContent({
                model,
                contents: prompt,
                });

                if (response?.text) {
                    console.log("Success with:", model);
                    break;
                }
            } catch (error) {
                console.log(`Failed with ${model}:`, error.message);
            }
        }

        if (!response || !response.text) {
          throw new Error("All AI models failed");
        }

        let rawText = response.text;

        // Clean it: Remove ```json and ``` from beginning and end
        const cleanedText = rawText
            .replace(/^```json\s*/, "")  // remove starting ```json
            .replace(/```$/, "")  // remove ending ```
            .trim();  // remove extra spaces

        // Now safe to parse
        const data = JSON.parse(cleanedText);

        res.status(200).json(data);
    } 
    catch (error) {
        res.status(500).json({
            message: "Failed to generate questions",
            error: error.message,
        });
    }
}

// @desc generate explaination of interview question
// @route POST /api/ai/generate-explanation
// @access Private
const generateConceptExplanation = async (req, res) => {
    try {
        const { question } = req.body;

        if(!question) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const prompt = conceptExplainPrompt(question);

        let response;

        for (let model of models) {
          try {
            console.log("Trying:", model);

            response = await ai.models.generateContent({
              model,
              contents: prompt,
            });

            if (response?.text) {
              console.log("Success with:", model);
              break;
            }
          } catch (error) {
            console.log(`Failed with ${model}:`, error.message);

            // ⏳ delay to avoid rate limits
            await new Promise((res) => setTimeout(res, 1000));
          }
        }

        if (!response || !response.text) {
          throw new Error("All AI models failed");
        }
        let rawText = response.text;

        // Clean it: Remove ```json and ``` from beginning and end
        const cleanedText = rawText
          .replace(/^```json\s*/, "") // remove starting ```json
          .replace(/```$/, "") // remove ending ```
          .trim(); // remove extra spaces

        // Now safe to parse
        const data = JSON.parse(cleanedText);

        res.status(200).json(data);
    }
    catch (error) {
        res.status(500).json({
            message: "Failed to generate questions",
            error: error.message,
        });
    }
}

module.exports = { generateInterviewQuestions, generateConceptExplanation };