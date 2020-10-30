function complement(str) {
  return str === "Celsius" ? "Fahrenheit" : "Celsius";
}

function toC(f) {
  return ((f - 32) * 5) / 9;
}

function toF(c) {
  return (c * 9) / 5 + 32;
}

function conversion(temperature, convert) {
  return Math.round(convert(temperature) * 1000) / 1000;
}

export { complement, toC, toF, conversion };
