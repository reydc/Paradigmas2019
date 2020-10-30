import React from "react";
import Proptypes from "prop-types";

import {
  Alert,
  Button,
  Card,
  CardBody,
  CardImg,
  CardSubtitle,
  CardTitle,
  Col,
  Modal,
  ModalBody,
  ModalHeader,
  Row,
  Progress
} from "reactstrap";

import GraphUVI from "./GraphUVI";

/* WEATHER CARD for current weather */
const WeatherCard = ({
  search,
  requestType,
  today,
  icon,
  description,
  temp,
  tempMax,
  tempMin,
  pressure,
  humidity,
  windSpeed,
  sunrise,
  sunset,
  units
}) => {
  function weatherTitle() {
    switch (requestType) {
      case "CITY":
        return `${search.city}`;
      case "CITY-COUNTRY":
        return `${search.city} - ${search.country}`;
      default:
        return `Lon: ${search.lon} - Lat: ${search.lat}`;
    }
  }

  let hours;
  let minutes;

  [hours, minutes] = new Date(sunrise * 1000)
    .toUTCString()
    .split(" ")[4]
    .split(":");
  /* sunrise object */
  const sunriseHHMM = { hours, minutes };

  [hours, minutes] = new Date(sunset * 1000)
    .toUTCString()
    .split(" ")[4]
    .split(":");
  /* sunset object */
  const sunsetHHMM = { hours, minutes };

  return (
    <div
      style={{
        fontFamily: "times new roman",
        fontWeight: "bold"
      }}
    >
      <Card body outline color="secondary" className="text-center">
        <CardBody>
          <div
            style={{
              fontStyle: "italic"
            }}
          >
            <CardTitle>
              {weatherTitle()}
              <br />
              {today}
            </CardTitle>
            <hr />
            <CardImg
              top
              style={{
                width: "20%",
                height: "50%",
                borderStyle: "solid",
                borderColor: "black",
                borderWidth: "1px"
              }}
              src={`http://openweathermap.org/img/w/${icon}.png`}
            />
            <hr />
            <CardSubtitle>{description}</CardSubtitle>
            <hr />
          </div>
          <div>
            {units === "Celsius" ? (
              <div>
                <CardSubtitle>
                  {/* eslint-disable-next-line react/jsx-one-expression-per-line */}
                  Temperature: {temp} &#8451;
                </CardSubtitle>
                <CardSubtitle>
                  {/* eslint-disable-next-line react/jsx-one-expression-per-line */}
                  Max temperature: {tempMax} &#8451;
                </CardSubtitle>
                <CardSubtitle>
                  {/* eslint-disable-next-line react/jsx-one-expression-per-line */}
                  Min temperature: {tempMin} &#8451;
                </CardSubtitle>
              </div>
            ) : (
              <div>
                <CardSubtitle>
                  {/* eslint-disable-next-line react/jsx-one-expression-per-line */}
                  Temperature: {temp} &#8457;
                </CardSubtitle>
                <CardSubtitle>
                  {/* eslint-disable-next-line react/jsx-one-expression-per-line */}
                  Max temperature: {tempMax} &#8457;;
                </CardSubtitle>
                <CardSubtitle>
                  {/* eslint-disable-next-line react/jsx-one-expression-per-line */}
                  Min temperature: {tempMin} &#8457;
                </CardSubtitle>
              </div>
            )}
          </div>
          <CardSubtitle>
            {/* eslint-disable-next-line react/jsx-one-expression-per-line */}
            Pressure: {pressure} hpm
          </CardSubtitle>
          <CardSubtitle>
            {/* eslint-disable-next-line react/jsx-one-expression-per-line */}
            Humidity: {humidity} %
          </CardSubtitle>
          <CardSubtitle>
            {/* eslint-disable-next-line react/jsx-one-expression-per-line */}
            Wind: {windSpeed} km/h
          </CardSubtitle>
          <br />
          <CardSubtitle>GTM-03:00</CardSubtitle>
          <CardSubtitle>
            {/* eslint-disable-next-line react/jsx-one-expression-per-line */}
            &uarr; Sunrise: {sunriseHHMM.hours - 3} hs {sunriseHHMM.minutes}{" "}
            minutes
          </CardSubtitle>
          <CardSubtitle>
            {/* eslint-disable-next-line react/jsx-one-expression-per-line */}
            &darr; Sunset: {sunsetHHMM.hours - 3} hs {sunsetHHMM.minutes}{" "}
            minutes
          </CardSubtitle>
        </CardBody>
      </Card>
      <hr />
    </div>
  );
};

