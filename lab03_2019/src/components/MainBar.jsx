import React from "react";
import Proptypes from "prop-types";

import {
  Alert,
  Button,
  Navbar,
  NavbarBrand,
  Nav,
  NavItem,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter
} from "reactstrap";

export default class MainBar extends React.Component {
  static propTypes = {
    mainBarClassName: Proptypes.string,
    mainBarId: Proptypes.number,
    titleBar: Proptypes.string,
    titleImgSrc: Proptypes.string,
    mainBarButtonsColor: Proptypes.string,
    about: Proptypes.bool,
    aboutList: Proptypes.arrayOf(Proptypes.string),
    contact: Proptypes.bool,
    contactList: Proptypes.arrayOf(Proptypes.string)
  };

  static defaultProps = {
    mainBarClassName: "MainBar",
    mainBarId: 0,
    titleBar: "MainBar",
    titleImgSrc: "",
    mainBarButtonsColor: "primary",
    about: false,
    aboutList: [],
    contact: false,
    contactList: []
  };

  constructor(props) {
    super(props);
    this.state = {
      aboutModal: false,
      contactModal: false
    };
    this.aboutButton = this.aboutButton.bind(this);
    this.contactButton = this.contactButton.bind(this);
  }

  aboutButton() {
    this.setState(prevState => ({
      aboutModal: !prevState.aboutModal
    }));
  }

  contactButton() {
    this.setState(prevState => ({
      contactModal: !prevState.contactModal
    }));
  }

  /* RENDER */
  render() {
    const {
      mainBarClassName,
      mainBarId,
      titleBar,
      titleImgSrc,
      mainBarButtonsColor,
      about,
      aboutList,
      contact,
      contactList
    } = this.props;
    const { aboutModal, contactModal } = this.state;

    return (
      <div className={mainBarClassName}>
        <Navbar id={mainBarId} expand="md">
          <NavbarBrand>
            <img alt={titleBar} src={titleImgSrc} />
          </NavbarBrand>
          <Nav className="ml-auto" navbar>
            {about ? (
              <NavItem>
                <Button
                  outline
                  color={mainBarButtonsColor}
                  type="button"
                  onClick={this.aboutButton}
                >
                  About
                </Button>
                <Modal centered isOpen={aboutModal} toggle={this.aboutButton}>
                  <ModalHeader toggle={this.aboutButton}>About</ModalHeader>
                  <ModalBody>
                    {aboutList.length > 0 ? (
                      <Alert color="info">
                        <ul>
                          {aboutList.map(ab => (
                            <li key={ab}>{ab}</li>
                          ))}
                        </ul>
                      </Alert>
                    ) : (
                      <Alert color="info">No about items supplied</Alert>
                    )}
                  </ModalBody>
                  <ModalFooter>
                    <Button
                      color={mainBarButtonsColor}
                      type="button"
                      onClick={this.aboutButton}
                    >
                      Ok
                    </Button>
                  </ModalFooter>
                </Modal>
              </NavItem>
            ) : (
              <div />
            )}
            {contact ? (
              <NavItem>
                <Button
                  outline
                  color={mainBarButtonsColor}
                  type="button"
                  onClick={this.contactButton}
                >
                  Contact
                </Button>
                <Modal
                  centered
                  isOpen={contactModal}
                  toggle={this.contactButton}
                >
                  <ModalHeader toggle={this.contactButton}>
                    Contact Info
                  </ModalHeader>
                  <ModalBody>
                    {contactList.length > 0 ? (
                      <Alert color="info">
                        <ul>
                          {contactList.map(con => (
                            <li key={con}>{con}</li>
                          ))}
                        </ul>
                      </Alert>
                    ) : (
                      <Alert color="info">No contacts supplied</Alert>
                    )}
                  </ModalBody>
                  <ModalFooter>
                    <Button
                      color={mainBarButtonsColor}
                      type="button"
                      onClick={this.contactButton}
                    >
                      Ok
                    </Button>
                  </ModalFooter>
                </Modal>
              </NavItem>
            ) : (
              <div />
            )}
          </Nav>
        </Navbar>
      </div>
    );
  }
}
