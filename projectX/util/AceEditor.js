sap.ui.define(['jquery.sap.global', 'sap/ui/core/Control'],
    function(jQuery, Control) {
        "use strict";

        var AceEditor = Control.extend("projectX.util.AceEditor", {
            metadata: {

                properties: {
               
			        width : {type : "sap.ui.core.CSSSize", group : "Appearance", defaultValue : null},
	
			        height : {type : "sap.ui.core.CSSSize", group : "Appearance", defaultValue : null},
                    
                    value: {
                        type: "string",
                        defaultValue: null
                    },
                    
                    readOnly: {
                        type: "boolean",
                        defaultValue: false
                    },
                    
                    mode: {
                        type: "string",
                        defaultValue: "javascript"
                    }
                },
                events: {
			        someEvent : {}
                }
            }
        });

// /////////////////////////////////////////////////////////////////////////////
// /// Control Overrides
// /////////////////////////////////////////////////////////////////////////////

        AceEditor.prototype.init = function() {
            console.log("aceeditor init");
        };

        
        AceEditor.prototype.onAfterRendering = function() {
            console.log("aceeditor onAfterRendering");
			var sEditID = this.getId();
            if(this._editor){
                this._editor.destroy();
            }
                
            
			this._editor = ace.edit(sEditID);
			this._editor.setTheme("ace/theme/tomorrow");
			this._editor.getSession().setMode("ace/mode/" + this.getMode());
    
            this._editor.setReadOnly(this.getReadOnly());
        
            this._editor.setValue(this.getValue(), 1);
            
            var that = this;
            this._editor.getSession().on('change', function(e) {
                var sEditorValue = that._editor.getValue();
                var sControlValue = that.getValue();
                if (sEditorValue !== sControlValue) {
                    that.setProperty("value", sEditorValue, true);
                }
                
			});
        };

        AceEditor.prototype.setValue = function(sValue) {  
            this.setProperty("value", sValue);
        };
        
        
// /////////////////////////////////////////////////////////////////////////////
// /// Public functions
// /////////////////////////////////////////////////////////////////////////////
        
    
        
// /////////////////////////////////////////////////////////////////////////////
// /// Private functions
// /////////////////////////////////////////////////////////////////////////////

    

        return AceEditor;

    }, /* bExport= */ true);