WeatherCard.propTypes = {
  search: Proptypes.objectOf(Proptypes.string).isRequired,
  requestType: Proptypes.string.isRequired,
  today: Proptypes.string.isRequired,
  icon: Proptypes.string.isRequired,
  description: Proptypes.string.isRequired,
  temp: Proptypes.number.isRequired,
  tempMax: Proptypes.number.isRequired,
  tempMin: Proptypes.number.isRequired,
  pressure: Proptypes.number.isRequired,
  humidity: Proptypes.number.isRequired,
  windSpeed: Proptypes.number.isRequired,
  sunrise: Proptypes.number.isRequired,
  sunset: Proptypes.number.isRequired,
  units: Proptypes.string.isRequired
};
/* END WEATHER CARD */

/* FORECAST STRIP */
const ForecastStrip = ({ search, requestType, forecast, units }) => {
  /* Pass complete day name to child */
  function completeDay(strDay) {
    switch (strDay) {
      case "Sun":
        return "Sunday";
      case "Mon":
        return "Monday";
      case "Tue":
        return "Tuesday";
      case "Wed":
        return "Wednesday";
      case "Thu":
        return "Thursday";
      case "Fri":
        return "Friday";
      case "Sat":
        return "Saturday";
      default:
        return "";
    }
  }

  function weatherTitle() {
    switch (requestType) {
      case "CITY":
        return `${search.city}`;
      case "CITY-COUNTRY":
        return `${search.city} - ${search.country}`;
      default:
        return `Lon: ${search.lon} - Lat: ${search.lat}`;
    }
  }

  /* Sort time: is a date >= date b? */
  function dateCompare(a, b) {
    return a - b >= 0;
  }

  /* Extract list and specific properties for forecast */
  const forecastList = forecast
    .map(objectForecast => {
      const time = new Date(objectForecast.dt * 1000);
      return {
        /* UNIX time */
        time,
        /* Date as <day>/<month>/<year> */
        localeDate: time.toLocaleDateString(),
        /* Day of the week */
        day: completeDay(
          time
            .toUTCString()
            .split(" ")[0]
            .substring(0, 3)
        ),
        /* Format <hours>:<minutes>:<seconds> */
        hhmmss: time.toUTCString().split(" ")[4],
        /* Icon */
        icon: objectForecast.icon,
        /* Temperatures */
        temp: objectForecast.temp,
        temp_max: objectForecast.temp_max,
        temp_min: objectForecast.temp_min,
        /* Other data */
        description: objectForecast.description,
        pressure: objectForecast.pressure,
        humidity: objectForecast.humidity,
        wind_speed: objectForecast.wind_speed,
        rain: objectForecast.rain === undefined ? -1 : objectForecast.rain
      };
    })
    .sort((a, b) => dateCompare(a.time, b.time));

  /* Create set and destructure from forecastList, then sort by date order */
  const uniqueDates = [
    ...new Set(
      forecastList.map(objectForecast => {
        return objectForecast.localeDate;
      })
    )
  ];
  /* Obtain forecast data, filtering by date */
  const firstDayData = forecastList.filter(objectForecast => {
    return objectForecast.localeDate === uniqueDates[1];
  });
  const secondDayData = forecastList.filter(objectForecast => {
    return objectForecast.localeDate === uniqueDates[2];
  });
  const thirdDayData = forecastList.filter(objectForecast => {
    return objectForecast.localeDate === uniqueDates[3];
  });
  const fourthDayData = forecastList.filter(objectForecast => {
    return objectForecast.localeDate === uniqueDates[4];
  });
  const fifthDayData = forecastList.filter(objectForecast => {
    return objectForecast.localeDate === uniqueDates[5];
  });
  const daysData = [
    firstDayData,
    secondDayData,
    thirdDayData,
    fourthDayData,
    fifthDayData
  ];

  return (
    <div style={{ width: "900px", marginLeft: "100px", marginRight: "100px" }}>
      <hr />
      <div
        style={{
          fontFamily: "times new roman",
          fontWeight: "bold",
          fontStyle: "italic"
        }}
        className="text-center"
      >
        {weatherTitle()}
      </div>
      <hr />
      <Row>
        {daysData.map(item => {
          return item.length > 0 ? (
            <Col key={item[0].localeDate}>
              <SummaryCard
                day={item[0].day}
                localeDate={item[0].localeDate}
                iconRepresentative={item[4].icon}
                tempMaxAvg={Math.max(...item.map(o => o.temp_max))}
                tempMinAvg={Math.min(...item.map(o => o.temp_min))}
                units={units}
                forecast={item}
              />
            </Col>
          ) : (
            <Row>
              {/* eslint-disable-next-line react/no-unescaped-entities */}
              <p>Something wrong happened! Couldn't read data for the date</p>
            </Row>
          );
        })}
      </Row>
      <hr />
    </div>
  );
};

