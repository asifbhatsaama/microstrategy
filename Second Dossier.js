let url1 = "https://demo.microstrategy.com/MicroStrategyLibrary/app/B7CA92F04B9FAE8D941C3E9B7E0CD754/14CC30F611EAEC3D273F0080EFD5628A/K53--K46";
  let dossier1; // Variable to store the dossier created. Used by Event Handler do not remove!
let config1; // Variable to store the configuration settings for dossier.
async function runCode1() {
  // For more details on configuration properties, see https://www2.microstrategy.com/producthelp/Current/EmbeddingSDK/Content/topics/dossier_properties.htm
  config1 = {
    url: url1,
    placeholder: document.getElementById("embedding-dossier-container2"),
    containerHeight: "400px",
    containerWidth: "150px",
    customAuthenticationType:
      microstrategy.dossier.CustomAuthenticationType.AUTH_TOKEN,
    disableNotification: false,
    dockedComment: {
      dockedPosition: "right",
      canClose: true,
      dockChangeable: true,
      isDocked: false,
    },
    dockedFilter: {
      dockedPosition: "left",
      canClose: true,
      dockChangeable: false,
      isDocked: false,
    },
    dockedTOC: {
      dockedPosition: "left",
      theme: "dark",
      canClose: true,
      dockChangeable: false,
      isDocked: true,
    },
    dossierFeature: {
      readonly: false,
    },
    enableCollaboration: true,
    enableCustomAuthentication: false,
    enableResponsive: true,
    filterFeature: {
      enabled: true,
      edit: true,
      summary: true,
    },
    filters: [],
    getLoginToken: function login() {
      console.log("Implement log in to return promise of auth token");
    },
    navigationBar: {
      enabled: true,
      gotoLibrary: false,
      title: true,
      toc: true,
      reset: true,
      reprompt: true,
      share: true,
      comment: true,
      notification: true,
      filter: true,
      options: true,
      search: true,
      bookmark: true,
      edit: true,
    },
    optionsFeature: {
      enabled: true,
      help: true,
      logout: true,
      manage: true,
      showTutorials: true,
    },
    shareFeature: {
      enabled: true,
      invite: true,
      link: true,
      email: true,
      export: true,
      download: true,
      shareDossier: true,
      subscribe: true,
    },
    smartBanner: false,
    tocFeature: {
      enabled: true,
    },
    uiMessage: {
      enabled: false,
      addToLibrary: false,
    },
    visibleTutorials: {
      library: true,
      welcome: true,
      dossier: true,
      notification: false,
    },
    visualizationAppearances: [],
  };
  // INSERT PROPERTIES BELOW HERE

  /* Embed Single Visualization Start */
  config1.visualizationAppearances = [
    {
      visualizationKey: "W69", // Replace with visualization key in your dossier
      size: "maximized",
      resizeButtonVisible: false,
    },
  ];
    /* Embed Single Visualization End */
  // INSERT PROPERTIES ABOVE HERE

  // Embed the dossier with the configuration settings
  try {
    dossier1 = await window.microstrategy.dossier.create(config1);
  } catch (error) {
    console.error(error);
  }

}
runCode1();