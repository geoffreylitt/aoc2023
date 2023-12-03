// --- Day 2: Cube Conundrum ---
// You're launched high into the atmosphere! The apex of your trajectory just barely reaches the surface of a large island floating in the sky. You gently land in a fluffy pile of leaves. It's quite cold, but you don't see much snow. An Elf runs over to greet you.

// The Elf explains that you've arrived at Snow Island and apologizes for the lack of snow. He'll be happy to explain the situation, but it's a bit of a walk, so you have some time. They don't get many visitors up here; would you like to play a game in the meantime?

// As you walk, the Elf shows you a small bag and some cubes which are either red, green, or blue. Each time you play this game, he will hide a secret number of cubes of each color in the bag, and your goal is to figure out information about the number of cubes.

// To get information, once a bag has been loaded with cubes, the Elf will reach into the bag, grab a handful of random cubes, show them to you, and then put them back in the bag. He'll do this a few times per game.

// You play several games and record the information from each game (your puzzle input). Each game is listed with its ID number (like the 11 in Game 11: ...) followed by a semicolon-separated list of subsets of cubes that were revealed from the bag (like 3 red, 5 green, 4 blue).

// For example, the record of a few games might look like this:

// Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green
// Game 2: 1 blue, 2 green; 3 green, 4 blue, 1 red; 1 green, 1 blue
// Game 3: 8 green, 6 blue, 20 red; 5 blue, 4 red, 13 green; 5 green, 1 red
// Game 4: 1 green, 3 red, 6 blue; 3 green, 6 red; 3 green, 15 blue, 14 red
// Game 5: 6 red, 1 blue, 3 green; 2 blue, 1 red, 2 green
// In game 1, three sets of cubes are revealed from the bag (and then put back again). The first set is 3 blue cubes and 4 red cubes; the second set is 1 red cube, 2 green cubes, and 6 blue cubes; the third set is only 2 green cubes.

// The Elf would first like to know which games would have been possible if the bag contained only 12 red cubes, 13 green cubes, and 14 blue cubes?

// In the example above, games 1, 2, and 5 would have been possible if the bag had been loaded with that configuration. However, game 3 would have been impossible because at one point the Elf showed you 20 red cubes at once; similarly, game 4 would also have been impossible because the Elf showed you 15 blue cubes at once. If you add up the IDs of the games that would have been possible, you get 8.

// Determine which games would have been possible if the bag had been loaded with only 12 red cubes, 13 green cubes, and 14 blue cubes. What is the sum of the IDs of those games?

import React, { useEffect, useMemo, useState } from "react";

const SAMPLE_INPUT = `Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green
Game 2: 1 blue, 2 green; 3 green, 4 blue, 1 red; 1 green, 1 blue
Game 3: 8 green, 6 blue, 20 red; 5 blue, 4 red, 13 green; 5 green, 1 red
Game 4: 1 green, 3 red, 6 blue; 3 green, 6 red; 3 green, 15 blue, 14 red
Game 5: 6 red, 1 blue, 3 green; 2 blue, 1 red, 2 green`;