ForecastStrip.propTypes = {
  search: Proptypes.objectOf(Proptypes.string).isRequired,
  requestType: Proptypes.string.isRequired,
  forecast: Proptypes.arrayOf(
    Proptypes.objectOf(
      /* dt */
      Proptypes.number,
      /* icon */
      Proptypes.string,
      /* temp */
      Proptypes.number,
      /* temp_max */
      Proptypes.number,
      /* temp_min */
      Proptypes.number,
      /* description */
      Proptypes.string,
      /* pressure */
      Proptypes.number,
      /* humidity */
      Proptypes.number,
      /* wind_speed */
      Proptypes.number,
      /* rain */
      Proptypes.number
    ).isRequired
  ).isRequired,
  units: Proptypes.string.isRequired
};
/* END FORECAST STRIP */

/* SUMMARY CARD template for forecast strip */
class SummaryCard extends React.Component {
  static propTypes = {
    day: Proptypes.string.isRequired,
    localeDate: Proptypes.string.isRequired,
    iconRepresentative: Proptypes.string.isRequired,
    tempMaxAvg: Proptypes.number.isRequired,
    tempMinAvg: Proptypes.number.isRequired,
    units: Proptypes.string.isRequired,
    forecast: Proptypes.arrayOf(
      Proptypes.objectOf(
        /* dt */
        Proptypes.number,
        /* icon */
        Proptypes.string,
        /* temp */
        Proptypes.number,
        /* temp_max */
        Proptypes.number,
        /* temp_min */
        Proptypes.number,
        /* description */
        Proptypes.string,
        /* pressure */
        Proptypes.number,
        /* humidity */
        Proptypes.number,
        /* wind_speed */
        Proptypes.number,
        /* rain */
        Proptypes.number
      ).isRequired
    ).isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      detailed: false
    };
    this.toggleDetails = this.toggleDetails.bind(this);
  }

  toggleDetails() {
    this.setState(prevState => ({
      detailed: !prevState.detailed
    }));
  }

  render() {
    const {
      day,
      localeDate,
      iconRepresentative,
      tempMaxAvg,
      tempMinAvg,
      units,
      forecast
    } = this.props;

    const { detailed } = this.state;

    return (
      <div style={{ fontFamily: "times new roman", fontWeight: "bold" }}>
        <Card outline color="secondary" className="text-center">
          <CardBody>
            <div
              style={{
                fontStyle: "italic"
              }}
            >
              <hr />
              <CardSubtitle>{day}</CardSubtitle>
              <CardSubtitle>{localeDate}</CardSubtitle>
              <hr />
              <CardImg
                top
                style={{
                  width: "40%",
                  height: "50%",
                  borderStyle: "solid",
                  borderColor: "black",
                  borderWidth: "1px"
                }}
                src={`http://openweathermap.org/img/w/${iconRepresentative}.png`}
              />
              <hr />
            </div>
            {units === "Celsius" ? (
              <div>
                <CardSubtitle>
                  {/* eslint-disable-next-line react/jsx-one-expression-per-line */}
                  Max: {tempMaxAvg} &#8451;
                </CardSubtitle>
                <CardSubtitle>
                  {/* eslint-disable-next-line react/jsx-one-expression-per-line */}
                  Min: {tempMinAvg} &#8451;
                </CardSubtitle>
              </div>
            ) : (
              <div>
                <CardSubtitle>
                  {/* eslint-disable-next-line react/jsx-one-expression-per-line */}
                  Max: {tempMaxAvg} &#8457;
                </CardSubtitle>
                <CardSubtitle>
                  {/* eslint-disable-next-line react/jsx-one-expression-per-line */}
                  Min: {tempMinAvg} &#8457;
                </CardSubtitle>
              </div>
            )}
          </CardBody>
          <Button outline type="button" onClick={this.toggleDetails}>
            Details
          </Button>
          <Modal
            centered
            scrollable
            isOpen={detailed}
            toggle={this.toggleDetails}
          >
            <ModalHeader toggle={this.toggleDetails}>
              {/* eslint-disable-next-line react/jsx-one-expression-per-line */}
              Details for {day} ({localeDate})
            </ModalHeader>
            <ModalBody>
              {forecast.map(f => {
                /* Get previous hour, minutes and seconds */
                const prevHhMmSs =
                  forecast.indexOf(f) !== 0
                    ? forecast[forecast.indexOf(f) - 1].hhmmss
                    : "00:00:00";
                const hoursEstimate = `${prevHhMmSs}-${f.hhmmss}`;
                const { icon } = f;
                const { temp } = f;
                const tempMax = f.temp_max;
                const tempMin = f.temp_min;
                const { description } = f;
                const { pressure } = f;
                const { humidity } = f;
                const windSpeed = f.wind_speed;
                const { rain } = f;
                /* Detailed Card */
                return (
                  <div
                    key={hoursEstimate}
                    style={{
                      fontFamily: "times new roman",
                      fontWeight: "bold"
                    }}
                  >
                    <Card outline color="secondary" className="text-center">
                      <CardBody>
                        <div
                          style={{
                            fontStyle: "italic"
                          }}
                        >
                          <hr />
                          <CardSubtitle>{hoursEstimate}</CardSubtitle>
                          <hr />
                          <CardImg
                            top
                            style={{
                              width: "20%",
                              height: "50%",
                              borderStyle: "solid",
                              borderColor: "black",
                              borderWidth: "1px"
                            }}
                            src={`http://openweathermap.org/img/w/${icon}.png`}
                          />
                          <hr />
                          <CardSubtitle>{description}</CardSubtitle>
                          <hr />
                        </div>
                        <div>
                          {units === "Celsius" ? (
                            <div>
                              <CardSubtitle>
                                {/* eslint-disable-next-line react/jsx-one-expression-per-line */}
                                Temperature: {temp} &#8451;
                              </CardSubtitle>
                              <CardSubtitle>
                                {/* eslint-disable-next-line react/jsx-one-expression-per-line */}
                                Max temperature: {tempMax} &#8451;
                              </CardSubtitle>
                              <CardSubtitle>
                                {/* eslint-disable-next-line react/jsx-one-expression-per-line */}
                                Min temperature: {tempMin} &#8451;
                              </CardSubtitle>
                            </div>
                          ) : (
                            <div>
                              <CardSubtitle>
                                {/* eslint-disable-next-line react/jsx-one-expression-per-line */}
                                Temperature: {temp} &#8457;
                              </CardSubtitle>
                              <CardSubtitle>
                                {/* eslint-disable-next-line react/jsx-one-expression-per-line */}
                                Max temperature: {tempMax} &#8457;;
                              </CardSubtitle>
                              <CardSubtitle>
                                {/* eslint-disable-next-line react/jsx-one-expression-per-line */}
                                Min temperature: {tempMin} &#8457;
                              </CardSubtitle>
                            </div>
                          )}
                        </div>
                        <CardSubtitle>
                          {/* eslint-disable-next-line react/jsx-one-expression-per-line */}
                          Pressure: {pressure} hpm
                        </CardSubtitle>
                        <CardSubtitle>
                          {/* eslint-disable-next-line react/jsx-one-expression-per-line */}
                          Humidity: {humidity} %
                        </CardSubtitle>
                        <CardSubtitle>
                          {/* eslint-disable-next-line react/jsx-one-expression-per-line */}
                          Wind: {windSpeed} km/h
                        </CardSubtitle>
                        {rain.length >= 0 ? (
                          <CardSubtitle>
                            {/* eslint-disable-next-line react/jsx-one-expression-per-line */}
                            Rain: {rain} %
                          </CardSubtitle>
                        ) : (
                          <CardSubtitle />
                        )}
                        <hr />
                      </CardBody>
                    </Card>
                  </div>
                );
              })}
            </ModalBody>
          </Modal>
        </Card>
        <hr />
      </div>
    );
  }
}

