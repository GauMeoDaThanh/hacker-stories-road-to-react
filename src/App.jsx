/* eslint-disable react/prop-types */
import "./App.css";
import * as React from "react";

const App = () => {
  const [searchTerm, setSearchTerm] = React.useState(
    localStorage.getItem("search") ?? "React"
  );

  // if one of the variables in list changes (2nd parameter), the function will be called
  // not have the 2nd agrument will run the function for every render
  // empty 2nd agrument will only call the function once
  React.useEffect(() => {
    localStorage.setItem("search", searchTerm);
  }, [searchTerm]);

  const stories = [
    {
      title: "React",
      url: "https://reactjs.org/",
      author: "Jordan Walke",
      num_comments: 3,
      points: 4,
      objectID: 0,
    },
    {
      title: "Redux",
      url: "https://redux.js.org/",
      author: "Dan Abramov, Andrew Clark",
      num_comments: 2,
      points: 5,
      objectID: 1,
    },
  ];

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const searchStories = stories.filter((story) =>
    story.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <h1>My Hacker Stories</h1>
      <Search onSearch={handleSearch} search={searchTerm} />
      <hr />
      <List list={searchStories} />
    </div>
  );
};

const List = ({ list }) => {
  return (
    <ul>
      {list.map(({ objectID, ...item }) => (
        <Item key={objectID} {...item} />
      ))}
    </ul>
  );
};

const Item = ({ title, url, author, num_comments, points }) => {
  return (
    <li>
      <span>
        <a href={url}>{title}</a>
      </span>
      <span>{author}</span>
      <span>{num_comments}</span>
      <span>{points}</span>
    </li>
  );
};

const Search = ({ search, onSearch }) => (
  <div>
    <label htmlFor="search">Search:</label>
    <input type="text" id="search" onChange={onSearch} value={search} />
  </div>
);

export default App;
