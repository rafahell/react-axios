import React, { Component } from 'react';
import { Card, Container, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import Loading from './Loading';
import './App.css';

function isSearched(searchTerm) {
  return function (item) {
    return !searchTerm || item.name.first.toLowerCase().includes(searchTerm.toLowerCase());
  }
}

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoaded: false,
      searchTerm: ''
    };
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
      .catch(error => this.setState({ error, isLoaded: false }));

    this.setState({
      isLoaded: false
    })
  }


  componentDidMount() {
    this.getUsers();
  }

  searchValue(e) {
    this.setState({ searchTerm: e.target.value })
  }

  render() {
    const { isLoaded, users, searchTerm } = this.state;

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
              {users.filter(isSearched(searchTerm)).map((user, index) =>
                <Col xs={12} sm={12} md={6} key={user.id.value}>
                  <Card>
                    <Card.Img variant="top" src={user.picture.large} />
                    <Card.Body>
                      <Card.Title>{user.name.first}</Card.Title>
                      <Card.Text>
                        <i className="fas fa-phone"></i> {user.cell} <br />
                        <i className="far fa-envelope"></i> <span className="small">{user.email}</span><br />
                        <i className="fas fa-map-marker-alt"></i><span className="city"> {user.location.city}</span>
                      </Card.Text>
                    </Card.Body>
                  </Card>
                </Col>)}
            </Row>
            <Row>
              <form style={{ display: 'block', margin: '0 auto' }}>
                <button className="btn btn-lg btn-success" type="submit" onSubmit={this.handleSubmit} value="refresh users">Refresh Users</button>
              </form>
            </Row>
          </Container>
          : <Loading message="Loading..." />}

      </div>
    );
  }
}

export default App;
