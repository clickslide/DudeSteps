/**
 * This work is licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License. To view a copy of this license, visit http://creativecommons.org/licenses/by-nc-nd/4.0/ or send a letter to Creative Commons, 444 Castro Street, Suite 900, Mountain View, California, 94041, USA.
 *
 * This is a sample web app demonstrating how to implement a data driven application using NML.js library. This app uses Twitter Bootstrap 3, Jquery 1.10, jsviews and NMLjs. Templates are loaded from the template diretory.
 * Copyright 2014 Clickslide Limited. All rights reserved.
 * @namespace NML.js
 */
/*jshint unused: false */
/* global window, $, appconfig, NML, document, device, drive, init, L */


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
            for(var i=0; i < 20; i++){
                var feet = parseInt(array[i].pageText);
                if (feet >= 500 && feet <= 3000){
                    var html = '<a id="item-'+i+'" href="#" class="list-group-item"><h4 class="list-group-item-heading">'+array[i].title+'</h4><p class="list-group-item-text">Distance: '+array[i].pageText+' Steps (approximation)</p></a>';
                    $('#parking-list').append(html);
                    $("#item-" + i).on('click', function (){
                        var lat = array[i].glat;
                        var lng = array[i].glong;
                        $.post("")
                    })
                }
            }
            $('#map').hide();
            $('#destination').show();
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
    /*
     *  Ericsson SDK Functions
     */
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
       drive.vehicleinfo.subscribe(
           function (data) {
               var lat = data.position.latitude;
               var lng = data.position.longitude;
               $.get("http://api-flow.att.io/sandbox/dudesteps/clickslidecto/in/flow/location?location=" + lat + "," + lng)
           }
       );
    },
    /*
     *  END Ericsson SDK Functions
     */

    onLocationError: function (e) {
        throw e;
    },
    /**
     * Give all the GUI elements their event listeners
     */
    initGui: function () {
        $("#destination").hide();
        $("#map").show();
        $("#homebtn").bind('click', function (evt) {
            $("#destination").hide();
            $("#map").show();
        });
        $("#destinationbtn").bind('click', function (evt) {
            $("#map").hide();
            $("#destination").show();
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
        value: "175 North State Street, Chicago, IL 60601"
    }],
    screen: "#home",
    // Application Constructor
    initialize: function () {
        $("#list").hide();
        $('#map').hide();
        console.log("App Init");
        app.bindEvents();
        $('body').on('click',"#MapView",app.clickOnMapView);
    },
    clickOnListView: function() {
        $(this).unbind('click');
        $('#MapView').bind('click', app.clickOnMapView);
        $("#map").hide();
        $("#destination").show();    
    },       
    clickOnMapView: function() {
        $(this).unbind('click');
        $('#ListView').bind('click', app.clickOnListView);
        $("#map").show();
        $("#destination").hide();     
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
