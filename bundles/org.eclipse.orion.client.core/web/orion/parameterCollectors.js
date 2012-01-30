/*******************************************************************************
 * @license
 * Copyright (c) 2011 IBM Corporation and others.
 * All rights reserved. This program and the accompanying materials are made 
 * available under the terms of the Eclipse Public License v1.0 
 * (http://www.eclipse.org/legal/epl-v10.html), and the Eclipse Distribution 
 * License v1.0 (http://www.eclipse.org/org/documents/edl-v10.html). 
 *
 * Contributors:
 *     IBM Corporation - initial API and implementation
 *******************************************************************************/
/*global window document define login logout localStorage orion */
/*browser:true*/

define(['require', 'dojo', 'dijit', 'orion/commands', 'orion/util', 'dijit/Menu', 'dijit/MenuItem', 'dijit/form/DropDownButton'], 
        function(require, dojo, dijit, mCommands, mUtil){

	
	/**
	 * Constructs a new command parameter collector
	 * @param {DOMElement} the toolbar containing the parameter collector
	 * @class CommandParameterCollector can collect parameters in a way that is integrated with the 
	 * common header elements.  It is used for "tool" commands to define a custom parameter gathering
	 * technique that is appropriate for the page.  Note that "menu" commands render their own parameter
	 * collector since it is integrated with the menu itself generated by the command framework.
	 * @name orion.parameterCollectors.CommandParameterCollector
	 */	
	function CommandParameterCollector (toolbar) {
		// get node's parent.  If it is managed by dijit, we will need to layout
		if (toolbar) {
			this.layoutWidgetId = toolbar.parentNode.id;
		}
	}
	CommandParameterCollector.prototype =  {
	
		/**
		 * Closes any active parameter collectors
		 *
		 * @param {DOMElement} commandNode the node representing the command
		 */
		close: function (commandNode) {
			if (this.parameterArea) {
				dojo.empty(this.parameterArea);
			}
			if (this.parameterContainer) {
				dojo.removeClass(this.parameterContainer, this.activeClass);
				dojo.removeClass(this.parameterContainer.parentNode, "slideContainerActive");
			}
			if (this.dismissArea) {
				 dojo.empty(this.dismissArea);
			}
			if (commandNode) {
				dojo.removeClass(commandNode, "activeCommand");
			}
			mUtil.forceLayout(this.parameterContainer);
			if (this._oldFocusNode) {
				this._oldFocusNode.focus();
				this._oldFocusNode = null;
			}
			this.parameterContainer = null;
			this.activeClass = null;
			this.parameterArea = null;
			this.dismissArea = null;
		},
		
		/**
		 * Open a parameter collector and return the dom node where parameter 
		 * information should be inserted
		 *
		 * @param {DOMElement} commandNode the node containing the triggering command
		 * @param {String} id the id of parent node containing the triggering command
		 * @param {Function} fillFunction a function that will fill the parameter area
		 */
		open: function(commandNode, id, fillFunction) {
			this.close(commandNode);
			this.parameterContainer = null;
			this.activeClass = null;
			this.parameterArea = null;
			this.dismissArea = null;
			if (id === "pageActions") {
				this.parameterArea = dojo.byId("pageCommandParameters");
				this.parameterContainer = dojo.byId("pageParameterArea");
				this.activeClass = "leftSlideActive";
				this.dismissArea = dojo.byId("pageCommandDismiss");
			} else if (id === "pageNavigationActions") {
				this.parameterArea = dojo.byId("pageNavigationCommandParameters");
				this.parameterContainer = dojo.byId("pageNavigationParameterArea");
				this.activeClass = "rightSlideActive";
				this.dismissArea = dojo.byId("pageNavigationDismiss");
			}
			if (commandNode) {
				dojo.addClass(commandNode, "activeCommand");
			}
			if (this.parameterArea) {
				var focusNode = fillFunction(this.parameterArea);
				if (!dojo.byId("parameterClose") && this.dismissArea) {
				// add the close button if the fill function did not.
					var spacer = dojo.create("span", null, this.dismissArea, "last");
					dojo.addClass(spacer, "dismiss");
					var close = dojo.create("span", {id: "parameterClose", role: "button", tabindex: "0"}, this.dismissArea, "last");
					dojo.addClass(close, "imageSprite");
					dojo.addClass(close, "core-sprite-delete");
					dojo.addClass(close, "dismiss");
					close.title = "Close";
					dojo.connect(close, "onclick", dojo.hitch(this, function(event) {
						this.close(commandNode);
					}));
					// onClick events do not register for spans when using the keyboard without a screen reader
					dojo.connect(close, "onkeypress", dojo.hitch(this, function (e) {
						if(e.keyCode === dojo.keys.ENTER) {
							this.close(commandNode);
						}
					}));
				}


				// all parameters have been generated.  Activate the area.
				dojo.addClass(this.parameterContainer.parentNode, "slideContainerActive");
				dojo.addClass(this.parameterContainer, this.activeClass);
				mUtil.forceLayout(this.parameterContainer);
				if (focusNode) {
					this._oldFocusNode = window.document.activeElement;
					window.setTimeout(function() {
						focusNode.focus();
						focusNode.select();
					}, 0);
				}
				return true;
			}
			return false;
		},
		
		_collectAndCall: function(commandInvocation, parent) {
			dojo.query("input", parent).forEach(function(field) {
				if (field.type !== "button") {
					commandInvocation.parameters.setValue(field.parameterName, field.value);
				}
			});
			if (commandInvocation.command.callback) {
				commandInvocation.command.callback.call(commandInvocation.handler, commandInvocation);
			}

		},
		
		/**
		 * Collect parameters for the given command.
		 * 
		 * @param {orion.commands.CommandInvocation} the command invocation
		 * @returns {Boolean} whether or not required parameters were collected.
		 */
		collectParameters: function(commandInvocation) {
			if (commandInvocation.parameters) {
				return this.open(commandInvocation.domNode, commandInvocation.domParent.id, this.getFillFunction(commandInvocation));
			}
			return false;
		},
		
		/**
		 * Returns a function that can be used to fill a specified parent node with parameter information.
		 *
		 * @param {orion.commands.CommandInvocation} the command invocation used when gathering parameters
		 * @param {Function} an optional function called when the area must be closed. 
		 * @returns {Function} a function that can fill the specified dom node with parameter collection behavior
		 */
		 getFillFunction: function(commandInvocation, closeFunction) {
			return dojo.hitch(this, function(parameterArea) {
				var first = null;
				var localClose = dojo.hitch(this, function() {
					if (closeFunction) {
						closeFunction();
					} else {
						this.close(commandInvocation.domNode);
					}
				});
				var keyHandler = dojo.hitch(this, function(event) {
					if (event.keyCode === dojo.keys.ENTER) {
						this._collectAndCall(commandInvocation, parameterArea);
					}
					if (event.keyCode === dojo.keys.ESCAPE || event.keyCode === dojo.keys.ENTER) {
						localClose();
						dojo.stopEvent(event);
					}
				});
				commandInvocation.parameters.forEach(function(parm) {
					if (parm.label) {
						dojo.place(document.createTextNode(parm.label), parameterArea, "last");
					} 
					var field = dojo.create("input", {type: parm.type}, parameterArea, "last");
					dojo.addClass(field, "parameterInput");
					// we define special classes for some parameter types
					dojo.addClass(field, "parameterInput"+parm.type);
					field.setAttribute("speech", "speech");
					field.setAttribute("x-webkit-speech", "x-webkit-speech");
					field.parameterName = parm.name;
					if (!first) {
						first = field;
					}
					if (parm.value) {
						field.value = parm.value;
					}
					dojo.connect(field, "onkeypress", keyHandler);
				});
				var spacer;
				var parentDismiss = parameterArea;
				var finish = function (collector) {
					collector._collectAndCall(commandInvocation, parameterArea);
					localClose();
				};

				if (commandInvocation.parameters.options) {
					commandInvocation.parameters.optionsRequested = false;
					spacer = dojo.create("span", null, parentDismiss, "last");
					dojo.addClass(spacer, "dismiss");
					
					var options = dojo.create("span", {role: "button", tabindex: "0"}, parentDismiss, "last");
					dojo.addClass(options, "core-sprite-options");
					dojo.addClass(options, "dismiss");
					options.title = "More options...";
					dojo.connect(options, "onclick", dojo.hitch(this, function() {
						commandInvocation.parameters.optionsRequested = true;
						finish(this);
					}));
					// onClick events do not register for spans when using the keyboard without a screen reader
					dojo.connect(options, "onkeypress", dojo.hitch(this, function (e) {
						if(e.keyCode === dojo.keys.ENTER) {			
							commandInvocation.parameters.optionsRequested = true;
							finish(this);
						}
					}));
				}
				// OK and cancel buttons
				spacer = dojo.create("span", null, parentDismiss, "last");
				dojo.addClass(spacer, "dismiss");

				var ok = dojo.create("span", {role: "button", tabindex: "0"}, parentDismiss, "last");
				ok.title = "Submit";
				dojo.addClass(ok, "core-sprite-ok");
				dojo.addClass(ok, "dismiss");
				dojo.connect(ok, "onclick", dojo.hitch(this, function() {
					finish(this);
				}));
				// onClick events do not register for spans when using the keyboard without a screen reader
				dojo.connect(ok, "onkeypress", dojo.hitch(this, function (e) {
					if(e.keyCode === dojo.keys.ENTER) {
						finish(this);
					}
				}));
				
				spacer = dojo.create("span", null, parentDismiss, "last");
				dojo.addClass(spacer, "dismiss");
				var close = dojo.create("span", {id: "parameterClose", role: "button", tabindex: "0"}, parentDismiss, "last");
				dojo.addClass(close, "imageSprite");
				dojo.addClass(close, "core-sprite-delete");
				dojo.addClass(close, "dismiss");
				close.title = "Close";
				dojo.connect(close, "onclick", dojo.hitch(this, function(event) {
					localClose();
				}));
				// onClick events do not register for spans when using the keyboard without a screen reader
				dojo.connect(close, "onkeypress", dojo.hitch(this, function (e) {
					if(e.keyCode === dojo.keys.ENTER) {
						localClose();
					}
				}));
				return first;
			});
		 }
	};
	CommandParameterCollector.prototype.constructor = CommandParameterCollector;
	
	//return the module exports
	return {
		CommandParameterCollector: CommandParameterCollector
	};
});
