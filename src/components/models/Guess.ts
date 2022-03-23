export class LetterGuess {
    letter: string;
    inPosition: boolean;
    inSolution: boolean;
    partOfSubstring: boolean;

    constructor(letter: string, inPosition: boolean) {
        this.letter = letter;
        this.inPosition = inPosition;
        this.inSolution = false;
        this.partOfSubstring = false;
    }
}

export class LetterSubstring {
    substring: string;
    idx: number;
    length: number;
    reverse: boolean;

    constructor(guess: string, substring: string, reverse: boolean) {
        this.substring = substring;
        this.idx = guess.indexOf(substring);
        this.length = this.substring.length;
        this.reverse = reverse;
    }
}

export class Guess {
    guess: string;
    letters: LetterGuess[];
    substrings: LetterSubstring[];
    reverseSubstrings: LetterSubstring[];
    substringsByIndex: Map<number, LetterSubstring>;

    constructor(guess: string, solution: string) {
        this.guess = guess;
        this.substrings = this.findLargestSubstring(guess, solution).map(sub => new LetterSubstring(guess, sub, false));

        let reverseSolution = solution.split("").reverse().join("");
        this.reverseSubstrings = this.findLargestSubstring(guess, reverseSolution).map(sub => new LetterSubstring(guess, sub, true));
        this.substringsByIndex = new Map();

        const substringLetterIdxs: number[] = [];

        // set reverse first so that normal substring overrides if it exists at the same index
        this.reverseSubstrings.forEach(sub => {
            Array.from(Array(sub.length).keys()).map(j => substringLetterIdxs.push(sub.idx + j));
            this.substringsByIndex.set(sub.idx, sub)
        });

        this.substrings.forEach(sub => {
            Array.from(Array(sub.length).keys()).map(j => substringLetterIdxs.push(sub.idx + j));
            this.substringsByIndex.set(sub.idx, sub)
        });

        this.letters = this.getLetterGuesses(guess, solution, substringLetterIdxs);
    }

    getLetterGuesses(guess: string, solution: string, substringLetterIdxs: number[]): LetterGuess[] {
        var remainingSolution = solution;
        const letters = guess.split("").map((letter, i) => {
            const inPosition = letter === solution[i];
            if (inPosition) {
                remainingSolution = remainingSolution.replace(letter, "");
            }
            return new LetterGuess(letter, inPosition)
        });

        // preferable to highlight yellows in substring if there are other occurences
        substringLetterIdxs.forEach(substringLetterIdx => {
            const letter = letters[substringLetterIdx];
            if (!letter.inPosition) {
                if (remainingSolution.includes(letter.letter)) {
                    letter.inSolution = true;
                    remainingSolution = remainingSolution.replace(letter.letter, "");
                }
            }            
        });

        letters.forEach(letter => {
            if (!letter.inPosition) {
                if (remainingSolution.includes(letter.letter)) {
                    letter.inSolution = true;
                    remainingSolution = remainingSolution.replace(letter.letter, "");
                }
            }
        })

        return letters;
    }

    public findLargestSubstring(guess: string, solution: string): string[] {
        return this.findLargestSubstringRec(guess, solution, []);
    }

    public findLargestSubstringRec(guess: string, solution: string, substringsChecked: string[]): string[] {
        if (guess.length < 2 || substringsChecked.includes(guess)) {
            return []
        }

        substringsChecked.push(guess);
        // console.log(guess);
        
        const endSubs = this.findLargestSubstringRec(guess.substring(0, guess.length - 1), solution, substringsChecked);
        const startSubs = this.findLargestSubstringRec(guess.substring(1, guess.length), solution, substringsChecked);

        if (solution.includes(guess)) {
            return [guess];
        }
        else {
            return [...endSubs,...startSubs];
        }

    }
}