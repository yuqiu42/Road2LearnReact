import React from 'react';
import logo from './logo.svg';
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

function App() {
  const helloWorld = "Welcome to the Road to learn React";
  return (
    <div className="App">
      {pages.map((page) => (
        <div key={page.objectID}>
          <span>
            <a href={page.url}>{page.title}</a>
          </span>
          <span>{page.author}</span>
          <span>{page.num_comments}</span>
          <span>{page.points}</span>
        </div>))}
    </div>
  );
}

export default App;
