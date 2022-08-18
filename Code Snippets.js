
(function () {

    if (typeof mstrmojo !== undefined) {


	    /**
	     * 
		 * Xtab menu configuration.
		 * 
		 * It represents configuration for the grid context menu in the Dossier
		 * 
		 * @param {Object}
		 *            config obj
		 */
	    mstrmojo.vi.ui.rw.xtab.XtabMenuConfig.prototype.buildXtabMenuConfig_OOTB = mstrmojo.vi.ui.rw.xtab.XtabMenuConfig.prototype.buildXtabMenuConfig;
	    mstrmojo.vi.ui.rw.xtab.XtabMenuConfig.prototype.buildXtabMenuConfig = function(cfg) {

	    	this.buildXtabMenuConfig_OOTB(cfg);

			// validate if Dossier is run in presentation mode
			if ( mstrApp.isAppStatePresentation() && !!this.xtab && !!this.xtab.parent) {

				 // get target element
				 let target = cfg.data || getTarget(grid, cfg);

				/* handle functionality */
				if (target) {

				  this.addSeparator();

				  // Custom action which dispatches information about selected cell to parent web page (embedding)
				  this.addMenuItem("Custom Action", "", (evt, contextMenu) => {

				    if (contextMenu) {
				        let grid = cfg.xtab;
				        let data = grid.dataBlocks[0];
					
						let myCustomData = { 
							name: target._e.n,
							id: target._e.id 
						}

						let event = new CustomEvent('customEvent', { detail: myCustomData })

						window.parent.document.dispatchEvent(event);
				      }
				  });


			  	// Shows SQL 
				this.addMenuItem("Get SQL", "", (evt, contextMenu) => {
					console.log(cfg.xtab.model.data.csi);
				});


	        }
	      }
	    };

    }
})();


(function () {

    if (typeof mstrmojo !== undefined) {


 	/**
     * 
	 * GM visualization context menu.
	 * 
	 * 
	 * @param {Object}
	 *            config obj
	 */
    mstrmojo.gm.GMInteractivity.prototype.getMenuConfig_OOTB = mstrmojo.gm.GMInteractivity.prototype.getMenuConfig;
    mstrmojo.gm.GMInteractivity.prototype.getMenuConfig = function(targetElement, attributes, target, inInteractiveMode) {
	

    	let config = this.getMenuConfig_OOTB(targetElement, attributes, target, inInteractiveMode);

    	config.addSeparator();


    	if(target.identity) {

	    	let targetName = target.identity.objectInfo[0].v;
	    	let targetId = target.identity.objectInfo[0].eid;

	    	// Custom action which dispatches information about selected cell to parent web page (embedding)
	    	config.addMenuItem("Add Task", "", (evt, contextMenu) => {
	    		
	    		let myCustomData = { 
					name: targetName,
					id: targetId 
				}

				let event = new CustomEvent('customEvent', { detail: myCustomData })

				window.parent.document.dispatchEvent(event);
	    		
	    	});
		}

    	config.addMenuItem("Get SQL", "", (evt, contextMenu) => {
    		console.log(contextMenu.opener.model.data.csi);
    	});


    	return config

    }


    }
})();






