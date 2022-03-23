import { Constants } from "../Constants";
import { Guess } from "./Guess";
import { addGuessToModel, getDefaultKeyboardModel, KeyboardModel } from "./KeyboardModel";
import { wordleDictionary, wordleSolutions } from "./Words";

export interface GameSettings {
    numGuesses: number;
    showSubstrings: boolean;
    showKeyboardHeatmap: boolean;
}

export interface ModalState {
    settingsOpen: boolean;
    resultsOpen: boolean;
    aboutOpen: boolean;
}

export enum GameStatus {
    START, PLAYING, LOST, WON
}

export function isGameFinished(status: GameStatus) {
    return status === GameStatus.WON || status === GameStatus.LOST;
}

export interface GameState {
    dateHash: number;
    solution: string;
    guesses: string[];
    currentGuess: string[];
    status: GameStatus;
}

export interface AppState {
    game: GameState;
    keyboard: KeyboardModel;
    showWordNotFound: boolean;
    settings: GameSettings;
    modals: ModalState;
    practice: boolean;
}

function hashCode(str: string): number {
    var h: number = 0;
    for (var i = 0; i < str.length; i++) {
        h = 31 * h + str.charCodeAt(i);
    }
    return h & 0xFFFFFFFF
}

function getHashForDate(): number {
    let newDate = new Date();
    let month = newDate.getMonth() + 1;
    let day = newDate.getDate();
    let year = newDate.getFullYear();
  
    let dateString = "" + month + day + year;
    return Math.abs(hashCode(dateString));
}

function getGameStateWithSolution(solutionHash: number): GameState {
    const solution = wordleSolutions[solutionHash % wordleSolutions.length].toUpperCase();

    return {
        dateHash: solutionHash,
        solution: solution,
        guesses: [],
        currentGuess: [],
        status: GameStatus.START
    }
}

export function getDefaultGameState(practice: boolean): GameState {
    const hash = practice ? Math.floor(Math.random() * wordleSolutions.length) : getHashForDate();
    return getGameStateWithSolution(hash);
}

export function getPracticeGameState(practiceIdx: number): GameState {
    return getGameStateWithSolution(practiceIdx);
}

export function getDefaultSettings() {
    // lets default to haxxor mode
    return {
        numGuesses: Constants.maxNumGuesses - 2, 
        showSubstrings: true, 
        showKeyboardHeatmap: true
    };
}

export function cluesUsed(settings: GameSettings): number {
    return [settings.showKeyboardHeatmap, settings.showSubstrings].filter(Boolean).length;
}

export function getDefaultModals() {
    return {
        settingsOpen: false, 
        resultsOpen: false, 
        aboutOpen: false
    };
}

export function getDefaultAppState(): AppState {
    return {
        game: getDefaultGameState(false),
        keyboard: getDefaultKeyboardModel(),
        showWordNotFound: false,
        settings: getDefaultSettings(),
        modals: getDefaultModals(),
        practice: false        
    }
}

export function validateGuess(gameGuess: string): boolean {
    const lowerWord = gameGuess.toLowerCase();
    return wordleSolutions.includes(lowerWord) || wordleDictionary.includes(lowerWord);
}

export const addLetterToGameState = (game: GameState, letter: string): GameState => {
    if (!isGameFinished(game.status) && game.currentGuess.length < Constants.wordLength) {
        return {
            ...game,
            currentGuess: [...game.currentGuess, letter]
        }
    }

    return game;
}

export const removeLetterFromGameState = (game: GameState): GameState => {
    if (game.currentGuess.length > 0) {
        return {
            ...game,
            currentGuess: game.currentGuess.slice(0, game.currentGuess.length - 1)
        }
    }
    return game;
}

const submitGuessToGameState = (game: GameState, guess: string, numGuesses: number): GameState => {
    let status = GameStatus.PLAYING;

    if (guess === game.solution) {
        status = GameStatus.WON;
    }
    else if (game.guesses.length + 1 === numGuesses) {
        status = GameStatus.LOST
    }

    return {
        ...game,
        guesses: [...game.guesses, guess],
        status: status,
        currentGuess: []
    }
}

export const submitGuessToAppState = (appState: AppState): AppState => {
    if (!isGameFinished(appState.game.status) && appState.game.guesses.length < appState.settings.numGuesses) {
        const guessWord = appState.game.currentGuess.join("");
        if (validateGuess(guessWord)) {
            const guess = new Guess(guessWord, appState.game.solution);
            const newGameState = submitGuessToGameState(appState.game, guessWord, appState.settings.numGuesses);

            if (!appState.practice) {
                persistGameState(newGameState);
                console.log("persisted");
            }

            return {
                ...appState,
                game: newGameState,
                keyboard: addGuessToModel(appState.keyboard, guess),
                modals: {
                    ...appState.modals,
                    resultsOpen: isGameFinished(newGameState.status) ? true : appState.modals.resultsOpen
                }
            }
        }
        else {
            return {...appState, showWordNotFound: true};
        }
    }

    return appState;
}

export function getGuesses(game: GameState): Guess[] {
    return game.guesses.map(g => new Guess(g, game.solution));
}

export function persistGameState(game: GameState) {
    console.log(JSON.stringify(game));
    window.localStorage.setItem("game", JSON.stringify(game))
}

export function persistSettingState(settings: GameSettings) {
    window.localStorage.setItem("settings", JSON.stringify(settings))
}

export function markFirstRun() {
    window.localStorage.setItem("firstRun", JSON.stringify(true));
}

export function isFirstRun(): boolean {
    const firstRun = window.localStorage.getItem('firstRun');
    return firstRun == null;
}

export function getPersistentSettingsState(): GameSettings {
    const settingsString = window.localStorage.getItem('settings');
    if (settingsString != null) {
        return JSON.parse(settingsString);
    }
    return getDefaultSettings();
}

export function getPersistentGameState(): GameState {
    const gameString = window.localStorage.getItem('game');
    if (gameString != null) {
        const game: GameState = JSON.parse(gameString);
        if (getHashForDate() === game.dateHash) {
            return game
        }
    }
    return getDefaultGameState(false);
}

export function getSubtitle(cluesEnabled: number) {
    switch (cluesEnabled) {
        case 1: {
            return "coder mode";
        }
        case 2: {
            return "haxxor mode";
        }
        default: {
            return "baby mode";
        }
    }
}