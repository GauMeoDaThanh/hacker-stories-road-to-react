/* eslint-disable react/prop-types */
import "./App.css";
import * as React from "react";

const useStorageState = (key, initialState) => {
  const [value, setValue] = React.useState(
    localStorage.getItem(key) ?? initialState
  );
  React.useEffect(() => {
    localStorage.setItem(key, value);
  }, [value, key]);

  return [value, setValue];
};

const App = () => {
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

  const getAsyncStories = () =>
    new Promise((resolve) =>
      setTimeout(() => resolve({ data: { storiesDup: stories } }), 2000)
    );
  const storiesReducer = (state, action) => {
    if (action.type === "SET_STORIES") {
      return action.payload;
    } else if (action.type === "REMOVE_STORY") {
      return state.filter(
        (story) => action.payload.objectID !== story.objectID
      );
    } else {
      throw new Error();
    }
  };
  const [storiesDup, dispatchStories] = React.useReducer(storiesReducer, []);
  React.useEffect(() => {
    setLoading(true);
    getAsyncStories()
      .then((result) => {
        dispatchStories({
          type: "SET_STORIES",
          payload: result.data.storiesDup,
        });
        setLoading(false);
      })
      .catch(() => setIsError(true));
  }, []);
  const [searchTerm, setSearchTerm] = useStorageState("search", "React");
  const [isLoading, setLoading] = React.useState(false);
  const [isError, setIsError] = React.useState(false);

  const handlRemoveStories = (item) => {
    dispatchStories({
      type: "REMOVE_STORY",
      payload: item,
    });
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const searchStories = storiesDup.filter((story) =>
    story.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <h1>My Hacker Stories</h1>
      <InputWithLabel
        onSearch={handleSearch}
        search={searchTerm}
        id="search"
        isFocused
      >
        <strong>Search:</strong>
      </InputWithLabel>
      <hr />
      {isError && <p>Something went wrong...</p>}

      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <List list={searchStories} onRemoveItem={handlRemoveStories} />
      )}
    </div>
  );
};

const List = ({ list, onRemoveItem }) => {
  return (
    <ul>
      {list.map((item) => (
        <Item key={item.objectID} item={item} onRemoveItem={onRemoveItem} />
      ))}
    </ul>
  );
};
// De xoa :
const Item = ({ item, onRemoveItem }) => {
  return (
    <li>
      <span>
        <a href={item.url}>{item.title}</a>
      </span>
      <span>{item.author}</span>
      <span>{item.num_comments}</span>
      <span>{item.points}</span>
      <button type="button" onClick={() => onRemoveItem(item)}>
        Dismiss
      </button>
    </li>
  );
};

const InputWithLabel = ({
  id,
  search,
  onSearch,
  type = "text",
  children,
  isFocused,
}) => {
  // imperative approach, not mandatory !!
  const inputRef = React.useRef();
  React.useEffect(() => {
    if (isFocused && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isFocused]);

  // If using declarative approach, just set the autoFocus = {isFocused}
  return (
    <React.Fragment>
      <label htmlFor={id}>{children}</label> &nbsp;
      <input
        type={type}
        id={id}
        onChange={onSearch}
        value={search}
        ref={inputRef}
      />
    </React.Fragment>
  );
};

export default App;
