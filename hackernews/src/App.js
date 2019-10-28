import React, { Component } from 'react';
import './App.css';

const DEFAULT_QUERY = 'redux';
const PATH_BASE = 'https://hn.algolia.com/api/v1';
const PATH_SEARCH = '/search';
const PARAM_SEARCH = 'query=';

const largeColumn = { width: '40%', };
const midColumn = { width: '30%', };
const smallColumn = { width: '10%', };

const Search = ({ value, onChange, onSubmit, children }) => (
  <form>
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
  }

  fetchSearchTopStories(searchTerm) {
    fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}`)
      .then(response => response.json())
      .then(result => this.setState({ result }))
      .catch(error => error);
  }

  componentDidMount() {
    this.fetchSearchTopStories(this.state.searchTerm);
  }

  render() {
    const { searchTerm, result } = this.state;
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
      </div>
    );
  }
}

export default App;
