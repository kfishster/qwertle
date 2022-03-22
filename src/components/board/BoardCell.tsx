import { Constants } from "../Constants";
import { LetterGuess } from "../models/Guess";

type Props = {
    letterGuess?: LetterGuess;
    currentGuessLetter?: string;
    cursor?: boolean;
    smallDemo?: boolean;
};

function getLetterBackground(letterGuess: LetterGuess | undefined) {
    if (letterGuess == null) {
        return Constants.defaultBackground;
    }
    else if (letterGuess.inPosition) {
        return Constants.inPosition;
    }
    else if (letterGuess.inSolution) {
        return Constants.inSolution;
    }
    return Constants.usedLetterBoard;
}

function getLetterColor(letterGuess: LetterGuess | undefined, currentGuessLetter: string | undefined) {
    if (currentGuessLetter != null) {
        return Constants.highlightedTextColor;
    }
    return Constants.defaultTextColor;
}

export const BoardCell = ({ letterGuess, currentGuessLetter, cursor, smallDemo }: Props) => {
    // console.log(smallDemo);
    return (
        <div className={`flex ${letterGuess && "transition-color ease-out duration-1000"} justify-center items-center box-border ${smallDemo ? "h-8 w-8 border-1 text-xl" : "h-16 w-16 border-2 text-3xl"} font-mono border-dashed rounded-sm font-semibold ${Constants.borderColor} ${getLetterBackground(letterGuess)} ${getLetterColor(letterGuess, currentGuessLetter)}`}>
            {cursor
                ? <p className={`${Constants.highlightedTextColor} animate-cursor`}>|</p>
                : <p>{letterGuess == null ? currentGuessLetter : letterGuess.letter}</p>
            }   
         </div>
    );
};