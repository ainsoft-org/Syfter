import { randomInt } from "crypto";

export function randomNumberCode (length: number): string {
  let result = "";
  for(let i=0; i<length; i++) {
    result += String(randomInt(0, 10))
  }

  return result;
}