const canvas = document.getElementById("canvas");

canvas.addEventListener("focusout", () => {
  textD3.init(canvas);
});

canvas.addEventListener("click", function(){
  // this.innerHTML = textD3.textContent();
  this.contentEditable='true';
  canvas.innerHTML = textD3.textContent();
  document.querySelectorAll("button").forEach(d => {
    d.classList.remove("active");
  });
  processText();
});

let textContent, textD3Obj;
function processText() {
  textContent = canvas.textContent.split(".").map(str => {
      var words = str.trim().replace(/([ .,;]+)/g,'§sep§').split('§sep§');

      return words.map((d, i) => {
        return {
          word: d,
          id: i
        }
      });
    }).map((d, i) => {
      const timeMentions = RegExMatchers.match(d.map(e=>e.word).join(" ")+".");
      d.forEach(e => {
        if (timeMentions && e.word == timeMentions.match) {
          e.isTime = true;
        }
      });
      const str = d.map(e=>e.word).join(" ")+".";
      const match = RegExMatchers.match(d.map(e=>e.word).join(" ")+".");
      return {
        sentence: d,
        id: i,
        timeMentions: match
      };
    });
  if (!textD3Obj) {
    textD3Obj = textD3.init(canvas)
      .setSentenceAccessor(d => d.sentence, d => d.id)
      .setWordAccessor(d => d.word, d => d.id);
  }
  textD3Obj.setData(textContent);
  console.log(textContent);
  textContent.forEach(d => {
    if (d.timeMentions) {
      d.sentence.forEach(e => {
        if (e.word.includes(d.timeMentions.match)) {
          e.timeMentions = d.timeMentions;
        }
      });
    }
  });
}
processText();
var htmlCreated = false;
document.getElementById("createHTML")
  .addEventListener("click", function() {
    this.classList.add("active");
    canvas.innerHTML = "";
    canvas.appendChild(textD3Obj.createHTML());
    htmlCreated = true;
  });

document.getElementById("break")
  .addEventListener("click", function() {
    if (!htmlCreated) {
      canvas.innerHTML = "";
      canvas.appendChild(textD3Obj.createHTML());
      htmlCreated = true;
    }
    this.classList.add("active");
    canvas.innerHTML = "";
    canvas.appendChild(textD3Obj.createHTML());
    textD3Obj.positionParagraphs();
  });

document.getElementById("breakPara")
  .addEventListener("click", function() {
    this.classList.add("active");
    textD3.positionSentences();
  });

document.getElementById("highlight")
  .addEventListener("click", function() {
    this.classList.add("active");

    textD3.wordElements().forEach((d,i) => {
      if (d.data && d.data.timeMentions) {
        TweenMax.to(d.element, .5, { ease: Expo.easeOut, "background-color": "rgb(250, 180, 180, 1)" });
      }
    });
  });
