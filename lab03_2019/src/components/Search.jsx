import React from "react";
import Proptypes from "prop-types";

import {
  Alert,
  Badge,
  Button,
  Col,
  Container,
  Form,
  FormGroup,
  Input,
  Row,
  UncontrolledTooltip
} from "reactstrap";

export default class Search extends React.Component {
  static propTypes = {
    searchClassName: Proptypes.string,
    searchTitle: Proptypes.string,
    searchId: Proptypes.number,
    searchPlaceHolder: Proptypes.string,
    searchTitleButton: Proptypes.string,
    tipsTitle: Proptypes.string,
    tipsList: Proptypes.arrayOf(Proptypes.string),
    showLastSearch: Proptypes.bool,
    lastSearchValid: Proptypes.bool,
    lastSearch: Proptypes.string,
    requestControl: Proptypes.func.isRequired
  };

  static defaultProps = {
    searchClassName: "Search",
    searchTitle: "",
    searchId: 0,
    searchPlaceHolder: "",
    searchTitleButton: "Submit",
    tipsTitle: "[Help]",
    tipsList: ["[This is a tip]"],
    showLastSearch: false,
    lastSearchValid: false,
    lastSearch: ""
  };

  constructor(props) {
    super(props);
    this.state = {
      /* What is being typed in the search box  */
      searchString: "",
      /* Flag that allows search with geolocation data */
      geoAllow: false,
      /* Geolocation position with longitude and latitude */
      geo: {},
      /* Geolocation error */
      geoError: ""
    };
    this.onChange = this.onChange.bind(this);
    this.searchSubmit = this.searchSubmit.bind(this);
    this.setPosition = this.setPosition.bind(this);
    this.fillGeo = this.fillGeo.bind(this);
    this.geoErrorFail = this.geoErrorFail.bind(this);
  }

  onChange(input) {
    this.setState({ searchString: input.target.value });
  }

  setPosition() {
    const { geoAllow, geo, geoError } = this.state;
    /* If user gives permission, geolocation wasn't set and it wasn't allowed,
       try to obtain geolocation.
    */
    if (
      navigator.geolocation &&
      Object.keys(geo).length === 0 &&
      geoError.length === 0 &&
      !geoAllow
    ) {
      navigator.geolocation.getCurrentPosition(this.fillGeo, this.geoErrorFail);
    }
    /* If geoError is clean, and geolocation is already set, then change the state of button.
       First time will not take effect, because geo isn't set.
    */
    if (geoError.length === 0 && Object.keys(geo).length > 0) {
      this.setState(prevState => ({
        geoAllow: !prevState.geoAllow
      }));
    }
  }

  /* Callback for getCurrentPosition */
  fillGeo(geo) {
    this.setState({
      geoAllow: true,
      geo: { lon: geo.coords.longitude, lat: geo.coords.latitude }
    });
  }

  /* Callback for failure case when calling getCurrentPosition */
  geoErrorFail(error) {
    switch (error.code) {
      case error.POSITION_UNAVAILABLE:
        this.setState({
          geoError: "Position unavailable. Reload and try again."
        });
        break;
      case error.TIMEOUT:
        this.setState({
          geoError: "Connection time out. Reload and try again."
        });
        break;
      case error.PERMISSION_DENIED:
        this.setState({
          geoError: "Permission to access position was denied."
        });
        break;
      default:
        /* error.UNKNOW_ERROR */
        this.setState({
          geoError: "Couldn't get your position. Reload and try again."
        });
    }
  }

  searchSubmit(submit) {
    submit.preventDefault();
    const { requestControl } = this.props;
    const { searchString, geoAllow, geo } = this.state;
    if (geoAllow && Object.keys(geo).length > 0) {
      requestControl(`lon: ${geo.lon}, lat: ${geo.lat}`);
    } else {
      requestControl(searchString);
    }
  }

  /* RENDER */
  render() {
    const {
      searchClassName,
      searchTitle,
      searchId,
      searchTitleButton,
      tipsTitle,
      tipsList,
      searchPlaceHolder,
      showLastSearch,
      lastSearchValid,
      lastSearch
    } = this.props;

    const { geoAllow, geo, geoError } = this.state;

    return (
      <div
        className={searchClassName}
        id={searchId}
        style={{
          position: "absolute",
          top: "50%",
          marginTop: "-50px",
          width: "100%",
          height: "auto"
        }}
      >
        <Container>
          <Form onSubmit={this.searchSubmit}>
            <FormGroup>
              <Row>
                <Col xs="auto" sm="auto" md="auto">
                  <Badge id={searchTitle} color="primary" pill>
                    {/* eslint-disable-next-line react/jsx-one-expression-per-line */}
                    Check {searchTitle}
                  </Badge>
                </Col>
                <Col xs="auto" sm="auto" md="8">
                  <Input
                    type="search"
                    name={searchTitle}
                    placeholder={
                      geoAllow && Object.keys(geo).length > 0
                        ? `lon: ${geo.lon}, lat: ${geo.lat}`
                        : searchPlaceHolder
                    }
                    onChange={this.onChange}
                  />
                </Col>
                <Col xs="auto" sm="auto" md="auto">
                  <Button
                    type="submit"
                    color="primary"
                    onSubmit={this.searchSubmit}
                  >
                    {searchTitleButton}
                  </Button>
                </Col>
              </Row>
            </FormGroup>
            <Row>
              {showLastSearch ? (
                <Col xs="auto" sm="auto" md="auto">
                  {lastSearchValid ? (
                    <Alert color="success">
                      {/* eslint-disable-next-line react/jsx-one-expression-per-line */}
                      Last search: &#34;{lastSearch}&#34;
                    </Alert>
                  ) : (
                    <Alert color="warning">
                      {/* eslint-disable-next-line react/jsx-one-expression-per-line */}
                      Fight the weather... {lastSearch}
                    </Alert>
                  )}
                </Col>
              ) : (
                <Col xs="auto" sm="auto" md="auto" />
              )}
              {tipsList.length > 0 ? (
                <Col xs="auto" sm="auto" md="auto">
                  <Alert color="primary" id="tips">
                    {tipsTitle}
                  </Alert>
                  <UncontrolledTooltip target="tips" placement="auto">
                    <Alert color="dark">
                      Tips:
                      <ul>
                        {tipsList.map(tip => (
                          <li key={tip}>{tip}</li>
                        ))}
                      </ul>
                    </Alert>
                  </UncontrolledTooltip>
                </Col>
              ) : (
                <Col xs="auto" sm="auto" md="auto" />
              )}
              <Col xs="auto" sm="auto" md="auto">
                <Button
                  type="button"
                  color="primary"
                  onClick={this.setPosition}
                >
                  {geoAllow && Object.keys(geo).length > 0
                    ? `Disallow your position`
                    : `Set your position`}
                </Button>
              </Col>
              {geoError.length > 0 ? (
                <Col xs="auto" sm="auto" md="auto">
                  <Alert color="warning">{geoError}</Alert>
                </Col>
              ) : (
                <Col />
              )}
            </Row>
          </Form>
        </Container>
      </div>
    );
  }
}
