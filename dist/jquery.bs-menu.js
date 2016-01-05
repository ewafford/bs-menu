/*
 *  bs-menu - v0.1.0
 *  A Mobile Friendly Draw Menu.
 *  http://bigstud.io
 *
 *  Made by Eric Wafford
 *  Under MIT License
 */
;(function ( $, window, document, undefined ) {

	"use strict";

		// undefined is used here as the undefined global variable in ECMAScript 3 is
		// mutable (ie. it can be changed by someone else). undefined isn't really being
		// passed in so we can ensure the value of it is truly undefined. In ES5, undefined
		// can no longer be modified.

		// window and document are passed through as local variable rather than global
		// as this (slightly) quickens the resolution process and can be more efficiently
		// minified (especially when both are regularly referenced in your plugin).

		var pluginName = "bsMenu",
				defaults = {
					triggerSelector: "a.bs-menu__icon",
					wrapperSelector: "nav.bs-menu__wrapper"
				};

		// The actual plugin constructor
		function Plugin ( element, options ) {
			this.el = $( element );
			this.settings = $.extend( {}, defaults, options );
			this._defaults = defaults;
			this._name = pluginName;
			this.init();
		}

		// Avoid Plugin.prototype conflicts
		$.extend(Plugin.prototype, {
			init: function () {
				this.trigger = $( this.settings.triggerSelector );
				this.menu = $( this.settings.wrapperSelector );
				this.isMenuOpen = false;
				this.eventtype = this.isTouch() ? "touchstart.bsmenu" : "click.bsmenu";
				console.log(this.trigger);
				console.log(this.menu);
				this.initEvents();
			},
			isTouch: function() {
				return (
					("ontouchstart" in window) ||
					(navigator.MaxTouchPoints > 0) ||
					(navigator.msMaxTouchPoints > 0)
				);
			},
			initEvents: function() {
				var self = this;
				if( !this.isTouch() ) {
					this.trigger.on( "mouseover", function() {
						 self.openIconMenu();
					});

					this.trigger.on( "mouseout", function() {
						self.closeIconMenu();
					});

					this.menu.on( "mouseover", function() {
						self.openMenu();
						$("body").one( self.eventtype, function() {
							self.closeMenu();
						});
					});
				}

				this.trigger.on( this.eventtype, function(e) {
					e.stopPropagation();
					e.preventDefault();
					if( self.isMenuOpen ) {
						self.closeMenu();
						$("body").off( self.eventtype );
					}
					else {
						self.openMenu();
						$("body").one( self.eventtype, function() {
							self.closeMenu();
						});
					}
				});

				this.menu.on( this.eventtype, function(e) {
					e.stopPropagation();
				});
			},
			openIconMenu: function() {
				this.menu.addClass("bs-open-part");
			},
			closeIconMenu: function() {
				this.menu.removeClass("bs-open-part");
			},
			openMenu: function() {
				if( this.isMenuOpen ) { return; }
				this.trigger.addClass("bs-selected");
				this.isMenuOpen = true;
				this.menu.addClass("bs-open-all");
				this.closeIconMenu();
			},
			closeMenu : function() {
				if( !this.isMenuOpen ) { return; }
				this.trigger.removeClass("bs-selected");
				this.isMenuOpen = false;
				this.menu.removeClass("bs-open-all");
				this.closeIconMenu();
			}
		});

		// A really lightweight plugin wrapper around the constructor,
		// preventing against multiple instantiations
		$.fn[ pluginName ] = function ( options ) {
				return this.each(function() {
						if ( !$.data( this, "plugin_" + pluginName ) ) {
								$.data( this, "plugin_" + pluginName, new Plugin( this, options ) );
						}
				});
		};

})( jQuery, window, document );