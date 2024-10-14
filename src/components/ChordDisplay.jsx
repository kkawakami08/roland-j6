import { Card, CardContent, CardHeader, CardTitle } from "./Card";
import SelectedChordsInfo from "./ScaleBox";
import NoteTags from "./NoteTags";
import { getColorByIndex } from "./ColorUtils"; // Import the color function

const ChordDisplay = ({ chords, selectedNotes, handleChordToggle }) => {
  return (
    <div className="flex flex-col w-full max-w-7xl">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {chords.map((chord, index) => {
          const isSelected = selectedNotes.some((notes) => notes.join(",") === chord.transposedNotes.join(","));

          return (
            <Card key={index} onClick={() => handleChordToggle(chord.transposedNotes, chord.button)} selected={isSelected} bgColor={isSelected ? getColorByIndex(index) : "bg-gray-950"}>
              <CardHeader bgColor={isSelected ? "bg-sky-800" : "bg-sky-950"}>
                <CardTitle>{chord.transposedName || chord.originalName || "Unknown Chord"}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-gray-400">
                  <NoteTags notes={chord.transposedNotes} />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
      <SelectedChordsInfo selectedChords={selectedNotes} />
    </div>
  );
};

export default ChordDisplay;
