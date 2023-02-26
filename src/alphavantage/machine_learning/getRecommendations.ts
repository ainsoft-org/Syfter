export const getRecommendations = (neigs, forUser, minRating = 0.8, forIgnore: string[]= []) => {
  const reactionsList = {};

  for(let i=0; i<neigs.length; i++) {
    for(let j=0; j<neigs[i].user.reactions.length; j++) {
      const isDefined = forUser.reactions.find(fav => fav.asset.toString() === neigs[i].user.reactions[j].asset.toString());
      const toIgnore = forIgnore.find(ignore => ignore === neigs[i].user.reactions[j].asset.toString());
      if(isDefined || toIgnore) continue;

      reactionsList[neigs[i].user.reactions[j].asset] = reactionsList[neigs[i].user.reactions[j].asset] ?
        [...reactionsList[neigs[i].user.reactions[j].asset], neigs[i].user._id.toString()] : [neigs[i].user._id.toString()];
    }
  }

  const res = [];

  for(const favourite in reactionsList) {
    let sum1 = 0;
    let sum2 = 0;

    for(const userId of reactionsList[favourite]) {
      const user = neigs.find(neig => neig.user._id.toString() === userId);
      const rating = user.user.reactions.find(fav => fav.asset.toString() === favourite).isLiked;

      sum1 += (rating - user.avRating) * user.w;
      sum2 += Math.abs(user.w);
    }

    let predictedRating = forUser.avRatingForUser + sum1 / sum2;
    if(isNaN(predictedRating)) predictedRating = 0;

    if(predictedRating >= minRating) {
      res.push({
        name: favourite,
        predictedRating
      });
    }
  }

  return res;

}