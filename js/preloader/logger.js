/**
 * ---
 * aix:
 *   id: frontend.js.preloader.logger
 *   role: Frontend runtime module: js/preloader/logger.js
 *   status: stable
 *   surface: public
 *   scope: frontend
 *   runtime: browser
 *   tags:
 *     - frontend
 *     - js
 *     - runtime
 *     - preloader
 *     - logging
 * ---
 */

import { PRELOADER_ASSET, PRELOADER_LOGGER } from "./constants.js";

const getPositive = (value, fallback) => {
  return Number.isFinite(value) && value > 0 ? value : fallback;
};

const buildConsoleImageStyle = ({ url, width, height, scale }) => {
  const minDimension = PRELOADER_LOGGER.consoleImageStyle.minDimensionPx;
  const scaledWidth = Math.max(minDimension, Math.floor(width * scale));
  const scaledHeight = Math.max(minDimension, Math.floor(height * scale));
  const horizontalPadding = Math.max(
    PRELOADER_LOGGER.consoleImageStyle.minHorizontalPaddingPx,
    Math.floor(scaledWidth / 2),
  );
  const verticalPadding = Math.max(
    PRELOADER_LOGGER.consoleImageStyle.minVerticalPaddingPx,
    Math.floor(scaledHeight / 2),
  );

  return [
    PRELOADER_LOGGER.consoleImageStyle.fontSize,
    `padding: ${verticalPadding}px ${horizontalPadding}px`,
    PRELOADER_LOGGER.consoleImageStyle.lineHeight,
    `background-image: url(${url})`,
    PRELOADER_LOGGER.consoleImageStyle.backgroundRepeat,
    PRELOADER_LOGGER.consoleImageStyle.backgroundPosition,
    `background-size: ${scaledWidth}px ${scaledHeight}px`,
    PRELOADER_LOGGER.consoleImageStyle.colorTransparent,
  ].join(PRELOADER_LOGGER.consoleImageStyle.declarationSeparator);
};

const resolveConsoleImageDimensions = (asset) => {
  const fallbackWidth = getPositive(
    asset?.consoleImageWidth,
    PRELOADER_LOGGER.fallbackWidth,
  );
  const fallbackHeight = getPositive(
    asset?.consoleImageHeight,
    PRELOADER_LOGGER.fallbackHeight,
  );

  if (typeof Image === "undefined" || !asset?.consoleImageUrl) {
    return Promise.resolve({
      loaded: false,
      width: fallbackWidth,
      height: fallbackHeight,
    });
  }

  return new Promise((resolve) => {
    const image = new Image();
    image.decoding = PRELOADER_LOGGER.image.decoding;
    image.referrerPolicy = PRELOADER_LOGGER.image.referrerPolicy;

    image.onload = () => {
      resolve({
        loaded: true,
        width: getPositive(image.naturalWidth, fallbackWidth),
        height: getPositive(image.naturalHeight, fallbackHeight),
      });
    };

    image.onerror = () => {
      resolve({
        loaded: false,
        width: fallbackWidth,
        height: fallbackHeight,
      });
    };

    image.src = asset.consoleImageUrl;
  });
};

const renderConsoleImage = (targetConsole, asset, dimensions) => {
  const scale = getPositive(
    asset.consoleImageScale,
    PRELOADER_LOGGER.fallbackScale,
  );
  const style = buildConsoleImageStyle({
    url: asset.consoleImageUrl,
    width: dimensions.width,
    height: dimensions.height,
    scale,
  });

  targetConsole.log(PRELOADER_LOGGER.styleToken, style);
};

export const showPreloaderConsoleImage = (
  asset = PRELOADER_ASSET,
  targetConsole = console,
) => {
  if (!targetConsole || typeof targetConsole.log !== "function") return false;
  if (!asset || !asset.consoleImageUrl) return false;

  void resolveConsoleImageDimensions(asset).then((dimensions) => {
    renderConsoleImage(targetConsole, asset, dimensions);

    if (!dimensions.loaded && typeof targetConsole.info === "function") {
      targetConsole.info(
        `${PRELOADER_LOGGER.prefix} ${PRELOADER_LOGGER.consoleImageLoadFailedMessage}`,
        asset.consoleImageUrl,
      );
    }
  });

  return true;
};

export const createPreloaderLogger = (targetConsole = console) => {
  const trace = (message) =>
    targetConsole.log(
      `%c${PRELOADER_LOGGER.prefix} ${message}`,
      PRELOADER_LOGGER.color,
    );
  const warn = (...args) =>
    targetConsole.warn(PRELOADER_LOGGER.prefix, ...args);
  const info = (...args) =>
    targetConsole.info(PRELOADER_LOGGER.prefix, ...args);

  trace(PRELOADER_LOGGER.description);

  return {
    trace,
    warn,
    info,
  };
};
