import { Constants } from "../Constants";
import { LetterGuess } from "../models/Guess";

type Props = {
    letterGuess?: LetterGuess;
    currentGuessLetter?: string;
    cursor?: boolean;
    smallDemo?: boolean;
    insideSubstring?: boolean;
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

export const BoardCell = ({ insideSubstring, letterGuess, currentGuessLetter, cursor, smallDemo }: Props) => {
    // console.log(smallDemo);
    return (
        // <div className={`flex ${letterGuess && "transition-all ease-out duration-1000"} justify-center items-center box-border ${smallDemo ? "h-8 w-8 border-1 text-xl" : "h-14 w-14 md:h-16 md:w-16 lg:h-20 lg:w-20 border-2 text-2xl md:text-3xl lg:text-4xl"} font-mono border-dashed rounded-sm font-semibold ${Constants.borderColor} ${getLetterBackground(letterGuess)} ${getLetterColor(letterGuess, currentGuessLetter)}`}></div>
        <div className={`flex ${letterGuess && !insideSubstring ? "grow-[.2]" : "flex-1" } aspect-square ${letterGuess && "transition-colors ease-out duration-1000"} justify-center items-center box-border ${smallDemo ? "h-8 w-8 border-2 text-xl" : "border-2 text-2xl md:text-3xl lg:text-4xl"} font-mono border-dashed rounded-sm font-semibold ${Constants.borderColor} ${getLetterBackground(letterGuess)} ${getLetterColor(letterGuess, currentGuessLetter)}`}>
            {cursor
                ? <p className={`${Constants.highlightedTextColor} animate-cursor`}>|</p>
                : <p>{letterGuess == null ? currentGuessLetter : letterGuess.letter}</p>
            }   
         </div>
    );
};