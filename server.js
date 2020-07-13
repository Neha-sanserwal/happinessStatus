const express = require("express");
const app = express();

const requests = require("./src/request");
const redisClient = require("redis").createClient({ db: 1 });

app.use(express.static("public"));
app.use((req, res, next) => {
  console.log("request made was :", req.url, req.method);
  next();
});
app.get("/", (req, res) => {
  res.redirect("index.html");
});
app.get("/status/:id", (req, res) => {
  requests.get(redisClient, req.params.id).then((countrySet) => {
    res.write(JSON.stringify(countrySet));
    res.end();
  });
});

app.get("/details/:country", (req, res) => {
  requests.addCountryRequest(redisClient, req.params).then((job) => {
    redisClient.lpush("ipQueue", job.id);
    res.end(JSON.stringify(job.id));
  });
});

app.listen(8000, () => {
  console.log(`listen on 8000`);
});