/* END SUMMARY CARD */

/* UVI CARD */
const UVICard = ({ currentUVI, forecastUVI, historyUVI }) => {
  const currentDate = new Date(currentUVI.date * 1000)
    .toLocaleString()
    .split(",")[0];
  const currentValue = currentUVI.value;

  return (
    <div style={{ fontFamily: "times new roman", fontWeight: "bold" }}>
      <hr />
      <div
        className="text-center"
        style={{
          fontStyle: "italic"
        }}
      >
        <p>Data was recieved for coordenates:</p>
        {/* eslint-disable-next-line react/jsx-one-expression-per-line */}
        {currentUVI.lon} (longitude)
        <br />
        {/* eslint-disable-next-line react/jsx-one-expression-per-line */}
        {currentUVI.lat} (latitude)
        <br />
      </div>
      <hr />
      {/* CURRENT UVI SECTION */}
      <Card body outline color="secondary" className="text-center">
        <CardBody>
          <CardTitle>
            {/* eslint-disable-next-line react/jsx-one-expression-per-line */}
            Current UVI ({currentDate})
          </CardTitle>
          <CardSubtitle>
            <h4>{currentValue}</h4>
          </CardSubtitle>
          <hr />
          {currentValue * 10 > 130.0 ? (
            <Alert color="dark">
              UVI IS EXCESSIVE(&gt; 13): Careful exposure is adviced
            </Alert>
          ) : (
            <Progress multi>
              <Progress bar color="dark" value={currentValue * 10} max={130} />
              &#8659;
            </Progress>
          )}
          <Progress multi>
            <Progress bar color="success" value="30">
              0 - 3
            </Progress>
            <Progress bar color="warning" value="30">
              3 - 6
            </Progress>
            <Progress bar color="danger" value="20">
              6 - 8
            </Progress>
            <Progress bar color="info" value="20">
              8 - 10
            </Progress>
            <Progress bar color="primary" value="30">
              10 - 13
            </Progress>
          </Progress>
          {/* eslint-disable-next-line react/jsx-one-expression-per-line */}
        </CardBody>
      </Card>
      {/* FORECAST UVI SECTION */}
      <Card body outline color="secondary" className="text-center">
        <CardTitle>Forecasted UVI</CardTitle>
        <hr />
        <Row>
          {forecastUVI
            .sort((a, b) => {
              return a.date - b.date >= 0;
            })
            .map(uvi => {
              const data = {
                day: new Date(uvi.date * 1000).toUTCString().split(",")[0],
                localeDate: new Date(uvi.date * 1000)
                  .toLocaleString()
                  .split(",")[0],
                value: uvi.value
              };
              let color;
              if (data.value < 3.0) {
                color = "success";
              } else if (data.value < 6.0) {
                color = "warning";
              } else if (data.value < 8.0) {
                color = "danger";
              } else if (data.value < 10.0) {
                color = "info";
              } else {
                color = "primary";
              }
              return (
                <Col key={data.localeDate}>
                  <Card body inverse color={color}>
                    <CardBody>
                      <div
                        style={{
                          fontStyle: "italic"
                        }}
                      >
                        <CardSubtitle>{data.day}</CardSubtitle>
                        <CardSubtitle>{data.localeDate}</CardSubtitle>
                        <CardSubtitle>
                          {/* eslint-disable-next-line react/jsx-one-expression-per-line */}
                          UVI: {data.value}
                        </CardSubtitle>
                      </div>
                    </CardBody>
                  </Card>
                </Col>
              );
            })}
        </Row>
      </Card>
      {/* 30 DAYS UVI GRAPH */}
      <Card body outline color="secondary" className="text-center">
        <CardTitle>30 days UVI evolution</CardTitle>
        <CardBody>
          <div style={{ fontStyle: "italic" }}>
            <GraphUVI historyUVI={historyUVI} />
          </div>
        </CardBody>
      </Card>
      <hr />
    </div>
  );
};

