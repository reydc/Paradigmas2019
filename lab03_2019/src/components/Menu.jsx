/* eslint-disable react/jsx-one-expression-per-line */
import React from "react";
import Proptypes from "prop-types";
import {
  Container,
  Col,
  Button,
  Nav,
  NavItem,
  Modal,
  ModalBody,
  ModalHeader,
  Row,
  Spinner
} from "reactstrap";

import WEATHER_KEY from "./Keys";
import { complement, conversion, toC, toF } from "./TemperatureConversion";
import DisplayCards from "./Cards";

export default class Menu extends React.Component {
  static propTypes = {
    menuClassName: Proptypes.string,
    menuId: Proptypes.number,
    menuTitle: Proptypes.string,
    menuSpinnerColor: Proptypes.string,
    menuOptionsButtonColor: Proptypes.string,
    search: Proptypes.objectOf(Proptypes.string).isRequired,
    requestType: Proptypes.string.isRequired
  };

  static defaultProps = {
    menuClassName: "Menu",
    menuId: 0,
    menuTitle: "[Menu]",
    menuSpinnerColor: "primary",
    menuOptionsButtonColor: "primary"
  };

  constructor(props) {
    super(props);
    this.state = {
      /* Spinning wheel throbber */
      menuWait: true,
      /* Value to reopen last successfull search */
      menuOpen: true,
      showCurrent: true,
      showForecast: false,
      showUVI: false,
      current: {},
      /*
      current: {
        icon,
        description,
        temp,
        temp_max,
        temp_min,
        pressure,
        humidity,
        wind_speed,
        sunrise,
        sunset
      }
      */
      /* Both latitude and longitude are set by getCurrent,
         so when someone wants to see the UVI data a handler
         will make a call to the api.
      */
      latitude: 0,
      longitude: 0,
      today: "",
      /* currentDate will also be used to set UVI associated data,
         when we need to calculate the date 30 days ago.
      */
      currentDate: 0,
      forecast: [],
      /*
      forecast: [{
        dt,
        icon,
        temp,
        temp_max,
        temp_min,
        description,
        pressure,
        humidity,
        wind_speed,
        rain
      }]
      */
      currentUVI: {},
      forecastUVI: [],
      historyUVI: [],
      currentDone: false,
      forecastDone: false,
      currentUVIDone: false,
      forecastUVIDone: false,
      historicUVIDone: false,
      /* Indicates that the last request was successfull */
      success: true,
      errorMessage: "",
      units: "Celsius"
    };
    this.toggleMenu = this.toggleMenu.bind(this);
    this.initializeCurrent = this.initializeCurrent.bind(this);
    this.toggleCurrent = this.toggleCurrent.bind(this);
    this.toggleForecast = this.toggleForecast.bind(this);
    this.toggleUVI = this.toggleUVI.bind(this);
    this.changeUnits = this.changeUnits.bind(this);
  }

  componentDidMount() {
    this.initializeCurrent();
  }

