import { Constants } from "../Constants";
import { KeyboardModel } from "../models/KeyboardModel";
import { BackspaceIcon, UploadIcon } from '@heroicons/react/outline';
import { LetterGuess } from "../models/Guess";

type Props = {
    letter: string;
    model: KeyboardModel;
    solution: string;
    isBackspace: boolean;
    isSubmit: boolean;
    showKeyboardHeatmap: boolean;
    shadeOverride?: string;
    onPress: (letter: string) => void;
};

function isInSolution(model: KeyboardModel, letter: string) {
    return model.letterGuessMap.get(letter)?.some((letterGuess: LetterGuess) => letterGuess.inSolution);
}

function isInPosition(model: KeyboardModel, letter: string) {
    return model.letterGuessMap.get(letter)?.some((letterGuess: LetterGuess) => letterGuess.inPosition);
}

function hasBeenGuessed(model: KeyboardModel, letter: string) {
    return model.letterGuessMap.has(letter);
}

function proximityToSolution(model: KeyboardModel, letter: string, solution: string): number {
    var remainingSolution = solution;
    // console.log(remainingSolution, this.lettersInPosition);
    model.lettersInPosition.forEach(l => {
        remainingSolution = remainingSolution.replace(l.letter, "")
    });
    // console.log(remainingSolution, this.lettersInPosition);
    
    const letterCoords = indexOnKeyboard(letter);
    const solutionCoords = remainingSolution.split("").map(l => indexOnKeyboard(l));
    const keyboardDistances = solutionCoords.map(coords => distanceBetweenCoords(coords, letterCoords));

    return Math.min(...keyboardDistances);
}

function distanceBetweenCoords(coord1: number[], coord2: number[]) {
    return Math.pow(Math.abs(coord1[0] - coord2[0]), 2) + Math.pow(Math.abs(coord1[1] - coord2[1]), 2)
}

function indexOnKeyboard(letter: string): number[] {
    const keyboardRows = ["QWERTYUIOP", "ASDFGHJKL", "ZXCVBNM"];
    const rowAdjustments = [-0.5, 0, 1];

    const coords = [0, 0];
    for (var i = 0; i < keyboardRows.length; i++) {
        if (keyboardRows[i].includes(letter)) {
            coords[0] = i;
            coords[1] = keyboardRows[i].indexOf(letter);
            break;
        }
    }

    coords[1] += rowAdjustments[coords[0]];
    return coords;
}

function getLetterBackground(letter: string, model: KeyboardModel, showKeyboardHeatmap: boolean, solution: string, shadeOverride: string | undefined) {
    if (shadeOverride != null) {
        return shadeOverride;
    }
    if (isInPosition(model, letter)) {
        return Constants.inPosition;
    }
    else if (isInSolution(model, letter)) {
        return Constants.inSolution;
    }
    else if (hasBeenGuessed(model, letter)) {
        const distance = proximityToSolution(model, letter, solution);
        console.log(letter, distance);
        if (showKeyboardHeatmap) {
            if (distance <= 1.5) {
                return Constants.keyboardClue1;
            }
            else if (distance <= 4.5) {
                return Constants.keyboardClue2;
            }
            else if (distance <= 9.5) {
                return Constants.keyboardClue3;
            }
        }
        return Constants.usedLetterKey;
    }
    return `${Constants.defaultBackground} hover:${Constants.hoverKey}`;
}

function getLetterColor(letter: string, model: KeyboardModel, solution: string, showKeyboardHeatmap: boolean) {
    if (isInPosition(model, letter) || isInSolution(model, letter)) {
        return Constants.defaultTextColor;
    }
    else if (hasBeenGuessed(model, letter)) {
        const distance = proximityToSolution(model, letter, solution);
        // console.log(letter, distance);
        if (showKeyboardHeatmap) {
            if (distance <= 4.5) {
                return "text-slate-700"
            }
            else if (distance <= 9.5) {
                return "text-slate-800"
            }
        }
        return Constants.defaultTextColor;
    }

    return `${Constants.highlightedTextColor} ${Constants.hoverKey}`;
}


export const KeyboardKey = ({ letter, model, isBackspace, isSubmit, showKeyboardHeatmap, shadeOverride, solution, onPress }: Props) => {
    return (
        <button className="flex flex-1 h-full" onClick={() => onPress(letter)}>
            <div className={`flex flex-1 h-full justify-center items-center basis-1 border-2 font-mono rounded-md border-dashed font-semibold text-xl md:text-2xl ${Constants.borderColor} ${getLetterBackground(letter, model, showKeyboardHeatmap, solution, shadeOverride)} ${getLetterColor(letter, model, solution, showKeyboardHeatmap)}`}>
                { isBackspace 
                    ? <BackspaceIcon className="m-2 md:m-4"/> 
                    : (isSubmit 
                        ? <UploadIcon className="m-2 md:m-4"/> 
                        : <p>{letter}</p>)

                }
                {/* <p>{letter}</p> */}
            </div>
        </button>
    );
};