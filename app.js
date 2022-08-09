const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();

app.use(express.static("public"));

app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/index.html");
})

app.post("/", function(req, res) {
  var name = req.body.name;
  var email = req.body.email;
  var subject = req.body.subject;
  var message = req.body.message;

  var data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          NAME: name,
          SUBJECT: subject,
          MESSAGE: message
        }
      }
    ]
  };

  var jsonData = JSON.stringify(data);

  const url = "https://us17.api.mailchimp.com/3.0/lists/5c960f64c0"
  const options = {
    method: "POST",
    auth: "anay:02fc719d05e2da4e2efad6aee06a9fe9-us17"
  };

  const request = https.request(url, options, function(response) {

    if (response.statusCode === 200) {
      res.sendFile(__dirname + "/");
    } else {
      res.send("Error 404: Unsuccessful send of message. Please directly email me at aroge@emory.edu");
    }

    response.on("data", function(data) {
      console.log(JSON.parse(data));
    })
  });

  request.write(jsonData);
  request.end();
});

app.listen(process.env.PORT || 3000, function() {
  console.log("Server started on port 3000");
})
