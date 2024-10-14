import React, { useState, useEffect, useMemo } from "react";
import ChordBankSelector from "./components/ChordBankSelector";
import CardDisplay from "./components/CardDisplay";
import KeyboardDisplay from "./components/KeyboardDisplay";
import chordData from "./ChordChart.json";
import TransposeControl from "./components/TransposeControl";
import { BackspaceIcon } from "@heroicons/react/24/solid";
import ScaleBox from "./components/ScaleBox";
import Footer from "./components/Footer";

import {
  stripChordName,
  transposeNote,
  transposeStrippedChord,
} from "./utils/helperFunctions";

const reassembleChord = (transposedChord, originalModifiers) => {
  const parts = transposedChord.split("/").map((part) => part.trim());

  // Handle the case where we may have a root with modifiers and a bass
  const rootWithModifiers = parts[0];
  const bass = parts.length > 1 ? parts[1] : null;

  // Combine root and modifiers, and if there's a bass, format it accordingly
  if (bass) {
    return (
      <>
        {rootWithModifiers}
        <span className="text-sm ml-0.5">{originalModifiers}</span> / {bass}
      </>
    );
  } else {
    return (
      <>
        {rootWithModifiers}
        <span className="text-sm ml-0.5">{originalModifiers}</span>
      </>
    );
  }
};

// Main Component
const ChordChart = () => {
  const [selectedNumber, setSelectedNumber] = useState("1");
  const [transposition, setTransposition] = useState(0);
  const [displayTransposition, setDisplayTransposition] = useState(0);
  const [displayedChords, setDisplayedChords] = useState([]);
  const [selectedNotes, setSelectedNotes] = useState([]);
  const [selectedButtons, setSelectedButtons] = useState([]);
  const [selectionOrder, setSelectionOrder] = useState([]);

  //returns chord data for each chord bank along with numberID
  const chordChartWithNumbers = useMemo(() => {
    if (!chordData || !chordData.chord_chart) {
      console.error("Chord data is missing or invalid");
      return [];
    }
    return chordData.chord_chart.map((chart, index) => ({
      genre: chart.genre,
      number: (index + 1).toString(),
      chords: chart.chords.map((chord, chordIndex) => ({
        name: chord.name,
        notes: chord.notes,
        button: (chordIndex + 1).toString(),
      })),
    }));
  }, []);

  //returns the corresponding chord bank object based on selectedNumber
  const selectedChart = useMemo(() => {
    return chordChartWithNumbers.find(
      (chart) => chart.number === selectedNumber
    );
  }, [chordChartWithNumbers, selectedNumber]);

  const handleClearAll = () => {
    setSelectedNotes([]);
    setSelectedButtons([]);
    setSelectionOrder([]);
  };

  //returns transposed chord object
  const transposeChords = useMemo(
    () => (chords, semitones) => {
      return chords.map((chordObj) => {
        const { name, notes, button } = chordObj;
        const { strippedChord, originalModifiers } = stripChordName(name);
        const transposedStrippedChord = transposeStrippedChord(
          strippedChord,
          semitones
        );
        const transposedChordName = reassembleChord(
          transposedStrippedChord,
          originalModifiers
        );

        return {
          originalName: name,
          transposedName: transposedChordName,
          transposedNotes: notes.map((note) => transposeNote(note, semitones)),
          button,
        };
      });
    },
    []
  );

  useEffect(() => {
    if (selectedChart) {
      const newDisplayedChords = transposeChords(
        selectedChart.chords,
        transposition
      );
      setDisplayedChords(newDisplayedChords);
    }
  }, [selectedChart, transposition, transposeChords]);

  const handleTranspose = (direction) => {
    setTransposition((prev) => {
      const newTransposition = Math.max(-12, Math.min(12, prev + direction));
      return newTransposition;
    });
    setDisplayTransposition((prev) => {
      const newDisplayTransposition = Math.max(
        -12,
        Math.min(12, prev + direction)
      );
      return newDisplayTransposition;
    });
  };

  const handleChordToggle = (notes, button) => {
    setSelectedNotes((prevNotes) => {
      const isAlreadySelected = prevNotes.some(
        (noteArray) => noteArray.join(",") === notes.join(",")
      );

      if (isAlreadySelected) {
        // Remove from selection order when deselecting
        setSelectionOrder((prev) => prev.filter((b) => b !== button));
        setSelectedButtons((prev) => prev.filter((b) => b !== button));
        return prevNotes.filter(
          (noteArray) => noteArray.join(",") !== notes.join(",")
        );
      } else {
        // Add to selection order when selecting
        setSelectionOrder((prev) => [...prev, button]);
        setSelectedButtons((prev) => [...prev, button]);
        return [...prevNotes, notes];
      }
    });
  };
  const buttonClassName =
    "px-4 py-2 bg-gray-950 hover:bg-gray-950/70 rounded-lg shadow-sm";

  return (
    <div className="flex flex-col items-center  justify-between gap-4  h-screen w-screen ">
      <div className="flex flex-col  gap-4 pt-8 px-4 md:px-8 w-full justify-items-center md:items-center ">
        {/* //header and chord display */}
        <div className="w-full  text-white font-medium grid grid-cols-12 gap-4 items-center  lg:flex lg:justify-center  ">
          <h1 className=" flex items-center justify-center border-sky-950 border-4 shadow-md rounded-lg px-5 text-center text-4xl h-full text-sky-950 font-black col-start-2 col-span-10 sm:col-start-2 sm:col-span-3 ">
            J • 6
          </h1>
          <div className="flex flex-col gap-2  items-center justify-center bg-sky-950 shadow-md rounded-lg py-3 px-5 col-start-2 col-span-10 sm:col-span-7">
            <ChordBankSelector
              chords={chordChartWithNumbers}
              onChange={setSelectedNumber}
              buttonClassName={buttonClassName}
            />
            <TransposeControl
              onTranspose={handleTranspose}
              displayTransposition={displayTransposition}
              buttonClassName={buttonClassName}
            />
          </div>
          <KeyboardDisplay
            selectedButtons={selectedButtons}
            selectionOrder={selectionOrder}
          />
          <button
            onClick={handleClearAll}
            className="flex items-center justify-center px-8 py-2 bg-red-800 hover:bg-red-900 text-white font-semibold rounded-md transition-colors duration-200  h-28 col-span-3"
          >
            <BackspaceIcon className="w-10" />
          </button>
        </div>
        {/* //chord display */}
        {selectedChart && (
          <CardDisplay
            chords={displayedChords}
            selectedNotes={selectedNotes}
            handleChordToggle={handleChordToggle}
          />
        )}

        {/* //scale info */}
        {selectedNotes && <ScaleBox selectedChords={selectedNotes} />}
      </div>
      <Footer />
    </div>
  );
};

export default ChordChart;
