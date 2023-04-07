import { useReducer, useState } from "react";
import { v4 as uuid } from "uuid";
import "./App.css";

function syntaxHighlight(json: string): string {
  if (!json) return ""; //no JSON from response

  json = json
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
  return json.replace(
    /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
    function (match: string) {
      var cls = "number";
      if (/^"/.test(match)) {
        if (/:$/.test(match)) {
          cls = "key";
        } else {
          cls = "string";
        }
      } else if (/true|false/.test(match)) {
        cls = "boolean";
      } else if (/null/.test(match)) {
        cls = "null";
      }
      return '<span class="' + cls + '">' + match + "</span>";
    }
  );
}

function App() {
  const [oneLayerObject, setOneLayerObject] = useState<{
    [key: string]: unknown;
  }>({
    number: 1,
    string: "string",
    boolean: true,
    array: [1, 2, 3],
    object: { field: "" },
  });
  const [history, setHistory] = useState([]);

  const addRandomProperty = () => {
    setOneLayerObject((prev) => {
      return { ...prev, [uuid()]: uuid() };
    });
  };

  const removeRandomProperty = () => {
    const keys: string[] = Object.keys(oneLayerObject);
    const randomKey: string = keys[Math.floor(Math.random() * keys.length)];

    setOneLayerObject((prev) => {
      const _clone = { ...prev };

      if (_clone[randomKey]) {
        delete _clone[randomKey];
      }

      return _clone;
    });
  };

  return (
    <div className="app">
      <pre
        className="code"
        dangerouslySetInnerHTML={{
          __html: syntaxHighlight(JSON.stringify(oneLayerObject, null, 2)),
        }}
      />
      <div className="app_button_container">
        <button onClick={addRandomProperty}>Add random property</button>
        <button onClick={removeRandomProperty}>Remove random property</button>
        <button disabled={history.length === 0}>Undo</button>
        <button disabled={history.length === 0}>Redo</button>
      </div>
    </div>
  );
}

export default App;
