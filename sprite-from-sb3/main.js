import htmlEscape from "./../lib/htmlEscape.js";

const sb3Input = document.getElementById("sb3Input");
const spriteSelector = document.getElementById("spriteSelector");
const submit = document.querySelector("#submit");
sb3Input.value = "";
sb3Input.addEventListener("change", function (e) {
  const file = e.target.files[0];
  if (!file) return;
  JSZip.loadAsync(file).then(function (zip) {
    if (!zip.files["project.json"]) {
      alert("project.jsonが見つからないじゃない！？sb3ファイル以外なんかよこさないでよっ！");
      return;
    }
    zip.files["project.json"].async("string").then(function (jsonStr) {
      try {
        const json = JSON.parse(jsonStr);
        console.log(json);
        spriteSelector.innerHTML = "";
        json.targets.forEach((element, i) => {
          const spriteSelectorElement = document.createElement("div");
          spriteSelectorElement.innerHTML = `<label><input type="radio" name="spriteSelector" data-index="${i}">${htmlEscape(element.name) + (element.isStage ? " (非推奨)" : "")}</label>`;
          spriteSelector.append(spriteSelectorElement);
        });
        spriteSelector.childNodes[1].childNodes[0].childNodes[0].checked = true;
        window.onbeforeunload = e => e.preventDefault();
        submit.style.display = "block";
      }catch(err){
        alert("JSONの解析に失敗したんだけど！？変なファイルよこさないでよっ！");
        spriteSelector.innerHTML = "";
        submit.style.display = "none";
      }
    });
  }).catch(function (err){
    alert("sb3の展開に失敗したんだけど！？変なファイルよこさないでよっ！");
    spriteSelector.innerHTML = "";
    submit.style.display = "none";
  });
});

submit.addEventListener("click", function () {
  if (!file) {
    alert("sb3ファイルが選択されていないじゃない！？勝手に選択解除しないでよっ！"); // sb3InputでEventListenerを設定してるので、どう考えてもこんな状況になる前に更新が行われるはず
    return
  }
    const selectedSprite = spriteSelector.querySelector("input[name='spriteSelector']:checked");
  if (!selectedSprite) {
    alert("スプライトが選択されていないじゃない！？");
    return;
  }
  const index = selectedSprite.dataset.index;
  const file = sb3Input.files[0];
    JSZip.loadAsync(file).then(function (zip) {
    if (!zip.files["project.json"]) {
      alert("project.jsonが見つからないじゃない！？sb3ファイル以外なんかよこさないでよっ！");
      return;
    }
    zip.files["project.json"].async("string").then(function (jsonStr) {
      try {
        const json = JSON.parse(jsonStr);
        spriteSelector.innerHTML = "";
        json.targets.forEach((element, i) => {
          const spriteSelectorElement = document.createElement("div");
          spriteSelectorElement.innerHTML = `<label><input type="radio" name="spriteSelector" data-index="${i}">${htmlEscape(element.name) + (element.isStage ? " (非推奨)" : "")}</label>`;
          spriteSelector.append(spriteSelectorElement);
        });
        spriteSelector.childNodes[1].childNodes[0].childNodes[0].checked = true;
      }catch(err){
        alert("JSONの解析に失敗したんだけど！？変なファイルよこさないでよっ！");
      }
      submit.style.display = "block";
    });
  }).catch(function (err){
    alert("sb3の展開に失敗したんだけど！？変なファイルよこさないでよっ！");
  });

});