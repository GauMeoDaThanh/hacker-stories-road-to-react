/* eslint-disable react/prop-types */
import "./App.css";
import * as React from "react";

const App = () => {
  const [searchTerm, setSearchTerm] = React.useState("");

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
    // console.log(searchTerm);
  };

  const searchStories = stories.filter((story) =>
    story.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <h1>My Hacker Stories</h1>
      <Search onSearch={handleSearch} searchTerm={setSearchTerm} />
      <hr />
      <List list={searchStories} />
    </div>
  );
};

const List = (props) => {
  return (
    <ul>
      {props.list.map((item) => (
        <Item item={item} key={item.objectID} />
      ))}
    </ul>
  );
};

const Item = (props) => (
  <li>
    <span>
      <a href={props.item.url}>{props.item.title}</a>
    </span>
    <span>{props.item.author}</span>
    <span>{props.item.num_comments}</span>
    <span>{props.item.points}</span>
  </li>
);

const Search = (props) => {
  return (
    <div>
      <label htmlFor="search">Search:</label>
      <input type="text" id="search" onChange={props.onSearch} />
    </div>
  );
};

export default App;
