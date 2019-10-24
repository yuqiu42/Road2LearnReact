import React, { Component } from 'react';
import './App.css';

const DEFAULT_QUERY = 'redux';
const PATH_BASE = 'https://hn.algolia.com/api/v1';
const PATH_SEARCH = '/search';
const PARAM_SEARCH = 'query=';

const largeColumn = { width: '40%', };
const midColumn = { width: '30%', };
const smallColumn = { width: '10%', };

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

const Search = ({ value, onChange, children }) => (
  <form>
    {children}
    <input
      type="text"
      value={value}
      onChange={onChange}
    />
  </form>
);

const Table = ({ pages, pattern, onDismiss }) => (
  <div className="table">
    {pages.filter(isSearched(pattern)).map((page) => (
      <div key={page.objectID} className="table-row">
        <span style={largeColumn}>
          <a href={page.url}>{page.title}</a>
        </span>
        <span style={midColumn}>
          {page.author}
        </span>
        <span style={smallColumn}>
          {page.num_comments}
        </span>
        <span style={smallColumn}>
          {page.points}
        </span>
        <span style={smallColumn}>
          <Button
            onClick={() => onDismiss(page.objectID)}
            className="button-inline"
          >
            Dismiss
          </Button>
        </span>
      </div>)
    )}
  </div>
);

const Button = ({ onClick, className, children }) => (
  <button
    onClick={onClick}
    className={className}
    type="button"
  >
    {children}
  </button>
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
      <div className="page">
        <div className="interactions">
          <Search
            value={searchTerm}
            onChange={this.onSearchChange}
          >
            Search:
          </Search>
        </div>
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
