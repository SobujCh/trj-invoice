const firebase1 = require('firebase-admin');
const dotenv = require('dotenv');
dotenv.config();
const serviceAccount = {
  "type": "service_account",
  "project_id": "trj-bgd",
  "private_key_id": process.env.PROXY_PRIVATE_KEY_ID,
  "private_key": process.env.PROXY_PRIVATE_KEY,
  "client_email": "firebase-adminsdk-fbsvc@trj-bgd.iam.gserviceaccount.com",
  "client_id": "115418904246595643324",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40trj-bgd.iam.gserviceaccount.com",
  "universe_domain": "googleapis.com"
}
const databaseURL = "https://trj-bgd-default-rtdb.firebaseio.com";
const appName = "trj-bgd"; // The name you are using for the app

let appInstance;

// Check if an app with this name already exists in the current process
const existingApp = firebase1.apps.find(app => app.name === appName);

if (existingApp) {
  appInstance = existingApp; // Use the existing initialized app
} else {
  // If it doesn't exist, initialize it with the name
  appInstance = firebase1.initializeApp({
    credential: firebase1.credential.cert(serviceAccount),
    databaseURL
  }, appName); // Pass the appName as the second argument
}

// Get the database service from the named app instance
const database = appInstance.database();
module.exports = database;