/** @type {import('@bacons/apple-targets/app.plugin').ConfigFunction} */
module.exports = (config) => ({
  type: "widget",
  icon: "https://github.com/expo.png",
  bundleId: "com.pathwaywealth.dev.widget",
  deploymentTarget: "18.0",
  entitlements: {
    "com.apple.security.application-groups": ["group.com.pathwaywealth.dev"],
  },
});
