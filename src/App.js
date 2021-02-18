import React from "react";
import { Router } from "@reach/router";
import TimeSelectPage from "./components/pages/TimeSelectPage";

const App = () => {
  // app
  return (
    <div>
      <Router>
        <TimeSelectPage path="/" />
        <TimeSelectPage path="/scroll" />
      </Router>
    </div>
  );
};

export default App;
