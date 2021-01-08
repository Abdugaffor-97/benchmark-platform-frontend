import "./App.css";
import Home from "./components/Home";
import Start from "./components/Start";

const { BrowserRouter, Route } = require("react-router-dom");

function App() {
  return (
    <BrowserRouter>
      <Route path="/" exact component={Home} />
      <Route path="/start" exact render={(props) => <Start {...props} />} />
    </BrowserRouter>
  );
}

export default App;
