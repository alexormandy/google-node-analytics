const { google } = require("googleapis");
const express = require("express");
const path = require("path");

const port = process.env.PORT || 3000;
const app = express();
const publicDirectory = path.join(__dirname, "./public");
app.use(express.static(publicDirectory));

const key = require("./config/auth.json");
process.env.GOOGLE_APPLICATION_CREDENTIALS = "./config/auth.json";
const view_id = key.view_id;

const scopes = "https://www.googleapis.com/auth/analytics.readonly";
const jwt = new google.auth.JWT(
  key.client_email,
  null,
  key.private_key,
  scopes
);

app.get("/fetch", async (req, res) => {
  let todayResult = await getToday();
  let yesterdayResult = await getYesterday();
  let thirtyDaysResult = await get30Days();

  res.send({
    today: todayResult,
    yesterday: yesterdayResult,
    last30Days: thirtyDaysResult,
  });
});

async function getToday() {
  try {
    const result = await google.analytics("v3").data.ga.get({
      auth: jwt,
      ids: "ga:" + view_id,
      "start-date": "today",
      "end-date": "today",
      metrics: "ga:users",
    });
    return result.data.rows[[0][0]];
  } catch (error) {
    console.log(error);
  }
}

async function getYesterday() {
  try {
    const result = await google.analytics("v3").data.ga.get({
      auth: jwt,
      ids: "ga:" + view_id,
      "start-date": "yesterday",
      "end-date": "yesterday",
      metrics: "ga:users",
    });
    return result.data.rows[[0][0]];
  } catch (error) {
    console.log(error);
  }
}

async function get30Days() {
  try {
    const result = await google.analytics("v3").data.ga.get({
      auth: jwt,
      ids: "ga:" + view_id,
      "start-date": "30daysAgo",
      "end-date": "today",
      metrics: "ga:users",
    });
    return result.data.rows[[0][0]];
  } catch (error) {
    console.log(error);
  }
}

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
