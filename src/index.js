import React, {Component} from 'react';
import ReactDOM, {render} from 'react-dom';
import { Link, Router, Route, IndexRoute, browserHistory } from 'react-router';

const API = 'https://api.github.com/';

const MyHeader = () => {
  return (
    <div className="jumbotron">
      <h1>Github Search App</h1>
      <p>Search users in GitHub using this simple app.</p>
    </div>
  );
};

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
       <Profiles data={this.state.data} />
      </div>
    )
  }

}

class SearchProfile extends Component {
  render() {
    return (
      <div>
        <MyHeader />
        <div className="search-bar">
          <form
            className="input-group"
            onSubmit={this.handleForm.bind(this)}>
            <input
              type="search"
              ref="username"
              placeholder="Type Username here and press Enter"
              className="form-control"/>
            <span className="input-group-btn">
              <button type="submit" className="btn btn-warning">Submit</button>
            </span>
          </form>

           {/* <form onSubmit={this.handleForm.bind(this)}>
             <input type="search" ref="username" placeholder="Type Username here and press Enter"/>

           </form> */}
        </div>
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

class Profiles extends Component {
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
                <Link className="animated fadeInRight" to={"user/" + name.login}>
                <div className="bs-callout bs-callout-info">
                  <img className="user" src={name.avatar_url}/>
                  <h4>Username : {name.login}</h4>
                  <p> Url : {name.html_url}</p>
                  <p> Score : {name.score} </p>
                </div>
                </Link>
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
  }
  componentWillMount() {
    this.fetchUser(this.props.params.username);
    this.fetchRepo(this.props.params.username);
  }

  render() {
    if(this.state.user){
      let user = this.state.user;
      let repos = this.state.repo;
      let followers = `${user.html_url}/followers`;

      let repoList = repos.map(function(repo){
        return (
            <li>{repo.name}</li>
        );
      })

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
                <h2><a href={user.html_url}>{user.name}</a></h2>
                {user.bio}
                {user.blog}
                {user.following}
                <h4>Repository List</h4>
                <ul>{repoList}</ul>
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
