import React, { Component } from "react";
import axios from "axios";
import { sortBy } from "lodash";
import PropTypes from "prop-types";
import classNames from "classnames";

import "./App.css";

const DEFAULT_QUERY = "redux";
const DEFAULT_HITS_PER_PAGE = "100";
const PATH_BASE = "https://hn.algolia.com/api/v1";
const PATH_SEARCH = "/search";
const PARAM_SEARCH = "query=";
const PARAM_PAGE = "page=";
const PARAM_HPP = "hitsPerPage=";

const largeColumn = { width: "40%" };
const midColumn = { width: "30%" };
const smallColumn = { width: "10%" };

const Loading = () => <div>Loading ...</div>;

class Search extends Component {
  componentDidMount() {
    if (this.input) {
      this.input.focus();
    }
  }

  render() {
    const { value, onChange, onSubmit } = this.props;
    return (
      <form onSubmit={onSubmit}>
        <input
          type="text"
          value={value}
          onChange={onChange}
          ref={element => (this.input = element)}
        />
        <button type="submit">Search</button>
      </form>
    );
  }
}

const Sort = ({ sortKey, activeSortKey, onSort, children }) => {
  const className = classNames("button-inline", {
    "button-active": sortKey === activeSortKey
  });
  return (
    <Button onClick={() => onSort(sortKey)} className={className}>
      {children}
    </Button>
  );
};

class Table extends Component {
  render() {
    const { pages, onDismiss, sortKey, isSortReverse, onSort } = this.props;
    let sortedPages = SORTING_FUNCTIONS[sortKey](pages);
    sortedPages = isSortReverse ? sortedPages.reverse() : sortedPages;
    return (
      <div className="table">
        <div className="table-header">
          <span style={largeColumn}>
            <Sort sortKey={"TITLE"} onSort={onSort} activeSortKey={sortKey}>
              Title
            </Sort>
          </span>
          <span style={midColumn}>
            <Sort sortKey={"AUTHOR"} onSort={onSort} activeSortKey={sortKey}>
              Author
            </Sort>
          </span>
          <span style={smallColumn}>
            <Sort sortKey={"COMMENTS"} onSort={onSort} activeSortKey={sortKey}>
              Comments
            </Sort>
          </span>
          <span style={smallColumn}>
            <Sort sortKey={"POINTS"} onSort={onSort} activeSortKey={sortKey}>
              Points
            </Sort>
          </span>
          <span style={smallColumn}> Archive</span>
        </div>
        {sortedPages.map(page => (
          <div key={page.objectID} className="table-row">
            <span style={largeColumn}>
              <a href={page.url}>{page.title}</a>
            </span>
            <span style={midColumn}>{page.author}</span>
            <span style={smallColumn}>{page.num_comments}</span>
            <span style={smallColumn}>{page.points}</span>
            <span style={smallColumn}>
              <Button
                onClick={() => onDismiss(page.objectID)}
                className="button-inline"
              >
                Dismiss
              </Button>
            </span>
          </div>
        ))}
      </div>
    );
  }
}
Table.propTypes = {
  pages: PropTypes.arrayOf(
    PropTypes.shape({
      objectID: PropTypes.string.isRequired,
      author: PropTypes.string,
      url: PropTypes.string,
      num_comments: PropTypes.number,
      points: PropTypes.number
    })
  ).isRequired,
  onDismiss: PropTypes.func.isRequired
};

const Button = ({ onClick, className, children }) => (
  <button onClick={onClick} className={className} type="button">
    {children}
  </button>
);

Button.propTypes = {
  onClick: PropTypes.func.isRequired,
  className: PropTypes.string,
  children: PropTypes.node.isRequired
};
Button.defaultProps = {
  className: ""
};

const withLoading = Component => ({ isLoading, ...rest }) =>
  isLoading ? <Loading /> : <Component {...rest} />;

const ButtonWithLoading = withLoading(Button);

const SORTING_FUNCTIONS = {
  NONE: list => list,
  TITLE: list => sortBy(list, "title"),
  AUTHOR: list => sortBy(list, "author"),
  COMMENTS: list => sortBy(list, "num_comments").reverse(),
  POINTS: list => sortBy(list, "points").reverse()
};

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      results: null,
      searchKey: "",
      searchTerm: DEFAULT_QUERY,
      error: null,
      isLoading: false,
      sortKey: "NONE",
      isSortReverse: false
    };
    this.onDismiss = this.onDismiss.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
    this.onSearchSubmit = this.onSearchSubmit.bind(this);
    this.setSearchTopStories = this.setSearchTopStories.bind(this);
    this.needsToSearchTopStories = this.needsToSearchTopStories.bind(this);
    this.onSort = this.onSort.bind(this);
  }

  needsToSearchTopStories(searchKey) {
    return !this.state.results[searchKey];
  }

  onDismiss(id) {
    const { searchKey, results } = this.state;
    const { hits, page } = results[searchKey];
    const isNotId = page => page.objectID !== id;
    const updatedHits = hits.filter(isNotId);
    this.setState({
      results: { ...results, [searchKey]: { hits: updatedHits, page } }
    });
  }

  onSearchChange(event) {
    this.setState({ searchTerm: event.target.value });
  }

  onSearchSubmit(event) {
    const searchTerm = this.state.searchTerm;
    this.setState({ searchKey: searchTerm });
    if (this.needsToSearchTopStories(searchTerm)) {
      this.fetchSearchTopStories(searchTerm);
    }
    event.preventDefault();
  }

  fetchSearchTopStories(searchTerm, page = 0) {
    this.setState({ isLoading: true });
    axios
      .get(
        `${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}&${PARAM_HPP}${DEFAULT_HITS_PER_PAGE}`
      )
      .then(result => this.setSearchTopStories(result.data))
      .catch(error => this.setState({ error }));
  }

  setSearchTopStories(result) {
    const { hits, page } = result;
    const { searchKey, results } = this.state;
    const oldHits =
      results && results[searchKey] ? results[searchKey].hits : [];
    const updatedHits = [...oldHits, ...hits];
    this.setState({
      results: {
        ...results,
        [searchKey]: { hits: updatedHits, page }
      },
      isLoading: false
    });
  }

  onSort(sortKey) {
    const isSortReverse =
      this.state.sortKey === sortKey && !this.state.isSortReverse;
    this.setState({ sortKey, isSortReverse });
  }

  componentDidMount() {
    const searchTerm = this.state.searchTerm;
    this.setState({ searchKey: searchTerm });
    this.fetchSearchTopStories(searchTerm);
  }

  render() {
    const {
      searchTerm,
      results,
      searchKey,
      error,
      isLoading,
      sortKey,
      isSortReverse
    } = this.state;
    const currentPage =
      (results && results[searchKey] && results[searchKey].page) || 0;
    const pages =
      (results && results[searchKey] && results[searchKey].hits) || [];
    return (
      <div className="page">
        <div className="interactions">
          <Search
            value={searchTerm}
            onChange={this.onSearchChange}
            onSubmit={this.onSearchSubmit}
          />
        </div>
        {error ? (
          <p>Something went wrong.</p>
        ) : (
          <Table
            pages={pages}
            onDismiss={this.onDismiss}
            sortKey={sortKey}
            onSort={this.onSort}
            isSortReverse={isSortReverse}
          />
        )}
        <div className="interactions">
          <ButtonWithLoading
            isLoading={isLoading}
            onClick={() =>
              this.fetchSearchTopStories(searchKey, currentPage + 1)
            }
          >
            More
          </ButtonWithLoading>
        </div>
      </div>
    );
  }
}

export default App;

export { Button, Search, Table };
