import express from "express";
import bodyParser from "body-parser";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(bodyParser.json());

// ENV VARIABLES
const MERCHANT_CODE = process.env.MERCHANT_CODE;
const API_KEY       = process.env.API_KEY;
const ROBLOX_API_KEY = process.env.ROBLOX_API_KEY;
const UNIVERSE_ID   = process.env.UNIVERSE_ID;
const TOPIC         = "BagibagiDonation";

// =========================
// WEBHOOK DARI BAGIBAGI
// =========================
app.post("/bagibagi-webhook", async (req, res) => {
    console.log("🔥 NEW DONATION:", req.body);

    const donation = {
        userName: req.body.userName,
        amount: req.body.amount,
        message: req.body.message ?? "",
        isVerified: req.body.isVerified,
        isAnonymous: req.body.isAnonymous
    };

    // Kirim ke Roblox MessagingService
    const robloxRes = await fetch(
        `https://apis.roblox.com/messaging-service/v1/universes/${UNIVERSE_ID}/topics/${TOPIC}`,
        {
            method: "POST",
            headers: {
                "x-api-key": ROBLOX_API_KEY,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                message: JSON.stringify(donation)
            })
        }
    );

    console.log("Roblox:", robloxRes.status);

    return res.json({ success: true });
});

// TEST
app.get("/", (req, res) => res.send("Bagibagi → Roblox Adapter Running!"));

// =========================
// IMPORTANT: RAILWAY FIX
// =========================
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
