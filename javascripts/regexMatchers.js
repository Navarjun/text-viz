const RegExMatchers = {};
RegExMatchers.specialCharacters = "a-zA-Z\d\-_.,\s";

RegExMatchers.match = function(str) {
  if (typeof str != "string") {
    console.error("RegExMatchers.match needs an argument of string type");
  }

  let match = RegExMatchers.Year_Specific(str);
  if (!match) {
    match = RegExMatchers.Year_Begin(str);
  }
  if (!match) {
    match = RegExMatchers.Year_Approx(str);
  }
  return match;
}

// RegExMatchers.Year_Range = function(str) { // in 1976
//   const regex = /from (\d\d\d\d) (until|till|to) (\d\d\d\d)( |^\w\s)/igu;
//   const matchedObj = regex.exec(str);
//
//   if (matchedObj && matchedObj[1] && !isNaN(parseInt(matchedObj[1]))) {
//     return [{
//       tag: "year-specific",
//       index: matchedObj.index,
//       match: parseInt(matchedObj[1]),
//       isSpecific: true
//     },{}];
//   }
//   return undefined;
// }

RegExMatchers.Year_Specific = function(str) { // in 1976
  const regex = /in (\d\d\d\d)( |^\w\s)/igu;
  const matchedObj = regex.exec(str);

  if (matchedObj && matchedObj[1] && !isNaN(parseInt(matchedObj[1]))) {
    return {
      tag: "year-specific",
      index: matchedObj.index,
      match: parseInt(matchedObj[1]),
      isSpecific: true
    };
  }
  return undefined;
}

RegExMatchers.Year_Begin = function(str) { // in 1976
  const regex = /since (\d\d\d\d)( |[^\w\s])/igu;
  const matchedObj = regex.exec(str);
  if (matchedObj && matchedObj[1] && !isNaN(parseInt(matchedObj[1]))) {
    return {
      tag: "year-begin",
      index: matchedObj.index,
      match: parseInt(matchedObj[1]),
      isSpecific: false
    };
  }
  return undefined;
}

RegExMatchers.Year_Approx = function(str) { // in 1976
  const regex = /(\d\d\d\d)/igu;
  const matchedObj = regex.exec(str);
  if (matchedObj && matchedObj[1] && !isNaN(parseInt(matchedObj[1]))) {
    return {
      tag: "year-approx",
      index: matchedObj.index,
      match: parseInt(matchedObj[1]),
      isSpecific: false
    };
  }
  return undefined;
}
