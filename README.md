# AOC 2023

Goal: visualize the solution to AOC problems

I don't expect to solve all of them, but maybe I'll get thru a few...

## Architecture

- Each solution has a `ProgramState` type
- The algorithm emits `ProgramState` at every meaningful step
- The visualization is a stateless view of a `ProgramState`
- Possibly render transitions using a React animation library?

## Stretch goals

- Dynamic interactive inputs
- Use the viz to help program the solution
- The solution can only use state in the viz (a la [Viewpoint](https://www.youtube.com/watch?v=3b4rz6oIRic))
- 3D?
- make it feel hand drawn
- do math "by hand"

## Principles

- ~1 hour per visualization
- Make it fun