UVICard.propTypes = {
  currentUVI: Proptypes.objectOf(
    /* lat */
    Proptypes.number,
    /* lon */
    Proptypes.number,
    /* date_iso */
    Proptypes.string,
    /* date */
    Proptypes.number,
    /* value */
    Proptypes.number
  ).isRequired,
  forecastUVI: Proptypes.arrayOf(
    Proptypes.objectOf(
      /* lat */
      Proptypes.number,
      /* lon */
      Proptypes.number,
      /* date_iso */
      Proptypes.string,
      /* date */
      Proptypes.number,
      /* value */
      Proptypes.number
    ).isRequired
  ).isRequired,
  historyUVI: Proptypes.arrayOf(
    Proptypes.objectOf(
      /* lat */
      Proptypes.number,
      /* lon */
      Proptypes.number,
      /* date_iso */
      Proptypes.string,
      /* date */
      Proptypes.number,
      /* value */
      Proptypes.number
    ).isRequired
  ).isRequired
};
/* END UVI CARD */

/* DISPLAY CARDS */
const DisplayCards = ({
  search,
  requestType,
  today,
  showCurrent,
  showForecast,
  showUVI,
  current,
  forecast,
  currentUVI,
  forecastUVI,
  historyUVI,
  currentDone,
  forecastDone,
  currentUVIDone,
  forecastUVIDone,
  historicUVIDone,
  units
}) => {
  if (showCurrent && currentDone) {
    return (
      <WeatherCard
        search={search}
        requestType={requestType}
        today={today}
        icon={current.icon}
        description={current.description}
        temp={current.temp}
        tempMax={current.temp_max}
        tempMin={current.temp_min}
        pressure={current.pressure}
        humidity={current.humidity}
        windSpeed={current.wind_speed}
        sunrise={current.sunrise}
        sunset={current.sunset}
        units={units}
      />
    );
  }
  if (showForecast && forecastDone) {
    return (
      <ForecastStrip
        search={search}
        requestType={requestType}
        forecast={forecast}
        units={units}
      />
    );
  }
  if (showUVI && (currentUVIDone && forecastUVIDone && historicUVIDone)) {
    return (
      <UVICard
        currentUVI={currentUVI}
        currentUVIDone={currentUVIDone}
        forecastUVI={forecastUVI}
        forecastUVIDone={forecastUVIDone}
        historyUVI={historyUVI}
        historicUVIDone={historicUVIDone}
      />
    );
  }
  return (
    <div
      className="text-center"
      style={{ fontFamily: "times new roman", fontWeight: "bold" }}
    >
      <p>Select an option...</p>
    </div>
  );
};

