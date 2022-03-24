import {
  GameSettings,
  GameState,
  getGuesses,
  isGameFinished,
} from "../models/AppState";
import { BoardRow } from "./BoardRow";

type Props = {
  game: GameState;
  settings: GameSettings;
  showWordNotFound: boolean;
  finishedAnimation: () => void;
};

export const Board = ({
  game,
  settings,
  showWordNotFound,
  finishedAnimation,
}: Props) => {
  const gameFinished = isGameFinished(game.status);
  const guesses = getGuesses(game);

  return (
    <div className={`flex flex-col justify-center gap-2 w-full px-8`}>
      {Array.from(Array(settings.numGuesses).keys()).map((i) => {
        if (i < game.guesses.length) {
          return (
            <BoardRow
              key={i}
              showSubstrings={settings.showSubstrings}
              gameFinished={gameFinished}
              guess={guesses[i]}
            />
          );
        } else if (i === game.guesses.length) {
          return (
            <BoardRow
              key={i}
              showSubstrings={settings.showSubstrings}
              gameFinished={gameFinished}
              currentGuess={game.currentGuess}
              showWordNotFound={showWordNotFound}
              finishedAnimation={finishedAnimation}
            />
          );
        } else {
          return (
            <BoardRow
              key={i}
              showSubstrings={settings.showSubstrings}
              gameFinished={gameFinished}
            />
          );
        }
      })}
    </div>
  );
};