  componentDidUpdate(prevProps) {
    const { search, requestType } = this.props;
    // Component has new search and requestType, so we try to update
    if (
      JSON.stringify(search) !== JSON.stringify(prevProps.search) ||
      requestType !== prevProps.requestType
    ) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState(
        { menuWait: true, success: false, currentDone: false },
        () => this.initializeCurrent()
      );
    }
  }

  toggleMenu() {
    this.setState(prevState =>
      !prevState.menuOpen
        ? {
            menuOpen: !prevState.menuOpen,
            showCurrent: false,
            showForecast: false,
            showUVI: false
          }
        : { menuOpen: !prevState.menuOpen }
    );
  }

  initializeCurrent() {
    const { search, requestType } = this.props;
    const key = WEATHER_KEY.WEATHER_KEY;
    let url;
    switch (requestType) {
      case "CITY":
        url = `https://api.openweathermap.org/data/2.5/weather?q=${
          search.city
        }&appid=${key}&units=metric`;
        fetch(url)
          .then(resp =>
            resp.json().then(json => ({ status: resp.status, json }))
          )
          .then(obj => {
            if (obj.status === 200 && obj.json.cod === 200) {
              this.setState({
                menuWait: false,
                today: new Date(obj.json.dt * 1000)
                  .toLocaleString()
                  .split(",")[0],
                success: true,
                currentDone: true,
                current: {
                  icon: obj.json.weather[0].icon,
                  description: obj.json.weather[0].description,
                  temp: obj.json.main.temp,
                  temp_max: obj.json.main.temp_max,
                  temp_min: obj.json.main.temp_min,
                  pressure: obj.json.main.pressure,
                  humidity: obj.json.main.humidity,
                  wind_speed: obj.json.wind.speed,
                  sunrise: obj.json.sys.sunrise,
                  sunset: obj.json.sys.sunset
                },
                longitude: obj.json.coord.lon,
                latitude: obj.json.coord.lat,
                currentDate: obj.json.dt,
                /* Show menu and open current */
                menuOpen: true,
                showCurrent: true,
                showForecast: false,
                showUVI: false,
                /* Reset other fields */
                forecast: [],
                currentUVI: {},
                forecastUVI: [],
                historyUVI: [],
                forecastDone: false,
                currentUVIDone: false,
                forecastUVIDone: false,
                historicUVIDone: false,
                units: "Celsius"
              });
            } else {
              this.setState({
                errorMessage: `${obj.json.cod}: ${obj.json.message}`,
                menuWait: false,
                success: false,
                currentDone: false,
                current: {},
                /* Show menu and open current */
                menuOpen: true,
                showCurrent: true,
                showForecast: false,
                showUVI: false,
                /* Reset other fields */
                forecast: [],
                currentUVI: {},
                forecastUVI: [],
                historyUVI: [],
                forecastDone: false,
                currentUVIDone: false,
                forecastUVIDone: false,
                historicUVIDone: false,
                units: "Celsius"
              });
            }
          })
          .catch(error => {
            this.setState({
              errorMessage: error,
              menuWait: false,
              success: false,
              currentDone: false,
              current: {},
              /* Show menu and open current */
              menuOpen: true,
              showCurrent: true,
              showForecast: false,
              showUVI: false,
              /* Reset other fields */
              forecast: [],
              currentUVI: {},
              forecastUVI: [],
              historyUVI: [],
              forecastDone: false,
              currentUVIDone: false,
              forecastUVIDone: false,
              historicUVIDone: false,
              units: "Celsius"
            });
          });
        break;
      case "CITY-COUNTRY":
        url = `https://api.openweathermap.org/data/2.5/weather?q=${
          search.city
        },${search.country}&appid=${key}&units=metric`;
        fetch(url)
          .then(resp =>
            resp.json().then(json => ({ status: resp.status, json }))
          )
          .then(obj => {
            if (obj.status === 200 && obj.json.cod === 200) {
              this.setState({
                today: new Date(obj.json.dt * 1000)
                  .toLocaleString()
                  .split(",")[0],
                menuWait: false,
                success: true,
                currentDone: true,
                current: {
                  icon: obj.json.weather[0].icon,
                  description: obj.json.weather[0].description,
                  temp: obj.json.main.temp,
                  temp_max: obj.json.main.temp_max,
                  temp_min: obj.json.main.temp_min,
                  pressure: obj.json.main.pressure,
                  humidity: obj.json.main.humidity,
                  wind_speed: obj.json.wind.speed,
                  sunrise: obj.json.sys.sunrise,
                  sunset: obj.json.sys.sunset
                },
                longitude: obj.json.coord.lon,
                latitude: obj.json.coord.lat,
                currentDate: obj.json.dt,
                /* Show menu and open current */
                menuOpen: true,
                showCurrent: true,
                showForecast: false,
                showUVI: false,
                /* Reset other fields */
                forecast: [],
                currentUVI: {},
                forecastUVI: [],
                historyUVI: [],
                forecastDone: false,
                currentUVIDone: false,
                forecastUVIDone: false,
                historicUVIDone: false,
                units: "Celsius"
              });
            } else {
              this.setState({
                errorMessage: `${obj.json.cod}: ${obj.json.message}`,
                menuWait: false,
                success: false,
                currentDone: false,
                current: {},
                /* Show menu and open current */
                menuOpen: true,
                showCurrent: true,
                showForecast: false,
                showUVI: false,
                /* Reset other fields */
                forecast: [],
                currentUVI: {},
                forecastUVI: [],
                historyUVI: [],
                forecastDone: false,
                currentUVIDone: false,
                forecastUVIDone: false,
                historicUVIDone: false,
                units: "Celsius"
              });
            }
          })
          .catch(error => {
            this.setState({
              errorMessage: error,
              menuWait: false,
              success: false,
              currentDone: false,
              current: {},
              /* Show menu and open current */
              menuOpen: true,
              showCurrent: true,
              showForecast: false,
              showUVI: false,
              /* Reset other fields */
              forecast: [],
              currentUVI: {},
              forecastUVI: [],
              historyUVI: [],
              forecastDone: false,
              currentUVIDone: false,
              forecastUVIDone: false,
              historicUVIDone: false,
              units: "Celsius"
            });
          });
        break;
      case "GEO":
        url = `https://api.openweathermap.org/data/2.5/weather?lat=${
          search.lat
        }&lon=${search.lon}&appid=${key}&units=metric`;
        fetch(url)
          .then(resp =>
            resp.json().then(json => ({ status: resp.status, json }))
          )
          .then(obj => {
            if (obj.status === 200 && obj.json.cod === 200) {
              this.setState({
                today: new Date(obj.json.dt * 1000)
                  .toLocaleString()
                  .split(",")[0],
                menuWait: false,
                success: true,
                currentDone: true,
                current: {
                  icon: obj.json.weather[0].icon,
                  description: obj.json.weather[0].description,
                  temp: obj.json.main.temp,
                  temp_max: obj.json.main.temp_max,
                  temp_min: obj.json.main.temp_min,
                  pressure: obj.json.main.pressure,
                  humidity: obj.json.main.humidity,
                  wind_speed: obj.json.wind.speed,
                  sunrise: obj.json.sys.sunrise,
                  sunset: obj.json.sys.sunset
                },
                longitude: obj.json.coord.lon,
                latitude: obj.json.coord.lat,
                currentDate: obj.json.dt,
                /* Show menu and open current */
                menuOpen: true,
                showCurrent: true,
                showForecast: false,
                showUVI: false,
                /* Reset other fields */
                forecast: [],
                currentUVI: {},
                forecastUVI: [],
                historyUVI: [],
                forecastDone: false,
                currentUVIDone: false,
                forecastUVIDone: false,
                historicUVIDone: false,
                units: "Celsius"
              });
            } else {
              this.setState({
                errorMessage: `${obj.json.cod}: ${obj.json.message}`,
                menuWait: false,
                success: false,
                currentDone: false,
                current: {},
                /* Show menu and open current */
                menuOpen: true,
                showCurrent: true,
                showForecast: false,
                showUVI: false,
                /* Reset other fields */
                forecast: [],
                currentUVI: {},
                forecastUVI: [],
                historyUVI: [],
                forecastDone: false,
                currentUVIDone: false,
                forecastUVIDone: false,
                historicUVIDone: false,
                units: "Celsius"
              });
            }
          })
          .catch(error => {
            this.setState({
              errorMessage: error,
              menuWait: false,
              success: false,
              currentDone: false,
              current: {},
              /* Show menu and open current */
              menuOpen: true,
              showCurrent: true,
              showForecast: false,
              showUVI: false,
              /* Reset other fields */
              forecast: [],
              currentUVI: {},
              forecastUVI: [],
              historyUVI: [],
              forecastDone: false,
              currentUVIDone: false,
              forecastUVIDone: false,
              historicUVIDone: false,
              units: "Celsius"
            });
          });
        break;
      default:
        this.setState({
          menuWait: false,
          success: false,
          currentDone: false,
          current: {},
          /* Show menu and open current */
          menuOpen: true,
          showCurrent: true,
          showForecast: false,
          showUVI: false,
          /* Reset other fields */
          forecast: [],
          currentUVI: {},
          forecastUVI: [],
          historyUVI: [],
          forecastDone: false,
          currentUVIDone: false,
          forecastUVIDone: false,
          historicUVIDone: false,
          units: "Celsius"
        });
    }
  }

  toggleCurrent() {
    this.setState(prevState =>
      !prevState.showCurrent
        ? {
            showCurrent: !prevState.showCurrent,
            showForecast: false,
            showUVI: false
          }
        : { showCurrent: !prevState.showCurrent }
    );
  }

  toggleForecast() {
    const { search, requestType } = this.props;
    const { forecastDone } = this.state;
    const key = WEATHER_KEY.WEATHER_KEY;
    if (!forecastDone && requestType.length > 0) {
      let url;
      switch (requestType) {
        case "CITY":
          url = `https://api.openweathermap.org/data/2.5/forecast?q=${
            search.city
          }&appid=${key}&units=metric`;
          fetch(url)
            .then(resp =>
              resp.json().then(json => ({ status: resp.status, json }))
            )
            .then(obj => {
              if (obj.status === 200 && obj.json.cod === "200") {
                this.setState({
                  success: true,
                  forecastDone: true,
                  forecast: obj.json.list.map(objectForecast => {
                    return {
                      dt: objectForecast.dt,
                      icon: objectForecast.weather[0].icon,
                      temp: objectForecast.main.temp,
                      temp_max: objectForecast.main.temp_max,
                      temp_min: objectForecast.main.temp_min,
                      description: objectForecast.weather[0].description,
                      pressure: objectForecast.main.pressure,
                      humidity: objectForecast.main.humidity,
                      wind_speed: objectForecast.wind.speed,
                      rain:
                        objectForecast.rain === undefined
                          ? -1
                          : objectForecast.rain["3h"]
                    };
                  })
                });
              } else {
                this.setState({
                  errorMessage: `Request failed => Response status:${
                    obj.status
                  }, JSON code:${obj.json.cod}`,
                  success: false,
                  forecastDone: false,
                  forecast: {}
                });
              }
            })
            .catch(error => {
              this.setState({
                errorMessage: error,
                success: false,
                forecastDone: false,
                forecast: {}
              });
            });
          break;
        case "CITY-COUNTRY":
          url = `https://api.openweathermap.org/data/2.5/forecast?q=${
            search.city
          },${search.country}&appid=${key}&units=metric`;
          fetch(url)
            .then(resp =>
              resp.json().then(json => ({ status: resp.status, json }))
            )
            .then(obj => {
              if (obj.status === 200 && obj.json.cod === "200") {
                this.setState({
                  success: true,
                  forecastDone: true,
                  forecast: obj.json.list.map(objectForecast => {
                    return {
                      dt: objectForecast.dt,
                      icon: objectForecast.weather[0].icon,
                      temp: objectForecast.main.temp,
                      temp_max: objectForecast.main.temp_max,
                      temp_min: objectForecast.main.temp_min,
                      description: objectForecast.weather[0].description,
                      pressure: objectForecast.main.pressure,
                      humidity: objectForecast.main.humidity,
                      wind_speed: objectForecast.wind.speed,
                      rain:
                        objectForecast.rain === undefined
                          ? -1
                          : objectForecast.rain["3h"]
                    };
                  })
                });
              } else {
                this.setState({
                  errorMessage: `Request failed => Response status:${
                    obj.status
                  }, JSON code:${obj.json.cod}`,
                  success: false,
                  forecastDone: false,
                  forecast: []
                });
              }
            })
            .catch(error => {
              this.setState({
                errorMessage: error,
                success: false,
                forecastDone: false,
                forecast: []
              });
            });
          break;
        case "GEO":
          url = `https://api.openweathermap.org/data/2.5/forecast?lat=${
            search.lat
          }&lon=${search.lon}&appid=${key}&units=metric`;
          fetch(url)
            .then(resp =>
              resp.json().then(json => ({ status: resp.status, json }))
            )
            .then(obj => {
              if (obj.status === 200 && obj.json.cod === "200") {
                this.setState({
                  success: true,
                  forecastDone: true,
                  forecast: obj.json.list.map(objectForecast => {
                    return {
                      dt: objectForecast.dt,
                      icon: objectForecast.weather[0].icon,
                      temp: objectForecast.main.temp,
                      temp_max: objectForecast.main.temp_max,
                      temp_min: objectForecast.main.temp_min,
                      description: objectForecast.weather[0].description,
                      pressure: objectForecast.main.pressure,
                      humidity: objectForecast.main.humidity,
                      wind_speed: objectForecast.wind.speed,
                      rain:
                        objectForecast.rain === undefined
                          ? -1
                          : objectForecast.rain["3h"]
                    };
                  })
                });
              } else {
                this.setState({
                  errorMessage: `Request failed => Response status:${
                    obj.status
                  }, JSON code:${obj.json.cod}`,
                  success: false,
                  forecastDone: false,
                  forecast: []
                });
              }
            })
            .catch(error => {
              this.setState({
                errorMessage: error,
                success: false,
                forecastDone: false,
                forecast: []
              });
            });
          break;
        default:
          this.setState({
            success: false,
            forecastDone: false,
            forecast: []
          });
      }
    }
    this.setState(prevState =>
      !prevState.showForecast
        ? {
            showCurrent: false,
            showForecast: !prevState.showForecast,
            showUVI: false
          }
        : { showForecast: !prevState.showForecast }
    );
  }

  toggleUVI() {
    const {
      longitude,
      latitude,
      currentDate,
      currentUVIDone,
      forecastUVIDone,
      historicUVIDone
    } = this.state;
    const key = WEATHER_KEY.WEATHER_KEY;
    if (!currentUVIDone) {
      // eslint-disable-next-line prettier/prettier
      const currentUVIurl =
        `https://api.openweathermap.org/data/2.5/uvi?lat=${
          latitude
        }&lon=${
          longitude
        }&appid=${key}`;
      /* Request the current UVI */
      fetch(currentUVIurl)
        .then(resp => resp.json().then(json => ({ status: resp.status, json })))
        .then(obj => {
          if (obj.status === 200 && Object.keys(obj.json).length > 0) {
            this.setState({
              currentUVIDone: true,
              currentUVI: obj.json
            });
          } else {
            this.setState({
              errorMessage: `Request failed => ${
                obj.status !== 200
                  ? `Response status: ${obj.status}`
                  : `JSON response`
              }`,
              currentUVIDone: false,
              currentUVI: {}
            });
          }
        })
        .catch(error => {
          this.setState({
            errorMessage: error,
            currentUVIDone: false,
            currentUVI: {}
          });
        });
    }

    if (!forecastUVIDone) {
      /* cnt parameter ask for maximum index from forecasted UVI array to
         return, starting from 0
      */
      // eslint-disable-next-line prettier/prettier
      const forecastUVIurl =
        `https://api.openweathermap.org/data/2.5/uvi/forecast?lat=${
          latitude
        }&lon=${
          longitude
        }&cnt=4&appid=${key}`;
      /* Request forecast of UVI for the next five days */
      fetch(forecastUVIurl)
        .then(resp => resp.json().then(json => ({ status: resp.status, json })))
        .then(obj => {
          if (obj.status === 200 && obj.json.length > 0) {
            this.setState({
              forecastUVIDone: true,
              forecastUVI: obj.json
            });
          } else {
            this.setState({
              errorMessage: `Request failed => ${
                obj.status !== 200
                  ? `Response status: ${obj.status}`
                  : `JSON response`
              }`,
              forecastUVIDone: false,
              forecastUVI: []
            });
          }
        })
        .catch(error => {
          this.setState({
            errorMessage: error,
            forecastUVIDone: false,
            forecastUVI: []
          });
        });
    }

    if (!historicUVIDone) {
      /* start parameter will set the day before the first element in 
         the array of historic data that we want to show. So we need the
        "startFrom30DaysAgo" variable to contains the date before 30 days ago.
         Also we need the "endFor30DaysAgo" variable to contains the last date
         to be included.
         1 Day = 86400000 Miliseconds
      */
      const startFor30DaysAgo = new Date(
        Math.round(new Date(currentDate * 1000 - 2678400000).getTime() / 1000)
      ).getTime();
      const endFor30DaysAgo = new Date(
        Math.round(new Date(currentDate * 1000 - 86400000).getTime() / 1000)
      ).getTime();
      // eslint-disable-next-line prettier/prettier
      const historyUVIurl =
        `http://api.openweathermap.org/data/2.5/uvi/history?lat=${
          latitude
        }&lon=${
          longitude
        }&start=${
          startFor30DaysAgo
        }&end=${
          endFor30DaysAgo
        }&appid=${key}`;

      /* Request last 30 days UVI data */
      fetch(historyUVIurl)
        .then(resp => resp.json().then(json => ({ status: resp.status, json })))
        .then(obj => {
          if (obj.status === 200 && obj.json.length > 0) {
            this.setState({
              historicUVIDone: true,
              historyUVI: obj.json
            });
          } else {
            this.setState({
              errorMessage: `Request failed => ${
                obj.status !== 200
                  ? `Response status: ${obj.status}`
                  : `JSON response`
              }`,
              historicUVIDone: false,
              historyUVI: []
            });
          }
        })
        .catch(error => {
          this.setState({
            errorMessage: error,
            historicUVIDone: false,
            historyUVI: []
          });
        });
    }

    this.setState(prevState =>
      !prevState.showUVI
        ? {
            showCurrent: false,
            showForecast: false,
            showUVI: !prevState.showUVI
          }
        : { showForecast: !prevState.showUVI }
    );
  }

  /* Celsius to Fahrenheit or Fahrenheit to Celsius */
  changeUnits() {
    const { currentDone, forecastDone, current, forecast, units } = this.state;
    let newCurrent;
    let newForecast;
    switch (units) {
      case "Celsius":
        if (currentDone && Object.keys(current).length > 0) {
          newCurrent = { ...current };
          newCurrent.temp = conversion(current.temp, toF);
          newCurrent.temp_max = conversion(current.temp_max, toF);
          newCurrent.temp_min = conversion(current.temp_min, toF);
        }
        if (forecastDone && forecast.length > 0) {
          newForecast = forecast.map(objectForecast => {
            return {
              dt: objectForecast.dt,
              icon: objectForecast.icon,
              temp: conversion(objectForecast.temp, toF),
              temp_max: conversion(objectForecast.temp_max, toF),
              temp_min: conversion(objectForecast.temp_min, toF),
              description: objectForecast.description,
              pressure: objectForecast.pressure,
              humidity: objectForecast.humidity,
              wind_speed: objectForecast.wind_speed,
              rain: objectForecast.rain
            };
          });
        }
        break;
      default:
        if (currentDone && Object.keys(current).length > 0) {
          newCurrent = { ...current };
          newCurrent.temp = conversion(current.temp, toC);
          newCurrent.temp_max = conversion(current.temp_max, toC);
          newCurrent.temp_min = conversion(current.temp_min, toC);
        }
        if (forecastDone && forecast.length > 0) {
          newForecast = forecast.map(objectForecast => {
            return {
              dt: objectForecast.dt,
              icon: objectForecast.icon,
              temp: conversion(objectForecast.temp, toC),
              temp_max: conversion(objectForecast.temp_max, toC),
              temp_min: conversion(objectForecast.temp_min, toC),
              description: objectForecast.description,
              pressure: objectForecast.pressure,
              humidity: objectForecast.humidity,
              wind_speed: objectForecast.wind_speed,
              rain: objectForecast.rain
            };
          });
        }
    }
    this.setState(prevState => ({
      current: newCurrent,
      forecast: newForecast,
      units: complement(prevState.units)
    }));
  }

  /* RENDER */
  render() {
    const {
      menuClassName,
      menuId,
      menuTitle,
      menuSpinnerColor,
      menuOptionsButtonColor,
      search,
      requestType
    } = this.props;
    const {
      menuWait,
      menuOpen,
      showCurrent,
      showForecast,
      showUVI,
      current,
      today,
      forecast,
      currentUVI,
      forecastUVI,
      historyUVI,
      currentDone,
      forecastDone,
      currentUVIDone,
      forecastUVIDone,
      historicUVIDone,
      success,
      errorMessage,
      units
    } = this.state;
    return (
      <div className={menuClassName} id={menuId}>
        <Container>
          {menuWait ? (
            <Modal
              centered
              id={menuTitle}
              isOpen={menuWait}
              style={{ width: "80px", height: "80px" }}
            >
              <ModalBody>
                <Spinner
                  color={menuSpinnerColor}
                  style={{
                    position: "relative",
                    width: "3rem",
                    height: "3rem"
                  }}
                />
              </ModalBody>
            </Modal>
          ) : (
            <div
              style={{
                position: "absolute",
                top: "80%",
                right: "45%",
                left: "45%",
                width: "auto",
                height: "auto"
              }}
            >
              {success ? (
                <div>
                  <Row>
                    <Col md="auto">
                      <Button
                        type="button"
                        color={menuOptionsButtonColor}
                        onClick={this.toggleMenu}
                      >
                        Last successfull search data
                      </Button>
                    </Col>
                  </Row>
                  <Modal
                    centered
                    scrollable
                    id={menuTitle}
                    isOpen={menuOpen}
                    toggle={this.toggleMenu}
                    size={showCurrent ? "md" : "xl"}
                  >
                    <ModalHeader toggle={this.toggleMenu}>
                      <Nav pills>
                        <NavItem>
                          <Button
                            type="button"
                            color={menuOptionsButtonColor}
                            onClick={this.toggleCurrent}
                          >
                            Current
                          </Button>
                        </NavItem>
                        <NavItem>
                          <Button
                            type="button"
                            color={menuOptionsButtonColor}
                            onClick={this.toggleForecast}
                          >
                            Forecast
                          </Button>
                        </NavItem>
                        <NavItem>
                          <Button
                            type="button"
                            color={menuOptionsButtonColor}
                            onClick={this.toggleUVI}
                          >
                            UVI
                          </Button>
                        </NavItem>
                        <NavItem>
                          <Button
                            type="button"
                            color={menuOptionsButtonColor}
                            onClick={this.changeUnits}
                          >
                            {/* eslint-disable-next-line react/jsx-one-expression-per-line */}
                            Change to {complement(units)}
                          </Button>
                        </NavItem>
                      </Nav>
                    </ModalHeader>
                    <ModalBody>
                      <DisplayCards
                        search={search}
                        requestType={requestType}
                        today={today}
                        showCurrent={showCurrent}
                        showForecast={showForecast}
                        showUVI={showUVI}
                        current={current}
                        forecast={forecast}
                        currentUVI={currentUVI}
                        forecastUVI={forecastUVI}
                        historyUVI={historyUVI}
                        currentDone={currentDone}
                        forecastDone={forecastDone}
                        currentUVIDone={currentUVIDone}
                        forecastUVIDone={forecastUVIDone}
                        historicUVIDone={historicUVIDone}
                        units={units}
                      />
                    </ModalBody>
                  </Modal>
                </div>
              ) : (
                <Modal
                  centered
                  id={menuTitle}
                  isOpen={menuOpen}
                  toggle={this.closeMenu}
                >
                  <ModalHeader toggle={this.toggleMenu} />
                  <ModalBody>
                    <div
                      className="tex-center"
                      style={{ fontFamily: "arial black" }}
                    >
                      <p>Request failed for:</p>
                      <p>{JSON.stringify(search, null, 2)}</p>
                      {/* eslint-disable-next-line react/jsx-one-expression-per-line */}
                      <p>with request type of: {requestType}</p>
                      <p>Last app message:</p>
                      <p>{errorMessage}</p>
                    </div>
                  </ModalBody>
                </Modal>
              )}
            </div>
          )}
        </Container>
      </div>
    );
  }
}
