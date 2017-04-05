const textD3 = {};

/*
  1. Paragraphs --
  2. Sentences
  3. Words
*/

textD3.init = function(div) {
  if (!div) { console.error("Cannot initiate without an HTML Element"); }
  textD3.div = div;
  textD3.rect = textD3.div.getBoundingClientRect();
  textD3.sentenceAccessor = function(d) { return d; };
  textD3.wordAccessor = function(d) { return d; };

  textD3.lead = 5;
  textD3.paragraphSpacing = 10;

  return textD3;
};

textD3.createHTML = function() {
  const para = document.createElement("paragraph");
  textD3.data.element = para;
  textD3.data.forEach((d, i) => {
    const sentence = document.createElement("sentence");
    sentence.style.top = textD3.rect.top;
    sentence.style.left = textD3.rect.left;
    sentence.setAttribute("data-index", textD3.sentenceConstancy(d));
    d.element = sentence;
    d.sentence.forEach((e, j, arr) => {
      const word = document.createElement("word");
      word.style.top = "0px";
      word.style.left = "0px";
      word.setAttribute("data-index", textD3.wordConstancy(e));
      const text = arr.length-1>j ? textD3.wordAccessor(e) : textD3.wordAccessor(e)+".";
      const t = document.createTextNode(text);
      word.appendChild(t);
      e.element = word;
      sentence.appendChild(word);
    });
    para.appendChild(sentence);
  });
  return para;
}

textD3.textContent = function() {
  return textD3.data.map((d,i) => {
    return textD3.sentenceAccessor(d).map((e, i)=>e.word).join(" ");
  }).join(". ");
}

textD3.sentences = function() {
  return textD3.data.map((d,i) => {
    return textD3.sentenceAccessor(d).map(e => {
      return textD3.wordAccessor(e).join(" ")+".";
    });
  });
}

textD3.positionParagraphs = function() {
  const sentences = Array.from(textD3.div.querySelectorAll("sentence"));
  let comHeight = 0;
  let comWidth = 0;
  sentences.forEach((d, i) => {
    let words = Array.from(d.querySelectorAll("word"));
    words.forEach((e,j) => {
      if (comWidth+e.getBoundingClientRect().width > textD3.rect.width) {
        comHeight += 20;
        comWidth = 0;
      }
      e.style.left = comWidth+"px";
      e.style.top = comHeight+"px";
      comWidth += e.getBoundingClientRect().width+textD3.lead;
    });
  });
}

textD3.positionSentences = function() {
  const sentences = textD3.sentenceElements();
  let comHeight = 0;
  sentences.forEach((d, i) => {
    // d.style.top = (textD3.rect.top+comHeight+i*10)+"px";
    const words = d.wordElements;
    let comWidth = 0;
    let subComHeight = 0;
    words.forEach((x, j) => {
      const e = x.element;
      if (comWidth+e.getBoundingClientRect().width > textD3.rect.width) {
        comHeight += 20;
        comWidth = 0;
      }
      e.style.left = comWidth+"px";
      e.style.top = comHeight+"px";
      comWidth += e.getBoundingClientRect().width+textD3.lead;
    });
    comHeight += 20+textD3.paragraphSpacing;
  });
}

textD3.setLead = function(lead) {
  textD3.lead = lead;
  return textD3;
}

textD3.setSentenceAccessor = function(func, constancyFunction = null) {
  textD3.sentenceAccessor = func;
  textD3.sentenceConstancy = constancyFunction;
  return textD3;
}

textD3.setWordAccessor = function(func, constancyFunction = null) {
  textD3.wordAccessor = func;
  textD3.wordConstancy = constancyFunction;
  return textD3;
}

textD3.wordElements = function() {
  const wordEle = [];
  textD3.data.forEach(d => {
    d.sentence.forEach(e => {
      wordEle.push( { element: e.element, data: e });
    });
  });
  return wordEle;
}

textD3.sentenceElements = function() {
  const sentenceElements = [];
  textD3.data.forEach(d => {
    const wordEle = [];
    d.sentence.forEach(e => {
      wordEle.push( { element: e.element, data: e });
    });
    sentenceElements.push( { element: d.element, data: d.data, wordElements: wordEle });
  });
  return sentenceElements;
}

textD3.setData = function(data) {
  textD3.data = data;
  return textD3;
}
