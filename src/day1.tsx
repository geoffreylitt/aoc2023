// THE PROBLEM

import { useEffect, useMemo, useState } from "react";
import sheepFront from "./assets/sheep-front.png";
import sheepSide from "./assets/sheep-side.png";
import sheepParty from "./assets/sheep-party.png";
import think from "./assets/think.svg";
import { part1input } from "./day1input";
import { solvePart2 } from "./part2";
import React from "react";

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

const SAMPLE_INPUT_2 = `two1nine
eightwothree
abcone2threexyz
xtwone3four
4nineeightseven2
zoneight234
7pqrstsixteen`;

// console.log("part 2", solvePart2(part1input));

// const clone = <T extends any>(obj: T): T => JSON.parse(JSON.stringify(obj));
const clone = window.structuredClone;

type ProgramState = {
  calibrationStrings: [string, string][];
  calibrationValues: number[];
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
  const calibrationStrings = inputLines.map(() => ["", ""] as [string, string]);
  const calibrationValues = inputLines.map(() => 0);
  let solution = 0;

  for (let activeLine = 0; activeLine < inputLines.length; activeLine++) {
    const text = inputLines[activeLine];
    for (let activeChar = 0; activeChar < text.length; activeChar++) {
      programStates.push({
        activeLine,
        activeChar,
        solution,
        calibrationStrings: clone(calibrationStrings),
        calibrationValues: clone(calibrationValues),
        status: "searchForward",
      });
      if (text[activeChar] > "0" && text[activeChar] <= "9") {
        calibrationStrings[activeLine][0] = text[activeChar];
        programStates.push({
          activeLine,
          activeChar,
          calibrationStrings: clone(calibrationStrings),
          calibrationValues: clone(calibrationValues),
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
        calibrationStrings: clone(calibrationStrings),
        calibrationValues: clone(calibrationValues),
        solution,
        status: "searchBackward",
      });
      if (text[activeChar] > "0" && text[activeChar] <= "9") {
        calibrationStrings[activeLine][1] = text[activeChar];
        const calibrationValue = parseInt(
          calibrationStrings[activeLine].join("")
        );
        calibrationValues[activeLine] = calibrationValue;
        solution += calibrationValue;
        programStates.push({
          activeLine,
          activeChar,
          calibrationStrings: clone(calibrationStrings),
          calibrationValues: clone(calibrationValues),
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
    calibrationStrings: clone(calibrationStrings),
    calibrationValues: clone(calibrationValues),
    solution,
    solved: true,
    status: "solved",
  });

  return programStates;
};

const Y_MARGIN = 100;

const sheepImage = (status: ProgramState["status"], SHEEP_SIZE: number) => {
  switch (status) {
    case "searchForward":
      return (
        <image
          href={sheepSide}
          x={SHEEP_SIZE * -0.2}
          y={SHEEP_SIZE * -1}
          height={SHEEP_SIZE}
          width={SHEEP_SIZE}
        />
      );
    case "searchBackward":
      return (
        <image
          href={sheepSide}
          x={SHEEP_SIZE * -0.6}
          y={SHEEP_SIZE * -1}
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

const InputLines = ({
  inputLines,
  CHAR_SIZE,
}: {
  inputLines: string[];
  CHAR_SIZE: number;
}) => {
  return inputLines.map((line, i) => (
    <g>
      <g transform={`translate(0, ${i * (CHAR_SIZE * 1.1) + Y_MARGIN})`}>
        {inputLines[i].split("").map((char, j) => (
          <g key={j} transform={`translate(${j * (CHAR_SIZE * 1.1)}, 0)`}>
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
      </g>
    </g>
  ));
};

const MemoizedInputLines = React.memo(InputLines, (prevProps, nextProps) => {
  return prevProps.inputLines === nextProps.inputLines;
});

export function Day1() {
  const [input, setInput] = useState(SAMPLE_INPUT);
  const inputLines = useMemo(() => input.split("\n"), [input]);
  const [activeStateIndex, setActiveStateIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [speed, setSpeed] = useState(2);
  const programStates = useMemo(() => solve(input), [input]);
  const programState = programStates[activeStateIndex];
  // const CHAR_SIZE = SVG_HEIGHT / inputLines.length / 10;
  const CHAR_SIZE = 30;
  const SHEEP_SIZE = CHAR_SIZE * 1.8;
  const maxLineLength = Math.max(...inputLines.map((line) => line.length));
  const SVG_HEIGHT = CHAR_SIZE * 1.1 * inputLines.length + Y_MARGIN;
  const SVG_WIDTH = CHAR_SIZE * maxLineLength;

  useEffect(() => {
    setActiveStateIndex(0);
  }, [input]);

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
      }, 400 / speed);
      return () => clearInterval(interval);
    }
  }, [paused, speed, programStates]);

  let sheepPosition = { x: 0, y: 0 };
  if (programState.solved) {
    sheepPosition = {
      x: (maxLineLength + 1) * (CHAR_SIZE * 1.1) + SHEEP_SIZE * 2,
      y: inputLines.length * (CHAR_SIZE * 1.1) + Y_MARGIN,
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
      <div className="flex justify-between">
        <div>
          <button
            className="border border-gray-500 rounded-md px-2 py-1 mr-4 w-20"
            onClick={() => {
              if (activeStateIndex === programStates.length - 1) {
                setActiveStateIndex(0);
              }
              setPaused((paused) => !paused);
            }}
          >
            {paused ? "Play" : "Pause"}
          </button>

          <span>Step:</span>
          <input
            type="range"
            min="0"
            max={programStates.length - 1}
            value={activeStateIndex}
            onChange={(e) => setActiveStateIndex(Number(e.target.value))}
            className="mr-2"
          />
          <span>Speed:</span>
          <input
            type="range"
            min="1"
            max="20"
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
          />
        </div>
        <select className="mr-4 " onChange={(e) => setInput(e.target.value)}>
          <option value={SAMPLE_INPUT}>Sample Input</option>
          <option value={part1input}>
            Real Input (⚠️ WARNING: Very slow!!!)
          </option>
        </select>
      </div>
      <div className="flex">
        <div className="flex-grow bg-gray-100 p-4 text-[50px] font-mono h-screen overflow-auto">
          <svg viewBox={`0 0 ${SVG_WIDTH * 2} ${SVG_HEIGHT * 2}`}>
            <g transform="scale(1)">
              <MemoizedInputLines
                inputLines={inputLines}
                CHAR_SIZE={CHAR_SIZE}
              />
              {inputLines.map((line, i) => (
                <g>
                  <g
                    transform={`translate(0, ${
                      i * (CHAR_SIZE * 1.1) + Y_MARGIN
                    })`}
                  >
                    <g
                      transform={`translate(${
                        CHAR_SIZE * 1.1 + maxLineLength * (CHAR_SIZE * 1.1)
                      }, 0)`}
                    >
                      {programState.calibrationStrings[i].map((char, j) => (
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
                }, ${inputLines.length * (CHAR_SIZE * 1.1) + Y_MARGIN + 10})`}
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
                className={`${
                  speed < 3 ? "transition-all duration-200 ease-out" : ""
                }`}
                transform={`translate(${sheepPosition.x}, ${sheepPosition.y})`}
              >
                {!programState.solved && (
                  <circle
                    cx={CHAR_SIZE / 1.5}
                    cy={CHAR_SIZE / 1.5}
                    r={CHAR_SIZE / 1.5}
                    fill="rgba(0, 0, 0, 0.1)"
                    transform={`translate(${CHAR_SIZE * -0.2},${
                      CHAR_SIZE * -0.2
                    })`}
                  />
                )}
                {sheepImage(programState.status, SHEEP_SIZE)}
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
                      fontSize={CHAR_SIZE * 0.8}
                      y={SHEEP_SIZE * -0.6}
                      x={CHAR_SIZE * 0.5}
                      fill="black"
                    >
                      {programState.message}
                    </text>
                  </g>
                )}
              </g>
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
}
