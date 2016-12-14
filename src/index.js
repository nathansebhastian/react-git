import React, {Component} from 'react';
import ReactDOM, {render} from 'react-dom';
import { Link, Router, Route, IndexRoute, browserHistory } from 'react-router';

const API = 'https://api.github.com/';
class App extends Component {
  render() {
    return <div>{this.props.children}</div>
  }

}

class PageIndex extends Component {
  constructor(props) {
    super(props)
    this.state = {
      search: 'yonathansebhastian',
      data: '',
      user: '',
      repo: ''
    }
  }
  fetchSearch(username) {
    let url = `${API}search/users?q=${username}`;
    fetch(url)
      .then((res) => res.json() )
      .then((data) => {
        this.setState({
          data: data
        })
        console.log(this.state.data);
      })
      .catch((error) => console.log('Oops! . There Is A Problem') )

  }
  componentWillMount() {
    this.fetchSearch(this.state.search);
  }
  render() {
    return (
      <div>
       <SearchProfile fetchSearch={this.fetchSearch.bind(this)}/>
       <Profile data={this.state.data} />
      </div>
    )
  }
}

class SearchProfile extends Component {
  render() {
    return (
      <div className="search--box">
         <form onSubmit={this.handleForm.bind(this)}>
           <label><input type="search" ref="username" placeholder="Type Username here and press Enter"/></label>
         </form>
      </div>
    )
  }

  handleForm(e) {
   e.preventDefault();
    let username = this.refs.username.getDOMNode().value
    this.props.fetchSearch(username);
    this.refs.username.getDOMNode().value = '';
  }
}

class Profile extends Component {
  render() {
    if(this.props.data){
      let data = this.props.data;

      if (data.notFound === 'Not Found')
        return (
           <div className="notfound">
              <h2>Oops !!!</h2>
              <p>The Component Couldn't Find The You Were Looking For . Try Again </p>
           </div>
        );
        else{
          let userList = data.items.map(function (name){
            return (
              <ul>
                <Link to={"user/" + name.login}>
                  <li>Username : {name.login}</li>
                  <li><img src={name.avatar_url}/></li>
                  <li>{name.id}</li>
                </Link>
              </ul>
            );
          })
          return (
            <div>{userList}</div>
          );
        }
    }
    else {
      return <div>Fetching data . . .</div>
    }
  }
}

class UserProfile extends Component {
  constructor(props) {
    super(props)
    this.state = {
      user: '',
      repo: ''
    }
  }

  fetchUser(username) {
    let url = `${API}users/${username}`;
    fetch(url)
      .then((res) => res.json() )
      .then((data) => {
        this.setState({
          user: data
        })
        console.log(this.state.user);
      })
      .catch((error) => console.log('Oops! . There Is A Problem') )
  }

  fetchRepo(username) {
    let url = `${API}users/${username}/repos`;
    fetch(url)
      .then((res) => res.json() )
      .then((data) => {
        this.setState({
          repo: data
        })
        console.log(this.state.repo);
      })
      .catch((error) => console.log('Oops! . There Is A Problem') )
  }
  componentWillMount() {
    this.fetchUser(this.props.params.username);
    this.fetchRepo(this.props.params.username);
  }

  render() {
    if(this.state.user){
      let user = this.state.user;

      if (user.notFound === 'Not Found')
        return (
           <div className="notfound">
              <h2>Oops !!!</h2>
              <p>The Component Couldn't Find The You Were Looking For . Try Again </p>
           </div>
        );
        else{
            return (
              <div>
                <Link to="/" >
                  Back to Index
                </Link>
                {user.bio}
                {user.blog}
              </div>
            );
        }
    }
    else {
      return <div>Please wait . . .</div>
    }
  }
}

render(<Router history={browserHistory}>
  <Route path ="/" component={App} >
    <IndexRoute component={PageIndex} />
    <Route path = "user/:username" component={UserProfile} />
  </Route>
</Router>, document.querySelector('#app'));
