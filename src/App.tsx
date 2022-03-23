import React from 'react';
import './App.css';
import { Toolbar } from './components/Toolbar';
import { Board } from './components/board/Board';
import { Keyboard } from './components/keyboard/Keyboard';
import { Guess } from './components/models/Guess';
import { addGuessToModel, getDefaultKeyboardModel, getKeyboardModelFromGameState } from './components/models/KeyboardModel';
import { addLetterToGameState, AppState, cluesUsed, GameStatus, getDefaultAppState, getDefaultGameState, getPersistentGameState, getPersistentSettingsState, getPracticeGameState, isFirstRun, isGameFinished, markFirstRun, persistSettingState, removeLetterFromGameState, submitGuessToAppState } from './components/models/AppState';
import { Settings } from './components/screens/Settings';
import { Result } from './components/screens/Result';
import { About } from './components/screens/About';
import Div100vh from 'react-div-100vh';


function getAppState(): AppState {
  const game = getPersistentGameState();
  const settings = getPersistentSettingsState();
  const appState = getDefaultAppState();

  appState.game = game;
  appState.settings = settings;
  appState.keyboard = getKeyboardModelFromGameState(game);

  return appState;
}

function getExampleState(): AppState {
  const solution = "FASTS";
  const appState = getDefaultAppState(); 

  appState.settings.showKeyboardHeatmap = true;
  appState.settings.showSubstrings = true;
  appState.settings.numGuesses = 4;

  // appState.modals.aboutOpen = true;

  const guesses = ["STOCK"];
  guesses.forEach(g => {
    const guess = new Guess(g, solution);
    appState.game.guesses.push(g);
    appState.keyboard = addGuessToModel(appState.keyboard, guess);
  })

  appState.game.solution = solution;
  // appState.game.currentGuess = ["B", "L", "A", "M"];
  appState.game.status = GameStatus.PLAYING;
  appState.practice = true;

  return appState;
}


// function getAlarmExample(): AppState {
//   const solution = "ALARM";
//   const appState = getDefaultAppState(); 

//   // appState.settings.showKeyboardHeatmap = true;
//   // appState.settings.showSubstrings = true;
//   // appState.settings.numGuesses = 4;

//   // // appState.modals.resultsOpen = true;

//   // const guesses = ["SHEAR"];
//   // guesses.forEach(g => {
//   //   const guess = new Guess(g, solution);
//   //   appState.game.guesses.push(guess);
//   //   appState.keyboard = addGuessToModel(appState.keyboard, guess);
//   // })

//   appState.game.solution = solution;
//   appState.practice = true;

//   // appState.game.currentGuess = ["A", "R", "M", "E", "D"];
//   // appState.game.status = GameStatus.WON;

//   return appState;
// }

// function getSuiteExample(): AppState {
//   const solution = "SUITE";
//   const appState = getDefaultAppState(); 

//   // appState.settings.showKeyboardHeatmap = true;
//   // appState.settings.showSubstrings = true;
//   // appState.settings.numGuesses = 4;

//   appState.modals.aboutOpen = true;

//   // const guesses = ["SHEAR"];
//   // guesses.forEach(g => {
//   //   const guess = new Guess(g, solution);
//   //   appState.game.guesses.push(guess);
//   //   appState.keyboard = addGuessToModel(appState.keyboard, guess);
//   // })

//   appState.game.solution = solution;
//   appState.practice = false;

//   // appState.game.currentGuess = ["A", "R", "M", "E", "D"];
//   // appState.game.status = GameStatus.WON;

//   return appState;
// }

async function sendStartedAnalytics(practice: boolean) {
 await fetch(`/api/usage?started=1&practice=${practice ? "1" : "0"}`);
}

async function sendFinishedGameAnalytics(practice: boolean, substringsOn: boolean, heatmapOn: boolean) {
  await fetch(`/api/usage?finished=1&practice=${practice ? "1" : "0"}&substrings=${substringsOn ? "1" : "0"}&heatmap=${heatmapOn ? "1" : "0"}`);
 }

const showExampleGame = false;

function getPracticeRound(): number | undefined {
  let search = window.location.search;
  let params = new URLSearchParams(search);
  let practiceIdx = params.get('p');

  if (practiceIdx != null) {
    let number = Number(params.get('p'));
    if (!isNaN(number)) {
      return number;
    }
  }
}

class App extends React.Component<{}, AppState> {
  constructor(props: any) {
    super(props);
    const state = showExampleGame ? getExampleState() : getAppState();
    const practiceIdx = getPracticeRound();

    if (practiceIdx != null) {
      state.practice = true;
      state.game = getPracticeGameState(practiceIdx);
      state.keyboard = getDefaultKeyboardModel();
    }

    if (isFirstRun()) {
      state.modals.aboutOpen = true;
    }

    this.state = state;
  }

