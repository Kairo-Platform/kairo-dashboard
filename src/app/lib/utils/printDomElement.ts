export function printDomElement(element?: HTMLElement | null): void {
  if (!element) return;

  element.classList.add("printCss");

  const printId = "printSvgId";
  const name = ".printCss";
  const rules =
    "-webkit-print-color-adjust:exact;print-color-adjust:exact;height:100%;width:100%;position:fixed;top:0;left:0;margin:0;";

  const style = document.createElement("style");
  style.id = printId;
  style.media = "print";
  document.head.appendChild(style);

  const sheet = (style.sheet || null) as CSSStyleSheet | null;
  if (sheet && typeof sheet.insertRule === "function") {
    try {
      sheet.insertRule(`${name} { ${rules} }`, 0);
    } catch (e) {
      style.appendChild(document.createTextNode(`${name} { ${rules} }`));
    }
  } else {
    const ss = (style as any).styleSheet;
    if (ss && typeof ss.addRule === "function") {
      try {
        ss.addRule(name, rules);
      } catch (e) {
        style.appendChild(document.createTextNode(`${name} { ${rules} }`));
      }
    } else {
      style.appendChild(document.createTextNode(`${name} { ${rules} }`));
    }
  }

  window.print();

  setTimeout(() => {
    element.classList.remove("printCss");
    const elem = document.getElementById(printId);
    if (elem) elem.remove();
  }, 500);
}
