import logo from "./logo.svg";
import "./App.css";
import { useState, useEffect, useRef } from "react";
import { ApiClient } from "./helpers/apiClient";
import { apiClientType } from "./models/apiClientType";
function App() {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [input, setInput] = useState("");
  const inputRef = useRef();
  useEffect(() => {
    getMessages();
  }, []);
  const getMessages = async () => {
    let response = await ApiClient(
      apiClientType.get,
      "https://mapi.harmoney.dev/api/v1/messages/",
      "",
      {}
    );
    let a = await response.sort((a, b) => {
      return new Date(b.timestamp) - new Date(a.timestamp);
    });
    setMessages(a);
  };
  const postMessage = async () => {
    let response = await ApiClient(
      apiClientType.post,
      "https://mapi.harmoney.dev/api/v1/messages/",
      "",
      { text: input }
    );
    if (response) {
      getMessages();
      setInput("");
      inputRef.current.value = "";
    }
  };
  const deleteMessage = async (id) => {
    let response = await ApiClient(
      apiClientType.delete,
      `https://mapi.harmoney.dev/api/v1/messages/${id}/`,
      "",
      {}
    );
    if (response) {
      getMessages();
    }
  };
  const deleteAll = async () => {
    if (window.confirm("Are you sure you want to delete all?")) {
      setIsLoading(true);
      let promises = [];
      messages.map((item) => {
        promises.push(
          ApiClient(
            apiClientType.delete,
            `https://mapi.harmoney.dev/api/v1/messages/${item.id}/`,
            "",
            {}
          )
        );
      });
      let response = await Promise.all(promises);
      if (response) {
        await getMessages();
        setIsLoading(false);
      }
    }
  };
  return (
    <div className="App">
      <h1>Chatter</h1>
      <div>Type something in the box below, then hit "POST"</div>
      <br />
      <input
        ref={inputRef}
        type="text"
        onChange={(e) => setInput(e.target.value)}
        placeholder="Post Message"
        style={{
          border: "1px solid lightgrey",
          padding: "5px",
          borderRadius: "5px",
        }}
      />
      <button
        style={{
          background: "white",
          border: "1px solid lightgrey",
          borderRadius: "5px",
          padding: "5px",
          marginRight: "10px",
          marginLeft: "10px",
          cursor: "pointer",
        }}
        onClick={postMessage}
      >
        Post
      </button>
      <button
        style={{
          background: "white",
          border: "1px solid red",
          borderRadius: "5px",
          padding: "5px",
          color: "red",
          cursor: "pointer",
        }}
        onClick={deleteAll}
      >
        Delete All
      </button>
      {isLoading ? (
        <span style={{ marginLeft: "10px" }}>...loading</span>
      ) : (
        <></>
      )}
      {messages.map((item) => {
        let date = new Date(item.timestamp);
        return (
          <div
            key={item.id}
            style={{
              marginTop: "20px",
              padding: "10px 0 10px 0",
              borderTop: "1px dotted grey",
            }}
          >
            <i
              style={{ color: "grey", marginRight: "10px" }}
              className="fa fa-commenting-o"
            ></i>
            <span style={{ fontWeight: "bold" }}>{item.source}</span>
            <span style={{ color: "grey" }}>
              {" "}
              - {date.toLocaleTimeString("en-US")}
            </span>
            <span
              style={{
                marginLeft: "10px",
                color: "blue",
                textDecoration: "underline",
                cursor: "pointer",
              }}
              onClick={() => deleteMessage(item.id)}
            >
              delete
            </span>
            <div
              style={{ color: "grey", marginTop: "10px", marginLeft: "20px" }}
            >
              {item.text}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default App;