const REAL_INPUT = `Game 1: 6 green, 3 blue; 3 red, 1 green; 4 green, 3 red, 5 blue
Game 2: 2 red, 7 green; 13 green, 2 blue, 4 red; 4 green, 5 red, 1 blue; 1 blue, 9 red, 1 green
Game 3: 2 green, 3 blue, 9 red; 3 red, 2 green; 6 red, 4 blue; 6 red
Game 4: 9 red, 3 green; 3 green, 8 red, 6 blue; 12 blue, 4 green, 6 red; 4 green, 18 blue, 11 red; 9 blue, 2 green, 3 red; 14 blue, 7 red
Game 5: 1 blue, 2 green, 3 red; 16 red, 6 green; 6 green, 2 red; 9 red, 1 green
Game 6: 4 green, 7 red, 1 blue; 18 green, 6 blue, 7 red; 1 blue, 3 red, 9 green; 9 red, 19 green, 1 blue; 7 red, 9 green, 4 blue; 5 red, 5 blue, 10 green
Game 7: 16 blue, 5 green, 6 red; 1 blue, 6 red, 9 green; 6 green, 3 red, 2 blue; 2 red, 12 blue, 2 green
Game 8: 6 green, 10 red; 7 red, 6 green, 17 blue; 13 blue, 1 red
Game 9: 2 red, 4 green, 5 blue; 2 green, 5 blue; 4 green, 1 blue; 3 green, 3 red, 6 blue; 3 green
Game 10: 3 green, 5 red, 6 blue; 4 blue, 4 red, 5 green; 5 green, 9 red, 5 blue; 4 green, 6 blue, 10 red
Game 11: 1 blue, 7 red, 9 green; 1 blue, 13 red, 7 green; 5 red; 4 red, 7 green, 2 blue; 7 green, 12 red; 13 red, 2 blue, 12 green
Game 12: 4 blue, 2 red; 9 blue, 2 green, 3 red; 8 blue, 1 green, 1 red; 2 red, 3 green, 11 blue
Game 13: 6 red, 8 green, 2 blue; 6 red, 7 green; 3 green, 3 red; 2 blue; 3 red, 5 green
Game 14: 2 green, 11 blue, 1 red; 5 blue, 1 red, 1 green; 3 green, 12 blue, 2 red
Game 15: 4 blue, 6 red, 7 green; 1 red, 2 blue, 5 green; 6 red, 3 green, 8 blue; 7 green, 8 blue, 4 red
Game 16: 2 red, 16 blue; 2 green, 7 red; 15 blue, 7 red; 2 red, 3 green, 3 blue; 3 red, 1 green, 4 blue; 4 blue, 3 green
Game 17: 2 red, 3 green, 10 blue; 9 red, 4 blue, 3 green; 3 green, 11 red, 6 blue
Game 18: 1 red; 6 green, 1 red, 9 blue; 4 blue, 2 green; 6 blue, 10 green
Game 19: 2 red, 9 green; 2 red, 1 blue; 5 blue, 12 green; 5 green; 8 green, 2 red, 3 blue; 1 red, 11 green
Game 20: 3 green, 2 red, 7 blue; 1 blue, 10 green; 1 red, 14 blue, 13 green; 3 green, 19 blue, 4 red
Game 21: 8 red, 10 blue, 8 green; 2 red, 7 green, 18 blue; 4 green, 11 blue, 4 red; 5 green, 3 blue, 10 red
Game 22: 17 blue, 2 green, 2 red; 8 red, 7 blue; 1 red, 9 blue, 1 green
Game 23: 4 blue, 18 red, 4 green; 3 blue, 7 red; 11 red; 3 blue, 6 red; 19 red
Game 24: 10 red, 1 blue, 17 green; 17 green, 6 red; 14 green, 4 blue
Game 25: 4 blue, 9 green, 4 red; 3 green, 5 blue; 5 blue, 8 green; 3 green, 3 blue, 1 red; 10 green, 1 blue, 4 red; 2 green, 2 blue, 1 red
Game 26: 18 green, 3 red, 12 blue; 2 red, 7 green; 11 blue, 17 green; 12 green, 11 blue; 12 green, 4 blue, 3 red
Game 27: 1 red, 3 blue, 8 green; 15 blue, 8 red, 4 green; 6 red, 9 blue; 6 red, 12 blue, 9 green; 4 red, 7 blue, 15 green
Game 28: 1 red, 14 green; 1 blue, 11 green; 2 green; 4 red, 6 green, 1 blue
Game 29: 1 green, 13 red; 4 red, 16 green, 7 blue; 2 red, 4 blue; 12 green, 8 blue, 4 red; 2 red; 12 red, 5 green
Game 30: 3 green, 4 blue, 3 red; 5 blue, 4 green, 7 red; 5 blue, 2 green, 2 red; 3 red, 1 blue
Game 31: 1 blue, 8 green; 9 green, 2 blue, 1 red; 1 red, 2 blue
Game 32: 11 red, 5 green, 4 blue; 3 blue, 11 red, 8 green; 6 blue, 3 green, 17 red; 4 red, 7 green, 10 blue
Game 33: 6 blue, 4 red; 1 green; 1 green, 4 red, 4 blue; 1 green, 3 red, 10 blue; 10 blue, 1 red
Game 34: 2 green, 3 blue, 3 red; 4 red; 2 red, 2 blue
Game 35: 9 green, 13 blue; 13 blue, 14 red, 1 green; 11 blue, 4 red, 7 green; 5 blue, 5 red, 8 green; 4 red, 2 blue, 2 green
Game 36: 9 red, 5 blue, 8 green; 7 red, 20 blue; 6 green, 16 blue, 5 red; 12 red, 3 blue, 3 green; 3 green, 6 blue, 11 red; 11 red, 8 blue, 3 green
Game 37: 10 green, 11 red, 3 blue; 2 blue, 6 green, 11 red; 9 green, 8 red, 2 blue
Game 38: 2 red, 2 green, 4 blue; 3 red, 4 green, 3 blue; 8 green, 1 blue, 1 red; 3 red, 5 blue, 5 green
Game 39: 3 green, 17 red, 4 blue; 2 green, 20 red; 4 blue, 4 red, 5 green; 5 blue, 7 green, 7 red; 4 blue, 5 green, 16 red
Game 40: 2 green, 2 blue, 4 red; 3 blue, 16 green; 1 green, 2 blue; 1 red; 3 blue, 15 green; 13 green, 1 red, 2 blue
Game 41: 12 red, 10 blue, 9 green; 1 green, 15 red, 4 blue; 2 green, 8 blue, 12 red; 3 red, 4 green, 2 blue; 8 blue, 14 red, 10 green; 9 blue, 7 green, 6 red
Game 42: 5 red, 3 green, 6 blue; 4 blue, 6 green, 2 red; 10 blue; 3 red, 6 green, 10 blue
Game 43: 9 blue, 7 green, 1 red; 2 green, 2 red, 8 blue; 3 red, 15 blue, 11 green; 1 red, 6 blue, 1 green; 2 red, 1 blue; 1 red, 3 green, 7 blue
Game 44: 4 green, 6 red; 15 green, 6 red; 9 green, 16 red, 7 blue; 11 green, 4 blue, 12 red
Game 45: 3 blue, 6 green, 1 red; 4 green, 3 blue; 8 green, 3 blue
Game 46: 10 red, 8 blue; 12 red, 2 green, 17 blue; 17 blue, 6 red, 1 green; 18 red, 6 green, 3 blue; 16 blue, 2 green, 3 red
Game 47: 8 green, 13 red; 8 green, 8 red, 4 blue; 10 red, 3 green; 14 red, 5 green, 8 blue; 7 green, 19 red, 3 blue; 2 red, 5 green, 5 blue
Game 48: 7 green, 9 blue, 3 red; 7 blue, 1 green, 9 red; 7 green, 4 red, 1 blue; 6 green, 3 red, 1 blue
Game 49: 2 red, 3 green; 3 blue, 2 red; 4 red, 3 blue
Game 50: 3 red, 7 blue, 4 green; 2 green, 1 blue, 7 red; 4 red, 1 green, 5 blue
Game 51: 11 red, 6 green, 1 blue; 7 red, 1 blue, 9 green; 15 red, 18 green; 11 green, 1 blue, 11 red; 10 green, 14 red; 1 red, 11 green, 1 blue
Game 52: 18 blue, 1 red, 2 green; 18 blue, 3 green, 1 red; 2 green, 13 blue, 1 red
Game 53: 2 blue, 9 red, 6 green; 1 blue, 3 red; 7 red, 6 blue, 8 green; 2 red, 3 blue, 4 green; 1 green, 2 blue, 2 red
Game 54: 16 red, 4 blue; 1 green, 3 blue, 3 red; 2 green, 12 red; 2 green, 1 blue, 3 red; 10 blue, 6 red, 2 green
Game 55: 1 blue, 4 red, 1 green; 2 blue, 2 red; 13 red, 4 blue, 1 green; 4 blue, 9 red; 1 green, 1 blue, 16 red
Game 56: 12 blue, 12 green; 4 blue, 1 red, 3 green; 2 red, 12 green; 1 red, 11 green, 13 blue; 16 blue, 5 green
Game 57: 1 blue, 3 red; 10 green, 5 red; 5 green, 2 red; 1 red, 13 green
Game 58: 6 blue, 1 red, 6 green; 3 red, 9 blue; 4 red, 9 blue, 5 green; 1 green, 5 red, 7 blue
Game 59: 10 red, 3 green, 3 blue; 6 blue, 11 red, 1 green; 5 green, 10 red; 16 red, 2 blue, 4 green; 3 green, 10 red
Game 60: 2 green, 1 blue; 1 green, 1 blue, 4 red; 3 blue, 1 red, 1 green; 2 red, 2 green; 4 red
Game 61: 5 red, 1 green, 10 blue; 9 red, 10 blue; 1 red, 2 green, 4 blue; 10 blue, 2 green, 9 red; 1 red, 12 blue, 2 green
Game 62: 1 blue, 5 green; 4 blue, 12 green, 1 red; 7 blue, 3 green; 7 blue, 3 green; 3 blue, 1 green, 2 red; 7 blue, 1 red, 12 green
Game 63: 4 blue, 2 green, 5 red; 1 green, 2 red, 2 blue; 4 blue, 2 red, 2 green; 1 blue, 6 red, 2 green; 6 blue, 1 red; 1 green, 9 red, 6 blue
Game 64: 1 green; 3 green, 5 blue, 5 red; 3 red, 3 blue, 3 green; 1 green, 4 red, 6 blue; 5 red
Game 65: 2 red; 1 blue, 1 red; 7 red, 2 blue; 1 green, 4 blue, 3 red
Game 66: 3 red, 9 blue; 1 red, 6 blue, 15 green; 3 green, 3 red, 11 blue
Game 67: 2 red, 1 green, 2 blue; 6 red, 1 green; 1 blue, 1 red, 4 green
Game 68: 3 red, 1 blue; 1 green, 3 red, 2 blue; 1 green, 8 red; 2 blue, 3 red
Game 69: 5 blue, 6 red; 1 green, 15 blue, 10 red; 1 green, 2 red, 4 blue; 5 blue, 7 red; 3 red, 1 green, 11 blue
Game 70: 4 green, 2 red, 8 blue; 5 red, 3 blue; 10 green, 5 blue
Game 71: 1 red, 2 blue, 9 green; 3 red, 8 green; 1 red, 2 blue, 6 green; 3 red, 6 blue, 8 green; 6 green, 3 blue, 2 red; 3 red, 8 green, 6 blue
Game 72: 1 red, 11 green; 1 blue, 7 green, 1 red; 2 red, 12 green; 10 green, 6 red
Game 73: 9 green, 2 red; 1 blue, 3 green; 1 blue, 1 red, 7 green; 2 blue, 9 green, 4 red; 2 blue, 3 red, 8 green; 2 green, 9 red
Game 74: 2 green, 7 red; 1 green, 3 blue, 6 red; 4 green, 3 blue, 6 red; 2 green, 3 blue, 1 red; 3 red, 2 blue, 1 green
Game 75: 15 green, 2 blue; 15 green, 6 red, 2 blue; 12 green, 2 blue, 1 red
Game 76: 1 red, 9 green, 12 blue; 6 red, 12 green, 1 blue; 7 green, 2 blue, 1 red
Game 77: 11 blue, 1 red; 7 blue, 2 red, 13 green; 10 blue, 10 green; 12 blue, 3 red
Game 78: 4 green; 1 blue, 5 green; 5 green, 1 blue, 1 red
Game 79: 4 green, 7 blue, 16 red; 1 blue, 10 red, 5 green; 3 green, 4 red, 3 blue; 11 blue, 18 red, 5 green
Game 80: 1 red, 4 blue, 6 green; 14 blue, 16 red, 2 green; 2 blue, 5 red, 4 green; 2 green, 8 red; 18 red, 6 green, 2 blue; 18 red, 9 blue
Game 81: 11 red, 8 blue, 1 green; 12 blue, 2 green, 14 red; 16 red, 2 green, 6 blue; 17 red, 2 green; 3 green, 3 blue, 15 red
Game 82: 13 red, 1 blue, 6 green; 3 green, 12 red, 3 blue; 5 red, 3 green, 18 blue; 15 blue, 8 red
Game 83: 9 green, 5 blue, 5 red; 8 green, 15 blue, 7 red; 4 green, 6 red, 10 blue; 5 green, 2 red
Game 84: 2 blue, 2 green, 6 red; 2 green, 7 red, 1 blue; 3 green, 3 blue; 2 green, 3 red, 3 blue; 6 green, 4 red
Game 85: 1 blue, 3 green, 5 red; 2 green, 2 red; 4 red, 3 blue; 2 green, 3 blue, 1 red; 4 red, 2 green, 4 blue
Game 86: 6 red, 1 blue; 1 green, 16 red; 2 green, 1 red; 12 red, 1 blue
Game 87: 6 red, 12 green, 1 blue; 5 blue, 6 red, 4 green; 2 blue, 5 red, 8 green
Game 88: 3 green, 6 red, 2 blue; 3 blue, 2 green, 6 red; 1 red, 11 blue, 2 green
Game 89: 7 red, 3 blue, 9 green; 6 red, 3 blue, 15 green; 2 blue, 6 red, 12 green; 5 red, 8 green; 3 blue, 7 red, 9 green; 5 red, 7 green
Game 90: 2 green, 4 red, 19 blue; 13 blue, 4 red, 1 green; 14 blue, 8 green
Game 91: 12 green, 5 blue, 4 red; 9 green, 10 blue, 1 red; 13 green, 1 blue, 4 red; 2 red, 5 blue; 2 blue, 7 green, 2 red; 5 blue, 5 green, 3 red
Game 92: 9 red, 6 blue, 16 green; 11 green, 2 red, 7 blue; 1 green, 1 red, 3 blue; 4 green, 8 red
Game 93: 1 green, 4 blue, 8 red; 2 red, 1 green, 2 blue; 2 blue, 9 red; 1 green, 4 blue, 3 red; 3 red, 1 green, 4 blue
Game 94: 1 green, 7 red, 4 blue; 4 red, 3 blue; 16 blue, 9 red, 7 green; 9 red, 15 blue; 15 blue, 3 red, 6 green; 7 red, 10 blue, 12 green
Game 95: 5 green, 6 blue; 10 green, 9 blue; 4 blue, 8 green, 2 red; 5 blue, 5 green, 1 red
Game 96: 13 blue, 10 red, 2 green; 10 red, 2 green, 1 blue; 6 blue, 5 red, 3 green; 11 red, 3 green, 5 blue; 11 red, 2 green; 3 green, 6 blue
Game 97: 9 green, 11 red, 8 blue; 6 red, 9 blue, 2 green; 3 red, 17 blue, 1 green
Game 98: 14 blue, 3 green; 2 red, 15 blue, 3 green; 15 blue, 8 green, 1 red; 1 red, 8 green
Game 99: 2 green, 7 blue; 14 red, 1 green, 4 blue; 8 blue, 13 red, 2 green; 10 green, 7 red, 10 blue
Game 100: 5 green, 11 blue, 6 red; 5 green, 12 blue; 1 green, 14 blue, 1 red; 3 blue, 5 red, 6 green; 9 blue; 6 red`;

