import express from "express";
import bodyParser from "body-parser";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(bodyParser.json());

const MERCHANT_CODE = process.env.MERCHANT_CODE;
const API_KEY = process.env.API_KEY;
const ROBLOX_API_KEY = process.env.ROBLOX_API_KEY;
const UNIVERSE_ID = process.env.UNIVERSE_ID;
const TOPIC = "BagibagiDonation";


// ======================================================
// 1️⃣ Webhook TEST (GET) - Bagibagi uses GET for testing
// ======================================================
app.get("/bagibagi-webhook", (req, res) => {
    console.log("Webhook TEST:", req.query);
    return res.json({ success: true, message: "Webhook GET Test OK" });
});


// ======================================================
// 2️⃣ Webhook DONATION (POST) - Real donation
// ======================================================
app.post("/bagibagi-webhook", async (req, res) => {
    console.log("🔥 NEW DONATION:", req.body);

    const donation = {
        userName: req.body.userName || req.body.name || "Anonymous",
        amount: req.body.amount,
        message: req.body.message || "",
        isVerified: req.body.isVerified ?? true,
        isAnonymous: req.body.isAnonymous ?? false,
        mediaShareUrl: req.body.mediaShareUrl,
        createdAt: req.body.created_at
    };

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


// Root
app.get("/", (req, res) => res.send("Bagibagi → Roblox Adapter Running!"));

// Run
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
