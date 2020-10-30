import { CountryCodesList, CountryCodesTable } from "./CountryCodes";

/* Look if string str are words */
function validateWords(str) {
  let isValid = str.length > 0;
  try {
    isValid = str
      .split(" ")
      .map(w => w === w.match(/[A-Za-z]+/)[0])
      .reduce((acc, val) => acc && val);
  } catch {
    isValid = false;
  }
  return isValid;
}

/* Look if string str represents latitude */
function validateLatitude(str) {
  let isValid = str.length > 0;
  try {
    const latRE = /^([Ll](at:|atitude:))(\s)?(-)?[0-9]+(\.[0-9]+)?$/;
    isValid = latRE.test(str);
  } catch {
    isValid = false;
  }
  return isValid;
}

/* Look if string str represents longitude */
function validateLongitude(str) {
  let isValid = str.length > 0;
  try {
    const lonRE = /^([Ll](on:|ongitude:))(\s)?(-)?[0-9]+(\.[0-9]+)?$/;
    isValid = lonRE.test(str);
  } catch {
    isValid = false;
  }
  return isValid;
}

/* Pre: str must have something to extract */
function extractCoord(str) {
  return str.match(/(-)?[0-9]+(\.[0-9]+)?/)[0];
}

/* Get country code, in case that it can not be found, return empty string */
function getCountryCode(str) {
  const filterCC = CountryCodesList.filter(
    code => CountryCodesTable[code].indexOf(str) !== -1
  );
  return filterCC.length > 0 ? filterCC[0] : "";
}

function existCountryCode(str) {
  return CountryCodesList.indexOf(str.toUpperCase()) !== -1;
}

function isCountryCode(str) {
  return str.length === 2 && existCountryCode(str);
}

/* Try to get an object with
   - city
   - city, country code
   - longitude, latitude
*/
function requestParams(str) {
  // eslint-disable-next-line prefer-const
  let strArray = str.split(",").map(s => s.trimEnd().trimStart());
  let params = {};
  let valid = false;
  let city;
  let country;
  let lon;
  let lat;
  let requestType = "";
  if (strArray.length === 1 && validateWords(strArray[0])) {
    [city] = strArray;
    /* Capitalize city */
    city = city
      .split(" ")
      .map(word => word.charAt(0).toUpperCase() + word.substring(1))
      .join(" ");
    /* city is the only parameter */
    params = { city };
    /* requestType */
    requestType = "CITY";
  }
  if (
    strArray.length === 2 &&
    validateWords(strArray[0]) &&
    validateWords(strArray[1])
  ) {
    [city, country] = strArray;
    /* Capitalize city */
    city = city
      .split(" ")
      .map(word => word.charAt(0).toUpperCase() + word.substring(1))
      .join(" ");
    /* Obtain country code for the request */
    if (!isCountryCode(country)) {
      country = getCountryCode(country).toLocaleLowerCase();
    }
    if (country.length === 0) {
      /* Just could get city */
      params = { city };
      /* requestType */
      requestType = "CITY";
    } else {
      /* city and country are the parameters */
      params = { city, country };
      /* requestType */
      requestType = "CITY-COUNTRY";
    }
  }
  if (
    strArray.length === 2 &&
    ((validateLongitude(strArray[0]) && validateLatitude(strArray[1])) ||
      (validateLongitude(strArray[1]) && validateLatitude(strArray[0])))
  ) {
    if (/^([Ll](on:|ongitude:))(\s)?(-)?[0-9]+(\.[0-9]+)?$/.test(strArray[0])) {
      /* Extract coordenates */
      strArray[0] = extractCoord(strArray[0]);
      strArray[1] = extractCoord(strArray[1]);
      [lon, lat] = strArray;
    } else {
      /* Extract coordenates */
      strArray[0] = extractCoord(strArray[0]);
      strArray[1] = extractCoord(strArray[1]);
      [lat, lon] = strArray;
    }
    /* longitude and latitude are parameters */
    params = { lon, lat };
    /* requestType */
    requestType = "GEO";
  }
  valid = Object.keys(params).length > 0;
  return { params, valid, requestType };
}

export default requestParams;