type Draw = {
  red: number;
  blue: number;
  green: number;
};

// the ID of a game is inplicit in the order of games
type Game = {
  draws: Draw[];
};

type Input = Game[];

type SolveEvent = Init | VisitDraw | ValidateGame | InvalidateGame | Solved;

type Init = {
  tag: "Init";
};

type VisitDraw = {
  tag: "VisitDraw";
  gameIndex: number;
  drawIndex: number;
  drawIsValid: boolean;
};

type ValidateGame = {
  tag: "ValidateGame";
  gameIndex: number;
};

type InvalidateGame = {
  tag: "InvalidateGame";
  gameIndex: number;
};

type Solved = {
  tag: "Solved";
};

// take in a string like "3 blue, 4 red" and return a Draw object
const parseDraw = (drawString: string): Draw => {
  const result = { red: 0, blue: 0, green: 0 };
  const colorStrings = drawString.split(",");

  for (const colorString of colorStrings) {
    const color = colorString.match("red|blue|green")[0];
    const count = parseInt(colorString.match(/\d+/)[0]);
    result[color] = count;
  }

  return result;
};

const parseInput = (input: string): Game[] => {
  const lines = input.split("\n");
  return lines.map((line) => {
    const drawsString = line.split(":")[1];
    const draws = drawsString
      .split(";")
      .map((drawString) => parseDraw(drawString));
    const game = { draws };
    return game;
  });
};

