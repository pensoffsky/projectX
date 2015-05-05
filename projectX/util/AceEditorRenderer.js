// Provides default renderer for control view.AnimatedSpriteRenderer
sap.ui.define(['jquery.sap.global'],
	function(jQuery) {
		"use strict";

		var AceEditorRenderer = {};

		AceEditorRenderer.render = function(oRm, oEditor) {
			oRm.write("<div");
			
			oRm.writeAttributeEscaped("id", oEditor.getId());
			oRm.writeControlData(oEditor);

			oRm.addClass("AceEditor");
			oRm.writeClasses();

			// Dimensions
			if (oEditor.getWidth() && oEditor.getWidth() != '') {
				oRm.addStyle("width", oEditor.getWidth());
			}
			if (oEditor.getHeight() && oEditor.getHeight() != '') {
				oRm.addStyle("height", oEditor.getHeight());
			}

			// //TODO escape
			// oRm.addStyle("background-image", "url('" + oEditor.getSrc() + "')");
			// //oRm.addStyle("");
			oRm.writeStyles();

			oRm.write(" />"); // close the <div> element
		};


		return AceEditorRenderer;

	}, /* bExport= */ true);