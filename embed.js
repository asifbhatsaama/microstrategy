let url =
        "https://demo.microstrategy.com/MicroStrategyLibrary/app/EC70648611E7A2F962E90080EFD58751/EAF770F9CD46F277F7B36588C3425B94/K100--K92"; // https://{env-url}/{libraryName}/app/{projectId}/{dossierId}
      let dossier; // Variable to store the dossier created. Used by Event Handler do not remove!
      let config; // Variable to store the configuration settings for dossier.
      async function runCode() {
        // For more details on configuration properties, see https://www2.microstrategy.com/producthelp/Current/EmbeddingSDK/Content/topics/dossier_properties.htm
        config = {
          url: url,
          placeholder: document.getElementById("embedding-dossier-container"),
          containerHeight: "600px",
          containerWidth: "800px",
          customAuthenticationType:
            microstrategy.dossier.CustomAuthenticationType.AUTH_TOKEN,
          disableNotification: true,
          dockedComment: {
            dockedPosition: "left",
            canClose: true,
            dockChangeable: false,
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
            theme: "light",
            canClose: true,
            dockChangeable: false,
            isDocked: false,
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
            summary: false,
          },
          filters: [],
          getLoginToken: function login() {
            console.log("Implement log in to return promise of auth token");
          },
          navigationBar: {
            enabled: false,
          },
          optionsFeature: {
            enabled: true,
            help: false,
            logout: true,
            manage: false,
            showTutorials: false,
          },
          shareFeature: {
            enabled: true,
            invite: false,
            link: true,
            email: false,
            export: true,
            download: false,
            shareDossier: false,
            subscribe: false,
          },
          smartBanner: false,
          tocFeature: {
            enabled: true,
          },
          uiMessage: {
            enabled: true,
            addToLibrary: false,
          },
          visibleTutorials: {
            library: true,
            welcome: false,
            dossier: true,
            notification: false,
          },
          visualizationAppearances: [],
        };
        // INSERT PROPERTIES BELOW HERE

        // INSERT PROPERTIES ABOVE HERE

        // Embed the dossier with the configuration settings
        try {
          dossier = await window.microstrategy.dossier.create(config);
        } catch (error) {
          console.error(error);
        }

        // INSERT METHODS BELOW HERE

        // INSERT METHODS ABOVE HERE
      }
      runCode();