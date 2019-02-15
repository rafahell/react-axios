import React, { Component } from 'react';
import {Card, Container, Row, Col} from 'react-bootstrap';
import MapGL, {Marker,Popup, NavigationControl} from 'react-map-gl';
import axios from 'axios';
import Loading from './Loading';
import './App.css';
import Pin from './pin';

const TOKEN = 'pk.eyJ1IjoicmFmYWhlbGwiLCJhIjoiY2pzMzJ1MnZ2MjQxYjQ0bHh4amQyczJyMSJ9.-iEWBE9bMBsJvf5uUtFiAw';
const navStyle = {
  position: 'absolute',
  top: 0,
  left: 0,
  padding: '10px'
};

function isSearched(searchTerm) {
  return function(item) {
    return !searchTerm || item.name.first.toLowerCase().includes(searchTerm.toLowerCase());
  }
}

class App extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      isLoaded: false,
      searchTerm: '',
      viewport: {
        latitude: 37.785164,
        longitude: -100,
        zoom: 2,
        bearing: 0,
        pitch: 0
      },
      popupInfo: null
    };
    // this.handleSubmit = this.handleSubmit.bind(this);
    this.searchValue = this.searchValue.bind(this);
    
  }
  
  
  //fetch api axios
  getUsers() {
    axios.get('https://randomuser.me/api/?nat=US&results=6')
      .then(res => {
        const users = res.data.results;
        this.setState({ 
          users,
          isLoaded: true 
        })
      })

    this.setState({
      isLoaded: false
    })
  }

  // handleSubmit(e) {
  //   e.preventDefault();
  //   this.getUsers();
  // }

  componentDidMount() {
   this.getUsers(); 
  }

  searchValue (e) {
    this.setState ({searchTerm: e.target.value})
  }



  _updateViewport = (viewport) => {
    this.setState({viewport});
  }


  _renderPopup(e) {
    
    const {popupInfo} = this.state;
    const city = e.location.city;
    
    
    return popupInfo && (
      <Popup tipSize={5}
        anchor="top"
        longitude={Number(e.location.coordinates.longitude)}
        latitude={Number(e.location.coordinates.latitude)}
        closeOnClick={false}
        onClose={() => this.setState({popupInfo: null})} >
        <p>{city}</p>
      </Popup>
    );
  }


  render() {
    const {isLoaded, users, searchTerm, viewport} = this.state;

      return (
        <div className="App">

       <Container>
          <Row className="justify-content-center">
            <Col xs={12} md={12}>
              <form className="card card-sm">
              <Card>
                  <Card.Body className=" row no-gutters align-items-center">
                        <Col md="auto">
                            <i className="fas fa-search h4 text-body"></i>
                        </Col>
                        <Col>
                          <input className="form-control form-control-lg form-control-borderless" type="search" placeholder="Search" onChange={this.searchValue} />
                        </Col>
                  </Card.Body>
                </Card>
              </form>
            </Col>
        </Row>
      </Container>
              

          {isLoaded ?
            <Container>
              <Row>
              {users.filter(isSearched(searchTerm)).map((user) => 
                  <Col xs={12} sm={12} md={6} key={user.id.value}>
                  <Card>
                      <Card.Img variant="top" src={user.picture.large} />
                      <Card.Body>
                        <Card.Title>{user.name.first}</Card.Title>
                        <Card.Text>
                          <i className="fas fa-phone"></i> {user.cell} <br/>
                          <i className="far fa-envelope"></i> <span className="small">{user.email}</span><br/>
                          <i className="fas fa-map-marker-alt"></i><span className="city"> {user.location.city}</span>
                        </Card.Text>

                        <MapGL 
                          {...viewport}
                          width="100%"
                          height="400px"
                          mapStyle="mapbox://styles/mapbox/dark-v9"
                          //onViewportChange={this._updateViewport}
                          mapboxApiAccessToken={TOKEN} >
                          
                          <Marker 
                            longitude={Number(user.location.coordinates.longitude)}
                            latitude={Number(user.location.coordinates.latitude)}
                            // offsetTop={-20}
                            // offsetLeft={-10}
                            >
                            <Pin size={20} onClick={() => this.setState({popupInfo: user })}/>
                          </Marker>
                           {this._renderPopup(user)}
                          <div className="nav" style={navStyle}>
                            <NavigationControl  onViewportChange={(viewport) => this.setState({viewport})} /> 
                          </div>

                        </MapGL>
                      </Card.Body>
                  </Card>
                  </Col>)}
              </Row>
              {/* <Row>
                <form style={{display:'block',margin: '0 auto'}}>
                  <button className="btn btn-lg btn-success" type="submit" onSubmit={this.handleSubmit}  value="refresh users">Refresh Users</button>
                </form>
              </Row> */}
            </Container>
            : <Loading message="Loading..." />}
           
        </div>
      );
    }
}

export default App;
