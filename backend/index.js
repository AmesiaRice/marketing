require("dotenv").config();
const express = require("express");
const { google } = require("googleapis");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// Load credentials from .env file
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI ="http://localhost:5000/auth/callback"; // Ensure this matches Google Cloud Console
const SCOPES = ["https://www.googleapis.com/auth/spreadsheets"]; // UPDATED SCOPE

const oauth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

let savedTokens = null; // Store tokens in memory

// Redirect to Google OAuth consent screen
app.get("/auth", (req, res) => {
  const url = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
  });
  res.redirect(url);
});

// Handle OAuth callback & get access token
app.get("/auth/callback", async (req, res) => {
  try {
    const code = req.query.code;
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);
    savedTokens = tokens; // Save tokens in memory
    res.redirect("http://localhost:3000"); // Redirect to frontend after login
  } catch (error) {
    res.status(500).send("Authentication failed: " + error.message);
  }
});

// Check authentication status
app.get("/auth/status", (req, res) => {
  if (savedTokens) {
    res.json({ authenticated: true });
  } else {
    res.json({ authenticated: false });
  }
});

// Fetch data from Party_Visit_(1)2
app.get("/sheets", async (req, res) => {
  if (!savedTokens) {
    return res.status(401).send("Unauthorized: Please authenticate first.");
  }

  oauth2Client.setCredentials(savedTokens);
  const sheets = google.sheets({ version: "v4", auth: oauth2Client });
  const spreadsheetId = "1XW9GK72g_YGUUvvhF9XJVnBN44h3Jo93Q8PCxqzHfTg"; // Your Google Sheets ID

  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: "Party_Visit_(1)2!A7:H10000",
    });
    res.json(response.data.values);
  } catch (error) {
    res.status(500).send("Error fetching data: " + error.message);
  }
});

// Submit Data to Sheet2
app.post("/submit", async (req, res) => {
  if (!savedTokens) {
    return res.status(401).send("Unauthorized: Please authenticate first.");
  }

  oauth2Client.setCredentials(savedTokens);
  const sheets = google.sheets({ version: "v4", auth: oauth2Client });
  const spreadsheetId = "1XW9GK72g_YGUUvvhF9XJVnBN44h3Jo93Q8PCxqzHfTg"; // Your Google Sheets ID
  const { employee, selections } = req.body; // Data from frontend

  const newRow = [
    new Date().toLocaleString(), // Timestamp
    ...employee, // Employee details
    selections.saifcoExcel4 || "0",
    selections.saifcoExcel20 || "0",
    selections.saifcoWattanSe4 || "0",
    selections.saifcoWattanSe20 || "0",
    selections.saifcoSuper4 || "0",
    selections.saifcoGold4 || "0",
    selections.saifcoAmber4 || "0",
  ];

  try {
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: "Sheet2!A2", // Writing to Sheet2
      valueInputOption: "USER_ENTERED",
      resource: {
        values: [newRow],
      },
    });
    res.json({ success: true, message: "Data submitted successfully!" });
  } catch (error) {
    res.status(500).send("Error submitting data: " + error.message);
  }
});

// Submit Data to Party_Visit_(1)2
app.post("/submitSameSheet", async (req, res) => {
  if (!savedTokens) {
    return res.status(401).send("Unauthorized: Please authenticate first.");
  }

  oauth2Client.setCredentials(savedTokens);
  const sheets = google.sheets({ version: "v4", auth: oauth2Client });
  const spreadsheetId = "1XW9GK72g_YGUUvvhF9XJVnBN44h3Jo93Q8PCxqzHfTg"; // Your Google Sheets ID
  const { employee } = req.body; // Data from frontend

  const newRow = [
    new Date().toLocaleString(),
    ...Object.values(employee), // Employee details
  ];

  try {
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: "Party_Visit_(1)2!A8", // Writing to Sheet1
      valueInputOption: "USER_ENTERED",
      resource: {
        values: [newRow],
      },
    });
    res.json({ success: true, message: "Data submitted successfully!" });
  } catch (error) {
    res.status(500).send("Error submitting data: " + error.message);
  }
});

// Update existing row in Sheet1
app.post("/updateRow", async (req, res) => {
  if (!savedTokens) {
    return res.status(401).send("Unauthorized: Please authenticate first.");
  }

  oauth2Client.setCredentials(savedTokens);
  const sheets = google.sheets({ version: "v4", auth: oauth2Client });
  const spreadsheetId = "1XW9GK72g_YGUUvvhF9XJVnBN44h3Jo93Q8PCxqzHfTg"; // Your Google Sheets ID
  const { originalRow, updatedRow } = req.body; // Data from frontend

  try {
    // Find the row index of the original row
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: "Party_Visit_(1)2!A7:H10000",
    });
    const rows = response.data.values;
    const rowIndex = rows.findIndex(row => JSON.stringify(row) === JSON.stringify(originalRow));

    if (rowIndex === -1) {
      return res.status(404).send("Row not found");
    }

    // Update the row
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `Party_Visit_(1)2!A${rowIndex + 7}`, // Adjust the range to match the row index
      valueInputOption: "USER_ENTERED",
      resource: {
        values: [Object.values(updatedRow)],
      },
    });
    res.json({ success: true, message: "Row updated successfully!" });
  } catch (error) {
    res.status(500).send("Error updating row: " + error.message);
  }
});

app.listen(5000, () => console.log("Server running on http://localhost:5000"));
