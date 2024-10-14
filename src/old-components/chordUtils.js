import * as Note from "@tonaljs/note";
import * as Chord from "@tonaljs/chord";

export const getChordNotes = (notes, transposition) => {
  const transposedNotes = notes.map((note) => Note.transpose(note, `${transposition}m`));

  console.log(`Transposed Notes: ${transposedNotes}`);

  const derivedChord = Chord.detect(transposedNotes);
  const derivedChordName = derivedChord && derivedChord.length > 0 ? derivedChord[0] : "Unknown Chord";

  console.log(`Detected Chord: ${derivedChordName}`);

  return { transposedNotes, derivedChordName };
};

export const transposeChord = (chordName, transposition) => {
  if (transposition === 1) {
  } else if (transposition === -1) {
  }
  return chordName;
};
