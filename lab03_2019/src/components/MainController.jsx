import React from "react";
import Proptypes from "prop-types";

import requestParams from "./RequestController";
import MainBar from "./MainBar";
import Search from "./Search";
import Menu from "./Menu";

import "bootstrap/dist/css/bootstrap.min.css";

class Main extends React.Component {
  static propTypes = {
    controllerClassName: Proptypes.string,
    /* MainBar */
    mainBarClassName: Proptypes.string,
    mainBarId: Proptypes.number,
    mainBarButtonsColor: Proptypes.string,
    /* Search */
    searchClassName: Proptypes.string,
    searchId: Proptypes.number,
    /* Menu */
    menuClassName: Proptypes.string,
    menuId: Proptypes.number
  };

  static defaultProps = {
    controllerClassName: "Controller",
    /* MainBar */
    mainBarClassName: "MainBar",
    mainBarId: 0,
    mainBarButtonsColor: "primary",
    /* Search */
    searchClassName: "Search",
    searchId: 0,
    /* Menu */
    menuClassName: "Menu",
    menuId: 0
  };

  constructor(props) {
    super(props);
    this.state = {
      /* Contains the actual query */
      search: {},
      /* Contains requestType ("CITY", "CITY-COUNTRY", "GEO") */
      requestType: "",
      /* Contains the last search or an error message */
      lastSearch: "",
      lastSearchValid: false
    };
    this.handleSearch = this.handleSearch.bind(this);
  }

  handleSearch(searchString) {
    const { params, valid, requestType } = requestParams(searchString);
    if (valid) {
      this.setState({
        search: params,
        requestType,
        lastSearchValid: true,
        lastSearch: searchString
      });
    } else {
      this.setState({
        lastSearchValid: false,
        lastSearch: "Not a valid search. Look at the tips."
      });
    }
  }

  /* RENDER */
  render() {
    /* MainBar Section */
    const titleBar = "MayWeather";
    const titleImgSrc = "http://i67.tinypic.com/2cgohvk.png";
    const aboutList = ["Laboratorio 3-Paradigmas de programación-2019"];

    const contactList = [
      "xxxxx",
      "xxxxx",
      "xxxxx"
    ];

    /* Search Section */
    const searchTitle = "MayWeather";
    const searchPlaceHolder = "Search or look for the tips";
    const searchTitleButton = "Search Weather";

    const tipsTitle = "Search tips!";
    const tipsList = [
      "<city>",
      "<city>, <country>",
      "<city>, <country code>",
      "[Ll](on|ongitude): <position>, [Ll](at|atitude): <position>",
      "Submit your position (requires you to allow geolocation)"
    ];

    /* Menu Section */
    const menuTitle = "MayWeatherOptions";

    /* this.props */
    const {
      controllerClassName,
      mainBarClassName,
      mainBarId,
      mainBarButtonsColor,
      searchClassName,
      searchId,
      menuClassName,
      menuId
    } = this.props;

    /* this.state */
    const { search, requestType, lastSearchValid, lastSearch } = this.state;

    return (
      <div className={controllerClassName}>
        <MainBar
          mainBarClassName={mainBarClassName}
          mainBarId={mainBarId}
          titleBar={titleBar}
          titleImgSrc={titleImgSrc}
          mainBarButtonsColor={mainBarButtonsColor}
          about
          aboutList={aboutList}
          contact
          contactList={contactList}
        />
        <Search
          searchClassName={searchClassName}
          searchId={searchId}
          searchTitle={searchTitle}
          searchPlaceHolder={searchPlaceHolder}
          searchTitleButton={searchTitleButton}
          tipsTitle={tipsTitle}
          tipsList={tipsList}
          requestControl={this.handleSearch}
          showLastSearch
          lastSearchValid={lastSearchValid}
          lastSearch={lastSearch}
        />
        {Object.keys(search).length > 0 &&
        JSON.stringify(search) !== JSON.stringify(lastSearch) ? (
          <Menu
            menuClassName={menuClassName}
            menuId={menuId}
            menuTitle={menuTitle}
            search={search}
            requestType={requestType}
          />
        ) : (
          <div />
        )}
      </div>
    );
  }
}

export default Main;
