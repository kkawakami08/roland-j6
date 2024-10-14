import React, { useState, useEffect, useMemo } from "react";
import ChordBankSelector from "./ChordBankSelector";
import TransposeControls from "./TransposeControls";
import ChordDisplay from "./ChordDisplay";
import KeyboardDisplay from "./KeyboardDisplay";
import ClearButton from "./ClearButton";
import chordData from "../ChordChart.json";
import { Note, Interval } from "@tonaljs/tonal";

// Utility functions for chord manipulation
const stripChordName = (chordName) => {
  const [rootPart, bassPart] = chordName.split("/");
  const rootMatch = rootPart.match(/^[A-G][#b]?/);
  const root = rootMatch ? rootMatch[0] : null;
  const bassMatch = bassPart ? bassPart.match(/^[A-G][#b]?/) : null;
  const bass = bassMatch ? bassMatch[0] : null;
  const originalModifiers = rootPart.replace(root, "");
  const strippedChord = bass ? `${root}/${bass}` : root;
  return { strippedChord, originalModifiers };
};

const transposeNote = (note, semitones) => {
  return Note.transpose(note, Interval.fromSemitones(semitones));
};

const transposeStrippedChord = (strippedChord, semitones) => {
  const [root, bass] = strippedChord.split("/");
  const transposedRoot = transposeNote(root, semitones);
  const transposedBass = bass ? transposeNote(bass, semitones) : null;
  return transposedBass ? `${transposedRoot} / ${transposedBass}` : transposedRoot;
};

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

  const selectedChart = useMemo(() => {
    return chordChartWithNumbers.find((chart) => chart.number === selectedNumber);
  }, [chordChartWithNumbers, selectedNumber]);

  const handleClearAll = () => {
    setSelectedNotes([]);
    setSelectedButtons([]);
    setSelectionOrder([]);
  };

  const transposeChords = useMemo(
    () => (chords, semitones) => {
      return chords.map((chordObj) => {
        const { name, notes, button } = chordObj;
        const { strippedChord, originalModifiers } = stripChordName(name);
        const transposedStrippedChord = transposeStrippedChord(strippedChord, semitones);
        const transposedChordName = reassembleChord(transposedStrippedChord, originalModifiers);

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
      const newDisplayedChords = transposeChords(selectedChart.chords, transposition);
      setDisplayedChords(newDisplayedChords);
    }
  }, [selectedChart, transposition, transposeChords]);

  const handleTranspose = (direction) => {
    setTransposition((prev) => {
      const newTransposition = Math.max(-12, Math.min(12, prev + direction));
      return newTransposition;
    });
    setDisplayTransposition((prev) => {
      const newDisplayTransposition = Math.max(-12, Math.min(12, prev + direction));
      return newDisplayTransposition;
    });
  };

  const handleChordToggle = (notes, button) => {
    setSelectedNotes((prevNotes) => {
      const isAlreadySelected = prevNotes.some((noteArray) => noteArray.join(",") === notes.join(","));

      if (isAlreadySelected) {
        // Remove from selection order when deselecting
        setSelectionOrder((prev) => prev.filter((b) => b !== button));
        setSelectedButtons((prev) => prev.filter((b) => b !== button));
        return prevNotes.filter((noteArray) => noteArray.join(",") !== notes.join(","));
      } else {
        // Add to selection order when selecting
        setSelectionOrder((prev) => [...prev, button]);
        setSelectedButtons((prev) => [...prev, button]);
        return [...prevNotes, notes];
      }
    });
  };

  return (
    <div className="flex flex-col flex-grow items-center justify-center gap-4 px-4 md:px-8 lg:px-20">
      <div className="flex flex-wrap flex-grow items-center justify-center gap-4">
        <ChordBankSelector chords={chordChartWithNumbers} selectedNumber={selectedNumber} onChange={setSelectedNumber} />
        <TransposeControls onTranspose={handleTranspose} displayTransposition={displayTransposition} />
        <KeyboardDisplay selectedButtons={selectedButtons} selectionOrder={selectionOrder} />
      </div>
      <ClearButton onClick={handleClearAll} />
      {selectedChart && <ChordDisplay chords={displayedChords} selectedNotes={selectedNotes} handleChordToggle={handleChordToggle} />}
    </div>
  );
};

export default ChordChart;
