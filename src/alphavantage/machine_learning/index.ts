import { getNeighs } from "./getNeighs";
import { HttpException, HttpStatus } from "@nestjs/common";
import { getRecommendations } from "./getRecommendations";

export const getRecommendationsML = (data, userId, forIgnore: string[] = []) => {
  const neigs: any = getNeighs(data, userId);
  if(neigs === "user not found") throw new HttpException('userId is not correct', HttpStatus.NOT_FOUND);

  const minRating = Number(process.env.ML_minRating);

  return getRecommendations(neigs.kNN, neigs.forUser, minRating, forIgnore);
}