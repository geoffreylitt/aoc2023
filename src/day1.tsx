// THE PROBLEM

import { useEffect, useMemo, useState } from "react";
import sheepFront from "./assets/sheep-front.png";
import sheepSide from "./assets/sheep-side.png";
import sheepParty from "./assets/sheep-party.png";
import think from "./assets/think.svg";
import { part1input } from "./day1input";

// Something is wrong with global snow production, and you've been selected to take a look. The Elves have even given you a map; on it, they've used stars to mark the top fifty locations that are likely to be having problems.

// You've been doing this long enough to know that to restore snow operations, you need to check all fifty stars by December 25th.

// Collect stars by solving puzzles. Two puzzles will be made available on each day in the Advent calendar; the second puzzle is unlocked when you complete the first. Each puzzle grants one star. Good luck!

// You try to ask why they can't just use a weather machine ("not powerful enough") and where they're even sending you ("the sky") and why your map looks mostly blank ("you sure ask a lot of questions") and hang on did you just say the sky ("of course, where do you think snow comes from") when you realize that the Elves are already loading you into a trebuchet ("please hold still, we need to strap you in").

// As they're making the final adjustments, they discover that their calibration document (your puzzle input) has been amended by a very young Elf who was apparently just excited to show off her art skills. Consequently, the Elves are having trouble reading the values on the document.

// The newly-improved calibration document consists of lines of text; each line originally contained a specific calibration value that the Elves now need to recover. On each line, the calibration value can be found by combining the first digit and the last digit (in that order) to form a single two-digit number.

// For example:

// 1abc2
// pqr3stu8vwx
// a1b2c3d4e5f
// treb7uchet
// In this example, the calibration values of these four lines are 12, 38, 15, and 77. Adding these together produces 142.

// Consider your entire calibration document. What is the sum of all of the calibration values?

const SAMPLE_INPUT = `1abc2
pqr3stu8vwx
a1b2c3d4e5f
treb7uchet`;

const clone = <T extends any>(obj: T): T => JSON.parse(JSON.stringify(obj));

type ProgramState = {
  lineResults: {
    calibrationString: [string, string];
    calibrationValue: number;
  }[];
  activeLine: number;
  activeChar: number;
  solution: number;
  message?: string;
  solved?: boolean;
  status: "searchForward" | "searchBackward" | "found" | "solved";
};

// The solve function takes the puzzle input and produces a
// series of program states that can be used to animate the
// solution.
const solve = (input: string): ProgramState[] => {
  const programStates: ProgramState[] = [];
  const inputLines = input.split("\n");
  const lineResults = inputLines.map(() => ({
    calibrationString: ["", ""] as [string, string],
    calibrationValue: 0,
  }));
  let solution = 0;

  for (let activeLine = 0; activeLine < lineResults.length; activeLine++) {
    const results = lineResults[activeLine];
    const text = inputLines[activeLine];
    for (let activeChar = 0; activeChar < text.length; activeChar++) {
      programStates.push({
        activeLine,
        activeChar,
        lineResults: clone(lineResults),
        solution,
        status: "searchForward",
      });
      if (text[activeChar] > "0" && text[activeChar] < "9") {
        results.calibrationString[0] = text[activeChar];
        programStates.push({
          activeLine,
          activeChar,
          lineResults: clone(lineResults),
          solution,
          message: "👍",
          status: "found",
        });
        break;
      }
    }

    // now do the same thing but iterating from the back for the second digit
    for (let activeChar = text.length - 1; activeChar >= 0; activeChar--) {
      programStates.push({
        activeLine,
        activeChar,
        lineResults: clone(lineResults),
        solution,
        status: "searchBackward",
      });
      if (text[activeChar] > "0" && text[activeChar] < "9") {
        results.calibrationString[1] = text[activeChar];
        results.calibrationValue = parseInt(results.calibrationString.join(""));
        solution += results.calibrationValue;
        programStates.push({
          activeLine,
          activeChar,
          lineResults: clone(lineResults),
          solution,
          message: "‼️",
          status: "found",
        });
        break;
      }
    }
  }

  programStates.push({
    activeLine: 0,
    activeChar: 0,
    lineResults: clone(lineResults),
    solution,
    solved: true,
    status: "solved",
  });

  return programStates;
};

const Y_MARGIN = 100;
const CHAR_SIZE = 40;
const SHEEP_SIZE = CHAR_SIZE * 1.8;

const sheepImage = (status: ProgramState["status"]) => {
  switch (status) {
    case "searchForward":
      return (
        <image
          href={sheepSide}
          x={-10}
          y={SHEEP_SIZE * -1 - 5}
          height={SHEEP_SIZE}
          width={SHEEP_SIZE}
        />
      );
    case "searchBackward":
      return (
        <image
          href={sheepSide}
          x={SHEEP_SIZE * -1 + 20}
          y={SHEEP_SIZE * -1 - 5}
          height={SHEEP_SIZE}
          width={SHEEP_SIZE}
          transform="scale(-1, 1)"
        />
      );
    case "found":
      return (
        <image
          href={sheepFront}
          x={-10}
          y={SHEEP_SIZE * -1 - 5}
          height={SHEEP_SIZE}
          width={SHEEP_SIZE}
        />
      );
    case "solved":
      return (
        <image
          href={sheepParty}
          x={-10}
          y={SHEEP_SIZE * -1 - 5}
          height={SHEEP_SIZE}
          width={SHEEP_SIZE}
          transform="scale(2, 2)"
        />
      );
  }
};

