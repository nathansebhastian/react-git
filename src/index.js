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
    return (
      <div>
        <MyHeader />
        {this.props.children}
      </div>
    );
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
        </div>

    )
  }

  handleForm(e) {
   e.preventDefault();
    let username = this.refs.username.value
    this.props.fetchSearch(username);    
  }
}

class Profiles extends Component {
  render() {
    if(this.props.data){
      let data = this.props.data;

      if (data.message === 'Not Found')
        return (
           <div className="notfound">
              <h2>Oops !!!</h2>
              <p>The Component Couldn't Find The You Were Looking For . Try Again </p>
           </div>
        );
        else{
          let userList = data.items.map(function (name){
            return (
                <Link key={name.id} className="animated fadeInRight" to={"user/" + name.login}>
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
      repo: []
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
            <li key={repo.id}><a href={repo.html_url}>{repo.name}</a></li>
        );
      })

      if (user.message === 'Not Found')
        return (
           <div className="notfound">
              <h2>Oops !!!</h2>
              <p>The Component Couldn't Find The You Were Looking For . Try Again </p>
           </div>
        );
        else{
            return (
              <div className="container">
                <Link to="/" className="btn btn-primary" style={{marginBottom: "20px"}}>
                  Back to Index
                </Link>
                <div className="row">
                  <div className="col-xs-12 col-sm-6 col-md-6">
                      <div className="well well-sm">
                          <div className="row">
                              <div className="col-sm-6 col-md-4">
                                  <img src={user.avatar_url} alt="" className="img-rounded img-responsive" />
                              </div>
                              <div className="col-sm-6 col-md-8">
                                  <h3><a href={user.html_url}>{user.name}</a></h3>
                                  <small><cite title={user.location}>{user.location} <i className="glyphicon glyphicon-map-marker">
                                  </i></cite></small>
                                    <p>
                                      <i className="glyphicon glyphicon-envelope"></i>{user.email}
                                      <br />
                                      <i className="glyphicon glyphicon-globe"></i><a href={user.blog}>{user.blog}</a>
                                      <br />
                                      <i className="glyphicon glyphicon-user"></i>{user.bio}
                                    </p>
                                    <h4>Repository List</h4>
                                    <ul>{repoList}</ul>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
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
