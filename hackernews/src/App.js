import React, { Component } from 'react';
import './App.css';

const pages = [
  {
    title: 'React',
    url: 'https://reactjs.org/', author: 'Jordan Walke', num_comments: 3,
    points: 4,
    objectID: 0,
  },
  {
    title: 'Redux',
    url: 'https://redux.js.org/', author: 'Dan Abramov, Andrew Clark', num_comments: 2,
    points: 5,
    objectID: 1,
  },
];

const isSearched = (searchTerm) =>
  (page) => page.title.toLowerCase().includes(searchTerm.toLowerCase())

const Search = (props) => (
  <form>
    {props.children}
    <input
      type="text"
      value={props.value}
      onChange={props.onChange}
    />
  </form>
);

const Table = (props) => (
  <div>
    {props.pages.filter(isSearched(props.pattern)).map((page) => (
      <div key={page.objectID}>
        <span>
          <a href={page.url}>{page.title}</a>
        </span>
        <span>{page.author}</span>
        <span>{page.num_comments}</span>
        <span>{page.points}</span>
        <span>
          <button
            onClick={() => props.onDismiss(page.objectID)}
            type="button"
          >
            Dismiss
          </button>
        </span>
      </div>))}
  </div>
);

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pages,
      searchTerm: "",
    };
    this.onDismiss = this.onDismiss.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
  }

  onDismiss(id) {
    const updatedPages = this.state.pages.filter(page => (page.objectID !== id));
    this.setState({pages: updatedPages});
  }

  onSearchChange(event) {
    this.setState({searchTerm: event.target.value});
  }

  render() {
    const { searchTerm, pages } = this.state;
    return (
      <div className="App">
        <Search
          value={searchTerm}
          onChange={this.onSearchChange}
        >
          Search:
        </Search>
        <Table
          pages={pages}
          pattern={searchTerm}
          onDismiss={this.onDismiss}
        />
      </div>
    );
  }
}

export default App;
