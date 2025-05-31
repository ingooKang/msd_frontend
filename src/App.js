import React, {useState, useEffect} from "react";
import Header from "./components/Header";
import LeftNav from "./components/LeftNav";
import Main from "./components/Main";
import Footer from "./components/Footer";
import CONFIG from "./config";

function App() {
  const [totoData, setTotoData]=useState({
    ongoing:[],
    result:[],
    schedule:[],
  });


  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <Header />
      <div style={{ display: "flex", flex: 1 }}>
        <LeftNav ongoing={totoData.ongoing} />
        <Main result={totoData.result} schedule={totoData.schedule}/>
        
      </div>
      <Footer />
    </div>
  );
}

export default App;
