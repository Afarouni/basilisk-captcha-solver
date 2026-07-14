/*! basilisk-captcha widget - de-obfuscated & renamed */
/*! bslk 1b3374f112a3bdea slot 139 */
(() => {
  'use strict';

  var Constants = function () {
    function Constants() {}
    Constants.serverUrl = "https://basiliskcaptcha.com";
    Constants.protocolVersion = 4;
    Constants.widgetVersion = "pool-2026-07-14-17c02338";
    Constants.videoManualUrl = "https://partner-25.wistia.com/medias/3my58mgg7b";
    Constants.challengeWidth = 372;
    Constants.canvasWidth = 318;
    Constants.canvasHeight = 252;
    Constants.puzzleSize = 64;
    Constants.clickCircleRadius = 20;
    Constants.sliderStartPosition = 8;
    Constants.totalIconsAmount = 3;
    Constants.lightColor = "#F5F9FF";
    Constants.darkColor = "#16191D";
    Constants.semiDarkColor = "#21252C";
    Constants.blueColor = "#0080FF";
    Constants.primaryBorderColor = "rgba(240, 242, 244, 0.1)";
    Constants.secondaryBorderColor = "rgba(0, 26, 51, 0.1)";
    Constants.loadingText = "Loading...";
    Constants.successText = "Great job!";
    Constants.failedText = "Please try again!";
    Constants.barText = "Slide to complete the puzzle";
    Constants.rotationBarText = "Slide to rotate the image upright";
    Constants.errorText = "Session expired. Please try again!";
    Constants.errorKeyText = "Invalid site key";
    Constants.humanText = "I'm not a robot";
    Constants.iconsOrderText = "Select in this order:";
    Constants.shortTimeout = 500;
    Constants.mediumTimeout = 750;
    Constants.standartTimeout = 1000;
    Constants.oneMinuteTimeout = 180000;
    Constants.threeMinutsTimeout = 180000;
    Constants.checkSite = "check-site";
    Constants.createChallenge = "create-challenge";
    Constants.slideChallenge = "slide-challenge";
    Constants.slideVerify = "slide-verify";
    Constants.rotationVerify = "rotation-verify";
    Constants.iconsChallenge = "icons-challenge";
    Constants.iconsVerify = "icons-verify";
    return Constants;
  }();
  var StyleUtils = function () {
    function StyleUtils() {}
    StyleUtils.setStyles = function (element, styles = {}) {
      for (var key in styles) {
        var value = styles[key];
        var property = key.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
        element.style.setProperty(property, value);
      }
    };
    StyleUtils.flexManipulation = function (element, justifyContent = "center") {
      this.setStyles(element, {
        display: "flex",
        justifyContent: justifyContent,
        alignItems: "center"
      });
    };
    StyleUtils.createDelayAnimation = function (delay, callback) {
      var startTime = null;
      function step(timestamp) {
        startTime ||= timestamp;
        if (timestamp - startTime < delay) {
          requestAnimationFrame(step);
        } else {
          callback();
        }
      }
      requestAnimationFrame(step);
    };
    return StyleUtils;
  }();
  function __assign() {
    __assign = Object.assign || function (target) {
      var source;
      for (var i = 1, len = arguments.length; i < len; i++) {
        for (var key in source = arguments[i]) {
          if (Object.prototype.hasOwnProperty.call(source, key)) {
            target[key] = source[key];
          }
        }
      }
      return target;
    };
    return __assign.apply(this, arguments);
  }
  var ElementsCreator = function () {
    function ElementsCreator() {
      this.spriteIconStartPosition = -2;
      this.orderIconSize = 22;
      this.spinnerSize = 28;
      this.commonSizeSmall = 24;
      this.commonSizeNormal = 40;
      this.microTimeout = 250;
      this.spacingSmall = 8;
      this.verifyButtonHoverColor = "#2791FA";
    }
    ElementsCreator.prototype.createElement = function (tagName, styles = {}) {
      var el = document.createElement(tagName);
      if (Object.keys(styles).length > 0) {
        StyleUtils.setStyles(el, styles);
      }
      return el;
    };
    ElementsCreator.prototype.createCanvas = function (styles = {}) {
      var canvas = this.createElement("canvas", styles);
      canvas.setAttribute("width", `${Constants.canvasWidth - 2}`);
      canvas.setAttribute("height", `${Constants.canvasHeight - 2}`);
      return canvas;
    };
    ElementsCreator.prototype.createIcon = function (options) {
      var self = this;
      var positionInput = options.position;
      var position = positionInput === undefined ? "" : positionInput;
      var width = options.width;
      var height = options.height;
      var hoverPositionInput = options.hoverPosition;
      var hoverPosition = hoverPositionInput === undefined ? "" : hoverPositionInput;
      var stylesInput = options.styles;
      var styles = stylesInput === undefined ? {} : stylesInput;
      var baseStyles = {
        width: width,
        height: height,
        background: `url('${Constants.serverUrl}/static/challenges/sprites/icons_sprite.png') no-repeat`,
        backgroundPosition: `${this.spriteIconStartPosition}px ${position}`
      };
      var icon = this.createElement("div", __assign(__assign({}, baseStyles), styles));
      if (hoverPosition) {
        icon.addEventListener("mouseover", function () {
          icon.style.backgroundPosition = `${self.spriteIconStartPosition}px ${hoverPosition}`;
        });
        icon.addEventListener("mouseleave", function () {
          icon.style.backgroundPosition = `${self.spriteIconStartPosition}px ${position}`;
        });
      }
      return icon;
    };
    ElementsCreator.prototype.createLink = function () {
      return this.createElement("link");
    };
    ElementsCreator.prototype.createOrderIcon = function (position = "") {
      return this.createIcon({
        position: position,
        width: `${this.orderIconSize}px`,
        height: `${this.orderIconSize}px`
      });
    };
    ElementsCreator.prototype.createControlIcon = function (position = "", hoverPosition = "") {
      return this.createIcon({
        position: position,
        hoverPosition: hoverPosition,
        width: `${this.commonSizeSmall}px`,
        height: `${this.commonSizeSmall}px`,
        styles: {
          marginRight: "9px",
          cursor: "pointer"
        }
      });
    };
    ElementsCreator.prototype.createCaptcha = function (darkMode) {
      return this.createElement("div", {
        position: "relative",
        minWidth: "250px",
        maxWidth: `${Constants.challengeWidth}px`,
        height: "88px",
        backgroundColor: darkMode ? Constants.darkColor : "white",
        borderRadius: "13px",
        display: "flex",
        alignItems: "center",
        padding: `${this.commonSizeSmall}px`,
        boxSizing: "border-box",
        boxShadow: "0 0 4px 1px rgba(0,0,0,.08)"
      });
    };
    ElementsCreator.prototype.createCheckbox = function (checked) {
      var checkbox = this.createElement("div", {
        width: `${this.commonSizeNormal}px`,
        height: `${this.commonSizeNormal}px`,
        backgroundColor: checked ? Constants.semiDarkColor : Constants.lightColor,
        border: `2px solid ${checked ? Constants.primaryBorderColor : Constants.secondaryBorderColor}`,
        borderRadius: "10px",
        marginRight: "12px",
        transition: "border-color 0.25s",
        boxSizing: "border-box"
      });
      StyleUtils.flexManipulation(checkbox);
      return checkbox;
    };
    ElementsCreator.prototype.createChecked = function () {
      return this.createElement("div", {
        width: `${this.commonSizeSmall}px`,
        height: `${this.commonSizeSmall}px`,
        borderRadius: "5px",
        backgroundColor: Constants.blueColor
      });
    };
    ElementsCreator.prototype.createHumanText = function (darkMode) {
      var span = this.createElement("span", {
        fontSize: "18.5px",
        fontWeight: 500,
        color: darkMode ? Constants.lightColor : "black",
        fontFamily: "Plus Jakarta Sans, sans-serif"
      });
      span.textContent = Constants.humanText;
      return span;
    };
    ElementsCreator.prototype.createHumanBlock = function () {
      return this.createElement("div", {
        display: "flex",
        alignItems: "center",
        cursor: "pointer"
      });
    };
    ElementsCreator.prototype.createErrorMessage = function () {
      var span = this.createElement("span", {
        position: "absolute",
        top: "4px",
        color: "red",
        fontSize: "13px",
        display: "none",
        fontFamily: "Plus Jakarta Sans, sans-serif"
      });
      span.textContent = Constants.errorText;
      return span;
    };
    ElementsCreator.prototype.createCaptchaValue = function () {
      var input = this.createElement("input");
      input.setAttribute("type", "hidden");
      input.setAttribute("name", "captcha-response");
      input.setAttribute("value", "");
      return input;
    };
    ElementsCreator.prototype.createPopup = function () {
      var popup = this.createElement("div", {
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(0, 0, 0, 0.3)",
        zIndex: 99,
        transition: "opacity 0.3s ease-in-out, visibility 0.3s ease-in-out"
      });
      popup.open = function () {
        StyleUtils.setStyles(popup, {
          opacity: "1",
          visibility: "visible",
          pointerEvents: "initial"
        });
      };
      popup.close = function () {
        StyleUtils.setStyles(popup, {
          opacity: "0",
          visibility: "hidden",
          pointerEvents: "none"
        });
      };
      return popup;
    };
    ElementsCreator.prototype.createPopupContent = function (darkMode) {
      return this.createElement("div", {
        width: `${Constants.challengeWidth}px`,
        height: "432px",
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        backgroundColor: darkMode ? Constants.darkColor : "white",
        padding: `${this.commonSizeSmall}px 27px`,
        borderRadius: "22px",
        boxSizing: "border-box",
        overflow: "hidden",
        fontFamily: "Plus Jakarta Sans, sans-serif",
        userSelect: "none"
      });
    };
    ElementsCreator.prototype.createCanvasWrapper = function () {
      return this.createElement("div", {
        position: "relative",
        width: `${Constants.canvasWidth}px`,
        height: `${Constants.canvasHeight}px`,
        borderRadius: "12px",
        overflow: "hidden",
        backgroundColor: "transparent"
      });
    };
    ElementsCreator.prototype.createChallengePuzzle = function () {
      return this.createCanvas({
        position: "absolute",
        left: `${this.spacingSmall}px`,
        top: "0"
      });
    };
    ElementsCreator.prototype.createResult = function () {
      var self = this;
      var resultEl = this.createElement("div", {
        position: "absolute",
        left: 0,
        bottom: `-${this.commonSizeNormal}px`,
        width: "100%",
        height: `${this.commonSizeNormal}px`,
        color: "white",
        fontSize: "16px",
        fontWeight: 600,
        transition: "bottom 0.3s ease-in-out"
      });
      StyleUtils.flexManipulation(resultEl);
      resultEl.success = function () {
        StyleUtils.setStyles(resultEl, {
          backgroundColor: "#20DF70",
          bottom: "0"
        });
        resultEl.textContent = Constants.successText;
      };
      resultEl.error = function () {
        StyleUtils.setStyles(resultEl, {
          backgroundColor: "#F53D3D",
          bottom: "0"
        });
        resultEl.textContent = Constants.failedText;
      };
      resultEl.hide = function () {
        StyleUtils.setStyles(resultEl, {
          bottom: `-${self.commonSizeNormal}px`
        });
      };
      return resultEl;
    };
    ElementsCreator.prototype.createSlideContainer = function (isActive) {
      var container_2 = this.createElement("div", {
        textAlign: "center",
        lineHeight: `${this.commonSizeNormal}px`,
        color: "#45494C",
        borderRadius: "10px",
        boxSizing: "border-box",
        margin: `${this.commonSizeSmall}px 0 0 0`,
        padding: `${this.spacingSmall}px`,
        height: "60px",
        backgroundColor: isActive ? Constants.semiDarkColor : "#F0F2F4",
        border: isActive ? `1px solid ${Constants.primaryBorderColor}` : "none"
      });
      StyleUtils.flexManipulation(container_2, "end");
      return container_2;
    };
    ElementsCreator.prototype.createSlider = function () {
      var slider = this.createElement("div", {
        position: "absolute",
        left: `${this.spacingSmall}px`,
        backgroundColor: "#009EFB",
        boxSizing: "border-box",
        width: "72px",
        height: "44px",
        boxShabow: "0 0 3px rgba(0, 0, 0, 0.3)",
        cursor: "pointer",
        transition: "background 0.2s cubic-bezier(0.4, 2.5, 0.4, 0.6)",
        borderRadius: "10px"
      });
      StyleUtils.flexManipulation(slider);
      return slider;
    };
    ElementsCreator.prototype.createSliderIcon = function () {
      return this.createIcon({
        position: "-2px",
        width: "17px",
        height: "15px",
        styles: {
          pointerEvents: "none",
          userSelect: "none"
        }
      });
    };
    ElementsCreator.prototype.createSliderText = function () {
      return this.createElement("span", {
        color: Constants.blueColor,
        fontSize: "16px",
        fontWeight: 600
      });
    };
    ElementsCreator.prototype.createControlPanel = function () {
      var controlPanel = this.createElement("div");
      StyleUtils.setStyles(controlPanel, {
        display: "flex"
      });
      return controlPanel;
    };
    ElementsCreator.prototype.createChallenge = function (onShown) {
      var self = this;
      var challenge = this.createElement("div", {
        position: "relative",
        left: `${Constants.challengeWidth}px`,
        transform: "scale(0.9)",
        transition: "left 0.3s, transform 0.25s",
        overflow: "hidden",
        marginBottom: `${this.commonSizeSmall}px`
      });
      challenge.show = function () {
        StyleUtils.setStyles(challenge, {
          opacity: "1",
          left: "0"
        });
        StyleUtils.createDelayAnimation(300, function () {
          StyleUtils.setStyles(challenge, {
            transform: "scale(1)"
          });
          onShown();
        });
      };
      challenge.hide = function () {
        StyleUtils.setStyles(challenge, {
          transform: "scale(0.9)"
        });
        setTimeout(function () {
          StyleUtils.setStyles(challenge, {
            left: `-${Constants.challengeWidth}px`
          });
          if (document.hidden) {
            StyleUtils.setStyles(challenge, {
              opacity: "0",
              left: `${Constants.challengeWidth}px`
            });
          } else {
            setTimeout(function () {
              StyleUtils.setStyles(challenge, {
                opacity: "0",
                left: `${Constants.challengeWidth}px`
              });
            }, self.microTimeout);
          }
        }, self.microTimeout);
      };
      return challenge;
    };
    ElementsCreator.prototype.createFooter = function () {
      var footer = this.createElement("div");
      StyleUtils.flexManipulation(footer, "space-between");
      return footer;
    };
    ElementsCreator.prototype.createSpinner = function (container_2) {
      var spinner = this.createElement("div", {
        width: `${this.spinnerSize}px`,
        height: `${this.spinnerSize}px`,
        border: `5px solid ${Constants.blueColor}`,
        borderRadius: "50%",
        borderTopColor: "rgba(0, 128, 255, 0.3)",
        boxSizing: "border-box"
      });
      spinner.animationId = null;
      spinner.start = function () {
        var angle = 0;
        var startTime = performance.now();
        function animate(timestamp) {
          angle = (timestamp - startTime) / 2 % 360;
          StyleUtils.setStyles(spinner, {
            transform: `rotate(${angle}deg)`
          });
          spinner.animationId = requestAnimationFrame(animate);
        }
        animate(performance.now());
        container_2.append(this);
      };
      spinner.stop = function () {
        if (spinner.animationId) {
          cancelAnimationFrame(spinner.animationId);
          container_2.innerHTML = "";
        }
      };
      return spinner;
    };
    ElementsCreator.prototype.createVerifyButton = function () {
      var self = this;
      var button = this.createElement("button", {
        width: `${Constants.canvasWidth}px`,
        height: "56px",
        backgroundColor: Constants.blueColor,
        color: "white",
        fontSize: "19px",
        letterSpacing: "1px",
        border: `1px solid ${Constants.blueColor}`,
        borderRadius: "10px",
        margin: `${this.commonSizeSmall}px 0 0 0`,
        cursor: "pointer",
        transition: "backgroundColor 0.3s border 0.3s"
      });
      StyleUtils.flexManipulation(button);
      button.textContent = "Apply";
      button.setAttribute("type", "button");
      button.addEventListener("mouseover", function () {
        StyleUtils.setStyles(button, {
          backgroundColor: self.verifyButtonHoverColor,
          borderColor: self.verifyButtonHoverColor
        });
      });
      button.addEventListener("mouseleave", function () {
        StyleUtils.setStyles(button, {
          backgroundColor: Constants.blueColor,
          borderColor: Constants.blueColor
        });
      });
      return button;
    };
    ElementsCreator.prototype.createOrder = function (isDark) {
      var container_2 = this.createElement("div", {
        marginBottom: `${this.commonSizeSmall}px`
      });
      StyleUtils.flexManipulation(container_2, "space-between");
      var textColor = isDark ? Constants.lightColor : "#001A33";
      var label = this.createElement("span", {
        color: textColor,
        fontSize: "18px",
        fontWeight: 600,
        lineHeight: 1
      });
      label.textContent = Constants.iconsOrderText;
      var iconsContainer = this.createElement("div", {
        display: "flex"
      });
      var iconPositions = {
        buy: {
          dark: "-91px",
          light: "-67px"
        },
        calendar: {
          dark: "-141px",
          light: "-115px"
        },
        star: {
          dark: "-21px",
          light: "-44px"
        }
      };
      function getIconPosition(iconType) {
        if (isDark) {
          return iconPositions[iconType].dark;
        } else {
          return iconPositions[iconType].light;
        }
      }
      var iconElements = {
        buy: this.createOrderIcon(getIconPosition("buy")),
        calendar: this.createOrderIcon(getIconPosition("calendar")),
        star: this.createOrderIcon(getIconPosition("star"))
      };
      container_2.showIcons = function (order, resetPositions = false) {
        if (resetPositions) {
          Object.entries(iconPositions).forEach(function (entry) {
            var entryKey = entry[0];
            StyleUtils.setStyles(iconElements[entryKey], {
              backgroundPosition: `-2px ${getIconPosition(entryKey)}`
            });
          });
        }
        var icons = order.map(function (key) {
          return iconElements[key] ?? "";
        });
        var children = iconsContainer.children;
        if (children.length > 0) {
          StyleUtils.setStyles(children[1], {
            margin: "0"
          });
        }
        iconsContainer.append.apply(iconsContainer, icons);
        if (children[1]) {
          StyleUtils.setStyles(children[1], {
            margin: "0 7px"
          });
        }
      };
      container_2.append(label, iconsContainer);
      return container_2;
    };
    return ElementsCreator;
  }();
  var SHA256_K = new Uint32Array([1116352408, 1899447441, 3049323471, 3921009573, 961987163, 1508970993, 2453635748, 2870763221, 3624381080, 310598401, 607225278, 1426881987, 1925078388, 2162078206, 2614888103, 3248222580, 3835390401, 4022224774, 264347078, 604807628, 770255983, 1249150122, 1555081692, 1996064986, 2554220882, 2821834349, 2952996808, 3210313671, 3336571891, 3584528711, 113926993, 338241895, 666307205, 773529912, 1294757372, 1396182291, 1695183700, 1986661051, 2177026350, 2456956037, 2730485921, 2820302411, 3259730800, 3345764771, 3516065817, 3600352804, 4094571909, 275423344, 430227734, 506948616, 659060556, 883997877, 958139571, 1322822218, 1537002063, 1747873779, 1955562222, 2024104815, 2227730452, 2361852424, 2428436474, 2756734187, 3204031479, 3329325298]);
  function rotr32(value, shift) {
    return value >>> shift | value << 32 - shift;
  }
  function sha256Bytes(message) {
    var messageBytes = function (str) {
      var bytes = [];
      for (var charIndex = 0; charIndex < str.length; charIndex += 1) {
        var codeUnit = str.charCodeAt(charIndex);
        if (codeUnit < 128) {
          bytes.push(codeUnit);
        } else if (codeUnit < 2048) {
          bytes.push(codeUnit >> 6 | 192, codeUnit & 63 | 128);
        } else {
          if (codeUnit >= 55296 && codeUnit <= 56319 && charIndex + 1 < str.length) {
            var lowSurrogate = str.charCodeAt(charIndex + 1);
            if (lowSurrogate >= 56320 && lowSurrogate <= 57343) {
              codeUnit = 65536 + (codeUnit - 55296 << 10 | lowSurrogate - 56320);
              bytes.push(codeUnit >> 18 | 240, codeUnit >> 12 & 63 | 128, codeUnit >> 6 & 63 | 128, codeUnit & 63 | 128);
              charIndex += 1;
              continue;
            }
          }
          bytes.push(codeUnit >> 12 | 224, codeUnit >> 6 & 63 | 128, codeUnit & 63 | 128);
        }
      }
      return Uint8Array.from(bytes);
    }(message);
    var messageLength = messageBytes.length;
    var paddedLength = messageLength + 1 + (56 - (messageLength + 1) % 64 + 64) % 64 + 8;
    var padded = new Uint8Array(paddedLength);
    padded.set(messageBytes, 0);
    padded[messageLength] = 128;
    var bitLength = messageLength * 8;
    var view = new DataView(padded.buffer);
    view.setUint32(paddedLength - 8, Math.floor(bitLength / 4294967296), false);
    view.setUint32(paddedLength - 4, bitLength >>> 0, false);
    var h0 = 1779033703;
    var h1 = 3144134277;
    var h2 = 1013904242;
    var h3 = 2773480762;
    var h4 = 1359893119;
    var h5 = 2600822924;
    var h6 = 528734635;
    var h7 = 1541459225;
    var w = new Uint32Array(64);
    for (var chunkOffset = 0; chunkOffset < paddedLength; chunkOffset += 64) {
      for (var i = 0; i < 16; i += 1) {
        w[i] = view.getUint32(chunkOffset + i * 4, false);
      }
      for (i = 16; i < 64; i += 1) {
        var s0 = rotr32(w[i - 15], 7) ^ rotr32(w[i - 15], 18) ^ w[i - 15] >>> 3;
        var s1 = rotr32(w[i - 2], 17) ^ rotr32(w[i - 2], 19) ^ w[i - 2] >>> 10;
        w[i] = (w[i - 16] + s0 >>> 0) + (w[i - 7] + s1 >>> 0) >>> 0;
      }
      var a = h0;
      var b = h1;
      var c = h2;
      var d = h3;
      var e = h4;
      var f = h5;
      var g = h6;
      var h = h7;
      for (i = 0; i < 64; i += 1) {
        var temp1 = ((h + (s1 = rotr32(e, 6) ^ rotr32(e, 11) ^ rotr32(e, 25)) >>> 0) + ((e & f ^ ~e & g) + SHA256_K[i] >>> 0) >>> 0) + w[i] >>> 0;
        var maj = a & b ^ a & c ^ b & c;
        h = g;
        g = f;
        f = e;
        e = d + temp1 >>> 0;
        d = c;
        c = b;
        b = a;
        a = temp1 + ((s0 = rotr32(a, 2) ^ rotr32(a, 13) ^ rotr32(a, 22)) + maj >>> 0) >>> 0;
      }
      h0 = h0 + a >>> 0;
      h1 = h1 + b >>> 0;
      h2 = h2 + c >>> 0;
      h3 = h3 + d >>> 0;
      h4 = h4 + e >>> 0;
      h5 = h5 + f >>> 0;
      h6 = h6 + g >>> 0;
      h7 = h7 + h >>> 0;
    }
    var digest = new Uint8Array(32);
    var hashWords = [h0, h1, h2, h3, h4, h5, h6, h7];
    for (i = 0; i < hashWords.length; i += 1) {
      var word = hashWords[i];
      digest[i * 4] = word >>> 24 & 255;
      digest[i * 4 + 1] = word >>> 16 & 255;
      digest[i * 4 + 2] = word >>> 8 & 255;
      digest[i * 4 + 3] = word & 255;
    }
    return digest;
  }
  function roundHalfAwayFromZero(value) {
    if (value < 0) {
      return -Math.round(-value);
    } else {
      return Math.round(value);
    }
  }
  function isValidTrailPoint(point) {
    return !!point && typeof point.timestamp == "number" && typeof point.coord == "number" && Number.isFinite(point.timestamp) && Number.isFinite(point.coord) && Math.abs(point.coord) <= 10000;
  }
  function __assign2() {
    __assign2 = Object.assign || function (target) {
      var source;
      for (var i = 1, len = arguments.length; i < len; i++) {
        for (var key in source = arguments[i]) {
          if (Object.prototype.hasOwnProperty.call(source, key)) {
            target[key] = source[key];
          }
        }
      }
      return target;
    };
    return __assign2.apply(this, arguments);
  }
  function __awaiter(thisArg, args, PromiseCtor, generator) {
    return new (PromiseCtor ||= Promise)(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (error) {
          reject(error);
        }
      }
      function rejected(reason) {
        try {
          step(generator.throw(reason));
        } catch (throwError) {
          reject(throwError);
        }
      }
      function step(result) {
        var resultValue;
        if (result.done) {
          resolve(result.value);
        } else {
          (resultValue = result.value, resultValue instanceof PromiseCtor ? resultValue : new PromiseCtor(function (settle) {
            settle(resultValue);
          })).then(fulfilled, rejected);
        }
      }
      step((generator = generator.apply(thisArg, args || [])).next());
    });
  }
  function __generator(thisArg, body) {
    var executing;
    var delegate;
    var temp;
    var iterator;
    var state = {
      label: 0,
      sent: function () {
        if (temp[0] & 1) {
          throw temp[1];
        }
        return temp[1];
      },
      trys: [],
      ops: []
    };
    iterator = {
      next: verb(0),
      throw: verb(1),
      return: verb(2)
    };
    if (typeof Symbol == "function") {
      iterator[Symbol.iterator] = function () {
        return this;
      };
    }
    return iterator;
    function verb(opCode) {
      return function (value) {
        return function (op) {
          if (executing) {
            throw new TypeError("Generator is already executing.");
          }
          while (iterator && (iterator = 0, op[0] && (state = 0)), state) {
            try {
              executing = 1;
              if (delegate && (temp = op[0] & 2 ? delegate.return : op[0] ? delegate.throw || ((temp = delegate.return) && temp.call(delegate), 0) : delegate.next) && !(temp = temp.call(delegate, op[1])).done) {
                return temp;
              }
              delegate = 0;
              if (temp) {
                op = [op[0] & 2, temp.value];
              }
              switch (op[0]) {
                case 0:
                case 1:
                  temp = op;
                  break;
                case 4:
                  state.label++;
                  return {
                    value: op[1],
                    done: false
                  };
                case 5:
                  state.label++;
                  delegate = op[1];
                  op = [0];
                  continue;
                case 7:
                  op = state.ops.pop();
                  state.trys.pop();
                  continue;
                default:
                  if (!(temp = (temp = state.trys).length > 0 && temp[temp.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                    state = 0;
                    continue;
                  }
                  if (op[0] === 3 && (!temp || op[1] > temp[0] && op[1] < temp[3])) {
                    state.label = op[1];
                    break;
                  }
                  if (op[0] === 6 && state.label < temp[1]) {
                    state.label = temp[1];
                    temp = op;
                    break;
                  }
                  if (temp && state.label < temp[2]) {
                    state.label = temp[2];
                    state.ops.push(op);
                    break;
                  }
                  if (temp[2]) {
                    state.ops.pop();
                  }
                  state.trys.pop();
                  continue;
              }
              op = body.call(thisArg, state);
            } catch (error) {
              op = [6, error];
              delegate = 0;
            } finally {
              executing = temp = 0;
            }
          }
          if (op[0] & 5) {
            throw op[1];
          }
          return {
            value: op[0] ? op[1] : undefined,
            done: true
          };
        }([opCode, value]);
      };
    }
  }
  var BasiliskCaptcha = function () {
    function BasiliskCaptcha(element = null, dispatch = function () {}) {
      this.element = element;
      this.errorMessage = null;
      this.captcha = null;
      this.checkbox = null;
      this.checked = null;
      this.humanBlock = null;
      this.humanText = null;
      this.spinner = null;
      this.captchaValue = null;
      this.popup = null;
      this.popupContent = null;
      this.challenge = null;
      this.canvasWrapper = null;
      this.canvas = null;
      this.canvasCtx = null;
      this.challengePuzzle = null;
      this.challengePuzzleCtx = null;
      this.sliderContainer = null;
      this.slider = null;
      this.sliderText = null;
      this.result = null;
      this.refreshIcon = null;
      this.closeIcon = null;
      this.infoIcon = null;
      this.order = null;
      this.verifyButton = null;
      this.a11yCursor = null;
      this.a11yMode = false;
      this.lastCallTimestamp = 0;
      this.startX = 0;
      this.startY = 0;
      this.trailX = [];
      this.trailY = [];
      this.verified = false;
      this.isMouseDown = false;
      this.isPopupCanBeClosed = true;
      this.isSliderCaptcha = true;
      this.isRotationCaptcha = false;
      this.rotationAngle = 0;
      this.rotationDir = 1;
      this.rotationOffset = 0;
      this.rotationGain = 1;
      this.lastRotationRatio = 0;
      this.rotationBackgroundImage = null;
      this.rotationPatchImage = null;
      this.startTicket = null;
      this.checkpointTicket = null;
      this.checkpointState = "idle";
      this.checkpointTriggerRatio = null;
      this.checkpointAbort = null;
      this.challengeStartedAt = 0;
      this.cdpLeakDetected = false;
      this.isDark = false;
      this.challengeData = null;
      this.captcha_id = null;
      this.sessionSid = null;
      this.sealKey = null;
      this.sealKeyPromise = null;
      this.action = null;
      this.fingerprintHash = this.buildFingerprintHash();
      this.trustedInteractionEvents = 0;
      this.untrustedInteractionEvents = 0;
      this.blurEvents = 0;
      this.focusEvents = 0;
      this.visibilityChanges = 0;
      this.prechallengePointerMoves = 0;
      this.prechallengeClicks = 0;
      this.prechallengeKeyEvents = 0;
      this.prechallengeScrollEvents = 0;
      this.prechallengeMountTimestamp = Date.now();
      this.prechallengeSnapshotTaken = false;
      this.prechallengeSnapshot = null;
      this.prechallengeEventsBound = false;
      this.honeypotTriggered = false;
      this.honeypotTraps = [];
      this.honeypotInput = null;
      this.honeypotButton = null;
      this.clientIntegritySeed = null;
      this.proofOfWorkChallenge = null;
      this.proofOfWorkResult = null;
      this.proofOfWorkGeneration = 0;
      this.clickedIcons = [];
      this.oneMinTimoutId = null;
      this.threeMinsTimoutId = null;
      this.initRequestBody = {};
      this.dispatch = dispatch;
      this.elementsCreator = new ElementsCreator();
      this.boundHandleHumanClick = this.handleHumanBlockClick.bind(this);
      this.boundHandleDragStart = this.handleDragStart.bind(this);
      this.boundHandleDragMove = this.handleDragMove.bind(this);
      this.boundHandleDragEnd = this.handleDragEnd.bind(this);
      this.boundVerifyButtonClick = this.handleVerifyButtonClick.bind(this);
      this.boundHandleCanvasClick = this.handleCanvasClick.bind(this);
      this.boundHandleA11yKeydown = this.handleA11yKeydown.bind(this);
      this.boundTrackingPopupContentEvents = this.trackingPopupContentEvents.bind(this);
      this.boundHandleWindowFocus = this.handleWindowFocus.bind(this);
      this.boundHandleWindowBlur = this.handleWindowBlur.bind(this);
      this.boundHandleVisibilityChange = this.handleVisibilityChange.bind(this);
      this.boundHandlePrechallengePointerMove = this.handlePrechallengePointerMove.bind(this);
      this.boundHandlePrechallengeClick = this.handlePrechallengeClick.bind(this);
      this.boundHandlePrechallengeKeydown = this.handlePrechallengeKeydown.bind(this);
      this.boundHandlePrechallengeScroll = this.handlePrechallengeScroll.bind(this);
      this.boundHandleHoneypotInputFocus = this.handleHoneypotInputFocus.bind(this);
      this.boundHandleHoneypotInputChange = this.handleHoneypotInputChange.bind(this);
      this.boundHandleHoneypotInputInput = this.handleHoneypotInputInput.bind(this);
      this.boundHandleHoneypotButtonClick = this.handleHoneypotButtonClick.bind(this);
      this.boundHandleHoneypotButtonFocus = this.handleHoneypotButtonFocus.bind(this);
      this.bindClientSignalEvents();
      this.bindPrechallengeEvents();
      this.init();
    }
    BasiliskCaptcha.prototype.init = function () {
      var themeElement;
      var actionElement;
      var siteKeyElement;
      var self = this;
      try {
        this.isDark = ((themeElement = this.element) === null || themeElement === undefined ? undefined : themeElement.getAttribute("data-theme")) === "dark";
        this.action = this.getOptionalAction((actionElement = this.element) === null || actionElement === undefined ? undefined : actionElement.getAttribute("data-action"));
        this.initRequestBody = {
          site_key: (siteKeyElement = this.element) === null || siteKeyElement === undefined ? undefined : siteKeyElement.getAttribute("data-sitekey"),
          site_domain: window.location.origin
        };
        this.initCaptcha();
        this.fetchData(Constants.checkSite, this.initRequestBody, function () {
          if (self.challengeData?.success) {
            self.observeDataThemeAttribute();
            self.bindInitialsEvents();
          } else if (self.errorMessage) {
            if (self.challengeData?.message === "Error") {
              self.errorMessage.textContent = "Unavailable";
            } else {
              self.errorMessage.textContent = Constants.errorKeyText;
            }
            StyleUtils.setStyles(self.errorMessage, {
              display: "block"
            });
          }
        });
      } catch (error) {
        console.log("An error occurred while creating basilisk captcha", error);
      }
    };
    BasiliskCaptcha.prototype.getResult = function () {
      return this.challengeData?.data?.captcha_response ?? null;
    };
    BasiliskCaptcha.prototype.getOptionalAction = function (action) {
      if (typeof action != "string") {
        return null;
      }
      var trimmed = action.trim();
      if (!trimmed || trimmed.length > 64) {
        return null;
      } else if (/^[A-Za-z0-9_\-.:]+$/.test(trimmed)) {
        return trimmed;
      } else {
        return null;
      }
    };
    BasiliskCaptcha.prototype.buildFingerprintHash = function () {
      try {
        var fingerprint = [navigator.userAgent, navigator.language, navigator.platform, `${screen.width}x${screen.height}x${screen.colorDepth}`, `${screen.availWidth}x${screen.availHeight}`, `${new Date().getTimezoneOffset()}`, `${navigator.hardwareConcurrency ?? ""}`, `${navigator.deviceMemory ?? ""}`, navigator.vendor ?? "", this.getCanvasFingerprint(), this.getWebglFingerprint()].filter(function (value) {
          return typeof value == "string" && value.length > 0;
        }).join("|");
        if (fingerprint) {
          return this.hashSignal(fingerprint);
        } else {
          return "";
        }
      } catch (error) {
        return "";
      }
    };
    BasiliskCaptcha.prototype.hashSignal = function (input) {
      var hash1 = 2166136261;
      var hash2 = 2654435769;
      for (var i = 0; i < input.length; i++) {
        var charCode = input.charCodeAt(i);
        hash1 ^= charCode;
        hash1 = Math.imul(hash1, 16777619);
        hash2 ^= charCode + i;
        hash2 = Math.imul(hash2, 2246822507);
      }
      var hex1 = (hash1 >>> 0).toString(16).padStart(8, "0");
      var hex2 = (hash2 >>> 0).toString(16).padStart(8, "0");
      return `${hex1}${hex2}`.slice(0, 32);
    };
    BasiliskCaptcha.prototype.getCanvasFingerprint = function () {
      try {
        var canvas = document.createElement("canvas");
        canvas.width = 64;
        canvas.height = 24;
        var ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.textBaseline = "top";
          ctx.font = "16px Arial";
          ctx.fillStyle = "#f60";
          ctx.fillRect(0, 0, 64, 24);
          ctx.fillStyle = "#069";
          ctx.fillText("basilisk", 2, 4);
          return canvas.toDataURL().slice(-24);
        } else {
          return "";
        }
      } catch (error) {
        return "";
      }
    };
    BasiliskCaptcha.prototype.getWebglFingerprint = function () {
      try {
        var canvas = document.createElement("canvas");
        var glContext = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
        if (!glContext) {
          return "";
        }
        var gl = glContext;
        var debugInfo = gl.getExtension("WEBGL_debug_renderer_info");
        if (!debugInfo) {
          return "";
        }
        var vendor = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL);
        var renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
        return `${vendor}|${renderer}`;
      } catch (error) {
        return "";
      }
    };
    BasiliskCaptcha.prototype.getThreadedRequestBody = function (extra = {}, includeSid = false, includeSignals = false) {
      var body = __assign2(__assign2({}, this.initRequestBody), extra);
      body.protocol_version = this.getDeclaredProtocolVersion();
      body.widget_version = Constants.widgetVersion;
      if (this.fingerprintHash) {
        body.fp_hash = this.fingerprintHash;
      }
      if (includeSid && this.sessionSid) {
        body.sid = this.sessionSid;
      }
      if (includeSignals) {
        var signals = this.buildClientSignals();
        if (Object.keys(signals).length > 0) {
          body.signals = signals;
        }
      }
      return body;
    };
    BasiliskCaptcha.prototype.getDeclaredProtocolVersion = function () {
      if (typeof crypto != "undefined" && crypto.subtle) {
        return Constants.protocolVersion;
      } else {
        return 3;
      }
    };
    BasiliskCaptcha.prototype.getCreateChallengeRequestBody = function () {
      var body = this.getThreadedRequestBody({
        signals: this.buildClientSignals(),
        supported_types: ["slide", "rotation"]
      }, false, true);
      if (this.action) {
        body.action = this.action;
      }
      return body;
    };
    BasiliskCaptcha.prototype.bindClientSignalEvents = function () {
      window.addEventListener("focus", this.boundHandleWindowFocus);
      window.addEventListener("blur", this.boundHandleWindowBlur);
      document.addEventListener("visibilitychange", this.boundHandleVisibilityChange);
    };
    BasiliskCaptcha.prototype.bindPrechallengeEvents = function () {
      if (!this.prechallengeEventsBound) {
        window.addEventListener("pointermove", this.boundHandlePrechallengePointerMove, {
          passive: true
        });
        document.addEventListener("click", this.boundHandlePrechallengeClick, {
          passive: true
        });
        document.addEventListener("keydown", this.boundHandlePrechallengeKeydown, {
          passive: true
        });
        window.addEventListener("scroll", this.boundHandlePrechallengeScroll, {
          passive: true
        });
        this.prechallengeEventsBound = true;
      }
    };
    BasiliskCaptcha.prototype.unbindPrechallengeEvents = function () {
      if (this.prechallengeEventsBound) {
        window.removeEventListener("pointermove", this.boundHandlePrechallengePointerMove);
        document.removeEventListener("click", this.boundHandlePrechallengeClick);
        document.removeEventListener("keydown", this.boundHandlePrechallengeKeydown);
        window.removeEventListener("scroll", this.boundHandlePrechallengeScroll);
        this.prechallengeEventsBound = false;
      }
    };
    BasiliskCaptcha.prototype.resetClientSignals = function () {
      this.trustedInteractionEvents = 0;
      this.untrustedInteractionEvents = 0;
      this.blurEvents = 0;
      this.focusEvents = 0;
      this.visibilityChanges = 0;
    };
    BasiliskCaptcha.prototype.resetPrechallengeSignals = function () {
      this.prechallengePointerMoves = 0;
      this.prechallengeClicks = 0;
      this.prechallengeKeyEvents = 0;
      this.prechallengeScrollEvents = 0;
      this.prechallengeMountTimestamp = Date.now();
      this.prechallengeSnapshotTaken = false;
      this.prechallengeSnapshot = null;
      this.bindPrechallengeEvents();
    };
    BasiliskCaptcha.prototype.resetHoneypotSignals = function () {
      this.honeypotTriggered = false;
      this.honeypotTraps = [];
    };
    BasiliskCaptcha.prototype.resetProofOfWorkSignals = function () {
      this.proofOfWorkChallenge = null;
      this.proofOfWorkResult = null;
      this.proofOfWorkGeneration += 1;
    };
    BasiliskCaptcha.prototype.recordProofOfWorkResult = function (result, generation) {
      if (generation === this.proofOfWorkGeneration) {
        this.proofOfWorkResult = result;
      }
    };
    BasiliskCaptcha.prototype.getProofOfWorkSubmission = function () {
      var result = this.proofOfWorkResult;
      if (result) {
        return {
          pow_nonce: result.pow_nonce,
          pow_iterations: result.pow_iterations,
          pow_ms: result.pow_ms
        };
      } else {
        return {};
      }
    };
    BasiliskCaptcha.prototype.resetClientIntegritySignals = function () {
      this.clientIntegritySeed = null;
    };
    BasiliskCaptcha.prototype.bytesToHex = function (bytes) {
      return Array.from(bytes, function (byte) {
        return byte.toString(16).padStart(2, "0");
      }).join("");
    };
    BasiliskCaptcha.prototype.getIntegrityCriticalFunctions = function () {
      return [this.getThreadedRequestBody, this.buildClientSignals, this.buildClientIntegritySignals];
    };
    BasiliskCaptcha.prototype.detectIntegrityTamper = function () {
      try {
        return this.getIntegrityCriticalFunctions().some(function (fn) {
          var nativeString = Function.prototype.toString.call(fn);
          var actualString = fn.toString();
          return nativeString !== actualString || nativeString.length === 0 || actualString.length === 0;
        });
      } catch (error) {
        return true;
      }
    };
    BasiliskCaptcha.prototype.detectIntegrityAutomationHooks = function () {
      try {
        var hooks = [];
        var win = window;
        if (Boolean(navigator.webdriver)) {
          hooks.push("webdriver");
        }
        var userAgent = navigator.userAgent.toLowerCase();
        if (userAgent.includes("headlesschrome")) {
          hooks.push("headlesschrome");
        }
        if (userAgent.includes("phantomjs")) {
          hooks.push("phantomjs");
        }
        if (userAgent.includes("electron")) {
          hooks.push("electron");
        }
        for (var i = 0, propNames = ["__nightmare", "__selenium_unwrapped", "__selenium_evaluate", "_phantom", "callPhantom", "domAutomation", "domAutomationController", "__playwright__binding"]; i < propNames.length; i++) {
          var propName = propNames[i];
          if (win[propName] !== undefined) {
            hooks.push(propName);
          }
        }
        if (Object.keys(win).some(function (key) {
          return key.startsWith("cdc_");
        })) {
          hooks.push("cdc");
        }
        return Array.from(new Set(hooks));
      } catch (error) {
        return [];
      }
    };
    BasiliskCaptcha.prototype.detectIntegrityNativeOverrides = function () {
      try {
        var nativeChecks = [["Function.prototype.toString", Function.prototype.toString], ["Array.prototype.push", Array.prototype.push], ["Object.defineProperty", Object.defineProperty], ["Reflect.apply", Reflect.apply]];
        var tamperedNames = [];
        for (var i = 0, entries = nativeChecks; i < entries.length; i++) {
          var entry = entries[i];
          var name = entry[0];
          var fn = entry[1];
          try {
            if (!Function.prototype.toString.call(fn).includes("[native code]")) {
              tamperedNames.push(name);
            }
          } catch (checkError) {
            tamperedNames.push(name);
          }
        }
        return tamperedNames;
      } catch (error) {
        return [];
      }
    };
    BasiliskCaptcha.prototype.buildClientIntegritySignals = function () {
      try {
        if (!this.clientIntegritySeed) {
          return {};
        }
        var start = performance.now();
        var toStringTamper = this.detectIntegrityTamper();
        var automationHooks = this.detectIntegrityAutomationHooks();
        var nativeOverrides = this.detectIntegrityNativeOverrides();
        var elapsedMs = Math.max(0, Math.round(performance.now() - start));
        var signals = {
          client_integrity_version: 1,
          client_integrity_toString_tamper: toStringTamper,
          client_integrity_automation_hooks: automationHooks,
          client_integrity_native_overrides: nativeOverrides,
          client_integrity_debugger_stall_ms: elapsedMs,
          client_integrity_debugger_detected: elapsedMs > 80
        };
        var digest = sha256Bytes(`${this.clientIntegritySeed}|${JSON.stringify(signals)}`);
        return __assign2(__assign2({}, signals), {
          client_integrity_token: this.bytesToHex(digest)
        });
      } catch (error) {
        return {};
      }
    };
    BasiliskCaptcha.prototype.countLeadingZeroBits = function (bytes) {
      var count = 0;
      for (var i = 0; i < bytes.length; i += 1) {
        var byte = bytes[i];
        if (byte !== 0) {
          for (var mask = 128; mask > 0 && (byte & mask) === 0;) {
            count += 1;
            mask >>= 1;
          }
          return count;
        }
        count += 8;
      }
      return count;
    };
    BasiliskCaptcha.prototype.sha256Bytes = function (input) {
      try {
        return sha256Bytes(input);
      } catch (error) {
        return null;
      }
    };
    BasiliskCaptcha.prototype.getProofOfWorkIterationCap = function (difficulty) {
      var normalizedDifficulty = Math.max(0, Math.floor(difficulty));
      var rawCap = Math.pow(2, normalizedDifficulty) * 16;
      return Math.max(1, Math.min(8388608, Math.floor(rawCap)));
    };
    BasiliskCaptcha.prototype.scheduleProofOfWorkChunk = function (challenge, generation, start, cap, startTime) {
      var self = this;
      if (generation === this.proofOfWorkGeneration && !this.proofOfWorkResult) {
        for (var chunkEnd = Math.min(start + 2048, cap), i = start; i < chunkEnd; i += 1) {
          if (generation !== this.proofOfWorkGeneration) {
            return;
          }
          var nonce = String(i);
          var digest = this.sha256Bytes(`${challenge.seed}${nonce}`);
          if (!digest) {
            return;
          }
          if (this.countLeadingZeroBits(digest) >= challenge.difficulty) {
            this.recordProofOfWorkResult({
              pow_nonce: nonce,
              pow_iterations: i + 1,
              pow_ms: Math.max(0, Math.round(performance.now() - startTime))
            }, generation);
            return;
          }
        }
        if (!(chunkEnd >= cap) && generation === this.proofOfWorkGeneration && !this.proofOfWorkResult) {
          function continueChunk() {
            self.scheduleProofOfWorkChunk(challenge, generation, chunkEnd, cap, startTime);
          }
          var win = window;
          if (typeof win.requestIdleCallback != "function") {
            window.setTimeout(continueChunk, 0);
          } else {
            win.requestIdleCallback(function () {
              return continueChunk();
            }, {
              timeout: 16
            });
          }
        }
      }
    };
    BasiliskCaptcha.prototype.solveProofOfWork = function (challenge, generation) {
      var startTime = performance.now();
      var iterationCap = this.getProofOfWorkIterationCap(challenge.difficulty);
      try {
        this.scheduleProofOfWorkChunk(challenge, generation, 0, iterationCap, startTime);
      } catch (error) {}
    };
    BasiliskCaptcha.prototype.startProofOfWorkSolve = function (challenge) {
      try {
        if (!challenge || !challenge.seed) {
          return;
        }
        this.proofOfWorkChallenge = challenge;
        this.proofOfWorkResult = null;
        this.proofOfWorkGeneration += 1;
        var generation = this.proofOfWorkGeneration;
        this.solveProofOfWork(challenge, generation);
      } catch (error) {}
    };
    BasiliskCaptcha.prototype.recordInteractionTrust = function (event) {
      if (event && typeof event.isTrusted == "boolean") {
        if (event.isTrusted) {
          this.trustedInteractionEvents += 1;
        } else {
          this.untrustedInteractionEvents += 1;
        }
      }
    };
    BasiliskCaptcha.prototype.handleWindowFocus = function () {
      this.focusEvents += 1;
    };
    BasiliskCaptcha.prototype.handleWindowBlur = function () {
      this.blurEvents += 1;
    };
    BasiliskCaptcha.prototype.handleVisibilityChange = function () {
      this.visibilityChanges += 1;
    };
    BasiliskCaptcha.prototype.recordPrechallengeSignal = function (signalType) {
      if (!this.prechallengeSnapshotTaken) {
        if (signalType === "pointermove") {
          this.prechallengePointerMoves += 1;
        }
        if (signalType === "click") {
          this.prechallengeClicks += 1;
        }
        if (signalType === "keydown") {
          this.prechallengeKeyEvents += 1;
        }
        if (signalType === "scroll") {
          this.prechallengeScrollEvents += 1;
        }
      }
    };
    BasiliskCaptcha.prototype.handlePrechallengePointerMove = function () {
      try {
        this.recordPrechallengeSignal("pointermove");
      } catch (error) {}
    };
    BasiliskCaptcha.prototype.handlePrechallengeClick = function () {
      try {
        this.recordPrechallengeSignal("click");
      } catch (error) {}
    };
    BasiliskCaptcha.prototype.handlePrechallengeKeydown = function () {
      try {
        this.recordPrechallengeSignal("keydown");
      } catch (error) {}
    };
    BasiliskCaptcha.prototype.handlePrechallengeScroll = function () {
      try {
        this.recordPrechallengeSignal("scroll");
      } catch (error) {}
    };
    BasiliskCaptcha.prototype.recordHoneypotTrap = function (trap) {
      if (trap && !this.honeypotTraps.includes(trap)) {
        this.honeypotTriggered = true;
        this.honeypotTraps.push(trap);
      }
    };
    BasiliskCaptcha.prototype.handleHoneypotInputFocus = function () {
      try {
        this.recordHoneypotTrap("email");
      } catch (error) {}
    };
    BasiliskCaptcha.prototype.handleHoneypotInputChange = function () {
      try {
        this.recordHoneypotTrap("email");
      } catch (error) {}
    };
    BasiliskCaptcha.prototype.handleHoneypotInputInput = function () {
      try {
        this.recordHoneypotTrap("email");
      } catch (error) {}
    };
    BasiliskCaptcha.prototype.handleHoneypotButtonClick = function () {
      try {
        this.recordHoneypotTrap("url");
      } catch (error) {}
    };
    BasiliskCaptcha.prototype.handleHoneypotButtonFocus = function () {
      try {
        this.recordHoneypotTrap("url");
      } catch (error) {}
    };
    BasiliskCaptcha.prototype.snapshotPrechallengeSignals = function () {
      if (this.prechallengeSnapshotTaken) {
        return this.prechallengeSnapshot ?? {};
      } else {
        this.prechallengeSnapshotTaken = true;
        this.prechallengeSnapshot = {
          prechallenge_pointer_moves: this.prechallengePointerMoves,
          prechallenge_clicks: this.prechallengeClicks,
          prechallenge_key_events: this.prechallengeKeyEvents,
          prechallenge_scroll_events: this.prechallengeScrollEvents,
          prechallenge_ms_before_start: Math.max(0, Date.now() - this.prechallengeMountTimestamp)
        };
        this.unbindPrechallengeEvents();
        return this.prechallengeSnapshot;
      }
    };
    BasiliskCaptcha.prototype.probeCdpLeak = function () {
      var leaked = false;
      try {
        var probeError = new Error("bslk");
        Object.defineProperty(probeError, "stack", {
          configurable: true,
          enumerable: false,
          get: function () {
            leaked = true;
            return "";
          }
        });
        console.debug(probeError);
      } catch (e) {}
      return leaked;
    };
    BasiliskCaptcha.prototype.getAutomationSignals = function () {
      var automationGlobals = ["__nightmare", "__selenium_unwrapped", "__selenium_evaluate", "_phantom", "callPhantom", "webdriver", "domAutomation", "domAutomationController"].filter(function (key) {
        return window[key] !== undefined;
      });
      var headlessHints = [];
      var userAgent = navigator.userAgent.toLowerCase();
      if (userAgent.includes("headlesschrome") || userAgent.includes("phantomjs") || userAgent.includes("electron")) {
        if (userAgent.includes("headlesschrome")) {
          headlessHints.push("HeadlessChrome");
        }
        if (userAgent.includes("phantomjs")) {
          headlessHints.push("PhantomJS");
        }
        if (userAgent.includes("electron")) {
          headlessHints.push("Electron");
        }
      }
      return {
        automationGlobals: automationGlobals,
        headlessHints: headlessHints
      };
    };
    BasiliskCaptcha.prototype.getWebglSignals = function () {
      var parts = this.getWebglFingerprint().split("|", 2);
      var rawVendor = parts[0];
      var vendor = rawVendor === undefined ? "" : rawVendor;
      var rawRenderer = parts[1];
      return {
        webgl_vendor: vendor,
        webgl_renderer: rawRenderer === undefined ? "" : rawRenderer
      };
    };
    BasiliskCaptcha.prototype.getMotionSignals = function () {
      var pointCount = Math.min(this.trailX.length, this.trailY.length);
      if (pointCount === 0) {
        return {
          motion_event_count: 0,
          motion_interval_mean_ms: 0,
          motion_interval_variance_ms: 0,
          motion_path_length_px: 0,
          motion_straightness_ratio: 0
        };
      }
      var intervals = [];
      for (var i = 1; i < pointCount; i += 1) {
        intervals.push(this.trailX[i].timestamp - this.trailX[i - 1].timestamp);
      }
      var intervalMean = intervals.length > 0 ? intervals.reduce(function (sum, interval) {
        return sum + interval;
      }, 0) / intervals.length : 0;
      var intervalVariance = intervals.length > 0 ? intervals.reduce(function (total, value) {
        var diff = value - intervalMean;
        return total + diff * diff;
      }, 0) / intervals.length : 0;
      var pathLength = 0;
      for (i = 1; i < pointCount; i += 1) {
        var prevX = this.trailX[i - 1].coord;
        var prevY = this.trailY[i - 1].coord;
        var dx = this.trailX[i].coord - prevX;
        var dy = this.trailY[i].coord - prevY;
        pathLength += Math.sqrt(dx * dx + dy * dy);
      }
      var netDx = this.trailX[pointCount - 1].coord - this.trailX[0].coord;
      var netDy = this.trailY[pointCount - 1].coord - this.trailY[0].coord;
      var netDistance = Math.sqrt(netDx * netDx + netDy * netDy);
      return {
        motion_event_count: pointCount,
        motion_interval_mean_ms: intervalMean,
        motion_interval_variance_ms: intervalVariance,
        motion_path_length_px: pathLength,
        motion_straightness_ratio: pathLength > 0 ? netDistance / pathLength : 0
      };
    };
    BasiliskCaptcha.prototype.buildClientSignals = function () {
      try {
        this.cdpLeakDetected ||= this.probeCdpLeak();
        var automationSignals = this.getAutomationSignals();
        var webglSignals = this.getWebglSignals();
        var motionSignals = this.getMotionSignals();
        var languages = (navigator.languages ? Array.from(navigator.languages) : []).slice(0, 5).filter(function (lang) {
          return typeof lang == "string" && lang.length > 0;
        });
        var deviceMemory = typeof navigator.deviceMemory == "number" ? navigator.deviceMemory : 0;
        return __assign2(__assign2(__assign2(__assign2({
          pointer_trusted_events: this.trustedInteractionEvents,
          pointer_untrusted_events: this.untrustedInteractionEvents,
          pointer_trusted_ratio: this.trustedInteractionEvents + this.untrustedInteractionEvents > 0 ? this.trustedInteractionEvents / (this.trustedInteractionEvents + this.untrustedInteractionEvents) : 0,
          webdriver: Boolean(navigator.webdriver),
          cdp_leak_detected: this.cdpLeakDetected,
          automation_globals: automationSignals.automationGlobals,
          headless_hints: automationSignals.headlessHints,
          webgl_vendor: webglSignals.webgl_vendor,
          webgl_renderer: webglSignals.webgl_renderer,
          languages: languages,
          hardware_concurrency: navigator.hardwareConcurrency ?? 0,
          device_memory: deviceMemory,
          plugins_count: navigator.plugins?.length ?? 0,
          touch_support: "ontouchstart" in window || navigator.maxTouchPoints > 0,
          blur_events: this.blurEvents,
          focus_events: this.focusEvents,
          visibility_changes: this.visibilityChanges
        }, this.prechallengeSnapshot ?? {}), {
          honeypot_triggered: this.honeypotTriggered,
          honeypot_traps: this.honeypotTraps
        }), this.buildClientIntegritySignals()), motionSignals);
      } catch (error) {
        return {};
      }
    };
    BasiliskCaptcha.prototype.observeDataThemeAttribute = function () {
      var self = this;
      new MutationObserver(function (mutations) {
        for (var i = 0, list = mutations; i < list.length; i++) {
          var mutation = list[i];
          if (mutation.type === "attributes" && mutation.attributeName === "data-theme") {
            if (mutation.target.getAttribute("data-theme") === "dark") {
              if (self.isDark) {
                return;
              }
              self.isDark = true;
              self.changeElementsToDark();
            } else {
              if (!self.isDark) {
                return;
              }
              self.isDark = false;
              self.changeElementsToLight();
            }
          }
        }
      }).observe(this.element, {
        attributes: true,
        attributeFilter: ["data-theme"]
      });
    };
    BasiliskCaptcha.prototype.fetchData = function (endpoint, payload = {}, onSuccess) {
      return __awaiter(this, undefined, undefined, function () {
        var sealedBody;
        var response;
        var data;
        var error;
        var self = this;
        return __generator(this, function (state) {
          switch (state.label) {
            case 0:
              this.challengeData = null;
              state.label = 1;
            case 1:
              state.trys.push([1, 5,, 6]);
              return [4, this.sealBody(payload)];
            case 2:
              sealedBody = state.sent();
              return [4, fetch(`${Constants.serverUrl}/challenge/${endpoint}`, {
                method: "POST",
                body: JSON.stringify(sealedBody)
              })];
            case 3:
              if (!(response = state.sent()).ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
              }
              return [4, response.json()];
            case 4:
              if ((data = state.sent()).message === "Rejected" && this.popup) {
                this.resetSession();
                return [2];
              } else {
                this.challengeData = data;
                onSuccess();
                return [3, 6];
              }
            case 5:
              if ((error = state.sent()) instanceof Error) {
                console.log("There was a problem with the fetch operation:", error.message);
              }
              this.resetSession(function () {
                var spinner;
                if ((spinner = self.spinner) !== null && spinner !== undefined) {
                  spinner.stop();
                }
              });
              return [3, 6];
            case 6:
              return [2];
          }
        });
      });
    };
    BasiliskCaptcha.prototype.changeElementsToLight = function () {
      StyleUtils.setStyles(this.captcha, {
        backgroundColor: "white"
      });
      StyleUtils.setStyles(this.checkbox, {
        backgroundColor: Constants.lightColor,
        borderColor: Constants.secondaryBorderColor
      });
      StyleUtils.setStyles(this.humanText, {
        color: "black"
      });
    };
    BasiliskCaptcha.prototype.changeElementsToDark = function () {
      StyleUtils.setStyles(this.captcha, {
        backgroundColor: Constants.darkColor
      });
      StyleUtils.setStyles(this.checkbox, {
        backgroundColor: Constants.semiDarkColor,
        borderColor: Constants.primaryBorderColor
      });
      StyleUtils.setStyles(this.humanText, {
        color: Constants.lightColor
      });
    };
    BasiliskCaptcha.prototype.initFont = function () {
      var preconnectGoogleApis = this.elementsCreator.createLink();
      var preconnectGstatic = this.elementsCreator.createLink();
      var fontStylesheet = this.elementsCreator.createLink();
      preconnectGoogleApis.rel = "preconnect";
      preconnectGoogleApis.href = "https://fonts.googleapis.com";
      preconnectGstatic.rel = "preconnect";
      preconnectGstatic.href = "https://fonts.gstatic.com";
      preconnectGstatic.crossOrigin = "anonymous";
      fontStylesheet.href = "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap";
      fontStylesheet.rel = "stylesheet";
      document.head.append(preconnectGoogleApis, preconnectGstatic, fontStylesheet);
    };
    BasiliskCaptcha.prototype.initCaptcha = function () {
      var el;
      this.initFont();
      this.captcha = this.elementsCreator.createCaptcha(this.isDark);
      this.checkbox = this.elementsCreator.createCheckbox(this.isDark);
      this.checked = this.elementsCreator.createChecked();
      this.humanText = this.elementsCreator.createHumanText(this.isDark);
      this.humanBlock = this.elementsCreator.createHumanBlock();
      this.humanBlock.append(this.checkbox, this.humanText);
      this.errorMessage = this.elementsCreator.createErrorMessage();
      this.captchaValue = this.elementsCreator.createCaptchaValue();
      this.createHoneypotFields();
      this.captcha.append(this.errorMessage, this.humanBlock);
      if ((el = this.element) !== null && el !== undefined) {
        el.append(this.captcha, this.captchaValue);
      }
      StyleUtils.setStyles(this.element, {
        userSelect: "none"
      });
    };
    BasiliskCaptcha.prototype.createHoneypotFields = function () {
      var captcha;
      try {
        var wrapper = this.elementsCreator.createElement("div", {
          position: "absolute",
          left: "-10000px",
          top: "0",
          width: "1px",
          height: "1px",
          overflow: "hidden",
          opacity: "0"
        });
        wrapper.setAttribute("aria-hidden", "true");
        wrapper.setAttribute("role", "presentation");
        this.honeypotInput = this.elementsCreator.createElement("input", {
          width: "1px",
          height: "1px"
        });
        this.honeypotInput.type = "text";
        this.honeypotInput.name = "email";
        this.honeypotInput.autocomplete = "off";
        this.honeypotInput.tabIndex = -1;
        this.honeypotInput.setAttribute("aria-hidden", "true");
        this.honeypotInput.setAttribute("spellcheck", "false");
        this.honeypotInput.setAttribute("inputmode", "none");
        this.honeypotInput.value = "";
        this.honeypotInput.addEventListener("focus", this.boundHandleHoneypotInputFocus);
        this.honeypotInput.addEventListener("input", this.boundHandleHoneypotInputInput, {
          passive: true
        });
        this.honeypotInput.addEventListener("change", this.boundHandleHoneypotInputChange, {
          passive: true
        });
        this.honeypotButton = this.elementsCreator.createElement("button", {
          width: "1px",
          height: "1px"
        });
        this.honeypotButton.type = "button";
        this.honeypotButton.name = "url";
        this.honeypotButton.tabIndex = -1;
        this.honeypotButton.setAttribute("aria-hidden", "true");
        this.honeypotButton.setAttribute("autocomplete", "off");
        this.honeypotButton.textContent = "";
        this.honeypotButton.addEventListener("click", this.boundHandleHoneypotButtonClick, {
          passive: true
        });
        this.honeypotButton.addEventListener("focus", this.boundHandleHoneypotButtonFocus);
        wrapper.append(this.honeypotInput, this.honeypotButton);
        if ((captcha = this.captcha) !== null && captcha !== undefined) {
          captcha.append(wrapper);
        }
      } catch (error) {}
    };
    BasiliskCaptcha.prototype.initPopup = function () {
      var wrapper;
      var body;
      var self = this;
      this.popup = this.elementsCreator.createPopup();
      this.popup.close();
      this.popupContent = this.elementsCreator.createPopupContent(this.isDark);
      this.popup.append(this.popupContent);
      this.canvasWrapper = this.elementsCreator.createCanvasWrapper();
      this.canvas = this.elementsCreator.createCanvas({
        width: "100%"
      });
      this.canvasCtx = this.canvas.getContext("2d");
      this.challengePuzzle = this.elementsCreator.createChallengePuzzle();
      this.challengePuzzleCtx = this.challengePuzzle.getContext("2d");
      this.a11yCursor = this.elementsCreator.createElement("div", {
        position: "absolute",
        width: "16px",
        height: "16px",
        borderRadius: "999px",
        border: "2px solid #24AFFF",
        boxSizing: "border-box",
        pointerEvents: "none",
        display: "none",
        transform: "translate(-50%, -50%)",
        zIndex: "3"
      });
      if ((wrapper = this.canvasWrapper) !== null && wrapper !== undefined) {
        wrapper.append(this.a11yCursor);
      }
      this.result = this.elementsCreator.createResult();
      this.canvasWrapper.append(this.canvas, this.challengePuzzle, this.result);
      this.sliderContainer = this.elementsCreator.createSlideContainer(this.isDark);
      this.slider = this.elementsCreator.createSlider();
      this.sliderText = this.elementsCreator.createSliderText();
      this.slider.append(this.elementsCreator.createSliderIcon());
      this.sliderContainer.append(this.slider, this.sliderText);
      this.challenge = this.elementsCreator.createChallenge(function () {
        var spinner;
        self.isPopupCanBeClosed = true;
        if ((spinner = self.spinner) !== null && spinner !== undefined) {
          spinner.stop();
        }
      });
      this.challenge.append(this.canvasWrapper, this.sliderContainer);
      var controlPanel = this.elementsCreator.createControlPanel();
      this.closeIcon = this.elementsCreator.createControlIcon("-167px", "-195px");
      this.refreshIcon = this.elementsCreator.createControlIcon("-279px", "-307px");
      this.infoIcon = this.elementsCreator.createControlIcon("-223px", "-251px");
      controlPanel.append(this.closeIcon, this.refreshIcon, this.infoIcon);
      var footer = this.elementsCreator.createFooter();
      footer.append(controlPanel);
      if ((body = document.querySelector("body")) !== null && body !== undefined) {
        body.append(this.popup);
      }
      this.popupContent.append(this.challenge, footer);
      this.enableA11yMode();
      if (this.challengeData?.data?.type === "rotation") {
        this.initRotationCaptchaImg();
      } else {
        this.initSlideCaptchaImg();
      }
      this.bindChallengeEvents();
    };
    BasiliskCaptcha.prototype.initSlideCaptchaImg = function () {
      var self = this;
      try {
        var backgroundImage = new Image();
        backgroundImage.crossOrigin = "Anonymous";
        backgroundImage.onload = function () {
          var ctx;
          if ((ctx = self.canvasCtx) !== null && ctx !== undefined) {
            ctx.drawImage(backgroundImage, 0, 0, Constants.canvasWidth, Constants.canvasHeight);
          }
        };
        backgroundImage.src = this.challengeData?.data?.background_url;
        var slideImage = new Image();
        slideImage.crossOrigin = "Anonymous";
        slideImage.onload = function () {
          var puzzleCtx;
          if (self.challengePuzzle && self.challengeData?.data?.slide_y) {
            self.challengePuzzle.width = Constants.puzzleSize;
            self.challengePuzzle.height = slideImage.height;
            self.challengePuzzle.style.top = `${self.challengeData?.data?.slide_y + 1}px`;
            if ((puzzleCtx = self.challengePuzzleCtx) !== null && puzzleCtx !== undefined) {
              puzzleCtx.drawImage(slideImage, 0, 0, Constants.puzzleSize, slideImage.height);
            }
          }
        };
        slideImage.src = this.challengeData?.data?.slide_url;
        if (this.sliderText) {
          this.sliderText.textContent = this.challengeData?.data?.a11y_mode && this.challengeData?.data?.a11y_instructions ? this.challengeData.data.a11y_instructions : Constants.barText;
        }
      } catch (error) {
        console.log("Image loading error");
        this.resetSession();
      }
    };
    BasiliskCaptcha.prototype.handleDragStart = function (event) {
      if (this.challengeData) {
        this.recordInteractionTrust(event);
        this.isPopupCanBeClosed = false;
        if (event instanceof MouseEvent) {
          this.startX = event.clientX;
          this.startY = event.clientY;
        }
        if (window.TouchEvent && event instanceof TouchEvent && event.touches.length > 0) {
          this.startX = event.touches[0].clientX;
          this.startY = event.touches[0].clientY;
        }
        this.isMouseDown = true;
        StyleUtils.setStyles(this.slider, {
          cursor: "grabbing"
        });
        document.addEventListener("mousemove", this.boundHandleDragMove);
        document.addEventListener("mouseup", this.boundHandleDragEnd);
        document.addEventListener("touchmove", this.boundHandleDragMove);
        document.addEventListener("touchend", this.boundHandleDragEnd);
      }
    };
    BasiliskCaptcha.prototype.handleDragMove = function (event) {
      if (this.isMouseDown) {
        var coords = this.getEventCoords(event);
        var moveX = coords.moveX;
        var moveY = coords.moveY;
        if (!(moveX < 8) && !(moveX > Constants.canvasWidth - this.slider?.clientWidth - 8)) {
          if (!this.isRotationCaptcha) {
            StyleUtils.setStyles(this.challengePuzzle, {
              left: `${moveX}px`
            });
          }
          StyleUtils.setStyles(this.slider, {
            left: `${moveX}px`
          });
          if (this.isRotationCaptcha) {
            var trackWidth = Constants.canvasWidth - this.slider?.clientWidth - 8;
            var ratio = Math.max(0, Math.min(1, (moveX - 8) / (trackWidth - 8)));
            this.lastRotationRatio = ratio;
            var rotationDelta = Math.round(ratio * 359 * this.rotationGain);
            this.rotationAngle = ((this.rotationOffset + this.rotationDir * rotationDelta) % 360 + 360) % 360;
            this.drawRotationScene();
            this.maybeFireInteractionCheckpoint(ratio, moveX);
          }
          this.addCoordsToTrails(moveX, moveY);
        }
      }
    };
    BasiliskCaptcha.prototype.getEventCoords = function (event) {
      var clientX = 0;
      var clientY = 0;
      if (event instanceof MouseEvent) {
        clientX = event.clientX;
        clientY = event.clientY;
      }
      if (window.TouchEvent && event instanceof TouchEvent && event.touches.length > 0) {
        clientX = event.touches[0].clientX;
        clientY = event.touches[0].clientY;
      }
      return {
        moveX: clientX - this.startX,
        moveY: clientY - this.startY
      };
    };
    BasiliskCaptcha.prototype.handleDragEnd = function (event) {
      var sliderMouse;
      var sliderTouch;
      if (!this.isMouseDown) {
        return false;
      }
      this.recordInteractionTrust(event);
      if (this.trailX.length === 0) {
        var isTouchEvent = window.TouchEvent && event instanceof TouchEvent;
        var coords = this.getEventCoords(event);
        var moveX = coords.moveX;
        var moveY = coords.moveY;
        this.addCoordsToTrails(isTouchEvent ? 0 : moveX, isTouchEvent ? 0 : moveY);
      }
      StyleUtils.setStyles(this.slider, {
        cursor: "pointer"
      });
      this.isMouseDown = false;
      if ((sliderMouse = this.slider) !== null && sliderMouse !== undefined) {
        sliderMouse.removeEventListener("mousedown", this.boundHandleDragStart);
      }
      document.removeEventListener("mousemove", this.boundHandleDragMove);
      document.removeEventListener("mouseup", this.boundHandleDragEnd);
      if ((sliderTouch = this.slider) !== null && sliderTouch !== undefined) {
        sliderTouch.removeEventListener("touchstart", this.boundHandleDragStart);
      }
      document.removeEventListener("touchmove", this.boundHandleDragMove);
      document.removeEventListener("touchend", this.boundHandleDragEnd);
      if (this.isRotationCaptcha) {
        this.submitRotationCaptcha();
      } else {
        this.submitSlideCaptcha();
      }
    };
    BasiliskCaptcha.prototype.submitSlideCaptcha = function () {
      var self = this;
      if (this.challengeData) {
        var body = __assign2({}, this.getThreadedRequestBody({
          captcha_id: this.captcha_id,
          trail_x: this.trailX,
          trail_y: this.trailY
        }, true, true));
        this.fetchData(Constants.slideVerify, body, function () {
          var result;
          if (self.challengeData?.success) {
            if (self.sliderText) {
              self.sliderText.textContent = "";
            }
            if ((result = self.result) !== null && result !== undefined) {
              result.success();
            }
            self.isSliderCaptcha = false;
            if (self.challengeData?.data?.captcha_response) {
              setTimeout(function () {
                self.completeChallenge();
              }, Constants.standartTimeout);
              return;
            }
            setTimeout(function () {
              self.initIconCaptcha();
            }, Constants.standartTimeout);
          } else {
            self.createErrorAnimation();
          }
        });
      }
    };
    BasiliskCaptcha.prototype.initRotationCaptchaImg = function () {
      var self = this;
      try {
        this.isRotationCaptcha = true;
        var hashBytes = sha256Bytes(String(this.captcha_id ?? ""));
        this.rotationDir = hashBytes[0] % 2 == 0 ? 1 : -1;
        this.rotationOffset = (hashBytes[1] << 8 | hashBytes[2]) % 360;
        this.rotationGain = 1;
        this.applyChallengeProgram(this.challengeData?.data?.challenge_program);
        this.lastRotationRatio = 0;
        this.rotationAngle = (this.rotationOffset % 360 + 360) % 360;
        if (this.challengePuzzle) {
          StyleUtils.setStyles(this.challengePuzzle, {
            display: "none"
          });
        }
        var backgroundImage = new Image();
        backgroundImage.crossOrigin = "Anonymous";
        backgroundImage.onload = function () {
          self.rotationBackgroundImage = backgroundImage;
          self.drawRotationScene();
        };
        backgroundImage.src = this.challengeData?.data?.background_url;
        var patchImage = new Image();
        patchImage.crossOrigin = "Anonymous";
        patchImage.onload = function () {
          self.rotationPatchImage = patchImage;
          self.drawRotationScene();
        };
        patchImage.src = this.challengeData?.data?.patch_url;
        if (this.sliderText) {
          this.sliderText.textContent = Constants.rotationBarText;
        }
      } catch (error) {
        console.log("Image loading error");
        this.resetSession();
      }
    };
    BasiliskCaptcha.prototype.drawRotationScene = function () {
      var ctx = this.canvasCtx;
      if (ctx && this.rotationBackgroundImage && (this.clearCanvas(), ctx.drawImage(this.rotationBackgroundImage, 0, 0, Constants.canvasWidth, Constants.canvasHeight), this.rotationPatchImage)) {
        var patchX = this.challengeData?.data?.patch_x ?? 0;
        var patchY = this.challengeData?.data?.patch_y ?? 0;
        var patchSize = this.challengeData?.data?.patch_size ?? 110;
        ctx.save();
        ctx.translate(patchX, patchY);
        ctx.rotate(this.rotationAngle * Math.PI / 180);
        ctx.drawImage(this.rotationPatchImage, -patchSize / 2, -patchSize / 2, patchSize, patchSize);
        ctx.restore();
      }
    };
    BasiliskCaptcha.prototype.initCheckpointState = function (config) {
      this.clearCheckpointState();
      this.challengeStartedAt = Date.now();
      if (config == null ? undefined : config.start_ticket) {
        var minRatio = Math.max(0.1, Math.min(0.9, config.checkpoint?.trigger_min_ratio ?? 0.4));
        var maxRatio = Math.max(minRatio, Math.min(0.95, config.checkpoint?.trigger_max_ratio ?? 0.7));
        this.startTicket = config.start_ticket;
        this.checkpointTriggerRatio = minRatio + Math.random() * (maxRatio - minRatio);
        this.checkpointState = "idle";
      }
    };
    BasiliskCaptcha.prototype.clearCheckpointState = function () {
      var abortController;
      if ((abortController = this.checkpointAbort) !== null && abortController !== undefined) {
        abortController.abort();
      }
      this.startTicket = null;
      this.checkpointTicket = null;
      this.checkpointState = "idle";
      this.checkpointTriggerRatio = null;
      this.checkpointAbort = null;
    };
    BasiliskCaptcha.prototype.maybeFireInteractionCheckpoint = function (progress, sliderPosition) {
      var self = this;
      if (this.isRotationCaptcha && this.checkpointState === "idle" && this.startTicket && this.checkpointTriggerRatio !== null && !(progress < this.checkpointTriggerRatio)) {
        var pointCount = Math.min(this.trailX.length, this.trailY.length);
        if (!(pointCount < 1)) {
          var trailDigest = function (trailX, trailY, count) {
            var canonicalString = function (xs, ys, n) {
              if (!Number.isInteger(n) || n < 1 || n > 512) {
                return null;
              }
              if (xs.length < n || ys.length < n) {
                return null;
              }
              var parts = [`tc1|${n}`];
              for (var i = 0; i < n; i += 1) {
                var xPoint = xs[i];
                var yPoint = ys[i];
                if (!isValidTrailPoint(xPoint) || !isValidTrailPoint(yPoint)) {
                  return null;
                }
                if (xPoint.timestamp !== yPoint.timestamp) {
                  return null;
                }
                parts.push(`;${roundHalfAwayFromZero(xPoint.timestamp)}:${roundHalfAwayFromZero(xPoint.coord)}:${roundHalfAwayFromZero(yPoint.coord)}`);
              }
              return parts.join("");
            }(trailX, trailY, count);
            if (canonicalString === null) {
              return null;
            }
            for (var hashBytes = sha256Bytes(canonicalString), hex = "", j = 0; j < hashBytes.length; j += 1) {
              hex += hashBytes[j].toString(16).padStart(2, "0");
            }
            return hex;
          }(this.trailX, this.trailY, pointCount);
          if (trailDigest) {
            this.checkpointState = "pending";
            this.checkpointAbort = new AbortController();
            var abortSignal = this.checkpointAbort.signal;
            var abortTimer = setTimeout(function () {
              var abortController;
              if ((abortController = self.checkpointAbort) === null || abortController === undefined) {
                return undefined;
              } else {
                return abortController.abort();
              }
            }, 1500);
            var requestBody = this.getThreadedRequestBody({
              captcha_id: this.captcha_id,
              start_ticket: this.startTicket,
              slider_position: Math.round(sliderPosition),
              trail_digest: trailDigest,
              point_count: pointCount,
              elapsed_ms: Math.max(0, Date.now() - this.challengeStartedAt)
            }, true);
            this.sealBody(requestBody).then(function (sealedBody) {
              return fetch(`${Constants.serverUrl}/challenge/interaction-checkpoint`, {
                method: "POST",
                body: JSON.stringify(sealedBody),
                signal: abortSignal
              });
            }).then(function (response) {
              if (!response.ok) {
                throw new Error(`checkpoint status ${response.status}`);
              }
              return response.json();
            }).then(function (result) {
              clearTimeout(abortTimer);
              if ((result == null ? undefined : result.success) && result.data?.checkpoint_ticket) {
                self.checkpointTicket = result.data.checkpoint_ticket;
                self.applyMutation(result.data.mutation);
                self.checkpointState = "applied";
              } else {
                self.checkpointState = "failed";
              }
            }).catch(function () {
              clearTimeout(abortTimer);
              self.checkpointState = "failed";
            });
          } else {
            this.checkpointState = "failed";
          }
        }
      }
    };
    BasiliskCaptcha.prototype.importSealKey = function (sealKeyB64) {
      return __awaiter(this, undefined, undefined, function () {
        var keyBytes;
        var self;
        return __generator(this, function (state) {
          switch (state.label) {
            case 0:
              this.sealKey = null;
              if (!sealKeyB64 || typeof crypto == "undefined" || !crypto.subtle) {
                return [2];
              }
              state.label = 1;
            case 1:
              state.trys.push([1, 3,, 4]);
              if ((keyBytes = this.base64ToBytes(sealKeyB64)) && keyBytes.length === 32) {
                self = this;
                return [4, crypto.subtle.importKey("raw", keyBytes, {
                  name: "AES-GCM"
                }, false, ["encrypt"])];
              } else {
                return [2];
              }
            case 2:
              self.sealKey = state.sent();
              return [3, 4];
            case 3:
              state.sent();
              this.sealKey = null;
              return [3, 4];
            case 4:
              return [2];
          }
        });
      });
    };
    BasiliskCaptcha.prototype.sealBody = function (body) {
      return __awaiter(this, undefined, undefined, function () {
        var record;
        var iv;
        var aad;
        var plaintext;
        var ciphertext;
        return __generator(this, function (state) {
          switch (state.label) {
            case 0:
              if (this.sealKeyPromise) {
                return [4, this.sealKeyPromise];
              } else {
                return [3, 2];
              }
            case 1:
              state.sent();
              state.label = 2;
            case 2:
              record = body;
              if (!this.sealKey || !this.captcha_id || record.captcha_id !== this.captcha_id || typeof crypto == "undefined" || !crypto.subtle) {
                return [2, body];
              }
              state.label = 3;
            case 3:
              state.trys.push([3, 5,, 6]);
              iv = crypto.getRandomValues(new Uint8Array(12));
              aad = new TextEncoder().encode(`bslk-seal-v1|${this.captcha_id}`);
              plaintext = new TextEncoder().encode(JSON.stringify(record));
              return [4, crypto.subtle.encrypt({
                name: "AES-GCM",
                iv: iv,
                additionalData: aad
              }, this.sealKey, plaintext)];
            case 4:
              ciphertext = state.sent();
              return [2, {
                sealed: 1,
                v: 1,
                cid: this.captcha_id,
                iv: this.bytesToBase64(iv),
                ct: this.bytesToBase64(new Uint8Array(ciphertext))
              }];
            case 5:
              state.sent();
              return [2, body];
            case 6:
              return [2];
          }
        });
      });
    };
    BasiliskCaptcha.prototype.base64ToBytes = function (base64) {
      try {
        for (var binary = atob(base64), bytes = new Uint8Array(binary.length), i = 0; i < binary.length; i++) {
          bytes[i] = binary.charCodeAt(i);
        }
        return bytes;
      } catch (error) {
        return null;
      }
    };
    BasiliskCaptcha.prototype.bytesToBase64 = function (bytes) {
      var binary = "";
      for (var i = 0; i < bytes.length; i++) {
        binary += String.fromCharCode(bytes[i]);
      }
      return btoa(binary);
    };
    BasiliskCaptcha.prototype.applyChallengeProgram = function (program) {
      if (program && program.v === 1 && Array.isArray(program.ops)) {
        for (var i = 0, ops = program.ops.slice(0, 4); i < ops.length; i++) {
          var op = ops[i];
          if (op && typeof op.op == "string") {
            if (op.op === "scale" && typeof op.g == "number" && Number.isFinite(op.g)) {
              this.rotationGain = Math.max(1, Math.min(1.5, op.g));
            } else if (op.op === "offset" && typeof op.d == "number" && Number.isFinite(op.d)) {
              var offset = Math.max(-45, Math.min(45, Math.trunc(op.d)));
              this.rotationOffset = this.rotationOffset + offset;
            } else if (op.op === "flip") {
              this.rotationDir = -this.rotationDir;
            }
          }
        }
      }
    };
    BasiliskCaptcha.prototype.applyMutation = function (mutation) {
      if (mutation == null ? undefined : mutation.family) {
        var params = mutation.params ?? {};
        if (mutation.family === "mapping_offset" && typeof params.delta_degrees == "number" && Number.isFinite(params.delta_degrees)) {
          var deltaDegrees = Math.max(-45, Math.min(45, Math.trunc(params.delta_degrees)));
          this.rotationOffset = ((this.rotationOffset + deltaDegrees) % 360 + 360) % 360;
        } else if (mutation.family === "gain_change" && typeof params.gain == "number" && Number.isFinite(params.gain)) {
          this.rotationGain = Math.max(0.5, Math.min(1.5, params.gain));
        } else {
          if (mutation.family !== "direction_flip") {
            return;
          }
          this.rotationDir = -this.rotationDir;
        }
        var rotationDelta = Math.round(this.lastRotationRatio * 359 * this.rotationGain);
        this.rotationAngle = ((this.rotationOffset + this.rotationDir * rotationDelta) % 360 + 360) % 360;
        this.drawRotationScene();
      }
    };
    BasiliskCaptcha.prototype.submitRotationCaptcha = function () {
      var abortController;
      var self = this;
      if (this.challengeData) {
        if (this.checkpointState === "pending") {
          if ((abortController = this.checkpointAbort) !== null && abortController !== undefined) {
            abortController.abort();
          }
          this.checkpointState = "failed";
        }
        var body = __assign2({}, this.getThreadedRequestBody(__assign2({
          captcha_id: this.captcha_id,
          angle: this.rotationAngle,
          trail_x: this.trailX,
          trail_y: this.trailY
        }, this.checkpointTicket ? {
          checkpoint_ticket: this.checkpointTicket
        } : {}), true, true));
        this.fetchData(Constants.rotationVerify, body, function () {
          var result;
          if (self.challengeData?.success) {
            if (self.sliderText) {
              self.sliderText.textContent = "";
            }
            if ((result = self.result) !== null && result !== undefined) {
              result.success();
            }
            self.isSliderCaptcha = false;
            self.isRotationCaptcha = false;
            if (self.challengeData?.data?.captcha_response) {
              setTimeout(function () {
                self.completeChallenge();
              }, Constants.standartTimeout);
              return;
            }
            setTimeout(function () {
              self.initIconCaptcha();
            }, Constants.standartTimeout);
          } else {
            self.createErrorAnimation();
          }
        });
      }
    };
    BasiliskCaptcha.prototype.setA11yCursorPosition = function (x, y) {
      var clampedX = Math.max(0, Math.min(Constants.canvasWidth - 1, x));
      var clampedY = Math.max(0, Math.min(Constants.canvasHeight - 1, y));
      if (this.a11yCursor) {
        StyleUtils.setStyles(this.a11yCursor, {
          display: "block",
          left: `${clampedX}px`,
          top: `${clampedY}px`
        });
      }
    };
    BasiliskCaptcha.prototype.enableA11yMode = function () {
      var canvas;
      var canvasEl;
      if (!this.a11yMode && this.challengeData?.data?.a11y_mode) {
        this.a11yMode = true;
        window.addEventListener("keydown", this.boundHandleA11yKeydown);
        if ((canvas = this.canvas) !== null && canvas !== undefined) {
          canvas.setAttribute("tabindex", "0");
        }
        if ((canvasEl = this.canvas) !== null && canvasEl !== undefined) {
          canvasEl.setAttribute("aria-label", this.challengeData?.data?.a11y_instructions ?? "Use arrow keys and Enter");
        }
        this.setA11yCursorPosition(Constants.canvasWidth / 2, Constants.canvasHeight / 2);
      }
    };
    BasiliskCaptcha.prototype.disableA11yMode = function () {
      if (this.a11yMode) {
        this.a11yMode = false;
        window.removeEventListener("keydown", this.boundHandleA11yKeydown);
        if (this.a11yCursor) {
          StyleUtils.setStyles(this.a11yCursor, {
            display: "none"
          });
        }
      }
    };
    BasiliskCaptcha.prototype.handleA11yKeydown = function (event) {
      var sliderEl;
      var cursorTopEl;
      var cursorLeftEl;
      var cursorXEl;
      var cursorYEl;
      var verifyBtn;
      if (this.a11yMode && this.challengeData?.success) {
        this.recordInteractionTrust(event);
        var step = 12;
        var sliderWidth = this.slider?.clientWidth ?? 0;
        var sliderLeft = parseInt(((sliderEl = this.slider) === null || sliderEl === undefined ? undefined : sliderEl.style.left) || `${Constants.sliderStartPosition}`, 10) || Constants.sliderStartPosition;
        var cursorTop = parseInt(((cursorTopEl = this.a11yCursor) === null || cursorTopEl === undefined ? undefined : cursorTopEl.style.top) || `${Constants.canvasHeight / 2}`, 10) || Constants.canvasHeight / 2;
        var cursorLeft = parseInt(((cursorLeftEl = this.a11yCursor) === null || cursorLeftEl === undefined ? undefined : cursorLeftEl.style.left) || `${Constants.canvasWidth / 2}`, 10) || Constants.canvasWidth / 2;
        if (this.isSliderCaptcha) {
          if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
            event.preventDefault();
            var direction = event.key === "ArrowLeft" ? -1 : 1;
            var newLeft = Math.max(8, Math.min(Constants.canvasWidth - sliderWidth - 8, sliderLeft + direction * step));
            StyleUtils.setStyles(this.challengePuzzle, {
              left: `${newLeft}px`
            });
            StyleUtils.setStyles(this.slider, {
              left: `${newLeft}px`
            });
            this.addCoordsToTrails(newLeft, 0);
          }
          if (event.key === "Enter") {
            event.preventDefault();
            this.isMouseDown = false;
            if (this.trailX.length === 0) {
              this.addCoordsToTrails(sliderLeft, 0);
            }
            this.submitSlideCaptcha();
          }
        } else {
          if (event.key === "ArrowLeft") {
            event.preventDefault();
            this.setA11yCursorPosition(cursorLeft - step, cursorTop);
            this.addCoordsToTrails(cursorLeft - step, cursorTop);
          }
          if (event.key === "ArrowRight") {
            event.preventDefault();
            this.setA11yCursorPosition(cursorLeft + step, cursorTop);
            this.addCoordsToTrails(cursorLeft + step, cursorTop);
          }
          if (event.key === "ArrowUp") {
            event.preventDefault();
            this.setA11yCursorPosition(cursorLeft, cursorTop - step);
            this.addCoordsToTrails(cursorLeft, cursorTop - step);
          }
          if (event.key === "ArrowDown") {
            event.preventDefault();
            this.setA11yCursorPosition(cursorLeft, cursorTop + step);
            this.addCoordsToTrails(cursorLeft, cursorTop + step);
          }
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            var clickX = parseInt(((cursorXEl = this.a11yCursor) === null || cursorXEl === undefined ? undefined : cursorXEl.style.left) || `${Constants.canvasWidth / 2}`, 10) || Constants.canvasWidth / 2;
            var clickY = parseInt(((cursorYEl = this.a11yCursor) === null || cursorYEl === undefined ? undefined : cursorYEl.style.top) || `${Constants.canvasHeight / 2}`, 10) || Constants.canvasHeight / 2;
            if (this.clickedIcons.length < Constants.totalIconsAmount) {
              this.clickedIcons.push({
                x: clickX,
                y: clickY
              });
              this.drawIcons();
            }
            if (this.clickedIcons.length === Constants.totalIconsAmount) {
              if ((verifyBtn = this.verifyButton) !== null && verifyBtn !== undefined) {
                verifyBtn.click();
              }
            }
          }
        }
      }
    };
    BasiliskCaptcha.prototype.isMobile = function () {
      return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    };
    BasiliskCaptcha.prototype.getCanvasClicks = function (event) {
      var canvas;
      var rect = (canvas = this.canvas) === null || canvas === undefined ? undefined : canvas.getBoundingClientRect();
      return {
        clickX: event.clientX - rect.left,
        clickY: event.clientY - rect.top
      };
    };
    BasiliskCaptcha.prototype.addCoordsToTrails = function (x, y) {
      var timestamp = Date.now();
      if (timestamp > this.lastCallTimestamp) {
        this.trailX.push({
          timestamp: timestamp,
          coord: x
        });
        this.trailY.push({
          timestamp: timestamp,
          coord: y
        });
        this.lastCallTimestamp = timestamp;
      }
    };
    BasiliskCaptcha.prototype.trackingPopupContentEvents = function (event) {
      this.recordInteractionTrust(event);
      var clicks = this.getCanvasClicks(event);
      var clickX = clicks.clickX;
      var clickY = clicks.clickY;
      this.addCoordsToTrails(clickX, clickY);
    };
    BasiliskCaptcha.prototype.handleCanvasClick = function (event) {
      var popupContentMobile;
      var popupContentDesktop;
      this.recordInteractionTrust(event);
      var clicks = this.getCanvasClicks(event);
      var clickX = clicks.clickX;
      var clickY = clicks.clickY;
      if (this.trailX.length === 0) {
        if (this.isMobile()) {
          if ((popupContentMobile = this.popupContent) !== null && popupContentMobile !== undefined) {
            popupContentMobile.addEventListener("click", this.boundTrackingPopupContentEvents);
          }
        } else {
          this.addCoordsToTrails(clickX, clickY);
          if ((popupContentDesktop = this.popupContent) !== null && popupContentDesktop !== undefined) {
            popupContentDesktop.addEventListener("mousemove", this.boundTrackingPopupContentEvents);
          }
        }
      }
      var clickRadius = Constants.clickCircleRadius;
      var removed = false;
      for (var i = 0; i < this.clickedIcons.length; i++) {
        var icon = this.clickedIcons[i];
        var dx = clickX - icon.x;
        var dy = clickY - icon.y;
        if (dx * dx + dy * dy <= clickRadius * clickRadius) {
          this.clickedIcons.splice(i, 1);
          removed = true;
          break;
        }
      }
      if (!removed && this.clickedIcons.length < Constants.totalIconsAmount) {
        this.clickedIcons.push({
          x: clickX,
          y: clickY
        });
        this.drawIcons();
      } else if (removed) {
        this.drawIcons();
      }
    };
    BasiliskCaptcha.prototype.handleVerifyButtonClick = function (event) {
      var verifyButton;
      var canvas;
      var popupContentClick;
      var popupContentMove;
      var self = this;
      this.recordInteractionTrust(event);
      if ((verifyButton = this.verifyButton) !== null && verifyButton !== undefined) {
        verifyButton.removeEventListener("click", this.boundVerifyButtonClick);
      }
      if ((canvas = this.canvas) !== null && canvas !== undefined) {
        canvas.removeEventListener("click", this.boundHandleCanvasClick);
      }
      this.trackingPopupContentEvents(event);
      if ((popupContentClick = this.popupContent) !== null && popupContentClick !== undefined) {
        popupContentClick.removeEventListener("click", this.boundTrackingPopupContentEvents);
      }
      if ((popupContentMove = this.popupContent) !== null && popupContentMove !== undefined) {
        popupContentMove.removeEventListener("mousemove", this.boundTrackingPopupContentEvents);
      }
      this.isPopupCanBeClosed = false;
      if (this.clickedIcons.length === Constants.totalIconsAmount) {
        var body = __assign2(__assign2({}, this.getThreadedRequestBody({
          captcha_id: this.captcha_id,
          coords: this.clickedIcons,
          trail_x: this.trailX,
          trail_y: this.trailY
        }, true, true)), this.getProofOfWorkSubmission());
        this.fetchData(Constants.iconsVerify, body, function () {
          if (self.challengeData?.success) {
            StyleUtils.createDelayAnimation(Constants.shortTimeout, function () {
              var result;
              if ((result = self.result) !== null && result !== undefined) {
                result.success();
              }
              setTimeout(function () {
                self.completeChallenge();
              }, Constants.standartTimeout);
            });
          } else {
            self.createErrorAnimation();
          }
        });
      } else {
        this.createErrorAnimation();
      }
    };
    BasiliskCaptcha.prototype.completeChallenge = function () {
      var popup;
      var humanBlock;
      var checkbox;
      var challenge;
      var captchaValue;
      var self = this;
      var captchaResponse = this.challengeData?.data?.captcha_response;
      if (captchaResponse) {
        this.verified = true;
        if ((popup = this.popup) !== null && popup !== undefined) {
          popup.close();
        }
        this.resetOneMinTimout();
        if ((humanBlock = this.humanBlock) !== null && humanBlock !== undefined) {
          humanBlock.addEventListener("click", this.boundHandleHumanClick);
        }
        if ((checkbox = this.checkbox) !== null && checkbox !== undefined) {
          checkbox.append(this.checked);
        }
        if ((challenge = this.challenge) !== null && challenge !== undefined) {
          challenge.hide();
        }
        if ((captchaValue = this.captchaValue) !== null && captchaValue !== undefined) {
          captchaValue.setAttribute("value", captchaResponse);
        }
        this.dispatch(captchaResponse);
        this.threeMinsTimoutId = setTimeout(function () {
          self.resetSession();
          self.resetThreeMinsTimout();
        }, Constants.threeMinutsTimeout);
      } else {
        this.resetSession();
      }
    };
    BasiliskCaptcha.prototype.resetOneMinTimout = function () {
      if (this.oneMinTimoutId) {
        clearTimeout(this.oneMinTimoutId);
        this.oneMinTimoutId = null;
      }
    };
    BasiliskCaptcha.prototype.resetThreeMinsTimout = function () {
      if (this.threeMinsTimoutId) {
        clearTimeout(this.threeMinsTimoutId);
        this.threeMinsTimoutId = null;
      }
    };
    BasiliskCaptcha.prototype.reset = function () {
      var checked;
      var humanBlock;
      var spinner;
      var popupToClose;
      var challengeToHide;
      var popupToRemove;
      var challengeToRemove;
      this.resetOneMinTimout();
      this.resetThreeMinsTimout();
      this.resetClientSignals();
      this.resetPrechallengeSignals();
      this.resetHoneypotSignals();
      this.resetClientIntegritySignals();
      this.resetProofOfWorkSignals();
      this.verified = false;
      this.challengeData = null;
      this.captcha_id = null;
      this.sessionSid = null;
      this.sealKey = null;
      this.sealKeyPromise = null;
      this.isSliderCaptcha = true;
      this.isRotationCaptcha = false;
      this.rotationAngle = 0;
      this.rotationDir = 1;
      this.rotationOffset = 0;
      this.rotationBackgroundImage = null;
      this.rotationPatchImage = null;
      this.clearCheckpointState();
      this.disableA11yMode();
      this.trailX = [];
      this.trailY = [];
      this.clickedIcons = [];
      if ((checked = this.checked) !== null && checked !== undefined) {
        checked.remove();
      }
      this.dispatch(null);
      if ((humanBlock = this.humanBlock) !== null && humanBlock !== undefined) {
        humanBlock.addEventListener("click", this.boundHandleHumanClick);
      }
      if (this.popup) {
        if ((spinner = this.spinner) !== null && spinner !== undefined) {
          spinner.stop();
        }
        if ((popupToClose = this.popup) !== null && popupToClose !== undefined) {
          popupToClose.close();
        }
        if ((challengeToHide = this.challenge) !== null && challengeToHide !== undefined) {
          challengeToHide.hide();
        }
        if ((popupToRemove = this.popup) !== null && popupToRemove !== undefined) {
          popupToRemove.remove();
        }
        if ((challengeToRemove = this.challenge) !== null && challengeToRemove !== undefined) {
          challengeToRemove.remove();
        }
      }
    };
    BasiliskCaptcha.prototype.resetSession = function (callback = function () {}) {
      this.reset();
      StyleUtils.setStyles(this.errorMessage, {
        display: "block"
      });
      StyleUtils.setStyles(this.checkbox, {
        borderColor: "red"
      });
      callback();
    };
    BasiliskCaptcha.prototype.createErrorAnimation = function () {
      var self = this;
      StyleUtils.createDelayAnimation(Constants.shortTimeout, function () {
        var result;
        var popupContent = self.popup?.firstChild;
        var startTime = null;
        function shakeStep(timestamp) {
          startTime ||= timestamp;
          var elapsed = timestamp - startTime;
          if (elapsed <= 400) {
            var progress = elapsed / 400;
            var offset = 0;
            if (progress < 0.125) {
              offset = -5;
            } else if (progress < 0.375) {
              offset = 5;
            } else if (progress < 0.625) {
              offset = -5;
            } else if (progress < 0.875) {
              offset = 5;
            }
            StyleUtils.setStyles(popupContent, {
              marginLeft: `${offset}px`
            });
            requestAnimationFrame(shakeStep);
          } else {
            StyleUtils.setStyles(popupContent, {
              marginLeft: "0"
            });
            setTimeout(function () {
              var resultRef;
              if ((resultRef = self.result) !== null && resultRef !== undefined) {
                resultRef.hide();
              }
              setTimeout(function () {
                if (self.isRotationCaptcha) {
                  self.resetSession();
                } else if (self.isSliderCaptcha) {
                  self.resetSlideCaptcha();
                } else {
                  self.resetIconCaptcha();
                }
              }, Constants.standartTimeout);
            }, Constants.standartTimeout);
          }
        }
        requestAnimationFrame(shakeStep);
        if ((result = self.result) !== null && result !== undefined) {
          result.error();
        }
      });
    };
    BasiliskCaptcha.prototype.clearCanvas = function () {
      var ctx;
      if ((ctx = this.canvasCtx) !== null && ctx !== undefined) {
        ctx.clearRect(0, 0, Constants.canvasWidth, Constants.canvasHeight);
      }
    };
    BasiliskCaptcha.prototype.drawIcons = function () {
      var self = this;
      this.clearCanvas();
      var ctx = this.canvasCtx;
      this.clickedIcons.forEach(function (icon) {
        var x = icon.x;
        var y = icon.y;
        if (ctx) {
          ctx.fillStyle = Constants.blueColor;
          ctx.beginPath();
          ctx.arc(x, y, Constants.clickCircleRadius, 0, Math.PI * 2);
          ctx.fill();
          ctx.lineWidth = 3;
          ctx.strokeStyle = "white";
          ctx.stroke();
          ctx.font = "16px Arial";
          ctx.fillStyle = "white";
          var number = self.clickedIcons.indexOf(icon) + 1;
          var textWidth = ctx.measureText(`${number}`).width;
          ctx.fillText(`${number}`, x - textWidth / 2, y + 6.4);
        }
      });
    };
    BasiliskCaptcha.prototype.initializeIconsChallenge = function () {
      if (this.challengeData?.data?.background_url) {
        StyleUtils.setStyles(this.canvasWrapper, {
          backgroundImage: `url(${this.challengeData.data.background_url})`
        });
      }
      this.clearCanvas();
    };
    BasiliskCaptcha.prototype.setCheckboxBorderStyles = function () {
      StyleUtils.setStyles(this.checkbox, {
        borderColor: this.isDark ? Constants.primaryBorderColor : Constants.secondaryBorderColor
      });
    };
    BasiliskCaptcha.prototype.bindInitialsEvents = function () {
      var checkbox;
      var checkboxRef;
      var humanBlock;
      var self = this;
      if ((checkbox = this.checkbox) !== null && checkbox !== undefined) {
        checkbox.addEventListener("mouseover", function () {
          StyleUtils.setStyles(self.checkbox, {
            borderColor: Constants.blueColor
          });
        });
      }
      if ((checkboxRef = this.checkbox) !== null && checkboxRef !== undefined) {
        checkboxRef.addEventListener("mouseleave", function () {
          self.setCheckboxBorderStyles();
        });
      }
      if ((humanBlock = this.humanBlock) !== null && humanBlock !== undefined) {
        humanBlock.addEventListener("click", this.boundHandleHumanClick);
      }
    };
    BasiliskCaptcha.prototype.handleHumanBlockClick = function (event) {
      var humanBlock;
      var spinner;
      var self = this;
      if (!this.verified) {
        this.snapshotPrechallengeSignals();
        this.resetClientSignals();
        this.recordInteractionTrust(event);
        if ((humanBlock = this.humanBlock) !== null && humanBlock !== undefined) {
          humanBlock.removeEventListener("click", this.boundHandleHumanClick);
        }
        this.setCheckboxBorderStyles();
        StyleUtils.setStyles(this.errorMessage, {
          display: "none"
        });
        if (this.checkbox) {
          this.spinner ||= this.elementsCreator.createSpinner(this.checkbox);
          if ((spinner = this.spinner) !== null && spinner !== undefined) {
            spinner.start();
          }
          this.resetOneMinTimout();
        }
        this.fetchData(Constants.createChallenge, this.getCreateChallengeRequestBody(), function () {
          if (self.challengeData?.success) {
            self.captcha_id = self.challengeData.data?.captcha_id;
            self.sessionSid = self.challengeData.data?.sid ?? null;
            self.clientIntegritySeed = self.challengeData.data?.client_integrity_seed ?? null;
            self.sealKeyPromise = self.importSealKey(self.challengeData.data?.seal_key);
            self.initCheckpointState(self.challengeData.data);
            self.startProofOfWorkSolve(self.challengeData.data?.pow);
            if (self.captcha_id) {
              self.initPopup();
              StyleUtils.createDelayAnimation(Constants.shortTimeout, function () {
                var popup;
                var challenge;
                if ((popup = self.popup) !== null && popup !== undefined) {
                  popup.open();
                }
                if ((challenge = self.challenge) !== null && challenge !== undefined) {
                  challenge.show();
                }
                self.oneMinTimoutId = setTimeout(function () {
                  self.resetSession();
                }, Constants.oneMinuteTimeout);
              });
            } else {
              self.resetSession(function () {
                var spinnerInstance;
                if ((spinnerInstance = self.spinner) !== null && spinnerInstance !== undefined) {
                  spinnerInstance.stop();
                }
              });
            }
          } else {
            self.resetSession(function () {
              var spinnerRef;
              if ((spinnerRef = self.spinner) !== null && spinnerRef !== undefined) {
                spinnerRef.stop();
              }
            });
          }
        });
      }
    };
    BasiliskCaptcha.prototype.bindChallengeEvents = function () {
      var refreshIcon;
      var closeIcon;
      var popup;
      var infoIcon;
      var sliderForMouseDown;
      var sliderForTouchStart;
      var sliderForMouseOver;
      var sliderForMouseLeave;
      var self = this;
      if ((refreshIcon = this.refreshIcon) !== null && refreshIcon !== undefined) {
        refreshIcon.addEventListener("click", function () {
          if (self.isPopupCanBeClosed) {
            self.isPopupCanBeClosed = false;
            if (self.isRotationCaptcha) {
              self.resetSession();
            } else if (self.isSliderCaptcha) {
              self.resetSlideCaptcha();
            } else {
              self.resetIconCaptcha();
            }
          }
        });
      }
      if ((closeIcon = this.closeIcon) !== null && closeIcon !== undefined) {
        closeIcon.addEventListener("click", function () {
          if (self.isPopupCanBeClosed) {
            self.reset();
          }
        });
      }
      if ((popup = this.popup) !== null && popup !== undefined) {
        popup.addEventListener("click", function (event) {
          if (self.isPopupCanBeClosed && event.currentTarget === event.target) {
            self.reset();
          }
        });
      }
      if ((infoIcon = this.infoIcon) !== null && infoIcon !== undefined) {
        infoIcon.addEventListener("click", function () {
          window.open(Constants.videoManualUrl, "_blank");
        });
      }
      if ((sliderForMouseDown = this.slider) !== null && sliderForMouseDown !== undefined) {
        sliderForMouseDown.addEventListener("mousedown", this.boundHandleDragStart);
      }
      if ((sliderForTouchStart = this.slider) !== null && sliderForTouchStart !== undefined) {
        sliderForTouchStart.addEventListener("touchstart", this.boundHandleDragStart);
      }
      if ((sliderForMouseOver = this.slider) !== null && sliderForMouseOver !== undefined) {
        sliderForMouseOver.addEventListener("mouseover", function () {
          StyleUtils.setStyles(self.slider, {
            backgroundColor: "#24AFFF"
          });
          if (self.isMouseDown) {
            StyleUtils.setStyles(self.slider, {
              cursor: "grabbing"
            });
          }
        });
      }
      if ((sliderForMouseLeave = this.slider) !== null && sliderForMouseLeave !== undefined) {
        sliderForMouseLeave.addEventListener("mouseleave", function () {
          StyleUtils.setStyles(self.slider, {
            backgroundColor: "#009EFB"
          });
        });
      }
    };
    BasiliskCaptcha.prototype.initIconCaptcha = function () {
      var spinner;
      var self = this;
      if ((spinner = this.spinner) !== null && spinner !== undefined) {
        spinner.start();
      }
      var requestBody = this.getThreadedRequestBody({
        captcha_id: this.captcha_id
      }, true);
      this.fetchData(Constants.iconsChallenge, requestBody, function () {
        var challengeToHide;
        var result;
        if ((challengeToHide = self.challenge) !== null && challengeToHide !== undefined) {
          challengeToHide.hide();
        }
        if ((result = self.result) !== null && result !== undefined) {
          result.hide();
        }
        setTimeout(function () {
          var challengeToClear;
          var challengePuzzle;
          var challengeToPrepend;
          var challengeToAppend;
          var challengeToShow;
          var canvas;
          self.clearCanvas();
          self.trailX = [];
          self.trailY = [];
          StyleUtils.setStyles(self.popupContent, {
            height: "476px",
            transition: "height 0.5s cubic-bezier(0.4, 2.5, 0.4, 0.6)"
          });
          if ((challengeToClear = self.challenge) !== null && challengeToClear !== undefined) {
            challengeToClear.children[1].remove();
          }
          if ((challengePuzzle = self.challengePuzzle) !== null && challengePuzzle !== undefined) {
            challengePuzzle.remove();
          }
          self.initializeIconsChallenge();
          self.verifyButton = self.elementsCreator.createVerifyButton();
          self.order = self.elementsCreator.createOrder(self.isDark);
          var iconsOrder = self.challengeData?.data?.icons_order;
          if (iconsOrder) {
            self.order.showIcons(iconsOrder);
          }
          if ((challengeToPrepend = self.challenge) !== null && challengeToPrepend !== undefined) {
            challengeToPrepend.prepend(self.order);
          }
          if ((challengeToAppend = self.challenge) !== null && challengeToAppend !== undefined) {
            challengeToAppend.append(self.verifyButton);
          }
          if ((challengeToShow = self.challenge) !== null && challengeToShow !== undefined) {
            challengeToShow.show();
          }
          if ((canvas = self.canvas) !== null && canvas !== undefined) {
            canvas.addEventListener("click", self.boundHandleCanvasClick);
          }
          self.verifyButton.addEventListener("click", self.boundVerifyButtonClick);
          if (self.a11yMode) {
            self.setA11yCursorPosition(Constants.canvasWidth / 2, Constants.canvasHeight / 2);
          }
        }, Constants.mediumTimeout);
      });
    };
    BasiliskCaptcha.prototype.resetSlideCaptcha = function () {
      var spinner;
      var self = this;
      if ((spinner = this.spinner) !== null && spinner !== undefined) {
        spinner.start();
      }
      var requestBody = this.getThreadedRequestBody({
        captcha_id: this.captcha_id
      }, true);
      this.fetchData(Constants.slideChallenge, requestBody, function () {
        var challengeToHide;
        if ((challengeToHide = self.challenge) !== null && challengeToHide !== undefined) {
          challengeToHide.hide();
        }
        setTimeout(function () {
          var puzzleCtx;
          var sliderText;
          var challengeToShow;
          var sliderForMouseDown;
          var sliderForTouchStart;
          self.trailX = [];
          self.trailY = [];
          StyleUtils.setStyles(self.slider, {
            left: `${Constants.sliderStartPosition}px`
          });
          StyleUtils.setStyles(self.challengePuzzle, {
            left: `${Constants.sliderStartPosition}px`
          });
          if (self.challengePuzzle) {
            self.challengePuzzle.width = Constants.canvasWidth;
          }
          self.clearCanvas();
          if ((puzzleCtx = self.challengePuzzleCtx) !== null && puzzleCtx !== undefined) {
            puzzleCtx.clearRect(0, 0, Constants.canvasWidth, Constants.canvasHeight);
          }
          if ((sliderText = self.sliderText) !== null && sliderText !== undefined) {
            sliderText.setAttribute("data-text", self.sliderText?.textContent);
          }
          if (self.sliderText) {
            self.sliderText.textContent = Constants.loadingText;
          }
          self.initSlideCaptchaImg();
          if ((challengeToShow = self.challenge) !== null && challengeToShow !== undefined) {
            challengeToShow.show();
          }
          if ((sliderForMouseDown = self.slider) !== null && sliderForMouseDown !== undefined) {
            sliderForMouseDown.addEventListener("mousedown", self.boundHandleDragStart);
          }
          if ((sliderForTouchStart = self.slider) !== null && sliderForTouchStart !== undefined) {
            sliderForTouchStart.addEventListener("touchstart", self.boundHandleDragStart);
          }
        }, Constants.mediumTimeout);
      });
    };
    BasiliskCaptcha.prototype.resetIconCaptcha = function () {
      var spinner;
      var self = this;
      if ((spinner = this.spinner) !== null && spinner !== undefined) {
        spinner.start();
      }
      var body = this.getThreadedRequestBody({
        captcha_id: this.captcha_id
      }, true);
      this.fetchData(Constants.iconsChallenge, body, function () {
        var challengeToHide;
        if ((challengeToHide = self.challenge) !== null && challengeToHide !== undefined) {
          challengeToHide.hide();
        }
        setTimeout(function () {
          var order;
          var challengeToShow;
          var canvas;
          var verifyButton;
          self.trailX = [];
          self.trailY = [];
          self.clickedIcons = [];
          if ((order = self.order) !== null && order !== undefined) {
            order.showIcons(self.challengeData?.data?.icons_order);
          }
          self.initializeIconsChallenge();
          if ((challengeToShow = self.challenge) !== null && challengeToShow !== undefined) {
            challengeToShow.show();
          }
          if ((canvas = self.canvas) !== null && canvas !== undefined) {
            canvas.addEventListener("click", self.boundHandleCanvasClick);
          }
          if ((verifyButton = self.verifyButton) !== null && verifyButton !== undefined) {
            verifyButton.addEventListener("click", self.boundVerifyButtonClick);
          }
        }, Constants.mediumTimeout);
      });
    };
    return BasiliskCaptcha;
  }();
  var container = document.querySelector(".basilisk_captcha");
  window.BasiliskCaptcha = container ? new BasiliskCaptcha(container) : BasiliskCaptcha;
})();
