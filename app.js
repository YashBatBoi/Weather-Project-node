const express = require("express");
// Inbuilt library to get the api's data from some other server known as "native Node HTTPS module"
const https = require("https");
// This package is going to allow us to look through the body of the post request and fetch the data based on the "name" of the input
const bodyParser = require("body-parser");
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.post("/", function (req, res) {
  const cityName = req.body.cityName;
  const token = "343513e9f21e41095a5ab60a436292e6";
  const units = "metric";
  const url =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    cityName +
    "&appid=" +
    token +
    "&units=" +
    units;

  // With the use of the inbuilt library "https" their is an inbuilt method of https ".get" where we can call the API using two parameter adding into it.
  https.get(url, function (response) {
    console.log(response.statusCode);

    // This we are using an listener method on the response that we are getting.
    response.on("data", function (data) {
      const weatherData = JSON.parse(data);
      // console.log(weatherData);

      const weatherDescription = weatherData.weather[0].description;
      const temp = weatherData.main.temp;
      const icon = weatherData.weather[0].icon;

      const weatherIcon =
        "http://openweathermap.org/img/wn/" + icon + "@2x.png";

      // We can't use the send method more than once but we can use the write method multiple times.
      res.write("<p>The weather is currently " + weatherDescription + "</p>");
      res.write(
        "<h1>The temperature in " +
          cityName +
          " is " +
          temp +
          " degree Celsius</h1>"
      );
      res.write("<img src=" + weatherIcon + ">");

      // There should be only one send in a particular API otherwise it will crash the server or application.
      res.send();
    });
  });
});

// For listening to a specific port where our server wants to runMain
app.listen(3000, function () {
  console.log("Server is running on port 3000");
});
