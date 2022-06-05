const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express(); //new instance of express

app.set("view engine", "ejs"); //to use ejs
app.use(express.static(__dirname + "/public")); //for static files to load in server  //prerequisite: must have public folder with all those static files like images and css
app.use(bodyParser.urlencoded({ extended: true })); // can use body parser to parse through html files

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.post("/", function (req, res) {
  var user = req.body.username; //user city choice

  console.log(user);

  if (user != "") {
    const url = "https://codeforces.com/api/user.info?handles=" + user + "";
    const url1 = 'https://codeforces.com/api/user.status?handle=' + user + '&from=1&count=20'


    https.get(url , function (response) {
      console.log(response.statusCode);

      // profile //////////////////////////
      response.on("data", function (data) {
        const userData = JSON.parse(data); //converting JSON data into js object //weatherData is js object now

        console.log(userData.status);

        var contest_rating = "";
        var avatar = "";

        if (userData.status === "OK") {
          if (
            userData.result[0].rating != undefined &&
            userData.result[0].rank != undefined &&
            userData.result[0].maxRating != undefined
          ) {
            contest_rating =
              "Contest rating: " +
              userData.result[0].rating +
              " (max. " +
              userData.result[0].rank +
              ", " +
              userData.result[0].maxRating +
              ")";
            console.log(contest_rating);
          } else {
            contest_rating = "Unrated";
          }
          avatar = userData.result[0].avatar;
         
          var tryy = '';

          var items = [];
         

          https.get(url1 , function (responses) {

            console.log(responses.statusCode);
      
            // profile //////////////////////////
            responses.on("data", function (data) {
              const userData1 = JSON.parse(data); //converting JSON data into js object //weatherData is js object now
               
              const result = userData1.result;
             
              for(var i = 0; i < result.length; i++){
                var comp = [];
                comp.push(result[i].problem.name);
                comp.push(result[i].problem.index);
                comp.push(result[i].problem.rating);

                var problemLink = 'https://codeforces.com/contest/' + result[i].problem.contestId + '/problem/' +result[i].problem.index + '';
                var solutionLink = 'https://codeforces.com/contest/' + result[i].problem.contestId + '/submission/' + + result[i].id +'';
                comp.push(problemLink);
                comp.push(solutionLink);
                comp.push(result[i].id);
                comp.push(result[i].verdict);
                comp.push(result[i].author.participantType);

                





                items.push(comp);
              }
               
         
               


                res.render("profile", {
                    username: user,
                    rating: contest_rating,
                    avatar: avatar,
                    newListItems:items
                  });
             
            });
          });



         
        } else {
          user = "Invalid username";

          res.render("profile", {
            username: user,
            rating: contest_rating,
            avatar: avatar,
            newListItems:items
          });
        }
      });
    });





    //   res.send("Server is up and running."); //two responce.send throws error, so only a send per a function // rather use res.write() as many times and then use res.send()

    // res.redirect("/");
  } else {
    res.redirect("/");
  }
});








app.listen(3000, function () {
  console.log("Server is running on port 3000");
});

// 85910c549b8a734df34038fa22a94f1659920cd9 key
// 4ee582e48c525066fe7861a0d4b377c2510767e7 secret
