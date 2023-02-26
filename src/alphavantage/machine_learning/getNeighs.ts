export function getNeighs(dataFrame, userId, k = 5) {
  const data = dataFrame.map(item => item.toObject());

  const forUserIndex = data.findIndex(user => user._id.toString() === userId)
  if(forUserIndex === -1) return "user not found";
  const forUser = {...data[forUserIndex]};
  data.splice(forUserIndex, 1);

  let sumRatingForUser = 0;
  for(let j=0; j<forUser.reactions.length; j++) {
    sumRatingForUser += forUser.reactions[j].isLiked;
  }
  const avRatingForUser = sumRatingForUser / forUser.reactions.length;

  const res = {
    kNN: [],
    forUser
  };

  for(let i=0; i<data.length; i++) {
    const userReactions = {};
    let sumRating = 0;
    for(let j=0; j<data[i].reactions.length; j++) {
      userReactions[data[i].reactions[j].asset.toString()] = data[i].reactions[j];
      sumRating += data[i].reactions[j].isLiked;
    }
    const avRating = sumRating / data[i].reactions.length;

    let sum1 = 0;
    let sum2 = 0;
    let sum3 = 0;

    for(let f=0; f<forUser.reactions.length; f++) { // 0.2 sec
      const isDefined = userReactions[forUser.reactions[f].asset.toString()];
      if(isDefined) {
        sum1 += (forUser.reactions[f].isLiked - avRatingForUser) * (isDefined.isLiked - avRating);
        sum2 += Math.pow(forUser.reactions[f].isLiked - avRatingForUser, 2);
        sum3 += Math.pow(isDefined.isLiked - avRating, 2);
      }
    }

    let w = sum1 / (Math.sqrt(sum2) * Math.sqrt(sum3));
    if(isNaN(w)) w = 0;
    // console.log(w)

    res.kNN.push({
      avRating,
      w,
      user: data[i]
    });

  }

  res.kNN = res.kNN.sort((a, b) => {
    return b.w - a.w;
  }).slice(0, k);

  res.forUser.avRatingForUser = avRatingForUser;

  return res;

}