const express = require("express");
const app = express();
const { processCountry } = require("./getHapinessDetails");
const pathRequests = require("./request");
const redisClient = require("redis").createClient({ db: 1 });

app.use((req, res, next) => {
  console.log("request made was :", req.url, req.method);
  next();
});

const getJob = () => {
  return new Promise((resolve, reject) => {
    redisClient.brpop("ipQueue", 0, (err, res) => {
      if (err) {
        reject("job not found");
      }
      resolve(res[1]);
    });
  });
};

const runLoop = (redisClient) => {
  getJob()
    .then((id) => {
      pathRequests.get(redisClient, id).then((res) => {
        const countryDetails = processCountry(res.country);
        pathRequests
          .completedProcessing(redisClient, id, countryDetails)
          .then((res) => {
            console.log("completed Process", res);
            runLoop(redisClient);
          });
      });
    })
    .catch(() => {
      setTimeout(() => {
        runLoop();
      }, 1000);
    });
};

runLoop(redisClient);
