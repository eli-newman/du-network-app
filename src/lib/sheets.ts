import { google } from "googleapis";
import { Profile } from "@/types";

const SHEET_NAME = "Sheet1";

function getAuth() {
  return new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_CLIENT_EMAIL?.trim(),
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n").trim(),
    },
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
}

function sheetId() {
  return process.env.GOOGLE_SHEET_ID?.trim();
}

export async function getProfiles(): Promise<Profile[]> {
  const auth = getAuth();
  const sheets = google.sheets({ version: "v4", auth });

  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: sheetId(),
    range: `${SHEET_NAME}!A2:K`,
  });

  const rows = res.data.values ?? [];

  return rows
    .filter((row) => row[9] === "TRUE") // Approved column (J)
    .map((row) => ({
      name: row[0] ?? "",
      major: row[1] ?? "",
      gradYear: row[2] ?? "",
      website: row[3] ?? "",
      building: row[4] ?? "",
      photoUrl: row[5] ?? "",
      linkedin: row[6] ?? "",
      github: row[7] ?? "",
      twitter: row[8] ?? "",
    }));
}

export async function addProfile(data: Omit<Profile, never>): Promise<void> {
  const auth = getAuth();
  const sheets = google.sheets({ version: "v4", auth });

  await sheets.spreadsheets.values.append({
    spreadsheetId: sheetId(),
    range: `${SHEET_NAME}!A:K`,
    valueInputOption: "RAW",
    requestBody: {
      values: [
        [
          data.name,
          data.major,
          data.gradYear,
          data.website,
          data.building,
          data.photoUrl,
          data.linkedin,
          data.github,
          data.twitter,
          "TRUE", // auto-approve
          new Date().toISOString(),
        ],
      ],
    },
  });
}
