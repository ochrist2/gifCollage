import React, { Component } from "react";
import searchLogo from "./searchLogo.svg";
import { Grid, Row, Col } from "react-flexbox-grid";
import TextField, { HelperText, Input } from "@material/react-text-field";
import Modal from "react-modal";
//styling needed for the modal below
const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)"
  }
};
Modal.setAppElement("#root");
//api key for giphy's api
let apiKey = "SjXcHVrprZEAwldATZkKGKh02vPIN9Ev";
class App extends Component {
  // sends a GET request to giphy's api and sets the state variable gifURLs to the response
  getGif = async word => {
    // don't search if the previous word searched was the same
    if (this.state.lastSearch !== word) {
      await this.setState({ lastSearch: word, gifURLs: [] });
      try {
        let response = await fetch(
          "https://api.giphy.com/v1/gifs/search?limit=25&api_key=" +
            apiKey +
            "&q=" +
            word
        );
        let responseJson = await response.json();
        let newGifs = [];
        for (let i = 0; i < 25; i++) {
          newGifs.push(responseJson.data[i].images.fixed_height.url);
        }
        await this.setState({ gifURLs: newGifs });
        await console.log(responseJson);
      } catch (err) {
        console.error(err);
      }
    }
  };
  openModal = () => {
    this.setState({ modalIsOpen: true });
  };

  afterOpenModal = () => {};
  closeModal = () => {
    this.setState({ modalIsOpen: false });
  };
  addToFavourites = url => {
    // adds a GIF to favourites if it's not already in favourites
    if (this.state.favourites.indexOf(url) == -1) {
      this.setState({ favourites: this.state.favourites.concat(url) });
    }
    console.log(this.state.favourites);
  };
  // removes a GIF from the user's favourites
  removeFromFavourites = url => {
    let newGifs = this.state.favourites.filter(gifURL => {
      return gifURL !== url;
    });
    this.setState({ favourites: newGifs });
  };
  constructor() {
    super();
    this.state = {
      value: "Search here",
      lastSearch: "",
      gifURLs: [],
      favourites: [],
      modalIsOpen: false
    };
    // initially searches "do it" so there's some images when the screen first loads
    this.getGif("do it");
  }
  render() {
    //list of the favourites selected by the user
    const favourites = this.state.favourites.map((item, key) => (
      <img
        key={key}
        src={item}
        onClick={() => {
          this.removeFromFavourites(item);
        }}
      />
    ));
    //list of GiFs based on the searched word
    const gifs = this.state.gifURLs.map((item, index) => (
      <img
        key={index}
        src={item}
        onClick={() => {
          this.addToFavourites(item);
        }}
      />
    ));
    return (
      <div style={{ paddingTop: "5%", alignItems: "center" }}>
        <Modal
          isOpen={this.state.modalIsOpen}
          onAfterOpen={this.afterOpenModal}
          onRequestClose={this.closeModal}
          style={customStyles}
          contentLabel="Your favourite GIFs"
        >
          <Grid fluid>
            <Row>
              <Col lg={12}>
                <h1>Your favourite GIFs</h1>
                <p>
                  Click on one of the GIFs to delete it from your favourites
                </p>
              </Col>
            </Row>
            <Row>
              <Col lg={12}>{favourites}</Col>
            </Row>
            <Row>
              <button onClick={this.closeModal}>close</button>
            </Row>
          </Grid>
        </Modal>
        <Grid fluid>
          <Row>
            <Col lg={8}>
              <h1>
                Search a word and see a collage of gifs!! Click a GIF to add to
                your favourites
              </h1>
            </Col>
            <Col lg={2}>
              <TextField>
                <Input
                  value={this.state.value}
                  onChange={e => this.setState({ value: e.target.value })}
                />
              </TextField>
            </Col>
            <Col lg={1}>
              <img
                src={searchLogo}
                onClick={() => this.getGif(this.state.value)}
              />
            </Col>
            <Col lg={1}>
              <p onClick={this.openModal} style={{ border: "1px solid black" }}>
                View favourites
              </p>
            </Col>
          </Row>
          <Row>
            <Col lg={12}>{gifs}</Col>
          </Row>
        </Grid>
      </div>
    );
  }
}

export default App;
