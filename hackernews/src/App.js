import React, { Component } from 'react';
import './App.css';

const DEFAULT_QUERY = 'redux';
const PATH_BASE = 'https://hn.algolia.com/api/v1';
const PATH_SEARCH = '/search';
const PARAM_SEARCH = 'query=';

const largeColumn = { width: '40%', };
const midColumn = { width: '30%', };
const smallColumn = { width: '10%', };

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
      result: null,
      searchTerm: DEFAULT_QUERY,
    };
    this.onDismiss = this.onDismiss.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
  }

  onDismiss(id) {
    const isNotId = (page) => (page.objectID !== id)
    const updatedHits = this.state.result.hits.filter(isNotId);
    this.setState({
      result: { ...this.state.result, hits: updatedHits }
    });
  }

  onSearchChange(event) {
    this.setState({searchTerm: event.target.value});
  }

  componentDidMount() {
    const { searchTerm } = this.state;
    fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}`)
      .then(response => response.json())
      .then(result => this.setState({ result }))
      .catch(error => error);
  }

  render() {
    const { searchTerm, result } = this.state;
    if (!result) { return null; }

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
          pages={result.hits}
          pattern={searchTerm}
          onDismiss={this.onDismiss}
        />
      </div>
    );
  }
}

export default App;
