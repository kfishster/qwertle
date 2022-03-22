import { KeyboardKey } from "./KeyboardKey";
import { KeyboardModel } from "../models/KeyboardModel";

type Props = {
    model: KeyboardModel;
    solution: string;
    showKeyboardHeatmap: boolean;
    addLetter: (letter: string) => void;
    removeLetter: () => void;
    submitGuess: () => void;
};

export function getKeyboardRow(row: string, rowNum: number, props: Props) {
    return (
        <div key={rowNum} className="flex items-center justify-center gap-1 h-full">
            {row.split('').map((letter, i) => {
                if (letter === "-") {
                    // submit button
                    return <KeyboardKey key={i} letter="" solution={props.solution} showKeyboardHeatmap={props.showKeyboardHeatmap} isBackspace={false} isSubmit={true} model={props.model} onPress={props.submitGuess}/>
                }
                else if (letter === "<") {
                    // backspace button
                    return <KeyboardKey key={i} letter="" solution={props.solution} showKeyboardHeatmap={props.showKeyboardHeatmap} isBackspace={true} isSubmit={false} model={props.model} onPress={props.removeLetter}/>
                }
                else {
                    return <KeyboardKey key={i} letter={letter} solution={props.solution} showKeyboardHeatmap={props.showKeyboardHeatmap} isBackspace={false} isSubmit={false} model={props.model} onPress={props.addLetter}/>
                }
            })}
        </div>
    )
}

export const Keyboard = (props: Props) => {
    const keyboardRows = ["QWERTYUIOP", "ASDFGHJKL", "-ZXCVBNM<"];
    
    return (
        <div className="flex flex-col gap-1 w-full md:w-3/4 px-4 h-full justify-items-stretch">
            {keyboardRows.map((row, i) => getKeyboardRow(row, i, props))}
        </div>
    );
};