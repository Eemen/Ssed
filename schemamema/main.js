const fs = require('fs');
const Ajv = require("ajv");
const addFormats = require("ajv-formats");

const ajv = new Ajv({ allErrors: true }); // Enable detailed error messages
addFormats(ajv); // Add support for formats like "date", "email", etc.

const schema = {
    "$schema": "http://json-schema.org/draft-07/schema#",
    "type": "object",
    "properties": {
        "info": {
            "type": "object",
            "properties": {
                "erstellt": { "type": "string", "format": "date" },
                "verein": { "type": "string" },
                "ipaddresse": {
                    "type": "string",
                    "pattern": "^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$" // IPv4 pattern
                }
            },
            "required": ["erstellt", "verein", "ipaddresse"]
        },
        "anmeldung": {
            "type": "object",
            "properties": {
                "Anrede": { "type": "string" },
                "Familienname": { "type": "string" },
                "Vorname": { "type": "string" },
                "Strasse": { "type": "string" },
                "Plz": { "type": "string", "pattern": "^\\d{4,5}$" },
                "Ort": { "type": "string" },
                "Land": { "type": "string" },
                "Telefon": { "type": "string" },
                "Telefax": { "type": "string" },
                "Mail-Adresse": {
                    "type": "string",
                    "pattern": "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$" // Basic email pattern
                }
            },
            "required": ["Anrede", "Familienname", "Vorname", "Strasse", "Plz", "Ort", "Land"]
        },
        "teilnehmer": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "Nachname": { "type": "string" },
                    "Vorname": { "type": "string" },
                    "Altersklasse": { "type": "string" },
                    "Klasse": { "type": "string" },
                    "Startzeit": { "type": "string" }
                },
                "required": ["Nachname", "Vorname", "Altersklasse", "Klasse", "Startzeit"]
            }
        }
    },
    "required": ["info", "anmeldung", "teilnehmer"]
};

const validate = ajv.compile(schema);

// Hardcoded file path
const filePath = './data.json'; // Update with your actual path to the JSON file

// Function to read the JSON file and validate it
const validateJsonFromFile = (filePath) => {
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error("Error reading the file:", err.message);
            return;
        }

        try {
            const jsonData = JSON.parse(data);
            const valid = validate(jsonData);
            if (valid) {
                console.log("JSON is valid!");
            } else {
                console.log("Validation errors:", validate.errors);
            }
        } catch (error) {
            console.log("Invalid JSON format:", error.message);
        }
    });
};

// Validate the JSON file at the hardcoded path
validateJsonFromFile(filePath);
