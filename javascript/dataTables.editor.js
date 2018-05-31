/**
 * @summary     DataTables Editor
 * @description Table editing library for DataTables
 * @version     1.2.3
 * @file        dataTables.editor.js
 * @author      SpryMedia
 * @contact     www.sprymedia.co.uk/contact
 * @license     DataTables Editor: http://editor.datatables.net/license
 */

/*jslint evil: true, undef: true, browser: true */
/*globals jQuery,alert,console */

(/** @lends <global> */function(window, document, undefined, $, DataTable) {

/**
 * Editor is a plug-in for <a href="http://datatables.net">DataTables</a> which provides
 * an interface for creating, reading, editing and deleting and entries (a CRUD interface)
 * in a DataTable. The documentation presented here is primarily focused on presenting the
 * API for Editor. For a full list of features, examples and the server interface protocol,
 * please refer to the <a href="http://editor.datatables.net">Editor web-site</a>.
 *
 * Note that in this documentation, for brevity, the `DataTable` refers to the jQuery
 * parameter `jQuery.fn.dataTable` through which it may be  accessed. Therefore, when
 * creating a new Editor instance, use `jQuery.fn.Editor` as shown in the examples below.
 *
 *  @class
 *  @param {object} [oInit={}] Configuration object for Editor. Options
 *    are defined by {@link Editor.defaults}. The options which must be set
 *    are `ajaxUrl` and `domTable`.
 *  @requires jQuery 1.7+
 *  @requires DataTables 1.9+
 *  @requires TableTools 2.1+ - note that TableTools is only required if you want to use
 *    the row selection and button controls TableTools provides, but is not mandatory
 *    for Editor. If used, the TableTools should be loaded before Editor.
 *
 *  @example
 *    // Basic initialisation - this example shows a table with 2 columns, each of which is editable
 *    // as a text input and provides add, edit and delete buttons by making use of TableTools
 *    // (Editor provides three buttons that extend the abilities of TableTools).
 *    $(document).ready(function() {
 *      var editor = new $.fn.Editor( {
 *        "ajaxUrl": "php/index.php",
 *        "domTable": "#example",
 *        "fields": [ {
 *            "label": "Browser:",
 *            "name": "browser"
 *          }, {
 *            "label": "Rendering engine:",
 *            "name": "engine"
 *          }, {
 *            "label": "Platform:",
 *            "name": "platform"
 *          }, {
 *            "label": "Version:",
 *            "name": "version"
 *          }, {
 *            "label": "CSS grade:",
 *            "name": "grade"
 *          }
 *        ]
 *      } );
 *
 *      $('#example').dataTable( {
 *        "sDom": "Tfrtip",
 *        "sAjaxSource": "php/index.php",
 *        "aoColumns": [
 *          { "mData": "browser" },
 *          { "mData": "engine" },
 *          { "mData": "platform" },
 *          { "mData": "version", "sClass": "center" },
 *          { "mData": "grade", "sClass": "center" }
 *        ],
 *        "oTableTools": {
 *          "sRowSelect": "multi",
 *          "aButtons": [
 *            { "sExtends": "dte_create", "dte": editor },
 *            { "sExtends": "dte_edit",   "dte": editor },
 *            { "sExtends": "dte_remove", "dte": editor }
 *          ]
 *        }
 *      } );
 *    } );
 */
var Editor = function ( opts )
{
	if ( ! this instanceof Editor ) {
		alert( "DataTables Editor must be initilaised as a 'new' instance'" );
	}

	this._constructor( opts );
};

// Export Editor as a DataTables property
DataTable.Editor = Editor;


/*
 * Models
 */

/**
 * Object models container, for the various models that DataTables has available
 * to it. These models define the objects that are used to hold the active state
 * and configuration of the table.
 *  @namespace
 */
Editor.models = {};


/**
 * Editor makes very few assumptions about how its form will actually be
 * displayed to the end user (where in the DOM, interaction etc), instead
 * focusing on providing form interaction controls only. To actually display
 * a form in the browser we need to use a display controller, and then select
 * which one we want to use at initialisation time using the `display`
 * option. For example a display controller could display the form in a
 * lightbox (as the default display controller does), it could completely
 * empty the document and put only the form in place, ir could work with
 * DataTables to use `fnOpen` / `fnClose` to show the form in a "details" row
 * and so on.
 *
 * Editor has two built-in display controllers ('lightbox' and 'envelope'),
 * but others can readily be created and installed for use as plug-ins. When
 * creating a display controller plug-in you **must** implement the methods
 * in this control. Additionally when closing the display internally you
 * **must** trigger a `requestClose` event which Editor will listen
 * for and act upon (this allows Editor to ask the user if they are sure
 * they want to close the form, for example).
 *  @namespace
 */
Editor.models.displayController = {
	/**
	 * Initialisation method, called by Editor when itself, initialises.
	 *  @param {object} dte The DataTables Editor instance that has requested
	 *    the action - this allows access to the Editor API if required.
	 *  @returns {object} The object that Editor will use to run the 'open'
	 *    and 'close' methods against. If static methods are used then
	 *    just return the object that holds the init, open and close methods,
	 *    however, this allows the display to be created with a 'new'
	 *    instance of an object is the display controller calls for that.
	 *  @type function
	 */
	"init": function ( dte ) {},

	/**
	 * Display the form (add it to the visual display in the document)
	 *  @param {object} dte The DataTables Editor instance that has requested
	 *    the action - this allows access to the Editor API if required.
	 *  @param {element} append The DOM node that contains the form to be
	 *    displayed
	 *  @param {function} [fn] Callback function that is to be executed when
	 *    the form has been displayed. Note that this parameter is optional.
	 */
	"open": function ( dte, append, fn ) {},

	/**
	 * Hide the form (remove it form the visual display in the document)
	 *  @param {object} dte The DataTables Editor instance that has requested
	 *    the action - this allows access to the Editor API if required.
	 *  @param {function} [fn] Callback function that is to be executed when
	 *    the form has been hidden. Note that this parameter is optional.
	 */
	"close": function ( dte, fn ) {}
};




/**
 * Object structure used to define a field (a user input control) in a form. The options
 * shown here can provided to customise the field as required. All properties are
 * optional with the exception of the `name` property which much be defined.
 *  @namespace
 */
Editor.models.field = {
	/**
	 * Class name to assign to the field's container element (in addition to the other
	 * classes that Editor assigns by default).
	 *  @type string
	 *  @default <i>Empty string</i>
	 */
	"className": "",

	/**
	 * The name for the field that is submitted to the server. This is the only
	 * mandatory parameter in the field description object.
	 *  @type string
	 *  @default <i>null</i>
	 */
	"name": null,
	
	/**
	 * The data property (`mData` in DataTables terminology) that is used 
	 * to read from and write to the table. If not given then it will take the same 
	 * value as the `name` that is given in the field object. Note that `dataProp`
	 * can be given as null, which will result in Editor not using a DataTables row
	 * property for the value of the field for either getting or setting data.
	 *  @type string
	 *  @default <i>Empty string</i>
	 */
	"dataProp": "",

	/**
	 * The label to display for the field input (i.e. the name that is visually 
	 * assigned to the field).
	 *  @type string
	 *  @default <i>Empty string</i>
	 */
	"label": "",

	/**
	 * The ID of the field. This is used by the `label` HTML tag as the "for" attribute 
	 * improved accessibility. Although this using this parameter is not mandatory,
	 * it is a good idea to assign the ID to the DOM element that is the input for the
	 * field (if this is applicable).
	 *  @type string
	 *  @default <i>Calculated</i>
	 */
	"id": "",

	/**
	 * The input control that is presented to the end user. The options available 
	 * are defined by {@link Editor.fieldTypes} and any extensions made 
	 * to that object.
	 *  @type string
	 *  @default text
	 */
	"type": "text",

	/**
	 * Helpful information text about the field that is shown below the input control.
	 *  @type string
	 *  @default <i>Empty string</i>
	 */
	"fieldInfo": "",

	/**
	 * Helpful information text about the field that is shown below the field label.
	 *  @type string
	 *  @default <i>Empty string</i>
	 */
	"labelInfo": "",

	/**
	 * The default value for the field. Used when creating new rows (editing will
	 * use the currently set value).
	 *  @type string
	 *  @default <i>Empty string</i>
	 */
	"default": "",

	/**
	 * Get the value of the field from the data source object. This allows deeply nested
	 * properties, or a function to be used, as well as regular immediate properties, in
	 * exactly the same way that DataTables using `mData` for columns. This should be 
	 * used to get the value from a data source (i.e. a row object).
	 *  @type function
	 *  @param {object} data The data source object to get the data from
	 *  @param {string} type The specific data type to be obtained (useful only if dataProp
	 *    is given as a function) - should be "editor" for Editor specific actions.
	 *  @returns {*} Value from the data source.
	 */
	"dataSourceGet": null,

	/**
	 * Set the value of the field to the data source object (i.e. a row object). This allows
	 * deeply nested properties, or a function to be used, as well as regular immediate 
	 * properties, in exactly the same way that DataTables using `mData` for columns.
	 * This should be used for setting the value of a property, when the data source will
	 * be passed on to DataTables.
	 *  @type function
	 *  @param {object} data The data source object to set the data on
	 *  @param {*} val The value to set (`dataProp` will tell the function which property is to
	 *    be set).
	 */
	"dataSourceSet": null,

	/**
	 * The field wrapper element - this element contains the DOM elements that are used for
	 * editing a given field
	 *  @type node
	 *  @default null
	 */
	"el": null,

	/**
	 * Cached field message element
	 *  @type node
	 *  @default null
	 *  @private
	 */
	"_fieldMessage": null,

	/**
	 * Cached field information element
	 *  @type node
	 *  @default null
	 *  @private
	 */
	"_fieldInfo": null,

	/**
	 * Cached field error element
	 *  @type node
	 *  @default null
	 *  @private
	 */
	"_fieldError": null,

	/**
	 * Cached label info element
	 *  @type node
	 *  @default null
	 *  @private
	 */
	"_labelInfo": null
};



/**
 * Model object for input types which are available to fields (assigned to
 * {@link Editor.fieldTypes}). Any plug-ins which add additional
 * input types to Editor **must** implement the methods in this object 
 * (dummy functions are given in the model so they can be used as defaults
 * if extending this object).
 *
 * All functions in the model are executed in the Editor's instance scope,
 * so you have full access to the settings object and the API methods if
 * required.
 *  @namespace
 *  @example
 *    // Add a simple text input (the 'text' type that is built into Editor
 *    // does this, so you wouldn't implement this exactly as show, but it
 *    // it is a good example.
 *
 *    var Editor = $.fn.Editor;
 *
 *    Editor.fieldTypes.myInput = $.extend( true, {}, Editor.models.type, {
 *      "create": function ( conf ) {
 *        // We store the 'input' element in the configuration object so
 *        // we can easily access it again in future.
 *        conf._input = document.createElement('input');
 *        conf._input.id = conf.id;
 *        return conf._input;
 *      },
 *    
 *      "get": function ( conf ) {
 *        return conf._input.value;
 *      },
 *    
 *      "set": function ( conf, val ) {
 *        conf._input.value = val;
 *      },
 *    
 *      "enable": function ( conf ) {
 *        conf._input.disabled = false;
 *      },
 *    
 *      "disable": function ( conf ) {
 *        conf._input.disabled = true;
 *      }
 *    } );
 */
Editor.models.fieldType = {
	/**
	 * Create the field - this is called when the field is added to the form.
	 * Note that this is called at initialisation time, or when the 
	 * {@link Editor#add} API method is called, not when the form is displayed. 
	 * If you need to know when the form is shown, you can use the API to listen 
	 * for the `onOpen` event.
	 *  @param {object} conf The configuration object for the field in question:
	 *    {@link Editor.models.field}.
	 *  @returns {element|null} The input element (or a wrapping element if a more
	 *    complex input is required) or null if nothing is to be added to the
	 *    DOM for this input type.
	 *  @type function
	 */
	"create": function ( conf ) {},

	/**
	 * Get the value from the field
	 *  @param {object} conf The configuration object for the field in question:
	 *    {@link Editor.models.field}.
	 *  @returns {*} The value from the field - the exact value will depend on the
	 *    formatting required by the input type control.
	 *  @type function
	 */
	"get": function ( conf ) {},

	/**
	 * Set the value for a field
	 *  @param {object} conf The configuration object for the field in question:
	 *    {@link Editor.models.field}.
	 *  @param {*} val The value to set the field to - the exact value will
	 *    depend on the formatting required by the input type control.
	 *  @type function
	 */
	"set": function ( conf, val ) {},

	/**
	 * Enable the field - i.e. allow user interface
	 *  @param {object} conf The configuration object for the field in question:
	 *    {@link Editor.models.field}.
	 *  @type function
	 */
	"enable": function ( conf ) {},

	/**
	 * Disable the field - i.e. disallow user interface
	 *  @param {object} conf The configuration object for the field in question:
	 *    {@link Editor.models.field}.
	 *  @type function
	 */
	"disable": function ( conf ) {}
};



/**
 * Settings object for Editor - this provides the state for each instance of
 * Editor and can be accessed through the instance's `s` property. Note that the
 * settings object is considered to be "private" and thus is liable to change
 * between versions. As such if you do read any of the setting parameters,
 * please keep this in mind when upgrading!
 *  @namespace
 */
Editor.models.settings = {
	/**
	 * URL to submit Ajax data to.
	 * This is directly set by the initialisation parameter / default of the same name.
	 *  @type string
	 *  @default null
	 */
	"ajaxUrl": "",

	/**
	 * Ajax submit function.
	 * This is directly set by the initialisation parameter / default of the same name.
	 *  @type function
	 *  @default null
	 */
	"ajax": null,

	/**
	 * URL to submit Ajax data to.
	 * This is directly set by the initialisation parameter / default of the same name.
	 *  @type string
	 *  @default null
	 */
	"domTable": null,
	
	/**
	 * Name of the database table that is to be operated on - passed to the server in the
	 * Ajax request.
	 * This is directly set by the initialisation parameter / default of the same name.
	 *  @type string
	 *  @default null
	 */
	"dbTable": "",
	
	/**
	 * The initialisation object that was given by the user - stored for future reference.
	 * This is directly set by the initialisation parameter / default of the same name.
	 *  @type string
	 *  @default null
	 */
	"opts": null,
	
	/**
	 * The display controller object for the Form.
	 * This is directly set by the initialisation parameter / default of the same name.
	 *  @type string
	 *  @default null
	 */
	"displayController": null,
	
	/**
	 * The form fields - see {@link Editor.models.field} for details of the 
	 * objects held in this array.
	 *  @type array
	 *  @default null
	 */
	"fields": [],
	
	/**
	 * Field order - order that the fields will appear in on the form. Array of strings,
	 * the names of the fields.
	 *  @type array
	 *  @default null
	 */
	"order": [],

	/**
	 * The ID of the row being edited (set to -1 on create and remove actions)
	 *  @type string
	 *  @default null
	 */
	"id": -1,
	
	/**
	 * Flag to indicate if the form is currently displayed (true) or not (false)
	 *  @type string
	 *  @default null
	 */
	"displayed": false,
	
	/**
	 * Flag to indicate if the form is current in a processing state (true) or not (false)
	 *  @type string
	 *  @default null
	 */
	"processing": false,
	
	/**
	 * The TR element that is being edited (set to null for create and remove actions)
	 *  @type string
	 *  @default null
	 */
	"editRow": null,
	
	/**
	 * An array of TR elements that are scheduled to be removed on delete (set to null
	 * on create and edit actions).
	 *  @type array
	 *  @default null
	 */
	"removeRows": null,
	
	/**
	 * The current form action - 'create', 'edit' or 'remove'. If no current action then
	 * it is set to null.
	 *  @type string
	 *  @default null
	 */
	"action": null,

	/**
	 * JSON property from which to read / write the row's ID property.
	 *  @type string
	 *  @default null
	 */
	"idSrc": null,

	/**
	 * Arrays that contain the callback functions which are registered with
	 * Editor. For full details see: {@link Editor.defaults} (note
	 * that the arrays do not have the 'on' prefix of the callback / events.
	 *  @namespace
	 */
	"events": {
		"onProcessing": [],
		"onPreOpen": [],
		"onOpen": [],
		"onPreClose": [],
		"onClose": [],
		"onPreSubmit": [],
		"onPostSubmit": [],
		"onSubmitComplete": [],
		"onSubmitSuccess": [],
		"onSubmitError": [],
		"onInitCreate": [],
		"onPreCreate": [],
		"onCreate": [],
		"onPostCreate": [],
		"onInitEdit": [],
		"onPreEdit": [],
		"onEdit": [],
		"onPostEdit": [],
		"onInitRemove": [],
		"onPreRemove": [],
		"onRemove": [],
		"onPostRemove": [],
		"onSetData": [],
		"onInitComplete": []
	}
};



/**
 * Model of the buttons that can be used with the {@link Editor#buttons}
 * method for creating and displaying buttons (also the {@link Editor#button}
 * argument option for the {@link Editor#create}, {@link Editor#edit} and 
 * {@link Editor#remove} methods). Although you don't need to extend this object,
 * it is available for reference to show the options available.
 *  @namespace
 */
Editor.models.button = {
	/**
	 * The text to put into the button. This can be any HTML string you wish as 
	 * it will be rendered as HTML (allowing images etc to be shown inside the
	 * button).
	 *  @type string
	 *  @default null
	 */
	"label": null,

	/**
	 * Callback function which the button is activated. For example for a 'submit' 
	 * button you would call the {@link Editor#submit} API method, while for a cancel button
	 * you would call the {@link Editor#close} API method. Note that the function is executed 
	 * in the scope of the Editor instance, so you can call the Editor's API methods 
	 * using the `this` keyword.
	 *  @type function
	 *  @default null
	 */
	"fn": null,
	
	/**
	 * The CSS class(es) to apply to the button which can be useful for styling buttons 
	 * which preform different functions each with a distinctive visual appearance.
	 *  @type string
	 *  @default null
	 */
	"className": null
};


/*
 * Display controllers
 */

/**
 * Display controllers. See {@link Editor.models.displayController} for
 * full information about the display controller options for Editor. The display
 * controllers given in this object can be utilised by specifying the
 * {@link Editor.defaults.display} option.
 *  @namespace
 */
Editor.display = {};


(function(window, document, $, DataTable) {


var self;

Editor.display.lightbox = $.extend( true, {}, Editor.models.displayController, {
	/*
	 * API methods
	 */
	"init": function ( dte ) {
		self._init();
		return self;
	},

	"open": function ( dte, append, callback ) {
		if ( self._shown ) {
			if ( callback ) {
				callback();
			}
			return;
		}

		self._dte = dte;
		$(self._dom.content).children().detach();
		self._dom.content.appendChild( append );
		self._dom.content.appendChild( self._dom.close );

		self._shown = true;
		self._show( callback );
	},

	"close": function ( dte, callback ) {
		if ( !self._shown ) {
			if ( callback ) {
				callback();
			}
			return;
		}

		self._dte = dte;
		self._hide( callback );

		self._shown = false;
	},


	/*
	 * Private methods
	 */
	"_init": function () {
		if ( self._ready ) {
			return;
		}

		self._dom.content = $('div.DTED_Lightbox_Content', self._dom.wrapper)[0];

		document.body.appendChild( self._dom.background );
		document.body.appendChild( self._dom.wrapper );

		// For IE6-8 we need to make it a block element to read the opacity...
		self._dom.background.style.visbility = 'hidden';
		self._dom.background.style.display = 'block';
		self._cssBackgroundOpacity = $(self._dom.background).css('opacity');
		self._dom.background.style.display = 'none';
		self._dom.background.style.visbility = 'visible';
	},
	

	"_show": function ( callback ) {
		var that = this;
		var formHeight;

		if ( !callback ) {
			callback = function () {};
		}

		// Adjust size for the content
		self._dom.content.style.height = 'auto';

		var style = self._dom.wrapper.style;
		style.opacity = 0;
		style.display = 'block';

		self._heightCalc();

		style.display = 'none';
		style.opacity = 1;

		$(self._dom.wrapper).fadeIn();

		self._dom.background.style.opacity = 0;
		self._dom.background.style.display = 'block';
		$(self._dom.background).animate( {
			'opacity': self._cssBackgroundOpacity
		}, 'normal', callback );

		// Event handlers - assign on show (and unbind on hide) rather than init
		// since we might need to refer to different editor instances - 12563
		$(self._dom.close).bind( 'click.DTED_Lightbox', function (e) {
			self._dte.close('icon');
		} );

		$(self._dom.background).bind( 'click.DTED_Lightbox', function (e) {
			self._dte.close('background');
		} );

		$('div.DTED_Lightbox_Content_Wrapper', self._dom.wrapper).bind( 'click.DTED_Lightbox', function (e) {
			if ( $(e.target).hasClass('DTED_Lightbox_Content_Wrapper') ) {
				self._dte.close('background');
			}
		} );

		$(window).bind( 'resize.DTED_Lightbox', function () {
			self._heightCalc();
		} );
	},


	"_heightCalc": function () {
		var formHeight;

		formHeight = self.conf.heightCalc ? 
			self.conf.heightCalc( self._dom.wrapper ) :
			$(self._dom.content).children().height();

		// Set the max-height for the form content
		var maxHeight = $(window).height() - (self.conf.windowPadding*2) - 
			$('div.DTE_Header', self._dom.wrapper).outerHeight() - 
			$('div.DTE_Footer', self._dom.wrapper).outerHeight();

		$('div.DTE_Body_Content', self._dom.wrapper).css('maxHeight', maxHeight);
	},


	"_hide": function ( callback ) {
		if ( !callback ) {
			callback = function () {};
		}

		$([self._dom.wrapper, self._dom.background]).fadeOut( 'normal', callback );

		// Event handlers
		$(self._dom.close).unbind( 'click.DTED_Lightbox' );
		$(self._dom.background).unbind( 'click.DTED_Lightbox' );
		$('div.DTED_Lightbox_Content_Wrapper', self._dom.wrapper).unbind( 'click.DTED_Lightbox' );
		$(window).unbind( 'resize.DTED_Lightbox' );
	},


	/*
	 * Private properties
	 */
	"_dte": null,
	"_ready": false,
	"_shown": false,
	"_cssBackgroundOpacity": 1, // read from the CSS dynamically, but stored for future reference

	"_dom": {
		"wrapper": $(
			'<div class="DTED_Lightbox_Wrapper">'+
				'<div class="DTED_Lightbox_Container">'+
					'<div class="DTED_Lightbox_Content_Wrapper">'+
						'<div class="DTED_Lightbox_Content">'+
						'</div>'+
					'</div>'+
				'</div>'+
			'</div>'
		)[0],

		"background": $(
			'<div class="DTED_Lightbox_Background"></div>'
		)[0],

		"close": $(
			'<div class="DTED_Lightbox_Close" id="close_btn"></div>'
		)[0],

		"content": null
	}
	
	
} );



self = Editor.display.lightbox;

self.conf = {
	"windowPadding": 100,
	"heightCalc": null
};


}(window, document, jQuery, jQuery.fn.dataTable));



(function(window, document, $, DataTable) {


var self;

Editor.display.envelope = $.extend( true, {}, Editor.models.displayController, {
	/*
	 * API methods
	 */
	"init": function ( dte ) {
		self._dte = dte;
		self._init();
		return self;
	},


	"open": function ( dte, append, callback ) {
		self._dte = dte;
		$(self._dom.content).children().detach();
		self._dom.content.appendChild( append );
		self._dom.content.appendChild( self._dom.close );

		self._show( callback );
	},


	"close": function ( dte, callback ) {
		self._dte = dte;
		self._hide( callback );
	},


	/*
	 * Private methods
	 */
	"_init": function () {
		if ( self._ready ) {
			return;
		}

		self._dom.content = $('div.DTED_Envelope_Container', self._dom.wrapper)[0];

		document.body.appendChild( self._dom.background );
		document.body.appendChild( self._dom.wrapper );

		// For IE6-8 we need to make it a block element to read the opacity...
		self._dom.background.style.visbility = 'hidden';
		self._dom.background.style.display = 'block';
		self._cssBackgroundOpacity = $(self._dom.background).css('opacity');
		self._dom.background.style.display = 'none';
		self._dom.background.style.visbility = 'visible';
	},


	"_show": function ( callback ) {
		var that = this;
		var formHeight;

		if ( !callback ) {
			callback = function () {};
		}

		// Adjust size for the content
		self._dom.content.style.height = 'auto';

		var style = self._dom.wrapper.style;
		style.opacity = 0;
		style.display = 'block';

		var targetRow = self._findAttachRow();
		var height = self._heightCalc();
		var width = targetRow.offsetWidth;

		style.display = 'none';
		style.opacity = 1;

		// Prep the display
		self._dom.wrapper.style.width = width+"px";
		self._dom.wrapper.style.marginLeft = -(width/2)+"px";
		self._dom.wrapper.style.top = ($(targetRow).offset().top + targetRow.offsetHeight)+"px";
		self._dom.content.style.top = ((-1 * height) - 20)+"px";

		// Start animating in the background
		self._dom.background.style.opacity = 0;
		self._dom.background.style.display = 'block';
		$(self._dom.background).animate( {
			'opacity': self._cssBackgroundOpacity
		}, 'normal' );

		// Animate in the display
		$(self._dom.wrapper).fadeIn();

		// Slide the slider down to 'open' the view
		if ( self.conf.windowScroll ) {
			// Scroll the window so we can see the editor first
			$('html,body').animate( {
				"scrollTop": $(targetRow).offset().top + targetRow.offsetHeight - self.conf.windowPadding
			}, function () {
				// Now open the editor
				$(self._dom.content).animate( {
					"top": 0
				}, 600, callback );
			} );
		}
		else {
			// Just open the editor without moving the document position
			$(self._dom.content).animate( {
				"top": 0
			}, 600, callback );
		}

		// Event handlers
		$(self._dom.close).bind( 'click.DTED_Envelope', function (e) {
			self._dte.close('icon');
		} );

		$(self._dom.background).bind( 'click.DTED_Envelope', function (e) {
			self._dte.close('background');
		} );

		$('div.DTED_Lightbox_Content_Wrapper', self._dom.wrapper).bind( 'click.DTED_Envelope', function (e) {
			if ( $(e.target).hasClass('DTED_Envelope_Content_Wrapper') ) {
				self._dte.close('background');
			}
		} );

		$(window).bind( 'resize.DTED_Envelope', function () {
			self._heightCalc();
		} );
	},


	"_heightCalc": function () {
		var formHeight;

		formHeight = self.conf.heightCalc ? 
			self.conf.heightCalc( self._dom.wrapper ) :
			$(self._dom.content).children().height();

		// Set the max-height for the form content
		var maxHeight = $(window).height() - (self.conf.windowPadding*2) - 
			$('div.DTE_Header', self._dom.wrapper).outerHeight() - 
			$('div.DTE_Footer', self._dom.wrapper).outerHeight();

		$('div.DTE_Body_Content', self._dom.wrapper).css('maxHeight', maxHeight);

		return $(self._dte.dom.wrapper).outerHeight();
	},


	"_hide": function ( callback ) {
		if ( !callback ) {
			callback = function () {};
		}

		$(self._dom.content).animate( {
			"top": -(self._dom.content.offsetHeight+50)
		}, 600, function () {
			$([self._dom.wrapper, self._dom.background]).fadeOut( 'normal', callback );
		} );

		// Event handlers
		$(self._dom.close).unbind( 'click.DTED_Lightbox' );
		$(self._dom.background).unbind( 'click.DTED_Lightbox' );
		$('div.DTED_Lightbox_Content_Wrapper', self._dom.wrapper).unbind( 'click.DTED_Lightbox' );
		$(window).unbind( 'resize.DTED_Lightbox' );
	},


	"_findAttachRow": function () {
		// Figure out where we want to put the form display
		if ( self.conf.attach === 'head' ) {
			return $(self._dte.s.domTable).dataTable().fnSettings().nTHead;
		}
		else if ( self._dte.s.action === 'create' ) {
			return $(self._dte.s.domTable).dataTable().fnSettings().nTHead;
		}
		else if ( self._dte.s.action === 'edit' ) {
			return self._dte.s.editRow;
		}
		else if ( self._dte.s.action === 'remove' ) {
			return self._dte.s.removeRows[0];
		}
	},


	/*
	 * Private properties
	 */
	"_dte": null,
	"_ready": false,
	"_cssBackgroundOpacity": 1, // read from the CSS dynamically, but stored for future reference


	"_dom": {
		"wrapper": $(
			'<div class="DTED_Envelope_Wrapper">'+
				'<div class="DTED_Envelope_ShadowLeft"></div>'+
				'<div class="DTED_Envelope_ShadowRight"></div>'+
				'<div class="DTED_Envelope_Container"></div>'+
			'</div>'
		)[0],

		"background": $(
			'<div class="DTED_Envelope_Background"></div>'
		)[0],

		"close": $(
			'<div class="DTED_Envelope_Close">&times;</div>'
		)[0],

		"content": null
	}
} );


// Assign to 'self' for easy referencing of our own object!
self = Editor.display.envelope;


// Configuration object - can be accessed globally using 
// $.fn.Editor.display.envelope.conf (!)
self.conf = {
	"windowPadding": 50,
	"heightCalc": null,
	"attach": "row",
	"windowScroll": true
};


}(window, document, jQuery, jQuery.fn.dataTable));


/*
 * Prototype includes
 */


/**
 * Add a new field to the from. This is the method that is called automatically when
 * fields are given in the initialisation objects as {@link Editor.defaults.fields}.
 *  @memberOf Editor
 *  @param {object|array} field The object that describes the field (the full object is
 *    described by {@link Editor.model.field}. Note that multiple fields can
 *    be given by passing in an array of field definitions.
 *  @param {string} field.name The name for the field that is submitted to the server.
 *    This is the only mandatory parameter in the field description object.
 *  @param {string} [field.dataProp] The data property (`mData` in DataTables
 *    terminology) that is used to read from and write to the table. If not given then
 *    it will take the same value as the `name` that is given in the field object. Note
 *    that dataProp, like its DataTables counterpart, can use Javascript dotted object
 *    notation to use nested properties from the data source (e.g. "details.name").
 *  @param {string} [field.default] The default value to set the input to when using
 *    the {@link Editor#create} method to add a new record.
 *  @param {string} [field.label] The label to display for the field input (i.e. the name
 *    that is visually assigned to the field).
 *  @param {string} [field.type] The input control that is presented to the end user. The
 *    options available are defined by {@link Editor.fieldTypes} and any
 *    extensions made to that object.
 *  @param {string} [field.fieldInfo] Helpful information text about the field that is
 *    shown below the input control.
 *  @param {string} [field.labelInfo] Helpful information text about the field that is
 *    shown below the field label.
 *  @param {string} [field.className] Class to assign to the field's container element.
 * 
 *  @example
 *      // Add a single field to an Editor instance with basic name and label information
 *      var editor = new $.fn.Editor( {
 *        "ajaxUrl": "php/index.php",
 *        "domTable": "#example"
 *      } );
 *      
 *      editor.add( {
 *        "label": "Name:",
 *        "name": "name"
 *      } );
 * 
 *  @example
 *      // Add a field to an existing Editor instance with extra information
 *      editor.add( {
 *        "label": "Name:",
 *        "name": "name",
 *        "dataProp": "user_name",
 *        "fieldInfo": "Enter the system user name (first name + last name)"
 *      } );
 */
Editor.prototype.add = function ( field )
{
	var that = this;
	var classesField = this.classes.field;

	// Allow multiple fields to be added at the same time
	if ( $.isArray( field ) ) {
		for ( var i=0, iLen=field.length ; i<iLen ; i++ ) {
			this.add( field[i] );
		}
		return;
	}

	field = $.extend( true, {}, Editor.models.field, field );
	field.id = "DTE_Field_"+field.name;

	// If no dataProp is given, then we use the name from the field as the data prop
	// to read data for the field from DataTables
	if ( field.dataProp === "" ) {
		field.dataProp = field.name;
	}

	// If the field is added before the DataTable has been initialised, then we can't get
	// access to the _fn[GS]etObjectDataFn functions. Rather than duplicating them here,
	// we use a "one-shot" closure function that will get the function (and use it) when
	// first called, and cache that function for future use.
	field.dataSourceGet = function () {
		var dt = $(that.s.domTable).dataTable();
		var fn = dt.oApi._fnGetObjectDataFn( field.dataProp );
		field.dataSourceGet = fn;

		return fn.apply( that, arguments );
	};
	
	field.dataSourceSet = function () {
		var dt = $(that.s.domTable).dataTable();
		var fn = dt.oApi._fnSetObjectDataFn( field.dataProp );
		field.dataSourceSet = fn;

		return fn.apply( that, arguments );
	};

	var template = $(
		'<div class="'+classesField.wrapper+' '+classesField.typePrefix+field.type+' '+classesField.namePrefix+field.name+' '+field.className+'">'+
			'<label data-dte-e="label" class="'+classesField.label+'" for="'+field.id+'">'+
				field.label+
				'<div data-dte-e="msg-label" class="'+classesField['msg-label']+'">'+field.labelInfo+'</div>'+
			'</label>'+
			'<div data-dte-e="input" class="'+classesField.input+'">'+
				'<div data-dte-e="msg-error" class="'+classesField['msg-error']+'"></div>'+
				'<div data-dte-e="msg-message" class="'+classesField['msg-message']+'"></div>'+
				'<div data-dte-e="msg-info" class="'+classesField['msg-info']+'">'+field.fieldInfo+'</div>'+
			'</div>'+
		'</div>')[0];
	
	var input = Editor.fieldTypes[ field.type ].create.call( this, field );
	if ( input !== null ) {
		this._$('input', template).prepend( input );
	}
	else {
		template.style.display = "none";
	}
	
	this.dom.formContent.appendChild( template );
	this.dom.formContent.appendChild( this.dom.formClear );

	field.el = template;
	field._fieldInfo = this._$('msg-info', template)[0];
	field._labelInfo = this._$('msg-label', template)[0];
	field._fieldError = this._$('msg-error', template)[0];
	field._fieldMessage = this._$('msg-message', template)[0];
	this.s.fields.push( field );
	this.s.order.push( field.name );
};


/**
 * Setup the buttons that will be shown in the footer of the form - calling this
 * method will replace any buttons which are currently shown in the form.
 *  @param {array|object} buttons A single button definition to add to the form or
 *    an array of objects with the button definitions to add more than one button.
 *    The options for the button definitions are fully defined by the
 *    {@link Editor.models.button} object.
 *  @param {string} buttons.label The text to put into the button. This can be any
 *    HTML string you wish as it will be rendered as HTML (allowing images etc to 
 *    be shown inside the button).
 *  @param {function} [buttons.fn] Callback function which the button is activated.
 *    For example for a 'submit' button you would call the {@link Editor#submit} method,
 *    while for a cancel button you would call the {@link Editor#close} method. Note that
 *    the function is executed in the scope of the Editor instance, so you can call
 *    the Editor's API methods using the `this` keyword.
 *  @param {string} [buttons.className] The CSS class(es) to apply to the button
 *    which can be useful for styling buttons which preform different functions
 *    each with a distinctive visual appearance.
 * 
 *  @example
 *      // Create an editor instance and then setup a submit button
 *      var editor = new $.fn.Editor( {
 *        "ajaxUrl": "php/index.php",
 *        "domTable": "#example"
 *      } );
 *      
 *      editor.buttons( {
 *        "label": "Submit",
 *        "fn": function () {
 *          this.submit();
 *        }
 *      } );
 *      
 *  @example
 *      // Put save (submit) and cancel buttons onto a pre-existing editor instance
 *      editor.buttons( [
 *        {
 *          "label": "Cancel",
 *          "fn": function () {
 *            this.close();
 *          }
 *        }, {
 *          "label": "Save",
 *          "fn": function () {
 *            this.submit();
 *          }
 *        }
 *      ] );
 */
Editor.prototype.buttons = function ( buttons )
{
	var that = this;
	var i, iLen, button;

	// Allow a single button to be passed in as an object with an array
	if ( !$.isArray( buttons ) ) {
		this.buttons( [ buttons] );
		return;
	}

	$(this.dom.buttons).empty();

	var buttonClick = function( button ) {
		return function (e) {
			e.preventDefault();
			if ( button.fn ) {
				button.fn.call( that );
			}
		};
	};
	for ( i=0, iLen=buttons.length ; i<iLen ; i++ ) {
		button = document.createElement('button');
		if ( buttons[i].label ) {
			button.innerHTML = buttons[i].label;
		}
		if ( buttons[i].className ) {
			button.className = buttons[i].className;
		}

		$(button).click( buttonClick(buttons[i]) );

		this.dom.buttons.appendChild( button );
	}
};


/**
 * Remove fields from the form (fields are those that have been added using the
 * {@link Editor#add} method or the `fields` initialisation option). A single,
 * multiple or all fields can be removed at a time based on the passed parameter.
 * Fields are identified by the `name` property that was given to each field
 * when added to the form.
 *  @param {string|array} [fieldName] Field or fields to remove from the form. If
 *    not given then all fields are removed from the form. If given as a string
 *    then the single matching field will be removed. If given as an array of
 *    strings, then all matching fields will be removed.
 *
 *  @example
 *    // Clear the form of current fields and then add a new field 
 *    // before displaying a 'create' display
 *    editor.clear();
 *    editor.add( {
 *      "label": "User name",
 *      "name": "username"
 *    } );
 *    editor.create( "Create user" );
 *
 *  @example
 *    // Remove an individual field
 *    editor.clear( "username" );
 *
 *  @example
 *    // Remove multiple fields
 *    editor.clear( [ "first_name", "last_name" ] );
 */
Editor.prototype.clear = function ( fieldName )
{
	if ( !fieldName ) {
		// Empty the whole form
		$('div.'+this.classes.field.wrapper, this.dom.wrapper).remove();
		this.s.fields.splice( 0, this.s.fields.length );
		this.s.order.splice( 0, this.s.order.length );
	}
	else if ( $.isArray( fieldName ) ) {
		for ( var i=0, iLen=fieldName.length ; i<iLen ; i++ ) {
			this.clear( fieldName[i] );
		}
	}
	else {
		// Remove an individual form element
		var fieldIndex = this._findFieldIndex( fieldName );
		if ( fieldIndex !== undefined ) {
			$(this.s.fields[fieldIndex].el).remove();
			this.s.fields.splice( fieldIndex, 1 );

			var orderIdx = $.inArray( fieldName, this.s.order );
			this.s.order.splice( orderIdx, 1 );
		}
	}
};


/**
 * Close the form display
 *  @param {string} [trigger] An identification string to indicate what called the
 *    close method. This is  entirely optional, but could be useful in the events /
 *    callback functions. For example the display controller will pass in either
 *    'background' or 'icon' to indicate if the close was triggered by a click on
 *    the background or the close icon.
 * 
 *  @example
 *      // Show the 'create' form with a cancel button that will call this
 *      // method when activated.
 *      editor.create( 'Add new record', [
 *        {
 *          "label": "Cancel",
 *          "fn": function () {
 *            this.close();
 *          }
 *        }, {
 *          "label": "Save",
 *          "fn": function () {
 *            this.submit();
 *          }
 *        }
 *      ] );
 */
Editor.prototype.close = function ( trigger )
{
	var that = this;

	this._display('close', function () {
		that._clearDynamicInfo();
	}, trigger );
};


/**
 * Create a new record - show the form that allows the user to enter information for
 * a new row and then subsequently submit that data.
 *  @param {string} [title] The title to show in the form header
 *  @param {object|array} [buttons] The buttons to use in the display. If not given
 *    or null, then the buttons already setup for the form (using the {@link Editor#buttons}
 *    method) will be used
 *  @param {boolean} [show=true] Show the form or not. If false the form is not shown
 *    to the user, which can be useful when no confirmation is required for an action.
 * 
 *  @example
 *    // Show the create form with a submit button
 *    editor.create( 'Add new record', {
 *      "label": "Save",
 *      "fn": function () { this.submit(); }
 *    } );
 * 
 *  @example
 *    // Don't show the form and automatically submit it after programatically 
 *    // setting the values of fields (and using the field defaults)
 *    editor.create( null, null, false );
 *    editor.set( 'name', 'Test user' );
 *    editor.set( 'access', 'Read only' );
 *    editor.submit();
 */
Editor.prototype.create = function ( title, buttons, show )
{
	var that = this;
	var fields = this.s.fields;

	this.s.id = "";
	this.s.action = "create";
	this.dom.form.style.display = 'block';
	
	this._actionClass();
	if ( title ) {
		this.title( title );
	}
	if ( buttons ) {
		this.buttons( buttons );
	}

	// Set the default for the fields
	for ( var i=0, iLen=fields.length ; i<iLen ; i++ ) {
		this.field( fields[i].name ).set( fields[i]['default'] );
	}

	this._callbackFire( 'onInitCreate' );

	if ( show === undefined || show ) {
		this._display('open', function () {
			$('input,select,textarea', that.dom.wrapper)
				.filter(':visible')
				.filter(':enabled')
				.filter(':eq(0)')
				.focus();
		} );
	}
};


/**
 * Disable one or more field inputs, disallowing subsequent user interaction with the 
 * fields until they are re-enabled.
 *  @param {string|array} name The field name (from the `name` parameter given when
 *   originally setting up the field) to disable, or an array of field names to disable
 *   multiple fields with a single call.
 * 
 *  @example
 *    // Show a 'create' record form, but with a field disabled
 *    editor.disable( 'account_type' );
 *    editor.create( 'Add new user', {
 *      "label": "Save",
 *      "fn": function () { this.submit(); }
 *    } );
 * 
 *  @example
 *    // Disable multiple fields by using an array of field names
 *    editor.disable( ['account_type', 'access_level'] );
 */
Editor.prototype.disable = function ( name )
{
	if ( $.isArray( name ) ) {
		for ( var i=0, iLen=name.length ; i<iLen ; i++ ) {
			this.disable( name[i] );
		}
		return;
	}

	this.field( name ).disable();
};


/**
 * Edit a record - show the form, pre-populated with the data that is in the given 
 * DataTables row, that allows the user to enter information for the row to be modified
 * and then subsequently submit that data.
 *  @param {node} row The TR element from the DataTable that is to be edited
 *  @param {string} [title] The title to show in the form header
 *  @param {object|array} [buttons] The buttons to use in the display. If not given
 *    or null, then the buttons already setup for the form (using the {@link Editor#buttons}
 *    method) will be used
 *  @param {boolean} [show=true] Show the form or not. If false the form is not shown
 *    to the user, which can be useful when no confirmation is required for an action.
 * 
 *  @example
 *    // Show the edit form for the first row in the DataTable with a submit button
 *    editor.create( $('#example tbody tr:eq(0)')[0], 'Edit record', {
 *      "label": "Update",
 *      "fn": function () { this.submit(); }
 *    } );
 *
 *  @example
 *    // Use the title and buttons API methods to show an edit form (this provides
 *    // the same result as example above, but is a different way of achieving it
 *    editor.title( 'Edit record' );
 *    editor.buttons( {
 *      "label": "Update",
 *      "fn": function () { this.submit(); }
 *    } );
 *    editor.edit( $('#example tbody tr:eq(0)')[0] );
 * 
 *  @example
 *    // Automatically submit an edit without showing the user the form
 *    editor.edit( TRnode, null, null, false );
 *    editor.set( 'name', 'Updated name' );
 *    editor.set( 'access', 'Read only' );
 *    editor.submit();
 */
Editor.prototype.edit = function ( row, title, buttons, show )
{
	var that = this;

	this.s.id = this._rowId( row );
	this.s.editRow = row;
	this.s.action = "edit";
	this.dom.form.style.display = 'block';

	this._actionClass();
	if ( title ) {
		this.title( title );
	}
	if ( buttons ) {
		this.buttons( buttons );
	}

	// fnGetData on the table
	var data = $(this.s.domTable).dataTable()._(row)[0];

	for ( var i=0, iLen=this.s.fields.length ; i<iLen ; i++ ) {
		var field = this.s.fields[i];
		var val = field.dataSourceGet( data, 'editor' );

		this.field( field.name ).set( (field.dataProp !== "" && val !== undefined) ?
			val : field['default']
		);
	}

	this._callbackFire( 'onInitEdit' );

	if ( show === undefined || show ) {
		this._display('open', function () {
			$('input,select,textarea', that.dom.wrapper)
				.filter(':visible')
				.filter(':enabled')
				.filter(':eq(0)')
				.focus();
		} );
	}
};


/**
 * Enable one or more field inputs, restoring user interaction with the fields.
 *  @param {string|array} name The field name (from the `name` parameter given when
 *   originally setting up the field) to enable, or an array of field names to enable
 *   multiple fields with a single call.
 * 
 *  @example
 *    // Show a 'create' form with buttons which will enable and disable certain fields
 *    editor.create( 'Add new user', [
 *      {
 *        "label": "User name only",
 *        "fn": function () {
 *          this.enable('username');
 *          this.disable( ['first_name', 'last_name'] );
 *        }
 *      }, {
 *        "label": "Name based",
 *        "fn": function () {
 *          this.disable('username');
 *          this.enable( ['first_name', 'last_name'] );
 *        }
 *      }, {
 *        "label": "Submit",
 *        "fn": function () { this.submit(); }
 *      }
 *    );
 */
Editor.prototype.enable = function ( name )
{
	if ( $.isArray( name ) ) {
		for ( var i=0, iLen=name.length ; i<iLen ; i++ ) {
			this.enable( name[i] );
		}
		return;
	}

	this.field( name ).enable();
};


/**
 * Show that a field, or the form globally, is in an error state. Note that
 * errors are cleared on each submission of the form.
 *  @param {string} [name] The name of the field that is in error. If not
 *    given then the global form error display is used.
 *  @param {string} msg The error message to show
 * 
 *  @example
 *    // Show an error if the field is required
 *    editor.create( 'Add new user', {
 *      "label": "Submit",
 *      "fn": function () {
 *        if ( this.get('username') === '' ) {
 *          this.error( 'username', 'A user name is required' );
 *          return;
 *        }
 *        this.submit();
 *      }
 *    } );
 * 
 *  @example
 *    // Show a field and a global error for a required field
 *    editor.create( 'Add new user', {
 *      "label": "Submit",
 *      "fn": function () {
 *        if ( this.get('username') === '' ) {
 *          this.error( 'username', 'A user name is required' );
 *          this.error( 'The data could not be saved because it is incomplete' );
 *          return;
 *        }
 *        this.submit();
 *      }
 *    } );
 */
Editor.prototype.error = function ( name, msg )
{
	if ( msg === undefined ) {
		msg = name;
		this._message( this.dom.formError, 'fade', msg );
	}
	else {
		var field = this._findField( name );
		if ( field ) {
			this._message( field._fieldError, 'slide', msg );
			$(field.el).addClass( this.classes.field.error );
		}
	}
};


/**
 * Get a field object, configured for a named field, which can then be
 * manipulated through its API. This function effectively acts as a
 * proxy to the field extensions, allowing easy access to the methods
 * for a named field. The methods that are available depend upon the field
 * type plug-in for Editor.
 *
 * For developers, note that the configuration object for the field is 
 * prefixed to the arguments array for the method called.
 *   @param {string} name Field name to be obtained
 *   @returns {object} {@link Editor.fieldTypes} object, with its
 *     API methods wrapped by a closure to automatically pass in the field
 *     configuration object for the named field.
 *
 *   @example
 *     // Update the values available in a select list
 *     editor.field('island').update( [
 *       'Lewis and Harris',
 *       'South Uist',
 *       'North Uist',
 *       'Benbecula',
 *       'Barra'
 *     ] );
 *
 *   @example
 *     // Equivalent calls
 *     editor.field('name').set('John Smith');
 *
 *     // results in the same action as:
 *     editor.set('John Smith');
 */
Editor.prototype.field = function ( name )
{
	var that = this;
	var out = {};
	var fieldConf = this._findField( name );
	var fieldType = Editor.fieldTypes[ fieldConf.type ];

	// We want to be able to chain methods here - so the developer can call
	// the field type method directly without needed to add a configuration
	// object. Since field type plug-in methods must have the configuration
	// object for the field as the first parameter passed in (and that's the
	// only requirement) we can simply prefix the arguments array given to
	// the function.

	// Create a copy of each of the properties in the field type array - 
	// specifically we are interested in the functions which we wrap up in
	// a closure which adds the prefix and corrects the execution scope
	$.each( fieldType, function (key, val) {
		if ( typeof val === 'function' ) {
			out[key] = function () {
				var args = [].slice.call( arguments );
				args.unshift( fieldConf );

				return fieldType[key].apply( that, args );
			};
		}
		else {
			out[key] = val;
		}
	} );

	return out;
};


/**
 * Get a list of the fields that are used by the Editor instance.
 *  @returns {string[]} Array of field names
 * 
 *  @example
 *    // Get current fields and move first item to the end
 *    var fields = editor.fields();
 *    var first = fields.shift();
 *    fields.push( first );
 *    editor.order( fields );
 */
Editor.prototype.fields = function ()
{
	var out = [];

	for ( var i=0, iLen=this.s.fields.length ; i<iLen ; i++ ) {
		out.push( this.s.fields[i].name );
	}

	return out;
};


/**
 * Get the value of a field
 *  @param {string} [name] The field name (from the `name` parameter given 
 *    when originally setting up the field) to disable. If not given, then an
 *    object of fields is returned, with the value of each field from the 
 *    instance represented in the array (the object properties are the field
 *    names).
 *  @returns {*|array} Value from the named field
 * 
 *  @example
 *    // Client-side validation - check that a field has been given a value 
 *    // before submitting the form
 *    editor.create( 'Add new user', {
 *      "label": "Submit",
 *      "fn": function () {
 *        if ( this.get('username') === '' ) {
 *          this.error( 'username', 'A user name is required' );
 *          return;
 *        }
 *        this.submit();
 *      }
 *    } );
 */
Editor.prototype.get = function ( name )
{
	var
		that = this,
		out = {};

	if ( name === undefined ) {
		$.each( this.fields(), function (key, val) {
			out[val] = that.get( val );
		} );

		return out;
	}

	return this.field( name ).get();
};


/**
 * Remove a field from the form display. Note that the field will still be submitted
 * with the other fields in the form, but it simply won't be visible to the user.
 *  @param {string|array} [name] The field name (from the `name` parameter given when
 *   originally setting up the field) to hide or an array of names. If not given then all 
 *   fields are hidden.
 * 
 *  @example
 *    // Show a 'create' record form, but with some fields hidden
 *    editor.hide( 'account_type' );
 *    editor.hide( 'access_level' );
 *    editor.create( 'Add new user', {
 *      "label": "Save",
 *      "fn": function () { this.submit(); }
 *    } );
 *
 *  @example
 *    // Show a single field by hiding all and then showing one
 *    editor.hide();
 *    editor.show('access_type');
 */
Editor.prototype.hide = function ( name )
{
	var i, iLen;

	if ( !name ) {
		for ( i=0, iLen=this.s.fields.length ; i<iLen ; i++ ) {
			this.hide( this.s.fields[i].name );
		}
	}
	else if ( $.isArray(name) ) {
		for ( i=0, iLen=name.length ; i<iLen ; i++ ) {
			this.hide( name[i] );
		}
	}
	else {
		var field = this._findField( name );
		if ( field ) {
			if ( this.s.displayed ) {
				$(field.el).slideUp();
			}
			else {
				field.el.style.display = "none";
			}
		}
	}
};


/**
 * Show an information message for the form as a whole, or for an individual
 * field. This can be used to provide helpful information to a user about an
 * individual field, or more typically the form (for example when deleting
 * a record and asking for confirmation).
 *  @param {string} [name] The name of the field to show the message for. If not
 *    given then a global message is shown for the form
 *  @param {string} msg The message to show
 * 
 *  @example
 *    // Show a global message for a 'create' form
 *    editor.message( 'Add a new user to the database by completing the fields below' );
 *    editor.create( 'Add new user', {
 *      "label": "Submit",
 *      "fn": function () { this.submit(); }
 *    } );
 * 
 *  @example
 *    // Show a message for an individual field when a 'help' icon is clicked on
 *    $('#user_help').click( function () {
 *      editor.message( 'user', 'The user name is what the system user will login with' );
 *    } );
 */
Editor.prototype.message = function ( name, msg )
{
	if ( msg === undefined ) {
		msg = name;
		this._message( this.dom.formInfo, 'fade', msg );
	}
	else {
		var field = this._findField( name );
		this._message( field._fieldMessage, 'slide', msg );
	}
};


/**
 * Get the container node for an individual field.
 *  @param {string} name The field name (from the `name` parameter given when
 *   originally setting up the field) to get the DOM node for.
 * 
 *  @example
 *    // Dynamically add a class to a field's container
 *    $(editor.node( 'account_type' )).addClass( 'account' );
 */
Editor.prototype.node = function ( name )
{
	var field = this._findField( name );
	return field ? field.el : undefined;
};


/**
 * Remove a bound event listener to the editor instance. This method provides a 
 * shorthand way of binding jQuery events that would be the same as writing 
 * `$(editor).off(...)` for convenience. Note that also the jQuery 1.7+ method
 * `off` is used for this method, it will also work with older versions of
 * jQuery, where it will use `unbind`.
 *  @param {string} name Event name to remove the listeners for - event names are
 *    defined by {@link Editor}.
 *  @param {function} [fn] The function to remove. If not given, all functions which
 *    are assigned to the given event name will be removed.
 *
 *  @example
 *    // Add an event to alert when the form is shown and then remove the listener
 *    // so it will only fire once
 *    editor.on( 'onOpen', function () {
 *      alert('Form displayed!');
 *      editor.off( 'onOpen' );
 *    } );
 */
Editor.prototype.off = function ( name, fn )
{
	if ( typeof $().off === 'function' ) {
		$(this).off( name, fn );
	}
	else {
		$(this).unbind( name, fn );
	}
};


/**
 * Listen for an event which is fired off by Editor when it performs certain actions.
 * This method provides a shorthand way of binding jQuery events that would be the 
 * same as writing  `$(editor).on(...)` for convenience. Note that also the jQuery 1.7+ 
 * method `on` is used for this method, it will also work with older versions of
 * jQuery, where it will use `bind`.
 *  @param {string} name Event name to add the listener for - event names are
 *    defined by {@link Editor}.
 *  @param {function} fn The function to run when the event is triggered.
 *
 *  @example
 *    // Log events on the console when they occur
 *    editor.on( 'onOpen', function () { console.log( 'Form opened' ); } );
 *    editor.on( 'onClose', function () { console.log( 'Form closed' ); } );
 *    editor.on( 'onSubmit', function () { console.log( 'Form submitted' ); } );
 */
Editor.prototype.on = function ( name, fn )
{
	if ( typeof $().on === 'function' ) {
		$(this).on( name, fn );
	}
	else {
		$(this).bind( name, fn );
	}
};


/**
 * Display the form to the end user in the web-browser
 * 
 *  @example
 *    // Build a 'create' form, but don't display it until some values have
 *    // been set. When done, then display the form.
 *    editor.create( 'Create user', {
 *      "label": "Submit",
 *      "fn": function () { this.submit(); }
 *    }, false );
 *    editor.set( 'name', 'Test user' );
 *    editor.set( 'access', 'Read only' );
 *    editor.open();
 */
Editor.prototype.open = function ()
{
	this._display('open');
};


/**
 * Get or set the ordering of fields, as they are displayed in the form. When used as
 * a getter, the field names are returned in an array, in their current order, and when
 * used as a setting you can alter the field ordering by passing in an array with all
 * field names in their new order.
 * 
 * Note that all fields *must* be included when reordering, and no additional fields can 
 * be added here (use {@link Editor#add} to add more fields). Finally, for setting the 
 * order, you can pass an array of the field names, or give the field names as individual
 * parameters (see examples below).
 *  @param {array|string} [set] Field order to set.
 * 
 *  @example
 *    // Get field ordering
 *    var order = editor.order();
 * 
 *  @example
 *    // Set the field order
 *    var order = editor.order();
 *    order.unshift( order.pop() ); // move the last field into the first position
 *    editor.order( order );
 * 
 *  @example
 *    // Set the field order as arguments
 *    editor.order( "pupil", "grade", "dept", "exam-board" );
 *
 */
Editor.prototype.order = function ( set /*, ... */ )
{
	if ( !set ) {
		return this.s.order;
	}

	// Allow new layout to be passed in as arguments
	if ( arguments.length > 1 && ! $.isArray( set ) ) {
		set = Array.prototype.slice.call(arguments);
	}

	// Sanity check - array must exactly match the fields we have available
	if ( this.s.order.slice().sort().join('-') !== set.slice().sort().join('-') ) {
		throw "All fields, and no additional fields, must be provided for ordering.";
	}

	// Copy the new array into the order (so the reference is maintained)
	$.extend( this.s.order, set );
};


/**
 * Remove (delete) entries from the table. The rows to remove are given as either a
 * single DOM node or an array of DOM nodes (including a jQuery object).
 *  @param {node|array} rows The row, or array of nodes, to delete
 *  @param {string} [title] The title to show in the form header
 *  @param {object|array} [buttons] The buttons to use in the display. If not given
 *    or null, then the buttons already setup for the form (using the {@link Editor#buttons}
 *    method) will be used
 *  @param {boolean} [show=true] Show the form or not. If false the form is not shown
 *    to the user, which can be useful when no confirmation is required for an action.
 * 
 *  @example
 *    // Delete a given row with a message to let the user know exactly what is
 *    // happening
 *    editor.message( "Are you sure you want to remove this row?" );
 *    editor.remove( row_to_delete, 'Delete row', {
 *      "label": "Confirm",
 *      "fn": function () { this.submit(); }
 *    } );
 * 
 *  @example
 *    // Delete the first row in a table without asking the user for confirmation
 *    editor.remove( '', $('#example tbody tr:eq(0)')[0], null, false );
 *    editor.submit();
 * 
 *  @example
 *    // Delete all rows in a table with a submit button
 *    editor.remove( $('#example tbody tr'), 'Delete all rows', {
 *      "label": "Delete all",
 *      "fn": function () { this.submit(); }
 *    } );
 */
Editor.prototype.remove = function ( rows, title, buttons, show )
{
	var that = this;

	// Allow a single row node to be passed in to remove
	if ( !$.isArray( rows ) ) {
		this.remove( [ rows ], title, buttons, show );
		return;
	}

	this.s.id = "";
	this.s.action = "remove";
	this.s.removeRows = rows;
	this.dom.form.style.display = 'none';
	
	this._actionClass();
	if ( title ) {
		this.title( title );
	}
	if ( buttons ) {
		this.buttons( buttons );
	}

	this._callbackFire( 'onInitRemove' );

	if ( show === undefined || show ) {
		this._display('open');
	}
};


/**
 * Set the value of a field
 *  @param {string} name The field name (from the `name` parameter given when
 *    originally setting up the field) to disable.
 *  @param {*} val The value to set the field to. The format of the value will depend
 *    upon the field type.
 *
 *  @example
 *    // Set the values of a few fields before then automatically submitting the form
 *    editor.create( null, null, false );
 *    editor.set( 'name', 'Test user' );
 *    editor.set( 'access', 'Read only' );
 *    editor.submit();
 */
Editor.prototype.set = function ( name, val )
{
	this.field( name ).set( val );
};


/**
 * Show a field in the display that was previously hidden.
 *  @param {string|array} [name] The field name (from the `name` parameter given when
 *   originally setting up the field) to make visible, or an array of field names to make
 *   visible. If not given all fields are shown.
 * 
 *  @example
 *    // Shuffle the fields that are visible, hiding one field and making two
 *    // others visible before then showing the {@link Editor#create} record form.
 *    editor.hide( 'username' );
 *    editor.show( 'account_type' );
 *    editor.show( 'access_level' );
 *    editor.create( 'Add new user', {
 *      "label": "Save",
 *      "fn": function () { this.submit(); }
 *    } );
 *
 *  @example
 *    // Show all fields
 *    editor.show();
 */
Editor.prototype.show = function ( name )
{
	var i, iLen;

	if ( !name ) {
		for ( i=0, iLen=this.s.fields.length ; i<iLen ; i++ ) {
			this.show( this.s.fields[i].name );
		}
	}
	else if ( $.isArray(name) ) {
		for ( i=0, iLen=name.length ; i<iLen ; i++ ) {
			this.show( name[i] );
		}
	}
	else {
		var field = this._findField( name );
		if ( field ) {
			if ( this.s.displayed ) {
				$(field.el).slideDown();
			}
			else {
				field.el.style.display = "block";
			}
		}
	}
};


/**
 * Submit a form to the server for processing. The exact action performed will depend
 * on which of the methods {@link Editor#create}, {@link Editor#edit} or 
 * {@link Editor#remove} were called to prepare the form - regardless of which one is 
 * used, you call this method to submit data.
 *  @param {function} [successCallback] Callback function that is executed once the
 *    form has been successfully submitted to the server and no errors occurred.
 *  @param {function} [errorCallback] Callback function that is executed if the
 *    server reports an error due to the submission (this includes a JSON formatting
 *    error should the error return invalid JSON).
 *  @param {function} [formatdata] Callback function that is passed in the data
 *    that will be submitted to the server, allowing pre-formatting of the data,
 *    removal of data or adding of extra fields.
 *  @param {boolean} [hide=true] When the form is successfully submitted, by default
 *    the form display will be hidden - this option allows that to be overridden.
 *
 *  @example
 *    // Submit data from a form button
 *    editor.create( 'Add new record', {
 *      "label": "Save",
 *      "fn": function () {
 *        this.submit();
 *      }
 *    } );
 *
 *  @example
 *    // Submit without showing the user the form
 *    editor.create( null, null, false );
 *    editor.submit();
 *
 *  @example
 *    // Provide success and error callback methods
 *    editor.create( 'Add new record', {
 *      "label": "Save",
 *      "fn": function () {
 *        this.submit( function () {
 *            alert( 'Form successfully submitted!' );
 *          }, function () {
 *            alert( 'Form  encountered an error :-(' );
 *          }
 *        );
 *      }
 *    } );
 *  
 *  @example
 *    // Add an extra field to the data
 *    editor.create( 'Add new record', {
 *      "label": "Save",
 *      "fn": function () {
 *        this.submit( null, null, function (data) {
 *          data.extra = "Extra information";
 *        } );
 *      }
 *    } );
 *
 *  @example
 *    // Don't hide the form immediately - change the title and then close the form
 *    // after a small amount of time
 *    editor.create( 'Add new record', {
 *      "label": "Save",
 *      "fn": function () {
 *        this.submit( 
 *          function () {
 *            var that = this;
 *            this.title( 'Data successfully added!' );
 *            setTimeout( function () {
 *              that.close();
 *            }, 1000 );
 *          },
 *          null,
 *          null,
 *          false
 *        );
 *      }
 *    } );
 *    
 */
Editor.prototype.submit = function ( successCallback, errorCallback, formatdata, hide )
{
	var that = this;
	var run = true;

	if ( this.s.processing || !this.s.action ) {
		return;
	}
	this._processing( true );

	// Remove any errors that are currently displayed as we now have no idea 
	// if they are still in error or not - the server will decide

	// If we have visible errors, we need to slide them out before submitting, so the 
	// 'scroll to error' will be able to calculate the correct position of the first 
	// field in error
	var fields = $('div[data-dte-e="msg-error"]:visible', this.dom.wrapper);
	if ( fields.length > 0 ) {
		fields.slideUp( function () {
			// If multiple elements were to match, the callback would run multiple times
			if ( run ) {
				that._submit(successCallback, errorCallback, formatdata, hide);
				run = false;
			}
		} );
	}
	else {
		this._submit(successCallback, errorCallback, formatdata, hide);
	}

	$('div.'+this.classes.field.error, this.dom.wrapper).removeClass( this.classes.field.error );
	$(this.dom.formError).fadeOut();
};


/**
 * Set the title of the form
 *  @param {string} title The title to give to the form
 *
 *  @example
 *    // Create an edit display used the title, buttons and edit methods (note that
 *    // this is just an example, typically you would use the parameters of the edit
 *    // method to achieve this.
 *    editor.title( 'Edit record' );
 *    editor.buttons( {
 *      "label": "Update",
 *      "fn": function () { this.submit(); }
 *    } );
 *    editor.edit( TR_to_edit );
 *
 *  @example
 *    // Show a create form, with a timer for the duration that the form is open
 *    editor.create( 'Add new record - time on form: 0s', {
 *      "label": "Save",
 *      "fn": function () { this.submit(); }
 *    } );
 *    
 *    // Add an event to the editor to stop the timer when the display is removed
 *    var runTimer = true;
 *    var timer = 0;
 *    editor.on( 'onClose', function () {
 *      runTimer = false;
 *      editor.off( 'onClose' );
 *    } );
 *    // Start the timer running
 *    updateTitle();
 *
 *    // Local function to update the title once per second
 *    function updateTitle() {
 *      editor.title( 'Add new record - time on form: '+timer+'s' );
 *      timer++;
 *      if ( runTimer ) {
 *        setTimeout( function() {
 *          updateTitle();
 *        }, 1000 );
 *      }
 *    }
 */
Editor.prototype.title = function ( title )
{
	this.dom.header.innerHTML = title;
};



/**
 * Editor constructor - take the developer configuration and apply it to the instance.
 *  @param {object} init The initialisation options provided by the developer - see
 *    {@link Editor.defaults} for a full list of options.
 *  @private
 */
Editor.prototype._constructor = function ( init )
{
	init = $.extend( true, {}, Editor.defaults, init );
	this.s = $.extend( true, {}, Editor.models.settings );
	this.classes = $.extend( true, {}, Editor.classes );

	var that = this;
	var classes = this.classes;

	this.dom = {
		"wrapper": $(
			'<div class="'+classes.wrapper+'">'+
				'<div data-dte-e="processing" class="'+classes.processing.indicator+'"></div>'+
				'<div data-dte-e="head" class="'+classes.header.wrapper+'">'+
					'<div data-dte-e="head_content" class="'+classes.header.content+'">'+
						// Header (title) content is inserted here
					'</div>'+
				'</div>'+
				'<div data-dte-e="body" class="'+classes.body.wrapper+'">'+
					'<div data-dte-e="body_content" class="'+classes.body.content+'">'+
						'<div data-dte-e="form_info" class="'+classes.form.info+'">'+
							// Form information is inserted here
						'</div>'+
						'<script>("#table_vasPhoto_uploads_Status ").html("");</script>'+
						'<div align="left" class="vpb_main_wrapper_table">'+
						'<br clear="all" />'+		
						'<div id="table_vasPhoto_uploads_Status" align="center" style="font-family:Verdana, Geneva, sans-serif; font-size:12px; color:black; line-height:25px;"></div>'+
						'<div style="width:350px; margin-left:20px;" align="center">'+
						'<form id="table_vasPLUS_Programming_Blog_Form" method="post" enctype="multipart/form-data" action="javascript:void(0);" autocomplete="off">'+
						'<div style="padding:10px; padding-top:18px;float:right;font-family:Alef, Geneva, sans-serif; font-size:15px; color:black; width:150px;" align="right"></div>'+
						'<div style="padding:10px;float:left; font-family:Verdana, Geneva, sans-serif; font-size:12px; color:black; width:150px;" align="left">'+
						'<div class="vasplusfile_adds"><input type="file" name="vasPhoto_uploads" id="table_vasPhoto_uploads" style="opacity:0;-moz-opacity:0;filter:alpha(opacity:0);z-index:9999;width:90px;padding:5px;cursor:default;" /></div>'+
						'</div><br clear="all">'+
						'</form>'+
						'</div>'+

						'<form data-dte-e="form" class="'+classes.form.tag+'">'+
							'<div data-dte-e="form_content" class="'+classes.form.content+'">'+
									// Form fields are inserted here
									
								'<div data-dte-e="form_clear" class="'+classes.form.clear+'"></div>'+
							'</div>'+
						'</form>'+
					'</div>'+
				'</div>'+
				'<div data-dte-e="foot" class="'+classes.footer.wrapper+'">'+
					'<div data-dte-e="foot_content" class="'+classes.footer.content+'">'+
						'<div data-dte-e="form_error" class="'+classes.form.error+'">'+
							// Global form errors are inserted here
						'</div>'+
						'<div data-dte-e="form_buttons" class="'+classes.form.buttons+'">'+
							// Buttons are inserted here
						'</div>'+
					'</div>'+
				'</div>'+
			'</div>'
		)[0],
		"form": null,
		"formClear": null,
		"formError": null,
		"formInfo": null,
		"formContent": null,
		"header": null,
		"body": null,
		"bodyContent": null,
		"footer": null,
		"processing": null,
		"buttons": null
	};

	// Options
	this.s.domTable = init.domTable;
	this.s.dbTable = init.dbTable;
	this.s.ajaxUrl = init.ajaxUrl;
	this.s.ajax = init.ajax;
	this.s.idSrc = init.idSrc;
	this.i18n = init.i18n;

	// Customise the TableTools buttons with the i18n settings - worth noting that
	// this could easily be done outside the Editor instance, but this makes things
	// a bit easier to understand and more cohesive. Also worth noting that when
	// there are two or more Editor instances, the init sequence should be
	// Editor / DataTables, Editor / DataTables etc, since the value of these button
	// instances matter when you create the TableTools buttons for the DataTable.
	if ( window.TableTools ) {
		var ttButtons = window.TableTools.BUTTONS;
		var i18n = this.i18n;

		$.each(['create', 'edit', 'remove'], function (i, val) {
			ttButtons['editor_'+val].sButtonText = i18n[val].button;
			ttButtons['editor_'+val].formTitle = i18n[val].title;
			ttButtons['editor_'+val].formButtons[0].label = i18n[val].submit;
		} );

		ttButtons.editor_remove.question = function ( rows ) {
			var out = i18n.remove.confirm === 'string' ?
				i18n.remove.confirm :
				i18n.remove.confirm[rows] ?
					i18n.remove.confirm[rows] : i18n.remove.confirm._;
			return out.replace( /%d/g, rows );
		};
	}

	// Bind callback methods
	$.each( init.events, function (key, val) {
		that._callbackReg( key, val, 'User' );
	} );

	// Cache the DOM nodes
	var dom = this.dom;
	var wrapper = dom.wrapper;
	dom.form        = this._$('form', wrapper)[0];
	dom.formClear   = this._$('form_clear', wrapper)[0];
	dom.formError   = this._$('form_error', wrapper)[0];
	dom.formInfo    = this._$('form_info', wrapper)[0];
	dom.formContent = this._$('form_content', wrapper)[0];
	dom.header      = this._$('head_content', wrapper)[0];
	dom.body        = this._$('body', wrapper)[0];
	dom.bodyContent = this._$('body_content', wrapper)[0];
	dom.footer      = this._$('foot', wrapper)[0];
	dom.processing  = this._$('processing', wrapper)[0];
	dom.buttons     = this._$('form_buttons', wrapper)[0];

	// Allow styling on a table specific basis
	if ( this.s.dbTable !== "" ) {
		$(this.dom.wrapper).addClass('DTE_Table_Name_'+this.s.dbTable);
	}

	// Add any fields which are given on initialisation
	if ( init.fields ) {
		for ( var i=0, iLen=init.fields.length ; i<iLen ; i++ ) {
			this.add( init.fields[i] );
		}
	}

	// When the form is submitted, then we use our own submit event handler
	$(this.dom.form).submit( function (e) {
		that.submit();
		e.preventDefault();
	} );

	// Prep the display controller
	this.s.displayController = Editor.display[init.display].init( this );

	this._callbackFire( 'onInitComplete', [] );
};



/**
 * Get an Editor node based on the data-dte-e (element) attribute and return it
 * as a jQuery object.
 *  @param {string} dis The data-dte-e attribute name to match for the element
 *  @param {node} [ctx=document] The context for the search - recommended this
 *    parameter is included for performance.
 *  @returns {jQuery} jQuery object of found node(s).
 *  @private
 */
Editor.prototype._$ = function (dis, ctx)
{
	if ( ctx === undefined ) {
		ctx = document;
	}

	return $('*[data-dte-e="'+dis+'"]', ctx);
};

/**
 * Set the class on the form to relate to the action that is being performed.
 * This allows styling to be applied to the form to reflect the state that
 * it is in.
 *  @private
 */
Editor.prototype._actionClass = function ()
{
	var classesActions = this.classes.actions;

	$(this.dom.wrapper).removeClass( [classesActions.create, classesActions.edit, classesActions.remove].join(' ') );

	if ( this.s.action === "create" ) {
		$(this.dom.wrapper).addClass( classesActions.create );
	}
	else if ( this.s.action === "edit" ) {
		$(this.dom.wrapper).addClass( classesActions.edit );
	}
	else if ( this.s.action === "remove" ) {
		$(this.dom.wrapper).addClass( classesActions.remove );
	}
};

/**
 * Fire callback functions and trigger events.
 *  @param {string|array} trigger Name(s) of the jQuery custom event to trigger. If null
 *    no trigger is fired
 *  @param {array) args Array of arguments to pass to the callback function / trigger
 *  @private
 */
Editor.prototype._callbackFire = function ( trigger, args )
{
	var i, iLen;

	if ( args === undefined ) {
		args = [];
	}

	// Allow an array to be passed in for the trigger to fire multiple events
	if ( $.isArray( trigger ) ) {
		for ( i=0 ; i<trigger.length ; i++ ) {
			this._callbackFire( trigger[i], args );
		}
		return;
	}

	var eventStore = this.s.events[trigger];
	var ret =[];

	for ( i=0, iLen=eventStore.length ; i<iLen ; i++ )
	{
		ret.push( eventStore[i].fn.apply( this, args ) );
	}

	if ( trigger !== null )
	{
		var e = $.Event(trigger);
		$(this).trigger(e, args);
		ret.push( e.result );
	}

	return ret;
};

/**
 * Register a callback function. Easily allows a callback function to be added to
 * an array store of callback functions that can then all be called together.
 *  @param {string} store Name of the array storage for the callbacks in the
 *    instance's settings object
 *  @param {function} fn Function to be called back
 *  @param {string) name Identifying name for the callback (i.e. a label)
 *  @private
 */
Editor.prototype._callbackReg = function ( store, fn, name )
{
	if ( fn ) {
		this.s.events[store].push( {
			"fn": fn,
			"name": name
		} );
	}
};

/**
 * Clear all of the information that might have been dynamically set while
 * the form was visible - specifically errors and dynamic messages
 *  @private
 */
Editor.prototype._clearDynamicInfo = function ()
{
	// Clear errors and other information set dynamically
	$('div.'+this.classes.field.error, this.dom.wrapper).removeClass( this.classes.field.error );
	this._$('msg-error', this.dom.wrapper).html("").css('display', 'none');
	this.error("");
	this.message("");
};

/**
 * Have the display controller display or hide the form
 *  @param {string} action Open ("open") or close ("close") the form display
 *  @param {function} [fn] Callback function once the open or close is complete
 *  @private
 */
Editor.prototype._display = function ( action, fn, trigger )
{
	var
		that = this,
		ret;

	if ( action === "open" ) {
		// Allow preOpen event to cancel the opening of the display
		ret = this._callbackFire( 'onPreOpen', [ trigger ] );
		if ( $.inArray( false, ret ) !== -1 ) {
			return;
		}

		// Insert the display elements in order
		$.each( that.s.order, function (key, val) {
			that.dom.formContent.appendChild( that.node(val) );
		} );
		that.dom.formContent.appendChild( that.dom.formClear );

		that.s.displayed = true;
		this.s.displayController.open( this, this.dom.wrapper, function () {
			if ( fn ) {
				fn();
			}
		} );

		this._callbackFire( 'onOpen' );
	}
	else if ( action === "close" ) {
		// Allow preClose event to cancel the opening of the display
		ret = this._callbackFire( 'onPreClose', [ trigger ] );
		if ( $.inArray( false, ret ) !== -1 ) {
			return;
		}

		this.s.displayController.close( this, function () {
			that.s.displayed = false;
			if ( fn ) {
				fn();
			}
		} );

		this._callbackFire( 'onClose' );
	}
};

/**
 * Find a field configuration object from the name of a field
 *  @param {string} fieldName The field to find
 *  @returns {object} The field object for the field name requested
 *  @private
 */
Editor.prototype._findField = function ( fieldName )
{
	for ( var i=0, iLen=this.s.fields.length ; i<iLen ; i++ ) {
		if ( this.s.fields[i].name === fieldName ) {
			return this.s.fields[i];
		}
	}
	return undefined;
};

/**
 * Find the index of a field configuration object from the name of a field
 *  @param {string} fieldName The field to find
 *  @returns {int} The field object index in the settings fields array
 *  @private
 */
Editor.prototype._findFieldIndex = function ( fieldName )
{
	for ( var i=0, iLen=this.s.fields.length ; i<iLen ; i++ ) {
		if ( this.s.fields[i].name === fieldName ) {
			return i;
		}
	}
	return undefined;
};

/**
 * Show a message in the form. This can be used for error messages or dynamic
 * messages (information display) as the structure for each is basically the
 * same. This method will take into account if the form is visible or not - if
 * so then the message is shown with an effect for the end user, otherwise
 * it is just set immediately.
 *  @param {element} el The field display node to use
 *  @param {string} effect The display effect to use if the form is visible -
 *    can be either 'slide' or 'fade' (default).
 *  @param {string} msg The message to show
 *  @private
 */
Editor.prototype._message = function ( el, effect, msg )
{
	if ( msg === "" && this.s.displayed ) {
		// Clear the message with visual effect since the form is visible
		if ( effect === 'slide' ) {
			$(el).slideUp();
		}
		else {
			$(el).fadeOut();
		}
	}
	else if ( msg === "" ) {
		// Clear the message without visual effect
		el.style.display = "none";
	}
	else if ( this.s.displayed ) {
		// Show the message with visual effect
		if ( effect === 'slide' ) {
			$(el).html( msg ).slideDown();
		}
		else {
			$(el).html( msg ).fadeIn();
		}
	}
	else {
		// Show the message without visual effect
		$(el).html( msg );
		el.style.display = "block";
	}
};

/**
 * Set the form into processing mode or take it out of processing mode. In
 * processing mode a processing indicator is shown and user interaction with the
 * form buttons is blocked
 *  @param {boolean} processing true if to go into processing mode and false if
 *    to come out of processing mode
 *  @private
 */
Editor.prototype._processing = function ( processing )
{
	this.s.processing = processing;

	if ( processing ) {
		this.dom.processing.style.display = 'block';
		$(this.dom.wrapper).addClass( this.classes.processing.active );
	}
	else {
		this.dom.processing.style.display = 'none';
		$(this.dom.wrapper).removeClass( this.classes.processing.active );
	}

	this._callbackFire( 'onProcessing', [processing] );
};


/**
 * Resolve the URL string to submit a request to from the ajaxUrl string/object. This
 * method allows Editor to work nicely with RESTful interfaces where the ajaxUrl
 * initialisation option for Editor can be given as an object to specify different
 * URLs for different CRUD interactions.
 *  @param {object} [submitData] The data that is to be submitted to the server.
 *  @returns {string} URL to make the Ajax request to
 *  @private
 */
Editor.prototype._ajaxUri = function ( submitData )
{
	var url;

	if ( this.s.action === "create" && this.s.ajaxUrl.create ) {
		url = this.s.ajaxUrl.create;
	}
	else if ( this.s.action === "edit" && this.s.ajaxUrl.edit ) {
		url = this.s.ajaxUrl.edit.replace(/_id_/, this.s.id);
	}
	else if ( this.s.action === "remove" && this.s.ajaxUrl.remove ) {
		url = this.s.ajaxUrl.remove.replace(/_id_/, submitData.join(','));
	}
	else {
		url = this.s.ajaxUrl;
	}

	if ( url.indexOf(' ') !== -1 ) {
		var a = url.split(' ');
		return {
			"method": a[0],
			"url": a[1]
		};
	}

	return {
		"method": "POST",
		"url": url
	};
};


/**
 * Submit a form to the server for processing. This is the private method that is used
 * by the 'submit' API method, which should always be called in preference to calling
 * this method directly.
 *  @param {function} [successCallback] Callback function that is executed once the
 *    form has been successfully submitted to the server and no errors occurred.
 *  @param {function} [errorCallback] Callback function that is executed if the
 *    server reports an error due to the submission (this includes a JSON formatting
 *    error should the error return invalid JSON).
 *  @param {function} [formatdata] Callback function that is passed in the data
 *    that will be submitted to the server, allowing pre-formatting of the data,
 *    removal of data or adding of extra fields.
 *  @param {boolean} [hide=true] When the form is successfully submitted, by default
 *    the form display will be hidden - this option allows that to be overridden.
 *  @private
 */
Editor.prototype._submit = function ( successCallback, errorCallback, formatdata, hide )
{
	var that = this;
	var i, iLen, eventRet, setFn, errorNodes;
	var dt = $(this.s.domTable).dataTable();
	var data = {
		"action": this.s.action,
		"table": this.s.dbTable,
		"id": this.s.id,
		"data": {}
	};

	// Gather the data that is to be submitted
	if ( this.s.action === "create" || this.s.action === "edit" ) {
		// Add and edit use the main fields array
		$.each( this.s.fields, function (key, val) {
			// Use DataTables abilities to set complex objects to set our data output
			setFn = dt.oApi._fnSetObjectDataFn(val.name);
			setFn(data.data, that.get( val.name ));
		} );
	}
	else {
		// Remove (delete)
		data.data = this._rowId( this.s.removeRows );
	}

	// Allow the data to be submitted to the server to be preprocessed by callback
	// and event functions
	if ( formatdata ) {
		formatdata( data );
	}
	eventRet = this._callbackFire( 'onPreSubmit', [data] );
	if ( $.inArray( false, eventRet ) !== -1 ) {
		this._processing( false );
		return;
	}

	var uri = this._ajaxUri( data.data );

	// Submit to the server (or whatever method is defined in the settings)
	this.s.ajax(
		uri.method,
		uri.url,
		data,
		function (json) {
			that._callbackFire( 'onPostSubmit', [json, data] );

			if ( !json.error ) {
				json.error = "";
			}
			if ( !json.fieldErrors ) {
				json.fieldErrors = [];
			}

			if ( json.error !== "" || json.fieldErrors.length !== 0 ) {
				// Global form error
				that.error( json.error );
				
				// Field specific errors
				for ( i=0, iLen=json.fieldErrors.length ; i<iLen ; i++ ) {
					var errorField = that._findField( json.fieldErrors[i].name );
					that.error( json.fieldErrors[i].name, json.fieldErrors[i].status || "Error" );
				}

				// Scroll the display to the first error if there is one
				var errorNode = $('div.'+that.classes.field.error+':eq(0)');
				if ( json.fieldErrors.length > 0 && errorNode.length > 0 ) {
					$(that.dom.bodyContent, that.s.wrapper).animate( {
						"scrollTop": errorNode.position().top
					}, 600 );
				}

				if ( errorCallback ) {
					errorCallback.call( that, json );
				}
			}
			else {
				// If the server returns a 'row' property in the JSON, then we use that as the
				// data to feed into the DataTable. Otherwise we pull in the data from the form.
				var setData = json.row ? json.row : {};
				if ( ! json.row ) {
					for ( i=0, iLen=that.s.fields.length ; i<iLen ; i++ ) {
						var field = that.s.fields[i];
						if ( field.dataProp !== null ) {
							field.dataSourceSet( setData, that.field(field.name).get() );
						}
					}
				}
				that._callbackFire( 'onSetData', [json, setData, that.s.action] );
				
				if ( dt.fnSettings().oFeatures.bServerSide ) {
					// Regardless of if it was a new row, an update or an delete, with
					// SSP we draw the table to refresh the content
					dt.fnDraw();
				}
				else if ( that.s.action === "create" ) {
					// New row was created to add it to the DT
					if ( that.s.idSrc === null ) {
						setData.DT_RowId = json.id;
					}
					else {
						setFn = dt.oApi._fnSetObjectDataFn( that.s.idSrc );
						setFn( setData, json.id );
					}

					that._callbackFire( 'onPreCreate', [json, setData] );
					dt.fnAddData( setData );
					that._callbackFire( ['onCreate', 'onPostCreate'], [json, setData] );
				}
				else if ( that.s.action === "edit" ) {
					// Row was updated, so tell the DT
					that._callbackFire( 'onPreEdit', [json, setData] );
					dt.fnUpdate( setData, that.s.editRow );
					that._callbackFire( ['onEdit', 'onPostEdit'], [json, setData] );
				}
				else if ( that.s.action === "remove" ) {
					// Remove the rows given and then redraw the table
					that._callbackFire( 'onPreRemove', [json] );
					for ( i=0, iLen=that.s.removeRows.length ; i<iLen ; i++ ) {
						dt.fnDeleteRow( that.s.removeRows[i], false );
					}
					dt.fnDraw();
					that._callbackFire( ['onRemove', 'onPostRemove'], [json] );
				}

				// Submission complete
				that.s.action = null;

				// Hide the display
				if ( hide === undefined || hide ) {
					that._display( 'close', function () {
						that._clearDynamicInfo();
					}, 'submit' );
				}

				// All done - fire off the callbacks and events
				if ( successCallback ) {
					successCallback.call( that, json );
				}
				that._callbackFire( ['onSubmitSuccess', 'onSubmitComplete'], [json, setData] );
			}

			that._processing( false );
		},
		function (xhr, err, thrown) {
			that._callbackFire( 'onPostSubmit', [xhr, err, thrown, data] );

			that.error( that.i18n.error.system );
			that._processing( false );

			if ( errorCallback ) {
				errorCallback.call( that, xhr, err, thrown );
			}

			that._callbackFire( ['onSubmitError', 'onSubmitComplete'], [xhr, err, thrown, data] );
		}
	); // /ajax submit
};


/**
 * Get the unique ID for a row from the DOM or a JSON property
 *  @param {node} row Row to get the id of
 *  @param {function} [getFn] Get function - internal use only
 *  @param {*} [data] Data - internal use only
 *  @private
 */
Editor.prototype._rowId = function ( row, getFn, data )
{
	var table = $(this.s.domTable).dataTable();
	data = table._(row)[0];
	getFn = table.oApi._fnGetObjectDataFn( this.s.idSrc );

	if ( $.isArray( row ) ) {
		var out = [];
		for ( var i=0, ien=row.length ; i<ien ; i++ ) {
			out.push( this._rowId( row[i], getFn, data ) );
		}
		return out;
	}

	// Use the row's DOM id
	if ( this.s.idSrc === null ) {
		return row.id;
	}

	// Get the data from the source
	return getFn( data );
};


/*
 * Defaults
 */


// Dev node - although this file is held in the models directory (because it
// really is a model, it is assigned to Editor.defaults for easy
// and sensible access to set the defaults for Editor.

/**
 * Initialisation options that can be given to Editor at initialisation time.
 *  @namespace
 */
Editor.defaults = {
	/**
	 * jQuery selector that can be used to identify the table you wish to apply
	 * this editor instance to. We can't pass in the DataTables instance itself,
	 * as often you will wish to initialise the form controller first, so by
	 * providing the selector, Editor can access the DataTable when it needs
	 * to in future.
	 *  @type string
	 *  @default <i>Empty string</i>
	 *
	 *  @example
	 *    $(document).ready(function() {
	 *      var editor = new $.fn.Editor( {
	 *        "ajaxUrl": "php/index.php",
	 *        "domTable": "#example"
	 *      } );
	 *    } );
	 */
	"domTable": null,

	/**
	 * The URL, or collection of URLs when using a REST interface, which will accept 
	 * the data for the create, edit and remove functions. The target script / program
	 * must accept data in the format defined by Editor and return the expected JSON as
	 * required by Editor. When given as an object, the `create`, `edit` and `remove`
	 * properties should be defined, each being the URL to send the data to for that
	 * action. When used as an object, the string `_id_` will be replaced for the edit
	 * and remove actions, allowing a URL to be dynamically created for those actions.
	 *  @type string|object
	 *  @default <i>Empty string</i>
	 *
	 *  @example
	 *    // As a string - all actions are submitted to this URI as POST requests
	 *    $(document).ready(function() {
	 *      var editor = new $.fn.Editor( {
	 *        "ajaxUrl": "php/index.php",
	 *        "domTable": "#example"
	 *      } );
	 *    } );
	 *
	 *  @example
	 *    // As a string, using HTTP GET
	 *    $(document).ready(function() {
	 *      var editor = new $.fn.Editor( {
	 *        "ajaxUrl": "GET php/index.php",
	 *        "domTable": "#example"
	 *      } );
	 *    } );
	 *
	 *  @example
	 *    // As an object - each action is submitted to a different URI as POST requests
	 *    $(document).ready(function() {
	 *      var editor = new $.fn.Editor( {
	 *        "ajaxUrl": {
	 *          "create": "/rest/user/create",
	 *          "edit": "/rest/user/_id_/edit",
	 *          "remove": "/rest/user/_id_/delete"
	 *        },
	 *        "domTable": "#example"
	 *      } );
	 *    } );
	 *
	 *  @example
	 *    // As an object - with different HTTP methods for each action
	 *    $(document).ready(function() {
	 *      var editor = new $.fn.Editor( {
	 *        "ajaxUrl": {
	 *          "create": "POST /rest/user/create",
	 *          "edit": "PUT /rest/user/edit/_id_",
	 *          "remove": "DELETE /rest/user/delete"
	 *        },
	 *        "domTable": "#example"
	 *      } );
	 *    } );
	 */
	"ajaxUrl": "",

	/**
	 * Fields to initialise the form with - see {@link Editor.models.field} for
	 * a full list of the options available to each field. Note that if fields are not 
	 * added to the form at initialisation time using this option, they can be added using
	 * the {@link Editor#add} API method.
	 *  @type array
	 *  @default []
	 *
	 *  @example
	 *    $(document).ready(function() {
	 *      var editor = new $.fn.Editor( {
	 *        "ajaxUrl": "php/index.php",
	 *        "domTable": "#example",
	 *        "fields": [ {
	 *            "label": "User name:",
	 *            "name": "username"
	 *          }
	 *          // More fields would typically be added here!
	 *        } ]
	 *      } );
	 *    } );
	 */
	"fields": [],


	/**
	 * A unique identifier for the database table that the Editor instance is
	 * intended to control. Editor itself does not use these parameter for any
	 * actions, but it will include it in the data submitted to the server. This
	 * means that a single Ajax script could control multiple tables, switching
	 * between each table as required by checking for this variable.
	 *  @type string
	 *  @default <i>Empty string</i>
	 *
	 *  @example
	 *    $(document).ready(function() {
	 *      var editor = new $.fn.Editor( {
	 *        "ajaxUrl": "php/index.php",
	 *        "domTable": "#example",
	 *        "dbTable": "users"
	 *      } );
	 *    } );
	 */
	"dbTable": "",

	/**
	 * The display controller for the form. The form itself is just a collection of
	 * DOM elements which require a display container. This display controller allows
	 * the visual appearance of the form to be significantly altered without major
	 * alterations to the Editor code. There are two display controllers built into
	 * Editor *lightbox* and *envelope*. The value of this property will
	 * be used to access the display controller defined in {@link Editor.display}
	 * for the given name. Additional display controllers can be added by adding objects
	 * to that object, through extending the displayController model:
	 * {@link Editor.models.displayController}.
	 *  @type string
	 *  @default lightbox
	 *
	 *  @example
	 *    $(document).ready(function() {
	 *      var editor = new $.fn.Editor( {
	 *        "ajaxUrl": "php/index.php",
	 *        "domTable": "#example",
	 *        "display": 'envelope'
	 *      } );
	 *    } );
	 */
	"display": 'lightbox',

	/**
	 * The function that is used to submit data to the server. This is provided as
	 * an initialisation parameter to allow custom Ajax calls, or even to get / set
	 * data that is not requested by Ajax, but possibly by some other method (for
	 * example localStorage). The function takes five parameters and no return is
	 * expected.
	 *  @type function
	 *  @param {string} method The HTTP method to use for the AJAX request
	 *  @param {string} url The URL (from <i>ajaxUrl</i>) to submit the data to
	 *  @param {object} data The data submitted to the server by Editor
	 *  @param {function} successCallback Callback function on data retrieval success
	 *  @param {function} errorCallback Callback function on data retrieval error
	 *  @default $.ajax() using POST
	 *
	 *  @example
	 *    // Using GET rather than POST
	 *    $(document).ready(function() {
	 *      var editor = new $.fn.Editor( {
	 *        "ajaxUrl": "php/index.php",
	 *        "domTable": "#example",
	 *        "ajax": function ( method, url, data, successCallback, errorCallback ) {
	 *          $.ajax( {
	 *            "type": method,
	 *            "url":  url,
	 *            "data": data,
	 *            "dataType": "json",
	 *            "success": function (json) {
	 *              successCallback( json );
	 *            },
	 *            "error": function (xhr, error, thrown) {
	 *              errorCallback( xhr, error, thrown );
	 *            }
	 *          } );
	 *        }
	 *      } );
	 *    } );
	 */
	"ajax": function ( method, url, data, successCallback, errorCallback ) {
		$.ajax( {
			"type": method,
			"url":  url,
			"data": data,
			"dataType": "json",
			"success": function (json) {
				successCallback( json );
			},
			"error": function (xhr, error, thrown) {
				errorCallback( xhr, error, thrown );
			}
		} );
	},

	/**
	 * JSON property from which to read / write the row's ID property (i.e. its
	 * unique column index that identifies the row to the database). By default
	 * (`null`) Editor will use the `DT_RowId` property from the data source
	 * object (DataTable's magic property to set the DOM id for the row).
	 *
	 * If you want to read a parameter from the data source object instead of
	 * using `DT_RowId`, set this option to the property name to use.
	 *
	 * Like other data source options the `srcId` option can be given in dotted
	 * object notation to read nested objects.
	 *  @type null|string
	 *  @default null
	 *
	 *  @example
	 *    // Using a data source such as:
	 *    // { "id":12, "browser":"Chrome", ... }
	 *    $(document).ready(function() {
	 *      var editor = new $.fn.Editor( {
	 *        "ajaxUrl": "php/index.php",
	 *        "domTable": "#example",
	 *        "idSrc": "id"
	 *      } );
	 *    } );
	 */
	"idSrc": null,

	/**
	 * Events / callbacks - event handlers can be assigned as an individual function
	 * during initialisation using the parameters in this name space. The names, and
	 * the parameters passed to each callback match their event equivalent in the
	 * {@link Editor} object.
	 *  @namespace
	 */
	"events": {
		/**
		 * Processing event, fired when Editor submits data to the server for processing.
		 * This can be used to provide your own processing indicator if your UI framework
		 * already has one.
		 *  @type function
		 *  @param {boolean} processing Flag for if the processing is running (true) or
		 *    not (false).
		 */
		"onProcessing": null,
		
		/**
		 * Form displayed event, fired when the form is made available in the DOM. This
		 * can be useful for fields that require height and width calculations to be
		 * performed since the element is not available in the document until the
		 * form is displayed.
		 *  @type function
		 */
		"onOpen": null,
		
		/**
		 * Before a form is displayed, this event is fired. It allows the open action to be
		 * cancelled by returning false from the function.
		 *  @type function
		 */
		"onPreOpen": null,
		
		/**
		 * Form hidden event, fired when the form is removed from the document. The 
		 * of the inverse onOpen event.
		 *  @type function
		 */
		"onClose": null,
		
		/**
		 * Before a form is closed, this event is fired. It allows the close action to be
		 * cancelled by returning false from the function. This can be useful for confirming
		 * that the user actually wants to close the display (if they have unsaved changes
		 * for example).
		 *  @type function
		 */
		"onPreClose": null,
		
		/**
		 * Pre-submit event for the form, fired just before the data is submitted to
		 * the server. This event allows you to modify the data that will be submitted
		 * to the server. Note that this event runs after the 'formatdata' callback
		 * function of the {@link Editor#submit} API method.
		 *  @type function
		 *  @param {object} data The data object that will be submitted to the server
		 */
		"onPreSubmit": null,
		
		/**
		 * Post-submit event for the form, fired immediately after the data has been
		 * loaded by the Ajax call, allowing modification or any other interception
		 * of the data returned form the server.
		 *  @type function
		 *  @param {object} json The JSON object returned from the server
		 *  @param {object} data The data object that was be submitted to the server
		 */
		"onPostSubmit": null,
		
		/**
		 * Submission complete event, fired when data has been submitted to the server and
		 * after any of the return handling code has been run (updating the DataTable
		 * for example). Note that unlike onSubmitSuccess and onSubmitError, onSubmitComplete
		 * will be fired for both a successful submission and an error. Additionally this
		 * event will be fired after onSubmitSuccess or onSubmitError.
		 *  @type function
		 *  @param {object} json The JSON object returned from the server
		 *  @param {object} data The data that was used to update the DataTable
		 */
		"onSubmitComplete": null,
		
		/**
		 * Submission complete and successful event, fired when data has been successfully 
		 * submitted to the server and all actions required by the returned data (inserting
		 * or updating a row) have been completed.
		 *  @type function
		 *  @param {object} json The JSON object returned from the server
		 *  @param {object} data The data that was used to update the DataTable
		 */
		"onSubmitSuccess": null,
		
		/**
		 * Submission complete, but in error event, fired when data has been submitted to 
		 * the server but an error occurred on the server (typically a JSON formatting error)
		 *  @type function
		 *  @param {object} xhr The Ajax object
		 *  @param {string} err The error message from jQuery
		 *  @param {object} thrown The exception thrown by jQuery
		 *  @param {object} data The data that was used to update the DataTable
		 */
		
		"onSubmitError": null,
		
		/**
		 * Create method activated event, fired when the create API method has been called,
		 * just prior to the form being shown. Useful for manipulating the form specifically
		 * for the create state.
		 *  @type function
		 */
		"onInitCreate": null,
		
		/**
		 * Pre-create new row event, fired just before DataTables calls the fnAddData method
		 * to add new data to the DataTable, allowing modification of the data that will be
		 * used to insert into the table.
		 *  @type function
		 *  @param {object} json The JSON object returned from the server
		 *  @param {object} data The data that will be used to update the DataTable
		 */
		"onPreCreate": null,
		
		/**
		 * Create new row event, fired when a new row has been created in the DataTable by
		 * a form submission. This is called just after the fnAddData call to the DataTable.
		 *  @type function
		 *  @param {object} json The JSON object returned from the server
		 *  @param {object} data The data that was used to update the DataTable
		 */
		"onCreate": null,
		
		/**
		 * As per the onCreate event - included for naming consistency.
		 *  @type function
		 *  @param {object} json The JSON object returned from the server
		 *  @param {object} data The data that was used to update the DataTable
		 */
		"onPostCreate": null,
		
		/**
		 * Edit method activated event, fired when the edit API method has been called,
		 * just prior to the form being shown. Useful for manipulating the form specifically
		 * for the edit state.
		 *  @type function
		 */
		"onInitEdit": null,
		
		/**
		 * Pre-edit row event, fired just before DataTables calls the fnUpdate method
		 * to edit data in a DataTables row, allowing modification of the data that will be
		 * used to update the table.
		 *  @type function
		 *  @param {object} json The JSON object returned from the server
		 *  @param {object} data The data that will be used to update the DataTable
		 */
		"onPreEdit": null,
		
		/**
		 * Edit row event, fired when a row has been edited in the DataTable by a form
		 * submission. This is called just after the fnUpdate call to the DataTable.
		 *  @type function
		 *  @param {object} json The JSON object returned from the server
		 *  @param {object} data The data that was used to update the DataTable
		 */
		"onEdit": null,
		
		/**
		 * As per the onEdit event - included for naming consistency.
		 *  @type function
		 *  @param {object} json The JSON object returned from the server
		 *  @param {object} data The data that was used to update the DataTable
		 */
		"onPostEdit": null,
		
		/**
		 * Remove method activated event, fired when the remove API method has been called,
		 * just prior to the form being shown. Useful for manipulating the form specifically
		 * for the remove state.
		 *  @type function
		 */
		"onInitRemove": null,
		
		/**
		 * Pre-remove row event, fired just before DataTables calls the fnDeleteRow method
		 * to delete a DataTables row.
		 *  @type function
		 *  @param {object} json The JSON object returned from the server
		 */
		"onPreRemove": null,
		
		/**
		 * Row removed event, fired when a row has been removed in the DataTable by a form
		 * submission. This is called just after the fnDeleteRow call to the DataTable.
		 *  @type function
		 *  @param {object} json The JSON object returned from the server
		 */
		"onRemove": null,
		
		/**
		 * As per the onRemove event - included for naming consistency.
		 *  @type function
		 *  @param {object} json The JSON object returned from the server
		 */
		"onPostRemove": null,
		
		/**
		 * Set data event, fired when the data is gathered from the form to be used
		 * to update the DataTable. This is a "global" version of onPreCreate, onPreEdit
		 * and onPreRemove and can be used to manipulate the data that will be added
		 * to the DataTable for all three actions
		 *  @type function
		 *  @param {object} json The JSON object returned from the server
		 *  @param {object} data The data that will be used to update the DataTable
		 *  @param {string} action The action being performed by the form - 'create',
		 *    'edit' or 'remove'.
		 */
		"onSetData": null,
		
		/**
		 * Initialisation of the Editor instance has been completed.
		 *  @type function
		 */
		"onInitComplete": null
	},

	/**
	 * Internationalisation options for Editor. All client-side strings that the
	 * end user can see in the interface presented by Editor can be modified here.
	 *
	 * You may also wish to refer to the <a href="http://datatables.net/usage/i18n">
	 * DataTables internationalisation options</a> to provide a fully language 
	 * customised table interface.
	 *  @namespace
	 *
	 *  @example
	 *    // Set the 'create' button text. All other strings used are the
	 *    // default values.
	 *    var editor = new $.fn.Editor( {
	 *      "ajaxUrl": "data/source",
	 *      "domTable": "#example",
	 *      "i18n": {
	 *        "create": {
	 *          "button": "New user"
	 *        }
	 *      }
	 *    } );
	 *
	 *  @example
	 *    // Set the submit text for all three actions
	 *    var editor = new $.fn.Editor( {
	 *      "ajaxUrl": "data/source",
	 *      "domTable": "#example",
	 *      "i18n": {
	 *        "create": {
	 *          "submit": "Create new user"
	 *        },
	 *        "edit": {
	 *          "submit": "Update user"
	 *        },
	 *        "remove": {
	 *          "submit": "Remove user"
	 *        }
	 *      }
	 *    } );
	 */
	"i18n": {
		/**
		 * Strings used when working with the Editor 'create' action (creating new
		 * records).
		 *  @namespace
		 */
		"create": {
			/**
			 * TableTools button text
			 *  @type string
			 *  @default New
			 */
			"button": "חדש",

			/**
			 * Display container title (when showing the editor display)
			 *  @type string
			 *  @default Create new entry
			 */
			"title":  "יצירת שורה חדשה",

			/**
			 * Submit button text
			 *  @type string
			 *  @default Create
			 */
			"submit": "אישור"
		},

		/**
		 * Strings used when working with the Editor 'edit' action (editing existing
		 * records).
		 *  @namespace
		 */
		"edit": {
			/**
			 * TableTools button text
			 *  @type string
			 *  @default Edit
			 */
			"button": "Edit",

			/**
			 * Display container title (when showing the editor display)
			 *  @type string
			 *  @default Edit entry
			 */
			"title":  "Edit entry",

			/**
			 * Submit button text
			 *  @type string
			 *  @default Update
			 */
			"submit": "Update"
		},

		/**
		 * Strings used when working with the Editor 'delete' action (deleting 
		 * existing records).
		 *  @namespace
		 */
		"remove": {
			/**
			 * TableTools button text
			 *  @type string
			 *  @default Delete
			 */
			"button": "Delete",

			/**
			 * Display container title (when showing the editor display)
			 *  @type string
			 *  @default Delete
			 */
			"title":  "Delete",

			/**
			 * Submit button text
			 *  @type string
			 *  @default Delete
			 */
			"submit": "Delete",

			/**
			 * Deletion confirmation message.
			 *
			 * As Editor has the ability to delete either a single or multiple rows
			 * at a time, this option can be given as either a string (which will be
			 * used regardless of how many records are selected) or as an object 
			 * where the property "_" will be used (with %d substituted for the number
			 * of records to be deleted) as the delete message, unless there is a
			 * key with the number of records to be deleted. This allows Editor
			 * to consider the different pluralisation characteristics of different
			 * languages.
			 *  @type object|string
			 *  @default Are you sure you wish to delete %d rows?
			 *
			 *  @example
			 *    // String - no plural consideration
			 *    var editor = new $.fn.Editor( {
			 *      "ajaxUrl": "data/source",
			 *      "domTable": "#example",
			 *      "i18n": {
			 *        "remove": {
			 *          "confirm": "Are you sure you wish to delete %s record(s)?"
			 *        }
			 *      }
			 *    } );
			 *
			 *  @example
			 *    // Basic 1 (singular) or _ (plural)
			 *    var editor = new $.fn.Editor( {
			 *      "ajaxUrl": "data/source",
			 *      "domTable": "#example",
			 *      "i18n": {
			 *        "remove": {
			 *          "confirm": {
			 *            "_": "Confirm deletion of %s records.",
			 *            "1": "Confirm deletion of record."
			 *        }
			 *      }
			 *    } );
			 *
			 *  @example
			 *    // Singular, dual and plural
			 *    var editor = new $.fn.Editor( {
			 *      "ajaxUrl": "data/source",
			 *      "domTable": "#example",
			 *      "i18n": {
			 *        "remove": {
			 *          "confirm": {
			 *            "_": "Confirm deletion of %s records.",
			 *            "1": "Confirm deletion of record.",
			 *            "2": "Confirm deletion of both record."
			 *        }
			 *      }
			 *    } );
			 *        
			 */
			"confirm": {
				"_": "Are you sure you wish to delete %d rows?",
				"1": "Are you sure you wish to delete 1 row?"
			}
		},

		/**
		 * Strings used for error conditions.
		 *  @namespace
		 */
		"error": {
			/**
			 * Generic server error message
			 *  @type string
			 *  @default An error has occurred - Please contact the system administrator
			 */
			"system": "An error has occurred - Please contact the system administrator"
		}
	}
};


/*
 * Extensions
 */


/**
 * Class names that are used by Editor for its various display components.
 * A copy of this object is taken when an Editor instance is initialised, thus
 * allowing different classes to be used in different instances if required.
 * Class name changes can be useful for easy integration with CSS frameworks,
 * for example Twitter Bootstrap.
 *  @namespace
 */
Editor.classes = {
	/**
	 * Applied to the base DIV element that contains all other Editor elements
	 */
	"wrapper": "DTE",

	/**
	 * Processing classes
	 *  @namespace
	 */
	"processing": {
		/**
		 * Processing indicator element
		 */
		"indicator": "DTE_Processing_Indicator",

		/**
		 * Added to the base element ("wrapper") when the form is "processing"
		 */
		"active": "DTE_Processing"
	},

	/**
	 * Display header classes
	 *  @namespace
	 */
	"header": {
		/**
		 * Container for the header elements
		 */
		"wrapper": "DTE_Header",

		/**
		 * Liner for the header content
		 */
		"content": "DTE_Header_Content"
	},

	/**
	 * Display body classes
	 *  @namespace
	 */
	"body": {
		/**
		 * Container for the body elements
		 */
		"wrapper": "DTE_Body",

		/**
		 * Liner for the body content
		 */
		"content": "DTE_Body_Content"
	},

	/**
	 * Display footer classes
	 *  @namespace
	 */
	"footer": {
		/**
		 * Container for the footer elements
		 */
		"wrapper": "DTE_Footer",
		
		/**
		 * Liner for the footer content
		 */
		"content": "DTE_Footer_Content"
	},

	/**
	 * Form classes
	 *  @namespace
	 */
	"form": {
		/**
		 * Container for the form elements
		 */
		"wrapper": "DTE_Form",
		
		/**
		 * Liner for the form content
		 */
		"content": "DTE_Form_Content",
		
		/**
		 * Applied to the <form> tag
		 */
		"tag":     "",
		
		/**
		 * Global form information
		 */
		"info":    "DTE_Form_Info",
		
		/**
		 * Clearing element to ensure the layout is correct after floating elements.
		 */
		"clear":   "DTE_Form_Clear",
		
		/**
		 * Global error imformation
		 */
		"error":   "DTE_Form_Error",
		
		/**
		 * Buttons container
		 */
		"buttons": "DTE_Form_Buttons"
	},

	/**
	 * Field classes
	 *  @namespace
	 */
	"field": {
		/**
		 * Container for each field
		 */
		"wrapper":     "DTE_Field",
		
		/**
		 * Class prefix for the field type - field type is added to the end allowing
		 * styling based on field type.
		 */
		"typePrefix":  "DTE_Field_Type_",
		
		/**
		 * Class prefix for the field name - field name is added to the end allowing
		 * styling based on field name.
		 */
		"namePrefix":  "DTE_Field_Name_",
		
		/**
		 * Field label
		 */
		"label":       "DTE_Label",
		
		/**
		 * Field input container
		 */
		"input":       "DTE_Field_Input",
		
		/**
		 * Field error state (added to the field.wrapper element when in error state
		 */
		"error":       "DTE_Field_StateError",
		
		/**
		 * Label information text
		 */
		"msg-label":   "DTE_Label_Info",
		
		/**
		 * Error information text
		 */
		"msg-error":   "DTE_Field_Error",
		
		/**
		 * Live messaging (API) information text
		 */
		"msg-message": "DTE_Field_Message",
		
		/**
		 * General information text
		 */
		"msg-info":    "DTE_Field_Info"
	},

	/**
	 * Action classes - these are added to the Editor base element ("wrapper")
	 * and allows styling based on the type of form view that is being employed.
	 *  @namespace
	 */
	"actions": {
		/**
		 * Editor is in 'create' state
		 */
		"create": "DTE_Action_Create",
		
		/**
		 * Editor is in 'edit' state
		 */
		"edit":   "DTE_Action_Edit",

		/**
		 * Editor is in 'remove' state
		 */
		"remove": "DTE_Action_Remove"
	}
};



/*
 * Add helpful TableTool buttons to make life easier
 *
 * Note that the values that require a string to make any sense (the button text
 * for example) are set by Editor when Editor is initialised through the i18n
 * options.
 */
if ( window.TableTools ) {
	var ttButtons = window.TableTools.BUTTONS;

	ttButtons.editor_create = $.extend( true, ttButtons.text, {
		"sButtonText": null,
		"editor":      null,
		"formTitle":   null,
		"formButtons": [
			{ "label": null, "fn": function (e) { this.submit(); } }
		],
		"fnClick": function( nButton, oConfig ) {
			oConfig.editor.create( oConfig.formTitle, oConfig.formButtons );
		}
	} );


	ttButtons.editor_edit = $.extend( true, ttButtons.select_single, {
		"sButtonText": null,
		"editor":      null,
		"formTitle":   null,
		"formButtons": [
			{ "label": null, "fn": function (e) { this.submit(); } }
		],
		"fnClick": function( nButton, oConfig ) {
			var selected = this.fnGetSelected();
			if ( selected.length !== 1 ) {
				return;
			}
			
			oConfig.editor.edit( selected[0], oConfig.formTitle, oConfig.formButtons );
		}
	} );


	ttButtons.editor_remove = $.extend( true, ttButtons.select, {
		"sButtonText": null,
		"editor":      null,
		"formTitle":   null,
		"formButtons": [
			{
				"label": null,
				"fn": function (e) {
					// Executed in the Form instance's scope
					var that = this;
					this.submit( function ( json ) {
						var tt = window.TableTools.fnGetInstance( $(that.s.domTable)[0] );
						tt.fnSelectNone();
					} );
				}
			}
		],
		"question": null,
		"fnClick": function( nButton, oConfig ) {
			var rows = this.fnGetSelected();
			if ( rows.length === 0 ) {
				return;
			}

			oConfig.editor.message( typeof oConfig.question === 'function' ? oConfig.question(rows.length) : oConfig.question );
			oConfig.editor.remove( rows, oConfig.formTitle, oConfig.formButtons );
		}
	} );
}


/**
 * Field types array - this can be used to add field types or modify the pre-defined options.
 * By default Editor provides the following field tables (these can be readily modified,
 * extended or added to using field type plug-ins if you wish to create a custom input
 * control):
 *
 *  * `hidden` - A hidden field which cannot be seen or modified by the user
 *  * `readonly` - Input where the value cannot be modified
 *  * `text` - Text input
 *  * `password` - Text input but bulleted out text
 *  * `textarea` - Textarea input for larger text inputs
 *  * `select` - Single select list
 *  * `checkbox` - Checkboxs
 *  * `radio` - Radio buttons
 *  * `date` - Date input control (requires jQuery UI's datepicker)
 *
 *  @namespace
 */
Editor.fieldTypes = {};


(function() {

var fieldTypes = Editor.fieldTypes;

// A number of the fields in this file use the same get, set, enable and disable
// methods (specifically the text based controls), so in order to reduce the code
// size, we just define them once here in our own local base model for the field
// types.
var baseFieldType = $.extend( true, {}, Editor.models.fieldType, {
	"get": function ( conf ) {
		return conf._input.val();
	},

	"set": function ( conf, val ) {
		conf._input.val( val );
	},

	"enable": function ( conf ) {
		conf._input.prop( 'disabled', false );
	},

	"disable": function ( conf ) {
		conf._input.prop( 'disabled', true );
	}
} );

// Method to provide a consistent interface for the input options for the list
// controls that the build in fields offer (select, radio and checkbox). When
// an object is given for an option we expect at least the 'label' parameter,
// val can optionally be set. If an object is not given, then what is given is
// used for both value and label.
function labelValPair ( opt ) {
	if ( $.isPlainObject( opt ) ) {
		return {
			"val": opt.value!==undefined ? opt.value : opt.label,
			"label": opt.label
		};
	}

	return {
		"val": opt,
		"label": opt
	};
}



fieldTypes.hidden = $.extend( true, {}, baseFieldType, {
	"create": function ( conf ) {
		conf._val = conf.value;
		return null;
	},

	"get": function ( conf ) {
		return conf._val;
	},

	"set": function ( conf, val ) {
		conf._val = val;
	}
} );


fieldTypes.readonly = $.extend( true, {}, baseFieldType, {
	"create": function ( conf ) {
		conf._input = $('<input/>').attr( $.extend( {
			id: conf.id,
			type: 'text',
			readonly: 'readonly'
		}, conf.attr || {} ) );

		return conf._input[0];
	}
} );


fieldTypes.text = $.extend( true, {}, baseFieldType, {
	"create": function ( conf ) {
		conf._input = $('<input/>').attr( $.extend( {
			id: conf.id,
			type: 'text'
		}, conf.attr || {} ) );

		return conf._input[0];
	}
} );


fieldTypes.password = $.extend( true, {}, baseFieldType, {
	"create": function ( conf ) {
		conf._input = $('<input/>').attr( $.extend( {
			id: conf.id,
			type: 'password'
		}, conf.attr || {} ) );

		return conf._input[0];
	}
} );

fieldTypes.textarea = $.extend( true, {}, baseFieldType, {
	"create": function ( conf ) {
		conf._input = $('<textarea/>').attr( $.extend( {
			id: conf.id
		}, conf.attr || {} ) );
		return conf._input[0];
	}
} );


fieldTypes.select = $.extend( true, {}, baseFieldType, {
	// Locally "private" function that can be reused for the create and update methods
	"_addOptions": function ( conf, opts ) {
		var elOpts = conf._input[0].options;

		elOpts.length = 0;

		if ( opts ) {
			for ( var i=0, iLen=opts.length ; i<iLen ; i++ ) {
				var pair = labelValPair( opts[i] );

				elOpts[i] = new Option(pair.label, pair.val);
			}
		}
	},

	"create": function ( conf ) {
		conf._input = $('<select/>').attr( $.extend( {
			id: conf.id
		}, conf.attr || {} ) );

		fieldTypes.select._addOptions( conf, conf.ipOpts );

		return conf._input[0];
	},

	"update": function ( conf, ipOpts ) {
		// Get the current value
		var currVal = $(conf._input).val();

		fieldTypes.select._addOptions( conf, ipOpts );

		// Set the old value, if it exists
		$(conf._input).val( currVal );
	}
} );


fieldTypes.checkbox = $.extend( true, {}, baseFieldType, {
	// Locally "private" function that can be reused for the create and update methods
	"_addOptions": function ( conf, opts ) {
		var val, label;
		var elOpts = conf._input[0].options;
		var jqInput = conf._input.empty();

		if ( opts ) {
			for ( var i=0, iLen=opts.length ; i<iLen ; i++ ) {
				var pair = labelValPair( opts[i] );

				jqInput.append(
					'<div>'+
						'<input id="'+conf.id+'_'+i+'" type="checkbox" value="'+pair.val+'" />'+
						'<label for="'+conf.id+'_'+i+'">'+pair.label+'</label>'+
					'</div>'
				);
			}
		}
	},


	"create": function ( conf ) {
		conf._input = $('<div />');
		fieldTypes.checkbox._addOptions( conf, conf.ipOpts );

		return conf._input[0];
	},

	"get": function ( conf ) {
		var out = [];
		conf._input.find('input:checked').each( function () {
			out.push( this.value );
		} );
		return conf.separator ? out.join(conf.separator) : out;
	},

	"set": function ( conf, val ) {
		var jqInputs = conf._input.find('input');
		if ( ! $.isArray(val) && typeof val === 'string' ) {
			val = val.split( conf.separator || '|' );
		}
		else if ( ! $.isArray(val) ) {
			val = [ val ];
		}

		var i, len=val.length, found;

		jqInputs.each( function () {
			found = false;

			for ( i=0 ; i<len ; i++ ) {
				if ( this.value == val[i] ) {
					found = true;
					break;
				}
			}

			this.checked = found;
		} );
	},

	"enable": function ( conf ) {
		conf._input.find('input').prop('disabled', false);
	},

	"disable": function ( conf ) {
		conf._input.find('input').prop('disabled', true);
	},

	"update": function ( conf, ipOpts ) {
		// Get the current value
		var currVal = fieldTypes.checkbox.get( conf );

		fieldTypes.checkbox._addOptions( conf, ipOpts );

		// Set the old value, if it exists
		fieldTypes.checkbox.get( conf, currVal );
	}
} );


fieldTypes.radio = $.extend( true, {}, baseFieldType, {
	// Locally "private" function that can be reused for the create and update methods
	"_addOptions": function ( conf, opts ) {
		var val, label;
		var elOpts = conf._input[0].options;
		var jqInput = conf._input.empty();

		if ( opts ) {
			for ( var i=0, iLen=opts.length ; i<iLen ; i++ ) {
				var pair = labelValPair( opts[i] );

				jqInput.append(
					'<div>'+
						'<input id="'+conf.id+'_'+i+'" type="radio" name="'+conf.name+'" />'+
						'<label for="'+conf.id+'_'+i+'">'+pair.label+'</label>'+
					'</div>'
				);
				$('input:last', jqInput).attr('value', pair.val);
			}
		}
	},


	"create": function ( conf ) {
		conf._input = $('<div />');
		fieldTypes.radio._addOptions( conf, conf.ipOpts );

		// this is ugly, but IE6/7 has a problem with radio elements that are created
		// and checked before being added to the DOM! Basically it doesn't check them. As
		// such we use the _preChecked property to set cache the checked button and then
		// check it again when the display is shown. This has no effect on other browsers
		// other than to cook a few clock cycles.
		this.on('onOpen', function () {
			conf._input.find('input').each( function () {
				if ( this._preChecked ) {
					this.checked = true;
				}
			} );
		} );

		return conf._input[0];
	},

	"get": function ( conf ) {
		return conf._input.find('input:checked').val();
	},

	"set": function ( conf, val ) {
		var that  = this;

		conf._input.find('input').each( function () {
			this._preChecked = false;
			
			if ( this.value == val ) {
				this.checked = true;
				this._preChecked = true;
			}
		} );
	},

	"enable": function ( conf ) {
		conf._input.find('input').prop('disabled', false);
	},

	"disable": function ( conf ) {
		conf._input.find('input').prop('disabled', true);
	},

	"update": function ( conf, ipOpts ) {
		// Get the current value
		var currVal = fieldTypes.radio.get( conf );

		fieldTypes.radio._addOptions( conf, ipOpts );

		// Set the old value, if it exists
		fieldTypes.radio.get( conf, currVal );
	}
} );


fieldTypes.date = $.extend( true, {}, baseFieldType, {
	/*
	 * Requires jQuery UI
	 */
	"create": function ( conf ) {
		conf._input = $('<input />').attr( $.extend( {
			id: conf.id
		}, conf.attr || {} ) );

		if ( ! conf.dateFormat ) {
			conf.dateFormat = $.datepicker.RFC_2822;
		}

		if ( ! conf.dateImage ) {
			conf.dateImage = "../media/images/calender.png";
		}

		$(this).bind('onInitComplete', function () {
			$( conf._input ).datepicker({
				showOn: "both",
				dateFormat: conf.dateFormat,
				buttonImage: conf.dateImage,
				buttonImageOnly: true
			});
			$('#ui-datepicker-div').css('display','none');
		} );

		return conf._input[0];
	},

	// use default get method

	"set": function ( conf, val ) {
		conf._input.datepicker( "setDate" , val );
	},

	"enable": function ( conf ) {
		conf._input.datepicker( "enable" );
	},

	"disable": function ( conf ) {
		conf._input.datepicker( "disable" );
	}
} );


}());



/**
 * Name of this class
 *  @constant CLASS
 *  @type     String
 *  @default  Editor
 */
Editor.prototype.CLASS = "Editor";


/**
 * DataTables Editor version
 *  @constant  Editor.VERSION
 *  @type      String
 *  @default   See code
 *  @static
 */
Editor.VERSION = "1.2.3";
Editor.prototype.VERSION = Editor.VERSION;


// Event documentation for JSDoc
/**
 * Processing event, fired when Editor submits data to the server for processing.
 * This can be used to provide your own processing indicator if your UI framework
 * already has one.
 *  @name Editor#onProcessing
 *  @event
 *  @param {event} e jQuery event object
 *  @param {boolean} processing Flag for if the processing is running (true) or
 *    not (false).
 */

/**
 * Form displayed event, fired when the form is made available in the DOM. This
 * can be useful for fields that require height and width calculations to be
 * performed since the element is not available in the document until the
 * form is displayed.
 *  @name Editor#onOpen
 *  @event
 *  @param {event} e jQuery event object
 */

/**
 * Before a form is displayed, this event is fired. It allows the open action to be
 * cancelled by returning false from the function.
 *  @name Editor#onPreOpen
 *  @event
 *  @param {event} e jQuery event object
 */

/**
 * Form hidden event, fired when the form is removed from the document. The
 * of the compliment onOpen event.
 *  @name Editor#onClose
 *  @event
 *  @param {event} e jQuery event object
 */

/**
 * Before a form is closed, this event is fired. It allows the close action to be
 * cancelled by returning false from the function. This can be useful for confirming
 * that the user actually wants to close the display (if they have unsaved changes
 * for example).
 *  @name Editor#onPreClose
 *  @event
 *  @param {event} e jQuery event object
 *  @param {string} trigger Action that caused the close event - can be undefined.
 *    Typically defined by the display controller.
 */

/**
 * Pre-submit event for the form, fired just before the data is submitted to
 * the server. This event allows you to modify the data that will be submitted
 * to the server. Note that this event runs after the 'formatdata' callback
 * function of the {@link Editor#submit} API method.
 *  @name Editor#onPreSubmit
 *  @event
 *  @param {event} e jQuery event object
 *  @param {object} data The data object that will be submitted to the server
 */

/**
 * Post-submit event for the form, fired immediately after the data has been
 * loaded by the Ajax call, allowing modification or any other interception
 * of the data returned form the server.
 *  @name Editor#onPostSubmit
 *  @event
 *  @param {event} e jQuery event object
 *  @param {object} json The JSON object returned from the server
 *  @param {object} data The data object that was be submitted to the server
 */

/**
 * Submission complete event, fired when data has been submitted to the server and
 * after any of the return handling code has been run (updating the DataTable
 * for example). Note that unlike onSubmitSuccess and onSubmitError, onSubmitComplete
 * will be fired for both a successful submission and an error. Additionally this
 * event will be fired after onSubmitSuccess or onSubmitError.
 *  @name Editor#onSubmitComplete
 *  @event
 *  @param {event} e jQuery event object
 *  @param {object} json The JSON object returned from the server
 *  @param {object} data The data that was used to update the DataTable
 */

/**
 * Submission complete and successful event, fired when data has been successfully
 * submitted to the server and all actions required by the returned data (inserting
 * or updating a row) have been completed.
 *  @name Editor#onSubmitSuccess
 *  @event
 *  @param {event} e jQuery event object
 *  @param {object} json The JSON object returned from the server
 *  @param {object} data The data that was used to update the DataTable
 */

/**
 * Submission complete, but in error event, fired when data has been submitted to
 * the server but an error occurred on the server (typically a JSON formatting error)
 *  @name Editor#onSubmitError
 *  @event
 *  @param {event} e jQuery event object
 *  @param {object} xhr The Ajax object
 *  @param {string} err The error message from jQuery
 *  @param {object} thrown The exception thrown by jQuery
 *  @param {object} data The data that was used to update the DataTable
 */

/**
 * Create method activated event, fired when the create API method has been called,
 * just prior to the form being shown. Useful for manipulating the form specifically
 * for the create state.
 *  @name Editor#onInitCreate
 *  @event
 *  @param {event} e jQuery event object
 */

/**
 * Pre-create new row event, fired just before DataTables calls the fnAddData method
 * to add new data to the DataTable, allowing modification of the data that will be
 * used to insert into the table.
 *  @name Editor#onPreCreate
 *  @event
 *  @param {event} e jQuery event object
 *  @param {object} json The JSON object returned from the server
 *  @param {object} data The data that will be used to update the DataTable
 */

/**
 * Create new row event, fired when a new row has been created in the DataTable by
 * a form submission. This is called just after the fnAddData call to the DataTable.
 *  @name Editor#onCreate
 *  @event
 *  @param {event} e jQuery event object
 *  @param {object} json The JSON object returned from the server
 *  @param {object} data The data that was used to update the DataTable
 */

/**
 * As per the onCreate event - included for naming consistency.
 *  @name Editor#onPostCreate
 *  @event
 *  @param {event} e jQuery event object
 *  @param {object} json The JSON object returned from the server
 *  @param {object} data The data that was used to update the DataTable
 */

/**
 * Edit method activated event, fired when the edit API method has been called,
 * just prior to the form being shown. Useful for manipulating the form specifically
 * for the edit state.
 *  @name Editor#onInitEdit
 *  @event
 *  @param {event} e jQuery event object
 */

/**
 * Pre-edit row event, fired just before DataTables calls the fnUpdate method
 * to edit data in a DataTables row, allowing modification of the data that will be
 * used to update the table.
 *  @name Editor#onPreEdit
 *  @event
 *  @param {event} e jQuery event object
 *  @param {object} json The JSON object returned from the server
 *  @param {object} data The data that will be used to update the DataTable
 */

/**
 * Edit row event, fired when a row has been edited in the DataTable by a form
 * submission. This is called just after the fnUpdate call to the DataTable.
 *  @name Editor#onEdit
 *  @event
 *  @param {event} e jQuery event object
 *  @param {object} json The JSON object returned from the server
 *  @param {object} data The data that was used to update the DataTable
 */

/**
 * As per the onEdit event - included for naming consistency.
 *  @name Editor#onPostEdit
 *  @event
 *  @param {event} e jQuery event object
 *  @param {object} json The JSON object returned from the server
 *  @param {object} data The data that was used to update the DataTable
 */

/**
 * Remove method activated event, fired when the remove API method has been called,
 * just prior to the form being shown. Useful for manipulating the form specifically
 * for the remove state.
 *  @name Editor#onInitRemove
 *  @event
 *  @param {event} e jQuery event object
 */

/**
 * Pre-remove row event, fired just before DataTables calls the fnDeleteRow method
 * to delete a DataTables row.
 *  @name Editor#onPreRemove
 *  @event
 *  @param {event} e jQuery event object
 *  @param {object} json The JSON object returned from the server
 */

/**
 * Row removed event, fired when a row has been removed in the DataTable by a form
 * submission. This is called just after the fnDeleteRow call to the DataTable.
 *  @name Editor#onRemove
 *  @event
 *  @param {event} e jQuery event object
 *  @param {object} json The JSON object returned from the server
 */

/**
 * As per the onPostRemove event - included for naming consistency.
 *  @name Editor#onPostRemove
 *  @event
 *  @param {event} e jQuery event object
 *  @param {object} json The JSON object returned from the server
 */

/**
 * Set data event, fired when the data is gathered from the form to be used
 * to update the DataTable. This is a "global" version of onPreCreate, onPreEdit
 * and onPreRemove and can be used to manipulate the data that will be added
 * to the DataTable for all three actions
 *  @name Editor#onPostRemove
 *  @event
 *  @param {event} e jQuery event object
 *  @param {object} json The JSON object returned from the server
 *  @param {object} data The data that will be used to update the DataTable
 *  @param {string} action The action being performed by the form - 'create',
 *    'edit' or 'remove'.
 */

/**
 * Initialisation of the Editor instance has been completed.
 *  @name Editor#onInitComplete
 *  @event
 *  @param {event} e jQuery event object
 */


}(window, document, undefined, jQuery, jQuery.fn.dataTable));

