const translate = require("@vitalets/google-translate-api");

export const translateText = async (text, targetLang = "mr") => {
  try {
    const res = await translate(text, { to: targetLang });
    return res.text; // Returns translated text
  } catch (error) {
    console.error("Translation error:", error);
    return text; // Fallback to original text if an error occurs
  }
};

