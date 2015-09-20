/**
 * collection of formatter functions for bindings
 */
sap.ui.define(['jquery.sap.global', 'sap/ui/base/Object', 'projectX/util/Constants'],
	function(jQuery, Object, Constants) {
		"use strict";

		var Formatter = Object.extend("projectX.util.Formatter", {
			metadata: {}
		});


		Formatter.assertionsListResultToImage = function(bAssertionsResult, bAssertionsResultReady, iLength) {
			if(iLength > 0) {
				return Formatter.assertionsResultToImage(bAssertionsResult, bAssertionsResultReady);
			}

			return "";
		};

		/**
		 *
		 * @param {boolean} bAssertionsResult representing the result of the assertions.
		 * @param {boolean} bAssertionsResultReady true if the assertions were checked.
		 * @return returns checkmark if result of all assertions is true.
		 * returns error symbol if at least one of the assertions failed.
		 * returns empty string if one of the assertions did not run yet.
		 */
		Formatter.assertionsResultToImage = function(bAssertionsResult, bAssertionsResultReady) {
			if (bAssertionsResultReady !== true) {
				return "";
			}

			if (bAssertionsResult === true) {
				return "sap-icon://accept";
			} else if (bAssertionsResult === false) {
				return "sap-icon://message-error";
			} else {
				return "";
			}
		};

		Formatter.entitytypeString = function(sType) {
			if (sType === Constants.ODATATYPE_STRING ||
				sType === Constants.ODATATYPE_BYTE ||
				sType === Constants.ODATATYPE_DECIMAL ||
				sType === Constants.ODATATYPE_DOUBLE ||
				sType === Constants.ODATATYPE_SINGLE ||
				sType === Constants.ODATATYPE_INT16 ||
				sType === Constants.ODATATYPE_INT32 ||
				sType === Constants.ODATATYPE_INT64 ||
				sType === Constants.ODATATYPE_SBYTE
			) {
				return true;
			}
			return false;
		};

		Formatter.entitytypeSwitch = function(sType) {
			if (sType === Constants.ODATATYPE_BOOLEAN) {
				return true;
			}
			return false;
		};

		Formatter.entitytypeDateTime = function(sType) {
			if (sType === Constants.ODATATYPE_DATETIME ||
				sType === Constants.ODATATYPE_DATETIMEOFFSET
			) {
				return true;
			}
			return false;
		};

		Formatter.entitytypeTime = function(sType) {
			return false;
		};

		Formatter.entityPropertyKeyToImage = function(bIsKey) {
			if (bIsKey === true) {
				return "sap-icon://accept";
			} else {
				return "";
			}
		};

		return Formatter;

	}, /* bExport= */ true);
