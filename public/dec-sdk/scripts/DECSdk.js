function handleDeleteWithOptions(e, t, o, n, r) {
    console.log("Entering handleDeleteWithOptions for nodelevel " + e);
    var a = "";
    if (o && !n && !r) {
        console.log("Delete items at the leaf level for non array types");
        var l = getValueForHandle(o, n, r, e);
        return a = localStorage.removeItem(e), l
    }
    if (n)return handleDeleteOfArrayTypes(e, t);
    if (r)return handleDeleteOfMapTypes(e, t);
    console.log("Delete items at the parent level"), console.log("JSON: " + t);
    var s = JSON.stringify(t), i = JSON.parse(s);
    console.log("json parse" + i);
    for (attrKey in i) {
        attrKey = attrKey, a = i[attrKey], console.log("ATTRIBUTE KEY::  " , attrKey), console.log("ATTRIBUTE VALUE::  " , a);
        var c = e + "." + attrKey, u = getCurrentObject(getComponent(c), getNameSpace(c));
        if (null != u && u.isArray)return handleDeleteOfArrayTypes(c, a)
    }
}
function handleDeleteOfArrayTypes(e, t) {
    console.log("Entering handleDeleteOfArrayTypes for nodelevel " + e);
    var o = localStorage.getItem(e);
    if (null != o) {
        var n = JSON.parse(o);
        console.log("JSON: " + t);
        var r = JSON.stringify(t), a = JSON.parse(r);
        console.log("json parse" + a);
        var l = new Array, s = new Array, i = 0;
        for (attrKey in a)l[i] = attrKey, s[i] = a[attrKey], i++;
        for (var c = (new Array, []), u = 0, g = 0; g < n.length; g++)for (var d = 0; i > d; d++) {
            var p = l[d], f = s[d], v = n[g];
            v[p] === f && (console.log("Item matches, deleting from the array"), c[u] = n[g], u++, delete n[g])
        }
        return n = n.filter(function (e) {
            return null !== e
        }), localStorage.setItem(e, JSON.stringify(n)), c
    }
}
function handleDeleteOfMapTypes(e, t) {
    for (var o = localStorage.getItem(e), n = JSON.parse(o), r = JSON.parse(t), a = (new Object, null), l = 0; l < r.length; l++) {
        var s = r[l];
        null !== n[s] && (a = n[s], delete n[s])
    }
    return a
}
function handleDeleteWithNoOptions(e, t, o, n) {
    var r = "", a = getValueForHandle(t, o, n, e);
    if (t)console.log("Delete called at leaf level with no options"), r = localStorage.removeItem(e); else {
        console.log("Delete called at parent level with no options");
        for (var l = Object.keys(localStorage), s = (new Array, 0); s < l.length; s++)isNaN(parseInt(l[s])) && -1 != l[s].indexOf(e) && localStorage.removeItem(l[s])
    }
    return a
}
function DecError(e, t) {
    this.errorCode = e, this.errorMessage = t, this.getErrorCode = function () {
        return this.errorCode
    }, this.getErrorMessage = function () {
        return this.errorMessage
    }
}
function DecSuccess(e, t) {
    this.successCode = e, this.successMessage = t, this.getSuccessCode = function () {
        return this.successCode
    }, this.getSuccessMessage = function () {
        return this.successMessage
    }
}
function contains(e) {
    for (var t = componentsArray.length; t--;)if (componentsArray[t] === e)return!0;
    return!1
}
function checkForComponentsValidity(e) {
    for (var t = 0; t < e.length; t++) {
        var o = e[t];
        if (!contains(o))return o
    }
    return null
}
function initialize(callbackFn, components, applicationId) {
    if (console.log("Components passed ::: ", components), null == applicationId) {
        var msg = "Cannot Initialize the component as Application Id is not provided.";
        throw console.log(msg), msg
    }
    var inValidComponent = checkForComponentsValidity(components);
    if (null == inValidComponent) {
        drive.callback = callbackFn;
        for (var index = 0; index < components.length; index++) {
            var component = components[index];
            console.log("Initializing " + component), drive[component] = new DecCommon, drive[component].setLeafStatus(!1), drive[component].setNodeLevel(components[index]), drive[component].setAvailableStatus(Availability.available), null != applicationId && drive[component].setAppId(applicationId);
            var jsonComp = eval("(" + component + ")");
            initializeComponents(drive[component], jsonComp)
        }
        if ("span" == connectionType)console.log("Connection Type is Span. Initializing Web Socket"), RunSpanMessageBroker(); else {
            console.log("Connection Type is MB bridge");
            var decSuccess = new DecSuccess("0", "Successfully Initialized the components");
            if (null != callbackFn) {
                var fn = eval("(" + callbackFn + ")");
                fn.call(null, decSuccess)
            }
        }
    } else {
        console.log("Cannot Initialize... " + inValidComponent + " is not a valid component");
        var decError = new DecError(DecErrorCodes.component_not_found.errorcode, DecErrorCodes.component_not_found.errormessage);
        if (null != callbackFn) {
            var fn = eval("(" + callbackFn + ")");
            fn.call(null, decError)
        }
    }
}
function showLocalStorage() {
    var e = "", t = "<table><tr><th>Name</th><th>Value</th></tr>", o = 0;
    for (console.log("Local Storage length is" + localStorage.length), o = 0; o <= localStorage.length - 1; o++)e = localStorage.key(o), t += "<tr><td>" + e + "</td><td>" + localStorage.getItem(e) + "</td></tr>";
    t += "</table>", document.write(t)
}
function checkPermissions(e, t, o, n) {
    console.log(e + t + o + n);
    var r = e + o;
    localStorage.setItem(r, n);
    var a = localStorage.getItem(r);
    return console.log("keyid from localstorage" + a), null != a ? !0 : !0
}
function getHashCode(e) {
    var t = 0;
    if (0 == e.length)return t;
    for (i = 0; i < e.length; i++)char = e.charCodeAt(i), t = (t << 5) - t + char, t &= t;
    return t
}
function createHandle(e, t, o) {
    var n = e + o, r = hashCode(n);
    console.log("callbackIdentyHashCode ::::::::::::: " + r);
    var a = e + t + o + r;
    return console.log("handle ::::::::::::: " + a), a
}
function addLocalSubscriptions(e, t, o) {
    var n = o || null, r = {};
    r.callback = "" + t, r.options = n;
    var a = JSON.stringify(r), l = JSON.parse(a), s = storage[e], i = null;
    null != s && (i = JSON.parse(s)), null == i || 0 == i.length ? (console.log("SubscriptionArray is empty. Adding an entry"), i = [], i[0] = l) : i[i.length] = l;
    var c = i.length;
    i = uniqBy(i, JSON.stringify);
    var u = i.length;
    return storage[e] = JSON.stringify(i), 1 != c && c != u ? null : r
}
function checkLocalSubscriptions(handle, callbackFn, options) {
    console.log("Entering checkLocalSubscriptions for handle ::: " + handle);
    var decSdkSubscription = storage[handle];
    if (null != decSdkSubscription) {
        var subscriptionArray = JSON.parse(decSdkSubscription);
        if (null == subscriptionArray || 0 == subscriptionArray.length)return!1;
        if ("" == callbackFn.name)return!1;
        for (var counter = 0; counter < subscriptionArray.length; counter++) {
            var subscriptionItem = subscriptionArray[counter], subCallback = subscriptionItem.callback, fn = eval("(" + subCallback + ")");
            if (fn.name == callbackFn.name)return!0
        }
    }
    return console.log("Exiting checkLocalSubscriptions"), !1
}
function getMatchingSubscriptions(e, t) {
    console.log("Inside getMatchingSubscriptions");
    var o = storage[e], n = [];
    if (null != o) {
        var r = 0, a = JSON.parse(o);
        if (null == a || 0 == a.length)return null;
        for (var l = 0; l < a.length; l++) {
            var s = a[l], i = s.options;
            if (null == i)console.log("Options is null, adding subscription to the list"), s.value = t, n[r] = s, r++; else {
                for (key in i);
                var c = i[key];
                console.log("Options Key ::: " + key), console.log("Options Value ::: " + c);
                var u = !1;
                if (t instanceof Array) {
                    console.log("value is of Array type");
                    for (var g = [], d = 0, p = 0; p < t.length; p++) {
                        var f = t[p];
                        for (attrKey in f)if (attrKey == key && f[attrKey] == c) {
                            u = !0, g[d] = f, d++;
                            break
                        }
                    }
                    u && (s.value = g, n[r] = s, r++, console.log("Match found, Adding subscription to the list "))
                } else for (attrKey in t)if (attrKey == key && t[attrKey] == c) {
                    s.value = t, n[r] = s, r++, console.log("Match found, Adding subscription to the list... ");
                    break
                }
            }
        }
    }
    return console.log("Exiting getMatchingSubscriptions. Subcriptions List size " + n.length), n
}
function logResult(e) {
    if (e instanceof Array) {
        var t = JSON.parse(JSON.stringify(e)), o = JSON.parse(t[0]);
        console.log("GET Array Value: " + o)
    }
    console.log("Success Result:::" + e)
}
function logError(e) {
    console.log("Error:::" + e)
}
function notifySystems(e) {
    "span" == connectionType ? (console.log("Connection Type is Span. Notify Span"), notifySpan(e)) : (console.log("Connection Type is MB bridge. Notifying DEC Core about changes"), notifyDECCore(e))
}
function notifySpan(e) {
    console.log("Notifying Span about change in property value");
    var t = getProperties();
    console.log("Host received to open the socket is " + t.host), console.log("Port received to open the socket is " + t.port);
    var o = "ws://" + t.host + ":" + t.port + "/", n = new WebSocket(o), r = createDataHandle(e.component, e.namespace), a = e.method, l = getApplicationId(e.component);
    console.log("senderAppId ::: " + l), "subscribe" == a && (r = createDataHandleSubscription(e.component, e.namespace, l), console.log("notifySpan Subscription Handle" + r)), console.log("datahandle ::: " + r), n.onopen = function () {
        console.log("inside wsopen");
        var t = {component: e.component, nameSpace: e.namespace, handle: r, method: e.method, eventType: e.eventType, value: e.value, options: e.options}, o = JSON.stringify(t);
        encodedData = encodeURI(o);
        var a = {"dec.SetRequest": {sender: {sender: l, receivers: ["DECCore"], data: encodedData}}};
        console.log(JSON.stringify(a)), console.log("Sending msg is ::: " + JSON.stringify(a)), n.send(JSON.stringify(a)), n.close()
    }, n.onclose = function () {
        console.log("Connection is closed...")
    }
}
function getApplicationId(e) {
    try {
        if (null != drive[e])return drive[e].getAppId()
    } catch (t) {
    }
    return"DECJSSDK"
}
function createSubscriptionHandle(e) {
    var t = getHashCode(e) + e;
    return t
}
function createDataHandle(e, t) {
    var o = e + "." + t;
    return getHashCode(o)
}
function createDataHandleSubscription(e, t, o) {
    var n = e + "." + t + "." + o;
    return getHashCode(n)
}
function initializeComponents(e, t) {
    for (var o in t) {
        e[o] = new DecCommon;
        var n = e.getNodeLevel();
        e[o].setNodeLevel("" + n + "." + o);
        {
            e[o].getNodeLevel()
        }
        "java.util.Map" === t[o].type ? e[o].isMap = !0 : "java.util.List" === t[o].type && (e[o].isArray = !0), null != t[o].properties ? (e[o].setLeafStatus(!1), initializeComponents(e[o], t[o].properties)) : e[o].setLeafStatus(!0)
    }
}
function notifyDECCore(e) {
    console.log("Notifying DEC Core::::" + e);
    var t = getApplicationId(e.component);
    console.log("senderAppId ::: " + t);
    var o = ["DECCore"], n = createDataHandle(e.component, e.namespace), r = e.method;
    "subscribe" == r && (n = createDataHandleSubscription(e.component, e.namespace, t), console.log("NotifyDECCore Subscription Handle" + n)), console.log("datahandle ::: " + n);
    var a = {component: e.component, nameSpace: e.namespace, handle: n, method: e.method, eventType: e.eventType, value: e.value, options: e.options}, l = JSON.stringify(a);
    encodedData = encodeURI(l), console.log("encodedData::::" + encodedData), sendMessage(t, o, encodedData)
}
function showLocalStorageForData() {
    var e = "", t = "<H3>Data Stored in local Storage for components</H3>\n<table><tr><th>Name</th><td><td><td><td></td></td></td></td><th>Value</th></tr>", o = 0;
    for (console.log("Local Storage length is" + localStorage.length), o = 0; o <= localStorage.length - 1; o++) {
        e = localStorage.key(o);
        var n = /\d/g;
        n.test(e) || (t += "<tr><td>" + e + "</td><td><td><td><td></td></td></td></td><td>" + localStorage.getItem(e) + "</td></tr>")
    }
    t += "</table>", document.write(t)
}
function showLocalStorageForSubscriptions() {
    var e = "", t = "<H3>Subscription Details Stored in local Storage for components</H3>\n<table><tr><th>Name</th><td><td><td><td></td></td></td></td><th>Value</th></tr>", o = 0;
    for (console.log("Local Storage length is" + localStorage.length), o = 0; o <= localStorage.length - 1; o++) {
        e = localStorage.key(o);
        var n = /\d/g;
        n.test(e) && (t += "<tr><td>" + e + "</td><td><td><td><td></td></td></td></td><td>" + localStorage.getItem(e) + "</td></tr>")
    }
    t += "</table>", document.write(t)
}
function setItemsOfMapType(e, t) {
    var o = JSON.parse(t), n = new Array, r = new Array, a = 0;
    for (attrKey in o)n[a] = attrKey, r[a] = o[attrKey], a++;
    for (var l = localStorage.getItem(this.nodeLevel), s = JSON.parse(l), i = 0; i < n.length; i++) {
        var c = n[i], u = r[i];
        s[c] = u
    }
    return localStorage.setItem(this.nodeLevel, JSON.stringify(s)), s
}
function setItemsOfArrayType(e, t, o) {
    console.log("Entering method setItemsOfArrayType");
    var n = !1, r = !1, a = JSON.stringify(t), l = JSON.parse(a);
    console.log("json parse" + l);
    var s = localStorage.getItem(e), i = JSON.parse(s);
    if (null === i || 0 === i.length) {
        if (console.log("Items Array is empty. Initialising and setting the values"), i = [], t instanceof Array)for (var c = i.length, u = 0; u < t.length; u++) {
            var g = t[u];
            i[c] = g, c++
        } else i[0] = t;
        i = uniqBy(i, JSON.stringify), localStorage.setItem(e, JSON.stringify(i)), r = !0, console.log("Array length " + i.length)
    } else if (null == o) {
        if (console.log("No Filter options. Adding the item to array"), t instanceof Array)for (var c = i.length, u = 0; u < t.length; u++) {
            var g = t[u];
            i[c] = g, c++
        } else i[i.length] = t;
        i = uniqBy(i, JSON.stringify), localStorage.setItem(e, JSON.stringify(i)), r = !0, console.log("Array length " + i.length)
    } else {
        console.log("Filter options present. Updating the Array");
        var d = JSON.stringify(o), p = JSON.parse(d), f = new Array, v = new Array, y = 0;
        for (filterKey in p)f[y] = filterKey, v[y] = p[filterKey], y++;
        for (var h = f[0], m = v[0], S = 0; S < i.length; S++) {
            var g = i[S];
            if (g[h] === m)if (l instanceof Array)for (var b = 0; b < l.length; b++) {
                var N = l[b];
                for (attrKey in N) {
                    var O = attrKey, A = N[attrKey];
                    g[O] = A, i[S] = g, n = !0
                }
            } else for (attrKey in l) {
                var O = attrKey, A = l[attrKey];
                g[O] = A, i[S] = g, n = !0
            }
        }
        n && (i = uniqBy(i, JSON.stringify), localStorage.setItem(e, JSON.stringify(i)), r = !0)
    }
    return i
}
function uniqBy(e, t) {
    var o = {};
    return e.filter(function (e) {
        var n = t(e);
        return o.hasOwnProperty(n) ? !1 : o[n] = !0
    })
}
function setItemsOfLeafOrNonLeafType(e, t, o) {
    console.log("Entering method setItemsOfLeafOrNonLeafType");
    var n = !1;
    return n;
    console.log("e", e);
    if (e[t].isLeaf())localStorage.setItem(e.getNodeLevel() + "." + t, o), n = !0; else for (key in o) {
        newKey = key, newVal = o[key], console.log("ATTRIBUTE KEY::  " , newKey), console.log("ATTRIBUTE VALUE::  " , newVal);
        var r = e[t];
        n = setItemsOfLeafOrNonLeafType(r, newKey, newVal)
    }
    return n
}
function getValueMatchingNodeLevel(e, t, o, n) {
    var r = t.substring(0, t.lastIndexOf("."));
    if (r == e) {
        for (key in o);
        return n[key] = o[key], n
    }
    var a = r.substring(r.lastIndexOf(".") + 1);
    if (null == n[a]) {
        var l = {};
        return l[a] = o, getValueMatchingNodeLevel(e, r, l, n)
    }
    for (key in o);
    return n[a][key] = o[key], n
}
function getValueForHandle(e, t, o, n) {
    if (console.log("Entering getValueForHandle for nodelevel " + n + " And isLeaf " + e), e || t) {
        var r = localStorage.getItem(n);
        return console.log("Exiting getValueForHandle for nodelevel " + n), JSON.parse(r)
    }
    for (var a = Object.keys(localStorage), r = (new Array, {}), l = 0, s = 0; s < a.length; s++)if (isNaN(parseInt(a[s])) && -1 != a[s].indexOf(n)) {
        var i = {}, c = a[s].substring(a[s].lastIndexOf(".") + 1), u = getCurrentObject(getComponent(a[s]), getNameSpace(a[s]));
        i[c] = u.isArray ? JSON.parse(localStorage.getItem(a[s])) : localStorage.getItem(a[s]), r = getValueMatchingNodeLevel(n, a[s], i, r), l++
    }
    return console.log("Exiting getValueForHandle for nodelevel " + n), 0 == l ? null : r
}
function getComponent(e) {
    return-1 != e.indexOf(".") ? e.substring(0, e.indexOf(".")) : e
}
function getNameSpace(e) {
    return-1 != e.indexOf(".") ? e.substring(e.indexOf(".") + 1) : ""
}
function executeSubscriptionCallbackAfterSet(handle, value) {
    var subscriptionHandle = createSubscriptionHandle(handle), subscriptionArray = getMatchingSubscriptions(subscriptionHandle, value);
    if (null == subscriptionArray || 0 == subscriptionArray.length)console.log("Component is not subscribed yet. So not sending subscription callback"); else for (var counter = 0; counter < subscriptionArray.length; counter++) {
        var subscriptionItem = subscriptionArray[counter], subCallback = subscriptionItem.callback, subValue = subscriptionItem.value, fn = eval("(" + subCallback + ")");
        console.log("Calling subscription callback function"), fn.call(null, subValue, EventType.GET)
    }
}
function executeSubscriptionCallbackForParentChild(e, t) {
    console.log("Executing executeSubscriptionCallbackForParentChild for node::::" + e);
    for (var o = e.split("."), n = "", r = t, a = o.length - 1; a >= 0; a--)if (console.log("Printing Node Value:::" + o[a]), a == o.length - 1)executeSubscriptionCallbackAfterSet(e, t), n = e; else {
        var l = n.substring(n.lastIndexOf(".") + 1), s = {};
        s[l] = r, n = n.substring(0, n.lastIndexOf(".")), console.log("Execute Node :::::::" + n), console.log("NODE value to be sent" + JSON.stringify(s)), executeSubscriptionCallbackAfterSet(n, s), r = s
    }
}
var Availability = {available: 0, readonly: 1, not_supported: 2, not_supported_yet: 3, not_supported_security: 4, not_supported_policy: 5, not_supported_other: 6}, DecErrorCodes = {invalid_parameter: {errorcode: "invalid_parameter", errormessage: "Invalid parameter"}, not_authenticated: {errorcode: "not_authenticated", errormessage: "Not authenticated"}, not_authorized: {errorcode: "not_authorized", errormessage: "Not authorized"}, connection_timeout: {errorcode: "connection_timeout", errormessage: "Communication error"}, not_subscribed: {errorcode: "not_subscribed", errormessage: "Not subscribed"}, not_supported: {errorcode: "not_supported", errormessage: "Not Supported"}, component_not_found: {errorcode: "component_not_found", errormessage: "Component not found"}, span_not_found: {errorcode: "span_server_not_connected", errormessage: "Not connected to span server, Please check the configuration"}}, EventType = {ALL: "all", CREATE: "create", ADD: "add", UPDATE: "update", GET: "get", DELETE: "delete"}, componentsArray = ["appmanager", "commerce", "connectivity", "identity", "media", "navigation", "notification", "policy", "sa", "search", "settings", "sms", "va", "vehicleinfo"], DecCommon = function () {
    this.callback = null, this.isMap = !1, this.appId = "DECJSSDK";
    Availability.available;
    this.setAppId = function (e) {
        this.appId = e
    }, this.getAppId = function () {
        return this.appId
    }, this.setNodeLevel = function (e) {
        this.nodeLevel = e
    }, this.getNodeLevel = function () {
        return this.nodeLevel
    }, this.setLeafStatus = function (e) {
        this.leaf = e
    }, this.isLeaf = function () {
        return this.leaf
    }, this.setAvailableStatus = function (e) {
        this.availableStatus = e
    }, this.getAvailableStatus = function () {
        return this.availableStatus
    }, this.subscribe = function (e, t) {
        console.log("Processing subscribe functionality"), this.availableStatus = Availability.available;
        var o = this.nodeLevel;
        console.log("HANDLE is :::" + o);
        var n = createSubscriptionHandle(o);
        console.log("SUBSCRIPTION HANDLE " + n);
        var r = checkLocalSubscriptions(n, e, t);
        if (r)console.log("Is already subscribed ::: true"); else {
            console.log("Adding subscriptions");
            var a = addLocalSubscriptions(n, e, t);
            if (null != a) {
                console.log("Is already subscribed ::: false"), console.log("Subscription is done");
                var l = {component: getComponent(o), namespace: getNameSpace(o), method: "subscribe", eventType: EventType.GET, value: {}};
                console.log("Notifying Systems"), notifySystems(l)
            } else console.log("Is already subscribed ::: true")
        }
        return n
    }, this.unsubscribe = function (e) {
        var t = e;
        null == e && (t = createSubscriptionHandle(e)), storage[t] = null, console.log("Unsubscribed..."), this.availableStatus = Availability.not_supported
    }, this.get = function (e) {
        if (this.availableStatus === Availability.not_supported)return console.log("Not Supported!"), new Promise(function (e, t) {
            var o = JSON.stringify(DecErrorCodes.not_supported);
            t(Error(o))
        });
        var t = e || null, o = "";
        if (console.log("Get Called for NodeLevel = " + this.nodeLevel + ", leaf = " + this.isLeaf()), t) {
            if (!this.isLeaf()) {
                var n = Object.keys(localStorage), r = (new Array, localStorage.getItem(this.nodeLevel)), a = JSON.parse(r);
                if (this.isArray) {
                    console.log("JSON: " + e);
                    var l = JSON.stringify(e), s = JSON.parse(l);
                    console.log("json parse" + s);
                    var i = new Array, c = new Array, u = 0;
                    for (attrKey in s)i[u] = attrKey, c[u] = s[attrKey], u++;
                    for (var g = new Array, d = 0, p = 0; p < a.length; p++) {
                        for (var f = !0, v = 0; u > v; v++) {
                            var y = i[v], h = c[v], m = a[p];
                            if (m[y] !== h) {
                                f = !1;
                                break
                            }
                        }
                        f && (g[d] = JSON.stringify(a[p]), d++)
                    }
                    return console.log("GET Array Result: " + g), new Promise(function (e) {
                        e(g)
                    })
                }
                if (this.isMap) {
                    for (var s = JSON.parse(e), S = new Object, v = 0; v < s.length; v++) {
                        var h = s[v];
                        null !== a[h] && (S[h] = a[h])
                    }
                    o = JSON.stringify(S)
                } else {
                    if (o = "{", t instanceof Array)for (var b = 0, N = 0; N < t.length; N++)0 !== b && (o += ","), o += "'" + this.nodeLevel + "." + t[N] + "':'" + localStorage.getItem(this.nodeLevel + "." + t[N]) + "'", b++; else for (var b = 0, O = 0; O < n.length; O++)isNaN(parseInt(n[O])) && -1 != n[O].indexOf(this.nodeLevel) && (0 !== b && (o += ","), o += n[O] + ":'" + localStorage.getItem(n[O]) + "'", b++);
                    o += "}"
                }
                return console.log("GET Result: " + o), console.log("GET Result: " + o.length), new Promise(function (e) {
                    e(o)
                })
            }
            o = localStorage.getItem(this.nodeLevel)
        } else o = getValueForHandle(this.isLeaf(), this.isArray, this.isMap, this.nodeLevel);
        return console.log("Retreived JSON: " + o), new Promise(function (e) {
            e(o)
        })
    }, this.set = function (e, t) {
        var o = t || null, n = e || null;
        if (null === n)return console.log("Set called without options!"), new Promise(function (e, t) {
            var o = JSON.stringify(DecErrorCodes.invalid_parameter);
            t(Error(o))
        });
        try {
            console.log("JSON: " + e), console.log("NodeLevel: " + this.nodeLevel);
            var r = null;
            if (r = null == o ? EventType.ADD : EventType.UPDATE, !this.isLeaf() || this.isArray || this.isMap)if (this.isArray) {
                console.log("Set called for array types"), setItemsOfArrayType(this.nodeLevel, e, o);
                var a = null;
                if (e instanceof Array)a = e; else {
                    var l = [];
                    l[0] = e, a = l
                }
                var s = {component: getComponent(this.nodeLevel), namespace: getNameSpace(this.nodeLevel), method: "set", eventType: r, value: a, options: o};
                console.log("Executing Subscription callback method"), executeSubscriptionCallbackForParentChild(this.nodeLevel, a), console.log("Notifying Systems"), notifySystems(s)
            } else if (this.isMap) {
                console.log("Set called at parent level for map type"), setItemsOfMapType(this.nodelLevel, e, o);
                var s = {component: getComponent(this.nodeLevel), namespace: getNameSpace(this.nodeLevel), method: "set", eventType: r, value: e, options: o};
                console.log("Executing Subscription callback method"), executeSubscriptionCallbackForParentChild(this.nodeLevel, e), console.log("Notifying Systems"), notifySystems(s)
            } else {
                console.log("Set called at parent level for non-array types");
                var i = !1, c = JSON.stringify(e), u = JSON.parse(c);
                console.log("json parse" + u);
                for (p in u)if (p = p, attrVal = u[p], console.log("ATTRIBUTE KEY::  " , p), console.log("ATTRIBUTE VALUE::  " , attrVal), this[p].isArray) {
                    var g = this.nodeLevel + "." + p, l = setItemsOfArrayType(g, attrVal, o);
                    null != l && (i = !0)
                } else i = setItemsOfLeafOrNonLeafType(this, p, attrVal);
                if (i) {
                    var d = this.nodeLevel;
                    -1 == d.indexOf(".") && (d += ".");
                    var s = {component: getComponent(d), namespace: getNameSpace(d), method: "set", eventType: r, value: e, options: o};
                    console.log("Executing Subscription callback method"), executeSubscriptionCallbackForParentChild(this.nodeLevel, e), console.log("Notifying Systems"), notifySystems(s)
                }
            } else {
                console.log("Set called at leaf level"), localStorage.setItem(this.nodeLevel, e);
                var d = this.nodeLevel, p = d.substring(d.lastIndexOf(".") + 1), a = {};
                a[p] = e;
                var s = {component: getComponent(d), namespace: d.substring(d.indexOf(".") + 1, d.lastIndexOf(".")), method: "set", eventType: r, value: a, options: o};
                console.log("Executing Subscription callback method");
                var f = d.substring(0, d.lastIndexOf("."));
                executeSubscriptionCallbackForParentChild(f, a), console.log("Notifying Systems"), notifySystems(s)
            }
        } catch (v) {
            return console.log("Exception: " + v.message), new Promise(function (e, t) {
                t(Error("Error: " + v.message))
            })
        }
        return new Promise(function (e) {
            e("success")
        })
    }, this.delete = function (e) {
        var t = e || null;
        console.log("Delete Called for NodeLevel = " + this.nodeLevel + ", leaf = " + this.isLeaf());
        var o = {component: getComponent(this.nodeLevel), namespace: getNameSpace(this.nodeLevel), method: "clear", eventType: EventType.DELETE, options: t};
        return console.log("Notifying Systems"), notifySystems(o), new Promise(function (e) {
            e("Successfully removed")
        })
    }
}, Drive = function () {
    this.policy = null
}, Storage = function () {
}, drive = new Drive, storage = new Storage;
init = function (e, t, o) {
    console.log("Entering init method"), t instanceof Array ? initialize(e, t, o) : initialize(t, o, e)
};
var Operation = {READ: "read", WRITE: "write", PRIVATE: "private", POLICY: "policy"};