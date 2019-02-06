import React, { Component } from 'react';
import axios from 'axios';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      users: [],
      isLoaded: false
    }
  }
  
  //fetch api axios
  getUsers() {
    this.setState({
      isLoaded: true
    })

    axios('https://api.randomuser.me/?nat=US&results=5')
    .then(response => this.setState({
      users: response.data.results,
      isLoaded: false
    }))
  }

  componentWillMount() {
   this.getUsers(); 
  }

  render() {
    const {isLoaded, users} = this.state;

      return (
        <div className="App">
          {!isLoaded ? 
            users.map((user,index) => 
              <ul key={index}>
                <li>{user.name.first}</li>
                <li>{user.email}</li>
                <li>{user.cell}</li>
              </ul>
            ) : <h1>Loading. . .</h1>}

        </div>
      );
    }
}

export default App;
