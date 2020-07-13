const getCurrentId = function (client) {
  return new Promise((resolve, reject) => {
    client.incr("curr_id", (err, res) => {
      resolve(res);
    });
  });
};

const createJob = function (redisClient, id, countrySet) {
  return new Promise((resolve, reject) => {
    const status = ["status", "scheduled"];
    const sentAt = ["sentAt", new Date()];
    const countryDetails = Object.keys(countrySet).reduce((list, key) => {
      return list.concat([key, countrySet[key]]);
    }, []);
    const jobDetails = status.concat(countryDetails, sentAt);
    redisClient.hmset(`job_${id}`, jobDetails, (err, res) => {
      resolve({ id });
    });
  });
};

const addCountryRequest = function (redisClient, imageSet) {
  return getCurrentId(redisClient).then((id) => {
    return createJob(redisClient, id, imageSet);
  });
};

const completedProcessing = function (redisClient, id, country) {
  return new Promise((resolve, reject) => {
    const status = ["status", "completed"];
    const completedAt = ["completedAt", new Date()];
    const countryFound = ["countryFound", JSON.stringify(country)];
    redisClient.hmset(
      `job_${id}`,
      status.concat(countryFound, completedAt),
      (err, res) => {
        if (err) {
          reject(res);
        }
        resolve(res);
      }
    );
  });
};

const get = (client, id) => {
  return new Promise((resolve, reject) => {
    client.hgetall(`job_${id}`, (err, res) => {
      resolve(res);
    });
  });
};

module.exports = { addCountryRequest, completedProcessing, get };