  render() {
    const model = this.state;
    const firstRun = isFirstRun();

    getPracticeRound();

    const addLetter = (letter: string) => {
      this.setState({game: addLetterToGameState(model.game, letter)})
    }
  
    const removeLetter = () => {
      this.setState({game: removeLetterFromGameState(model.game)})
    }
  
    const submit = () => {
      const newGameState = submitGuessToAppState(model);
      if (model.game.status === GameStatus.START && newGameState.game.status === GameStatus.PLAYING) {
        sendStartedAnalytics(newGameState.practice);
      }
      if (isGameFinished(newGameState.game.status)) {
        sendFinishedGameAnalytics(newGameState.practice, newGameState.settings.showSubstrings, newGameState.settings.showKeyboardHeatmap);
      }
      this.setState(submitGuessToAppState(model))
    };
  
    const finishedWrongWordAnimation = () => {
      this.setState({...model, showWordNotFound: false});
    };
  
    const toggleShowSubstrings = () => {
      var numGuesses = model.settings.numGuesses;

      if (model.settings.showSubstrings) {
        numGuesses++;
      }
      else {
        numGuesses--;
      }

      const newSettings = {...model.settings, numGuesses: numGuesses, showSubstrings: !model.settings.showSubstrings};
      this.setState({...model, settings: newSettings});
      persistSettingState(newSettings);
    };
  
    const toggleKeyboardHeatmap = () => {
      var numGuesses = model.settings.numGuesses;

      if (model.settings.showKeyboardHeatmap) {
        numGuesses++;
      }
      else {
        numGuesses--;
      }

      const newSettings = {...model.settings, numGuesses: numGuesses, showKeyboardHeatmap: !model.settings.showKeyboardHeatmap};
      this.setState({...model, settings: newSettings});
      persistSettingState(newSettings);
    };
  
    const closeSettings = () => {
      this.setState({...model, modals: {...model.modals, settingsOpen: false}});
    }
  
    const openSettings = () => {
      this.setState({...model, modals: {...model.modals, settingsOpen: true}});
    }

    const openResult = () => {
      this.setState({...model, modals: {...model.modals, resultsOpen: true}});
      
    }
    const closeResult = () => {
      this.setState({...model, modals: {...model.modals, resultsOpen: false}});
    }

    const openAbout = () => {
      this.setState({...model, modals: {...model.modals, aboutOpen: true}});
    }

    const closeAbout = () => {
      if (firstRun) {
        markFirstRun();
      }
      this.setState({...model, modals: {...model.modals, aboutOpen: false}});
    }

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {      
      if (event.code.startsWith("Key")) {
        addLetter(event.code.slice(event.code.length - 1, event.code.length));
      }
      else if (event.code === "Backspace") {
        removeLetter();
      }
      else if (event.code === "Enter") {
        submit();
      }
    }  

    const togglePractice = () => {
      if (!model.practice) {
        this.setState({
          game: getDefaultGameState(!model.practice),
          keyboard: getDefaultKeyboardModel(),
          practice: !model.practice
        });
      } else {
        this.setState(getAppState());
      }
    }

    const resetPractice = () => {
      if (model.practice) {
        this.setState({
          game: getDefaultGameState(true),
          keyboard: getDefaultKeyboardModel(),
          practice: true
        });
      }
    }

    const overlayOpen = model.modals.resultsOpen || model.modals.settingsOpen || model.modals.aboutOpen;
    const cluesUsedInGame = cluesUsed(model.settings);

    return (
      <Div100vh>
        <div className="flex h-full flex-col bg-zinc-800" onKeyDown={handleKeyDown} tabIndex={0}>
          {/* toolbar */}
          <div className={`flex flex-col h-full pb-4 pt-4 items-center justify-between gap-6 transition-all ${overlayOpen ? "blur-lg" : ""}`}>
            <div className="flex w-full md:w-3/5 lg:w-2/5">
              <Toolbar 
                gameFinished={isGameFinished(model.game.status)}
                cluesEnabled={cluesUsedInGame} 
                openResults={openResult} 
                openAbout={openAbout} 
                finishedAnimation={finishedWrongWordAnimation} 
                openSettings={openSettings}
                practice={model.practice}
                togglePractice={togglePractice} 
                refreshPractice={resetPractice}/>
            </div>
            {/* board */}
            <div className="flex flex-none w-full md:w-3/5 lg:w-2/5 justify-center">
              <Board 
                game={model.game}
                settings={model.settings}
                showWordNotFound={model.showWordNotFound}
                finishedAnimation={finishedWrongWordAnimation}/>
            </div>
            {/* keyboard */}
            <div className="flex  w-full md:w-4/5 lg:w-3/5 justify-center h-1/4">
              <Keyboard 
                model={model.keyboard}
                solution={model.game.solution}
                showKeyboardHeatmap={model.settings.showKeyboardHeatmap} 
                addLetter={addLetter} 
                removeLetter={removeLetter} 
                submitGuess={submit}
              />
            </div>
          </div>
          {/* <div className={`${model.settings.isSettingsOpen ? "opacity-100" : "opacity-0"} transition-opacity duration-700 absolute h-full w-full flex justify-center items-center`}><Settings settings={model.settings} toggleShowSubstrings={toggleShowSubstrings} toggleKeyboardHeatmap={toggleKeyboardHeatmap} closeSettings={closeSettings}/></div> */}
          {model.modals.settingsOpen && <Settings settings={model.settings} status={model.game.status} toggleShowSubstrings={toggleShowSubstrings} toggleKeyboardHeatmap={toggleKeyboardHeatmap} closeSettings={closeSettings}/>}
          {model.modals.resultsOpen && <Result game={model.game} practice={model.practice} settings={model.settings} closeResult={closeResult}/>}
          {model.modals.aboutOpen && <About closeAbout={closeAbout}/>}
        </div>
      </Div100vh>
    );
  }
}

export default App;
