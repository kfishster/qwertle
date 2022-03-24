import { Guess } from "../models/Guess";
import { BoardRow } from "../board/BoardRow";
import { Modal } from './Modal';
import { useState } from "react";
import { cluesUsed, GameSettings, GameState, GameStatus, getGuesses, getSubtitle } from "../models/AppState";

type Props = {
    game: GameState;
    settings: GameSettings;
    practice: boolean;
    closeResult: () => void;
};

function emojiLineFromGuess(guess: Guess) {
    return guess.letters.map(l => {
        if (l.inPosition) {
            return '🟩';
        }
        else if (l.inSolution) {
            return '🟨';
        }
        return '⬛';
    })
}

function daysSinceFHLStart() {
    const startDate = new Date(2022, 2, 21, 0, 0, 0);
    var msSince = new Date().getTime() - startDate.getTime();
    // console.log(msSince, msSince / (1000 * 3600 * 24))
    return Math.ceil(msSince / (1000 * 3600 * 24)); 
}

function createShareMessage(isWinner: boolean, numGuesses: number, cluesUsed: number, guesses: Guess[], practice: boolean, practiceHash: number) {
    const solutionLines = guesses.map(g => emojiLineFromGuess(g).join(""));
    const qwordleNum = daysSinceFHLStart();
    // practice link for practice word
    return [
        `QWERTLE ${practice ? "" : `#${qwordleNum} `}${isWinner ? guesses.length : 'X'}/${numGuesses}${Array.from(Array(cluesUsed).keys()).map(c => '*').join("")}`,
        getSubtitle(cluesUsed), 
        ...solutionLines,
        `https://www.qwertler.com${practice ? `?p=${practiceHash}` : ""}`]
}

export const Result = ({ game, settings, practice, closeResult }: Props) => {
    const [state, setState] = useState({copied: false});
    
    const isWinner = game.status === GameStatus.WON;
    const shareMessage = createShareMessage(isWinner, settings.numGuesses, cluesUsed(settings), getGuesses(game), practice, game.dateHash);

    const copyToClipboard = async () => {
        if ('clipboard' in navigator) {
            await navigator.clipboard.writeText(shareMessage.join('\n'))
                .then(() => setState({copied: true}));
        }
        else {
            document.execCommand('copy', true, shareMessage.join('\n'));
            setState({copied: true});
        }
    }

    return (
        <Modal close={closeResult}>
            <div className="flex flex-col items-center gap-2 w-full">
                <h1 className="text-2xl pb-8">{isWinner ? "GREAT JOB!!" : "BETTER LUCK NEXT TIME"}</h1>
                <h1 className="text-xl pb-8">THE SOLUTION IS</h1>
                <div className="pb-8">
                    <BoardRow smallDemo={true} guess={new Guess(game.solution, game.solution)} showSubstrings={false} gameFinished={true}/>
                </div>
                <div className="flex flex-col items-center pb-4 gap-1">
                    {shareMessage.map((l, i) => <p key={i} className={`${i !== 0 && `h-4`}`}>{l}</p>)}
                </div>
                <button className="rounded-full bg-zinc-800 p-4" onClick={copyToClipboard}>{state.copied ? "Copied!" : "Share"}</button>
            </div>
        </Modal>
    );
};