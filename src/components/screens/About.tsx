import { Guess } from "../models/Guess";
import { BoardRow } from "../board/BoardRow";
import { KeyboardKey } from "../keyboard/KeyboardKey";
import {
  addGuessToModel,
  getDefaultKeyboardModel,
  KeyboardModel,
} from "../models/KeyboardModel";
import { Constants } from "../Constants";
import { Modal } from "./Modal";
import { CodeIcon, AnnotationIcon } from "@heroicons/react/outline";
import { Keyboard } from "../keyboard/Keyboard";

type Props = {
  closeAbout: () => void;
};

type InstructionSectionProps = {
  title: string;
  elementProps: InstructionElementProps[];
};

export const InstructionSection = ({
  title,
  elementProps,
}: InstructionSectionProps) => {
  return (
    <div className="flex flex-col divide-y-2 divide-dashed divide-mainframe-green/80 gap-4">
      <div className="flex flex-col w-full justify-center items-center">
        <h1 className="text-xl font-bold">{title}</h1>
      </div>
      <div className="flex flex-col justify-start items-center gap-4 py-8">
        {elementProps.map((e) => (
          <InstructionElement {...e} />
        ))}
      </div>
    </div>
  );
};

type InstructionElementProps = {
  text?: string;
  guess?: Guess;
  showSubstrings?: boolean;
  keys?: string[][];
  keysWithShade?: string[][];
  keyboardModel?: KeyboardModel;
  solution?: string;
  fullKeyboard?: boolean;
};

export const InstructionElement = ({
  text,
  guess,
  showSubstrings,
  keys,
  keysWithShade,
  keyboardModel,
  solution,
  fullKeyboard,
}: InstructionElementProps) => {
  return (
    <div className="flex justify-center w-full">
      {text && <p>{text}</p>}
      {guess && showSubstrings != null && (
        <div>
          <BoardRow
            smallDemo={true}
            showSubstrings={showSubstrings}
            guess={guess}
            gameFinished={false}
          />
        </div>
      )}
      {keysWithShade && keyboardModel && solution && (
        <div className="flex flex-row gap-1 w-3/4 justify-center ">
          {keysWithShade.map((l) =>
            keyboardKey(keyboardModel, l[0], solution, l[1])
          )}
        </div>
      )}
      {keys && keyboardModel && solution && (
        <div className="flex flex-col gap-1 w-3/4 justify-center">
          {keys.map((row) => (
            <div className="flex flex-row gap-1">
              {row.map((l) => keyboardKey(keyboardModel, l, solution))}
            </div>
          ))}
        </div>
      )}
      {fullKeyboard && keyboardModel && solution && (
        <Keyboard
          model={keyboardModel}
          solution={solution}
          showKeyboardHeatmap={true}
          addLetter={(l: string) => {}}
          removeLetter={() => {}}
          submitGuess={() => {}}
        />
      )}
    </div>
  );
};

function keyboardKey(
  model: KeyboardModel,
  letter: string,
  solution: string,
  shadeOverride?: string
) {
  return (
    <KeyboardKey
      letter={letter}
      solution={solution}
      showKeyboardHeatmap={true}
      isBackspace={false}
      isSubmit={false}
      model={model}
      shadeOverride={shadeOverride}
      onPress={() => {}}
    />
  );
}

