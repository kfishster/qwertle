import { GameState, getGuesses } from "./AppState";
import { Guess, LetterGuess } from "./Guess";

export interface KeyboardModel {
    letterGuessMap: Map<string, LetterGuess[]>;
    lettersInPosition: LetterGuess[];
}

export function getDefaultKeyboardModel(): KeyboardModel {
    return {
        letterGuessMap: new Map(),
        lettersInPosition: []
    }
}

export function getKeyboardModelFromGameState(game: GameState): KeyboardModel {
    let keyboard = getDefaultKeyboardModel();
    getGuesses(game).forEach(g => {
        keyboard = addGuessToModel(keyboard, g)
    });
    return keyboard;
}

export function addGuessToModel(model: KeyboardModel, guess: Guess) {
    var newModel = {letterGuessMap: new Map(model.letterGuessMap), lettersInPosition: [...model.lettersInPosition]};

    guess.letters.forEach((letterGuess: LetterGuess) => {
        if (!(newModel.letterGuessMap.has(letterGuess.letter))) {
            newModel.letterGuessMap.set(letterGuess.letter, [])
        }

        newModel.letterGuessMap.get(letterGuess.letter)?.push(letterGuess);
        
        if (letterGuess.inPosition || letterGuess.inSolution) {
            newModel.lettersInPosition.push(letterGuess);
        }
    });

    return newModel;
}