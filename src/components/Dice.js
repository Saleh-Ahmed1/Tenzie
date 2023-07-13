import { nanoid } from "nanoid";

export default function Dice({ value, isHeld, holdDice }) {
  const createDice = (number) => {
    const dotPositionMatrix = {
      1: [[50, 50]],
      2: [
        [20, 20],
        [80, 80],
      ],
      3: [
        [20, 20],
        [50, 50],
        [80, 80],
      ],
      4: [
        [20, 20],
        [20, 80],
        [80, 20],
        [80, 80],
      ],
      5: [
        [20, 20],
        [20, 80],
        [50, 50],
        [80, 20],
        [80, 80],
      ],
      6: [
        [20, 20],
        [20, 80],
        [50, 20],
        [50, 80],
        [80, 20],
        [80, 80],
      ],
    };

    return dotPositionMatrix[number].map((dotPosition) => {
      const styles = {
        "--top": `${dotPosition[0]}%`,
        "--left": `${dotPosition[1]}%`,
      };
      return <div key={nanoid()} className="dice-dot" style={styles}></div>;
    });
  };

  return (
    <div className="dice-face" onClick={holdDice}>
      <div className={`dice-container ${isHeld ? "held" : ""}`}>
        {createDice(value)}
      </div>
    </div>
  );
}
