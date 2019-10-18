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

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pages
    };
    this.onDismiss = this.onDismiss.bind(this);
  }

  onDismiss(id) {
    const updatedPages = this.state.pages.filter(page => (page.objectID !== id));
    this.setState({pages: updatedPages});
  }

  render() {
    return (
      <div className="App">
        {this.state.pages.map((page) => (
          <div key={page.objectID}>
            <span>
              <a href={page.url}>{page.title}</a>
            </span>
            <span>{page.author}</span>
            <span>{page.num_comments}</span>
            <span>{page.points}</span>
            <span>
              <button
                onClick={() => this.onDismiss(page.objectID)}
                type="button"
              >
                Dismiss
              </button>
            </span>
          </div>))}
      </div>
    );
  }
}

export default App;
