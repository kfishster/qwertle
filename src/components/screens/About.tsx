import { Guess } from "../models/Guess";
import { BoardRow } from "../board/BoardRow";
import { KeyboardKey } from "../keyboard/KeyboardKey";
import { addGuessToModel, getDefaultKeyboardModel, KeyboardModel } from "../models/KeyboardModel";
import { Constants } from "../Constants";
import { Modal } from './Modal';

type Props = {
    closeAbout: () => void;
};

type SectionHeaderProps = {
    title: string;
};

export const SectionHeader = ({ title }: SectionHeaderProps) => {
    return (
        <div className="flex flex-col w-full justify-center items-center">
            <h1 className="text-xl">{title}</h1>
            <div className="h-1 w-full bg-mainframe-green m-4"></div>
        </div>
    )
}

type InstructionSectionProps = {
    title: string;
    elementProps: InstructionElementProps[];
};

export const InstructionSection = ({ title, elementProps }: InstructionSectionProps) => {
    return (
        <div className="flex flex-col">
            <SectionHeader title={title} />
            <div className="flex flex-col justify-start items-center gap-2 pb-8">
                {elementProps.map(e => <InstructionElement {...e}/>)}
            </div>
        </div>
    )
}

type InstructionElementProps = {
    text?: string;
    guess?: Guess;
    showSubstrings?: boolean;
    keys?: string[][];
    keysWithShade?: string[][];
    keyboardModel?: KeyboardModel;
    solution?: string;
};

export const InstructionElement = ({ text, guess, showSubstrings, keys, keysWithShade, keyboardModel, solution }: InstructionElementProps) => {
    
    return (
        <div className="flex justify-center w-full">
            {text && <p>{text}</p>}
            {guess && showSubstrings != null && <div><BoardRow smallDemo={true} showSubstrings={showSubstrings} guess={guess} gameFinished={false}/></div>}
            {keysWithShade && keyboardModel && solution &&
                <div className="flex flex-row gap-1 w-3/4 justify-center ">{keysWithShade.map(l => keyboardKey(keyboardModel, l[0], solution, l[1]))
                }
            </div>}
            {keys && keyboardModel && solution &&
                <div className="flex flex-col gap-1 w-3/4 justify-center">
                    {
                        keys.map(row => <div className="flex flex-row gap-1">
                            {row.map(l => keyboardKey(keyboardModel, l, solution))}
                        </div>)
                    }
                </div>
            }
        </div>
    )
}

function keyboardKey(model: KeyboardModel, letter: string, solution: string, shadeOverride?: string) {
    return <KeyboardKey 
        letter={letter} 
        solution={solution}
        showKeyboardHeatmap={true} 
        isBackspace={false} 
        isSubmit={false} 
        model={model} 
        shadeOverride={shadeOverride}
        onPress={() => {}
    }/>
}

export const About = ({ closeAbout }: Props) => {
    var keyboardModel = getDefaultKeyboardModel();
    keyboardModel = addGuessToModel(keyboardModel, new Guess("CHUNK", "BREWS"))
    
    var advancedKeyboardModel = addGuessToModel(keyboardModel, new Guess("BRINE", "BREWS"))
    return (
        <Modal close={closeAbout}>
            <InstructionSection
                title="About QWORDLE"
                elementProps={[
                    {
                        text: "QWORDLE follows usual Wordle rules, once you guess a five letter word, if a letter is in the word but in the wrong position, it will be highlighted as yellow."
                    }, 
                    {
                        guess: new Guess("HELLO", "TAUPE"), showSubstrings: false
                    },
                    {
                        text: "If it is in the word and in the correct position, it will be green."
                    }, 
                    {
                        guess: new Guess("BEARS", "PLANE"), showSubstrings: false
                    },
                    {
                        text: "The fun starts when you add some QWORDLE magic. In the settings (top right gear), you'll see two more clues you can use to guess your word, substrings and keyboard heatmap"
                    },
                    {
                        text: "Each clue adds more contextual information to the board, but removes one possible guess!"
                    },
                ]}
            />
            <InstructionSection
                title="Substrings"
                elementProps={[
                    {
                        text: "The substrings clue will tell you whether you've gotten some letters in the right order, but not in the right position in the word. For example, if you're guessing the word \"MACHO\" and you guess"
                    }, 
                    {
                        guess: new Guess("CHAIR", "MACHO"), showSubstrings: true
                    },
                    {
                        text: "You will see that the CH pair is connected meaning you will find the letters \"CH\" in the solution next to each other, but they're currently not in their correct spot. This works with more than 2 letters as well, such as guessing"
                    }, 
                    {
                        guess: new Guess("WINGS", "SWING"), showSubstrings: true
                    },
                    {
                        text: "when the solution is SWING"
                    }
                ]}
            />
            <InstructionSection
                title="Keyboard Heatmap"
                elementProps={[
                    {
                        text: "The keyboard heatmap lets you know how close your guess is to the right letters in the QWERTY keyboard. The closer the letter you guessed is to any letter in the solution, the stronger the key will glow. The glow comes in three steps indicating proximity, 1, 2, or 3 keys away in any direction. The x indicates a key that's been used but is not close to a letter in the solution."
                    }, 
                    {
                        keysWithShade: [["1", Constants.keyboardClue1], ["2", Constants.keyboardClue2], ["3", Constants.keyboardClue3], ["x", Constants.usedLetterKey]], 
                        keyboardModel: keyboardModel,
                        solution: "BREWS"
                    },
                    {
                        text: "If you're guessing the word \"BREWS\" and submit a guess \"CHUNK\", the N and the H are one square away from a letter in the solution (N), while C is two letters away, and K is slightly more than 2"
                    }, 
                    {
                        keys: [["F", "G", "H", "J", "K"], ["C", "V", "B", "N", "M"]], 
                        keyboardModel: keyboardModel,
                        solution: "BREWS"
                    },
                    {
                        text: "If you guess \"BRINE\", you've successfully found the B, so H, N, and K are not near another letter in the solution anymore. C, however, is close to S, so it indicates that there is another letter from the solution somewhere nearby"
                    }, 
                    {
                        keys: [["F", "G", "H", "J", "K"], ["C", "V", "B", "N", "M"]], 
                        keyboardModel: advancedKeyboardModel,
                        solution: "BREWS"
                    }
                ]}
            />
        </Modal>
    );
};