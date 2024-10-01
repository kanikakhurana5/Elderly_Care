const express = require('express');
const bodyParser = require('body-parser');
const twilio = require('twilio');


const app = express();
const port = 3000;


// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public')); // Serve files from the public folder


// Your Twilio credentials
const accountSid = '..........' // Replace with your Twilio Account SID
const authToken = '........'; // Replace with your Twilio Auth Token
const twilioClient = twilio(accountSid, authToken);


// API endpoint to send SMS
// API endpoint to send SMS
app.post('/send-sms', (req, res) => {
    const { to, message } = req.body; // Change 'body' to 'message' for clarity


    twilioClient.messages
        .create({
            body: message, // Use the actual message from the request
            from: '+.......', // Replace with your Twilio phone number
            to: to, // Use the 'to' number from the request
        })
        .then(message => res.status(200).send(`Message sent with SID: ${message.sid}`))
        .catch(err => res.status(500).send(err));
});




// Serve home.html
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/home.html'); // Adjust the path to your home.html
});


app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
