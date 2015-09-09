
// Provides control sap.m.App.
sap.ui.define(['jquery.sap.global', 'sap/ui/base/ManagedObject'],
	function(jQuery, ManagedObject) {
	"use strict";

	var MyManagedObject = ManagedObject.extend("projectX.util.MyManagedObject", { 
		
	});
		
	MyManagedObject.prototype.extractBindingInfo = function(oValue, oScope) {
		// property:{path:"path", template:oTemplate}
		if (oValue && typeof oValue === "object") {
			if (oValue.ui5object) {
				// if value contains ui5object property, this is not a binding info,
				// remove it and not check for path or parts property
				delete oValue.ui5object;
			} else if (oValue.path || oValue.parts) {
				// allow JSON syntax for templates
				if (oValue.template) {
					oValue.template = ManagedObject.create(oValue.template);
				}
				return oValue;
			}
		}

		// property:"{path}" or "\{path\}"
		if (typeof oValue === "string") {
			// either returns a binding info or an unescaped string or undefined - depending on binding syntax
			// return ManagedObject.bindingParser(oValue, oScope, true);
			
			// in case of our objects which we want to store we do not need the bindingParser
			// a { without the closing braket would cause an error when restoring the object tree.
			// so here we disable the bindingparser for all classes inherited from MyManagedObject.
			// We use managedObject because of the convenience functions that restore an object tree, 
			// give setter and getter and functions to handle aggregations.
			return oValue;
		}

		// return undefined;
	};

	return MyManagedObject;

}, /* bExport= */ true);
