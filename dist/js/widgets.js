(function(exports, global) {
    global["bh"] = exports;
    var define, internal, finalize = function() {};
    (function() {
        var get, defined, pending, definitions, initDefinition, $cachelyToken = "~", $depsRequiredByDefinitionToken = ".";
        get = Function[$cachelyToken] = Function[$cachelyToken] || function(name) {
            if (!get[name]) {
                get[name] = {};
            }
            return get[name];
        };
        definitions = get("c");
        defined = get("d");
        pending = get("p");
        initDefinition = function(name) {
            if (defined[name]) {
                return;
            }
            var args = arguments;
            var val = args[1];
            if (typeof val === "function") {
                defined[name] = val();
            } else {
                definitions[name] = args[2];
                definitions[name][$depsRequiredByDefinitionToken] = val;
            }
        };
        define = internal = function() {
            initDefinition.apply(null, arguments);
        };
        resolve = function(name, fn) {
            pending[name] = true;
            var deps = fn[$depsRequiredByDefinitionToken];
            var args = [];
            var i, len;
            var dependencyName;
            if (deps) {
                len = deps.length;
                for (i = 0; i < len; i++) {
                    dependencyName = deps[i];
                    if (definitions[dependencyName]) {
                        if (!pending.hasOwnProperty(dependencyName)) {
                            resolve(dependencyName, definitions[dependencyName]);
                        }
                        resolve(dependencyName, definitions[dependencyName]);
                        delete definitions[dependencyName];
                    }
                }
            }
            if (!defined.hasOwnProperty(name)) {
                for (i = 0; i < len; i++) {
                    dependencyName = deps[i];
                    args.push(defined.hasOwnProperty(dependencyName) && defined[dependencyName]);
                }
                defined[name] = fn.apply(null, args);
            }
            delete pending[name];
        };
        finalize = function() {
            for (var name in definitions) {
                resolve(name, definitions[name]);
            }
        };
        return define;
    })();
    //! ################# YOUR CODE STARTS HERE #################### //
    //! node_modules/hbjs/src/utils/formatters/removeHTMLComments.js
    define("removeHTMLComments", function() {
        var removeHTMLComments = function(htmlStr) {
            htmlStr = htmlStr + "";
            return htmlStr.replace(/<!--[\s\S]*?-->/g, "");
        };
        return removeHTMLComments;
    });
    //! src/widgets/bootstrap.js
    internal("app", [ "module", "dispatcher", "ready", "loader", "findScriptUrls" ], function(module, dispatcher, ready, loader, findScriptUrls) {
        dispatcher(exports);
        var name = "widgets";
        var app = dispatcher(module("app"));
        app.preLink = function(el, directive) {
            if (directive.alias.name.indexOf("hb-") === -1 && directive.alias.name.indexOf("-") !== -1) {
                el.classList.add(directive.alias.name);
                el.setAttribute("ng-non-bindable", "");
            }
        };
        var assets = [];
        var urls = findScriptUrls(new RegExp(name + "(.min)?.js$"), "i");
        if (urls.length) {
            var scriptUrl = urls[0].substring(0, urls[0].lastIndexOf("/"));
            var len = assets.length;
            for (var i = 0; i < len; i += 1) {
                assets[i] = scriptUrl + "/" + assets[i];
            }
            loader.load(assets, function() {
                ready(function() {
                    app.bootstrap(document.body);
                    delete exports.$$;
                    exports.fire("ready", app);
                });
            });
        }
        return app;
    });
    //! node_modules/hbjs/src/hb/directives/events.js
    //! pattern /hb\-(click|mousedown|mouseup|keydown|keyup|touchstart|touchend|touchmove|animation\-start|animation\-end)\=/
    define("hbEvents", [ "hb", "hb.val", "each" ], function(hb, val, each) {
        var UI_EVENTS = "click change mousedown mouseup mouseover mouseout keydown keyup touchstart touchend touchmove focus blur".split(" ");
        var pfx = [ "webkit", "moz", "MS", "o", "" ];
        var ANIME_EVENTS = "AnimationStart AnimationEnd".split(" ");
        function onAnime(element, eventType, callback) {
            for (var p = 0; p < pfx.length; p++) {
                if (!pfx[p]) {
                    eventType = eventType.toLowerCase();
                }
                element.addEventListener(pfx[p] + eventType, callback, false);
            }
        }
        function offAnime(element, eventType, callback) {
            for (var p = 0; p < pfx.length; p++) {
                if (!pfx[p]) {
                    eventType = eventType.toLowerCase();
                }
                element.addEventListener(pfx[p] + eventType, callback, false);
            }
        }
        each(ANIME_EVENTS, function(eventName) {
            val("hb" + eventName, [ "$app", function($app) {
                return {
                    link: [ "scope", "el", "alias", function(scope, el, alias) {
                        var bindOnce = scope.$isBindONce(alias.value);
                        function unlisten() {
                            offAnime(el, eventName, handle);
                        }
                        function handle(evt) {
                            if (evt.currentTarget.nodeName.toLowerCase() === "a") {
                                evt.preventDefault();
                            }
                            scope.$event = evt;
                            bindOnce && unlisten();
                            if (evt.target === el) {
                                $app.interpolate(scope, alias.value);
                                scope.$apply();
                            }
                            return false;
                        }
                        onAnime(el, eventName, handle);
                        scope.$on("$destroy", unlisten);
                    } ]
                };
            } ], "event");
        });
        each(UI_EVENTS, function(eventName) {
            val("hb" + eventName.charAt(0).toUpperCase() + eventName.substr(1), [ "$app", function($app) {
                return {
                    link: [ "scope", "el", "alias", function(scope, el, alias) {
                        var bindOnce = scope.$isBindOnce(alias.value);
                        function unlisten() {
                            hb.off(el, eventName, handle);
                        }
                        function handle(evt) {
                            if (evt.currentTarget.nodeName.toLowerCase() === "a") {
                                evt.preventDefault();
                            }
                            scope.$event = evt;
                            bindOnce && unlisten();
                            $app.interpolate(scope, alias.value);
                            scope.$apply();
                            return false;
                        }
                        hb.on(el, eventName, handle);
                        scope.$on("$destroy", unlisten);
                    } ]
                };
            } ], "event");
        });
    });
    //! node_modules/hbjs/src/hb/hb.js
    define("hb", function() {
        var hb = {
            debug: {},
            plugins: {},
            filters: {},
            errors: {},
            directives: {}
        };
        var ON_STR = "on";
        hb.on = function(el, eventName, handler) {
            if (el.attachEvent) {
                el.attachEvent(ON_STR + eventName, el[eventName + handler]);
            } else {
                el.addEventListener(eventName, handler, false);
            }
        };
        hb.off = function(el, eventName, handler) {
            if (el.detachEvent) {
                el.detachEvent(ON_STR + eventName, el[eventName + handler]);
            } else {
                el.removeEventListener(eventName, handler, false);
            }
        };
        return hb;
    });
    //! node_modules/hbjs/src/hb/utils/val.js
    define("hb.val", [ "cache", "each" ], function(cache, each) {
        var $cache = cache();
        var val = function(name, fn) {
            if (!$cache.has(name)) {
                $cache.set(name, fn);
            }
        };
        val.init = function(app) {
            each($cache.all(), function(value, key) {
                app.val(key, value);
            });
            $cache.clear();
        };
        return val;
    });
    //! node_modules/hbjs/src/utils/data/cache.js
    define("cache", function() {
        var cache = function() {
            var Cache, ns;
            ns = {};
            Cache = function() {
                var _cachedItems = {};
                this.set = function(key, value) {
                    _cachedItems[key] = value;
                    return value;
                };
                this.get = function(key, defaultValue) {
                    if (_cachedItems.hasOwnProperty(key)) {
                        return _cachedItems[key];
                    }
                    return defaultValue;
                };
                this.getCopy = function(key, defaultValue) {
                    var data = this.get(key, defaultValue);
                    return data.copy(data);
                };
                this.merge = function(key, value) {
                    if (_cachedItems[key]) {
                        _cachedItems[key] = extend(_cachedItems[key], value);
                    } else {
                        _cachedItems[key] = value;
                    }
                    return _cachedItems[key];
                };
                this.keys = function() {
                    var keys = [];
                    for (var key in _cachedItems) {
                        if (_cachedItems.hasOwnProperty(key)) {
                            keys.push(key);
                        }
                    }
                    return keys;
                };
                this.all = function() {
                    return _cachedItems;
                };
                this.has = function(key) {
                    return _cachedItems.hasOwnProperty(key);
                };
                this.remove = function(key) {
                    delete _cachedItems[key];
                };
                this.clear = function() {
                    _cachedItems = {};
                };
                this.inc = function(key) {
                    var id = key + "Counter";
                    if (!_cachedItems[id]) {
                        _cachedItems[id] = 0;
                    }
                    _cachedItems[id] += 1;
                    return _cachedItems[id];
                };
                this.dec = function(key) {
                    var id = key + "Counter";
                    if (!_cachedItems[id]) {
                        _cachedItems[id] = 0;
                    }
                    _cachedItems[id] -= 1;
                    return _cachedItems[id];
                };
            };
            return function(name) {
                name = name || "__default__";
                if (!ns[name]) {
                    ns[name] = new Cache();
                }
                return ns[name];
            };
        }();
        return cache;
    });
    //! node_modules/hbjs/src/utils/iterators/each.js
    define("each", function() {
        var regex = /([^\s,]+)/g;
        function getParamNames(fn) {
            var funStr = fn.toString();
            return funStr.slice(funStr.indexOf("(") + 1, funStr.indexOf(")")).match(regex);
        }
        function each(list) {
            var params, handler, done;
            if (typeof arguments[1] === "function") {
                handler = arguments[1];
                done = arguments[2];
            } else {
                params = arguments[1] === null || arguments[1] === undefined ? {} : arguments[1];
                handler = arguments[2];
                done = arguments[3];
            }
            if (!list) {
                if (done) {
                    done(undefined, list, params);
                }
                return;
            }
            var next;
            var index = 0;
            var returnVal;
            var paramNames = getParamNames(handler);
            var keys;
            var len;
            if (list.length === undefined) {
                keys = Object.keys(list);
                len = keys.length;
            }
            var iterate = function() {
                len = keys ? len : list.length;
                if (index < len) {
                    try {
                        if (params) {
                            returnVal = handler(keys ? list[keys[index]] : list[index], keys ? keys[index] : index, list, params, next);
                        } else {
                            returnVal = handler(keys ? list[keys[index]] : list[index], keys ? keys[index] : index, list, next);
                        }
                    } catch (e) {
                        if (done) {
                            done(e, list, params);
                        } else {
                            throw e;
                        }
                    }
                    if (returnVal !== undefined) {
                        iterate = null;
                        if (done) {
                            done(returnVal, list, params);
                            return;
                        }
                        return returnVal;
                    }
                    if (!next) {
                        index += 1;
                        iterate();
                    }
                } else if (typeof done === "function") {
                    iterate = null;
                    done(null, list, params);
                }
            };
            var now = Date.now();
            function iter(threshold) {
                var current;
                index += 1;
                if (threshold) {
                    current = Date.now();
                    if (current < now + threshold) {
                        current = Date.now();
                        iterate();
                        return;
                    }
                    now = current;
                }
                setTimeout(iterate, 0);
            }
            if (params) {
                if (paramNames && paramNames.length === 5) {
                    next = iter;
                }
            } else {
                if (paramNames && paramNames.length === 4) {
                    next = iter;
                }
            }
            var syncReturnVal = iterate();
            if (syncReturnVal !== undefined) {
                return syncReturnVal;
            }
            if (!done && params) {
                return params;
            }
        }
        return each;
    });
    //! node_modules/hbjs/src/hb/utils/directive.js
    define("hb.directive", [ "hb.val" ], function(val) {
        return val;
    });
    //! node_modules/hbjs/src/hb/utils/compiler.js
    define("hb.compiler", [ "each", "fromDashToCamel", "hb.template", "toDOM", "extend", "hb.debug" ], function(each, fromDashToCamel, template, toDOM, extend, debug) {
        function Compiler($app) {
            var compileCount = 0;
            var compileRegistry = {};
            var ID = $app.name + "-id";
            var injector = $app.injector;
            var interpolator = $app.interpolator;
            var self = this;
            var bindParseRx;
            var transclude = /<hb\-transclude><\/hb-transclude>/i;
            var isUrl = /(\w|\-)+\.\w+$/;
            function extend(target, source) {
                var args = Array.prototype.slice.call(arguments, 0), i = 1, len = args.length, item, j;
                while (i < len) {
                    item = args[i];
                    for (j in item) {
                        if (item.hasOwnProperty(j)) {
                            target[j] = source[j];
                        }
                    }
                    i += 1;
                }
                return target;
            }
            function removeComments(el, index, list, parent) {
                if (el) {
                    if (el.nodeType === 8) {
                        parent.removeChild(el);
                    } else if (el.childNodes) {
                        each(el.childNodes, el, removeComments);
                    }
                } else {
                    return true;
                }
            }
            function cleanBindOnce(str, scope, watchId) {
                str = str.trim();
                str = scope.$handleBindOnce && scope.$handleBindOnce(str, null, watchId) || str;
                return str;
            }
            function parseBinds(str, o, watchId) {
                if (str && o) {
                    bindParseRx = bindParseRx || new RegExp($app.bindingMarkup[0] + "(.*?)" + $app.bindingMarkup[1], "mg");
                    str = str.replace(bindParseRx, function(a, b) {
                        var r = interpolator.invoke(o, cleanBindOnce(b, o, watchId), debug.ignoreErrors);
                        return typeof r === "string" || typeof r === "number" ? r : typeof r === "object" ? JSON.stringify(r, null, 2) : "";
                    });
                }
                return str;
            }
            function invokeLink(directive, index, list, el) {
                var scope = $app.findScope(el);
                injector.invoke(directive.options.link, scope, {
                    scope: scope,
                    el: el,
                    attr: getAttributes(el),
                    alias: directive.alias
                });
            }
            function getAttributes(el) {
                var attr = {}, i;
                for (i = 0; i < el.attributes.length; i += 1) {
                    var at = el.attributes[i];
                    var key = fromDashToCamel((at.name || at.localName || at.nodeName).replace(/^data\-/, ""));
                    attr[key] = at.value;
                }
                return attr;
            }
            function unlink() {
                if (this.$id) {
                    delete $app.elements[this.$id];
                }
            }
            function link(el, scope) {
                if (el) {
                    el.setAttribute(ID, scope.$id);
                    $app.elements[scope.$id] = el;
                    scope.$on("$destroy", unlink);
                    el.scope = scope;
                }
            }
            function findDirectives(el, scope, compileId) {
                var attributes = el.attributes, nodeName = el.nodeName.toLowerCase(), attrs = [], attr, returnVal = [], i, len = attributes.length, leftovers = [], rLen = 0;
                el.compiledIds = el.compiledIds || {};
                el.compiled = el.compiled || {};
                if (!el.compiled[nodeName]) {
                    attrs[0] = {
                        name: nodeName,
                        value: ""
                    };
                }
                for (i = 0; i < len; i += 1) {
                    attr = attributes[i];
                    if (!el.compiledIds[compileId] && !el.compiled[attr.name]) {
                        attrs.push({
                            name: attr.name,
                            value: el.getAttribute(attr.name)
                        });
                    }
                }
                len = attrs.length;
                for (i = 0; i < len; i += 1) {
                    attr = attrs[i];
                    rLen = returnVal.length;
                    getDirectiveFromAttr(attr, returnVal, leftovers);
                    if (returnVal.length !== rLen) {
                        el.compiledIds[compileId] = 1;
                        el.compiled[attr.name] = 1;
                    }
                }
                processLeftovers(el, leftovers, scope);
                return returnVal;
            }
            function getDirectiveFromAttr(attr, returnVal, leftovers) {
                var name = attr ? attr.name.split("-").join("") : "";
                var directiveFn = injector.val(name);
                if (directiveFn) {
                    returnVal.push({
                        options: injector.invoke(directiveFn),
                        alias: {
                            name: attr.name,
                            value: attr.value
                        }
                    });
                } else if (attr.value && attr.value.indexOf($app.bindingMarkup[0]) !== -1) {
                    leftovers.push(attr);
                }
            }
            function processLeftovers(el, leftovers, scope) {
                var len = leftovers.length, attr;
                for (var i = 0; i < len; i += 1) {
                    attr = leftovers[i];
                    if (!el.compiled[attr.name] && attr.value.indexOf("{{") !== -1) {
                        el.compiled[attr.name] = 1;
                        el.setAttribute(attr.name, parseBinds(attr.value, el.scope || scope));
                    }
                }
            }
            function createChildScope(parentScope, el, isolated, data) {
                var scope = parentScope.$new(isolated);
                link(el, scope);
                extend(scope, data);
                return scope;
            }
            function createWatchers(node, index, list, scope) {
                if (node.nodeType === 3) {
                    if (node.nodeValue.indexOf($app.bindingMarkup[0]) !== -1 && !hasNodeWatcher(scope, node)) {
                        var value = node.nodeValue;
                        var watchId = scope.$watch(function() {
                            return parseBinds(value, scope, watchId);
                        }, function(newVal) {
                            if (newVal === undefined || newVal === null || newVal + "" === "NaN") {
                                newVal = "";
                            }
                            node.nodeValue = newVal;
                        });
                        scope.$w[0].node = node;
                    }
                } else if (node && node.getAttribute && !node.getAttribute(ID) && node.childNodes.length) {
                    each(node.childNodes, scope, createWatchers);
                }
            }
            function hasNodeWatcher(scope, node) {
                var i = 0, len = scope.$w.length;
                while (i < len) {
                    if (scope.$w[i].node === node) {
                        return true;
                    }
                    i += 1;
                }
                return false;
            }
            function compile(el, scope, compileId) {
                compileId = compileId || function() {
                    compileCount += 1;
                    return compileCount;
                }();
                if (!compileRegistry[compileId]) {
                    compileRegistry[compileId] = 1;
                    debug.warn("COMPILE " + compileId);
                }
                if (el) {
                    if (el.nodeType !== 8) {
                        var directives = findDirectives(el, scope, compileId), links = [];
                        if (directives && directives.length) {
                            each(directives, {
                                el: el,
                                scope: scope,
                                links: links
                            }, compileDirective);
                            each(links, el, invokeLink);
                        }
                    }
                    scope = el.scope || scope;
                    var i = 0, len = el.children && el.children.length || 0;
                    while (i < len) {
                        if (!el.children[i].compiledIds || !el.children[i].compiledIds[compileId]) {
                            compile(el.children[i], scope, compileId);
                        }
                        i += 1;
                    }
                    if (el.getAttribute(ID)) {
                        compileWatchers(el, scope);
                    }
                }
                return el;
            }
            function compileWatchers(el, scope) {
                each(el.childNodes, scope, createWatchers);
            }
            function copyAttr(attr, index, list, params) {
                if (attr.name === "class") {
                    var classes = attr.value.split(" ");
                    for (var i = 0; i < classes.length; i += 1) {
                        params.el.classList.add(classes[i]);
                    }
                    return;
                }
                if (attr.name === "hb-class") {
                    var hbcls = params.el.getAttribute("hb-class") || "";
                    hbcls = hbcls && hbcls.replce(/\{|\}/g, "");
                    var val = attr.value.replace(/\{|\}/g, "");
                    attr.value = "{" + (hbcls ? hbcls + "," : "") + val + "}";
                }
                params.el.setAttribute(attr.name, attr.value);
                var el = params.el;
                compile(el, el.scope, el.nodeName.toLowerCase() + ":replace-" + compileCount);
            }
            function compileDirective(directive, index, list, params) {
                var str = "string";
                var options = directive.options, scope, el = params.el, parentScope = params.scope, links = params.links;
                var tpl;
                if (el.loading) {
                    return;
                }
                if (options.tplUrl && typeof options.tplUrl === str) {
                    tpl = $app.val(options.tplUrl);
                    if (!tpl) {
                        el.loading = true;
                        template.get($app, options.tplUrl, function() {
                            el.compiled = false;
                            delete el.loading;
                            compile(params.el, params.scope);
                            params.scope.$digest();
                        });
                        return;
                    }
                }
                if (!el.scope && options.scope) {
                    if (options.widget) {
                        el.setAttribute("data-ng-non-bindable", "");
                    }
                    scope = createChildScope(parentScope, el, typeof directive.options.scope === "object", directive.options.scope);
                }
                if (options.tpl) {
                    tpl = typeof options.tpl === str ? options.tpl : injector.invoke(options.tpl, scope || el.scope, {
                        scope: scope || el.scope,
                        el: el,
                        alias: directive.alias
                    });
                }
                if (options.tplUrl && !(typeof options.tplUrl === str)) {
                    tpl = $app.val(injector.invoke(options.tplUrl, scope || el.scope, {
                        scope: scope || el.scope,
                        el: el,
                        alias: directive.alias
                    }));
                }
                if (tpl) {
                    if (options.replace) {
                        var tmpItem = toDOM(tpl);
                        each(tmpItem.attributes, {
                            el: el,
                            directives: list
                        }, copyAttr);
                        tpl = tmpItem.innerHTML;
                    }
                    if (transclude.test(tpl)) {
                        tpl = tpl.replace(transclude, el.innerHTML);
                    }
                    if (isUrl.test(tpl)) {
                        console.warn("partial url not found for '" + tpl + "'.");
                    }
                    el.innerHTML = tpl;
                }
                links.push(directive);
            }
            self.link = link;
            self.compile = compile;
            self.parseBinds = parseBinds;
        }
        return function(module) {
            return new Compiler(module);
        };
    });
    //! node_modules/hbjs/src/hb/directives/class.js
    define("hbClass", [ "hb.directive" ], function(directive) {
        directive("hbClass", function() {
            return {
                link: [ "scope", "el", "alias", "$app", function(scope, el, alias, $app) {
                    var watchId = scope.$watch(function hbClass() {
                        scope.$handleBindOnce(alias, "value", watchId);
                        this.expr = alias.value;
                        var classes = $app.interpolate(scope, alias.value, true), contained;
                        for (var e in classes) {
                            if (classes.hasOwnProperty(e)) {
                                contained = el.classList.contains(e);
                                if (classes[e]) {
                                    el.classList.add(e);
                                } else if (contained) {
                                    el.classList.remove(e);
                                }
                            }
                        }
                    });
                } ]
            };
        });
    });
    //! node_modules/hbjs/src/utils/formatters/fromDashToCamel.js
    define("fromDashToCamel", function() {
        var rx = /-([a-z])/g;
        function fn(g) {
            return g[1].toUpperCase();
        }
        return function(str) {
            return str.replace(rx, fn);
        };
    });
    //! node_modules/hbjs/src/hb/utils/template.js
    define("hb.template", [ "http", "hb.debug", "each" ], function(http, debug, each) {
        var loading = {};
        function onLoad($app, url) {
            while (loading[url].length) {
                loading[url].shift()($app.template(url));
            }
            delete loading[url];
        }
        function loadTemplate($app, url, callback) {
            var isLoading = !!loading[url];
            loading[url] = loading[url] || [];
            loading[url].push(callback);
            if (!$app.template(url)) {
                if (!isLoading) {
                    var u = ($app.template("templatesBaseUrl") || "") + url;
                    debug.info("load template", u);
                    http.get({
                        url: u,
                        success: function(r) {
                            $app.template(url, r.data);
                            onLoad($app, url);
                        },
                        error: function() {
                            $app.template(url, '<div class="e404">OOPS! "' + u + '" - 404 Not Found!</div>');
                            onLoad($app, url);
                        }
                    });
                }
                return;
            }
            onLoad($app, url);
        }
        function loadTemplateItem(item, index, list, $app, next) {
            loadTemplate($app, item, next);
        }
        function loadTemplates($app, url, callback) {
            if (typeof url === "object") {
                each(url, $app, loadTemplateItem, callback);
                return;
            }
            loadTemplate($app, url, callback);
        }
        return {
            get: loadTemplates
        };
    });
    //! node_modules/hbjs/src/utils/ajax/http.js
    define("http", [ "extend" ], function(extend) {
        var serialize = function(obj) {
            var str = [];
            for (var p in obj) if (obj.hasOwnProperty(p)) {
                str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
            }
            return str.join("&");
        };
        var win = window, CORSxhr = function() {
            var xhr;
            if (win.XMLHttpRequest && "withCredentials" in new win.XMLHttpRequest()) {
                xhr = win.XMLHttpRequest;
            } else if (win.XDomainRequest) {
                xhr = win.XDomainRequest;
            }
            return xhr;
        }(), methods = [ "head", "get", "post", "put", "delete" ], i, methodsLength = methods.length, result = {};
        function Request(options) {
            this.init(options);
        }
        function getRequestResult(that) {
            var headers = parseResponseHeaders(this.getAllResponseHeaders());
            var response = this.responseText.trim();
            var start;
            var end;
            if (response) {
                start = response[0];
                end = response[response.length - 1];
            }
            if (response && (start === "{" && end === "}") || start === "[" && end === "]") {
                response = response ? JSON.parse(response.replace(/\/\*.*?\*\//g, "")) : response;
            }
            return {
                data: response,
                request: {
                    method: that.method,
                    url: that.url,
                    data: that.data,
                    headers: that.headers
                },
                headers: headers,
                status: this.status
            };
        }
        Request.prototype.init = function(options) {
            var that = this;
            that.xhr = new CORSxhr();
            that.method = options.method;
            that.url = options.url;
            that.success = options.success;
            that.error = options.error;
            that.data = options.data;
            that.headers = options.headers;
            that.timeout = options.timeout;
            that.ontimeout = options.ontimeout;
            that.async = options.async === undefined ? true : options.async;
            if (options.credentials === true) {
                that.xhr.withCredentials = true;
            }
            that.send();
            return that;
        };
        Request.prototype.send = function() {
            var that = this;
            if (that.method === "GET" && that.data) {
                var concat = that.url.indexOf("?") > -1 ? "&" : "?";
                that.url += concat + serialize(that.data);
            } else {
                that.data = JSON.stringify(that.data);
            }
            if (that.success !== undefined) {
                that.xhr.onload = function() {
                    var result = getRequestResult.call(this, that), self = this;
                    function onLoad() {
                        if (self.status >= 200 && self.status < 400) {
                            that.success.call(self, result);
                        } else if (that.error !== undefined) {
                            that.error.call(self, result);
                        }
                    }
                    if (this.onloadInterceptor) {
                        this.onloadInterceptor(onLoad, result);
                    } else {
                        onLoad();
                    }
                };
            }
            if (that.timeout) {
                that.xhr.timeout = that.timeout;
                that.xhr.ontimeout = function() {
                    var result = getRequestResult.call(this, that);
                    if (that.ontimeout) {
                        that.ontimeout.call(this, result);
                    } else if (that.error) {
                        that.error.call(this, result);
                    }
                };
            }
            if (that.error !== undefined) {
                that.xhr.error = function() {
                    var result = getRequestResult.call(this, that);
                    that.error.call(this, result);
                };
            }
            that.xhr.open(that.method, that.url, that.async);
            if (that.headers !== undefined) {
                that.setHeaders();
            }
            that.xhr.send(that.data);
            return that;
        };
        Request.prototype.setHeaders = function() {
            var that = this, headers = that.headers, key;
            for (key in headers) {
                if (headers.hasOwnProperty(key)) {
                    that.xhr.setRequestHeader(key, headers[key]);
                }
            }
            return that;
        };
        function parseResponseHeaders(str) {
            var list = str.split("\n");
            var headers = {};
            var parts;
            var i = 0, len = list.length;
            while (i < len) {
                parts = list[i].split(": ");
                if (parts[0] && parts[1]) {
                    parts[0] = parts[0].split("-").join("").split("");
                    parts[0][0] = parts[0][0].toLowerCase();
                    headers[parts[0].join("")] = parts[1];
                }
                i += 1;
            }
            return headers;
        }
        function addDefaults(options, defaults) {
            return extend(options, defaults);
        }
        function handleInterceptor(options) {
            return !!(result.intercept && result.intercept(options, Request));
        }
        for (i = 0; i < methodsLength; i += 1) {
            (function() {
                var method = methods[i];
                result[method] = function(url, success, error) {
                    var options = {};
                    if (url === undefined) {
                        throw new Error("CORS: url must be defined");
                    }
                    if (typeof url === "object") {
                        options = url;
                    } else {
                        if (typeof success === "function") {
                            options.success = success;
                        }
                        if (typeof error === "function") {
                            options.error = error;
                        }
                        options.url = url;
                    }
                    options.method = method.toUpperCase();
                    addDefaults(options, result.defaults);
                    if (handleInterceptor(options)) {
                        return;
                    }
                    return new Request(options).xhr;
                };
            })();
        }
        result.intercept = null;
        result.defaults = {
            headers: {}
        };
        return result;
    });
    //! node_modules/hbjs/src/utils/data/extend.js
    define("extend", [ "isWindow", "apply", "toArray", "isArray", "isDate", "isRegExp" ], function(isWindow, apply, toArray, isArray, isDate, isRegExp) {
        var extend = function(target, source) {
            if (isWindow(source)) {
                throw Error("Can't extend! Making copies of Window instances is not supported.");
            }
            if (source === target) {
                return target;
            }
            var args = toArray(arguments), i = 1, len = args.length, item, j;
            var options = this || {}, copy;
            if (!target && source && typeof source === "object") {
                target = {};
            }
            while (i < len) {
                item = args[i];
                for (j in item) {
                    if (item.hasOwnProperty(j)) {
                        if (isDate(item[j])) {
                            target[j] = new Date(item[j].getTime());
                        } else if (isRegExp(item[j])) {
                            target[j] = new RegExp(item[j]);
                        } else if (j === "length" && target instanceof Array) {} else if (target[j] && typeof target[j] === "object" && !item[j] instanceof Array) {
                            target[j] = apply(extend, options, [ target[j], item[j] ]);
                        } else if (isArray(item[j])) {
                            copy = options && options.concat ? (target[j] || []).concat(item[j]) : item[j];
                            if (options && options.arrayAsObject) {
                                if (!target[j]) {
                                    target[j] = {
                                        length: copy.length
                                    };
                                }
                                if (target[j] instanceof Array) {
                                    target[j] = apply(extend, options, [ {}, target[j] ]);
                                }
                            } else {
                                target[j] = target[j] || [];
                            }
                            if (copy.length) {
                                target[j] = apply(extend, options, [ target[j], copy ]);
                            }
                        } else if (item[j] && typeof item[j] === "object") {
                            if (options.objectAsArray && typeof item[j].length === "number") {
                                if (!(target[j] instanceof Array)) {
                                    target[j] = apply(extend, options, [ [], target[j] ]);
                                }
                            }
                            target[j] = apply(extend, options, [ target[j] || {}, item[j] ]);
                        } else if (options.override !== false || target[j] === undefined) {
                            target[j] = item[j];
                        }
                    }
                }
                i += 1;
            }
            return target;
        };
        return extend;
    });
    //! node_modules/hbjs/src/utils/validators/isWindow.js
    define("isWindow", function() {
        var isWindow = function(obj) {
            return obj && obj.document && obj.location && obj.alert && obj.setInterval;
        };
        return isWindow;
    });
    //! node_modules/hbjs/src/utils/data/apply.js
    define("apply", [ "isFunction" ], function(isFunction) {
        return function(func, scope, args) {
            if (!isFunction(func)) {
                return;
            }
            args = args || [];
            switch (args.length) {
              case 0:
                return func.call(scope);

              case 1:
                return func.call(scope, args[0]);

              case 2:
                return func.call(scope, args[0], args[1]);

              case 3:
                return func.call(scope, args[0], args[1], args[2]);

              case 4:
                return func.call(scope, args[0], args[1], args[2], args[3]);

              case 5:
                return func.call(scope, args[0], args[1], args[2], args[3], args[4]);

              case 6:
                return func.call(scope, args[0], args[1], args[2], args[3], args[4], args[5]);
            }
            return func.apply(scope, args);
        };
    });
    //! node_modules/hbjs/src/utils/validators/isFunction.js
    define("isFunction", function() {
        var isFunction = function(val) {
            return typeof val === "function";
        };
        return isFunction;
    });
    //! node_modules/hbjs/src/utils/formatters/toArray.js
    define("toArray", [ "isArguments", "isArray", "isUndefined" ], function(isArguments, isArray, isUndefined) {
        var toArray = function(value) {
            if (isArguments(value)) {
                return Array.prototype.slice.call(value, 0) || [];
            }
            try {
                if (isArray(value)) {
                    return value;
                }
                if (!isUndefined(value)) {
                    return [].concat(value);
                }
            } catch (e) {}
            return [];
        };
        return toArray;
    });
    //! node_modules/hbjs/src/utils/validators/isArguments.js
    define("isArguments", function() {
        var toString = function() {
            var value = [];
            for (var e in this) {
                if (this.hasOwnProperty(e)) {
                    value.push("" + e);
                }
            }
            return "[" + value.join(", ") + "]";
        };
        var isArguments = function(value) {
            var str = String(value);
            var isArguments = str === "[object Arguments]";
            if (!isArguments) {
                isArguments = str !== "[object Array]" && value !== null && typeof value === "object" && typeof value.length === "number" && value.length >= 0 && (!value.callee || toString.call(value.callee) === "[object Function]");
            }
            return isArguments;
        };
        return isArguments;
    });
    //! node_modules/hbjs/src/utils/validators/isArray.js
    define("isArray", function() {
        Array.prototype.__isArray = true;
        Object.defineProperty(Array.prototype, "__isArray", {
            enumerable: false,
            writable: true
        });
        var isArray = function(val) {
            return val ? !!val.__isArray : false;
        };
        return isArray;
    });
    //! node_modules/hbjs/src/utils/validators/isUndefined.js
    define("isUndefined", function() {
        var isUndefined = function(val) {
            return typeof val === "undefined";
        };
        return isUndefined;
    });
    //! node_modules/hbjs/src/utils/validators/isDate.js
    define("isDate", function() {
        var isDate = function(val) {
            return val instanceof Date;
        };
        return isDate;
    });
    //! node_modules/hbjs/src/utils/validators/isRegExp.js
    define("isRegExp", function() {
        var isRegExp = function(value) {
            return Object.prototype.toString.call(value) === "[object RegExp]";
        };
        return isRegExp;
    });
    //! node_modules/hbjs/src/hb/debug/debug.js
    define("hb.debug", function() {
        var errors = {
            E0: "",
            E1: "",
            E2: "",
            E3: "",
            E4: "",
            E5: "",
            E6a: "",
            E6b: "",
            E7: "",
            E8: "",
            E9: "",
            E10: "",
            E11: "",
            E12: ""
        };
        var fn = function() {};
        var statItem = {
            clear: fn,
            next: fn,
            inc: fn,
            dec: fn
        };
        var db = {
            log: fn,
            info: fn,
            warn: fn,
            error: fn,
            stat: function() {
                return statItem;
            },
            getStats: fn,
            flushStats: fn
        };
        for (var i in errors) {
            errors[i] = i;
        }
        return {
            ignoreErrors: true,
            log: fn,
            info: fn,
            warn: fn,
            register: function() {
                return db;
            },
            liveStats: fn,
            getStats: fn,
            logStats: fn,
            stats: fn,
            errors: errors
        };
    });
    //! node_modules/hbjs/src/utils/formatters/toDOM.js
    define("toDOM", function() {
        var htmlToDOM = function(htmlStr) {
            var container = document.createElement("div");
            container.innerHTML = htmlStr;
            return container.firstElementChild;
        };
        return htmlToDOM;
    });
    //! node_modules/hbjs/src/hb/scope.js
    define("hb.scope", [ "hb.debug", "apply" ], function(debug, apply) {
        var DESTROY = "$destroy";
        var EMIT = "$emit";
        var BROADCAST = "$broadcast";
        var prototype = "prototype";
        var err = "error";
        var winConsole = console;
        var counter = 0;
        var watchCounter = 0;
        var destroying = {};
        var unwatching = [];
        var watchers = {};
        var db = debug.register("scope");
        var scopeCountStat = db.stat("scope count");
        var watchCount = db.stat("watch count");
        var digestStat = db.stat("$digest");
        var ignoreStat = db.stat("$ignore", "#CCC");
        var intv;
        var intvMax = 10;
        function toArgsArray(args) {
            return Array[prototype].slice.call(args, 0) || [];
        }
        function every(list, fn) {
            var returnVal = false;
            var i = 0, len = list.length;
            while (i < len) {
                if (fn(list[i])) {
                    returnVal = true;
                }
                i += 1;
            }
            return returnVal;
        }
        function isEqual(newValue, oldValue, deep) {
            if (deep) {
                return JSON.stringify(newValue) === oldValue;
            }
            return newValue === oldValue || typeof newValue === "number" && typeof oldValue === "number" && isNaN(newValue) && isNaN(oldValue);
        }
        function countScopes(scope) {
            var c = 1;
            for (var i = 0, len = scope.$c.length; i < len; i += 1) {
                c += countScopes(scope.$c[i]);
            }
            return c;
        }
        function execWatchers(scope) {
            if (scope.$$ignore) {
                ignoreStat.inc(countScopes(scope));
                return false;
            }
            digestStat.inc();
            var newValue, oldValue;
            var i = scope.$w.length;
            var watcher;
            var dirty = false;
            while (i--) {
                watcher = scope.$w[i];
                if (watcher && !watcher.dead) {
                    newValue = watcher.watchFn(scope);
                    oldValue = watcher.last;
                    if (newValue !== undefined && watcher.unwatchOnValue) {
                        unwatch(watcher.id);
                    }
                    if (!isEqual(newValue, oldValue, watcher.deep) || oldValue === initWatchVal) {
                        scope.$r.$lw = watcher;
                        watcher.last = watcher.deep ? JSON.stringify(newValue) : newValue;
                        if (scope.$benchmark) {
                            scope.$benchmark.watch(watcher, scope, newValue, oldValue === initWatchVal ? newValue : oldValue);
                        } else {
                            watcher.listenerFn(newValue, oldValue === initWatchVal ? newValue : oldValue, scope);
                        }
                        if (watcher.last === initWatchVal) {
                            watcher.last = oldValue = undefined;
                        }
                        dirty = true;
                    } else if (scope.$r.$lw === watcher) {
                        return dirty;
                    }
                }
            }
            return dirty;
        }
        function destroyChildren(scope, children) {
            if (children[0]) {
                children.pop()[DESTROY]();
                setTimeout(function() {
                    destroyChildren(scope, children);
                });
            } else {
                finalizeDestroy(scope);
            }
        }
        function finalizeDestroy(scope) {
            var i, $id = scope.$id, wl = scope.$w.length;
            for (i = 0; i < wl; i += 1) {
                unwatch(scope.$w[i].id);
            }
            scope.$w.length = 0;
            for (i in scope.$l) {
                if (scope.$l.hasOwnProperty(i)) {
                    scope.$l[i].length = 0;
                }
            }
            for (i in scope) {
                if (scope.hasOwnProperty(i)) {
                    scope[i] = null;
                    delete scope[i];
                }
            }
            delete destroying[$id];
            scopeCountStat.dec();
        }
        function unwatchWatcher(scope, watcher) {
            if (!watcher.dead) {
                delete watchers[watcher.id];
                watcher.dead = true;
                watcher.scope = scope;
                unwatching.push(watcher);
                if (!intv) {
                    intv = setInterval(onInterval);
                }
            }
        }
        function onInterval() {
            var watcher, scope, i, index;
            for (i = 0; i < intvMax && i < unwatching.length; i += 1) {
                watcher = unwatching.shift();
                scope = watcher.scope;
                watchCount.dec();
                if (scope && scope.$w && scope.$w.length && (index = scope.$w.indexOf(watcher)) !== -1) {
                    if (index !== -1) {
                        scope.$w.splice(index, 1);
                        scope.$r.$lw = null;
                        scope = null;
                        delete watcher.scope;
                        watcher = null;
                    }
                }
            }
            if (!unwatching.length) {
                clearInterval(intv);
                intv = 0;
            }
        }
        function isBindOnce(str) {
            return !!(str && str[0] === ":" && str[1] === ":");
        }
        function handleBindOnce(context, property, watchId) {
            var type = typeof context;
            var str = type === "string" ? context : context[property];
            if (isBindOnce(str)) {
                str = str.substr(2, str.length);
                watchId && unwatch(watchId);
            }
            if (type !== "string") {
                context[property] = str;
            }
            return str;
        }
        function unwatchAfterValue() {
            this.unwatchOnValue = true;
        }
        function stringWatchInterceptor(str) {
            return handleBindOnce(str, null, unwatchAfterValue, this);
        }
        function strWatcher() {
            var s = this.scope;
            return s.$interpolate(s, this.expr, debug.ignoreErrors);
        }
        function unwatch(watchId) {
            var w = watchers[watchId];
            if (w) {
                unwatchWatcher(w.scope, w);
            }
        }
        function generateId() {
            return (counter += 1).toString(36);
        }
        function initWatchVal() {}
        function Scope(interpolate) {
            var self = this;
            self.$id = generateId();
            self.$w = [];
            self.$lw = null;
            self.$aQ = [];
            self.$pQ = [];
            self.$r = self;
            self.$c = [];
            self.$l = {};
            self.$ph = null;
            self.$interpolate = interpolate;
            scopeCountStat.inc();
        }
        var scopePrototype = Scope.prototype;
        scopePrototype.$isBindOnce = isBindOnce;
        scopePrototype.$handleBindOnce = handleBindOnce;
        scopePrototype.$watchOnce = function(watchFn, listenFn, deep) {
            var watchId;
            if (typeof watchFn === "string") {
                return this.$watch("::" + watchFn, listenFn, deep);
            } else {
                watchId = this.$watch(function() {
                    unwatch(watchId);
                    apply(watchFn, this, arguments);
                }, listenFn, deep);
            }
        };
        scopePrototype.$unwatch = unwatch;
        scopePrototype.$watch = function(watchFn, listenerFn, deep) {
            var self = this, watcher;
            if (!watchFn) {
                return;
            }
            watcher = {
                id: watchCounter += 1,
                scope: self,
                expr: "",
                watchFn: watchFn,
                listenerFn: listenerFn || function() {},
                deep: !!deep,
                last: initWatchVal
            };
            if (typeof watchFn === "string") {
                watcher.expr = stringWatchInterceptor.call(watcher, watchFn);
                if (!watcher.expr) {
                    return;
                }
                watcher.watchFn = strWatcher;
            }
            self.$w.unshift(watcher);
            self.$r.$lw = null;
            self.$lw = null;
            watchers[watcher.id] = watcher;
            watchCount.inc();
            return watcher.id;
        };
        scopePrototype.$$digestOnce = function() {
            return this.$$scopes(execWatchers);
        };
        scopePrototype.$$getPhase = function() {
            return this.$r.$ph;
        };
        scopePrototype.$digest = function() {
            var ttl = 10;
            var dirty;
            var self = this;
            if (self.$$getPhase()) {
                return;
            }
            self.$r.$lw = null;
            self.$$beginPhase();
            do {
                while (self.$aQ.length) {
                    try {
                        var asyncTask = self.$aQ.shift();
                        asyncTask.scope.$eval(asyncTask.exp);
                    } catch (e) {
                        winConsole[err](e);
                    }
                }
                dirty = self.$$digestOnce();
                if ((dirty || self.$aQ.length) && !ttl--) {
                    self.$$clearPhase();
                    throw "10its";
                }
            } while (dirty || self.$aQ.length);
            while (self.$pQ.length) {
                try {
                    self.$pQ.shift()();
                } catch (e) {
                    winConsole[err](e);
                }
            }
            self.$$clearPhase();
        };
        scopePrototype.$eval = function(expr, execScope, $data) {
            var self = this;
            var s = execScope || self;
            s.$data = $data;
            var result = self.$interpolate(execScope || self, expr, debug.ignoreErrors);
            delete s.$data;
            return result;
        };
        scopePrototype.$apply = function(expr) {
            var self = this;
            if (self.$r.$ph) {
                self.$r.$$apply_pending = {
                    expr: expr
                };
                return;
            }
            if (!self.$isIgnored()) {
                try {
                    if (expr) {
                        return self.$eval(expr);
                    }
                } finally {
                    self.$r.$digest();
                }
            }
            if (self.$r.$$apply_pending) {
                setTimeout(applyLater.bind(self));
            }
        };
        function applyLater() {
            if (this.$r.$$apply_pending) {
                var pend = this.$r.$$apply_pending;
                delete this.$r.$$apply_pending;
                this.$apply(pend.expr);
            }
        }
        scopePrototype.$evalAsync = function(expr) {
            var self = this;
            if (!self.$ph && !self.$aQ.length) {
                setTimeout(function() {
                    if (self.$aQ.length) {
                        self.$r.$digest();
                    }
                }, 0);
            }
            self.$aQ.push({
                scope: self,
                exp: expr
            });
        };
        scopePrototype.$$beginPhase = function() {
            this.$r.$ph = true;
            digestStat.next();
            ignoreStat.next();
        };
        scopePrototype.$$clearPhase = function() {
            this.$r.$ph = null;
        };
        scopePrototype.$$postDigest = function(fn) {
            this.$pQ.push(fn);
        };
        scopePrototype.$new = function(isolated) {
            var child, self = this;
            if (isolated) {
                child = new Scope(self.$interpolate);
                child.$r = self.$r;
                child.$aQ = self.$aQ;
                child.$pQ = self.$pQ;
            } else {
                var ChildScope = function() {};
                ChildScope.prototype = self;
                child = new ChildScope();
                scopeCountStat.inc();
            }
            self.$c.push(child);
            child.$id = generateId();
            child.$w = [];
            child.$l = {};
            child.$c = [];
            child.$p = self;
            return child;
        };
        scopePrototype.$isIgnored = function() {
            var self = this;
            var ignored = self.$$ignore, scope = self;
            while (!ignored && scope.$p) {
                scope = scope.$p;
                ignored = scope.$$ignore;
            }
            return !!ignored;
        };
        scopePrototype.$ignore = function(enabled, childrenOnly) {
            var self = this;
            if (enabled !== undefined) {
                every(self.$c, function(scope) {
                    scope.$$ignore = enabled;
                });
                if (!childrenOnly) {
                    self.$$ignore = enabled;
                }
                if (!enabled && !self.$isIgnored()) {
                    self.$digest();
                }
            }
        };
        scopePrototype.$ignoreEvents = function(enabled, childrenOnly) {
            var self = this;
            if (enabled !== undefined) {
                every(self.$c, function(scope) {
                    scope.$$ignoreEvents = enabled;
                });
                if (!childrenOnly) {
                    self.$$ignoreEvents = enabled;
                }
            }
        };
        scopePrototype.$$scopes = function(fn) {
            var self = this;
            var dirty = fn(self);
            var childrenDirty = every(self.$c, function(child) {
                return child.$$scopes(fn);
            });
            return dirty || childrenDirty;
        };
        scopePrototype[DESTROY] = function() {
            if (destroying[this.$id]) {
                return;
            }
            var self = this;
            var $id = self.$id;
            if (self === self.$r) {
                return;
            }
            destroying[$id] = true;
            self[BROADCAST](DESTROY);
            var siblings = self.$p.$c;
            var indexOfThis = siblings.indexOf(self);
            if (indexOfThis >= 0) {
                siblings.splice(indexOfThis, 1);
                destroyChildren(self, self.$c.slice());
            }
        };
        scopePrototype.$on = function(eventName, listener) {
            var self = this;
            var listeners = self.$l[eventName];
            if (!listeners) {
                self.$l[eventName] = listeners = [];
            }
            listeners.push(listener);
            return function() {
                var index = listeners.indexOf(listener);
                if (index >= 0) {
                    listeners[index] = null;
                }
            };
        };
        scopePrototype.$emit = function(eventName) {
            var self = this;
            if (self.$$ignoreEvents && self.eventName !== DESTROY) {
                return;
            }
            apply(db.log, db, [ EMIT ].concat(arguments));
            var propagationStopped = false;
            var event = {
                name: eventName,
                targetScope: self,
                stopPropagation: function() {
                    propagationStopped = true;
                },
                preventDefault: function() {
                    event.defaultPrevented = true;
                }
            };
            var additionalArgs = toArgsArray(arguments);
            additionalArgs.shift();
            var listenerArgs = [ event ].concat(additionalArgs);
            var scope = self;
            do {
                event.currentScope = scope;
                scope.$$fire(eventName, listenerArgs);
                scope = scope.$p;
            } while (scope && !propagationStopped);
            return event;
        };
        scopePrototype.$broadcast = function(eventName) {
            var self = this;
            if (self.$$ignoreEvents && self.eventName !== DESTROY) {
                return;
            }
            apply(db.log, db, [ BROADCAST ].concat(arguments));
            var event = {
                name: eventName,
                targetScope: self,
                preventDefault: function() {
                    event.defaultPrevented = true;
                }
            };
            var additionalArgs = toArgsArray(arguments);
            additionalArgs.shift();
            var listenerArgs = [ event ].concat(additionalArgs);
            if (eventName === DESTROY) {
                self.$$fire(eventName, listenerArgs);
                return event;
            }
            self.$$scopes(function(scope) {
                event.currentScope = scope;
                scope.$$fire(eventName, listenerArgs);
                return true;
            });
            return event;
        };
        scopePrototype.$$fire = function(eventName, listenerArgs) {
            var listeners = this.$l[eventName] || [];
            var i = 0;
            while (i < listeners.length) {
                if (listeners[i] === null) {
                    listeners.splice(i, 1);
                } else {
                    apply(listeners[i], this, listenerArgs);
                    i++;
                }
            }
        };
        return function(interpolate) {
            return new Scope(interpolate);
        };
    });
    //! node_modules/hbjs/src/utils/patterns/injector.js
    define("injector", [ "isFunction", "toArray", "functionArgs", "apply" ], function(isFunction, toArray, functionArgs, apply) {
        var string = "string", func = "function", proto = Injector.prototype;
        function functionOrArray(fn) {
            var f;
            if (fn instanceof Array) {
                fn = fn.concat();
                f = fn.pop();
                f.$inject = fn;
                fn = f;
            }
            return fn;
        }
        function construct(constructor, args) {
            function F() {
                return apply(constructor, this, args);
            }
            F.prototype = constructor.prototype;
            return new F();
        }
        function Injector() {
            this.registered = {};
            this.preProcessor = null;
        }
        proto.val = function(name, value) {
            var n = name.toLowerCase(), override;
            if (value !== undefined) {
                this.registered[n] = value;
            } else if (this.preProcessor) {
                override = this.preProcessor(name, this.registered[n]);
                if (override !== undefined) {
                    this.registered[n] = override;
                }
            }
            return this.registered[n];
        };
        proto.invoke = function(fn, scope, locals) {
            fn = functionOrArray(fn);
            return apply(fn, scope, this.prepareArgs(fn, locals, scope));
        };
        proto.instantiate = function(fn, locals) {
            fn = functionOrArray(fn);
            return construct(fn, this.prepareArgs(fn, locals));
        };
        proto.prepareArgs = function(fn, locals, scope) {
            if (!fn.$inject) {
                fn.$inject = functionArgs(fn);
            }
            var args = fn.$inject ? fn.$inject.slice() : [], i, len = args.length;
            for (i = 0; i < len; i += 1) {
                this.getInjection(args[i], i, args, locals, scope);
            }
            return args;
        };
        proto.getArgs = functionArgs;
        proto.getInjection = function(type, index, list, locals, scope) {
            if (typeof type === "string" && type.charAt(0) === "'") {
                list[index] = type.substr(1, type.length - 2);
                return;
            }
            var result, cacheValue;
            if (locals && locals[type]) {
                result = locals[type];
            } else if ((cacheValue = this.val(type)) !== undefined) {
                result = cacheValue;
            }
            if (result === undefined) {
                console.warn("Injection not found for " + type);
                throw new Error("Injection not found for " + type);
            }
            if (result instanceof Array && typeof result[0] === string && typeof result[result.length - 1] === func) {
                result = this.invoke(result.concat(), scope);
            }
            list[index] = result;
        };
        return function() {
            var injector = new Injector();
            if (arguments.length && isFunction(arguments[0])) {
                return apply(injector.invoke, injector, toArray(arguments));
            }
            return injector;
        };
    });
    //! node_modules/hbjs/src/utils/parsers/functionArgs.js
    define("functionArgs", function() {
        var rx1 = /\(.*?\)/;
        var rx2 = /([\$\w])+/gm;
        return function(fn) {
            var str = (fn || "") + "";
            return str.match(rx1)[0].match(rx2) || [];
        };
    });
    //! node_modules/hbjs/src/hb/utils/interpolator.js
    define("interpolator", [ "each", "removeLineBreaks", "removeExtraSpaces", "apply" ], function(each, removeLineBreaks, removeExtraSpaces, apply) {
        var undefRx = / of undefined$/;
        function Interpolator(injector) {
            var self = this;
            var ths = "this";
            var filters = [];
            var strRefRx = /('|").*?[^\\]\1/g;
            var strRefRepRx = /(\.?[a-zA-Z\$\_]+\w?\b)(?!\s?\:)/g;
            var parseRx = /("|')?\w+\s?\1?\|\s?\w+/;
            var fixStrRefChar = "~*";
            var fixStrRefScope;
            var fixStrRefMatches = [];
            var fixStrRefCount;
            var getInjection = injector.getInjection.bind(injector);
            var errorHandler = function(er, extraMessage, data) {
                if (window.console && console.warn) {
                    console.warn(extraMessage + "\n" + er.message + "\n" + (er.stack || er.stacktrace || er.backtrace), data);
                }
            };
            function setErrorHandler(fn) {
                errorHandler = fn;
            }
            function interpolateError(er, scope, str, errorHandler) {
                if (errorHandler) {
                    errorHandler(er, 'Error evaluating: "' + str + '" against %o', scope);
                }
            }
            function replaceLookupStrDepth(str) {
                if (str.charAt(0) === ".") {
                    return str;
                }
                return lookupStrDepth(str, fixStrRefScope);
            }
            function swapStringMatchOut(str) {
                var result = fixStrRefChar + fixStrRefCount;
                fixStrRefMatches.push(str);
                fixStrRefCount += 1;
                return result;
            }
            function fixStrReferences(str, scope) {
                var i, len;
                fixStrRefCount = 0;
                fixStrRefMatches.length = 0;
                fixStrRefScope = scope;
                str = str.replace(strRefRx, swapStringMatchOut);
                str = str.replace(strRefRepRx, replaceLookupStrDepth);
                for (i = 0, len = fixStrRefMatches.length; i < len; i += 1) {
                    str = str.split(fixStrRefChar + i).join(fixStrRefMatches[i]);
                }
                return str;
            }
            function lookupStrDepth(str, scope) {
                str = str.trim();
                if (scope[str] === undefined && scope.hasOwnProperty(str)) {
                    delete scope[str];
                }
                var bool = str.toLowerCase();
                if (bool !== "true" && bool !== "false") {
                    return ths + "." + str;
                }
                return str;
            }
            function unfoundFilter(val) {
                return val;
            }
            function revertTick(val, index, list) {
                list[index] = val.split("`*`").join(":");
            }
            function parseFilter(str, scope, ignoreErrors) {
                if (str.indexOf("|") !== -1 && str.match(parseRx)) {
                    str = str.replace("||", "~~");
                    var parts = str.trim().split("|");
                    parts[1] = parts[1].replace("~~", "||");
                    each(parts, trimStrings);
                    if (parts[1].indexOf(":") !== -1) {
                        parts[1] = parts[1].replace(/(\')(.*?):(.*?)\1/g, "$1$2`*`$3$1");
                    }
                    parts[1] = parts[1].split(":");
                    var filterName = parts[1].shift().split("-").join(""), filter = injector.val(filterName), args;
                    if (!filter) {
                        return {
                            str: parts[0],
                            filter: unfoundFilter
                        };
                    } else {
                        args = parts[1];
                        each(args, revertTick);
                    }
                    for (var i = 0; i < args.length; i += 1) {
                        args[i] = interpolate(scope, args[i], ignoreErrors);
                    }
                    return {
                        filter: function(value) {
                            args.unshift(value);
                            return apply(injector.invoke(filter, scope, {
                                alias: filterName
                            }), scope, args);
                        },
                        str: parts[0]
                    };
                }
                return undefined;
            }
            function interpolate(scope, str, ignoreErrors) {
                var fn = Function, result, filter, i, len;
                if (str === null || str === undefined) {
                    return;
                }
                for (i = 0, len = filters.length; i < len; i += 1) {
                    str = filters[i](str);
                }
                if (!str) {
                    return;
                }
                filter = parseFilter(str, scope, ignoreErrors);
                if (filter) {
                    str = filter.str;
                }
                str = fixStrReferences(str, scope);
                result = apply(new fn("var result; try { result = " + str + "; } catch(er) { result = er; } finally { return result; }"), scope);
                if (result) {
                    if (result instanceof Error) {
                        if (!ignoreErrors && !undefRx.test(result.message)) {
                            interpolateError(result, scope, str, errorHandler);
                        }
                        result = undefined;
                    }
                }
                return filter ? filter.filter(result) : result;
            }
            function trimStrings(str, index, list) {
                list[index] = str && str.trim();
            }
            function addFilter(fn) {
                filters.push(fn);
            }
            function removeFilter(fn) {
                var index = filters.indexOf(fn);
                if (index !== -1) {
                    filters.splice(index, 1);
                }
            }
            self.addFilter = addFilter;
            self.removeFilter = removeFilter;
            self.invoke = interpolate;
            self.setErrorHandler = setErrorHandler;
            self.addFilter(removeLineBreaks);
            self.addFilter(removeExtraSpaces);
        }
        return function(injector) {
            return new Interpolator(injector);
        };
    });
    //! node_modules/hbjs/src/utils/formatters/removeLineBreaks.js
    define("removeLineBreaks", function() {
        var removeLineBreaks = function(str) {
            str = str + "";
            return str.replace(/(\r\n|\n|\r)/gm, "");
        };
        return removeLineBreaks;
    });
    //! node_modules/hbjs/src/utils/formatters/removeExtraSpaces.js
    define("removeExtraSpaces", function() {
        var removeExtraSpaces = function(str) {
            str = str + "";
            return str.replace(/\s+/g, " ");
        };
        return removeExtraSpaces;
    });
    //! node_modules/hbjs/src/hb/module.js
    /*!
 import hbd.app
 import hbd.model
 import hbEvents
 import hb.directive
 */
    define("module", [ "hb", "hb.compiler", "hb.scope", "hb.val", "injector", "interpolator", "removeHTMLComments", "each", "ready", "hb.debug", "hb.eventStash", "dispatcher" ], function(hb, compiler, scope, val, injector, interpolator, removeHTMLComments, each, ready, debug, events, dispatcher) {
        events.READY = "ready";
        events.RESIZE = "resize";
        var mod;
        function Module() {
            var self = this;
            self.name = "h";
            self.bootWait = 10;
            var rootEl;
            var _injector = this.injector = injector();
            var _interpolator = this.interpolator = interpolator(_injector);
            var _compiler = compiler(self);
            var compile = _compiler.compile;
            var interpolate = _interpolator.invoke;
            var injectorVal = _injector.val.bind(_injector);
            var rootScope = scope(interpolate);
            var docReady = false;
            var onAppReady = function() {
                val.init(self);
                if (!docReady) {
                    debug.warn("--- BOOTSTRAP BEFORE docReady ---");
                }
                if (!self.element()) {
                    debug.log("%cINITIAL COMPILE", "color:#F60");
                    self.element(document.body);
                } else {
                    debug.log("%cRE-COMPILE", "color:#F60");
                    compile(rootEl, rootScope);
                }
                rootScope.$apply();
            };
            ready(function() {
                debug.log("docReady");
                docReady = true;
            });
            rootScope.$ignoreInterpolateErrors = true;
            window.addEventListener("resize", function() {
                rootScope && rootScope.$broadcast(events.RESIZE);
            });
            injectorVal("$rootScope", rootScope);
            _injector.preProcessor = function(key, value) {
                if (value && value.isClass) {
                    return _injector.instantiate(value);
                }
            };
            function findScope(el) {
                if (!el) {
                    return null;
                }
                if (el.scope) {
                    return el.scope;
                }
                return findScope(el.parentNode);
            }
            function bootstrap(bootName, options, callback) {
                debug.log("bootstrap " + bootName, options);
                if (options) {
                    for (var i in options) {
                        if (options.hasOwnProperty(i)) {
                            debug.warn('val("' + i + '", ' + (typeof options[i] === "string" ? '"' + options[i] + '"' : options[1]) + ");");
                            val(i, options[i]);
                        }
                    }
                    val.init(self);
                }
                onAppReady();
                if (callback) {
                    callback();
                }
            }
            function addChild(parentEl, htmlStr, overrideScope, data, prepend) {
                if (!htmlStr) {
                    return;
                }
                if (parentEl !== rootEl && rootEl.contains && !rootEl.contains(parentEl)) {
                    throw new Error(debug.errors.E12, rootEl);
                }
                var scope = overrideScope || findScope(parentEl), child;
                if (prepend) {
                    parentEl.insertAdjacentHTML("afterbegin", removeHTMLComments(htmlStr));
                    child = parentEl.children[0];
                } else {
                    parentEl.insertAdjacentHTML("beforeend", removeHTMLComments(htmlStr));
                    child = parentEl.children[parentEl.children.length - 1];
                }
                return compileEl(child, overrideScope || scope, !!overrideScope, data);
            }
            function compileEl(el, scope, sameScope, data) {
                var s = sameScope && scope || scope.$new(), i;
                if (data) {
                    for (i in data) {
                        if (data.hasOwnProperty(i)) {
                            s[i] = data[i];
                        }
                    }
                }
                _compiler.link(el, s);
                compile(el, scope);
                return el;
            }
            function removeChild(childEl) {
                var list;
                if (childEl.scope) {
                    childEl.scope.$destroy();
                    childEl.scope = null;
                } else {
                    list = childEl.querySelectorAll(self.name + "-id");
                    each(list, removeChild);
                }
                childEl.remove();
            }
            function element(el) {
                if (typeof el !== "undefined") {
                    rootEl = el;
                    _compiler.link(rootEl, rootScope);
                    compile(rootEl, rootScope);
                }
                return rootEl;
            }
            function service(name, ClassRef) {
                if (ClassRef === undefined) {
                    return injectorVal(name);
                }
                ClassRef.isClass = true;
                return injectorVal(name, ClassRef);
            }
            self.events = events;
            self.bindingMarkup = [ "{{", "}}" ];
            self.elements = {};
            self.bootstrap = bootstrap;
            self.findScope = findScope;
            self.addChild = addChild;
            self.removeChild = removeChild;
            self.compile = compileEl;
            self.interpolate = interpolate;
            self.invoke = _injector.invoke.bind(_injector);
            self.element = element;
            self.val = injectorVal;
            self.factory = injectorVal;
            self.service = service;
            self.template = injectorVal;
            self.parseBinds = function(scope, str) {
                return _compiler.parseBinds(str, scope);
            };
            dispatcher(self);
            mod = self;
        }
        return function(name) {
            if (!name) {
                throw Error("Bootstrap requires name");
            }
            debug.log("register " + name);
            var app = mod || new Module();
            if (!app.val("$app")) {
                app.val("$app", app);
                app.val("$window", window);
            }
            return app;
        };
    });
    //! node_modules/hbjs/src/utils/browser/ready.js
    define("ready", function() {
        var callbacks = [], win = window, doc = document, ADD_EVENT_LISTENER = "addEventListener", REMOVE_EVENT_LISTENER = "removeEventListener", ATTACH_EVENT = "attachEvent", DETACH_EVENT = "detachEvent", DOM_CONTENT_LOADED = "DOMContentLoaded", ON_READY_STATE_CHANGE = "onreadystatechange", COMPLETE = "complete", READY_STATE = "readyState";
        var ready = function(callback) {
            callbacks.push(callback);
            if (doc[READY_STATE] === COMPLETE) {
                setTimeout(invokeCallbacks);
            }
        };
        var DOMContentLoaded;
        function invokeCallbacks() {
            var ary = callbacks.slice();
            callbacks.length = 0;
            for (var i = 0; i < ary.length; i += 1) {
                ary[i]();
            }
        }
        if (doc[ADD_EVENT_LISTENER]) {
            DOMContentLoaded = function() {
                doc[REMOVE_EVENT_LISTENER](DOM_CONTENT_LOADED, DOMContentLoaded, false);
                invokeCallbacks();
            };
        } else if (doc.attachEvent) {
            DOMContentLoaded = function() {
                if (doc[READY_STATE] === COMPLETE) {
                    doc[DETACH_EVENT](ON_READY_STATE_CHANGE, DOMContentLoaded);
                    invokeCallbacks();
                }
            };
        }
        if (doc[READY_STATE] === COMPLETE) {
            setTimeout(invokeCallbacks, 1);
        }
        if (doc[ADD_EVENT_LISTENER]) {
            doc[ADD_EVENT_LISTENER](DOM_CONTENT_LOADED, DOMContentLoaded, false);
            win[ADD_EVENT_LISTENER]("load", invokeCallbacks, false);
        } else if (doc[ATTACH_EVENT]) {
            doc[ATTACH_EVENT](ON_READY_STATE_CHANGE, DOMContentLoaded);
            win[ATTACH_EVENT]("onload", invokeCallbacks);
        }
        return ready;
    });
    //! node_modules/hbjs/src/hb/eventStash.js
    define("hb.eventStash", function() {
        var events = new function EventStash() {}();
        events.HB_READY = "hb::ready";
        return events;
    });
    //! node_modules/hbjs/src/utils/async/dispatcher.js
    define("dispatcher", [ "apply", "isFunction", "dispatcherEvent" ], function(apply, isFunction, Event) {
        function validateEvent(e) {
            if (!e) {
                throw Error("event cannot be undefined");
            }
        }
        var dispatcher = function(target, scope, map) {
            if (target && target.on && target.on.dispatcher) {
                return target;
            }
            target = target || {};
            var listeners = {};
            function getIndexOfListener(event, callback) {
                var list = listeners[event];
                if (list) {
                    for (var i = 0; i < list.length; i += 1) {
                        if (list[i].cb === callback) {
                            return i;
                        }
                    }
                }
                return -1;
            }
            function off(event, callback) {
                validateEvent(event);
                var index = getIndexOfListener(event, callback), list = listeners[event];
                if (index !== -1) {
                    list.splice(index, 1);
                }
            }
            function on(event, callback, priority) {
                if (isFunction(callback)) {
                    validateEvent(event);
                    listeners[event] = listeners[event] || [];
                    listeners[event].push({
                        cb: callback,
                        priority: priority !== undefined ? priority : 10
                    });
                    listeners[event].sort(prioritySort);
                    return function() {
                        off(event, callback);
                    };
                }
            }
            on.dispatcher = true;
            function once(event, callback, priority) {
                if (isFunction(callback)) {
                    validateEvent(event);
                    function fn() {
                        off(event, fn);
                        apply(callback, scope || target, arguments);
                    }
                    return on(event, fn, priority);
                }
            }
            function prioritySort(a, b) {
                return a.priority - b.priority;
            }
            function mapListeners(item, number, list) {
                list[number] = item.cb;
            }
            function getListeners(event, strict) {
                validateEvent(event);
                var list, a = "*";
                if (event || strict) {
                    list = [];
                    if (listeners[a]) {
                        list = listeners[a].concat(list);
                    }
                    if (listeners[event]) {
                        list = listeners[event].concat(list);
                    }
                    list.map(mapListeners);
                    return list;
                }
                return listeners;
            }
            function removeAllListeners() {
                listeners = {};
            }
            function fire(callback, args) {
                return callback && apply(callback, target, args);
            }
            function dispatch(event) {
                validateEvent(event);
                var list = getListeners(event, true), len = list.length, i, event = typeof event === "object" ? event : new Event(event);
                if (len) {
                    arguments[0] = event;
                    for (i = 0; i < len; i += 1) {
                        if (!event.immediatePropagationStopped) {
                            fire(list[i], arguments);
                        }
                    }
                }
                return event;
            }
            if (scope && map) {
                target.on = scope[map.on] && scope[map.on].bind(scope);
                target.off = scope[map.off] && scope[map.off].bind(scope);
                target.once = scope[map.once] && scope[map.once].bind(scope);
                target.dispatch = target.fire = scope[map.dispatch].bind(scope);
            } else {
                target.on = on;
                target.off = off;
                target.once = once;
                target.dispatch = target.fire = dispatch;
            }
            target.getListeners = getListeners;
            target.removeAllListeners = removeAllListeners;
            return target;
        };
        return dispatcher;
    });
    //! node_modules/hbjs/src/utils/async/dispatcher-event.js
    define("dispatcherEvent", function() {
        function Event(type) {
            this.type = type;
            this.defaultPrevented = false;
            this.propagationStopped = false;
            this.immediatePropagationStopped = false;
        }
        Event.prototype.preventDefault = function() {
            this.defaultPrevented = true;
        };
        Event.prototype.stopPropagation = function() {
            this.propagationStopped = true;
        };
        Event.prototype.stopImmediatePropagation = function() {
            this.immediatePropagationStopped = true;
        };
        Event.prototype.toString = function() {
            return this.type;
        };
        return Event;
    });
    //! node_modules/hbjs/src/utils/browser/loader.js
    define("loader", [ "toArray" ], function(toArray) {
        return function(doc) {
            var env, head, pending = {}, pollCount = 0, queue = {
                css: [],
                js: []
            }, styleSheets = doc.styleSheets, allFinished = [], loadedUrls = {};
            gatherUrls();
            window.addEventListener("load", gatherUrls);
            function gatherUrls() {
                var url, tags = document.querySelectorAll("script,style,link");
                for (var i = 0; i < tags.length; i += 1) {
                    url = tags[i].src || tags[i].href;
                    if (url && !loadedUrls[url]) {
                        loadedUrls[url] = 1;
                    }
                }
            }
            function createNode(name, attrs) {
                var node = doc.createElement(name), attr;
                for (attr in attrs) {
                    if (attrs.hasOwnProperty(attr)) {
                        node.setAttribute(attr, attrs[attr]);
                    }
                }
                return node;
            }
            function finish(type) {
                var p = pending[type], callback, urls;
                if (p) {
                    callback = p.callback;
                    urls = p.urls;
                    urls.shift();
                    pollCount = 0;
                    if (!urls.length) {
                        callback && callback.call(p.context, p.obj);
                        pending[type] = null;
                        queue[type].length && load(type);
                    }
                    allFinish();
                }
            }
            function getPendingCount() {
                return queue.css.length + (pending.css ? 1 : 0) + queue.js.length + (pending.js ? 1 : 0);
            }
            function allFinish() {
                if (!getPendingCount()) {
                    for (var i = 0; i < allFinished.length; i += 1) {
                        allFinished[i]();
                    }
                }
            }
            function getEnv() {
                var ua = navigator.userAgent;
                env = {
                    async: doc.createElement("script").async === true
                };
                (env.webkit = /AppleWebKit\//.test(ua)) || (env.ie = /MSIE|Trident/.test(ua)) || (env.opera = /Opera/.test(ua)) || (env.gecko = /Gecko\//.test(ua)) || (env.unknown = true);
            }
            function load(type, urls, callback, obj, context) {
                var _finish = function() {
                    finish(type);
                }, isCSS = type === "css", nodes = [], i, len, node, p, pendingUrls, url;
                env || getEnv();
                if (urls) {
                    urls = typeof urls === "string" ? [ urls ] : urls.concat();
                    for (var i = 0; i < urls.length; i += 1) {
                        if (loadedUrls[urls[i]]) {
                            if (window.console && window.console.warn) {
                                console.warn("**** SKIPPED DUPLICATE URL [" + urls[i] + "]");
                            }
                            urls.splice(i, 1);
                            i -= 1;
                        } else {
                            loadedUrls[urls[i]] = 1;
                        }
                    }
                    if (urls.length) {
                        if (isCSS || env.async || env.gecko || env.opera) {
                            queue[type].push({
                                urls: urls,
                                callback: callback,
                                obj: obj,
                                context: context
                            });
                        } else {
                            for (i = 0, len = urls.length; i < len; ++i) {
                                queue[type].push({
                                    urls: [ urls[i] ],
                                    callback: i === len - 1 ? callback : null,
                                    obj: obj,
                                    context: context
                                });
                            }
                        }
                    } else if (callback) {
                        callback();
                    }
                }
                if (pending[type] || !(p = pending[type] = queue[type].shift())) {
                    return;
                }
                head || (head = doc.head || doc.getElementsByTagName("head")[0]);
                pendingUrls = p.urls.concat();
                if (!pendingUrls.length && p.callback) {
                    p.callback();
                }
                for (i = 0, len = pendingUrls.length; i < len; ++i) {
                    url = pendingUrls[i];
                    if (isCSS) {
                        node = env.gecko ? createNode("style") : createNode("link", {
                            href: url,
                            rel: "stylesheet"
                        });
                    } else {
                        node = createNode("script", {
                            src: url
                        });
                        node.async = false;
                    }
                    node.className = "lazyload";
                    node.setAttribute("charset", "utf-8");
                    if (env.ie && !isCSS && "onreadystatechange" in node && !("draggable" in node)) {
                        node.onreadystatechange = function() {
                            if (/loaded|complete/.test(node.readyState)) {
                                node.onreadystatechange = null;
                                _finish();
                            }
                        };
                    } else if (isCSS && (env.gecko || env.webkit)) {
                        if (env.webkit) {
                            p.urls[i] = node.href;
                            pollWebKit();
                        } else {
                            node.innerHTML = '@import "' + url + '";';
                            pollGecko(node);
                        }
                    } else {
                        node.onload = node.onerror = _finish;
                    }
                    nodes.push(node);
                }
                for (i = 0, len = nodes.length; i < len; ++i) {
                    head.appendChild(nodes[i]);
                }
            }
            function pollGecko(node) {
                var hasRules;
                try {
                    hasRules = !!node.sheet.cssRules;
                } catch (ex) {
                    pollCount += 1;
                    if (pollCount < 200) {
                        setTimeout(function() {
                            pollGecko(node);
                        }, 50);
                    } else {
                        hasRules && finish("css");
                    }
                    return;
                }
                finish("css");
            }
            function pollWebKit() {
                var css = pending.css, i;
                if (css) {
                    i = styleSheets.length;
                    while (--i >= 0) {
                        if (styleSheets[i].href === css.urls[0]) {
                            finish("css");
                            break;
                        }
                    }
                    pollCount += 1;
                    if (css) {
                        if (pollCount < 200) {
                            setTimeout(pollWebKit, 50);
                        } else {
                            finish("css");
                        }
                    }
                }
            }
            return {
                allFinished: function(fn) {
                    allFinished.push(fn);
                    allFinish();
                },
                getPendingCount: getPendingCount,
                css: function(urls, callback, obj, context) {
                    load("css", urls, callback, obj, context);
                },
                js: function(urls, callback, obj, context) {
                    load("js", urls, callback, obj, context);
                },
                load: function(urls, callback, obj, context) {
                    var count = 0;
                    urls = toArray(urls);
                    var len = urls ? urls.length : 0;
                    function incCount() {
                        if (++count === urls.length) {
                            callback.call(context, obj);
                        }
                    }
                    if (len) {
                        for (var i = 0; i < len; i++) {
                            var url = urls[i];
                            if (/.js\?|.js$/im.test(url)) {
                                this.js(url, incCount, obj, context);
                            } else if (/.css\?|.css/im.test(url)) {
                                this.css(url, incCount, obj, context);
                            } else {
                                console.warn("Unknown type: " + url);
                            }
                        }
                    } else {
                        callback.call(context, obj);
                    }
                }
            };
        }(window.document);
    });
    //! node_modules/hbjs/src/utils/browser/findScriptUrls.js
    define("findScriptUrls", [], function() {
        return function(pattern) {
            var type = typeof pattern, i, tags = document.querySelectorAll("script"), matches = [], src;
            for (i = 0; i < tags.length; i++) {
                src = tags[i].src || "";
                if (type === "string") {
                    if (src.indexOf(pattern) !== -1) {
                        matches.push(src);
                    }
                } else if (pattern.test(src)) {
                    matches.push(src);
                }
            }
            return matches;
        };
    });
    //! node_modules/hbjs/src/hb/directives/repeat.js
    //! pattern /hb\-repeat\=/
    define("hbRepeat", [ "hb.directive", "each", "asyncRender", "hb.debug", "hb.eventStash", "filter", "apply", "debounce" ], function(directive, each, asyncRender, debug, events, filter, apply, debounce) {
        events.REPEAT_RENDER_CHUNK_COMPLETE = "repeat::render_chunk_complete";
        events.REPEAT_RENDER_COMPLETE = "repeat::render_complete";
        directive("hbRepeat", function() {
            var DOWN = "down";
            var UP = "up";
            function trimStrings(str, index, list) {
                list[index] = str && str.trim();
            }
            var db = debug.register("hb-repeat");
            var asyncEvents = db.stat("async events");
            var pattern = /(\w+)\s+in\s+([\w\.]+)(\|(.*?)$)?$/;
            return {
                link: [ "scope", "el", "alias", "attr", "$app", function(scope, el, alias, attr, $app) {
                    var template = el.children[0].outerHTML;
                    var postDigest;
                    el.removeChild(el.children[0]);
                    var statement = alias.value;
                    var match = statement.match(pattern);
                    statement = [];
                    if (match && match.length) {
                        for (var i = 1; i < match.length; i += 1) {
                            statement.push(match[i]);
                        }
                    }
                    each(statement, trimStrings);
                    var itemName = statement[0], watch = statement[1], filterFn = statement[3] && statement[3].split(":");
                    var intv;
                    var intvAfter;
                    var currentList;
                    var async = false;
                    var topDown = attr.topDown && scope.$eval(attr.topDown) || 0;
                    var bottomUp = attr.bottomUp && scope.$eval(attr.bottomUp) || 0;
                    var asyncEnabled = topDown || bottomUp || false;
                    var ar = asyncRender.create();
                    var firstPass = true;
                    var pending = false;
                    ar.on(events.ASYNC_RENDER_CHUNK_END, asyncRenderNext);
                    ar.on(events.ASYNC_RENDER_COMPLETE, renderComplete);
                    function removeUntil(len) {
                        var child;
                        while (el.children.length > len) {
                            child = el.children[el.children.length - 1];
                            if (child.scope && child.scope !== scope) {
                                child.scope.$destroy();
                            }
                            el.removeChild(child);
                        }
                    }
                    function preRender(list, oldList) {
                        var len = list && list.length || 0;
                        clearTimeout(intvAfter);
                        intvAfter = 0;
                        if (!pending) {
                            asyncEvents.next();
                            currentList = list;
                            ar.setup(bottomUp && firstPass ? UP : DOWN, topDown || bottomUp || len, len);
                            render(list, oldList);
                        } else if (async) {
                            pending = true;
                            currentList = list;
                        }
                    }
                    function asyncRenderNext() {
                        if (asyncEnabled && async) {
                            clearTimeout(intv);
                            intv = setTimeout(next);
                        } else {
                            next();
                        }
                    }
                    function next() {
                        clearTimeout(intv);
                        if (ar.next()) {
                            render(currentList);
                            if (asyncEnabled && async) {
                                asyncEvents.inc();
                                scope.$emit(events.REPEAT_RENDER_CHUNK_COMPLETE, currentList, ar.index, ar.maxLen);
                            }
                        }
                    }
                    function renderComplete() {
                        clearInterval(intv);
                        clearInterval(intvAfter);
                        intv = null;
                        intvAfter = null;
                        if (asyncEnabled && async) {
                            asyncEvents.inc();
                            scope.$emit(events.REPEAT_RENDER_COMPLETE, currentList);
                        }
                        firstPass = !(currentList && currentList.length);
                        if (pending) {
                            async = false;
                            pending = false;
                            intv = setTimeout(function() {
                                clearTimeout(intv);
                                preRender(currentList);
                                scope.$digest();
                            });
                        }
                    }
                    function createRow(list, el, index) {
                        var data = {};
                        data[itemName] = list[index];
                        data.$index = index;
                        var s = scope.$new();
                        var child = $app.addChild(el, template, s, data, ar.direction === ar.up);
                        if (ar.size) {
                            s.$digest();
                        }
                        return child;
                    }
                    function updateRow(list, child, index) {
                        var s = child.scope;
                        s[itemName] = list[index];
                        s.$index = index;
                    }
                    function destroy() {
                        clearInterval(intv);
                    }
                    function findChildIndex(index) {
                        var s, e;
                        for (var i = 0, len = el.children.length; i < len; i += 1) {
                            e = el.children[i];
                            s = el.children[i].scope;
                            if (s && s.$index === index) {
                                return e;
                            }
                        }
                    }
                    function render(list, oldList) {
                        var len, child;
                        if (list && (len = list.length)) {
                            removeUntil(len);
                            while (!ar.complete && !ar.atChunkEnd && list[ar.index]) {
                                child = findChildIndex(ar.index);
                                if (child && (!child.scope || child.scope.$index !== ar.index)) {
                                    child = null;
                                }
                                if (!child) {
                                    async = true;
                                    child = createRow(list, el, ar.index);
                                } else if (list[ar.index]) {
                                    updateRow(list, child, ar.index);
                                    async = false;
                                }
                                ar.inc();
                            }
                        } else {
                            removeUntil(0);
                        }
                    }
                    function setHideShowClasses(index, active, inactive) {
                        if (!el.children[index].classList.contains(active)) {
                            el.children[index].classList.add(active);
                            if (el.children[index].classList.contains(inactive)) {
                                el.children[index].classList.remove(inactive);
                            }
                        }
                    }
                    function releasePost() {
                        postDigest = null;
                    }
                    function onPostDigestFor$filter() {
                        var fn = filterFn[0];
                        var show = scope.$eval(filterFn[1]);
                        var hide = scope.$eval(filterFn[2]);
                        for (var i = 0; i < scope.$c.length; i += 1) {
                            var val = scope.$c[i].$eval(fn);
                            if (val) {
                                setHideShowClasses(i, show, hide);
                            } else if (!val) {
                                setHideShowClasses(i, hide, show);
                            }
                        }
                        releasePost();
                    }
                    function checkFoPost() {
                        if (!postDigest) {
                            postDigest = onPostDigestFor$filter;
                            scope.$$postDigest(postDigest);
                        }
                    }
                    scope.$watch(watch, preRender, true);
                    if (filterFn) {
                        scope.$watch(checkFoPost);
                    }
                    scope.$on("$destroy", destroy);
                } ]
            };
        });
    });
    //! node_modules/hbjs/src/hb/utils/asyncRender.js
    define("asyncRender", [ "dispatcher", "hb.eventStash" ], function(dispatcher, events) {
        var UP = "up";
        var DOWN = "down";
        events.ASYNC_RENDER_CHUNK_END = "async::chunk_end";
        events.ASYNC_RENDER_COMPLETE = "async::complete";
        function AsyncRender() {
            this.down = DOWN;
            this.up = UP;
            this.direction = DOWN;
            this.index = 0;
            this.len = 0;
            this.maxLen = 0;
            this.size = 0;
            this.complete = false;
            this.atChunkEnd = false;
            dispatcher(this);
        }
        var p = AsyncRender.prototype;
        p.setup = function(direction, size, maxLen) {
            this.direction = direction;
            this.size = size;
            this.len = 0;
            this.maxLen = maxLen;
            this.atChunkEnd = false;
            this.complete = false;
            this.index = direction === DOWN ? 0 : maxLen - 1;
        };
        p.inc = function() {
            if (this.complete || this.atChunkEnd) {
                return;
            }
            if (this.direction === DOWN) {
                if (this.index < this.len) {
                    this.index += 1;
                    if (this.index === this.len) {
                        this.finishChunk();
                    }
                } else {
                    this.finishChunk();
                }
            } else {
                if (this.index > this.maxLen - this.len - 1) {
                    this.index -= 1;
                }
                if (this.index <= this.maxLen - this.len - 1) {
                    this.finishChunk();
                }
            }
        };
        p.finishChunk = function() {
            if (!this.complete && !this.atChunkEnd) {
                this.atChunkEnd = true;
                if ((this.index === -1 || this.index === this.maxLen) && this.len === this.maxLen) {
                    this.finish();
                }
                this.dispatch(events.ASYNC_RENDER_CHUNK_END);
            }
        };
        p.next = function() {
            if (this.complete) {
                this.dispatch(events.ASYNC_RENDER_COMPLETE);
                this.direction = DOWN;
                return false;
            }
            var increase = Math.min(this.size, this.maxLen);
            if (!increase) {
                return false;
            }
            if (this.len + increase > this.maxLen) {
                increase = this.maxLen - this.len;
            }
            if (this.direction === UP) {
                this.index = this.maxLen - this.len - 1;
            }
            this.len += increase;
            this.atChunkEnd = false;
            return true;
        };
        p.finish = function() {
            this.complete = true;
        };
        return {
            create: function() {
                return new AsyncRender();
            }
        };
    });
    //! node_modules/hbjs/src/utils/data/filter.js
    define("filter", function() {
        var filter = function(list, method) {
            var i = 0, len, result = [], extraArgs, response;
            if (arguments.length > 2) {
                extraArgs = Array.prototype.slice.apply(arguments);
                extraArgs.splice(0, 2);
            }
            if (list && list.length) {
                len = list.length;
                while (i < len) {
                    response = method.apply(null, [ list[i], i, list ].concat(extraArgs));
                    if (response) {
                        result.push(list[i]);
                    }
                    i += 1;
                }
            } else {
                for (i in list) {
                    if (list.hasOwnProperty(i)) {
                        response = method.apply(null, [ list[i], i, list ].concat(extraArgs));
                        if (response) {
                            result.push(list[i]);
                        }
                    }
                }
            }
            return result;
        };
        return filter;
    });
    //! node_modules/hbjs/src/utils/async/debounce.js
    define("debounce", function() {
        var debounce = function(func, wait, scope) {
            var timeout;
            return function() {
                var context = scope || this, args = arguments;
                clearTimeout(timeout);
                timeout = setTimeout(function() {
                    timeout = null;
                    func.apply(context, args);
                }, wait);
                return function() {
                    clearTimeout(timeout);
                    timeout = null;
                };
            };
        };
        return debounce;
    });
    //! node_modules/hbjs/src/hb/directives/model.js
    define("hbModel", [ "hb.directive", "resolve", "query", "hb.debug", "debounce" ], function(directive, resolve, query, debug, debounce) {
        var $ = query, SELECTED_OPTIONS = "selectedOptions", CHECKED = "checked", VALUE = "value", INNER_TEXT = "innerText", RADIO = "radio";
        directive("hbModel", function() {
            return {
                link: [ "scope", "el", "alias", "attr", function(scope, el, alias, attr) {
                    var $el = $(el), multipleSelect = false, prop = getProp(), values = alias.value.split(":");
                    scope.$watch(values[0], setValue);
                    var onChange = attr.hbModelChange;
                    var invalidate = debounce(function() {
                        if (scope && scope.$apply) {
                            scope.$apply();
                        }
                    });
                    function getProp() {
                        if (el.type && el.type === "select-one") {
                            multipleSelect = false;
                            return SELECTED_OPTIONS;
                        }
                        if (el.type && el.type === "select") {
                            multipleSelect = true;
                            return SELECTED_OPTIONS;
                        }
                        if (el.type && el.type === "checkbox" || el.type && el.type === RADIO) {
                            return CHECKED;
                        }
                        if (el.hasOwnProperty("value") || el.__proto__.hasOwnProperty("value")) {
                            return VALUE;
                        }
                        if (el.hasOwnProperty("innerText") || el.__proto__.hasOwnProperty("innerText")) {
                            return INNER_TEXT;
                        }
                    }
                    function setValue(value) {
                        var changed = false;
                        value = value === undefined ? "" : value;
                        if (prop === SELECTED_OPTIONS && !multipleSelect) {
                            for (var i = 0; i < el.options.length; i += 1) {
                                if (el.options[i].value === value || el.options[i].value === value.value) {
                                    changed = true;
                                    el.options.selectedIndex = i;
                                    break;
                                }
                            }
                        } else if (prop === CHECKED && el.type === RADIO) {
                            changed = true;
                            var val = el.value === "true" ? true : el.value === "false" ? false : el.value;
                            if (val === value) {
                                el.setAttribute(CHECKED, "");
                            } else {
                                el.removeAttribute(CHECKED);
                            }
                        } else {
                            changed = true;
                            el[prop] = value;
                        }
                        if (changed && onChange) {
                            scope.$eval(onChange);
                        }
                        if (attr.hbValid) {
                            scope.$eval(attr.hbValid, scope, {
                                target: el,
                                property: alias.value,
                                value: getValue(),
                                validity: el.validity,
                                validationMessage: el.validationMessage
                            });
                        }
                    }
                    function getValue() {
                        if (prop === SELECTED_OPTIONS && !multipleSelect) {
                            return el[prop][0] && el[prop][0].value;
                        }
                        if (prop === CHECKED && el.type === RADIO) {
                            return document.querySelector('input[name="' + el.name + '"]:checked').value;
                        }
                        return el[prop] || "";
                    }
                    function eventHandler(evt) {
                        resolve(scope).set(values[0], getValue());
                        var change = el.getAttribute("hb-change");
                        if (change) {
                            scope.$event = evt;
                            scope.$eval(change);
                        }
                        invalidate();
                    }
                    $el.bind(values[1] || "change input onpropertychange", eventHandler);
                    scope.$on("$destroy", function() {
                        $el.unbindAll();
                    });
                } ]
            };
        });
    });
    //! node_modules/hbjs/src/utils/query/event/bind.js
    //! pattern /(\s|query)\(.*?\)\.bind\(/
    define("query.bind", [ "query" ], function(query) {
        query.fn.bind = query.fn.on = function(events, handler) {
            events = events.match(/\w+/gim);
            var i = 0, event, len = events.length;
            while (i < len) {
                event = events[i];
                this.each(function(index, el) {
                    if (el.attachEvent) {
                        el["e" + event + handler] = handler;
                        el[event + handler] = function() {
                            el["e" + event + handler](window.event);
                        };
                        el.attachEvent("on" + event, el[event + handler]);
                    } else {
                        el.addEventListener(event, handler, false);
                    }
                    if (!el.eventHolder) {
                        el.eventHolder = [];
                    }
                    el.eventHolder[el.eventHolder.length] = [ event, handler ];
                });
                i += 1;
            }
            return this;
        };
    });
    //! node_modules/hbjs/src/utils/query/query.js
    define("query", function() {
        function Query(selector, context) {
            this.init(selector, context);
        }
        var queryPrototype = Query.prototype = Object.create(Array.prototype);
        var eqRx = /:eq\((\-?\d+)\)$/;
        function parseEQFilter(scope, selector) {
            var match, count;
            match = selector.indexOf(":eq(");
            if (match !== -1) {
                match = selector.match(eqRx);
                selector = selector.replace(eqRx, "");
                count = match && match[1] !== undefined ? Number(match[1]) : -1;
                var nodes = scope.context.querySelectorAll(selector);
                if (count !== undefined) {
                    if (nodes[count]) {
                        scope.push(nodes[count]);
                    }
                    return true;
                }
            }
            return false;
        }
        queryPrototype.selector = "";
        function getElementClass(context) {
            var win = window;
            if (context) {
                if (context.parentWindow) {
                    win = context.parentWindow;
                } else if (context.defaultWindow) {
                    win = context.defaultWindow;
                }
            }
            return win.Element;
        }
        queryPrototype.init = function(selector, context) {
            this.context = context;
            var ElementClass = getElementClass(context);
            if (typeof selector === "string") {
                if (selector.substr(0, 1) === "<" && selector.substr(selector.length - 1, 1) === ">") {
                    this.parseHTML(selector);
                } else {
                    this.parseSelector(selector, context);
                }
            } else if (selector instanceof Array) {
                this.parseArray(selector);
            } else if (selector instanceof ElementClass) {
                this.parseElement(selector);
            }
        };
        queryPrototype.parseHTML = function(html) {
            var container = document.createElement("div");
            container.innerHTML = html;
            this.length = 0;
            this.parseArray(container.children);
        };
        queryPrototype.parseSelector = function(selector, context) {
            var ElementClass = getElementClass(context);
            var i, nodes, len;
            this.selector = selector;
            if (context instanceof ElementClass) {
                this.context = context;
            } else if (context instanceof Query) {
                this.context = context[0];
            } else if (context && context.nodeType === 9) {
                this.context = context;
            } else {
                this.context = document;
            }
            if (!parseEQFilter(this, selector)) {
                nodes = this.context.querySelectorAll(selector);
                len = nodes.length;
                i = 0;
                this.length = 0;
                while (i < len) {
                    this.push(nodes[i]);
                    i += 1;
                }
            }
        };
        queryPrototype.parseArray = function(list) {
            var ElementClass = (this.context.parentWindow || this.context.defaultView).Element;
            var i = 0, len = list.length;
            this.length = 0;
            while (i < len) {
                if (list[i] instanceof ElementClass) {
                    this.push(list[i]);
                }
                i += 1;
            }
        };
        queryPrototype.parseElement = function(element) {
            this.length = 0;
            this.push(element);
        };
        queryPrototype.toString = function() {
            if (this.length) {
                return this[0].outerHTML;
            }
        };
        queryPrototype.each = function(fn) {
            var i = 0, len = this.length, result;
            while (i < len) {
                result = fn.apply(this[i], [ i, this[i] ]);
                if (result === false) {
                    break;
                }
                i += 1;
            }
            return this;
        };
        var query = function(selector, context) {
            for (var n in query.fn) {
                if (query.fn.hasOwnProperty(n)) {
                    queryPrototype[n] = query.fn[n];
                    delete query.fn[n];
                }
            }
            return new Query(selector, context);
        };
        query.fn = {};
        return query;
    });
    //! node_modules/hbjs/src/utils/query/event/unbind.js
    //! pattern /(\s|query)\(.*?\)\.unbind\(/
    define("query.unbind", [ "query" ], function(query) {
        query.fn.unbind = query.fn.off = function(events, handler) {
            if (arguments.length === 1) {
                this.unbindAll(events);
            } else {
                events = events.match(/\w+/gim);
                var i = 0, event, len = events.length;
                while (i < len) {
                    event = events[i];
                    this.each(function(index, el) {
                        if (el.detachEvent) {
                            el.detachEvent("on" + event, el[event + handler]);
                            el[event + handler] = null;
                        } else {
                            el.removeEventListener(event, handler, false);
                        }
                    });
                    i += 1;
                }
            }
            return this;
        };
    });
    //! node_modules/hbjs/src/utils/query/event/unbindAll.js
    //! pattern /(\s|query)\(.*?\)\.unbindAll\(/
    define("query.unbindAll", [ "query" ], function(query) {
        query.fn.unbindAll = function(event) {
            var scope = this;
            scope.each(function(index, el) {
                if (el.eventHolder) {
                    var removed = 0, handler;
                    for (var i = 0; i < el.eventHolder.length; i++) {
                        if (!event || el.eventHolder[i][0] === event) {
                            event = el.eventHolder[i][0];
                            handler = el.eventHolder[i][1];
                            if (el.detachEvent) {
                                el.detachEvent("on" + event, el[event + handler]);
                                el[event + handler] = null;
                            } else {
                                el.removeEventListener(event, handler, false);
                            }
                            el.eventHolder.splice(i, 1);
                            removed += 1;
                            i -= 1;
                        }
                    }
                }
            });
            return scope;
        };
    });
    //! node_modules/hbjs/src/utils/data/resolve.js
    define("resolve", [ "isUndefined" ], function(isUndefined) {
        var aryIndexRx = /\[(.*?)\]/g;
        function pathToArray(path, delimiter) {
            if (path instanceof Array) {
                return path;
            }
            delimiter = delimiter || ".";
            path = path || "";
            path = path.replace(aryIndexRx, delimiter + "$1");
            return path.split(delimiter);
        }
        function Resolve(data) {
            this.data = data || {};
        }
        var proto = Resolve.prototype;
        proto.get = function(path, delimiter) {
            var arr = pathToArray(path, delimiter), space = "", i = 0, len = arr.length;
            var data = this.data;
            while (data && i < len) {
                space = arr[i];
                data = data[space];
                if (data === undefined) {
                    break;
                }
                i += 1;
            }
            return data;
        };
        proto.set = function(path, value, delimiter) {
            if (isUndefined(path)) {
                throw new Error('Resolve requires "path"');
            }
            var arr = pathToArray(path, delimiter), space = "", i = 0, len = arr.length - 1;
            var data = this.data;
            while (i < len) {
                space = arr[i];
                if (data[space] === undefined) {
                    data = data[space] = {};
                } else {
                    data = data[space];
                }
                i += 1;
            }
            if (arr.length > 0) {
                data[arr.pop()] = value;
            }
            return this.data;
        };
        proto.default = function(path, value, delimiter) {
            if (isUndefined(this.get(path, delimiter))) {
                this.set(path, value, delimiter);
            }
        };
        proto.clear = function() {
            var d = this.data;
            for (var e in d) {
                if (d.hasOwnProperty(e)) {
                    delete d[e];
                }
            }
        };
        proto.path = function(path) {
            return this.set(path, {});
        };
        var resolve = function(data) {
            return new Resolve(data);
        };
        return resolve;
    });
    //! node_modules/hbjs/src/hb/directives/attr.js
    //! pattern /hb\-(src|alt|title|pattern|id|for|name|checked|disabled|value|href)\=/
    define("hbAttr", [ "hb.directive" ], function(directive) {
        var names = [ "src", "alt", "title", "pattern", "id", "for", "name", "checked", "disabled", "value", "href", "placeholder", "content", "maxlength", "min", "max", "pattern" ];
        function generate(scope, el, alias) {
            var attr = alias.name.split("-").pop();
            scope.$watch(alias.value, function(newVal) {
                if (newVal) {
                    el.setAttribute(attr, newVal);
                } else {
                    el.removeAttribute(attr);
                }
            });
        }
        for (var i = 0; i < names.length; i += 1) {
            var n = names[i] || "";
            directive("hb" + n.charAt(0).toUpperCase() + n.substr(1, n.length), function() {
                return {
                    link: [ "scope", "el", "alias", generate ]
                };
            });
        }
    });
    //! node_modules/hbjs/src/hb/directives/attr/class.js
    define("hb.attr.class", [ "hb.directive" ], function(directive) {
        directive("class", function() {
            return {
                link: [ "scope", "el", "$app", function(scope, el, $app) {
                    var len = el.classList.length, bindClasses = [], watchId;
                    for (var i = 0; i < len; i += 1) {
                        if (el.classList[i].indexOf($app.bindingMarkup[0]) !== -1) {
                            bindClasses.push({
                                bindOnce: scope.$isBindOnce(el.classList[i]),
                                bind: el.classList[i],
                                last: ""
                            });
                            el.classList.remove(el.classList[i]);
                            i -= 1;
                            len -= 1;
                        }
                    }
                    function classAttr() {
                        this.expr = "class";
                        var i, len = bindClasses.length, result, item;
                        for (i = 0; i < len; i += 1) {
                            item = bindClasses[i];
                            result = $app.parseBinds(scope, item.bind);
                            if (result !== item.last && item.last) {
                                el.classList.remove(item.last);
                            }
                            if (result) {
                                el.classList.add(result);
                            }
                            if (item.bindOnce) {
                                bindClasses.splice(i, 1);
                                i -= 1;
                                if (!bindClasses.length) {
                                    scope.$unwatch(watchId);
                                }
                            }
                            item.last = result;
                        }
                    }
                    if (bindClasses.length) {
                        watchId = scope.$watch(classAttr);
                    }
                    scope.$on("$destroy", function() {
                        bindClasses.length = 0;
                        scope = null;
                        el = null;
                        $app = null;
                    });
                } ]
            };
        });
    });
    //! src/widgets/packages/bh-packages.js
    define("bhPackages", [ "hb.directive" ], function(directive) {
        directive("bhPackages", function() {
            return {
                scope: true,
                tpl: "<div class=\"bh-packages\"> <div class=\"bh-packages-header\">Packages</div> <div class=\"bh-package-columns\"> <div class=\"bh-package-column\"> <div class=\"bh-package-column-header\"> Beginners Luck </div> <p>Free Initial Consultation</p> <ul> <li> <span class=\"item-title\">Program</span> <span class=\"item-value\">6 Weeks</span> </li> <li> <span class=\"item-title\">Emails</span> <span class=\"item-value\">3</span> </li> <li> <span class=\"item-title\">Phone Calls</span> <span class=\"item-value\">2</span> </li> <li> <span class=\"item-title\">Skype Calls</span> <span class=\"item-value\">1</span> </li> <li> <span class=\"item-title\">Notebook and Pen</span> <span class=\"item-value\">Yes</span> </li> <li> <span class=\"item-title\">Health Tips</span> <span class=\"item-value\">Yes</span> </li> <li> <span class=\"item-title\">Recipes</span> <span class=\"item-value\">Yes</span> </li> <li> <span class=\"item-title\">Menu Plans</span> <span class=\"item-value\">1</span> </li> </ul> <form action=\"https://www.paypal.com/cgi-bin/webscr\" method=\"post\" target=\"_top\"> <input type=\"hidden\" name=\"cmd\" value=\"_s-xclick\"> <input type=\"hidden\" name=\"hosted_button_id\" value=\"5EF69AZDMR7E2\"> <input type=\"image\" src=\"http://becky4health.com/images/buynow.svg\" border=\"0\" name=\"submit\" alt=\"PayPal - The safer, easier way to pay online!\" style=\"width:160px;height:45px;\"> <img alt=\"\" border=\"0\" src=\"https://www.paypalobjects.com/en_US/i/scr/pixel.gif\" width=\"1\" height=\"1\"> </form> </div> <div class=\"bh-package-column\"> <div class=\"bh-package-column-header\"> The New You </div> <p>Free Initial Consultation</p> <ul> <li> <span class=\"item-title\">Program</span> <span class=\"item-value\">6 Weeks</span> </li> <li> <span class=\"item-title\">Emails</span> <span class=\"item-value\">3</span> </li> <li> <span class=\"item-title\">Phone Calls</span> <span class=\"item-value\">2</span> </li> <li> <span class=\"item-title\">Skype Calls</span> <span class=\"item-value\">1</span> </li> <li> <span class=\"item-title\">Notebook and Pen</span> <span class=\"item-value\">Yes</span> </li> <li> <span class=\"item-title\">Health Tips</span> <span class=\"item-value\">Yes</span> </li> <li> <span class=\"item-title\">Recipes</span> <span class=\"item-value\">Yes</span> </li> <li> <span class=\"item-title\">Menu Plans</span> <span class=\"item-value\">1</span> </li> </ul> <form action=\"https://www.paypal.com/cgi-bin/webscr\" method=\"post\" target=\"_top\"> <input type=\"hidden\" name=\"cmd\" value=\"_s-xclick\"> <input type=\"hidden\" name=\"hosted_button_id\" value=\"3DHSWEV2HQ82J\"> <input type=\"image\" src=\"http://becky4health.com/images/buynow.svg\" border=\"0\" name=\"submit\" alt=\"PayPal - The safer, easier way to pay online!\" style=\"width:160px;height:45px;\"> <img alt=\"\" border=\"0\" src=\"https://www.paypalobjects.com/en_US/i/scr/pixel.gif\" width=\"1\" height=\"1\"> </form> </div> <div class=\"bh-package-column\"> <div class=\"bh-package-column-header\"> Make it Stick </div> <p>Free Initial Consultation</p> <ul> <li> <span class=\"item-title\">Program</span> <span class=\"item-value\">6 Weeks</span> </li> <li> <span class=\"item-title\">Emails</span> <span class=\"item-value\">3</span> </li> <li> <span class=\"item-title\">Phone Calls</span> <span class=\"item-value\">2</span> </li> <li> <span class=\"item-title\">Skype Calls</span> <span class=\"item-value\">1</span> </li> <li> <span class=\"item-title\">Notebook and Pen</span> <span class=\"item-value\">Yes</span> </li> <li> <span class=\"item-title\">Health Tips</span> <span class=\"item-value\">Yes</span> </li> <li> <span class=\"item-title\">Recipes</span> <span class=\"item-value\">Yes</span> </li> <li> <span class=\"item-title\">Menu Plans</span> <span class=\"item-value\">1</span> </li> </ul> <form action=\"https://www.paypal.com/cgi-bin/webscr\" method=\"post\" target=\"_top\"> <input type=\"hidden\" name=\"cmd\" value=\"_s-xclick\"> <input type=\"hidden\" name=\"hosted_button_id\" value=\"BCDSCYGJDW468\"> <input type=\"image\" src=\"http://becky4health.com/images/buynow.svg\" border=\"0\" name=\"submit\" alt=\"PayPal - The safer, easier way to pay online!\" style=\"width:160px;height:45px;\"> <img alt=\"\" border=\"0\" src=\"https://www.paypalobjects.com/en_US/i/scr/pixel.gif\" width=\"1\" height=\"1\"> </form> </div> </div></div>",
                link: [ "scope", "el", function(scope, el) {} ]
            };
        });
    });
    //! src/application/bhApp.js
    internal("bhApp", [ "app", "hb.debug.dev", "hb.directive", "each" ], function(app, debug, directive, each) {
        exports.boot = function() {
            app.bootstrap(document.body);
        };
        window.validateForm = function() {
            return false;
        };
        directive("bhApp", function() {
            return {
                scope: true,
                link: [ "scope", "el", "attr", function(scope, el, attr) {
                    scope.model = {
                        title: "Becky For Health Signup Form",
                        profile: {
                            firstName: {
                                name: "first_name",
                                label: "First Name",
                                pattern: "[A-Za-z]+",
                                error: "Please enter your first name.",
                                classes: ""
                            },
                            lastName: {
                                name: "last_name",
                                label: "Last Name",
                                pattern: "[A-Za-z]+",
                                error: "Please enter your last name.",
                                classes: ""
                            },
                            email: {
                                name: "email",
                                label: "Email",
                                pattern: "[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,3}$",
                                error: "Please enter a valid email address.",
                                classes: ""
                            },
                            phone: {
                                name: "phone",
                                label: "Phone",
                                subtext: "###-###-####",
                                pattern: "^(\\+\\d{1,2}\\s)?\\(?\\d{3}\\)?[\\s.-]?\\d{3}[\\s.-]?\\d{4}$",
                                error: "Please enter a valid phone number.",
                                classes: ""
                            },
                            age: {
                                name: "age",
                                label: "Age",
                                pattern: "\\d+$",
                                error: "You must be at least 13 years of age.",
                                classes: "mdl-textfield-mini"
                            },
                            gender: {
                                name: "gender",
                                label: "Gender",
                                options: [ {
                                    name: "male",
                                    label: "Male"
                                }, {
                                    name: "female",
                                    label: "Female"
                                } ]
                            },
                            weight: {
                                name: "weight",
                                label: "Weight",
                                pattern: "\\d+(lbs)?$",
                                error: "Please enter your weight.",
                                classes: "mdl-textfield-sml"
                            },
                            height: {
                                name: "height",
                                label: "Height",
                                subtext: "(e:5ft 2in)",
                                pattern: "\\d+ft(\\s+\\d+in)?",
                                error: "Please enter your height like (5ft 2in).",
                                classes: "mdl-textfield-sml"
                            },
                            relationship: {
                                name: "relationship",
                                label: "Relationship Status",
                                options: [ {
                                    name: "married",
                                    label: "Married"
                                }, {
                                    name: "single",
                                    label: "Single"
                                }, {
                                    name: "divorced",
                                    label: "Divorced"
                                }, {
                                    name: "other",
                                    label: "Other"
                                } ]
                            },
                            mailingAddress: {
                                name: "mailingAddress",
                                label: "Mailing Address",
                                pattern: "[\\w\\s\\.\\-]+$",
                                error: "Please provide your maliing address",
                                classes: ""
                            },
                            city: {
                                name: "city",
                                label: "City",
                                pattern: "[\\w\\s]+$",
                                error: "Please provide your City",
                                classes: "mdl-textfield-med"
                            },
                            state: {
                                name: "state",
                                label: "State",
                                pattern: "\\w+",
                                error: "Please provide your state abreviation",
                                classes: "mdl-textfield-mini"
                            },
                            zip: {
                                name: "zip",
                                label: "Zipcode",
                                pattern: "\\d{5}",
                                error: "Please enter your zipcode",
                                classes: "mdl-textfield-sml"
                            },
                            childrenAges: {
                                name: "childrenAges",
                                label: "Children/Ages",
                                subtext: "(e:Boy 10, Girl 8, ...)",
                                pattern: "",
                                error: "Please enter your children's ages",
                                classes: "mdl-textfield-long"
                            },
                            pets: {
                                name: "pets",
                                label: "Pets",
                                options: [ {
                                    name: "no-pets",
                                    label: "No",
                                    selected: true
                                }, {
                                    name: "yes-pets",
                                    label: "Yes"
                                } ]
                            },
                            doYouSmoke: {
                                name: "doYouSmoke",
                                label: "Do you Smoke?",
                                options: [ {
                                    name: "non-smoker",
                                    label: "No",
                                    selected: true
                                }, {
                                    name: "smoker",
                                    label: "Yes"
                                } ]
                            },
                            drinkAlcohol: {
                                name: "drinkAlcohol",
                                label: "Drink Alcohol?",
                                options: [ {
                                    name: "no-alcohol",
                                    label: "No",
                                    selected: true
                                }, {
                                    name: "yes-alcoho",
                                    label: "Yes"
                                } ]
                            },
                            occupation: {
                                name: "occupation",
                                label: "Occupation",
                                pattern: "",
                                error: "Please enter your occupation",
                                classes: "mdl-textfield-med"
                            },
                            hoursOfWorkPerWeek: {
                                name: "HoursOfWorkPerWeek",
                                label: "Hours of work per week",
                                pattern: "",
                                error: "Please enter how many hours you work per week",
                                classes: "mdl-textfield-long"
                            },
                            whatPromptedYouToContactMe: {
                                name: "whatPromptedYouToContactMe",
                                label: "What prompted you to contact me?",
                                pattern: "",
                                error: "Please say why you contact me",
                                classes: "mdl-textfield-long"
                            },
                            inGeneralHowWouldYouRateYourOverallHealth: {
                                name: "inGeneralHowWouldYouRateYourOverallHealth",
                                label: "In general how would you rate your overall health?",
                                pattern: "",
                                error: "Please rate your overall health",
                                classes: "mdl-textfield-long"
                            },
                            mainHealthConcerns: {
                                name: "mainHealthConcerns",
                                label: "What are your main health concerns?",
                                pattern: "",
                                error: "Please enter your main health concerns",
                                classes: "mdl-textfield-long"
                            },
                            atWhatPointInYourLifeHaveYouFeltYourBest: {
                                name: "atWhatPointInYourLifeHaveYouFeltYourBest",
                                label: "At what point in your life have you felt your best?",
                                pattern: "",
                                error: "Please enter the time that you have felt your best",
                                classes: "mdl-textfield-long"
                            },
                            howManyHoursDoYouSleep: {
                                name: "howManyHoursDoYouSleep",
                                label: "How many hours do you sleep per night?",
                                pattern: "",
                                error: "Please enter how many hours you sleep",
                                classes: "mdl-textfield-long"
                            },
                            doYouWakeUpAtNight: {
                                name: "doYouWakeUpAtNight",
                                label: "Do you wake up during the night?",
                                pattern: "",
                                error: "Please enter if you wake up at night?",
                                classes: "mdl-textfield-long"
                            },
                            timeToBed: {
                                name: "timeToBed",
                                label: "What time do you go to bed?",
                                pattern: "",
                                error: "Please enter the time you usually go to bed",
                                classes: "mdl-textfield-long"
                            },
                            howDoYouFeelWhenYouWakeUp: {
                                name: "howDoYouFeelWhenYouWakeUp",
                                label: "How do you feel when you wake up?",
                                pattern: "",
                                error: "Please enter how you feel after you wake up",
                                classes: "mdl-textfield-long"
                            },
                            anyPainStiffnessOrSwelling: {
                                name: "anyPainStiffnessOrSwelling",
                                label: "Do you have any pain, stiffness,or swelling?",
                                pattern: "",
                                error: "Please enter if you have any pain stiffness or swelling",
                                classes: "mdl-textfield-long"
                            },
                            howIsYourDigestion: {
                                name: "howIsYourDigestion",
                                label: "How is your digestion?",
                                pattern: "",
                                error: "Please enter how is your digestion",
                                classes: "mdl-textfield-long"
                            },
                            doYouExperienceConstipationBloatingDiarrhea: {
                                name: "doYouExperienceConstipationBloatingDiarrhea",
                                label: "Do you experience constipation, bloating, or diarrhea?",
                                pattern: "",
                                error: "Please enter if you have any of the listed above",
                                classes: "mdl-textfield-long"
                            },
                            doYouHaveAllergiesOrSensitivities: {
                                name: "doYouHaveAllergiesOrSensitivities",
                                label: "Do you have allergies or sensitivities?",
                                pattern: "",
                                error: "Please enter what allergies or sensitivities that you have",
                                classes: "mdl-textfield-long"
                            },
                            doYouTakeAnyMedicationSupplementsOrVitamins: {
                                name: "doYouTakeAnyMedicationSupplementsOrVitamins",
                                label: "Do you take any medication, supplements, or vitamins?",
                                pattern: "",
                                error: "Please enter if you take any medication listed above",
                                classes: "mdl-textfield-long"
                            },
                            howMuchStressDoYouHaveInYourLifeRightNow: {
                                name: "howMuchStressDoYouHaveInYourLifeRightNow",
                                label: "How much stress do you have right now?",
                                options: [ {
                                    name: "stress-none",
                                    label: "None"
                                }, {
                                    name: "stress-moderate",
                                    label: "Moderate"
                                }, {
                                    name: "stress-decent",
                                    label: "Decent"
                                }, {
                                    name: "stress-surviving",
                                    label: "Surviving"
                                }, {
                                    name: "stress-overwhelmed",
                                    label: "Overwhelmed"
                                } ],
                                classes: "mdl-textfield-long"
                            },
                            whatIsYOurPrimaryStressInYourLifeAtThisTime: {
                                name: "whatIsYOurPrimaryStressInYourLifeAtThisTime",
                                label: "What is your primary stress in your life?",
                                pattern: "",
                                error: "Please enter what is the primary stress in your life now",
                                classes: "mdl-textfield-long"
                            },
                            howOftenDoYouFeelRelaxedOrAtPeace: {
                                name: "howOftenDoYouFeelRelaxedOrAtPeace",
                                label: "How Often do you feel relaxed or at peace?",
                                options: [ {
                                    name: "always",
                                    label: "Always"
                                }, {
                                    name: "often",
                                    label: "Often"
                                }, {
                                    name: "sometimes",
                                    label: "Sometimes"
                                }, {
                                    name: "rarely",
                                    label: "Rarely"
                                }, {
                                    name: "never",
                                    label: "Never"
                                } ],
                                classes: "mdl-textfield-long"
                            },
                            areYouBeingTreatedForAnyEmotionalOrPhysicalConditionAtThisTime: {
                                name: "areYouBeingTreatedForAnyEmotionalOrPhysicalConditionAtThisTime",
                                label: "Are you being treated for any emotional or physical condition?",
                                pattern: "",
                                error: "Please enter if you are being treated for any emotional or physical condition now",
                                classes: "mdl-textfield-long"
                            },
                            howIsYOurEnergyLevelThroughoutTheDay: {
                                name: "howIsYOurEnergyLevelThroughoutTheDay",
                                label: "How is your energy level throughout the day?",
                                pattern: "",
                                error: "Please enter how your energy is during the day",
                                classes: "mdl-textfield-long"
                            },
                            whatGivesYouEnergy: {
                                name: "whatGivesYouEnergy",
                                label: "What gives you energy?",
                                pattern: "",
                                error: "Please enter what gives you energy",
                                classes: "mdl-textfield-long"
                            },
                            whatZapsYouOfYourEnergy: {
                                name: "whatZapsYouOfYourEnergy",
                                label: "What zaps you of your energy?",
                                pattern: "",
                                error: "Please enter what zaps you of your energy",
                                classes: "mdl-textfield-long"
                            },
                            doYouHaveAMorningRoutineThatYouPractice: {
                                name: "doYouHaveAMorningRoutineThatYouPractice",
                                label: "Do you have a morning routine that you practice?",
                                pattern: "",
                                error: "Please enter what your morning routine is",
                                classes: "mdl-textfield-long"
                            },
                            doYouExercise: {
                                name: "doYouExercise",
                                label: "How many hours a week do you exercise?",
                                pattern: "",
                                error: "Please enter the hours you exercise per week.",
                                classes: "mdl-textfield-long"
                            },
                            howDoYouExercise: {
                                name: "howDoYouExercise",
                                label: "What do you do for exercise?",
                                pattern: "",
                                error: "Please enter what you do for exercise.",
                                classes: "mdl-textfield-long"
                            },
                            howSatisfiedAreYouWithYourExerciseLevel: {
                                name: "howSatisfiedAreYouWithYourExerciseLevel",
                                label: "How satisfied are you with your exercise level?",
                                pattern: "",
                                error: "Please enter how satisfied you are with your exercise level",
                                classes: "mdl-textfield-long"
                            },
                            howSatisfiedAreYouWithYourCurrentEatingAndNutrition: {
                                name: "howSatisfiedAreYouWithYourCurrentEatingAndNutrition",
                                label: "How satisfied are you with your current eating and nutrition?",
                                pattern: "",
                                error: "Please enter how your are with your eating and nutrition now",
                                classes: "mdl-textfield-long"
                            },
                            howSatisfiedAreYouWithYourWeight: {
                                name: "howSatisfiedAreYouWithYourWeight",
                                label: "How satisfied are you with your with your weight?",
                                pattern: "",
                                error: "Please enter how your weight or with is satisfied",
                                classes: "mdl-textfield-long"
                            },
                            howSatisfiedAreYouWithYourLifeInGeneral: {
                                name: "HowSatisfiedAreYouWithYourLifeInGeneral",
                                label: "How satisfied is your life in general?",
                                pattern: "",
                                error: "Please enter how your life is in general",
                                classes: "mdl-textfield-long"
                            },
                            whatWouldYouLikeToDoToChangeForTheBetter: {
                                name: "whatWouldYouLikeToDoToChangeForTheBetter",
                                label: "What would you like to do to change for the better?",
                                pattern: "",
                                error: "Please enter what you would like to do to change for the better.",
                                classes: "mdl-textfield-long"
                            },
                            howWouldYouRateYourOverallSelfEsteem: {
                                name: "howWouldYouRateYourOverallSelfEsteem",
                                label: "How would you rate your overall Self-Esteem?",
                                options: [ {
                                    name: "esteem-poor",
                                    label: "Poor"
                                }, {
                                    name: "esteem-fair",
                                    label: "Fair"
                                }, {
                                    name: "esteem-good",
                                    label: "Good"
                                }, {
                                    name: "esteem-very-good",
                                    label: "Very Good"
                                }, {
                                    name: "esteem-excellent",
                                    label: "Excellent"
                                } ],
                                classes: "mdl-textfield-long"
                            },
                            whatPositiveQualitiesDoYouHaveThatWillHelpYouReachYourGoals: {
                                name: "whatPositiveQualitiesDoYouHaveThatWillHelpYouReachYourGoals",
                                label: "What positive qualities do you have that will help you reach your goals?",
                                pattern: "",
                                error: "Please enter the qualities that will help you reach your goals",
                                classes: "mdl-textfield-long"
                            },
                            whatPositiveQualitiesWouldYouLikeToDevelop: {
                                name: "whatPositiveQualitiesWouldYouLikeToDevelop",
                                label: "What positive qualities would you like to develop?",
                                pattern: "",
                                error: "Please enter the qualities that that you want to develop",
                                classes: "mdl-textfield-long"
                            },
                            ifMoneyOrTimeWereNotRelativeHowWouldYouLikeToSpendYourTime: {
                                name: "ifMoneyOrTimeWereNotRelativeHowWouldYouLikeToSpendYourTime",
                                label: "If money or time were not relative, how would you like to spend your time?",
                                pattern: "",
                                error: "Please enter what you would do to this question",
                                classes: "mdl-textfield-long"
                            },
                            whatIsTheHardestThingInLifeSoFarHaveYouHadToOvercome: {
                                name: "whatIsTheHardestThingInLifeSoFarHaveYouHadToOvercome",
                                label: "What is the hardest thing in life so far have you had to overcome?",
                                pattern: "",
                                error: "Please enter what has been the hardest thing you have overcome",
                                classes: "mdl-textfield-long"
                            },
                            inSixMonthsFromNowWhatWouldYouLikeYourLifeToLookLite: {
                                name: "inSixMonthsFromNowWhatWouldYouLikeYourLifeToLookLite",
                                label: "In 6 months from now, what would you like your life to look like?",
                                pattern: "",
                                error: "Please enter what you would like your life too look like from now on",
                                classes: "mdl-textfield-long"
                            },
                            whatAreYourHobbiesOrSpecialInterests: {
                                name: "whatAreYourHobbiesOrSpecialInterests",
                                label: "What are your hobbies or special interests?",
                                pattern: "",
                                error: "Please enter what your hobbies or special interests are",
                                classes: "mdl-textfield-long"
                            },
                            doYouHaveAnyConcernsOrReservationsAboutWorkingWithACoach: {
                                name: "doYouHaveAnyConcernsOrReservationsAboutWorkingWithACoach",
                                label: "Do you have any concerns or reservations about working with a coach?",
                                pattern: "",
                                error: "Please enter if you have reservations about working with a coach",
                                classes: "mdl-textfield-long"
                            },
                            howWouldYouLikeToBeCoached: {
                                name: "howWouldYouLikeToBeCoached",
                                label: "How would you like to be coached?",
                                pattern: "",
                                error: "Please enter how you would like to be coached",
                                classes: "mdl-textfield-long"
                            },
                            whatAreYourExpectationsForMeAsACoach: {
                                name: "whatAreYourExpectationsForMeAsACoach",
                                label: "What are your expectations for me as your coach?",
                                pattern: "",
                                error: "Please enter what your expectations are for me as a coach",
                                classes: "mdl-textfield-long"
                            },
                            whatAreasDoYouWantToWorkOnWithMe: {
                                name: "whatAreasDoYouWantToWorkOnWithMe",
                                label: "What areas do you want to work on with me?",
                                options: [ {
                                    name: "nutrition",
                                    label: "Nutrition",
                                    selected: false
                                }, {
                                    name: "exercise",
                                    label: "Exercise",
                                    selected: false
                                }, {
                                    name: "de-stressing",
                                    label: "De-Stressing",
                                    selected: false
                                }, {
                                    name: "relationships",
                                    label: "Relationships",
                                    selected: false
                                }, {
                                    name: "spirituality",
                                    label: "Spirituality",
                                    selected: false
                                }, {
                                    name: "emotionalSupport",
                                    label: "Emotional Support",
                                    selected: false
                                } ],
                                classes: "mdl-textfield-long"
                            },
                            isThereAnythingElseYouWouldLikeMeToKnowAboutYouThatWouldHelpOurCoachingSessionTogether: {
                                name: "isThereAnythingElseYouWouldLikeMeToKnowAboutYouThatWouldHelpOurCoachingSessionTogether",
                                label: "Is there anything else you would like me to know about you?",
                                pattern: "",
                                error: "Please enter if there is anything else you would like me to know about you",
                                classes: "mdl-textfield-full"
                            },
                            doYouHaveAnyQuestionsForMeAsYourCoach: {
                                name: "doYouHaveAnyQuestionsForMeAsYourCoach",
                                label: "Do you have any questions for me as your coach?",
                                pattern: "",
                                error: "Please enter if there is anything else you would like me to know about you that would help our coaching session together",
                                classes: "mdl-textfield-full"
                            },
                            whichWaysCanICommunicateWithYou: {
                                name: "whichWaysCanICommunicateWithYou",
                                label: "Which ways can I communicate with you?",
                                options: [ {
                                    name: "by-text",
                                    label: "Text"
                                }, {
                                    name: "by-phone",
                                    label: "Phone"
                                }, {
                                    name: "by-email",
                                    label: "Email"
                                }, {
                                    name: "by-skype",
                                    label: "Skype"
                                }, {
                                    name: "in-person",
                                    label: "In Person (local only)"
                                } ]
                            }
                        }
                    };
                    scope.submit = function() {
                        var total = scope.$c.length;
                        var filled = 0;
                        each(scope.$c, function($s) {
                            if ($s.field.value !== undefined) {
                                filled += 1;
                            }
                        });
                        function send() {
                            var form = el.querySelector("form");
                            form.action = "php/form.php";
                            form.method = "POST";
                            form.enctype = "multipart/form-data";
                            form.onsubmit = "";
                            form.submit();
                        }
                        if (filled < total) {
                            var result = confirm("You have only filled in " + (filled / total * 100).toFixed(1) + "% of the form. Are you sure you want to send it now?");
                            if (result) {
                                send();
                            }
                        }
                    };
                } ]
            };
        });
    });
    //! node_modules/hbjs/src/hb/debug/debugDev.js
    //! pattern /hb\-errors-debug\b/
    define("hb.debug.dev", [ "hb.debug", "hb.debug.logs", "hb.debug.stats", "apply" ], function(debug, debugLogs, debugStats, apply) {
        var errors = debug.errors;
        errors.E1 = "Trying to assign multiple scopes to the same dom element is not permitted.", 
        errors.E2 = "Unable to find element", errors.E3 = "Exceeded max digests of ", errors.E4 = "parent element not found in %o", 
        errors.E5 = "property is not of type object", errors.E6a = 'Error evaluating: "', 
        errors.E6b = '" against %o', errors.E7 = "$digest already in progress.", errors.E8 = "Name required to instantiate module", 
        errors.E9 = "Injection not found for ", errors.E10 = "This element has already been compiled", 
        errors.E11 = "Watch cannot have a function of null or undefined", errors.E12 = "parent element not found in %o";
        function createLog(name) {
            return function() {
                if (window.console && console[name]) {
                    apply(console[name], console, arguments);
                }
            };
        }
        debugLogs(debug);
        debugStats(debug);
        debug.ignoreErrors = false;
        debug.log = createLog("log");
        debug.info = createLog("info");
        debug.warn = createLog("warn");
        return debug;
    });
    //! node_modules/hbjs/src/hb/debug/log.js
    define("hb.debug.logs", [ "hb.debug.item", "hb.debug.colors", "apply" ], function(debugItem, colors, apply) {
        function logger(model) {
            var logs = {};
            function register(name, color) {
                logs[name] = logs[name] || new debugItem(name, color);
                return logs[name];
            }
            function enable(name) {
                var success = false, a;
                for (var i = 0, len = arguments.length; i < len; i += 1) {
                    a = arguments[i];
                    if (logs[a]) {
                        logs[a].enabled = success = true;
                    }
                }
                return success;
            }
            function log() {
                if (model.enabled && this.enabled) {
                    var args = Array.prototype.slice.call(arguments);
                    var n = this.name;
                    args = [ "%c" + n + "::", "color:" + this.color ].concat(args);
                    if (window.console && console[this.mode]) {
                        apply(console[this.mode], console, args);
                    }
                }
            }
            function logMethodFactory(mode) {
                return function() {
                    this.mode = mode;
                    apply(log, this, arguments);
                };
            }
            debugItem.prototype.log = logMethodFactory("log");
            debugItem.prototype.info = logMethodFactory("info");
            debugItem.prototype.warn = logMethodFactory("warn");
            debugItem.prototype.error = logMethodFactory("error");
            model.log = enable;
            model.enabled = true;
            model.register = register;
            return model;
        }
        return logger;
    });
    //! node_modules/hbjs/src/hb/debug/debugItem.js
    define("hb.debug.item", [ "hb.debug.colors" ], function(colors) {
        function DebugItem(name, color) {
            this.name = name;
            this.mode = "log";
            this.color = color || colors(name);
        }
        return DebugItem;
    });
    //! node_modules/hbjs/src/hb/debug/colors.js
    define("hb.debug.colors", function() {
        var colors = [ "#3F51B5", "#4CAF50", "#FF9800", "#f93b39", "#de9c1b", "#008bf5", "#708bca", "#87a5ae", "#ff6092" ];
        var cache = {};
        var index = 0;
        function nextColor() {
            var color = colors[index];
            index += 1;
            index %= colors.length;
            return color;
        }
        function getColor(name) {
            return cache[name] = cache[name] || nextColor();
        }
        return getColor;
    });
    //! node_modules/hbjs/src/hb/debug/stats.js
    define("hb.debug.stats", [ "hb.debug.item", "hb.debug.stats.item", "consoleGraph", "hb.debug.colors" ], function(debugItem, statsItem, consoleGraph, colors) {
        function statsBehavior(model) {
            var statsData = {};
            var liveStatsList = [];
            var liveStatsIntv = 0;
            var imgs = {};
            var debugEl;
            function liveStats(name) {
                for (var i = 0, len = arguments.length; i < len; i += 1) {
                    name = arguments[i];
                    if (liveStatsList.indexOf(name) === -1) {
                        liveStatsList.push(name);
                        if (!liveStatsIntv) {
                            debugEl = document.getElementById("hb-debug-stats");
                            if (!debugEl) {
                                debugEl = document.createElement("div");
                                debugEl.id = "debug-stats";
                                debugEl.style.position = "absolute";
                                document.body.appendChild(debugEl);
                            }
                            liveStatsIntv = setInterval(function() {
                                for (var i = 0, len = liveStatsList.length; i < len; i += 1) {
                                    logItemStats(statsData[liveStatsList[i]], true, liveStatsList[i]);
                                }
                            }, 1e3);
                        }
                    }
                }
            }
            function getStats() {
                return statsData[this.name] = statsData[this.name] || {};
            }
            function stat(name, color) {
                var stats = this.getStats();
                return stats[name] = stats[name] || new statsItem(name, color || this.color);
            }
            function flushStats(name) {
                if (name) {
                    this.getStats()[name].clear();
                }
                statsData[this.name] = {};
            }
            function logStats() {
                var i;
                for (i in statsData) {
                    if (statsData.hasOwnProperty(i)) {
                        logItemStats.call(this, statsData[i]);
                    }
                }
                return " ";
            }
            function getImg(name) {
                var img;
                if (!imgs[name]) {
                    img = new Image();
                    img.style.display = "block";
                    debugEl.appendChild(img);
                    imgs[name] = img;
                }
                return imgs[name];
            }
            function logItemStats(stats, live, label) {
                var i, len, url, img;
                for (i in stats) {
                    if (stats.hasOwnProperty(i)) {
                        len = stats[i].data.length;
                        if (len) {
                            if (live) {
                                if (stats[i].dirty) {
                                    stats[i].dirty = false;
                                    url = consoleGraph.graph(stats[i].data, label + ":: " + i, stats[i].color);
                                    img = getImg.call(this, i);
                                    img.src = url;
                                }
                            } else {
                                console.graph(stats[i].data, 0, i);
                            }
                        }
                    }
                }
            }
            function clearStats(name, statName) {
                statsData[name][statName].clear();
            }
            debugItem.prototype.stat = stat;
            debugItem.prototype.getStats = getStats;
            debugItem.prototype.flushStats = flushStats;
            model.stats = liveStats;
            model.getStats = function() {
                return statsData;
            };
            model.logStats = logStats;
            model.clearStats = clearStats;
            return model;
        }
        return statsBehavior;
    });
    //! node_modules/hbjs/src/hb/debug/statsItem.js
    define("hb.debug.stats.item", [ "hb.debug.colors" ], function(colors) {
        function Stat(name, color) {
            this.name = name;
            this.color = color || colors(name);
            this.clear();
        }
        Stat.prototype.clear = function() {
            this.index = -1;
            this.data = this.data || [];
            this.data.length = 0;
            this.dirty = true;
            this.next();
        };
        Stat.prototype.next = function() {
            this.index += 1;
            this.data[this.index] = 0;
            this.dirty = true;
        };
        Stat.prototype.inc = function(n) {
            this.data[this.index] += n || 1;
            this.dirty = true;
        };
        Stat.prototype.dec = function(n) {
            this.data[this.index] -= n || 1;
            this.dirty = true;
        };
        Stat.prototype.set = function(n) {
            this.data[this.index] = n;
            this.dirty = true;
        };
        return Stat;
    });
    //! node_modules/hbjs/src/hb/debug/consoleGraph.js
    define("consoleGraph", [ "apply" ], function(apply) {
        if (!window.console || !window.console.log) {
            return;
        }
        var canvas, context, height = 18, padding = 1, fontSize = 10, width = 400, labelWidth = 100, api = {};
        canvas = document.createElement("canvas");
        canvas.height = height + "";
        canvas.width = width + "";
        context = canvas.getContext("2d");
        if (document.body) {
            document.body.appendChild(canvas);
        }
        canvas.style.cssText = "position: absolute; left: -" + width + "px; background-color:#FFF;";
        context.font = fontSize + "px Arial";
        var _graph = function(imageURL, height, width, label) {
            console.log("%c ", "" + "font-size: 0px;" + "border-left:100px solid #FFF; " + "padding-left: " + width + "px;" + "padding-bottom: " + height + "px;" + 'background: url("' + imageURL + '"), ' + "-webkit-linear-gradient(#CCC, #CCC);" + "");
            console.log(label || "\t");
        };
        function graph(data, label, color) {
            var len = data.length;
            var graphWidth = width - labelWidth;
            var units = graphWidth / len;
            var offset = 0;
            var offsetLen = len - offset;
            while (units < 2) {
                offset += 1;
                offsetLen = len - offset;
                units = graphWidth / offsetLen;
            }
            var max = Math.max.apply(Math, data);
            var barWidth = Math.min(units, 4);
            barWidth = barWidth < 1 ? 1 : barWidth;
            var h;
            var hp = height - padding * 2;
            var last = 0;
            context.clearRect(0, 0, width, height);
            context.fillStyle = color || "#999";
            if (len > 1) {
                for (var i = 0; i < offsetLen; i++) {
                    last = data[offset + i];
                    h = hp * (last / max);
                    context.fillRect(labelWidth + i * barWidth, hp - h + padding, barWidth, h);
                }
            }
            context.textBaseline = "middle";
            context.fillStyle = color || "#333";
            context.fillText(label, 2, height * .25);
            context.fillText("  " + (len > 1 ? len + " / " + max + " / " + last : data[0]), 2, height * .75);
            context.fillStyle = "#EFEFEF";
            context.fillRect(0, height - 1, width, 1);
            return canvas.toDataURL();
        }
        window.console.graph = function(data, max, label) {
            var imgURL = graph(data, max, label);
            _graph(imgURL, height, width, label);
        };
        api.graph = graph;
        return api;
    });
    //! src/application/form-fields/checkbox/bh-checkbox.js
    define("bhCheckbox", [ "hb.directive" ], function(directive) {
        directive("bhCheckbox", function() {
            return {
                scope: true,
                replace: true,
                tpl: "<div class=\"mdl-textfield {{::field.classes}} mdl-js-textfield mdl-textfield--floating-label is-focused\" hb-alt=\"field.label\"> <label class=\"mdl-textfield__label\" hb-for=\"field.name\">{{::field.label}} <span class=\"subtext\">{{::field.subtext}}</span></label> <div hb-id=\"field.name\" hb-repeat=\"option in field.options\"> <label class=\"mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect\" hb-for=\"option.name\"> <input type=\"checkbox\" hb-id=\"option.name\" class=\"mdl-checkbox__input\" hb-name=\"field.name\" hb-value=\"option.name\" hb-model=\"field.value\" hb-checked=\"option.selected\"> <span class=\"mdl-checkbox__label\">{{option.label}}</span> </label> </div></div>",
                link: [ "scope", "el", "alias", function(scope, el, alias) {
                    scope.field = scope.$eval(alias.value);
                } ]
            };
        });
    });
    //! src/application/form-fields/input/bh-input.js
    define("bhInput", [ "hb.directive" ], function(directive) {
        directive("bhInput", function() {
            return {
                scope: true,
                replace: true,
                tpl: "<div class=\"mdl-textfield {{::field.classes}} mdl-js-textfield mdl-textfield--floating-label\" hb-alt=\"field.label\"> <input class=\"mdl-textfield__input\" hb-id=\"field.name\" hb-name=\"field.name\" type=\"text\" hb-pattern=\"field.pattern\" hb-model=\"field.value\"> <label class=\"mdl-textfield__label\" hb-for=\"field.name\">{{::field.label}} <span class=\"subtext\">{{::field.subtext}}</span></label> <span class=\"mdl-textfield__error\">{{::field.error}}</span></div>",
                link: [ "scope", "el", "alias", function(scope, el, alias) {
                    scope.field = scope.$eval(alias.value);
                } ]
            };
        });
    });
    //! src/application/form-fields/radio/bh-radio.js
    define("bhRadio", [ "hb.directive" ], function(directive) {
        directive("bhRadio", function() {
            return {
                scope: true,
                replace: true,
                tpl: "<div class=\"mdl-textfield {{::field.classes}} mdl-js-textfield mdl-textfield--floating-label is-focused\" hb-alt=\"field.label\"> <label class=\"mdl-textfield__label\" hb-for=\"field.name\">{{::field.label}} <span class=\"subtext\">{{::field.subtext}}</span></label> <div hb-id=\"field.name\" hb-repeat=\"option in field.options\"> <label class=\"mdl-radio mdl-js-radio mdl-js-ripple-effect\" hb-for=\"option.name\"> <input type=\"radio\" hb-id=\"option.name\" class=\"mdl-radio__button\" hb-name=\"field.name\" hb-value=\"option.name\" hb-model=\"field.value\" hb-checked=\"option.selected\"> <span class=\"mdl-radio__label\">{{option.label}}</span> </label> </div></div>",
                link: [ "scope", "el", "alias", function(scope, el, alias) {
                    scope.field = scope.$eval(alias.value);
                } ]
            };
        });
    });
    //! src/widgets/bh-home.js
    define("bhHome", [ "hb.directive" ], function(directive) {
        directive("bhHome", function() {
            return {
                scope: true,
                link: [ "scope", "el", "alias", function(scope, el, alias) {
                    scope.goToForm = function() {
                        document.location.href = "./questionaire.html";
                    };
                } ]
            };
        });
    });
    //! #################  YOUR CODE ENDS HERE  #################### //
    finalize();
    return global["bh"];
})(this["bh"] || {}, function() {
    return this;
}());