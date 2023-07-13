import { useEffect, useState } from "react";
import { nanoid } from "nanoid";
import Confetti from "react-confetti";
import Dice from "./components/Dice";

export default function App() {
  const [dice, setDice] = useState(allNewDice());
  const [numberOfRolls, setNumberOfRolls] = useState(0);
  const [time, setTime] = useState({ minutes: 0, seconds: 0 });
  const [tenzies, setTenzies] = useState(false);
  const [bestRolls, setBestRolls] = useState(
    localStorage.getItem("bestRolls") || 0
  );
  const [bestTime, setBestTime] = useState(
    JSON.parse(localStorage.getItem("bestTime")) || { minutes: 0, seconds: 0 }
  );
  const [timeoutId, setTimeoutId] = useState(null);
  const [gameStarted, setGameStarted] = useState(false);

  function generateNewDie() {
    return {
      id: nanoid(),
      value: Math.ceil(Math.random() * 6),
      isHeld: false,
    };
  }

  function allNewDice() {
    const newDice = [];
    for (let i = 0; i < 10; i++) {
      newDice.push(generateNewDie());
    }

    return newDice;
  }

  useEffect(() => {
    if (gameStarted) {
      const newTimeoutId = setTimeout(() => {
        setTime((prevTime) => {
          const seconds = prevTime.seconds === 59 ? 0 : prevTime.seconds + 1;
          const minutes =
            seconds === 0 ? prevTime.minutes + 1 : prevTime.minutes;
          return { minutes, seconds };
        });
      }, 1000);

      setTimeoutId(newTimeoutId);

      return () => clearTimeout(newTimeoutId);
    }
  }, [gameStarted, time]);

  const setBestTimeUtility = () => {
    setBestTime(time);
    localStorage.setItem("bestTime", JSON.stringify(time));
  };

  const isBetterTime = (timeA, timeB) => {
    if (timeA.minutes < timeB.minutes) {
      return true;
    } else if (
      timeA.minutes === timeB.minutes &&
      timeA.seconds < timeB.seconds
    ) {
      return true;
    }
    return false;
  };

  useEffect(() => {
    if (dice.every((die) => die.isHeld && die.value === dice[0].value)) {
      setTenzies(true);
      clearTimeout(timeoutId);
      setGameStarted(false);
      if (bestRolls === 0 || numberOfRolls < bestRolls) {
        setBestRolls(numberOfRolls);
        localStorage.setItem("bestRolls", numberOfRolls);
      }

      if (
        (bestTime.minutes === 0 && bestTime.seconds === 0) ||
        isBetterTime(time, bestTime)
      ) {
        setBestTimeUtility();
      }
    }
  }, [dice, timeoutId]);

  const rollDice = () => {
    setDice((prevDice) =>
      prevDice.map((die) => (die.isHeld ? die : generateNewDie()))
    );
    setNumberOfRolls((prevNumberOfRolls) => prevNumberOfRolls + 1);
    if (!gameStarted) {
      setGameStarted(true);
    }
  };

  const holdDice = (diceId) => {
    setDice((prevDice) =>
      prevDice.map((die) =>
        die.id === diceId ? { ...die, isHeld: !die.isHeld } : die
      )
    );
    if (!gameStarted) {
      setGameStarted(true);
    }
  };

  const diceElements = dice.map((die) => {
    return (
      <Dice
        key={die.id}
        value={die.value}
        isHeld={die.isHeld}
        holdDice={() => holdDice(die.id)}
      />
    );
  });

  const newGame = () => {
    setNumberOfRolls(0);
    setTime({ minutes: 0, seconds: 0 });
    setDice(allNewDice());
    setTenzies(false);
  };

  return (
    <main className="App flex">
      {tenzies && <Confetti />}
      <h1 className="title">Tenzies</h1>
      <p className="instructions">
        Roll until all dice are the same. Click each die to freeze it at its
        current value between rolls.
      </p>

      <div className="dice">{diceElements}</div>
      <div className="current-record">
        <p className="current-rolls">Rolls: {numberOfRolls}</p>
        <p className="current-time">
          Time: {time.minutes < 10 ? `0${time.minutes}` : time.minutes}:
          {time.seconds < 10 ? `0${time.seconds}` : time.seconds}
        </p>
      </div>
      <div className="best-record flex">
        <p>Best Rolls: {bestRolls}</p>
        <p>
          Best Time:{" "}
          {bestTime.minutes < 10 ? `0${bestTime.minutes}` : bestTime.minutes}:
          {bestTime.seconds < 10 ? `0${bestTime.seconds}` : bestTime.seconds}
        </p>
      </div>
      <button className="roll-dice" onClick={tenzies ? newGame : rollDice}>
        {tenzies ? "New Game" : "Roll"}
      </button>
    </main>
  );
}
