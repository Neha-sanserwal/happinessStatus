const PAIRS = require("./country.json");
const getDetails = function (countryOrRegion) {
  return PAIRS.filter(
    (countryData) =>
      countryData.CountryOrRegion.toLowerCase() == countryOrRegion.toLowerCase()
  );
};
const processCountry = function (countryOrRegion) {
  let path = {};
  res = getDetails(countryOrRegion);
  if (res) {
    return res;
  }
  return path;
};

module.exports = { processCountry };