export const About = ({ closeAbout }: Props) => {
  var keyboardModel = getDefaultKeyboardModel();
  keyboardModel = addGuessToModel(keyboardModel, new Guess("CHUNK", "BREWS"));

  var advancedKeyboardModel = addGuessToModel(
    keyboardModel,
    new Guess("BRINE", "BREWS")
  );
  return (
    <Modal close={closeAbout}>
      <InstructionSection
        title="What's a QWERTLE"
        elementProps={[
          {
            text: "QWERTY + Wordle, it's Wordle but with a cool QWERTY keyboard layout clue - more on that below",
          },
        ]}
      />

      <InstructionSection
        title="Rules"
        elementProps={[
          {
            text: "You have 6 attempts to guess a five letter word. If you guess a letter that's in the solution, the tile will be highlighted in yellow",
          },
          {
            guess: new Guess("HELLO", "TAUPE"),
            showSubstrings: false,
          },
          {
            text: "If you guess a letter in the solution that is in the right place in the word, it will be highlighted in green!",
          },
          {
            guess: new Guess("BEARS", "PLANE"),
            showSubstrings: false,
          },
          {
            text: "That's it, no further complexity, that's all you need to do....UNLESS YOU'RE READY TO HACK INTO THE MAINFRAME (regardless, I'm turning on haxxor mode right away).",
          },
          {
            text: "haxxor mode comes with two more clues that should guide you to your solution, more on them below",
          },
        ]}
      />
      <InstructionSection
        title="Substrings"
        elementProps={[
          {
            text: 'If you submit a guess that contains some letters in the same order as in the solution, but not in the right place in the guess, these letters will be highlighted with a yellow background. Say you guess the word "CHAIR" but the solution is the word "MATCH", you will see',
          },
          {
            guess: new Guess("CHAIR", "MATCH"),
            showSubstrings: true,
          },
          {
            text: 'This tells you the "CH" is in the solution, but not in the beginning of the word, and also that "A" is in the solution, but not in the right place.',
          },
          {
            text: '"But does it work in reverse, as well?" you might ask, and I might answer - YES! If the order of the letters in reversed order appears in the solution, the highlight between the letters will be blue (the inverse of yellow). Say you\'re trying to guess "MATCH" and you guess "START"',
          },
          {
            guess: new Guess("START", "MATCH"),
            showSubstrings: true,
          },
          {
            text: '"TA" highlighted with blue indicates that the solution contains "AT"',
          },
          {
            text: 'This clue works for substrings of all lengths, such as guessing "WINGS" when the solution is "SWING"',
          },
          {
            guess: new Guess("WINGS", "SWING"),
            showSubstrings: true,
          },
          {
            text: "This should be enough to solve on the next try!",
          },
        ]}
      />
      <InstructionSection
        title="Keyboard Heatmap"
        elementProps={[
          {
            text: "All haxxors own a light up keyboard, that's just a known fact, that's how they are able to pick the right password to break any system. With QWERTLE, the closer the keyboard key is to a letter in the solution, the brighter it will glow. The glow will indicate whether you are one key away (in any direction) to a letter in the solution, 2 keys away, and 3. The x key shows you a key that's pretty far away from a potential answer.",
          },
          {
            keysWithShade: [
              ["1", Constants.keyboardClue1],
              ["2", Constants.keyboardClue2],
              ["3", Constants.keyboardClue3],
              ["x", Constants.usedLetterKey],
            ],
            keyboardModel: keyboardModel,
            solution: "BREWS",
          },
          {
            text: 'Say you are trying to guess the word "BREWS" and you guess "CHUNK". The N and the H on the keyboard are one square away from the letter "B" that\'s in the solution, so they light up pretty bright. "K" and "C" are two away from "B", so they light up, but a bit dimmer.',
          },
          {
            keys: [
              ["F", "G", "H", "J", "K"],
              ["C", "V", "B", "N", "M"],
            ],
            keyboardModel: keyboardModel,
            solution: "BREWS",
          },
          {
            text: 'Your next guess is "BRINE". Now that you\'ve uncovered the "B", the letter "H", "N" and "K" are not close to an uncovered letter in the solution and have no more glow. The "C" is still two keys away from the letter "S", so it stays on!',
          },
          {
            keys: [
              ["F", "G", "H", "J", "K"],
              ["C", "V", "B", "N", "M"],
            ],
            keyboardModel: advancedKeyboardModel,
            solution: "BREWS",
          },
          {
            text: "The glow is not additive - keys will only indicate their proximity to the closest letter in the solution",
          },
        ]}
      />
      <InstructionSection
        title="Modes"
        elementProps={[
          {
            text: 'You\'re obviously a haxxor in training, so I\'m turning on haxxor mode for you right away. If, however, you want more guesses, but don\'t want to use these clues, you are free to turn off the substring clue or the keyboard heatmap and come down to either "coder mode" or "baby mode".',
          },
          {
            text: "The idea here is that additional context clues should make it easier to guess the words, so you need less guesses to get to the answer.",
          },
          {
            text: 'You can also take the practice mode for a spin, using the toggle at the top! If the practice round was tough and you want to torture your friend with it, use the link in the results screen (copy it using the "share" button) and it will throw them into the same practice round so they can suffer to guess something like "PIXIE" or "FUZZY"',
          },
        ]}
      />
      <InstructionSection
        title="Source Code"
        elementProps={[
          {
            text: "This was written during a hackathon, if you want to cringe at my code, feel free to visit the Github link below or add suggestions/bug reports to the repo's issues!",
          },
        ]}
      />
      <div className="flex flex-row gap-4">
        <a
          className="flex flex-row border p-4 gap-3 items-center rounded-full border-mainframe-green"
          href="https://github.com/kfishster/qwertle"
        >
          <p>Github</p>
          <CodeIcon className="w-6 " />
        </a>
        <a
          className="flex flex-row border p-4 gap-3 items-center rounded-full border-mainframe-green"
          href="https://github.com/kfishster/qwertle/issues"
        >
          <p>Issues</p>
          <AnnotationIcon className="w-6 " />
        </a>
      </div>
    </Modal>
  );
};
