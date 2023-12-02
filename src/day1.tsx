// THE PROBLEM

import { useEffect, useState } from "react";
import think from "./assets/think.svg";

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
  lines: {
    text: string;
    calibrationString: [string, string];
    calibrationValue: number;
  }[];
  activeLine: number;
  activeChar: number;
  solution: number;
  message?: string;
};

// The solve function takes the puzzle input and produces a
// series of program states that can be used to animate the
// solution.
const solve = (input: string): ProgramState[] => {
  const programStates: ProgramState[] = [];
  const lines = input.split("\n").map((text) => ({
    text,
    calibrationString: ["", ""] as [string, string],
    calibrationValue: 0,
  }));
  let solution = 0;

  for (let activeLine = 0; activeLine < lines.length; activeLine++) {
    const line = lines[activeLine];
    for (let activeChar = 0; activeChar < line.text.length; activeChar++) {
      programStates.push({
        activeLine,
        activeChar,
        lines: clone(lines),
        solution,
      });
      if (line.text[activeChar] > "0" && line.text[activeChar] < "9") {
        line.calibrationString[0] = line.text[activeChar];
        programStates.push({
          activeLine,
          activeChar,
          lines: clone(lines),
          solution,
          message: "👍",
        });
        break;
      }
    }

    // now do the same thing but iterating from the back for the second digit
    for (let activeChar = line.text.length - 1; activeChar >= 0; activeChar--) {
      programStates.push({
        activeLine,
        activeChar,
        lines: clone(lines),
        solution,
      });
      if (line.text[activeChar] > "0" && line.text[activeChar] < "9") {
        line.calibrationString[1] = line.text[activeChar];
        line.calibrationValue = parseInt(line.calibrationString.join(""));
        solution += line.calibrationValue;
        programStates.push({
          activeLine,
          activeChar,
          lines: clone(lines),
          solution,
          message: "‼️",
        });
        break;
      }
    }
  }

  return programStates;
};

const programStates = solve(SAMPLE_INPUT);

const Y_MARGIN = 100;
const CHAR_SIZE = 40;

export function Day1() {
  const [activeStateIndex, setActiveStateIndex] = useState(0);
  const [paused, setPaused] = useState(false);
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
    ...programState.lines.map((line) => line.text.length)
  );

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
            {programState.lines.map((line, i) => (
              <g>
                <g
                  transform={`translate(0, ${
                    i * (CHAR_SIZE * 1.1) + Y_MARGIN
                  })`}
                >
                  {line.text.split("").map((char, j) => (
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
                programState.lines.length * (CHAR_SIZE * 1.1) + Y_MARGIN + 10
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
            {programState.activeLine !== undefined &&
              programState.activeChar !== undefined && (
                <g
                  className="transition-all"
                  transform={`translate(${
                    programState.activeChar * (CHAR_SIZE * 1.1)
                  }, ${
                    programState.activeLine * (CHAR_SIZE * 1.1) + Y_MARGIN
                  })`}
                >
                  <circle
                    cx={CHAR_SIZE / 1.5}
                    cy={CHAR_SIZE / 1.5}
                    r={CHAR_SIZE / 1.5}
                    fill="rgba(0, 0, 0, 0.2)"
                    transform={`translate(-10, -13)`}
                  />
                  <image
                    href="/sheep.svg"
                    x="0"
                    y={CHAR_SIZE * -1}
                    height={CHAR_SIZE}
                    width={CHAR_SIZE}
                  />
                  {programState.message && (
                    <g transform={`translate(${CHAR_SIZE}, ${CHAR_SIZE * -1})`}>
                      <image
                        href={think}
                        x="0"
                        y={CHAR_SIZE * -1}
                        height={CHAR_SIZE * 1.5}
                        width={CHAR_SIZE * 1.5}
                      />
                      <text fontSize={24} y={-10} x={20} fill="black">
                        {programState.message}
                      </text>
                    </g>
                  )}
                </g>
              )}
          </svg>
        </div>
      </div>
    </div>
  );
}