const solve = (input: string) => {
  const solveEvents: SolveEvent[] = [];

  const parsedInput = parseInput(input);

  const limits = { red: 12, green: 13, blue: 14 };

  const validGameIds = [];

  for (const [i, game] of parsedInput.entries()) {
    let isValid = true;
    for (const [j, draw] of game.draws.entries()) {
      for (const color in draw) {
        if (draw[color] > limits[color]) {
          isValid = false;
        }
      }
      solveEvents.push({
        tag: "VisitDraw",
        gameIndex: i,
        drawIndex: j,
        drawIsValid: isValid,
      });
    }
    if (isValid) {
      validGameIds.push(i);
      solveEvents.push({
        tag: "ValidateGame",
        gameIndex: i,
      });
    } else {
      solveEvents.push({
        tag: "InvalidateGame",
        gameIndex: i,
      });
    }
  }

  solveEvents.push({
    tag: "Solved",
  });

  return solveEvents;
};

type ProgramState = {
  validGameIds: number[];
  invalidGameIds: number[];
  sum: number;
  solved: boolean;
  currentEvent: SolveEvent;
};

const programStateAtEvent = (
  input: string,
  events: SolveEvent[],
  numberToApply: number
) => {
  const state: ProgramState = {
    validGameIds: [],
    invalidGameIds: [],
    sum: 0,
    solved: false,
    currentEvent: { tag: "Init" },
  };

  for (let i = 0; i < numberToApply; i++) {
    const e = events[i];
    state.currentEvent = e;
    switch (e.tag) {
      case "Solved": {
        state.solved = true;
        break;
      }
      case "ValidateGame": {
        state.validGameIds.push(e.gameIndex + 1);
        state.sum = state.validGameIds.reduce((a, b) => a + b, 0);
        break;
      }
      case "InvalidateGame": {
        state.invalidGameIds.push(e.gameIndex + 1);
        break;
      }

      // These are events which don't affect the durable state of the game

      case "Init":
      case "VisitDraw": {
        break;
      }

      default: {
        const exhaustiveCheck: never = e;
        return exhaustiveCheck;
      }
    }
  }

  return state;
};

