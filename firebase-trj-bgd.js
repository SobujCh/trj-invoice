const firebase1 = require('firebase-admin');
const serviceAccount = {
  "type": "service_account",
  "project_id": "trj-bgd",
  "private_key_id": "154ee500178ecfa902f504acc15121928ef272af",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQD0HW9DOZnkBRWA\nRBjlPliCCuPd1o9lYYZzNz8LFkWXBEnYT1piBgGkA/M0n2Xm0XkbxPUtpMU9VEKn\nE5keYzNqi6hvaaTuRmEg/yCGnieiDM2UTeQEQ7rXt9imZKfw6B+spAjKUKfOT4H+\nxxySZFnd2t9THB9rdpkuH8ucnURdpIkJ5qCNANmzAG7jXk0S+ZaLAl6Czes4JfaI\n1FFd4L9eD/FYt1Kq0QEdVhZy3auZ8gMu1LrYiU4fGv6M01Eg5M/g6iqnE5Ujs2Wa\nliMqByoxcH5hVyeltnlhmWIWfzz3gf6D3Y6agVwmq/slQ2QczrVmr2qX22R9IZTy\n3Nt1GjNNAgMBAAECggEAATY5hyvnXP++y5Q1oMMJIsbLEB7bN2BJ5T3bokJ0tfs0\nzU4Xihpdh7g9TNWTEUJDnPpX/Tyu008dGuyN+134CLSzcVok53SR/DKdXA23mfur\nnuuEEOwFJsJS4QCUP4M8z66WHJWp6kGayO5UG1CZjEW54L+9qDA+h8FrUVZhMIB4\nx5/if5shBxfseVb8fW1k6yfSQjfP+xyWfsuy7tH8x0LrJC9gvjlDyqCnwcAQke/9\nGvhEU0zRV9BeAnuD67mHKOb0CumYerqgP1PMffaPZzL5cqcF98pzukuWNPy9qyMq\ncMQLF+4fZVaPg8Mbx4evxvqAV6mYHb8l9XXeE57QQQKBgQD7KgLRqMK49Rgw2KOb\niGmqCZvqACF3UMNDwP81jyhPhgbs/TId7jL+bPrazVpHgffCtN5MRPfUTXVP4Cht\nuh3RAvHNtj8HPkDJgMkwAQd6pSRdSfpwnu/SGaiPYR3BF7CfF3LUl9KTC41bUJG/\n70XU74FF0Me/hDEDEeWPLN44+wKBgQD40K2tt/IWmXyEZFWU408giCmJ/Nji6hXk\nk77DytlG/gtSs8R5xYdw8AE5wO6uDyT45wv4XByCw7YVWaGnJaMm7AuN1U/JcbFR\nHwKZpH+o6vN9MCv26RGGKxplJF9k41usEUg24kAaUS/KEZSgANcPrgsBgE6Smxef\nCgVNNbKiVwKBgAdIFITXi62pDWZ9IWEk90tCtA54qn+3C7IvKjb3S4firti4Dnfn\nq/rMVgl54qAoGHLAo6E6bqTtCfWi3gkwWCTzHOeF3RXsrBwra6nEnd7kYsWBm40g\nTnuc2tItUpuCgFBccavQKv6wWwzGrTMPUMr3lpvbja7zuigIoMsh1d95AoGBAM9C\nDJo7MnYuzjD93ugR3LStl2Rw8T07XpczluFDFHB1Z3sxcYU5zBOAaJTyKB9nUBXh\nZ/Au0jT+z6rDKcuwp1Hhp9IykK6tfNWk7iaLhydu5vot6UFYbZeESg1cGfZRCOiw\n0KWfG2SQoi1BLbuGV56hDFvoxAqNFEUPNNFW3IErAoGAVbJBZSdc/n9UNla6h96G\ng+66Rar0ItWfXCkGhCOIZIHHNRrPNFoNIOv7SmFAmCLtGKqd4SzIk1dyDaVEYDm4\ndMAERRW5dgERXsFHLD9Afrr1FqZY8kcJN2MeYIQs8pXy8Lc/mjGtdRijKFJh4dJ7\nqzzmFU+uxhcBMMn3Mt9mypw=\n-----END PRIVATE KEY-----\n",
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