jQuery.sap.declare("projectX.util.Formatter");

projectX.util.Formatter = {

	/**
	 * 
	 * @param {boolean} bAssertionsResult representing the result of the assertions.
	 * @param {boolean} bAssertionsResultReady true if the assertions were checked.
	 * @return returns checkmark if result of all assertions is true.
	 * returns error symbol if at least one of the assertions failed.
	 * returns empty string if one of the assertions did not run yet.
	 */
	assertionsResultToImage : function(bAssertionsResult, bAssertionsResultReady) {
		if (bAssertionsResultReady !== true){
			return "";
		}
		
		if (bAssertionsResult === true){
			return "sap-icon://message-success";
		}else if (bAssertionsResult === false){
			return "sap-icon://message-error";
		}else {
			return "";
		}
	}

};