export function Day1() {
  const [input, setInput] = useState(SAMPLE_INPUT);
  const inputLines = useMemo(() => input.split("\n"), [input]);
  const [activeStateIndex, setActiveStateIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const programStates = useMemo(() => solve(input), [input]);
  const programState = programStates[activeStateIndex];

  useEffect(() => {
    if (!paused) {
      const interval = setInterval(() => {
        setActiveStateIndex((i) => {
          if (i + 1 === programStates.length) {
            setPaused(true);
            return i;
          }
          return (i + 1) % programStates.length;
        });
      }, 200);
      return () => clearInterval(interval);
    }
  }, [paused]);

  const maxLineLength = Math.max(
    ...programState.lineResults.map((line, i) => inputLines[i].length)
  );

  let sheepPosition = { x: 0, y: 0 };
  if (programState.solved) {
    sheepPosition = {
      x: (maxLineLength + 1) * (CHAR_SIZE * 1.1) + 100,
      y: programState.lineResults.length * (CHAR_SIZE * 1.1) + Y_MARGIN + 10,
    };
  } else if (
    programState.activeLine !== undefined &&
    programState.activeChar !== undefined
  ) {
    sheepPosition = {
      x: programState.activeChar * (CHAR_SIZE * 1.1),
      y: programState.activeLine * (CHAR_SIZE * 1.1) + Y_MARGIN,
    };
  }

  return (
    <div className="p-8">
      <h1 className=" text-xl mb-4">Day 1</h1>
      <button onClick={() => setPaused((paused) => !paused)}>
        {paused ? "Play" : "Pause"}
      </button>
      <input
        type="range"
        min="0"
        max={programStates.length - 1}
        value={activeStateIndex}
        onChange={(e) => setActiveStateIndex(Number(e.target.value))}
      />
      <div className="flex">
        <div className="flex-grow bg-gray-100 p-4 text-[50px] font-mono h-screen">
          <svg className="w-full h-full">
            {programState.lineResults.map((line, i) => (
              <g>
                <g
                  transform={`translate(0, ${
                    i * (CHAR_SIZE * 1.1) + Y_MARGIN
                  })`}
                >
                  {inputLines[i].split("").map((char, j) => (
                    <g transform={`translate(${j * (CHAR_SIZE * 1.1)}, 0)`}>
                      <rect
                        x={0}
                        y={0}
                        width={CHAR_SIZE}
                        height={CHAR_SIZE}
                        fill="rgb(255, 255, 255, 0.1"
                        stroke="rgb(0, 0, 0, 0.3)"
                      />
                      <text
                        x={CHAR_SIZE * 0.2}
                        y={CHAR_SIZE * 0.8}
                        fontSize={CHAR_SIZE * 0.8}
                      >
                        {char}
                      </text>
                    </g>
                  ))}
                  <g
                    transform={`translate(${
                      CHAR_SIZE * 1.1 + maxLineLength * (CHAR_SIZE * 1.1)
                    }, 0)`}
                  >
                    {line.calibrationString.map((char, j) => (
                      <g transform={`translate(${j * (CHAR_SIZE * 1.1)}, 0)`}>
                        <rect
                          x={0}
                          y={0}
                          width={CHAR_SIZE}
                          height={CHAR_SIZE}
                          fill="white"
                          stroke="rgba(0, 0, 0)"
                          strokeOpacity={0.3}
                        />
                        <text
                          x={CHAR_SIZE * 0.2}
                          y={CHAR_SIZE * 0.8}
                          fontSize={CHAR_SIZE * 0.8}
                          fontFamily="Schoolbell"
                          fill="rgb(0, 0, 100, 0.8)"
                        >
                          {char}
                        </text>
                      </g>
                    ))}
                  </g>
                </g>
              </g>
            ))}
            <g
              transform={`translate(${
                (maxLineLength + 1) * (CHAR_SIZE * 1.1)
              }, ${
                programState.lineResults.length * (CHAR_SIZE * 1.1) +
                Y_MARGIN +
                10
              })`}
            >
              <rect
                x={0}
                y={0}
                width={
                  CHAR_SIZE *
                  programStates[programStates.length - 1].solution.toString()
                    .length
                }
                height={CHAR_SIZE}
                fill={`${
                  activeStateIndex === programStates.length - 1
                    ? "rgb(0, 255, 0, 0.4)"
                    : "white"
                }`}
                stroke="rgba(0, 0, 0)"
                strokeOpacity={0.3}
              ></rect>
              <text
                x={CHAR_SIZE * 0.3}
                y={CHAR_SIZE * 0.9}
                fontSize={CHAR_SIZE * 1.3}
                fontFamily="Schoolbell"
                fill={`${
                  activeStateIndex === programStates.length - 1
                    ? "black"
                    : "rgba(0, 0, 0, 0.5)"
                }`}
              >
                {programState.solution.toString()}
              </text>
            </g>
            <g
              className="transition-all"
              transform={`translate(${sheepPosition.x}, ${sheepPosition.y})`}
            >
              {!programState.solved && (
                <circle
                  cx={CHAR_SIZE / 1.5}
                  cy={CHAR_SIZE / 1.5}
                  r={CHAR_SIZE / 1.5}
                  fill="rgba(0, 0, 0, 0.1)"
                  transform={`translate(-10, -13)`}
                />
              )}
              {sheepImage(programState.status)}
              {programState.message && (
                <g transform={`translate(${CHAR_SIZE}, ${CHAR_SIZE * -1})`}>
                  <image
                    href={think}
                    x="0"
                    y={SHEEP_SIZE * -1}
                    height={CHAR_SIZE * 1.5}
                    width={CHAR_SIZE * 1.5}
                  />
                  <text
                    fontSize={24}
                    y={SHEEP_SIZE * -1 + 30}
                    x={20}
                    fill="black"
                  >
                    {programState.message}
                  </text>
                </g>
              )}
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
}
