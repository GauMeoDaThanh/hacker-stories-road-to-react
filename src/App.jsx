/* eslint-disable react/prop-types */
import "./App.css";
import * as React from "react";

const SET_STORIES = "SET_STORIES";
const REMOVE_STORY = "REMOVE_STORY";
const STORIES_FETCH_INIT = "STORIES_FETCH_INIT";
const STORIES_FETCH_SUCCESS = "STORIES_FETCH_SUCCESS";
const STORIES_FETCH_FAILURE = "STORIES_FETCH_FAILURE";

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
    new Promise((resolve, reject) => setTimeout(reject, 2000));
  const storiesReducer = (state, action) => {
    switch (action.type) {
      case STORIES_FETCH_INIT:
        return {
          ...state,
          isLoading: true,
          isError: false,
        };
      case STORIES_FETCH_SUCCESS:
        return {
          ...state,
          isLoading: false,
          isError: false,
          data: action.payload,
        };
      case STORIES_FETCH_FAILURE:
        return {
          ...state,
          isLoading: false,
          isError: true,
        };
      case REMOVE_STORY:
        return {
          ...state,
          data: state.data.filter(
            (story) => action.payload.objectID !== story.objectID
          ),
        };
      default:
        throw new Error();
    }
  };
  const [storiesDup, dispatchStories] = React.useReducer(storiesReducer, {
    data: [],
    isLoading: false,
    isError: false,
  });
  React.useEffect(() => {
    dispatchStories({ type: STORIES_FETCH_INIT });

    getAsyncStories()
      .then((result) => {
        dispatchStories({
          type: STORIES_FETCH_SUCCESS,
          payload: result.data.storiesDup,
        });
      })
      .catch(() => dispatchStories({ type: STORIES_FETCH_FAILURE }));
  }, []);
  const [searchTerm, setSearchTerm] = useStorageState("search", "React");

  const handlRemoveStories = (item) => {
    dispatchStories({
      type: REMOVE_STORY,
      payload: item,
    });
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const searchStories = storiesDup.data.filter((story) =>
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
      {storiesDup.isError && <p>Something went wrong...</p>}

      {storiesDup.isLoading ? (
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
