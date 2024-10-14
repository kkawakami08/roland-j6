import React from "react";
import chordChartData from "./ChordChart.json";
import ChordChart from "./components/ChordChart";
import Footer from "./components/Footer";

const App = () => {
  return (
    <div className="flex flex-col items-center flex-grow min-h-screen">
      <h1 className="flex flex-grow items-center mx-auto text-4xl font-bold text-center text-white my-4">J-6 Chord Bank</h1>
      <ChordChart chordData={chordChartData.chord_chart} />
      <Footer />
    </div>
  );
};

export default App;
