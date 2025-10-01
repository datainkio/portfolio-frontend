export function collapsible(content, label, accordion) {
  return `
      <input type="radio" name="${accordion}"/>
      <label class="collapse-title">${label}</label>
      <div class="collapse-content">${content}</div>
  `;
}
