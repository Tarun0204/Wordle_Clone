import React, { Component } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Confetti from "react-confetti";
import "./index.css";

const WORD_LIST = ["KEDAR", "RAHUL", "TARUN", "APPLE", "PEACH"];
const TARGET_WORD = WORD_LIST[Math.floor(Math.random() * WORD_LIST.length)];

class WordsGame extends Component {
  state = {
    guesses: [],
    input: "",
    gameOver: false,
    win: false,
    darkMode: false,
    windowWidth: window.innerWidth,
    windowHeight: window.innerHeight,
  };

  componentDidMount() {
    window.addEventListener("resize", this.updateWindowSize);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateWindowSize);
  }

  updateWindowSize = () => {
    this.setState({ windowWidth: window.innerWidth, windowHeight: window.innerHeight });
  };

  getFeedback = (guess, word) => {
    return guess.split("").map((char, index) => {
      if (char === word[index]) return "correct";
      if (word.includes(char)) return "present";
      return "absent";
    });
  };

  handleInputChange = (event) => {
    this.setState({ input: event.target.value.toUpperCase() });
  };

  handleSubmit = (event) => {
    event.preventDefault();
    const { input, guesses, gameOver } = this.state;

    if (input.length < 5) {
      toast.error("Word is too short! Enter exactly 5 letters.");
      return;
    }
    if (input.length > 5) {
      toast.error("Word is too long! Enter exactly 5 letters.");
      return;
    }
    if (gameOver) return;

    const feedback = this.getFeedback(input, TARGET_WORD);
    const newGuesses = [...guesses, { word: input, feedback }];

    this.setState({
      guesses: newGuesses,
      input: "",
      win: input === TARGET_WORD,
      gameOver: newGuesses.length >= 6 || input === TARGET_WORD,
    });
  };

  handleReset = () => {
    this.setState((prevState) => ({
      guesses: [],
      input: "",
      gameOver: false,
      win: false,
      darkMode: prevState.darkMode,
    }));
  };

  toggleDarkMode = () => {
    this.setState((prevState) => {
      const newDarkMode = !prevState.darkMode;
      document.body.classList.toggle("dark", newDarkMode);
      return { darkMode: newDarkMode };
    });
  };

  render() {
    const { guesses, input, gameOver, win, darkMode, windowWidth, windowHeight } = this.state;

    return (
      <div className={`game-container ${darkMode ? "dark" : ""}`}>
        <ToastContainer position="top-right" autoClose={2000} />

        {win && <Confetti width={windowWidth} height={windowHeight} />}

        <button className="dark-mode-btn" onClick={this.toggleDarkMode}>
          <img
            className="logo"
            src={
              darkMode
                ? "https://cdn-icons-png.flaticon.com/512/7025/7025299.png"
                : "https://cdn.iconscout.com/icon/free/png-256/free-light-mode-icon-download-in-svg-png-gif-file-formats--bright-ui-user-interface-pack-network-communication-icons-3856596.png"
            }
            alt="Toggle Theme"
          />
        </button>

        <h1 className="main-heading">Wordle Clone</h1>

        <div className="game-rules">
          <h2 className="side-heading">Game Rules</h2>
          <ul className="game-rules-list">
            <li className="rules-list">Guess a 5-letter word.</li>
            <li className="rules-list">
              You have 6 attempts to guess the correct word.
            </li>
            <li className="rules-list">
              Green - Correct letter in the right place.
            </li>
            <li className="rules-list">
              Orange - Letter is present but in the wrong place.
            </li>
            <li className="rules-list">Gray - Letter is not in the word.</li>
          </ul>
        </div>

        {!gameOver && (
          <form onSubmit={this.handleSubmit} className="input-form">
            <input
              type="text"
              value={input}
              maxLength="5"
              onChange={this.handleInputChange}
              placeholder="Enter 5-letter word"
              className="input"
            />
            <button type="submit" className="submit-btn">
              Submit
            </button>
          </form>
        )}

        <div className="grid">
          {guesses.map((g, i) => (
            <div key={i} className="row">
              {g.word.split("").map((char, j) => (
                <span key={j} className={`letter ${g.feedback[j]}`}>
                  {char}
                </span>
              ))}
            </div>
          ))}
        </div>

        {gameOver && (
          <div className="game-status">
            {win ? (
              <p className="win-para">🎉 You Win! The word is {TARGET_WORD}</p>
            ) : (
              <p className="loose-para">
                ❌ Game Over! The word is {TARGET_WORD}
              </p>
            )}
            <button onClick={this.handleReset} className="new-game-btn">
              New Game
            </button>
          </div>
        )}
      </div>
    );
  }
}

export default WordsGame;
