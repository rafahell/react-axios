import React, { Component } from 'react';
import axios from 'axios';
import Loading from './Loading';
import './App.css';

function isSearched(searchTerm) {
  return function(item) {
    return !searchTerm || item.name.first.includes(searchTerm);
  }
}


class App extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      users: [],
      isLoaded: false,
      searchTerm: ''
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.searchValue = this.searchValue.bind(this);
  }
  
  //fetch api axios
  getUsers() {
    axios('https://api.randomuser.me/?nat=US&results=5')
    .then(response => this.setState({
      users: [...this.state.users, ...response.data.results],
      isLoaded: true
    }))

    this.setState({
      isLoaded: false
    })
  }

  handleSubmit(e) {
    e.preventDefault();
    this.getUsers();
    console.log('more users')
  }

  componentWillMount() {
   this.getUsers(); 
  }

  searchValue (e) {
    this.setState ({searchTerm: e.target.value})
  }

  render() {
    const {isLoaded, users, searchTerm} = this.state;

      return (
        <div className="App">
 
          <form >
            <input type="text" onChange={this.searchValue} />
            
            <input type="submit" value="load users" onSubmit={this.handleSubmit} />
          </form>
          {isLoaded ?
                users.filter(isSearched(searchTerm)).map(user => 
                  <ul key={user.id.value}>
                    <li>{user.name.first}</li>
                    <li>{user.email}</li>
                    <li>{user.cell}</li>
                  </ul>)

           : <Loading message="Loading..." />}
        </div>
      );
    }
}

export default App;
