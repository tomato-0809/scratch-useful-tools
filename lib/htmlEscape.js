export default function escapeHTMLWithDOM(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}