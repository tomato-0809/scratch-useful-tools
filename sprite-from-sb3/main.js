import htmlEscape from "./../lib/htmlEscape.js";

const sb3Input = document.getElementById("sb3Input");
const spriteSelector = document.getElementById("spriteSelector");
sb3Input.value = "";
sb3Input.addEventListener("change", function (e) {
  window.onbeforeunload = e => e.preventDefault();
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
      const submit = document.createElement("button"); // 決定ボタンを作れ
      submit.id = "submit";
      submit.textContent = "決定";
      spriteSelector.after(submit);
    });
  }).catch(function (err){
    alert("sb3の展開に失敗したんだけど！？変なファイルよこさないでよっ！");
  });
});