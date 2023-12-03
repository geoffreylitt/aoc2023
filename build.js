// deploy script

// steps:
// run yarn build
// if that succeeds, copy everything in dist to ../homepage/source/aoc2023

import { exec } from "child_process";

exec("yarn build", (error, stdout, stderr) => {
  if (error) {
    console.error(`exec error: ${error}`);
    return;
  }
  console.log(`stdout: ${stdout}`);
  console.error(`stderr: ${stderr}`);

  exec("cp -r dist/* ../homepage/aoc2023", (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      return;
    }
    console.log(`stdout: ${stdout}`);
    console.error(`stderr: ${stderr}`);
  });
});
