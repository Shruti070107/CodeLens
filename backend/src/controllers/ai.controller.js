const aiService = require("../services/ai.service");

module.exports.getReview = async (req, res) => {
    const { code } = req.body || {};

    if (!code || typeof code !== "string" || !code.trim()) {
        return res.status(400).send("Code is required to generate a review.");
    }

    try {
        const response = await aiService(code);
        res.send(response);
    } catch (error) {
        console.error("AI review error:", error);
        res.status(500).send(error.message || "Failed to generate review");
    }
};