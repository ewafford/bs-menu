/*
 *  bs-menu - v0.1.3
 *  A Mobile Friendly Draw Menu.
 *  http://bigstud.io
 *
 *  Made by Eric Wafford
 *  Under MIT License
 */
;(function ( $, window, document, undefined ) {

	"use strict";

		var pluginName = "bsMenu",
				defaults = {
					triggerSelector: "a.bs-menu__icon",
					navSelector: "nav.bs-menu__nav",
					contentSelector: "div.bs-menu__content",
					onOpen: function(){ return false; },
					onClose: function(){ return false; },
					onTriggerClose: function(){ return false; },
					onBodyClose: function(){ return false; }
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
				this.menu = $( this.settings.navSelector );
				this.content = $( this.settings.contentSelector );
				this.isMenuOpen = false;
				this.eventType = this.isTouch() ? "touchstart.bsmenu" : "click.bsmenu";
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
						$("body").one( self.eventType, function() {
							self.closeMenu();
							self.settings.onBodyClose();
						});
					});
				}

				this.trigger.on( this.eventType, function(e) {
					e.stopPropagation();
					e.preventDefault();
					if( self.isMenuOpen ) {
						self.closeMenu();
						self.settings.onTriggerClose();
						$("body").off( self.eventType );
					}
					else {
						self.openMenu();
						$("body").one( self.eventType, function() {
							self.closeMenu();
							self.settings.onBodyClose();
						});
					}
				});

				this.menu.on( this.eventType, function(e) {
					e.stopPropagation();
				});
			},
			openIconMenu: function() {
				this.menu.addClass("bs-menu--open-part");
				this.content.addClass("bs-menu--opened-part");
			},
			closeIconMenu: function() {
				this.menu.removeClass("bs-menu--open-part");
				this.content.removeClass("bs-menu--opened-part");
			},
			openMenu: function() {
				if( this.isMenuOpen ) { return; }
				this.trigger.addClass("bs-menu--selected");
				this.isMenuOpen = true;
				this.menu.addClass("bs-menu--open-all");
				this.content.addClass("bs-menu--opened-all");
				this.closeIconMenu();
				this.settings.onOpen();
			},
			closeMenu : function() {
				if( !this.isMenuOpen ) { return; }
				this.trigger.removeClass("bs-menu--selected");
				this.isMenuOpen = false;
				this.menu.removeClass("bs-menu--open-all");
				this.content.removeClass("bs-menu--opened-all");
				this.closeIconMenu();
				this.settings.onClose();
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
