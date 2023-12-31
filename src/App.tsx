import React, { useEffect, useState } from "react";
import { Day1 } from "./day1";
import { Day2 } from "./day2";

import ReactMarkdown from "react-markdown";

import wreath from "./assets/wreath.png";
import holly from "./assets/holly.png";

const DayConfigs: {
  [key: number]: { description: string; component: React.FC };
} = {
  1: {
    description: `For each line, find the first and last digit on that line.

Then sum up the numbers for every line to get a total.`,
    component: Day1,
  },
  2: {
    description: `Each row is a game where colored cubes are drawn from a bag, with replacement.

But wait ! Some of the games must be fake! There are only 12 red, 13 green, and 14 blue cubes in the bag.

Sheepie must diligently identify the real draws, and add up their game IDs.`,
    component: Day2,
  },
};

const getDayFromWindowHash = () => {
  const hashDay = Number(window.location.hash.replace("#day", ""));
  if (DayConfigs[hashDay]?.component) {
    return hashDay;
  }
  const maxDay = Math.max(...Object.keys(DayConfigs).map(Number));
  return maxDay;
};

function App() {
  const [activeDay, setActiveDay] = useState(getDayFromWindowHash());
  const ActiveComponent = DayConfigs[activeDay]?.component;

  useEffect(() => {
    window.location.hash = `day${activeDay.toString()}`;
  }, [activeDay]);

  useEffect(() => {
    const onHashChange = () => {
      const hashDay = getDayFromWindowHash();
      if (hashDay !== activeDay) {
        setActiveDay(hashDay);
      }
    };
    window.addEventListener("hashchange", onHashChange);
    return () => {
      window.removeEventListener("hashchange", onHashChange);
    };
  }, []);

  return (
    <div className="flex h-screen">
      <div className="w-64 bg-gray-800 text-white p-4 flex flex-col justify-between">
        <div>
          <img
            src={wreath}
            alt="Wreath"
            className="absolute top-20 left-24 w-32 lg:block hidden"
          />
          <h1 className="text-2xl font-medium mb-4">
            Advent of <br />
            <span className="text-2xl mb-4 line-through">Code</span>{" "}
            <span
              className="text-2xl font-bold mb-4"
              style={{ fontFamily: "Schoolbell" }}
            >
              Visualization
            </span>{" "}
            2023
          </h1>
          <div>
            <select
              id="day-selector"
              value={activeDay}
              onChange={(e) => setActiveDay(Number(e.target.value))}
              className="bg-slate-900 rounded-md p-2 mb-4"
            >
              {Object.keys(DayConfigs).map((day) => (
                <option key={day} value={day}>
                  Day {day}
                </option>
              ))}
            </select>
          </div>
          <h2 className="font-bold text-sm mb-2">Today's task:</h2>
          <ReactMarkdown className="mb-4">
            {DayConfigs[activeDay].description}
          </ReactMarkdown>
          <p>
            <a
              className="underline text-xs font-bold"
              href={`https://adventofcode.com/2023/day/${activeDay}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Full problem description
            </a>
          </p>
          <img src={holly} alt="Holly" className="w-36" />
        </div>
        <div className="h-48 pt-4 border-t border-gray-600 text-sm text-gray-300">
          <p className="mb-2">
            <a
              className="underline font-medium"
              href={`https://adventofcode.com/2023/`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Advent of Code
            </a>{" "}
            is a series of daily coding puzzles in December.
          </p>
          <p className="mb-2">
            Our goal: don't just code solutions, visualize them.
          </p>
          <p className="mb-2">
            (TBD how far we make it on this highly impractical quest...)
          </p>
          <p>By Geoffrey Litt and Maggie Yellen</p>
        </div>
      </div>
      <div className="flex-grow bg-gray-100 p-4">{<ActiveComponent />}</div>
    </div>
  );
}

export default App;
