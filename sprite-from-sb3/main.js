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
        const firstSprite = spriteSelector.querySelectorAll("input[type='radio']")[1];
        if(firstSprite) firstSprite.checked = true;
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
  const file = sb3Input.files[0];
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
  JSZip.loadAsync(file).then(function (zip) {
    zip.files["project.json"].async("string").then(function (jsonStr) {
      const sprite = JSON.parse(jsonStr).targets[index];
      if (sprite.isStage && !confirm("ステージを選択しているようです。Scratchで読み込んだ場合の動作は一切保証されませんが、よろしいですか？")){
        return;
      }
      submit.style.display = "block";
    });
    // ここからが本番
    // 圧縮レベル指定できたら最高じゃないか？
    const sprite3 = new JSZip();
    sprite3.file("sprite.json", sprite);
    // スプライトのアセットをコピーする
    // 圧縮してダウンロードできるようにする
    // そのうち「他のスプライトを抽出」ができればいいかも
  }).catch(function (err){
    alert("sb3の展開に失敗したんだけど！？変なファイルよこさないでよっ！");
  });
});