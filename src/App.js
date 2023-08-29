import logo from "./logo.svg";
import "./App.css";
import Home from "./components/home";
import InsideTrip from "./components/insideTrip";
import NodeDetails from "./components/nodeDetails";
import Direction from "./components/Direction";
import React, { useState } from "react";

function App() {
  const [page, setPage] = useState(4);

  const renderPage = () => {
    switch (page) {
      case 1:
        return <Home onStart={() => setPage(2)} />;
      case 2:
        return <InsideTrip onAddNode={() => setPage(3)} />;
      case 3:
        return <NodeDetails />;
      case 4:
        return <Direction />;
      default:
        return null;
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        {/* <img src={logo} className="App-logo" alt="logo" /> */}
        <p>Hey there from Glimpass!</p>
        {renderPage()}
      </header>
    </div>
  );
}

export default App;
