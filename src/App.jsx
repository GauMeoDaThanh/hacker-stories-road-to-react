/* eslint-disable react/prop-types */
import "./App.css";
import * as React from "react";
import axios from "axios";

const REMOVE_STORY = "REMOVE_STORY";
const STORIES_FETCH_INIT = "STORIES_FETCH_INIT";
const STORIES_FETCH_SUCCESS = "STORIES_FETCH_SUCCESS";
const STORIES_FETCH_FAILURE = "STORIES_FETCH_FAILURE";
const API_ENDPOINT = "https://hn.algolia.com/api/v1/search?query=";

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
  const [searchTerm, setSearchTerm] = useStorageState("search", "React");
  const [url, setUrl] = React.useState(`${API_ENDPOINT}${searchTerm}`);

  const handleFetchStories = React.useCallback(async () => {
    if (!searchTerm) return;
    try {
      const result = await axios.get(url);
      dispatchStories({
        type: STORIES_FETCH_SUCCESS,
        payload: result.data.hits,
      });
    } catch {
      dispatchStories({
        type: STORIES_FETCH_FAILURE,
      });
    }
  }, [url]);
  React.useEffect(() => {
    handleFetchStories();
  }, [handleFetchStories]);
  const handlRemoveStories = (item) => {
    dispatchStories({
      type: REMOVE_STORY,
      payload: item,
    });
  };

  const handleSearchInput = (event) => {
    setSearchTerm(event.target.value);
  };
  const handleSearchSubmit = () => {
    setUrl(`${API_ENDPOINT}${searchTerm}`);
  };

  return (
    <div>
      <h1>My Hacker Stories</h1>
      <InputWithLabel
        onInputChange={handleSearchInput}
        search={searchTerm}
        id="search"
        isFocused
      >
        <strong>Search:</strong>
      </InputWithLabel>
      <button type="button" disabled={!searchTerm} onClick={handleSearchSubmit}>
        submit
      </button>
      <hr />
      {storiesDup.isError && <p>Something went wrong...</p>}

      {storiesDup.isLoading ? (
        <p>Loading...</p>
      ) : (
        <List list={storiesDup.data} onRemoveItem={handlRemoveStories} />
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
  onInputChange,
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
        onChange={onInputChange}
        value={search}
        ref={inputRef}
      />
    </React.Fragment>
  );
};

export default App;
