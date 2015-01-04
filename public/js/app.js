/**
 * This work is licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License. To view a copy of this license, visit http://creativecommons.org/licenses/by-nc-nd/4.0/ or send a letter to Creative Commons, 444 Castro Street, Suite 900, Mountain View, California, 94041, USA.
 *
 * This is a sample web app demonstrating how to implement a data driven application using NML.js library. This app uses Twitter Bootstrap 3, Jquery 1.10, jsviews and NMLjs. Templates are loaded from the template diretory.
 * Copyright 2014 Clickslide Limited. All rights reserved.
 * @namespace NML.js
 */
/*jshint unused: false */
/* global window, $, appconfig, NML, document, device, drive */
var app = {
    /**
     * Callback for NML.get function
     * This is where we will process the data
     */
    onGetData: function (nmldata) {
        console.log("Got NML Data");
//        console.log(nmldata);
        app.initGui();
        if (nmldata === null || nmldata === "" || nmldata === " ") {
            app.runLogin();
            //alert("Please be sure to enter an american phone number");
        } else {
            try {
                app.json = JSON.parse(nmldata);
            } catch (err) {
                app.json = nmldata;
            }

            try {
                // DO NOT REMOVE THE BELLOW COMMENT - used for grunt build process
                init(app.decCallback, ["appmanager", "commerce", "connectivity", "identity", "media", "navigation", "notification", "policy", "sa", "search", "settings", "sms", "va", "vehicleinfo"], 'myFirstApp');
            } catch (e) {
                console.log("", e);
            }
            app.nml.setHomePageId(app.json.ListPage["@attributes"].id);
            var array = app.json.ListPage.pages.BasicPage;
            console.log(array);
            for(var i=0; i < 10; i++){
                var spot = $('<div class="spot_' + i + ' ">').text("Latitude: " + array[i].glat + "Longitude: " + array[i].glong);
                ($("#results")).append(spot);
            }
            var results = $("#map").append($("#results"))
            results.show();
        }   
    },
    onLocationFound: function (e) {
        var radius = e.accuracy / 2;
        var myIcon = L.icon({
            iconUrl: 'img/crown.png',
            iconRetinaUrl: 'img/crown.png',
            iconSize: [38, 38]
        });
        L.marker(e.latlng).bindPopup("<h5>Your Location</h5>").addTo(app.map);
    },
    getNavigationInfo:function(data){
        console.log("Got Geolocation");
        console.log(data);
    },
    logError:function(err){
        console.log(err);
    },
    decCallback:function(decResponse) {
        console.log("DEC Response", decResponse);

        var isOnline = decResponse && decResponse.successCode == '0';
        $(".connection-status").html(isOnline ? "ONLINE" : "OFFLINE");
        // get geoLocation
        drive.navigation.get().then(app.getNavigationInfo,app.logError);
//        var vehicleinfo = drive.vehicleinfo;
//        drive.vehicleinfo.subscribe(
//            function (data) {
//                console.log(data);
//            }
//        );
    },

    onLocationError: function (e) {
        throw e;
    },
    /**
     * Give all the GUI elements their event listeners
     */
    initGui: function () {
        $("#destination").hide();
        $("#map").show();
        $("#settings").hide();
        $("#homebtn").bind('click', function (evt) {
            $("#destination").hide();
            $("#map").show();
            $("#settings").hide();
        });
        $("#destinationbtn").bind('click', function (evt) {
            $("#map").hide();
            $("#settings").hide();
            $("#destination").show();
        });
        $("#settingsbtn").bind('click', function (evt) {
            $("#map").hide();
            $("#destination").hide();
            $("#settings").show();
        });
        $('#loading').fadeOut();

    },
    isGap: false,
    nml: null,
    tmpsrc: null,
    socket: null,
    json: {},
    params: [{
        name: "address",
        value: "1155 Ave of Americas, New York, NY 10036"
    }],
    screen: "#home",
    // Application Constructor
    initialize: function () {
        console.log("App Init");
        app.bindEvents();
    },
    // Bind Event Listeners
    bindEvents: function () {
        console.log("App Bind Events");
        if (document.location.protocol === "file:") {
            console.log("Phonegap App");
            app.isGap = true;
            document.addEventListener(
                "deviceready",
                app.onDeviceReady,
                false
            );
        } else {
            console.log("Browser App");
            // no phonegap, start initialisation immediately
            $(document).ready(function () {
                app.onDeviceReady();
            });
        }
    },

    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function () {
        console.log("App & Device Ready");
        $("#list").hide();
        $("#search").show();

        $("#information").hide();
        $('#map').hide();
        app.nml = new NML();
        app.nml.initWithData = true;
        app.nml.isGap = app.isGap;
        app.nml.onGetData = app.onGetData;
        app.nml.setBaseUrl(appconfig[0].url, 'https', 'datadipity.com');
        app.nml.loginHandler = app.onLoginOrRegister;
        //app.runLogin();
        // TODO: Move to NML.js
        if (window.localStorage.appconfig !== undefined && window.localStorage.appconfig !== null) {
            var sessData = JSON.parse(window.localStorage.appconfig);
            if (sessData[0].url === appconfig[0].url) {
                if (sessData[0].sessid !== null && sessData[0].sessid !== undefined && sessData[0].sessid !== "") {
                    // got session already
                    app.nml.setAppConfig(sessData);
                    //app.onGetData();
                    app.nml.get(0, app.onGetData, true, app.params);
                } else {
                    $('#loader').modal('toggle');
                    app.runLogin();
                }
            } else {
                $('#loader').modal('toggle');
                app.runLogin();
            }
        } else {
            $('#loader').modal('toggle');
            app.runLogin();
        }
    },
    runLogin: function () {
        app.nml.loginHandler = app.onLoginOrRegister;
        app.nml.setAppConfig(appconfig);
        if (app.isGap) {

            app.nml.Login(device.uuid + "@clickslide.co", "password", app.onLoginOrRegister, app.nml);
        } else {
            var hash = CryptoJS.MD5(navigator.userAgent);
            app.nml.Login(hash.toString() + "@clickslide.co", "password", app.onLoginOrRegister, app.nml);
        }
        //app.nml.loadDialogs(app.onAppReady, app.nml, appconfig);
    },
    // custom callback for Logging in
    onLoginOrRegister: function (data) {
        console.log("Logged In Via App");
        console.log(data);
        // TODO: Check for login success

        if (data.session !== null && data.session !== undefined) {
            // $('#loadertext').html("Loading Tweets...");

            app.nml.onLogin(data);

            if (data.registerApis === true || data.registerApis === "true") {
                console.log("manageAuthRedirect");
                app.nml.manageAuthRedirect(app.nml);
            } else {
                $('#loader').modal('toggle');
                app.nml.get(0, app.onGetData, true);
            }
        } else {
            // add message to login modal
            if (app.isGap) {
                app.nml.Register(
                    device.uuid,
                    device.uuid + "@clickslide.co",
                    "password",
                    "password",
                    app.onLoginOrRegister
                );
            } else {
                console.log("Registering User Agent");
                var hash = CryptoJS.MD5(navigator.userAgent);
                console.log(navigator.userAgent);
                console.log(hash.toString());
                app.nml.Register(
                    hash.toString(),
                    hash.toString() + "@clickslide.co",
                    "password",
                    "password",
                    app.onLoginOrRegister
                );
            }

        }
    },
};
