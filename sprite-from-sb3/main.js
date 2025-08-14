import htmlEscape from "../lib/htmlEscape.js";

const sb3Input = document.querySelector("#sb3Input");
const spriteSelector = document.querySelector("#spriteSelector");
const submit = document.querySelector("#submit");
const download = document.querySelector("#download");

sb3Input.value = "";
download.addEventListener("click", downloadListener);

sb3Input.addEventListener("change", function(e){
  const file = e.target.files[0];
  if (!file) return;
  JSZip.loadAsync(file).then(function(zip){
    if (!zip.files["project.json"]) {
      alert("project.jsonが見つからないじゃない！？sb3ファイル以外なんかよこさないでよっ！");
      return;
    }
    zip.files["project.json"].async("string").then(function(jsonStr){
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
      }catch(e){
        alert("JSONの解析に失敗したんだけど！？変なファイルよこさないでよっ！");
        spriteSelector.innerHTML = "";
        submit.style.display = "none";
      }
    });
  }).catch(function(){
    alert("sb3の展開に失敗したんだけど！？変なファイルよこさないでよっ！");
    spriteSelector.innerHTML = "";
    submit.style.display = "none";
  });
});

const a = document.createElement("a");
const downloadListener = function () {
  a.click();
}

submit.addEventListener("click", function(){
  if(a.href) URL.revokeObjectURL(a.href); // 先にrevokeしておく
  const file = sb3Input.files[0];
  if(!file){
    alert("sb3ファイルが選択されていないじゃない！？勝手に選択解除しないでよっ！"); // sb3InputでEventListenerを設定してるので、どう考えてもこんな状況になる前に更新が行われるはず
    return
  }
    const selectedSprite = spriteSelector.querySelector("input[name='spriteSelector']:checked");
  if(!selectedSprite){
    alert("スプライトが選択されていないじゃない！？");
    return;
  }
  const index = selectedSprite.dataset.index;
  JSZip.loadAsync(file).then(function(zip){
    zip.files["project.json"].async("string").then(async function(jsonStr){
      const sprite = JSON.parse(jsonStr).targets[index];
      if (sprite.isStage && !confirm("ステージを選択しているようです。Scratchで読み込んだ場合の動作は一切保証されませんが、よろしいですか？")){
        return;
      }
      const sprite3 = new JSZip();
      sprite3.file("sprite.json", JSON.stringify(sprite));
      // スプライトのアセットをコピーする

      // ダウンロード
      const sprite3Blob = await sprite3.generateAsync({type: "blob", compression: "DEFLATE"});
      a.href = URL.createObjectURL(sprite3Blob);
      a.download = `${sprite.name}.sprite3`;
      download.style.display = "block";
      download.click();
    });
  }).catch(function(){
    alert("sb3の展開に失敗したんだけど！？変なファイルよこさないでよっ！");
  });
});