console.log(solve(REAL_INPUT));

const GAME_HEIGHT = 20;
const SHEEP_ROW_HEIGHT = GAME_HEIGHT;
const FINAL_ROW_HEIGHT = GAME_HEIGHT;
const Y_MARGIN = 20;
const GAME_ID_COL_WIDTH = 40;
const DRAW_WIDTH = 100;

export const Day2 = () => {
  const [input, setInput] = useState(SAMPLE_INPUT);
  const [activeStateIndex, setActiveStateIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [speed, setSpeed] = useState(2);
  const parsedInput = useMemo(() => parseInput(input), [input]);
  const solveEvents = useMemo(() => solve(input), [input]);

  const SVG_HEIGHT =
    Y_MARGIN * 2 +
    parsedInput.length * GAME_HEIGHT +
    FINAL_ROW_HEIGHT +
    SHEEP_ROW_HEIGHT;
  const SVG_WIDTH =
    Math.max(...parsedInput.map((game) => game.draws.length * DRAW_WIDTH)) +
    GAME_ID_COL_WIDTH;

  const yIndexForGameIndex = (gameIndex: number) => {
    let draft = gameIndex * GAME_HEIGHT + Y_MARGIN;
    if (
      currentState.currentEvent.tag === "VisitDraw" &&
      currentState.currentEvent.gameIndex < gameIndex
    ) {
      draft = draft + SHEEP_ROW_HEIGHT;
    }
    return draft;
  };

  // TODO: extract a shared helper hook for this playback stuff
  useEffect(() => {
    setActiveStateIndex(0);
  }, [input]);

  useEffect(() => {
    if (!paused) {
      const interval = setInterval(() => {
        setActiveStateIndex((i) => {
          if (i + 1 === solveEvents.length + 1) {
            setPaused(true);
            return i;
          }
          return (i + 1) % (solveEvents.length + 1);
        });
      }, 1000 / speed);
      return () => clearInterval(interval);
    }
  }, [paused, speed, solveEvents]);

  const currentState = programStateAtEvent(
    input,
    solveEvents,
    activeStateIndex
  );

  return (
    <div className="h-full flex flex-col">
      <div className="h-0"></div>
      <div className="p-4 h-24 border-b border-gray-300">
        <div className="flex justify-between">
          <div>
            <button
              className="border border-gray-500 rounded-md px-2 py-1 mr-4 w-20"
              onClick={() => {
                if (activeStateIndex === solveEvents.length - 1) {
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
              max={solveEvents.length}
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
            <option value={REAL_INPUT}>Real Input</option>
          </select>
        </div>
      </div>
      {/* <div>{JSON.stringify(solveEvents)}</div> */}
      {/* <div>{JSON.stringify(currentState)}</div> */}
      <div className="flex-grow overflow-y-auto">
        <svg
          viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
          fontFamily="Schoolbell, sans-serif"
        >
          <text
            x={GAME_ID_COL_WIDTH * 0.5}
            y={Y_MARGIN * 0.8}
            textAnchor="middle"
            fill="rgb(0, 0, 0, 0.5)"
            fontSize={Y_MARGIN * 0.4}
          >
            Game ID
          </text>
          {parsedInput.map((game, gameIndex) => (
            <g
              key={gameIndex}
              transform={`translate(0, ${yIndexForGameIndex(gameIndex)})`}
              className={`transition-transform duration-[${1000 / speed}ms]`}
            >
              <g transform={`translate(0, 0})`} width={GAME_ID_COL_WIDTH * 0.3}>
                <rect
                  width={GAME_ID_COL_WIDTH * 0.6}
                  height={GAME_HEIGHT * 0.8}
                  x={GAME_ID_COL_WIDTH * 0.3}
                  fill={
                    currentState.validGameIds.includes(gameIndex + 1)
                      ? "rgb(0, 255, 0, 0.3)"
                      : "none"
                  }
                />
                {currentState.validGameIds.includes(gameIndex + 1) && (
                  <text y={GAME_HEIGHT * 0.6} x={GAME_ID_COL_WIDTH * 0.1}>
                    +
                  </text>
                )}
                <text y={GAME_HEIGHT * 0.5} x={GAME_ID_COL_WIDTH * 0.3 + 3}>
                  <tspan
                    fill="rgb(0, 0, 0, 0.8)"
                    fill={
                      currentState.invalidGameIds.includes(gameIndex + 1)
                        ? "lightgray"
                        : "rgb(0, 0, 0, 0.8)"
                    }
                    fontWeight={"bold"}
                    fontSize={GAME_HEIGHT * 0.4}
                    style={{
                      textDecoration: currentState.invalidGameIds.includes(
                        gameIndex + 1
                      )
                        ? "line-through"
                        : "none",
                    }}
                  >
                    {gameIndex + 1}
                  </tspan>
                </text>
              </g>
              {game.draws.map((draw, drawIndex) => (
                <g
                  key={drawIndex}
                  transform={`translate(${
                    GAME_ID_COL_WIDTH + 10 + drawIndex * DRAW_WIDTH
                  }, 0)`}
                >
                  <rect
                    width={DRAW_WIDTH * 0.8}
                    height={GAME_HEIGHT * 0.8}
                    fill={
                      currentState.currentEvent.tag === "VisitDraw" &&
                      currentState.currentEvent.gameIndex === gameIndex &&
                      currentState.currentEvent.drawIndex === drawIndex
                        ? "red"
                        : "rgb(200, 200, 200)"
                    }
                  />
                </g>
              ))}
            </g>
          ))}
          <g
            transform={`translate(0, ${yIndexForGameIndex(
              parsedInput.length
            )})`}
            className={`transition-transform duration-[${1000 / speed}ms]`}
          >
            <g transform={`translate(${GAME_ID_COL_WIDTH * 0.2}, 0)`}>
              <rect
                width={GAME_ID_COL_WIDTH}
                height={FINAL_ROW_HEIGHT}
                stroke={"rgb(0, 0, 0, 0.5)"}
                fill={currentState.solved ? "rgb(0, 255, 0, 0.3)" : "white"}
              />
              <text
                y={FINAL_ROW_HEIGHT * 0.6}
                x={GAME_ID_COL_WIDTH * 0.1}
                fontSize={FINAL_ROW_HEIGHT * 0.5}
                fill={
                  currentState.solved
                    ? "rgb(0, 0, 0, 0.8)"
                    : "rgb(0, 0, 0, 0.4)"
                }
              >
                {currentState.sum}
              </text>
            </g>

            <text y={FINAL_ROW_HEIGHT * 0.6} fontSize={FINAL_ROW_HEIGHT * 0.5}>
              =
            </text>
          </g>
        </svg>
      </div>
    </div>
  );
};