DisplayCards.propTypes = {
  search: Proptypes.objectOf(Proptypes.string).isRequired,
  requestType: Proptypes.string.isRequired,
  today: Proptypes.string.isRequired,
  showCurrent: Proptypes.bool.isRequired,
  showForecast: Proptypes.bool.isRequired,
  showUVI: Proptypes.bool.isRequired,
  current: Proptypes.objectOf(
    /* icon */
    Proptypes.string,
    /* description */
    Proptypes.string,
    /* temp */
    Proptypes.number,
    /* temp_max */
    Proptypes.number,
    /* temp_min */
    Proptypes.number,
    /* pressure */
    Proptypes.number,
    /* humidity */
    Proptypes.number,
    /* wind_speed */
    Proptypes.number,
    /* sunrise */
    Proptypes.number,
    /* sunset */
    Proptypes.number
  ).isRequired,
  forecast: Proptypes.arrayOf(
    Proptypes.objectOf(
      /* dt */
      Proptypes.number,
      /* icon */
      Proptypes.string,
      /* temp */
      Proptypes.number,
      /* temp_max */
      Proptypes.number,
      /* temp_min */
      Proptypes.number,
      /* description */
      Proptypes.string,
      /* pressure */
      Proptypes.number,
      /* humidity */
      Proptypes.number,
      /* wind_speed */
      Proptypes.number,
      /* rain */
      Proptypes.number
    ).isRequired
  ).isRequired,
  currentUVI: Proptypes.objectOf(
    /* lat */
    Proptypes.number,
    /* lon */
    Proptypes.number,
    /* date_iso */
    Proptypes.string,
    /* date */
    Proptypes.number,
    /* value */
    Proptypes.number
  ).isRequired,
  forecastUVI: Proptypes.arrayOf(
    Proptypes.objectOf(
      /* lat */
      Proptypes.number,
      /* lon */
      Proptypes.number,
      /* date_iso */
      Proptypes.string,
      /* date */
      Proptypes.number,
      /* value */
      Proptypes.number
    ).isRequired
  ).isRequired,
  historyUVI: Proptypes.arrayOf(
    Proptypes.objectOf(
      /* lat */
      Proptypes.number,
      /* lon */
      Proptypes.number,
      /* date_iso */
      Proptypes.string,
      /* date */
      Proptypes.number,
      /* value */
      Proptypes.number
    ).isRequired
  ).isRequired,
  currentDone: Proptypes.bool.isRequired,
  forecastDone: Proptypes.bool.isRequired,
  currentUVIDone: Proptypes.bool.isRequired,
  forecastUVIDone: Proptypes.bool.isRequired,
  historicUVIDone: Proptypes.bool.isRequired,
  units: Proptypes.string.isRequired
};
/* END DISPLAY CARDS */

export default DisplayCards;
