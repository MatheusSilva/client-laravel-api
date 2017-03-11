"use strict";

class Ajax
{
  static createXHR()
  {
      var xhr = false;

      try {
          xhr = new XMLHttpRequest();
      } catch (trymicrosoft) {
          try {
        	    xhr = new ActiveXObject("Msxml2.XMLHTTP");
          } catch (othermicrosoft) {
          		try {
        	        xhr = new ActiveXObject("Microsoft.XMLHTTP");
        	    } catch (failed) {
             			xhr = false;
          		}
        	}
      }

      if (!xhr) {
          alert("Error initializing XMLHttpRequest!");
      } else {
          return xhr;
      }
  }
}