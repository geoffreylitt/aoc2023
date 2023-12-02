// THE PROBLEM

import { useEffect, useState } from "react";

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

const sheep = (
  <svg
    width="100px"
    height="100px"
    viewBox="0 0 200 200"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="100" cy="130" r="40" fill="white" />

    <circle cx="100" cy="70" r="30" fill="black" />

    <circle cx="90" cy="65" r="5" fill="white" />
    <circle cx="110" cy="65" r="5" fill="white" />

    <rect x="85" y="170" width="10" height="20" fill="black" />
    <rect x="105" y="170" width="10" height="20" fill="black" />

    <rect x="80" y="50" width="40" height="10" fill="green" />
    <rect x="90" y="30" width="20" height="20" fill="green" />
  </svg>
);

type ProgramState = {
  lines: {
    text: string;
    calibrationString: [string, string];
    calibrationValue: number;
  }[];
  activeLine: number;
  activeChar: number;
  solution: number;
  message: string;
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
        message: "looking at the next character...",
      });
      if (line.text[activeChar] > "0" && line.text[activeChar] < "9") {
        line.calibrationString[0] = line.text[activeChar];
        programStates.push({
          activeLine,
          activeChar,
          lines: clone(lines),
          solution,
          message: "We found the first digit! Now to find the second digit..",
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
        message: "looking at the previous character...",
      });
      if (line.text[activeChar] > "0" && line.text[activeChar] < "9") {
        line.calibrationString[1] = line.text[activeChar];
        programStates.push({
          activeLine,
          activeChar,
          lines: clone(lines),
          solution,
          message: "We found the second digit!",
        });
        break;
      }
    }

    line.calibrationValue = parseInt(line.calibrationString.join(""));
    solution += line.calibrationValue;

    programStates.push({
      activeLine,
      activeChar: line.text.length,
      lines: clone(lines),
      solution,
      message: "We've finished this line! Moving on to the next...",
    });
  }

  return programStates;
};

const programStates = solve(SAMPLE_INPUT);

export function Day1() {
  const [activeStateIndex, setActiveStateIndex] = useState(0);
  const programState = programStates[activeStateIndex];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStateIndex((i) => (i + 1) % programStates.length);
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-8">
      <h1 className=" text-xl mb-4">Day 1</h1>
      <div className="flex">
        <div className="w-64 bg-gray-200 h-screen overflow-y-auto">
          {programStates.map((programState, i) => (
            <div
              onMouseEnter={() => setActiveStateIndex(i)}
              className={`p-1 border-b border-gray-400 ${
                activeStateIndex === i ? "bg-gray-300" : ""
              }`}
            >
              {programState.message}
            </div>
          ))}
        </div>
        <div className="flex-grow bg-gray-100 p-4 text-[50px] font-mono">
          {programState.lines.map((line, i) => (
            <div>
              {line.text.split("").map((char, j) => (
                <div
                  className={`px-2 border border-gray-300 inline-block ${
                    programState.activeLine === i &&
                    programState.activeChar === j &&
                    "bg-red-300"
                  }`}
                >
                  <div className="relative">
                    <div className="absolute left-10 bg-black bg-opacity-10">
                      {programState.activeLine === i &&
                        programState.activeChar === j &&
                        sheep}
                    </div>
                  </div>
                  {char}
                </div>
              ))}

              <span className="mx-2"></span>
              {line.calibrationString.map((char) => (
                <span className={`border border-green-300 bg-green-200 px-2`}>
                  {char === "" ? "?" : char}
                </span>
              ))}
            </div>
          ))}
          TOTAL: {programState.solution}
        </div>
      </div>
    </div>
  );
}
