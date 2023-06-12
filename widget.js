document.addEventListener("DOMContentLoaded", function () {
  const synth = window.speechSynthesis;
  let utterance = null;

  const speakText = () => {
    const textToSpeak = document.body.innerText;
    utterance = new SpeechSynthesisUtterance(textToSpeak);
    synth.speak(utterance);
  };

  const stopSpeaking = () => {
    if (synth.speaking) {
      synth.cancel();
    }
  };

  const handleButtonClick = (event) => {
    if (event.target.dataset.key === "text-to-speech") {
      if (synth.speaking) {
        stopSpeaking();
      } else {
        speakText();
      }
    }
  };

  document.addEventListener("click", handleButtonClick);

  let t = { states: {} };
  const saveStatesToCookie = () => {
    const expirationDate = new Date();
    expirationDate.setTime(expirationDate.getTime() + NaN);
    let cookieString = "expires=" + expirationDate.toUTCString();
    document.cookie = "asw=" + JSON.stringify(t) + ";" + cookieString + ";path=/";
  };

  const readStatesFromCookie = () => {
    let cookieValue = "";
    const decodedCookie = decodeURIComponent(document.cookie).split(";");
    for (let i = 0; i < decodedCookie.length; i++) {
      let cookie = decodedCookie[i];
      while (cookie.charAt(0) === " ") {
        cookie = cookie.substring(1);
      }
      if (cookie.indexOf("asw=") === 0) {
        cookieValue = cookie.substring("asw=".length, cookie.length);
        break;
      }
    }
    return cookieValue;
  };

  let savedStates = readStatesFromCookie();
  try {
    savedStates = JSON.parse(savedStates);
  } catch (error) {}

  t = { states: {}, ...savedStates };

  let a = ["format_size", "add", "remove", "restart_alt", "close"];

  const createButtonMarkup = (buttonData, buttonType) => {
    let buttonMarkup = "";
    for (let i = buttonData.length; i--; ) {
      let item = buttonData[i];
      let state = t.states[item.key];
      if (buttonType === "asw-filter" && t.states.contrast === item.key) {
        state = true;
      }
      buttonMarkup += `
        <div class="asw-btn ${buttonType || ""} ${state ? "asw-selected" : ""}" 
          role="button" 
          aria-pressed="false" 
          data-key="${item.key}" 
          arai-label="${item.label}" 
          title="${item.label}"
        >
          <span class="material-icons">${item.icon}</span>${item.label}
        </div>
      `;
      a.push(item.icon);
    }
    return buttonMarkup;
  };

  let i = createButtonMarkup(
    [
      { label: "Readable Font", key: "readable-font", icon: "rtt" },
      { label: "Highlight Links", key: "highlight-links", icon: "link" },
      { label: "Highlight Title", key: "highlight-title", icon: "title" },
    ]
  );

  let o = createButtonMarkup(
    [
      { label: "Monochrome", key: "monochrome", icon: "filter_b_and_w" },
      { label: "Low Saturation", key: "low-saturation", icon: "gradient" },
      { label: "High Saturation", key: "high-saturation", icon: "filter_vintage" },
      { label: "High Contrast", key: "high-contrast", icon: "tonality" },
      { label: "Light Contrast", key: "light-contrast", icon: "brightness_5" },
      { label: "Dark Contrast", key: "dark-contrast", icon: "nightlight" },
    ],
    "asw-filter"
  );

  let l = createButtonMarkup(
    [
      { label: "Text to Speech", key: "text-to-speech", icon: "record_voice_over" },
      { label: "Big Cursor", key: "big-cursor", icon: "mouse" },
      { label: "Stop Animations", key: "stop-animations", icon: "motion_photos_off" },
      { label: "Reading Guide", key: "readable-guide", icon: "local_library" },
    ],
    "asw-tools"
  );

  var r = document.createElement("div");
  r.innerHTML = `
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons&text=${a.toString()}" rel="stylesheet">
    <style>
      .asw-menu,
      .asw-menu-btn {
        position: fixed;
        left: 20px;
        transition: 0.3s;
        z-index: 500000;
      }
      
      .asw-widget {
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
        font-weight: 400;
        -webkit-font-smoothing: antialiased;
      }
      
      .asw-widget * {
        box-sizing: border-box;
      }
      
      .asw-menu-btn {
        bottom: 20px;
        background: #0048ff!important;
        box-shadow: 0 5px 15px 0 rgb(37 44 97 / 15%), 0 2px 4px 0 rgb(93 100 148 / 20%);
        border-radius: 50%;
        align-items: center;
        justify-content: center;
        transform: translateY(0);
        width: 64px;
        height: 64px;
        display: flex;
        fill: white;
        cursor: pointer;
      }
      
      .asw-menu-btn svg {
        width: 34px;
        height: 34px;
        min-height: 34px;
        min-width: 34px;
        max-width: 34px;
        max-height: 34px;
        background: 0 0!important;
      }
      
      .asw-menu-btn:hover {
        transform: scale(1.05);
      }
      
      .asw-menu {
        display: none;
        top: 20px;
        border-radius: 8px;
        box-shadow: -1px 0 20px -14px #000;
        opacity: 1;
        overflow: hidden;
        background: #fff;
        width: 500px;
        line-height: 1;
        font-size: 14px;
        height: calc(100vh - 40px - 75px);
        letter-spacing: 0.015em;
      }
      
      .asw-btn,
      .asw-footer a {
        font-size: 14px!important;
      }
      
      .asw-menu-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        background: #0334b1;
        color: #fff;
        padding-left: 12px;
        font-weight: 600;
      }
      
      .asw-menu-header>div {
        display: flex;
      }
      
      .asw-menu-header div[role=button] {
        padding: 12px;
        cursor: pointer;
      }
      
      .asw-menu-header div[role=button]:hover,
      .asw-minus:hover,
      .asw-plus:hover {
        opacity: 0.8;
      }
      
      .asw-items {
        display: flex;
        gap: 10px;
        padding: 0;
        list-style: none;
        flex-wrap: wrap;
        justify-content: space-between;
      }
      
      .asw-btn {
        width: 140px;
        height: 120px;
        border-radius: 8px;
        padding: 15px;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        text-align: center;
        color: #333;
        background: #ecf3ff;
        border: 3px solid #ecf3ff;
        transition: background-color 0.3s;
        cursor: pointer;
      }
      
      .asw-btn .material-icons {
        margin-bottom: 16px;
      }
      
      .asw-btn:hover {
        border-color: #0048ff;
      }
      
      .asw-btn.asw-selected {
        background: #0048ff;
        color: #fff;
        border-color: #0048ff;
      }
      
      .asw-footer {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        background: #0334b1;
        padding: 16px;
        text-align: center;
        color: #fff;
      }
      
      .asw-footer a {
        text-decoration: underline;
        color: #fff;
        background: 0 0!important;
      }
      
      .asw-menu-content {
        overflow: scroll;
        max-height: calc(100% - 80px);
        color: #000;
      }
      
      .asw-card {
        margin: 0 15px 30px;
      }
      
      .asw-card-title {
        font-size: 18px;
        padding: 15px 0;
      }
      
      .asw-adjust-font {
        background: #ecf3ff;
        padding: 20px 25px;
        margin-bottom: 16px;
      }
      
      .asw-adjust-font .label {
        display: flex;
        align-items: center;
      }
      
      .asw-adjust-font>div {
        display: flex;
        justify-content: space-between;
        margin-top: 20px;
        align-items: center;
        font-size: 16px;
        font-weight: 700;
      }
      
      .asw-adjust-font div[role=button] {
        background: #0648ff;
        border-radius: 50%;
        width: 36px;
        height: 36px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #fff;
        cursor: pointer;
      }
      
      .asw-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 10000;
        display: none;
      }
      
      @media only screen and (max-width: 560px) {
        .asw-menu {
          width: calc(100vw - 20px);
          left: 10px;
        }
      
        .asw-btn {
          width: calc(50% - 8px);
        }
      }
    </style>
    <div class="asw-widget">
      <div class="asw-menu-btn" title="Open Accessibility Menu" role="button" aria-expanded="false">
        <svg xmlns="http://www.w3.org/2000/svg" style="width: 34px; height: 34px; min-height: 34px; min-width: 34px; max-width: 34px; max-height: 34px;" viewBox="0 0 24 24" width="34px" height="34px">
          <path d="M0 0h24v24H0V0z" fill="none"/>
          <path d="M20.5 6c-2.61.7-5.67 1-8.5 1s-5.89-.3-8.5-1L3 8c1.86.5 4 .83 6 1v13h2v-6h2v6h2V9c2-.17 4.14-.5 6-1l-.5-2zM12 6c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z"/>
        </svg>
      </div>
      <div class="asw-menu">
        <div class="asw-menu-header">
          Accessibility Menu
          <div>
            <div role="button" class="asw-menu-reset" title="Reset Settings">
              <span class="material-icons">restart_alt</span>
            </div>
            <div role="button" class="asw-menu-close" title="Close Accessibility Menu">
              <span class="material-icons">close</span>
            </div>
          </div>
        </div>
        <div class="asw-menu-content">
          <div class="asw-card" style="margin-top: 15px;">
            <div class="asw-card-title">Content Adjustments</div>
            <div class="asw-adjust-font">
              <div class="label">
                <span class="material-icons" style="margin-right: 8px;">format_size</span>
                Adjust Font Size
              </div>
              <div>
                <div class="asw-minus" data-key="font-size" role="button" aria-pressed="false">
                  <span class="material-icons">remove</span>
                </div>
                <div class="asw-amount">
                  ${
                    t.states.fontSize && t.states.fontSize !== 1
                      ? `${parseInt(100 * t.states.fontSize)}%`
                      : "Default"
                  }
                </div>
                <div class="asw-plus" data-key="font-size" role="button" aria-pressed="false">
                  <span class="material-icons">add</span>
                </div>
              </div>
            </div>
            <div class="asw-items">${i}</div>
          </div>
          <div class="asw-card" style="margin-top: 15px;">
            <div class="asw-card-title">Color Adjustments</div>
            <div class="asw-items">${o}</div>
          </div>
          <div class="asw-card" style="margin-top: 15px;">
            <div class="asw-card-title">Tools</div>
            <div class="asw-items">${l}</div>
          </div>
        </div>
        <div class="asw-footer">
          <a href="https://github.com/nafeeur/accessibility-widget/tree/main">Accessibility Widget</a>
        </div>
      </div>
      <div class="asw-overlay"></div>
    </div>`;

  const c = function (styles, id) {
    let styleElement = document.getElementById(id) || document.createElement("style");
    styleElement.innerHTML = styles;
    if (!styleElement.id) {
      styleElement.id = id;
      document.head.appendChild(styleElement);
    }
  };

  const d = function (value, property) {
    let prefixes = ["-o-", "-ms-", "-moz-", "-webkit", ""];
    let result = "";
    for (var i = prefixes.length; i--; ) {
      result += prefixes[i] + (property || "filter") + ":" + value + ";";
    }
    return result;
  };

  const p = function (filter) {
    let css = "";
    if (filter) {
      let additionalStyles = "";
      if (filter === "dark-contrast") {
        additionalStyles = "color: #fff !important;fill: #FFF !important;background-color: #000 !important;";
      } else if (filter === "light-contrast") {
        additionalStyles = "color: #000 !important;fill: #000 !important;background-color: #FFF !important;";
      } else if (filter === "high-contrast") {
        additionalStyles += d("contrast(125%)");
      } else if (filter === "high-saturation") {
        additionalStyles += d("saturate(200%)");
      } else if (filter === "low-saturation") {
        additionalStyles += d("saturate(50%)");
      } else if (filter === "monochrome") {
        additionalStyles += d("grayscale(100%)");
      }
      let selectors = [""];
      if (filter === "dark-contrast" || filter === "light-contrast") {
        selectors = [
          "h1",
          "h2",
          "h3",
          "h4",
          "h5",
          "h6",
          "img",
          "p",
          "i",
          "svg",
          "a",
          "button",
          "label",
          "li",
          "body",
          "ol",
          "background",
        ];
      }
      for (var i = selectors.length; i--; ) {
        css += '[data-asw-filter="' + filter + '"] ' + selectors[i] + "{" + additionalStyles + "}";
      }
    }
    c(css, "asw-filter-style");
    if (filter) {
      document.documentElement.setAttribute("data-asw-filter", filter);
    } else {
      document.documentElement.removeAttribute("data-asw-filter", filter);
    }
  };

  const u = function () {
    let elements = [
      { id: "highlight-title", childrenSelector: ["h1", "h2", "h3", "h4", "h5", "h6"], css: "outline: 2px solid #0048ff !important;outline-offset: 2px !important;" },
      { id: "highlight-links", childrenSelector: ["a[href]"], css: "outline: 2px solid #0048ff !important;outline-offset: 2px !important;" },
      { id: "readable-font", childrenSelector: ["", "h1", "h2", "h3", "h4", "h5", "h6", "img", "p", "i", "svg", "a", "button", "label", "li", "ol"], css: "font-family: OpenDyslexic3,Comic Sans MS,Arial,Helvetica,sans-serif !important;" },
    ];

    let additionalStyles = "";
    for (var i = elements.length; i--; ) {
      let element = elements[i];
      if (t.states[element.id]) {
        document.documentElement.classList.toggle(element.id, !!t.states[element.id]);
        if (t.states[element.id]) {
          for (var j = element.childrenSelector.length; j--; ) {
            additionalStyles += "." + element.id + " " + element.childrenSelector[j] + "{" + element.css + "}";
          }
        }
      }
    }

    var readableGuideContainer = document.querySelector(".asw-rg-container");
    if (t.states["readable-guide"]) {
      if (!readableGuideContainer) {
        var container = document.createElement("div");
        container.setAttribute("class", "asw-rg-container");
        container.innerHTML =
          '<style> .asw-rg {position: fixed;top: 0;left: 0;right: 0;width: 100%;height: 0;pointer-events: none;background-color: rgba(0,0,0,.5);z-index: 1000000; }</style><div class="asw-rg asw-rg-top"></div><div class="asw-rg asw-rg-bottom" style="top: auto;bottom: 0;"></div>\n';

        let topElement = container.querySelector(".asw-rg-top");
        let bottomElement = container.querySelector(".asw-rg-bottom");

        let gap = 20;
        window.onScrollReadableGuide = function (event) {
          topElement.style.height = event.clientY - gap + "px";
          bottomElement.style.height = window.innerHeight - event.clientY - gap - gap + "px";
        };

        document.addEventListener("mousemove", window.onScrollReadableGuide, false);
        document.body.appendChild(container);
      }
    } else if (readableGuideContainer) {
      readableGuideContainer.remove();
      document.removeEventListener("mousemove", window.onScrollReadableGuide);
    }

    if (t.states["stop-animations"]) {
      additionalStyles += `\nbody * {${d("none !important", "transition")}${d("forwards !important", "animation-fill-mode")}${d("1 !important", "animation-iteration-count")}${d(".01s !important", "animation-duration")}\n}`;
    }

    if (t.states["big-cursor"]) {
      additionalStyles += "\nbody * {cursor: url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='64' viewBox='0 0 512 512'%3E%3Cpath d='M429.742 319.31L82.49 0l-.231 471.744 105.375-100.826 61.89 141.083 96.559-42.358-61.89-141.083 145.549-9.25zM306.563 454.222l-41.62 18.259-67.066-152.879-85.589 81.894.164-333.193 245.264 225.529-118.219 7.512 67.066 152.878z' xmlns='http://www.w3.org/2000/svg'/%3E%3C/svg%3E\") ,default !important;\n}";
    }

    if (t.states["readable-font"]) {
      additionalStyles += '\n@font-face {font-family: OpenDyslexic3;src: url("https://website-widgets.pages.dev/fonts/OpenDyslexic3-Regular.woff") format("woff"), url("https://website-widgets.pages.dev/fonts/OpenDyslexic3-Regular.ttf") format("truetype");\n}';
    }

    c(additionalStyles, "asw-content-style");
  };

  const f = function (event) {
    event.preventDefault();
    let target = event.currentTarget;
    let key = target.dataset.key;

    if (target.classList.contains("asw-filter")) {
      document.querySelectorAll(".asw-filter").forEach(function (element) {
        element.classList.remove("asw-selected");
        element.setAttribute("aria-pressed", "false");
      });

      t.states.contrast = t.states.contrast !== key && key;
      if (t.states.contrast) {
        target.classList.add("asw-selected");
        target.setAttribute("aria-pressed", "true");
      }

      p(t.states.contrast);
    } else {
      t.states[key] = !t.states[key];
      target.classList.toggle("asw-selected", t.states[key]);
      target.setAttribute("aria-pressed", t.states[key] ? "true" : "false");
      u();
    }

    e();
  };

  const h = function (event, size) {
    let amount = false;
    if (!event && size) {
      amount = size;
    } else {
      let target = event.currentTarget;
      let key = target.dataset.key;
      let fontSize = parseFloat(t.states.fontSize) || 1;

      if (target.classList.contains("asw-minus")) {
        fontSize -= 0.1;
      } else {
        fontSize += 0.1;
      }

      size = Math.max(fontSize, 0.1);
      size = Math.min(size, 2);
      size = parseFloat(size.toFixed(2));

      if (target) {
        target.parentElement.querySelector(".asw-amount").innerHTML = size === 1 ? "Default" : (size > 1 ? "+" : "-") + parseInt(100 * size) + "%";
      }

      amount = size;
    }

    document
      .querySelectorAll("h1,h2,h3,h4,h5,h6,p,a,dl,dt,li,ol,th,td,span")
      .forEach(function (element) {
        if (!element.classList.contains("material-icons")) {
          let originalFontSize = element.getAttribute("data-asw-orgFontSize");
          if (!originalFontSize) {
            originalFontSize = parseInt(window.getComputedStyle(element, null).getPropertyValue("font-size"));
            element.setAttribute("data-asw-orgFontSize", originalFontSize);
          }

          let newFontSize = originalFontSize * size;
          element.style["font-size"] = newFontSize + "px";
        }
      });

    let amountText = "Default";
    if (size !== 1) {
      let sign = size > 1 ? "+" : "-";
      amountText = sign + parseInt(100 * size) + "%";
    }

    if (amount) {
      amount.innerHTML = amountText;
    }

    t.states.fontSize = size;
  };

  let menuElement = r.querySelector(".asw-menu");
  let overlayElement = r.querySelector(".asw-overlay");

  r.querySelector(".asw-menu-btn").addEventListener("click", function () {
    menuElement.style.display = menuElement.style.display === "block" ? "none" : "block";
    overlayElement.style.display = menuElement.style.display;
  }, false);

  menuElement.querySelector(".asw-menu-close").addEventListener("click", function () {
    menuElement.style.display = "none";
    overlayElement.style.display = menuElement.style.display;
  }, false);

  overlayElement.addEventListener("click", function () {
    menuElement.style.display = "none";
    overlayElement.style.display = menuElement.style.display;
  }, false);

  menuElement.querySelector(".asw-menu-reset").addEventListener("click", function () {
    t.states = {};
    p();
    u();
    h(undefined, 1);

    document.querySelectorAll(".asw-btn").forEach(function (element) {
      element.classList.remove("asw-selected");
      element.setAttribute("aria-pressed", "false");
    });

    document.querySelectorAll(".asw-amount").forEach(function (element) {
      element.innerHTML = "Default";
    });

    e();
  }, false);

  menuElement.querySelectorAll(".asw-btn").forEach(function (element) {
    element.addEventListener("click", f, false);
  });

  menuElement.querySelectorAll(".asw-adjust-font div[role='button']").forEach(function (element) {
    element.addEventListener("click", function (event) {
      h(event);
      e();
    }, false);
  });

  document.body.appendChild(r);

  if (s) {
    u();
    if (t.states.fontSize !== 1) {
      h(null, t.states.fontSize);
    }
    if (t.states.contrast) {
      p(t.states.contrast);
    }
  }
});
