import React, { Component } from 'react';
import './App.css';

const DEFAULT_QUERY = 'redux';
const DEFAULT_HITS_PER_PAGE = '100';
const PATH_BASE = 'https://hn.algolia.com/api/v1';
const PATH_SEARCH = '/search';
const PARAM_SEARCH = 'query=';
const PARAM_PAGE = "page=";
const PARAM_HPP = 'hitsPerPage=';

const largeColumn = { width: '40%', };
const midColumn = { width: '30%', };
const smallColumn = { width: '10%', };

const Search = ({ value, onChange, onSubmit }) => (
  <form onSubmit={onSubmit}>
    <input
      type="text"
      value={value}
      onChange={onChange}
    />
    <button type="submit">
      Search
    </button>
  </form>
);

const Table = ({ pages, onDismiss }) => (
  <div className="table">
    {pages.map((page) => (
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
    this.onSearchSubmit = this.onSearchSubmit.bind(this);
    this.setSearchTopStories = this.setSearchTopStories.bind(this);
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

  onSearchSubmit(event) {
    this.fetchSearchTopStories(this.state.searchTerm);
    event.preventDefault();
  }

  fetchSearchTopStories(searchTerm, page = 0) {
    fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}&${PARAM_HPP}${DEFAULT_HITS_PER_PAGE}`)
      .then(response => response.json())
      .then(this.setSearchTopStories)
      .catch(error => error);
  }

  setSearchTopStories(result) {
    const { hits, page } = result;
    const oldHits = page !== 0
      ? this.state.result.hits
      : [];
    const updatedHits = [ ...oldHits, ...hits]
    this.setState({
      result: { hits: updatedHits, page: page }
    })
  }

  componentDidMount() {
    this.fetchSearchTopStories(this.state.searchTerm);
  }

  render() {
    const { searchTerm, result } = this.state;
    const currentPage = (result && result.page) || 0
    return (
      <div className="page">
        <div className="interactions">
          <Search
            value={searchTerm}
            onChange={this.onSearchChange}
            onSubmit={this.onSearchSubmit}
          />
        </div>
        { result &&
          <Table
            pages={result.hits}
            onDismiss={this.onDismiss}
          /> }
        <div className="interactions">
          <Button onClick={() => this.fetchSearchTopStories(searchTerm, currentPage + 1)}>
            More
          </Button>
        </div>
      </div>
    );
  }
}

export default App;
