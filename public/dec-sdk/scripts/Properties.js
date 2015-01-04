var host = "10.0.0.16";
var port = "4412";

/**
 * Get the properties to open the web socket 
 * @returns {Map}
 */
function getProperties() {
	console.log("Adding Properties for Websocket");
	var properties = {
		'host' : host,
		'port' : port
	};
	console.log("Properties are set:" + "Host is: " + host + " and Port is: "
			+ port);
	return properties;
}
