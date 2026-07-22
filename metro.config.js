const { getDefaultConfig } = require("expo/metro-config");

module.exports = (() => {
    const config = getDefaultConfig(__dirname);

    // Add specific support for CJS and MJS to resolve @iabtcf libraries correctly
    config.resolver.sourceExts.push("mjs", "cjs");

    // Disable strict package exports to prevent @iabtcf/core internal resolution failures in newer SDKs
    config.resolver.unstable_enablePackageExports = false;

    return config;
})();
