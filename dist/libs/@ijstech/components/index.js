/*!-----------------------------------------------------------
* Copyright (c) IJS Technologies. All rights reserved.
* Released under dual AGPLv3/commercial license
* https://ijs.network
*-----------------------------------------------------------*/

//https://github.com/microsoft/vscode-loader
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
var _amdLoaderGlobal = this;
var _currentDefineModule;
var _defined = {};
var _commonjsGlobal = typeof global === 'object' ? global : {};
var AMDLoader;
(function (AMDLoader) {
    AMDLoader.global = _amdLoaderGlobal;
    var Environment = /** @class */ (function () {
        function Environment() {
            this._detected = false;
            this._isWindows = false;
            this._isNode = false;
            this._isElectronRenderer = false;
            this._isWebWorker = false;
            this._isElectronNodeIntegrationWebWorker = false;
        }
        Object.defineProperty(Environment.prototype, "isWindows", {
            get: function () {
                this._detect();
                return this._isWindows;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Environment.prototype, "isNode", {
            get: function () {
                this._detect();
                return this._isNode;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Environment.prototype, "isElectronRenderer", {
            get: function () {
                this._detect();
                return this._isElectronRenderer;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Environment.prototype, "isWebWorker", {
            get: function () {
                this._detect();
                return this._isWebWorker;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Environment.prototype, "isElectronNodeIntegrationWebWorker", {
            get: function () {
                this._detect();
                return this._isElectronNodeIntegrationWebWorker;
            },
            enumerable: false,
            configurable: true
        });
        Environment.prototype._detect = function () {
            if (this._detected) {
                return;
            }
            this._detected = true;
            this._isWindows = Environment._isWindows();
            this._isNode = (typeof module !== 'undefined' && !!module.exports);
            this._isElectronRenderer = (typeof process !== 'undefined' && typeof process.versions !== 'undefined' && typeof process.versions.electron !== 'undefined' && process.type === 'renderer');
            this._isWebWorker = (typeof AMDLoader.global.importScripts === 'function');
            this._isElectronNodeIntegrationWebWorker = this._isWebWorker && (typeof process !== 'undefined' && typeof process.versions !== 'undefined' && typeof process.versions.electron !== 'undefined' && process.type === 'worker');
        };
        Environment._isWindows = function () {
            if (typeof navigator !== 'undefined') {
                if (navigator.userAgent && navigator.userAgent.indexOf('Windows') >= 0) {
                    return true;
                }
            }
            if (typeof process !== 'undefined') {
                return (process.platform === 'win32');
            }
            return false;
        };
        return Environment;
    }());
    AMDLoader.Environment = Environment;
})(AMDLoader || (AMDLoader = {}));
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
var AMDLoader;
(function (AMDLoader) {
    var LoaderEvent = /** @class */ (function () {
        function LoaderEvent(type, detail, timestamp) {
            this.type = type;
            this.detail = detail;
            this.timestamp = timestamp;
        }
        return LoaderEvent;
    }());
    AMDLoader.LoaderEvent = LoaderEvent;
    var LoaderEventRecorder = /** @class */ (function () {
        function LoaderEventRecorder(loaderAvailableTimestamp) {
            this._events = [new LoaderEvent(1 /* LoaderAvailable */, '', loaderAvailableTimestamp)];
        }
        LoaderEventRecorder.prototype.record = function (type, detail) {
            this._events.push(new LoaderEvent(type, detail, AMDLoader.Utilities.getHighPerformanceTimestamp()));
        };
        LoaderEventRecorder.prototype.getEvents = function () {
            return this._events;
        };
        return LoaderEventRecorder;
    }());
    AMDLoader.LoaderEventRecorder = LoaderEventRecorder;
    var NullLoaderEventRecorder = /** @class */ (function () {
        function NullLoaderEventRecorder() {
        }
        NullLoaderEventRecorder.prototype.record = function (type, detail) {
            // Nothing to do
        };
        NullLoaderEventRecorder.prototype.getEvents = function () {
            return [];
        };
        NullLoaderEventRecorder.INSTANCE = new NullLoaderEventRecorder();
        return NullLoaderEventRecorder;
    }());
    AMDLoader.NullLoaderEventRecorder = NullLoaderEventRecorder;
})(AMDLoader || (AMDLoader = {}));
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
var AMDLoader;
(function (AMDLoader) {
    var Utilities = /** @class */ (function () {
        function Utilities() {
        }
        /**
         * This method does not take care of / vs \
         */
        Utilities.fileUriToFilePath = function (isWindows, uri) {
            uri = decodeURI(uri).replace(/%23/g, '#');
            if (isWindows) {
                if (/^file:\/\/\//.test(uri)) {
                    // This is a URI without a hostname => return only the path segment
                    return uri.substr(8);
                }
                if (/^file:\/\//.test(uri)) {
                    return uri.substr(5);
                }
            }
            else {
                if (/^file:\/\//.test(uri)) {
                    return uri.substr(7);
                }
            }
            // Not sure...
            return uri;
        };
        Utilities.startsWith = function (haystack, needle) {
            return haystack.length >= needle.length && haystack.substr(0, needle.length) === needle;
        };
        Utilities.endsWith = function (haystack, needle) {
            return haystack.length >= needle.length && haystack.substr(haystack.length - needle.length) === needle;
        };
        // only check for "?" before "#" to ensure that there is a real Query-String
        Utilities.containsQueryString = function (url) {
            return /^[^\#]*\?/gi.test(url);
        };
        /**
         * Does `url` start with http:// or https:// or file:// or / ?
         */
        Utilities.isAbsolutePath = function (url) {
            return /^((http:\/\/)|(https:\/\/)|(file:\/\/)|(\/))/.test(url);
        };
        Utilities.forEachProperty = function (obj, callback) {
            if (obj) {
                var key = void 0;
                for (key in obj) {
                    if (obj.hasOwnProperty(key)) {
                        callback(key, obj[key]);
                    }
                }
            }
        };
        Utilities.isEmpty = function (obj) {
            var isEmpty = true;
            Utilities.forEachProperty(obj, function () {
                isEmpty = false;
            });
            return isEmpty;
        };
        Utilities.recursiveClone = function (obj) {
            if (!obj || typeof obj !== 'object' || obj instanceof RegExp) {
                return obj;
            }
            if (!Array.isArray(obj) && Object.getPrototypeOf(obj) !== Object.prototype) {
                // only clone "simple" objects
                return obj;
            }
            var result = Array.isArray(obj) ? [] : {};
            Utilities.forEachProperty(obj, function (key, value) {
                if (value && typeof value === 'object') {
                    result[key] = Utilities.recursiveClone(value);
                }
                else {
                    result[key] = value;
                }
            });
            return result;
        };
        Utilities.generateAnonymousModule = function () {
            return '===anonymous' + (Utilities.NEXT_ANONYMOUS_ID++) + '===';
        };
        Utilities.isAnonymousModule = function (id) {
            return Utilities.startsWith(id, '===anonymous');
        };
        Utilities.getHighPerformanceTimestamp = function () {
            if (!this.PERFORMANCE_NOW_PROBED) {
                this.PERFORMANCE_NOW_PROBED = true;
                this.HAS_PERFORMANCE_NOW = (AMDLoader.global.performance && typeof AMDLoader.global.performance.now === 'function');
            }
            return (this.HAS_PERFORMANCE_NOW ? AMDLoader.global.performance.now() : Date.now());
        };
        Utilities.NEXT_ANONYMOUS_ID = 1;
        Utilities.PERFORMANCE_NOW_PROBED = false;
        Utilities.HAS_PERFORMANCE_NOW = false;
        return Utilities;
    }());
    AMDLoader.Utilities = Utilities;
})(AMDLoader || (AMDLoader = {}));
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
var AMDLoader;
(function (AMDLoader) {
    function ensureError(err) {
        if (err instanceof Error) {
            return err;
        }
        var result = new Error(err.message || String(err) || 'Unknown Error');
        if (err.stack) {
            result.stack = err.stack;
        }
        return result;
    }
    AMDLoader.ensureError = ensureError;
    ;
    var ConfigurationOptionsUtil = /** @class */ (function () {
        function ConfigurationOptionsUtil() {
        }
        /**
         * Ensure configuration options make sense
         */
        ConfigurationOptionsUtil.validateConfigurationOptions = function (options) {
            function defaultOnError(err) {
                if (err.phase === 'loading') {
                    console.error('Loading "' + err.moduleId + '" failed');
                    console.error(err);
                    console.error('Here are the modules that depend on it:');
                    console.error(err.neededBy);
                    return;
                }
                if (err.phase === 'factory') {
                    console.error('The factory method of "' + err.moduleId + '" has thrown an exception');
                    console.error(err);
                    return;
                }
            }
            options = options || {};
            if (typeof options.baseUrl !== 'string') {
                options.baseUrl = '';
            }
            if (typeof options.isBuild !== 'boolean') {
                options.isBuild = false;
            }
            if (typeof options.paths !== 'object') {
                options.paths = {};
            }
            if (typeof options.config !== 'object') {
                options.config = {};
            }
            if (typeof options.catchError === 'undefined') {
                options.catchError = false;
            }
            if (typeof options.recordStats === 'undefined') {
                options.recordStats = false;
            }
            if (typeof options.urlArgs !== 'string') {
                options.urlArgs = '';
            }
            if (typeof options.onError !== 'function') {
                options.onError = defaultOnError;
            }
            if (!Array.isArray(options.ignoreDuplicateModules)) {
                options.ignoreDuplicateModules = [];
            }
            if (options.baseUrl.length > 0) {
                if (!AMDLoader.Utilities.endsWith(options.baseUrl, '/')) {
                    options.baseUrl += '/';
                }
            }
            if (typeof options.cspNonce !== 'string') {
                options.cspNonce = '';
            }
            if (typeof options.preferScriptTags === 'undefined') {
                options.preferScriptTags = false;
            }
            if (!Array.isArray(options.nodeModules)) {
                options.nodeModules = [];
            }
            if (options.nodeCachedData && typeof options.nodeCachedData === 'object') {
                if (typeof options.nodeCachedData.seed !== 'string') {
                    options.nodeCachedData.seed = 'seed';
                }
                if (typeof options.nodeCachedData.writeDelay !== 'number' || options.nodeCachedData.writeDelay < 0) {
                    options.nodeCachedData.writeDelay = 1000 * 7;
                }
                if (!options.nodeCachedData.path || typeof options.nodeCachedData.path !== 'string') {
                    var err = ensureError(new Error('INVALID cached data configuration, \'path\' MUST be set'));
                    err.phase = 'configuration';
                    options.onError(err);
                    options.nodeCachedData = undefined;
                }
            }
            return options;
        };
        ConfigurationOptionsUtil.mergeConfigurationOptions = function (overwrite, base) {
            if (overwrite === void 0) { overwrite = null; }
            if (base === void 0) { base = null; }
            var result = AMDLoader.Utilities.recursiveClone(base || {});
            // Merge known properties and overwrite the unknown ones
            AMDLoader.Utilities.forEachProperty(overwrite, function (key, value) {
                if (key === 'ignoreDuplicateModules' && typeof result.ignoreDuplicateModules !== 'undefined') {
                    result.ignoreDuplicateModules = result.ignoreDuplicateModules.concat(value);
                }
                else if (key === 'paths' && typeof result.paths !== 'undefined') {
                    AMDLoader.Utilities.forEachProperty(value, function (key2, value2) { return result.paths[key2] = value2; });
                }
                else if (key === 'config' && typeof result.config !== 'undefined') {
                    AMDLoader.Utilities.forEachProperty(value, function (key2, value2) { return result.config[key2] = value2; });
                }
                else {
                    result[key] = AMDLoader.Utilities.recursiveClone(value);
                }
            });
            return ConfigurationOptionsUtil.validateConfigurationOptions(result);
        };
        return ConfigurationOptionsUtil;
    }());
    AMDLoader.ConfigurationOptionsUtil = ConfigurationOptionsUtil;
    var Configuration = /** @class */ (function () {
        function Configuration(env, options) {
            this._env = env;
            this.options = ConfigurationOptionsUtil.mergeConfigurationOptions(options);
            this._createIgnoreDuplicateModulesMap();
            this._createNodeModulesMap();
            this._createSortedPathsRules();
            if (this.options.baseUrl === '') {
                if (this.options.nodeRequire && this.options.nodeRequire.main && this.options.nodeRequire.main.filename && this._env.isNode) {
                    var nodeMain = this.options.nodeRequire.main.filename;
                    var dirnameIndex = Math.max(nodeMain.lastIndexOf('/'), nodeMain.lastIndexOf('\\'));
                    this.options.baseUrl = nodeMain.substring(0, dirnameIndex + 1);
                }
                if (this.options.nodeMain && this._env.isNode) {
                    var nodeMain = this.options.nodeMain;
                    var dirnameIndex = Math.max(nodeMain.lastIndexOf('/'), nodeMain.lastIndexOf('\\'));
                    this.options.baseUrl = nodeMain.substring(0, dirnameIndex + 1);
                }
            }
        }
        Configuration.prototype._createIgnoreDuplicateModulesMap = function () {
            // Build a map out of the ignoreDuplicateModules array
            this.ignoreDuplicateModulesMap = {};
            for (var i = 0; i < this.options.ignoreDuplicateModules.length; i++) {
                this.ignoreDuplicateModulesMap[this.options.ignoreDuplicateModules[i]] = true;
            }
        };
        Configuration.prototype._createNodeModulesMap = function () {
            // Build a map out of nodeModules array
            this.nodeModulesMap = Object.create(null);
            for (var _i = 0, _a = this.options.nodeModules; _i < _a.length; _i++) {
                var nodeModule = _a[_i];
                this.nodeModulesMap[nodeModule] = true;
            }
        };
        Configuration.prototype._createSortedPathsRules = function () {
            var _this = this;
            // Create an array our of the paths rules, sorted descending by length to
            // result in a more specific -> less specific order
            this.sortedPathsRules = [];
            AMDLoader.Utilities.forEachProperty(this.options.paths, function (from, to) {
                if (!Array.isArray(to)) {
                    _this.sortedPathsRules.push({
                        from: from,
                        to: [to]
                    });
                }
                else {
                    _this.sortedPathsRules.push({
                        from: from,
                        to: to
                    });
                }
            });
            this.sortedPathsRules.sort(function (a, b) {
                return b.from.length - a.from.length;
            });
        };
        /**
         * Clone current configuration and overwrite options selectively.
         * @param options The selective options to overwrite with.
         * @result A new configuration
         */
        Configuration.prototype.cloneAndMerge = function (options) {
            return new Configuration(this._env, ConfigurationOptionsUtil.mergeConfigurationOptions(options, this.options));
        };
        /**
         * Get current options bag. Useful for passing it forward to plugins.
         */
        Configuration.prototype.getOptionsLiteral = function () {
            return this.options;
        };
        Configuration.prototype._applyPaths = function (moduleId) {
            var pathRule;
            for (var i = 0, len = this.sortedPathsRules.length; i < len; i++) {
                pathRule = this.sortedPathsRules[i];
                if (AMDLoader.Utilities.startsWith(moduleId, pathRule.from)) {
                    var result = [];
                    for (var j = 0, lenJ = pathRule.to.length; j < lenJ; j++) {
                        result.push(pathRule.to[j] + moduleId.substr(pathRule.from.length));
                    }
                    return result;
                }
            }
            return [moduleId];
        };
        Configuration.prototype._addUrlArgsToUrl = function (url) {
            if (AMDLoader.Utilities.containsQueryString(url)) {
                return url + '&' + this.options.urlArgs;
            }
            else {
                return url + '?' + this.options.urlArgs;
            }
        };
        Configuration.prototype._addUrlArgsIfNecessaryToUrl = function (url) {
            if (this.options.urlArgs) {
                return this._addUrlArgsToUrl(url);
            }
            return url;
        };
        Configuration.prototype._addUrlArgsIfNecessaryToUrls = function (urls) {
            if (this.options.urlArgs) {
                for (var i = 0, len = urls.length; i < len; i++) {
                    urls[i] = this._addUrlArgsToUrl(urls[i]);
                }
            }
            return urls;
        };
        /**
         * Transform a module id to a location. Appends .js to module ids
         */
        Configuration.prototype.moduleIdToPaths = function (moduleId) {
            if (this._env.isNode) {
                var isNodeModule = ((this.nodeModulesMap[moduleId] === true)
                    || (this.options.amdModulesPattern instanceof RegExp && !this.options.amdModulesPattern.test(moduleId)));
                if (isNodeModule) {
                    // This is a node module...
                    if (this.isBuild()) {
                        // ...and we are at build time, drop it
                        return ['empty:'];
                    }
                    else {
                        // ...and at runtime we create a `shortcut`-path
                        return ['node|' + moduleId];
                    }
                }
            }
            var result = moduleId;
            var results;
            if (!AMDLoader.Utilities.endsWith(result, '.js') && !AMDLoader.Utilities.isAbsolutePath(result)) {
                results = this._applyPaths(result);
                for (var i = 0, len = results.length; i < len; i++) {
                    if (this.isBuild() && results[i] === 'empty:') {
                        continue;
                    }
                    if (!AMDLoader.Utilities.isAbsolutePath(results[i])) {
                        results[i] = this.options.baseUrl + results[i];
                    }
                    if (!AMDLoader.Utilities.endsWith(results[i], '.js') && !AMDLoader.Utilities.containsQueryString(results[i])) {
                        results[i] = results[i] + '.js';
                    }
                }
            }
            else {
                if (!AMDLoader.Utilities.endsWith(result, '.js') && !AMDLoader.Utilities.containsQueryString(result)) {
                    result = result + '.js';
                }
                results = [result];
            }
            return this._addUrlArgsIfNecessaryToUrls(results);
        };
        /**
         * Transform a module id or url to a location.
         */
        Configuration.prototype.requireToUrl = function (url) {
            var result = url;
            if (!AMDLoader.Utilities.isAbsolutePath(result)) {
                result = this._applyPaths(result)[0];
                if (!AMDLoader.Utilities.isAbsolutePath(result)) {
                    result = this.options.baseUrl + result;
                }
            }
            return this._addUrlArgsIfNecessaryToUrl(result);
        };
        /**
         * Flag to indicate if current execution is as part of a build.
         */
        Configuration.prototype.isBuild = function () {
            return this.options.isBuild;
        };
        /**
         * Test if module `moduleId` is expected to be defined multiple times
         */
        Configuration.prototype.isDuplicateMessageIgnoredFor = function (moduleId) {
            return this.ignoreDuplicateModulesMap.hasOwnProperty(moduleId);
        };
        /**
         * Get the configuration settings for the provided module id
         */
        Configuration.prototype.getConfigForModule = function (moduleId) {
            if (this.options.config) {
                return this.options.config[moduleId];
            }
        };
        /**
         * Should errors be caught when executing module factories?
         */
        Configuration.prototype.shouldCatchError = function () {
            return this.options.catchError;
        };
        /**
         * Should statistics be recorded?
         */
        Configuration.prototype.shouldRecordStats = function () {
            return this.options.recordStats;
        };
        /**
         * Forward an error to the error handler.
         */
        Configuration.prototype.onError = function (err) {
            this.options.onError(err);
        };
        return Configuration;
    }());
    AMDLoader.Configuration = Configuration;
})(AMDLoader || (AMDLoader = {}));
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
var AMDLoader;
(function (AMDLoader) {
    /**
     * Load `scriptSrc` only once (avoid multiple <script> tags)
     */
    var OnlyOnceScriptLoader = /** @class */ (function () {
        function OnlyOnceScriptLoader(env) {
            this._env = env;
            this._scriptLoader = null;
            this._callbackMap = {};
        }
        OnlyOnceScriptLoader.prototype.load = function (moduleManager, scriptSrc, callback, errorback) {
            var _this = this;
            if (!this._scriptLoader) {
                if (this._env.isWebWorker) {
                    this._scriptLoader = new WorkerScriptLoader();
                }
                else if (this._env.isElectronRenderer) {
                    var preferScriptTags = moduleManager.getConfig().getOptionsLiteral().preferScriptTags;
                    if (preferScriptTags) {
                        this._scriptLoader = new BrowserScriptLoader();
                    }
                    else {
                        this._scriptLoader = new NodeScriptLoader(this._env);
                    }
                }
                else if (this._env.isNode) {
                    this._scriptLoader = new NodeScriptLoader(this._env);
                }
                else {
                    this._scriptLoader = new BrowserScriptLoader();
                }
            }
            var scriptCallbacks = {
                callback: callback,
                errorback: errorback
            };
            if (this._callbackMap.hasOwnProperty(scriptSrc)) {
                this._callbackMap[scriptSrc].push(scriptCallbacks);
                return;
            }
            this._callbackMap[scriptSrc] = [scriptCallbacks];
            this._scriptLoader.load(moduleManager, scriptSrc, function () { return _this.triggerCallback(scriptSrc); }, function (err) { return _this.triggerErrorback(scriptSrc, err); });
        };
        OnlyOnceScriptLoader.prototype.triggerCallback = function (scriptSrc) {
            var scriptCallbacks = this._callbackMap[scriptSrc];
            delete this._callbackMap[scriptSrc];
            for (var i = 0; i < scriptCallbacks.length; i++) {
                scriptCallbacks[i].callback();
            }
        };
        OnlyOnceScriptLoader.prototype.triggerErrorback = function (scriptSrc, err) {
            var scriptCallbacks = this._callbackMap[scriptSrc];
            delete this._callbackMap[scriptSrc];
            for (var i = 0; i < scriptCallbacks.length; i++) {
                scriptCallbacks[i].errorback(err);
            }
        };
        return OnlyOnceScriptLoader;
    }());
    var BrowserScriptLoader = /** @class */ (function () {
        function BrowserScriptLoader() {
        }
        /**
         * Attach load / error listeners to a script element and remove them when either one has fired.
         * Implemented for browsers supporting HTML5 standard 'load' and 'error' events.
         */
        BrowserScriptLoader.prototype.attachListeners = function (script, callback, errorback) {
            var unbind = function () {
                script.removeEventListener('load', loadEventListener);
                script.removeEventListener('error', errorEventListener);
            };
            var loadEventListener = function (e) {
                unbind();
                callback();
            };
            var errorEventListener = function (e) {
                unbind();
                errorback(e);
            };
            script.addEventListener('load', loadEventListener);
            script.addEventListener('error', errorEventListener);
        };
        BrowserScriptLoader.prototype.load = function (moduleManager, scriptSrc, callback, errorback) {
            if (/^node\|/.test(scriptSrc)) {
                var opts = moduleManager.getConfig().getOptionsLiteral();
                var nodeRequire = ensureRecordedNodeRequire(moduleManager.getRecorder(), (opts.nodeRequire || AMDLoader.global.nodeRequire));
                var pieces = scriptSrc.split('|');
                var moduleExports_1 = null;
                try {
                    moduleExports_1 = nodeRequire(pieces[1]);
                }
                catch (err) {
                    errorback(err);
                    return;
                }
                moduleManager.enqueueDefineAnonymousModule([], function () { return moduleExports_1; });
                callback();
            }
            else {
                var script = document.createElement('script');
                script.setAttribute('async', 'async');
                script.setAttribute('type', 'text/javascript');
                this.attachListeners(script, callback, errorback);
                var trustedTypesPolicy = moduleManager.getConfig().getOptionsLiteral().trustedTypesPolicy;
                if (trustedTypesPolicy) {
                    scriptSrc = trustedTypesPolicy.createScriptURL(scriptSrc);
                }
                script.setAttribute('src', scriptSrc);
                // Propagate CSP nonce to dynamically created script tag.
                var cspNonce = moduleManager.getConfig().getOptionsLiteral().cspNonce;
                if (cspNonce) {
                    script.setAttribute('nonce', cspNonce);
                }
                document.getElementsByTagName('head')[0].appendChild(script);
            }
        };
        return BrowserScriptLoader;
    }());
    function canUseEval(moduleManager) {
        var trustedTypesPolicy = moduleManager.getConfig().getOptionsLiteral().trustedTypesPolicy;
        try {
            var func = (trustedTypesPolicy
                ? self.eval(trustedTypesPolicy.createScript('', 'true'))
                : new Function('true'));
            func.call(self);
            return true;
        }
        catch (err) {
            return false;
        }
    }
    var WorkerScriptLoader = /** @class */ (function () {
        function WorkerScriptLoader() {
            this._cachedCanUseEval = null;
        }
        WorkerScriptLoader.prototype._canUseEval = function (moduleManager) {
            if (this._cachedCanUseEval === null) {
                this._cachedCanUseEval = canUseEval(moduleManager);
            }
            return this._cachedCanUseEval;
        };
        WorkerScriptLoader.prototype.load = function (moduleManager, scriptSrc, callback, errorback) {
            if (/^node\|/.test(scriptSrc)) {
                var opts = moduleManager.getConfig().getOptionsLiteral();
                var nodeRequire = ensureRecordedNodeRequire(moduleManager.getRecorder(), (opts.nodeRequire || AMDLoader.global.nodeRequire));
                var pieces = scriptSrc.split('|');
                var moduleExports_2 = null;
                try {
                    moduleExports_2 = nodeRequire(pieces[1]);
                }
                catch (err) {
                    errorback(err);
                    return;
                }
                moduleManager.enqueueDefineAnonymousModule([], function () { return moduleExports_2; });
                callback();
            }
            else {
                var trustedTypesPolicy_1 = moduleManager.getConfig().getOptionsLiteral().trustedTypesPolicy;
                var isCrossOrigin = (/^((http:)|(https:)|(file:))/.test(scriptSrc) && scriptSrc.substring(0, self.origin.length) !== self.origin);
                if (!isCrossOrigin && this._canUseEval(moduleManager)) {
                    // use `fetch` if possible because `importScripts`
                    // is synchronous and can lead to deadlocks on Safari
                    fetch(scriptSrc).then(function (response) {
                        if (response.status !== 200) {
                            throw new Error(response.statusText);
                        }
                        return response.text();
                    }).then(function (text) {
                        text = text + "\n//# sourceURL=" + scriptSrc;
                        var func = (trustedTypesPolicy_1
                            ? self.eval(trustedTypesPolicy_1.createScript('', text))
                            : new Function(text));
                        func.call(self);
                        callback();
                    }).then(undefined, errorback);
                    return;
                }
                try {
                    if (trustedTypesPolicy_1) {
                        scriptSrc = trustedTypesPolicy_1.createScriptURL(scriptSrc);
                    }
                    importScripts(scriptSrc);
                    callback();
                }
                catch (e) {
                    errorback(e);
                }
            }
        };
        return WorkerScriptLoader;
    }());
    var NodeScriptLoader = /** @class */ (function () {
        function NodeScriptLoader(env) {
            this._env = env;
            this._didInitialize = false;
            this._didPatchNodeRequire = false;
        }
        NodeScriptLoader.prototype._init = function (nodeRequire) {
            if (this._didInitialize) {
                return;
            }
            this._didInitialize = true;
            // capture node modules
            this._fs = nodeRequire('fs');
            this._vm = nodeRequire('vm');
            this._path = nodeRequire('path');
            this._crypto = nodeRequire('crypto');
        };
        // patch require-function of nodejs such that we can manually create a script
        // from cached data. this is done by overriding the `Module._compile` function
        NodeScriptLoader.prototype._initNodeRequire = function (nodeRequire, moduleManager) {
            // It is important to check for `nodeCachedData` first and then set `_didPatchNodeRequire`.
            // That's because `nodeCachedData` is set _after_ calling this for the first time...
            var nodeCachedData = moduleManager.getConfig().getOptionsLiteral().nodeCachedData;
            if (!nodeCachedData) {
                return;
            }
            if (this._didPatchNodeRequire) {
                return;
            }
            this._didPatchNodeRequire = true;
            var that = this;
            var Module = nodeRequire('module');
            function makeRequireFunction(mod) {
                var Module = mod.constructor;
                var require = function require(path) {
                    try {
                        return mod.require(path);
                    }
                    finally {
                        // nothing
                    }
                };
                require.resolve = function resolve(request, options) {
                    return Module._resolveFilename(request, mod, false, options);
                };
                require.resolve.paths = function paths(request) {
                    return Module._resolveLookupPaths(request, mod);
                };
                require.main = process.mainModule;
                require.extensions = Module._extensions;
                require.cache = Module._cache;
                return require;
            }
            Module.prototype._compile = function (content, filename) {
                // remove shebang and create wrapper function
                var scriptSource = Module.wrap(content.replace(/^#!.*/, ''));
                // create script
                var recorder = moduleManager.getRecorder();
                var cachedDataPath = that._getCachedDataPath(nodeCachedData, filename);
                var options = { filename: filename };
                var hashData;
                try {
                    var data = that._fs.readFileSync(cachedDataPath);
                    hashData = data.slice(0, 16);
                    options.cachedData = data.slice(16);
                    recorder.record(60 /* CachedDataFound */, cachedDataPath);
                }
                catch (_e) {
                    recorder.record(61 /* CachedDataMissed */, cachedDataPath);
                }
                var script = new that._vm.Script(scriptSource, options);
                var compileWrapper = script.runInThisContext(options);
                // run script
                var dirname = that._path.dirname(filename);
                var require = makeRequireFunction(this);
                var args = [this.exports, require, this, filename, dirname, process, _commonjsGlobal, Buffer];
                var result = compileWrapper.apply(this.exports, args);
                // cached data aftermath
                that._handleCachedData(script, scriptSource, cachedDataPath, !options.cachedData, moduleManager);
                that._verifyCachedData(script, scriptSource, cachedDataPath, hashData, moduleManager);
                return result;
            };
        };
        NodeScriptLoader.prototype.load = function (moduleManager, scriptSrc, callback, errorback) {
            var _this = this;
            var opts = moduleManager.getConfig().getOptionsLiteral();
            var nodeRequire = ensureRecordedNodeRequire(moduleManager.getRecorder(), (opts.nodeRequire || AMDLoader.global.nodeRequire));
            var nodeInstrumenter = (opts.nodeInstrumenter || function (c) { return c; });
            this._init(nodeRequire);
            this._initNodeRequire(nodeRequire, moduleManager);
            var recorder = moduleManager.getRecorder();
            if (/^node\|/.test(scriptSrc)) {
                var pieces = scriptSrc.split('|');
                var moduleExports_3 = null;
                try {
                    moduleExports_3 = nodeRequire(pieces[1]);
                }
                catch (err) {
                    errorback(err);
                    return;
                }
                moduleManager.enqueueDefineAnonymousModule([], function () { return moduleExports_3; });
                callback();
            }
            else {
                scriptSrc = AMDLoader.Utilities.fileUriToFilePath(this._env.isWindows, scriptSrc);
                var normalizedScriptSrc_1 = this._path.normalize(scriptSrc);
                var vmScriptPathOrUri_1 = this._getElectronRendererScriptPathOrUri(normalizedScriptSrc_1);
                var wantsCachedData_1 = Boolean(opts.nodeCachedData);
                var cachedDataPath_1 = wantsCachedData_1 ? this._getCachedDataPath(opts.nodeCachedData, scriptSrc) : undefined;
                this._readSourceAndCachedData(normalizedScriptSrc_1, cachedDataPath_1, recorder, function (err, data, cachedData, hashData) {
                    if (err) {
                        errorback(err);
                        return;
                    }
                    var scriptSource;
                    if (data.charCodeAt(0) === NodeScriptLoader._BOM) {
                        scriptSource = NodeScriptLoader._PREFIX + data.substring(1) + NodeScriptLoader._SUFFIX;
                    }
                    else {
                        scriptSource = NodeScriptLoader._PREFIX + data + NodeScriptLoader._SUFFIX;
                    }
                    scriptSource = nodeInstrumenter(scriptSource, normalizedScriptSrc_1);
                    var scriptOpts = { filename: vmScriptPathOrUri_1, cachedData: cachedData };
                    var script = _this._createAndEvalScript(moduleManager, scriptSource, scriptOpts, callback, errorback);
                    _this._handleCachedData(script, scriptSource, cachedDataPath_1, wantsCachedData_1 && !cachedData, moduleManager);
                    _this._verifyCachedData(script, scriptSource, cachedDataPath_1, hashData, moduleManager);
                });
            }
        };
        NodeScriptLoader.prototype._createAndEvalScript = function (moduleManager, contents, options, callback, errorback) {
            var recorder = moduleManager.getRecorder();
            recorder.record(31 /* NodeBeginEvaluatingScript */, options.filename);
            var script = new this._vm.Script(contents, options);
            var ret = script.runInThisContext(options);
            var globalDefineFunc = moduleManager.getGlobalAMDDefineFunc();
            var receivedDefineCall = false;
            var localDefineFunc = function () {
                receivedDefineCall = true;
                return globalDefineFunc.apply(null, arguments);
            };
            localDefineFunc.amd = globalDefineFunc.amd;
            ret.call(AMDLoader.global, moduleManager.getGlobalAMDRequireFunc(), localDefineFunc, options.filename, this._path.dirname(options.filename));
            recorder.record(32 /* NodeEndEvaluatingScript */, options.filename);
            if (receivedDefineCall) {
                callback();
            }
            else {
                errorback(new Error("Didn't receive define call in " + options.filename + "!"));
            }
            return script;
        };
        NodeScriptLoader.prototype._getElectronRendererScriptPathOrUri = function (path) {
            if (!this._env.isElectronRenderer) {
                return path;
            }
            var driveLetterMatch = path.match(/^([a-z])\:(.*)/i);
            if (driveLetterMatch) {
                // windows
                return "file:///" + (driveLetterMatch[1].toUpperCase() + ':' + driveLetterMatch[2]).replace(/\\/g, '/');
            }
            else {
                // nix
                return "file://" + path;
            }
        };
        NodeScriptLoader.prototype._getCachedDataPath = function (config, filename) {
            var hash = this._crypto.createHash('md5').update(filename, 'utf8').update(config.seed, 'utf8').update(process.arch, '').digest('hex');
            var basename = this._path.basename(filename).replace(/\.js$/, '');
            return this._path.join(config.path, basename + "-" + hash + ".code");
        };
        NodeScriptLoader.prototype._handleCachedData = function (script, scriptSource, cachedDataPath, createCachedData, moduleManager) {
            var _this = this;
            if (script.cachedDataRejected) {
                // cached data got rejected -> delete and re-create
                this._fs.unlink(cachedDataPath, function (err) {
                    moduleManager.getRecorder().record(62 /* CachedDataRejected */, cachedDataPath);
                    _this._createAndWriteCachedData(script, scriptSource, cachedDataPath, moduleManager);
                    if (err) {
                        moduleManager.getConfig().onError(err);
                    }
                });
            }
            else if (createCachedData) {
                // no cached data, but wanted
                this._createAndWriteCachedData(script, scriptSource, cachedDataPath, moduleManager);
            }
        };
        // Cached data format: | SOURCE_HASH | V8_CACHED_DATA |
        // -SOURCE_HASH is the md5 hash of the JS source (always 16 bytes)
        // -V8_CACHED_DATA is what v8 produces
        NodeScriptLoader.prototype._createAndWriteCachedData = function (script, scriptSource, cachedDataPath, moduleManager) {
            var _this = this;
            var timeout = Math.ceil(moduleManager.getConfig().getOptionsLiteral().nodeCachedData.writeDelay * (1 + Math.random()));
            var lastSize = -1;
            var iteration = 0;
            var hashData = undefined;
            var createLoop = function () {
                setTimeout(function () {
                    if (!hashData) {
                        hashData = _this._crypto.createHash('md5').update(scriptSource, 'utf8').digest();
                    }
                    var cachedData = script.createCachedData();
                    if (cachedData.length === 0 || cachedData.length === lastSize || iteration >= 5) {
                        // done
                        return;
                    }
                    if (cachedData.length < lastSize) {
                        // less data than before: skip, try again next round
                        createLoop();
                        return;
                    }
                    lastSize = cachedData.length;
                    _this._fs.writeFile(cachedDataPath, Buffer.concat([hashData, cachedData]), function (err) {
                        if (err) {
                            moduleManager.getConfig().onError(err);
                        }
                        moduleManager.getRecorder().record(63 /* CachedDataCreated */, cachedDataPath);
                        createLoop();
                    });
                }, timeout * (Math.pow(4, iteration++)));
            };
            // with some delay (`timeout`) create cached data
            // and repeat that (with backoff delay) until the
            // data seems to be not changing anymore
            createLoop();
        };
        NodeScriptLoader.prototype._readSourceAndCachedData = function (sourcePath, cachedDataPath, recorder, callback) {
            if (!cachedDataPath) {
                // no cached data case
                this._fs.readFile(sourcePath, { encoding: 'utf8' }, callback);
            }
            else {
                // cached data case: read both files in parallel
                var source_1 = undefined;
                var cachedData_1 = undefined;
                var hashData_1 = undefined;
                var steps_1 = 2;
                var step_1 = function (err) {
                    if (err) {
                        callback(err);
                    }
                    else if (--steps_1 === 0) {
                        callback(undefined, source_1, cachedData_1, hashData_1);
                    }
                };
                this._fs.readFile(sourcePath, { encoding: 'utf8' }, function (err, data) {
                    source_1 = data;
                    step_1(err);
                });
                this._fs.readFile(cachedDataPath, function (err, data) {
                    if (!err && data && data.length > 0) {
                        hashData_1 = data.slice(0, 16);
                        cachedData_1 = data.slice(16);
                        recorder.record(60 /* CachedDataFound */, cachedDataPath);
                    }
                    else {
                        recorder.record(61 /* CachedDataMissed */, cachedDataPath);
                    }
                    step_1(); // ignored: cached data is optional
                });
            }
        };
        NodeScriptLoader.prototype._verifyCachedData = function (script, scriptSource, cachedDataPath, hashData, moduleManager) {
            var _this = this;
            if (!hashData) {
                // nothing to do
                return;
            }
            if (script.cachedDataRejected) {
                // invalid anyways
                return;
            }
            setTimeout(function () {
                // check source hash - the contract is that file paths change when file content
                // change (e.g use the commit or version id as cache path). this check is
                // for violations of this contract.
                var hashDataNow = _this._crypto.createHash('md5').update(scriptSource, 'utf8').digest();
                if (!hashData.equals(hashDataNow)) {
                    moduleManager.getConfig().onError(new Error("FAILED TO VERIFY CACHED DATA, deleting stale '" + cachedDataPath + "' now, but a RESTART IS REQUIRED"));
                    _this._fs.unlink(cachedDataPath, function (err) {
                        if (err) {
                            moduleManager.getConfig().onError(err);
                        }
                    });
                }
            }, Math.ceil(5000 * (1 + Math.random())));
        };
        NodeScriptLoader._BOM = 0xFEFF;
        NodeScriptLoader._PREFIX = '(function (require, define, __filename, __dirname) { ';
        NodeScriptLoader._SUFFIX = '\n});';
        return NodeScriptLoader;
    }());
    function ensureRecordedNodeRequire(recorder, _nodeRequire) {
        if (_nodeRequire.__$__isRecorded) {
            // it is already recorded
            return _nodeRequire;
        }
        var nodeRequire = function nodeRequire(what) {
            recorder.record(33 /* NodeBeginNativeRequire */, what);
            try {
                return _nodeRequire(what);
            }
            finally {
                recorder.record(34 /* NodeEndNativeRequire */, what);
            }
        };
        nodeRequire.__$__isRecorded = true;
        return nodeRequire;
    }
    AMDLoader.ensureRecordedNodeRequire = ensureRecordedNodeRequire;
    function createScriptLoader(env) {
        return new OnlyOnceScriptLoader(env);
    }
    AMDLoader.createScriptLoader = createScriptLoader;
})(AMDLoader || (AMDLoader = {}));
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
var AMDLoader;
(function (AMDLoader) {
    // ------------------------------------------------------------------------
    // ModuleIdResolver
    var ModuleIdResolver = /** @class */ (function () {
        function ModuleIdResolver(fromModuleId) {
            var lastSlash = fromModuleId.lastIndexOf('/');
            if (lastSlash !== -1) {
                this.fromModulePath = fromModuleId.substr(0, lastSlash + 1);
            }
            else {
                this.fromModulePath = '';
            }
        }
        /**
         * Normalize 'a/../name' to 'name', etc.
         */
        ModuleIdResolver._normalizeModuleId = function (moduleId) {
            var r = moduleId, pattern;
            // replace /./ => /
            pattern = /\/\.\//;
            while (pattern.test(r)) {
                r = r.replace(pattern, '/');
            }
            // replace ^./ => nothing
            r = r.replace(/^\.\//g, '');
            // replace /aa/../ => / (BUT IGNORE /../../)
            pattern = /\/(([^\/])|([^\/][^\/\.])|([^\/\.][^\/])|([^\/][^\/][^\/]+))\/\.\.\//;
            while (pattern.test(r)) {
                r = r.replace(pattern, '/');
            }
            // replace ^aa/../ => nothing (BUT IGNORE ../../)
            r = r.replace(/^(([^\/])|([^\/][^\/\.])|([^\/\.][^\/])|([^\/][^\/][^\/]+))\/\.\.\//, '');
            return r;
        };
        /**
         * Resolve relative module ids
         */
        ModuleIdResolver.prototype.resolveModule = function (moduleId) {
            var result = moduleId;
            if (!AMDLoader.Utilities.isAbsolutePath(result)) {
                if (AMDLoader.Utilities.startsWith(result, './') || AMDLoader.Utilities.startsWith(result, '../')) {
                    result = ModuleIdResolver._normalizeModuleId(this.fromModulePath + result);
                }
            }
            return result;
        };
        ModuleIdResolver.ROOT = new ModuleIdResolver('');
        return ModuleIdResolver;
    }());
    AMDLoader.ModuleIdResolver = ModuleIdResolver;
    // ------------------------------------------------------------------------
    // Module
    var Module = /** @class */ (function () {
        function Module(id, strId, dependencies, callback, errorback, moduleIdResolver) {
            this.id = id;
            this.strId = strId;
            this.dependencies = dependencies;
            this._callback = callback;
            this._errorback = errorback;
            this.moduleIdResolver = moduleIdResolver;
            this.exports = {};
            this.error = null;
            this.exportsPassedIn = false;
            this.unresolvedDependenciesCount = this.dependencies.length;
            this._isComplete = false;
        }
        Module._safeInvokeFunction = function (callback, args) {
            try {
                return {
                    returnedValue: callback.apply(AMDLoader.global, args),
                    producedError: null
                };
            }
            catch (e) {
                return {
                    returnedValue: null,
                    producedError: e
                };
            }
        };
        Module._invokeFactory = function (config, strModuleId, callback, dependenciesValues) {
            if (config.isBuild() && !AMDLoader.Utilities.isAnonymousModule(strModuleId)) {
                return {
                    returnedValue: null,
                    producedError: null
                };
            }
            if (config.shouldCatchError()) {
                return this._safeInvokeFunction(callback, dependenciesValues);
            }
            return {
                returnedValue: callback.apply(AMDLoader.global, dependenciesValues),
                producedError: null
            };
        };
        Module.prototype.complete = function (recorder, config, dependenciesValues) {
            this._isComplete = true;
            var producedError = null;
            if (this._callback) {
                if (typeof this._callback === 'function') {
                    recorder.record(21 /* BeginInvokeFactory */, this.strId);
                    var r = Module._invokeFactory(config, this.strId, this._callback, dependenciesValues);
                    producedError = r.producedError;
                    recorder.record(22 /* EndInvokeFactory */, this.strId);
                    if (!producedError && typeof r.returnedValue !== 'undefined' && (!this.exportsPassedIn || AMDLoader.Utilities.isEmpty(this.exports))) {
                        this.exports = r.returnedValue;
                    }
                }
                else {
                    this.exports = this._callback;
                }
            }
            if (producedError) {
                var err = AMDLoader.ensureError(producedError);
                err.phase = 'factory';
                err.moduleId = this.strId;
                this.error = err;
                config.onError(err);
            }
            this.dependencies = null;
            this._callback = null;
            this._errorback = null;
            this.moduleIdResolver = null;
        };
        /**
         * One of the direct dependencies or a transitive dependency has failed to load.
         */
        Module.prototype.onDependencyError = function (err) {
            this._isComplete = true;
            this.error = err;
            if (this._errorback) {
                this._errorback(err);
                return true;
            }
            return false;
        };
        /**
         * Is the current module complete?
         */
        Module.prototype.isComplete = function () {
            return this._isComplete;
        };
        return Module;
    }());
    AMDLoader.Module = Module;
    var ModuleIdProvider = /** @class */ (function () {
        function ModuleIdProvider() {
            this._nextId = 0;
            this._strModuleIdToIntModuleId = new Map();
            this._intModuleIdToStrModuleId = [];
            // Ensure values 0, 1, 2 are assigned accordingly with ModuleId
            this.getModuleId('exports');
            this.getModuleId('module');
            this.getModuleId('require');
        }
        ModuleIdProvider.prototype.getMaxModuleId = function () {
            return this._nextId;
        };
        ModuleIdProvider.prototype.getModuleId = function (strModuleId) {
            var id = this._strModuleIdToIntModuleId.get(strModuleId);
            if (typeof id === 'undefined') {
                id = this._nextId++;
                this._strModuleIdToIntModuleId.set(strModuleId, id);
                this._intModuleIdToStrModuleId[id] = strModuleId;
            }
            return id;
        };
        ModuleIdProvider.prototype.getStrModuleId = function (moduleId) {
            return this._intModuleIdToStrModuleId[moduleId];
        };
        return ModuleIdProvider;
    }());
    var RegularDependency = /** @class */ (function () {
        function RegularDependency(id) {
            this.id = id;
        }
        RegularDependency.EXPORTS = new RegularDependency(0 /* EXPORTS */);
        RegularDependency.MODULE = new RegularDependency(1 /* MODULE */);
        RegularDependency.REQUIRE = new RegularDependency(2 /* REQUIRE */);
        return RegularDependency;
    }());
    AMDLoader.RegularDependency = RegularDependency;
    var PluginDependency = /** @class */ (function () {
        function PluginDependency(id, pluginId, pluginParam) {
            this.id = id;
            this.pluginId = pluginId;
            this.pluginParam = pluginParam;
        }
        return PluginDependency;
    }());
    AMDLoader.PluginDependency = PluginDependency;
    var ModuleManager = /** @class */ (function () {
        function ModuleManager(env, scriptLoader, defineFunc, requireFunc, loaderAvailableTimestamp) {
            if (loaderAvailableTimestamp === void 0) { loaderAvailableTimestamp = 0; }
            this._env = env;
            this._scriptLoader = scriptLoader;
            this._loaderAvailableTimestamp = loaderAvailableTimestamp;
            this._defineFunc = defineFunc;
            this._requireFunc = requireFunc;
            this._moduleIdProvider = new ModuleIdProvider();
            this._config = new AMDLoader.Configuration(this._env);
            this._hasDependencyCycle = false;
            this._modules2 = [];
            this._knownModules2 = [];
            this._inverseDependencies2 = [];
            this._inversePluginDependencies2 = new Map();
            this._currentAnonymousDefineCall = null;
            this._recorder = null;
            this._buildInfoPath = [];
            this._buildInfoDefineStack = [];
            this._buildInfoDependencies = [];
        }
        ModuleManager.prototype.reset = function () {
            return new ModuleManager(this._env, this._scriptLoader, this._defineFunc, this._requireFunc, this._loaderAvailableTimestamp);
        };
        ModuleManager.prototype.getGlobalAMDDefineFunc = function () {
            return this._defineFunc;
        };
        ModuleManager.prototype.getGlobalAMDRequireFunc = function () {
            return this._requireFunc;
        };
        ModuleManager._findRelevantLocationInStack = function (needle, stack) {
            var normalize = function (str) { return str.replace(/\\/g, '/'); };
            var normalizedPath = normalize(needle);
            var stackPieces = stack.split(/\n/);
            for (var i = 0; i < stackPieces.length; i++) {
                var m = stackPieces[i].match(/(.*):(\d+):(\d+)\)?$/);
                if (m) {
                    var stackPath = m[1];
                    var stackLine = m[2];
                    var stackColumn = m[3];
                    var trimPathOffset = Math.max(stackPath.lastIndexOf(' ') + 1, stackPath.lastIndexOf('(') + 1);
                    stackPath = stackPath.substr(trimPathOffset);
                    stackPath = normalize(stackPath);
                    if (stackPath === normalizedPath) {
                        var r = {
                            line: parseInt(stackLine, 10),
                            col: parseInt(stackColumn, 10)
                        };
                        if (r.line === 1) {
                            r.col -= '(function (require, define, __filename, __dirname) { '.length;
                        }
                        return r;
                    }
                }
            }
            throw new Error('Could not correlate define call site for needle ' + needle);
        };
        ModuleManager.prototype.getBuildInfo = function () {
            if (!this._config.isBuild()) {
                return null;
            }
            var result = [], resultLen = 0;
            for (var i = 0, len = this._modules2.length; i < len; i++) {
                var m = this._modules2[i];
                if (!m) {
                    continue;
                }
                var location_1 = this._buildInfoPath[m.id] || null;
                var defineStack = this._buildInfoDefineStack[m.id] || null;
                var dependencies = this._buildInfoDependencies[m.id];
                result[resultLen++] = {
                    id: m.strId,
                    path: location_1,
                    defineLocation: (location_1 && defineStack ? ModuleManager._findRelevantLocationInStack(location_1, defineStack) : null),
                    dependencies: dependencies,
                    shim: null,
                    exports: m.exports
                };
            }
            return result;
        };
        ModuleManager.prototype.getRecorder = function () {
            if (!this._recorder) {
                if (this._config.shouldRecordStats()) {
                    this._recorder = new AMDLoader.LoaderEventRecorder(this._loaderAvailableTimestamp);
                }
                else {
                    this._recorder = AMDLoader.NullLoaderEventRecorder.INSTANCE;
                }
            }
            return this._recorder;
        };
        ModuleManager.prototype.getLoaderEvents = function () {
            return this.getRecorder().getEvents();
        };
        /**
         * Defines an anonymous module (without an id). Its name will be resolved as we receive a callback from the scriptLoader.
         * @param dependencies @see defineModule
         * @param callback @see defineModule
         */
        ModuleManager.prototype.enqueueDefineAnonymousModule = function (dependencies, callback) {
            if (this._currentAnonymousDefineCall !== null) {
                throw new Error('Can only have one anonymous define call per script file');
            }
            var stack = null;
            if (this._config.isBuild()) {
                stack = new Error('StackLocation').stack || null;
            }
            this._currentAnonymousDefineCall = {
                stack: stack,
                dependencies: dependencies,
                callback: callback
            };
        };
        /**
         * Creates a module and stores it in _modules. The manager will immediately begin resolving its dependencies.
         * @param strModuleId An unique and absolute id of the module. This must not collide with another module's id
         * @param dependencies An array with the dependencies of the module. Special keys are: "require", "exports" and "module"
         * @param callback if callback is a function, it will be called with the resolved dependencies. if callback is an object, it will be considered as the exports of the module.
         */
        ModuleManager.prototype.defineModule = function (strModuleId, dependencies, callback, errorback, stack, moduleIdResolver) {
            var _this = this;
            if (moduleIdResolver === void 0) { moduleIdResolver = new ModuleIdResolver(strModuleId); }
            var moduleId = this._moduleIdProvider.getModuleId(strModuleId);
            // if (this._modules2[moduleId]) {
            //     if (!this._config.isDuplicateMessageIgnoredFor(strModuleId)) {
            //         console.warn('Duplicate definition of module \'' + strModuleId + '\'');
            //     }
            //     // Super important! Completely ignore duplicate module definition
            //     return;
            // }
            var m = new Module(moduleId, strModuleId, this._normalizeDependencies(dependencies, moduleIdResolver), callback, errorback, moduleIdResolver);
            this._modules2[moduleId] = m;
            if (this._config.isBuild()) {
                this._buildInfoDefineStack[moduleId] = stack;
                this._buildInfoDependencies[moduleId] = (m.dependencies || []).map(function (dep) { return _this._moduleIdProvider.getStrModuleId(dep.id); });
            }
            // Resolving of dependencies is immediate (not in a timeout). If there's a need to support a packer that concatenates in an
            // unordered manner, in order to finish processing the file, execute the following method in a timeout
            _currentDefineModule = m.exports;
            this._resolve(m);
        };
        ModuleManager.prototype._normalizeDependency = function (dependency, moduleIdResolver) {
            if (dependency === 'exports') {
                return RegularDependency.EXPORTS;
            }
            if (dependency === 'module') {
                return RegularDependency.MODULE;
            }
            if (dependency === 'require') {
                return RegularDependency.REQUIRE;
            }
            // Normalize dependency and then request it from the manager
            var bangIndex = dependency.indexOf('!');
            if (bangIndex >= 0) {
                var strPluginId = moduleIdResolver.resolveModule(dependency.substr(0, bangIndex));
                var pluginParam = moduleIdResolver.resolveModule(dependency.substr(bangIndex + 1));
                var dependencyId = this._moduleIdProvider.getModuleId(strPluginId + '!' + pluginParam);
                var pluginId = this._moduleIdProvider.getModuleId(strPluginId);
                return new PluginDependency(dependencyId, pluginId, pluginParam);
            }
            return new RegularDependency(this._moduleIdProvider.getModuleId(moduleIdResolver.resolveModule(dependency)));
        };
        ModuleManager.prototype._normalizeDependencies = function (dependencies, moduleIdResolver) {
            var result = [], resultLen = 0;
            for (var i = 0, len = dependencies.length; i < len; i++) {
                result[resultLen++] = this._normalizeDependency(dependencies[i], moduleIdResolver);
            }
            return result;
        };
        ModuleManager.prototype._relativeRequire = function (moduleIdResolver, dependencies, callback, errorback) {
            if (typeof dependencies === 'string') {
                return this.synchronousRequire(dependencies, moduleIdResolver);
            }
            this.defineModule(AMDLoader.Utilities.generateAnonymousModule(), dependencies, callback, errorback, null, moduleIdResolver);
        };
        /**
         * Require synchronously a module by its absolute id. If the module is not loaded, an exception will be thrown.
         * @param id The unique and absolute id of the required module
         * @return The exports of module 'id'
         */
        ModuleManager.prototype.synchronousRequire = function (_strModuleId, moduleIdResolver) {
            if (moduleIdResolver === void 0) { moduleIdResolver = new ModuleIdResolver(_strModuleId); }
            var dependency = this._normalizeDependency(_strModuleId, moduleIdResolver);
            var m = this._modules2[dependency.id];
            if (!m) {
                throw new Error('Check dependency list! Synchronous require cannot resolve module \'' + _strModuleId + '\'. This is the first mention of this module!');
            }
            if (!m.isComplete()) {
                throw new Error('Check dependency list! Synchronous require cannot resolve module \'' + _strModuleId + '\'. This module has not been resolved completely yet.');
            }
            if (m.error) {
                throw m.error;
            }
            return m.exports;
        };
        ModuleManager.prototype.configure = function (params, shouldOverwrite) {
            var oldShouldRecordStats = this._config.shouldRecordStats();
            if (shouldOverwrite) {
                this._config = new AMDLoader.Configuration(this._env, params);
            }
            else {
                this._config = this._config.cloneAndMerge(params);
            }
            if (this._config.shouldRecordStats() && !oldShouldRecordStats) {
                this._recorder = null;
            }
        };
        ModuleManager.prototype.getConfig = function () {
            return this._config;
        };
        /**
         * Callback from the scriptLoader when a module has been loaded.
         * This means its code is available and has been executed.
         */
        ModuleManager.prototype._onLoad = function (moduleId) {
            if (this._currentAnonymousDefineCall !== null) {
                var defineCall = this._currentAnonymousDefineCall;
                this._currentAnonymousDefineCall = null;
                // Hit an anonymous define call
                this.defineModule(this._moduleIdProvider.getStrModuleId(moduleId), defineCall.dependencies, defineCall.callback, null, defineCall.stack);
            }
        };
        ModuleManager.prototype._createLoadError = function (moduleId, _err) {
            var _this = this;
            var strModuleId = this._moduleIdProvider.getStrModuleId(moduleId);
            var neededBy = (this._inverseDependencies2[moduleId] || []).map(function (intModuleId) { return _this._moduleIdProvider.getStrModuleId(intModuleId); });
            var err = AMDLoader.ensureError(_err);
            err.phase = 'loading';
            err.moduleId = strModuleId;
            err.neededBy = neededBy;
            return err;
        };
        /**
         * Callback from the scriptLoader when a module hasn't been loaded.
         * This means that the script was not found (e.g. 404) or there was an error in the script.
         */
        ModuleManager.prototype._onLoadError = function (moduleId, err) {
            var error = this._createLoadError(moduleId, err);
            if (!this._modules2[moduleId]) {
                this._modules2[moduleId] = new Module(moduleId, this._moduleIdProvider.getStrModuleId(moduleId), [], function () { }, null, null);
            }
            // Find any 'local' error handlers, walk the entire chain of inverse dependencies if necessary.
            var seenModuleId = [];
            for (var i = 0, len = this._moduleIdProvider.getMaxModuleId(); i < len; i++) {
                seenModuleId[i] = false;
            }
            var someoneNotified = false;
            var queue = [];
            queue.push(moduleId);
            seenModuleId[moduleId] = true;
            while (queue.length > 0) {
                var queueElement = queue.shift();
                var m = this._modules2[queueElement];
                if (m) {
                    someoneNotified = m.onDependencyError(error) || someoneNotified;
                }
                var inverseDeps = this._inverseDependencies2[queueElement];
                if (inverseDeps) {
                    for (var i = 0, len = inverseDeps.length; i < len; i++) {
                        var inverseDep = inverseDeps[i];
                        if (!seenModuleId[inverseDep]) {
                            queue.push(inverseDep);
                            seenModuleId[inverseDep] = true;
                        }
                    }
                }
            }
            if (!someoneNotified) {
                this._config.onError(error);
            }
        };
        /**
         * Walks (recursively) the dependencies of 'from' in search of 'to'.
         * Returns true if there is such a path or false otherwise.
         * @param from Module id to start at
         * @param to Module id to look for
         */
        ModuleManager.prototype._hasDependencyPath = function (fromId, toId) {
            var from = this._modules2[fromId];
            if (!from) {
                return false;
            }
            var inQueue = [];
            for (var i = 0, len = this._moduleIdProvider.getMaxModuleId(); i < len; i++) {
                inQueue[i] = false;
            }
            var queue = [];
            // Insert 'from' in queue
            queue.push(from);
            inQueue[fromId] = true;
            while (queue.length > 0) {
                // Pop first inserted element of queue
                var element = queue.shift();
                var dependencies = element.dependencies;
                if (dependencies) {
                    // Walk the element's dependencies
                    for (var i = 0, len = dependencies.length; i < len; i++) {
                        var dependency = dependencies[i];
                        if (dependency.id === toId) {
                            // There is a path to 'to'
                            return true;
                        }
                        var dependencyModule = this._modules2[dependency.id];
                        if (dependencyModule && !inQueue[dependency.id]) {
                            // Insert 'dependency' in queue
                            inQueue[dependency.id] = true;
                            queue.push(dependencyModule);
                        }
                    }
                }
            }
            // There is no path to 'to'
            return false;
        };
        /**
         * Walks (recursively) the dependencies of 'from' in search of 'to'.
         * Returns cycle as array.
         * @param from Module id to start at
         * @param to Module id to look for
         */
        ModuleManager.prototype._findCyclePath = function (fromId, toId, depth) {
            if (fromId === toId || depth === 50) {
                return [fromId];
            }
            var from = this._modules2[fromId];
            if (!from) {
                return null;
            }
            // Walk the element's dependencies
            var dependencies = from.dependencies;
            if (dependencies) {
                for (var i = 0, len = dependencies.length; i < len; i++) {
                    var path = this._findCyclePath(dependencies[i].id, toId, depth + 1);
                    if (path !== null) {
                        path.push(fromId);
                        return path;
                    }
                }
            }
            return null;
        };
        /**
         * Create the local 'require' that is passed into modules
         */
        ModuleManager.prototype._createRequire = function (moduleIdResolver) {
            var _this = this;
            var result = (function (dependencies, callback, errorback) {
                return _this._relativeRequire(moduleIdResolver, dependencies, callback, errorback);
            });
            result.toUrl = function (id) {
                return _this._config.requireToUrl(moduleIdResolver.resolveModule(id));
            };
            result.getStats = function () {
                return _this.getLoaderEvents();
            };
            result.hasDependencyCycle = function () {
                return _this._hasDependencyCycle;
            };
            result.config = function (params, shouldOverwrite) {
                if (shouldOverwrite === void 0) { shouldOverwrite = false; }
                _this.configure(params, shouldOverwrite);
            };
            result.__$__nodeRequire = AMDLoader.global.nodeRequire;
            return result;
        };
        ModuleManager.prototype._loadModule = function (moduleId) {
            var _this = this;
            if (this._modules2[moduleId] || this._knownModules2[moduleId]) {
                // known module
                return;
            }
            this._knownModules2[moduleId] = true;
            var strModuleId = this._moduleIdProvider.getStrModuleId(moduleId);
            var paths = this._config.moduleIdToPaths(strModuleId);
            var scopedPackageRegex = /^@[^\/]+\/[^\/]+$/; // matches @scope/package-name
            if (this._env.isNode && (strModuleId.indexOf('/') === -1 || scopedPackageRegex.test(strModuleId))) {
                paths.push('node|' + strModuleId);
            }
            var lastPathIndex = -1;
            var loadNextPath = function (err) {
                lastPathIndex++;
                if (lastPathIndex >= paths.length) {
                    // No more paths to try
                    _this._onLoadError(moduleId, err);
                }
                else {
                    var currentPath_1 = paths[lastPathIndex];
                    var recorder_1 = _this.getRecorder();
                    if (_this._config.isBuild() && currentPath_1 === 'empty:') {
                        _this._buildInfoPath[moduleId] = currentPath_1;
                        _this.defineModule(_this._moduleIdProvider.getStrModuleId(moduleId), [], null, null, null);
                        _this._onLoad(moduleId);
                        return;
                    }
                    recorder_1.record(10 /* BeginLoadingScript */, currentPath_1);
                    _this._scriptLoader.load(_this, currentPath_1, function () {
                        if (_this._config.isBuild()) {
                            _this._buildInfoPath[moduleId] = currentPath_1;
                        }
                        recorder_1.record(11 /* EndLoadingScriptOK */, currentPath_1);
                        _this._onLoad(moduleId);
                    }, function (err) {
                        recorder_1.record(12 /* EndLoadingScriptError */, currentPath_1);
                        loadNextPath(err);
                    });
                }
            };
            loadNextPath(null);
        };
        /**
         * Resolve a plugin dependency with the plugin loaded & complete
         * @param module The module that has this dependency
         * @param pluginDependency The semi-normalized dependency that appears in the module. e.g. 'vs/css!./mycssfile'. Only the plugin part (before !) is normalized
         * @param plugin The plugin (what the plugin exports)
         */
        ModuleManager.prototype._loadPluginDependency = function (plugin, pluginDependency) {
            var _this = this;
            if (this._modules2[pluginDependency.id] || this._knownModules2[pluginDependency.id]) {
                // known module
                return;
            }
            this._knownModules2[pluginDependency.id] = true;
            // Delegate the loading of the resource to the plugin
            var load = (function (value) {
                _this.defineModule(_this._moduleIdProvider.getStrModuleId(pluginDependency.id), [], value, null, null);
            });
            load.error = function (err) {
                _this._config.onError(_this._createLoadError(pluginDependency.id, err));
            };
            plugin.load(pluginDependency.pluginParam, this._createRequire(ModuleIdResolver.ROOT), load, this._config.getOptionsLiteral());
        };
        /**
         * Examine the dependencies of module 'module' and resolve them as needed.
         */
        ModuleManager.prototype._resolve = function (module) {
            var _this = this;
            var dependencies = module.dependencies;
            if (dependencies) {
                for (var i = 0, len = dependencies.length; i < len; i++) {
                    var dependency = dependencies[i];
                    if (dependency === RegularDependency.EXPORTS) {
                        module.exportsPassedIn = true;
                        module.unresolvedDependenciesCount--;
                        continue;
                    }
                    if (dependency === RegularDependency.MODULE) {
                        module.unresolvedDependenciesCount--;
                        continue;
                    }
                    if (dependency === RegularDependency.REQUIRE) {
                        module.unresolvedDependenciesCount--;
                        continue;
                    }
                    var dependencyModule = this._modules2[dependency.id];
                    if (dependencyModule && dependencyModule.isComplete()) {
                        if (dependencyModule.error) {
                            module.onDependencyError(dependencyModule.error);
                            return;
                        }
                        module.unresolvedDependenciesCount--;
                        continue;
                    }
                    if (this._hasDependencyPath(dependency.id, module.id)) {
                        this._hasDependencyCycle = true;
                        console.warn('There is a dependency cycle between \'' + this._moduleIdProvider.getStrModuleId(dependency.id) + '\' and \'' + this._moduleIdProvider.getStrModuleId(module.id) + '\'. The cyclic path follows:');
                        var cyclePath = this._findCyclePath(dependency.id, module.id, 0) || [];
                        cyclePath.reverse();
                        cyclePath.push(dependency.id);
                        console.warn(cyclePath.map(function (id) { return _this._moduleIdProvider.getStrModuleId(id); }).join(' => \n'));
                        // Break the cycle
                        module.unresolvedDependenciesCount--;
                        continue;
                    }
                    // record inverse dependency
                    this._inverseDependencies2[dependency.id] = this._inverseDependencies2[dependency.id] || [];
                    this._inverseDependencies2[dependency.id].push(module.id);
                    if (dependency instanceof PluginDependency) {
                        var plugin = this._modules2[dependency.pluginId];
                        if (plugin && plugin.isComplete()) {
                            this._loadPluginDependency(plugin.exports, dependency);
                            continue;
                        }
                        // Record dependency for when the plugin gets loaded
                        var inversePluginDeps = this._inversePluginDependencies2.get(dependency.pluginId);
                        if (!inversePluginDeps) {
                            inversePluginDeps = [];
                            this._inversePluginDependencies2.set(dependency.pluginId, inversePluginDeps);
                        }
                        inversePluginDeps.push(dependency);
                        this._loadModule(dependency.pluginId);
                        continue;
                    }
                    this._loadModule(dependency.id);
                }
            }
            if (module.unresolvedDependenciesCount === 0) {
                this._onModuleComplete(module);
            }
        };
        ModuleManager.prototype._onModuleComplete = function (module) {
            var _this = this;
            var recorder = this.getRecorder();
            if (module.isComplete()) {
                // already done
                return;
            }
            var dependencies = module.dependencies;
            var dependenciesValues = [];
            if (dependencies) {
                for (var i = 0, len = dependencies.length; i < len; i++) {
                    var dependency = dependencies[i];
                    if (dependency === RegularDependency.EXPORTS) {
                        dependenciesValues[i] = module.exports;
                        continue;
                    }
                    if (dependency === RegularDependency.MODULE) {
                        dependenciesValues[i] = {
                            id: module.strId,
                            config: function () {
                                return _this._config.getConfigForModule(module.strId);
                            }
                        };
                        continue;
                    }
                    if (dependency === RegularDependency.REQUIRE) {
                        dependenciesValues[i] = this._createRequire(module.moduleIdResolver);
                        continue;
                    }
                    var dependencyModule = this._modules2[dependency.id];
                    if (dependencyModule) {
                        dependenciesValues[i] = dependencyModule.exports;
                        continue;
                    }
                    dependenciesValues[i] = null;
                }
            }
            module.complete(recorder, this._config, dependenciesValues);
            // Fetch and clear inverse dependencies
            var inverseDeps = this._inverseDependencies2[module.id];
            this._inverseDependencies2[module.id] = null;
            if (inverseDeps) {
                // Resolve one inverse dependency at a time, always
                // on the lookout for a completed module.
                for (var i = 0, len = inverseDeps.length; i < len; i++) {
                    var inverseDependencyId = inverseDeps[i];
                    var inverseDependency = this._modules2[inverseDependencyId];
                    inverseDependency.unresolvedDependenciesCount--;
                    if (inverseDependency.unresolvedDependenciesCount === 0) {
                        this._onModuleComplete(inverseDependency);
                    }
                }
            }
            var inversePluginDeps = this._inversePluginDependencies2.get(module.id);
            if (inversePluginDeps) {
                // This module is used as a plugin at least once
                // Fetch and clear these inverse plugin dependencies
                this._inversePluginDependencies2.delete(module.id);
                // Resolve plugin dependencies one at a time
                for (var i = 0, len = inversePluginDeps.length; i < len; i++) {
                    this._loadPluginDependency(module.exports, inversePluginDeps[i]);
                }
            }
        };
        return ModuleManager;
    }());
    AMDLoader.ModuleManager = ModuleManager;
})(AMDLoader || (AMDLoader = {}));
var define;
var AMDLoader;
(function (AMDLoader) {
    var env = new AMDLoader.Environment();
    var moduleManager = null;
    var DefineFunc = function (id, dependencies, callback) {
        if (typeof id !== 'string') {
            callback = dependencies;
            dependencies = id;
            id = null;
        }
        if (typeof dependencies !== 'object' || !Array.isArray(dependencies)) {
            callback = dependencies;
            dependencies = null;
        }
        if (!dependencies) {
            dependencies = ['require', 'exports', 'module'];
        }
        if (id) {
            moduleManager.defineModule(id, dependencies, callback, null, null);
        }
        else {
            moduleManager.enqueueDefineAnonymousModule(dependencies, callback);
        }
    };
    DefineFunc.amd = true;
    var _requireFunc_config = function (params, shouldOverwrite) {
        if (shouldOverwrite === void 0) { shouldOverwrite = false; }
        moduleManager.configure(params, shouldOverwrite);
    };
    var RequireFunc = function () {
        if (arguments.length === 1) {
            if ((arguments[0] instanceof Object) && !Array.isArray(arguments[0])) {
                _requireFunc_config(arguments[0]);
                return;
            }
            if (typeof arguments[0] === 'string') {
                return moduleManager.synchronousRequire(arguments[0]);
            }
        }
        if (arguments.length === 2 || arguments.length === 3) {
            if (Array.isArray(arguments[0])) {
                moduleManager.defineModule(AMDLoader.Utilities.generateAnonymousModule(), arguments[0], arguments[1], arguments[2], null);
                return;
            }
        }
        throw new Error('Unrecognized require call');
    };
    RequireFunc.config = _requireFunc_config;
    RequireFunc.getConfig = function () {
        return moduleManager.getConfig().getOptionsLiteral();
    };
    RequireFunc.reset = function () {
        moduleManager = moduleManager.reset();
    };
    RequireFunc.getBuildInfo = function () {
        return moduleManager.getBuildInfo();
    };
    RequireFunc.getStats = function () {
        return moduleManager.getLoaderEvents();
    };
    RequireFunc.define = DefineFunc;
    RequireFunc.defined = function(module){
        let moduleId = moduleManager._moduleIdProvider.getModuleId(module);
        if (moduleManager._modules2[moduleId])
            return true;
        return false;
    };
    function init() {
        if (typeof AMDLoader.global.require !== 'undefined' || typeof require !== 'undefined') {
            var _nodeRequire = (AMDLoader.global.require || require);
            if (typeof _nodeRequire === 'function' && typeof _nodeRequire.resolve === 'function') {
                // re-expose node's require function
                var nodeRequire = AMDLoader.ensureRecordedNodeRequire(moduleManager.getRecorder(), _nodeRequire);
                AMDLoader.global.nodeRequire = nodeRequire;
                RequireFunc.nodeRequire = nodeRequire;
                RequireFunc.__$__nodeRequire = nodeRequire;
            }
        }
        if (env.isNode && !env.isElectronRenderer && !env.isElectronNodeIntegrationWebWorker) {
            module.exports = RequireFunc;
            require = RequireFunc;
        }
        else {
            if (!env.isElectronRenderer) {
                AMDLoader.global.define = DefineFunc;
            }
            AMDLoader.global.require = RequireFunc;
        }
    }
    AMDLoader.init = init;
    if (typeof AMDLoader.global.define !== 'function' || !AMDLoader.global.define.amd) {
        moduleManager = new AMDLoader.ModuleManager(env, AMDLoader.createScriptLoader(env), DefineFunc, RequireFunc, AMDLoader.Utilities.getHighPerformanceTimestamp());
        // The global variable require can configure the loader
        if (typeof AMDLoader.global.require !== 'undefined' && typeof AMDLoader.global.require !== 'function') {
            RequireFunc.config(AMDLoader.global.require);
        }
        // This define is for the local closure defined in node in the case that the loader is concatenated
        define = function () {
            return DefineFunc.apply(null, arguments);
        };
        define.amd = DefineFunc.amd;
        if (typeof doNotInitLoader === 'undefined') {
            init();
        }
    }
})(AMDLoader || (AMDLoader = {}));

define("base64-js", ()=>{});
define("ieee754", ()=>{});
define("buffer", (require,exports)=>{
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <https://feross.org>
 * @license  MIT
 */
/* eslint-disable no-proto */

'use strict'

const base64 = require('base64-js')
const ieee754 = require('ieee754')
const customInspectSymbol =
  (typeof Symbol === 'function' && typeof Symbol['for'] === 'function') // eslint-disable-line dot-notation
    ? Symbol['for']('nodejs.util.inspect.custom') // eslint-disable-line dot-notation
    : null

exports.Buffer = Buffer
exports.SlowBuffer = SlowBuffer
exports.INSPECT_MAX_BYTES = 50

const K_MAX_LENGTH = 0x7fffffff
exports.kMaxLength = K_MAX_LENGTH

/**
 * If `Buffer.TYPED_ARRAY_SUPPORT`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Print warning and recommend using `buffer` v4.x which has an Object
 *               implementation (most compatible, even IE6)
 *
 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
 * Opera 11.6+, iOS 4.2+.
 *
 * We report that the browser does not support typed arrays if the are not subclassable
 * using __proto__. Firefox 4-29 lacks support for adding new properties to `Uint8Array`
 * (See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438). IE 10 lacks support
 * for __proto__ and has a buggy typed array implementation.
 */
Buffer.TYPED_ARRAY_SUPPORT = typedArraySupport()

if (!Buffer.TYPED_ARRAY_SUPPORT && typeof console !== 'undefined' &&
    typeof console.error === 'function') {
  console.error(
    'This browser lacks typed array (Uint8Array) support which is required by ' +
    '`buffer` v5.x. Use `buffer` v4.x if you require old browser support.'
  )
}

function typedArraySupport () {
  // Can typed array instances can be augmented?
  try {
    const arr = new Uint8Array(1)
    const proto = { foo: function () { return 42 } }
    Object.setPrototypeOf(proto, Uint8Array.prototype)
    Object.setPrototypeOf(arr, proto)
    return arr.foo() === 42
  } catch (e) {
    return false
  }
}

Object.defineProperty(Buffer.prototype, 'parent', {
  enumerable: true,
  get: function () {
    if (!Buffer.isBuffer(this)) return undefined
    return this.buffer
  }
})

Object.defineProperty(Buffer.prototype, 'offset', {
  enumerable: true,
  get: function () {
    if (!Buffer.isBuffer(this)) return undefined
    return this.byteOffset
  }
})

function createBuffer (length) {
  if (length > K_MAX_LENGTH) {
    throw new RangeError('The value "' + length + '" is invalid for option "size"')
  }
  // Return an augmented `Uint8Array` instance
  const buf = new Uint8Array(length)
  Object.setPrototypeOf(buf, Buffer.prototype)
  return buf
}

/**
 * The Buffer constructor returns instances of `Uint8Array` that have their
 * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
 * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
 * and the `Uint8Array` methods. Square bracket notation works as expected -- it
 * returns a single octet.
 *
 * The `Uint8Array` prototype remains unmodified.
 */

function Buffer (arg, encodingOrOffset, length) {
  // Common case.
  if (typeof arg === 'number') {
    if (typeof encodingOrOffset === 'string') {
      throw new TypeError(
        'The "string" argument must be of type string. Received type number'
      )
    }
    return allocUnsafe(arg)
  }
  return from(arg, encodingOrOffset, length)
}

Buffer.poolSize = 8192 // not used by this implementation

function from (value, encodingOrOffset, length) {
  if (typeof value === 'string') {
    return fromString(value, encodingOrOffset)
  }

  if (ArrayBuffer.isView(value)) {
    return fromArrayView(value)
  }

  if (value == null) {
    throw new TypeError(
      'The first argument must be one of type string, Buffer, ArrayBuffer, Array, ' +
      'or Array-like Object. Received type ' + (typeof value)
    )
  }

  if (isInstance(value, ArrayBuffer) ||
      (value && isInstance(value.buffer, ArrayBuffer))) {
    return fromArrayBuffer(value, encodingOrOffset, length)
  }

  if (typeof SharedArrayBuffer !== 'undefined' &&
      (isInstance(value, SharedArrayBuffer) ||
      (value && isInstance(value.buffer, SharedArrayBuffer)))) {
    return fromArrayBuffer(value, encodingOrOffset, length)
  }

  if (typeof value === 'number') {
    throw new TypeError(
      'The "value" argument must not be of type number. Received type number'
    )
  }

  const valueOf = value.valueOf && value.valueOf()
  if (valueOf != null && valueOf !== value) {
    return Buffer.from(valueOf, encodingOrOffset, length)
  }

  const b = fromObject(value)
  if (b) return b

  if (typeof Symbol !== 'undefined' && Symbol.toPrimitive != null &&
      typeof value[Symbol.toPrimitive] === 'function') {
    return Buffer.from(value[Symbol.toPrimitive]('string'), encodingOrOffset, length)
  }

  throw new TypeError(
    'The first argument must be one of type string, Buffer, ArrayBuffer, Array, ' +
    'or Array-like Object. Received type ' + (typeof value)
  )
}

/**
 * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
 * if value is a number.
 * Buffer.from(str[, encoding])
 * Buffer.from(array)
 * Buffer.from(buffer)
 * Buffer.from(arrayBuffer[, byteOffset[, length]])
 **/
Buffer.from = function (value, encodingOrOffset, length) {
  return from(value, encodingOrOffset, length)
}

// Note: Change prototype *after* Buffer.from is defined to workaround Chrome bug:
// https://github.com/feross/buffer/pull/148
Object.setPrototypeOf(Buffer.prototype, Uint8Array.prototype)
Object.setPrototypeOf(Buffer, Uint8Array)

function assertSize (size) {
  if (typeof size !== 'number') {
    throw new TypeError('"size" argument must be of type number')
  } else if (size < 0) {
    throw new RangeError('The value "' + size + '" is invalid for option "size"')
  }
}

function alloc (size, fill, encoding) {
  assertSize(size)
  if (size <= 0) {
    return createBuffer(size)
  }
  if (fill !== undefined) {
    // Only pay attention to encoding if it's a string. This
    // prevents accidentally sending in a number that would
    // be interpreted as a start offset.
    return typeof encoding === 'string'
      ? createBuffer(size).fill(fill, encoding)
      : createBuffer(size).fill(fill)
  }
  return createBuffer(size)
}

/**
 * Creates a new filled Buffer instance.
 * alloc(size[, fill[, encoding]])
 **/
Buffer.alloc = function (size, fill, encoding) {
  return alloc(size, fill, encoding)
}

function allocUnsafe (size) {
  assertSize(size)
  return createBuffer(size < 0 ? 0 : checked(size) | 0)
}

/**
 * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
 * */
Buffer.allocUnsafe = function (size) {
  return allocUnsafe(size)
}
/**
 * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
 */
Buffer.allocUnsafeSlow = function (size) {
  return allocUnsafe(size)
}

function fromString (string, encoding) {
  if (typeof encoding !== 'string' || encoding === '') {
    encoding = 'utf8'
  }

  if (!Buffer.isEncoding(encoding)) {
    throw new TypeError('Unknown encoding: ' + encoding)
  }

  const length = byteLength(string, encoding) | 0
  let buf = createBuffer(length)

  const actual = buf.write(string, encoding)

  if (actual !== length) {
    // Writing a hex string, for example, that contains invalid characters will
    // cause everything after the first invalid character to be ignored. (e.g.
    // 'abxxcd' will be treated as 'ab')
    buf = buf.slice(0, actual)
  }

  return buf
}

function fromArrayLike (array) {
  const length = array.length < 0 ? 0 : checked(array.length) | 0
  const buf = createBuffer(length)
  for (let i = 0; i < length; i += 1) {
    buf[i] = array[i] & 255
  }
  return buf
}

function fromArrayView (arrayView) {
  if (isInstance(arrayView, Uint8Array)) {
    const copy = new Uint8Array(arrayView)
    return fromArrayBuffer(copy.buffer, copy.byteOffset, copy.byteLength)
  }
  return fromArrayLike(arrayView)
}

function fromArrayBuffer (array, byteOffset, length) {
  if (byteOffset < 0 || array.byteLength < byteOffset) {
    throw new RangeError('"offset" is outside of buffer bounds')
  }

  if (array.byteLength < byteOffset + (length || 0)) {
    throw new RangeError('"length" is outside of buffer bounds')
  }

  let buf
  if (byteOffset === undefined && length === undefined) {
    buf = new Uint8Array(array)
  } else if (length === undefined) {
    buf = new Uint8Array(array, byteOffset)
  } else {
    buf = new Uint8Array(array, byteOffset, length)
  }

  // Return an augmented `Uint8Array` instance
  Object.setPrototypeOf(buf, Buffer.prototype)

  return buf
}

function fromObject (obj) {
  if (Buffer.isBuffer(obj)) {
    const len = checked(obj.length) | 0
    const buf = createBuffer(len)

    if (buf.length === 0) {
      return buf
    }

    obj.copy(buf, 0, 0, len)
    return buf
  }

  if (obj.length !== undefined) {
    if (typeof obj.length !== 'number' || numberIsNaN(obj.length)) {
      return createBuffer(0)
    }
    return fromArrayLike(obj)
  }

  if (obj.type === 'Buffer' && Array.isArray(obj.data)) {
    return fromArrayLike(obj.data)
  }
}

function checked (length) {
  // Note: cannot use `length < K_MAX_LENGTH` here because that fails when
  // length is NaN (which is otherwise coerced to zero.)
  if (length >= K_MAX_LENGTH) {
    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
                         'size: 0x' + K_MAX_LENGTH.toString(16) + ' bytes')
  }
  return length | 0
}

function SlowBuffer (length) {
  if (+length != length) { // eslint-disable-line eqeqeq
    length = 0
  }
  return Buffer.alloc(+length)
}

Buffer.isBuffer = function isBuffer (b) {
  return b != null && b._isBuffer === true &&
    b !== Buffer.prototype // so Buffer.isBuffer(Buffer.prototype) will be false
}

Buffer.compare = function compare (a, b) {
  if (isInstance(a, Uint8Array)) a = Buffer.from(a, a.offset, a.byteLength)
  if (isInstance(b, Uint8Array)) b = Buffer.from(b, b.offset, b.byteLength)
  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
    throw new TypeError(
      'The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array'
    )
  }

  if (a === b) return 0

  let x = a.length
  let y = b.length

  for (let i = 0, len = Math.min(x, y); i < len; ++i) {
    if (a[i] !== b[i]) {
      x = a[i]
      y = b[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

Buffer.isEncoding = function isEncoding (encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'latin1':
    case 'binary':
    case 'base64':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true
    default:
      return false
  }
}

Buffer.concat = function concat (list, length) {
  if (!Array.isArray(list)) {
    throw new TypeError('"list" argument must be an Array of Buffers')
  }

  if (list.length === 0) {
    return Buffer.alloc(0)
  }

  let i
  if (length === undefined) {
    length = 0
    for (i = 0; i < list.length; ++i) {
      length += list[i].length
    }
  }

  const buffer = Buffer.allocUnsafe(length)
  let pos = 0
  for (i = 0; i < list.length; ++i) {
    let buf = list[i]
    if (isInstance(buf, Uint8Array)) {
      if (pos + buf.length > buffer.length) {
        if (!Buffer.isBuffer(buf)) buf = Buffer.from(buf)
        buf.copy(buffer, pos)
      } else {
        Uint8Array.prototype.set.call(
          buffer,
          buf,
          pos
        )
      }
    } else if (!Buffer.isBuffer(buf)) {
      throw new TypeError('"list" argument must be an Array of Buffers')
    } else {
      buf.copy(buffer, pos)
    }
    pos += buf.length
  }
  return buffer
}

function byteLength (string, encoding) {
  if (Buffer.isBuffer(string)) {
    return string.length
  }
  if (ArrayBuffer.isView(string) || isInstance(string, ArrayBuffer)) {
    return string.byteLength
  }
  if (typeof string !== 'string') {
    throw new TypeError(
      'The "string" argument must be one of type string, Buffer, or ArrayBuffer. ' +
      'Received type ' + typeof string
    )
  }

  const len = string.length
  const mustMatch = (arguments.length > 2 && arguments[2] === true)
  if (!mustMatch && len === 0) return 0

  // Use a for loop to avoid recursion
  let loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'ascii':
      case 'latin1':
      case 'binary':
        return len
      case 'utf8':
      case 'utf-8':
        return utf8ToBytes(string).length
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return len * 2
      case 'hex':
        return len >>> 1
      case 'base64':
        return base64ToBytes(string).length
      default:
        if (loweredCase) {
          return mustMatch ? -1 : utf8ToBytes(string).length // assume utf8
        }
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}
Buffer.byteLength = byteLength

function slowToString (encoding, start, end) {
  let loweredCase = false

  // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
  // property of a typed array.

  // This behaves neither like String nor Uint8Array in that we set start/end
  // to their upper/lower bounds if the value passed is out of range.
  // undefined is handled specially as per ECMA-262 6th Edition,
  // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.
  if (start === undefined || start < 0) {
    start = 0
  }
  // Return early if start > this.length. Done here to prevent potential uint32
  // coercion fail below.
  if (start > this.length) {
    return ''
  }

  if (end === undefined || end > this.length) {
    end = this.length
  }

  if (end <= 0) {
    return ''
  }

  // Force coercion to uint32. This will also coerce falsey/NaN values to 0.
  end >>>= 0
  start >>>= 0

  if (end <= start) {
    return ''
  }

  if (!encoding) encoding = 'utf8'

  while (true) {
    switch (encoding) {
      case 'hex':
        return hexSlice(this, start, end)

      case 'utf8':
      case 'utf-8':
        return utf8Slice(this, start, end)

      case 'ascii':
        return asciiSlice(this, start, end)

      case 'latin1':
      case 'binary':
        return latin1Slice(this, start, end)

      case 'base64':
        return base64Slice(this, start, end)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return utf16leSlice(this, start, end)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = (encoding + '').toLowerCase()
        loweredCase = true
    }
  }
}

// This property is used by `Buffer.isBuffer` (and the `is-buffer` npm package)
// to detect a Buffer instance. It's not possible to use `instanceof Buffer`
// reliably in a browserify context because there could be multiple different
// copies of the 'buffer' package in use. This method works even for Buffer
// instances that were created from another copy of the `buffer` package.
// See: https://github.com/feross/buffer/issues/154
Buffer.prototype._isBuffer = true

function swap (b, n, m) {
  const i = b[n]
  b[n] = b[m]
  b[m] = i
}

Buffer.prototype.swap16 = function swap16 () {
  const len = this.length
  if (len % 2 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 16-bits')
  }
  for (let i = 0; i < len; i += 2) {
    swap(this, i, i + 1)
  }
  return this
}

Buffer.prototype.swap32 = function swap32 () {
  const len = this.length
  if (len % 4 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 32-bits')
  }
  for (let i = 0; i < len; i += 4) {
    swap(this, i, i + 3)
    swap(this, i + 1, i + 2)
  }
  return this
}

Buffer.prototype.swap64 = function swap64 () {
  const len = this.length
  if (len % 8 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 64-bits')
  }
  for (let i = 0; i < len; i += 8) {
    swap(this, i, i + 7)
    swap(this, i + 1, i + 6)
    swap(this, i + 2, i + 5)
    swap(this, i + 3, i + 4)
  }
  return this
}

Buffer.prototype.toString = function toString () {
  const length = this.length
  if (length === 0) return ''
  if (arguments.length === 0) return utf8Slice(this, 0, length)
  return slowToString.apply(this, arguments)
}

Buffer.prototype.toLocaleString = Buffer.prototype.toString

Buffer.prototype.equals = function equals (b) {
  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
  if (this === b) return true
  return Buffer.compare(this, b) === 0
}

Buffer.prototype.inspect = function inspect () {
  let str = ''
  const max = exports.INSPECT_MAX_BYTES
  str = this.toString('hex', 0, max).replace(/(.{2})/g, '$1 ').trim()
  if (this.length > max) str += ' ... '
  return '<Buffer ' + str + '>'
}
if (customInspectSymbol) {
  Buffer.prototype[customInspectSymbol] = Buffer.prototype.inspect
}

Buffer.prototype.compare = function compare (target, start, end, thisStart, thisEnd) {
  if (isInstance(target, Uint8Array)) {
    target = Buffer.from(target, target.offset, target.byteLength)
  }
  if (!Buffer.isBuffer(target)) {
    throw new TypeError(
      'The "target" argument must be one of type Buffer or Uint8Array. ' +
      'Received type ' + (typeof target)
    )
  }

  if (start === undefined) {
    start = 0
  }
  if (end === undefined) {
    end = target ? target.length : 0
  }
  if (thisStart === undefined) {
    thisStart = 0
  }
  if (thisEnd === undefined) {
    thisEnd = this.length
  }

  if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
    throw new RangeError('out of range index')
  }

  if (thisStart >= thisEnd && start >= end) {
    return 0
  }
  if (thisStart >= thisEnd) {
    return -1
  }
  if (start >= end) {
    return 1
  }

  start >>>= 0
  end >>>= 0
  thisStart >>>= 0
  thisEnd >>>= 0

  if (this === target) return 0

  let x = thisEnd - thisStart
  let y = end - start
  const len = Math.min(x, y)

  const thisCopy = this.slice(thisStart, thisEnd)
  const targetCopy = target.slice(start, end)

  for (let i = 0; i < len; ++i) {
    if (thisCopy[i] !== targetCopy[i]) {
      x = thisCopy[i]
      y = targetCopy[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

// Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,
// OR the last index of `val` in `buffer` at offset <= `byteOffset`.
//
// Arguments:
// - buffer - a Buffer to search
// - val - a string, Buffer, or number
// - byteOffset - an index into `buffer`; will be clamped to an int32
// - encoding - an optional encoding, relevant is val is a string
// - dir - true for indexOf, false for lastIndexOf
function bidirectionalIndexOf (buffer, val, byteOffset, encoding, dir) {
  // Empty buffer means no match
  if (buffer.length === 0) return -1

  // Normalize byteOffset
  if (typeof byteOffset === 'string') {
    encoding = byteOffset
    byteOffset = 0
  } else if (byteOffset > 0x7fffffff) {
    byteOffset = 0x7fffffff
  } else if (byteOffset < -0x80000000) {
    byteOffset = -0x80000000
  }
  byteOffset = +byteOffset // Coerce to Number.
  if (numberIsNaN(byteOffset)) {
    // byteOffset: it it's undefined, null, NaN, "foo", etc, search whole buffer
    byteOffset = dir ? 0 : (buffer.length - 1)
  }

  // Normalize byteOffset: negative offsets start from the end of the buffer
  if (byteOffset < 0) byteOffset = buffer.length + byteOffset
  if (byteOffset >= buffer.length) {
    if (dir) return -1
    else byteOffset = buffer.length - 1
  } else if (byteOffset < 0) {
    if (dir) byteOffset = 0
    else return -1
  }

  // Normalize val
  if (typeof val === 'string') {
    val = Buffer.from(val, encoding)
  }

  // Finally, search either indexOf (if dir is true) or lastIndexOf
  if (Buffer.isBuffer(val)) {
    // Special case: looking for empty string/buffer always fails
    if (val.length === 0) {
      return -1
    }
    return arrayIndexOf(buffer, val, byteOffset, encoding, dir)
  } else if (typeof val === 'number') {
    val = val & 0xFF // Search for a byte value [0-255]
    if (typeof Uint8Array.prototype.indexOf === 'function') {
      if (dir) {
        return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset)
      } else {
        return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset)
      }
    }
    return arrayIndexOf(buffer, [val], byteOffset, encoding, dir)
  }

  throw new TypeError('val must be string, number or Buffer')
}

function arrayIndexOf (arr, val, byteOffset, encoding, dir) {
  let indexSize = 1
  let arrLength = arr.length
  let valLength = val.length

  if (encoding !== undefined) {
    encoding = String(encoding).toLowerCase()
    if (encoding === 'ucs2' || encoding === 'ucs-2' ||
        encoding === 'utf16le' || encoding === 'utf-16le') {
      if (arr.length < 2 || val.length < 2) {
        return -1
      }
      indexSize = 2
      arrLength /= 2
      valLength /= 2
      byteOffset /= 2
    }
  }

  function read (buf, i) {
    if (indexSize === 1) {
      return buf[i]
    } else {
      return buf.readUInt16BE(i * indexSize)
    }
  }

  let i
  if (dir) {
    let foundIndex = -1
    for (i = byteOffset; i < arrLength; i++) {
      if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
        if (foundIndex === -1) foundIndex = i
        if (i - foundIndex + 1 === valLength) return foundIndex * indexSize
      } else {
        if (foundIndex !== -1) i -= i - foundIndex
        foundIndex = -1
      }
    }
  } else {
    if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength
    for (i = byteOffset; i >= 0; i--) {
      let found = true
      for (let j = 0; j < valLength; j++) {
        if (read(arr, i + j) !== read(val, j)) {
          found = false
          break
        }
      }
      if (found) return i
    }
  }

  return -1
}

Buffer.prototype.includes = function includes (val, byteOffset, encoding) {
  return this.indexOf(val, byteOffset, encoding) !== -1
}

Buffer.prototype.indexOf = function indexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, true)
}

Buffer.prototype.lastIndexOf = function lastIndexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, false)
}

function hexWrite (buf, string, offset, length) {
  offset = Number(offset) || 0
  const remaining = buf.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }

  const strLen = string.length

  if (length > strLen / 2) {
    length = strLen / 2
  }
  let i
  for (i = 0; i < length; ++i) {
    const parsed = parseInt(string.substr(i * 2, 2), 16)
    if (numberIsNaN(parsed)) return i
    buf[offset + i] = parsed
  }
  return i
}

function utf8Write (buf, string, offset, length) {
  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
}

function asciiWrite (buf, string, offset, length) {
  return blitBuffer(asciiToBytes(string), buf, offset, length)
}

function base64Write (buf, string, offset, length) {
  return blitBuffer(base64ToBytes(string), buf, offset, length)
}

function ucs2Write (buf, string, offset, length) {
  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
}

Buffer.prototype.write = function write (string, offset, length, encoding) {
  // Buffer#write(string)
  if (offset === undefined) {
    encoding = 'utf8'
    length = this.length
    offset = 0
  // Buffer#write(string, encoding)
  } else if (length === undefined && typeof offset === 'string') {
    encoding = offset
    length = this.length
    offset = 0
  // Buffer#write(string, offset[, length][, encoding])
  } else if (isFinite(offset)) {
    offset = offset >>> 0
    if (isFinite(length)) {
      length = length >>> 0
      if (encoding === undefined) encoding = 'utf8'
    } else {
      encoding = length
      length = undefined
    }
  } else {
    throw new Error(
      'Buffer.write(string, encoding, offset[, length]) is no longer supported'
    )
  }

  const remaining = this.length - offset
  if (length === undefined || length > remaining) length = remaining

  if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
    throw new RangeError('Attempt to write outside buffer bounds')
  }

  if (!encoding) encoding = 'utf8'

  let loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'hex':
        return hexWrite(this, string, offset, length)

      case 'utf8':
      case 'utf-8':
        return utf8Write(this, string, offset, length)

      case 'ascii':
      case 'latin1':
      case 'binary':
        return asciiWrite(this, string, offset, length)

      case 'base64':
        // Warning: maxLength not taken into account in base64Write
        return base64Write(this, string, offset, length)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return ucs2Write(this, string, offset, length)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}

Buffer.prototype.toJSON = function toJSON () {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  }
}

function base64Slice (buf, start, end) {
  if (start === 0 && end === buf.length) {
    return base64.fromByteArray(buf)
  } else {
    return base64.fromByteArray(buf.slice(start, end))
  }
}

function utf8Slice (buf, start, end) {
  end = Math.min(buf.length, end)
  const res = []

  let i = start
  while (i < end) {
    const firstByte = buf[i]
    let codePoint = null
    let bytesPerSequence = (firstByte > 0xEF)
      ? 4
      : (firstByte > 0xDF)
          ? 3
          : (firstByte > 0xBF)
              ? 2
              : 1

    if (i + bytesPerSequence <= end) {
      let secondByte, thirdByte, fourthByte, tempCodePoint

      switch (bytesPerSequence) {
        case 1:
          if (firstByte < 0x80) {
            codePoint = firstByte
          }
          break
        case 2:
          secondByte = buf[i + 1]
          if ((secondByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F)
            if (tempCodePoint > 0x7F) {
              codePoint = tempCodePoint
            }
          }
          break
        case 3:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F)
            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
              codePoint = tempCodePoint
            }
          }
          break
        case 4:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          fourthByte = buf[i + 3]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F)
            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
              codePoint = tempCodePoint
            }
          }
      }
    }

    if (codePoint === null) {
      // we did not generate a valid codePoint so insert a
      // replacement char (U+FFFD) and advance only 1 byte
      codePoint = 0xFFFD
      bytesPerSequence = 1
    } else if (codePoint > 0xFFFF) {
      // encode to utf16 (surrogate pair dance)
      codePoint -= 0x10000
      res.push(codePoint >>> 10 & 0x3FF | 0xD800)
      codePoint = 0xDC00 | codePoint & 0x3FF
    }

    res.push(codePoint)
    i += bytesPerSequence
  }

  return decodeCodePointsArray(res)
}

// Based on http://stackoverflow.com/a/22747272/680742, the browser with
// the lowest limit is Chrome, with 0x10000 args.
// We go 1 magnitude less, for safety
const MAX_ARGUMENTS_LENGTH = 0x1000

function decodeCodePointsArray (codePoints) {
  const len = codePoints.length
  if (len <= MAX_ARGUMENTS_LENGTH) {
    return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
  }

  // Decode in chunks to avoid "call stack size exceeded".
  let res = ''
  let i = 0
  while (i < len) {
    res += String.fromCharCode.apply(
      String,
      codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
    )
  }
  return res
}

function asciiSlice (buf, start, end) {
  let ret = ''
  end = Math.min(buf.length, end)

  for (let i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i] & 0x7F)
  }
  return ret
}

function latin1Slice (buf, start, end) {
  let ret = ''
  end = Math.min(buf.length, end)

  for (let i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i])
  }
  return ret
}

function hexSlice (buf, start, end) {
  const len = buf.length

  if (!start || start < 0) start = 0
  if (!end || end < 0 || end > len) end = len

  let out = ''
  for (let i = start; i < end; ++i) {
    out += hexSliceLookupTable[buf[i]]
  }
  return out
}

function utf16leSlice (buf, start, end) {
  const bytes = buf.slice(start, end)
  let res = ''
  // If bytes.length is odd, the last 8 bits must be ignored (same as node.js)
  for (let i = 0; i < bytes.length - 1; i += 2) {
    res += String.fromCharCode(bytes[i] + (bytes[i + 1] * 256))
  }
  return res
}

Buffer.prototype.slice = function slice (start, end) {
  const len = this.length
  start = ~~start
  end = end === undefined ? len : ~~end

  if (start < 0) {
    start += len
    if (start < 0) start = 0
  } else if (start > len) {
    start = len
  }

  if (end < 0) {
    end += len
    if (end < 0) end = 0
  } else if (end > len) {
    end = len
  }

  if (end < start) end = start

  const newBuf = this.subarray(start, end)
  // Return an augmented `Uint8Array` instance
  Object.setPrototypeOf(newBuf, Buffer.prototype)

  return newBuf
}

/*
 * Need to make sure that buffer isn't trying to write out of bounds.
 */
function checkOffset (offset, ext, length) {
  if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
}

Buffer.prototype.readUintLE =
Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  let val = this[offset]
  let mul = 1
  let i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }

  return val
}

Buffer.prototype.readUintBE =
Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) {
    checkOffset(offset, byteLength, this.length)
  }

  let val = this[offset + --byteLength]
  let mul = 1
  while (byteLength > 0 && (mul *= 0x100)) {
    val += this[offset + --byteLength] * mul
  }

  return val
}

Buffer.prototype.readUint8 =
Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 1, this.length)
  return this[offset]
}

Buffer.prototype.readUint16LE =
Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  return this[offset] | (this[offset + 1] << 8)
}

Buffer.prototype.readUint16BE =
Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  return (this[offset] << 8) | this[offset + 1]
}

Buffer.prototype.readUint32LE =
Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return ((this[offset]) |
      (this[offset + 1] << 8) |
      (this[offset + 2] << 16)) +
      (this[offset + 3] * 0x1000000)
}

Buffer.prototype.readUint32BE =
Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] * 0x1000000) +
    ((this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    this[offset + 3])
}

Buffer.prototype.readBigUInt64LE = defineBigIntMethod(function readBigUInt64LE (offset) {
  offset = offset >>> 0
  validateNumber(offset, 'offset')
  const first = this[offset]
  const last = this[offset + 7]
  if (first === undefined || last === undefined) {
    boundsError(offset, this.length - 8)
  }

  const lo = first +
    this[++offset] * 2 ** 8 +
    this[++offset] * 2 ** 16 +
    this[++offset] * 2 ** 24

  const hi = this[++offset] +
    this[++offset] * 2 ** 8 +
    this[++offset] * 2 ** 16 +
    last * 2 ** 24

  return BigInt(lo) + (BigInt(hi) << BigInt(32))
})

Buffer.prototype.readBigUInt64BE = defineBigIntMethod(function readBigUInt64BE (offset) {
  offset = offset >>> 0
  validateNumber(offset, 'offset')
  const first = this[offset]
  const last = this[offset + 7]
  if (first === undefined || last === undefined) {
    boundsError(offset, this.length - 8)
  }

  const hi = first * 2 ** 24 +
    this[++offset] * 2 ** 16 +
    this[++offset] * 2 ** 8 +
    this[++offset]

  const lo = this[++offset] * 2 ** 24 +
    this[++offset] * 2 ** 16 +
    this[++offset] * 2 ** 8 +
    last

  return (BigInt(hi) << BigInt(32)) + BigInt(lo)
})

Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  let val = this[offset]
  let mul = 1
  let i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  let i = byteLength
  let mul = 1
  let val = this[offset + --i]
  while (i > 0 && (mul *= 0x100)) {
    val += this[offset + --i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 1, this.length)
  if (!(this[offset] & 0x80)) return (this[offset])
  return ((0xff - this[offset] + 1) * -1)
}

Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  const val = this[offset] | (this[offset + 1] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  const val = this[offset + 1] | (this[offset] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset]) |
    (this[offset + 1] << 8) |
    (this[offset + 2] << 16) |
    (this[offset + 3] << 24)
}

Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] << 24) |
    (this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    (this[offset + 3])
}

Buffer.prototype.readBigInt64LE = defineBigIntMethod(function readBigInt64LE (offset) {
  offset = offset >>> 0
  validateNumber(offset, 'offset')
  const first = this[offset]
  const last = this[offset + 7]
  if (first === undefined || last === undefined) {
    boundsError(offset, this.length - 8)
  }

  const val = this[offset + 4] +
    this[offset + 5] * 2 ** 8 +
    this[offset + 6] * 2 ** 16 +
    (last << 24) // Overflow

  return (BigInt(val) << BigInt(32)) +
    BigInt(first +
    this[++offset] * 2 ** 8 +
    this[++offset] * 2 ** 16 +
    this[++offset] * 2 ** 24)
})

Buffer.prototype.readBigInt64BE = defineBigIntMethod(function readBigInt64BE (offset) {
  offset = offset >>> 0
  validateNumber(offset, 'offset')
  const first = this[offset]
  const last = this[offset + 7]
  if (first === undefined || last === undefined) {
    boundsError(offset, this.length - 8)
  }

  const val = (first << 24) + // Overflow
    this[++offset] * 2 ** 16 +
    this[++offset] * 2 ** 8 +
    this[++offset]

  return (BigInt(val) << BigInt(32)) +
    BigInt(this[++offset] * 2 ** 24 +
    this[++offset] * 2 ** 16 +
    this[++offset] * 2 ** 8 +
    last)
})

Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, true, 23, 4)
}

Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, false, 23, 4)
}

Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, true, 52, 8)
}

Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, false, 52, 8)
}

function checkInt (buf, value, offset, ext, max, min) {
  if (!Buffer.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance')
  if (value > max || value < min) throw new RangeError('"value" argument is out of bounds')
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
}

Buffer.prototype.writeUintLE =
Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) {
    const maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  let mul = 1
  let i = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUintBE =
Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) {
    const maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  let i = byteLength - 1
  let mul = 1
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUint8 =
Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0)
  this[offset] = (value & 0xff)
  return offset + 1
}

Buffer.prototype.writeUint16LE =
Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  this[offset] = (value & 0xff)
  this[offset + 1] = (value >>> 8)
  return offset + 2
}

Buffer.prototype.writeUint16BE =
Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  this[offset] = (value >>> 8)
  this[offset + 1] = (value & 0xff)
  return offset + 2
}

Buffer.prototype.writeUint32LE =
Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  this[offset + 3] = (value >>> 24)
  this[offset + 2] = (value >>> 16)
  this[offset + 1] = (value >>> 8)
  this[offset] = (value & 0xff)
  return offset + 4
}

Buffer.prototype.writeUint32BE =
Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  this[offset] = (value >>> 24)
  this[offset + 1] = (value >>> 16)
  this[offset + 2] = (value >>> 8)
  this[offset + 3] = (value & 0xff)
  return offset + 4
}

function wrtBigUInt64LE (buf, value, offset, min, max) {
  checkIntBI(value, min, max, buf, offset, 7)

  let lo = Number(value & BigInt(0xffffffff))
  buf[offset++] = lo
  lo = lo >> 8
  buf[offset++] = lo
  lo = lo >> 8
  buf[offset++] = lo
  lo = lo >> 8
  buf[offset++] = lo
  let hi = Number(value >> BigInt(32) & BigInt(0xffffffff))
  buf[offset++] = hi
  hi = hi >> 8
  buf[offset++] = hi
  hi = hi >> 8
  buf[offset++] = hi
  hi = hi >> 8
  buf[offset++] = hi
  return offset
}

function wrtBigUInt64BE (buf, value, offset, min, max) {
  checkIntBI(value, min, max, buf, offset, 7)

  let lo = Number(value & BigInt(0xffffffff))
  buf[offset + 7] = lo
  lo = lo >> 8
  buf[offset + 6] = lo
  lo = lo >> 8
  buf[offset + 5] = lo
  lo = lo >> 8
  buf[offset + 4] = lo
  let hi = Number(value >> BigInt(32) & BigInt(0xffffffff))
  buf[offset + 3] = hi
  hi = hi >> 8
  buf[offset + 2] = hi
  hi = hi >> 8
  buf[offset + 1] = hi
  hi = hi >> 8
  buf[offset] = hi
  return offset + 8
}

Buffer.prototype.writeBigUInt64LE = defineBigIntMethod(function writeBigUInt64LE (value, offset = 0) {
  return wrtBigUInt64LE(this, value, offset, BigInt(0), BigInt('0xffffffffffffffff'))
})

Buffer.prototype.writeBigUInt64BE = defineBigIntMethod(function writeBigUInt64BE (value, offset = 0) {
  return wrtBigUInt64BE(this, value, offset, BigInt(0), BigInt('0xffffffffffffffff'))
})

Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    const limit = Math.pow(2, (8 * byteLength) - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  let i = 0
  let mul = 1
  let sub = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    const limit = Math.pow(2, (8 * byteLength) - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  let i = byteLength - 1
  let mul = 1
  let sub = 0
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80)
  if (value < 0) value = 0xff + value + 1
  this[offset] = (value & 0xff)
  return offset + 1
}

Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  this[offset] = (value & 0xff)
  this[offset + 1] = (value >>> 8)
  return offset + 2
}

Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  this[offset] = (value >>> 8)
  this[offset + 1] = (value & 0xff)
  return offset + 2
}

Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  this[offset] = (value & 0xff)
  this[offset + 1] = (value >>> 8)
  this[offset + 2] = (value >>> 16)
  this[offset + 3] = (value >>> 24)
  return offset + 4
}

Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (value < 0) value = 0xffffffff + value + 1
  this[offset] = (value >>> 24)
  this[offset + 1] = (value >>> 16)
  this[offset + 2] = (value >>> 8)
  this[offset + 3] = (value & 0xff)
  return offset + 4
}

Buffer.prototype.writeBigInt64LE = defineBigIntMethod(function writeBigInt64LE (value, offset = 0) {
  return wrtBigUInt64LE(this, value, offset, -BigInt('0x8000000000000000'), BigInt('0x7fffffffffffffff'))
})

Buffer.prototype.writeBigInt64BE = defineBigIntMethod(function writeBigInt64BE (value, offset = 0) {
  return wrtBigUInt64BE(this, value, offset, -BigInt('0x8000000000000000'), BigInt('0x7fffffffffffffff'))
})

function checkIEEE754 (buf, value, offset, ext, max, min) {
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
  if (offset < 0) throw new RangeError('Index out of range')
}

function writeFloat (buf, value, offset, littleEndian, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38)
  }
  ieee754.write(buf, value, offset, littleEndian, 23, 4)
  return offset + 4
}

Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
  return writeFloat(this, value, offset, true, noAssert)
}

Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
  return writeFloat(this, value, offset, false, noAssert)
}

function writeDouble (buf, value, offset, littleEndian, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308)
  }
  ieee754.write(buf, value, offset, littleEndian, 52, 8)
  return offset + 8
}

Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
  return writeDouble(this, value, offset, true, noAssert)
}

Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
  return writeDouble(this, value, offset, false, noAssert)
}

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function copy (target, targetStart, start, end) {
  if (!Buffer.isBuffer(target)) throw new TypeError('argument should be a Buffer')
  if (!start) start = 0
  if (!end && end !== 0) end = this.length
  if (targetStart >= target.length) targetStart = target.length
  if (!targetStart) targetStart = 0
  if (end > 0 && end < start) end = start

  // Copy 0 bytes; we're done
  if (end === start) return 0
  if (target.length === 0 || this.length === 0) return 0

  // Fatal error conditions
  if (targetStart < 0) {
    throw new RangeError('targetStart out of bounds')
  }
  if (start < 0 || start >= this.length) throw new RangeError('Index out of range')
  if (end < 0) throw new RangeError('sourceEnd out of bounds')

  // Are we oob?
  if (end > this.length) end = this.length
  if (target.length - targetStart < end - start) {
    end = target.length - targetStart + start
  }

  const len = end - start

  if (this === target && typeof Uint8Array.prototype.copyWithin === 'function') {
    // Use built-in when available, missing from IE11
    this.copyWithin(targetStart, start, end)
  } else {
    Uint8Array.prototype.set.call(
      target,
      this.subarray(start, end),
      targetStart
    )
  }

  return len
}

// Usage:
//    buffer.fill(number[, offset[, end]])
//    buffer.fill(buffer[, offset[, end]])
//    buffer.fill(string[, offset[, end]][, encoding])
Buffer.prototype.fill = function fill (val, start, end, encoding) {
  // Handle string cases:
  if (typeof val === 'string') {
    if (typeof start === 'string') {
      encoding = start
      start = 0
      end = this.length
    } else if (typeof end === 'string') {
      encoding = end
      end = this.length
    }
    if (encoding !== undefined && typeof encoding !== 'string') {
      throw new TypeError('encoding must be a string')
    }
    if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {
      throw new TypeError('Unknown encoding: ' + encoding)
    }
    if (val.length === 1) {
      const code = val.charCodeAt(0)
      if ((encoding === 'utf8' && code < 128) ||
          encoding === 'latin1') {
        // Fast path: If `val` fits into a single byte, use that numeric value.
        val = code
      }
    }
  } else if (typeof val === 'number') {
    val = val & 255
  } else if (typeof val === 'boolean') {
    val = Number(val)
  }

  // Invalid ranges are not set to a default, so can range check early.
  if (start < 0 || this.length < start || this.length < end) {
    throw new RangeError('Out of range index')
  }

  if (end <= start) {
    return this
  }

  start = start >>> 0
  end = end === undefined ? this.length : end >>> 0

  if (!val) val = 0

  let i
  if (typeof val === 'number') {
    for (i = start; i < end; ++i) {
      this[i] = val
    }
  } else {
    const bytes = Buffer.isBuffer(val)
      ? val
      : Buffer.from(val, encoding)
    const len = bytes.length
    if (len === 0) {
      throw new TypeError('The value "' + val +
        '" is invalid for argument "value"')
    }
    for (i = 0; i < end - start; ++i) {
      this[i + start] = bytes[i % len]
    }
  }

  return this
}

// CUSTOM ERRORS
// =============

// Simplified versions from Node, changed for Buffer-only usage
const errors = {}
function E (sym, getMessage, Base) {
  errors[sym] = class NodeError extends Base {
    constructor () {
      super()

      Object.defineProperty(this, 'message', {
        value: getMessage.apply(this, arguments),
        writable: true,
        configurable: true
      })

      // Add the error code to the name to include it in the stack trace.
      this.name = `${this.name} [${sym}]`
      // Access the stack to generate the error message including the error code
      // from the name.
      this.stack // eslint-disable-line no-unused-expressions
      // Reset the name to the actual name.
      delete this.name
    }

    get code () {
      return sym
    }

    set code (value) {
      Object.defineProperty(this, 'code', {
        configurable: true,
        enumerable: true,
        value,
        writable: true
      })
    }

    toString () {
      return `${this.name} [${sym}]: ${this.message}`
    }
  }
}

E('ERR_BUFFER_OUT_OF_BOUNDS',
  function (name) {
    if (name) {
      return `${name} is outside of buffer bounds`
    }

    return 'Attempt to access memory outside buffer bounds'
  }, RangeError)
E('ERR_INVALID_ARG_TYPE',
  function (name, actual) {
    return `The "${name}" argument must be of type number. Received type ${typeof actual}`
  }, TypeError)
E('ERR_OUT_OF_RANGE',
  function (str, range, input) {
    let msg = `The value of "${str}" is out of range.`
    let received = input
    if (Number.isInteger(input) && Math.abs(input) > 2 ** 32) {
      received = addNumericalSeparator(String(input))
    } else if (typeof input === 'bigint') {
      received = String(input)
      if (input > BigInt(2) ** BigInt(32) || input < -(BigInt(2) ** BigInt(32))) {
        received = addNumericalSeparator(received)
      }
      received += 'n'
    }
    msg += ` It must be ${range}. Received ${received}`
    return msg
  }, RangeError)

function addNumericalSeparator (val) {
  let res = ''
  let i = val.length
  const start = val[0] === '-' ? 1 : 0
  for (; i >= start + 4; i -= 3) {
    res = `_${val.slice(i - 3, i)}${res}`
  }
  return `${val.slice(0, i)}${res}`
}

// CHECK FUNCTIONS
// ===============

function checkBounds (buf, offset, byteLength) {
  validateNumber(offset, 'offset')
  if (buf[offset] === undefined || buf[offset + byteLength] === undefined) {
    boundsError(offset, buf.length - (byteLength + 1))
  }
}

function checkIntBI (value, min, max, buf, offset, byteLength) {
  if (value > max || value < min) {
    const n = typeof min === 'bigint' ? 'n' : ''
    let range
    if (byteLength > 3) {
      if (min === 0 || min === BigInt(0)) {
        range = `>= 0${n} and < 2${n} ** ${(byteLength + 1) * 8}${n}`
      } else {
        range = `>= -(2${n} ** ${(byteLength + 1) * 8 - 1}${n}) and < 2 ** ` +
                `${(byteLength + 1) * 8 - 1}${n}`
      }
    } else {
      range = `>= ${min}${n} and <= ${max}${n}`
    }
    throw new errors.ERR_OUT_OF_RANGE('value', range, value)
  }
  checkBounds(buf, offset, byteLength)
}

function validateNumber (value, name) {
  if (typeof value !== 'number') {
    throw new errors.ERR_INVALID_ARG_TYPE(name, 'number', value)
  }
}

function boundsError (value, length, type) {
  if (Math.floor(value) !== value) {
    validateNumber(value, type)
    throw new errors.ERR_OUT_OF_RANGE(type || 'offset', 'an integer', value)
  }

  if (length < 0) {
    throw new errors.ERR_BUFFER_OUT_OF_BOUNDS()
  }

  throw new errors.ERR_OUT_OF_RANGE(type || 'offset',
                                    `>= ${type ? 1 : 0} and <= ${length}`,
                                    value)
}

// HELPER FUNCTIONS
// ================

const INVALID_BASE64_RE = /[^+/0-9A-Za-z-_]/g

function base64clean (str) {
  // Node takes equal signs as end of the Base64 encoding
  str = str.split('=')[0]
  // Node strips out invalid characters like \n and \t from the string, base64-js does not
  str = str.trim().replace(INVALID_BASE64_RE, '')
  // Node converts strings with length < 2 to ''
  if (str.length < 2) return ''
  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
  while (str.length % 4 !== 0) {
    str = str + '='
  }
  return str
}

function utf8ToBytes (string, units) {
  units = units || Infinity
  let codePoint
  const length = string.length
  let leadSurrogate = null
  const bytes = []

  for (let i = 0; i < length; ++i) {
    codePoint = string.charCodeAt(i)

    // is surrogate component
    if (codePoint > 0xD7FF && codePoint < 0xE000) {
      // last char was a lead
      if (!leadSurrogate) {
        // no lead yet
        if (codePoint > 0xDBFF) {
          // unexpected trail
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        } else if (i + 1 === length) {
          // unpaired lead
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        }

        // valid lead
        leadSurrogate = codePoint

        continue
      }

      // 2 leads in a row
      if (codePoint < 0xDC00) {
        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
        leadSurrogate = codePoint
        continue
      }

      // valid surrogate pair
      codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000
    } else if (leadSurrogate) {
      // valid bmp char, but last char was a lead
      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
    }

    leadSurrogate = null

    // encode utf8
    if (codePoint < 0x80) {
      if ((units -= 1) < 0) break
      bytes.push(codePoint)
    } else if (codePoint < 0x800) {
      if ((units -= 2) < 0) break
      bytes.push(
        codePoint >> 0x6 | 0xC0,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x10000) {
      if ((units -= 3) < 0) break
      bytes.push(
        codePoint >> 0xC | 0xE0,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x110000) {
      if ((units -= 4) < 0) break
      bytes.push(
        codePoint >> 0x12 | 0xF0,
        codePoint >> 0xC & 0x3F | 0x80,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else {
      throw new Error('Invalid code point')
    }
  }

  return bytes
}

function asciiToBytes (str) {
  const byteArray = []
  for (let i = 0; i < str.length; ++i) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF)
  }
  return byteArray
}

function utf16leToBytes (str, units) {
  let c, hi, lo
  const byteArray = []
  for (let i = 0; i < str.length; ++i) {
    if ((units -= 2) < 0) break

    c = str.charCodeAt(i)
    hi = c >> 8
    lo = c % 256
    byteArray.push(lo)
    byteArray.push(hi)
  }

  return byteArray
}

function base64ToBytes (str) {
  return base64.toByteArray(base64clean(str))
}

function blitBuffer (src, dst, offset, length) {
  let i
  for (i = 0; i < length; ++i) {
    if ((i + offset >= dst.length) || (i >= src.length)) break
    dst[i + offset] = src[i]
  }
  return i
}

// ArrayBuffer or Uint8Array objects from other contexts (i.e. iframes) do not pass
// the `instanceof` check but they should be treated as of that type.
// See: https://github.com/feross/buffer/issues/166
function isInstance (obj, type) {
  return obj instanceof type ||
    (obj != null && obj.constructor != null && obj.constructor.name != null &&
      obj.constructor.name === type.name)
}
function numberIsNaN (obj) {
  // For IE11 support
  return obj !== obj // eslint-disable-line no-self-compare
}

// Create lookup table for `toString('hex')`
// See: https://github.com/feross/buffer/issues/219
const hexSliceLookupTable = (function () {
  const alphabet = '0123456789abcdef'
  const table = new Array(256)
  for (let i = 0; i < 16; ++i) {
    const i16 = i * 16
    for (let j = 0; j < 16; ++j) {
      table[i16 + j] = alphabet[i] + alphabet[j]
    }
  }
  return table
})()

// Return not function with Error if BigInt not supported
function defineBigIntMethod (fn) {
  return typeof BigInt === 'undefined' ? BufferBigIntNotDefined : fn
}

function BufferBigIntNotDefined () {
  throw new Error('BigInt not supported')
}

});
/*!-----------------------------------------------------------
* Copyright (c) IJS Technologies. All rights reserved.
* Released under dual AGPLv3/commercial license
* https://ijs.network
*-----------------------------------------------------------*/

; (function (globalObject) {
  /*---------------------------------------------------------------------------------------------
  *  Copyright (c) 2020 Protocol Labs
  *  Licensed under the MIT License.
  *  https://github.com/multiformats/js-multiformats/blob/master/LICENSE-MIT
  *--------------------------------------------------------------------------------------------*/
  //https://github.com/multiformats/js-multiformats/blob/bb14a29dd823a517ef0c6c741d265e022591d831/src/hashes/digest.js#L66

  class Digest {
    constructor(code, size, digest, bytes) {
      this.code = code;
      this.size = size;
      this.digest = digest;
      this.bytes = bytes;
    }
  }

  const readonly = { writable: false, configurable: false, enumerable: true }
  const hidden = { writable: false, enumerable: false, configurable: false }

  //https://github.com/multiformats/js-multiformats/blob/bb14a29dd823a517ef0c6c741d265e022591d831/src/bases/base.js#L135
  class ComposedDecoder {

    constructor(decoders) {
      this.decoders = decoders
    }

    or(decoder) {
      return or(this, decoder)
    }

    decode(input) {
      const prefix = /** @type {Prefix} */ (input[0])
      const decoder = this.decoders[prefix]
      if (decoder) {
        return decoder.decode(input)
      } else {
        throw RangeError(`Unable to decode multibase string ${JSON.stringify(input)}, only inputs prefixed with ${Object.keys(this.decoders)} are supported`)
      }
    }
  }

  //https://github.com/multiformats/js-multiformats/blob/bb14a29dd823a517ef0c6c741d265e022591d831/src/bases/base.js#L174
  const or = (left, right) => new ComposedDecoder(/** @type {Decoders<L|R>} */({
    ...(left.decoders || { [/** @type UnibaseDecoder<L> */(left).prefix]: left }),
    ...(right.decoders || { [/** @type UnibaseDecoder<R> */(right).prefix]: right })
  }))

  //https://github.com/multiformats/js-multiformats/blob/bb14a29dd823a517ef0c6c741d265e022591d831/src/bases/base.js#L78
  class Decoder {

    constructor(name, prefix, baseDecode) {
      this.name = name
      this.prefix = prefix
      this.baseDecode = baseDecode
    }

    decode(text) {
      if (typeof text === 'string') {
        switch (text[0]) {
          case this.prefix: {
            return this.baseDecode(text.slice(1))
          }
          default: {
            throw Error(`Unable to decode multibase string ${JSON.stringify(text)}, ${this.name} decoder only supports inputs prefixed with ${this.prefix}`)
          }
        }
      } else {
        throw Error('Can only multibase decode strings')
      }
    }

    or(decoder) {
      return or(this, decoder)
    }
  }

  //https://github.com/multiformats/js-multiformats/blob/bb14a29dd823a517ef0c6c741d265e022591d831/src/bases/base.js#L29
  class Encoder {

    constructor(name, prefix, baseEncode) {
      this.name = name
      this.prefix = prefix
      this.baseEncode = baseEncode
    }

    encode(bytes) {
      if (bytes instanceof Uint8Array) {
        return `${this.prefix}${this.baseEncode(bytes)}`
      } else {
        throw Error('Unknown type, must be binary type')
      }
    }
  }

  //https://github.com/multiformats/js-multiformats/blob/bb14a29dd823a517ef0c6c741d265e022591d831/src/bases/base.js#L195
  class Codec {

    constructor(name, prefix, baseEncode, baseDecode) {
      this.name = name
      this.prefix = prefix
      this.baseEncode = baseEncode
      this.baseDecode = baseDecode
      this.encoder = new Encoder(name, prefix, baseEncode)
      this.decoder = new Decoder(name, prefix, baseDecode)
    }

    encode(input) {
      return this.encoder.encode(input)
    }

    decode(input) {
      return this.decoder.decode(input)
    }
  }

  //https://github.com/multiformats/js-multiformats/blob/bb14a29dd823a517ef0c6c741d265e022591d831/src/bases/base.js#L236
  const from_1 = ({ name, prefix, encode, decode }) =>
    new Codec(name, prefix, encode, decode)

  //https://github.com/multiformats/js-multiformats/blob/bb14a29dd823a517ef0c6c741d265e022591d831/vendor/base-x.js#L6
  function _basex(ALPHABET, name) {
    if (ALPHABET.length >= 255) { throw new TypeError('Alphabet too long') }
    var BASE_MAP = new Uint8Array(256);
    for (var j = 0; j < BASE_MAP.length; j++) {
      BASE_MAP[j] = 255;
    }
    for (var i = 0; i < ALPHABET.length; i++) {
      var x = ALPHABET.charAt(i);
      var xc = x.charCodeAt(0);
      if (BASE_MAP[xc] !== 255) { throw new TypeError(x + ' is ambiguous') }
      BASE_MAP[xc] = i;
    }
    var BASE = ALPHABET.length;
    var LEADER = ALPHABET.charAt(0);
    var FACTOR = Math.log(BASE) / Math.log(256); // log(BASE) / log(256), rounded up
    var iFACTOR = Math.log(256) / Math.log(BASE); // log(256) / log(BASE), rounded up
    function encode(source) {
      if (source instanceof Uint8Array); else if (ArrayBuffer.isView(source)) {
        source = new Uint8Array(source.buffer, source.byteOffset, source.byteLength);
      } else if (Array.isArray(source)) {
        source = Uint8Array.from_1(source);
      }
      if (!(source instanceof Uint8Array)) { throw new TypeError('Expected Uint8Array') }
      if (source.length === 0) { return '' }
      // Skip & count leading zeroes.
      var zeroes = 0;
      var length = 0;
      var pbegin = 0;
      var pend = source.length;
      while (pbegin !== pend && source[pbegin] === 0) {
        pbegin++;
        zeroes++;
      }
      // Allocate enough space in big-endian base58 representation.
      var size = ((pend - pbegin) * iFACTOR + 1) >>> 0;
      var b58 = new Uint8Array(size);
      // Process the bytes.
      while (pbegin !== pend) {
        var carry = source[pbegin];
        // Apply "b58 = b58 * 256 + ch".
        var i = 0;
        for (var it1 = size - 1; (carry !== 0 || i < length) && (it1 !== -1); it1--, i++) {
          carry += (256 * b58[it1]) >>> 0;
          b58[it1] = (carry % BASE) >>> 0;
          carry = (carry / BASE) >>> 0;
        }
        if (carry !== 0) { throw new Error('Non-zero carry') }
        length = i;
        pbegin++;
      }
      // Skip leading zeroes in base58 result.
      var it2 = size - length;
      while (it2 !== size && b58[it2] === 0) {
        it2++;
      }
      // Translate the result into a string.
      var str = LEADER.repeat(zeroes);
      for (; it2 < size; ++it2) { str += ALPHABET.charAt(b58[it2]); }
      return str
    }
    function decodeUnsafe(source) {
      if (typeof source !== 'string') { throw new TypeError('Expected String') }
      if (source.length === 0) { return new Uint8Array() }
      var psz = 0;
      // Skip leading spaces.
      if (source[psz] === ' ') { return }
      // Skip and count leading '1's.
      var zeroes = 0;
      var length = 0;
      while (source[psz] === LEADER) {
        zeroes++;
        psz++;
      }
      // Allocate enough space in big-endian base256 representation.
      var size = (((source.length - psz) * FACTOR) + 1) >>> 0; // log(58) / log(256), rounded up.
      var b256 = new Uint8Array(size);
      // Process the characters.
      while (source[psz]) {
        // Decode character
        var carry = BASE_MAP[source.charCodeAt(psz)];
        // Invalid character
        if (carry === 255) { return }
        var i = 0;
        for (var it3 = size - 1; (carry !== 0 || i < length) && (it3 !== -1); it3--, i++) {
          carry += (BASE * b256[it3]) >>> 0;
          b256[it3] = (carry % 256) >>> 0;
          carry = (carry / 256) >>> 0;
        }
        if (carry !== 0) { throw new Error('Non-zero carry') }
        length = i;
        psz++;
      }
      // Skip trailing spaces.
      if (source[psz] === ' ') { return }
      // Skip leading zeroes in b256.
      var it4 = size - length;
      while (it4 !== size && b256[it4] === 0) {
        it4++;
      }
      var vch = new Uint8Array(zeroes + (size - it4));
      var j = zeroes;
      while (it4 !== size) {
        vch[j++] = b256[it4++];
      }
      return vch
    }
    function decode(string) {
      var buffer = decodeUnsafe(string);
      if (buffer) { return buffer }
      throw new Error(`Non-${name} character`)
    }
    return {
      encode: encode,
      decodeUnsafe: decodeUnsafe,
      decode: decode
    }
  }

  //https://github.com/multiformats/js-multiformats/blob/bb14a29dd823a517ef0c6c741d265e022591d831/src/bases/base.js#L248
  const baseX = ({ prefix, name, alphabet }) => {
    const { encode, decode } = _basex(alphabet, name)
    return from_1({
      prefix,
      name,
      encode,
      decode: text => coerce(decode(text))
    })
  }

  //https://github.com/multiformats/js-multiformats/blob/bb14a29dd823a517ef0c6c741d265e022591d831/src/bases/base.js#L321
  const _encode = (data, alphabet, bitsPerChar) => {
    const pad = alphabet[alphabet.length - 1] === '='
    const mask = (1 << bitsPerChar) - 1
    let out = ''

    let bits = 0 // Number of bits currently in the buffer
    let buffer = 0 // Bits waiting to be written out, MSB first
    for (let i = 0; i < data.length; ++i) {
      // Slurp data into the buffer:
      buffer = (buffer << 8) | data[i]
      bits += 8

      // Write out as much as we can:
      while (bits > bitsPerChar) {
        bits -= bitsPerChar
        out += alphabet[mask & (buffer >> bits)]
      }
    }

    // Partial character:
    if (bits) {
      out += alphabet[mask & (buffer << (bitsPerChar - bits))]
    }

    // Add padding characters until we hit a byte boundary:
    if (pad) {
      while ((out.length * bitsPerChar) & 7) {
        out += '='
      }
    }

    return out
  }

  //https://github.com/multiformats/js-multiformats/blob/bb14a29dd823a517ef0c6c741d265e022591d831/src/bases/base.js#L268
  const _decode = (string, alphabet, bitsPerChar, name) => {
    // Build the character lookup table:
    /** @type {Record<string, number>} */
    const codes = {}
    for (let i = 0; i < alphabet.length; ++i) {
      codes[alphabet[i]] = i
    }

    // Count the padding bytes:
    let end = string.length
    while (string[end - 1] === '=') {
      --end
    }

    const out = new Uint8Array((end * bitsPerChar / 8) | 0)

    let bits = 0
    let buffer = 0
    let written = 0
    for (let i = 0; i < end; ++i) {
      const value = codes[string[i]]
      if (value === undefined) {
        throw new SyntaxError(`Non-${name} character`)
      }

      buffer = (buffer << bitsPerChar) | value
      bits += bitsPerChar

      if (bits >= 8) {
        bits -= 8
        out[written++] = 0xff & (buffer >> bits)
      }
    }

    if (bits >= bitsPerChar || 0xff & (buffer << (8 - bits))) {
      throw new SyntaxError('Unexpected end of data')
    }

    return out
  }

  //https://github.com/multiformats/js-multiformats/blob/bb14a29dd823a517ef0c6c741d265e022591d831/src/bases/base.js#L366
  const rfc4648 = ({ name, prefix, bitsPerChar, alphabet }) => {
    return from_1({
      prefix,
      name,
      encode(input) {
        return _encode(input, alphabet, bitsPerChar)
      },
      decode(input) {
        return _decode(input, alphabet, bitsPerChar, name)
      }
    })
  }

  //https://github.com/multiformats/js-multiformats/blob/bb14a29dd823a517ef0c6c741d265e022591d831/src/bases/base58.js#L3
  const base58btc = baseX({
    name: 'base58btc',
    prefix: 'z',
    alphabet: '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz'
  })

  //https://github.com/multiformats/js-multiformats/blob/bb14a29dd823a517ef0c6c741d265e022591d831/src/bases/base32.js#L3
  const base32 = rfc4648({
    prefix: 'b',
    name: 'base32',
    alphabet: 'abcdefghijklmnopqrstuvwxyz234567',
    bitsPerChar: 5
  })

  const DAG_PB_CODE = 0x70
  const RAW_CODE = 0x55

  //https://github.com/multiformats/js-multiformats/blob/bb14a29dd823a517ef0c6c741d265e022591d831/vendor/varint.js#L58
  var N1 = Math.pow(2, 7);
  var N2 = Math.pow(2, 14);
  var N3 = Math.pow(2, 21);
  var N4 = Math.pow(2, 28);
  var N5 = Math.pow(2, 35);
  var N6 = Math.pow(2, 42);
  var N7 = Math.pow(2, 49);
  var N8 = Math.pow(2, 56);
  var N9 = Math.pow(2, 63);

  //https://github.com/multiformats/js-multiformats/blob/bb14a29dd823a517ef0c6c741d265e022591d831/vendor/varint.js#L68
  var encodingLength_2 = function (value) {
    return (
      value < N1 ? 1
        : value < N2 ? 2
          : value < N3 ? 3
            : value < N4 ? 4
              : value < N5 ? 5
                : value < N6 ? 6
                  : value < N7 ? 7
                    : value < N8 ? 8
                      : value < N9 ? 9
                        : 10
    )
  };

  //https://github.com/multiformats/js-multiformats/blob/bb14a29dd823a517ef0c6c741d265e022591d831/vendor/varint.js#L30
  var MSB$1 = 0x80
    , REST$1 = 0x7F
    , MSBALL = ~REST
    , INT = Math.pow(2, 31);

  //https://github.com/multiformats/js-multiformats/blob/bb14a29dd823a517ef0c6c741d265e022591d831/vendor/varint.js#L33
  function decode_2(buf, offset) {
    var res = 0
      , offset = offset || 0
      , shift = 0
      , counter = offset
      , b
      , l = buf.length;

    do {
      if (counter >= l) {
        decode_2.bytes = 0;
        throw new RangeError('Could not decode varint')
      }
      b = buf[counter++];
      res += shift < 28
        ? (b & REST$1) << shift
        : (b & REST$1) * Math.pow(2, shift);
      shift += 7;
    } while (b >= MSB$1)

    decode_2.bytes = counter - offset;

    return res
  }

  //https://github.com/multiformats/js-multiformats/blob/bb14a29dd823a517ef0c6c741d265e022591d831/src/varint.js#L7
  const decode_1 = (data) => {
    const code = decode_2(data)
    return [code, decode_2.bytes]
  }

  //https://github.com/multiformats/js-multiformats/blob/bb14a29dd823a517ef0c6c741d265e022591d831/vendor/varint.js#L8
  function encode_2(num, out, offset) {
    if (Number.MAX_SAFE_INTEGER && num > Number.MAX_SAFE_INTEGER) {
      encode.bytes = 0
      throw new RangeError('Could not encode varint')
    }
    out = out || [];
    offset = offset || 0;
    var oldOffset = offset;

    while (num >= INT) {
      out[offset++] = (num & 0xFF) | MSB;
      num /= 128;
    }
    while (num & MSBALL) {
      out[offset++] = (num & 0xFF) | MSB;
      num >>>= 7;
    }
    out[offset] = num | 0;

    encode_2.bytes = offset - oldOffset + 1;

    return out
  }

  //https://github.com/multiformats/js-multiformats/blob/bb14a29dd823a517ef0c6c741d265e022591d831/src/varint.js#L17
  const encodeTo_1 = (int, target, offset = 0) => {
    encode_2(int, target, offset)
    return target
  }

  //https://github.com/multiformats/js-multiformats/blob/bb14a29dd823a517ef0c6c741d265e022591d831/src/varint.js#L26
  const encodingLength_1 = (int) => {
    return encodingLength_2(int)
  }

  //https://github.com/multiformats/js-multiformats/blob/bb14a29dd823a517ef0c6c741d265e022591d831/src/cid.js#L382
  const parseCIDtoBytes = (source, base) => {
    switch (source[0]) {
      case 'Q': {
        const decoder = base || base58btc
        return [base58btc.prefix, decoder.decode(`${base58btc.prefix}${source}`)]
      }
      case base58btc.prefix: {
        const decoder = base || base58btc
        return [base58btc.prefix, decoder.decode(source)]
      }
      case base32.prefix: {
        const decoder = base || base32
        return [base32.prefix, decoder.decode(source)]
      }
      default: {
        if (base == null) {
          throw Error('To parse non base32 or base58btc encoded CID multibase decoder must be provided')
        }
        return [source[0], base.decode(source)]
      }
    }
  }

  //https://github.com/multiformats/js-multiformats/blob/bb14a29dd823a517ef0c6c741d265e022591d831/src/cid.js#L412
  const toStringV0 = (bytes, cache, base) => {
    const { prefix } = base
    if (prefix !== base58btc.prefix) {
      throw Error(`Cannot string encode V0 in ${base.name} encoding`)
    }

    const cid = cache.get(prefix)
    if (cid == null) {
      const cid = base.encode(bytes).slice(1)
      cache.set(prefix, cid)
      return cid
    } else {
      return cid
    }
  }

  //https://github.com/multiformats/js-multiformats/blob/bb14a29dd823a517ef0c6c741d265e022591d831/src/cid.js#L434
  const toStringV1 = (bytes, cache, base) => {
    const { prefix } = base
    const cid = cache.get(prefix)
    if (cid == null) {
      const cid = base.encode(bytes)
      cache.set(prefix, cid)
      return cid
    } else {
      return cid
    }
  }

  //https://github.com/multiformats/js-multiformats/blob/bb14a29dd823a517ef0c6c741d265e022591d831/src/cid.js#L455
  const encodeCID = (version, code, multihash) => {
    const codeOffset = encodingLength_1(version)
    const hashOffset = codeOffset + encodingLength_1(code)
    const bytes = new Uint8Array(hashOffset + multihash.byteLength)
    encodeTo_1(version, bytes, 0)
    encodeTo_1(code, bytes, codeOffset)
    bytes.set(multihash, hashOffset)
    return bytes
  }

  //https://github.com/multiformats/js-multiformats/blob/bb14a29dd823a517ef0c6c741d265e022591d831/src/bytes.js#L39
  const coerce = o => {
    if (o instanceof Uint8Array && o.constructor.name === 'Uint8Array') return o
    if (o instanceof ArrayBuffer) return new Uint8Array(o)
    if (ArrayBuffer.isView(o)) {
      return new Uint8Array(o.buffer, o.byteOffset, o.byteLength)
    }
    throw new Error('Unknown type, must be binary type')
  }

  //https://github.com/multiformats/js-multiformats/blob/bb14a29dd823a517ef0c6c741d265e022591d831/src/cid.js#L22
  class CID {

    constructor(version, code, multihash, bytes) {
      this.code = code
      this.version = version
      this.multihash = multihash
      this.bytes = bytes
      this.byteOffset = bytes.byteOffset
      this.byteLength = bytes.byteLength
      this.asCID = this
      this._baseCache = new Map()

      Object.defineProperties(this, {
        byteOffset: hidden,
        byteLength: hidden,

        code: readonly,
        version: readonly,
        multihash: readonly,
        bytes: readonly,

        _baseCache: hidden,
        asCID: hidden
      })
    }

    toString(base) {
      const { bytes, version, _baseCache } = this
      switch (version) {
        case 0:
          return toStringV0(bytes, _baseCache, base || base58btc.encoder)
        default:
          return toStringV1(bytes, _baseCache, base || base32.encoder)
      }
    }

    static create(version, code, digest) {
      if (typeof code !== 'number') {
        throw new Error('String codecs are no longer supported')
      }

      switch (version) {
        case 0: {
          if (code !== DAG_PB_CODE) {
            throw new Error(`Version 0 CID must use dag-pb (code: ${DAG_PB_CODE}) block encoding`)
          } else {
            return new CID(version, code, digest, digest.bytes)
          }
        }
        case 1: {
          const bytes = encodeCID(version, code, digest.bytes)
          return new CID(version, code, digest, bytes)
        }
        default: {
          throw new Error('Invalid version')
        }
      }
    }

    static parse(source, base) {
      const [prefix, bytes] = parseCIDtoBytes(source, base)

      const cid = CID.decode(bytes)
      cid._baseCache.set(prefix, source)

      return cid
    }

    static decode(bytes) {
      const [cid, remainder] = CID.decodeFirst(bytes)
      if (remainder.length) {
        throw new Error('Incorrect length')
      }
      return cid
    }

    static decodeFirst(bytes) {
      const specs = CID.inspectBytes(bytes)
      const prefixSize = specs.size - specs.multihashSize
      const multihashBytes = coerce(bytes.subarray(prefixSize, prefixSize + specs.multihashSize))
      if (multihashBytes.byteLength !== specs.multihashSize) {
        throw new Error('Incorrect length')
      }
      const digestBytes = multihashBytes.subarray(specs.multihashSize - specs.digestSize)
      const digest = new Digest(specs.multihashCode, specs.digestSize, digestBytes, multihashBytes)
      const cid = specs.version === 0 ? CID.createV0(digest) : CID.createV1(specs.codec, digest)
      return [cid, bytes.subarray(specs.size)]
    }

    static inspectBytes(initialBytes) {
      let offset = 0
      const next = () => {
        const [i, length] = decode_1(initialBytes.subarray(offset))
        offset += length
        return i
      }

      let version = next()
      let codec = DAG_PB_CODE
      if (version === 18) { // CIDv0
        version = 0
        offset = 0
      } else if (version === 1) {
        codec = next()
      }

      if (version !== 0 && version !== 1) {
        throw new RangeError(`Invalid CID version ${version}`)
      }

      const prefixSize = offset
      const multihashCode = next()
      const digestSize = next()
      const size = offset + digestSize
      const multihashSize = size - prefixSize

      return { version, codec, multihashCode, digestSize, multihashSize, size }
    }

    static createV0(digest) {
      return CID.create(0, DAG_PB_CODE, digest)
    }

    static createV1(code, digest) {
      return CID.create(1, code, digest)
    }
  }
  /*---------------------------------------------------------------------------------------------
  *  Copyright (c) 2016, Daniel Wirtz  All rights reserved.
  *  https://github.com/protobufjs/protobuf.js/blob/master/LICENSE
  *--------------------------------------------------------------------------------------------*/
  var protobuf = {};//exports;

  protobuf.build = "minimal";

  //https://github.com/protobufjs/protobuf.js/blob/2cdbba32da9951c1ff14e55e65e4a9a9f24c70fd/lib/inquire/index.js#L10
  const util_inquire = function inquire(moduleName) {
    try {
      var mod = eval("quire".replace(/^/, "re"))(moduleName);
      if (mod && (mod.length || Object.keys(mod).length))
        return mod;
    } catch (e) { }
    return null;
  }

  //https://github.com/protobufjs/protobuf.js/blob/2cdbba32da9951c1ff14e55e65e4a9a9f24c70fd/src/util/minimal.js#L126
  const util_Buffer = (function () {
    try {
      if (typeof window !== "undefined") {
        return require("buffer").Buffer;
      }
      else
        return Buffer;
      // var Buffer = util_inquire("buffer").Buffer;
      // return Buffer.prototype.utf8Write ? Buffer : null;
    } catch (e) {
      return null;
    }
  })();

  //https://github.com/protobufjs/protobuf.js/blob/2cdbba32da9951c1ff14e55e65e4a9a9f24c70fd/src/writer.js#L21
  function Op(fn, len, val) {

    this.fn = fn;
    this.len = len;
    this.next = undefined;
    this.val = val;
  }

  //https://github.com/protobufjs/protobuf.js/blob/2cdbba32da9951c1ff14e55e65e4a9a9f24c70fd/src/writer.js#L49
  function noop() { }

  //https://github.com/protobufjs/protobuf.js/blob/2cdbba32da9951c1ff14e55e65e4a9a9f24c70fd/src/writer.js#L91
  function Writer() {

    this.len = 0;
    this.head = new Op(noop, 0, 0);
    this.tail = this.head;
    this.states = null;
  }

  //https://github.com/protobufjs/protobuf.js/blob/2cdbba32da9951c1ff14e55e65e4a9a9f24c70fd/src/util/longbits.js#L14
  function util_LongBits(lo, hi) {
    this.lo = lo >>> 0;
    this.hi = hi >>> 0;
  }

  //https://github.com/protobufjs/protobuf.js/blob/2cdbba32da9951c1ff14e55e65e4a9a9f24c70fd/src/util/longbits.js#L37
  var zero = util_LongBits.zero = new util_LongBits(0, 0);

  //https://github.com/protobufjs/protobuf.js/blob/2cdbba32da9951c1ff14e55e65e4a9a9f24c70fd/src/util/longbits.js#L55
  util_LongBits.fromNumber = function fromNumber(value) {
    if (value === 0)
      return zero;
    var sign = value < 0;
    if (sign)
      value = -value;
    var lo = value >>> 0,
      hi = (value - lo) / 4294967296 >>> 0;
    if (sign) {
      hi = ~hi >>> 0;
      lo = ~lo >>> 0;
      if (++lo > 4294967295) {
        lo = 0;
        if (++hi > 4294967295)
          hi = 0;
      }
    }
    return new util_LongBits(lo, hi);
  };

  //https://github.com/protobufjs/protobuf.js/blob/2cdbba32da9951c1ff14e55e65e4a9a9f24c70fd/src/util/longbits.js#L80
  util_LongBits.from = function from(value) {
    if (typeof value === "number")
      return util_LongBits.fromNumber(value);
    if (util_isString(value)) {
      if (util_Long)
        value = util_Long.fromString(value);
      else
        return util_LongBits.fromNumber(parseInt(value, 10));
    }
    return value.low || value.high ? new util_LongBits(value.low >>> 0, value.high >>> 0) : zero;
  };

  //https://github.com/protobufjs/protobuf.js/blob/2cdbba32da9951c1ff14e55e65e4a9a9f24c70fd/src/util/longbits.js#L187
  util_LongBits.prototype.length = function length() {
    var part0 = this.lo,
      part1 = (this.lo >>> 28 | this.hi << 4) >>> 0,
      part2 = this.hi >>> 24;
    return part2 === 0
      ? part1 === 0
        ? part0 < 16384
          ? part0 < 128 ? 1 : 2
          : part0 < 2097152 ? 3 : 4
        : part1 < 16384
          ? part1 < 128 ? 5 : 6
          : part1 < 2097152 ? 7 : 8
      : part2 < 128 ? 9 : 10;
  };

  //https://github.com/protobufjs/protobuf.js/blob/2cdbba32da9951c1ff14e55e65e4a9a9f24c70fd/src/writer.js#L242
  function writeVarint64(val, buf, pos) {
    while (val.hi) {
      buf[pos++] = val.lo & 127 | 128;
      val.lo = (val.lo >>> 7 | val.hi << 25) >>> 0;
      val.hi >>>= 7;
    }
    while (val.lo > 127) {
      buf[pos++] = val.lo & 127 | 128;
      val.lo = val.lo >>> 7;
    }
    buf[pos++] = val.lo;
  }

  //https://github.com/protobufjs/protobuf.js/blob/2cdbba32da9951c1ff14e55e65e4a9a9f24c70fd/src/writer.js#L261
  Writer.prototype.uint64 = function write_uint64(value) {
    var bits = util_LongBits.from(value);
    return this._push(writeVarint64, bits.length(), bits);
  };

  //https://github.com/protobufjs/protobuf.js/blob/2cdbba32da9951c1ff14e55e65e4a9a9f24c70fd/src/writer.js#L166
  Writer.prototype._push = function push(fn, len, val) {
    this.tail = this.tail.next = new Op(fn, len, val);
    this.len += len;
    return this;
  };

  //https://github.com/protobufjs/protobuf.js/blob/2cdbba32da9951c1ff14e55e65e4a9a9f24c70fd/src/util/minimal.js#L79
  const util_isString = function isString(value) {
    return typeof value === "string" || value instanceof String;
  };

  var invalidEncoding = "invalid encoding";
  var s64 = new Array(123);

  //https://github.com/protobufjs/protobuf.js/blob/2cdbba32da9951c1ff14e55e65e4a9a9f24c70fd/lib/base64/index.js#L96
  const base64_decode = function decode(string, buffer, offset) {
    var start = offset;
    var j = 0,
      t;
    for (var i = 0; i < string.length;) {
      var c = string.charCodeAt(i++);
      if (c === 61 && j > 1)
        break;
      if ((c = s64[c]) === undefined)
        throw Error(invalidEncoding);
      switch (j) {
        case 0:
          t = c;
          j = 1;
          break;
        case 1:
          buffer[offset++] = t << 2 | (c & 48) >> 4;
          t = c;
          j = 2;
          break;
        case 2:
          buffer[offset++] = (t & 15) << 4 | (c & 60) >> 2;
          t = c;
          j = 3;
          break;
        case 3:
          buffer[offset++] = (t & 3) << 6 | c;
          j = 0;
          break;
      }
    }
    if (j === 1)
      throw Error(invalidEncoding);
    return offset - start;
  };

  //https://github.com/protobufjs/protobuf.js/blob/2cdbba32da9951c1ff14e55e65e4a9a9f24c70fd/src/writer.js#L172
  function writeByte(val, buf, pos) {
    buf[pos] = val & 255;
  }

  //https://github.com/protobufjs/protobuf.js/blob/2cdbba32da9951c1ff14e55e65e4a9a9f24c70fd/lib/base64/index.js#L15
  const base64_length = function length(string) {
    var p = string.length;
    if (!p)
      return 0;
    var n = 0;
    while (--p % 4 > 1 && string.charAt(p) === "=")
      ++n;
    return Math.ceil(string.length * 3) / 4 - n;
  };

  var util_Array = typeof Uint8Array !== "undefined" ? Uint8Array : Array;

  //https://github.com/protobufjs/protobuf.js/blob/2cdbba32da9951c1ff14e55e65e4a9a9f24c70fd/src/writer.js#L359
  var writeBytes = util_Array.prototype.set
    ? function writeBytes_set(val, buf, pos) {
      buf.set(val, pos);
    }
    : function writeBytes_for(val, buf, pos) {
      for (var i = 0; i < val.length; ++i)
        buf[pos + i] = val[i];
    };

  //https://github.com/protobufjs/protobuf.js/blob/2cdbba32da9951c1ff14e55e65e4a9a9f24c70fd/src/writer.js#L374
  Writer.prototype.bytes = function write_bytes(value) {
    var len = value.length >>> 0;
    if (!len)
      return this._push(writeByte, 1, 0);
    if (util_isString(value)) {
      var buf = Writer.alloc(len = base64_length(value));
      base64_decode(value, buf, 0);
      value = buf;
    }
    return this.uint32(len)._push(writeBytes, len, value);
  };

  //https://github.com/protobufjs/protobuf.js/blob/2cdbba32da9951c1ff14e55e65e4a9a9f24c70fd/src/writer.js#L124
  var w1_create = function w1_create() {
    return util_Buffer
      ? function create_buffer_setup() {
        return (Writer.create = function create_buffer() {
          return new BufferWriter();
        })();
      }
      : function create_array() {
        return new Writer();
      };
  };

  Writer.create = w1_create();

  //https://github.com/protobufjs/protobuf.js/blob/2cdbba32da9951c1ff14e55e65e4a9a9f24c70fd/src/writer.js#L176
  function writeVarint32(val, buf, pos) {
    while (val > 127) {
      buf[pos++] = val & 127 | 128;
      val >>>= 7;
    }
    buf[pos] = val;
  }

  //https://github.com/protobufjs/protobuf.js/blob/2cdbba32da9951c1ff14e55e65e4a9a9f24c70fd/src/writer.js#L193
  function VarintOp(len, val) {
    this.len = len;
    this.next = undefined;
    this.val = val;
  }

  VarintOp.prototype.fn = writeVarint32;

  //https://github.com/protobufjs/protobuf.js/blob/2cdbba32da9951c1ff14e55e65e4a9a9f24c70fd/src/writer.js#L207
  Writer.prototype.uint32 = function write_uint32(value) {
    this.len += (this.tail = this.tail.next = new VarintOp(
      (value = value >>> 0)
        < 128 ? 1
        : value < 16384 ? 2
          : value < 2097152 ? 3
            : value < 268435456 ? 4
              : 5,
      value)).len;
    return this;
  };

  //https://github.com/protobufjs/protobuf.js/blob/2cdbba32da9951c1ff14e55e65e4a9a9f24c70fd/src/writer.js#L227
  Writer.prototype.int32 = function write_int32(value) {
    return value < 0
      ? this._push(writeVarint64, 10, util_LongBits.fromNumber(value))
      : this.uint32(value);
  };

  //https://github.com/protobufjs/protobuf.js/blob/2cdbba32da9951c1ff14e55e65e4a9a9f24c70fd/src/writer.js#L149
  Writer.alloc = function alloc(size) {
    return new util_Array(size);
  };

  //https://github.com/protobufjs/protobuf.js/blob/2cdbba32da9951c1ff14e55e65e4a9a9f24c70fd/src/writer_buffer.js#L6
  (BufferWriter.prototype = Object.create(Writer.prototype)).constructor = BufferWriter;

  //https://github.com/protobufjs/protobuf.js/blob/2cdbba32da9951c1ff14e55e65e4a9a9f24c70fd/src/writer.js#L448
  Writer.prototype.finish = function finish() {
    var head = this.head.next,
      buf = this.constructor.alloc(this.len),
      pos = 0;
    while (head) {
      head.fn(head.val, buf, pos);
      pos += head.len;
      head = head.next;
    }
    return buf;
  };

  //https://github.com/protobufjs/protobuf.js/blob/2cdbba32da9951c1ff14e55e65e4a9a9f24c70fd/src/writer.js#L461
  Writer._configure = function (BufferWriter_) {
    BufferWriter = BufferWriter_;
    Writer.create = w1_create();
    BufferWriter._configure();
  };

  //https://github.com/protobufjs/protobuf.js/blob/2cdbba32da9951c1ff14e55e65e4a9a9f24c70fd/src/reader.js#L22
  function Reader(buffer) {

    this.buf = buffer;
    this.pos = 0;
    this.len = buffer.length;
  }

  //https://github.com/protobufjs/protobuf.js/blob/2cdbba32da9951c1ff14e55e65e4a9a9f24c70fd/src/reader.js#L43
  var create_array = typeof Uint8Array !== "undefined"
    ? function create_typed_array(buffer) {
      if (buffer instanceof Uint8Array || Array.isArray(buffer))
        return new Reader(buffer);
      throw Error("illegal buffer");
    }
    : function create_array(buffer) {
      if (Array.isArray(buffer))
        return new Reader(buffer);
      throw Error("illegal buffer");
    };

  //https://github.com/protobufjs/protobuf.js/blob/2cdbba32da9951c1ff14e55e65e4a9a9f24c70fd/src/reader.js#L56
  var r1_create = function r1_create() {
    return util_Buffer
      ? function create_buffer_setup(buffer) {
        return (Reader.create = function create_buffer(buffer) {
          return util_Buffer.isBuffer(buffer)
            ? new BufferReader(buffer)
            : create_array(buffer);
        })(buffer);
      }
      : create_array;
  };

  //https://github.com/protobufjs/protobuf.js/blob/2cdbba32da9951c1ff14e55e65e4a9a9f24c70fd/src/util/minimal.js#L237
  function util_merge(dst, src, ifNotSet) {
    for (var keys = Object.keys(src), i = 0; i < keys.length; ++i)
      if (dst[keys[i]] === undefined || !ifNotSet)
        dst[keys[i]] = src[keys[i]];
    return dst;
  }

  //https://github.com/protobufjs/protobuf.js/blob/2cdbba32da9951c1ff14e55e65e4a9a9f24c70fd/src/reader.js#L382
  Reader._configure = function (BufferReader_) {
    BufferReader = BufferReader_;
    Reader.create = r1_create();
    BufferReader._configure();

    var fn = "toLong";
    util_merge(Reader.prototype, {

      int64: function read_int64() {
        return readLongVarint.call(this)[fn](false);
      },

      uint64: function read_uint64() {
        return readLongVarint.call(this)[fn](true);
      },

      sint64: function read_sint64() {
        return readLongVarint.call(this).zzDecode()[fn](false);
      },

      fixed64: function read_fixed64() {
        return readFixed64.call(this)[fn](true);
      },

      sfixed64: function read_sfixed64() {
        return readFixed64.call(this)[fn](false);
      }

    });
  };
  //https://github.com/protobufjs/protobuf.js/blob/2cdbba32da9951c1ff14e55e65e4a9a9f24c70fd/src/writer_buffer.js#L16
  function BufferWriter() {
    Writer.call(this);
  }

  /*---------------------------------------------------------------------------------------------
  *  Copyright (c) Feross Aboukhadijeh, and other contributors.
  *  Licensed under the MIT License.
  *  https://github.com/feross/buffer/blob/master/LICENSE
  *--------------------------------------------------------------------------------------------*/

  //https://github.com/feross/buffer/blob/795bbb5bda1b39f1370ebd784bea6107b087e3a7/index.js#L98
  function Buffer(arg, encodingOrOffset, length) {
    if (typeof arg === 'number') {
      if (typeof encodingOrOffset === 'string') {
        throw new TypeError(
          'The "string" argument must be of type string. Received type number'
        )
      }
      return allocUnsafe(arg)
    }
    return from(arg, encodingOrOffset, length)
  }

  Object.setPrototypeOf(Buffer.prototype, Uint8Array.prototype)
  Object.setPrototypeOf(Buffer, Uint8Array)

  const K_MAX_LENGTH = 0x7fffffff

  //https://github.com/feross/buffer/blob/795bbb5bda1b39f1370ebd784bea6107b087e3a7/index.js#L322
  function checked(length) {
    if (length >= K_MAX_LENGTH) {
      throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
        'size: 0x' + K_MAX_LENGTH.toString(16) + ' bytes')
    }
    return length | 0
  }

  //https://github.com/feross/buffer/blob/795bbb5bda1b39f1370ebd784bea6107b087e3a7/index.js#L78
  function createBuffer(length) {
    if (length > K_MAX_LENGTH) {
      throw new RangeError('The value "' + length + '" is invalid for option "size"')
    }
    const buf = new Uint8Array(length)
    Object.setPrototypeOf(buf, Buffer.prototype)
    return buf
  }

  //https://github.com/feross/buffer/blob/795bbb5bda1b39f1370ebd784bea6107b087e3a7/index.js#L182
  function assertSize(size) {
    if (typeof size !== 'number') {
      throw new TypeError('"size" argument must be of type number')
    } else if (size < 0) {
      throw new RangeError('The value "' + size + '" is invalid for option "size"')
    }
  }

  //https://github.com/feross/buffer/blob/795bbb5bda1b39f1370ebd784bea6107b087e3a7/index.js#L214
  function allocUnsafe(size) {
    assertSize(size)
    return createBuffer(size < 0 ? 0 : checked(size) | 0)
  }

  //https://github.com/feross/buffer/blob/795bbb5bda1b39f1370ebd784bea6107b087e3a7/index.js#L222
  Buffer.allocUnsafe = function (size) {
    return allocUnsafe(size)
  }

  //https://github.com/protobufjs/protobuf.js/blob/2cdbba32da9951c1ff14e55e65e4a9a9f24c70fd/src/writer_buffer.js#L20
  BufferWriter._configure = function () {

    BufferWriter.alloc = Buffer.allocUnsafe

    BufferWriter.writeBytesBuffer = util_Buffer && util_Buffer.prototype instanceof Uint8Array && util_Buffer.prototype.set.name === "set"
      ? function writeBytesBuffer_set(val, buf, pos) {
        buf.set(val, pos);
      }
      : function writeBytesBuffer_copy(val, buf, pos) {
        if (val.copy)
          val.copy(buf, pos, 0, val.length);
        else for (var i = 0; i < val.length;)
          buf[pos++] = val[i++];
      };
  };

  //https://github.com/protobufjs/protobuf.js/blob/2cdbba32da9951c1ff14e55e65e4a9a9f24c70fd/src/reader_buffer.js#L6
  (BufferReader.prototype = Object.create(Reader.prototype)).constructor = BufferReader;

  //https://github.com/protobufjs/protobuf.js/blob/2cdbba32da9951c1ff14e55e65e4a9a9f24c70fd/src/reader_buffer.js#L17
  function BufferReader(buffer) {
    Reader.call(this, buffer);
  }

  //https://github.com/protobufjs/protobuf.js/blob/2cdbba32da9951c1ff14e55e65e4a9a9f24c70fd/src/reader_buffer.js#L27
  BufferReader._configure = function () {
    if (util_Buffer)
      BufferReader.prototype._slice = util_Buffer.prototype.slice;
  };

  //https://github.com/protobufjs/protobuf.js/blob/2cdbba32da9951c1ff14e55e65e4a9a9f24c70fd/src/util/minimal.js#L402
  util_configure = function () {
    var Buffer = util_Buffer;
    if (!Buffer) {
      util_Buffer_from = util_Buffer_allocUnsafe = null;
      return;
    }
    util_Buffer_from = Buffer.from !== Uint8Array.from && Buffer.from ||
      function Buffer_from(value, encoding) {
        return new Buffer(value, encoding);
      };
    util_Buffer_allocUnsafe = Buffer.allocUnsafe ||
      function Buffer_allocUnsafe(size) {
        return new Buffer(size);
      };
  };

  protobuf.rpc = {};
  protobuf.roots = {};
  protobuf.configure = configure;

  //https://github.com/protobufjs/protobuf.js/blob/2cdbba32da9951c1ff14e55e65e4a9a9f24c70fd/src/index-minimal.js#L29
  function configure() {
    util_configure();
    Writer._configure(BufferWriter);
    Reader._configure(BufferReader);
  }

  configure();

  var $protobuf = protobuf;
  var $protobuf__default = _interopDefaultLegacy($protobuf);

  /*---------------------------------------------------------------------------------------------
  *  Licensed under the MIT License.
  *  https://github.com/ipfs/js-ipfs-unixfs/blob/master/LICENSE
  *--------------------------------------------------------------------------------------------*/

  //https://github.com/ipfs/js-ipfs-unixfs/blob/de1a7f0afc144462b374919a44d3af4fae3a49da/packages/ipfs-unixfs/src/unixfs.js#L8
  const $root = $protobuf__default["default"].roots['ipfs-unixfs'] || ($protobuf__default["default"].roots['ipfs-unixfs'] = {});

  //https://github.com/ipfs/js-ipfs-unixfs/blob/de1a7f0afc144462b374919a44d3af4fae3a49da/packages/ipfs-unixfs/src/unixfs.js#L10
  const Data = $root.Data = (() => {
    function Data(p) {
      this.blocksizes = [];
      if (p)
        for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
          if (p[ks[i]] != null)
            this[ks[i]] = p[ks[i]];
    }
    Data.prototype.Type = 0;
    Data.prototype.filesize = 0;
    Data.prototype.hashType = 0;
    Data.prototype.fanout = 0;
    Data.prototype.mode = 0;
    Data.prototype.mtime = null;
    Data.encode = function encode(m, w) {
      if (!w) {
        w = Writer.create();
      }
      w.uint32(8).int32(m.Type);
      if (m.Data != null && Object.hasOwnProperty.call(m, 'Data')) {
        w.uint32(18).bytes(m.Data);
      }
      if (m.filesize != null && Object.hasOwnProperty.call(m, 'filesize')) {
        w.uint32(24).uint64(m.filesize); // here is the bug
      }
      if (m.blocksizes != null && m.blocksizes.length) {
        for (var i = 0; i < m.blocksizes.length; ++i)
          w.uint32(32).uint64(m.blocksizes[i]);
      }
      if (m.hashType != null && Object.hasOwnProperty.call(m, 'hashType')) {
        w.uint32(40).uint64(m.hashType);
      }
      if (m.fanout != null && Object.hasOwnProperty.call(m, 'fanout')) {
        w.uint32(48).uint64(m.fanout);
      }

      if (m.mode != null && Object.hasOwnProperty.call(m, 'mode')) {
        w.uint32(56).uint32(m.mode);
      }

      if (m.mtime != null && Object.hasOwnProperty.call(m, 'mtime')) {
        $root.UnixTime.encode(m.mtime, w.uint32(66).fork()).ldelim();
      }

      return w;
    };
    Data.decode = function decode(r, l) {
      if (!(r instanceof Reader))
        r = Reader.create(r);
      var c = l === undefined ? r.len : r.pos + l, m = new $root.Data();
      while (r.pos < c) {
        var t = r.uint32();
        switch (t >>> 3) {
          case 1:
            m.Type = r.int32();
            break;
          case 2:
            m.Data = r.bytes();
            break;
          case 3:
            m.filesize = r.uint64();
            break;
          case 4:
            if (!(m.blocksizes && m.blocksizes.length))
              m.blocksizes = [];
            if ((t & 7) === 2) {
              var c2 = r.uint32() + r.pos;
              while (r.pos < c2)
                m.blocksizes.push(r.uint64());
            } else
              m.blocksizes.push(r.uint64());
            break;
          case 5:
            m.hashType = r.uint64();
            break;
          case 6:
            m.fanout = r.uint64();
            break;
          case 7:
            m.mode = r.uint32();
            break;
          case 8:
            m.mtime = $root.UnixTime.decode(r, r.uint32());
            break;
          default:
            r.skipType(t & 7);
            break;
        }
      }
      return m;
    };
    Data.fromObject = function fromObject(d) {
      if (d instanceof $root.Data)
        return d;
      var m = new $root.Data();
      switch (d.Type) {
        case 'Raw':
        case 0:
          m.Type = 0;
          break;
        case 'Directory':
        case 1:
          m.Type = 1;
          break;
        case 'File':
        case 2:
          m.Type = 2;
          break;
        case 'Metadata':
        case 3:
          m.Type = 3;
          break;
        case 'Symlink':
        case 4:
          m.Type = 4;
          break;
        case 'HAMTShard':
        case 5:
          m.Type = 5;
          break;
      }
      return m;
    };

    Data.DataType = function () {
      const valuesById = {}, values = Object.create(valuesById);
      values[valuesById[0] = 'Raw'] = 0;
      values[valuesById[1] = 'Directory'] = 1;
      values[valuesById[2] = 'File'] = 2;
      values[valuesById[3] = 'Metadata'] = 3;
      values[valuesById[4] = 'Symlink'] = 4;
      values[valuesById[5] = 'HAMTShard'] = 5;
      return values;
    }();
    return Data;
  })();

  // Retrieve and modify from https://github.com/IndigoUnited/js-err-code/blob/8dd437663a48e833ab70223f8a58a888985d1e3a/index.js#L15
  function assign(obj, props) {
    for (const key in props) {
      Object.defineProperty(obj, key, {
        value: props[key],
        enumerable: true,
        configurable: true,
      });
    }

    return obj;
  }

  // Retrieve and modify from https://github.com/IndigoUnited/js-err-code/blob/8dd437663a48e833ab70223f8a58a888985d1e3a/index.js#L34
  function createError(err, code, props) {
    if (!err || typeof err === 'string') {
      throw new TypeError('Please pass an Error to err-code');
    }

    if (!props) {
      props = {};
    }

    if (typeof code === 'object') {
      props = code;
      code = '';
    }

    if (code) {
      props.code = code;
    }

    try {
      return assign(err, props);
    } catch (_) {
      props.message = err.message;
      props.stack = err.stack;

      const ErrClass = function () { };

      ErrClass.prototype = Object.create(Object.getPrototypeOf(err));

      // @ts-ignore
      const output = assign(new ErrClass(), props);

      return output;
    }
  }

  var errcode = createError;

  function _interopDefaultLegacy(e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }
  var errcode__default = /*#__PURE__*/_interopDefaultLegacy(errcode);

  //https://github.com/ipfs/js-ipfs-unixfs/blob/de1a7f0afc144462b374919a44d3af4fae3a49da/packages/ipfs-unixfs/src/index.js#L10
  const types = [
    'raw',
    'directory',
    'file',
    'metadata',
    'symlink',
    'hamt-sharded-directory'
  ];

  //https://github.com/ipfs/js-ipfs-unixfs/blob/de1a7f0afc144462b374919a44d3af4fae3a49da/packages/ipfs-unixfs/src/index.js#L19
  const dirTypes = [
    'directory',
    'hamt-sharded-directory'
  ];

  //https://github.com/ipfs/js-ipfs-unixfs/blob/de1a7f0afc144462b374919a44d3af4fae3a49da/packages/ipfs-unixfs/src/index.js#L30
  function parseMode(mode) {
    if (mode == null) {
      return undefined;
    }
    if (typeof mode === 'number') {
      return mode & 4095;
    }
    mode = mode.toString();
    if (mode.substring(0, 1) === '0') {
      return parseInt(mode, 8) & 4095;
    }
    return parseInt(mode, 10) & 4095;
  }

  //https://github.com/ipfs/js-ipfs-unixfs/blob/de1a7f0afc144462b374919a44d3af4fae3a49da/packages/ipfs-unixfs/src/index.js#L53
  function parseMtime(input) {
    if (input == null) {
      return undefined;
    }
    let mtime;
    if (input.secs != null) {
      mtime = {
        secs: input.secs,
        nsecs: input.nsecs
      };
    }
    if (input.Seconds != null) {
      mtime = {
        secs: input.Seconds,
        nsecs: input.FractionalNanoseconds
      };
    }
    if (Array.isArray(input)) {
      mtime = {
        secs: input[0],
        nsecs: input[1]
      };
    }
    if (input instanceof Date) {
      const ms = input.getTime();
      const secs = Math.floor(ms / 1000);
      mtime = {
        secs: secs,
        nsecs: (ms - secs * 1000) * 1000
      };
    }
    if (!Object.prototype.hasOwnProperty.call(mtime, 'secs')) {
      return undefined;
    }
    if (mtime != null && mtime.nsecs != null && (mtime.nsecs < 0 || mtime.nsecs > 999999999)) {
      throw errcode__default["default"](new Error('mtime-nsecs must be within the range [0,999999999]'), 'ERR_INVALID_MTIME_NSECS');
    }
    return mtime;
  }

  const PBData = Data;

  //https://github.com/ipfs/js-ipfs-unixfs/blob/de1a7f0afc144462b374919a44d3af4fae3a49da/packages/ipfs-unixfs/src/index.js#L24
  const DEFAULT_FILE_MODE = parseInt('0644', 8);
  const DEFAULT_DIRECTORY_MODE = parseInt('0755', 8);

  //https://github.com/ipfs/js-ipfs-unixfs/blob/de1a7f0afc144462b374919a44d3af4fae3a49da/packages/ipfs-unixfs/src/index.js#L122
  class UnixFS {
    constructor(options = { type: 'file' }) {
      const { type, data, blockSizes, hashType, fanout, mtime, mode } = options;
      if (type && !types.includes(type)) {
        throw errcode__default["default"](new Error('Type: ' + type + ' is not valid'), 'ERR_INVALID_TYPE');
      }
      this.type = type || 'file';
      this.data = data;
      this.hashType = hashType;
      this.fanout = fanout;
      this.blockSizes = blockSizes || [];
      this._originalMode = 0;
      this.mode = parseMode(mode);
      if (mtime) {
        this.mtime = parseMtime(mtime);
        if (this.mtime && !this.mtime.nsecs) {
          this.mtime.nsecs = 0;
        }
      }
    }
    set mode(mode) {
      this._mode = this.isDirectory() ? DEFAULT_DIRECTORY_MODE : DEFAULT_FILE_MODE;
      const parsedMode = parseMode(mode);
      if (parsedMode !== undefined) {
        this._mode = parsedMode;
      }
    }
    get mode() {
      return this._mode;
    }
    isDirectory() {
      return Boolean(this.type && dirTypes.includes(this.type));
    }
    addBlockSize(size) {
      this.blockSizes.push(size)
    }
    removeBlockSize(index) {
      this.blockSizes.splice(index, 1)
    }
    fileSize() {
      if (this.isDirectory()) {
        return 0;
      }
      let sum = 0;
      this.blockSizes.forEach(size => {
        sum += size;
      });
      if (this.data) {
        sum += this.data.length;
      }
      return sum;
    }
    marshal() {
      let type;
      switch (this.type) {
        case 'raw':
          type = PBData.DataType.Raw;
          break;
        case 'directory':
          type = PBData.DataType.Directory;
          break;
        case 'file':
          type = PBData.DataType.File;
          break;
        case 'metadata':
          type = PBData.DataType.Metadata;
          break;
        case 'symlink':
          type = PBData.DataType.Symlink;
          break;
        case 'hamt-sharded-directory':
          type = PBData.DataType.HAMTShard;
          break;
        default:
          throw errcode__default["default"](new Error('Type: ' + type + ' is not valid'), 'ERR_INVALID_TYPE');
      }
      let data = this.data;
      if (!this.data || !this.data.length) {
        data = undefined;
      }
      let mode;
      if (this.mode != null) {
        mode = this._originalMode & 4294963200 | (parseMode(this.mode) || 0);
        if (mode === DEFAULT_FILE_MODE && !this.isDirectory()) {
          mode = undefined;
        }
        if (mode === DEFAULT_DIRECTORY_MODE && this.isDirectory()) {
          mode = undefined;
        }
      }
      let mtime;
      if (this.mtime != null) {
        const parsed = parseMtime(this.mtime);
        if (parsed) {
          mtime = {
            Seconds: parsed.secs,
            FractionalNanoseconds: parsed.nsecs
          };
          if (mtime.FractionalNanoseconds === 0) {
            delete mtime.FractionalNanoseconds;
          }
        }
      }
      const pbData = {
        Type: type,
        Data: data,
        filesize: this.isDirectory() ? undefined : this.fileSize(),
        blocksizes: this.blockSizes,
        hashType: this.hashType,
        fanout: this.fanout,
        mode,
        mtime
      };
      return PBData.encode(pbData).finish();
    }
  }

  /*---------------------------------------------------------------------------------------------
  *  Copyright (c) 2020-2021 Yusuke Kawasaki
  *  Licensed under the MIT License.
  *  https://github.com/kawanet/sha256-uint8array/blob/main/LICENSE
  *--------------------------------------------------------------------------------------------*/
  //https://github.com/kawanet/sha256-uint8array/blob/52e8f1b891c84fcb436f0f2e1103527d3a6465ea/lib/sha256-uint8array.ts#L36
  const algorithms = {
    sha256: 1,
  };

  //https://github.com/kawanet/sha256-uint8array/blob/52e8f1b891c84fcb436f0f2e1103527d3a6465ea/lib/sha256-uint8array.ts#L40
  function createHash(algorithm) {
    if (algorithm && !algorithms[algorithm] && !algorithms[algorithm.toLowerCase()]) {
      throw new Error("Digest method not supported");
    }
    return new Hash();
  }

  //https://github.com/kawanet/sha256-uint8array/blob/52e8f1b891c84fcb436f0f2e1103527d3a6465ea/lib/sha256-uint8array.ts#L6
  const K = [
    0x428a2f98 | 0, 0x71374491 | 0, 0xb5c0fbcf | 0, 0xe9b5dba5 | 0,
    0x3956c25b | 0, 0x59f111f1 | 0, 0x923f82a4 | 0, 0xab1c5ed5 | 0,
    0xd807aa98 | 0, 0x12835b01 | 0, 0x243185be | 0, 0x550c7dc3 | 0,
    0x72be5d74 | 0, 0x80deb1fe | 0, 0x9bdc06a7 | 0, 0xc19bf174 | 0,
    0xe49b69c1 | 0, 0xefbe4786 | 0, 0x0fc19dc6 | 0, 0x240ca1cc | 0,
    0x2de92c6f | 0, 0x4a7484aa | 0, 0x5cb0a9dc | 0, 0x76f988da | 0,
    0x983e5152 | 0, 0xa831c66d | 0, 0xb00327c8 | 0, 0xbf597fc7 | 0,
    0xc6e00bf3 | 0, 0xd5a79147 | 0, 0x06ca6351 | 0, 0x14292967 | 0,
    0x27b70a85 | 0, 0x2e1b2138 | 0, 0x4d2c6dfc | 0, 0x53380d13 | 0,
    0x650a7354 | 0, 0x766a0abb | 0, 0x81c2c92e | 0, 0x92722c85 | 0,
    0xa2bfe8a1 | 0, 0xa81a664b | 0, 0xc24b8b70 | 0, 0xc76c51a3 | 0,
    0xd192e819 | 0, 0xd6990624 | 0, 0xf40e3585 | 0, 0x106aa070 | 0,
    0x19a4c116 | 0, 0x1e376c08 | 0, 0x2748774c | 0, 0x34b0bcb5 | 0,
    0x391c0cb3 | 0, 0x4ed8aa4a | 0, 0x5b9cca4f | 0, 0x682e6ff3 | 0,
    0x748f82ee | 0, 0x78a5636f | 0, 0x84c87814 | 0, 0x8cc70208 | 0,
    0x90befffa | 0, 0xa4506ceb | 0, 0xbef9a3f7 | 0, 0xc67178f2 | 0,
  ];

  //https://github.com/kawanet/sha256-uint8array/blob/52e8f1b891c84fcb436f0f2e1103527d3a6465ea/lib/sha256-uint8array.ts#L48
  class Hash {
    constructor() {
      // first 32 bits of the fractional parts of the square roots of the first 8 primes 2..19
      this.A = 0x6a09e667 | 0;
      this.B = 0xbb67ae85 | 0;
      this.C = 0x3c6ef372 | 0;
      this.D = 0xa54ff53a | 0;
      this.E = 0x510e527f | 0;
      this.F = 0x9b05688c | 0;
      this.G = 0x1f83d9ab | 0;
      this.H = 0x5be0cd19 | 0;
      this._size = 0;
      this._sp = 0; // surrogate pair
      if (!sharedBuffer || sharedOffset >= 8000 /* allocTotal */) {
        sharedBuffer = new ArrayBuffer(8000 /* allocTotal */);
        sharedOffset = 0;
      }
      this._byte = new Uint8Array(sharedBuffer, sharedOffset, 80 /* allocBytes */);
      this._word = new Int32Array(sharedBuffer, sharedOffset, 20 /* allocWords */);
      sharedOffset += 80 /* allocBytes */;
    }
    update(data) {
      // data: string
      if ("string" === typeof data) {
        return this._utf8(data);
      }
      // data: undefined
      if (data == null) {
        throw new TypeError("Invalid type: " + typeof data);
      }
      const byteOffset = data.byteOffset;
      const length = data.byteLength;
      let blocks = (length / 64 /* inputBytes */) | 0;
      let offset = 0;
      // longer than 1 block
      if (blocks && !(byteOffset & 3) && !(this._size % 64 /* inputBytes */)) {
        const block = new Int32Array(data.buffer, byteOffset, blocks * 16 /* inputWords */);
        while (blocks--) {
          this._int32(block, offset >> 2);
          offset += 64 /* inputBytes */;
        }
        this._size += offset;
      }
      // data: TypedArray | DataView
      const BYTES_PER_ELEMENT = data.BYTES_PER_ELEMENT;
      if (BYTES_PER_ELEMENT !== 1 && data.buffer) {
        const rest = new Uint8Array(data.buffer, byteOffset + offset, length - offset);
        return this._uint8(rest);
      }
      // no more bytes
      if (offset === length)
        return this;
      // data: Uint8Array | Int8Array
      return this._uint8(data, offset);
    }
    _uint8(data, offset) {
      const { _byte, _word } = this;
      const length = data.length;
      offset = offset | 0;
      while (offset < length) {
        const start = this._size % 64 /* inputBytes */;
        let index = start;
        while (offset < length && index < 64 /* inputBytes */) {
          _byte[index++] = data[offset++];
        }
        if (index >= 64 /* inputBytes */) {
          this._int32(_word);
        }
        this._size += index - start;
      }
      return this;
    }
    _utf8(text) {
      const { _byte, _word } = this;
      const length = text.length;
      let surrogate = this._sp;
      for (let offset = 0; offset < length;) {
        const start = this._size % 64 /* inputBytes */;
        let index = start;
        while (offset < length && index < 64 /* inputBytes */) {
          let code = text.charCodeAt(offset++) | 0;
          if (code < 0x80) {
            // ASCII characters
            _byte[index++] = code;
          }
          else if (code < 0x800) {
            // 2 bytes
            _byte[index++] = 0xC0 | (code >>> 6);
            _byte[index++] = 0x80 | (code & 0x3F);
          }
          else if (code < 0xD800 || code > 0xDFFF) {
            // 3 bytes
            _byte[index++] = 0xE0 | (code >>> 12);
            _byte[index++] = 0x80 | ((code >>> 6) & 0x3F);
            _byte[index++] = 0x80 | (code & 0x3F);
          }
          else if (surrogate) {
            // 4 bytes - surrogate pair
            code = ((surrogate & 0x3FF) << 10) + (code & 0x3FF) + 0x10000;
            _byte[index++] = 0xF0 | (code >>> 18);
            _byte[index++] = 0x80 | ((code >>> 12) & 0x3F);
            _byte[index++] = 0x80 | ((code >>> 6) & 0x3F);
            _byte[index++] = 0x80 | (code & 0x3F);
            surrogate = 0;
          }
          else {
            surrogate = code;
          }
        }
        if (index >= 64 /* inputBytes */) {
          this._int32(_word);
          _word[0] = _word[16 /* inputWords */];
        }
        this._size += index - start;
      }
      this._sp = surrogate;
      return this;
    }
    _int32(data, offset) {
      let { A, B, C, D, E, F, G, H } = this;
      let i = 0;
      offset = offset | 0;
      while (i < 16 /* inputWords */) {
        W[i++] = swap32(data[offset++]);
      }
      for (i = 16 /* inputWords */; i < 64 /* workWords */; i++) {
        W[i] = (gamma1(W[i - 2]) + W[i - 7] + gamma0(W[i - 15]) + W[i - 16]) | 0;
      }
      for (i = 0; i < 64 /* workWords */; i++) {
        const T1 = (H + sigma1(E) + ch(E, F, G) + K[i] + W[i]) | 0;
        const T2 = (sigma0(A) + maj(A, B, C)) | 0;
        H = G;
        G = F;
        F = E;
        E = (D + T1) | 0;
        D = C;
        C = B;
        B = A;
        A = (T1 + T2) | 0;
      }
      this.A = (A + this.A) | 0;
      this.B = (B + this.B) | 0;
      this.C = (C + this.C) | 0;
      this.D = (D + this.D) | 0;
      this.E = (E + this.E) | 0;
      this.F = (F + this.F) | 0;
      this.G = (G + this.G) | 0;
      this.H = (H + this.H) | 0;
    }
    digest(encoding) {
      const { _byte, _word } = this;
      let i = (this._size % 64 /* inputBytes */) | 0;
      _byte[i++] = 0x80;
      // pad 0 for current word
      while (i & 3) {
        _byte[i++] = 0;
      }
      i >>= 2;
      if (i > 14 /* highIndex */) {
        while (i < 16 /* inputWords */) {
          _word[i++] = 0;
        }
        i = 0;
        this._int32(_word);
      }
      // pad 0 for rest words
      while (i < 16 /* inputWords */) {
        _word[i++] = 0;
      }
      // input size
      const bits64 = this._size * 8;
      const low32 = (bits64 & 0xffffffff) >>> 0;
      const high32 = (bits64 - low32) / 0x100000000;
      if (high32)
        _word[14 /* highIndex */] = swap32(high32);
      if (low32)
        _word[15 /* lowIndex */] = swap32(low32);
      this._int32(_word);
      return (encoding === "hex") ? this._hex() : this._bin();
    }
    _hex() {
      const { A, B, C, D, E, F, G, H } = this;
      return hex32(A) + hex32(B) + hex32(C) + hex32(D) + hex32(E) + hex32(F) + hex32(G) + hex32(H);
    }
    _bin() {
      const { A, B, C, D, E, F, G, H, _byte, _word } = this;
      _word[0] = swap32(A);
      _word[1] = swap32(B);
      _word[2] = swap32(C);
      _word[3] = swap32(D);
      _word[4] = swap32(E);
      _word[5] = swap32(F);
      _word[6] = swap32(G);
      _word[7] = swap32(H);
      return _byte.slice(0, 32);
    }
  }

  //https://github.com/kawanet/sha256-uint8array/blob/52e8f1b891c84fcb436f0f2e1103527d3a6465ea/lib/sha256-uint8array.ts#L290
  const W = new Int32Array(64 /* workWords */);
  let sharedBuffer;
  let sharedOffset = 0;
  const hex32 = num => (num + 0x100000000).toString(16).substr(-8);
  const swapLE = (c => (((c << 24) & 0xff000000) | ((c << 8) & 0xff0000) | ((c >> 8) & 0xff00) | ((c >> 24) & 0xff)));
  const swapBE = (c => c);
  const swap32 = isBE() ? swapBE : swapLE;
  const ch = (x, y, z) => (z ^ (x & (y ^ z)));
  const maj = (x, y, z) => ((x & y) | (z & (x | y)));
  const sigma0 = x => ((x >>> 2 | x << 30) ^ (x >>> 13 | x << 19) ^ (x >>> 22 | x << 10));
  const sigma1 = x => ((x >>> 6 | x << 26) ^ (x >>> 11 | x << 21) ^ (x >>> 25 | x << 7));
  const gamma0 = x => ((x >>> 7 | x << 25) ^ (x >>> 18 | x << 14) ^ (x >>> 3));
  const gamma1 = x => ((x >>> 17 | x << 15) ^ (x >>> 19 | x << 13) ^ (x >>> 10));

  //https://github.com/kawanet/sha256-uint8array/blob/52e8f1b891c84fcb436f0f2e1103527d3a6465ea/lib/sha256-uint8array.ts#L308
  function isBE() {
    const buf = new Uint8Array(new Uint16Array([0xFEFF]).buffer); // BOM
    return (buf[0] === 0xFE);
  }

  var MSB = 0x80
    , REST = 0x7F
    , MSBALL = ~REST
    , INT = Math.pow(2, 31);

  //https://github.com/multiformats/js-multiformats/blob/bb14a29dd823a517ef0c6c741d265e022591d831/src/hashes/digest.js#L10
  const create = (code, digest) => {
    const size = digest.byteLength
    const sizeOffset = encodingLength_1(code)
    const digestOffset = sizeOffset + encodingLength_1(size)

    const bytes = new Uint8Array(digestOffset + size)
    encodeTo_1(code, bytes, 0)
    encodeTo_1(size, bytes, sizeOffset)
    bytes.set(digest, digestOffset)

    return new Digest(code, size, digest, bytes)
  }

  //https://github.com/multiformats/js-multiformats/blob/bb14a29dd823a517ef0c6c741d265e022591d831/src/hashes/hasher.js#L22
  class Hasher {

    constructor(name, code, encode) {
      this.name = name
      this.code = code
      this.encode = encode
    }

    digest(input) {
      if (input instanceof Uint8Array) {
        const result = this.encode(input)
        return result instanceof Uint8Array
          ? create(this.code, result)
          : result.then((digest) => create(this.code, digest))
      } else {
        throw Error('Unknown type, must be binary type')
      }
    }
  }

  const from = ({ name, code, encode }) => new Hasher(name, code, encode)

  //https://github.com/multiformats/js-multiformats/blob/bb14a29dd823a517ef0c6c741d265e022591d831/src/hashes/sha2.js#L7
  s_sha256 = from({
    name: 'sha2-256',
    code: 18,
    //encode: (input) => coerce(crypto__default["default"].createHash('sha256').update(input).digest())
    encode: (input) => {
      return coerce(createHash('sha256').update(input).digest());
    }
  });
  /*---------------------------------------------------------------------------------------------
  *  Copyright 2016-2020 Protocol Labs
  *  Licensed under the MIT License.
  *  https://github.com/ipld/js-dag-pb/blob/master/LICENSE-MIT
  *--------------------------------------------------------------------------------------------*/
  //https://github.com/ipld/js-dag-pb/blob/422f91ea722efdd119b25a8c41087ef9a61f2252/src/util.js#L8
  const pbNodeProperties = ['Data', 'Links']
  const pbLinkProperties = ['Hash', 'Name', 'Tsize']

  //https://github.com/ipld/js-dag-pb/blob/422f91ea722efdd119b25a8c41087ef9a61f2252/src/pb-encode.js#L1
  const textEncoder = new TextEncoder()
  const maxInt32 = 2 ** 32
  const maxUInt32 = 2 ** 31

  //https://github.com/ipld/js-dag-pb/blob/422f91ea722efdd119b25a8c41087ef9a61f2252/src/pb-encode.js#L197
  const len8tab = [
    0, 1, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 4, 4, 4, 4,
    5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,
    6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6,
    6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6,
    7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7,
    7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7,
    7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7,
    7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7,
    8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8,
    8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8,
    8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8,
    8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8,
    8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8,
    8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8,
    8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8,
    8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8
  ]

  //https://github.com/ipld/js-dag-pb/blob/422f91ea722efdd119b25a8c41087ef9a61f2252/src/pb-encode.js#L23
  function encodeLink(link, bytes) {
    let i = bytes.length

    if (typeof link.Tsize === 'number') {
      if (link.Tsize < 0) {
        throw new Error('Tsize cannot be negative')
      }
      if (!Number.isSafeInteger(link.Tsize)) {
        throw new Error('Tsize too large for encoding')
      }
      i = encodeVarint(bytes, i, link.Tsize) - 1
      bytes[i] = 0x18
    }

    if (typeof link.Name === 'string') {
      const nameBytes = textEncoder.encode(link.Name)
      i -= nameBytes.length
      bytes.set(nameBytes, i)
      i = encodeVarint(bytes, i, nameBytes.length) - 1
      bytes[i] = 0x12
    }

    if (link.Hash) {
      i -= link.Hash.length
      bytes.set(link.Hash, i)
      i = encodeVarint(bytes, i, link.Hash.length) - 1
      bytes[i] = 0xa
    }

    return bytes.length - i
  }

  //https://github.com/ipld/js-dag-pb/blob/422f91ea722efdd119b25a8c41087ef9a61f2252/src/pb-encode.js#L91
  function sizeLink(link) {
    let n = 0

    if (link.Hash) {
      const l = link.Hash.length
      n += 1 + l + sov(l)
    }

    if (typeof link.Name === 'string') {
      const l = textEncoder.encode(link.Name).length
      n += 1 + l + sov(l)
    }

    if (typeof link.Tsize === 'number') {
      n += 1 + sov(link.Tsize)
    }

    return n
  }

  //https://github.com/ipld/js-dag-pb/blob/422f91ea722efdd119b25a8c41087ef9a61f2252/src/pb-encode.js#L179
  function len64(x) {
    let n = 0
    if (x >= maxInt32) {
      x = Math.floor(x / maxInt32)
      n = 32
    }
    if (x >= (1 << 16)) {
      x >>>= 16
      n += 16
    }
    if (x >= (1 << 8)) {
      x >>>= 8
      n += 8
    }
    return n + len8tab[x]
  }

  //https://github.com/ipld/js-dag-pb/blob/422f91ea722efdd119b25a8c41087ef9a61f2252/src/pb-encode.js#L166
  function sov(x) {
    if (x % 2 === 0) {
      x++
    }
    return Math.floor((len64(x) + 6) / 7)
  }

  //https://github.com/ipld/js-dag-pb/blob/422f91ea722efdd119b25a8c41087ef9a61f2252/src/pb-encode.js#L141
  function encodeVarint(bytes, offset, v) {
    offset -= sov(v)
    const base = offset

    while (v >= maxUInt32) {
      bytes[offset++] = (v & 0x7f) | 0x80
      v /= 128
    }

    while (v >= 128) {
      bytes[offset++] = (v & 0x7f) | 0x80
      v >>>= 7
    }

    bytes[offset] = v

    return base
  }

  //https://github.com/ipld/js-dag-pb/blob/422f91ea722efdd119b25a8c41087ef9a61f2252/src/pb-encode.js#L141
  function sizeNode(node) {
    let n = 0

    if (node.Data) {
      const l = node.Data.length
      n += 1 + l + sov(l)
    }

    if (node.Links) {
      for (const link of node.Links) {
        const l = sizeLink(link)
        n += 1 + l + sov(l)
      }
    }

    return n
  }

  //https://github.com/ipld/js-dag-pb/blob/422f91ea722efdd119b25a8c41087ef9a61f2252/src/pb-encode.js#L61
  function encodeNode(node) {
    const size = sizeNode(node)
    const bytes = new Uint8Array(size)
    let i = size

    if (node.Data) {
      i -= node.Data.length
      bytes.set(node.Data, i)
      i = encodeVarint(bytes, i, node.Data.length) - 1
      bytes[i] = 0xa
    }

    if (node.Links) {
      for (let index = node.Links.length - 1; index >= 0; index--) {
        const size = encodeLink(node.Links[index], bytes.subarray(0, i))
        i -= size
        i = encodeVarint(bytes, i, size) - 1
        bytes[i] = 0x12
      }
    }

    return bytes
  }

  //https://github.com/ipld/js-dag-pb/blob/422f91ea722efdd119b25a8c41087ef9a61f2252/src/util.js#L18
  function linkComparator(a, b) {
    if (a === b) {
      return 0
    }

    const abuf = a.Name ? textEncoder.encode(a.Name) : []
    const bbuf = b.Name ? textEncoder.encode(b.Name) : []

    let x = abuf.length
    let y = bbuf.length

    for (let i = 0, len = Math.min(x, y); i < len; ++i) {
      if (abuf[i] !== bbuf[i]) {
        x = abuf[i]
        y = bbuf[i]
        break
      }
    }

    return x < y ? -1 : y < x ? 1 : 0
  }

  //https://github.com/ipld/js-dag-pb/blob/422f91ea722efdd119b25a8c41087ef9a61f2252/src/util.js#L45
  function hasOnlyProperties(node, properties) {
    return !Object.keys(node).some((p) => !properties.includes(p))
  }

  //https://github.com/ipld/js-dag-pb/blob/422f91ea722efdd119b25a8c41087ef9a61f2252/src/util.js#L147
  function validate(node) {

    if (!node || typeof node !== 'object' || Array.isArray(node)) {
      throw new TypeError('Invalid DAG-PB form')
    }

    if (!hasOnlyProperties(node, pbNodeProperties)) {
      throw new TypeError('Invalid DAG-PB form (extraneous properties)')
    }

    if (node.Data !== undefined && !(node.Data instanceof Uint8Array)) {
      throw new TypeError('Invalid DAG-PB form (Data must be a Uint8Array)')
    }

    if (!Array.isArray(node.Links)) {
      throw new TypeError('Invalid DAG-PB form (Links must be an array)')
    }

    for (let i = 0; i < node.Links.length; i++) {
      const link = node.Links[i]
      if (!link || typeof link !== 'object' || Array.isArray(link)) {
        throw new TypeError('Invalid DAG-PB form (bad link object)')
      }

      if (!hasOnlyProperties(link, pbLinkProperties)) {
        throw new TypeError('Invalid DAG-PB form (extraneous properties on link object)')
      }

      if (!link.Hash) {
        throw new TypeError('Invalid DAG-PB form (link must have a Hash)')
      }

      if (link.Hash.asCID !== link.Hash) {
        throw new TypeError('Invalid DAG-PB form (link Hash must be a CID)')
      }

      if (link.Name !== undefined && typeof link.Name !== 'string') {
        throw new TypeError('Invalid DAG-PB form (link Name must be a string)')
      }

      if (link.Tsize !== undefined && (typeof link.Tsize !== 'number' || link.Tsize % 1 !== 0)) {
        throw new TypeError('Invalid DAG-PB form (link Tsize must be an integer)')
      }

      if (i > 0 && linkComparator(link, node.Links[i - 1]) === -1) {
        throw new TypeError('Invalid DAG-PB form (links must be sorted by Name bytes)')
      }
    }
  }

  //https://github.com/ipld/js-dag-pb/blob/422f91ea722efdd119b25a8c41087ef9a61f2252/src/index.js#L23
  var d_encode = (node) => {
    validate(node)
    const pbn = {}
    if (node.Links) {
      pbn.Links = node.Links.map((l) => {
        const link = {}
        if (l.Hash) {
          link.Hash = l.Hash.bytes // cid -> bytes
        }
        if (l.Name !== undefined) {
          link.Name = l.Name
        }
        if (l.Tsize !== undefined) {
          link.Tsize = l.Tsize
        }
        return link
      })
    }
    if (node.Data) {
      pbn.Data = node.Data
    }

    return encodeNode(pbn)
  }

  const hashItems = async (items, version) => {
    const opts = mergeOptions(defaultOptions, {cidVersion: 1, onlyHash: true, rawLeaves: true, maxChunkSize: 1048576})
    if (version == undefined)
      version = 1;
    let Links = [];
    for (let i = 0; i < items.length; i++) {
      let item = items[i];
      Links.push({
        Name: item.name,
        Hash: parse(item.cid),        
        Tsize: item.size
      })
    };

    try {
      const dirUnixFS = new UnixFS({
        type: 'directory',
        mtime: undefined,
        mode: 493
      });
      const node = {
        Data: dirUnixFS.marshal(),
        Links
      };
      // const buffer = d_encode(node);

      // const cid = await persist(buffer, {
      //   get: async cid => { throw new Error(`unexpected block API get for ${cid}`) },
      //   put: async () => { }
      // }, opts);
      // console.dir(opts);
      // return {
      //   size: 0,//bytes.length + Links.reduce((acc, curr) => acc + (curr.Tsize == null ? 0 : curr.Tsize), 0),
      //   cid: cid.toString()
      // }
      const bytes = d_encode(node);      
      const hash = await s_sha256.digest(bytes);
      const dagPB_code = 0x70;
      // const cid = CID.create(version, RAW_CODE, hash);
      const cid = CID.create(version, dagPB_code, hash);
      return {
        size: bytes.length + Links.reduce((acc, curr) => acc + (curr.Tsize == null ? 0 : curr.Tsize), 0),
        cid: cid.toString()
      }
    } catch (e) {
      throw e;
    }
  };
  const hashContent = async (value, version) => {
    try {
      if (version == undefined)
        version = 1;
      if (typeof (value) == 'string')
        value = new TextEncoder("utf-8").encode(value);

      var cid;
      if (version == 0) {
        const unixFS = new UnixFS({
          type: 'file',
          data: value
        })
        const bytes = d_encode({
          Data: unixFS.marshal(),
          Links: []
        })
        const hash = await s_sha256.digest(bytes);
        cid = CID.create(version, DAG_PB_CODE, hash);
      }
      else {
        const hash = await s_sha256.digest(value);
        if (value.length <= 1048576) //1 MB
          cid = CID.create(version, RAW_CODE, hash)
        else
          cid = CID.create(version, DAG_PB_CODE, hash)
      }
      return cid.toString();
    }
    catch (e) {
      throw e;
    }
  };
  const parse = function (cid) {
    return CID.parse(cid)
  };

  // test start from here
  const symbol = Symbol.for('BufferList')
  function BufferList(buf) {
    if (!(this instanceof BufferList)) {
      return new BufferList(buf)
    }

    BufferList._init.call(this, buf)
  }

  BufferList._init = function _init(buf) {
    Object.defineProperty(this, symbol, { value: true })

    this._bufs = []
    this.length = 0

    if (buf) {
      this.append(buf)
    }
  }

  BufferList.prototype._new = function _new(buf) {
    return new BufferList(buf)
  }

  BufferList.prototype._offset = function _offset(offset) {
    if (offset === 0) {
      return [0, 0]
    }

    let tot = 0

    for (let i = 0; i < this._bufs.length; i++) {
      const _t = tot + this._bufs[i].length
      if (offset < _t || i === this._bufs.length - 1) {
        return [i, offset - tot]
      }
      tot = _t
    }
  }

  BufferList.prototype._reverseOffset = function (blOffset) {
    const bufferId = blOffset[0]
    let offset = blOffset[1]

    for (let i = 0; i < bufferId; i++) {
      offset += this._bufs[i].length
    }

    return offset
  }

  BufferList.prototype.get = function get(index) {
    if (index > this.length || index < 0) {
      return undefined
    }

    const offset = this._offset(index)

    return this._bufs[offset[0]][offset[1]]
  }

  BufferList.prototype.slice = function slice(start, end) {
    if (typeof start === 'number' && start < 0) {
      start += this.length
    }

    if (typeof end === 'number' && end < 0) {
      end += this.length
    }

    return this.copy(null, 0, start, end)
  }

  BufferList.prototype.copy = function copy(dst, dstStart, srcStart, srcEnd) {
    if (typeof srcStart !== 'number' || srcStart < 0) {
      srcStart = 0
    }

    if (typeof srcEnd !== 'number' || srcEnd > this.length) {
      srcEnd = this.length
    }

    if (srcStart >= this.length) {
      return dst || Buffer.alloc(0)
    }

    if (srcEnd <= 0) {
      return dst || Buffer.alloc(0)
    }

    const copy = !!dst
    const off = this._offset(srcStart)
    const len = srcEnd - srcStart
    let bytes = len
    let bufoff = (copy && dstStart) || 0
    let start = off[1]

    // copy/slice everything
    if (srcStart === 0 && srcEnd === this.length) {
      if (!copy) {
        // slice, but full concat if multiple buffers
        return this._bufs.length === 1
          ? this._bufs[0]
          : util_Buffer.concat(this._bufs, this.length)
      }

      // copy, need to copy individual buffers
      for (let i = 0; i < this._bufs.length; i++) {
        this._bufs[i].copy(dst, bufoff)
        bufoff += this._bufs[i].length
      }

      return dst
    }

    // easy, cheap case where it's a subset of one of the buffers
    if (bytes <= this._bufs[off[0]].length - start) {
      return copy
        ? this._bufs[off[0]].copy(dst, dstStart, start, start + bytes)
        : this._bufs[off[0]].slice(start, start + bytes)
    }

    if (!copy) {
      // a slice, we need something to copy in to
      dst = Buffer.allocUnsafe(len)
    }

    for (let i = off[0]; i < this._bufs.length; i++) {
      const l = this._bufs[i].length - start

      if (bytes > l) {
        this._bufs[i].copy(dst, bufoff, start)
        bufoff += l
      } else {
        this._bufs[i].copy(dst, bufoff, start, start + bytes)
        bufoff += l
        break
      }

      bytes -= l

      if (start) {
        start = 0
      }
    }

    // safeguard so that we don't return uninitialized memory
    if (dst.length > bufoff) return dst.slice(0, bufoff)

    return dst
  }

  BufferList.prototype.shallowSlice = function shallowSlice(start, end) {
    start = start || 0
    end = typeof end !== 'number' ? this.length : end

    if (start < 0) {
      start += this.length
    }

    if (end < 0) {
      end += this.length
    }

    if (start === end) {
      return this._new()
    }

    const startOffset = this._offset(start)
    const endOffset = this._offset(end)
    const buffers = this._bufs.slice(startOffset[0], endOffset[0] + 1)

    if (endOffset[1] === 0) {
      buffers.pop()
    } else {
      buffers[buffers.length - 1] = buffers[buffers.length - 1].slice(0, endOffset[1])
    }

    if (startOffset[1] !== 0) {
      buffers[0] = buffers[0].slice(startOffset[1])
    }

    return this._new(buffers)
  }

  BufferList.prototype.toString = function toString(encoding, start, end) {
    return this.slice(start, end).toString(encoding)
  }

  BufferList.prototype.consume = function consume(bytes) {
    // first, normalize the argument, in accordance with how Buffer does it
    bytes = Math.trunc(bytes)
    // do nothing if not a positive number
    if (Number.isNaN(bytes) || bytes <= 0) return this

    while (this._bufs.length) {
      if (bytes >= this._bufs[0].length) {
        bytes -= this._bufs[0].length
        this.length -= this._bufs[0].length
        this._bufs.shift()
      } else {
        this._bufs[0] = this._bufs[0].slice(bytes)
        this.length -= bytes
        break
      }
    }

    return this
  }

  BufferList.prototype.duplicate = function duplicate() {
    const copy = this._new()

    for (let i = 0; i < this._bufs.length; i++) {
      copy.append(this._bufs[i])
    }

    return copy
  }
  BufferList.prototype.append = function append(buf) {
    if (buf == null) {
      return this
    }

    if (buf.buffer) {
      // append a view of the underlying ArrayBuffer
      this._appendBuffer(util_Buffer.from(buf.buffer, buf.byteOffset, buf.byteLength))
    } else if (Array.isArray(buf)) {
      for (let i = 0; i < buf.length; i++) {
        this.append(buf[i])
      }
    } else if (this._isBufferList(buf)) {
      // unwrap argument into individual BufferLists
      for (let i = 0; i < buf._bufs.length; i++) {
        this.append(buf._bufs[i])
      }
    } else {
      // coerce number arguments to strings, since Buffer(number) does
      // uninitialized memory allocation
      if (typeof buf === 'number') {
        buf = buf.toString()
      }

      this._appendBuffer(util_Buffer.from(buf))
    }

    return this
  }

  BufferList.prototype._appendBuffer = function appendBuffer(buf) {
    this._bufs.push(buf)
    this.length += buf.length
  }

  BufferList.prototype.indexOf = function (search, offset, encoding) {
    if (encoding === undefined && typeof offset === 'string') {
      encoding = offset
      offset = undefined
    }

    if (typeof search === 'function' || Array.isArray(search)) {
      throw new TypeError('The "value" argument must be one of type string, Buffer, BufferList, or Uint8Array.')
    } else if (typeof search === 'number') {
      search = util_Buffer.from([search])
    } else if (typeof search === 'string') {
      search = util_Buffer.from(search, encoding)
    } else if (this._isBufferList(search)) {
      search = search.slice()
    } else if (Array.isArray(search.buffer)) {
      search = util_Buffer.from(search.buffer, search.byteOffset, search.byteLength)
    } else if (!Buffer.isBuffer(search)) {
      search = util_Buffer.from(search)
    }

    offset = Number(offset || 0)

    if (isNaN(offset)) {
      offset = 0
    }

    if (offset < 0) {
      offset = this.length + offset
    }

    if (offset < 0) {
      offset = 0
    }

    if (search.length === 0) {
      return offset > this.length ? this.length : offset
    }

    const blOffset = this._offset(offset)
    let blIndex = blOffset[0] // index of which internal buffer we're working on
    let buffOffset = blOffset[1] // offset of the internal buffer we're working on

    // scan over each buffer
    for (; blIndex < this._bufs.length; blIndex++) {
      const buff = this._bufs[blIndex]

      while (buffOffset < buff.length) {
        const availableWindow = buff.length - buffOffset

        if (availableWindow >= search.length) {
          const nativeSearchResult = buff.indexOf(search, buffOffset)

          if (nativeSearchResult !== -1) {
            return this._reverseOffset([blIndex, nativeSearchResult])
          }

          buffOffset = buff.length - search.length + 1 // end of native search window
        } else {
          const revOffset = this._reverseOffset([blIndex, buffOffset])

          if (this._match(revOffset, search)) {
            return revOffset
          }

          buffOffset++
        }
      }

      buffOffset = 0
    }

    return -1
  }

  BufferList.prototype._match = function (offset, search) {
    if (this.length - offset < search.length) {
      return false
    }

    for (let searchOffset = 0; searchOffset < search.length; searchOffset++) {
      if (this.get(offset + searchOffset) !== search[searchOffset]) {
        return false
      }
    }
    return true
  }

    ; (function () {
      const methods = {
        readDoubleBE: 8,
        readDoubleLE: 8,
        readFloatBE: 4,
        readFloatLE: 4,
        readInt32BE: 4,
        readInt32LE: 4,
        readUInt32BE: 4,
        readUInt32LE: 4,
        readInt16BE: 2,
        readInt16LE: 2,
        readUInt16BE: 2,
        readUInt16LE: 2,
        readInt8: 1,
        readUInt8: 1,
        readIntBE: null,
        readIntLE: null,
        readUIntBE: null,
        readUIntLE: null
      }

      for (const m in methods) {
        (function (m) {
          if (methods[m] === null) {
            BufferList.prototype[m] = function (offset, byteLength) {
              return this.slice(offset, offset + byteLength)[m](0, byteLength)
            }
          } else {
            BufferList.prototype[m] = function (offset = 0) {
              return this.slice(offset, offset + methods[m])[m](0)
            }
          }
        }(m))
      }
    }())

  // Used internally by the class and also as an indicator of this object being
  // a `BufferList`. It's not possible to use `instanceof BufferList` in a browser
  // environment because there could be multiple different copies of the
  // BufferList class and some `BufferList`s might be `BufferList`s.
  BufferList.prototype._isBufferList = function _isBufferList(b) {
    return b instanceof BufferList || BufferList.isBufferList(b)
  }

  BufferList.isBufferList = function isBufferList(b) {
    return b != null && b[symbol]
  }
  async function hamtHashFn(buf) {
    const hash = await multihashing(buf, 'murmur3-128')

    // Multihashing inserts preamble of 2 bytes. Remove it.
    // Also, murmur3 outputs 128 bit but, accidentally, IPFS Go's
    // implementation only uses the first 64, so we must do the same
    // for parity..
    const justHash = hash.slice(2, 10)
    const length = justHash.length
    const result = new Uint8Array(length)
    // TODO: invert buffer because that's how Go impl does it
    for (let i = 0; i < length; i++) {
      result[length - i - 1] = justHash[i]
    }

    return result
  }
  async function* rabinChunker(source, options) {
    let min, max, avg

    if (options.minChunkSize && options.maxChunkSize && options.avgChunkSize) {
      avg = options.avgChunkSize
      min = options.minChunkSize
      max = options.maxChunkSize
    } else if (!options.avgChunkSize) {
      throw errcode(new Error('please specify an average chunk size'), 'ERR_INVALID_AVG_CHUNK_SIZE')
    } else {
      avg = options.avgChunkSize
      min = avg / 3
      max = avg + (avg / 2)
    }

    // validate min/max/avg in the same way as go
    if (min < 16) {
      throw errcode(new Error('rabin min must be greater than 16'), 'ERR_INVALID_MIN_CHUNK_SIZE')
    }

    if (max < min) {
      max = min
    }

    if (avg < min) {
      avg = min
    }

    const sizepow = Math.floor(Math.log2(avg))

    for await (const chunk of rabin(source, {
      min: min,
      max: max,
      bits: sizepow,
      window: options.window,
      polynomial: options.polynomial
    })) {
      yield chunk
    }
  }
  async function* rabin(source, options) {
    const r = await create(options.bits, options.min, options.max, options.window)
    const buffers = new BufferList()

    for await (const chunk of source) {
      buffers.append(chunk)

      const sizes = r.fingerprint(chunk)

      for (let i = 0; i < sizes.length; i++) {
        const size = sizes[i]
        const buf = buffers.slice(0, size)
        buffers.consume(size)

        yield buf
      }
    }

    if (buffers.length) {
      yield buffers.slice(0)
    }
  }
  async function* fixedSizeChunker(source, options) {
    let bl = new BufferList()
    let currentLength = 0
    let emitted = false
    const maxChunkSize = options.maxChunkSize

    for await (const buffer of source) {
      bl.append(buffer)

      currentLength += buffer.length

      while (currentLength >= maxChunkSize) {
        yield bl.slice(0, maxChunkSize)
        emitted = true

        // throw away consumed bytes
        if (maxChunkSize === bl.length) {
          bl = new BufferList()
          currentLength = 0
        } else {
          const newBl = new BufferList()
          newBl.append(bl.shallowSlice(maxChunkSize))
          bl = newBl

          // update our offset
          currentLength -= maxChunkSize
        }
      }
    }

    if (!emitted || currentLength) {
      // return any remaining bytes or an empty buffer
      yield bl.slice(0, currentLength)
    }
  }
  async function* dagBuilder1(source, block, options) {
    for await (const entry of source) {
      if (entry.path) {
        if (entry.path.substring(0, 2) === './') {
          options.wrapWithDirectory = true
        }

        entry.path = entry.path
          .split('/')
          .filter(path => path && path !== '.')
          .join('/')
      }

      if (entry.content) {
        let chunker

        if (typeof options.chunker === 'function') {
          chunker = options.chunker
        } else if (options.chunker === 'rabin') {
          chunker = rabinChunker
        } else {
          chunker = fixedSizeChunker
        }

        /**
         * @type {ChunkValidator}
         */
        let chunkValidator

        if (typeof options.chunkValidator === 'function') {
          chunkValidator = options.chunkValidator
        } else {
          chunkValidator = validateChunks // point 5
        }

        /** @type {File} */
        const file = {
          path: entry.path,
          mtime: entry.mtime,
          mode: entry.mode,
          content: chunker(chunkValidator(contentAsAsyncIterable(entry.content), options), options) // here change content to other data type
        }

        yield () => fileBuilder(file, block, options)
      } else if (entry.path) {
        const dir = {
          path: entry.path,
          mtime: entry.mtime,
          mode: entry.mode
        }

        yield () => dirBuilder(dir, block, options)
      } else {
        throw new Error('Import candidate must have content or path or both')
      }
    }
  }
  async function* validateChunks(source) {
    for await (const content of source) {
      if (content.length === undefined) {
        throw errCode(new Error('Content was invalid'), 'ERR_INVALID_CONTENT')
      }

      if (typeof content === 'string' || content instanceof String) {
        yield uint8ArrayFromString(content.toString())
      } else if (Array.isArray(content)) {
        yield Uint8Array.from(content)
      } else if (content instanceof Uint8Array) {
        yield content
      } else {
        throw errCode(new Error('Content was invalid'), 'ERR_INVALID_CONTENT')
      }
    }
  }
  async function Multihashing(bytes, alg, length) {
    const digest = await Multihashing.digest(bytes, alg, length)
    return multihash.mh_encode(digest, alg, length)
  }

  const mh_names = Object.freeze({
    'identity': 0x00,
    'sha1': 0x11,
    'sha2-256': 0x12,
    'sha2-512': 0x13,
    'sha3-512': 0x14,
    'sha3-384': 0x15,
    'sha3-256': 0x16,
    'sha3-224': 0x17,
    'shake-128': 0x18,
    'shake-256': 0x19,
    'keccak-224': 0x1a,
    'keccak-256': 0x1b,
    'keccak-384': 0x1c,
    'keccak-512': 0x1d,
    'blake3': 0x1e,
    'murmur3-128': 0x22,
    'murmur3-32': 0x23,
    'dbl-sha2-256': 0x56,
    'md4': 0xd4,
    'md5': 0xd5,
    'bmt': 0xd6,
    'sha2-256-trunc254-padded': 0x1012,
    'ripemd-128': 0x1052,
    'ripemd-160': 0x1053,
    'ripemd-256': 0x1054,
    'ripemd-320': 0x1055,
    'x11': 0x1100,
    'kangarootwelve': 0x1d01,
    'sm3-256': 0x534d,
    'blake2b-8': 0xb201,
    'blake2b-16': 0xb202,
    'blake2b-24': 0xb203,
    'blake2b-32': 0xb204,
    'blake2b-40': 0xb205,
    'blake2b-48': 0xb206,
    'blake2b-56': 0xb207,
    'blake2b-64': 0xb208,
    'blake2b-72': 0xb209,
    'blake2b-80': 0xb20a,
    'blake2b-88': 0xb20b,
    'blake2b-96': 0xb20c,
    'blake2b-104': 0xb20d,
    'blake2b-112': 0xb20e,
    'blake2b-120': 0xb20f,
    'blake2b-128': 0xb210,
    'blake2b-136': 0xb211,
    'blake2b-144': 0xb212,
    'blake2b-152': 0xb213,
    'blake2b-160': 0xb214,
    'blake2b-168': 0xb215,
    'blake2b-176': 0xb216,
    'blake2b-184': 0xb217,
    'blake2b-192': 0xb218,
    'blake2b-200': 0xb219,
    'blake2b-208': 0xb21a,
    'blake2b-216': 0xb21b,
    'blake2b-224': 0xb21c,
    'blake2b-232': 0xb21d,
    'blake2b-240': 0xb21e,
    'blake2b-248': 0xb21f,
    'blake2b-256': 0xb220,
    'blake2b-264': 0xb221,
    'blake2b-272': 0xb222,
    'blake2b-280': 0xb223,
    'blake2b-288': 0xb224,
    'blake2b-296': 0xb225,
    'blake2b-304': 0xb226,
    'blake2b-312': 0xb227,
    'blake2b-320': 0xb228,
    'blake2b-328': 0xb229,
    'blake2b-336': 0xb22a,
    'blake2b-344': 0xb22b,
    'blake2b-352': 0xb22c,
    'blake2b-360': 0xb22d,
    'blake2b-368': 0xb22e,
    'blake2b-376': 0xb22f,
    'blake2b-384': 0xb230,
    'blake2b-392': 0xb231,
    'blake2b-400': 0xb232,
    'blake2b-408': 0xb233,
    'blake2b-416': 0xb234,
    'blake2b-424': 0xb235,
    'blake2b-432': 0xb236,
    'blake2b-440': 0xb237,
    'blake2b-448': 0xb238,
    'blake2b-456': 0xb239,
    'blake2b-464': 0xb23a,
    'blake2b-472': 0xb23b,
    'blake2b-480': 0xb23c,
    'blake2b-488': 0xb23d,
    'blake2b-496': 0xb23e,
    'blake2b-504': 0xb23f,
    'blake2b-512': 0xb240,
    'blake2s-8': 0xb241,
    'blake2s-16': 0xb242,
    'blake2s-24': 0xb243,
    'blake2s-32': 0xb244,
    'blake2s-40': 0xb245,
    'blake2s-48': 0xb246,
    'blake2s-56': 0xb247,
    'blake2s-64': 0xb248,
    'blake2s-72': 0xb249,
    'blake2s-80': 0xb24a,
    'blake2s-88': 0xb24b,
    'blake2s-96': 0xb24c,
    'blake2s-104': 0xb24d,
    'blake2s-112': 0xb24e,
    'blake2s-120': 0xb24f,
    'blake2s-128': 0xb250,
    'blake2s-136': 0xb251,
    'blake2s-144': 0xb252,
    'blake2s-152': 0xb253,
    'blake2s-160': 0xb254,
    'blake2s-168': 0xb255,
    'blake2s-176': 0xb256,
    'blake2s-184': 0xb257,
    'blake2s-192': 0xb258,
    'blake2s-200': 0xb259,
    'blake2s-208': 0xb25a,
    'blake2s-216': 0xb25b,
    'blake2s-224': 0xb25c,
    'blake2s-232': 0xb25d,
    'blake2s-240': 0xb25e,
    'blake2s-248': 0xb25f,
    'blake2s-256': 0xb260,
    'skein256-8': 0xb301,
    'skein256-16': 0xb302,
    'skein256-24': 0xb303,
    'skein256-32': 0xb304,
    'skein256-40': 0xb305,
    'skein256-48': 0xb306,
    'skein256-56': 0xb307,
    'skein256-64': 0xb308,
    'skein256-72': 0xb309,
    'skein256-80': 0xb30a,
    'skein256-88': 0xb30b,
    'skein256-96': 0xb30c,
    'skein256-104': 0xb30d,
    'skein256-112': 0xb30e,
    'skein256-120': 0xb30f,
    'skein256-128': 0xb310,
    'skein256-136': 0xb311,
    'skein256-144': 0xb312,
    'skein256-152': 0xb313,
    'skein256-160': 0xb314,
    'skein256-168': 0xb315,
    'skein256-176': 0xb316,
    'skein256-184': 0xb317,
    'skein256-192': 0xb318,
    'skein256-200': 0xb319,
    'skein256-208': 0xb31a,
    'skein256-216': 0xb31b,
    'skein256-224': 0xb31c,
    'skein256-232': 0xb31d,
    'skein256-240': 0xb31e,
    'skein256-248': 0xb31f,
    'skein256-256': 0xb320,
    'skein512-8': 0xb321,
    'skein512-16': 0xb322,
    'skein512-24': 0xb323,
    'skein512-32': 0xb324,
    'skein512-40': 0xb325,
    'skein512-48': 0xb326,
    'skein512-56': 0xb327,
    'skein512-64': 0xb328,
    'skein512-72': 0xb329,
    'skein512-80': 0xb32a,
    'skein512-88': 0xb32b,
    'skein512-96': 0xb32c,
    'skein512-104': 0xb32d,
    'skein512-112': 0xb32e,
    'skein512-120': 0xb32f,
    'skein512-128': 0xb330,
    'skein512-136': 0xb331,
    'skein512-144': 0xb332,
    'skein512-152': 0xb333,
    'skein512-160': 0xb334,
    'skein512-168': 0xb335,
    'skein512-176': 0xb336,
    'skein512-184': 0xb337,
    'skein512-192': 0xb338,
    'skein512-200': 0xb339,
    'skein512-208': 0xb33a,
    'skein512-216': 0xb33b,
    'skein512-224': 0xb33c,
    'skein512-232': 0xb33d,
    'skein512-240': 0xb33e,
    'skein512-248': 0xb33f,
    'skein512-256': 0xb340,
    'skein512-264': 0xb341,
    'skein512-272': 0xb342,
    'skein512-280': 0xb343,
    'skein512-288': 0xb344,
    'skein512-296': 0xb345,
    'skein512-304': 0xb346,
    'skein512-312': 0xb347,
    'skein512-320': 0xb348,
    'skein512-328': 0xb349,
    'skein512-336': 0xb34a,
    'skein512-344': 0xb34b,
    'skein512-352': 0xb34c,
    'skein512-360': 0xb34d,
    'skein512-368': 0xb34e,
    'skein512-376': 0xb34f,
    'skein512-384': 0xb350,
    'skein512-392': 0xb351,
    'skein512-400': 0xb352,
    'skein512-408': 0xb353,
    'skein512-416': 0xb354,
    'skein512-424': 0xb355,
    'skein512-432': 0xb356,
    'skein512-440': 0xb357,
    'skein512-448': 0xb358,
    'skein512-456': 0xb359,
    'skein512-464': 0xb35a,
    'skein512-472': 0xb35b,
    'skein512-480': 0xb35c,
    'skein512-488': 0xb35d,
    'skein512-496': 0xb35e,
    'skein512-504': 0xb35f,
    'skein512-512': 0xb360,
    'skein1024-8': 0xb361,
    'skein1024-16': 0xb362,
    'skein1024-24': 0xb363,
    'skein1024-32': 0xb364,
    'skein1024-40': 0xb365,
    'skein1024-48': 0xb366,
    'skein1024-56': 0xb367,
    'skein1024-64': 0xb368,
    'skein1024-72': 0xb369,
    'skein1024-80': 0xb36a,
    'skein1024-88': 0xb36b,
    'skein1024-96': 0xb36c,
    'skein1024-104': 0xb36d,
    'skein1024-112': 0xb36e,
    'skein1024-120': 0xb36f,
    'skein1024-128': 0xb370,
    'skein1024-136': 0xb371,
    'skein1024-144': 0xb372,
    'skein1024-152': 0xb373,
    'skein1024-160': 0xb374,
    'skein1024-168': 0xb375,
    'skein1024-176': 0xb376,
    'skein1024-184': 0xb377,
    'skein1024-192': 0xb378,
    'skein1024-200': 0xb379,
    'skein1024-208': 0xb37a,
    'skein1024-216': 0xb37b,
    'skein1024-224': 0xb37c,
    'skein1024-232': 0xb37d,
    'skein1024-240': 0xb37e,
    'skein1024-248': 0xb37f,
    'skein1024-256': 0xb380,
    'skein1024-264': 0xb381,
    'skein1024-272': 0xb382,
    'skein1024-280': 0xb383,
    'skein1024-288': 0xb384,
    'skein1024-296': 0xb385,
    'skein1024-304': 0xb386,
    'skein1024-312': 0xb387,
    'skein1024-320': 0xb388,
    'skein1024-328': 0xb389,
    'skein1024-336': 0xb38a,
    'skein1024-344': 0xb38b,
    'skein1024-352': 0xb38c,
    'skein1024-360': 0xb38d,
    'skein1024-368': 0xb38e,
    'skein1024-376': 0xb38f,
    'skein1024-384': 0xb390,
    'skein1024-392': 0xb391,
    'skein1024-400': 0xb392,
    'skein1024-408': 0xb393,
    'skein1024-416': 0xb394,
    'skein1024-424': 0xb395,
    'skein1024-432': 0xb396,
    'skein1024-440': 0xb397,
    'skein1024-448': 0xb398,
    'skein1024-456': 0xb399,
    'skein1024-464': 0xb39a,
    'skein1024-472': 0xb39b,
    'skein1024-480': 0xb39c,
    'skein1024-488': 0xb39d,
    'skein1024-496': 0xb39e,
    'skein1024-504': 0xb39f,
    'skein1024-512': 0xb3a0,
    'skein1024-520': 0xb3a1,
    'skein1024-528': 0xb3a2,
    'skein1024-536': 0xb3a3,
    'skein1024-544': 0xb3a4,
    'skein1024-552': 0xb3a5,
    'skein1024-560': 0xb3a6,
    'skein1024-568': 0xb3a7,
    'skein1024-576': 0xb3a8,
    'skein1024-584': 0xb3a9,
    'skein1024-592': 0xb3aa,
    'skein1024-600': 0xb3ab,
    'skein1024-608': 0xb3ac,
    'skein1024-616': 0xb3ad,
    'skein1024-624': 0xb3ae,
    'skein1024-632': 0xb3af,
    'skein1024-640': 0xb3b0,
    'skein1024-648': 0xb3b1,
    'skein1024-656': 0xb3b2,
    'skein1024-664': 0xb3b3,
    'skein1024-672': 0xb3b4,
    'skein1024-680': 0xb3b5,
    'skein1024-688': 0xb3b6,
    'skein1024-696': 0xb3b7,
    'skein1024-704': 0xb3b8,
    'skein1024-712': 0xb3b9,
    'skein1024-720': 0xb3ba,
    'skein1024-728': 0xb3bb,
    'skein1024-736': 0xb3bc,
    'skein1024-744': 0xb3bd,
    'skein1024-752': 0xb3be,
    'skein1024-760': 0xb3bf,
    'skein1024-768': 0xb3c0,
    'skein1024-776': 0xb3c1,
    'skein1024-784': 0xb3c2,
    'skein1024-792': 0xb3c3,
    'skein1024-800': 0xb3c4,
    'skein1024-808': 0xb3c5,
    'skein1024-816': 0xb3c6,
    'skein1024-824': 0xb3c7,
    'skein1024-832': 0xb3c8,
    'skein1024-840': 0xb3c9,
    'skein1024-848': 0xb3ca,
    'skein1024-856': 0xb3cb,
    'skein1024-864': 0xb3cc,
    'skein1024-872': 0xb3cd,
    'skein1024-880': 0xb3ce,
    'skein1024-888': 0xb3cf,
    'skein1024-896': 0xb3d0,
    'skein1024-904': 0xb3d1,
    'skein1024-912': 0xb3d2,
    'skein1024-920': 0xb3d3,
    'skein1024-928': 0xb3d4,
    'skein1024-936': 0xb3d5,
    'skein1024-944': 0xb3d6,
    'skein1024-952': 0xb3d7,
    'skein1024-960': 0xb3d8,
    'skein1024-968': 0xb3d9,
    'skein1024-976': 0xb3da,
    'skein1024-984': 0xb3db,
    'skein1024-992': 0xb3dc,
    'skein1024-1000': 0xb3dd,
    'skein1024-1008': 0xb3de,
    'skein1024-1016': 0xb3df,
    'skein1024-1024': 0xb3e0,
    'poseidon-bls12_381-a2-fc1': 0xb401,
    'poseidon-bls12_381-a2-fc1-sc': 0xb402
  })

  const mh_codes = /** @type {import('./types').CodeNameMap} */({})
  for (const key in mh_names) {
    const name = /** @type {HashName} */(key)
    mh_codes[mh_names[name]] = name
  }
  Object.freeze(mh_codes)

  function createCodec(name, prefix, encode, decode) {
    return {
      name,
      prefix,
      encoder: {
        name,
        prefix,
        encode
      },
      decoder: { decode }
    };
  }

  const string = createCodec('utf8', 'u', buf => {
    const decoder = new TextDecoder('utf8');
    return 'u' + decoder.decode(buf);
  }, str => {
    const encoder = new TextEncoder();
    return encoder.encode(str.substring(1));
  });

  var bases = {
    utf8: string,
    'utf-8': string,
    // hex: basics.bases.base16,
    // latin1: ascii,
    // ascii: ascii,
    // binary: ascii,
    // ...basics.bases
  };

  function uint8ArrayToString(array, encoding = 'utf8') {
    const base = bases[encoding];
    if (!base) {
      throw new Error(`Unsupported encoding "${encoding}"`);
    }
    if ((encoding === 'utf8' || encoding === 'utf-8') && globalThis.Buffer != null && globalThis.Buffer.from != null) {
      return globalThis.Buffer.from(array.buffer, array.byteOffset, array.byteLength).toString('utf8');
    }
    return base.encoder.encode(array).substring(1);
  }

  function mh_toHexString(hash) {
    if (!(hash instanceof Uint8Array)) {
      throw new Error('must be passed a Uint8Array')
    }

    return uint8ArrayToString(hash, 'base16')
  }

  function mh_fromHexString(hash) {
    return uint8ArrayFromString(hash, 'base16')
  }

  const encodeText = (text) => textEncoder.encode(text)

  class Base {
    constructor(name, code, factory, alphabet) {
      this.name = name
      this.code = code
      this.codeBuf = encodeText(this.code)
      this.alphabet = alphabet
      this.codec = factory(alphabet)
    }
    encode(buf) {
      return this.codec.encode(buf)
    }
    decode(string) {
      for (const char of string) {
        if (this.alphabet && this.alphabet.indexOf(char) < 0) {
          throw new Error(`invalid character '${char}' in '${string}'`)
        }
      }
      return this.codec.decode(string)
    }
  }

  const rfc4648_1 = (bitsPerChar) => (alphabet) => {
    return {
      encode(input) {
        return _encode(input, alphabet, bitsPerChar)
      },
      decode(input) {
        return _decode(input, alphabet, bitsPerChar)
      }
    }
  }

  const constants = [
    // ['identity', '\x00', identity, ''],
    ['base2', '0', rfc4648_1(1), '01'],
    ['base8', '7', rfc4648_1(3), '01234567'],
    ['base10', '9', _basex, '0123456789'],
    ['base16', 'f', rfc4648_1(4), '0123456789abcdef'],
    ['base16upper', 'F', rfc4648_1(4), '0123456789ABCDEF'],
    ['base32hex', 'v', rfc4648_1(5), '0123456789abcdefghijklmnopqrstuv'],
    ['base32hexupper', 'V', rfc4648_1(5), '0123456789ABCDEFGHIJKLMNOPQRSTUV'],
    ['base32hexpad', 't', rfc4648_1(5), '0123456789abcdefghijklmnopqrstuv='],
    ['base32hexpadupper', 'T', rfc4648_1(5), '0123456789ABCDEFGHIJKLMNOPQRSTUV='],
    ['base32', 'b', rfc4648_1(5), 'abcdefghijklmnopqrstuvwxyz234567'],
    ['base32upper', 'B', rfc4648_1(5), 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'],
    ['base32pad', 'c', rfc4648_1(5), 'abcdefghijklmnopqrstuvwxyz234567='],
    ['base32padupper', 'C', rfc4648_1(5), 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567='],
    ['base32z', 'h', rfc4648_1(5), 'ybndrfg8ejkmcpqxot1uwisza345h769'],
    ['base36', 'k', _basex, '0123456789abcdefghijklmnopqrstuvwxyz'],
    ['base36upper', 'K', _basex, '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'],
    ['base58btc', 'z', _basex, '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz'],
    ['base58flickr', 'Z', _basex, '123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ'],
    ['base64', 'm', rfc4648_1(6), 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'],
    ['base64pad', 'M', rfc4648_1(6), 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/='],
    ['base64url', 'u', rfc4648_1(6), 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_'],
    ['base64urlpad', 'U', rfc4648_1(6), 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_=']
  ]

  const constants1_names = constants.reduce((prev, tupple) => {
    prev[tupple[0]] = new Base(tupple[0], tupple[1], tupple[2], tupple[3])
    return prev
  }, /** @type {Record<BaseName,Base>} */({}))

  const constants1_codes = constants.reduce((prev, tupple) => {
    prev[tupple[1]] = constants1_names[tupple[0]]
    return prev
  }, /** @type {Record<BaseCode,Base>} */({}))

  function encoding(nameOrCode) {
    if (Object.prototype.hasOwnProperty.call(constants1_names, /** @type {BaseName} */(nameOrCode))) {
      return constants1_names[/** @type {BaseName} */(nameOrCode)]
    } else if (Object.prototype.hasOwnProperty.call(constants1_codes, /** @type {BaseCode} */(nameOrCode))) {
      return constants1_codes[/** @type {BaseCode} */(nameOrCode)]
    } else {
      throw new Error(`Unsupported encoding: ${nameOrCode}`)
    }
  }

  function concat(arrs, length) {
    const output = new Uint8Array(length)
    let offset = 0

    for (const arr of arrs) {
      output.set(arr, offset)
      offset += arr.length
    }

    return output
  }

  const textDecoder = new TextDecoder()
  const decodeText = (bytes) => textDecoder.decode(bytes)
  function validEncode(name, buf) {
    const enc = encoding(name)
    enc.decode(decodeText(buf))
  }

  function multibase(nameOrCode, buf) {
    if (!buf) {
      throw new Error('requires an encoded Uint8Array')
    }
    const { name, codeBuf } = encoding(nameOrCode)
    validEncode(name, buf)

    return concat([codeBuf, buf], codeBuf.length + buf.length)
  }

  function multibase_encode(nameOrCode, buf) {
    const enc = encoding(nameOrCode)
    const data = encodeText(enc.encode(buf))

    return concat([enc.codeBuf, data], enc.codeBuf.length + data.length)
  }

  function multibase_decode(data) {
    if (data instanceof Uint8Array) {
      data = decodeText(data)
    }
    const prefix = data[0]
    if (['f', 'F', 'v', 'V', 't', 'T', 'b', 'B', 'c', 'C', 'h', 'k', 'K'].includes(prefix)) {
      data = data.toLowerCase()
    }
    const enc = encoding(/** @type {BaseCode} */(data[0]))
    return enc.decode(data.substring(1))
  }

  function mh_toB58String(hash) {
    if (!(hash instanceof Uint8Array)) {
      throw new Error('must be passed a Uint8Array')
    }
    return uint8ArrayToString(multibase_encode('base58btc', hash)).slice(1)
  }

  function mh_fromB58String(hash) {
    const encoded = hash instanceof Uint8Array
      ? uint8ArrayToString(hash)
      : hash

    return multibase_decode('z' + encoded)
  }

  function mh_decode(bytes) {
    if (!(bytes instanceof Uint8Array)) {
      throw new Error('multihash must be a Uint8Array')
    }

    if (bytes.length < 2) {
      throw new Error('multihash too short. must be > 2 bytes.')
    }

    const code = /** @type {HashCode} */(decode_2(bytes))
    if (!mh_isValidCode(code)) {
      throw new Error(`multihash unknown function code: 0x${code.toString(16)}`)
    }
    bytes = bytes.slice(decode_2.bytes)

    const len = decode_2(bytes)
    if (len < 0) {
      throw new Error(`multihash invalid length: ${len}`)
    }
    bytes = bytes.slice(decode_2.bytes)

    if (bytes.length !== len) {
      throw new Error(`multihash length inconsistent: 0x${uint8ArrayToString(bytes, 'base16')}`)
    }

    return {
      code,
      name: mh_codes[code],
      length: len,
      digest: bytes
    }
  }

  function mh_encode(digest, code, length) {
    if (!digest || code === undefined) {
      throw new Error('multihash encode requires at least two args: digest, code')
    }
    const hashfn = mh_coerceCode(code)

    if (!(digest instanceof Uint8Array)) {
      throw new Error('digest should be a Uint8Array')
    }

    if (length == null) {
      length = digest.length
    }

    if (length && digest.length !== length) {
      throw new Error('digest length should be equal to specified length.')
    }

    function alloc_allocUnsafe(size = 0) {
      if (globalThis.Buffer != null && globalThis.Buffer.allocUnsafe != null) {
        return globalThis.Buffer.allocUnsafe(size);
      }
      return new Uint8Array(size);
    }

    const hash = encode_2(hashfn)
    const len = encode_2(length)
    function uint8ArrayConcat(arrays, length) {
      if (!length) {
        length = arrays.reduce((acc, curr) => acc + curr.length, 0);
      }
      const output = alloc_allocUnsafe(length);
      let offset = 0;
      for (const arr of arrays) {
        output.set(arr, offset);
        offset += arr.length;
      }
      return output;
    }
    return uint8ArrayConcat([hash, len, digest], hash.length + len.length + digest.length)
  }

  function mh_coerceCode(name) {
    let code = name

    if (typeof name === 'string') {
      if (mh_names[name] === undefined) {
        throw new Error(`Unrecognized hash function named: ${name}`)
      }
      code = mh_names[name]
    }

    if (typeof code !== 'number') {
      throw new Error(`Hash function code should be a number. Got: ${code}`)
    }

    if (mh_codes[code] === undefined && !mh_isAppCode(code)) {
      throw new Error(`Unrecognized function code: ${code}`)
    }

    return code
  }

  function mh_isAppCode(code) {
    return code > 0 && code < 0x10
  }

  function mh_validate(multihash) {
    mh_decode(multihash)
  }

  function mh_prefix(multihash) {
    mh_validate(multihash)

    return multihash.subarray(0, 2)
  }

  function mh_isValidCode(code) {
    if (mh_isAppCode(code)) {
      return true
    }

    if (mh_codes[code]) {
      return true
    }

    return false
  }

  const multihash = {
    mh_names,
    mh_codes,
    mh_toHexString,
    mh_fromHexString,
    mh_toB58String,
    mh_fromB58String,
    mh_decode,
    mh_encode,
    mh_coerceCode,
    mh_isAppCode,
    mh_validate,
    mh_prefix,
    mh_isValidCode
  }

  Multihashing.multihash = multihash

  Multihashing.digest = async (bytes, alg, length) => {
    const hash = Multihashing.createHash(alg)
    const digest = await hash(bytes)
    return length ? digest.slice(0, length) : digest
  }

  Multihashing.createHash = function (alg) {
    if (!alg) {
      const e = errcode(new Error('hash algorithm must be specified'), 'ERR_HASH_ALGORITHM_NOT_SPECIFIED')
      throw e
    }
    const code = multihash.mh_coerceCode(alg)
    if (!Multihashing.functions[code]) {
      throw errcode(new Error(`multihash function '${alg}' not yet supported`), 'ERR_HASH_ALGORITHM_NOT_SUPPORTED')
    }
    return Multihashing.functions[code]
  }

  const digest = async (data, alg) => {
    switch (alg) {
      // case 'sha1':
      //   return crypto.createHash('sha1').update(data).digest()
      case 'sha2-256':
        return createHash('sha256').update(data).digest()
      // case 'sha2-512':
      //   return crypto.createHash('sha512').update(data).digest()
      case 'dbl-sha2-256': {
        const first = createHash('sha256').update(data).digest()
        return createHash('sha256').update(first).digest()
      }
      default:
        throw new Error(`${alg} is not a supported algorithm`)
    }
  }

  const { factory: sha } = {
    factory: (alg) => async (data) => {
      return digest(data, alg)
    },
    digest,
    multihashing: async (buf, alg, length) => {
      const h = await digest(buf, alg)
      return multihash.encode(h, alg, length)
    }
  }

  var crypto = {
    // identity,
    // sha1: sha('sha1'),
    sha2256: sha('sha2-256'),
    // sha2512: sha('sha2-512'),
    // dblSha2256: sha('dbl-sha2-256'),
    // sha3224: hash('sha3-224'),
    // sha3256: hash('sha3-256'),
    // sha3384: hash('sha3-384'),
    // sha3512: hash('sha3-512'),
    // shake128: hash('shake-128'),
    // shake256: hash('shake-256'),
    // keccak224: hash('keccak-224'),
    // keccak256: hash('keccak-256'),
    // keccak384: hash('keccak-384'),
    // keccak512: hash('keccak-512'),
    // murmur3128: hash('murmur3-128'),
    // murmur332: hash('murmur3-32'),
    // addBlake: blake_1
  }
  Multihashing.functions = {
    // // identity
    // 0x00: crypto.identity,
    // // sha1
    // 0x11: crypto.sha1,
    // sha2-256
    0x12: crypto.sha2256,
    // sha2-512
    // 0x13: crypto.sha2512,
    // // sha3-512
    // 0x14: crypto.sha3512,
    // // sha3-384
    // 0x15: crypto.sha3384,
    // // sha3-256
    // 0x16: crypto.sha3256,
    // // sha3-224
    // 0x17: crypto.sha3224,
    // // shake-128
    // 0x18: crypto.shake128,
    // // shake-256
    // 0x19: crypto.shake256,
    // // keccak-224
    // 0x1A: crypto.keccak224,
    // // keccak-256
    // 0x1B: crypto.keccak256,
    // // keccak-384
    // 0x1C: crypto.keccak384,
    // // keccak-512
    // 0x1D: crypto.keccak512,
    // // murmur3-128
    // 0x22: crypto.murmur3128,
    // // murmur3-32
    // 0x23: crypto.murmur332,
    // dbl-sha2-256
    0x56: crypto.dblSha2256
  }

  Multihashing.validate = async (bytes, hash) => {
    const newHash = await Multihashing(bytes, multihash.decode(hash).name)

    return equals(hash, newHash)
  }

  const CIDUtil = {
    checkCIDComponents: function (other) {
      if (other == null) {
        return 'null values are not valid CIDs'
      }

      if (!(other.version === 0 || other.version === 1)) {
        return 'Invalid version, must be a number equal to 1 or 0'
      }

      if (typeof other.codec !== 'string') {
        return 'codec must be string'
      }

      if (other.version === 0) {
        if (other.codec !== 'dag-pb') {
          return "codec must be 'dag-pb' for CIDv0"
        }
        if (other.multibaseName !== 'base58btc') {
          return "multibaseName must be 'base58btc' for CIDv0"
        }
      }

      if (!(other.multihash instanceof Uint8Array)) {
        return 'multihash must be a Uint8Array'
      }

      try {
        var mh = multihash
        mh.mh_validate(other.multihash)
      } catch (err) {
        let errorMsg = err.message
        if (!errorMsg) { // Just in case mh.validate() throws an error with empty error message
          errorMsg = 'Multihash validation failed'
        }
        return errorMsg
      }
    }
  }

  function uint8ArrayToNumber(buf) {
    return parseInt(uint8ArrayToString(buf, 'base16'), 16)
  }

  function varintUint8ArrayEncode(input) {
    return Uint8Array.from(encode_2(uint8ArrayToNumber(input)))
  }

  const baseTable = Object.freeze({
    'identity': 0x00,
    'cidv1': 0x01,
    'cidv2': 0x02,
    'cidv3': 0x03,
    'ip4': 0x04,
    'tcp': 0x06,
    'sha1': 0x11,
    'sha2-256': 0x12,
    'sha2-512': 0x13,
    'sha3-512': 0x14,
    'sha3-384': 0x15,
    'sha3-256': 0x16,
    'sha3-224': 0x17,
    'shake-128': 0x18,
    'shake-256': 0x19,
    'keccak-224': 0x1a,
    'keccak-256': 0x1b,
    'keccak-384': 0x1c,
    'keccak-512': 0x1d,
    'blake3': 0x1e,
    'dccp': 0x21,
    'murmur3-128': 0x22,
    'murmur3-32': 0x23,
    'ip6': 0x29,
    'ip6zone': 0x2a,
    'path': 0x2f,
    'multicodec': 0x30,
    'multihash': 0x31,
    'multiaddr': 0x32,
    'multibase': 0x33,
    'dns': 0x35,
    'dns4': 0x36,
    'dns6': 0x37,
    'dnsaddr': 0x38,
    'protobuf': 0x50,
    'cbor': 0x51,
    'raw': 0x55,
    'dbl-sha2-256': 0x56,
    'rlp': 0x60,
    'bencode': 0x63,
    'dag-pb': 0x70,
    'dag-cbor': 0x71,
    'libp2p-key': 0x72,
    'git-raw': 0x78,
    'torrent-info': 0x7b,
    'torrent-file': 0x7c,
    'leofcoin-block': 0x81,
    'leofcoin-tx': 0x82,
    'leofcoin-pr': 0x83,
    'sctp': 0x84,
    'dag-jose': 0x85,
    'dag-cose': 0x86,
    'eth-block': 0x90,
    'eth-block-list': 0x91,
    'eth-tx-trie': 0x92,
    'eth-tx': 0x93,
    'eth-tx-receipt-trie': 0x94,
    'eth-tx-receipt': 0x95,
    'eth-state-trie': 0x96,
    'eth-account-snapshot': 0x97,
    'eth-storage-trie': 0x98,
    'eth-receipt-log-trie': 0x99,
    'eth-reciept-log': 0x9a,
    'bitcoin-block': 0xb0,
    'bitcoin-tx': 0xb1,
    'bitcoin-witness-commitment': 0xb2,
    'zcash-block': 0xc0,
    'zcash-tx': 0xc1,
    'caip-50': 0xca,
    'streamid': 0xce,
    'stellar-block': 0xd0,
    'stellar-tx': 0xd1,
    'md4': 0xd4,
    'md5': 0xd5,
    'bmt': 0xd6,
    'decred-block': 0xe0,
    'decred-tx': 0xe1,
    'ipld-ns': 0xe2,
    'ipfs-ns': 0xe3,
    'swarm-ns': 0xe4,
    'ipns-ns': 0xe5,
    'zeronet': 0xe6,
    'secp256k1-pub': 0xe7,
    'bls12_381-g1-pub': 0xea,
    'bls12_381-g2-pub': 0xeb,
    'x25519-pub': 0xec,
    'ed25519-pub': 0xed,
    'bls12_381-g1g2-pub': 0xee,
    'dash-block': 0xf0,
    'dash-tx': 0xf1,
    'swarm-manifest': 0xfa,
    'swarm-feed': 0xfb,
    'udp': 0x0111,
    'p2p-webrtc-star': 0x0113,
    'p2p-webrtc-direct': 0x0114,
    'p2p-stardust': 0x0115,
    'p2p-circuit': 0x0122,
    'dag-json': 0x0129,
    'udt': 0x012d,
    'utp': 0x012e,
    'unix': 0x0190,
    'thread': 0x0196,
    'p2p': 0x01a5,
    'ipfs': 0x01a5,
    'https': 0x01bb,
    'onion': 0x01bc,
    'onion3': 0x01bd,
    'garlic64': 0x01be,
    'garlic32': 0x01bf,
    'tls': 0x01c0,
    'noise': 0x01c6,
    'quic': 0x01cc,
    'ws': 0x01dd,
    'wss': 0x01de,
    'p2p-websocket-star': 0x01df,
    'http': 0x01e0,
    'swhid-1-snp': 0x01f0,
    'json': 0x0200,
    'messagepack': 0x0201,
    'libp2p-peer-record': 0x0301,
    'libp2p-relay-rsvp': 0x0302,
    'car-index-sorted': 0x0400,
    'sha2-256-trunc254-padded': 0x1012,
    'ripemd-128': 0x1052,
    'ripemd-160': 0x1053,
    'ripemd-256': 0x1054,
    'ripemd-320': 0x1055,
    'x11': 0x1100,
    'p256-pub': 0x1200,
    'p384-pub': 0x1201,
    'p521-pub': 0x1202,
    'ed448-pub': 0x1203,
    'x448-pub': 0x1204,
    'ed25519-priv': 0x1300,
    'secp256k1-priv': 0x1301,
    'x25519-priv': 0x1302,
    'kangarootwelve': 0x1d01,
    'sm3-256': 0x534d,
    'blake2b-8': 0xb201,
    'blake2b-16': 0xb202,
    'blake2b-24': 0xb203,
    'blake2b-32': 0xb204,
    'blake2b-40': 0xb205,
    'blake2b-48': 0xb206,
    'blake2b-56': 0xb207,
    'blake2b-64': 0xb208,
    'blake2b-72': 0xb209,
    'blake2b-80': 0xb20a,
    'blake2b-88': 0xb20b,
    'blake2b-96': 0xb20c,
    'blake2b-104': 0xb20d,
    'blake2b-112': 0xb20e,
    'blake2b-120': 0xb20f,
    'blake2b-128': 0xb210,
    'blake2b-136': 0xb211,
    'blake2b-144': 0xb212,
    'blake2b-152': 0xb213,
    'blake2b-160': 0xb214,
    'blake2b-168': 0xb215,
    'blake2b-176': 0xb216,
    'blake2b-184': 0xb217,
    'blake2b-192': 0xb218,
    'blake2b-200': 0xb219,
    'blake2b-208': 0xb21a,
    'blake2b-216': 0xb21b,
    'blake2b-224': 0xb21c,
    'blake2b-232': 0xb21d,
    'blake2b-240': 0xb21e,
    'blake2b-248': 0xb21f,
    'blake2b-256': 0xb220,
    'blake2b-264': 0xb221,
    'blake2b-272': 0xb222,
    'blake2b-280': 0xb223,
    'blake2b-288': 0xb224,
    'blake2b-296': 0xb225,
    'blake2b-304': 0xb226,
    'blake2b-312': 0xb227,
    'blake2b-320': 0xb228,
    'blake2b-328': 0xb229,
    'blake2b-336': 0xb22a,
    'blake2b-344': 0xb22b,
    'blake2b-352': 0xb22c,
    'blake2b-360': 0xb22d,
    'blake2b-368': 0xb22e,
    'blake2b-376': 0xb22f,
    'blake2b-384': 0xb230,
    'blake2b-392': 0xb231,
    'blake2b-400': 0xb232,
    'blake2b-408': 0xb233,
    'blake2b-416': 0xb234,
    'blake2b-424': 0xb235,
    'blake2b-432': 0xb236,
    'blake2b-440': 0xb237,
    'blake2b-448': 0xb238,
    'blake2b-456': 0xb239,
    'blake2b-464': 0xb23a,
    'blake2b-472': 0xb23b,
    'blake2b-480': 0xb23c,
    'blake2b-488': 0xb23d,
    'blake2b-496': 0xb23e,
    'blake2b-504': 0xb23f,
    'blake2b-512': 0xb240,
    'blake2s-8': 0xb241,
    'blake2s-16': 0xb242,
    'blake2s-24': 0xb243,
    'blake2s-32': 0xb244,
    'blake2s-40': 0xb245,
    'blake2s-48': 0xb246,
    'blake2s-56': 0xb247,
    'blake2s-64': 0xb248,
    'blake2s-72': 0xb249,
    'blake2s-80': 0xb24a,
    'blake2s-88': 0xb24b,
    'blake2s-96': 0xb24c,
    'blake2s-104': 0xb24d,
    'blake2s-112': 0xb24e,
    'blake2s-120': 0xb24f,
    'blake2s-128': 0xb250,
    'blake2s-136': 0xb251,
    'blake2s-144': 0xb252,
    'blake2s-152': 0xb253,
    'blake2s-160': 0xb254,
    'blake2s-168': 0xb255,
    'blake2s-176': 0xb256,
    'blake2s-184': 0xb257,
    'blake2s-192': 0xb258,
    'blake2s-200': 0xb259,
    'blake2s-208': 0xb25a,
    'blake2s-216': 0xb25b,
    'blake2s-224': 0xb25c,
    'blake2s-232': 0xb25d,
    'blake2s-240': 0xb25e,
    'blake2s-248': 0xb25f,
    'blake2s-256': 0xb260,
    'skein256-8': 0xb301,
    'skein256-16': 0xb302,
    'skein256-24': 0xb303,
    'skein256-32': 0xb304,
    'skein256-40': 0xb305,
    'skein256-48': 0xb306,
    'skein256-56': 0xb307,
    'skein256-64': 0xb308,
    'skein256-72': 0xb309,
    'skein256-80': 0xb30a,
    'skein256-88': 0xb30b,
    'skein256-96': 0xb30c,
    'skein256-104': 0xb30d,
    'skein256-112': 0xb30e,
    'skein256-120': 0xb30f,
    'skein256-128': 0xb310,
    'skein256-136': 0xb311,
    'skein256-144': 0xb312,
    'skein256-152': 0xb313,
    'skein256-160': 0xb314,
    'skein256-168': 0xb315,
    'skein256-176': 0xb316,
    'skein256-184': 0xb317,
    'skein256-192': 0xb318,
    'skein256-200': 0xb319,
    'skein256-208': 0xb31a,
    'skein256-216': 0xb31b,
    'skein256-224': 0xb31c,
    'skein256-232': 0xb31d,
    'skein256-240': 0xb31e,
    'skein256-248': 0xb31f,
    'skein256-256': 0xb320,
    'skein512-8': 0xb321,
    'skein512-16': 0xb322,
    'skein512-24': 0xb323,
    'skein512-32': 0xb324,
    'skein512-40': 0xb325,
    'skein512-48': 0xb326,
    'skein512-56': 0xb327,
    'skein512-64': 0xb328,
    'skein512-72': 0xb329,
    'skein512-80': 0xb32a,
    'skein512-88': 0xb32b,
    'skein512-96': 0xb32c,
    'skein512-104': 0xb32d,
    'skein512-112': 0xb32e,
    'skein512-120': 0xb32f,
    'skein512-128': 0xb330,
    'skein512-136': 0xb331,
    'skein512-144': 0xb332,
    'skein512-152': 0xb333,
    'skein512-160': 0xb334,
    'skein512-168': 0xb335,
    'skein512-176': 0xb336,
    'skein512-184': 0xb337,
    'skein512-192': 0xb338,
    'skein512-200': 0xb339,
    'skein512-208': 0xb33a,
    'skein512-216': 0xb33b,
    'skein512-224': 0xb33c,
    'skein512-232': 0xb33d,
    'skein512-240': 0xb33e,
    'skein512-248': 0xb33f,
    'skein512-256': 0xb340,
    'skein512-264': 0xb341,
    'skein512-272': 0xb342,
    'skein512-280': 0xb343,
    'skein512-288': 0xb344,
    'skein512-296': 0xb345,
    'skein512-304': 0xb346,
    'skein512-312': 0xb347,
    'skein512-320': 0xb348,
    'skein512-328': 0xb349,
    'skein512-336': 0xb34a,
    'skein512-344': 0xb34b,
    'skein512-352': 0xb34c,
    'skein512-360': 0xb34d,
    'skein512-368': 0xb34e,
    'skein512-376': 0xb34f,
    'skein512-384': 0xb350,
    'skein512-392': 0xb351,
    'skein512-400': 0xb352,
    'skein512-408': 0xb353,
    'skein512-416': 0xb354,
    'skein512-424': 0xb355,
    'skein512-432': 0xb356,
    'skein512-440': 0xb357,
    'skein512-448': 0xb358,
    'skein512-456': 0xb359,
    'skein512-464': 0xb35a,
    'skein512-472': 0xb35b,
    'skein512-480': 0xb35c,
    'skein512-488': 0xb35d,
    'skein512-496': 0xb35e,
    'skein512-504': 0xb35f,
    'skein512-512': 0xb360,
    'skein1024-8': 0xb361,
    'skein1024-16': 0xb362,
    'skein1024-24': 0xb363,
    'skein1024-32': 0xb364,
    'skein1024-40': 0xb365,
    'skein1024-48': 0xb366,
    'skein1024-56': 0xb367,
    'skein1024-64': 0xb368,
    'skein1024-72': 0xb369,
    'skein1024-80': 0xb36a,
    'skein1024-88': 0xb36b,
    'skein1024-96': 0xb36c,
    'skein1024-104': 0xb36d,
    'skein1024-112': 0xb36e,
    'skein1024-120': 0xb36f,
    'skein1024-128': 0xb370,
    'skein1024-136': 0xb371,
    'skein1024-144': 0xb372,
    'skein1024-152': 0xb373,
    'skein1024-160': 0xb374,
    'skein1024-168': 0xb375,
    'skein1024-176': 0xb376,
    'skein1024-184': 0xb377,
    'skein1024-192': 0xb378,
    'skein1024-200': 0xb379,
    'skein1024-208': 0xb37a,
    'skein1024-216': 0xb37b,
    'skein1024-224': 0xb37c,
    'skein1024-232': 0xb37d,
    'skein1024-240': 0xb37e,
    'skein1024-248': 0xb37f,
    'skein1024-256': 0xb380,
    'skein1024-264': 0xb381,
    'skein1024-272': 0xb382,
    'skein1024-280': 0xb383,
    'skein1024-288': 0xb384,
    'skein1024-296': 0xb385,
    'skein1024-304': 0xb386,
    'skein1024-312': 0xb387,
    'skein1024-320': 0xb388,
    'skein1024-328': 0xb389,
    'skein1024-336': 0xb38a,
    'skein1024-344': 0xb38b,
    'skein1024-352': 0xb38c,
    'skein1024-360': 0xb38d,
    'skein1024-368': 0xb38e,
    'skein1024-376': 0xb38f,
    'skein1024-384': 0xb390,
    'skein1024-392': 0xb391,
    'skein1024-400': 0xb392,
    'skein1024-408': 0xb393,
    'skein1024-416': 0xb394,
    'skein1024-424': 0xb395,
    'skein1024-432': 0xb396,
    'skein1024-440': 0xb397,
    'skein1024-448': 0xb398,
    'skein1024-456': 0xb399,
    'skein1024-464': 0xb39a,
    'skein1024-472': 0xb39b,
    'skein1024-480': 0xb39c,
    'skein1024-488': 0xb39d,
    'skein1024-496': 0xb39e,
    'skein1024-504': 0xb39f,
    'skein1024-512': 0xb3a0,
    'skein1024-520': 0xb3a1,
    'skein1024-528': 0xb3a2,
    'skein1024-536': 0xb3a3,
    'skein1024-544': 0xb3a4,
    'skein1024-552': 0xb3a5,
    'skein1024-560': 0xb3a6,
    'skein1024-568': 0xb3a7,
    'skein1024-576': 0xb3a8,
    'skein1024-584': 0xb3a9,
    'skein1024-592': 0xb3aa,
    'skein1024-600': 0xb3ab,
    'skein1024-608': 0xb3ac,
    'skein1024-616': 0xb3ad,
    'skein1024-624': 0xb3ae,
    'skein1024-632': 0xb3af,
    'skein1024-640': 0xb3b0,
    'skein1024-648': 0xb3b1,
    'skein1024-656': 0xb3b2,
    'skein1024-664': 0xb3b3,
    'skein1024-672': 0xb3b4,
    'skein1024-680': 0xb3b5,
    'skein1024-688': 0xb3b6,
    'skein1024-696': 0xb3b7,
    'skein1024-704': 0xb3b8,
    'skein1024-712': 0xb3b9,
    'skein1024-720': 0xb3ba,
    'skein1024-728': 0xb3bb,
    'skein1024-736': 0xb3bc,
    'skein1024-744': 0xb3bd,
    'skein1024-752': 0xb3be,
    'skein1024-760': 0xb3bf,
    'skein1024-768': 0xb3c0,
    'skein1024-776': 0xb3c1,
    'skein1024-784': 0xb3c2,
    'skein1024-792': 0xb3c3,
    'skein1024-800': 0xb3c4,
    'skein1024-808': 0xb3c5,
    'skein1024-816': 0xb3c6,
    'skein1024-824': 0xb3c7,
    'skein1024-832': 0xb3c8,
    'skein1024-840': 0xb3c9,
    'skein1024-848': 0xb3ca,
    'skein1024-856': 0xb3cb,
    'skein1024-864': 0xb3cc,
    'skein1024-872': 0xb3cd,
    'skein1024-880': 0xb3ce,
    'skein1024-888': 0xb3cf,
    'skein1024-896': 0xb3d0,
    'skein1024-904': 0xb3d1,
    'skein1024-912': 0xb3d2,
    'skein1024-920': 0xb3d3,
    'skein1024-928': 0xb3d4,
    'skein1024-936': 0xb3d5,
    'skein1024-944': 0xb3d6,
    'skein1024-952': 0xb3d7,
    'skein1024-960': 0xb3d8,
    'skein1024-968': 0xb3d9,
    'skein1024-976': 0xb3da,
    'skein1024-984': 0xb3db,
    'skein1024-992': 0xb3dc,
    'skein1024-1000': 0xb3dd,
    'skein1024-1008': 0xb3de,
    'skein1024-1016': 0xb3df,
    'skein1024-1024': 0xb3e0,
    'poseidon-bls12_381-a2-fc1': 0xb401,
    'poseidon-bls12_381-a2-fc1-sc': 0xb402,
    'zeroxcert-imprint-256': 0xce11,
    'fil-commitment-unsealed': 0xf101,
    'fil-commitment-sealed': 0xf102,
    'holochain-adr-v0': 0x807124,
    'holochain-adr-v1': 0x817124,
    'holochain-key-v0': 0x947124,
    'holochain-key-v1': 0x957124,
    'holochain-sig-v0': 0xa27124,
    'holochain-sig-v1': 0xa37124,
    'skynet-ns': 0xb19910,
    'arweave-ns': 0xb29910
  })

  function varintEncode(num) {
    return Uint8Array.from(encode_2(num))
  }

  const nameToVarint = /** @type {NameUint8ArrayMap} */ ({})
  const constantToCode = /** @type {ConstantCodeMap} */({})
  const codeToName = /** @type {CodeNameMap} */({})

  function getVarintFromName(name) {
    const code = nameToVarint[name]
    if (code === undefined) {
      throw new Error(`Codec "${name}" not found`)
    }
    return code
  }
  for (const name in baseTable) {
    const codecName = /** @type {CodecName} */(name)
    const code = baseTable[codecName]
    nameToVarint[codecName] = varintEncode(code)

    const constant = /** @type {CodecConstant} */(codecName.toUpperCase().replace(/-/g, '_'))
    constantToCode[constant] = code

    if (!codeToName[code]) {
      codeToName[code] = codecName
    }
  }

  Object.freeze(nameToVarint)
  Object.freeze(constantToCode)
  Object.freeze(codeToName)

  const multicodec = {
    addPrefix: function addPrefix(multicodecStrOrCode, data) {
      let prefix

      if (multicodecStrOrCode instanceof Uint8Array) {
        prefix = varintUint8ArrayEncode(multicodecStrOrCode)
      } else {
        if (nameToVarint[multicodecStrOrCode]) {
          prefix = nameToVarint[multicodecStrOrCode]
        } else {
          throw new Error('multicodec not recognized')
        }
      }

      return uint8ArrayConcat([prefix, data], prefix.length + data.length)
    },
    rmPrefix: function rmPrefix(data) {
      varint.decode(/** @type {Buffer} */(data))
      return data.slice(varint.decode.bytes)
    },
    getCodeVarint: function getCodeVarint(name) {
      return getVarintFromName(name)
    },
  }

  function allocUnsafe(size = 0) {
    if (globalThis.Buffer != null && globalThis.Buffer.allocUnsafe != null) {
      return globalThis.Buffer.allocUnsafe(size);
    }
    return new Uint8Array(size);
  }

  function uint8ArrayConcat(arrays, length) {
    if (!length) {
      length = arrays.reduce((acc, curr) => acc + curr.length, 0);
    }
    const output = allocUnsafe(length);
    let offset = 0;
    for (const arr of arrays) {
      output.set(arr, offset);
      offset += arr.length;
    }
    return output;
  }

  function multibase_encode(nameOrCode, buf) {
    const enc = encoding(nameOrCode)
    const data = encodeText(enc.encode(buf))

    return concat([enc.codeBuf, data], enc.codeBuf.length + data.length)
  }

  class CID_1 {
    constructor(version, codec, multihash, multibaseName) {
      this.version
      this.codec
      this.multihash

      Object.defineProperty(this, symbol, { value: true })
      if (CID_1.isCID(version)) {
        const cid = /** @type {CID_1} */(version)
        this.version = cid.version
        this.codec = cid.codec
        this.multihash = cid.multihash
        this.multibaseName = cid.multibaseName || (cid.version === 0 ? 'base58btc' : 'base32')
        return
      }

      if (typeof version === 'string') {
        // e.g. 'base32' or false
        const baseName = multibase.isEncoded(version)
        if (baseName) {
          // version is a CID String encoded with multibase, so v1
          const cid = multibase.decode(version)
          this.version = /** @type {CIDVersion} */(parseInt(cid[0].toString(), 16))
          this.codec = multicodec.getCodec(cid.slice(1))
          this.multihash = multicodec.rmPrefix(cid.slice(1))
          this.multibaseName = baseName
        } else {
          // version is a base58btc string multihash, so v0
          this.version = 0
          this.codec = 'dag-pb'
          this.multihash = mh.fromB58String(version)
          this.multibaseName = 'base58btc'
        }
        CID_1.validateCID(this)
        Object.defineProperty(this, 'string', { value: version })
        return
      }

      if (version instanceof Uint8Array) {
        const v = parseInt(version[0].toString(), 16)
        if (v === 1) {
          // version is a CID Uint8Array
          const cid = version
          this.version = v
          this.codec = multicodec.getCodec(cid.slice(1))
          this.multihash = multicodec.rmPrefix(cid.slice(1))
          this.multibaseName = 'base32'
        } else {
          // version is a raw multihash Uint8Array, so v0
          this.version = 0
          this.codec = 'dag-pb'
          this.multihash = version
          this.multibaseName = 'base58btc'
        }
        CID_1.validateCID(this)
        return
      }

      // otherwise, assemble the CID from the parameters

      this.version = version

      if (typeof codec === 'number') {
        codec = codecInts[codec]
      }

      this.codec = /** @type {CodecName} */ (codec)
      this.multihash = /** @type {Uint8Array} */ (multihash)
      this.multibaseName = multibaseName || (version === 0 ? 'base58btc' : 'base32')

      CID_1.validateCID(this)
    }

    get bytes() {
      let bytes = this._bytes

      if (!bytes) {
        if (this.version === 0) {
          bytes = this.multihash
        } else if (this.version === 1) {
          const codec = multicodec.getCodeVarint(this.codec)
          bytes = uint8ArrayConcat([
            [1], codec, this.multihash
          ], 1 + codec.byteLength + this.multihash.byteLength)
        } else {
          throw new Error('unsupported version')
        }
        Object.defineProperty(this, '_bytes', { value: bytes })
      }

      return bytes
    }

    get prefix() {
      const codec = multicodec.getCodeVarint(this.codec)
      const multihash = mh.prefix(this.multihash)
      const prefix = uint8ArrayConcat([
        [this.version], codec, multihash
      ], 1 + codec.byteLength + multihash.byteLength)

      return prefix
    }

    get code() {
      return codecs[this.codec]
    }

    toV0() {
      if (this.codec !== 'dag-pb') {
        throw new Error('Cannot convert a non dag-pb CID to CIDv0')
      }

      const { name, length } = mh.decode(this.multihash)

      if (name !== 'sha2-256') {
        throw new Error('Cannot convert non sha2-256 multihash CID to CIDv0')
      }

      if (length !== 32) {
        throw new Error('Cannot convert non 32 byte multihash CID to CIDv0')
      }

      return new CID_1(0, this.codec, this.multihash)
    }

    toV1() {
      return new CID_1(1, this.codec, this.multihash, this.multibaseName)
    }

    toBaseEncodedString(base = this.multibaseName) {
      if (this.string && this.string.length !== 0 && base === this.multibaseName) {
        return this.string
      }
      let str
      if (this.version === 0) {
        if (base !== 'base58btc') {
          throw new Error('not supported with CIDv0, to support different bases, please migrate the instance do CIDv1, you can do that through cid.toV1()')
        }
        str = multihash.mh_toB58String(this.multihash)
      } else if (this.version === 1) {
        str = uint8ArrayToString(multibase_encode(base, this.bytes))
      } else {
        throw new Error('unsupported version')
      }
      if (base === this.multibaseName) {
        // cache the string value
        Object.defineProperty(this, 'string', { value: str })
      }
      return str
    }

    [Symbol.for('nodejs.util.inspect.custom')]() {
      return 'CID_1(' + this.toString() + ')'
    }

    toString(base) {
      return this.toBaseEncodedString(base)
    }

    toJSON() {
      return {
        codec: this.codec,
        version: this.version,
        hash: this.multihash
      }
    }

    equals(other) {
      return this.codec === other.codec &&
        this.version === other.version &&
        uint8ArrayEquals(this.multihash, other.multihash)
    }

    static validateCID(other) {
      const errorMsg = CIDUtil.checkCIDComponents(other)
      if (errorMsg) {
        throw new Error(errorMsg)
      }
    }

    static isCID(value) {
      return value instanceof CID_1 || Boolean(value && value[symbol])
    }
  }

  const persist = async (buffer, block, options) => {
    if (!options.codec) {
      options.codec = 'dag-pb'
    }

    if (!options.cidVersion) {
      options.cidVersion = 0
    }

    if (!options.hashAlg) {
      options.hashAlg = 'sha2-256'
    }

    if (options.hashAlg !== 'sha2-256') {
      options.cidVersion = 1
    }

    const multihash = await Multihashing(buffer, options.hashAlg) // buffer is [Uint8Array]
    const cid = new CID_1(options.cidVersion, options.codec, multihash)

    if (!options.onlyHash) {
      await block.put(buffer, {
        pin: options.pin,
        preload: options.preload,
        timeout: options.timeout,
        cid
      })
    }

    return cid
  }
  function exec(arr, comp) {
    if (typeof (comp) !== 'function') {
      comp = function (a, b) {
        return String(a).localeCompare(b)
      };
    }
    var len = arr.length;
    if (len <= 1) {
      return arr
    }
    var buffer = new Array(len);
    for (var chk = 1; chk < len; chk *= 2) {
      pass(arr, comp, chk, buffer);

      var tmp = arr;
      arr = buffer;
      buffer = tmp;
    }

    return arr
  }
  var pass = function (arr, comp, chk, result) {
    var len = arr.length;
    var i = 0;
    // Step size / double chunk size.
    var dbl = chk * 2;
    // Bounds of the left and right chunks.
    var l, r, e;
    // Iterators over the left and right chunk.
    var li, ri;

    // Iterate over pairs of chunks.
    for (l = 0; l < len; l += dbl) {
      r = l + chk;
      e = r + chk;
      if (r > len) r = len;
      if (e > len) e = len;

      // Iterate both chunks in parallel.
      li = l;
      ri = r;
      while (true) {
        // Compare the chunks.
        if (li < r && ri < e) {
          // This works for a regular `sort()` compatible comparator,
          // but also for a simple comparator like: `a > b`
          if (comp(arr[li], arr[ri]) <= 0) {
            result[i++] = arr[li++];
          }
          else {
            result[i++] = arr[ri++];
          }
        }
        // Nothing to compare, just flush what's left.
        else if (li < r) {
          result[i++] = arr[li++];
        }
        else if (ri < e) {
          result[i++] = arr[ri++];
        }
        // Both iterators are at the chunk ends.
        else {
          break
        }
      }
    }
  };
  const sortLinks = (links) => {
    const sort = stable;
    sort.inplace(links, linkSort)
  }
  function uint8ArrayCompare(a, b) {
    for (let i = 0; i < a.byteLength; i++) {
      if (a[i] < b[i]) {
        return -1
      }

      if (a[i] > b[i]) {
        return 1
      }
    }

    if (a.byteLength > b.byteLength) {
      return 1
    }

    if (a.byteLength < b.byteLength) {
      return -1
    }

    return 0
  }
  const linkSort = (a, b) => {
    const buf1 = a.nameAsBuffer
    const buf2 = b.nameAsBuffer

    return uint8ArrayCompare(buf1, buf2)
  }
  var stable = function (arr, comp) {
    return exec(arr.slice(), comp)
  };
  stable.inplace = function (arr, comp) {
    var result = exec(arr, comp);

    // This simply copies back if the result isn't in the original array,
    // which happens on an odd number of passes.
    if (result !== arr) {
      pass(result, null, arr.length, arr);
    }

    return arr
  };

  function uint8ArrayFromString(string, encoding = 'utf8') {
    const base = bases[encoding]

    if (!base) {
      throw new Error(`Unsupported encoding "${encoding}"`)
    }

    // add multibase prefix
    return base.decoder.decode(`${base.prefix}${string}`)
  }

  class DAGLink {
    constructor(name, size, cid) {
      if (!cid) {
        throw new Error('A link requires a cid to point to')
      }
      this.Name = name || ''
      this.Tsize = size
      this.Hash = new CID_1(cid)

      Object.defineProperties(this, {
        _nameBuf: { value: null, writable: true, enumerable: false }
      })
    }

    toString() {
      return `DAGLink <${this.Hash.toBaseEncodedString()} - name: "${this.Name}", size: ${this.Tsize}>`
    }

    toJSON() {
      if (!this._json) {
        this._json = Object.freeze({
          name: this.Name,
          size: this.Tsize,
          cid: this.Hash.toBaseEncodedString()
        })
      }

      return Object.assign({}, this._json)
    }
    get nameAsBuffer() {
      if (this._nameBuf != null) {
        return this._nameBuf
      }

      this._nameBuf = uint8ArrayFromString(this.Name)
      return this._nameBuf
    }
  }
  class DAGNode {
    /**
     *@param {Uint8Array | string} [data]
     * @param {(DAGLink | DAGLinkLike)[]} links
     * @param {number | null} [serializedSize]
     */
    constructor(data, links = [], serializedSize = null) {
      if (!data) {
        data = new Uint8Array(0)
      }
      if (typeof data === 'string') {
        data = uint8ArrayFromString(data)
      }

      if (!(data instanceof Uint8Array)) {
        throw new Error('Passed \'data\' is not a Uint8Array or a String!')
      }

      if (serializedSize !== null && typeof serializedSize !== 'number') {
        throw new Error('Passed \'serializedSize\' must be a number!')
      }

      const sortedLinks = links.map((link) => {
        return link instanceof DAGLink
          ? link
          : createDagLinkFromB58EncodedHash(link)
      })
      sortLinks(sortedLinks)

      this.Data = data
      this.Links = sortedLinks

      Object.defineProperties(this, {
        _serializedSize: { value: serializedSize, writable: true, enumerable: false },
        _size: { value: null, writable: true, enumerable: false }
      })
    }

    toJSON() {
      if (!this._json) {
        this._json = Object.freeze({
          data: this.Data,
          links: this.Links.map((l) => l.toJSON()),
          size: this.size
        })
      }

      return Object.assign({}, this._json)
    }

    toString() {
      return `DAGNode <data: "${uint8ArrayToString(this.Data, 'base64urlpad')}", links: ${this.Links.length}, size: ${this.size}>`
    }

    _invalidateCached() {
      this._serializedSize = null
      this._size = null
    }

    /**
     * @param {DAGLink | import('../types').DAGLinkLike} link
     */
    addLink(link) {
      this._invalidateCached()
      return addLink(this, link)
    }

    /**
     * @param {DAGLink | string | CID} link
     */
    rmLink(link) {
      this._invalidateCached()
      return rmLink(this, link)
    }

    /**
     * @param {import('./toDagLink').ToDagLinkOptions} [options]
     */
    toDAGLink(options) {
      return toDAGLink(this, options)
    }

    serialize() {
      const buf = serializeDAGNode(this)

      this._serializedSize = buf.length

      return buf
    }

    get size() {
      if (this._size == null) {
        let serializedSize

        if (serializedSize == null) {
          this._serializedSize = this.serialize().length
          serializedSize = this._serializedSize
        }

        this._size = this.Links.reduce((sum, l) => sum + l.Tsize, serializedSize)
      }

      return this._size
    }

    set size(size) {
      throw new Error("Can't set property: 'size' is immutable")
    }
  }
  const toProtoBuf = (node) => {
    const pbn = {}

    if (node.Data && node.Data.byteLength > 0) {
      pbn.Data = node.Data
    } else {
      // NOTE: this has to be null in order to match go-ipfs serialization
      // `null !== new Uint8Array(0)`
      pbn.Data = null
    }

    if (node.Links && node.Links.length > 0) {
      pbn.Links = node.Links
        .map((link) => ({
          Hash: link.Hash.bytes,
          Name: link.Name,
          Tsize: link.Tsize
        }))
    } else {
      pbn.Links = null
    }

    return pbn
  }
  const serializeDAGNode = (node) => {
    return encode(toProtoBuf(node))
  }
  Writer.prototype.bytes = function write_bytes(value) {
    var len = value.length >>> 0;
    if (!len)
      return this._push(writeByte, 1, 0);
    if (util_isString(value)) {
      var buf = Writer.alloc(len = base64.length(value));
      base64.decode(value, buf, 0);
      value = buf;
    }
    return this.uint32(len)._push(writeBytes, len, value);
  };
  function utf8_length(string) {
    var len = 0,
      c = 0;
    for (var i = 0; i < string.length; ++i) {
      c = string.charCodeAt(i);
      if (c < 128)
        len += 1;
      else if (c < 2048)
        len += 2;
      else if ((c & 0xFC00) === 0xD800 && (string.charCodeAt(i + 1) & 0xFC00) === 0xDC00) {
        ++i;
        len += 4;
      } else
        len += 3;
    }
    return len;
  };
  Writer.prototype.string = function write_string(value) {
    var len = utf8_length(value);
    return len
      ? this.uint32(len)._push(utf8.write, len, value)
      : this._push(writeByte, 1, 0);
  };
  function PBLink(p) {
    if (p)
      for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
        if (p[ks[i]] != null)
          this[ks[i]] = p[ks[i]];
  }
  PBLink.encode = function encode(m, w) {
    if (!w)
      w = $Writer.create();
    if (m.Hash != null && Object.hasOwnProperty.call(m, "Hash"))
      w.uint32(10).bytes(m.Hash);
    if (m.Name != null && Object.hasOwnProperty.call(m, "Name"))
      w.uint32(18).string(m.Name);
    if (m.Tsize != null && Object.hasOwnProperty.call(m, "Tsize"))
      w.uint32(24).uint64(m.Tsize);
    return w;
  };

  Writer.prototype.uint32 = function write_uint32(value) {
    // here, the call to this.push has been inlined and a varint specific Op subclass is used.
    // uint32 is by far the most frequently used operation and benefits significantly from this.
    this.len += (this.tail = this.tail.next = new VarintOp(
      (value = value >>> 0)
        < 128 ? 1
        : value < 16384 ? 2
          : value < 2097152 ? 3
            : value < 268435456 ? 4
              : 5,
      value)).len;
    return this;
  };

  function State(writer) {
    this.head = writer.head;
    this.tail = writer.tail;
    this.len = writer.len;
    this.next = writer.states;
  }

  Writer.prototype.fork = function fork() {
    this.states = new State(this);
    this.head = this.tail = new Op(noop, 0, 0);
    this.len = 0;
    return this;
  };
  Writer.prototype.reset = function reset() {
    if (this.states) {
      this.head = this.states.head;
      this.tail = this.states.tail;
      this.len = this.states.len;
      this.states = this.states.next;
    } else {
      this.head = this.tail = new Op(noop, 0, 0);
      this.len = 0;
    }
    return this;
  };
  Writer.prototype.ldelim = function ldelim() {
    var head = this.head,
      tail = this.tail,
      len = this.len;
    this.reset().uint32(len);
    if (len) {
      this.tail.next = head.next; // skip noop
      this.tail = tail;
      this.len += len;
    }
    return this;
  };

  function encode(pbf) {
    const writer = Writer.create()

    if (pbf.Links != null) {
      for (let i = 0; i < pbf.Links.length; i++) {
        PBLink.encode(pbf.Links[i], writer.uint32(18).fork()).ldelim()
      }
    }

    if (pbf.Data != null) {
      writer.uint32(10).bytes(pbf.Data)
    }

    return writer.finish()
  }

  const dirBuilder = async (item, block, options) => {
    const unixfs = new UnixFS({
      type: 'directory',
      mtime: item.mtime,
      mode: item.mode
    })

    const buffer = new DAGNode(unixfs.marshal()).serialize()
    const cid = await persist(buffer, block, options)
    const path = item.path

    return {
      cid,
      path,
      unixfs,
      size: buffer.length
    }
  }

  async function reduceToParents(source, reduce, options) {
    const roots = []

    for await (const chunked of batch(source, options.maxChildrenPerNode)) {
      roots.push(await reduce(chunked))
    }

    if (roots.length > 1) {
      return reduceToParents(roots, reduce, options)
    }

    return roots[0]
  }

  const all = async (source) => {
    const arr = []

    for await (const entry of source) {
      arr.push(entry)
    }

    return arr
  }

  const dagBuilders = {
    flat: async function (source, reduce) {
      return reduce(await all(source))
    },
    balanced: function balanced(source, reduce, options) {
      return reduceToParents(source, reduce, options)
    },
    trickle: async function trickleStream(source, reduce, options) {
      const root = new Root(options.layerRepeat)
      let iteration = 0
      let maxDepth = 1

      /** @type {SubTree} */
      let subTree = root

      for await (const layer of batch(source, options.maxChildrenPerNode)) {
        if (subTree.isFull()) {
          if (subTree !== root) {
            root.addChild(await subTree.reduce(reduce))
          }

          if (iteration && iteration % options.layerRepeat === 0) {
            maxDepth++
          }

          subTree = new SubTree(maxDepth, options.layerRepeat, iteration)

          iteration++
        }

        subTree.append(layer)
      }

      if (subTree && subTree !== root) {
        root.addChild(await subTree.reduce(reduce))
      }

      return root.reduce(reduce)
    }
  }

  class SubTree {
    /**
     * @param {number} maxDepth
     * @param {number} layerRepeat
     * @param {number} [iteration=0]
     */
    constructor(maxDepth, layerRepeat, iteration = 0) {
      this.maxDepth = maxDepth
      this.layerRepeat = layerRepeat
      this.currentDepth = 1
      this.iteration = iteration

      /** @type {TrickleDagNode} */
      this.root = this.node = this.parent = {
        children: [],
        depth: this.currentDepth,
        maxDepth,
        maxChildren: (this.maxDepth - this.currentDepth) * this.layerRepeat
      }
    }

    isFull() {
      if (!this.root.data) {
        return false
      }

      if (this.currentDepth < this.maxDepth && this.node.maxChildren) {
        // can descend
        this._addNextNodeToParent(this.node)

        return false
      }

      // try to find new node from node.parent
      const distantRelative = this._findParent(this.node, this.currentDepth)

      if (distantRelative) {
        this._addNextNodeToParent(distantRelative)

        return false
      }

      return true
    }

    /**
     * @param {TrickleDagNode} parent
     */
    _addNextNodeToParent(parent) {
      this.parent = parent

      // find site for new node
      const nextNode = {
        children: [],
        depth: parent.depth + 1,
        parent,
        maxDepth: this.maxDepth,
        maxChildren: Math.floor(parent.children.length / this.layerRepeat) * this.layerRepeat
      }

      // @ts-ignore
      parent.children.push(nextNode)

      this.currentDepth = nextNode.depth
      this.node = nextNode
    }

    /**
     *
     * @param {InProgressImportResult[]} layer
     */
    append(layer) {
      this.node.data = layer
    }

    /**
     * @param {Reducer} reduce
     */
    reduce(reduce) {
      return this._reduce(this.root, reduce)
    }

    /**
     * @param {TrickleDagNode} node
     * @param {Reducer} reduce
     * @returns {Promise<InProgressImportResult>}
     */
    async _reduce(node, reduce) {
      /** @type {InProgressImportResult[]} */
      let children = []

      if (node.children.length) {
        children = await Promise.all(
          node.children
            // @ts-ignore
            .filter(child => child.data)
            // @ts-ignore
            .map(child => this._reduce(child, reduce))
        )
      }

      return reduce((node.data || []).concat(children))
    }

    /**
     * @param {TrickleDagNode} node
     * @param {number} depth
     * @returns {TrickleDagNode | undefined}
     */
    _findParent(node, depth) {
      const parent = node.parent

      if (!parent || parent.depth === 0) {
        return
      }

      if (parent.children.length === parent.maxChildren || !parent.maxChildren) {
        // this layer is full, may be able to traverse to a different branch
        return this._findParent(parent, depth)
      }

      return parent
    }
  }

  class Root extends SubTree {
    /**
     * @param {number} layerRepeat
     */
    constructor(layerRepeat) {
      super(0, layerRepeat)

      this.root.depth = 0
      this.currentDepth = 1
    }

    /**
     * @param {InProgressImportResult} child
     */
    addChild(child) {
      this.root.children.push(child)
    }

    /**
     * @param {Reducer} reduce
     */
    reduce(reduce) {
      return reduce((this.root.data || []).concat(this.root.children))
    }
  }

  function fileBuilder(file, block, options) {
    const dagBuilder = dagBuilders[options.strategy]

    if (!dagBuilder) {
      throw errCode(new Error(`Unknown importer build strategy name: ${options.strategy}`), 'ERR_BAD_STRATEGY')
    }
    return dagBuilder(buildFileBatch(file, block, options), reduce(file, block, options), options)
  }

  async function* bufferImporter1(file, block, options) {
    for await (let buffer of file.content) {
      yield async () => {
        options.progress(buffer.length, file.path)
        let unixfs

        /** @type {import('../../types/src').PersistOptions} */
        const opts = {
          codec: 'dag-pb',
          cidVersion: options.cidVersion,
          hashAlg: options.hashAlg,
          onlyHash: options.onlyHash
        }

        if (options.rawLeaves) {
          opts.codec = 'raw'
          opts.cidVersion = 1
        } else {
          unixfs = new UnixFS({
            type: options.leafType,
            data: buffer,
            mtime: file.mtime,
            mode: file.mode
          })

          buffer = new DAGNode(unixfs.marshal()).serialize()  // buffer is [Uint8Array]
        }
        return {
          cid: await persist(buffer, block, opts),
          unixfs,
          size: buffer.length
        }
      }
    }
  }

  async function* buildFileBatch(file, block, options) {
    let count = -1
    let previous
    let bufferImporter

    if (typeof options.bufferImporter === 'function') {
      bufferImporter = options.bufferImporter
    } else {
      bufferImporter = bufferImporter1
    }

    for await (const entry of parallelBatch(bufferImporter(file, block, options), options.blockWriteConcurrency)) {
      count++

      if (count === 0) {
        previous = entry
        continue
      } else if (count === 1 && previous) {
        yield previous
        previous = null
      }

      yield entry
    }

    if (previous) {
      previous.single = true
      yield previous
    }
  }

  const reduce = (file, block, options) => {
    /**
     * @type {Reducer}
     */
    async function reducer(leaves) {
      if (leaves.length === 1 && leaves[0].single && options.reduceSingleLeafToSelf) {
        const leaf = leaves[0]

        if (leaf.cid.codec === 'raw' && (file.mtime !== undefined || file.mode !== undefined)) {
          // only one leaf node which is a buffer - we have metadata so convert it into a
          // UnixFS entry otherwise we'll have nowhere to store the metadata
          let { data: buffer } = await block.get(leaf.cid, options)

          leaf.unixfs = new UnixFS({
            type: 'file',
            mtime: file.mtime,
            mode: file.mode,
            data: buffer
          })

          const multihash = mh.decode(leaf.cid.multihash)
          buffer = new DAGNode(leaf.unixfs.marshal()).serialize()

          leaf.cid = await persist(buffer, block, {
            ...options,
            codec: 'dag-pb',
            hashAlg: multihash.name,
            cidVersion: options.cidVersion
          })
          leaf.size = buffer.length
        }
        return {
          cid: leaf.cid,
          path: file.path,
          unixfs: leaf.unixfs,
          size: leaf.size
        }
      }

      // create a parent node and add all the leaves
      const f = new UnixFS({
        type: 'file',
        mtime: file.mtime,
        mode: file.mode
      })

      const links = leaves
        .filter(leaf => {
          if (leaf.cid.codec === 'raw' && leaf.size) {
            return true
          }

          if (leaf.unixfs && !leaf.unixfs.data && leaf.unixfs.fileSize()) {
            return true
          }

          return Boolean(leaf.unixfs && leaf.unixfs.data && leaf.unixfs.data.length)
        })
        .map((leaf) => {
          if (leaf.cid.codec === 'raw') {
            // node is a leaf buffer
            f.addBlockSize(leaf.size)

            return new DAGLink('', leaf.size, leaf.cid)
          }

          if (!leaf.unixfs || !leaf.unixfs.data) {
            // node is an intermediate node
            f.addBlockSize((leaf.unixfs && leaf.unixfs.fileSize()) || 0)
          } else {
            // node is a unixfs 'file' leaf node
            f.addBlockSize(leaf.unixfs.data.length)
          }

          return new DAGLink('', leaf.size, leaf.cid)
        })

      const node = new DAGNode(f.marshal(), links)
      const buffer = node.serialize()
      const cid = await persist(buffer, block, options)

      return {
        cid,
        path: file.path,
        unixfs: f,
        size: buffer.length + node.Links.reduce((acc, curr) => acc + curr.Tsize, 0)
      }
    }

    return reducer
  }

  function contentAsAsyncIterable(content) {
    try {
      if (content instanceof Uint8Array) {
        return (async function* () {
          yield content
        }())
      } else if (isIterable(content)) {
        return (async function* () {
          yield* content
        }())
      } else if (isAsyncIterable(content)) { // step 4
        return content
      }
    } catch {
      throw errCode(new Error('Content was invalid'), 'ERR_INVALID_CONTENT')
    }

    throw errCode(new Error('Content was invalid'), 'ERR_INVALID_CONTENT')
  }

  function isIterable(thing) {
    return Symbol.iterator in thing
  }

  function isAsyncIterable(thing) {
    return Symbol.asyncIterator in thing
  }

  const toPathComponents = (path = '') => {
    // split on / unless escaped with \
    return (path
      .trim()
      .match(/([^\\^/]|\\\/)+/g) || [])
      .filter(Boolean)
  }


  async function addToTree(elem, tree, options) {
    const pathElems = toPathComponents(elem.path || '')
    const lastIndex = pathElems.length - 1
    let parent = tree
    let currentPath = ''

    // no need to build tree, if parent = tree
    for (let i = 0; i < pathElems.length; i++) {
      const pathElem = pathElems[i]

      currentPath += `${currentPath ? '/' : ''}${pathElem}`

      const last = (i === lastIndex)
      parent.dirty = true
      parent.cid = undefined
      parent.size = undefined

      if (last) {
        await parent.put(pathElem, elem)
        tree = await flatToShard(null, parent, options.shardSplitThreshold, options)
      } else {
        let dir = await parent.get(pathElem)

        if (!dir || !(dir instanceof Dir)) {
          dir = new DirFlat({
            root: false,
            dir: true,
            parent: parent,
            parentKey: pathElem,
            path: currentPath,
            dirty: true,
            flat: true,
            mtime: dir && dir.unixfs && dir.unixfs.mtime,
            mode: dir && dir.unixfs && dir.unixfs.mode
          }, options)
        }

        await parent.put(pathElem, dir)

        parent = dir
      }
    }
    return tree
  }

  /**
   * @param {Dir | InProgressImportResult} tree
   * @param {BlockAPI} block
   */
  async function* flushAndYield(tree, block) {
    if (!(tree instanceof Dir)) {
      if (tree && tree.unixfs && tree.unixfs.isDirectory()) {
        yield tree
      }

      return
    }

    yield* tree.flush(block)
  }

  async function* treeBuilder1(source, block, options) {
    /** @type {Dir} */
    let tree = new DirFlat({
      root: true,
      dir: true,
      path: '',
      dirty: true,
      flat: true
    }, options)

    for await (const entry of source) {
      if (!entry) {
        continue
      }

      tree = await addToTree(entry, tree, options)

      if (!entry.unixfs || !entry.unixfs.isDirectory()) {
        yield entry
      }
    }

    if (options.wrapWithDirectory) {
      yield* flushAndYield(tree, block)
    } else {
      for await (const unwrapped of tree.eachChildSeries()) {
        if (!unwrapped) {
          continue
        }

        yield* flushAndYield(unwrapped.child, block)
      }
    }
  }

  async function* batch(source, size = 1) {
    let things = []

    if (size < 1) {
      size = 1
    }

    for await (const thing of source) {
      things.push(thing)

      while (things.length >= size) {
        yield things.slice(0, size)

        things = things.slice(size)
      }
    }

    while (things.length) {
      yield things.slice(0, size)

      things = things.slice(size)
    }
  }


  async function* parallelBatch(source, size = 1) {
    for await (const tasks of batch(source, size)) {
      /** @type {Promise<Success<T>|Failure>[]} */
      const things = tasks.map(
        /**
         * @param {() => Promise<T>} p
         */
        p => {
          return p().then(value => ({ ok: true, value }), err => ({ ok: false, err }))
        })

      for (let i = 0; i < things.length; i++) {
        const result = await things[i]
        if (result.ok) {
          yield result.value
        } else {
          throw result.err  // always go here
        }
      }
    }
  }
  class Dir {
    constructor(props, options) {
      this.options = options || {}

      this.root = props.root
      this.dir = props.dir
      this.path = props.path
      this.dirty = props.dirty
      this.flat = props.flat
      this.parent = props.parent
      this.parentKey = props.parentKey
      this.unixfs = props.unixfs
      this.mode = props.mode
      this.mtime = props.mtime

      this.cid = undefined
      this.size = undefined
    }

    async put(name, value) { }
    get(name) {
      return Promise.resolve(this)
    }
    async * eachChildSeries() { }
    async * flush(block) { }
  }
  class DirFlat extends Dir {
    /**
     * @param {DirProps} props
     * @param {ImporterOptions} options
     */
    constructor(props, options) {
      super(props, options)

      /** @type {{ [key: string]: InProgressImportResult | Dir }} */
      this._children = {}
    }

    /**
     * @param {string} name
     * @param {InProgressImportResult | Dir} value
     */
    async put(name, value) {
      this.cid = undefined
      this.size = undefined

      this._children[name] = value
    }

    /**
     * @param {string} name
     */
    get(name) {
      return Promise.resolve(this._children[name])
    }

    childCount() {
      return Object.keys(this._children).length
    }

    directChildrenCount() {
      return this.childCount()
    }

    onlyChild() {
      return this._children[Object.keys(this._children)[0]]
    }

    async * eachChildSeries() {
      const keys = Object.keys(this._children)

      for (let i = 0; i < keys.length; i++) {
        const key = keys[i]

        yield {
          key: key,
          child: this._children[key]
        }
      }
    }

    /**
     * @param {BlockAPI} block
     * @returns {AsyncIterable<ImportResult>}
     */
    async * flush(block) {
      const children = Object.keys(this._children)
      const links = []

      for (let i = 0; i < children.length; i++) {
        let child = this._children[children[i]]

        if (child instanceof Dir) {
          for await (const entry of child.flush(block)) {
            child = entry

            yield child
          }
        }

        if (child.size != null && child.cid) {
          links.push(new DAGLink(children[i], child.size, child.cid))
        }
      }

      const unixfs = new UnixFS({
        type: 'directory',
        mtime: this.mtime,
        mode: this.mode
      })

      const node = new DAGNode(unixfs.marshal(), links)
      const buffer = node.serialize()
      const cid = await persist(buffer, block, this.options)
      const size = buffer.length + node.Links.reduce(
        /**
         * @param {number} acc
         * @param {DAGLink} curr
         */
        (acc, curr) => acc + curr.Tsize,
        0)

      this.cid = cid
      this.size = size

      yield {
        cid,
        unixfs,
        path: this.path,
        size
      }
    }
  }

  const defaultOptions = {
    chunker: 'fixed',
    strategy: 'balanced', // 'flat', 'trickle'
    rawLeaves: false,
    onlyHash: false,
    reduceSingleLeafToSelf: true,
    hashAlg: 'sha2-256',
    leafType: 'file', // 'raw'
    cidVersion: 0,
    progress: () => () => { },
    shardSplitThreshold: 1000,
    fileImportConcurrency: 50,
    blockWriteConcurrency: 10,
    minChunkSize: 262144,
    maxChunkSize: 262144,
    avgChunkSize: 262144,
    window: 16,
    // FIXME: This number is too big for JavaScript
    // https://github.com/ipfs/go-ipfs-chunker/blob/d0125832512163708c0804a3cda060e21acddae4/rabin.go#L11
    polynomial: 17437180132763653, // eslint-disable-line no-loss-of-precision
    maxChildrenPerNode: 174,
    layerRepeat: 4,
    wrapWithDirectory: false,
    pin: false,
    recursive: false,
    hidden: false,
    preload: false,
    timeout: undefined,
    hamtHashFn,
    hamtHashCode: 0x22,
    hamtBucketBits: 8
  }

  const isOptionObject = value => {
    if (Object.prototype.toString.call(value) !== '[object Object]') {
      return false;
    }

    const prototype = Object.getPrototypeOf(value);
    return prototype === null || prototype === Object.prototype;
  };

  const { hasOwnProperty } = Object.prototype;
  const { propertyIsEnumerable } = Object;
  const defineProperty = (object, name, value) => Object.defineProperty(object, name, {
    value,
    writable: true,
    enumerable: true,
    configurable: true
  });

  const globalThis = this;
  const defaultMergeOptions = {
    concatArrays: false,
    ignoreUndefined: false
  };

  const getEnumerableOwnPropertyKeys = value => {
    const keys = [];

    for (const key in value) {
      if (hasOwnProperty.call(value, key)) {
        keys.push(key);
      }
    }

    /* istanbul ignore else  */
    if (Object.getOwnPropertySymbols) {
      const symbols = Object.getOwnPropertySymbols(value);

      for (const symbol of symbols) {
        if (propertyIsEnumerable.call(value, symbol)) {
          keys.push(symbol);
        }
      }
    }

    return keys;
  };

  function clone(value) {
    if (Array.isArray(value)) {
      return cloneArray(value);
    }

    if (isOptionObject(value)) {
      return cloneOptionObject(value);
    }

    return value;
  }

  function cloneArray(array) {
    const result = array.slice(0, 0);

    getEnumerableOwnPropertyKeys(array).forEach(key => {
      defineProperty(result, key, clone(array[key]));
    });

    return result;
  }

  function cloneOptionObject(object) {
    const result = Object.getPrototypeOf(object) === null ? Object.create(null) : {};

    getEnumerableOwnPropertyKeys(object).forEach(key => {
      defineProperty(result, key, clone(object[key]));
    });

    return result;
  }

  const mergeKeys = (merged, source, keys, config) => {
    keys.forEach(key => {
      if (typeof source[key] === 'undefined' && config.ignoreUndefined) {
        return;
      }

      // Do not recurse into prototype chain of merged
      if (key in merged && merged[key] !== Object.getPrototypeOf(merged)) {
        defineProperty(merged, key, merge(merged[key], source[key], config));
      } else {
        defineProperty(merged, key, clone(source[key]));
      }
    });

    return merged;
  };

  const concatArrays = (merged, source, config) => {
    let result = merged.slice(0, 0);
    let resultIndex = 0;

    [merged, source].forEach(array => {
      const indices = [];

      // `result.concat(array)` with cloning
      for (let k = 0; k < array.length; k++) {
        if (!hasOwnProperty.call(array, k)) {
          continue;
        }

        indices.push(String(k));

        if (array === merged) {
          // Already cloned
          defineProperty(result, resultIndex++, array[k]);
        } else {
          defineProperty(result, resultIndex++, clone(array[k]));
        }
      }

      // Merge non-index keys
      result = mergeKeys(result, array, getEnumerableOwnPropertyKeys(array).filter(key => !indices.includes(key)), config);
    });

    return result;
  };

  function merge(merged, source, config) {
    if (config.concatArrays && Array.isArray(merged) && Array.isArray(source)) {
      return concatArrays(merged, source, config);
    }

    if (!isOptionObject(source) || !isOptionObject(merged)) {
      return clone(source);
    }

    return mergeKeys(merged, source, getEnumerableOwnPropertyKeys(source), config);
  }

  function merge_options(...options) {
    const config = merge(clone(defaultMergeOptions), (this !== globalThis && this) || {}, defaultMergeOptions);
    let merged = { _: {} };

    for (const option of options) {
      if (option === undefined) {
        continue;
      }

      if (!isOptionObject(option)) {
        throw new TypeError('`' + option + '` is not an Option Object');
      }

      merged = merge(merged, { _: option }, config);
    }

    return merged._;
  };

  const mergeOptions = merge_options.bind({ ignoreUndefined: true })
  
  async function* importer(source, block, options = {}) {
    const opts = mergeOptions(defaultOptions, options)

    let dagBuilder

    if (typeof options.dagBuilder === 'function') {
      dagBuilder = options.dagBuilder
    } else {
      dagBuilder = dagBuilder1 // step 2
    }

    let treeBuilder

    if (typeof options.treeBuilder === 'function') {
      treeBuilder = options.treeBuilder
    } else {
      treeBuilder = treeBuilder1 // step 3
    }

    /** @type {AsyncIterable<ImportCandidate> | Iterable<ImportCandidate>} */
    let candidates

    if (Symbol.asyncIterator in source || Symbol.iterator in source) {
      // @ts-ignore
      candidates = source // step 3
    } else {
      // @ts-ignore
      candidates = [source]
    }
    for await (const entry of treeBuilder(parallelBatch(dagBuilder(candidates, block, opts), opts.fileImportConcurrency), block, opts)) {
      // step 5
      yield {
        cid: entry.cid,
        path: entry.path,
        unixfs: entry.unixfs,
        size: entry.size
      }
    }
  }
  const block = {
    get: async cid => { throw new Error(`unexpected block API get for ${cid}`) },
    put: async () => { throw new Error('unexpected block API put') }
  }
  async function hashFile(content, version, options) {
    
    var options = options || {}
    options.onlyHash = true
    options.cidVersion = version
    
    if (typeof content === 'string') {
      content = new TextEncoder().encode(content)
    }

    let lastCid
    let lastSize;
    for await (const { cid,size } of importer([{ content }], block, options)) {
      lastCid = cid;
      lastSize = size;
    }
    return {cid: lastCid.toString(), size: lastSize}
  };
  // AMD
  // if (typeof define == 'function' && define.amd)
    define('@ijstech/ipfs-utils', function () { return { parse, hashItems, hashContent, hashFile, mergeOptions }; })
  // Node.js
  // else if (typeof module != 'undefined' && module.exports)
  //   module.exports = { parse, hashItems, hashContent, hashFile, mergeOptions }
  // // Browser
  // else {
  //   if (!globalObject)
  //     globalObject = typeof self != 'undefined' && self ? self : window;
  //   globalObject.IPFSUtils = { parse, hashItems, hashContent, hashFile, mergeOptions };
  // };
})(this);
define("@ijstech/components",(require, exports)=>{
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[Object.keys(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  __markAsModule(target);
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __reExport = (target, module2, desc) => {
  if (module2 && typeof module2 === "object" || typeof module2 === "function") {
    for (let key2 of __getOwnPropNames(module2))
      if (!__hasOwnProp.call(target, key2) && key2 !== "default")
        __defProp(target, key2, { get: () => module2[key2], enumerable: !(desc = __getOwnPropDesc(module2, key2)) || desc.enumerable });
  }
  return target;
};
var __toModule = (module2) => {
  return __reExport(__markAsModule(__defProp(module2 != null ? __create(__getProtoOf(module2)) : {}, "default", module2 && module2.__esModule && "default" in module2 ? { get: () => module2.default, enumerable: true } : { value: module2, enumerable: true })), module2);
};
var __decorateClass = (decorators, target, key2, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc(target, key2) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (kind ? decorator(target, key2, result) : decorator(result)) || result;
  if (kind && result)
    __defProp(target, key2, result);
  return result;
};

// node_modules/moment/moment.js
var require_moment = __commonJS({
  "node_modules/moment/moment.js"(exports, module2) {
    (function(global, factory) {
      typeof exports === "object" && typeof module2 !== "undefined" ? module2.exports = factory() : typeof define === "function" && define.amd ? define(factory) : global.moment = factory();
    })(exports, function() {
      "use strict";
      var hookCallback;
      function hooks() {
        return hookCallback.apply(null, arguments);
      }
      function setHookCallback(callback) {
        hookCallback = callback;
      }
      function isArray(input) {
        return input instanceof Array || Object.prototype.toString.call(input) === "[object Array]";
      }
      function isObject(input) {
        return input != null && Object.prototype.toString.call(input) === "[object Object]";
      }
      function hasOwnProp(a, b) {
        return Object.prototype.hasOwnProperty.call(a, b);
      }
      function isObjectEmpty(obj) {
        if (Object.getOwnPropertyNames) {
          return Object.getOwnPropertyNames(obj).length === 0;
        } else {
          var k;
          for (k in obj) {
            if (hasOwnProp(obj, k)) {
              return false;
            }
          }
          return true;
        }
      }
      function isUndefined(input) {
        return input === void 0;
      }
      function isNumber(input) {
        return typeof input === "number" || Object.prototype.toString.call(input) === "[object Number]";
      }
      function isDate(input) {
        return input instanceof Date || Object.prototype.toString.call(input) === "[object Date]";
      }
      function map(arr, fn) {
        var res = [], i, arrLen = arr.length;
        for (i = 0; i < arrLen; ++i) {
          res.push(fn(arr[i], i));
        }
        return res;
      }
      function extend2(a, b) {
        for (var i in b) {
          if (hasOwnProp(b, i)) {
            a[i] = b[i];
          }
        }
        if (hasOwnProp(b, "toString")) {
          a.toString = b.toString;
        }
        if (hasOwnProp(b, "valueOf")) {
          a.valueOf = b.valueOf;
        }
        return a;
      }
      function createUTC(input, format2, locale2, strict) {
        return createLocalOrUTC(input, format2, locale2, strict, true).utc();
      }
      function defaultParsingFlags() {
        return {
          empty: false,
          unusedTokens: [],
          unusedInput: [],
          overflow: -2,
          charsLeftOver: 0,
          nullInput: false,
          invalidEra: null,
          invalidMonth: null,
          invalidFormat: false,
          userInvalidated: false,
          iso: false,
          parsedDateParts: [],
          era: null,
          meridiem: null,
          rfc2822: false,
          weekdayMismatch: false
        };
      }
      function getParsingFlags(m) {
        if (m._pf == null) {
          m._pf = defaultParsingFlags();
        }
        return m._pf;
      }
      var some;
      if (Array.prototype.some) {
        some = Array.prototype.some;
      } else {
        some = function(fun) {
          var t = Object(this), len = t.length >>> 0, i;
          for (i = 0; i < len; i++) {
            if (i in t && fun.call(this, t[i], i, t)) {
              return true;
            }
          }
          return false;
        };
      }
      function isValid(m) {
        if (m._isValid == null) {
          var flags = getParsingFlags(m), parsedParts = some.call(flags.parsedDateParts, function(i) {
            return i != null;
          }), isNowValid = !isNaN(m._d.getTime()) && flags.overflow < 0 && !flags.empty && !flags.invalidEra && !flags.invalidMonth && !flags.invalidWeekday && !flags.weekdayMismatch && !flags.nullInput && !flags.invalidFormat && !flags.userInvalidated && (!flags.meridiem || flags.meridiem && parsedParts);
          if (m._strict) {
            isNowValid = isNowValid && flags.charsLeftOver === 0 && flags.unusedTokens.length === 0 && flags.bigHour === void 0;
          }
          if (Object.isFrozen == null || !Object.isFrozen(m)) {
            m._isValid = isNowValid;
          } else {
            return isNowValid;
          }
        }
        return m._isValid;
      }
      function createInvalid(flags) {
        var m = createUTC(NaN);
        if (flags != null) {
          extend2(getParsingFlags(m), flags);
        } else {
          getParsingFlags(m).userInvalidated = true;
        }
        return m;
      }
      var momentProperties = hooks.momentProperties = [], updateInProgress = false;
      function copyConfig(to2, from2) {
        var i, prop, val, momentPropertiesLen = momentProperties.length;
        if (!isUndefined(from2._isAMomentObject)) {
          to2._isAMomentObject = from2._isAMomentObject;
        }
        if (!isUndefined(from2._i)) {
          to2._i = from2._i;
        }
        if (!isUndefined(from2._f)) {
          to2._f = from2._f;
        }
        if (!isUndefined(from2._l)) {
          to2._l = from2._l;
        }
        if (!isUndefined(from2._strict)) {
          to2._strict = from2._strict;
        }
        if (!isUndefined(from2._tzm)) {
          to2._tzm = from2._tzm;
        }
        if (!isUndefined(from2._isUTC)) {
          to2._isUTC = from2._isUTC;
        }
        if (!isUndefined(from2._offset)) {
          to2._offset = from2._offset;
        }
        if (!isUndefined(from2._pf)) {
          to2._pf = getParsingFlags(from2);
        }
        if (!isUndefined(from2._locale)) {
          to2._locale = from2._locale;
        }
        if (momentPropertiesLen > 0) {
          for (i = 0; i < momentPropertiesLen; i++) {
            prop = momentProperties[i];
            val = from2[prop];
            if (!isUndefined(val)) {
              to2[prop] = val;
            }
          }
        }
        return to2;
      }
      function Moment2(config) {
        copyConfig(this, config);
        this._d = new Date(config._d != null ? config._d.getTime() : NaN);
        if (!this.isValid()) {
          this._d = new Date(NaN);
        }
        if (updateInProgress === false) {
          updateInProgress = true;
          hooks.updateOffset(this);
          updateInProgress = false;
        }
      }
      function isMoment(obj) {
        return obj instanceof Moment2 || obj != null && obj._isAMomentObject != null;
      }
      function warn(msg) {
        if (hooks.suppressDeprecationWarnings === false && typeof console !== "undefined" && console.warn) {
          console.warn("Deprecation warning: " + msg);
        }
      }
      function deprecate(msg, fn) {
        var firstTime = true;
        return extend2(function() {
          if (hooks.deprecationHandler != null) {
            hooks.deprecationHandler(null, msg);
          }
          if (firstTime) {
            var args = [], arg, i, key2, argLen = arguments.length;
            for (i = 0; i < argLen; i++) {
              arg = "";
              if (typeof arguments[i] === "object") {
                arg += "\n[" + i + "] ";
                for (key2 in arguments[0]) {
                  if (hasOwnProp(arguments[0], key2)) {
                    arg += key2 + ": " + arguments[0][key2] + ", ";
                  }
                }
                arg = arg.slice(0, -2);
              } else {
                arg = arguments[i];
              }
              args.push(arg);
            }
            warn(msg + "\nArguments: " + Array.prototype.slice.call(args).join("") + "\n" + new Error().stack);
            firstTime = false;
          }
          return fn.apply(this, arguments);
        }, fn);
      }
      var deprecations = {};
      function deprecateSimple(name, msg) {
        if (hooks.deprecationHandler != null) {
          hooks.deprecationHandler(name, msg);
        }
        if (!deprecations[name]) {
          warn(msg);
          deprecations[name] = true;
        }
      }
      hooks.suppressDeprecationWarnings = false;
      hooks.deprecationHandler = null;
      function isFunction(input) {
        return typeof Function !== "undefined" && input instanceof Function || Object.prototype.toString.call(input) === "[object Function]";
      }
      function set(config) {
        var prop, i;
        for (i in config) {
          if (hasOwnProp(config, i)) {
            prop = config[i];
            if (isFunction(prop)) {
              this[i] = prop;
            } else {
              this["_" + i] = prop;
            }
          }
        }
        this._config = config;
        this._dayOfMonthOrdinalParseLenient = new RegExp((this._dayOfMonthOrdinalParse.source || this._ordinalParse.source) + "|" + /\d{1,2}/.source);
      }
      function mergeConfigs(parentConfig, childConfig) {
        var res = extend2({}, parentConfig), prop;
        for (prop in childConfig) {
          if (hasOwnProp(childConfig, prop)) {
            if (isObject(parentConfig[prop]) && isObject(childConfig[prop])) {
              res[prop] = {};
              extend2(res[prop], parentConfig[prop]);
              extend2(res[prop], childConfig[prop]);
            } else if (childConfig[prop] != null) {
              res[prop] = childConfig[prop];
            } else {
              delete res[prop];
            }
          }
        }
        for (prop in parentConfig) {
          if (hasOwnProp(parentConfig, prop) && !hasOwnProp(childConfig, prop) && isObject(parentConfig[prop])) {
            res[prop] = extend2({}, res[prop]);
          }
        }
        return res;
      }
      function Locale(config) {
        if (config != null) {
          this.set(config);
        }
      }
      var keys;
      if (Object.keys) {
        keys = Object.keys;
      } else {
        keys = function(obj) {
          var i, res = [];
          for (i in obj) {
            if (hasOwnProp(obj, i)) {
              res.push(i);
            }
          }
          return res;
        };
      }
      var defaultCalendar = {
        sameDay: "[Today at] LT",
        nextDay: "[Tomorrow at] LT",
        nextWeek: "dddd [at] LT",
        lastDay: "[Yesterday at] LT",
        lastWeek: "[Last] dddd [at] LT",
        sameElse: "L"
      };
      function calendar(key2, mom, now2) {
        var output = this._calendar[key2] || this._calendar["sameElse"];
        return isFunction(output) ? output.call(mom, now2) : output;
      }
      function zeroFill(number, targetLength, forceSign) {
        var absNumber = "" + Math.abs(number), zerosToFill = targetLength - absNumber.length, sign2 = number >= 0;
        return (sign2 ? forceSign ? "+" : "" : "-") + Math.pow(10, Math.max(0, zerosToFill)).toString().substr(1) + absNumber;
      }
      var formattingTokens = /(\[[^\[]*\])|(\\)?([Hh]mm(ss)?|Mo|MM?M?M?|Do|DDDo|DD?D?D?|ddd?d?|do?|w[o|w]?|W[o|W]?|Qo?|N{1,5}|YYYYYY|YYYYY|YYYY|YY|y{2,4}|yo?|gg(ggg?)?|GG(GGG?)?|e|E|a|A|hh?|HH?|kk?|mm?|ss?|S{1,9}|x|X|zz?|ZZ?|.)/g, localFormattingTokens = /(\[[^\[]*\])|(\\)?(LTS|LT|LL?L?L?|l{1,4})/g, formatFunctions = {}, formatTokenFunctions = {};
      function addFormatToken(token2, padded, ordinal2, callback) {
        var func = callback;
        if (typeof callback === "string") {
          func = function() {
            return this[callback]();
          };
        }
        if (token2) {
          formatTokenFunctions[token2] = func;
        }
        if (padded) {
          formatTokenFunctions[padded[0]] = function() {
            return zeroFill(func.apply(this, arguments), padded[1], padded[2]);
          };
        }
        if (ordinal2) {
          formatTokenFunctions[ordinal2] = function() {
            return this.localeData().ordinal(func.apply(this, arguments), token2);
          };
        }
      }
      function removeFormattingTokens(input) {
        if (input.match(/\[[\s\S]/)) {
          return input.replace(/^\[|\]$/g, "");
        }
        return input.replace(/\\/g, "");
      }
      function makeFormatFunction(format2) {
        var array = format2.match(formattingTokens), i, length;
        for (i = 0, length = array.length; i < length; i++) {
          if (formatTokenFunctions[array[i]]) {
            array[i] = formatTokenFunctions[array[i]];
          } else {
            array[i] = removeFormattingTokens(array[i]);
          }
        }
        return function(mom) {
          var output = "", i2;
          for (i2 = 0; i2 < length; i2++) {
            output += isFunction(array[i2]) ? array[i2].call(mom, format2) : array[i2];
          }
          return output;
        };
      }
      function formatMoment(m, format2) {
        if (!m.isValid()) {
          return m.localeData().invalidDate();
        }
        format2 = expandFormat(format2, m.localeData());
        formatFunctions[format2] = formatFunctions[format2] || makeFormatFunction(format2);
        return formatFunctions[format2](m);
      }
      function expandFormat(format2, locale2) {
        var i = 5;
        function replaceLongDateFormatTokens(input) {
          return locale2.longDateFormat(input) || input;
        }
        localFormattingTokens.lastIndex = 0;
        while (i >= 0 && localFormattingTokens.test(format2)) {
          format2 = format2.replace(localFormattingTokens, replaceLongDateFormatTokens);
          localFormattingTokens.lastIndex = 0;
          i -= 1;
        }
        return format2;
      }
      var defaultLongDateFormat = {
        LTS: "h:mm:ss A",
        LT: "h:mm A",
        L: "MM/DD/YYYY",
        LL: "MMMM D, YYYY",
        LLL: "MMMM D, YYYY h:mm A",
        LLLL: "dddd, MMMM D, YYYY h:mm A"
      };
      function longDateFormat(key2) {
        var format2 = this._longDateFormat[key2], formatUpper = this._longDateFormat[key2.toUpperCase()];
        if (format2 || !formatUpper) {
          return format2;
        }
        this._longDateFormat[key2] = formatUpper.match(formattingTokens).map(function(tok) {
          if (tok === "MMMM" || tok === "MM" || tok === "DD" || tok === "dddd") {
            return tok.slice(1);
          }
          return tok;
        }).join("");
        return this._longDateFormat[key2];
      }
      var defaultInvalidDate = "Invalid date";
      function invalidDate() {
        return this._invalidDate;
      }
      var defaultOrdinal = "%d", defaultDayOfMonthOrdinalParse = /\d{1,2}/;
      function ordinal(number) {
        return this._ordinal.replace("%d", number);
      }
      var defaultRelativeTime = {
        future: "in %s",
        past: "%s ago",
        s: "a few seconds",
        ss: "%d seconds",
        m: "a minute",
        mm: "%d minutes",
        h: "an hour",
        hh: "%d hours",
        d: "a day",
        dd: "%d days",
        w: "a week",
        ww: "%d weeks",
        M: "a month",
        MM: "%d months",
        y: "a year",
        yy: "%d years"
      };
      function relativeTime(number, withoutSuffix, string, isFuture) {
        var output = this._relativeTime[string];
        return isFunction(output) ? output(number, withoutSuffix, string, isFuture) : output.replace(/%d/i, number);
      }
      function pastFuture(diff2, output) {
        var format2 = this._relativeTime[diff2 > 0 ? "future" : "past"];
        return isFunction(format2) ? format2(output) : format2.replace(/%s/i, output);
      }
      var aliases = {};
      function addUnitAlias(unit, shorthand) {
        var lowerCase = unit.toLowerCase();
        aliases[lowerCase] = aliases[lowerCase + "s"] = aliases[shorthand] = unit;
      }
      function normalizeUnits(units) {
        return typeof units === "string" ? aliases[units] || aliases[units.toLowerCase()] : void 0;
      }
      function normalizeObjectUnits(inputObject) {
        var normalizedInput = {}, normalizedProp, prop;
        for (prop in inputObject) {
          if (hasOwnProp(inputObject, prop)) {
            normalizedProp = normalizeUnits(prop);
            if (normalizedProp) {
              normalizedInput[normalizedProp] = inputObject[prop];
            }
          }
        }
        return normalizedInput;
      }
      var priorities = {};
      function addUnitPriority(unit, priority) {
        priorities[unit] = priority;
      }
      function getPrioritizedUnits(unitsObj) {
        var units = [], u;
        for (u in unitsObj) {
          if (hasOwnProp(unitsObj, u)) {
            units.push({ unit: u, priority: priorities[u] });
          }
        }
        units.sort(function(a, b) {
          return a.priority - b.priority;
        });
        return units;
      }
      function isLeapYear(year) {
        return year % 4 === 0 && year % 100 !== 0 || year % 400 === 0;
      }
      function absFloor(number) {
        if (number < 0) {
          return Math.ceil(number) || 0;
        } else {
          return Math.floor(number);
        }
      }
      function toInt(argumentForCoercion) {
        var coercedNumber = +argumentForCoercion, value = 0;
        if (coercedNumber !== 0 && isFinite(coercedNumber)) {
          value = absFloor(coercedNumber);
        }
        return value;
      }
      function makeGetSet(unit, keepTime) {
        return function(value) {
          if (value != null) {
            set$1(this, unit, value);
            hooks.updateOffset(this, keepTime);
            return this;
          } else {
            return get(this, unit);
          }
        };
      }
      function get(mom, unit) {
        return mom.isValid() ? mom._d["get" + (mom._isUTC ? "UTC" : "") + unit]() : NaN;
      }
      function set$1(mom, unit, value) {
        if (mom.isValid() && !isNaN(value)) {
          if (unit === "FullYear" && isLeapYear(mom.year()) && mom.month() === 1 && mom.date() === 29) {
            value = toInt(value);
            mom._d["set" + (mom._isUTC ? "UTC" : "") + unit](value, mom.month(), daysInMonth(value, mom.month()));
          } else {
            mom._d["set" + (mom._isUTC ? "UTC" : "") + unit](value);
          }
        }
      }
      function stringGet(units) {
        units = normalizeUnits(units);
        if (isFunction(this[units])) {
          return this[units]();
        }
        return this;
      }
      function stringSet(units, value) {
        if (typeof units === "object") {
          units = normalizeObjectUnits(units);
          var prioritized = getPrioritizedUnits(units), i, prioritizedLen = prioritized.length;
          for (i = 0; i < prioritizedLen; i++) {
            this[prioritized[i].unit](units[prioritized[i].unit]);
          }
        } else {
          units = normalizeUnits(units);
          if (isFunction(this[units])) {
            return this[units](value);
          }
        }
        return this;
      }
      var match1 = /\d/, match2 = /\d\d/, match3 = /\d{3}/, match4 = /\d{4}/, match6 = /[+-]?\d{6}/, match1to2 = /\d\d?/, match3to4 = /\d\d\d\d?/, match5to6 = /\d\d\d\d\d\d?/, match1to3 = /\d{1,3}/, match1to4 = /\d{1,4}/, match1to6 = /[+-]?\d{1,6}/, matchUnsigned = /\d+/, matchSigned = /[+-]?\d+/, matchOffset = /Z|[+-]\d\d:?\d\d/gi, matchShortOffset = /Z|[+-]\d\d(?::?\d\d)?/gi, matchTimestamp = /[+-]?\d+(\.\d{1,3})?/, matchWord = /[0-9]{0,256}['a-z\u00A0-\u05FF\u0700-\uD7FF\uF900-\uFDCF\uFDF0-\uFF07\uFF10-\uFFEF]{1,256}|[\u0600-\u06FF\/]{1,256}(\s*?[\u0600-\u06FF]{1,256}){1,2}/i, regexes;
      regexes = {};
      function addRegexToken(token2, regex, strictRegex) {
        regexes[token2] = isFunction(regex) ? regex : function(isStrict, localeData2) {
          return isStrict && strictRegex ? strictRegex : regex;
        };
      }
      function getParseRegexForToken(token2, config) {
        if (!hasOwnProp(regexes, token2)) {
          return new RegExp(unescapeFormat(token2));
        }
        return regexes[token2](config._strict, config._locale);
      }
      function unescapeFormat(s) {
        return regexEscape(s.replace("\\", "").replace(/\\(\[)|\\(\])|\[([^\]\[]*)\]|\\(.)/g, function(matched, p1, p2, p3, p4) {
          return p1 || p2 || p3 || p4;
        }));
      }
      function regexEscape(s) {
        return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
      }
      var tokens = {};
      function addParseToken(token2, callback) {
        var i, func = callback, tokenLen;
        if (typeof token2 === "string") {
          token2 = [token2];
        }
        if (isNumber(callback)) {
          func = function(input, array) {
            array[callback] = toInt(input);
          };
        }
        tokenLen = token2.length;
        for (i = 0; i < tokenLen; i++) {
          tokens[token2[i]] = func;
        }
      }
      function addWeekParseToken(token2, callback) {
        addParseToken(token2, function(input, array, config, token3) {
          config._w = config._w || {};
          callback(input, config._w, config, token3);
        });
      }
      function addTimeToArrayFromToken(token2, input, config) {
        if (input != null && hasOwnProp(tokens, token2)) {
          tokens[token2](input, config._a, config, token2);
        }
      }
      var YEAR = 0, MONTH = 1, DATE = 2, HOUR = 3, MINUTE = 4, SECOND = 5, MILLISECOND = 6, WEEK = 7, WEEKDAY = 8;
      function mod(n, x) {
        return (n % x + x) % x;
      }
      var indexOf;
      if (Array.prototype.indexOf) {
        indexOf = Array.prototype.indexOf;
      } else {
        indexOf = function(o) {
          var i;
          for (i = 0; i < this.length; ++i) {
            if (this[i] === o) {
              return i;
            }
          }
          return -1;
        };
      }
      function daysInMonth(year, month) {
        if (isNaN(year) || isNaN(month)) {
          return NaN;
        }
        var modMonth = mod(month, 12);
        year += (month - modMonth) / 12;
        return modMonth === 1 ? isLeapYear(year) ? 29 : 28 : 31 - modMonth % 7 % 2;
      }
      addFormatToken("M", ["MM", 2], "Mo", function() {
        return this.month() + 1;
      });
      addFormatToken("MMM", 0, 0, function(format2) {
        return this.localeData().monthsShort(this, format2);
      });
      addFormatToken("MMMM", 0, 0, function(format2) {
        return this.localeData().months(this, format2);
      });
      addUnitAlias("month", "M");
      addUnitPriority("month", 8);
      addRegexToken("M", match1to2);
      addRegexToken("MM", match1to2, match2);
      addRegexToken("MMM", function(isStrict, locale2) {
        return locale2.monthsShortRegex(isStrict);
      });
      addRegexToken("MMMM", function(isStrict, locale2) {
        return locale2.monthsRegex(isStrict);
      });
      addParseToken(["M", "MM"], function(input, array) {
        array[MONTH] = toInt(input) - 1;
      });
      addParseToken(["MMM", "MMMM"], function(input, array, config, token2) {
        var month = config._locale.monthsParse(input, token2, config._strict);
        if (month != null) {
          array[MONTH] = month;
        } else {
          getParsingFlags(config).invalidMonth = input;
        }
      });
      var defaultLocaleMonths = "January_February_March_April_May_June_July_August_September_October_November_December".split("_"), defaultLocaleMonthsShort = "Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec".split("_"), MONTHS_IN_FORMAT = /D[oD]?(\[[^\[\]]*\]|\s)+MMMM?/, defaultMonthsShortRegex = matchWord, defaultMonthsRegex = matchWord;
      function localeMonths(m, format2) {
        if (!m) {
          return isArray(this._months) ? this._months : this._months["standalone"];
        }
        return isArray(this._months) ? this._months[m.month()] : this._months[(this._months.isFormat || MONTHS_IN_FORMAT).test(format2) ? "format" : "standalone"][m.month()];
      }
      function localeMonthsShort(m, format2) {
        if (!m) {
          return isArray(this._monthsShort) ? this._monthsShort : this._monthsShort["standalone"];
        }
        return isArray(this._monthsShort) ? this._monthsShort[m.month()] : this._monthsShort[MONTHS_IN_FORMAT.test(format2) ? "format" : "standalone"][m.month()];
      }
      function handleStrictParse(monthName, format2, strict) {
        var i, ii, mom, llc = monthName.toLocaleLowerCase();
        if (!this._monthsParse) {
          this._monthsParse = [];
          this._longMonthsParse = [];
          this._shortMonthsParse = [];
          for (i = 0; i < 12; ++i) {
            mom = createUTC([2e3, i]);
            this._shortMonthsParse[i] = this.monthsShort(mom, "").toLocaleLowerCase();
            this._longMonthsParse[i] = this.months(mom, "").toLocaleLowerCase();
          }
        }
        if (strict) {
          if (format2 === "MMM") {
            ii = indexOf.call(this._shortMonthsParse, llc);
            return ii !== -1 ? ii : null;
          } else {
            ii = indexOf.call(this._longMonthsParse, llc);
            return ii !== -1 ? ii : null;
          }
        } else {
          if (format2 === "MMM") {
            ii = indexOf.call(this._shortMonthsParse, llc);
            if (ii !== -1) {
              return ii;
            }
            ii = indexOf.call(this._longMonthsParse, llc);
            return ii !== -1 ? ii : null;
          } else {
            ii = indexOf.call(this._longMonthsParse, llc);
            if (ii !== -1) {
              return ii;
            }
            ii = indexOf.call(this._shortMonthsParse, llc);
            return ii !== -1 ? ii : null;
          }
        }
      }
      function localeMonthsParse(monthName, format2, strict) {
        var i, mom, regex;
        if (this._monthsParseExact) {
          return handleStrictParse.call(this, monthName, format2, strict);
        }
        if (!this._monthsParse) {
          this._monthsParse = [];
          this._longMonthsParse = [];
          this._shortMonthsParse = [];
        }
        for (i = 0; i < 12; i++) {
          mom = createUTC([2e3, i]);
          if (strict && !this._longMonthsParse[i]) {
            this._longMonthsParse[i] = new RegExp("^" + this.months(mom, "").replace(".", "") + "$", "i");
            this._shortMonthsParse[i] = new RegExp("^" + this.monthsShort(mom, "").replace(".", "") + "$", "i");
          }
          if (!strict && !this._monthsParse[i]) {
            regex = "^" + this.months(mom, "") + "|^" + this.monthsShort(mom, "");
            this._monthsParse[i] = new RegExp(regex.replace(".", ""), "i");
          }
          if (strict && format2 === "MMMM" && this._longMonthsParse[i].test(monthName)) {
            return i;
          } else if (strict && format2 === "MMM" && this._shortMonthsParse[i].test(monthName)) {
            return i;
          } else if (!strict && this._monthsParse[i].test(monthName)) {
            return i;
          }
        }
      }
      function setMonth(mom, value) {
        var dayOfMonth;
        if (!mom.isValid()) {
          return mom;
        }
        if (typeof value === "string") {
          if (/^\d+$/.test(value)) {
            value = toInt(value);
          } else {
            value = mom.localeData().monthsParse(value);
            if (!isNumber(value)) {
              return mom;
            }
          }
        }
        dayOfMonth = Math.min(mom.date(), daysInMonth(mom.year(), value));
        mom._d["set" + (mom._isUTC ? "UTC" : "") + "Month"](value, dayOfMonth);
        return mom;
      }
      function getSetMonth(value) {
        if (value != null) {
          setMonth(this, value);
          hooks.updateOffset(this, true);
          return this;
        } else {
          return get(this, "Month");
        }
      }
      function getDaysInMonth() {
        return daysInMonth(this.year(), this.month());
      }
      function monthsShortRegex(isStrict) {
        if (this._monthsParseExact) {
          if (!hasOwnProp(this, "_monthsRegex")) {
            computeMonthsParse.call(this);
          }
          if (isStrict) {
            return this._monthsShortStrictRegex;
          } else {
            return this._monthsShortRegex;
          }
        } else {
          if (!hasOwnProp(this, "_monthsShortRegex")) {
            this._monthsShortRegex = defaultMonthsShortRegex;
          }
          return this._monthsShortStrictRegex && isStrict ? this._monthsShortStrictRegex : this._monthsShortRegex;
        }
      }
      function monthsRegex(isStrict) {
        if (this._monthsParseExact) {
          if (!hasOwnProp(this, "_monthsRegex")) {
            computeMonthsParse.call(this);
          }
          if (isStrict) {
            return this._monthsStrictRegex;
          } else {
            return this._monthsRegex;
          }
        } else {
          if (!hasOwnProp(this, "_monthsRegex")) {
            this._monthsRegex = defaultMonthsRegex;
          }
          return this._monthsStrictRegex && isStrict ? this._monthsStrictRegex : this._monthsRegex;
        }
      }
      function computeMonthsParse() {
        function cmpLenRev(a, b) {
          return b.length - a.length;
        }
        var shortPieces = [], longPieces = [], mixedPieces = [], i, mom;
        for (i = 0; i < 12; i++) {
          mom = createUTC([2e3, i]);
          shortPieces.push(this.monthsShort(mom, ""));
          longPieces.push(this.months(mom, ""));
          mixedPieces.push(this.months(mom, ""));
          mixedPieces.push(this.monthsShort(mom, ""));
        }
        shortPieces.sort(cmpLenRev);
        longPieces.sort(cmpLenRev);
        mixedPieces.sort(cmpLenRev);
        for (i = 0; i < 12; i++) {
          shortPieces[i] = regexEscape(shortPieces[i]);
          longPieces[i] = regexEscape(longPieces[i]);
        }
        for (i = 0; i < 24; i++) {
          mixedPieces[i] = regexEscape(mixedPieces[i]);
        }
        this._monthsRegex = new RegExp("^(" + mixedPieces.join("|") + ")", "i");
        this._monthsShortRegex = this._monthsRegex;
        this._monthsStrictRegex = new RegExp("^(" + longPieces.join("|") + ")", "i");
        this._monthsShortStrictRegex = new RegExp("^(" + shortPieces.join("|") + ")", "i");
      }
      addFormatToken("Y", 0, 0, function() {
        var y = this.year();
        return y <= 9999 ? zeroFill(y, 4) : "+" + y;
      });
      addFormatToken(0, ["YY", 2], 0, function() {
        return this.year() % 100;
      });
      addFormatToken(0, ["YYYY", 4], 0, "year");
      addFormatToken(0, ["YYYYY", 5], 0, "year");
      addFormatToken(0, ["YYYYYY", 6, true], 0, "year");
      addUnitAlias("year", "y");
      addUnitPriority("year", 1);
      addRegexToken("Y", matchSigned);
      addRegexToken("YY", match1to2, match2);
      addRegexToken("YYYY", match1to4, match4);
      addRegexToken("YYYYY", match1to6, match6);
      addRegexToken("YYYYYY", match1to6, match6);
      addParseToken(["YYYYY", "YYYYYY"], YEAR);
      addParseToken("YYYY", function(input, array) {
        array[YEAR] = input.length === 2 ? hooks.parseTwoDigitYear(input) : toInt(input);
      });
      addParseToken("YY", function(input, array) {
        array[YEAR] = hooks.parseTwoDigitYear(input);
      });
      addParseToken("Y", function(input, array) {
        array[YEAR] = parseInt(input, 10);
      });
      function daysInYear(year) {
        return isLeapYear(year) ? 366 : 365;
      }
      hooks.parseTwoDigitYear = function(input) {
        return toInt(input) + (toInt(input) > 68 ? 1900 : 2e3);
      };
      var getSetYear = makeGetSet("FullYear", true);
      function getIsLeapYear() {
        return isLeapYear(this.year());
      }
      function createDate(y, m, d, h, M, s, ms) {
        var date;
        if (y < 100 && y >= 0) {
          date = new Date(y + 400, m, d, h, M, s, ms);
          if (isFinite(date.getFullYear())) {
            date.setFullYear(y);
          }
        } else {
          date = new Date(y, m, d, h, M, s, ms);
        }
        return date;
      }
      function createUTCDate(y) {
        var date, args;
        if (y < 100 && y >= 0) {
          args = Array.prototype.slice.call(arguments);
          args[0] = y + 400;
          date = new Date(Date.UTC.apply(null, args));
          if (isFinite(date.getUTCFullYear())) {
            date.setUTCFullYear(y);
          }
        } else {
          date = new Date(Date.UTC.apply(null, arguments));
        }
        return date;
      }
      function firstWeekOffset(year, dow, doy) {
        var fwd = 7 + dow - doy, fwdlw = (7 + createUTCDate(year, 0, fwd).getUTCDay() - dow) % 7;
        return -fwdlw + fwd - 1;
      }
      function dayOfYearFromWeeks(year, week, weekday, dow, doy) {
        var localWeekday = (7 + weekday - dow) % 7, weekOffset = firstWeekOffset(year, dow, doy), dayOfYear = 1 + 7 * (week - 1) + localWeekday + weekOffset, resYear, resDayOfYear;
        if (dayOfYear <= 0) {
          resYear = year - 1;
          resDayOfYear = daysInYear(resYear) + dayOfYear;
        } else if (dayOfYear > daysInYear(year)) {
          resYear = year + 1;
          resDayOfYear = dayOfYear - daysInYear(year);
        } else {
          resYear = year;
          resDayOfYear = dayOfYear;
        }
        return {
          year: resYear,
          dayOfYear: resDayOfYear
        };
      }
      function weekOfYear(mom, dow, doy) {
        var weekOffset = firstWeekOffset(mom.year(), dow, doy), week = Math.floor((mom.dayOfYear() - weekOffset - 1) / 7) + 1, resWeek, resYear;
        if (week < 1) {
          resYear = mom.year() - 1;
          resWeek = week + weeksInYear(resYear, dow, doy);
        } else if (week > weeksInYear(mom.year(), dow, doy)) {
          resWeek = week - weeksInYear(mom.year(), dow, doy);
          resYear = mom.year() + 1;
        } else {
          resYear = mom.year();
          resWeek = week;
        }
        return {
          week: resWeek,
          year: resYear
        };
      }
      function weeksInYear(year, dow, doy) {
        var weekOffset = firstWeekOffset(year, dow, doy), weekOffsetNext = firstWeekOffset(year + 1, dow, doy);
        return (daysInYear(year) - weekOffset + weekOffsetNext) / 7;
      }
      addFormatToken("w", ["ww", 2], "wo", "week");
      addFormatToken("W", ["WW", 2], "Wo", "isoWeek");
      addUnitAlias("week", "w");
      addUnitAlias("isoWeek", "W");
      addUnitPriority("week", 5);
      addUnitPriority("isoWeek", 5);
      addRegexToken("w", match1to2);
      addRegexToken("ww", match1to2, match2);
      addRegexToken("W", match1to2);
      addRegexToken("WW", match1to2, match2);
      addWeekParseToken(["w", "ww", "W", "WW"], function(input, week, config, token2) {
        week[token2.substr(0, 1)] = toInt(input);
      });
      function localeWeek(mom) {
        return weekOfYear(mom, this._week.dow, this._week.doy).week;
      }
      var defaultLocaleWeek = {
        dow: 0,
        doy: 6
      };
      function localeFirstDayOfWeek() {
        return this._week.dow;
      }
      function localeFirstDayOfYear() {
        return this._week.doy;
      }
      function getSetWeek(input) {
        var week = this.localeData().week(this);
        return input == null ? week : this.add((input - week) * 7, "d");
      }
      function getSetISOWeek(input) {
        var week = weekOfYear(this, 1, 4).week;
        return input == null ? week : this.add((input - week) * 7, "d");
      }
      addFormatToken("d", 0, "do", "day");
      addFormatToken("dd", 0, 0, function(format2) {
        return this.localeData().weekdaysMin(this, format2);
      });
      addFormatToken("ddd", 0, 0, function(format2) {
        return this.localeData().weekdaysShort(this, format2);
      });
      addFormatToken("dddd", 0, 0, function(format2) {
        return this.localeData().weekdays(this, format2);
      });
      addFormatToken("e", 0, 0, "weekday");
      addFormatToken("E", 0, 0, "isoWeekday");
      addUnitAlias("day", "d");
      addUnitAlias("weekday", "e");
      addUnitAlias("isoWeekday", "E");
      addUnitPriority("day", 11);
      addUnitPriority("weekday", 11);
      addUnitPriority("isoWeekday", 11);
      addRegexToken("d", match1to2);
      addRegexToken("e", match1to2);
      addRegexToken("E", match1to2);
      addRegexToken("dd", function(isStrict, locale2) {
        return locale2.weekdaysMinRegex(isStrict);
      });
      addRegexToken("ddd", function(isStrict, locale2) {
        return locale2.weekdaysShortRegex(isStrict);
      });
      addRegexToken("dddd", function(isStrict, locale2) {
        return locale2.weekdaysRegex(isStrict);
      });
      addWeekParseToken(["dd", "ddd", "dddd"], function(input, week, config, token2) {
        var weekday = config._locale.weekdaysParse(input, token2, config._strict);
        if (weekday != null) {
          week.d = weekday;
        } else {
          getParsingFlags(config).invalidWeekday = input;
        }
      });
      addWeekParseToken(["d", "e", "E"], function(input, week, config, token2) {
        week[token2] = toInt(input);
      });
      function parseWeekday(input, locale2) {
        if (typeof input !== "string") {
          return input;
        }
        if (!isNaN(input)) {
          return parseInt(input, 10);
        }
        input = locale2.weekdaysParse(input);
        if (typeof input === "number") {
          return input;
        }
        return null;
      }
      function parseIsoWeekday(input, locale2) {
        if (typeof input === "string") {
          return locale2.weekdaysParse(input) % 7 || 7;
        }
        return isNaN(input) ? null : input;
      }
      function shiftWeekdays(ws, n) {
        return ws.slice(n, 7).concat(ws.slice(0, n));
      }
      var defaultLocaleWeekdays = "Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"), defaultLocaleWeekdaysShort = "Sun_Mon_Tue_Wed_Thu_Fri_Sat".split("_"), defaultLocaleWeekdaysMin = "Su_Mo_Tu_We_Th_Fr_Sa".split("_"), defaultWeekdaysRegex = matchWord, defaultWeekdaysShortRegex = matchWord, defaultWeekdaysMinRegex = matchWord;
      function localeWeekdays(m, format2) {
        var weekdays = isArray(this._weekdays) ? this._weekdays : this._weekdays[m && m !== true && this._weekdays.isFormat.test(format2) ? "format" : "standalone"];
        return m === true ? shiftWeekdays(weekdays, this._week.dow) : m ? weekdays[m.day()] : weekdays;
      }
      function localeWeekdaysShort(m) {
        return m === true ? shiftWeekdays(this._weekdaysShort, this._week.dow) : m ? this._weekdaysShort[m.day()] : this._weekdaysShort;
      }
      function localeWeekdaysMin(m) {
        return m === true ? shiftWeekdays(this._weekdaysMin, this._week.dow) : m ? this._weekdaysMin[m.day()] : this._weekdaysMin;
      }
      function handleStrictParse$1(weekdayName, format2, strict) {
        var i, ii, mom, llc = weekdayName.toLocaleLowerCase();
        if (!this._weekdaysParse) {
          this._weekdaysParse = [];
          this._shortWeekdaysParse = [];
          this._minWeekdaysParse = [];
          for (i = 0; i < 7; ++i) {
            mom = createUTC([2e3, 1]).day(i);
            this._minWeekdaysParse[i] = this.weekdaysMin(mom, "").toLocaleLowerCase();
            this._shortWeekdaysParse[i] = this.weekdaysShort(mom, "").toLocaleLowerCase();
            this._weekdaysParse[i] = this.weekdays(mom, "").toLocaleLowerCase();
          }
        }
        if (strict) {
          if (format2 === "dddd") {
            ii = indexOf.call(this._weekdaysParse, llc);
            return ii !== -1 ? ii : null;
          } else if (format2 === "ddd") {
            ii = indexOf.call(this._shortWeekdaysParse, llc);
            return ii !== -1 ? ii : null;
          } else {
            ii = indexOf.call(this._minWeekdaysParse, llc);
            return ii !== -1 ? ii : null;
          }
        } else {
          if (format2 === "dddd") {
            ii = indexOf.call(this._weekdaysParse, llc);
            if (ii !== -1) {
              return ii;
            }
            ii = indexOf.call(this._shortWeekdaysParse, llc);
            if (ii !== -1) {
              return ii;
            }
            ii = indexOf.call(this._minWeekdaysParse, llc);
            return ii !== -1 ? ii : null;
          } else if (format2 === "ddd") {
            ii = indexOf.call(this._shortWeekdaysParse, llc);
            if (ii !== -1) {
              return ii;
            }
            ii = indexOf.call(this._weekdaysParse, llc);
            if (ii !== -1) {
              return ii;
            }
            ii = indexOf.call(this._minWeekdaysParse, llc);
            return ii !== -1 ? ii : null;
          } else {
            ii = indexOf.call(this._minWeekdaysParse, llc);
            if (ii !== -1) {
              return ii;
            }
            ii = indexOf.call(this._weekdaysParse, llc);
            if (ii !== -1) {
              return ii;
            }
            ii = indexOf.call(this._shortWeekdaysParse, llc);
            return ii !== -1 ? ii : null;
          }
        }
      }
      function localeWeekdaysParse(weekdayName, format2, strict) {
        var i, mom, regex;
        if (this._weekdaysParseExact) {
          return handleStrictParse$1.call(this, weekdayName, format2, strict);
        }
        if (!this._weekdaysParse) {
          this._weekdaysParse = [];
          this._minWeekdaysParse = [];
          this._shortWeekdaysParse = [];
          this._fullWeekdaysParse = [];
        }
        for (i = 0; i < 7; i++) {
          mom = createUTC([2e3, 1]).day(i);
          if (strict && !this._fullWeekdaysParse[i]) {
            this._fullWeekdaysParse[i] = new RegExp("^" + this.weekdays(mom, "").replace(".", "\\.?") + "$", "i");
            this._shortWeekdaysParse[i] = new RegExp("^" + this.weekdaysShort(mom, "").replace(".", "\\.?") + "$", "i");
            this._minWeekdaysParse[i] = new RegExp("^" + this.weekdaysMin(mom, "").replace(".", "\\.?") + "$", "i");
          }
          if (!this._weekdaysParse[i]) {
            regex = "^" + this.weekdays(mom, "") + "|^" + this.weekdaysShort(mom, "") + "|^" + this.weekdaysMin(mom, "");
            this._weekdaysParse[i] = new RegExp(regex.replace(".", ""), "i");
          }
          if (strict && format2 === "dddd" && this._fullWeekdaysParse[i].test(weekdayName)) {
            return i;
          } else if (strict && format2 === "ddd" && this._shortWeekdaysParse[i].test(weekdayName)) {
            return i;
          } else if (strict && format2 === "dd" && this._minWeekdaysParse[i].test(weekdayName)) {
            return i;
          } else if (!strict && this._weekdaysParse[i].test(weekdayName)) {
            return i;
          }
        }
      }
      function getSetDayOfWeek(input) {
        if (!this.isValid()) {
          return input != null ? this : NaN;
        }
        var day = this._isUTC ? this._d.getUTCDay() : this._d.getDay();
        if (input != null) {
          input = parseWeekday(input, this.localeData());
          return this.add(input - day, "d");
        } else {
          return day;
        }
      }
      function getSetLocaleDayOfWeek(input) {
        if (!this.isValid()) {
          return input != null ? this : NaN;
        }
        var weekday = (this.day() + 7 - this.localeData()._week.dow) % 7;
        return input == null ? weekday : this.add(input - weekday, "d");
      }
      function getSetISODayOfWeek(input) {
        if (!this.isValid()) {
          return input != null ? this : NaN;
        }
        if (input != null) {
          var weekday = parseIsoWeekday(input, this.localeData());
          return this.day(this.day() % 7 ? weekday : weekday - 7);
        } else {
          return this.day() || 7;
        }
      }
      function weekdaysRegex(isStrict) {
        if (this._weekdaysParseExact) {
          if (!hasOwnProp(this, "_weekdaysRegex")) {
            computeWeekdaysParse.call(this);
          }
          if (isStrict) {
            return this._weekdaysStrictRegex;
          } else {
            return this._weekdaysRegex;
          }
        } else {
          if (!hasOwnProp(this, "_weekdaysRegex")) {
            this._weekdaysRegex = defaultWeekdaysRegex;
          }
          return this._weekdaysStrictRegex && isStrict ? this._weekdaysStrictRegex : this._weekdaysRegex;
        }
      }
      function weekdaysShortRegex(isStrict) {
        if (this._weekdaysParseExact) {
          if (!hasOwnProp(this, "_weekdaysRegex")) {
            computeWeekdaysParse.call(this);
          }
          if (isStrict) {
            return this._weekdaysShortStrictRegex;
          } else {
            return this._weekdaysShortRegex;
          }
        } else {
          if (!hasOwnProp(this, "_weekdaysShortRegex")) {
            this._weekdaysShortRegex = defaultWeekdaysShortRegex;
          }
          return this._weekdaysShortStrictRegex && isStrict ? this._weekdaysShortStrictRegex : this._weekdaysShortRegex;
        }
      }
      function weekdaysMinRegex(isStrict) {
        if (this._weekdaysParseExact) {
          if (!hasOwnProp(this, "_weekdaysRegex")) {
            computeWeekdaysParse.call(this);
          }
          if (isStrict) {
            return this._weekdaysMinStrictRegex;
          } else {
            return this._weekdaysMinRegex;
          }
        } else {
          if (!hasOwnProp(this, "_weekdaysMinRegex")) {
            this._weekdaysMinRegex = defaultWeekdaysMinRegex;
          }
          return this._weekdaysMinStrictRegex && isStrict ? this._weekdaysMinStrictRegex : this._weekdaysMinRegex;
        }
      }
      function computeWeekdaysParse() {
        function cmpLenRev(a, b) {
          return b.length - a.length;
        }
        var minPieces = [], shortPieces = [], longPieces = [], mixedPieces = [], i, mom, minp, shortp, longp;
        for (i = 0; i < 7; i++) {
          mom = createUTC([2e3, 1]).day(i);
          minp = regexEscape(this.weekdaysMin(mom, ""));
          shortp = regexEscape(this.weekdaysShort(mom, ""));
          longp = regexEscape(this.weekdays(mom, ""));
          minPieces.push(minp);
          shortPieces.push(shortp);
          longPieces.push(longp);
          mixedPieces.push(minp);
          mixedPieces.push(shortp);
          mixedPieces.push(longp);
        }
        minPieces.sort(cmpLenRev);
        shortPieces.sort(cmpLenRev);
        longPieces.sort(cmpLenRev);
        mixedPieces.sort(cmpLenRev);
        this._weekdaysRegex = new RegExp("^(" + mixedPieces.join("|") + ")", "i");
        this._weekdaysShortRegex = this._weekdaysRegex;
        this._weekdaysMinRegex = this._weekdaysRegex;
        this._weekdaysStrictRegex = new RegExp("^(" + longPieces.join("|") + ")", "i");
        this._weekdaysShortStrictRegex = new RegExp("^(" + shortPieces.join("|") + ")", "i");
        this._weekdaysMinStrictRegex = new RegExp("^(" + minPieces.join("|") + ")", "i");
      }
      function hFormat() {
        return this.hours() % 12 || 12;
      }
      function kFormat() {
        return this.hours() || 24;
      }
      addFormatToken("H", ["HH", 2], 0, "hour");
      addFormatToken("h", ["hh", 2], 0, hFormat);
      addFormatToken("k", ["kk", 2], 0, kFormat);
      addFormatToken("hmm", 0, 0, function() {
        return "" + hFormat.apply(this) + zeroFill(this.minutes(), 2);
      });
      addFormatToken("hmmss", 0, 0, function() {
        return "" + hFormat.apply(this) + zeroFill(this.minutes(), 2) + zeroFill(this.seconds(), 2);
      });
      addFormatToken("Hmm", 0, 0, function() {
        return "" + this.hours() + zeroFill(this.minutes(), 2);
      });
      addFormatToken("Hmmss", 0, 0, function() {
        return "" + this.hours() + zeroFill(this.minutes(), 2) + zeroFill(this.seconds(), 2);
      });
      function meridiem(token2, lowercase) {
        addFormatToken(token2, 0, 0, function() {
          return this.localeData().meridiem(this.hours(), this.minutes(), lowercase);
        });
      }
      meridiem("a", true);
      meridiem("A", false);
      addUnitAlias("hour", "h");
      addUnitPriority("hour", 13);
      function matchMeridiem(isStrict, locale2) {
        return locale2._meridiemParse;
      }
      addRegexToken("a", matchMeridiem);
      addRegexToken("A", matchMeridiem);
      addRegexToken("H", match1to2);
      addRegexToken("h", match1to2);
      addRegexToken("k", match1to2);
      addRegexToken("HH", match1to2, match2);
      addRegexToken("hh", match1to2, match2);
      addRegexToken("kk", match1to2, match2);
      addRegexToken("hmm", match3to4);
      addRegexToken("hmmss", match5to6);
      addRegexToken("Hmm", match3to4);
      addRegexToken("Hmmss", match5to6);
      addParseToken(["H", "HH"], HOUR);
      addParseToken(["k", "kk"], function(input, array, config) {
        var kInput = toInt(input);
        array[HOUR] = kInput === 24 ? 0 : kInput;
      });
      addParseToken(["a", "A"], function(input, array, config) {
        config._isPm = config._locale.isPM(input);
        config._meridiem = input;
      });
      addParseToken(["h", "hh"], function(input, array, config) {
        array[HOUR] = toInt(input);
        getParsingFlags(config).bigHour = true;
      });
      addParseToken("hmm", function(input, array, config) {
        var pos = input.length - 2;
        array[HOUR] = toInt(input.substr(0, pos));
        array[MINUTE] = toInt(input.substr(pos));
        getParsingFlags(config).bigHour = true;
      });
      addParseToken("hmmss", function(input, array, config) {
        var pos1 = input.length - 4, pos2 = input.length - 2;
        array[HOUR] = toInt(input.substr(0, pos1));
        array[MINUTE] = toInt(input.substr(pos1, 2));
        array[SECOND] = toInt(input.substr(pos2));
        getParsingFlags(config).bigHour = true;
      });
      addParseToken("Hmm", function(input, array, config) {
        var pos = input.length - 2;
        array[HOUR] = toInt(input.substr(0, pos));
        array[MINUTE] = toInt(input.substr(pos));
      });
      addParseToken("Hmmss", function(input, array, config) {
        var pos1 = input.length - 4, pos2 = input.length - 2;
        array[HOUR] = toInt(input.substr(0, pos1));
        array[MINUTE] = toInt(input.substr(pos1, 2));
        array[SECOND] = toInt(input.substr(pos2));
      });
      function localeIsPM(input) {
        return (input + "").toLowerCase().charAt(0) === "p";
      }
      var defaultLocaleMeridiemParse = /[ap]\.?m?\.?/i, getSetHour = makeGetSet("Hours", true);
      function localeMeridiem(hours2, minutes2, isLower) {
        if (hours2 > 11) {
          return isLower ? "pm" : "PM";
        } else {
          return isLower ? "am" : "AM";
        }
      }
      var baseConfig = {
        calendar: defaultCalendar,
        longDateFormat: defaultLongDateFormat,
        invalidDate: defaultInvalidDate,
        ordinal: defaultOrdinal,
        dayOfMonthOrdinalParse: defaultDayOfMonthOrdinalParse,
        relativeTime: defaultRelativeTime,
        months: defaultLocaleMonths,
        monthsShort: defaultLocaleMonthsShort,
        week: defaultLocaleWeek,
        weekdays: defaultLocaleWeekdays,
        weekdaysMin: defaultLocaleWeekdaysMin,
        weekdaysShort: defaultLocaleWeekdaysShort,
        meridiemParse: defaultLocaleMeridiemParse
      };
      var locales = {}, localeFamilies = {}, globalLocale;
      function commonPrefix(arr1, arr2) {
        var i, minl = Math.min(arr1.length, arr2.length);
        for (i = 0; i < minl; i += 1) {
          if (arr1[i] !== arr2[i]) {
            return i;
          }
        }
        return minl;
      }
      function normalizeLocale(key2) {
        return key2 ? key2.toLowerCase().replace("_", "-") : key2;
      }
      function chooseLocale(names) {
        var i = 0, j, next, locale2, split;
        while (i < names.length) {
          split = normalizeLocale(names[i]).split("-");
          j = split.length;
          next = normalizeLocale(names[i + 1]);
          next = next ? next.split("-") : null;
          while (j > 0) {
            locale2 = loadLocale(split.slice(0, j).join("-"));
            if (locale2) {
              return locale2;
            }
            if (next && next.length >= j && commonPrefix(split, next) >= j - 1) {
              break;
            }
            j--;
          }
          i++;
        }
        return globalLocale;
      }
      function isLocaleNameSane(name) {
        return name.match("^[^/\\\\]*$") != null;
      }
      function loadLocale(name) {
        var oldLocale = null, aliasedRequire;
        if (locales[name] === void 0 && typeof module2 !== "undefined" && module2 && module2.exports && isLocaleNameSane(name)) {
          try {
            oldLocale = globalLocale._abbr;
            aliasedRequire = require;
            aliasedRequire("./locale/" + name);
            getSetGlobalLocale(oldLocale);
          } catch (e) {
            locales[name] = null;
          }
        }
        return locales[name];
      }
      function getSetGlobalLocale(key2, values) {
        var data;
        if (key2) {
          if (isUndefined(values)) {
            data = getLocale(key2);
          } else {
            data = defineLocale(key2, values);
          }
          if (data) {
            globalLocale = data;
          } else {
            if (typeof console !== "undefined" && console.warn) {
              console.warn("Locale " + key2 + " not found. Did you forget to load it?");
            }
          }
        }
        return globalLocale._abbr;
      }
      function defineLocale(name, config) {
        if (config !== null) {
          var locale2, parentConfig = baseConfig;
          config.abbr = name;
          if (locales[name] != null) {
            deprecateSimple("defineLocaleOverride", "use moment.updateLocale(localeName, config) to change an existing locale. moment.defineLocale(localeName, config) should only be used for creating a new locale See http://momentjs.com/guides/#/warnings/define-locale/ for more info.");
            parentConfig = locales[name]._config;
          } else if (config.parentLocale != null) {
            if (locales[config.parentLocale] != null) {
              parentConfig = locales[config.parentLocale]._config;
            } else {
              locale2 = loadLocale(config.parentLocale);
              if (locale2 != null) {
                parentConfig = locale2._config;
              } else {
                if (!localeFamilies[config.parentLocale]) {
                  localeFamilies[config.parentLocale] = [];
                }
                localeFamilies[config.parentLocale].push({
                  name,
                  config
                });
                return null;
              }
            }
          }
          locales[name] = new Locale(mergeConfigs(parentConfig, config));
          if (localeFamilies[name]) {
            localeFamilies[name].forEach(function(x) {
              defineLocale(x.name, x.config);
            });
          }
          getSetGlobalLocale(name);
          return locales[name];
        } else {
          delete locales[name];
          return null;
        }
      }
      function updateLocale(name, config) {
        if (config != null) {
          var locale2, tmpLocale, parentConfig = baseConfig;
          if (locales[name] != null && locales[name].parentLocale != null) {
            locales[name].set(mergeConfigs(locales[name]._config, config));
          } else {
            tmpLocale = loadLocale(name);
            if (tmpLocale != null) {
              parentConfig = tmpLocale._config;
            }
            config = mergeConfigs(parentConfig, config);
            if (tmpLocale == null) {
              config.abbr = name;
            }
            locale2 = new Locale(config);
            locale2.parentLocale = locales[name];
            locales[name] = locale2;
          }
          getSetGlobalLocale(name);
        } else {
          if (locales[name] != null) {
            if (locales[name].parentLocale != null) {
              locales[name] = locales[name].parentLocale;
              if (name === getSetGlobalLocale()) {
                getSetGlobalLocale(name);
              }
            } else if (locales[name] != null) {
              delete locales[name];
            }
          }
        }
        return locales[name];
      }
      function getLocale(key2) {
        var locale2;
        if (key2 && key2._locale && key2._locale._abbr) {
          key2 = key2._locale._abbr;
        }
        if (!key2) {
          return globalLocale;
        }
        if (!isArray(key2)) {
          locale2 = loadLocale(key2);
          if (locale2) {
            return locale2;
          }
          key2 = [key2];
        }
        return chooseLocale(key2);
      }
      function listLocales() {
        return keys(locales);
      }
      function checkOverflow(m) {
        var overflow, a = m._a;
        if (a && getParsingFlags(m).overflow === -2) {
          overflow = a[MONTH] < 0 || a[MONTH] > 11 ? MONTH : a[DATE] < 1 || a[DATE] > daysInMonth(a[YEAR], a[MONTH]) ? DATE : a[HOUR] < 0 || a[HOUR] > 24 || a[HOUR] === 24 && (a[MINUTE] !== 0 || a[SECOND] !== 0 || a[MILLISECOND] !== 0) ? HOUR : a[MINUTE] < 0 || a[MINUTE] > 59 ? MINUTE : a[SECOND] < 0 || a[SECOND] > 59 ? SECOND : a[MILLISECOND] < 0 || a[MILLISECOND] > 999 ? MILLISECOND : -1;
          if (getParsingFlags(m)._overflowDayOfYear && (overflow < YEAR || overflow > DATE)) {
            overflow = DATE;
          }
          if (getParsingFlags(m)._overflowWeeks && overflow === -1) {
            overflow = WEEK;
          }
          if (getParsingFlags(m)._overflowWeekday && overflow === -1) {
            overflow = WEEKDAY;
          }
          getParsingFlags(m).overflow = overflow;
        }
        return m;
      }
      var extendedIsoRegex = /^\s*((?:[+-]\d{6}|\d{4})-(?:\d\d-\d\d|W\d\d-\d|W\d\d|\d\d\d|\d\d))(?:(T| )(\d\d(?::\d\d(?::\d\d(?:[.,]\d+)?)?)?)([+-]\d\d(?::?\d\d)?|\s*Z)?)?$/, basicIsoRegex = /^\s*((?:[+-]\d{6}|\d{4})(?:\d\d\d\d|W\d\d\d|W\d\d|\d\d\d|\d\d|))(?:(T| )(\d\d(?:\d\d(?:\d\d(?:[.,]\d+)?)?)?)([+-]\d\d(?::?\d\d)?|\s*Z)?)?$/, tzRegex = /Z|[+-]\d\d(?::?\d\d)?/, isoDates = [
        ["YYYYYY-MM-DD", /[+-]\d{6}-\d\d-\d\d/],
        ["YYYY-MM-DD", /\d{4}-\d\d-\d\d/],
        ["GGGG-[W]WW-E", /\d{4}-W\d\d-\d/],
        ["GGGG-[W]WW", /\d{4}-W\d\d/, false],
        ["YYYY-DDD", /\d{4}-\d{3}/],
        ["YYYY-MM", /\d{4}-\d\d/, false],
        ["YYYYYYMMDD", /[+-]\d{10}/],
        ["YYYYMMDD", /\d{8}/],
        ["GGGG[W]WWE", /\d{4}W\d{3}/],
        ["GGGG[W]WW", /\d{4}W\d{2}/, false],
        ["YYYYDDD", /\d{7}/],
        ["YYYYMM", /\d{6}/, false],
        ["YYYY", /\d{4}/, false]
      ], isoTimes = [
        ["HH:mm:ss.SSSS", /\d\d:\d\d:\d\d\.\d+/],
        ["HH:mm:ss,SSSS", /\d\d:\d\d:\d\d,\d+/],
        ["HH:mm:ss", /\d\d:\d\d:\d\d/],
        ["HH:mm", /\d\d:\d\d/],
        ["HHmmss.SSSS", /\d\d\d\d\d\d\.\d+/],
        ["HHmmss,SSSS", /\d\d\d\d\d\d,\d+/],
        ["HHmmss", /\d\d\d\d\d\d/],
        ["HHmm", /\d\d\d\d/],
        ["HH", /\d\d/]
      ], aspNetJsonRegex = /^\/?Date\((-?\d+)/i, rfc2822 = /^(?:(Mon|Tue|Wed|Thu|Fri|Sat|Sun),?\s)?(\d{1,2})\s(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s(\d{2,4})\s(\d\d):(\d\d)(?::(\d\d))?\s(?:(UT|GMT|[ECMP][SD]T)|([Zz])|([+-]\d{4}))$/, obsOffsets = {
        UT: 0,
        GMT: 0,
        EDT: -4 * 60,
        EST: -5 * 60,
        CDT: -5 * 60,
        CST: -6 * 60,
        MDT: -6 * 60,
        MST: -7 * 60,
        PDT: -7 * 60,
        PST: -8 * 60
      };
      function configFromISO(config) {
        var i, l, string = config._i, match = extendedIsoRegex.exec(string) || basicIsoRegex.exec(string), allowTime, dateFormat, timeFormat, tzFormat, isoDatesLen = isoDates.length, isoTimesLen = isoTimes.length;
        if (match) {
          getParsingFlags(config).iso = true;
          for (i = 0, l = isoDatesLen; i < l; i++) {
            if (isoDates[i][1].exec(match[1])) {
              dateFormat = isoDates[i][0];
              allowTime = isoDates[i][2] !== false;
              break;
            }
          }
          if (dateFormat == null) {
            config._isValid = false;
            return;
          }
          if (match[3]) {
            for (i = 0, l = isoTimesLen; i < l; i++) {
              if (isoTimes[i][1].exec(match[3])) {
                timeFormat = (match[2] || " ") + isoTimes[i][0];
                break;
              }
            }
            if (timeFormat == null) {
              config._isValid = false;
              return;
            }
          }
          if (!allowTime && timeFormat != null) {
            config._isValid = false;
            return;
          }
          if (match[4]) {
            if (tzRegex.exec(match[4])) {
              tzFormat = "Z";
            } else {
              config._isValid = false;
              return;
            }
          }
          config._f = dateFormat + (timeFormat || "") + (tzFormat || "");
          configFromStringAndFormat(config);
        } else {
          config._isValid = false;
        }
      }
      function extractFromRFC2822Strings(yearStr, monthStr, dayStr, hourStr, minuteStr, secondStr) {
        var result = [
          untruncateYear(yearStr),
          defaultLocaleMonthsShort.indexOf(monthStr),
          parseInt(dayStr, 10),
          parseInt(hourStr, 10),
          parseInt(minuteStr, 10)
        ];
        if (secondStr) {
          result.push(parseInt(secondStr, 10));
        }
        return result;
      }
      function untruncateYear(yearStr) {
        var year = parseInt(yearStr, 10);
        if (year <= 49) {
          return 2e3 + year;
        } else if (year <= 999) {
          return 1900 + year;
        }
        return year;
      }
      function preprocessRFC2822(s) {
        return s.replace(/\([^()]*\)|[\n\t]/g, " ").replace(/(\s\s+)/g, " ").replace(/^\s\s*/, "").replace(/\s\s*$/, "");
      }
      function checkWeekday(weekdayStr, parsedInput, config) {
        if (weekdayStr) {
          var weekdayProvided = defaultLocaleWeekdaysShort.indexOf(weekdayStr), weekdayActual = new Date(parsedInput[0], parsedInput[1], parsedInput[2]).getDay();
          if (weekdayProvided !== weekdayActual) {
            getParsingFlags(config).weekdayMismatch = true;
            config._isValid = false;
            return false;
          }
        }
        return true;
      }
      function calculateOffset(obsOffset, militaryOffset, numOffset) {
        if (obsOffset) {
          return obsOffsets[obsOffset];
        } else if (militaryOffset) {
          return 0;
        } else {
          var hm = parseInt(numOffset, 10), m = hm % 100, h = (hm - m) / 100;
          return h * 60 + m;
        }
      }
      function configFromRFC2822(config) {
        var match = rfc2822.exec(preprocessRFC2822(config._i)), parsedArray;
        if (match) {
          parsedArray = extractFromRFC2822Strings(match[4], match[3], match[2], match[5], match[6], match[7]);
          if (!checkWeekday(match[1], parsedArray, config)) {
            return;
          }
          config._a = parsedArray;
          config._tzm = calculateOffset(match[8], match[9], match[10]);
          config._d = createUTCDate.apply(null, config._a);
          config._d.setUTCMinutes(config._d.getUTCMinutes() - config._tzm);
          getParsingFlags(config).rfc2822 = true;
        } else {
          config._isValid = false;
        }
      }
      function configFromString(config) {
        var matched = aspNetJsonRegex.exec(config._i);
        if (matched !== null) {
          config._d = new Date(+matched[1]);
          return;
        }
        configFromISO(config);
        if (config._isValid === false) {
          delete config._isValid;
        } else {
          return;
        }
        configFromRFC2822(config);
        if (config._isValid === false) {
          delete config._isValid;
        } else {
          return;
        }
        if (config._strict) {
          config._isValid = false;
        } else {
          hooks.createFromInputFallback(config);
        }
      }
      hooks.createFromInputFallback = deprecate("value provided is not in a recognized RFC2822 or ISO format. moment construction falls back to js Date(), which is not reliable across all browsers and versions. Non RFC2822/ISO date formats are discouraged. Please refer to http://momentjs.com/guides/#/warnings/js-date/ for more info.", function(config) {
        config._d = new Date(config._i + (config._useUTC ? " UTC" : ""));
      });
      function defaults(a, b, c) {
        if (a != null) {
          return a;
        }
        if (b != null) {
          return b;
        }
        return c;
      }
      function currentDateArray(config) {
        var nowValue = new Date(hooks.now());
        if (config._useUTC) {
          return [
            nowValue.getUTCFullYear(),
            nowValue.getUTCMonth(),
            nowValue.getUTCDate()
          ];
        }
        return [nowValue.getFullYear(), nowValue.getMonth(), nowValue.getDate()];
      }
      function configFromArray(config) {
        var i, date, input = [], currentDate, expectedWeekday, yearToUse;
        if (config._d) {
          return;
        }
        currentDate = currentDateArray(config);
        if (config._w && config._a[DATE] == null && config._a[MONTH] == null) {
          dayOfYearFromWeekInfo(config);
        }
        if (config._dayOfYear != null) {
          yearToUse = defaults(config._a[YEAR], currentDate[YEAR]);
          if (config._dayOfYear > daysInYear(yearToUse) || config._dayOfYear === 0) {
            getParsingFlags(config)._overflowDayOfYear = true;
          }
          date = createUTCDate(yearToUse, 0, config._dayOfYear);
          config._a[MONTH] = date.getUTCMonth();
          config._a[DATE] = date.getUTCDate();
        }
        for (i = 0; i < 3 && config._a[i] == null; ++i) {
          config._a[i] = input[i] = currentDate[i];
        }
        for (; i < 7; i++) {
          config._a[i] = input[i] = config._a[i] == null ? i === 2 ? 1 : 0 : config._a[i];
        }
        if (config._a[HOUR] === 24 && config._a[MINUTE] === 0 && config._a[SECOND] === 0 && config._a[MILLISECOND] === 0) {
          config._nextDay = true;
          config._a[HOUR] = 0;
        }
        config._d = (config._useUTC ? createUTCDate : createDate).apply(null, input);
        expectedWeekday = config._useUTC ? config._d.getUTCDay() : config._d.getDay();
        if (config._tzm != null) {
          config._d.setUTCMinutes(config._d.getUTCMinutes() - config._tzm);
        }
        if (config._nextDay) {
          config._a[HOUR] = 24;
        }
        if (config._w && typeof config._w.d !== "undefined" && config._w.d !== expectedWeekday) {
          getParsingFlags(config).weekdayMismatch = true;
        }
      }
      function dayOfYearFromWeekInfo(config) {
        var w, weekYear, week, weekday, dow, doy, temp, weekdayOverflow, curWeek;
        w = config._w;
        if (w.GG != null || w.W != null || w.E != null) {
          dow = 1;
          doy = 4;
          weekYear = defaults(w.GG, config._a[YEAR], weekOfYear(createLocal(), 1, 4).year);
          week = defaults(w.W, 1);
          weekday = defaults(w.E, 1);
          if (weekday < 1 || weekday > 7) {
            weekdayOverflow = true;
          }
        } else {
          dow = config._locale._week.dow;
          doy = config._locale._week.doy;
          curWeek = weekOfYear(createLocal(), dow, doy);
          weekYear = defaults(w.gg, config._a[YEAR], curWeek.year);
          week = defaults(w.w, curWeek.week);
          if (w.d != null) {
            weekday = w.d;
            if (weekday < 0 || weekday > 6) {
              weekdayOverflow = true;
            }
          } else if (w.e != null) {
            weekday = w.e + dow;
            if (w.e < 0 || w.e > 6) {
              weekdayOverflow = true;
            }
          } else {
            weekday = dow;
          }
        }
        if (week < 1 || week > weeksInYear(weekYear, dow, doy)) {
          getParsingFlags(config)._overflowWeeks = true;
        } else if (weekdayOverflow != null) {
          getParsingFlags(config)._overflowWeekday = true;
        } else {
          temp = dayOfYearFromWeeks(weekYear, week, weekday, dow, doy);
          config._a[YEAR] = temp.year;
          config._dayOfYear = temp.dayOfYear;
        }
      }
      hooks.ISO_8601 = function() {
      };
      hooks.RFC_2822 = function() {
      };
      function configFromStringAndFormat(config) {
        if (config._f === hooks.ISO_8601) {
          configFromISO(config);
          return;
        }
        if (config._f === hooks.RFC_2822) {
          configFromRFC2822(config);
          return;
        }
        config._a = [];
        getParsingFlags(config).empty = true;
        var string = "" + config._i, i, parsedInput, tokens2, token2, skipped, stringLength = string.length, totalParsedInputLength = 0, era, tokenLen;
        tokens2 = expandFormat(config._f, config._locale).match(formattingTokens) || [];
        tokenLen = tokens2.length;
        for (i = 0; i < tokenLen; i++) {
          token2 = tokens2[i];
          parsedInput = (string.match(getParseRegexForToken(token2, config)) || [])[0];
          if (parsedInput) {
            skipped = string.substr(0, string.indexOf(parsedInput));
            if (skipped.length > 0) {
              getParsingFlags(config).unusedInput.push(skipped);
            }
            string = string.slice(string.indexOf(parsedInput) + parsedInput.length);
            totalParsedInputLength += parsedInput.length;
          }
          if (formatTokenFunctions[token2]) {
            if (parsedInput) {
              getParsingFlags(config).empty = false;
            } else {
              getParsingFlags(config).unusedTokens.push(token2);
            }
            addTimeToArrayFromToken(token2, parsedInput, config);
          } else if (config._strict && !parsedInput) {
            getParsingFlags(config).unusedTokens.push(token2);
          }
        }
        getParsingFlags(config).charsLeftOver = stringLength - totalParsedInputLength;
        if (string.length > 0) {
          getParsingFlags(config).unusedInput.push(string);
        }
        if (config._a[HOUR] <= 12 && getParsingFlags(config).bigHour === true && config._a[HOUR] > 0) {
          getParsingFlags(config).bigHour = void 0;
        }
        getParsingFlags(config).parsedDateParts = config._a.slice(0);
        getParsingFlags(config).meridiem = config._meridiem;
        config._a[HOUR] = meridiemFixWrap(config._locale, config._a[HOUR], config._meridiem);
        era = getParsingFlags(config).era;
        if (era !== null) {
          config._a[YEAR] = config._locale.erasConvertYear(era, config._a[YEAR]);
        }
        configFromArray(config);
        checkOverflow(config);
      }
      function meridiemFixWrap(locale2, hour, meridiem2) {
        var isPm;
        if (meridiem2 == null) {
          return hour;
        }
        if (locale2.meridiemHour != null) {
          return locale2.meridiemHour(hour, meridiem2);
        } else if (locale2.isPM != null) {
          isPm = locale2.isPM(meridiem2);
          if (isPm && hour < 12) {
            hour += 12;
          }
          if (!isPm && hour === 12) {
            hour = 0;
          }
          return hour;
        } else {
          return hour;
        }
      }
      function configFromStringAndArray(config) {
        var tempConfig, bestMoment, scoreToBeat, i, currentScore, validFormatFound, bestFormatIsValid = false, configfLen = config._f.length;
        if (configfLen === 0) {
          getParsingFlags(config).invalidFormat = true;
          config._d = new Date(NaN);
          return;
        }
        for (i = 0; i < configfLen; i++) {
          currentScore = 0;
          validFormatFound = false;
          tempConfig = copyConfig({}, config);
          if (config._useUTC != null) {
            tempConfig._useUTC = config._useUTC;
          }
          tempConfig._f = config._f[i];
          configFromStringAndFormat(tempConfig);
          if (isValid(tempConfig)) {
            validFormatFound = true;
          }
          currentScore += getParsingFlags(tempConfig).charsLeftOver;
          currentScore += getParsingFlags(tempConfig).unusedTokens.length * 10;
          getParsingFlags(tempConfig).score = currentScore;
          if (!bestFormatIsValid) {
            if (scoreToBeat == null || currentScore < scoreToBeat || validFormatFound) {
              scoreToBeat = currentScore;
              bestMoment = tempConfig;
              if (validFormatFound) {
                bestFormatIsValid = true;
              }
            }
          } else {
            if (currentScore < scoreToBeat) {
              scoreToBeat = currentScore;
              bestMoment = tempConfig;
            }
          }
        }
        extend2(config, bestMoment || tempConfig);
      }
      function configFromObject(config) {
        if (config._d) {
          return;
        }
        var i = normalizeObjectUnits(config._i), dayOrDate = i.day === void 0 ? i.date : i.day;
        config._a = map([i.year, i.month, dayOrDate, i.hour, i.minute, i.second, i.millisecond], function(obj) {
          return obj && parseInt(obj, 10);
        });
        configFromArray(config);
      }
      function createFromConfig(config) {
        var res = new Moment2(checkOverflow(prepareConfig(config)));
        if (res._nextDay) {
          res.add(1, "d");
          res._nextDay = void 0;
        }
        return res;
      }
      function prepareConfig(config) {
        var input = config._i, format2 = config._f;
        config._locale = config._locale || getLocale(config._l);
        if (input === null || format2 === void 0 && input === "") {
          return createInvalid({ nullInput: true });
        }
        if (typeof input === "string") {
          config._i = input = config._locale.preparse(input);
        }
        if (isMoment(input)) {
          return new Moment2(checkOverflow(input));
        } else if (isDate(input)) {
          config._d = input;
        } else if (isArray(format2)) {
          configFromStringAndArray(config);
        } else if (format2) {
          configFromStringAndFormat(config);
        } else {
          configFromInput(config);
        }
        if (!isValid(config)) {
          config._d = null;
        }
        return config;
      }
      function configFromInput(config) {
        var input = config._i;
        if (isUndefined(input)) {
          config._d = new Date(hooks.now());
        } else if (isDate(input)) {
          config._d = new Date(input.valueOf());
        } else if (typeof input === "string") {
          configFromString(config);
        } else if (isArray(input)) {
          config._a = map(input.slice(0), function(obj) {
            return parseInt(obj, 10);
          });
          configFromArray(config);
        } else if (isObject(input)) {
          configFromObject(config);
        } else if (isNumber(input)) {
          config._d = new Date(input);
        } else {
          hooks.createFromInputFallback(config);
        }
      }
      function createLocalOrUTC(input, format2, locale2, strict, isUTC) {
        var c = {};
        if (format2 === true || format2 === false) {
          strict = format2;
          format2 = void 0;
        }
        if (locale2 === true || locale2 === false) {
          strict = locale2;
          locale2 = void 0;
        }
        if (isObject(input) && isObjectEmpty(input) || isArray(input) && input.length === 0) {
          input = void 0;
        }
        c._isAMomentObject = true;
        c._useUTC = c._isUTC = isUTC;
        c._l = locale2;
        c._i = input;
        c._f = format2;
        c._strict = strict;
        return createFromConfig(c);
      }
      function createLocal(input, format2, locale2, strict) {
        return createLocalOrUTC(input, format2, locale2, strict, false);
      }
      var prototypeMin = deprecate("moment().min is deprecated, use moment.max instead. http://momentjs.com/guides/#/warnings/min-max/", function() {
        var other = createLocal.apply(null, arguments);
        if (this.isValid() && other.isValid()) {
          return other < this ? this : other;
        } else {
          return createInvalid();
        }
      }), prototypeMax = deprecate("moment().max is deprecated, use moment.min instead. http://momentjs.com/guides/#/warnings/min-max/", function() {
        var other = createLocal.apply(null, arguments);
        if (this.isValid() && other.isValid()) {
          return other > this ? this : other;
        } else {
          return createInvalid();
        }
      });
      function pickBy(fn, moments) {
        var res, i;
        if (moments.length === 1 && isArray(moments[0])) {
          moments = moments[0];
        }
        if (!moments.length) {
          return createLocal();
        }
        res = moments[0];
        for (i = 1; i < moments.length; ++i) {
          if (!moments[i].isValid() || moments[i][fn](res)) {
            res = moments[i];
          }
        }
        return res;
      }
      function min() {
        var args = [].slice.call(arguments, 0);
        return pickBy("isBefore", args);
      }
      function max() {
        var args = [].slice.call(arguments, 0);
        return pickBy("isAfter", args);
      }
      var now = function() {
        return Date.now ? Date.now() : +new Date();
      };
      var ordering = [
        "year",
        "quarter",
        "month",
        "week",
        "day",
        "hour",
        "minute",
        "second",
        "millisecond"
      ];
      function isDurationValid(m) {
        var key2, unitHasDecimal = false, i, orderLen = ordering.length;
        for (key2 in m) {
          if (hasOwnProp(m, key2) && !(indexOf.call(ordering, key2) !== -1 && (m[key2] == null || !isNaN(m[key2])))) {
            return false;
          }
        }
        for (i = 0; i < orderLen; ++i) {
          if (m[ordering[i]]) {
            if (unitHasDecimal) {
              return false;
            }
            if (parseFloat(m[ordering[i]]) !== toInt(m[ordering[i]])) {
              unitHasDecimal = true;
            }
          }
        }
        return true;
      }
      function isValid$1() {
        return this._isValid;
      }
      function createInvalid$1() {
        return createDuration(NaN);
      }
      function Duration(duration) {
        var normalizedInput = normalizeObjectUnits(duration), years2 = normalizedInput.year || 0, quarters = normalizedInput.quarter || 0, months2 = normalizedInput.month || 0, weeks2 = normalizedInput.week || normalizedInput.isoWeek || 0, days2 = normalizedInput.day || 0, hours2 = normalizedInput.hour || 0, minutes2 = normalizedInput.minute || 0, seconds2 = normalizedInput.second || 0, milliseconds2 = normalizedInput.millisecond || 0;
        this._isValid = isDurationValid(normalizedInput);
        this._milliseconds = +milliseconds2 + seconds2 * 1e3 + minutes2 * 6e4 + hours2 * 1e3 * 60 * 60;
        this._days = +days2 + weeks2 * 7;
        this._months = +months2 + quarters * 3 + years2 * 12;
        this._data = {};
        this._locale = getLocale();
        this._bubble();
      }
      function isDuration(obj) {
        return obj instanceof Duration;
      }
      function absRound(number) {
        if (number < 0) {
          return Math.round(-1 * number) * -1;
        } else {
          return Math.round(number);
        }
      }
      function compareArrays(array1, array2, dontConvert) {
        var len = Math.min(array1.length, array2.length), lengthDiff = Math.abs(array1.length - array2.length), diffs = 0, i;
        for (i = 0; i < len; i++) {
          if (dontConvert && array1[i] !== array2[i] || !dontConvert && toInt(array1[i]) !== toInt(array2[i])) {
            diffs++;
          }
        }
        return diffs + lengthDiff;
      }
      function offset(token2, separator) {
        addFormatToken(token2, 0, 0, function() {
          var offset2 = this.utcOffset(), sign2 = "+";
          if (offset2 < 0) {
            offset2 = -offset2;
            sign2 = "-";
          }
          return sign2 + zeroFill(~~(offset2 / 60), 2) + separator + zeroFill(~~offset2 % 60, 2);
        });
      }
      offset("Z", ":");
      offset("ZZ", "");
      addRegexToken("Z", matchShortOffset);
      addRegexToken("ZZ", matchShortOffset);
      addParseToken(["Z", "ZZ"], function(input, array, config) {
        config._useUTC = true;
        config._tzm = offsetFromString(matchShortOffset, input);
      });
      var chunkOffset = /([\+\-]|\d\d)/gi;
      function offsetFromString(matcher, string) {
        var matches = (string || "").match(matcher), chunk, parts, minutes2;
        if (matches === null) {
          return null;
        }
        chunk = matches[matches.length - 1] || [];
        parts = (chunk + "").match(chunkOffset) || ["-", 0, 0];
        minutes2 = +(parts[1] * 60) + toInt(parts[2]);
        return minutes2 === 0 ? 0 : parts[0] === "+" ? minutes2 : -minutes2;
      }
      function cloneWithOffset(input, model) {
        var res, diff2;
        if (model._isUTC) {
          res = model.clone();
          diff2 = (isMoment(input) || isDate(input) ? input.valueOf() : createLocal(input).valueOf()) - res.valueOf();
          res._d.setTime(res._d.valueOf() + diff2);
          hooks.updateOffset(res, false);
          return res;
        } else {
          return createLocal(input).local();
        }
      }
      function getDateOffset(m) {
        return -Math.round(m._d.getTimezoneOffset());
      }
      hooks.updateOffset = function() {
      };
      function getSetOffset(input, keepLocalTime, keepMinutes) {
        var offset2 = this._offset || 0, localAdjust;
        if (!this.isValid()) {
          return input != null ? this : NaN;
        }
        if (input != null) {
          if (typeof input === "string") {
            input = offsetFromString(matchShortOffset, input);
            if (input === null) {
              return this;
            }
          } else if (Math.abs(input) < 16 && !keepMinutes) {
            input = input * 60;
          }
          if (!this._isUTC && keepLocalTime) {
            localAdjust = getDateOffset(this);
          }
          this._offset = input;
          this._isUTC = true;
          if (localAdjust != null) {
            this.add(localAdjust, "m");
          }
          if (offset2 !== input) {
            if (!keepLocalTime || this._changeInProgress) {
              addSubtract(this, createDuration(input - offset2, "m"), 1, false);
            } else if (!this._changeInProgress) {
              this._changeInProgress = true;
              hooks.updateOffset(this, true);
              this._changeInProgress = null;
            }
          }
          return this;
        } else {
          return this._isUTC ? offset2 : getDateOffset(this);
        }
      }
      function getSetZone(input, keepLocalTime) {
        if (input != null) {
          if (typeof input !== "string") {
            input = -input;
          }
          this.utcOffset(input, keepLocalTime);
          return this;
        } else {
          return -this.utcOffset();
        }
      }
      function setOffsetToUTC(keepLocalTime) {
        return this.utcOffset(0, keepLocalTime);
      }
      function setOffsetToLocal(keepLocalTime) {
        if (this._isUTC) {
          this.utcOffset(0, keepLocalTime);
          this._isUTC = false;
          if (keepLocalTime) {
            this.subtract(getDateOffset(this), "m");
          }
        }
        return this;
      }
      function setOffsetToParsedOffset() {
        if (this._tzm != null) {
          this.utcOffset(this._tzm, false, true);
        } else if (typeof this._i === "string") {
          var tZone = offsetFromString(matchOffset, this._i);
          if (tZone != null) {
            this.utcOffset(tZone);
          } else {
            this.utcOffset(0, true);
          }
        }
        return this;
      }
      function hasAlignedHourOffset(input) {
        if (!this.isValid()) {
          return false;
        }
        input = input ? createLocal(input).utcOffset() : 0;
        return (this.utcOffset() - input) % 60 === 0;
      }
      function isDaylightSavingTime() {
        return this.utcOffset() > this.clone().month(0).utcOffset() || this.utcOffset() > this.clone().month(5).utcOffset();
      }
      function isDaylightSavingTimeShifted() {
        if (!isUndefined(this._isDSTShifted)) {
          return this._isDSTShifted;
        }
        var c = {}, other;
        copyConfig(c, this);
        c = prepareConfig(c);
        if (c._a) {
          other = c._isUTC ? createUTC(c._a) : createLocal(c._a);
          this._isDSTShifted = this.isValid() && compareArrays(c._a, other.toArray()) > 0;
        } else {
          this._isDSTShifted = false;
        }
        return this._isDSTShifted;
      }
      function isLocal() {
        return this.isValid() ? !this._isUTC : false;
      }
      function isUtcOffset() {
        return this.isValid() ? this._isUTC : false;
      }
      function isUtc() {
        return this.isValid() ? this._isUTC && this._offset === 0 : false;
      }
      var aspNetRegex = /^(-|\+)?(?:(\d*)[. ])?(\d+):(\d+)(?::(\d+)(\.\d*)?)?$/, isoRegex = /^(-|\+)?P(?:([-+]?[0-9,.]*)Y)?(?:([-+]?[0-9,.]*)M)?(?:([-+]?[0-9,.]*)W)?(?:([-+]?[0-9,.]*)D)?(?:T(?:([-+]?[0-9,.]*)H)?(?:([-+]?[0-9,.]*)M)?(?:([-+]?[0-9,.]*)S)?)?$/;
      function createDuration(input, key2) {
        var duration = input, match = null, sign2, ret, diffRes;
        if (isDuration(input)) {
          duration = {
            ms: input._milliseconds,
            d: input._days,
            M: input._months
          };
        } else if (isNumber(input) || !isNaN(+input)) {
          duration = {};
          if (key2) {
            duration[key2] = +input;
          } else {
            duration.milliseconds = +input;
          }
        } else if (match = aspNetRegex.exec(input)) {
          sign2 = match[1] === "-" ? -1 : 1;
          duration = {
            y: 0,
            d: toInt(match[DATE]) * sign2,
            h: toInt(match[HOUR]) * sign2,
            m: toInt(match[MINUTE]) * sign2,
            s: toInt(match[SECOND]) * sign2,
            ms: toInt(absRound(match[MILLISECOND] * 1e3)) * sign2
          };
        } else if (match = isoRegex.exec(input)) {
          sign2 = match[1] === "-" ? -1 : 1;
          duration = {
            y: parseIso(match[2], sign2),
            M: parseIso(match[3], sign2),
            w: parseIso(match[4], sign2),
            d: parseIso(match[5], sign2),
            h: parseIso(match[6], sign2),
            m: parseIso(match[7], sign2),
            s: parseIso(match[8], sign2)
          };
        } else if (duration == null) {
          duration = {};
        } else if (typeof duration === "object" && ("from" in duration || "to" in duration)) {
          diffRes = momentsDifference(createLocal(duration.from), createLocal(duration.to));
          duration = {};
          duration.ms = diffRes.milliseconds;
          duration.M = diffRes.months;
        }
        ret = new Duration(duration);
        if (isDuration(input) && hasOwnProp(input, "_locale")) {
          ret._locale = input._locale;
        }
        if (isDuration(input) && hasOwnProp(input, "_isValid")) {
          ret._isValid = input._isValid;
        }
        return ret;
      }
      createDuration.fn = Duration.prototype;
      createDuration.invalid = createInvalid$1;
      function parseIso(inp, sign2) {
        var res = inp && parseFloat(inp.replace(",", "."));
        return (isNaN(res) ? 0 : res) * sign2;
      }
      function positiveMomentsDifference(base, other) {
        var res = {};
        res.months = other.month() - base.month() + (other.year() - base.year()) * 12;
        if (base.clone().add(res.months, "M").isAfter(other)) {
          --res.months;
        }
        res.milliseconds = +other - +base.clone().add(res.months, "M");
        return res;
      }
      function momentsDifference(base, other) {
        var res;
        if (!(base.isValid() && other.isValid())) {
          return { milliseconds: 0, months: 0 };
        }
        other = cloneWithOffset(other, base);
        if (base.isBefore(other)) {
          res = positiveMomentsDifference(base, other);
        } else {
          res = positiveMomentsDifference(other, base);
          res.milliseconds = -res.milliseconds;
          res.months = -res.months;
        }
        return res;
      }
      function createAdder(direction, name) {
        return function(val, period) {
          var dur, tmp;
          if (period !== null && !isNaN(+period)) {
            deprecateSimple(name, "moment()." + name + "(period, number) is deprecated. Please use moment()." + name + "(number, period). See http://momentjs.com/guides/#/warnings/add-inverted-param/ for more info.");
            tmp = val;
            val = period;
            period = tmp;
          }
          dur = createDuration(val, period);
          addSubtract(this, dur, direction);
          return this;
        };
      }
      function addSubtract(mom, duration, isAdding, updateOffset) {
        var milliseconds2 = duration._milliseconds, days2 = absRound(duration._days), months2 = absRound(duration._months);
        if (!mom.isValid()) {
          return;
        }
        updateOffset = updateOffset == null ? true : updateOffset;
        if (months2) {
          setMonth(mom, get(mom, "Month") + months2 * isAdding);
        }
        if (days2) {
          set$1(mom, "Date", get(mom, "Date") + days2 * isAdding);
        }
        if (milliseconds2) {
          mom._d.setTime(mom._d.valueOf() + milliseconds2 * isAdding);
        }
        if (updateOffset) {
          hooks.updateOffset(mom, days2 || months2);
        }
      }
      var add = createAdder(1, "add"), subtract = createAdder(-1, "subtract");
      function isString(input) {
        return typeof input === "string" || input instanceof String;
      }
      function isMomentInput(input) {
        return isMoment(input) || isDate(input) || isString(input) || isNumber(input) || isNumberOrStringArray(input) || isMomentInputObject(input) || input === null || input === void 0;
      }
      function isMomentInputObject(input) {
        var objectTest = isObject(input) && !isObjectEmpty(input), propertyTest = false, properties = [
          "years",
          "year",
          "y",
          "months",
          "month",
          "M",
          "days",
          "day",
          "d",
          "dates",
          "date",
          "D",
          "hours",
          "hour",
          "h",
          "minutes",
          "minute",
          "m",
          "seconds",
          "second",
          "s",
          "milliseconds",
          "millisecond",
          "ms"
        ], i, property, propertyLen = properties.length;
        for (i = 0; i < propertyLen; i += 1) {
          property = properties[i];
          propertyTest = propertyTest || hasOwnProp(input, property);
        }
        return objectTest && propertyTest;
      }
      function isNumberOrStringArray(input) {
        var arrayTest = isArray(input), dataTypeTest = false;
        if (arrayTest) {
          dataTypeTest = input.filter(function(item) {
            return !isNumber(item) && isString(input);
          }).length === 0;
        }
        return arrayTest && dataTypeTest;
      }
      function isCalendarSpec(input) {
        var objectTest = isObject(input) && !isObjectEmpty(input), propertyTest = false, properties = [
          "sameDay",
          "nextDay",
          "lastDay",
          "nextWeek",
          "lastWeek",
          "sameElse"
        ], i, property;
        for (i = 0; i < properties.length; i += 1) {
          property = properties[i];
          propertyTest = propertyTest || hasOwnProp(input, property);
        }
        return objectTest && propertyTest;
      }
      function getCalendarFormat(myMoment, now2) {
        var diff2 = myMoment.diff(now2, "days", true);
        return diff2 < -6 ? "sameElse" : diff2 < -1 ? "lastWeek" : diff2 < 0 ? "lastDay" : diff2 < 1 ? "sameDay" : diff2 < 2 ? "nextDay" : diff2 < 7 ? "nextWeek" : "sameElse";
      }
      function calendar$1(time, formats) {
        if (arguments.length === 1) {
          if (!arguments[0]) {
            time = void 0;
            formats = void 0;
          } else if (isMomentInput(arguments[0])) {
            time = arguments[0];
            formats = void 0;
          } else if (isCalendarSpec(arguments[0])) {
            formats = arguments[0];
            time = void 0;
          }
        }
        var now2 = time || createLocal(), sod = cloneWithOffset(now2, this).startOf("day"), format2 = hooks.calendarFormat(this, sod) || "sameElse", output = formats && (isFunction(formats[format2]) ? formats[format2].call(this, now2) : formats[format2]);
        return this.format(output || this.localeData().calendar(format2, this, createLocal(now2)));
      }
      function clone() {
        return new Moment2(this);
      }
      function isAfter(input, units) {
        var localInput = isMoment(input) ? input : createLocal(input);
        if (!(this.isValid() && localInput.isValid())) {
          return false;
        }
        units = normalizeUnits(units) || "millisecond";
        if (units === "millisecond") {
          return this.valueOf() > localInput.valueOf();
        } else {
          return localInput.valueOf() < this.clone().startOf(units).valueOf();
        }
      }
      function isBefore(input, units) {
        var localInput = isMoment(input) ? input : createLocal(input);
        if (!(this.isValid() && localInput.isValid())) {
          return false;
        }
        units = normalizeUnits(units) || "millisecond";
        if (units === "millisecond") {
          return this.valueOf() < localInput.valueOf();
        } else {
          return this.clone().endOf(units).valueOf() < localInput.valueOf();
        }
      }
      function isBetween(from2, to2, units, inclusivity) {
        var localFrom = isMoment(from2) ? from2 : createLocal(from2), localTo = isMoment(to2) ? to2 : createLocal(to2);
        if (!(this.isValid() && localFrom.isValid() && localTo.isValid())) {
          return false;
        }
        inclusivity = inclusivity || "()";
        return (inclusivity[0] === "(" ? this.isAfter(localFrom, units) : !this.isBefore(localFrom, units)) && (inclusivity[1] === ")" ? this.isBefore(localTo, units) : !this.isAfter(localTo, units));
      }
      function isSame(input, units) {
        var localInput = isMoment(input) ? input : createLocal(input), inputMs;
        if (!(this.isValid() && localInput.isValid())) {
          return false;
        }
        units = normalizeUnits(units) || "millisecond";
        if (units === "millisecond") {
          return this.valueOf() === localInput.valueOf();
        } else {
          inputMs = localInput.valueOf();
          return this.clone().startOf(units).valueOf() <= inputMs && inputMs <= this.clone().endOf(units).valueOf();
        }
      }
      function isSameOrAfter(input, units) {
        return this.isSame(input, units) || this.isAfter(input, units);
      }
      function isSameOrBefore(input, units) {
        return this.isSame(input, units) || this.isBefore(input, units);
      }
      function diff(input, units, asFloat) {
        var that, zoneDelta, output;
        if (!this.isValid()) {
          return NaN;
        }
        that = cloneWithOffset(input, this);
        if (!that.isValid()) {
          return NaN;
        }
        zoneDelta = (that.utcOffset() - this.utcOffset()) * 6e4;
        units = normalizeUnits(units);
        switch (units) {
          case "year":
            output = monthDiff(this, that) / 12;
            break;
          case "month":
            output = monthDiff(this, that);
            break;
          case "quarter":
            output = monthDiff(this, that) / 3;
            break;
          case "second":
            output = (this - that) / 1e3;
            break;
          case "minute":
            output = (this - that) / 6e4;
            break;
          case "hour":
            output = (this - that) / 36e5;
            break;
          case "day":
            output = (this - that - zoneDelta) / 864e5;
            break;
          case "week":
            output = (this - that - zoneDelta) / 6048e5;
            break;
          default:
            output = this - that;
        }
        return asFloat ? output : absFloor(output);
      }
      function monthDiff(a, b) {
        if (a.date() < b.date()) {
          return -monthDiff(b, a);
        }
        var wholeMonthDiff = (b.year() - a.year()) * 12 + (b.month() - a.month()), anchor = a.clone().add(wholeMonthDiff, "months"), anchor2, adjust;
        if (b - anchor < 0) {
          anchor2 = a.clone().add(wholeMonthDiff - 1, "months");
          adjust = (b - anchor) / (anchor - anchor2);
        } else {
          anchor2 = a.clone().add(wholeMonthDiff + 1, "months");
          adjust = (b - anchor) / (anchor2 - anchor);
        }
        return -(wholeMonthDiff + adjust) || 0;
      }
      hooks.defaultFormat = "YYYY-MM-DDTHH:mm:ssZ";
      hooks.defaultFormatUtc = "YYYY-MM-DDTHH:mm:ss[Z]";
      function toString() {
        return this.clone().locale("en").format("ddd MMM DD YYYY HH:mm:ss [GMT]ZZ");
      }
      function toISOString(keepOffset) {
        if (!this.isValid()) {
          return null;
        }
        var utc = keepOffset !== true, m = utc ? this.clone().utc() : this;
        if (m.year() < 0 || m.year() > 9999) {
          return formatMoment(m, utc ? "YYYYYY-MM-DD[T]HH:mm:ss.SSS[Z]" : "YYYYYY-MM-DD[T]HH:mm:ss.SSSZ");
        }
        if (isFunction(Date.prototype.toISOString)) {
          if (utc) {
            return this.toDate().toISOString();
          } else {
            return new Date(this.valueOf() + this.utcOffset() * 60 * 1e3).toISOString().replace("Z", formatMoment(m, "Z"));
          }
        }
        return formatMoment(m, utc ? "YYYY-MM-DD[T]HH:mm:ss.SSS[Z]" : "YYYY-MM-DD[T]HH:mm:ss.SSSZ");
      }
      function inspect() {
        if (!this.isValid()) {
          return "moment.invalid(/* " + this._i + " */)";
        }
        var func = "moment", zone = "", prefix, year, datetime, suffix;
        if (!this.isLocal()) {
          func = this.utcOffset() === 0 ? "moment.utc" : "moment.parseZone";
          zone = "Z";
        }
        prefix = "[" + func + '("]';
        year = 0 <= this.year() && this.year() <= 9999 ? "YYYY" : "YYYYYY";
        datetime = "-MM-DD[T]HH:mm:ss.SSS";
        suffix = zone + '[")]';
        return this.format(prefix + year + datetime + suffix);
      }
      function format(inputString) {
        if (!inputString) {
          inputString = this.isUtc() ? hooks.defaultFormatUtc : hooks.defaultFormat;
        }
        var output = formatMoment(this, inputString);
        return this.localeData().postformat(output);
      }
      function from(time, withoutSuffix) {
        if (this.isValid() && (isMoment(time) && time.isValid() || createLocal(time).isValid())) {
          return createDuration({ to: this, from: time }).locale(this.locale()).humanize(!withoutSuffix);
        } else {
          return this.localeData().invalidDate();
        }
      }
      function fromNow(withoutSuffix) {
        return this.from(createLocal(), withoutSuffix);
      }
      function to(time, withoutSuffix) {
        if (this.isValid() && (isMoment(time) && time.isValid() || createLocal(time).isValid())) {
          return createDuration({ from: this, to: time }).locale(this.locale()).humanize(!withoutSuffix);
        } else {
          return this.localeData().invalidDate();
        }
      }
      function toNow(withoutSuffix) {
        return this.to(createLocal(), withoutSuffix);
      }
      function locale(key2) {
        var newLocaleData;
        if (key2 === void 0) {
          return this._locale._abbr;
        } else {
          newLocaleData = getLocale(key2);
          if (newLocaleData != null) {
            this._locale = newLocaleData;
          }
          return this;
        }
      }
      var lang = deprecate("moment().lang() is deprecated. Instead, use moment().localeData() to get the language configuration. Use moment().locale() to change languages.", function(key2) {
        if (key2 === void 0) {
          return this.localeData();
        } else {
          return this.locale(key2);
        }
      });
      function localeData() {
        return this._locale;
      }
      var MS_PER_SECOND = 1e3, MS_PER_MINUTE = 60 * MS_PER_SECOND, MS_PER_HOUR = 60 * MS_PER_MINUTE, MS_PER_400_YEARS = (365 * 400 + 97) * 24 * MS_PER_HOUR;
      function mod$1(dividend, divisor) {
        return (dividend % divisor + divisor) % divisor;
      }
      function localStartOfDate(y, m, d) {
        if (y < 100 && y >= 0) {
          return new Date(y + 400, m, d) - MS_PER_400_YEARS;
        } else {
          return new Date(y, m, d).valueOf();
        }
      }
      function utcStartOfDate(y, m, d) {
        if (y < 100 && y >= 0) {
          return Date.UTC(y + 400, m, d) - MS_PER_400_YEARS;
        } else {
          return Date.UTC(y, m, d);
        }
      }
      function startOf(units) {
        var time, startOfDate;
        units = normalizeUnits(units);
        if (units === void 0 || units === "millisecond" || !this.isValid()) {
          return this;
        }
        startOfDate = this._isUTC ? utcStartOfDate : localStartOfDate;
        switch (units) {
          case "year":
            time = startOfDate(this.year(), 0, 1);
            break;
          case "quarter":
            time = startOfDate(this.year(), this.month() - this.month() % 3, 1);
            break;
          case "month":
            time = startOfDate(this.year(), this.month(), 1);
            break;
          case "week":
            time = startOfDate(this.year(), this.month(), this.date() - this.weekday());
            break;
          case "isoWeek":
            time = startOfDate(this.year(), this.month(), this.date() - (this.isoWeekday() - 1));
            break;
          case "day":
          case "date":
            time = startOfDate(this.year(), this.month(), this.date());
            break;
          case "hour":
            time = this._d.valueOf();
            time -= mod$1(time + (this._isUTC ? 0 : this.utcOffset() * MS_PER_MINUTE), MS_PER_HOUR);
            break;
          case "minute":
            time = this._d.valueOf();
            time -= mod$1(time, MS_PER_MINUTE);
            break;
          case "second":
            time = this._d.valueOf();
            time -= mod$1(time, MS_PER_SECOND);
            break;
        }
        this._d.setTime(time);
        hooks.updateOffset(this, true);
        return this;
      }
      function endOf(units) {
        var time, startOfDate;
        units = normalizeUnits(units);
        if (units === void 0 || units === "millisecond" || !this.isValid()) {
          return this;
        }
        startOfDate = this._isUTC ? utcStartOfDate : localStartOfDate;
        switch (units) {
          case "year":
            time = startOfDate(this.year() + 1, 0, 1) - 1;
            break;
          case "quarter":
            time = startOfDate(this.year(), this.month() - this.month() % 3 + 3, 1) - 1;
            break;
          case "month":
            time = startOfDate(this.year(), this.month() + 1, 1) - 1;
            break;
          case "week":
            time = startOfDate(this.year(), this.month(), this.date() - this.weekday() + 7) - 1;
            break;
          case "isoWeek":
            time = startOfDate(this.year(), this.month(), this.date() - (this.isoWeekday() - 1) + 7) - 1;
            break;
          case "day":
          case "date":
            time = startOfDate(this.year(), this.month(), this.date() + 1) - 1;
            break;
          case "hour":
            time = this._d.valueOf();
            time += MS_PER_HOUR - mod$1(time + (this._isUTC ? 0 : this.utcOffset() * MS_PER_MINUTE), MS_PER_HOUR) - 1;
            break;
          case "minute":
            time = this._d.valueOf();
            time += MS_PER_MINUTE - mod$1(time, MS_PER_MINUTE) - 1;
            break;
          case "second":
            time = this._d.valueOf();
            time += MS_PER_SECOND - mod$1(time, MS_PER_SECOND) - 1;
            break;
        }
        this._d.setTime(time);
        hooks.updateOffset(this, true);
        return this;
      }
      function valueOf() {
        return this._d.valueOf() - (this._offset || 0) * 6e4;
      }
      function unix() {
        return Math.floor(this.valueOf() / 1e3);
      }
      function toDate() {
        return new Date(this.valueOf());
      }
      function toArray() {
        var m = this;
        return [
          m.year(),
          m.month(),
          m.date(),
          m.hour(),
          m.minute(),
          m.second(),
          m.millisecond()
        ];
      }
      function toObject() {
        var m = this;
        return {
          years: m.year(),
          months: m.month(),
          date: m.date(),
          hours: m.hours(),
          minutes: m.minutes(),
          seconds: m.seconds(),
          milliseconds: m.milliseconds()
        };
      }
      function toJSON() {
        return this.isValid() ? this.toISOString() : null;
      }
      function isValid$2() {
        return isValid(this);
      }
      function parsingFlags() {
        return extend2({}, getParsingFlags(this));
      }
      function invalidAt() {
        return getParsingFlags(this).overflow;
      }
      function creationData() {
        return {
          input: this._i,
          format: this._f,
          locale: this._locale,
          isUTC: this._isUTC,
          strict: this._strict
        };
      }
      addFormatToken("N", 0, 0, "eraAbbr");
      addFormatToken("NN", 0, 0, "eraAbbr");
      addFormatToken("NNN", 0, 0, "eraAbbr");
      addFormatToken("NNNN", 0, 0, "eraName");
      addFormatToken("NNNNN", 0, 0, "eraNarrow");
      addFormatToken("y", ["y", 1], "yo", "eraYear");
      addFormatToken("y", ["yy", 2], 0, "eraYear");
      addFormatToken("y", ["yyy", 3], 0, "eraYear");
      addFormatToken("y", ["yyyy", 4], 0, "eraYear");
      addRegexToken("N", matchEraAbbr);
      addRegexToken("NN", matchEraAbbr);
      addRegexToken("NNN", matchEraAbbr);
      addRegexToken("NNNN", matchEraName);
      addRegexToken("NNNNN", matchEraNarrow);
      addParseToken(["N", "NN", "NNN", "NNNN", "NNNNN"], function(input, array, config, token2) {
        var era = config._locale.erasParse(input, token2, config._strict);
        if (era) {
          getParsingFlags(config).era = era;
        } else {
          getParsingFlags(config).invalidEra = input;
        }
      });
      addRegexToken("y", matchUnsigned);
      addRegexToken("yy", matchUnsigned);
      addRegexToken("yyy", matchUnsigned);
      addRegexToken("yyyy", matchUnsigned);
      addRegexToken("yo", matchEraYearOrdinal);
      addParseToken(["y", "yy", "yyy", "yyyy"], YEAR);
      addParseToken(["yo"], function(input, array, config, token2) {
        var match;
        if (config._locale._eraYearOrdinalRegex) {
          match = input.match(config._locale._eraYearOrdinalRegex);
        }
        if (config._locale.eraYearOrdinalParse) {
          array[YEAR] = config._locale.eraYearOrdinalParse(input, match);
        } else {
          array[YEAR] = parseInt(input, 10);
        }
      });
      function localeEras(m, format2) {
        var i, l, date, eras = this._eras || getLocale("en")._eras;
        for (i = 0, l = eras.length; i < l; ++i) {
          switch (typeof eras[i].since) {
            case "string":
              date = hooks(eras[i].since).startOf("day");
              eras[i].since = date.valueOf();
              break;
          }
          switch (typeof eras[i].until) {
            case "undefined":
              eras[i].until = Infinity;
              break;
            case "string":
              date = hooks(eras[i].until).startOf("day").valueOf();
              eras[i].until = date.valueOf();
              break;
          }
        }
        return eras;
      }
      function localeErasParse(eraName, format2, strict) {
        var i, l, eras = this.eras(), name, abbr, narrow;
        eraName = eraName.toUpperCase();
        for (i = 0, l = eras.length; i < l; ++i) {
          name = eras[i].name.toUpperCase();
          abbr = eras[i].abbr.toUpperCase();
          narrow = eras[i].narrow.toUpperCase();
          if (strict) {
            switch (format2) {
              case "N":
              case "NN":
              case "NNN":
                if (abbr === eraName) {
                  return eras[i];
                }
                break;
              case "NNNN":
                if (name === eraName) {
                  return eras[i];
                }
                break;
              case "NNNNN":
                if (narrow === eraName) {
                  return eras[i];
                }
                break;
            }
          } else if ([name, abbr, narrow].indexOf(eraName) >= 0) {
            return eras[i];
          }
        }
      }
      function localeErasConvertYear(era, year) {
        var dir = era.since <= era.until ? 1 : -1;
        if (year === void 0) {
          return hooks(era.since).year();
        } else {
          return hooks(era.since).year() + (year - era.offset) * dir;
        }
      }
      function getEraName() {
        var i, l, val, eras = this.localeData().eras();
        for (i = 0, l = eras.length; i < l; ++i) {
          val = this.clone().startOf("day").valueOf();
          if (eras[i].since <= val && val <= eras[i].until) {
            return eras[i].name;
          }
          if (eras[i].until <= val && val <= eras[i].since) {
            return eras[i].name;
          }
        }
        return "";
      }
      function getEraNarrow() {
        var i, l, val, eras = this.localeData().eras();
        for (i = 0, l = eras.length; i < l; ++i) {
          val = this.clone().startOf("day").valueOf();
          if (eras[i].since <= val && val <= eras[i].until) {
            return eras[i].narrow;
          }
          if (eras[i].until <= val && val <= eras[i].since) {
            return eras[i].narrow;
          }
        }
        return "";
      }
      function getEraAbbr() {
        var i, l, val, eras = this.localeData().eras();
        for (i = 0, l = eras.length; i < l; ++i) {
          val = this.clone().startOf("day").valueOf();
          if (eras[i].since <= val && val <= eras[i].until) {
            return eras[i].abbr;
          }
          if (eras[i].until <= val && val <= eras[i].since) {
            return eras[i].abbr;
          }
        }
        return "";
      }
      function getEraYear() {
        var i, l, dir, val, eras = this.localeData().eras();
        for (i = 0, l = eras.length; i < l; ++i) {
          dir = eras[i].since <= eras[i].until ? 1 : -1;
          val = this.clone().startOf("day").valueOf();
          if (eras[i].since <= val && val <= eras[i].until || eras[i].until <= val && val <= eras[i].since) {
            return (this.year() - hooks(eras[i].since).year()) * dir + eras[i].offset;
          }
        }
        return this.year();
      }
      function erasNameRegex(isStrict) {
        if (!hasOwnProp(this, "_erasNameRegex")) {
          computeErasParse.call(this);
        }
        return isStrict ? this._erasNameRegex : this._erasRegex;
      }
      function erasAbbrRegex(isStrict) {
        if (!hasOwnProp(this, "_erasAbbrRegex")) {
          computeErasParse.call(this);
        }
        return isStrict ? this._erasAbbrRegex : this._erasRegex;
      }
      function erasNarrowRegex(isStrict) {
        if (!hasOwnProp(this, "_erasNarrowRegex")) {
          computeErasParse.call(this);
        }
        return isStrict ? this._erasNarrowRegex : this._erasRegex;
      }
      function matchEraAbbr(isStrict, locale2) {
        return locale2.erasAbbrRegex(isStrict);
      }
      function matchEraName(isStrict, locale2) {
        return locale2.erasNameRegex(isStrict);
      }
      function matchEraNarrow(isStrict, locale2) {
        return locale2.erasNarrowRegex(isStrict);
      }
      function matchEraYearOrdinal(isStrict, locale2) {
        return locale2._eraYearOrdinalRegex || matchUnsigned;
      }
      function computeErasParse() {
        var abbrPieces = [], namePieces = [], narrowPieces = [], mixedPieces = [], i, l, eras = this.eras();
        for (i = 0, l = eras.length; i < l; ++i) {
          namePieces.push(regexEscape(eras[i].name));
          abbrPieces.push(regexEscape(eras[i].abbr));
          narrowPieces.push(regexEscape(eras[i].narrow));
          mixedPieces.push(regexEscape(eras[i].name));
          mixedPieces.push(regexEscape(eras[i].abbr));
          mixedPieces.push(regexEscape(eras[i].narrow));
        }
        this._erasRegex = new RegExp("^(" + mixedPieces.join("|") + ")", "i");
        this._erasNameRegex = new RegExp("^(" + namePieces.join("|") + ")", "i");
        this._erasAbbrRegex = new RegExp("^(" + abbrPieces.join("|") + ")", "i");
        this._erasNarrowRegex = new RegExp("^(" + narrowPieces.join("|") + ")", "i");
      }
      addFormatToken(0, ["gg", 2], 0, function() {
        return this.weekYear() % 100;
      });
      addFormatToken(0, ["GG", 2], 0, function() {
        return this.isoWeekYear() % 100;
      });
      function addWeekYearFormatToken(token2, getter) {
        addFormatToken(0, [token2, token2.length], 0, getter);
      }
      addWeekYearFormatToken("gggg", "weekYear");
      addWeekYearFormatToken("ggggg", "weekYear");
      addWeekYearFormatToken("GGGG", "isoWeekYear");
      addWeekYearFormatToken("GGGGG", "isoWeekYear");
      addUnitAlias("weekYear", "gg");
      addUnitAlias("isoWeekYear", "GG");
      addUnitPriority("weekYear", 1);
      addUnitPriority("isoWeekYear", 1);
      addRegexToken("G", matchSigned);
      addRegexToken("g", matchSigned);
      addRegexToken("GG", match1to2, match2);
      addRegexToken("gg", match1to2, match2);
      addRegexToken("GGGG", match1to4, match4);
      addRegexToken("gggg", match1to4, match4);
      addRegexToken("GGGGG", match1to6, match6);
      addRegexToken("ggggg", match1to6, match6);
      addWeekParseToken(["gggg", "ggggg", "GGGG", "GGGGG"], function(input, week, config, token2) {
        week[token2.substr(0, 2)] = toInt(input);
      });
      addWeekParseToken(["gg", "GG"], function(input, week, config, token2) {
        week[token2] = hooks.parseTwoDigitYear(input);
      });
      function getSetWeekYear(input) {
        return getSetWeekYearHelper.call(this, input, this.week(), this.weekday(), this.localeData()._week.dow, this.localeData()._week.doy);
      }
      function getSetISOWeekYear(input) {
        return getSetWeekYearHelper.call(this, input, this.isoWeek(), this.isoWeekday(), 1, 4);
      }
      function getISOWeeksInYear() {
        return weeksInYear(this.year(), 1, 4);
      }
      function getISOWeeksInISOWeekYear() {
        return weeksInYear(this.isoWeekYear(), 1, 4);
      }
      function getWeeksInYear() {
        var weekInfo = this.localeData()._week;
        return weeksInYear(this.year(), weekInfo.dow, weekInfo.doy);
      }
      function getWeeksInWeekYear() {
        var weekInfo = this.localeData()._week;
        return weeksInYear(this.weekYear(), weekInfo.dow, weekInfo.doy);
      }
      function getSetWeekYearHelper(input, week, weekday, dow, doy) {
        var weeksTarget;
        if (input == null) {
          return weekOfYear(this, dow, doy).year;
        } else {
          weeksTarget = weeksInYear(input, dow, doy);
          if (week > weeksTarget) {
            week = weeksTarget;
          }
          return setWeekAll.call(this, input, week, weekday, dow, doy);
        }
      }
      function setWeekAll(weekYear, week, weekday, dow, doy) {
        var dayOfYearData = dayOfYearFromWeeks(weekYear, week, weekday, dow, doy), date = createUTCDate(dayOfYearData.year, 0, dayOfYearData.dayOfYear);
        this.year(date.getUTCFullYear());
        this.month(date.getUTCMonth());
        this.date(date.getUTCDate());
        return this;
      }
      addFormatToken("Q", 0, "Qo", "quarter");
      addUnitAlias("quarter", "Q");
      addUnitPriority("quarter", 7);
      addRegexToken("Q", match1);
      addParseToken("Q", function(input, array) {
        array[MONTH] = (toInt(input) - 1) * 3;
      });
      function getSetQuarter(input) {
        return input == null ? Math.ceil((this.month() + 1) / 3) : this.month((input - 1) * 3 + this.month() % 3);
      }
      addFormatToken("D", ["DD", 2], "Do", "date");
      addUnitAlias("date", "D");
      addUnitPriority("date", 9);
      addRegexToken("D", match1to2);
      addRegexToken("DD", match1to2, match2);
      addRegexToken("Do", function(isStrict, locale2) {
        return isStrict ? locale2._dayOfMonthOrdinalParse || locale2._ordinalParse : locale2._dayOfMonthOrdinalParseLenient;
      });
      addParseToken(["D", "DD"], DATE);
      addParseToken("Do", function(input, array) {
        array[DATE] = toInt(input.match(match1to2)[0]);
      });
      var getSetDayOfMonth = makeGetSet("Date", true);
      addFormatToken("DDD", ["DDDD", 3], "DDDo", "dayOfYear");
      addUnitAlias("dayOfYear", "DDD");
      addUnitPriority("dayOfYear", 4);
      addRegexToken("DDD", match1to3);
      addRegexToken("DDDD", match3);
      addParseToken(["DDD", "DDDD"], function(input, array, config) {
        config._dayOfYear = toInt(input);
      });
      function getSetDayOfYear(input) {
        var dayOfYear = Math.round((this.clone().startOf("day") - this.clone().startOf("year")) / 864e5) + 1;
        return input == null ? dayOfYear : this.add(input - dayOfYear, "d");
      }
      addFormatToken("m", ["mm", 2], 0, "minute");
      addUnitAlias("minute", "m");
      addUnitPriority("minute", 14);
      addRegexToken("m", match1to2);
      addRegexToken("mm", match1to2, match2);
      addParseToken(["m", "mm"], MINUTE);
      var getSetMinute = makeGetSet("Minutes", false);
      addFormatToken("s", ["ss", 2], 0, "second");
      addUnitAlias("second", "s");
      addUnitPriority("second", 15);
      addRegexToken("s", match1to2);
      addRegexToken("ss", match1to2, match2);
      addParseToken(["s", "ss"], SECOND);
      var getSetSecond = makeGetSet("Seconds", false);
      addFormatToken("S", 0, 0, function() {
        return ~~(this.millisecond() / 100);
      });
      addFormatToken(0, ["SS", 2], 0, function() {
        return ~~(this.millisecond() / 10);
      });
      addFormatToken(0, ["SSS", 3], 0, "millisecond");
      addFormatToken(0, ["SSSS", 4], 0, function() {
        return this.millisecond() * 10;
      });
      addFormatToken(0, ["SSSSS", 5], 0, function() {
        return this.millisecond() * 100;
      });
      addFormatToken(0, ["SSSSSS", 6], 0, function() {
        return this.millisecond() * 1e3;
      });
      addFormatToken(0, ["SSSSSSS", 7], 0, function() {
        return this.millisecond() * 1e4;
      });
      addFormatToken(0, ["SSSSSSSS", 8], 0, function() {
        return this.millisecond() * 1e5;
      });
      addFormatToken(0, ["SSSSSSSSS", 9], 0, function() {
        return this.millisecond() * 1e6;
      });
      addUnitAlias("millisecond", "ms");
      addUnitPriority("millisecond", 16);
      addRegexToken("S", match1to3, match1);
      addRegexToken("SS", match1to3, match2);
      addRegexToken("SSS", match1to3, match3);
      var token, getSetMillisecond;
      for (token = "SSSS"; token.length <= 9; token += "S") {
        addRegexToken(token, matchUnsigned);
      }
      function parseMs(input, array) {
        array[MILLISECOND] = toInt(("0." + input) * 1e3);
      }
      for (token = "S"; token.length <= 9; token += "S") {
        addParseToken(token, parseMs);
      }
      getSetMillisecond = makeGetSet("Milliseconds", false);
      addFormatToken("z", 0, 0, "zoneAbbr");
      addFormatToken("zz", 0, 0, "zoneName");
      function getZoneAbbr() {
        return this._isUTC ? "UTC" : "";
      }
      function getZoneName() {
        return this._isUTC ? "Coordinated Universal Time" : "";
      }
      var proto = Moment2.prototype;
      proto.add = add;
      proto.calendar = calendar$1;
      proto.clone = clone;
      proto.diff = diff;
      proto.endOf = endOf;
      proto.format = format;
      proto.from = from;
      proto.fromNow = fromNow;
      proto.to = to;
      proto.toNow = toNow;
      proto.get = stringGet;
      proto.invalidAt = invalidAt;
      proto.isAfter = isAfter;
      proto.isBefore = isBefore;
      proto.isBetween = isBetween;
      proto.isSame = isSame;
      proto.isSameOrAfter = isSameOrAfter;
      proto.isSameOrBefore = isSameOrBefore;
      proto.isValid = isValid$2;
      proto.lang = lang;
      proto.locale = locale;
      proto.localeData = localeData;
      proto.max = prototypeMax;
      proto.min = prototypeMin;
      proto.parsingFlags = parsingFlags;
      proto.set = stringSet;
      proto.startOf = startOf;
      proto.subtract = subtract;
      proto.toArray = toArray;
      proto.toObject = toObject;
      proto.toDate = toDate;
      proto.toISOString = toISOString;
      proto.inspect = inspect;
      if (typeof Symbol !== "undefined" && Symbol.for != null) {
        proto[Symbol.for("nodejs.util.inspect.custom")] = function() {
          return "Moment<" + this.format() + ">";
        };
      }
      proto.toJSON = toJSON;
      proto.toString = toString;
      proto.unix = unix;
      proto.valueOf = valueOf;
      proto.creationData = creationData;
      proto.eraName = getEraName;
      proto.eraNarrow = getEraNarrow;
      proto.eraAbbr = getEraAbbr;
      proto.eraYear = getEraYear;
      proto.year = getSetYear;
      proto.isLeapYear = getIsLeapYear;
      proto.weekYear = getSetWeekYear;
      proto.isoWeekYear = getSetISOWeekYear;
      proto.quarter = proto.quarters = getSetQuarter;
      proto.month = getSetMonth;
      proto.daysInMonth = getDaysInMonth;
      proto.week = proto.weeks = getSetWeek;
      proto.isoWeek = proto.isoWeeks = getSetISOWeek;
      proto.weeksInYear = getWeeksInYear;
      proto.weeksInWeekYear = getWeeksInWeekYear;
      proto.isoWeeksInYear = getISOWeeksInYear;
      proto.isoWeeksInISOWeekYear = getISOWeeksInISOWeekYear;
      proto.date = getSetDayOfMonth;
      proto.day = proto.days = getSetDayOfWeek;
      proto.weekday = getSetLocaleDayOfWeek;
      proto.isoWeekday = getSetISODayOfWeek;
      proto.dayOfYear = getSetDayOfYear;
      proto.hour = proto.hours = getSetHour;
      proto.minute = proto.minutes = getSetMinute;
      proto.second = proto.seconds = getSetSecond;
      proto.millisecond = proto.milliseconds = getSetMillisecond;
      proto.utcOffset = getSetOffset;
      proto.utc = setOffsetToUTC;
      proto.local = setOffsetToLocal;
      proto.parseZone = setOffsetToParsedOffset;
      proto.hasAlignedHourOffset = hasAlignedHourOffset;
      proto.isDST = isDaylightSavingTime;
      proto.isLocal = isLocal;
      proto.isUtcOffset = isUtcOffset;
      proto.isUtc = isUtc;
      proto.isUTC = isUtc;
      proto.zoneAbbr = getZoneAbbr;
      proto.zoneName = getZoneName;
      proto.dates = deprecate("dates accessor is deprecated. Use date instead.", getSetDayOfMonth);
      proto.months = deprecate("months accessor is deprecated. Use month instead", getSetMonth);
      proto.years = deprecate("years accessor is deprecated. Use year instead", getSetYear);
      proto.zone = deprecate("moment().zone is deprecated, use moment().utcOffset instead. http://momentjs.com/guides/#/warnings/zone/", getSetZone);
      proto.isDSTShifted = deprecate("isDSTShifted is deprecated. See http://momentjs.com/guides/#/warnings/dst-shifted/ for more information", isDaylightSavingTimeShifted);
      function createUnix(input) {
        return createLocal(input * 1e3);
      }
      function createInZone() {
        return createLocal.apply(null, arguments).parseZone();
      }
      function preParsePostFormat(string) {
        return string;
      }
      var proto$1 = Locale.prototype;
      proto$1.calendar = calendar;
      proto$1.longDateFormat = longDateFormat;
      proto$1.invalidDate = invalidDate;
      proto$1.ordinal = ordinal;
      proto$1.preparse = preParsePostFormat;
      proto$1.postformat = preParsePostFormat;
      proto$1.relativeTime = relativeTime;
      proto$1.pastFuture = pastFuture;
      proto$1.set = set;
      proto$1.eras = localeEras;
      proto$1.erasParse = localeErasParse;
      proto$1.erasConvertYear = localeErasConvertYear;
      proto$1.erasAbbrRegex = erasAbbrRegex;
      proto$1.erasNameRegex = erasNameRegex;
      proto$1.erasNarrowRegex = erasNarrowRegex;
      proto$1.months = localeMonths;
      proto$1.monthsShort = localeMonthsShort;
      proto$1.monthsParse = localeMonthsParse;
      proto$1.monthsRegex = monthsRegex;
      proto$1.monthsShortRegex = monthsShortRegex;
      proto$1.week = localeWeek;
      proto$1.firstDayOfYear = localeFirstDayOfYear;
      proto$1.firstDayOfWeek = localeFirstDayOfWeek;
      proto$1.weekdays = localeWeekdays;
      proto$1.weekdaysMin = localeWeekdaysMin;
      proto$1.weekdaysShort = localeWeekdaysShort;
      proto$1.weekdaysParse = localeWeekdaysParse;
      proto$1.weekdaysRegex = weekdaysRegex;
      proto$1.weekdaysShortRegex = weekdaysShortRegex;
      proto$1.weekdaysMinRegex = weekdaysMinRegex;
      proto$1.isPM = localeIsPM;
      proto$1.meridiem = localeMeridiem;
      function get$1(format2, index, field, setter) {
        var locale2 = getLocale(), utc = createUTC().set(setter, index);
        return locale2[field](utc, format2);
      }
      function listMonthsImpl(format2, index, field) {
        if (isNumber(format2)) {
          index = format2;
          format2 = void 0;
        }
        format2 = format2 || "";
        if (index != null) {
          return get$1(format2, index, field, "month");
        }
        var i, out = [];
        for (i = 0; i < 12; i++) {
          out[i] = get$1(format2, i, field, "month");
        }
        return out;
      }
      function listWeekdaysImpl(localeSorted, format2, index, field) {
        if (typeof localeSorted === "boolean") {
          if (isNumber(format2)) {
            index = format2;
            format2 = void 0;
          }
          format2 = format2 || "";
        } else {
          format2 = localeSorted;
          index = format2;
          localeSorted = false;
          if (isNumber(format2)) {
            index = format2;
            format2 = void 0;
          }
          format2 = format2 || "";
        }
        var locale2 = getLocale(), shift = localeSorted ? locale2._week.dow : 0, i, out = [];
        if (index != null) {
          return get$1(format2, (index + shift) % 7, field, "day");
        }
        for (i = 0; i < 7; i++) {
          out[i] = get$1(format2, (i + shift) % 7, field, "day");
        }
        return out;
      }
      function listMonths(format2, index) {
        return listMonthsImpl(format2, index, "months");
      }
      function listMonthsShort(format2, index) {
        return listMonthsImpl(format2, index, "monthsShort");
      }
      function listWeekdays(localeSorted, format2, index) {
        return listWeekdaysImpl(localeSorted, format2, index, "weekdays");
      }
      function listWeekdaysShort(localeSorted, format2, index) {
        return listWeekdaysImpl(localeSorted, format2, index, "weekdaysShort");
      }
      function listWeekdaysMin(localeSorted, format2, index) {
        return listWeekdaysImpl(localeSorted, format2, index, "weekdaysMin");
      }
      getSetGlobalLocale("en", {
        eras: [
          {
            since: "0001-01-01",
            until: Infinity,
            offset: 1,
            name: "Anno Domini",
            narrow: "AD",
            abbr: "AD"
          },
          {
            since: "0000-12-31",
            until: -Infinity,
            offset: 1,
            name: "Before Christ",
            narrow: "BC",
            abbr: "BC"
          }
        ],
        dayOfMonthOrdinalParse: /\d{1,2}(th|st|nd|rd)/,
        ordinal: function(number) {
          var b = number % 10, output = toInt(number % 100 / 10) === 1 ? "th" : b === 1 ? "st" : b === 2 ? "nd" : b === 3 ? "rd" : "th";
          return number + output;
        }
      });
      hooks.lang = deprecate("moment.lang is deprecated. Use moment.locale instead.", getSetGlobalLocale);
      hooks.langData = deprecate("moment.langData is deprecated. Use moment.localeData instead.", getLocale);
      var mathAbs = Math.abs;
      function abs() {
        var data = this._data;
        this._milliseconds = mathAbs(this._milliseconds);
        this._days = mathAbs(this._days);
        this._months = mathAbs(this._months);
        data.milliseconds = mathAbs(data.milliseconds);
        data.seconds = mathAbs(data.seconds);
        data.minutes = mathAbs(data.minutes);
        data.hours = mathAbs(data.hours);
        data.months = mathAbs(data.months);
        data.years = mathAbs(data.years);
        return this;
      }
      function addSubtract$1(duration, input, value, direction) {
        var other = createDuration(input, value);
        duration._milliseconds += direction * other._milliseconds;
        duration._days += direction * other._days;
        duration._months += direction * other._months;
        return duration._bubble();
      }
      function add$1(input, value) {
        return addSubtract$1(this, input, value, 1);
      }
      function subtract$1(input, value) {
        return addSubtract$1(this, input, value, -1);
      }
      function absCeil(number) {
        if (number < 0) {
          return Math.floor(number);
        } else {
          return Math.ceil(number);
        }
      }
      function bubble() {
        var milliseconds2 = this._milliseconds, days2 = this._days, months2 = this._months, data = this._data, seconds2, minutes2, hours2, years2, monthsFromDays;
        if (!(milliseconds2 >= 0 && days2 >= 0 && months2 >= 0 || milliseconds2 <= 0 && days2 <= 0 && months2 <= 0)) {
          milliseconds2 += absCeil(monthsToDays(months2) + days2) * 864e5;
          days2 = 0;
          months2 = 0;
        }
        data.milliseconds = milliseconds2 % 1e3;
        seconds2 = absFloor(milliseconds2 / 1e3);
        data.seconds = seconds2 % 60;
        minutes2 = absFloor(seconds2 / 60);
        data.minutes = minutes2 % 60;
        hours2 = absFloor(minutes2 / 60);
        data.hours = hours2 % 24;
        days2 += absFloor(hours2 / 24);
        monthsFromDays = absFloor(daysToMonths(days2));
        months2 += monthsFromDays;
        days2 -= absCeil(monthsToDays(monthsFromDays));
        years2 = absFloor(months2 / 12);
        months2 %= 12;
        data.days = days2;
        data.months = months2;
        data.years = years2;
        return this;
      }
      function daysToMonths(days2) {
        return days2 * 4800 / 146097;
      }
      function monthsToDays(months2) {
        return months2 * 146097 / 4800;
      }
      function as(units) {
        if (!this.isValid()) {
          return NaN;
        }
        var days2, months2, milliseconds2 = this._milliseconds;
        units = normalizeUnits(units);
        if (units === "month" || units === "quarter" || units === "year") {
          days2 = this._days + milliseconds2 / 864e5;
          months2 = this._months + daysToMonths(days2);
          switch (units) {
            case "month":
              return months2;
            case "quarter":
              return months2 / 3;
            case "year":
              return months2 / 12;
          }
        } else {
          days2 = this._days + Math.round(monthsToDays(this._months));
          switch (units) {
            case "week":
              return days2 / 7 + milliseconds2 / 6048e5;
            case "day":
              return days2 + milliseconds2 / 864e5;
            case "hour":
              return days2 * 24 + milliseconds2 / 36e5;
            case "minute":
              return days2 * 1440 + milliseconds2 / 6e4;
            case "second":
              return days2 * 86400 + milliseconds2 / 1e3;
            case "millisecond":
              return Math.floor(days2 * 864e5) + milliseconds2;
            default:
              throw new Error("Unknown unit " + units);
          }
        }
      }
      function valueOf$1() {
        if (!this.isValid()) {
          return NaN;
        }
        return this._milliseconds + this._days * 864e5 + this._months % 12 * 2592e6 + toInt(this._months / 12) * 31536e6;
      }
      function makeAs(alias) {
        return function() {
          return this.as(alias);
        };
      }
      var asMilliseconds = makeAs("ms"), asSeconds = makeAs("s"), asMinutes = makeAs("m"), asHours = makeAs("h"), asDays = makeAs("d"), asWeeks = makeAs("w"), asMonths = makeAs("M"), asQuarters = makeAs("Q"), asYears = makeAs("y");
      function clone$1() {
        return createDuration(this);
      }
      function get$2(units) {
        units = normalizeUnits(units);
        return this.isValid() ? this[units + "s"]() : NaN;
      }
      function makeGetter(name) {
        return function() {
          return this.isValid() ? this._data[name] : NaN;
        };
      }
      var milliseconds = makeGetter("milliseconds"), seconds = makeGetter("seconds"), minutes = makeGetter("minutes"), hours = makeGetter("hours"), days = makeGetter("days"), months = makeGetter("months"), years = makeGetter("years");
      function weeks() {
        return absFloor(this.days() / 7);
      }
      var round = Math.round, thresholds = {
        ss: 44,
        s: 45,
        m: 45,
        h: 22,
        d: 26,
        w: null,
        M: 11
      };
      function substituteTimeAgo(string, number, withoutSuffix, isFuture, locale2) {
        return locale2.relativeTime(number || 1, !!withoutSuffix, string, isFuture);
      }
      function relativeTime$1(posNegDuration, withoutSuffix, thresholds2, locale2) {
        var duration = createDuration(posNegDuration).abs(), seconds2 = round(duration.as("s")), minutes2 = round(duration.as("m")), hours2 = round(duration.as("h")), days2 = round(duration.as("d")), months2 = round(duration.as("M")), weeks2 = round(duration.as("w")), years2 = round(duration.as("y")), a = seconds2 <= thresholds2.ss && ["s", seconds2] || seconds2 < thresholds2.s && ["ss", seconds2] || minutes2 <= 1 && ["m"] || minutes2 < thresholds2.m && ["mm", minutes2] || hours2 <= 1 && ["h"] || hours2 < thresholds2.h && ["hh", hours2] || days2 <= 1 && ["d"] || days2 < thresholds2.d && ["dd", days2];
        if (thresholds2.w != null) {
          a = a || weeks2 <= 1 && ["w"] || weeks2 < thresholds2.w && ["ww", weeks2];
        }
        a = a || months2 <= 1 && ["M"] || months2 < thresholds2.M && ["MM", months2] || years2 <= 1 && ["y"] || ["yy", years2];
        a[2] = withoutSuffix;
        a[3] = +posNegDuration > 0;
        a[4] = locale2;
        return substituteTimeAgo.apply(null, a);
      }
      function getSetRelativeTimeRounding(roundingFunction) {
        if (roundingFunction === void 0) {
          return round;
        }
        if (typeof roundingFunction === "function") {
          round = roundingFunction;
          return true;
        }
        return false;
      }
      function getSetRelativeTimeThreshold(threshold, limit) {
        if (thresholds[threshold] === void 0) {
          return false;
        }
        if (limit === void 0) {
          return thresholds[threshold];
        }
        thresholds[threshold] = limit;
        if (threshold === "s") {
          thresholds.ss = limit - 1;
        }
        return true;
      }
      function humanize(argWithSuffix, argThresholds) {
        if (!this.isValid()) {
          return this.localeData().invalidDate();
        }
        var withSuffix = false, th = thresholds, locale2, output;
        if (typeof argWithSuffix === "object") {
          argThresholds = argWithSuffix;
          argWithSuffix = false;
        }
        if (typeof argWithSuffix === "boolean") {
          withSuffix = argWithSuffix;
        }
        if (typeof argThresholds === "object") {
          th = Object.assign({}, thresholds, argThresholds);
          if (argThresholds.s != null && argThresholds.ss == null) {
            th.ss = argThresholds.s - 1;
          }
        }
        locale2 = this.localeData();
        output = relativeTime$1(this, !withSuffix, th, locale2);
        if (withSuffix) {
          output = locale2.pastFuture(+this, output);
        }
        return locale2.postformat(output);
      }
      var abs$1 = Math.abs;
      function sign(x) {
        return (x > 0) - (x < 0) || +x;
      }
      function toISOString$1() {
        if (!this.isValid()) {
          return this.localeData().invalidDate();
        }
        var seconds2 = abs$1(this._milliseconds) / 1e3, days2 = abs$1(this._days), months2 = abs$1(this._months), minutes2, hours2, years2, s, total = this.asSeconds(), totalSign, ymSign, daysSign, hmsSign;
        if (!total) {
          return "P0D";
        }
        minutes2 = absFloor(seconds2 / 60);
        hours2 = absFloor(minutes2 / 60);
        seconds2 %= 60;
        minutes2 %= 60;
        years2 = absFloor(months2 / 12);
        months2 %= 12;
        s = seconds2 ? seconds2.toFixed(3).replace(/\.?0+$/, "") : "";
        totalSign = total < 0 ? "-" : "";
        ymSign = sign(this._months) !== sign(total) ? "-" : "";
        daysSign = sign(this._days) !== sign(total) ? "-" : "";
        hmsSign = sign(this._milliseconds) !== sign(total) ? "-" : "";
        return totalSign + "P" + (years2 ? ymSign + years2 + "Y" : "") + (months2 ? ymSign + months2 + "M" : "") + (days2 ? daysSign + days2 + "D" : "") + (hours2 || minutes2 || seconds2 ? "T" : "") + (hours2 ? hmsSign + hours2 + "H" : "") + (minutes2 ? hmsSign + minutes2 + "M" : "") + (seconds2 ? hmsSign + s + "S" : "");
      }
      var proto$2 = Duration.prototype;
      proto$2.isValid = isValid$1;
      proto$2.abs = abs;
      proto$2.add = add$1;
      proto$2.subtract = subtract$1;
      proto$2.as = as;
      proto$2.asMilliseconds = asMilliseconds;
      proto$2.asSeconds = asSeconds;
      proto$2.asMinutes = asMinutes;
      proto$2.asHours = asHours;
      proto$2.asDays = asDays;
      proto$2.asWeeks = asWeeks;
      proto$2.asMonths = asMonths;
      proto$2.asQuarters = asQuarters;
      proto$2.asYears = asYears;
      proto$2.valueOf = valueOf$1;
      proto$2._bubble = bubble;
      proto$2.clone = clone$1;
      proto$2.get = get$2;
      proto$2.milliseconds = milliseconds;
      proto$2.seconds = seconds;
      proto$2.minutes = minutes;
      proto$2.hours = hours;
      proto$2.days = days;
      proto$2.weeks = weeks;
      proto$2.months = months;
      proto$2.years = years;
      proto$2.humanize = humanize;
      proto$2.toISOString = toISOString$1;
      proto$2.toString = toISOString$1;
      proto$2.toJSON = toISOString$1;
      proto$2.locale = locale;
      proto$2.localeData = localeData;
      proto$2.toIsoString = deprecate("toIsoString() is deprecated. Please use toISOString() instead (notice the capitals)", toISOString$1);
      proto$2.lang = lang;
      addFormatToken("X", 0, 0, "unix");
      addFormatToken("x", 0, 0, "valueOf");
      addRegexToken("x", matchSigned);
      addRegexToken("X", matchTimestamp);
      addParseToken("X", function(input, array, config) {
        config._d = new Date(parseFloat(input) * 1e3);
      });
      addParseToken("x", function(input, array, config) {
        config._d = new Date(toInt(input));
      });
      hooks.version = "2.29.4";
      setHookCallback(createLocal);
      hooks.fn = proto;
      hooks.min = min;
      hooks.max = max;
      hooks.now = now;
      hooks.utc = createUTC;
      hooks.unix = createUnix;
      hooks.months = listMonths;
      hooks.isDate = isDate;
      hooks.locale = getSetGlobalLocale;
      hooks.invalid = createInvalid;
      hooks.duration = createDuration;
      hooks.isMoment = isMoment;
      hooks.weekdays = listWeekdays;
      hooks.parseZone = createInZone;
      hooks.localeData = getLocale;
      hooks.isDuration = isDuration;
      hooks.monthsShort = listMonthsShort;
      hooks.weekdaysMin = listWeekdaysMin;
      hooks.defineLocale = defineLocale;
      hooks.updateLocale = updateLocale;
      hooks.locales = listLocales;
      hooks.weekdaysShort = listWeekdaysShort;
      hooks.normalizeUnits = normalizeUnits;
      hooks.relativeTimeRounding = getSetRelativeTimeRounding;
      hooks.relativeTimeThreshold = getSetRelativeTimeThreshold;
      hooks.calendarFormat = getCalendarFormat;
      hooks.prototype = proto;
      hooks.HTML5_FMT = {
        DATETIME_LOCAL: "YYYY-MM-DDTHH:mm",
        DATETIME_LOCAL_SECONDS: "YYYY-MM-DDTHH:mm:ss",
        DATETIME_LOCAL_MS: "YYYY-MM-DDTHH:mm:ss.SSS",
        DATE: "YYYY-MM-DD",
        TIME: "HH:mm",
        TIME_SECONDS: "HH:mm:ss",
        TIME_MS: "HH:mm:ss.SSS",
        WEEK: "GGGG-[W]WW",
        MONTH: "YYYY-MM"
      };
      return hooks;
    });
  }
});

// src/index.ts
__export(exports, {
  BarChart: () => BarChart,
  Button: () => Button,
  CardLayout: () => CardLayout,
  CarouselSlider: () => CarouselSlider,
  Checkbox: () => Checkbox,
  ClearObservers: () => ClearObservers,
  CodeDiffEditor: () => CodeDiffEditor,
  CodeEditor: () => CodeEditor,
  ComboBox: () => ComboBox,
  Component: () => Component,
  Container: () => Container,
  Control: () => Control,
  DataGrid: () => DataGrid,
  DataSchemaValidator: () => DataSchemaValidator,
  Datepicker: () => Datepicker,
  EventBus: () => EventBus,
  GridLayout: () => GridLayout,
  HStack: () => HStack,
  IPFS: () => src_exports2,
  Icon: () => Icon,
  Iframe: () => Iframe,
  Image: () => Image2,
  Input: () => Input,
  Label: () => Label,
  LibPath: () => LibPath,
  LineChart: () => LineChart,
  Link: () => Link,
  Markdown: () => Markdown,
  MarkdownEditor: () => MarkdownEditor,
  Menu: () => Menu,
  Modal: () => Modal,
  Module: () => Module,
  Observe: () => Observe,
  Pagination: () => Pagination,
  Panel: () => Panel,
  PieChart: () => PieChart,
  Progress: () => Progress,
  Radio: () => Radio,
  RadioGroup: () => RadioGroup,
  Range: () => Range,
  RequireJS: () => RequireJS,
  ScatterChart: () => ScatterChart,
  ScatterLineChart: () => ScatterLineChart,
  StackLayout: () => StackLayout,
  Styles: () => src_exports,
  Switch: () => Switch,
  Tab: () => Tab,
  Table: () => Table,
  TableCell: () => TableCell,
  TableColumn: () => TableColumn,
  Tabs: () => Tabs,
  Tooltip: () => Tooltip,
  TreeNode: () => TreeNode,
  TreeView: () => TreeView,
  Unobserve: () => Unobserve,
  Upload: () => Upload,
  VStack: () => VStack,
  Video: () => Video,
  application: () => application,
  customElements: () => customElements2,
  customModule: () => customModule,
  isObservable: () => isObservable,
  moment: () => moment,
  observable: () => observable,
  renderUI: () => renderUI
});

// packages/style/src/index.ts
var src_exports = {};
__export(src_exports, {
  Colors: () => Colors,
  Theme: () => theme_exports,
  cssRaw: () => cssRaw,
  cssRule: () => cssRule,
  fontFace: () => fontFace,
  keyframes: () => keyframes,
  rotate: () => rotate,
  style: () => style
});

// packages/style/src/theme.ts
var theme_exports = {};
__export(theme_exports, {
  ColorVars: () => ColorVars,
  Colors: () => Colors,
  ThemeVars: () => ThemeVars,
  applyTheme: () => applyTheme,
  currentTheme: () => currentTheme,
  darkTheme: () => darkTheme,
  defaultTheme: () => defaultTheme
});

// packages/style/src/colors.ts
var amber = {
  50: "#fff8e1",
  100: "#ffecb3",
  200: "#ffe082",
  300: "#ffd54f",
  400: "#ffca28",
  500: "#ffc107",
  600: "#ffb300",
  700: "#ffa000",
  800: "#ff8f00",
  900: "#ff6f00",
  A100: "#ffe57f",
  A200: "#ffd740",
  A400: "#ffc400",
  A700: "#ffab00"
};
var blue = {
  50: "#e3f2fd",
  100: "#bbdefb",
  200: "#90caf9",
  300: "#64b5f6",
  400: "#42a5f5",
  500: "#2196f3",
  600: "#1e88e5",
  700: "#1976d2",
  800: "#1565c0",
  900: "#0d47a1",
  A100: "#82b1ff",
  A200: "#448aff",
  A400: "#2979ff",
  A700: "#2962ff"
};
var blueGrey = {
  50: "#eceff1",
  100: "#cfd8dc",
  200: "#b0bec5",
  300: "#90a4ae",
  400: "#78909c",
  500: "#607d8b",
  600: "#546e7a",
  700: "#455a64",
  800: "#37474f",
  900: "#263238",
  A100: "#cfd8dc",
  A200: "#b0bec5",
  A400: "#78909c",
  A700: "#455a64"
};
var brown = {
  50: "#efebe9",
  100: "#d7ccc8",
  200: "#bcaaa4",
  300: "#a1887f",
  400: "#8d6e63",
  500: "#795548",
  600: "#6d4c41",
  700: "#5d4037",
  800: "#4e342e",
  900: "#3e2723",
  A100: "#d7ccc8",
  A200: "#bcaaa4",
  A400: "#8d6e63",
  A700: "#5d4037"
};
var cyan = {
  50: "#e0f7fa",
  100: "#b2ebf2",
  200: "#80deea",
  300: "#4dd0e1",
  400: "#26c6da",
  500: "#00bcd4",
  600: "#00acc1",
  700: "#0097a7",
  800: "#00838f",
  900: "#006064",
  A100: "#84ffff",
  A200: "#18ffff",
  A400: "#00e5ff",
  A700: "#00b8d4"
};
var deepOrange = {
  50: "#fbe9e7",
  100: "#ffccbc",
  200: "#ffab91",
  300: "#ff8a65",
  400: "#ff7043",
  500: "#ff5722",
  600: "#f4511e",
  700: "#e64a19",
  800: "#d84315",
  900: "#bf360c",
  A100: "#ff9e80",
  A200: "#ff6e40",
  A400: "#ff3d00",
  A700: "#dd2c00"
};
var deepPurple = {
  50: "#ede7f6",
  100: "#d1c4e9",
  200: "#b39ddb",
  300: "#9575cd",
  400: "#7e57c2",
  500: "#673ab7",
  600: "#5e35b1",
  700: "#512da8",
  800: "#4527a0",
  900: "#311b92",
  A100: "#b388ff",
  A200: "#7c4dff",
  A400: "#651fff",
  A700: "#6200ea"
};
var green = {
  50: "#e8f5e9",
  100: "#c8e6c9",
  200: "#a5d6a7",
  300: "#81c784",
  400: "#66bb6a",
  500: "#4caf50",
  600: "#43a047",
  700: "#388e3c",
  800: "#2e7d32",
  900: "#1b5e20",
  A100: "#b9f6ca",
  A200: "#69f0ae",
  A400: "#00e676",
  A700: "#00c853"
};
var grey = {
  50: "#fafafa",
  100: "#f5f5f5",
  200: "#eeeeee",
  300: "#e0e0e0",
  400: "#bdbdbd",
  500: "#9e9e9e",
  600: "#757575",
  700: "#616161",
  800: "#424242",
  900: "#212121",
  A100: "#f5f5f5",
  A200: "#eeeeee",
  A400: "#bdbdbd",
  A700: "#616161"
};
var indigo = {
  50: "#e8eaf6",
  100: "#c5cae9",
  200: "#9fa8da",
  300: "#7986cb",
  400: "#5c6bc0",
  500: "#3f51b5",
  600: "#3949ab",
  700: "#303f9f",
  800: "#283593",
  900: "#1a237e",
  A100: "#8c9eff",
  A200: "#536dfe",
  A400: "#3d5afe",
  A700: "#304ffe"
};
var lightBlue = {
  50: "#e1f5fe",
  100: "#b3e5fc",
  200: "#81d4fa",
  300: "#4fc3f7",
  400: "#29b6f6",
  500: "#03a9f4",
  600: "#039be5",
  700: "#0288d1",
  800: "#0277bd",
  900: "#01579b",
  A100: "#80d8ff",
  A200: "#40c4ff",
  A400: "#00b0ff",
  A700: "#0091ea"
};
var lightGreen = {
  50: "#f1f8e9",
  100: "#dcedc8",
  200: "#c5e1a5",
  300: "#aed581",
  400: "#9ccc65",
  500: "#8bc34a",
  600: "#7cb342",
  700: "#689f38",
  800: "#558b2f",
  900: "#33691e",
  A100: "#ccff90",
  A200: "#b2ff59",
  A400: "#76ff03",
  A700: "#64dd17"
};
var lime = {
  50: "#f9fbe7",
  100: "#f0f4c3",
  200: "#e6ee9c",
  300: "#dce775",
  400: "#d4e157",
  500: "#cddc39",
  600: "#c0ca33",
  700: "#afb42b",
  800: "#9e9d24",
  900: "#827717",
  A100: "#f4ff81",
  A200: "#eeff41",
  A400: "#c6ff00",
  A700: "#aeea00"
};
var orange = {
  50: "#fff3e0",
  100: "#ffe0b2",
  200: "#ffcc80",
  300: "#ffb74d",
  400: "#ffa726",
  500: "#ff9800",
  600: "#fb8c00",
  700: "#f57c00",
  800: "#ef6c00",
  900: "#e65100",
  A100: "#ffd180",
  A200: "#ffab40",
  A400: "#ff9100",
  A700: "#ff6d00"
};
var pink = {
  50: "#fce4ec",
  100: "#f8bbd0",
  200: "#f48fb1",
  300: "#f06292",
  400: "#ec407a",
  500: "#e91e63",
  600: "#d81b60",
  700: "#c2185b",
  800: "#ad1457",
  900: "#880e4f",
  A100: "#ff80ab",
  A200: "#ff4081",
  A400: "#f50057",
  A700: "#c51162"
};
var purple = {
  50: "#f3e5f5",
  100: "#e1bee7",
  200: "#ce93d8",
  300: "#ba68c8",
  400: "#ab47bc",
  500: "#9c27b0",
  600: "#8e24aa",
  700: "#7b1fa2",
  800: "#6a1b9a",
  900: "#4a148c",
  A100: "#ea80fc",
  A200: "#e040fb",
  A400: "#d500f9",
  A700: "#aa00ff"
};
var red = {
  50: "#ffebee",
  100: "#ffcdd2",
  200: "#ef9a9a",
  300: "#e57373",
  400: "#ef5350",
  500: "#f44336",
  600: "#e53935",
  700: "#d32f2f",
  800: "#c62828",
  900: "#b71c1c",
  A100: "#ff8a80",
  A200: "#ff5252",
  A400: "#ff1744",
  A700: "#d50000"
};
var teal = {
  50: "#e0f2f1",
  100: "#b2dfdb",
  200: "#80cbc4",
  300: "#4db6ac",
  400: "#26a69a",
  500: "#009688",
  600: "#00897b",
  700: "#00796b",
  800: "#00695c",
  900: "#004d40",
  A100: "#a7ffeb",
  A200: "#64ffda",
  A400: "#1de9b6",
  A700: "#00bfa5"
};
var yellow = {
  50: "#fffde7",
  100: "#fff9c4",
  200: "#fff59d",
  300: "#fff176",
  400: "#ffee58",
  500: "#ffeb3b",
  600: "#fdd835",
  700: "#fbc02d",
  800: "#f9a825",
  900: "#f57f17",
  A100: "#ffff8d",
  A200: "#ffff00",
  A400: "#ffea00",
  A700: "#ffd600"
};
var Colors = {
  amber,
  blue,
  blueGrey,
  brown,
  cyan,
  deepOrange,
  deepPurple,
  green,
  grey,
  indigo,
  lightBlue,
  lightGreen,
  lime,
  orange,
  pink,
  purple,
  red,
  teal,
  yellow
};

// packages/style/src/theme.ts
var defaultTheme = {
  action: {
    active: "rgba(0, 0, 0, 0.54)",
    activeOpacity: 0.12,
    disabled: "rgba(0, 0, 0, 0.26)",
    disabledBackground: "rgba(0, 0, 0, 0.12)",
    disabledOpacity: 0.38,
    focus: "rgba(0, 0, 0, 0.12)",
    focusOpacity: 0.12,
    hover: "rgba(0, 0, 0, 0.04)",
    hoverOpacity: 0.04,
    selected: "rgba(0, 0, 0, 0.08)",
    selectedOpacity: 0.08
  },
  background: {
    default: "#fafafa",
    paper: "#fff",
    main: "#ffffff",
    modal: "#ffffff",
    gradient: "linear-gradient(90deg, #a8327f 0%, #d4626a 100%)"
  },
  breakboints: {
    xs: 0,
    sm: 600,
    md: 900,
    lg: 1200,
    xl: 1536
  },
  divider: "rgba(0, 0, 0, 0.12)",
  colors: {
    error: {
      contrastText: "#FFFFFF",
      dark: "#D32F2F",
      light: "#e57373",
      main: "#f44336"
    },
    info: {
      contrastText: "#fff",
      dark: "#1976d2",
      light: "#64b5f6",
      main: "#2196f3"
    },
    primary: {
      contrastText: "#fff",
      dark: "rgb(44, 56, 126)",
      light: "rgb(101, 115, 195)",
      main: "#3f51b5"
    },
    secondary: {
      contrastText: "#fff",
      dark: "rgb(171, 0, 60)",
      light: "rgb(247, 51, 120)",
      main: "#f50057"
    },
    success: {
      contrastText: "rgba(0, 0, 0, 0.87)",
      dark: "#388e3c",
      light: "#81c784",
      main: "#4caf50"
    },
    warning: {
      contrastText: "rgba(0, 0, 0, 0.87)",
      dark: "#f57c00",
      light: "#ffb74d",
      main: "#ff9800"
    }
  },
  layout: {
    container: {
      width: "100%",
      maxWidth: "100%",
      textAlign: "left",
      overflow: "auto"
    }
  },
  shadows: {
    0: "none",
    1: "0px 2px 1px -1px rgba(0,0,0,0.2),0px 1px 1px 0px rgba(0,0,0,0.14),0px 1px 3px 0px rgba(0,0,0,0.12)",
    2: "0px 3px 1px -2px rgba(0,0,0,0.2),0px 2px 2px 0px rgba(0,0,0,0.14),0px 1px 5px 0px rgba(0,0,0,0.12)",
    3: "0px 3px 3px -2px rgba(0,0,0,0.2),0px 3px 4px 0px rgba(0,0,0,0.14),0px 1px 8px 0px rgba(0,0,0,0.12)",
    4: "0px 2px 4px -1px rgba(0,0,0,0.2),0px 4px 5px 0px rgba(0,0,0,0.14),0px 1px 10px 0px rgba(0,0,0,0.12)"
  },
  text: {
    primary: "rgba(0, 0, 0, 0.87)",
    secondary: "rgba(0, 0, 0, 0.6)",
    third: "#f6c958",
    disabled: "rgba(0, 0, 0, 0.38)",
    hint: "rgba(0, 0, 0, 0.38)"
  },
  docs: {
    background: "#f6f8fa",
    text0: "#393939",
    text1: "#717171"
  },
  typography: {
    fontSize: "14px",
    fontFamily: `'roboto', 'Helvetica', 'Arial', 'Lucida Grande', 'sans-serif'`
  },
  input: {
    background: "#fff",
    fontColor: "#000"
  },
  combobox: {
    background: "#fff",
    fontColor: "#000"
  }
};
var darkTheme = {
  action: {
    active: "#fff",
    activeOpacity: 0.12,
    disabled: "rgba(255,255,255,0.3)",
    disabledBackground: "rgba(255,255,255, 0.12)",
    disabledOpacity: 0.38,
    focus: "rgba(255,255,255, 0.12)",
    focusOpacity: 0.12,
    hover: "rgba(255,255,255,0.08)",
    hoverOpacity: 0.08,
    selected: "rgba(255,255,255, 0.16)",
    selectedOpacity: 0.16
  },
  background: {
    default: "#303030",
    paper: "#424242",
    main: "#181e3e",
    modal: "#192046",
    gradient: "linear-gradient(90deg, #a8327f 0%, #d4626a 100%)"
  },
  breakboints: {
    xs: 0,
    sm: 600,
    md: 900,
    lg: 1200,
    xl: 1536
  },
  colors: {
    error: {
      contrastText: "#fff",
      dark: "#d32f2f",
      light: "#e57373",
      main: "#f44336"
    },
    info: {
      contrastText: "rgba(0, 0, 0, 0.87)",
      dark: "#0288d1",
      light: "#4fc3f7",
      main: "#29b6f6"
    },
    primary: {
      contrastText: "#fff",
      dark: "rgb(44, 56, 126)",
      light: "rgb(101, 115, 195)",
      main: "#3f51b5"
    },
    secondary: {
      contrastText: "#fff",
      dark: "rgb(171, 0, 60)",
      light: "rgb(247, 51, 120)",
      main: "#f50057"
    },
    success: {
      contrastText: "rgba(0, 0, 0, 0.87)",
      dark: "#388e3c",
      light: "#81c784",
      main: "#66bb6a"
    },
    warning: {
      contrastText: "rgba(0, 0, 0, 0.87)",
      dark: "#f57c00",
      light: "#ffb74d",
      main: "#ffa726"
    }
  },
  layout: {
    container: {
      width: "100%",
      maxWidth: "100%",
      textAlign: "left",
      overflow: "auto"
    }
  },
  divider: "rgba(255, 255, 255, 0.12)",
  shadows: {
    0: "none",
    1: "0px 2px 1px -1px rgba(0,0,0,0.2),0px 1px 1px 0px rgba(0,0,0,0.14),0px 1px 3px 0px rgba(0,0,0,0.12)",
    2: "0px 3px 1px -2px rgba(0,0,0,0.2),0px 2px 2px 0px rgba(0,0,0,0.14),0px 1px 5px 0px rgba(0,0,0,0.12)",
    3: "0px 3px 3px -2px rgba(0,0,0,0.2),0px 3px 4px 0px rgba(0,0,0,0.14),0px 1px 8px 0px rgba(0,0,0,0.12)",
    4: "0px 2px 4px -1px rgba(0,0,0,0.2),0px 4px 5px 0px rgba(0,0,0,0.14),0px 1px 10px 0px rgba(0,0,0,0.12)"
  },
  text: {
    primary: "#fff",
    secondary: "rgba(255, 255, 255, 0.7)",
    third: "#f6c958",
    disabled: "rgba(255, 255, 255, 0.5)",
    hint: "rgba(255, 255, 255, 0.5)"
  },
  docs: {
    background: "#010132",
    text0: "#fff",
    text1: "#fff"
  },
  typography: {
    fontSize: "14px",
    fontFamily: `'roboto', 'Helvetica', 'Arial', 'Lucida Grande', 'sans-serif'`
  },
  input: {
    background: "#fff",
    fontColor: "#000"
  },
  combobox: {
    background: "#fff",
    fontColor: "#000"
  }
};
function createThemeVars(theme, vars, prefix) {
  vars = vars || {};
  for (let v in theme) {
    if (typeof theme[v] == "object") {
      vars[v] = {};
      createThemeVars(theme[v], vars[v], prefix ? prefix + v + "-" : v + "-");
    } else {
      let name = ((prefix || "") + v).split(/(?=[A-Z])/).join("_").toLowerCase();
      vars[v] = `var(--${name})`;
    }
  }
  return vars;
}
function createThemeCss(theme, vars, prefix) {
  vars = vars || {};
  for (let v in theme) {
    if (typeof theme[v] == "object") {
      createThemeCss(theme[v], vars, prefix ? prefix + v + "-" : v + "-");
    } else {
      let name = ((prefix || "") + v).split(/(?=[A-Z])/).join("_").toLowerCase();
      vars[name] = theme[v];
    }
  }
  return vars;
}
var ThemeVars = createThemeVars(defaultTheme);
var ColorVars = createThemeVars(Colors);
var themeStyle;
var currentTheme;
function applyTheme(theme) {
  let cssVars = createThemeCss(theme);
  let css = `:root{`;
  for (let p in cssVars)
    css += `--${p}: ${cssVars[p]};`;
  css += "}";
  if (!themeStyle) {
    themeStyle = document.createElement("style");
    document.head.appendChild(themeStyle);
  }
  themeStyle.textContent = css;
  currentTheme = theme;
}
applyTheme(defaultTheme);

// packages/style/src/styles.ts
var uniqueId = 0;
var CSS_NUMBER = Object.create(null);
var CSS_NUMBER_KEYS = [
  "animation-iteration-count",
  "border-image-outset",
  "border-image-slice",
  "border-image-width",
  "box-flex",
  "box-flex-group",
  "box-ordinal-group",
  "column-count",
  "columns",
  "counter-increment",
  "counter-reset",
  "flex",
  "flex-grow",
  "flex-positive",
  "flex-shrink",
  "flex-negative",
  "flex-order",
  "font-weight",
  "grid-area",
  "grid-column",
  "grid-column-end",
  "grid-column-span",
  "grid-column-start",
  "grid-row",
  "grid-row-end",
  "grid-row-span",
  "grid-row-start",
  "line-clamp",
  "line-height",
  "opacity",
  "order",
  "orphans",
  "tab-size",
  "widows",
  "z-index",
  "zoom",
  "fill-opacity",
  "flood-opacity",
  "stop-opacity",
  "stroke-dasharray",
  "stroke-dashoffset",
  "stroke-miterlimit",
  "stroke-opacity",
  "stroke-width"
];
for (const property of CSS_NUMBER_KEYS) {
  for (const prefix of ["-webkit-", "-ms-", "-moz-", "-o-", ""]) {
    CSS_NUMBER[prefix + property] = true;
  }
}
function escape(str) {
  return str.replace(/[ !#$%&()*+,./;<=>?@[\]^`{|}~"'\\]/g, "\\$&");
}
function interpolate(selector, styleName) {
  return selector.replace(/&/g, styleName);
}
function hyphenate(propertyName) {
  return propertyName.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`).replace(/^ms-/, "-ms-");
}
function stringHash(str) {
  let value = 5381;
  let len = str.length;
  while (len--)
    value = value * 33 ^ str.charCodeAt(len);
  return (value >>> 0).toString(36);
}
function styleToString(name, value) {
  const suffix = typeof value === "number" && value && !CSS_NUMBER[name] ? "px" : "";
  return `${name}:${value}${suffix}`;
}
function sortTuples(value) {
  return value.sort((a, b) => a[0] > b[0] ? 1 : -1);
}
function stringifyProperties(properties) {
  return properties.map(([name, value]) => {
    if (!Array.isArray(value))
      return styleToString(name, value);
    return value.map((x) => styleToString(name, x)).join(";");
  }).join(";");
}
function child(selector, parent) {
  if (!selector)
    return parent;
  if (!selector.includes("&"))
    return `${parent} ${selector}`;
  return interpolate(selector, parent);
}
function stylize(rulesList, stylesList, key2, styles, parentClassName) {
  const properties = [];
  const nestedStyles = [];
  for (const key3 of Object.keys(styles)) {
    const value = styles[key3];
    if (key3.charCodeAt(0) !== 36 && value != null) {
      if (typeof value === "object" && !Array.isArray(value)) {
        nestedStyles.push([key3, value]);
      } else {
        properties.push([hyphenate(key3), value]);
      }
    }
  }
  const isUnique = !!styles.$unique;
  const parent = styles.$global ? "" : parentClassName;
  const nested = parent ? nestedStyles : sortTuples(nestedStyles);
  const style2 = stringifyProperties(sortTuples(properties));
  let pid = style2;
  if (key2.charCodeAt(0) === 64) {
    const childRules = [];
    const childStyles = [];
    if (parent && style2) {
      pid += `:${parent}`;
      childStyles.push({ selector: parent, style: style2, isUnique });
    }
    for (const [name, value] of nested) {
      pid += `:${stylize(childRules, childStyles, name, value, parent)}`;
    }
    rulesList.push({
      selector: key2,
      rules: childRules,
      styles: childStyles,
      style: parent ? "" : style2
    });
  } else {
    const selector = parent ? child(key2, parent) : key2;
    pid += `:${selector}`;
    if (style2) {
      stylesList.push({ selector, style: style2, isUnique });
    }
    for (const [name, value] of nested) {
      pid += `:${stylize(rulesList, stylesList, name, value, selector)}`;
    }
  }
  return pid;
}
function compose(cache, rulesList, stylesList, id, name) {
  for (const { selector, style: style2, isUnique } of stylesList) {
    const key2 = interpolate(selector, name);
    const item = new Style(style2, `s:${isUnique ? (++uniqueId).toString(36) : id}:${style2}`);
    item.add(new Selector(key2, `k:${key2}`));
    cache.add(item);
  }
  for (const { selector, style: style2, rules, styles } of rulesList) {
    const key2 = interpolate(selector, name);
    const item = new Rule(key2, style2, `r:${id}:${key2}:${style2}`);
    compose(item, rules, styles, id, name);
    cache.add(item);
  }
}
function join(arr) {
  let res = "";
  for (let i = 0; i < arr.length; i++)
    res += arr[i];
  return res;
}
var Cache = class {
  constructor(changes) {
    this.changes = changes;
    this.sheet = [];
    this.changeId = 0;
    this._keys = [];
    this._children = Object.create(null);
    this._counters = Object.create(null);
  }
  add(style2) {
    const count = this._counters[style2.id] || 0;
    const item = this._children[style2.id] || style2.clone();
    this._counters[style2.id] = count + 1;
    if (count === 0) {
      this._children[item.id] = item;
      this._keys.push(item.id);
      this.sheet.push(item.getStyles());
      this.changeId++;
      if (this.changes)
        this.changes.add(item, this._keys.length - 1);
    } else if (item instanceof Cache && style2 instanceof Cache) {
      const prevItemChangeId = item.changeId;
      item.merge(style2);
      if (item.changeId !== prevItemChangeId) {
        const index = this._keys.indexOf(style2.id);
        this.sheet.splice(index, 1, item.getStyles());
        this.changeId++;
        if (this.changes)
          this.changes.change(item, index, index);
      }
    }
  }
  remove(style2) {
    const count = this._counters[style2.id];
    if (count) {
      this._counters[style2.id] = count - 1;
      const item = this._children[style2.id];
      const index = this._keys.indexOf(item.id);
      if (count === 1) {
        delete this._counters[style2.id];
        delete this._children[style2.id];
        this._keys.splice(index, 1);
        this.sheet.splice(index, 1);
        this.changeId++;
        if (this.changes)
          this.changes.remove(item, index);
      } else if (item instanceof Cache && style2 instanceof Cache) {
        const prevChangeId = item.changeId;
        item.unmerge(style2);
        if (item.changeId !== prevChangeId) {
          this.sheet.splice(index, 1, item.getStyles());
          this.changeId++;
          if (this.changes)
            this.changes.change(item, index, index);
        }
      }
    }
  }
  values() {
    return this._keys.map((key2) => this._children[key2]);
  }
  merge(cache) {
    for (const item of cache.values())
      this.add(item);
    return this;
  }
  unmerge(cache) {
    for (const item of cache.values())
      this.remove(item);
    return this;
  }
  clone() {
    return new Cache().merge(this);
  }
};
var Selector = class {
  constructor(selector, id) {
    this.selector = selector;
    this.id = id;
  }
  getStyles() {
    return this.selector;
  }
  clone() {
    return this;
  }
};
var Style = class extends Cache {
  constructor(style2, id) {
    super();
    this.style = style2;
    this.id = id;
  }
  getStyles() {
    return `${this.sheet.join(",")}{${this.style}}`;
  }
  clone() {
    return new Style(this.style, this.id).merge(this);
  }
};
var Rule = class extends Cache {
  constructor(rule, style2, id) {
    super();
    this.rule = rule;
    this.style = style2;
    this.id = id;
  }
  getStyles() {
    return `${this.rule}{${this.style}${join(this.sheet)}}`;
  }
  clone() {
    return new Rule(this.rule, this.style, this.id).merge(this);
  }
};
function key(id, styles) {
  if (!styles.$displayName)
    return id;
  return `${styles.$displayName}_${id}`;
}
var FreeStyle = class extends Cache {
  constructor(id, changes) {
    super(changes);
    this.id = id;
  }
  registerStyle(css) {
    const ruleList = [];
    const styleList = [];
    const pid = stylize(ruleList, styleList, "", css, ".&");
    const id = `f${stringHash(pid)}`;
    const name = key(id, css);
    compose(this, ruleList, styleList, id, false ? name : escape(name));
    return name;
  }
  registerKeyframes(keyframes2) {
    return this.registerHashRule("@keyframes", keyframes2);
  }
  registerHashRule(prefix, styles) {
    return this.registerStyle({
      $global: true,
      $displayName: styles.$displayName,
      [`${prefix} &`]: styles
    });
  }
  registerRule(rule, styles) {
    return this.registerStyle({ $global: true, [rule]: styles });
  }
  registerCss(styles) {
    return this.registerRule("", styles);
  }
  getStyles() {
    return join(this.sheet);
  }
  clone() {
    return new FreeStyle(this.id, this.changes).merge(this);
  }
};
function create(changes) {
  return new FreeStyle(`f${(++uniqueId).toString(36)}`, changes);
}

// packages/style/src/formatting.ts
function convertToStyles(object) {
  const styles = {};
  for (const key2 in object) {
    const val = object[key2];
    if (key2 === "$nest") {
      const nested = val;
      for (let selector in nested) {
        const subproperties = nested[selector];
        styles[selector] = convertToStyles(subproperties);
      }
    } else if (key2 === "$debugName") {
      styles.$displayName = val;
    } else {
      styles[key2] = val;
    }
  }
  return styles;
}
function convertToKeyframes(frames) {
  const result = {};
  for (const offset in frames) {
    if (offset !== "$debugName") {
      result[offset] = frames[offset];
    }
  }
  if (frames.$debugName) {
    result.$displayName = frames.$debugName;
  }
  return result;
}

// packages/style/src/utilities.ts
var raf = typeof requestAnimationFrame === "undefined" ? (cb) => setTimeout(cb) : typeof window === "undefined" ? requestAnimationFrame : requestAnimationFrame.bind(window);
function extend(...objects) {
  const result = {};
  for (const object of objects) {
    if (object == null || object === false) {
      continue;
    }
    for (const key2 in object) {
      const val = object[key2];
      if (!val && val !== 0) {
        continue;
      }
      if (key2 === "$nest" && val) {
        result[key2] = result["$nest"] ? extend(result["$nest"], val) : val;
      } else if (key2.indexOf("&") !== -1 || key2.indexOf("@media") === 0) {
        result[key2] = result[key2] ? extend(result[key2], val) : val;
      } else {
        result[key2] = val;
      }
    }
  }
  return result;
}

// packages/style/src/typestyle.ts
var createFreeStyle = () => create();
var TypeStyle = class {
  constructor({ autoGenerateTag }) {
    this.cssRaw = (mustBeValidCSS) => {
      if (!mustBeValidCSS) {
        return;
      }
      this._raw += mustBeValidCSS || "";
      this._pendingRawChange = true;
      this._styleUpdated();
    };
    this.cssRule = (selector, ...objects) => {
      const styles = convertToStyles(extend(...objects));
      this._freeStyle.registerRule(selector, styles);
      this._styleUpdated();
      return;
    };
    this.forceRenderStyles = () => {
      const target = this._getTag();
      if (!target) {
        return;
      }
      target.textContent = this.getStyles();
    };
    this.fontFace = (...fontFace2) => {
      const freeStyle = this._freeStyle;
      for (const face of fontFace2) {
        freeStyle.registerRule("@font-face", face);
      }
      this._styleUpdated();
      return;
    };
    this.getStyles = () => {
      return (this._raw || "") + this._freeStyle.getStyles();
    };
    this.keyframes = (frames) => {
      const keyframes2 = convertToKeyframes(frames);
      const animationName = this._freeStyle.registerKeyframes(keyframes2);
      this._styleUpdated();
      return animationName;
    };
    this.reinit = () => {
      const freeStyle = createFreeStyle();
      this._freeStyle = freeStyle;
      this._lastFreeStyleChangeId = freeStyle.changeId;
      this._raw = "";
      this._pendingRawChange = false;
      const target = this._getTag();
      if (target) {
        target.textContent = "";
      }
    };
    this.setStylesTarget = (tag) => {
      if (this._tag) {
        this._tag.textContent = "";
      }
      this._tag = tag;
      this.forceRenderStyles();
    };
    this.stylesheet = (classes) => {
      const classNames = Object.getOwnPropertyNames(classes);
      const result = {};
      for (let className of classNames) {
        const classDef = classes[className];
        if (classDef) {
          classDef.$debugName = className;
          result[className] = this.style(classDef);
        }
      }
      return result;
    };
    const freeStyle = createFreeStyle();
    this._autoGenerateTag = autoGenerateTag;
    this._freeStyle = freeStyle;
    this._lastFreeStyleChangeId = freeStyle.changeId;
    this._pending = 0;
    this._pendingRawChange = false;
    this._raw = "";
    this._tag = void 0;
    this.style = this.style.bind(this);
  }
  _afterAllSync(cb) {
    this._pending++;
    const pending = this._pending;
    raf(() => {
      if (pending !== this._pending) {
        return;
      }
      cb();
    });
  }
  _getTag() {
    if (this._tag) {
      return this._tag;
    }
    if (this._autoGenerateTag) {
      const tag = typeof window === "undefined" ? { textContent: "" } : document.createElement("style");
      if (typeof document !== "undefined") {
        document.head.appendChild(tag);
      }
      this._tag = tag;
      return tag;
    }
    return void 0;
  }
  _styleUpdated() {
    const changeId = this._freeStyle.changeId;
    const lastChangeId = this._lastFreeStyleChangeId;
    if (!this._pendingRawChange && changeId === lastChangeId) {
      return;
    }
    this._lastFreeStyleChangeId = changeId;
    this._pendingRawChange = false;
    this._afterAllSync(() => this.forceRenderStyles());
  }
  style(...args) {
    const className = this._freeStyle.registerStyle(convertToStyles(extend.apply(void 0, args)));
    this._styleUpdated();
    return className;
  }
};
var typeStyle = new TypeStyle({ autoGenerateTag: true });

// packages/style/src/snippets.ts
function rotate(degree) {
  if (degree !== 0 && !degree)
    return "";
  let value = `rotate(${degree}deg)`;
  return style({
    transform: value
  });
}

// packages/style/src/index.ts
var cssRaw = typeStyle.cssRaw;
var cssRule = typeStyle.cssRule;
var fontFace = typeStyle.fontFace;
var keyframes = typeStyle.keyframes;
var style = typeStyle.style;

// packages/base/src/observable.ts
var INSERT = "insert";
var UPDATE = "update";
var DELETE = "delete";
var REVERSE = "reverse";
var SHUFFLE = "shuffle";
var oMetaKey = Symbol.for("object-observer-meta-key-0");
var validObservableOptionKeys = { async: 1 };
var processObserveOptions = (options) => {
  if (!options || typeof options !== "object") {
    return null;
  }
  const result = {};
  const invalidOptions = [];
  for (const [optName, optVal] of Object.entries(options)) {
    if (optName === "path") {
      if (typeof optVal !== "string" || optVal === "") {
        throw new Error('"path" option, if/when provided, MUST be a non-empty string');
      }
      result[optName] = optVal;
    } else if (optName === "pathsOf") {
      if (options.path) {
        throw new Error('"pathsOf" option MAY NOT be specified together with "path" option');
      }
      if (typeof optVal !== "string") {
        throw new Error('"pathsOf" option, if/when provided, MUST be a string (MAY be empty)');
      }
      result[optName] = options.pathsOf.split(".").filter(Boolean);
    } else if (optName === "pathsFrom") {
      if (options.path || options.pathsOf) {
        throw new Error('"pathsFrom" option MAY NOT be specified together with "path"/"pathsOf" option/s');
      }
      if (typeof optVal !== "string" || optVal === "") {
        throw new Error('"pathsFrom" option, if/when provided, MUST be a non-empty string');
      }
      result[optName] = optVal;
    } else {
      invalidOptions.push(optName);
    }
  }
  if (invalidOptions.length) {
    throw new Error(`'${invalidOptions.join(", ")}' is/are not a valid observer option/s`);
  }
  return result;
};
var observe = function observe2(observer, options) {
  if (typeof observer !== "function") {
    throw new Error(`observer MUST be a function, got '${observer}'`);
  }
  const observers = this[oMetaKey].observers;
  if (!observers.some((o) => o[0] === observer)) {
    observers.push([observer, processObserveOptions(options)]);
  } else {
    console.warn("observer may be bound to an observable only once; will NOT rebind");
  }
};
var unobserve = function unobserve2() {
  const observers = this[oMetaKey].observers;
  let ol = observers.length;
  if (ol) {
    let al = arguments.length;
    if (al) {
      while (al--) {
        let i = ol;
        while (i--) {
          if (observers[i][0] === arguments[al]) {
            observers.splice(i, 1);
            ol--;
          }
        }
      }
    } else {
      observers.splice(0);
    }
  }
};
var clearObservers = function unobserve3() {
  this[oMetaKey].observers = [];
};
var propertiesBluePrint = { __observe: { value: observe }, __unobserve: { value: unobserve }, __clearObservers: { value: clearObservers } };
var prepareObject = (source, oMeta) => {
  const target = Object.defineProperties({}, propertiesBluePrint);
  target[oMetaKey] = oMeta;
  for (const key2 in source) {
    target[key2] = getObservedOf(source[key2], key2, oMeta);
  }
  return target;
};
var prepareArray = (source, oMeta) => {
  let l = source.length;
  const target = Object.defineProperties(new Array(l), propertiesBluePrint);
  target[oMetaKey] = oMeta;
  for (let i = 0; i < l; i++) {
    target[i] = getObservedOf(source[i], i, oMeta);
  }
  return target;
};
var prepareTypedArray = (source, oMeta) => {
  Object.defineProperties(source, propertiesBluePrint);
  source[oMetaKey] = oMeta;
  return source;
};
var filterChanges = (options, changes) => {
  if (!options) {
    return changes;
  }
  let result = changes;
  if (options.path) {
    const oPath = options.path;
    result = changes.filter((change) => change.path.join(".") === oPath);
  } else if (options.pathsOf) {
    const oPathsOf = options.pathsOf;
    const oPathsOfStr = oPathsOf.join(".");
    result = changes.filter((change) => (change.path.length === oPathsOf.length + 1 || change.path.length === oPathsOf.length && (change.type === REVERSE || change.type === SHUFFLE)) && change.path.join(".").startsWith(oPathsOfStr));
  } else if (options.pathsFrom) {
    const oPathsFrom = options.pathsFrom;
    result = changes.filter((change) => change.path.join(".").startsWith(oPathsFrom));
  }
  return result;
};
var callObserverSafe = (listener, changes) => {
  try {
    listener(changes);
  } catch (e) {
    console.error(`failed to notify listener ${listener} with ${changes}`, e);
  }
};
var callObserversFromMT = function callObserversFromMT2() {
  const batches = this.batches;
  this.batches = null;
  for (const [listener, changes] of batches) {
    callObserverSafe(listener, changes);
  }
};
var callObservers = (oMeta, changes) => {
  let currentObservable = oMeta;
  let observers, target, options, relevantChanges, i;
  const l = changes.length;
  do {
    observers = currentObservable.observers;
    i = observers.length;
    while (i--) {
      [target, options] = observers[i];
      relevantChanges = filterChanges(options, changes);
      if (relevantChanges.length) {
        if (currentObservable.options.async) {
          if (!currentObservable.batches) {
            currentObservable.batches = [];
            queueMicrotask(callObserversFromMT.bind(currentObservable));
          }
          let rb;
          for (const b of currentObservable.batches) {
            if (b[0] === target) {
              rb = b;
              break;
            }
          }
          if (!rb) {
            rb = [target, []];
            currentObservable.batches.push(rb);
          }
          Array.prototype.push.apply(rb[1], relevantChanges);
        } else {
          callObserverSafe(target, relevantChanges);
        }
      }
    }
    if (currentObservable.parent) {
      const clonedChanges = new Array(l);
      for (let j = 0; j < l; j++) {
        clonedChanges[j] = { ...changes[j] };
        clonedChanges[j].path = [currentObservable.ownKey, ...clonedChanges[j].path];
      }
      changes = clonedChanges;
      currentObservable = currentObservable.parent;
    } else {
      currentObservable = null;
    }
  } while (currentObservable);
};
var getObservedOf = (item, key2, parent) => {
  if (!item || typeof item !== "object") {
    return item;
  } else if (Array.isArray(item)) {
    return new ArrayOMeta({ target: item, ownKey: key2, parent }).proxy;
  } else if (ArrayBuffer.isView(item)) {
    return new TypedArrayOMeta({ target: item, ownKey: key2, parent }).proxy;
  } else if (item instanceof Date) {
    return item;
  } else {
    return new ObjectOMeta({ target: item, ownKey: key2, parent }).proxy;
  }
};
var proxiedPop = function proxiedPop2() {
  const oMeta = this[oMetaKey], target = oMeta.target, poppedIndex = target.length - 1;
  let popResult = target.pop();
  if (popResult && typeof popResult === "object") {
    const tmpObserved = popResult[oMetaKey];
    if (tmpObserved) {
      popResult = tmpObserved.detach();
    }
  }
  const changes = [new Change(DELETE, [poppedIndex], void 0, popResult, this)];
  callObservers(oMeta, changes);
  return popResult;
};
var proxiedPush = function proxiedPush2() {
  const oMeta = this[oMetaKey], target = oMeta.target, l = arguments.length, pushContent = new Array(l), initialLength = target.length;
  for (let i = 0; i < l; i++) {
    pushContent[i] = getObservedOf(arguments[i], initialLength + i, oMeta);
  }
  const pushResult = Reflect.apply(target.push, target, pushContent);
  const changes = [];
  for (let i = initialLength, j = target.length; i < j; i++) {
    changes[i - initialLength] = new Change(INSERT, [i], target[i], void 0, this);
  }
  callObservers(oMeta, changes);
  return pushResult;
};
var proxiedShift = function proxiedShift2() {
  const oMeta = this[oMetaKey], target = oMeta.target;
  let shiftResult, i, l, item, tmpObserved;
  shiftResult = target.shift();
  if (shiftResult && typeof shiftResult === "object") {
    tmpObserved = shiftResult[oMetaKey];
    if (tmpObserved) {
      shiftResult = tmpObserved.detach();
    }
  }
  for (i = 0, l = target.length; i < l; i++) {
    item = target[i];
    if (item && typeof item === "object") {
      tmpObserved = item[oMetaKey];
      if (tmpObserved) {
        tmpObserved.ownKey = i;
      }
    }
  }
  const changes = [new Change(DELETE, [0], void 0, shiftResult, this)];
  callObservers(oMeta, changes);
  return shiftResult;
};
var proxiedUnshift = function proxiedUnshift2() {
  const oMeta = this[oMetaKey], target = oMeta.target, al = arguments.length, unshiftContent = new Array(al);
  for (let i = 0; i < al; i++) {
    unshiftContent[i] = getObservedOf(arguments[i], i, oMeta);
  }
  const unshiftResult = Reflect.apply(target.unshift, target, unshiftContent);
  for (let i = 0, l2 = target.length, item; i < l2; i++) {
    item = target[i];
    if (item && typeof item === "object") {
      const tmpObserved = item[oMetaKey];
      if (tmpObserved) {
        tmpObserved.ownKey = i;
      }
    }
  }
  const l = unshiftContent.length;
  const changes = new Array(l);
  for (let i = 0; i < l; i++) {
    changes[i] = new Change(INSERT, [i], target[i], void 0, this);
  }
  callObservers(oMeta, changes);
  return unshiftResult;
};
var proxiedReverse = function proxiedReverse2() {
  const oMeta = this[oMetaKey], target = oMeta.target;
  let i, l, item;
  target.reverse();
  for (i = 0, l = target.length; i < l; i++) {
    item = target[i];
    if (item && typeof item === "object") {
      const tmpObserved = item[oMetaKey];
      if (tmpObserved) {
        tmpObserved.ownKey = i;
      }
    }
  }
  const changes = [new Change(REVERSE, [], void 0, void 0, this)];
  callObservers(oMeta, changes);
  return this;
};
var proxiedSort = function proxiedSort2(comparator) {
  const oMeta = this[oMetaKey], target = oMeta.target;
  let i, l, item;
  target.sort(comparator);
  for (i = 0, l = target.length; i < l; i++) {
    item = target[i];
    if (item && typeof item === "object") {
      const tmpObserved = item[oMetaKey];
      if (tmpObserved) {
        tmpObserved.ownKey = i;
      }
    }
  }
  const changes = [new Change(SHUFFLE, [], void 0, void 0, this)];
  callObservers(oMeta, changes);
  return this;
};
var proxiedFill = function proxiedFill2(filVal, start, end) {
  const oMeta = this[oMetaKey], target = oMeta.target, changes = [], tarLen = target.length, prev = target.slice(0);
  start = start === void 0 ? 0 : start < 0 ? Math.max(tarLen + start, 0) : Math.min(start, tarLen);
  end = end === void 0 ? tarLen : end < 0 ? Math.max(tarLen + end, 0) : Math.min(end, tarLen);
  if (start < tarLen && end > start) {
    target.fill(filVal, start, end);
    let tmpObserved;
    for (let i = start, item, tmpTarget; i < end; i++) {
      item = target[i];
      target[i] = getObservedOf(item, i, oMeta);
      if (i in prev) {
        tmpTarget = prev[i];
        if (tmpTarget && typeof tmpTarget === "object") {
          tmpObserved = tmpTarget[oMetaKey];
          if (tmpObserved) {
            tmpTarget = tmpObserved.detach();
          }
        }
        changes.push(new Change(UPDATE, [i], target[i], tmpTarget, this));
      } else {
        changes.push(new Change(INSERT, [i], target[i], void 0, this));
      }
    }
    callObservers(oMeta, changes);
  }
  return this;
};
var proxiedCopyWithin = function proxiedCopyWithin2(dest, start, end) {
  const oMeta = this[oMetaKey], target = oMeta.target, tarLen = target.length;
  dest = dest < 0 ? Math.max(tarLen + dest, 0) : dest;
  start = start === void 0 ? 0 : start < 0 ? Math.max(tarLen + start, 0) : Math.min(start, tarLen);
  end = end === void 0 ? tarLen : end < 0 ? Math.max(tarLen + end, 0) : Math.min(end, tarLen);
  const len = Math.min(end - start, tarLen - dest);
  if (dest < tarLen && dest !== start && len > 0) {
    const prev = target.slice(0), changes = [];
    target.copyWithin(dest, start, end);
    for (let i = dest, nItem, oItem, tmpObserved; i < dest + len; i++) {
      nItem = target[i];
      if (nItem && typeof nItem === "object") {
        nItem = getObservedOf(nItem, i, oMeta);
        target[i] = nItem;
      }
      oItem = prev[i];
      if (oItem && typeof oItem === "object") {
        tmpObserved = oItem[oMetaKey];
        if (tmpObserved) {
          oItem = tmpObserved.detach();
        }
      }
      if (typeof nItem !== "object" && nItem === oItem) {
        continue;
      }
      changes.push(new Change(UPDATE, [i], nItem, oItem, this));
    }
    callObservers(oMeta, changes);
  }
  return this;
};
var proxiedSplice = function proxiedSplice2() {
  const oMeta = this[oMetaKey], target = oMeta.target, splLen = arguments.length, spliceContent = new Array(splLen), tarLen = target.length;
  for (let i2 = 0; i2 < splLen; i2++) {
    spliceContent[i2] = getObservedOf(arguments[i2], i2, oMeta);
  }
  const startIndex = splLen === 0 ? 0 : spliceContent[0] < 0 ? tarLen + spliceContent[0] : spliceContent[0], removed = splLen < 2 ? tarLen - startIndex : spliceContent[1], inserted = Math.max(splLen - 2, 0), spliceResult = Reflect.apply(target.splice, target, spliceContent), newTarLen = target.length;
  let tmpObserved;
  for (let i2 = 0, item2; i2 < newTarLen; i2++) {
    item2 = target[i2];
    if (item2 && typeof item2 === "object") {
      tmpObserved = item2[oMetaKey];
      if (tmpObserved) {
        tmpObserved.ownKey = i2;
      }
    }
  }
  let i, l, item;
  for (i = 0, l = spliceResult.length; i < l; i++) {
    item = spliceResult[i];
    if (item && typeof item === "object") {
      tmpObserved = item[oMetaKey];
      if (tmpObserved) {
        spliceResult[i] = tmpObserved.detach();
      }
    }
  }
  const changes = [];
  let index;
  for (index = 0; index < removed; index++) {
    if (index < inserted) {
      changes.push(new Change(UPDATE, [startIndex + index], target[startIndex + index], spliceResult[index], this));
    } else {
      changes.push(new Change(DELETE, [startIndex + index], void 0, spliceResult[index], this));
    }
  }
  for (; index < inserted; index++) {
    changes.push(new Change(INSERT, [startIndex + index], target[startIndex + index], void 0, this));
  }
  callObservers(oMeta, changes);
  return spliceResult;
};
var proxiedTypedArraySet = function proxiedTypedArraySet2(source, offset) {
  const oMeta = this[oMetaKey], target = oMeta.target, souLen = source.length, prev = target.slice(0);
  offset = offset || 0;
  target.set(source, offset);
  const changes = new Array(souLen);
  for (let i = offset; i < souLen + offset; i++) {
    changes[i - offset] = new Change(UPDATE, [i], target[i], prev[i], this);
  }
  callObservers(oMeta, changes);
};
var proxiedArrayMethods = {
  pop: proxiedPop,
  push: proxiedPush,
  shift: proxiedShift,
  unshift: proxiedUnshift,
  reverse: proxiedReverse,
  sort: proxiedSort,
  fill: proxiedFill,
  copyWithin: proxiedCopyWithin,
  splice: proxiedSplice
};
var proxiedTypedArrayMethods = {
  reverse: proxiedReverse,
  sort: proxiedSort,
  fill: proxiedFill,
  copyWithin: proxiedCopyWithin,
  set: proxiedTypedArraySet
};
var Change = class {
  constructor(type, path, value, oldValue, object) {
    this.type = type;
    this.path = path;
    this.value = value;
    this.oldValue = oldValue;
    this.object = object;
  }
};
var OMetaBase = class {
  constructor(properties, cloningFunction) {
    const { target, parent, ownKey } = properties;
    if (parent && ownKey !== void 0) {
      this.parent = parent;
      this.ownKey = ownKey;
    } else {
      this.parent = null;
      this.ownKey = null;
    }
    const targetClone = cloningFunction(target, this);
    this.observers = [];
    this.revocable = Proxy.revocable(targetClone, this);
    this.proxy = this.revocable.proxy;
    this.target = targetClone;
    this.options = this.processOptions(properties.options);
  }
  processOptions(options) {
    if (options) {
      if (typeof options !== "object") {
        throw new Error(`Observable options if/when provided, MAY only be an object, got '${options}'`);
      }
      const invalidOptions = Object.keys(options).filter((option) => !(option in validObservableOptionKeys));
      if (invalidOptions.length) {
        throw new Error(`'${invalidOptions.join(", ")}' is/are not a valid Observable option/s`);
      }
      return Object.assign({}, options);
    } else {
      return {};
    }
  }
  detach() {
    this.parent = null;
    return this.target;
  }
  set(target, key2, value) {
    let oldValue = target[key2];
    if (value !== oldValue) {
      const newValue = getObservedOf(value, key2, this);
      target[key2] = newValue;
      if (oldValue && typeof oldValue === "object") {
        const tmpObserved = oldValue[oMetaKey];
        if (tmpObserved) {
          oldValue = tmpObserved.detach();
        }
      }
      const changes = oldValue === void 0 ? [new Change(INSERT, [key2], newValue, void 0, this.proxy)] : [new Change(UPDATE, [key2], newValue, oldValue, this.proxy)];
      callObservers(this, changes);
    }
    return true;
  }
  deleteProperty(target, key2) {
    let oldValue = target[key2];
    delete target[key2];
    if (oldValue && typeof oldValue === "object") {
      const tmpObserved = oldValue[oMetaKey];
      if (tmpObserved) {
        oldValue = tmpObserved.detach();
      }
    }
    const changes = [new Change(DELETE, [key2], void 0, oldValue, this.proxy)];
    callObservers(this, changes);
    return true;
  }
};
var ObjectOMeta = class extends OMetaBase {
  constructor(properties) {
    super(properties, prepareObject);
  }
};
var ArrayOMeta = class extends OMetaBase {
  constructor(properties) {
    super(properties, prepareArray);
  }
  get(target, key2) {
    return proxiedArrayMethods[key2] || target[key2];
  }
};
var TypedArrayOMeta = class extends OMetaBase {
  constructor(properties) {
    super(properties, prepareTypedArray);
  }
  get(target, key2) {
    return proxiedTypedArrayMethods[key2] || target[key2];
  }
};
var Observable = Object.freeze({
  from: (target, options) => {
    if (!target || typeof target !== "object") {
      throw new Error("observable MAY ONLY be created from a non-null object");
    } else if (target[oMetaKey]) {
      return target;
    } else if (Array.isArray(target)) {
      return new ArrayOMeta({ target, ownKey: null, parent: null, options }).proxy;
    } else if (ArrayBuffer.isView(target)) {
      return new TypedArrayOMeta({ target, ownKey: null, parent: null, options }).proxy;
    } else if (target instanceof Date) {
      throw new Error(`${target} found to be one of a non-observable types`);
    } else {
      return new ObjectOMeta({ target, ownKey: null, parent: null, options }).proxy;
    }
  },
  isObservable: (input) => {
    return !!(input && input[oMetaKey]);
  }
});
function isObservable(input) {
  return !!(input && input[oMetaKey]);
}
function Observe(target, callback, options) {
  if (!target)
    return;
  if (!!(target && target[oMetaKey])) {
    if (callback)
      target.__observe(callback, options);
    return target;
  }
  ;
  let result;
  if (!target || typeof target !== "object") {
    throw new Error("observable MAY ONLY be created from a non-null object");
  } else if (target[oMetaKey]) {
    result = target;
  } else if (Array.isArray(target)) {
    result = new ArrayOMeta({ target, ownKey: null, parent: null }).proxy;
  } else if (ArrayBuffer.isView(target)) {
    result = new TypedArrayOMeta({ target, ownKey: null, parent: null }).proxy;
  } else if (target instanceof Date) {
    throw new Error(`${target} found to be one of a non-observable types`);
  } else {
    result = new ObjectOMeta({ target, ownKey: null, parent: null }).proxy;
  }
  if (callback)
    result.__observe(callback, options);
  return result;
}
function Unobserve(target, observer) {
  if (!target)
    return;
  if (!!(target && target[oMetaKey])) {
    target.__unobserve(observer);
  }
}
function ClearObservers(target) {
  if (!target)
    return;
  if (!!(target && target[oMetaKey])) {
    target.__clearObservers();
  }
}
function observable(propName) {
  return function(target, propertyName) {
    target["$observableProps"] = target["$observableProps"] || {};
    target["$observableProps"][propName || propertyName] = propertyName;
  };
}
function initObservables(target) {
  let observables = target["$observableProps"];
  target["$observables"] = target["$observables"] || {};
  for (let propName in observables) {
    let propertyName = observables[propName];
    let val = Observe({});
    let isObject = false;
    target["$observables"][propName] = val;
    const getter = function() {
      if (isObject)
        return val;
      else {
        return val.value;
      }
    };
    const setter = function(newVal) {
      if (typeof newVal == "object") {
        isObject = true;
        Object.assign(val, newVal);
      } else {
        isObject = false;
        val.value = newVal;
      }
    };
    Object.defineProperty(target, propertyName, {
      get: getter,
      set: setter
    });
  }
}

// packages/base/src/component.ts
var Component = class extends HTMLElement {
  constructor(parent, options, defaults) {
    super();
    this.attrs = {};
    this.options = options || {};
    this.defaults = defaults || {};
    initObservables(this);
  }
  connectedCallback() {
    if (this.connected)
      return;
    this.connected = true;
    if (!this.initialized)
      this.init();
  }
  disconnectCallback() {
    this.connected = false;
  }
  createElement(tagName, parentElm) {
    let result = document.createElement(tagName);
    if (parentElm)
      parentElm.appendChild(result);
    return result;
  }
  getAttributeValue(target, paths, idx) {
    idx = idx || 0;
    let path = paths[idx];
    let value = target[path];
    idx++;
    if (paths.length > idx)
      try {
        return this.getAttributeValue(value, paths, idx);
      } catch (error) {
        return value;
      }
    else
      return value;
  }
  getAttribute(name, removeAfter, defaultValue) {
    if (this.options[name] != null)
      return this.options[name];
    else if (this.attrs[name] != null && this.attrs[name] != void 0) {
      if (removeAfter)
        this.removeAttribute(name);
      if (this.attrs[name].__target)
        return this.getAttributeValue(this.attrs[name].__target, this.attrs[name].__path);
      else
        return this.attrs[name];
    } else {
      let value = super.getAttribute(name);
      if (value && value.__target)
        return;
      else if (value != null) {
        if (value == "false" || value == "true")
          value = JSON.parse(value);
        this.options[name] = value;
        if (removeAfter)
          this.removeAttribute(name);
        return value;
      } else if (this.defaults[name] != null)
        return this.defaults[name];
    }
    ;
    return defaultValue;
  }
  getPositionAttribute(name, removeAfter, defaultValue) {
    let result = parseFloat(this.getAttribute(name, removeAfter, defaultValue));
    if (removeAfter && result)
      this.style[name] = result + "px";
    return result;
  }
  getStyleAttribute(name, removeAfter, defaultValue) {
    let result = this.getAttribute(name, removeAfter, defaultValue);
    if (removeAfter && result)
      this.style[name] = result;
    return result;
  }
  get id() {
    return this.getAttribute("id");
  }
  set id(value) {
    this.options.id = value;
    this.setAttribute("id", value);
  }
  async ready() {
    if (this._ready)
      return;
    return new Promise((resolve) => {
      if (this._ready)
        return resolve();
      this._readyCallback = resolve;
      this.init();
    });
  }
  init() {
    this.initialized = true;
    if (this.options["class"]) {
      this.setAttribute("class", this.options["class"]);
    }
    if (this._ready === void 0) {
      this._ready = true;
      if (this._readyCallback) {
        let callback = this._readyCallback;
        delete this._readyCallback;
        callback();
      }
    }
  }
};

// packages/base/src/style/base.css.ts
var spinnerAnim = keyframes({
  "0%": {
    transform: "rotate(0deg)"
  },
  "100%": {
    transform: "rotate(360deg)"
  }
});
cssRule("body", {
  background: theme_exports.ThemeVars.background.default,
  backgroundAttachment: "fixed !important",
  margin: 0,
  padding: 0,
  overflowX: "hidden",
  overflowY: "auto",
  $nest: {
    "*, *:before, *:after": {
      boxSizing: "border-box"
    },
    ".text-left": {
      textAlign: "left"
    },
    ".text-right": {
      textAlign: "right"
    },
    ".text-center": {
      textAlign: "center"
    },
    ".bold": {
      fontWeight: "bold"
    },
    ".inline-flex": {
      display: "inline-flex"
    },
    ".flex": {
      display: "flex"
    },
    ".inline-block": {
      display: "inline-block"
    },
    ".mr-1": {
      marginRight: "1rem !important"
    },
    ".ml-1": {
      marginLeft: "1rem !important"
    },
    ".mb-1": {
      marginBottom: "1rem !important"
    },
    ".mt-1": {
      marginTop: "1rem !important"
    },
    ".mb-2": {
      marginBottom: "2rem"
    },
    ".pointer": {
      cursor: "pointer"
    },
    ".text-underline": {
      textDecoration: "underline"
    },
    ".text-none i-link > a": {
      textDecoration: "none"
    },
    ".i-loading-overlay": {
      position: "absolute",
      zIndex: 9,
      margin: 0,
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      transition: "opacity .3s",
      background: theme_exports.ThemeVars.background.default,
      $nest: {
        "&:after": {
          content: '""',
          position: "absolute",
          opacity: ".5",
          width: "100%",
          height: "100%"
        },
        ".i-loading-spinner_text": {
          fontSize: "1rem",
          color: theme_exports.ThemeVars.text.primary,
          fontFamily: theme_exports.ThemeVars.typography.fontFamily,
          marginTop: ".5rem"
        },
        ".i-loading-spinner_icon": {
          display: "block",
          animation: `${spinnerAnim} 2s linear infinite`,
          $nest: {
            "i-image": {
              display: "block",
              maxHeight: "100%",
              maxWidth: "100%"
            }
          }
        },
        ".i-loading-spinner": {
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 9999,
          padding: "1rem"
        }
      }
    }
  }
});
var disabledStyle = style({
  opacity: 0.4,
  cursor: "default"
});
var containerStyle = style({
  $nest: {
    "span.resizer": {
      zIndex: 999
    },
    "span.resizer:hover": {
      backgroundColor: theme_exports.ThemeVars.colors.info.main,
      transitionDelay: "0.5s"
    },
    "span.resizer.highlight": {
      backgroundColor: theme_exports.ThemeVars.colors.info.main
    },
    "span.e-resize": {
      position: "absolute",
      right: "0px",
      height: "100%",
      width: "4px",
      cursor: "e-resize"
    },
    "span.n-resize": {
      position: "absolute",
      top: "0px",
      height: "4px",
      width: "100%",
      cursor: "n-resize"
    },
    "span.s-resize": {
      position: "absolute",
      bottom: "0px",
      height: "4px",
      width: "100%",
      cursor: "s-resize"
    },
    "span.w-resize": {
      position: "absolute",
      left: "0px",
      height: "100%",
      width: "4px",
      cursor: "w-resize"
    },
    "span.resizing": {
      userSelect: "none",
      pointerEvents: "none"
    }
  }
});
var getBorderSideStyleClass = (side, value) => {
  let styleObj = {};
  if (value.width) {
    let borderWidthProp = `border-${side}-width`;
    styleObj[borderWidthProp] = typeof value.width == "number" ? value.width + "px" : value.width;
  }
  if (value.style) {
    let borderStyleProp = `border-${side}-style`;
    styleObj[borderStyleProp] = value.style;
  }
  if (value.color) {
    let borderColorProp = `border-${side}-color`;
    styleObj[borderColorProp] = value.color;
  }
  return style(styleObj);
};
var getBorderStyleClass = (value) => {
  let styleObj = {};
  if (value.width) {
    styleObj["borderWidth"] = typeof value.width == "number" ? value.width + "px" : value.width;
  }
  if (value.style) {
    styleObj["borderStyle"] = value.style;
  }
  if (value.color) {
    styleObj["borderColor"] = value.color;
  }
  if (value.radius) {
    styleObj["borderRadius"] = typeof value.radius == "number" ? value.radius + "px" : value.radius;
  }
  return style(styleObj);
};
var getOverflowStyleClass = (value) => {
  let styleObj = {};
  if (value.x === value.y) {
    styleObj.overflow = value.x;
  } else {
    if (value.x) {
      styleObj.overflowX = value.x;
    }
    if (value.y) {
      styleObj.overflowY = value.y;
    }
  }
  return style(styleObj);
};
var getBackgroundStyleClass = (value) => {
  let styleObj = {};
  let bg = "";
  value.image && (bg += `url(${value.image})`);
  value.color && (bg += `${value.color}`);
  styleObj.background = bg;
  return style(styleObj);
};
var getSpacingValue = (value) => {
  if (typeof value === "number")
    return value + "px";
  return value;
};
var getControlMediaQueriesStyle = (mediaQueries) => {
  let styleObj = {
    $nest: {}
  };
  if (mediaQueries) {
    for (let mediaQuery of mediaQueries) {
      let mediaQueryRule;
      if (mediaQuery.minWidth && mediaQuery.maxWidth) {
        mediaQueryRule = `@media (min-width: ${mediaQuery.minWidth}) and (max-width: ${mediaQuery.maxWidth})`;
      } else if (mediaQuery.minWidth) {
        mediaQueryRule = `@media (min-width: ${mediaQuery.minWidth})`;
      } else if (mediaQuery.maxWidth) {
        mediaQueryRule = `@media (max-width: ${mediaQuery.maxWidth})`;
      }
      if (mediaQueryRule) {
        styleObj["$nest"][mediaQueryRule] = {};
        if (typeof mediaQuery.properties.visible === "boolean") {
          const visible = mediaQuery.properties.visible;
          styleObj["$nest"][mediaQueryRule]["display"] = visible ? "flex !important" : "none !important";
        }
        if (mediaQuery.properties.padding) {
          const { top = 0, right = 0, bottom = 0, left = 0 } = mediaQuery.properties.padding;
          styleObj["$nest"][mediaQueryRule]["padding"] = `${getSpacingValue(top)} ${getSpacingValue(right)} ${getSpacingValue(bottom)} ${getSpacingValue(left)} !important`;
        }
        if (mediaQuery.properties.margin) {
          const { top = 0, right = 0, bottom = 0, left = 0 } = mediaQuery.properties.margin;
          styleObj["$nest"][mediaQueryRule]["margin"] = `${getSpacingValue(top)} ${getSpacingValue(right)} ${getSpacingValue(bottom)} ${getSpacingValue(left)} !important`;
        }
        if (mediaQuery.properties.border) {
          const { radius, width, style: style2, color, bottom, top, left, right } = mediaQuery.properties.border;
          if (width !== void 0 && width !== null)
            styleObj["$nest"][mediaQueryRule]["border"] = `${width || ""} ${style2 || ""} ${color || ""}!important`;
          if (radius)
            styleObj["$nest"][mediaQueryRule]["borderRadius"] = `${getSpacingValue(radius)} !important`;
          if (bottom)
            styleObj["$nest"][mediaQueryRule]["borderBottom"] = `${getSpacingValue(bottom.width || "")} ${bottom.style || ""} ${bottom.color || ""}!important`;
          if (top)
            styleObj["$nest"][mediaQueryRule]["borderTop"] = `${getSpacingValue(top.width || "") || ""} ${top.style || ""} ${top.color || ""}!important`;
          if (left)
            styleObj["$nest"][mediaQueryRule]["borderLeft"] = `${getSpacingValue(left.width || "")} ${left.style || ""} ${left.color || ""}!important`;
          if (right)
            styleObj["$nest"][mediaQueryRule]["borderRight"] = `${getSpacingValue(right.width || "")} ${right.style || ""} ${right.color || ""}!important`;
        }
        if (mediaQuery.properties.background) {
          const { color, image } = mediaQuery.properties.background;
          let bgString = "";
          image && (bgString += `url(${image})`);
          color && (bgString += `${color}`);
          styleObj["$nest"][mediaQueryRule]["background"] = bgString + "!important";
        }
      }
    }
  }
  return styleObj;
};
var getControlMediaQueriesStyleClass = (mediaQueries) => {
  let styleObj = getControlMediaQueriesStyle(mediaQueries);
  return style(styleObj);
};

// packages/tooltip/src/style/tooltip.css.ts
var Theme = theme_exports.ThemeVars;
var arrowBackgroundColor = "var(--tooltips-arrow-background, rgba(97, 97, 97, 0.92))";
cssRule("body", {
  $nest: {
    ".ii-tooltip": {
      position: "absolute",
      display: "inline-block",
      fontFamily: Theme.typography.fontFamily,
      backgroundColor: "rgba(97, 97, 97, 0.92)",
      borderRadius: "4px",
      color: "rgb(255, 255, 255)",
      padding: "4px 8px",
      fontSize: "0.6875rem",
      maxWidth: "300px",
      overflowWrap: "break-word",
      fontWeight: 500,
      zIndex: 9999
    },
    ".ii-tooltip-top::after": {
      content: "''",
      position: "absolute",
      top: "100%",
      left: "50%",
      marginLeft: "-5px",
      borderWidth: "5px",
      borderStyle: "solid",
      borderColor: `${arrowBackgroundColor} transparent transparent transparent`
    },
    ".ii-tooltip-topLeft::after": {
      content: "''",
      position: "absolute",
      top: "100%",
      left: "0%",
      marginLeft: "12px",
      borderWidth: "5px",
      borderStyle: "solid",
      borderColor: `${arrowBackgroundColor} transparent transparent transparent`
    },
    ".ii-tooltip-topRight::after": {
      content: "''",
      position: "absolute",
      top: "100%",
      right: "0%",
      marginRight: "12px",
      borderWidth: "5px",
      borderStyle: "solid",
      borderColor: `${arrowBackgroundColor} transparent transparent transparent`
    },
    ".ii-tooltip-left::after": {
      content: "''",
      position: "absolute",
      top: "50%",
      left: "100%",
      marginTop: "-5px",
      borderWidth: "5px",
      borderStyle: "solid",
      borderColor: `transparent transparent transparent ${arrowBackgroundColor}`
    },
    ".ii-tooltip-leftTop::after": {
      content: "''",
      position: "absolute",
      top: "0%",
      left: "100%",
      marginTop: "5px",
      borderWidth: "5px",
      borderStyle: "solid",
      borderColor: `transparent transparent transparent ${arrowBackgroundColor}`
    },
    ".ii-tooltip-leftBottom::after": {
      content: "''",
      position: "absolute",
      bottom: "0%",
      left: "100%",
      marginBottom: "5px",
      borderWidth: "5px",
      borderStyle: "solid",
      borderColor: `transparent transparent transparent ${arrowBackgroundColor}`
    },
    ".ii-tooltip-right::after": {
      content: "''",
      position: "absolute",
      top: "50%",
      right: "100%",
      marginTop: "-5px",
      borderWidth: "5px",
      borderStyle: "solid",
      borderColor: `transparent ${arrowBackgroundColor} transparent transparent`
    },
    ".ii-tooltip-rightTop::after": {
      content: "''",
      position: "absolute",
      top: "0%",
      right: "100%",
      marginTop: "5px",
      borderWidth: "5px",
      borderStyle: "solid",
      borderColor: `transparent ${arrowBackgroundColor} transparent transparent`
    },
    ".ii-tooltip-rightBottom::after": {
      content: "''",
      position: "absolute",
      bottom: "0%",
      right: "100%",
      marginBottom: "5px",
      borderWidth: "5px",
      borderStyle: "solid",
      borderColor: `transparent ${arrowBackgroundColor} transparent transparent`
    },
    ".ii-tooltip-bottom::after": {
      content: "''",
      position: "absolute",
      bottom: "100%",
      left: "50%",
      marginLeft: "-5px",
      borderWidth: "5px",
      borderStyle: "solid",
      borderColor: `transparent transparent ${arrowBackgroundColor} transparent`
    },
    ".ii-tooltip-bottomLeft::after": {
      content: "''",
      position: "absolute",
      bottom: "100%",
      left: "0%",
      marginLeft: "12px",
      borderWidth: "5px",
      borderStyle: "solid",
      borderColor: `transparent transparent ${arrowBackgroundColor} transparent`
    },
    ".ii-tooltip-bottomRight::after": {
      content: "''",
      position: "absolute",
      bottom: "100%",
      right: "0%",
      marginRight: "12px",
      borderWidth: "5px",
      borderStyle: "solid",
      borderColor: `transparent transparent ${arrowBackgroundColor} transparent`
    }
  }
});

// packages/tooltip/src/tooltip.ts
var Tooltip = class {
  constructor(source) {
    this.initData(source);
    this.initEvents(source);
  }
  initData(source) {
    const data = source.getAttribute("tooltip", true);
    let options = data;
    if (typeof data === "string") {
      try {
        options = JSON.parse(data);
      } catch (e) {
        options = null;
      }
    }
    this.content = (options == null ? void 0 : options.content) || "";
    this.popperClass = (options == null ? void 0 : options.popperClass) || "tooltip-content";
    this.placement = (options == null ? void 0 : options.placement) || "top";
    this.trigger = (options == null ? void 0 : options.trigger) || "hover";
    this.color = (options == null ? void 0 : options.color) || "rgba(0,0,0,.75)";
    if (options == null ? void 0 : options.maxWidth)
      this.maxWidth = options.maxWidth;
  }
  positionAt(parent, tooltip, placement) {
    const parentCoords = parent.getBoundingClientRect();
    let left = 0;
    let top = 0;
    const dist = 10;
    switch (placement) {
      case "top":
        top = parentCoords.top - tooltip.offsetHeight - dist;
        left = parentCoords.left + (parent.offsetWidth - tooltip.offsetWidth) / 2;
        break;
      case "topLeft":
        top = parentCoords.top - tooltip.offsetHeight - dist;
        left = parentCoords.left;
        break;
      case "topRight":
        top = parentCoords.top - tooltip.offsetHeight - dist;
        left = parentCoords.left + parent.offsetWidth - tooltip.offsetWidth;
        break;
      case "left":
        top = (parentCoords.top + parentCoords.bottom) / 2 - tooltip.offsetHeight / 2;
        left = parentCoords.left - dist - tooltip.offsetWidth;
        if (parentCoords.left - tooltip.offsetWidth < 0) {
          left = dist;
        }
        break;
      case "leftTop":
        top = parentCoords.top;
        left = parentCoords.left - dist - tooltip.offsetWidth;
        if (parentCoords.left - tooltip.offsetWidth < 0) {
          left = dist;
        }
        break;
      case "leftBottom":
        top = parentCoords.top + parent.offsetHeight - tooltip.offsetHeight;
        left = parentCoords.left - dist - tooltip.offsetWidth;
        if (parentCoords.left - tooltip.offsetWidth < 0) {
          left = dist;
        }
        break;
      case "right":
        top = (parentCoords.top + parentCoords.bottom) / 2 - tooltip.offsetHeight / 2;
        left = parentCoords.right + dist;
        if (parentCoords.right + tooltip.offsetWidth > document.documentElement.clientWidth) {
          left = document.documentElement.clientWidth - tooltip.offsetWidth - dist;
        }
        break;
      case "rightTop":
        top = parentCoords.top;
        left = parentCoords.right + dist;
        if (parentCoords.right + tooltip.offsetWidth > document.documentElement.clientWidth) {
          left = document.documentElement.clientWidth - tooltip.offsetWidth - dist;
        }
        break;
      case "rightBottom":
        top = parentCoords.top + parent.offsetHeight - tooltip.offsetHeight;
        left = parentCoords.right + dist;
        if (parentCoords.right + tooltip.offsetWidth > document.documentElement.clientWidth) {
          left = document.documentElement.clientWidth - tooltip.offsetWidth - dist;
        }
        break;
      case "bottom":
        top = parentCoords.bottom + dist;
        left = parentCoords.left + (parent.offsetWidth - tooltip.offsetWidth) / 2;
        break;
      case "bottomLeft":
        top = parentCoords.bottom + dist;
        left = parentCoords.left;
        break;
      case "bottomRight":
        top = parentCoords.bottom + dist;
        left = parentCoords.left + parent.offsetWidth - tooltip.offsetWidth;
        break;
    }
    left = left < 0 ? parentCoords.left : left;
    top = top < 0 ? parentCoords.bottom + dist : top;
    tooltip.style.left = left + "px";
    tooltip.style.top = top + pageYOffset + "px";
  }
  get trigger() {
    return this._trigger;
  }
  set trigger(value) {
    this._trigger = value;
  }
  get popperClass() {
    return this._popperClass;
  }
  set popperClass(value) {
    this._popperClass = value;
    if (this.tooltipElm && value)
      this.tooltipElm.classList.add(this.popperClass);
  }
  get color() {
    return this._color;
  }
  set color(value) {
    this._color = value;
    if (this.tooltipElm && value) {
      this.tooltipElm.style.backgroundColor = this.color;
      this.tooltipElm.style.setProperty("--tooltips-arrow-background", this.color);
    }
  }
  get content() {
    return this._content;
  }
  set content(value) {
    this._content = value;
    if (this.tooltipElm)
      this.tooltipElm.innerHTML = this.content;
  }
  get placement() {
    return this._placement;
  }
  set placement(value) {
    this._placement = value;
    if (this.tooltipElm)
      this.tooltipElm.classList.add(`ii-tooltip-${this.placement}`);
  }
  get maxWidth() {
    return this._maxWidth;
  }
  set maxWidth(value) {
    this._maxWidth = value;
    if (this.tooltipElm && value)
      this.tooltipElm.style.maxWidth = this.maxWidth;
  }
  show(elm) {
    if (!this.tooltipElm)
      this.renderTooltip();
    document.body.appendChild(this.tooltipElm);
    this.positionAt(elm, this.tooltipElm, this.placement);
  }
  close() {
    if (this.tooltipElm && document.body.contains(this.tooltipElm))
      document.body.removeChild(this.tooltipElm);
  }
  onHandleClick(elm) {
    this.show(elm);
    this.timeout = setTimeout(() => {
      clearTimeout(this.timeout);
      if (this.tooltipElm && document.body.contains(this.tooltipElm))
        document.body.removeChild(this.tooltipElm);
    }, 200);
  }
  renderTooltip() {
    this.tooltipElm = document.createElement("div");
    this.tooltipElm.classList.add("ii-tooltip");
    this.tooltipElm.innerHTML = this.content;
    this.tooltipElm.classList.add(this.popperClass);
    this.tooltipElm.classList.add(`ii-tooltip-${this.placement}`);
    if (this.color) {
      this.tooltipElm.style.backgroundColor = this.color;
      this.tooltipElm.style.setProperty("--tooltips-arrow-background", this.color);
    }
    if (this.maxWidth)
      this.tooltipElm.style.maxWidth = this.maxWidth;
  }
  initEvents(source) {
    source.addEventListener("mouseover", (e) => {
      if (!this.content)
        return;
      if (this.trigger === "hover") {
        e.preventDefault();
        e.stopImmediatePropagation();
        this.show(source);
        source.addEventListener("mouseleave", (e2) => {
          this.close();
        });
      }
    });
    source.addEventListener("mousedown", (e) => {
      if (!this.content)
        return;
      if (this.trigger === "click") {
        this.onHandleClick(source);
      } else {
        this.close();
      }
    });
  }
};

// packages/base/src/control.ts
function getParentControl(elm) {
  if (elm.parentElement instanceof Control) {
    return elm.parentElement;
  } else if (elm.parentElement)
    return getParentControl(elm.parentElement);
  return null;
}
var toNumberValue = (value) => {
  return parseFloat(value.replace("px", ""));
};
var _refreshTimeout;
function refresh() {
  if (!document.body.style.opacity)
    document.body.style.opacity = "0";
  clearTimeout(_refreshTimeout);
  _refreshTimeout = setTimeout(() => {
    try {
      clearTimeout(_refreshTimeout);
      _refreshTimeout = void 0;
      for (let i = 0; i < document.body.childNodes.length; i++) {
        let node = document.body.childNodes[i];
        if (node instanceof Container) {
          node.style.position = "absolute";
          node.style.width = "100%";
          node.style.height = "100%";
          node.refresh();
        }
      }
    } finally {
      document.body.style.opacity = "1";
    }
  }, 10);
}
window.addEventListener("resize", () => {
  refresh();
});
var SpaceValue = class {
  constructor(owner, value, prop) {
    this._owner = owner;
    this._value = value;
    this._prop = prop;
  }
  get left() {
    return this._value.left;
  }
  set left(value) {
    this._value.left = value;
    this.update();
  }
  get top() {
    return this._value.top;
  }
  set top(value) {
    this._value.top = value;
    this.update();
  }
  get right() {
    return this._value.right;
  }
  set right(value) {
    this._value.right = value;
    this.update();
  }
  get bottom() {
    return this._value.bottom;
  }
  set bottom(value) {
    this._value.bottom = value;
    this.update();
  }
  update(value) {
    if (value)
      this._value = value;
    else {
      switch (this._prop) {
        case "margin":
          this._owner.margin = this._value;
          break;
        case "padding":
          if (this._owner instanceof Container)
            this._owner.padding = this._value;
          break;
      }
      ;
    }
    ;
  }
};
var DefaultBorderSideStyles = {
  width: void 0,
  style: void 0,
  color: void 0
};
var DefaultAnchor = { top: true, left: true, right: false, bottom: false };
var Border = class {
  constructor(target, options) {
    this._styleClassMap = {};
    this._target = target;
    if (options) {
      if (options.width || options.style || options.color || options.radius) {
        this.updateAllSidesProps(options);
      } else if (options.top || options.right || options.bottom || options.left) {
        if (options.top)
          this._top = options.top;
        if (options.right)
          this._right = options.right;
        if (options.bottom)
          this._bottom = options.bottom;
        if (options.left)
          this._left = options.left;
        this.setSideBorderStyles("top", this.top);
        this.setSideBorderStyles("right", this.right);
        this.setSideBorderStyles("bottom", this.bottom);
        this.setSideBorderStyles("left", this.left);
      }
    }
  }
  updateAllSidesProps(options) {
    if (options.width)
      this._width = typeof options.width == "number" ? options.width + "px" : options.width;
    if (options.style)
      this._style = options.style;
    if (options.color)
      this._color = options.color;
    if (options.radius)
      this._radius = typeof options.radius == "number" ? options.radius + "px" : options.radius;
    this.setBorderStyles(options);
  }
  get radius() {
    return this._radius;
  }
  set radius(value) {
    if (typeof value == "number") {
      this._radius = value + "px";
      this._target.style.borderRadius = value + "px";
    } else {
      this._radius = value;
      this._target.style.borderRadius = value;
    }
  }
  get width() {
    return this._width;
  }
  set width(value) {
    if (typeof value == "number") {
      this._width = value + "px";
    } else {
      this._width = value;
    }
    this.setBorderStyles({
      width: this._width
    });
  }
  get style() {
    return this._style;
  }
  set style(value) {
    this._style = value;
    this.setBorderStyles({
      style: this._style
    });
  }
  get color() {
    return this._color;
  }
  set color(value) {
    this._color = value;
    this.setBorderStyles({
      color: this._color
    });
  }
  get top() {
    if (!this._top) {
      this._top = { ...DefaultBorderSideStyles };
    }
    return this._top;
  }
  set top(value) {
    this._top = value;
    this.setSideBorderStyles("top", value);
  }
  get right() {
    if (!this._right) {
      this._right = { ...DefaultBorderSideStyles };
    }
    return this._right;
  }
  set right(value) {
    this._right = value;
    this.setSideBorderStyles("right", value);
  }
  get bottom() {
    if (!this._bottom) {
      this._bottom = { ...DefaultBorderSideStyles };
    }
    return this._bottom;
  }
  set bottom(value) {
    this._bottom = value;
    this.setSideBorderStyles("bottom", value);
  }
  get left() {
    if (!this._left) {
      this._left = { ...DefaultBorderSideStyles };
    }
    return this._left;
  }
  set left(value) {
    this._left = value;
    this.setSideBorderStyles("left", value);
  }
  removeStyleClass(name) {
    if (this._styleClassMap[name]) {
      this._target.classList.remove(this._styleClassMap[name]);
      delete this._styleClassMap[name];
    }
  }
  setSideBorderStyles(side, value) {
    if (value && (value.width || value.style || value.color)) {
      let style2 = getBorderSideStyleClass(side, value);
      this.removeStyleClass(side);
      this._styleClassMap[side] = style2;
      this._target.classList.add(style2);
    }
  }
  setBorderStyles(value) {
    if (value.width || value.style || value.color || value.radius) {
      let style2 = getBorderStyleClass(value);
      this.removeStyleClass("left");
      this.removeStyleClass("bottom");
      this.removeStyleClass("right");
      this.removeStyleClass("top");
      if (value.width) {
        this.removeStyleClass("width");
        this._styleClassMap["width"] = style2;
      }
      if (value.style) {
        this.removeStyleClass("style");
        this._styleClassMap["style"] = style2;
      }
      if (value.color) {
        this.removeStyleClass("color");
        this._styleClassMap["color"] = style2;
      }
      if (value.radius) {
        this.removeStyleClass("radius");
        this._styleClassMap["radius"] = style2;
      }
      this._target.classList.add(style2);
    }
  }
};
var Overflow = class {
  constructor(target, value) {
    this._target = target;
    if (value) {
      this.updateValue(value);
      this.setOverflowStyle();
    }
  }
  get x() {
    var _a;
    return (_a = this._value.x) != null ? _a : "visible";
  }
  set x(value) {
    if (!this._value) {
      this._value = { x: value };
    } else {
      this._value.x = value;
    }
    this.setOverflowStyle();
  }
  get y() {
    var _a;
    return (_a = this._value.y) != null ? _a : "visible";
  }
  set y(value) {
    if (!this._value) {
      this._value = { x: value };
    } else {
      this._value.y = value;
    }
    this.setOverflowStyle();
  }
  updateValue(value) {
    if (typeof value === "string") {
      this._value = { x: value, y: value };
    } else {
      this._value = value;
    }
  }
  setOverflowStyle(value) {
    if (value) {
      this.updateValue(value);
    }
    let style2 = getOverflowStyleClass(this._value);
    if (this._style) {
      this._target.classList.remove(this._style);
    }
    this._style = style2;
    this._target.classList.add(style2);
  }
};
var Background = class {
  constructor(target, value) {
    this._target = target;
    value && this.setBackgroundStyle(value);
  }
  get color() {
    var _a;
    return ((_a = this._value) == null ? void 0 : _a.color) || "";
  }
  set color(value) {
    if (!this._value) {
      this._value = { color: value };
    } else {
      this._value.color = value;
    }
    this.setBackgroundStyle();
  }
  get image() {
    return this._value.image || "";
  }
  set image(value) {
    if (!this._value) {
      this._value = { image: value };
    } else {
      this._value.image = value;
    }
    this.setBackgroundStyle();
  }
  updateValue(value) {
    this._value = value;
  }
  setBackgroundStyle(value) {
    value && this.updateValue(value);
    let style2 = getBackgroundStyleClass(this._value);
    this._style && this._target.classList.remove(this._style);
    this._style = style2;
    this._target.classList.add(style2);
  }
};
var Control = class extends Component {
  constructor(parent, options, defaults) {
    super(parent, options, defaults);
    this._controls = [];
    this._enabled = true;
    this._visible = true;
    this.parent = parent;
  }
  static async create(options, parent, defaults) {
    let self = new this(parent, options);
    await self.ready();
    return self;
  }
  getMarginStyle() {
    const computedStyle = window.getComputedStyle(this);
    const left = toNumberValue(computedStyle.marginLeft);
    const right = toNumberValue(computedStyle.marginRight);
    const bottom = toNumberValue(computedStyle.marginBottom);
    const top = toNumberValue(computedStyle.marginTop);
    return { top, right, bottom, left };
  }
  getPaddingStyle() {
    const computedStyle = window.getComputedStyle(this);
    const left = toNumberValue(computedStyle.paddingLeft);
    const right = toNumberValue(computedStyle.paddingRight);
    const bottom = toNumberValue(computedStyle.paddingBottom);
    const top = toNumberValue(computedStyle.paddingTop);
    return { top, right, bottom, left };
  }
  get margin() {
    return this._margin;
  }
  set margin(value) {
    if (!this._margin)
      this._margin = new SpaceValue(this, value, "margin");
    else
      this._margin.update(value);
    const { top = 0, right = 0, bottom = 0, left = 0 } = value;
    this.style.margin = `${this.getSpacingValue(top)} ${this.getSpacingValue(right)} ${this.getSpacingValue(bottom)} ${this.getSpacingValue(left)}`;
  }
  get marginStyle() {
    return (side) => this.getMarginStyle()[side];
  }
  get padding() {
    return this._padding;
  }
  set padding(value) {
    if (!this._padding)
      this._padding = new SpaceValue(this, value, "padding");
    else
      this._padding.update(value);
    const { top = 0, right = 0, bottom = 0, left = 0 } = value;
    this.style.padding = `${this.getSpacingValue(top)} ${this.getSpacingValue(right)} ${this.getSpacingValue(bottom)} ${this.getSpacingValue(left)}`;
  }
  get paddingStyle() {
    return (side) => this.getPaddingStyle()[side];
  }
  addChildControl(control) {
    if (!control.parentNode)
      this.appendChild(control);
  }
  removeChildControl(control) {
    if (this.contains(control))
      this.removeChild(control);
  }
  get parent() {
    return this._parent;
  }
  set parent(value) {
    if (value && value._controls.indexOf(this) < 0)
      value._controls.push(this);
    if (this._parent != value) {
      if (this._parent) {
        if (this._parent._controls.indexOf(this) > -1)
          this._parent._controls.splice(this._parent._controls.indexOf(this), 1);
        this._parent.removeChildControl(this);
        if (!_refreshTimeout)
          this._parent.refresh();
      }
      ;
      this._parent = value;
      if (this._parent) {
        this._parent.addChildControl(this);
        if (!_refreshTimeout)
          this._parent.refresh();
      }
    }
  }
  getSpacingValue(value) {
    if (typeof value === "number")
      return value + "px";
    if (value === "auto")
      return value;
    const unit = value.replace(/^-?\d+(\.\d+)?/g, "");
    const number = value.replace(unit, "");
    const isValidUnit = ["px", "em", "rem", "%"].includes(unit);
    return isValidUnit ? value : `${number}px`;
  }
  connectedCallback() {
    super.connectedCallback();
    refresh();
    if (!this.mediaQueries)
      this.setAttributeToProperty("mediaQueries");
  }
  disconnectCallback() {
    this.parent = void 0;
    super.disconnectCallback();
  }
  getParentHeight() {
    if (!this._parent)
      return window.innerHeight;
    else if (this._parent._container)
      return this._parent._container.offsetHeight;
    else
      return this._parent.offsetHeight;
  }
  getParentWidth() {
    if (!this._parent)
      return window.innerWidth;
    else if (this._parent._container)
      return this._parent._container.offsetWidth;
    else {
      return this._parent.offsetWidth;
    }
  }
  getParentOccupiedLeft() {
    if (!this._parent)
      return 0;
    else {
      let result = this._parent.paddingStyle("left");
      for (let i = 0; i < this._parent._controls.length; i++) {
        let control = this._parent._controls[i];
        if (control === this) {
          if (this.dock == "left")
            return result;
        } else if (control.visible && control.dock == "left") {
          result += control.offsetWidth + control.marginStyle("left");
        }
      }
      ;
      return result;
    }
    ;
  }
  getParentOccupiedRight() {
    if (!this._parent)
      return 0;
    else {
      let result = this._parent.paddingStyle("right");
      for (let i = 0; i < this._parent._controls.length; i++) {
        let control = this._parent._controls[i];
        if (control === this) {
          if (this.dock == "right")
            return result;
        } else if (control.dock == "right") {
          result += control.offsetWidth + control.marginStyle("right");
        }
      }
      ;
      return result;
    }
    ;
  }
  getParentOccupiedBottom() {
    if (!this._parent)
      return 0;
    else {
      let result = this._parent.paddingStyle("bottom");
      for (let i = 0; i < this._parent._controls.length; i++) {
        let control = this._parent._controls[i];
        if (control === this) {
          if (this.dock == "bottom")
            return result;
        } else if (control.visible && control.dock == "bottom") {
          result += control.offsetHeight + control.marginStyle("bottom");
        }
      }
      ;
      return result;
    }
    ;
  }
  getParentOccupiedTop() {
    if (!this._parent)
      return 0;
    else {
      let result = this._parent.paddingStyle("top");
      for (let i = 0; i < this._parent._controls.length; i++) {
        let control = this._parent._controls[i];
        if (control === this) {
          if (this.dock == "top")
            return result;
        } else if (control.visible && control.dock == "top") {
          result += control.offsetHeight + control.marginStyle("top");
        }
      }
      ;
      return result;
    }
    ;
  }
  get dock() {
    return this._dock || "";
  }
  set dock(value) {
    this._dock = value;
    if (this._resizer)
      this._resizer.reset();
  }
  get enabled() {
    return this._enabled;
  }
  set enabled(value) {
    if (this._enabled != value) {
      this._enabled = value;
      if (value) {
        this.classList.remove("disabled");
        this.classList.remove(disabledStyle);
      } else {
        this.classList.add("disabled");
        this.classList.add(disabledStyle);
      }
    }
  }
  _handleClick(event, stopPropagation) {
    if (this._onClick) {
      this._onClick(this, event);
      return true;
    } else if (!stopPropagation) {
      let parent = getParentControl(this);
      if (!parent)
        return false;
      parent._handleClick = parent._handleClick.bind(parent);
      return parent._handleClick(event);
    } else
      return true;
  }
  _handleContextMenu(event, stopPropagation) {
    if (this._onContextMenu) {
      this._onContextMenu(this, event);
      return true;
    } else if (!stopPropagation) {
      let parent = getParentControl(this);
      if (!parent)
        return false;
      parent._handleContextMenu = parent._handleContextMenu.bind(parent);
      return parent._handleContextMenu(event);
    } else
      return true;
  }
  _handleDblClick(event, stopPropagation) {
    if (this._onDblClick) {
      this._onDblClick(this, event);
      return true;
    } else if (!stopPropagation) {
      let parent = getParentControl(this);
      if (!parent)
        return false;
      parent._handleDblClick = parent._handleDblClick.bind(parent);
      return parent._handleDblClick(event);
    } else
      return true;
  }
  _handleFocus(event, stopPropagation) {
    if (this._onFocus) {
      this._onFocus(this, event);
      return true;
    } else if (!stopPropagation) {
      let parent = getParentControl(this);
      if (!parent)
        return false;
      parent._handleFocus = parent._handleFocus.bind(parent);
      return parent._handleFocus(event);
    } else
      return true;
  }
  _handleKeyDown(event, stopPropagation) {
    if (this._onKeyDown) {
      this._onKeyDown(this, event);
      return true;
    } else if (!stopPropagation) {
      let parent = getParentControl(this);
      if (!parent)
        return false;
      parent._handleKeyDown = parent._handleKeyDown.bind(parent);
      return parent._handleKeyDown(event);
    } else
      return true;
  }
  _handleKeyUp(event, stopPropagation) {
    if (this._onKeyUp) {
      this._onKeyUp(this, event);
      return true;
    } else if (!stopPropagation) {
      let parent = getParentControl(this);
      if (!parent)
        return false;
      parent._handleKeyUp = parent._handleKeyUp.bind(parent);
      return parent._handleKeyUp(event);
    } else
      return true;
  }
  _handleMouseDown(event, stopPropagation) {
    if (this._onMouseDown) {
      this._onMouseDown(this, event);
      return true;
    } else if (!stopPropagation) {
      let parent = getParentControl(this);
      if (!parent)
        return false;
      parent._handleMouseDown = parent._handleMouseDown.bind(parent);
      return parent._handleMouseDown(event);
    } else
      return true;
  }
  _handleMouseMove(event, stopPropagation) {
    if (this._onMouseMove) {
      this._onMouseMove(this, event);
      return true;
    } else if (!stopPropagation) {
      let parent = getParentControl(this);
      if (!parent)
        return false;
      parent._handleMouseMove = parent._handleMouseMove.bind(parent);
      return parent._handleMouseMove(event);
    } else
      return true;
  }
  _handleMouseUp(event, stopPropagation) {
    if (this._onMouseUp) {
      this._onMouseUp(this, event);
      return true;
    } else if (!stopPropagation) {
      let parent = getParentControl(this);
      if (!parent)
        return false;
      parent._handleMouseUp = parent._handleMouseUp.bind(parent);
      return parent._handleMouseUp(event);
    } else
      return true;
  }
  get maxWidth() {
    return this.style.maxWidth;
  }
  set maxWidth(value) {
    if (!isNaN(Number(value))) {
      this.style.maxWidth = value + "px";
    } else {
      this.style.maxWidth = value + "";
    }
  }
  get minWidth() {
    return this.style.minWidth;
  }
  set minWidth(value) {
    if (!isNaN(Number(value))) {
      this.style.minWidth = value + "px";
    } else {
      this.style.minWidth = value + "";
    }
  }
  observables(propName) {
    let self = this;
    if (self["$observables"] && self["$observables"][propName])
      return self["$observables"][propName];
  }
  get onClick() {
    return this._onClick;
  }
  set onClick(callback) {
    this._onClick = callback;
  }
  get onDblClick() {
    return this._onDblClick;
  }
  set onDblClick(callback) {
    this._onDblClick = callback;
  }
  get onContextMenu() {
    return this._onContextMenu;
  }
  set onContextMenu(callback) {
    this._onContextMenu = callback;
  }
  clearInnerHTML() {
    this.innerHTML = "";
  }
  refresh() {
    if (this._dock != null) {
      this.style.position = "absolute";
      switch (this.dock) {
        case "none": {
          if (this.anchor.top === false)
            this.top = (this.getParentHeight() - this.offsetHeight) / 2;
          if (this.anchor.left === false)
            this.left = (this.getParentWidth() - this.offsetWidth) / 2;
          break;
        }
        case "left": {
          let top = this.getParentOccupiedTop();
          this.top = top;
          this.left = this.getParentOccupiedLeft();
          this.height = this.getParentHeight() - top - this.getParentOccupiedBottom() - this.marginStyle("top") - this.marginStyle("bottom");
          break;
        }
        case "top": {
          this.top = this.getParentOccupiedTop();
          this.width = this.getParentWidth();
          if (this.anchor.left)
            this.left = 0;
          else
            this.left = (this.getParentWidth() - this.offsetWidth) / 2;
          break;
        }
        case "right": {
          let top = this.getParentOccupiedTop();
          this.top = top;
          this.left = this.getParentWidth() - this.getParentOccupiedRight() - this.offsetWidth;
          this.height = this.getParentHeight() - top - this.getParentOccupiedBottom();
          break;
        }
        case "bottom":
          this.top = this.getParentHeight() - this.getParentOccupiedBottom() - this.offsetHeight;
          this.left = 0;
          this.width = this.getParentWidth();
          break;
        case "fill":
          this.width = this.getParentWidth() - this.getParentOccupiedLeft() - this.getParentOccupiedRight();
          this.height = this.getParentHeight() - this.getParentOccupiedTop() - this.getParentOccupiedBottom();
          this.left = this.getParentOccupiedLeft();
          this.top = this.getParentOccupiedTop();
          break;
        case "center":
          this.left = (this.getParentWidth() - this.offsetWidth) / 2;
          this.top = (this.getParentHeight() - this.offsetHeight) / 2;
          break;
      }
    }
    ;
  }
  get resizable() {
    return this.attrs["resizer"] == true && ["left", "top", "right", "bottom"].indexOf(this.dock) >= 0;
  }
  setProperty(propName, value) {
    if (value.__target) {
      let target = value.__target;
      let path = value.__path;
      this[propName] = target[path[0]];
      Observe(target.observables(path[0]), (changes) => {
        let change = changes[0];
        this[propName] = change.value;
      });
    } else {
      this.setAttribute(propName, value);
    }
  }
  setAttributeToProperty(propertyName) {
    const prop = this.getAttribute(propertyName, true);
    if (prop !== null && prop !== void 0)
      this[propertyName] = prop;
  }
  init() {
    super.init();
    this.setAttributeToProperty("height");
    this.setAttributeToProperty("left");
    this.setAttributeToProperty("top");
    this.setAttributeToProperty("right");
    this.setAttributeToProperty("bottom");
    this.setAttributeToProperty("width");
    this.setAttributeToProperty("dock");
    this.setAttributeToProperty("margin");
    this.setAttributeToProperty("padding");
    this.setAttributeToProperty("tag");
    this.setAttributeToProperty("anchor");
    this.setAttributeToProperty("maxWidth");
    this.setAttributeToProperty("minWidth");
    this.setAttributeToProperty("stack");
    this.setAttributeToProperty("grid");
    if (this._left != null || this._top != null)
      this.style.position = "absolute";
    if (this.getAttribute("enabled") !== false)
      this.classList.add("enabled");
    else
      this.enabled = false;
    if (this.getAttribute("visible") == false)
      this.visible = false;
    this.setAttributeToProperty("position");
    this.setAttributeToProperty("background");
    this.setAttributeToProperty("zIndex");
    this.setAttributeToProperty("lineHeight");
    this.setAttributeToProperty("linkTo");
    this.setAttributeToProperty("maxHeight");
    this.setAttributeToProperty("minHeight");
    this.setAttributeToProperty("opacity");
    const tooltip = this.getAttribute("tooltip", true);
    tooltip && (this._tooltip = new Tooltip(this));
    const font = this.getAttribute("font", true);
    font && (this.font = font);
    let border = this.getAttribute("border", true);
    if (border) {
      this._border = new Border(this, border);
    }
    this.setAttributeToProperty("overflow");
    this.setAttributeToProperty("display");
  }
  setElementPosition(elm, prop, value) {
    if (value != null && !isNaN(value)) {
      this["_" + prop] = parseFloat(value);
      elm.style[prop] = parseFloat(value) + "px";
    } else if (value != null) {
      this["_" + prop] = value;
      elm.style[prop] = value;
    }
  }
  setPosition(prop, value) {
    if (value != null && !isNaN(value)) {
      this["_" + prop] = parseFloat(value);
      this.style[prop] = parseFloat(value) + "px";
    } else if (value != null) {
      this["_" + prop] = value;
      this.style[prop] = value;
    }
    ;
  }
  get height() {
    return !isNaN(this._height) ? this._height : this.offsetHeight;
  }
  set height(value) {
    this.setPosition("height", value);
  }
  get heightValue() {
    if (typeof this._height == "string")
      return parseInt(this._height, 10);
    else
      return this._height;
  }
  get left() {
    return !isNaN(this._left) ? this._left : this.offsetLeft;
  }
  set left(value) {
    this.setPosition("left", value);
  }
  set right(value) {
    this.setPosition("right", value);
  }
  set bottom(value) {
    this.setPosition("bottom", value);
  }
  get top() {
    return !isNaN(this._top) ? this._top : this.offsetTop;
  }
  set top(value) {
    this.setPosition("top", value);
  }
  get visible() {
    return this._visible;
  }
  set visible(value) {
    this._visible = value;
    if (!this._visible)
      this.style.display = "none";
    else if (this._left != null || this._top != null)
      this.style.display = "block";
    else
      this.style.display = "";
    if (this._parent && !_refreshTimeout)
      this._parent.refresh();
  }
  get width() {
    return !isNaN(this._width) ? this._width : this.offsetWidth;
  }
  set width(value) {
    this.setPosition("width", value);
  }
  get widthValue() {
    if (typeof this._width == "string")
      return parseInt(this._width, 10);
    else
      return this._width;
  }
  get stack() {
    return this._stack;
  }
  set stack(value) {
    this._stack = value;
    this.style.flexBasis = value.basis || "";
    this.style.flexGrow = value.grow || "";
    this.style.flexShrink = value.shrink || "";
  }
  get grid() {
    return this._grid;
  }
  set grid(value) {
    this._grid = value;
    if (value.column && value.columnSpan)
      this.style.gridColumn = value.column + " / span " + value.columnSpan;
    else if (value.column)
      this.style.gridColumnStart = value.column.toString();
    else if (value.columnSpan)
      this.style.gridColumn = "span " + value.columnSpan;
    if (value.row && value.rowSpan)
      this.style.gridRow = value.row + " / span " + value.rowSpan;
    else if (value.row)
      this.style.gridRowStart = value.row.toString();
    else if (value.rowSpan)
      this.style.gridRow = "span " + value.rowSpan;
    if (value.area)
      this.style.gridArea = value.area;
    if (value.horizontalAlignment)
      this.style.justifyContent = value.horizontalAlignment;
  }
  get background() {
    if (!this._background) {
      this._background = new Background(this);
    }
    return this._background;
  }
  set background(value) {
    if (!this._background) {
      this._background = new Background(this, value);
    } else {
      this._background.setBackgroundStyle(value);
    }
  }
  get zIndex() {
    return this.style.zIndex;
  }
  set zIndex(value) {
    this.style.zIndex = "" + value;
  }
  get lineHeight() {
    return this._lineHeight;
  }
  set lineHeight(value) {
    this._lineHeight = value;
    this.style.lineHeight = "" + value;
  }
  get linkTo() {
    return this._linkTo;
  }
  set linkTo(value) {
    this._linkTo = value;
  }
  get position() {
    return this.style.position;
  }
  set position(value) {
    this.style.position = value;
  }
  get maxHeight() {
    return this.style.maxHeight;
  }
  set maxHeight(value) {
    if (!isNaN(Number(value))) {
      this.style.maxHeight = value + "px";
    } else {
      this.style.maxHeight = value + "";
    }
  }
  get minHeight() {
    return this.style.minHeight;
  }
  set minHeight(value) {
    if (!isNaN(Number(value))) {
      this.style.minHeight = value + "px";
    } else {
      this.style.minHeight = value + "";
    }
  }
  get border() {
    if (!this._border) {
      this._border = new Border(this);
    }
    return this._border;
  }
  set border(value) {
    this._border = new Border(this, value);
  }
  get overflow() {
    if (!this._overflow) {
      this._overflow = new Overflow(this);
    }
    return this._overflow;
  }
  set overflow(value) {
    if (!this._overflow) {
      this._overflow = new Overflow(this, value);
    } else {
      this._overflow.setOverflowStyle(value);
    }
  }
  get tooltip() {
    if (!this._tooltip) {
      this._tooltip = new Tooltip(this);
    }
    return this._tooltip;
  }
  get font() {
    return {
      color: this.style.color,
      name: this.style.fontFamily,
      size: this.style.fontSize,
      bold: this.style.fontStyle.indexOf("bold") >= 0,
      style: this.style.fontStyle,
      transform: this.style.textTransform,
      weight: this.style.fontWeight
    };
  }
  set font(value) {
    this.style.color = value.color || "";
    this.style.fontSize = value.size || "";
    this.style.fontFamily = value.name || "";
    this.style.fontStyle = value.style || "";
    this.style.textTransform = value.transform || "none";
    this.style.fontWeight = value.bold ? "bold" : `${value.weight || ""}`;
  }
  get display() {
    return this._display;
  }
  set display(value) {
    this._display = value;
    this.style.display = value;
  }
  get anchor() {
    return this._anchor || DefaultAnchor;
  }
  set anchor(value) {
    const data = { ...DefaultAnchor, ...value };
    this._anchor = data;
  }
  get opacity() {
    return this.style.opacity;
  }
  set opacity(value) {
    this.style.opacity = typeof value === "string" ? value : `${value}`;
  }
  get mediaQueries() {
    return this._cmediaQueries;
  }
  set mediaQueries(value) {
    this._cmediaQueries = value;
    let style2 = getControlMediaQueriesStyleClass(this._cmediaQueries);
    this._mediaStyle && this.classList.remove(this._mediaStyle);
    this._mediaStyle = style2;
    this.classList.add(style2);
  }
};
var ContainerResizer = class {
  constructor(target) {
    this.target = target;
    this._mouseDownHandler = this.handleMouseDown.bind(this);
    this._mouseUpHandler = this.handleMouseUp.bind(this);
    this._mouseMoveHandler = this.handleMouseMove.bind(this);
  }
  reset() {
    if (!this.target.resizable && this._resizer) {
      this._resizer.removeEventListener("mousedown", this._mouseDownHandler);
      this.target.removeChild(this._resizer);
      this._resizer = void 0;
    } else if (this.target.resizable) {
      switch (this.target.dock) {
        case "left":
          this.resizer.classList.value = "resizer e-resize";
          break;
        case "top":
          this.resizer.classList.value = "resizer s-resize";
          break;
        case "right":
          this.resizer.classList.value = "resizer w-resize";
          break;
        case "bottom":
          this.resizer.classList.value = "resizer n-resize";
          break;
      }
      ;
    }
    ;
  }
  handleMouseDown(e) {
    this.target.classList.add("resizing");
    this._origHeight = this.target.offsetHeight;
    this._origWidth = this.target.offsetWidth;
    if (this._resizer) {
      this._resizer.classList.add("highlight");
      this._mouseDownPos = {
        x: e.clientX,
        y: e.clientY
      };
      document.addEventListener("mousemove", this._mouseMoveHandler);
      document.addEventListener("mouseup", this._mouseUpHandler);
    }
  }
  handleMouseMove(e) {
    var _a, _b, _c, _d;
    e.preventDefault();
    e.stopPropagation();
    let offsetX = e.clientX - this._mouseDownPos.x;
    let offsetY = e.clientY - this._mouseDownPos.y;
    switch (this.target.dock) {
      case "left":
        this.target.style.width = this._origWidth + offsetX + "px";
        (_a = this.target.parent) == null ? void 0 : _a.refresh();
        break;
      case "top":
        this.target.style.height = this._origHeight + offsetY + "px";
        (_b = this.target.parent) == null ? void 0 : _b.refresh();
        break;
      case "right":
        this.target.style.width = this._origWidth - offsetX + "px";
        (_c = this.target.parent) == null ? void 0 : _c.refresh();
        break;
      case "bottom":
        this.target.style.height = this._origHeight - offsetY + "px";
        (_d = this.target.parent) == null ? void 0 : _d.refresh();
        break;
    }
  }
  handleMouseUp(e) {
    document.removeEventListener("mousemove", this._mouseMoveHandler);
    document.removeEventListener("mouseup", this._mouseUpHandler);
    this.target.classList.remove("resizing");
    if (this._resizer)
      this._resizer.classList.remove("highlight");
  }
  get resizer() {
    if (!this._resizer) {
      this._resizer = document.createElement("span");
      this.target.appendChild(this._resizer);
      this._resizer.addEventListener("mousedown", this._mouseDownHandler);
    }
    ;
    return this._resizer;
  }
};
var Container = class extends Control {
  get controls() {
    return this._controls;
  }
  get resizer() {
    return this.attrs["resizer"] == true;
  }
  set resizer(value) {
    this.attrs["resizer"] = value;
    if (this.resizable && !this._resizer)
      this._resizer = new ContainerResizer(this);
    if (this._resizer)
      this._resizer.reset();
  }
  init() {
    super.init();
    this.classList.add(containerStyle);
    if (this.resizable && !this._resizer) {
      this._resizer = new ContainerResizer(this);
      this._resizer.reset();
    }
    ;
  }
  refreshControls() {
    for (let i = 0; i < this._controls.length; i++)
      this._controls[i].refresh();
  }
  refresh(skipRefreshControls) {
    super.refresh();
    for (let i = 0; i < this.childNodes.length; i++) {
      let node = this.childNodes[i];
      if (node instanceof Control) {
        node.parent = this;
      }
      ;
    }
    ;
    if (!skipRefreshControls)
      this.refreshControls();
  }
};

// packages/base/src/index.ts
var scripts = document.getElementsByTagName("script");
var pathname = scripts[scripts.length - 1].src;
var lastIndex = pathname.lastIndexOf("/");
var LibPath = pathname.slice(0, lastIndex + 1);
var RequireJS = {
  config(config) {
    window.require.config(config);
  },
  require(reqs2, callback) {
    window.require(reqs2, callback);
  },
  defined(module2) {
    return window.require.defined(module2);
  }
};
function customElements2(name, options) {
  return (constructor) => {
    window.customElements.define(name, constructor, options);
  };
}
function customModule(target) {
  _currentDefineModule = target;
}

// packages/application/src/event-bus.ts
var _EventBus = class {
  constructor() {
    this.subscribers = {};
  }
  static getInstance() {
    if (this.instance === void 0) {
      this.instance = new _EventBus();
    }
    return this.instance;
  }
  dispatch(event, arg) {
    const subscriber = this.subscribers[event];
    if (subscriber === void 0) {
      return;
    }
    Object.keys(subscriber).forEach((key2) => subscriber[key2](arg));
  }
  register(sender, event, callback) {
    const id = this.getNextId();
    if (!this.subscribers[event])
      this.subscribers[event] = {};
    this.subscribers[event][id] = callback.bind(sender);
    return {
      unregister: () => {
        delete this.subscribers[event][id];
        if (Object.keys(this.subscribers[event]).length === 0)
          delete this.subscribers[event];
      }
    };
  }
  getNextId() {
    return _EventBus.nextId++;
  }
};
var EventBus = _EventBus;
EventBus.nextId = 0;
EventBus.instance = void 0;

// packages/checkbox/src/style/checkbox.css.ts
var Theme2 = theme_exports.ThemeVars;
cssRule("i-checkbox", {
  fontFamily: Theme2.typography.fontFamily,
  fontSize: Theme2.typography.fontSize,
  userSelect: "none",
  "$nest": {
    ".i-checkbox": {
      display: "inline-flex",
      alignItems: "center",
      position: "relative",
      maxWidth: "100%"
    },
    ".i-checkbox_input": {
      cursor: "pointer",
      whiteSpace: "nowrap",
      display: "inline-flex",
      position: "relative"
    },
    ".checkmark": {
      width: 15,
      height: 15,
      display: "inline-block",
      position: "relative",
      backgroundColor: Theme2.background.paper,
      border: `1px solid ${Theme2.divider}`,
      boxSizing: "border-box",
      transition: "border-color .25s cubic-bezier(.71,-.46,.29,1.46),background-color .25s cubic-bezier(.71,-.46,.29,1.46)"
    },
    ".i-checkbox_label": {
      boxSizing: "border-box",
      color: Theme2.text.primary,
      display: "inline-block",
      paddingLeft: 8,
      maxWidth: "100%"
    },
    "input": {
      opacity: 0,
      width: 0,
      height: 0,
      position: "absolute",
      top: 0,
      left: 0
    },
    "&.is-checked": {
      "$nest": {
        ".i-checkbox_label": {
          color: Theme2.colors.info.main
        },
        ".checkmark": {
          backgroundColor: Theme2.colors.info.main
        },
        ".checkmark:after": {
          transform: "rotate(45deg) scaleY(1)"
        },
        ".is-indeterminate .checkmark:after": {
          transform: "none"
        }
      }
    },
    "&:not(.disabled):hover input ~ .checkmark": {
      borderColor: Theme2.colors.info.main
    },
    "&.disabled": {
      cursor: "not-allowed"
    },
    ".checkmark:after": {
      content: "''",
      boxSizing: "content-box",
      border: `1px solid ${Theme2.background.paper}`,
      borderLeft: 0,
      borderTop: 0,
      height: 7.5,
      left: "35%",
      top: 1,
      transform: "rotate(45deg) scaleY(0)",
      width: 3.5,
      transition: "transform .15s ease-in .05s",
      transformOrigin: "center",
      display: "inline-block",
      position: "absolute"
    },
    ".is-indeterminate .checkmark": {
      backgroundColor: Theme2.colors.info.main
    },
    ".is-indeterminate .checkmark:after": {
      width: "80%",
      height: 0,
      top: "50%",
      left: "10%",
      borderRight: 0,
      transform: "none"
    }
  }
});

// packages/checkbox/src/checkbox.ts
var Checkbox = class extends Control {
  constructor(parent, options) {
    super(parent, options, {
      height: 30
    });
  }
  get caption() {
    return this._caption;
  }
  set caption(value) {
    this._caption = value;
    if (!value)
      this.captionSpanElm.style.display = "none";
    else
      this.captionSpanElm.style.display = "";
    this.captionSpanElm && (this.captionSpanElm.innerHTML = value);
  }
  get captionWidth() {
    return this._captionWidth;
  }
  set captionWidth(value) {
    if (!value)
      return;
    this._captionWidth = value;
    this.setElementPosition(this.captionSpanElm, "width", value);
  }
  get height() {
    return this.offsetHeight;
  }
  set height(value) {
    this.setPosition("height", value);
  }
  get indeterminate() {
    return this._indeterminate;
  }
  set indeterminate(value) {
    this._indeterminate = value;
    if (this.inputSpanElm)
      value ? this.inputSpanElm.classList.add("is-indeterminate") : this.inputSpanElm.classList.remove("is-indeterminate");
    this.inputElm.indeterminate = value;
  }
  get checked() {
    return this._checked;
  }
  set checked(value) {
    this._checked = value;
    this.addClass(value, "is-checked");
    this.inputElm && (this.inputElm.checked = value);
  }
  get value() {
    return this.inputElm.value;
  }
  set value(data) {
    this.inputElm.value = data;
  }
  _handleChange(event) {
    this.checked = this.inputElm.checked || false;
    this.addClass(this.checked, "is-checked");
    if (this.onChanged)
      this.onChanged(this, event);
  }
  addClass(value, className) {
    if (value)
      this.classList.add(className);
    else
      this.classList.remove(className);
  }
  init() {
    if (!this.captionSpanElm) {
      this.wrapperElm = this.createElement("label", this);
      if (this.height)
        this.wrapperElm.style.height = this.height + "px";
      this.wrapperElm.classList.add("i-checkbox");
      this.inputSpanElm = this.createElement("span", this.wrapperElm);
      this.inputSpanElm.classList.add("i-checkbox_input");
      this.inputElm = this.createElement("input", this.inputSpanElm);
      this.inputElm.type = "checkbox";
      const disabled = this.getAttribute("enabled") === false;
      this.inputElm.disabled = disabled;
      this.checkmarklElm = this.createElement("span");
      this.checkmarklElm.classList.add("checkmark");
      this.inputSpanElm.appendChild(this.checkmarklElm);
      this.inputElm.addEventListener("input", this._handleChange.bind(this));
      this.captionSpanElm = this.createElement("span", this.wrapperElm);
      this.captionSpanElm.classList.add("i-checkbox_label");
      this.captionWidth = this.getAttribute("captionWidth", true);
      this.caption = this.getAttribute("caption", true);
      this.value = this.caption;
      this.checked = this.getAttribute("checked", true, false);
      this.indeterminate = this.getAttribute("indeterminate", true);
      this.onChanged = this.getAttribute("onChanged", true) || this.onChanged;
      super.init();
    }
  }
  static async create(options, parent) {
    let self = new this(parent, options);
    await self.ready();
    return self;
  }
};
Checkbox = __decorateClass([
  customElements2("i-checkbox")
], Checkbox);

// packages/application/src/globalEvent.ts
function getControl(target) {
  if (target instanceof Control) {
    return target;
  }
  if ((target instanceof HTMLElement || target instanceof SVGElement) && target.parentElement)
    return getControl(target.parentElement);
  return null;
}
var GlobalEvents = class {
  constructor() {
    this.bindEvents();
  }
  abortEvent(event) {
    event.stopPropagation();
  }
  _handleClick(event) {
    let control = getControl(event.target);
    if (control && !(control instanceof Checkbox)) {
      if (control.enabled) {
        if (control._handleClick(event)) {
          event.stopPropagation();
        }
        ;
      }
      ;
    }
    ;
  }
  _handleMouseDown(event) {
    let control = getControl(event.target);
    if (control == null ? void 0 : control.enabled) {
      if (control._handleMouseDown(event)) {
        event.preventDefault();
        event.stopPropagation();
      }
    }
  }
  _handleMouseMove(event) {
    let control = getControl(event.target);
    if (control == null ? void 0 : control.enabled) {
      if (control._handleMouseMove(event)) {
        event.preventDefault();
        event.stopPropagation();
      }
    }
  }
  _handleMouseUp(event) {
    let control = getControl(event.target);
    if (control == null ? void 0 : control.enabled) {
      if (control._handleMouseUp(event)) {
        event.preventDefault();
        event.stopPropagation();
      }
    }
  }
  _handleDblClick(event) {
    let control = getControl(event.target);
    if (control) {
      if (control.enabled) {
        if (control._handleDblClick(event)) {
          event.preventDefault();
          event.stopPropagation();
        }
      }
    }
  }
  _handleKeyDown(event) {
    let control = getControl(event.target);
    if (control) {
      if (control.enabled) {
        if (control._handleKeyDown(event)) {
          event.preventDefault();
          event.stopPropagation();
        }
      }
    }
  }
  _handleKeyUp(event) {
    let control = getControl(event.target);
    if (control) {
      if (control.enabled) {
        if (control._handleKeyUp(event)) {
          event.preventDefault();
          event.stopPropagation();
        }
      }
    }
  }
  _handleContextMenu(event) {
    let control = getControl(event.target);
    if (control) {
      event.preventDefault();
      event.stopPropagation();
      if (control.enabled)
        control._handleContextMenu(event);
    }
  }
  _handleTouchStart(event) {
  }
  _handleTouchEnd(event) {
  }
  _handleTouchMove(event) {
  }
  _handleChange(event) {
  }
  _handleMouseWheel(event) {
    let control = getControl(event.target);
    if (control) {
      event.stopPropagation();
      if (control.enabled && control._handleMouseWheel)
        control._handleMouseWheel(event);
    }
  }
  _handleFocus(event) {
    let control = getControl(event.target);
    if (control) {
      event.preventDefault();
      event.stopPropagation();
      if (control.enabled && control._handleFocus)
        control._handleFocus(event);
    }
  }
  _handleBlur(event) {
    let control = getControl(event.target);
    if (control) {
      event.preventDefault();
      event.stopPropagation();
      if (control.enabled && control._handleBlur)
        control._handleBlur(event);
    }
  }
  bindEvents() {
    window.addEventListener("mousedown", this._handleMouseDown.bind(this));
    window.addEventListener("mousemove", this._handleMouseMove.bind(this));
    window.addEventListener("mouseup", this._handleMouseUp.bind(this));
    document.addEventListener("click", this._handleClick.bind(this));
    window.addEventListener("dblclick", this._handleDblClick.bind(this));
    window.oncontextmenu = this._handleContextMenu.bind(this);
    window.addEventListener("keydown", this._handleKeyDown);
    window.addEventListener("keyup", this._handleKeyUp);
    window.addEventListener("touchstart", this._handleTouchStart);
    window.addEventListener("touchend", this._handleTouchEnd);
    window.addEventListener("touchmove", this._handleTouchMove);
    window.addEventListener("change", this._handleChange);
    window.addEventListener("wheel", this._handleMouseWheel, { passive: false });
    window.addEventListener("focus", this._handleFocus, true);
    window.addEventListener("blur", this._handleBlur, true);
  }
};

// packages/application/src/styles/index.css.ts
var Theme3 = theme_exports.ThemeVars;
var applicationStyle = style({
  height: "100%",
  $nest: {
    "body": {
      height: "100%"
    }
  }
});

// packages/ipfs/src/index.ts
var src_exports2 = {};
__export(src_exports2, {
  hashContent: () => hashContent,
  hashItems: () => hashItems,
  parse: () => parse
});
var import_ipfs_utils = __toModule(require("@ijstech/ipfs-utils"));
function parse(cid) {
  return import_ipfs_utils.default.parse(cid);
}
async function hashItems(items, version) {
  return await import_ipfs_utils.default.hashItems(items || [], version);
}
async function hashContent(content, version) {
  if (version == void 0)
    version = 1;
  if (content.length == 0) {
    return await import_ipfs_utils.default.hashContent("", version);
  }
  let result;
  if (version == 1) {
    result = await import_ipfs_utils.default.hashFile(content, version, {
      rawLeaves: true,
      maxChunkSize: 1048576,
      maxChildrenPerNode: 1024
    });
  } else
    result = await import_ipfs_utils.default.hashFile(content, version);
  return result.cid;
}

// packages/image/src/style/image.css.ts
var Theme4 = theme_exports.ThemeVars;
cssRule("i-image", {
  position: "relative",
  $nest: {
    "&.i-image-crop": {
      position: "relative",
      display: "table",
      verticalAlign: "middle",
      width: "100%",
      overflow: "hidden"
    },
    ".i-image-crop_box": {
      width: "45%",
      height: 200,
      cursor: "move",
      touchAction: "none",
      position: "absolute",
      top: 0,
      left: 0,
      border: `1px dashed ${Theme4.background.paper}`,
      zIndex: "100",
      maxWidth: "100%"
    },
    ".i-image-crop_mask": {
      backgroundColor: ThemeVars.text.secondary,
      cursor: "crosshair",
      width: "100%",
      height: "100%",
      position: "absolute",
      left: 0,
      top: 0
    },
    ".i-image_resize": {
      width: "100%",
      height: "100%"
    },
    ".i-image_resize-handle": {
      display: "inline-block",
      position: "absolute",
      border: `1px solid ${Theme4.background.default}`,
      backgroundColor: Theme4.action.disabled,
      width: 10,
      height: 10,
      outline: "1px solid transparent"
    },
    ".ord-nw": {
      top: 0,
      left: 0,
      marginTop: -5,
      marginLeft: -5,
      cursor: "nw-resize"
    },
    ".ord-ne": {
      top: 0,
      right: 0,
      marginTop: -5,
      marginRight: -5,
      cursor: "ne-resize"
    },
    ".ord-sw": {
      bottom: 0,
      left: 0,
      marginBottom: -5,
      marginLeft: -5,
      cursor: "sw-resize"
    },
    ".ord-se": {
      bottom: 0,
      right: 0,
      marginBottom: -5,
      marginRight: -5,
      cursor: "se-resize"
    },
    ".i-image-clipped": {
      position: "absolute",
      top: 0,
      left: 0,
      zIndex: 99
    },
    "img": {
      maxHeight: "100%",
      maxWidth: "100%",
      height: "inherit",
      verticalAlign: "middle",
      objectFit: "contain",
      overflow: "hidden"
    }
  }
});

// packages/image/src/image.ts
var Image2 = class extends Control {
  constructor(parent, options) {
    super(parent, options, {});
    this._rotate = 0;
  }
  get rotate() {
    return this._rotate;
  }
  set rotate(value) {
    if (value == void 0)
      return;
    value = parseInt(value);
    if (value != this._rotate) {
      if (this.imageElm) {
        if (this._rotate != 0)
          this.imageElm.classList.remove(rotate(this._rotate));
        this.imageElm.classList.add(rotate(value));
      }
      this._rotate = value;
    }
  }
  get url() {
    return this._url;
  }
  set url(value) {
    this._url = value;
    if (value && !this.imageElm)
      this.imageElm = this.createElement("img", this);
    if (this.imageElm) {
      this.imageElm.src = value;
      const self = this;
      this.imageElm.onerror = function() {
        self._fallbackUrl && (this.src = self._fallbackUrl);
      };
    }
  }
  init() {
    super.init();
    this._fallbackUrl = this.getAttribute("fallbackUrl", true, "");
    const urlAttr = this.getAttribute("url", true);
    urlAttr && (this.url = urlAttr);
    this.rotate = this.getAttribute("rotate", true);
  }
  static async create(options, parent) {
    let self = new this(parent, options);
    await self.ready();
    return self;
  }
};
Image2 = __decorateClass([
  customElements2("i-image")
], Image2);

// packages/icon/src/style/icon.css.ts
var spinnerAnim2 = keyframes({
  "0%": {
    transform: "rotate(0deg)"
  },
  "100%": {
    transform: "rotate(360deg)"
  }
});
cssRule("i-icon", {
  display: "inline-block",
  $nest: {
    "svg": {
      verticalAlign: "top",
      width: "100%",
      height: "100%"
    },
    "&.is-spin": {
      animation: `${spinnerAnim2} 2s linear infinite`
    }
  }
});

// packages/icon/src/icon.ts
var _iconLoaded = false;
async function loadIconFile() {
  if (_iconLoaded)
    return;
  _iconLoaded = true;
  try {
    let res = await fetch(`${LibPath}assets/icon/solid.svg`);
    let text = await res.text();
    let span = document.createElement("span");
    span.innerHTML = text;
    document.body.appendChild(span);
  } catch (err) {
    _iconLoaded = false;
  }
  ;
}
var Icon = class extends Control {
  constructor(parent, options) {
    super(parent, options);
    loadIconFile();
  }
  init() {
    if (!this.initialized) {
      super.init();
      let fill = this.getAttribute("fill");
      if (fill)
        this.fill = fill;
      this._size = this.getAttribute("size", true);
      this._name = this.getAttribute("name", true);
      this._updateIcon();
      const image = this.getAttribute("image", true);
      if (image) {
        image.height = image.height || this.height || "16px";
        image.width = image.width || this.width || "16px";
        this.image = new Image2(this, image);
      }
      this.spin = this.getAttribute("spin", true, false);
    }
  }
  get fill() {
    return this.style.getPropertyValue("fill");
  }
  set fill(color) {
    this.style.setProperty("fill", color);
  }
  get name() {
    return this._name;
  }
  set name(value) {
    this._name = value;
    this._updateIcon();
  }
  get image() {
    if (!this._image) {
      this._image = Image2.create({
        width: this.width || 16,
        height: this.height || 16
      });
    }
    return this._image;
  }
  set image(image) {
    if (this._image)
      this.removeChild(this._image);
    this._image = image;
    if (this._image)
      this.prepend(this._image);
  }
  get spin() {
    return this._spin;
  }
  set spin(value) {
    this._spin = value;
    if (value)
      this.classList.add("is-spin");
    else
      this.classList.remove("is-spin");
    this._parent && this._parent.refresh();
  }
  _updateIcon() {
    if (this._name)
      this.innerHTML = `<svg><use xlink:href="#${this.name}"></use></svg>`;
    else
      this.innerHTML = "";
  }
  static async create(options, parent) {
    let self = new this(parent, options);
    await self.ready();
    return self;
  }
};
Icon = __decorateClass([
  customElements2("i-icon")
], Icon);

// packages/button/src/style/button.css.ts
var Theme5 = theme_exports.ThemeVars;
cssRule("i-button", {
  background: Theme5.colors.primary.main,
  boxShadow: Theme5.shadows[2],
  color: Theme5.text.primary,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: 4,
  fontFamily: Theme5.typography.fontFamily,
  fontSize: Theme5.typography.fontSize,
  gap: 5,
  cursor: "pointer",
  $nest: {
    "&:not(.disabled):hover": {},
    "&.disabled": {
      color: Theme5.text.disabled,
      boxShadow: Theme5.shadows[0],
      background: Theme5.action.disabledBackground
    },
    "i-icon": {
      display: "inline-block",
      fill: Theme5.text.primary,
      verticalAlign: "middle"
    },
    ".caption": {
      paddingRight: ".5rem"
    },
    "&.is-spinning, &.is-spinning:not(.disabled):hover, &.is-spinning:not(.disabled):focus": {
      color: Theme5.text.disabled,
      boxShadow: Theme5.shadows[0],
      background: Theme5.action.disabledBackground,
      cursor: "default"
    }
  }
});

// packages/button/src/button.ts
var defaultIcon = {
  width: 16,
  height: 16,
  fill: theme_exports.ThemeVars.text.primary
};
var Button = class extends Control {
  static async create(options, parent) {
    let self = new this(parent, options);
    await self.ready();
    return self;
  }
  constructor(parent, options) {
    super(parent, options);
  }
  get caption() {
    return this.captionElm.innerHTML;
  }
  set caption(value) {
    this.captionElm.innerHTML = value;
  }
  get icon() {
    if (!this._icon) {
      this._icon = new Icon(this, defaultIcon);
      this.prependIcon(this._icon);
    }
    return this._icon;
  }
  set icon(value) {
    if (this._icon && this.contains(this._icon))
      this.removeChild(this._icon);
    this._icon = value;
    this.prependIcon(this._icon);
  }
  get rightIcon() {
    if (!this._rightIcon) {
      this._rightIcon = new Icon(this, {
        ...defaultIcon,
        name: "spinner"
      });
      this.appendIcon(this._rightIcon);
    }
    return this._rightIcon;
  }
  set rightIcon(value) {
    if (this._rightIcon && this.contains(this._rightIcon))
      this.removeChild(this._rightIcon);
    this._rightIcon = value;
    this.appendIcon(this._rightIcon);
  }
  get enabled() {
    return super.enabled;
  }
  set enabled(value) {
    var _a, _b, _c, _d;
    super.enabled = value;
    if (!value && this._background) {
      let bg = "";
      ((_a = this._background) == null ? void 0 : _a.image) && (bg += `url(${(_b = this._background) == null ? void 0 : _b.image})`);
      ((_c = this._background) == null ? void 0 : _c.color) && (bg += `${(_d = this._background) == null ? void 0 : _d.color}`);
      this.style.background = bg;
    }
  }
  get isSpinning() {
    return this._icon && this._icon.spin && this._icon.visible || this._rightIcon && this._rightIcon.spin && this._rightIcon.visible;
  }
  prependIcon(icon) {
    if (!icon)
      return;
    this.appendChild(icon);
    this.captionElm && this.insertBefore(icon, this.captionElm);
  }
  appendIcon(icon) {
    if (!icon)
      return;
    this.appendChild(icon);
    this.captionElm && this.insertBefore(this.captionElm, icon);
  }
  updateButton() {
    var _a, _b, _c, _d;
    if (this.isSpinning)
      this.classList.add("is-spinning");
    else
      this.classList.remove("is-spinning");
    if (!this.enabled && this._background) {
      let bg = "";
      ((_a = this._background) == null ? void 0 : _a.image) && (bg += `url(${(_b = this._background) == null ? void 0 : _b.image})`);
      ((_c = this._background) == null ? void 0 : _c.color) && (bg += `${(_d = this._background) == null ? void 0 : _d.color}`);
      this.style.background = bg;
    }
  }
  _handleClick(event) {
    if (this.isSpinning || !this.enabled)
      return false;
    return super._handleClick(event);
  }
  refresh() {
    super.refresh();
    this.updateButton();
  }
  init() {
    if (!this.captionElm) {
      super.init();
      this.onClick = this.getAttribute("onClick", true) || this.onClick;
      this.captionElm = this.createElement("span", this);
      let caption = this.getAttribute("caption", true, "");
      this.captionElm.innerHTML = caption;
      let iconAttr = this.getAttribute("icon", true);
      if (iconAttr) {
        iconAttr = { ...defaultIcon, ...iconAttr };
        const icon = new Icon(this, iconAttr);
        this.icon = icon;
      }
      let rightIconAttr = this.getAttribute("rightIcon", true);
      if (rightIconAttr) {
        rightIconAttr = { ...defaultIcon, name: "spinner", ...rightIconAttr };
        const icon = new Icon(this, rightIconAttr);
        this.rightIcon = icon;
      }
    }
  }
};
Button = __decorateClass([
  customElements2("i-button")
], Button);

// packages/layout/src/style/panel.css.ts
var panelStyle = style({
  display: "block",
  clear: "both",
  position: "relative"
});
var overflowStyle = style({
  overflow: "hidden"
});
var vStackStyle = style({
  display: "flex",
  flexDirection: "column"
});
var hStackStyle = style({
  display: "flex",
  flexDirection: "row"
});
var gridStyle = style({
  display: "grid"
});
var getStackDirectionStyleClass = (direction) => {
  return style({
    display: "flex",
    flexDirection: direction == "vertical" ? "column" : "row"
  });
};
var getStackMediaQueriesStyleClass = (mediaQueries) => {
  let styleObj = getControlMediaQueriesStyle(mediaQueries);
  for (let mediaQuery of mediaQueries) {
    let mediaQueryRule;
    if (mediaQuery.minWidth && mediaQuery.maxWidth) {
      mediaQueryRule = `@media (min-width: ${mediaQuery.minWidth}) and (max-width: ${mediaQuery.maxWidth})`;
    } else if (mediaQuery.minWidth) {
      mediaQueryRule = `@media (min-width: ${mediaQuery.minWidth})`;
    } else if (mediaQuery.maxWidth) {
      mediaQueryRule = `@media (max-width: ${mediaQuery.maxWidth})`;
    }
    if (mediaQueryRule) {
      styleObj["$nest"][mediaQueryRule] = styleObj["$nest"][mediaQueryRule] || {};
      if (mediaQuery.properties.direction) {
        styleObj["$nest"][mediaQueryRule]["flexDirection"] = mediaQuery.properties.direction == "vertical" ? "column" : "row";
      }
      if (mediaQuery.properties.justifyContent) {
        styleObj["$nest"][mediaQueryRule]["justifyContent"] = mediaQuery.properties.justifyContent;
      }
      if (mediaQuery.properties.alignItems) {
        styleObj["$nest"][mediaQueryRule]["alignItems"] = mediaQuery.properties.alignItems;
      }
      if (mediaQuery.properties.width !== void 0 && mediaQuery.properties.width !== null) {
        const width = mediaQuery.properties.width;
        styleObj["$nest"][mediaQueryRule]["width"] = typeof width === "string" ? `${width} !important` : `${width}px !important`;
      }
      if (mediaQuery.properties.height !== void 0 && mediaQuery.properties.height !== null) {
        const height = mediaQuery.properties.height;
        styleObj["$nest"][mediaQueryRule]["height"] = typeof height === "string" ? `${height} !important` : `${height}px !important`;
      }
      if (mediaQuery.properties.gap !== void 0 && mediaQuery.properties.gap !== null) {
        const gap = mediaQuery.properties.gap;
        styleObj["$nest"][mediaQueryRule]["gap"] = typeof gap === "string" ? `${gap} !important` : `${gap}px !important`;
      }
      if (mediaQuery.properties.position) {
        styleObj["$nest"][mediaQueryRule]["position"] = `${mediaQuery.properties.position} !important`;
      }
      if (mediaQuery.properties.top !== null && mediaQuery.properties.top !== void 0) {
        styleObj["$nest"][mediaQueryRule]["top"] = `${mediaQuery.properties.top} !important`;
      }
      if (typeof mediaQuery.properties.visible === "boolean") {
        const visible = mediaQuery.properties.visible;
        styleObj["$nest"][mediaQueryRule]["display"] = visible ? "flex !important" : "none !important";
      }
    }
  }
  return style(styleObj);
};
var justifyContentStartStyle = style({
  justifyContent: "flex-start"
});
var justifyContentCenterStyle = style({
  justifyContent: "center"
});
var justifyContentEndStyle = style({
  justifyContent: "flex-end"
});
var justifyContentSpaceBetweenStyle = style({
  justifyContent: "space-between"
});
var alignItemsStretchStyle = style({
  alignItems: "stretch"
});
var alignItemsStartStyle = style({
  alignItems: "flex-start"
});
var alignItemsCenterStyle = style({
  alignItems: "center"
});
var alignItemsEndStyle = style({
  alignItems: "flex-end"
});
var getTemplateColumnsStyleClass = (columns) => {
  return style({
    gridTemplateColumns: columns.join(" ")
  });
};
var getTemplateRowsStyleClass = (rows) => {
  return style({
    gridTemplateRows: rows.join(" ")
  });
};
var getTemplateAreasStyleClass = (templateAreas) => {
  let templateAreasStr = "";
  for (let i = 0; i < templateAreas.length; i++) {
    templateAreasStr += '"' + templateAreas[i].join(" ") + '" ';
  }
  return style({
    gridTemplateAreas: templateAreasStr
  });
};
var getGridLayoutMediaQueriesStyleClass = (mediaQueries) => {
  let styleObj = getControlMediaQueriesStyle(mediaQueries);
  for (let mediaQuery of mediaQueries) {
    let mediaQueryRule;
    if (mediaQuery.minWidth && mediaQuery.maxWidth) {
      mediaQueryRule = `@media (min-width: ${mediaQuery.minWidth}) and (max-width: ${mediaQuery.maxWidth})`;
    } else if (mediaQuery.minWidth) {
      mediaQueryRule = `@media (min-width: ${mediaQuery.minWidth})`;
    } else if (mediaQuery.maxWidth) {
      mediaQueryRule = `@media (max-width: ${mediaQuery.maxWidth})`;
    }
    if (mediaQueryRule) {
      styleObj["$nest"][mediaQueryRule] = styleObj["$nest"][mediaQueryRule] || {};
      if (mediaQuery.properties.templateColumns) {
        const templateColumnsStr = mediaQuery.properties.templateColumns.join(" ");
        styleObj["$nest"][mediaQueryRule]["gridTemplateColumns"] = `${templateColumnsStr} !important`;
      }
      if (mediaQuery.properties.templateRows) {
        const templateRowsStr = mediaQuery.properties.templateRows.join(" ");
        styleObj["$nest"][mediaQueryRule]["gridTemplateRows"] = `${templateRowsStr} !important`;
      }
      if (mediaQuery.properties.templateAreas) {
        let templateAreasStr = "";
        for (let i = 0; i < mediaQuery.properties.templateAreas.length; i++) {
          templateAreasStr += '"' + mediaQuery.properties.templateAreas[i].join(" ") + '" ';
        }
        styleObj["$nest"][mediaQueryRule]["gridTemplateAreas"] = `${templateAreasStr} !important`;
      }
      if (mediaQuery.properties.display) {
        styleObj["$nest"][mediaQueryRule]["display"] = mediaQuery.properties.display;
      }
      if (mediaQuery.properties.gap) {
        const gap = mediaQuery.properties.gap;
        if (gap.row) {
          styleObj["$nest"][mediaQueryRule]["rowGap"] = typeof gap.row === "string" ? gap.row : `${gap.row}px`;
        }
        if (gap.column) {
          styleObj["$nest"][mediaQueryRule]["columnGap"] = typeof gap.column === "string" ? gap.column : `${gap.column}px`;
        }
      }
      if (typeof mediaQuery.properties.visible === "boolean") {
        const visible = mediaQuery.properties.visible;
        const display = mediaQuery.properties.display || "grid";
        styleObj["$nest"][mediaQueryRule]["display"] = visible ? display + " !important" : "none !important";
      }
    }
  }
  return style(styleObj);
};

// packages/layout/src/stack.ts
var StackLayout = class extends Container {
  constructor(parent, options) {
    super(parent, options);
  }
  static async create(options, parent) {
    let self = new this(parent, options);
    await self.ready();
    return self;
  }
  get direction() {
    return this._direction;
  }
  set direction(value) {
    this._direction = value;
    if (value) {
      let style2 = getStackDirectionStyleClass(value);
      this.classList.add(style2);
    }
  }
  get justifyContent() {
    return this._justifyContent;
  }
  set justifyContent(value) {
    this._justifyContent = value || "start";
    switch (this._justifyContent) {
      case "start":
        this.classList.add(justifyContentStartStyle);
        break;
      case "center":
        this.classList.add(justifyContentCenterStyle);
        break;
      case "end":
        this.classList.add(justifyContentEndStyle);
        break;
      case "space-between":
        this.classList.add(justifyContentSpaceBetweenStyle);
        break;
    }
  }
  get alignItems() {
    return this._alignItems;
  }
  set alignItems(value) {
    this._alignItems = value || "stretch";
    switch (this._alignItems) {
      case "stretch":
        this.classList.add(alignItemsStretchStyle);
        break;
      case "start":
        this.classList.add(alignItemsStartStyle);
        break;
      case "center":
        this.classList.add(alignItemsCenterStyle);
        break;
      case "end":
        this.classList.add(alignItemsEndStyle);
        break;
    }
  }
  get gap() {
    return this._gap;
  }
  set gap(value) {
    this._gap = value || "initial";
    if (typeof this._gap === "number") {
      this.style.gap = this._gap + "px";
    } else {
      this.style.gap = this._gap;
    }
  }
  get wrap() {
    return this._wrap;
  }
  set wrap(value) {
    if (!value)
      return;
    this._wrap = value;
    this.style.flexWrap = this._wrap;
  }
  get mediaQueries() {
    return this._mediaQueries;
  }
  set mediaQueries(value) {
    this._mediaQueries = value;
    let style2 = getStackMediaQueriesStyleClass(this._mediaQueries);
    this._mediaStyle && this.classList.remove(this._mediaStyle);
    this._mediaStyle = style2;
    this.classList.add(style2);
  }
  setAttributeToProperty(propertyName) {
    const prop = this.getAttribute(propertyName, true);
    if (prop)
      this[propertyName] = prop;
  }
  init() {
    super.init();
    this.setAttributeToProperty("direction");
    this.setAttributeToProperty("justifyContent");
    this.setAttributeToProperty("alignItems");
    this.setAttributeToProperty("gap");
    this.setAttributeToProperty("wrap");
    this.setAttributeToProperty("mediaQueries");
  }
};
StackLayout = __decorateClass([
  customElements2("i-stack")
], StackLayout);
var HStack = class extends StackLayout {
  constructor(parent, options) {
    super(parent, options);
  }
  get horizontalAlignment() {
    return this._horizontalAlignment;
  }
  set horizontalAlignment(value) {
    this._horizontalAlignment = value || "start";
    this.justifyContent = value;
  }
  get verticalAlignment() {
    return this._verticalAlignment;
  }
  set verticalAlignment(value) {
    this._verticalAlignment = value || "stretch";
    this.alignItems = value;
  }
  setAttributeToProperty(propertyName) {
    const prop = this.getAttribute(propertyName, true);
    if (prop)
      this[propertyName] = prop;
  }
  init() {
    super.init();
    this.direction = "horizontal";
    this.setAttributeToProperty("horizontalAlignment");
    this.setAttributeToProperty("verticalAlignment");
  }
  static async create(options, parent) {
    let self = new this(parent, options);
    await self.ready();
    return self;
  }
};
HStack = __decorateClass([
  customElements2("i-hstack")
], HStack);
var VStack = class extends StackLayout {
  constructor(parent, options) {
    super(parent, options);
  }
  get horizontalAlignment() {
    return this._horizontalAlignment;
  }
  set horizontalAlignment(value) {
    this._horizontalAlignment = value || "stretch";
    this.alignItems = value;
  }
  get verticalAlignment() {
    return this._verticalAlignment;
  }
  set verticalAlignment(value) {
    this._verticalAlignment = value || "start";
    this.justifyContent = value;
  }
  setAttributeToProperty(propertyName) {
    const prop = this.getAttribute(propertyName, true);
    if (prop)
      this[propertyName] = prop;
  }
  init() {
    super.init();
    this.direction = "vertical";
    this.setAttributeToProperty("horizontalAlignment");
    this.setAttributeToProperty("verticalAlignment");
  }
  static async create(options, parent) {
    let self = new this(parent, options);
    await self.ready();
    return self;
  }
};
VStack = __decorateClass([
  customElements2("i-vstack")
], VStack);

// packages/layout/src/panel.ts
var Panel = class extends Container {
  constructor(parent, options) {
    super(parent, options);
  }
  init() {
    super.init();
    this.classList.add(panelStyle);
    if (this.dock) {
      this.classList.add(overflowStyle);
    }
  }
  connectedCallback() {
    if (this.connected) {
      return;
    }
    super.connectedCallback();
  }
  static async create(options, parent) {
    let self = new this(parent, options);
    await self.ready();
    return self;
  }
};
Panel = __decorateClass([
  customElements2("i-panel")
], Panel);

// packages/layout/src/grid.ts
var GridLayout = class extends Container {
  constructor(parent, options) {
    super(parent, options);
    this._styleClassMap = {};
    this.removeStyleClass = this.removeStyleClass.bind(this);
  }
  static async create(options, parent) {
    let self = new this(parent, options);
    await self.ready();
    return self;
  }
  get templateColumns() {
    return this._templateColumns;
  }
  set templateColumns(columns) {
    this._templateColumns = columns;
    this.removeStyleClass("columns");
    if (columns) {
      let style2 = getTemplateColumnsStyleClass(columns);
      this._styleClassMap["columns"] = style2;
      this.classList.add(style2);
    }
  }
  get templateRows() {
    return this._templateRows;
  }
  set templateRows(rows) {
    this._templateRows = rows;
    this.removeStyleClass("rows");
    if (rows) {
      let style2 = getTemplateRowsStyleClass(rows);
      this._styleClassMap["rows"] = style2;
      this.classList.add(style2);
    }
  }
  get templateAreas() {
    return this._templateAreas;
  }
  set templateAreas(value) {
    this._templateAreas = value;
    this.removeStyleClass("areas");
    if (value) {
      let style2 = getTemplateAreasStyleClass(value);
      this._styleClassMap["areas"] = style2;
      this.classList.add(style2);
    }
  }
  get autoColumnSize() {
    return this._autoColumnSize;
  }
  set autoColumnSize(value) {
    this._autoColumnSize = value;
    if (value) {
      this.style.gridAutoColumns = value;
    }
  }
  get autoRowSize() {
    return this._autoRowSize;
  }
  set autoRowSize(value) {
    this._autoRowSize = value;
    if (value) {
      this.style.gridAutoRows = value;
    }
  }
  get columnsPerRow() {
    return this._columnsPerRow;
  }
  set columnsPerRow(value) {
    this._columnsPerRow = value;
    this.style.gridTemplateColumns = `repeat(${this._columnsPerRow}, 1fr)`;
  }
  get gap() {
    return this._gap;
  }
  set gap(value) {
    this._gap = value;
    if (value) {
      if (value.row) {
        if (typeof value.row == "number") {
          this.style.rowGap = value.row + "px";
        } else {
          this.style.rowGap = value.row;
        }
      }
      if (value.column) {
        if (typeof value.column == "number") {
          this.style.columnGap = value.column + "px";
        } else {
          this.style.columnGap = value.column;
        }
      }
    }
  }
  get horizontalAlignment() {
    return this._horizontalAlignment;
  }
  set horizontalAlignment(value) {
    this._horizontalAlignment = value;
    this.style.justifyItems = value;
  }
  get verticalAlignment() {
    return this._verticalAlignment;
  }
  set verticalAlignment(value) {
    this._verticalAlignment = value;
    this.style.alignItems = value;
  }
  get autoFillInHoles() {
    return this._autoFillInHoles;
  }
  set autoFillInHoles(value) {
    this._autoFillInHoles = value;
    this.style.gridAutoFlow = this._autoFillInHoles ? "dense" : "row";
  }
  get mediaQueries() {
    return this._mediaQueries;
  }
  set mediaQueries(value) {
    this._mediaQueries = value;
    let style2 = getGridLayoutMediaQueriesStyleClass(this._mediaQueries);
    this._mediaStyle && this.classList.remove(this._mediaStyle);
    this._mediaStyle = style2;
    this.classList.add(style2);
  }
  setAttributeToProperty(propertyName) {
    const prop = this.getAttribute(propertyName, true);
    if (this.id == "thisPnl") {
      console.log(propertyName, prop);
    }
    if (prop)
      this[propertyName] = prop;
  }
  removeStyleClass(name) {
    if (this._styleClassMap && this._styleClassMap[name]) {
      this.classList.remove(this._styleClassMap[name]);
      delete this._styleClassMap[name];
    }
  }
  init() {
    super.init();
    this._styleClassMap = {};
    this.classList.add(gridStyle);
    this.setAttributeToProperty("templateColumns");
    this.setAttributeToProperty("templateRows");
    this.setAttributeToProperty("templateAreas");
    this.setAttributeToProperty("gap");
    this.setAttributeToProperty("horizontalAlignment");
    this.setAttributeToProperty("verticalAlignment");
    this.setAttributeToProperty("columnsPerRow");
    this.setAttributeToProperty("autoFillInHoles");
    this.setAttributeToProperty("autoColumnSize");
    this.setAttributeToProperty("autoRowSize");
    this.setAttributeToProperty("mediaQueries");
  }
};
GridLayout = __decorateClass([
  customElements2("i-grid-layout")
], GridLayout);

// packages/layout/src/card.ts
var CardLayout = class extends GridLayout {
  constructor(parent, options) {
    super(parent, options);
  }
  static async create(options, parent) {
    let self = new this(parent, options);
    await self.ready();
    return self;
  }
  get cardMinWidth() {
    return this._cardMinWidth;
  }
  set cardMinWidth(value) {
    this._cardMinWidth = value;
    this.updateGridTemplateColumns();
  }
  get columnsPerRow() {
    return this._columnsPerRow;
  }
  set columnsPerRow(value) {
    this._columnsPerRow = value;
    this.updateGridTemplateColumns();
  }
  get cardHeight() {
    return this._cardHeight;
  }
  set cardHeight(value) {
    this._cardHeight = typeof value == "number" ? value + "px" : value;
    this.style.gridAutoRows = this._cardHeight;
  }
  updateGridTemplateColumns() {
    if (this.cardMinWidth && this.columnsPerRow) {
      let minmaxFirstParam = this.gap && this.gap.column ? `max(${this.cardMinWidth}, calc(100%/${this.columnsPerRow} - ${this.gap.column}))` : `max(${this.cardMinWidth}, 100%/${this.columnsPerRow})`;
      this.style.gridTemplateColumns = `repeat(auto-fill, minmax(${minmaxFirstParam}, 1fr))`;
    } else if (this.cardMinWidth) {
      this.style.gridTemplateColumns = `repeat(auto-fill, minmax(min(${this.cardMinWidth}, 100%), 1fr))`;
    } else if (this.columnsPerRow) {
      this.style.gridTemplateColumns = `repeat(${this.columnsPerRow}, 1fr)`;
    }
  }
  setAttributeToProperty(propertyName) {
    const prop = this.getAttribute(propertyName, true);
    if (prop)
      this[propertyName] = prop;
  }
  init() {
    super.init();
    this.autoRowSize = "1fr";
    this.setAttributeToProperty("cardMinWidth");
    this.setAttributeToProperty("cardHeight");
  }
};
CardLayout = __decorateClass([
  customElements2("i-card-layout")
], CardLayout);

// packages/combo-box/src/style/combo-box.css.ts
var Theme6 = theme_exports.ThemeVars;
var ItemListStyle = style({
  display: "none",
  position: "absolute",
  margin: "0.05rem 0 0",
  backgroundColor: "#fff",
  border: "1px solid rgba(0,0,0,.15)",
  borderRadius: "0.25rem",
  zIndex: "99999",
  $nest: {
    "> ul": {
      maxHeight: "100px",
      overflowY: "scroll",
      overflowX: "hidden",
      listStyle: "none",
      margin: 0,
      padding: 0,
      borderRadius: "inherit"
    },
    "> ul > li": {
      display: "block",
      width: "100%",
      padding: "0.25rem 0.5rem",
      backgroundColor: "transparent",
      whiteSpace: "nowrap",
      textOverflow: "ellipsis",
      cursor: "pointer",
      borderRadius: "inherit"
    },
    "> ul > li .highlight": {
      backgroundColor: Theme6.colors.warning.light
    },
    "> ul > li.matched": {
      backgroundColor: Theme6.colors.primary.light
    },
    "> ul > li:hover": {
      backgroundColor: Theme6.colors.primary.light
    }
  }
});
cssRule("i-combo-box", {
  position: "relative",
  display: "flex",
  fontFamily: Theme6.typography.fontFamily,
  fontSize: Theme6.typography.fontSize,
  color: Theme6.text.primary,
  alignItems: "center",
  $nest: {
    "&.i-combo-box-multi": {
      height: "auto !important"
    },
    "> .icon-btn": {
      display: "inline-flex",
      flexWrap: "nowrap",
      whiteSpace: "nowrap",
      background: "inherit",
      padding: "8px",
      marginLeft: "-1px",
      borderRadius: "0 3px 3px 0",
      cursor: "pointer",
      height: "100%",
      alignItems: "center",
      position: "absolute",
      right: 0,
      border: `1px solid ${Theme6.divider}`,
      borderLeft: "none"
    },
    "> .icon-btn:hover": {
      backgroundColor: Theme6.action.hover
    },
    "> .icon-btn i-icon": {
      display: "inline-block",
      width: "12px",
      height: "12px"
    },
    ".selection": {
      display: "inline-flex",
      alignItems: "center",
      flexWrap: "wrap",
      maxWidth: "calc(100% - 32px)",
      height: "100%",
      border: "inherit",
      background: Theme6.combobox.background,
      borderRadius: "inherit",
      padding: "2px 4px",
      transition: "all .3s cubic-bezier(.645,.045,.355,1)",
      gap: 5,
      flexGrow: 1,
      $nest: {
        ".selection-item": {
          border: `1px solid ${Theme6.divider}`,
          backgroundColor: "rgba(0, 0, 0, 0.12)",
          color: "#000",
          borderRadius: 3,
          display: "inline-flex",
          alignItems: "center",
          padding: "3px 5px",
          gap: 4,
          maxWidth: "clamp(100px, 50%, 200px)",
          userSelect: "none",
          $nest: {
            ".close-icon": {
              cursor: "pointer",
              opacity: "0.5"
            },
            ".close-icon:hover": {
              opacity: 1
            },
            "> span:first-child": {
              display: "inline-block",
              overflow: "hidden",
              whiteSpace: "pre",
              textOverflow: "ellipsis"
            }
          }
        },
        "input": {
          padding: "1px 0.5rem",
          border: "none",
          boxShadow: "none",
          outline: "none",
          width: "auto !important",
          maxWidth: "100%",
          flex: 1,
          background: Theme6.combobox.background,
          color: Theme6.combobox.fontColor,
          fontSize: "inherit"
        }
      }
    }
  }
});

// packages/combo-box/src/combo-box.ts
var defaultIcon2 = {
  width: 16,
  height: 16,
  fill: theme_exports.ThemeVars.text.primary
};
var ComboBox = class extends Control {
  constructor(parent, options) {
    super(parent, options, {
      mode: "single"
    });
    this.newItem = null;
    this.isListShown = false;
  }
  get value() {
    return this.selectedItem;
  }
  set value(value) {
  }
  get selectedItem() {
    return this._selectedItem;
  }
  set selectedItem(value) {
    let isValueValid = false;
    let validValue;
    if (this.isMulti) {
      const formattedValue = Array.isArray(value) ? value : [value];
      validValue = formattedValue.filter((item) => this.isValueValid(item));
      isValueValid = !!validValue.length;
    } else {
      validValue = value;
      isValueValid = this.isValueValid(value);
    }
    if (isValueValid) {
      this._selectedItem = validValue;
      if (Array.isArray(this._selectedItem)) {
        this.inputElm.value = "";
        const selectionItems = Array.from(this.inputWrapElm.querySelectorAll(".selection-item"));
        selectionItems.forEach((elm) => this.inputWrapElm.removeChild(elm));
        this._selectedItem.forEach((item) => {
          const itemElm = this.createElement("div");
          itemElm.classList.add("selection-item");
          const content = this.createElement("span", itemElm);
          content.textContent = item.label;
          itemElm.appendChild(content);
          const closeButton = this.createElement("span", itemElm);
          closeButton.classList.add("close-icon");
          closeButton.innerHTML = "&times;";
          closeButton.addEventListener("click", (event) => this.handleRemove(event, item));
          this.inputWrapElm.appendChild(itemElm);
          this.inputWrapElm.insertBefore(itemElm, this.inputElm);
        });
      } else {
        this.inputElm.value = this._selectedItem.label;
      }
      if (this.callback)
        this.callback(value);
    } else if (this.isMulti) {
      this._selectedItem = validValue;
      this.inputElm.value = "";
      const selectionItems = Array.from(this.inputWrapElm.querySelectorAll(".selection-item"));
      selectionItems.forEach((elm) => this.inputWrapElm.removeChild(elm));
    }
  }
  get caption() {
    return this._caption;
  }
  set caption(value) {
    this._caption = value;
    this.labelElm.innerHTML = this._caption || "";
    if (!value)
      this.labelElm.style.display = "none";
    else
      this.labelElm.style.display = "";
  }
  get captionWidth() {
    return this._captionWidth;
  }
  set captionWidth(value) {
    this._captionWidth = value;
    this.setElementPosition(this.labelElm, "width", value);
  }
  get items() {
    return this._items;
  }
  set items(items) {
    this._items = items;
  }
  get icon() {
    if (!this._icon) {
      this._icon = new Icon(void 0, defaultIcon2);
      if (this.iconElm)
        this.iconElm.appendChild(this._icon);
    }
    return this._icon;
  }
  set icon(value) {
    if (this.iconElm) {
      if (this._icon && this.iconElm.contains(this._icon))
        this.iconElm.removeChild(this._icon);
      this._icon = value;
      if (this._icon)
        this.iconElm.appendChild(this._icon);
    }
  }
  get searchStr() {
    return this._searchStr;
  }
  set searchStr(str) {
    if (str === null)
      str = "";
    this._searchStr = str;
  }
  get placeholder() {
    return this.inputElm.placeholder;
  }
  set placeholder(value) {
    this.inputElm.placeholder = value;
  }
  get mode() {
    return this._mode;
  }
  set mode(value) {
    this._mode = value;
    if (this.isMulti)
      this.classList.add("i-combo-box-multi");
    else
      this.classList.remove("i-combo-box-multi");
  }
  get isMulti() {
    return this.mode === "tags" || this.mode === "multiple";
  }
  isValueValid(value) {
    if (!value)
      return false;
    const index = this.getItemIndex(this.items, value);
    return index >= 0;
  }
  getItemIndex(items, item) {
    const value = item == null ? void 0 : item.value.toString();
    if (!value)
      return -1;
    const index = items.findIndex((_item) => {
      return _item.value.toString().toLowerCase() === value.toLowerCase();
    });
    return index;
  }
  openList() {
    this.isListShown = true;
    window.document.body.append(this.listElm);
    this.listElm.classList.add("show");
    this.listElm.style.display = "block";
    this.calculatePositon();
    if (!this.searchStr)
      this.renderItems();
  }
  calculatePositon() {
    let parentElement = this.linkTo || this;
    let rect = parentElement.getBoundingClientRect();
    const scrollTop = document.documentElement.scrollTop || window.pageYOffset;
    const scrollLeft = document.documentElement.scrollLeft || window.pageXOffset;
    const top = rect.top + scrollTop + rect.height;
    const left = rect.left + scrollLeft;
    const width = rect.right - rect.left;
    this.listElm.style.top = top + "px";
    this.listElm.style.left = left + "px";
    this.listElm.style.width = width + "px";
  }
  closeList() {
    var _a;
    this.isListShown = false;
    this.listElm.remove();
    this.listElm.style.display = "none";
    this.listElm.classList.remove("show");
    this.searchStr = "";
    if (this.isMulti || Array.isArray(this.selectedItem))
      return;
    const label = (_a = this.selectedItem) == null ? void 0 : _a.label;
    if (label && this.inputElm)
      this.inputElm.value = label;
  }
  toggleList() {
    this.isListShown ? this.closeList() : this.openList();
  }
  escapeRegExp(text) {
    return text ? text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&") : text;
  }
  renderItems() {
    if (this.mode === "tags" && this.newItem) {
      if (this.searchStr)
        this.newItem.label = this.searchStr;
      const liElm = this.listElm.querySelector(`li[data-key="${this.newItem.value}"]`);
      if (liElm) {
        if (this.searchStr) {
          liElm.textContent = this.searchStr;
          liElm.classList.add("matched");
          liElm.innerHTML = `<span class="highlight">${this.searchStr}</span>`;
        } else {
          liElm.remove();
          this.newItem = null;
        }
      } else {
        const ul = this.listElm.querySelector("ul");
        ul && this.add(this.newItem, ul);
      }
    }
    const regExp = new RegExp(this.escapeRegExp(this.searchStr), "g");
    this.listElm.innerHTML = "";
    if (this.searchStr)
      this.openList();
    const ulElm = this.createElement("ul", this.listElm);
    let creatingNew = false;
    for (let item of this.items) {
      const label = item.label || "";
      const isMatchedPart = this.searchStr && label.toLowerCase().includes(this.searchStr.toLowerCase());
      const isMatchedDone = this.searchStr && label.toLowerCase() === this.searchStr.toLowerCase();
      if (item.isNew && isMatchedPart && !isMatchedDone)
        creatingNew = true;
      if (!this.searchStr || isMatchedDone || isMatchedPart) {
        const liElm = this.createElement("li", ulElm);
        liElm.setAttribute("data-key", item.value);
        liElm.addEventListener("click", (event) => {
          event.stopPropagation();
          this.onItemClick(event, liElm, item);
        });
        if (Array.isArray(this.selectedItem)) {
          const index = this.getItemIndex(this.selectedItem, item);
          if (index >= 0)
            liElm.classList.add("matched");
        } else if (item === this.selectedItem) {
          liElm.classList.add("matched");
        }
        const displayItem = this.searchStr ? label.replace(regExp, `<span class="highlight">${this.searchStr}</span>`) : label;
        liElm.innerHTML = displayItem;
      }
    }
    if (!ulElm.innerHTML || creatingNew) {
      if (this.mode === "tags") {
        if (!this.newItem)
          this.newItem = {
            value: new Date().getTime().toString(),
            label: this.searchStr
          };
        const liElm = this.listElm.querySelector(`li[data-key="${this.newItem.label}"]`);
        if (!liElm)
          this.add(this.newItem, ulElm);
      } else if (!ulElm.innerHTML)
        ulElm.innerHTML = '<li style="text-align:center;">No data</li>';
    }
  }
  add(item, parent) {
    const liElm = this.createElement("li");
    liElm.setAttribute("data-key", item.value);
    liElm.addEventListener("click", (event) => {
      event.stopPropagation();
      this.onItemClick(event, liElm, item);
    });
    liElm.classList.add("matched");
    liElm.innerHTML = `<span class="highlight">${this.searchStr}</span>`;
    parent.prepend(liElm);
  }
  handleRemove(event, item) {
    event.stopPropagation();
    if (!this.enabled)
      return;
    const liElm = this.listElm.querySelector(`li[data-key="${item.value}"]`);
    if (liElm) {
      liElm.classList.remove("matched");
      if (this.mode === "tags" && item.isNew) {
        liElm.remove();
        this.items = this.items.filter((data) => data.value !== item.value);
      }
    }
    const selectedItem = this.selectedItem;
    const selectedIndex = this.getItemIndex(selectedItem, item);
    if (selectedIndex >= 0)
      selectedItem.splice(selectedIndex, 1);
    this.selectedItem = selectedItem;
    if (this.onChanged)
      this.onChanged(this, event);
  }
  onItemClick(event, liElm, item) {
    var _a;
    if (((_a = this.newItem) == null ? void 0 : _a.value) === item.value) {
      item = { ...this.newItem, value: this.newItem.label, isNew: true };
      this.items.push(item);
    }
    this.newItem = null;
    if (Array.isArray(this.selectedItem)) {
      const index = this.getItemIndex(this.selectedItem, item);
      const selectedItem = this.selectedItem;
      if (index >= 0) {
        selectedItem.splice(index, 1);
      } else {
        selectedItem.push(item);
      }
      this.selectedItem = selectedItem;
      liElm.classList.toggle("matched");
      this.closeList();
    } else {
      this.selectedItem = item;
      this.closeList();
    }
    if (this.onChanged)
      this.onChanged(this, event);
  }
  clear() {
    if (this.isMulti) {
      this._selectedItem = [];
    } else {
      this._selectedItem = void 0;
    }
    this.inputElm.value = "";
  }
  init() {
    if (!this.inputElm) {
      this.callback = this.getAttribute("parentCallback", true);
      const placeholder = this.getAttribute("placeholder", true);
      this.mode = this.getAttribute("mode", true);
      this.items = this.getAttribute("items", true, []);
      this.captionSpanElm = this.createElement("span", this);
      this.labelElm = this.createElement("label", this.captionSpanElm);
      this.inputWrapElm = this.createElement("div", this);
      this.inputWrapElm.classList.add("selection");
      this.inputElm = this.createElement("input", this.inputWrapElm);
      const disabled = this.getAttribute("enabled") === false;
      this.inputElm.disabled = disabled;
      this.inputElm.addEventListener("click", (e) => {
        this.openList();
        if (this.onClick)
          this.onClick(this, e);
      });
      this.inputElm.addEventListener("keyup", () => {
        this.searchStr = this.inputElm.value;
        this.renderItems();
      });
      this.inputWrapElm.appendChild(this.inputElm);
      placeholder && (this.placeholder = placeholder);
      this.iconElm = this.createElement("span", this);
      this.iconElm.classList.add("icon-btn");
      this.iconElm.addEventListener("click", () => {
        if (!this._enabled)
          return false;
        this.toggleList();
      });
      let iconAttr = this.getAttribute("icon", true);
      if (iconAttr) {
        iconAttr = { ...defaultIcon2, ...iconAttr };
        const icon = new Icon(void 0, iconAttr);
        this.icon = icon;
      }
      this.selectedItem = this.getAttribute("selectedItem", true);
      this.listElm = this.createElement("div");
      this.listElm.classList.add(ItemListStyle);
      this.listElm.classList.add("item-list");
      this.renderItems();
      document.addEventListener("click", (e) => {
        if (!this._enabled)
          return false;
        if (!this.contains(e.target))
          this.closeList();
      });
      super.init();
      window.addEventListener("resize", this.calculatePositon.bind(this));
    }
  }
  disconnectCallback() {
    window.removeEventListener("resize", this.calculatePositon.bind(this));
  }
  static async create(options, parent) {
    let self = new this(parent, options);
    await self.ready();
    return self;
  }
};
ComboBox = __decorateClass([
  customElements2("i-combo-box")
], ComboBox);

// packages/datepicker/src/style/datepicker.css.ts
var Theme7 = theme_exports.ThemeVars;
cssRule("i-datepicker", {
  display: "inline-block",
  fontFamily: Theme7.typography.fontFamily,
  fontSize: Theme7.typography.fontSize,
  "$nest": {
    "*": {
      boxSizing: "border-box"
    },
    "> span": {
      overflow: "hidden"
    },
    "> span > label": {
      boxSizing: "border-box",
      color: Theme7.text.primary,
      display: "inline-block",
      overflow: "hidden",
      whiteSpace: "nowrap",
      verticalAlign: "middle",
      textAlign: "right",
      paddingRight: 4,
      height: "100%"
    },
    "> input": {
      padding: "1px 0.5rem",
      border: `0.5px solid ${Theme7.divider}`,
      boxSizing: "border-box",
      outline: "none"
    },
    "> input[type=text]:focus": {
      borderColor: Theme7.colors.info.main
    },
    "i-icon": {
      fill: Theme7.colors.primary.contrastText
    },
    ".datepicker-toggle": {
      display: "inline-block",
      position: "relative",
      verticalAlign: "middle",
      backgroundColor: "#6c757d",
      padding: "7px",
      marginLeft: "-1px",
      marginTop: "-1px",
      borderRadius: "0 3px 3px 0",
      cursor: "pointer"
    },
    "> .datepicker-toggle:hover": {
      backgroundColor: "#545b62"
    },
    ".datepicker": {
      position: "absolute",
      left: 0,
      top: 0,
      width: "100%",
      height: "100%",
      border: 0,
      padding: 0,
      opacity: 0,
      cursor: "pointer"
    },
    ".datepicker::-webkit-calendar-picker-indicator": {
      position: "absolute",
      left: 0,
      top: 0,
      width: "100%",
      height: "100%",
      margin: 0,
      padding: 0,
      cursor: "pointer"
    }
  }
});

// packages/datepicker/src/datepicker.ts
var defaultCaptionWidth = 40;
var Datepicker = class extends Control {
  constructor(parent, options) {
    super(parent, options, {
      captionWidth: defaultCaptionWidth,
      height: 25,
      width: 100
    });
    this._onDatePickerChange = (event) => {
      const pickerValue = this.datepickerElm.value;
      RequireJS.require(["@moment"], (moment2) => {
        let _moment = this._type === "time" ? moment2(pickerValue, "HH:mm") : moment2(pickerValue);
        this.updateValue(_moment);
        if (this.onChanged)
          this.onChanged(this, event);
      });
    };
    this._dateInputMask = (event) => {
      const key2 = event.key;
      const isNumeric = key2 != " " && !isNaN(Number(key2));
      const separator = this._type === "time" ? ":" : "/";
      if (!isNumeric) {
        event.preventDefault();
      }
      var len = this.inputElm.value.length;
      if (len === 2) {
        this.inputElm.value += separator;
      }
      if (this._type !== "time" && len === 5) {
        this.inputElm.value += separator;
      }
      if (this._type === "dateTime") {
        if (len === 10) {
          this.inputElm.value += " ";
        }
        if (len === 13) {
          this.inputElm.value += ":";
        }
      }
    };
    this._onBlur = (event) => {
      if (!this.inputElm.value) {
        const oldVal = this.value;
        this.clear();
        const isChanged = oldVal !== this.value;
        if (event && isChanged && this.onChanged)
          this.onChanged(this, event);
        return;
      }
      ;
      RequireJS.require(["@moment"], (moment2) => {
        const temp = moment2(this.inputElm.value, this.formatString, true).format(this.datepickerFormat);
        const _moment = moment2(temp, this.datepickerFormat, true);
        this.updateValue(_moment, event);
      });
    };
  }
  _handleClick(event) {
    return super._handleClick(event, true);
  }
  get caption() {
    return this._caption;
  }
  set caption(value) {
    this._caption = value;
    this.labelElm.textContent = this._caption || "";
    if (!value)
      this.labelElm.style.display = "none";
    else
      this.labelElm.style.display = "";
  }
  get captionWidth() {
    return this.labelElm.offsetWidth;
  }
  set captionWidth(value) {
    this._captionWidth = value;
    this.setElementPosition(this.labelElm, "width", value);
    const width = this.width - this.captionWidth - (this._iconWidth || 0);
    this.inputElm.style.width = `${width}px`;
  }
  get height() {
    return this.offsetHeight;
  }
  set height(value) {
    this.setPosition("height", value);
    this.inputElm.style.height = typeof value === "string" ? value : `${value}px`;
  }
  get width() {
    return this.offsetWidth;
  }
  set width(value) {
    this.setPosition("width", value);
    const width = typeof this._width === "string" ? this._width : `${this._width}px`;
    const captionWidth = typeof this._captionWidth === "string" ? this._captionWidth : `${this._captionWidth}px`;
    const iconWidth = `${this._iconWidth || 0}px`;
    this.inputElm.style.width = `calc(${width} - ${captionWidth} - ${iconWidth})`;
  }
  get value() {
    return this._value;
  }
  set value(value) {
    if (value)
      this.updateValue(value);
    else
      this.clear();
  }
  get defaultDateTimeFormat() {
    switch (this._type) {
      case "date":
        return "DD/MM/YYYY";
      case "dateTime":
        return "DD/MM/YYYY HH:mm";
      case "time":
        return "HH:mm";
    }
  }
  get dateTimeFormat() {
    return this._dateTimeFormat;
  }
  set dateTimeFormat(format) {
    this._dateTimeFormat = format;
  }
  get datepickerFormat() {
    switch (this._type) {
      case "date":
        return "YYYY-MM-DD";
      case "dateTime":
        return "YYYY-MM-DDTHH:mm";
      case "time":
        return "HH:mm";
    }
  }
  get maxLength() {
    switch (this._type) {
      case "date":
        return 10;
      case "dateTime":
        return 16;
      case "time":
        return 5;
    }
  }
  set enabled(value) {
    this.inputElm.disabled = !value;
    this.datepickerElm.disabled = !value;
  }
  get placeholder() {
    return this._placeholder;
  }
  set placeholder(value) {
    this._placeholder = value;
    if (this.inputElm)
      this.inputElm.placeholder = this._placeholder;
  }
  get formatString() {
    return this.dateTimeFormat || this.defaultDateTimeFormat;
  }
  updateValue(value, event) {
    this.inputElm.placeholder = this._placeholder || "";
    const oldVal = this.value;
    if (value.isValid()) {
      this._value = value;
      this.inputElm.value = value.format(this.formatString);
      this.datepickerElm.value = value.format(this.datepickerFormat);
      if (this.callback)
        this.callback(this.inputElm.value);
    } else if (this.value) {
      this.inputElm.value = this.value.format(this.formatString);
      this.datepickerElm.value = this.value.format(this.datepickerFormat);
    }
    const isChanged = oldVal && this.value && !oldVal.isSame(this.value) || (!oldVal || !this.value);
    if (event && isChanged && this.onChanged)
      this.onChanged(this, event);
  }
  clear() {
    this._value = void 0;
    this.inputElm.value = "";
    this.datepickerElm.value = "";
    this.callback && this.callback("");
  }
  init() {
    if (!this.captionSpanElm) {
      RequireJS.config({
        paths: {
          "@moment": `${LibPath}lib/moment/2.29.1/moment.js`
        }
      });
      this.callback = this.getAttribute("parentCallback", true);
      this.dateTimeFormat = this.getAttribute("dateTimeFormat", true, "");
      this._type = this.getAttribute("type", true, "date");
      this._iconWidth = this.getAttribute("height", true);
      this.captionSpanElm = this.createElement("span", this);
      this.labelElm = this.createElement("label", this.captionSpanElm);
      this.inputElm = this.createElement("input", this);
      this.inputElm.setAttribute("type", "text");
      this.inputElm.setAttribute("autocomplete", "disabled");
      this.inputElm.style.height = this.height + "px";
      this.inputElm.onblur = (event) => {
        event.stopPropagation();
        event.preventDefault();
        this._onBlur(event);
      };
      this.inputElm.pattern = this.formatString;
      this.placeholder = this.getAttribute("placeholder", true, "");
      this.toggleElm = this.createElement("span", this);
      this.toggleElm.classList.add("datepicker-toggle");
      this.toggleElm.style.width = this._iconWidth + "px";
      this.toggleElm.style.height = this._iconWidth + "px";
      this.toggleIconElm = new Icon(this, {
        name: this._type === "time" ? "clock" : "calendar",
        width: 12,
        height: 12,
        fill: theme_exports.ThemeVars.text.primary
      });
      this.toggleElm.appendChild(this.toggleIconElm);
      this.datepickerElm = this.createElement("input");
      const inputType = this._type === "dateTime" ? "datetime-local" : this._type;
      this.datepickerElm.setAttribute("type", inputType);
      this.datepickerElm.classList.add("datepicker");
      this.datepickerElm.addEventListener("change", (event) => {
        event.stopPropagation();
        this._onDatePickerChange(event);
      });
      this.toggleElm.appendChild(this.datepickerElm);
      this.captionWidth = this.getAttribute("captionWidth", true, defaultCaptionWidth);
      this.caption = this.getAttribute("caption", true);
      super.init();
    }
  }
  static async create(options, parent) {
    let self = new this(parent, options);
    await self.ready();
    return self;
  }
};
Datepicker = __decorateClass([
  customElements2("i-datepicker")
], Datepicker);

// packages/range/src/style/range.css.ts
var Theme8 = theme_exports.ThemeVars;
cssRule("i-range", {
  position: "relative",
  display: "inline-block",
  fontFamily: Theme8.typography.fontFamily,
  fontSize: Theme8.typography.fontSize,
  "$nest": {
    "*": {
      boxSizing: "border-box"
    },
    "> span": {
      overflow: "hidden"
    },
    "> span > label": {
      boxSizing: "border-box",
      color: Theme8.text.primary,
      display: "inline-block",
      overflow: "hidden",
      whiteSpace: "nowrap",
      verticalAlign: "middle",
      textAlign: "right",
      paddingRight: 4,
      height: "100%"
    },
    ".slider": {
      position: "relative",
      display: "inline-block"
    },
    'input[type="range"]': {
      "-webkit-appearance": "none",
      appearance: "none",
      background: "#d3d3d3",
      backgroundImage: `linear-gradient(${Theme8.colors.info.main}, ${Theme8.colors.info.main})`,
      backgroundSize: "0% 100%",
      backgroundRepeat: "no-repeat !important",
      borderRadius: "0.5rem",
      opacity: 0.7,
      border: 0,
      margin: 0,
      width: "inherit",
      boxSizing: "border-box",
      outline: "none",
      verticalAlign: "middle"
    },
    'input[type="range"]:not(:disabled)': {
      cursor: "pointer"
    },
    'input[type="range"]:hover': {
      opacity: 1
    },
    'input[type="range"]:focus': {
      outline: "none"
    },
    'input[type="range"]::-webkit-slider-runnable-track': {
      "-webkit-appearance": "none",
      boxShadow: "none",
      border: "none",
      background: "transparent",
      borderRadius: "0.5rem",
      height: "0.3rem",
      marginLeft: "-6.5px",
      marginRight: "-6.5px"
    },
    'input[type="range"]::-webkit-slider-thumb': {
      "-webkit-appearance": "none",
      appearance: "none",
      marginTop: "-5px",
      backgroundColor: Theme8.colors.info.main,
      borderRadius: "0.5rem",
      height: "1rem",
      width: "1rem"
    },
    ".range-labels": {
      display: "flex",
      justifyContent: "space-between",
      height: "auto",
      overflow: "hidden",
      listStyle: "none"
    },
    ".range-labels li": {
      padding: "0 0.25rem"
    },
    '&.--step input[type="range"]': {
      opacity: 1,
      $nest: {
        "&::-webkit-slider-runnable-track": {
          zIndex: 2
        },
        "&::-webkit-slider-thumb": {
          zIndex: 2
        }
      }
    },
    ".slider-step": {
      position: "absolute",
      zIndex: 0,
      top: 2,
      left: 0,
      right: 0,
      bottom: 0,
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      background: "transparent"
    },
    ".step-dot": {
      position: "relative",
      zIndex: 1,
      display: "flex",
      justifyContent: "center",
      width: "3px",
      height: "10px",
      backgroundColor: "#a7a9ac"
    },
    ".tooltip": {
      visibility: "hidden",
      minWidth: 35,
      maxWidth: 70,
      overflowWrap: "break-word",
      backgroundColor: "rgba(0, 0, 0, 0.78)",
      color: "#fff",
      textAlign: "center",
      borderRadius: "6px",
      padding: "8px",
      position: "absolute",
      zIndex: 1,
      bottom: "150%",
      left: "0%",
      marginLeft: "-20px",
      opacity: 0,
      transition: "opacity 0.3s",
      $nest: {
        "&::after": {
          content: "''",
          position: "absolute",
          top: "100%",
          left: "50%",
          marginLeft: "-5px",
          borderWidth: "5px",
          borderStyle: "solid",
          borderColor: "rgba(0, 0, 0, 0.78) transparent transparent transparent"
        }
      }
    },
    'input[type="range"]:hover + .tooltip': {
      visibility: "visible",
      opacity: 1
    }
  }
});

// packages/range/src/range.ts
var Range = class extends Control {
  constructor(parent, options) {
    super(parent, options, {
      height: 25,
      width: 100
    });
  }
  get caption() {
    return this._caption;
  }
  set caption(value) {
    this._caption = value;
    this.labelElm.textContent = this._caption || "";
    if (!value)
      this.labelElm.style.display = "none";
    else
      this.labelElm.style.display = "";
  }
  get captionWidth() {
    return this.labelElm.offsetWidth;
  }
  set captionWidth(value) {
    this._captionWidth = value;
    this.setElementPosition(this.labelElm, "width", value);
    const width = this.width - this.captionWidth;
    this.inputContainerElm.style.width = `${width}px`;
  }
  get value() {
    return this._value;
  }
  set value(value) {
    if (value === null)
      value = +this.inputElm.min;
    this._value = value;
    this.inputElm.value = value.toString();
    const min = Number(this.inputElm.min);
    const max = Number(this.inputElm.max);
    this.inputElm.style.backgroundSize = (this._value - min) * 100 / (max - min) + "% 100%";
    this.onUpdateTooltip(false);
    if (this.callback)
      this.callback(value);
  }
  get width() {
    return this.offsetWidth;
  }
  set width(value) {
    this.setPosition("width", value);
    const width = typeof value === "string" ? value : `${value}px`;
    const captionWidth = typeof this._captionWidth === "string" ? this._captionWidth : `${this._captionWidth}px`;
    this.inputContainerElm.style.width = `calc(${width} - ${captionWidth})`;
  }
  set enabled(value) {
    this.inputElm.disabled = !value;
  }
  get tooltipVisible() {
    return this._tooltipVisible;
  }
  set tooltipVisible(value) {
    this._tooltipVisible = value;
    this.tooltipElm.style.display = value ? "block" : "none";
  }
  onSliderChange(event) {
    this.value = +this.inputElm.value;
    const min = Number(this.inputElm.min);
    const max = Number(this.inputElm.max);
    this.inputElm.style.backgroundSize = (this._value - min) * 100 / (max - min) + "% 100%";
    if (this.onChanged)
      this.onChanged(this, event);
    this.onUpdateTooltip(false);
  }
  onUpdateTooltip(init) {
    let inputValue = this._value;
    let formattedValue = this.tooltipFormatter ? this.tooltipFormatter(inputValue) : inputValue;
    const min = Number(this.inputElm.min);
    const max = Number(this.inputElm.max);
    if (init) {
      this.tooltipElm.style.marginLeft = `-${this.tooltipElm.clientWidth / 2}px`;
    }
    this.tooltipElm.innerHTML = formattedValue;
    this.tooltipElm.style.left = (this._value - min) * 100 / (max - min) + "%";
  }
  init() {
    if (!this.captionSpanElm) {
      this.callback = this.getAttribute("parentCallback", true);
      const min = this.getAttribute("min", true, 0);
      const max = this.getAttribute("max", true, 100);
      const step = this.getAttribute("step", true, 0);
      const stepDots = this.getAttribute("stepDots", true);
      const tooltipVisible = this.getAttribute("tooltipVisible", true, false);
      const formatter = this.getAttribute("tooltipFormatter", true) || this.tooltipFormatter;
      this.tooltipFormatter = formatter;
      this.captionSpanElm = this.createElement("span", this);
      this.labelElm = this.createElement("label", this.captionSpanElm);
      this.inputContainerElm = this.createElement("div", this);
      this.inputContainerElm.classList.add("slider");
      this.inputElm = this.createElement("input", this.inputContainerElm);
      this.inputElm.setAttribute("autocomplete", "disabled");
      this.inputElm.type = "range";
      this.inputElm.min = min;
      this.inputElm.max = max;
      if (step !== 0) {
        this.inputElm.step = step;
      }
      this.inputElm.addEventListener("input", this.onSliderChange.bind(this));
      if (this.onMouseUp)
        this.inputElm.addEventListener("mouseup", () => {
          this.onMouseUp(this, this.value);
        });
      if (this.onKeyUp)
        this.inputElm.addEventListener("keyup", (e) => {
          const keys = ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "PageUp", "PageDown"];
          if (keys.includes(e.key))
            this.onMouseUp(this, this.value);
        });
      this.tooltipElm = this.createElement("span", this.inputContainerElm);
      this.tooltipElm.classList.add("tooltip");
      this.tooltipVisible = tooltipVisible || this.tooltipFormatter || false;
      if (stepDots) {
        this.classList.add("--step");
        const stepContainer = this.createElement("div", this);
        stepContainer.classList.add("slider-step");
        if (this.caption) {
          stepContainer.style.width = Number(this._width) - this.captionWidth + "px";
          stepContainer.style.marginLeft = this.captionWidth + "px";
        } else {
          stepContainer.style.width = "100%";
        }
        const dotNums = typeof stepDots === "boolean" ? (max - min) / (step || 1) + 1 : stepDots;
        for (let i = 0; i < dotNums; i++) {
          const dotElm = this.createElement("span", stepContainer);
          dotElm.classList.add("step-dot");
        }
      }
      this.captionWidth = this.getAttribute("captionWidth", true, 40);
      this.caption = this.getAttribute("caption", true);
      this.value = this.getAttribute("value", true, 0);
      if (this._value > 0) {
        this.inputElm.style.backgroundSize = (this._value - min) * 100 / (max - min) + "% 100%";
      }
      this.onUpdateTooltip(true);
      super.init();
    }
  }
  static async create(options, parent) {
    let self = new this(parent, options);
    await self.ready();
    return self;
  }
};
__decorateClass([
  observable("value")
], Range.prototype, "_value", 2);
Range = __decorateClass([
  customElements2("i-range")
], Range);

// packages/radio/src/radio.css.ts
var Theme9 = theme_exports.ThemeVars;
var captionStyle = style({
  fontFamily: Theme9.typography.fontFamily,
  fontSize: Theme9.typography.fontSize,
  "$nest": {
    "span": {
      color: Theme9.text.primary
    }
  }
});

// packages/radio/src/radio.ts
var defaultCaptionWidth2 = 40;
var Radio = class extends Control {
  constructor(parent, options) {
    super(parent, options, {
      captionWidth: defaultCaptionWidth2,
      height: 25,
      width: 100
    });
  }
  get value() {
    return this._value;
  }
  set value(value) {
    this._value = value || "";
    this.inputElm.value = value;
  }
  get caption() {
    return this._caption;
  }
  set caption(value) {
    this._caption = value;
    if (!value)
      this.captionSpanElm.style.display = "none";
    else
      this.captionSpanElm.style.display = "";
    this.captionSpanElm && (this.captionSpanElm.textContent = value);
  }
  get captionWidth() {
    return this._captionWidth;
  }
  set captionWidth(value) {
    this._captionWidth = value;
    this.setElementPosition(this.captionSpanElm, "width", value);
  }
  _handleClick(event) {
    const checked = this.inputElm.checked || false;
    if (checked)
      this.classList.add("is-checked");
    else
      this.classList.remove("is-checked");
    return super._handleClick(event);
  }
  init() {
    if (!this.initialized) {
      super.init();
      this.classList.add(captionStyle);
      this.labelElm = this.createElement("label", this);
      this.labelElm.classList.add("i-radio");
      this.inputElm = this.createElement("input", this.labelElm);
      this.inputElm.type = "radio";
      const disabled = this.getAttribute("enabled") === false;
      this.inputElm.disabled = disabled;
      this.value = this.getAttribute("value");
      this.captionSpanElm = this.createElement("span", this.labelElm);
      this.captionSpanElm.classList.add("i-radio_label");
      this.caption = this.getAttribute("caption", true, "");
      this.captionWidth = this.getAttribute("captionWidth", true, defaultCaptionWidth2);
      this.labelElm.style.color = theme_exports.ThemeVars.text.primary;
    }
  }
  static async create(options, parent) {
    let self = new this(parent, options);
    await self.ready();
    return self;
  }
};
__decorateClass([
  observable("value")
], Radio.prototype, "_value", 2);
Radio = __decorateClass([
  customElements2("i-radio")
], Radio);
var RadioGroup = class extends Control {
  constructor(parent, options) {
    super(parent, options);
    this._group = [];
  }
  get selectedValue() {
    return this._selectedValue;
  }
  set selectedValue(value) {
    this._selectedValue = value;
    this._group.forEach((item) => {
      const inputElm = item.querySelector("input");
      if (inputElm)
        inputElm.checked = item.value === value;
      if (item.value === value) {
        item.classList.add("is-checked");
      } else {
        item.classList.remove("is-checked");
      }
    });
  }
  get radioItems() {
    return this._radioItems;
  }
  set radioItems(value) {
    this._radioItems = value;
    this.renderUI();
  }
  renderUI() {
    this.clearInnerHTML();
    this._group = [];
    this.name = new Date().getTime().toString();
    this.radioItems.forEach((item) => {
      const elm = new Radio(this, item);
      this.appendItem(elm);
    });
  }
  appendItem(elm) {
    this.appendChild(elm);
    elm.onClick = this._handleChange.bind(this);
    const inputElm = elm.getElementsByTagName("input")[0];
    inputElm && inputElm.setAttribute("name", this.name);
    if (this.selectedValue && elm.value === this.selectedValue)
      inputElm.checked = true;
    this._group.push(elm);
  }
  _handleChange(source, event) {
    event.stopPropagation();
    const selectedValue = this.selectedValue;
    const value = source.value;
    this._selectedValue = value;
    this._group.forEach((item) => item.classList.remove("is-checked"));
    source.classList.add("is-checked");
    if (this.onChanged && selectedValue !== value)
      this.onChanged(this, event);
  }
  async add(options) {
    const elm = await Radio.create(options);
    this.appendItem(elm);
    this._radioItems.push(options);
    return elm;
  }
  delete(index) {
    if (index >= 0) {
      const radio = this._group[index];
      if (radio) {
        this._group.splice(index, 1);
        this._radioItems.splice(index, 1);
        radio.remove();
      }
    }
  }
  init() {
    var _a;
    if (!this.initialized) {
      this.classList.add("i-radio-group");
      this.setAttribute("role", "radiogroup");
      if ((_a = this.options) == null ? void 0 : _a.onChanged)
        this.onChanged = this.options.onChanged;
      const radioItems = this.getAttribute("radioItems", true);
      radioItems && (this.radioItems = radioItems);
      this.selectedValue = this.getAttribute("selectedValue", true);
      super.init();
    }
  }
  static async create(options, parent) {
    let self = new this(parent, options);
    await self.ready();
    return self;
  }
};
__decorateClass([
  observable("selectedValue")
], RadioGroup.prototype, "_selectedValue", 2);
RadioGroup = __decorateClass([
  customElements2("i-radio-group")
], RadioGroup);

// packages/input/src/style/input.css.ts
var Theme10 = theme_exports.ThemeVars;
cssRule("i-input", {
  display: "inline-block",
  fontFamily: Theme10.typography.fontFamily,
  fontSize: Theme10.typography.fontSize,
  "$nest": {
    "> span": {
      overflow: "hidden"
    },
    "> span > label": {
      boxSizing: "border-box",
      color: Theme10.text.primary,
      display: "inline-block",
      overflow: "hidden",
      whiteSpace: "nowrap",
      verticalAlign: "middle",
      textAlign: "right",
      paddingRight: 4,
      height: "100%"
    },
    "> input": {
      border: `0.5px solid ${Theme10.divider}`,
      boxSizing: "border-box",
      outline: "none",
      color: Theme10.input.fontColor,
      background: Theme10.input.background,
      borderRadius: "inherit",
      fontSize: "inherit",
      maxHeight: "100%"
    },
    ".clear-btn": {
      display: "none",
      verticalAlign: "middle",
      padding: "6px",
      backgroundColor: Theme10.action.focus,
      $nest: {
        "&.active": {
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer"
        }
      }
    },
    "textarea": {
      width: "100%",
      lineHeight: 1.5,
      color: Theme10.input.fontColor,
      background: Theme10.input.background
    }
  }
});

// packages/input/src/input.ts
var defaultCaptionWidth3 = 40;
var defaultRows = 4;
var Input = class extends Control {
  constructor(parent, options) {
    super(parent, options, {
      height: 25,
      width: 100
    });
    this._inputCallback = (value) => {
      this._value = value;
    };
  }
  get caption() {
    if (this._inputControl) {
      return this._inputControl.caption;
    }
    return this._caption;
  }
  set caption(value) {
    if (this._inputControl) {
      this._inputControl.caption = value;
    } else {
      this._caption = value;
      this.labelElm.textContent = this._caption || "";
      if (!value)
        this.labelElm.style.display = "none";
      else
        this.labelElm.style.display = "";
    }
  }
  get captionWidth() {
    if (this._inputControl) {
      return this._inputControl.captionWidth;
    }
    return this._captionWidth;
  }
  set captionWidth(value) {
    if (this._inputControl) {
      this._inputControl.captionWidth = value;
    } else {
      value = this._caption ? value || defaultCaptionWidth3 : 0;
      this._captionWidth = value;
      this.labelElm.style.width = value + "px";
    }
  }
  get height() {
    return this.offsetHeight;
  }
  set height(value) {
    this.setPosition("height", value);
    if (this._inputControl) {
      this._inputControl.height = value;
    } else {
      this.inputElm.style.height = typeof value === "string" ? value : `${value}px`;
    }
  }
  get value() {
    if (this._inputControl) {
      return this._inputControl.value;
    }
    return this._value;
  }
  set value(value) {
    if (this._inputControl) {
      this._inputControl.value = value;
    } else {
      if (value == null)
        value = "";
      this._value = value;
      this.inputElm.value = value;
    }
  }
  get width() {
    return this.offsetWidth;
  }
  set width(value) {
    this._width = value;
    const _value = Number(value);
    if (Number.isNaN(_value)) {
      this.setPosition("width", value);
      this.inputElm.style.width = value == null ? void 0 : value.toString();
    } else {
      this.style.width = value + "px";
      const clearBtnWidth = this._showClearButton ? this._clearBtnWidth : 0;
      const captionWidth = typeof this._captionWidth === "string" ? this._captionWidth : `${this._captionWidth}px`;
      const width = typeof this._width === "string" ? this._width : `${this._width}px`;
      this.inputElm.style.width = `calc(${width} - ${captionWidth} - ${clearBtnWidth}px)`;
    }
  }
  get readOnly() {
    return this._readOnly;
  }
  set readOnly(value) {
    this._readOnly = value;
    this.inputElm.readOnly = value;
  }
  get inputType() {
    return this._inputType;
  }
  set inputType(type) {
    this._inputType = type;
  }
  get inputControl() {
    return this._inputControl;
  }
  set enabled(value) {
    super.enabled = value;
    if (this._inputControl) {
      this._inputControl.enabled = value;
    } else if (this.inputElm) {
      this.inputElm.disabled = !value;
    }
  }
  set placeholder(value) {
    this.inputElm.placeholder = value;
  }
  get rows() {
    return this._rows;
  }
  set rows(value) {
    if (this.inputType !== "textarea")
      return;
    this._rows = value;
    this.inputElm.rows = value;
  }
  get multiline() {
    return this._multiline;
  }
  set multiline(value) {
    this._multiline = value;
    if (value) {
      this.inputType = "textarea";
      this.clearInnerHTML();
      this._createInputElement(this.inputType);
    }
  }
  get resize() {
    return this._resize;
  }
  set resize(value) {
    this._resize = value;
    if (this.inputType === "textarea" && value && this.inputElm) {
      this.inputElm.style.resize = value === "auto-grow" ? "none" : value;
      if (value === "auto" || value === "auto-grow") {
        this.inputElm.style.height = "auto";
        this.inputElm.style.height = this.inputElm.scrollHeight + 2 + "px";
      }
    }
  }
  _createInputElement(type) {
    const value = this.getAttribute("value");
    const caption = this.getAttribute("caption");
    const width = this.getAttribute("width", true);
    const height = this.getAttribute("height", true);
    const checked = this.getAttribute("checked", true);
    const enabled = this.getAttribute("enabled", true);
    const background = this.getAttribute("background", true);
    this._clearBtnWidth = height - 2 || 0;
    switch (type) {
      case "checkbox":
        this._inputControl = new Checkbox(this, {
          value,
          checked,
          enabled,
          caption,
          indeterminate: this.getAttribute("indeterminate", true)
        });
        if (this.onChanged)
          this._inputControl.onChanged = this.onChanged;
        this.appendChild(this._inputControl);
        this.inputElm = this._inputControl.querySelector('input[type="checkbox"]');
        break;
      case "combobox":
        this._inputControl = new ComboBox(this, {
          selectedItem: this.getAttribute("selectedItem", true),
          items: this.getAttribute("items", true),
          width,
          height,
          enabled,
          icon: this.getAttribute("icon", true),
          mode: this.getAttribute("mode", true),
          placeholder: this.getAttribute("placeholder", true),
          parentCallback: this._inputCallback
        });
        if (this.onChanged)
          this._inputControl.onChanged = this.onChanged;
        this.appendChild(this._inputControl);
        this.inputElm = this._inputControl.querySelector("input");
        break;
      case "date":
      case "dateTime":
      case "time":
        this._inputControl = new Datepicker(this, {
          caption,
          value,
          placeholder: this._placeholder,
          type,
          dateTimeFormat: this.getAttribute("dateTimeFormat", true),
          width,
          height,
          enabled,
          parentCallback: this._inputCallback
        });
        if (this.onChanged)
          this._inputControl.onChanged = this.onChanged;
        this.appendChild(this._inputControl);
        this.inputElm = this._inputControl.querySelector('input[type="text"]');
        break;
      case "range":
        this._inputControl = new Range(this, {
          value,
          caption,
          width,
          height,
          enabled,
          min: this.getAttribute("min", true),
          max: this.getAttribute("max", true),
          step: this.getAttribute("step", true),
          stepDots: this.getAttribute("stepDots", true),
          tooltipFormatter: this.getAttribute("tooltipFormatter", true),
          tooltipVisible: this.getAttribute("tooltipVisible", true),
          parentCallback: this._inputCallback
        });
        this._inputControl.onChanged = this.onChanged;
        this._inputControl.onMouseUp = this.onMouseUp;
        this._inputControl.onKeyUp = this.onKeyUp;
        this.appendChild(this._inputControl);
        this.inputElm = this._inputControl.querySelector('input[type="range"]');
        break;
      case "radio":
        const id = this.getAttribute("id") || "";
        this._inputControl = new Radio(this, {
          value,
          checked,
          enabled,
          caption,
          id: id + "_radio"
        });
        this.appendChild(this._inputControl);
        this.inputElm = this._inputControl.querySelector('input[type="radio"]');
        break;
      case "textarea":
        this.captionSpanElm = this.createElement("span", this);
        this.labelElm = this.createElement("label", this.captionSpanElm);
        this.inputElm = this.createElement("textarea", this);
        this.inputElm.style.height = "auto";
        const rows = this.getAttribute("rows", true) || defaultRows;
        this.rows = rows;
        if (this._placeholder) {
          this.inputElm.placeholder = this._placeholder;
        }
        this.inputElm.style.resize = value === "auto-grow" ? "none" : value;
        this.inputElm.disabled = enabled === false;
        this.inputElm.addEventListener("input", this._handleChange.bind(this));
        this.inputElm.addEventListener("keydown", this._handleInputKeyDown.bind(this));
        this.inputElm.addEventListener("keyup", this._handleInputKeyUp.bind(this));
        this.inputElm.addEventListener("blur", this._handleOnBlur.bind(this));
        this.inputElm.addEventListener("focus", this._handleOnFocus.bind(this));
        break;
      case "color":
        this.captionSpanElm = this.createElement("span", this);
        this.labelElm = this.createElement("label", this.captionSpanElm);
        this.inputElm = this.createElement("input", this);
        this.inputElm.style.height = "auto";
        this.inputElm.disabled = enabled === false;
        this.inputElm.setAttribute("type", "color");
        this.inputElm.addEventListener("input", this._handleChange.bind(this));
        this.inputElm.addEventListener("keydown", this._handleInputKeyDown.bind(this));
        this.inputElm.addEventListener("keyup", this._handleInputKeyUp.bind(this));
        this.inputElm.addEventListener("blur", this._handleOnBlur.bind(this));
        this.inputElm.addEventListener("focus", this._handleOnFocus.bind(this));
        break;
      default:
        const inputType = type == "password" ? type : "text";
        this.captionSpanElm = this.createElement("span", this);
        this.labelElm = this.createElement("label", this.captionSpanElm);
        this.inputElm = this.createElement("input", this);
        this.inputElm.setAttribute("autocomplete", "disabled");
        this.inputElm.style.height = this.height + "px";
        this.inputElm.type = inputType;
        if (this._placeholder)
          this.inputElm.placeholder = this._placeholder;
        this.inputElm.disabled = enabled === false;
        this.inputElm.addEventListener("input", this._handleChange.bind(this));
        this.inputElm.addEventListener("keydown", this._handleInputKeyDown.bind(this));
        this.inputElm.addEventListener("keyup", this._handleInputKeyUp.bind(this));
        this.inputElm.addEventListener("blur", this._handleOnBlur.bind(this));
        this.inputElm.addEventListener("focus", this._handleOnFocus.bind(this));
        this._showClearButton = this.getAttribute("showClearButton", true);
        if (this._showClearButton) {
          this.clearIconElm = this.createElement("span", this);
          this.clearIconElm.classList.add("clear-btn");
          this.clearIconElm.style.width = this._clearBtnWidth + "px";
          this.clearIconElm.style.height = this._clearBtnWidth + "px";
          this.clearIconElm.addEventListener("click", () => {
            if (!this._enabled)
              return false;
            this._clearValue();
          });
          const clearIcon = new Icon(this, { name: "times", width: 12, height: 12, fill: theme_exports.ThemeVars.text.primary });
          this.clearIconElm.appendChild(clearIcon);
        }
        break;
    }
    if (background && this._inputControl)
      this._inputControl.background = background;
  }
  _handleChange(event) {
    if (this.inputType === "number" && !/^-?\d*[.]?\d*$/.test(this.inputElm.value)) {
      this.inputElm.value = this._value;
      return;
    }
    if (this.inputType === "textarea" && (this.resize === "auto" || this.resize === "auto-grow")) {
      this.inputElm.style.height = "auto";
      this.inputElm.style.height = this.inputElm.scrollHeight + 2 + "px";
    }
    this._value = this.inputElm.value;
    if (this.onChanged)
      this.onChanged(this, event);
  }
  _handleInputKeyDown(event) {
    if (this.onKeyDown)
      this.onKeyDown(this, event);
  }
  _handleInputKeyUp(event) {
    if (this.onKeyUp)
      this.onKeyUp(this, event);
    if (this.clearIconElm) {
      if (this.value) {
        this.clearIconElm.classList.add("active");
      } else {
        this.clearIconElm.classList.remove("active");
      }
    }
  }
  _handleOnBlur(event) {
    if (this.onBlur) {
      event.preventDefault();
      this.onBlur(this);
    }
  }
  _handleOnFocus(event) {
    if (this.onFocus) {
      event.preventDefault();
      this.onFocus(this);
    }
  }
  _clearValue() {
    this.value = "";
    this.clearIconElm.classList.remove("active");
    if (this.onClearClick)
      this.onClearClick(this);
  }
  init() {
    if (!this.inputType) {
      this._placeholder = this.getAttribute("placeholder", true);
      this.inputType = this.getAttribute("inputType", true);
      this._createInputElement(this.inputType);
      this.multiline = this.getAttribute("multiline", true);
      this.caption = this.getAttribute("caption", true);
      this.captionWidth = parseInt(this.getAttribute("captionWidth", true));
      this.value = this.getAttribute("value", true);
      this.readOnly = this.getAttribute("readOnly", true, false);
      this.resize = this.getAttribute("resize", true, "none");
      if (this.value && this.clearIconElm)
        this.clearIconElm.classList.add("active");
      super.init();
    }
  }
  static async create(options, parent) {
    let self = new this(parent, options);
    await self.ready();
    return self;
  }
};
__decorateClass([
  observable("value")
], Input.prototype, "_value", 2);
Input = __decorateClass([
  customElements2("i-input")
], Input);

// packages/link/src/style/link.css.ts
var Theme11 = theme_exports.ThemeVars;
cssRule("i-link", {
  display: "block",
  cursor: "pointer",
  textTransform: "inherit",
  $nest: {
    "&:hover *": {
      color: Theme11.colors.primary.dark
    },
    "> a": {
      display: "inline",
      transition: "all .3s",
      textDecoration: "underline",
      color: "inherit",
      fontSize: "inherit",
      fontWeight: "inherit",
      fontFamily: "inherit",
      textTransform: "inherit"
    }
  }
});

// packages/link/src/link.ts
var Link = class extends Control {
  constructor(parent, options) {
    super(parent, options, {
      target: "_blank"
    });
  }
  get href() {
    return this._href;
  }
  set href(value) {
    this._href = typeof value === "string" ? value : "";
    if (this._linkElm)
      this._linkElm.href = this._href;
  }
  get target() {
    return this._target;
  }
  set target(value) {
    this._target = value;
    if (this._linkElm)
      this._linkElm.target = value;
  }
  append(children) {
    if (!this._linkElm) {
      this._linkElm = this.createElement("a", this);
    }
    this._linkElm.appendChild(children);
  }
  _handleClick(event, stopPropagation) {
    event.preventDefault();
    window.open(this._linkElm.href, this._linkElm.target);
    return super._handleClick(event);
  }
  addChildControl(control) {
    if (this._linkElm)
      this._linkElm.appendChild(control);
  }
  removeChildControl(control) {
    if (this._linkElm && this._linkElm.contains(control))
      this._linkElm.removeChild(control);
  }
  init() {
    if (!this.initialized) {
      super.init();
      if (!this._linkElm)
        this._linkElm = this.createElement("a", this);
      this.classList.add("i-link");
      const hrefAttr = this.getAttribute("href", true);
      hrefAttr && (this.href = hrefAttr);
      const targetAttr = this.getAttribute("target", true);
      targetAttr && (this._linkElm.target = targetAttr);
    }
  }
  static async create(options, parent) {
    let self = new this(parent, options);
    await self.ready();
    return self;
  }
};
Link = __decorateClass([
  customElements2("i-link")
], Link);

// packages/label/src/style/label.css.ts
var Theme12 = theme_exports.ThemeVars;
var captionStyle2 = style({
  display: "inline-block",
  color: Theme12.text.primary,
  fontFamily: Theme12.typography.fontFamily,
  fontSize: Theme12.typography.fontSize
});

// packages/label/src/label.ts
var Label = class extends Control {
  constructor(parent, options) {
    super(parent, options);
  }
  get caption() {
    return this.captionSpan.innerHTML;
  }
  set caption(value) {
    this.captionSpan.innerHTML = value || "";
  }
  get link() {
    if (!this._link) {
      this._link = new Link(this, {
        href: "#",
        target: "_blank",
        font: this.font
      });
      this._link.append(this.captionSpan);
      this.appendChild(this._link);
    }
    return this._link;
  }
  set link(value) {
    if (this._link) {
      this._link.prepend(this.captionSpan);
      this._link.remove();
    }
    this._link = value;
    if (this._link) {
      this._link.append(this.captionSpan);
      this.appendChild(this._link);
    }
  }
  set height(value) {
    this.setPosition("height", value);
    if (this.captionSpan)
      this.captionSpan.style.height = value + "px";
  }
  set width(value) {
    this.setPosition("width", value);
    if (this.captionSpan)
      this.captionSpan.style.width = value + "px";
  }
  get wordBreak() {
    return this.style.wordBreak;
  }
  set wordBreak(value) {
    this.style.wordBreak = value;
  }
  get overflowWrap() {
    return this.style.overflowWrap;
  }
  set overflowWrap(value) {
    this.style.overflowWrap = value;
  }
  init() {
    if (!this.captionSpan) {
      let childNodes = [];
      for (let i = 0; i < this.childNodes.length; i++) {
        childNodes.push(this.childNodes[i]);
      }
      this.captionSpan = this.createElement("span", this);
      this.classList.add(captionStyle2);
      this.caption = this.getAttribute("caption", true) || "";
      if (childNodes && childNodes.length) {
        for (let i = 0; i < childNodes.length; i++) {
          this.captionSpan.appendChild(childNodes[i]);
        }
      }
      const linkAttr = this.getAttribute("link", true);
      if (linkAttr) {
        const link = new Link(this, {
          ...linkAttr,
          font: this.font
        });
        this.link = link;
      }
      const wordBreak = this.getAttribute("wordBreak", true);
      if (wordBreak)
        this.wordBreak = wordBreak;
      const overflowWrap = this.getAttribute("overflowWrap", true);
      if (overflowWrap)
        this.overflowWrap = overflowWrap;
      super.init();
    }
  }
  static async create(options, parent) {
    let self = new this(parent, options);
    await self.ready();
    return self;
  }
};
Label = __decorateClass([
  customElements2("i-label")
], Label);

// packages/application/src/jsonUI.ts
var import_moment = __toModule(require_moment());
var checkPropertyChange = (value, schema, property) => {
  return validate(value, schema, { changing: property || "property" });
};
var validate = (instance, schema, options) => {
  if (!options)
    options = {};
  var _changing = options.changing;
  function getType(schema2) {
    return schema2.type;
  }
  var errors = [];
  function checkProp(value, schema2, path, i) {
    var l;
    path += path ? typeof i == "number" ? "[" + i + "]" : typeof i == "undefined" ? "" : "." + i : i;
    function addError(message, overwritePath) {
      errors.push({ property: overwritePath || path, message });
    }
    if ((typeof schema2 != "object" || schema2 instanceof Array) && (path || typeof schema2 != "function") && !(schema2 && getType(schema2))) {
      if (typeof schema2 == "function") {
        if (!(value instanceof schema2)) {
          addError("is not an instance of the class/constructor " + schema2.name);
        }
      } else if (schema2) {
        addError("Invalid schema/property definition " + schema2);
      }
      return null;
    }
    if (_changing && schema2.readOnly) {
      addError("is a readonly field, it can not be changed");
    }
    if (schema2["extends"]) {
      checkProp(value, schema2["extends"], path, i);
    }
    function checkType(type, value2) {
      if (type) {
        if (typeof type == "string" && type != "any" && (type == "null" ? value2 !== null : typeof value2 != type) && !(value2 instanceof Array && type == "array") && !(type == "integer" && value2 % 1 === 0)) {
          return [{
            property: path,
            message: value2 + " - " + typeof value2 + " value found, but a " + type + " is required"
          }];
        }
        if (type instanceof Array) {
          let unionErrors = [];
          for (var j2 = 0; j2 < type.length; j2++) {
            if (!(unionErrors = checkType(type[j2], value2)).length) {
              break;
            }
          }
          if (unionErrors.length) {
            return unionErrors;
          }
        } else if (typeof type == "object") {
          var priorErrors = errors;
          errors = [];
          checkProp(value2, type, path);
          var theseErrors = errors;
          errors = priorErrors;
          return theseErrors;
        }
      }
      return [];
    }
    if (value === void 0) {
      if (schema2.required) {
        addError("is missing and it is required");
      }
    } else {
      if (getType(schema2) === "object" && schema2.required instanceof Array) {
        for (let requiredField of schema2.required) {
          if (value[requiredField] === void 0)
            addError(`is missing and it is required`, requiredField);
        }
      }
      errors = errors.concat(checkType(getType(schema2), value));
      if (schema2.disallow && !checkType(schema2.disallow, value).length) {
        addError(" disallowed value was matched");
      }
      if (value !== null) {
        if (value instanceof Array) {
          if (schema2.items) {
            var itemsIsArray = schema2.items instanceof Array;
            var propDef = schema2.items;
            for (i = 0, l = value.length; i < l; i += 1) {
              if (itemsIsArray)
                propDef = schema2.items[i];
              if (options.coerce)
                value[i] = options.coerce(value[i], propDef);
              var errors2 = checkProp(value[i], propDef, path, i);
              if (errors2)
                errors.concat(errors2);
            }
          }
          if (schema2.minItems && value.length < schema2.minItems) {
            addError("There must be a minimum of " + schema2.minItems + " in the array");
          }
          if (schema2.maxItems && value.length > schema2.maxItems) {
            addError("There must be a maximum of " + schema2.maxItems + " in the array");
          }
        } else if (schema2.properties || schema2.additionalProperties) {
          errors.concat(checkObj(value, schema2.properties, path, schema2.additionalProperties));
        }
        if (schema2.pattern && typeof value == "string" && !value.match(schema2.pattern)) {
          addError("does not match the regex pattern " + schema2.pattern);
        }
        if (schema2.maxLength && typeof value == "string" && value.length > schema2.maxLength) {
          addError("may only be " + schema2.maxLength + " characters long");
        }
        if (schema2.minLength && typeof value == "string" && value.length < schema2.minLength) {
          addError("must be at least " + schema2.minLength + " characters long");
        }
        if (typeof schema2.minimum !== "undefined" && typeof value == typeof schema2.minimum && schema2.minimum > value) {
          addError("must have a minimum value of " + schema2.minimum);
        }
        if (typeof schema2.maximum !== "undefined" && typeof value == typeof schema2.maximum && schema2.maximum < value) {
          addError("must have a maximum value of " + schema2.maximum);
        }
        if (schema2["enum"]) {
          var enumer = schema2["enum"];
          l = enumer.length;
          var found;
          for (var j = 0; j < l; j++) {
            if (enumer[j] === value) {
              found = 1;
              break;
            }
          }
          if (!found) {
            addError("does not have a value in the enumeration " + enumer.join(", "));
          }
        }
        if (typeof schema2.maxDecimal == "number" && value.toString().match(new RegExp("\\.[0-9]{" + (schema2.maxDecimal + 1) + ",}"))) {
          addError("may only have " + schema2.maxDecimal + " digits of decimal places");
        }
        if (value !== "") {
          if (schema2.format === "wallet-address") {
            const regex = new RegExp("^((0x[a-fA-F0-9]{40})|([13][a-km-zA-HJ-NP-Z1-9]{25,34})|(X[1-9A-HJ-NP-Za-km-z]{33})|(4[0-9AB][1-9A-HJ-NP-Za-km-z]{93}))$");
            if (!regex.test(value))
              addError("is not a valid wallet address");
          } else if (schema2.format === "cid") {
            const regex = new RegExp("^(Qm[1-9A-HJ-NP-Za-km-z]{44,}|b[A-Za-z2-7]{58,}|B[A-Z2-7]{58,}|z[1-9A-HJ-NP-Za-km-z]{48,}|F[0-9A-F]{50,})$");
            if (!regex.test(value))
              addError("is not a valid cid");
          } else if (schema2.format === "cid-v0") {
            const regex = new RegExp("^(Qm[1-9A-HJ-NP-Za-km-z]{44,})$");
            if (!regex.test(value))
              addError("is not a valid version 0 cid");
          } else if (schema2.format === "cid-v1") {
            const regex = new RegExp("^(b[A-Za-z2-7]{58,}|B[A-Z2-7]{58,}|z[1-9A-HJ-NP-Za-km-z]{48,}|F[0-9A-F]{50,})$");
            if (!regex.test(value))
              addError("is not a valid version 1 cid");
          } else if (schema2.format === "uuid") {
            const regex = new RegExp("^[0-9a-fA-F]{8}\\b-[0-9a-fA-F]{4}\\b-[0-9a-fA-F]{4}\\b-[0-9a-fA-F]{4}\\b-[0-9a-fA-F]{12}$");
            if (!regex.test(value))
              addError("is not a valid uuid");
          }
        }
      }
    }
    return null;
  }
  function checkObj(instance2, objTypeDef, path, additionalProp) {
    if (typeof objTypeDef == "object") {
      if (typeof instance2 != "object" || instance2 instanceof Array) {
        errors.push({ property: path, message: "an object is required" });
      }
      for (var i in objTypeDef) {
        if (objTypeDef.hasOwnProperty(i) && i != "__proto__" && i != "constructor") {
          var value = instance2.hasOwnProperty(i) ? instance2[i] : void 0;
          if (value === void 0 && options.existingOnly)
            continue;
          var propDef = objTypeDef[i];
          if (value === void 0 && propDef["default"]) {
            value = instance2[i] = propDef["default"];
          }
          if (options.coerce && i in instance2) {
            value = instance2[i] = options.coerce(value, propDef);
          }
          checkProp(value, propDef, path, i);
        }
      }
    }
    for (i in instance2) {
      if (instance2.hasOwnProperty(i) && !(i.charAt(0) == "_" && i.charAt(1) == "_") && objTypeDef && !objTypeDef[i] && additionalProp === false) {
        if (options.filter) {
          delete instance2[i];
          continue;
        } else {
          errors.push({
            property: path,
            message: "The property " + i + " is not defined in the schema and the schema does not allow additional properties"
          });
        }
      }
      var requires = objTypeDef && objTypeDef[i] && objTypeDef[i].requires;
      if (requires && !(requires in instance2)) {
        errors.push({
          property: path,
          message: "the presence of the property " + i + " requires that " + requires + " also be present"
        });
      }
      value = instance2[i];
      if (additionalProp && (!(objTypeDef && typeof objTypeDef == "object") || !(i in objTypeDef))) {
        if (options.coerce) {
          value = instance2[i] = options.coerce(value, additionalProp);
        }
        checkProp(value, additionalProp, path, i);
      }
      if (!_changing && value && value.$schema) {
        const errors2 = checkProp(value, value.$schema, path, i);
        if (errors2)
          errors = errors.concat(errors2);
      }
    }
    return errors;
  }
  if (schema) {
    checkProp(instance, schema, "", _changing || "");
  }
  if (!_changing && instance && instance.$schema) {
    checkProp(instance, instance.$schema, "", "");
  }
  return { valid: !errors.length, errors };
};
var mustBeValid = (result) => {
  if (!result.valid) {
    throw new TypeError(result.errors.map(function(error) {
      return "for property " + error.property + ": " + error.message;
    }).join(", \n"));
  }
};
var DataSchemaValidator = {
  checkPropertyChange,
  mustBeValid,
  validate
};
function renderUI(target, jsonSchema, callback, data, options) {
  const controls = {};
  const renderForm = (schema, scope = "#") => {
    if (!schema)
      return void 0;
    const currentField = scope.substr(scope.lastIndexOf("/") + 1);
    const labelName = schema.title || (scope != "#/" ? convertFieldNameToLabel(currentField) : "");
    let groupPnl = new Panel();
    let lbl;
    let controlPnl;
    const columnWidth = options && options.columnWidth ? options.columnWidth : "100px";
    if (schema.enum && schema.enum.length > 0) {
      const items = [];
      for (const item of schema.enum) {
        items.push({ label: item, value: item });
      }
      groupPnl = new Panel();
      lbl = new Label(groupPnl, { caption: labelName });
      controlPnl = new Panel(groupPnl);
      controls[scope] = new ComboBox(controlPnl, {
        width: "100%",
        items,
        icon: { name: "caret-down" }
      });
      return groupPnl;
    } else if (schema.oneOf && schema.oneOf.length > 0) {
      const items = [];
      for (const item of schema.oneOf) {
        items.push({ label: item.title, value: item.const });
      }
      groupPnl = new Panel();
      lbl = new Label(groupPnl, { caption: labelName });
      controlPnl = new Panel(groupPnl);
      controls[scope] = new ComboBox(controlPnl, {
        width: columnWidth,
        items,
        icon: { name: "caret-down" }
      });
      return groupPnl;
    } else if (schema.type === "string") {
      if (schema.format === "date") {
        groupPnl = new Panel();
        lbl = new Label(groupPnl, { caption: labelName });
        controlPnl = new Panel(groupPnl);
        controls[scope] = new Datepicker(controlPnl, {
          width: columnWidth
        });
        return groupPnl;
      } else if (schema.format === "time") {
        groupPnl = new Panel();
        lbl = new Label(groupPnl, { caption: labelName });
        controlPnl = new Panel(groupPnl);
        const timePicker = new Datepicker(controlPnl, {
          width: columnWidth
        });
        timePicker.dateTimeFormat = "HH:mm:ss";
        controls[scope] = timePicker;
        return groupPnl;
      } else if (schema.format === "date-time") {
        groupPnl = new Panel();
        lbl = new Label(groupPnl, { caption: labelName });
        controlPnl = new Panel(groupPnl);
        const dateTimePicker = new Datepicker(controlPnl, {
          width: columnWidth
        });
        dateTimePicker.dateTimeFormat = "YYYY-MM-DD HH:mm:ss";
        controls[scope] = dateTimePicker;
        return groupPnl;
      } else if (schema.format === "color") {
        groupPnl = new Panel();
        lbl = new Label(groupPnl, { caption: labelName });
        controlPnl = new Panel(groupPnl);
        controls[scope] = new Input(controlPnl, {
          inputType: "color"
        });
        return groupPnl;
      } else {
        groupPnl = new Panel();
        lbl = new Label(groupPnl, { caption: labelName });
        controlPnl = new Panel(groupPnl);
        controls[scope] = new Input(controlPnl, {
          width: columnWidth,
          inputType: "text"
        });
        return groupPnl;
      }
    } else if (schema.type === "number") {
      groupPnl = new Panel();
      lbl = new Label(groupPnl, { caption: labelName });
      controlPnl = new Panel(groupPnl);
      controls[scope] = new Input(controlPnl, {
        width: columnWidth,
        inputType: "number"
      });
      return groupPnl;
    } else if (schema.type === "integer") {
      groupPnl = new Panel();
      lbl = new Label(groupPnl, { caption: labelName });
      controlPnl = new Panel(groupPnl);
      controls[scope] = new Input(controlPnl, {
        width: columnWidth,
        inputType: "number"
      });
      return groupPnl;
    } else if (schema.type === "boolean") {
      groupPnl = new Panel();
      lbl = new Label(groupPnl, { caption: labelName });
      controlPnl = new Panel(groupPnl);
      controls[scope] = new Checkbox(controlPnl);
      return groupPnl;
    } else if (schema.type === "object") {
      const properties = schema.properties;
      if (!properties)
        return void 0;
      const borderStyle = scope === "#" ? void 0 : {
        border: {
          width: 1,
          style: "solid",
          color: "#CCC",
          radius: 5
        }
      };
      const box = new Panel(void 0, borderStyle);
      const templateColumns = [];
      if (options && options.columnsPerRow)
        for (let i = 0; i < options.columnsPerRow; i++)
          templateColumns.push("1fr");
      let form2 = new GridLayout(void 0, {
        templateColumns,
        gap: {
          row: 10,
          column: 10
        },
        padding: {
          top: 5,
          bottom: 5,
          left: 10,
          right: 10
        }
      });
      if (scope !== "#") {
        const pnl = new Panel(box, {
          padding: {
            top: 5,
            bottom: 5,
            left: 10,
            right: 10
          },
          border: {
            bottom: {
              width: 1,
              style: "solid",
              color: "#CCC",
              radius: 5
            }
          }
        });
        const label = new Label(pnl, { caption: labelName });
      }
      for (const propertyName in properties) {
        const currentSchema = properties[propertyName];
        const control = renderForm(currentSchema, `${scope}/properties/${propertyName}`);
        form2.append(control);
      }
      box.append(form2);
      controls[scope] = box;
      return box;
    } else if (schema.type === "array") {
      return void 0;
    } else if (schema.type === "null") {
      return void 0;
    } else if (schema.type === "any") {
      return void 0;
    } else
      return void 0;
  };
  const setData = (schema, data2, scope = "#") => {
    if (!schema || !data2)
      return;
    if (schema.type === "object") {
      if (!schema.properties)
        return;
      for (const propertyName in schema.properties) {
        setData(schema.properties[propertyName], data2[propertyName], `${scope}/properties/${propertyName}`);
      }
    } else {
      const control = controls[scope];
      if (control.tagName === "I-CHECKBOX")
        control.checked = data2;
      else if (control.tagName === "I-DATEPICKER")
        control.value = (0, import_moment.default)(data2);
      else if (control.tagName === "I-COMBO-BOX") {
        control.selectedItem = control.items.find((v) => v.value === data2) || void 0;
      } else
        control.value = data2;
    }
  };
  const getData = (schema, scope = "#") => {
    var _a;
    if (!schema)
      return null;
    if (schema.type === "object") {
      const properties = schema.properties;
      if (!properties)
        return void 0;
      const data2 = {};
      for (const propertyName in properties) {
        data2[propertyName] = getData(properties[propertyName], `${scope}/properties/${propertyName}`);
      }
      return data2;
    } else {
      const control = controls[scope];
      if (!control)
        return void 0;
      if (control.tagName === "I-CHECKBOX")
        return control.checked;
      else if (control.tagName === "I-COMBO-BOX") {
        return (_a = control.value) == null ? void 0 : _a.value;
      } else if (control.tagName === "I-DATEPICKER") {
        const value = control.value;
        if (value === void 0)
          return void 0;
        if (schema.format === "date")
          return value.format("YYYY-MM-DD");
        else if (schema.format === "time")
          return value.format("HH:mm:ss");
        else if (schema.format === "date-time")
          return value.format("YYYY-MM-DD HH:mm:ss");
      } else if (control.tagName === "I-INPUT") {
        if (schema.type === "string")
          return control.value;
        else if (schema.type === "integer") {
          const value = parseInt(control.value);
          return isNaN(value) ? void 0 : value;
        } else if (schema.type === "number") {
          const value = parseFloat(control.value);
          return isNaN(value) ? void 0 : value;
        } else
          return control.value;
      }
      if (!control)
        return void 0;
      return control.value;
    }
  };
  const panel = new Panel();
  const form = renderForm(jsonSchema);
  panel.append(form);
  const pnlButton = new HStack();
  const confirmButtonCaption = options && options.confirmButtonCaption ? options.confirmButtonCaption : "Confirm";
  const buttonStack = new HStack(void 0, {
    justifyContent: "end",
    alignItems: "center",
    width: "100%",
    padding: {
      left: 5,
      right: 5,
      top: 5,
      bottom: 5
    }
  });
  if (options && options.showClearButton) {
    const clearButtonCaption = options && options.clearButtonCaption ? options.clearButtonCaption : "Clear";
    const btnClear = new Button(buttonStack, {
      caption: clearButtonCaption,
      padding: {
        top: 5,
        bottom: 5,
        left: 5,
        right: 5
      },
      margin: {
        right: 5
      },
      font: {
        color: options && options.clearButtonFontColor ? options.clearButtonFontColor : "#FFF"
      },
      background: {
        color: options && options.clearButtonBackgroundColor ? options.clearButtonBackgroundColor : "#3F51B5"
      }
    });
    btnClear.onClick = () => {
      for (const scope in controls) {
        const control = controls[scope];
        if (control.tagName === "I-COMBO-BOX")
          control.clear();
        else if (control.tagName === "I-CHECKBOX")
          control.checked = false;
        else
          control.value = void 0;
      }
    };
  }
  const btnConfirm = new Button(buttonStack, {
    caption: confirmButtonCaption,
    padding: {
      top: 5,
      bottom: 5,
      left: 5,
      right: 5
    },
    font: {
      color: options && options.confirmButtonFontColor ? options.confirmButtonFontColor : "#FFF"
    },
    background: {
      color: options && options.confirmButtonBackgroundColor ? options.confirmButtonBackgroundColor : "#3F51B5"
    }
  });
  btnConfirm.onClick = () => {
    if (!callback)
      return;
    const data2 = getData(jsonSchema);
    const validationResult = validate(data2, jsonSchema, { changing: false });
    if (validationResult == null ? void 0 : validationResult.valid)
      callback(true, data2);
    else
      callback(false, validationResult);
  };
  panel.append(pnlButton);
  if (target) {
    target.append(panel);
    target.append(buttonStack);
    if (data) {
      const validationResult = validate(data, jsonSchema, { changing: false });
      if (validationResult == null ? void 0 : validationResult.valid)
        setData(jsonSchema, data);
      else
        console.log(validationResult);
    }
  }
}
function convertFieldNameToLabel(name) {
  let label = "";
  for (let i = 0; i < name.length; i++) {
    let char = name[i];
    if (i == 0) {
      label += char.toUpperCase();
      continue;
    }
    if (char == char.toUpperCase())
      label += ` ${char}`;
    else
      label += char;
  }
  return label;
}

// packages/application/src/index.ts
var IpfsDataType;
(function(IpfsDataType2) {
  IpfsDataType2[IpfsDataType2["Raw"] = 0] = "Raw";
  IpfsDataType2[IpfsDataType2["Directory"] = 1] = "Directory";
  IpfsDataType2[IpfsDataType2["File"] = 2] = "File";
  IpfsDataType2[IpfsDataType2["Metadata"] = 3] = "Metadata";
  IpfsDataType2[IpfsDataType2["Symlink"] = 4] = "Symlink";
  IpfsDataType2[IpfsDataType2["HAMTShard"] = 5] = "HAMTShard";
})(IpfsDataType || (IpfsDataType = {}));
var Application = class {
  constructor() {
    this.modules = {};
    this.modulesId = {};
    this.scripts = {};
    this.id = 0;
    this.LibHost = "";
    this.packages = {};
    this.globalEvents = new GlobalEvents();
  }
  get EventBus() {
    return EventBus.getInstance();
  }
  static get Instance() {
    return this._instance || (this._instance = new this());
  }
  assets(name) {
    if (this._assets) {
      let items = name.split("/");
      let value = this._assets;
      let item = items.shift();
      ;
      while (value && item) {
        value = value[item];
        item = items.shift();
      }
      ;
      return value;
    }
    ;
  }
  async verifyScript(modulePath, script) {
    console.dir("verifyScript: " + modulePath);
    try {
      let cid = hashContent(script);
      console.dir(cid);
    } catch (err) {
      console.dir(err);
    }
    return true;
  }
  async getScript(modulePath) {
    if (this.scripts[modulePath])
      return this.scripts[modulePath];
    try {
      let result = await (await fetch(modulePath)).text();
      if (typeof result == "string") {
        if (await this.verifyScript(modulePath, result)) {
          this.scripts[modulePath] = result;
          return result;
        }
        ;
      }
      ;
    } catch (err) {
    }
    ;
    return "";
  }
  async loadScript(modulePath, script) {
    try {
      if (this.scripts[modulePath])
        return true;
      if (await this.verifyScript(modulePath, script)) {
        this.scripts[modulePath] = script;
        return true;
      }
      ;
    } catch (err) {
    }
    ;
    return false;
  }
  async getContent(modulePath) {
    try {
      return await (await fetch(modulePath)).text();
    } catch (err) {
    }
    return "";
  }
  async fetchDirectoryInfoByCID(ipfsCid) {
    let directoryInfo = [];
    try {
      const IPFS_API = `https://ipfs.scom.dev/ipfs/${ipfsCid}`;
      let result = await fetch(IPFS_API);
      let jsonContent = await result.json();
      if (jsonContent.links) {
        directoryInfo = jsonContent.links;
      }
    } catch (err) {
      console.log(err);
    }
    return directoryInfo;
  }
  async getModule(modulePath, options) {
    if (this.modules[modulePath])
      return this.modules[modulePath];
    let result = await this.newModule(modulePath, options);
    if (result)
      this.modules[modulePath] = result;
    return result;
  }
  async loadPackage(packageName, modulePath, options) {
    var _a, _b, _c;
    options = options || this._initOptions;
    if (options && options.modules && options.modules[packageName]) {
      let pack = options.modules[packageName];
      for (let i = 0; i < ((_a = pack.dependencies) == null ? void 0 : _a.length); i++) {
        let n = pack.dependencies[i];
        if (!RequireJS.defined(n))
          await this.loadPackage(n);
      }
      ;
    }
    ;
    if (!modulePath) {
      if ((_b = options == null ? void 0 : options.modules) == null ? void 0 : _b[packageName])
        modulePath = ((options == null ? void 0 : options.rootDir) ? options.rootDir + "/" : "") + "modules/" + ((_c = options == null ? void 0 : options.modules) == null ? void 0 : _c[packageName].path) + "/index.js";
      else
        return null;
    } else if (modulePath == "*") {
      modulePath = ((options == null ? void 0 : options.rootDir) ? options.rootDir + "/" : "") + "libs/" + packageName + "/index.js";
    } else if (modulePath.startsWith("{LIB}/")) {
      let libPath = LibPath || "";
      if (LibPath && !LibPath.endsWith("/"))
        libPath = libPath + "/";
      modulePath = modulePath.replace("{LIB}/", libPath);
    }
    if (this.packages[modulePath])
      return this.packages[modulePath];
    let script = await this.getScript(modulePath);
    if (script) {
      _currentDefineModule = null;
      this.currentModulePath = modulePath;
      if (modulePath.indexOf("://") > 0)
        this.currentModuleDir = modulePath.split("/").slice(0, -1).join("/");
      else
        this.currentModuleDir = application.LibHost + modulePath.split("/").slice(0, -1).join("/");
      await import(`data:text/javascript,${encodeURIComponent(script)}`);
      this.currentModulePath = "";
      this.currentModuleDir = "";
      let m = window["require"](packageName);
      if (m) {
        this.packages[modulePath] = m.default || m;
        return m.default || m;
      }
    }
    ;
    return null;
  }
  async loadModule(modulePath, options) {
    let module2 = await this.newModule(modulePath, options);
    if (module2)
      document.body.append(module2);
    return module2;
  }
  getModulePath(module2) {
    let options = this._initOptions;
    let modulePath = module2;
    if (options && options.modules && options.modules[module2] && options.modules[module2].path) {
      modulePath = "";
      if (options.rootDir)
        modulePath += options.rootDir + "/";
      if (options.moduleDir)
        modulePath += options.moduleDir + "/";
      modulePath += options.modules[module2].path;
      if (!modulePath.endsWith(".js"))
        modulePath += "/index.js";
    } else if (options.dependencies && options.dependencies[module2])
      modulePath = `${(options == null ? void 0 : options.rootDir) ? options.rootDir + "/" : ""}libs/${module2}/index.js`;
    return modulePath;
  }
  async newModule(module2, options) {
    if (options) {
      this._initOptions = options;
      if (!this._assets && this._initOptions.assets)
        this._assets = await this.loadPackage(this._initOptions.assets) || {};
      if (this._initOptions.dependencies) {
        for (let p in this._initOptions.dependencies) {
          if (p != this._initOptions.main)
            await this.loadPackage(p, this._initOptions.dependencies[p]);
        }
        ;
      }
      ;
    }
    ;
    let modulePath = module2;
    if (this._initOptions)
      modulePath = this.getModulePath(module2);
    let elmId = this.modulesId[modulePath];
    if (elmId && modulePath) {
      return document.createElement(elmId);
    }
    let script;
    if (options && options.script)
      script = options.script;
    else {
      if (this._initOptions && this._initOptions.modules && this._initOptions.modules[module2] && this._initOptions.modules[module2].dependencies) {
        let dependencies = this._initOptions.modules[module2].dependencies;
        for (let i = 0; i < dependencies.length; i++) {
          let dep = dependencies[i];
          let path = this.getModulePath(dep);
          if (!this.packages[path]) {
            await this.loadPackage(dep, path);
          }
          ;
        }
        ;
      }
      ;
      script = await this.getScript(modulePath);
    }
    ;
    if (script) {
      _currentDefineModule = null;
      this.currentModulePath = modulePath;
      if (modulePath.indexOf("://") > 0)
        this.currentModuleDir = modulePath.split("/").slice(0, -1).join("/");
      else
        this.currentModuleDir = application.LibHost + modulePath.split("/").slice(0, -1).join("/");
      await import(`data:text/javascript,${encodeURIComponent(script)}`);
      document.getElementsByTagName("html")[0].classList.add(applicationStyle);
      this.currentModulePath = "";
      this.currentModuleDir = "";
      if (!_currentDefineModule && this.packages[modulePath]) {
        _currentDefineModule = this.packages[modulePath];
      }
      if (_currentDefineModule) {
        let module3 = _currentDefineModule.default || _currentDefineModule;
        if (module3) {
          this.id++;
          elmId = `i-module--${this.id}`;
          this.modulesId[modulePath] = elmId;
          let Module2 = class extends module3 {
          };
          customElements.define(elmId, Module2);
          let result = new Module2(null, options);
          return result;
        }
        ;
      }
    }
    return null;
  }
  async copyToClipboard(value) {
    if (!value)
      return false;
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(value);
        return true;
      } else {
        const input = document.createElement("input");
        input.value = value;
        input.style.position = "fixed";
        input.style.opacity = "0";
        document.body.appendChild(input);
        input.focus();
        input.select();
        const result = document.execCommand("copy");
        document.body.removeChild(input);
        return result;
      }
    } catch (err) {
      console.log("debug: copy", err);
      return false;
    }
  }
  xssSanitize(value) {
    return value;
  }
};
window["application"] = Application.Instance;
var application = Application.Instance;

// packages/code-editor/src/monaco.ts
async function addFile(fileName, content) {
  let monaco = await initMonaco();
  if (monaco) {
    let model = await getFileModel(fileName);
    if (!model) {
      if ((fileName == null ? void 0 : fileName.endsWith(".tsx")) || (fileName == null ? void 0 : fileName.endsWith(".ts")))
        model = monaco.editor.createModel(content || "", "typescript", monaco.Uri.file(fileName));
      else
        model = monaco.editor.createModel(content || "");
    }
    return model;
  }
  ;
  return null;
}
async function updateFile(fileName, content) {
  let monaco = await initMonaco();
  if (monaco) {
    let model = await getFileModel(fileName);
    if (model) {
      model.setValue(content);
    }
    return model;
  }
  ;
  return null;
}
async function getFileModel(fileName) {
  let monaco = await initMonaco();
  if (monaco) {
    let models = monaco.editor.getModels();
    for (let i = 0; i < models.length; i++) {
      let model = models[i];
      if (model.uri.path == fileName || model.uri.path == "/" + fileName)
        return model;
    }
    ;
  }
  ;
  return null;
}
async function addLib(lib, dts) {
  let monaco = await initMonaco();
  monaco.languages.typescript.typescriptDefaults.addExtraLib(dts, lib);
}
async function initMonaco() {
  if (window.monaco)
    return window.monaco;
  return new Promise((resolve) => {
    window.MonacoEnvironment = {};
    RequireJS.config({ paths: { "vs": `${LibPath}lib/monaco-editor/0.32.1/min/vs` } });
    RequireJS.require([`vs/editor/editor.main`], (monaco) => {
      resolve(monaco);
      if (monaco.$loaded)
        return;
      monaco.$loaded = true;
      monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
        experimentalDecorators: true,
        allowSyntheticDefaultImports: true,
        jsx: monaco.languages.typescript.JsxEmit.Preserve,
        moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
        allowNonTsExtensions: true,
        target: monaco.languages.typescript.ScriptTarget.ES2020
      });
      monaco.languages.typescript.typescriptDefaults.setEagerModelSync(true);
      monaco.languages.registerCompletionItemProvider("typescript", {
        triggerCharacters: [">"],
        provideCompletionItems: (model, position) => {
          const code = model.getValueInRange({
            startLineNumber: position.lineNumber,
            startColumn: 1,
            endLineNumber: position.lineNumber,
            endColumn: position.column
          });
          const tag = code.slice(code.lastIndexOf("<") + 1, code.length);
          if (!tag || !tag.endsWith(">") || tag.startsWith("/") || tag.indexOf(" ") > 0)
            return;
          const word = model.getWordUntilPosition(position);
          return {
            suggestions: [
              {
                label: `</${tag}`,
                kind: monaco.languages.CompletionItemKind.EnumMember,
                insertText: `$1</${tag}`,
                insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                range: {
                  startLineNumber: position.lineNumber,
                  endLineNumber: position.lineNumber,
                  startColumn: word.startColumn,
                  endColumn: word.endColumn
                }
              }
            ]
          };
        }
      });
    });
  });
}

// packages/code-editor/src/style/code-editor.css.ts
cssRule("i-code-editor", {
  $nest: {
    "*": {
      boxSizing: "border-box"
    },
    ".full-height": {
      height: "100vh"
    },
    ".half-width": {
      width: "50%"
    },
    ".column": {
      display: "flex",
      flexDirection: "column",
      alignItems: "stretch"
    },
    ".row": {
      display: "flex",
      flexDirection: "row"
    },
    ".align-right": {
      marginLeft: "auto",
      alignSelf: "stretch"
    },
    "#flex-wrapper": {
      display: "flex",
      alignItems: "stretch"
    },
    "#operation-editor": {
      height: "60vh",
      minHeight: "260px"
    },
    "#variables-editor": {
      height: "30vh",
      alignItems: "stretch"
    },
    "#results-editor": {
      height: "90vh",
      alignItems: "stretch"
    },
    "#toolbar": {
      minHeight: "40px",
      backgroundColor: "#1e1e1e",
      display: "inline-flex",
      alignItems: "stretch"
    },
    "#toolbar > button, #toolbar > select, #toolbar > span, button#execute-op": {
      margin: "4px",
      padding: "4px"
    },
    "#toolbar button, #toolbar select": {
      backgroundColor: "#1e1e1e",
      color: "#eee",
      border: "1px solid #eee",
      borderRadius: "4px"
    },
    "#toolbar button:hover, select:hover, button:focus, select:focus": {
      backgroundColor: "darkslategrey"
    },
    "#execution-tray": {
      display: "inline-flex",
      alignItems: "baseline"
    },
    "#schema-status": {
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      color: "#eee"
    },
    "#toolbar button.reload-button": {
      border: "0 none",
      padding: "4px",
      width: "30px",
      textAlign: "center"
    }
  }
});

// packages/code-editor/src/code-editor.ts
var CodeEditor = class extends Control {
  get monaco() {
    return window.monaco;
  }
  init() {
    if (!this.editor) {
      super.init();
      this.language = this.getAttribute("language", true);
      this.style.display = "inline-block";
      if (this.language)
        this.loadContent(void 0, this.language);
    }
    ;
  }
  get editor() {
    return this._editor;
  }
  get language() {
    return this._language;
  }
  set language(value) {
    this._language = value;
    if (!this.editor) {
      this.loadContent();
    } else {
      let monaco = this.monaco;
      let model = this.editor.getModel();
      if (model) {
        monaco.editor.setModelLanguage(model, value);
      }
    }
  }
  async loadContent(content, language, fileName) {
    let monaco = await initMonaco();
    if (content == void 0)
      content = content || this._value || "";
    this._value = content;
    language = language || this._language || "typescript";
    this._language = language;
    if (!this._editor) {
      let captionDiv = this.createElement("div", this);
      captionDiv.style.display = "inline-block";
      captionDiv.style.height = "100%";
      captionDiv.style.width = "100%";
      const customOptions = this._options || {};
      let options = {
        theme: "vs-dark",
        tabSize: 2,
        formatOnPaste: true,
        formatOnType: true,
        renderWhitespace: "none",
        automaticLayout: true,
        minimap: {
          enabled: false
        },
        ...customOptions
      };
      this._editor = monaco.editor.create(captionDiv, options);
      this._editor.onDidChangeModelContent((event) => {
        if (typeof this.onChange === "function")
          this.onChange(this, event);
      });
      if (fileName) {
        let model = await getFileModel(fileName);
        if (model) {
          this._editor.setModel(model);
          model.setValue(content);
          return;
        }
      }
      ;
      if (language == "typescript" || (fileName == null ? void 0 : fileName.endsWith(".tsx")) || (fileName == null ? void 0 : fileName.endsWith(".ts"))) {
        let model = monaco.editor.createModel(content || this._value || "", "typescript", fileName ? monaco.Uri.file(fileName) : void 0);
        this._editor.setModel(model);
      } else {
        let model = monaco.editor.createModel(content || this._value || "", language || this._language, fileName ? monaco.Uri.file(fileName) : void 0);
        this._editor.setModel(model);
      }
      ;
    } else {
      let model = this._editor.getModel();
      if (language == "typescript" && model && fileName && this._fileName != fileName) {
        if (!this._fileName)
          model.dispose();
        model = await getFileModel(fileName);
        if (!model)
          model = monaco.editor.createModel(content || this._value || "", "typescript", monaco.Uri.file(fileName));
        this._editor.setModel(model);
      } else {
        this._editor.setValue(content);
        if (language && model)
          monaco.editor.setModelLanguage(model, language);
      }
      ;
    }
    ;
    this._fileName = fileName || "";
    this._editor.setScrollTop(0);
  }
  async loadFile(fileName) {
    var _a;
    let model = await getFileModel(fileName);
    if (model) {
      if (!this._fileName)
        (_a = this._editor.getModel()) == null ? void 0 : _a.dispose();
      this._fileName = fileName;
      this._editor.setModel(model);
    }
    ;
  }
  updateOptions(options) {
    this._options = options;
    if (this._editor)
      this._editor.updateOptions(options);
  }
  get value() {
    if (this._editor)
      return this._editor.getValue();
    else
      return this._value;
  }
  set value(value) {
    this._value = value;
    if (this._editor) {
      this._editor.setValue(value);
      this._editor.setScrollTop(0);
    } else
      this.loadContent();
  }
};
CodeEditor.addLib = addLib;
CodeEditor.addFile = addFile;
CodeEditor.getFileModel = getFileModel;
CodeEditor.updateFile = updateFile;
CodeEditor = __decorateClass([
  customElements2("i-code-editor")
], CodeEditor);

// packages/code-editor/src/diff-editor.ts
var EditorType;
(function(EditorType2) {
  EditorType2[EditorType2["modified"] = 0] = "modified";
  EditorType2[EditorType2["original"] = 1] = "original";
})(EditorType || (EditorType = {}));
var CodeDiffEditor = class extends Control {
  init() {
    if (!this.editor) {
      super.init();
      this.language = this.getAttribute("language", true);
      this.style.display = "inline-block";
    }
    ;
  }
  get editor() {
    return this._editor;
  }
  get language() {
    return this._language;
  }
  set language(value) {
    this._language = value;
    if (!this.editor) {
      if (this.language) {
        this.loadContent(1, "", this.language);
        this.loadContent(0, "", this.language);
      }
    } else {
      this.setModelLanguage(value, "getOriginalEditor");
      this.setModelLanguage(value, "getModifiedEditor");
    }
  }
  setModelLanguage(value, functionName) {
    let monaco = window.monaco;
    let model = this.editor[functionName]().getModel();
    if (model) {
      monaco.editor.setModelLanguage(model, value);
    }
  }
  getEditor(type) {
    if (type === 1)
      return this.editor.getOriginalEditor();
    else
      return this.editor.getModifiedEditor();
  }
  getModel(type) {
    return this.getEditor(type).getModel();
  }
  async loadContent(type, content, language, fileName) {
    let monaco = await initMonaco();
    const value = type === 0 ? this._modifiedValue : this._originalValue;
    if (content == void 0)
      content = content || value || "";
    type === 0 ? this._modifiedValue = content : this._originalValue = content;
    language = language || this._language || "typescript";
    this._language = language;
    if (!this._editor) {
      let captionDiv = this.createElement("div", this);
      captionDiv.style.display = "inline-block";
      captionDiv.style.height = "100%";
      captionDiv.style.width = "100%";
      let options = {
        theme: "vs-dark",
        originalEditable: false,
        automaticLayout: true
      };
      this._editor = monaco.editor.createDiffEditor(captionDiv, options);
      this._editor.onDidUpdateDiff(() => {
        if (typeof this.onChange === "function")
          this.onChange(this);
      });
    }
    if (!this._modifiedModel || !this._originalModel) {
      let model;
      if (fileName == null ? void 0 : fileName.endsWith(".tsx")) {
        model = monaco.editor.createModel(content || value || "", "typescript");
      } else
        model = monaco.editor.createModel(content || value || "", language || this._language || "typescript");
      type === 0 ? this._modifiedModel = model : this._originalModel = model;
      if (this._originalModel && this._modifiedModel) {
        this._editor.setModel({
          original: this._originalModel,
          modified: this._modifiedModel
        });
      }
    } else {
      let model = this.getModel(type);
      if (model)
        monaco.editor.setModelLanguage(model, language);
      this.getEditor(type).setValue(content);
    }
  }
  updateOptions(options) {
    this.editor.updateOptions(options);
  }
  get originalValue() {
    if (this.editor)
      return this.editor.getOriginalEditor().getValue();
    else
      return this._originalValue;
  }
  set originalValue(value) {
    this._originalValue = value;
    if (this.editor) {
      this.editor.getOriginalEditor().setValue(value);
    } else
      this.loadContent(1);
  }
  get modifiedValue() {
    if (this.editor)
      return this.editor.getModifiedEditor().getValue();
    else
      return this._modifiedValue;
  }
  set modifiedValue(value) {
    this._modifiedValue = value;
    if (this.editor) {
      this.editor.getModifiedEditor().setValue(value);
    } else {
      this.loadContent(0);
    }
  }
};
CodeDiffEditor.addLib = addLib;
CodeDiffEditor.addFile = addFile;
CodeDiffEditor.getFileModel = getFileModel;
CodeDiffEditor.updateFile = updateFile;
CodeDiffEditor = __decorateClass([
  customElements2("i-code-diff-editor")
], CodeDiffEditor);

// packages/data-grid/src/style/dataGrid.css.ts
var Theme13 = theme_exports.ThemeVars;
cssRule("i-data-grid", {
  border: "0.5px solid #dadada",
  $nest: {
    ".scrollBox": {
      overflow: "auto",
      position: "absolute",
      height: "100%",
      width: "100%",
      top: 0,
      zIndex: 4
    },
    ".grid": {
      position: "absolute",
      fontSize: "12px",
      fontFamily: '"Segoe UI", Tahoma, Arial, Helvetica, sans-serif',
      color: "#5A5757",
      borderSpacing: 0,
      tableLayout: "fixed",
      backgroundColor: "white"
    },
    ".grid tr": {
      overflow: "hidden"
    },
    ".grid tr div": {
      paddingLeft: "2px",
      paddingRight: "2px"
    },
    ".grid_cell_hidden": {
      display: "none"
    },
    ".grid_fixed_cell": {
      background: "#F9F9F9",
      borderBottom: "0.5px solid #dadada",
      borderRight: "0.5px solid #dadada",
      boxSizing: "border-box"
    },
    ".grid_curr_cell": {
      border: "2px solid #5f5f5f",
      boxSizing: "border-box"
    },
    ".grid_selected_cell": {
      backgroundColor: "rgb(160, 195, 255)",
      pointerEvents: "none",
      opacity: 0.2
    },
    ".grid_cell": {
      borderBottom: "0.5px solid #dadada",
      borderRight: "0.5px solid #dadada",
      boxSizing: "border-box",
      background: "white",
      cursor: "default"
    },
    ".grid_cell_value": {
      textOverflow: "ellipsis",
      wordWrap: "break-word",
      whiteSpace: "pre"
    },
    ".grid_cell_value.image img": {
      maxHeight: "100%",
      maxWidth: "100%"
    },
    ".grid_header_splitter": {
      position: "relative",
      zoom: 1,
      filter: "alpha(opacity=50)",
      opacity: 0.5,
      float: "right",
      cursor: "e-resize"
    },
    "input": {
      border: "none",
      outline: "none"
    },
    "table": {
      marginLeft: "1px",
      marginTop: "1px"
    }
  }
});

// packages/data-grid/src/dataGrid.ts
function parseNumber(value, decimal) {
  if (typeof value == "string")
    value = value.replace(/,/g, "");
  if (decimal)
    return parseFloat(parseFloat(value).toFixed(decimal));
  else
    return parseFloat(value);
}
function getCursorPosX(event) {
  event = event || window.event;
  let pos = 0;
  if (event instanceof TouchEvent) {
    if (event.changedTouches && event.changedTouches[0])
      pos = event.changedTouches[0].pageX || event.changedTouches[0].clientX;
    else if (event.touches && event.touches[0])
      pos = event.touches[0].pageX || event.touches[0].clientX;
  } else
    pos = event.pageX || event.clientX;
  return pos + document.body.scrollLeft + document.documentElement.scrollLeft;
}
function getCursorPosY(event) {
  event = event || window.event;
  let pos = 0;
  if (event instanceof TouchEvent) {
    if (event.changedTouches && event.changedTouches[0])
      pos = event.changedTouches[0].pageY || event.changedTouches[0].clientY;
    else if (event.touches && event.touches[0])
      pos = event.touches[0].pageY || event.touches[0].clientY;
  } else
    pos = event.pageY || event.clientY;
  return pos + document.body.scrollTop + document.documentElement.scrollTop;
}
var TGridOptions = class {
  constructor(owner) {
    this._autoRowHeight = false;
    this._rowSelect = false;
    this.autoAddRow = false;
    this.fileDropUpload = false;
    this.sortOnClick = true;
    this.owner = owner;
  }
  get autoRowHeight() {
    return this._autoRowHeight;
  }
  set autoRowHeight(value) {
    if (value != this._autoRowHeight) {
      this.owner.rowHeights = [];
      this._autoRowHeight = value;
      this.owner.enableUpdateTimer();
    }
    ;
  }
  get rowSelect() {
    return this._rowSelect;
  }
  set rowSelect(value) {
    if (this._rowSelect != value) {
      this._rowSelect = value;
      this.owner.enableUpdateTimer();
    }
    ;
  }
};
var TGridCell = class {
  constructor(grid, col, row) {
    this._visible = true;
    this.grid = grid;
    this._col = col;
    this._row = row;
  }
  get button() {
    return this._button;
  }
  set button(value) {
    this._button = value;
    this.grid.enableUpdateTimer();
  }
  get checkBox() {
    return this._checkBox;
  }
  set checkBox(value) {
    this._checkBox = value;
    this.grid.enableUpdateTimer();
  }
  get col() {
    return this._col;
  }
  set col(value) {
    this._col = value;
  }
  get color() {
    return this._color;
  }
  set color(value) {
    this._color = value;
    this.grid.enableUpdateTimer();
  }
  get dataType() {
    return this._dataType;
  }
  set dataType(value) {
    this._dataType = value;
    this.grid.enableUpdateTimer();
  }
  get displayValue() {
    return;
  }
  get formula() {
    return this._formula;
  }
  set formula(value) {
    this._formula = value;
    this.grid.enableUpdateTimer();
  }
  get hint() {
    return this._hint;
  }
  set hint(value) {
    this._hint = value;
    this.grid.enableUpdateTimer();
  }
  get horizontalAlign() {
    return this._horizontalAlign;
  }
  set horizontalAlign(value) {
    this._horizontalAlign = value;
    this.grid.enableUpdateTimer();
  }
  get html() {
    return this._html;
  }
  set html(value) {
    this._html = value;
    this.grid.enableUpdateTimer();
  }
  get image() {
    return this._image;
  }
  set image(value) {
    this._image = value;
    this.grid.enableUpdateTimer();
  }
  get object() {
    return this._object;
  }
  set object(value) {
    this._object = value;
    this.grid.enableUpdateTimer();
  }
  get readOnly() {
    return this._readOnly;
  }
  set readOnly(value) {
    this._readOnly = value;
    this.grid.enableUpdateTimer();
  }
  get row() {
    return this._row;
  }
  set row(value) {
    this._row = value;
  }
  get text() {
    return this._text;
  }
  set text(value) {
    this._text = value;
    this.grid.enableUpdateTimer();
  }
  get value() {
    return this._value;
  }
  set value(value) {
    this._value = value;
    this.grid.enableUpdateTimer();
  }
  get visible() {
    return this._visible;
  }
  set visible(value) {
    this._visible = value;
    this.grid.enableUpdateTimer();
  }
};
var TGridCells = class {
  constructor(owner) {
    this.data = [[]];
    this.grid = owner;
  }
  assign(data) {
    for (let r = 0; r < data.length; r++) {
      let d = data[r]["data"];
      let row = data[r]["row"];
      for (let c = 0; c < d.length; c++) {
        this.setValue(c, row, d[c]);
      }
    }
  }
  cells(aCol, aRow, refresh2) {
    if (refresh2)
      return this.getCell(aCol, aRow);
    else if (this.data[aRow]) {
      let cell = this.data[aRow][aCol];
      if (cell && cell.mergeRect && (aCol != cell.mergeRect.startCol || aRow != cell.mergeRect.startRow)) {
        cell = this.data[cell.mergeRect.startRow][cell.mergeRect.startCol];
      }
      return cell || this.getCell(aCol, aRow);
    } else
      return this.getCell(aCol, aRow);
  }
  clear() {
    this.data = [[]];
  }
  deleteCol(aCol) {
    for (let r = 0; r < this.data.length; r++) {
      let row = this.data[r];
      if (row)
        row.splice(aCol, 1);
    }
    this.updateCellIndex();
  }
  deleteRow(aRow) {
    if (this.data.length > aRow)
      this.data.splice(aRow, 1);
    this.updateCellIndex();
  }
  getCell(aCol, aRow, refresh2) {
    if (typeof this.data[aRow] == "undefined")
      this.data[aRow] = [];
    if (typeof this.data[aRow][aCol] == "undefined")
      this.data[aRow][aCol] = new TGridCell(this.grid, aCol, aRow);
    if (refresh2 && this.data[aRow][aCol])
      this.data[aRow][aCol]._displayValue = void 0;
    return this.data[aRow][aCol];
  }
  getObject(aCol, aRow) {
    let cell = this.cells(aCol, aRow);
    if (cell)
      return cell.object;
    else
      return void 0;
  }
  getValue(aCol, aRow) {
    let cell = this.cells(aCol, aRow);
    if (cell) {
      if (cell.mergeRect)
        cell = this.getCell(cell.mergeRect.startCol, cell.mergeRect.startRow);
      if (cell.value != void 0) {
        return cell.value;
      } else
        return "";
    }
    ;
  }
  getExcelValue(aCol, aRow, callback) {
  }
  getExcelValues(startCol, startRow, callback) {
  }
  getExcelValues1(startCol, startRow, callback) {
  }
  insertCol(aCol) {
    for (let r = 0; r < this.data.length; r++) {
      let row = this.data[r];
      if (row)
        row.splice(aCol, 0, void 0);
    }
    this.updateCellIndex();
  }
  insertRow(aRow) {
    this.data.splice(aRow, 0, []);
    this.updateCellIndex();
  }
  loadFromJSON(json) {
    let data = json["data"];
    for (let i = 0; i < data.length; i++) {
      let row = data[i];
      for (let k = 0; k < row.length; k++) {
        let cell = row[k];
        if (cell)
          this.setValue(k, i, cell["v"]);
      }
    }
  }
  moveRow(fromIdx, toIdx) {
    if (toIdx < this.data.length) {
      this.data.splice(toIdx, 0, this.data.splice(fromIdx, 1)[0]);
      this.updateCellIndex();
    }
  }
  saveToJSON(json) {
    let data = [];
    json["data"] = data;
    for (let i = 0; i < this.data.length; i++) {
      let row = this.data[i];
      data[i] = [];
      for (let k = 0; k < row.length; k++) {
        let cell = row[k];
        if (cell)
          data[i][k] = {
            "v": cell._value
          };
      }
    }
  }
  setDateValue(aCol, aRow, aValue) {
    let cell = this.getCell(aCol, aRow);
    cell._value = aValue;
    cell._isDate = true;
  }
  setMergeCell(rect) {
    for (let col = rect.startCol; col <= rect.endCol; col++)
      for (let row = rect.startRow; row <= rect.endRow; row++) {
        let cell = this.getCell(col, row);
        cell.mergeRect = rect;
      }
  }
  setObject(aCol, aRow, aObject) {
    let cell = this.getCell(aCol, aRow);
    cell.object = aObject;
  }
  setRowCount(value) {
    if (this.data.length > value)
      this.data.length = value;
  }
  setValue(aCol, aRow, aValue, disp) {
    let cell = this.getCell(aCol, aRow);
    if (!disp)
      cell._value = aValue;
    else
      cell._dispValue = aValue;
  }
  setFile(aCol, aRow, aValue) {
    let cell = this.getCell(aCol, aRow);
    cell._file = aValue;
  }
  sort(col, descending) {
    let fixedRow = this.data.slice(0, this.grid.fixedRow);
    let data = this.data.slice(this.grid.fixedRow);
    for (let i = 0; i < data.length; i++) {
      if (data[i] && data[i][col])
        data[i][col]._idx = i;
    }
    ;
    let self = this;
    data.sort(function(item1, item2) {
      if (self.grid["onSort"]) {
        if (item1[col] && item2[col])
          return self.grid["onSort"](self.grid, descending, col, item1[col]._row, item2[col].row);
        else if (item1[col]) {
          if (descending)
            return -1;
          else
            return 1;
        } else {
          if (descending)
            return 1;
          else
            return -1;
        }
      } else {
        let value1;
        let value2;
        let idx1 = 0;
        let idx2 = 0;
        ;
        if (item1[col]) {
          value1 = item1[col]._displayValue || item1[col]._value;
          idx1 = item1[col]._idx;
        }
        if (value1 == void 0)
          value1 = "";
        if (item2[col]) {
          value2 = item2[col]._displayValue || item2[col]._value;
          idx2 = item2[col]._idx;
        }
        if (value2 == void 0)
          value2 = "";
        if (typeof value1 == "string")
          value1 = value1.toLowerCase();
        if (typeof value2 == "string")
          value2 = value2.toLowerCase();
        if (value1 == value2)
          return idx1 > idx2 ? 1 : idx1 < idx2 ? -1 : 0;
        else if (value1 > value2)
          return descending ? -1 : 1;
        else
          return descending ? 1 : -1;
      }
    });
    this.data = fixedRow.concat(data);
    this.updateCellIndex();
  }
  updateCellIndex() {
    for (let r = 0; r < this.data.length; r++) {
      let row = this.data[r];
      for (let c = 0; c < row.length; c++) {
        let cell = this.data[r][c];
        if (cell) {
          cell._col = c;
          cell._row = r;
        }
        ;
      }
      ;
    }
    ;
  }
};
var TGridColumn = class {
  constructor(grid, colIdx) {
    this._visible = true;
    this._resizable = true;
    this._sortable = true;
    this._readOnly = false;
    this.grid = grid;
    this._colIdx = colIdx;
  }
  get asJSON() {
    return {
      "color": this._color && this._color != "clNone" ? this._color : void 0,
      "horizontalAlign": this._horizontalAlign != void 0 && this._horizontalAlign != 1 ? this._horizontalAlign : void 0,
      "type": this._type && this._type != "string" ? this._type : void 0,
      "width": this.width,
      "readOnly": this._readOnly ? this._readOnly : void 0,
      "visible": !this._visible ? this._visible : void 0,
      "resizable": !this._resizable ? this._resizable : void 0,
      "lookupContext": this._lookupContext ? this._lookupContext : void 0,
      "lookupTable": this._lookupTable ? this._lookupTable : void 0,
      "suggestTable": this._suggestTable ? this._suggestTable : void 0,
      "lookupField": this._lookupField ? this._lookupField : void 0,
      "lookupDetailField": this._lookupDetailField ? this._lookupDetailField : void 0,
      "lookupDetailValue": this._lookupDetailValue ? this._lookupDetailValue : void 0,
      "lookupDetailType": this._lookupDetailType ? this._lookupDetailType : void 0,
      "listOfValue": this._listOfValue ? this._listOfValue : void 0,
      "format": this._format ? this._format : void 0,
      "formula": this._formula ? this._formula : void 0,
      "displayUserName": this._displayUserName,
      "binding": this._binding
    };
  }
  set asJSON(value) {
    this._color = value.color;
    this._horizontalAlign = value["horizontalAlign"] != void 0 ? value["horizontalAlign"] : value["alignment"];
    this._type = value["type"] || value["dataType"];
    this._checkBox = value["type"] == "checkBox";
    this._radioButton = value["type"] == "radioButton";
    this._readOnly = value["readOnly"];
    this._visible = value["visible"];
    this._resizable = value["resizable"];
    this._lookupContext = value["lookupContext"];
    this._lookupTable = value["lookupTable"];
    this._lookupField = value["lookupField"];
    this._suggestTable = value["suggestTable"];
    this._lookupDetailField = value["lookupDetailField"];
    this._lookupDetailValue = value["lookupDetailValue"];
    this._lookupDetailType = value["lookupDetailType"];
    this._listOfValue = value["listOfValue"];
    this._displayUserName = value["displayUserName"];
    this._format = value["format"];
    this._formula = value["formula"];
    this._binding = value["binding"];
    if (value["width"] != void 0)
      this["width"] = value["width"];
    if (value["rows"] && value["rows"] > 1)
      this._rows = value["rows"];
    this.grid.enableUpdateTimer();
  }
  get binding() {
    return this._binding;
  }
  set binding(value) {
    this._binding = value;
  }
  get button() {
    return this._type == "button";
  }
  set button(value) {
    if (value) {
      this._type = "button";
      this._button = true;
    } else if (this._type == "button") {
      this._type = "string";
      this._button = false;
    }
    ;
    this.grid.enableUpdateTimer();
  }
  get checkBox() {
    return this._type == "checkBox";
  }
  set checkBox(value) {
    if (value) {
      this._type = "checkBox";
      this._checkBox = true;
    } else if (this._type == "checkBox") {
      this._type = "string";
      this._checkBox = false;
    }
    ;
    this.grid.enableUpdateTimer();
  }
  get colIdx() {
    return this._colIdx;
  }
  set colIdx(value) {
    if (this.colIdx > -1)
      this.grid.columns[this.colIdx] = null;
    this._colIdx = value;
    this.grid.columns[value] = this;
    this.grid.enableUpdateTimer();
  }
  get color() {
    return this._color || "clNone";
  }
  set color(value) {
    this._color = value;
    this.grid.enableUpdateTimer();
  }
  get dataType() {
    return this._dataType;
  }
  set dataType(value) {
    this._dataType = value;
    this.grid.enableUpdateTimer();
  }
  get default() {
    return (!this._color || this._color == "clNone") && (this._horizontalAlign == void 0 || this._horizontalAlign == 1) && (!this._type || this._type == "string") && !this._readOnly && this._visible && (!this._dataType || this._dataType == 0) && this._resizable && !this._lookupContext && !this._lookupTable && !this._lookupField && !this._listOfValue;
  }
  get format() {
    return this._format;
  }
  set format(value) {
    this._format = value;
    this.grid.enableUpdateTimer();
  }
  get formula() {
    return this._formula;
  }
  set formula(value) {
    this._formula = value;
    this.grid.enableUpdateTimer();
  }
  get horizontalAlign() {
    return this._horizontalAlign || 1;
  }
  set horizontalAlign(value) {
    this._horizontalAlign = value;
    this.grid.enableUpdateTimer();
  }
  get radioButton() {
    return this._type == "radioButton";
  }
  set radioButton(value) {
    if (value) {
      this._type = "radioButton";
      this._radioButton = true;
    } else if (this._type == "radioButton") {
      this._type = "string";
      this._radioButton = false;
    }
    this.grid.enableUpdateTimer();
  }
  get readOnly() {
    return this._readOnly;
  }
  set readOnly(value) {
    this._readOnly = value;
    this.grid.enableUpdateTimer();
  }
  get resizable() {
    return this._resizable !== false;
  }
  set resizable(value) {
    this._resizable = value;
    this.grid.enableUpdateTimer();
  }
  get sortable() {
    return this._sortable !== false;
  }
  set sortable(value) {
    this._sortable = value;
  }
  get type() {
    return this._type || "string";
  }
  set type(value) {
    this._type = value;
    this.grid.enableUpdateTimer();
  }
  get visible() {
    return this._visible !== false;
  }
  set visible(value) {
    this._visible = value;
    this.grid.enableUpdateTimer();
  }
  get width() {
    return this.grid.getColWidth(this._colIdx);
  }
  set width(value) {
    this.grid.setColWidth(this._colIdx, value);
    this.grid.enableUpdateTimer();
  }
};
var TGridColumns = class {
  constructor(grid) {
    this.columns = [];
    this.grid = grid;
  }
  clear() {
    this.columns = [];
  }
  deleteCol(aCol) {
    this.columns.splice(aCol, 1);
    this.updateColIndex();
  }
  getColumn(index) {
    if (index > this.columns.length) {
      let len = this.columns.length;
      for (let i = len; i <= index; i++)
        this.columns.push("");
    }
    let col = this.columns[index];
    if (!col) {
      col = new TGridColumn(this.grid, index);
      this.columns[index] = col;
    }
    return col;
  }
  insertCol(colIdx) {
    let col = new TGridColumn(this.grid, colIdx);
    this.columns.splice(colIdx, 0, col);
    this.updateColIndex();
  }
  loadFromJSON(value) {
    this.count = value.length;
    for (let i = 0; i < value.length; i++) {
      if (value[i]) {
        let col = this.getColumn(i);
        if (value[i]["colIdx"] == void 0)
          value[i]["colIdx"] = i;
        col["asJSON"] = value[i];
      }
    }
    this.grid.colCount = this.count;
  }
  _loadFromJSON(value) {
    this.loadFromJSON(value);
  }
  saveToJSON() {
    let result = [];
    let withValue = false;
    for (let i = 0; i < this.columns.length; i++) {
      if (this.columns[i] && !this.columns[i]["default"]) {
        withValue = true;
        result.push(this.columns[i]["asJSON"]);
      } else
        result.push("");
    }
    if (withValue)
      return result;
  }
  setColCount(value) {
    this.columns.length = value;
  }
  updateColIndex() {
    for (let i = 0; i < this.columns.length; i++)
      this.columns[i]._colIdx = i;
  }
};
var TGridRow = class {
  constructor(grid) {
    this._visible = true;
    this._resizable = false;
    this.grid = grid;
  }
  get color() {
    return this._color;
  }
  set color(value) {
    this._color = value;
    this.grid.enableUpdateTimer();
  }
  get height() {
    return this._height;
  }
  set height(value) {
    this._height = value;
    this.grid.enableUpdateTimer();
  }
  get readOnly() {
    return this._readOnly;
  }
  set readOnly(value) {
    this._readOnly = value;
    this.grid.enableUpdateTimer();
  }
  get resizable() {
    return this._resizable;
  }
  set resizable(value) {
    this._resizable = value;
    this.grid.enableUpdateTimer();
  }
  get visible() {
    return this._visible;
  }
  set visible(value) {
    this._visible = value;
    this.grid.enableUpdateTimer();
  }
};
var TGridRows = class {
  constructor(grid, defaultHeight) {
    this.rows = [];
    this.grid = grid;
    this.defaultHeight = defaultHeight;
  }
  clear() {
    this.rows = [];
  }
  getHeight(index) {
    let row = this.rows[index];
    if (row)
      return row.height;
    else
      return this.defaultHeight;
  }
  getRow(index) {
    let row = this.rows[index];
    if (!row) {
      row = new TGridRow(this.grid);
      this.rows[index] = row;
    }
    ;
    return row;
  }
};
var DataGrid = class extends Control {
  constructor(parent, options) {
    super(parent, options);
    this._listOfValue = {};
    this._defaultRowHeight = 19;
    this._defaultColWidth = 64;
    this._layout = "grid";
    this.mergeRect = [];
    this.tableCells = [[]];
    this.tableSplitters = [];
    this.selectedCells = [];
    this.selectedCellsHighlight = [];
    this._colCount = 3;
    this._rowCount = 3;
    this.colWidths = [];
    this._rowHeights = [];
    this._fixedCol = 0;
    this._fixedRow = 1;
    this._leftCol = 0;
    this._topRow = 1;
    this._row = 0;
    this._col = 0;
    this._scrollLeft = 0;
    this._scrollTop = 0;
    this.showDataInternalFlag = false;
    this._sorting = false;
    this._updateTableInternalFlag = false;
    this._totalColWidth = 0;
    this._totalRowHeight = 0;
    this.visibleRowCount = 0;
    this.visibleColCount = 0;
    this.sortingDescending = false;
  }
  static async create(options, parent) {
    let self = new this(parent, options);
    await self.ready();
    return self;
  }
  get fixedCol() {
    return this._fixedCol;
  }
  set fixedCol(value) {
    this._fixedCol = value;
  }
  get fixedRow() {
    return this._fixedRow;
  }
  set fixedRow(value) {
    this._fixedRow = value;
  }
  get layout() {
    return this._layout;
  }
  set layout(value) {
    this._layout = value;
  }
  async init() {
    await super.init();
    this._init();
  }
  _init() {
    this.options = new TGridOptions(this);
    this.placeHolder = this.createElement("div", this);
    this._table = this.createElement("table", this);
    this.data = new TGridCells(this);
    this.columns = new TGridColumns(this);
    this.gridRows = new TGridRows(this, this._defaultRowHeight);
    this.cellHighlight = this.createElement("div", this);
    this.placeHolder.style.position = "absolute";
    this.cellHighlight.className = "grid_curr_cell";
    this.cellHighlight.style.position = "absolute";
    this.cellHighlight.style.display = "none";
    this.cellHighlight.style.zIndex = "3";
    this.selectedRangeHighlight = this.createElement("div", this);
    this.selectedRangeHighlight.className = "grid_selected_cell";
    this.selectedRangeHighlight.style.position = "absolute";
    this.selectedRangeHighlight.style.display = "none";
    this.selectedRangeHighlight.style.zIndex = "3";
    this._table.className = "grid";
    this._table.style.tableLayout = "fixed";
    this._table.style.position = "relative";
    this.tableContainer = this.createElement("div", this);
    this.tableContainer.className = "container";
    this.tableContainer.style.overflow = "hidden";
    this.tableContainer.style.width = "100%";
    this.tableContainer.style.height = "100%";
    this.tableContainer.appendChild(this._table);
    this._scrollBox = this.createElement("div", this);
    this._scrollBox.className = "scrollBox";
    this._scrollBox.tabIndex = 0;
    this._scrollBox.appendChild(this.placeHolder);
    this.edit = this.createElement("input", this);
    this.edit.setAttribute("autocomplete", "disabled");
    this.edit.className = "grid_edit";
    this.edit.style.border = "0px";
    this.edit.style.width = "10px";
    this.edit.style.height = "10px";
    this.edit.style.position = "absolute";
    this.edit.style.top = "-100px";
    this.edit.style.left = "-100px";
    this.style.overflow = "hidden";
    this.style.backgroundColor = "#FFFFFF";
    this._height = 89;
    this._width = 324;
    this.colWidths = [];
    this._scrollLeft = 0;
    this._scrollTop = 0;
    this._scrollBox.addEventListener("mousewheel", (event) => {
      console.dir(event);
      let delta = Math.max(-1, Math.min(1, event.wheelDelta || -event.detail));
      this._handleMouseWheel(event, delta);
    });
    this.edit.addEventListener("input", this._handleInput.bind(this));
    this.edit.addEventListener("propertychange", this._handleInput.bind(this));
    this.addEventListener("dragover", this._handleDragOver.bind(this));
    this.addEventListener("drop", this._handleFileDrop.bind(this));
    this._scrollBox.onscroll = this._handleScroll.bind(this);
    this.setCurrCell(this._fixedCol, this._fixedRow);
    this._updateLanguage();
    this._updateListOfValues();
    this.enableUpdateTimer(true, true);
  }
  calcTopRow(rowIdx) {
    if (rowIdx == this._fixedRow)
      return rowIdx;
    let row = rowIdx;
    let height = this._scrollBox.clientHeight;
    if (this.layout == "card") {
    } else {
      for (let i = 0; i < this._fixedRow; i++)
        height = height - this.getRowHeight(i) - 0.8;
      height = height - this.getRowHeight(row);
      while (row > this._fixedRow) {
        let h = this.getRowHeight(row) + 0.8;
        height = height - h;
        if (height < h - 4) {
          return row - 1;
        }
        ;
        row--;
      }
    }
    return row;
  }
  cells(aCol, aRow, refresh2) {
    return this.data.getCell(aCol, aRow, refresh2);
  }
  get col() {
    return this._col;
  }
  set col(value) {
    this._col = value;
  }
  get row() {
    return this._row;
  }
  set row(value) {
    this._row = value;
  }
  get colCount() {
    return this._colCount;
  }
  set colCount(value) {
    this._colCount = value;
    this.enableUpdateTimer(false, true);
  }
  get readOnly() {
    return this._readOnly;
  }
  set readOnly(value) {
    this._readOnly = value;
  }
  get rowCount() {
    return this._rowCount;
  }
  set rowCount(value) {
    this._rowCount = value;
    this.enableUpdateTimer(true, false);
  }
  get topRow() {
    return this._topRow;
  }
  set topRow(value) {
    this._topRow = value;
  }
  _updateRowHeights(row) {
    let height = this._defaultRowHeight;
    for (let col = 0; col < this._colCount; col++) {
      let cell = this.data.cells(col, row);
      if (cell && cell._height && cell._height > height) {
        height = cell._height;
      }
    }
    ;
    this._rowHeights[row] = height;
    this._updateTotalRowHeight();
    return height;
  }
  setObject(aCol, aRow, aObject) {
    if (this.data)
      this.data.setObject(aCol, aRow, aObject);
  }
  setJSONValue(value, prop, newValue) {
    let obj;
    try {
      if (value)
        obj = JSON.parse(value);
      else
        obj = {};
    } catch (err) {
      obj = {};
    }
    obj[prop] = newValue;
    return JSON.stringify(obj);
  }
  updateBindingData(cell, column) {
    column = column || this.columns.getColumn(cell._col);
    if (column && column.binding) {
      let obj = this.getObject(0, cell._row);
      if (!obj) {
        obj = {};
        this.setObject(0, this._row, obj);
      }
      obj[column.binding] = cell._value;
    }
  }
  _updateCurrCellValue(editor) {
    console.dir("### _updateCurrCellValue");
    let cardViewEditor = false;
    if (editor)
      cardViewEditor = true;
    if (this.editorMode || this._cardPanel) {
      let oldValue = this.data.getValue(this._col, this._row);
      editor = editor || this.editor;
      if (!editor || editor._isModified === false)
        return;
      let newValue;
      if (editor.valueCode)
        newValue = editor.valueCode;
      else if (editor.getText)
        newValue = editor.getText();
      else
        newValue = application.xssSanitize(editor.value);
      let text = "";
      if (editor.getText)
        text = editor.getText();
      else
        text = newValue;
      let cell = this.data.getCell(this._col, this._row);
      if (cell.mergeRect && (this._col != cell.mergeRect.startCol || this._row != cell.mergeRect.startRow))
        cell = this.data.getCell(cell.mergeRect.startCol, cell.mergeRect.startRow);
      if (true) {
        if (this.options._autoRowHeight) {
          let div = this._currCell.div;
          div.textContent = text;
          let height = div.clientHeight + 3;
          if (cell.mergeRect) {
            height = height / (cell.mergeRect.endRow - cell.mergeRect.startRow + 1);
            for (let i = cell.mergeRect.startRow; i <= cell.mergeRect.endRow; i++) {
              cell._height = height;
              this._updateRowHeights(i);
            }
          } else {
            cell._height = height;
            this._updateRowHeights(this._row);
          }
        } else
          this._currCell.div.textContent = text;
      }
      cell._value = newValue;
      this.origValue = void 0;
      if (!cardViewEditor)
        this.enableUpdateTimer();
      if (cell._field) {
        if (!cell._record) {
          let column = this.columns.getColumn(cell._col);
          let record = this.getObject(0, cell._row);
          let rs = record[cell._lookupTable];
          cell._record = rs.append();
          let v = column._lookupDetailValue;
          switch (column._lookupDetailType) {
            case "date":
              v = new Date(v);
              v.setHours(0, 0, 0, 0);
              break;
            case "numeric":
              if (typeof v == "string")
                v = parseFloat(v);
              break;
          }
          ;
          cell._record[column._lookupDetailField] = v;
        }
        cell._record[cell._field] = newValue;
      } else if (this._dataBindingContext) {
        let record = this.getObject(0, this._row);
        let field = this.getObject(this._col, 0);
        let idx = 0;
        let jsonValue;
        if (typeof field == "number") {
          idx = field;
          field = this.dataBinding["fields"][idx];
          if (this.dataBinding["jsonValues"])
            jsonValue = this.dataBinding["jsonValues"][idx];
        }
        this.data.getCell(0, this._row)._newRow = false;
        let fieldType = this.dataBinding["fieldTypes"][idx];
        if (fieldType == "float")
          newValue = parseNumber(newValue);
        else if (fieldType == "integer")
          newValue == Math.round(parseNumber(newValue));
        else if (editor && editor["dataType"] == "dtNumber")
          newValue = parseNumber(newValue);
        if (!record && field) {
          record = this._dataBindingContext["append"]();
          this.setObject(0, this._row, record);
        }
        if (record && field) {
          if (jsonValue)
            newValue = this.setJSONValue(record[field], jsonValue, newValue);
          if (record[field] != newValue)
            record[field] = newValue;
        }
        if (true)
          this.enableUpdateTimer();
      }
      this.updateBindingData(cell);
      if (this.onCellChange)
        this.onCellChange(this, cell, oldValue, newValue);
    }
    ;
  }
  hideEditor(updateValue) {
    this.edit.value = "";
    if (updateValue && this.editor && this.editor["dataType"] == "dtUserAccount") {
      let editor = this.editor;
      editor["dataType"] = "";
      this.editor = null;
      let self = this;
      return;
    }
    if (updateValue && this.editor && this.editor["dataType"] == "dtFile")
      updateValue = false;
    else if (this.editor && this.editor.buildInEditor && this.editor["dataType"] == "dtLookup") {
      this.editor["onChange"] = void 0;
      this.editor.hide(updateValue);
    }
    if (updateValue)
      this._updateCurrCellValue();
    if (this.editor) {
      this.editorMode = false;
      let editor = this.editor;
      this.editor = void 0;
      this.removeChild(editor);
      this.edit.removeEventListener("propertychange", this._handleInput.bind(this));
      this.edit.removeEventListener("input", this._handleInput.bind(this));
      this.edit.value = "";
      this.edit.addEventListener("propertychange", this._handleInput.bind(this));
      this.edit.addEventListener("input", this._handleInput.bind(this));
      this.focus();
      this.edit.focus();
      if (this.onEditModeChanged)
        this.onEditModeChanged(this);
    }
    ;
  }
  checkEmptyRow(row) {
    let cell = this.data.getCell(0, row);
    if (cell._newRow != void 0)
      return cell._newRow;
    for (let i = 0; i < this._colCount; i++) {
      if (this.data.getValue(i, row) != "" && this.data.getValue(i, row) != void 0) {
        return false;
      }
    }
    return true;
  }
  setRowCount(aRowCount) {
    if (this._rowCount != aRowCount) {
      this._rowCount = aRowCount;
      if (this._row >= this._rowCount || this._row < this._fixedRow)
        this._row = this._fixedRow;
      this.data.setRowCount(aRowCount);
      this.refresh();
      this.enableUpdateTimer(true);
    }
  }
  refresh() {
    super.refresh();
    this.enableUpdateTimer();
  }
  deleteRow(row) {
    if (this._dataBindingContext && this._dataBindingContext["readOnly"])
      return;
    this.data.deleteRow(row);
    if (this._rowHeights.length > row)
      this._rowHeights.splice(row, 1);
    this.setRowCount(this._rowCount - 1);
    if (this._dataBindingContext) {
      let record = this.getObject(0, this._row);
      if (record && this._dataBindingContext["current"] !== record) {
        if (this._bindingRecordSet)
          this._bindingRecordSet["current"] = record;
        this._dataBindingContext["current"] = record;
      }
    }
    ;
    this.enableUpdateTimer();
  }
  getObject(aCol, aRow) {
    return this.data.getObject(aCol, aRow);
  }
  getValue(col, row) {
    return this.data.getValue(col, row);
  }
  setScrollLeft() {
    console.dir("#setScrollLeft");
    this._scrollBox.onscroll = null;
    clearTimeout(this._restScrollboxHandler);
    clearTimeout(this._setScrollLeftInterval);
    this._setScrollLeftInterval = setTimeout(() => {
      this.setScrollLeftInternal();
      this._restScrollboxHandler = setTimeout(() => {
        this._scrollBox.onscroll = this._handleScroll.bind(this);
      }, 10);
    }, 10);
  }
  setScrollLeftInternal() {
    if (this._leftCol == this._fixedCol) {
      this._scrollBox.scrollLeft = 0;
      this._scrollLeft = this._scrollBox.scrollLeft;
    } else {
      let w = 0;
      for (let i = 0; i < this._fixedCol; i++)
        w = w + this.getColWidth(i) + 0.8;
      for (let i = this._leftCol; i < this._colCount; i++)
        w = w + this.getColWidth(i) + 0.8;
      this._scrollBox.scrollLeft = this._scrollBox.scrollWidth - w;
      this._scrollLeft = this._scrollBox.scrollLeft;
    }
    ;
  }
  setScrollTop() {
    this._scrollBox.onscroll = null;
    clearInterval(this._restScrollboxHandler);
    clearInterval(this._setScrollTopInterval);
    this._setScrollTopInterval = setTimeout(() => {
      this.setScrollTopInternal();
      this._restScrollboxHandler = setTimeout(() => {
        this._scrollBox.onscroll = this._handleScroll.bind(this);
      }, 10);
    }, 10);
  }
  setScrollTopInternal() {
    console.dir("setScrollTopInternal");
    if (this._topRow == this._fixedRow) {
      this._scrollBox.scrollTop = 0;
      this._scrollTop = this._scrollBox.scrollTop;
    }
    if (this.layout == "card") {
    } else {
      let h = 0;
      for (let i = 0; i < this._fixedRow; i++)
        h = h + this.getRowHeight(i) + 0.8;
      for (let i = this._topRow; i < this._rowCount; i++)
        h = h + this.getRowHeight(i) + 0.8;
      this._scrollBox.scrollTop = this._scrollBox.scrollHeight - h;
      this._scrollTop = this._scrollBox.scrollTop;
    }
    ;
  }
  setLeftCol(aLeftCol, skipSetScroll) {
    console.log("setLeftCol", aLeftCol, skipSetScroll);
    if (aLeftCol != this._leftCol) {
      if (this.editorMode) {
        this.hideEditor(true);
      }
      ;
      if (aLeftCol < this._fixedCol)
        this._leftCol = this._fixedCol;
      else if (aLeftCol >= this._colCount)
        this._leftCol = this._colCount - 1;
      else
        this._leftCol = aLeftCol;
      this.showData(100);
      if (!skipSetScroll)
        this.setScrollLeft();
      this.enableUpdateTimer();
    }
  }
  setTopRow(row, skipSetScroll) {
    console.log("setTopRow", row, skipSetScroll);
    if (row != this._topRow) {
      if (this.editorMode) {
        this.hideEditor(true);
      }
      ;
      if (row < this._fixedRow)
        this._topRow = this._fixedRow;
      else if (row >= this._rowCount)
        this._topRow = this._rowCount - 1;
      else
        this._topRow = row;
      this.showData(100);
      if (!skipSetScroll)
        this.setScrollTop();
      this.enableUpdateTimer();
    }
    ;
  }
  showData(interval) {
    let self = this;
    self.showDataFlag = true;
    if (self._showDataTimeout) {
      clearTimeout(self._showDataTimeout);
    }
    if (interval && !self._refreshDataTimeout) {
      self._refreshDataTimeout = setTimeout(function() {
        clearTimeout(self._refreshDataTimeout);
        self._refreshDataTimeout = void 0;
        if (!self._destroyed)
          self.showDataInternal();
      }, 10);
    }
    ;
    self._showDataTimeout = setTimeout(function() {
      if (self._refreshDataTimeout) {
        clearTimeout(self._refreshDataTimeout);
        self._refreshDataTimeout = void 0;
      }
      clearTimeout(self._showDataTimeout);
      self._showDataTimeout = void 0;
      if (self.showDataFlag) {
        self.showDataFlag = false;
        self._updateTableInternal();
        if (!self["_destroyed"])
          self.showDataInternal();
      }
    }, 100);
  }
  getTableCellByActualIndex(aColIdx, aRowIdx) {
    let aCol;
    let aRow;
    if (aColIdx < this._fixedCol)
      aCol = aColIdx;
    else
      aCol = aColIdx - this._leftCol + this._fixedCol;
    if (aRowIdx < this._fixedRow)
      aRow = aRowIdx;
    else
      aRow = aRowIdx - this._topRow + this._fixedRow;
    for (let i = this._topRow; i < aRow; i++) {
      if (this.gridRows.rows[i] && this.gridRows.rows[i]._visible == false)
        aRow--;
    }
    if (aRow >= this._fixedRow && this.tableCells[aRow])
      return this.tableCells[aRow][aCol];
    else
      return void 0;
  }
  getTableCell(aColIdx, aRowIdx) {
    if (this.tableCells && this.tableCells[aRowIdx])
      return this.tableCells[aRowIdx][aColIdx];
    else
      return void 0;
  }
  highlightCurrCell() {
    var _a, _b, _c;
    this._currCell = this.getTableCellByActualIndex(this._col, this._row);
    if (!this.options._rowSelect) {
      if (!this._currCell) {
        return this.cellHighlight.style.display = "none";
      }
    }
    this.highlightSelectedCell();
    this.selectedRangeHighlight.style.display = "none";
    if (this._currCell || this.options._rowSelect && this._row < this._rowCount) {
      if (this.options._rowSelect) {
        this.cellHighlight.style.display = "block";
        if (this._currCell) {
          this.cellHighlight.style.display = "";
          this.cellHighlight.style.top = this._currCell.offsetTop - 1 + "px";
          this.cellHighlight.style.height = this._currCell.offsetHeight + 1 + "px";
        } else
          this.cellHighlight.style.display = "none";
        this.cellHighlight.style.left = "0px";
        if (this._totalColWidth + 2 < this.tableContainer.clientWidth)
          this.cellHighlight.style.width = this._totalColWidth + 2 + "px";
        else
          this.cellHighlight.style.width = this.tableContainer.clientWidth + 2 + "px";
      } else if (this._currCell) {
        let tableCell = this.getTableCell(this._col, this._row);
        if (tableCell && this._currCell.cell) {
          let edit = this.edit;
          edit.value = this._currCell.cell._displayValue || this._currCell.cell._value || "";
          edit.setSelectionRange(0, edit.value.length);
        } else {
          this.edit.value = "";
        }
        ;
        this.cellHighlight.style.display = "block";
        let parentRect = this.getBoundingClientRect();
        let elemRect = (_a = this._currCell) == null ? void 0 : _a.getBoundingClientRect();
        this.cellHighlight.style.top = this._currCell.offsetTop + "px";
        this.cellHighlight.style.left = this._currCell.offsetLeft + "px";
        if ((_b = this._currCell) == null ? void 0 : _b.offsetWidth)
          this.cellHighlight.style.width = this._currCell.offsetWidth + 1 + "px";
        else
          this.cellHighlight.style.width = "0px";
        if ((_c = this._currCell) == null ? void 0 : _c.offsetHeight)
          this.cellHighlight.style.height = this._currCell.offsetHeight + 1 + "px";
        else
          this.cellHighlight.style.height = "0px";
      }
      ;
    } else {
      this.cellHighlight.style.display = "none";
    }
    if (this._currCell && this._currCell.cell)
      this.cellHighlight.title = this._currCell.cell._hint || "";
    else
      this.cellHighlight.title = "";
  }
  setCurrCell(aCol, aRow, triggerEvent) {
    if (this._col == aCol && this._row == aRow)
      return;
    this.selectedCells = [];
    let cell = this.data.getCell(aCol, aRow);
    let idx = this.selectedCells.indexOf(cell);
    if (idx < 0) {
      this.selectedCells.push(cell);
    } else {
      this.selectedCells.splice(idx, 1);
    }
    this.highlightSelectedCell();
    if (this.editorMode) {
      this.hideEditor(true);
    }
    ;
    if (aCol < 0)
      aCol = 0;
    if (aRow < this._fixedRow)
      aRow = this._fixedRow;
    let rowChange = false;
    if (aCol < this._colCount && aRow < this._rowCount) {
      this._col = aCol;
      if (this._row != aRow) {
        rowChange = true;
        if (!this._readOnly && this.options._autoAddRow && this._row == this._rowCount - 1 && this.checkEmptyRow(this._row)) {
          if (this._dataBindingContext) {
            let record = this.getObject(0, this._row);
            if (record)
              this._dataBindingContext["delete"](record);
            this.deleteRow(this._row);
          } else
            this._rowCount = this._rowCount - 1;
          this.enableUpdateTimer();
        }
      }
      this._row = aRow;
      if (aCol < this._leftCol)
        this.setLeftCol(aCol);
      if (aRow < this._topRow)
        this.setTopRow(aRow);
      if (this._scrollBox.clientWidth > 0) {
        let topRow = this.calcTopRow(aRow);
        if (topRow > this._topRow)
          this.setTopRow(topRow);
        let leftCol = this.calcLeftCol(aCol);
        if (leftCol > this._leftCol)
          this.setLeftCol(leftCol);
      }
      this.highlightCurrCell();
      if (rowChange) {
        let record = this.getObject(0, this._row);
        if (this._bindingRecordSet && this._bindingRecordSet["current"] !== record)
          this._bindingRecordSet["current"] = record;
        if (this._dataBindingContext && this._dataBindingContext["current"] !== record) {
          this._skipRefreshData = true;
          if (this._bindingRecordSet)
            this._bindingRecordSet["current"] = record;
          this._dataBindingContext["current"] = record;
        }
        if (triggerEvent && this.onRowChange) {
          this.onRowChange(this);
        }
      }
      if (triggerEvent && this.onCellSelect) {
        this.onCellSelect(this, cell);
      }
    }
    ;
  }
  highlightSelectedCell() {
    if (this.selectedCells.length > 1) {
      let idx = {};
      for (let i = 0; i < this.selectedCells.length; i++) {
        let cell = this.selectedCells[i];
        idx[cell.col + "-" + cell.row] = false;
      }
      for (let i = this.selectedCellsHighlight.length - 1; i > -1; i--) {
        let div = this.selectedCellsHighlight[i];
        if (typeof idx[div.col + "-" + div.row] == "undefined") {
          this.removeChild(this.selectedCellsHighlight[i]);
          this.selectedCellsHighlight["splice"](i, 1);
        } else
          idx[div.col + "-" + div.row] = true;
      }
      for (let i = 0; i < this.selectedCells.length; i++) {
        let cell = this.selectedCells[i];
        if (idx[cell["col"] + "-" + cell["row"]] == false) {
          let tableCell = this.getTableCellByActualIndex(cell.col, cell.row);
          if (tableCell) {
            let div = this.createElement("div", this);
            this.appendChild(div);
            this.selectedCellsHighlight.push(div);
            div.className = "grid_selected_cell";
            div.style.position = "absolute";
            div.style.display = "block";
            div.style.zIndex = "3";
            div.col = cell["col"];
            div.row = cell["row"];
            div.style.top = tableCell.offsetTop + "px";
            div.style.left = tableCell.offsetLeft + "px";
            div.style.width = tableCell.offsetWidth + "px";
            div.style.height = tableCell.offsetHeight + "px";
          }
          ;
        }
        ;
      }
      ;
    } else {
      for (let i = this.selectedCellsHighlight.length - 1; i > -1; i--)
        this.removeChild(this.selectedCellsHighlight[i]);
      this.selectedCellsHighlight = [];
    }
    ;
  }
  _updateLanguage() {
  }
  _updateListOfValues() {
  }
  _handleScrollHorizontal(sender) {
    if (sender.scrollLeft == 0) {
      this.setLeftCol(this._fixedCol, true);
      return;
    }
    let width = sender.scrollWidth - sender.scrollLeft - sender.clientWidth;
    for (let i = 0; i < this._fixedCol; i++)
      width = width - this.getColWidth(i) - 1;
    for (let i = this._colCount - 1; i > 0; i--) {
      let w = this.getColWidth(i);
      width = width - w - 1;
      if (width <= 0) {
        let col = this.calcLeftCol(i);
        this.setLeftCol(col, true);
        break;
      }
    }
    this.highlightCurrCell();
  }
  _handleScrollVertical(sender) {
    if (sender.scrollTop == 0) {
      if (this._cardPanel)
        this._cardPanel["setTop"](0);
      this.setTopRow(this._fixedRow, true);
      return;
    }
    if (this.layout == "card") {
    } else {
      let height = sender.scrollHeight - sender.scrollTop - sender.clientHeight;
      for (let i = 0; i < this._fixedRow; i++) {
        height = height - this.getRowHeight(i);
      }
      for (let i = this._rowCount - 1; i > 0; i--) {
        let h = this.getRowHeight(i);
        height = height - h;
        if (height <= 0) {
          let row = this.calcTopRow(i);
          this.setTopRow(row, true);
          break;
        }
      }
      ;
    }
    this.highlightCurrCell();
  }
  _handleScroll(event) {
    console.dir("_handleScroll");
    let target = event.target;
    clearTimeout(this.scrollHorizontalTimer);
    clearTimeout(this.scrollVerticalTimer);
    if (this._scrollLeft != target.scrollLeft) {
      this._scrollLeft = target.scrollLeft;
      this.scrollHorizontalTimer = setTimeout(() => {
        this._handleScrollHorizontal(target);
      }, 10);
    } else if (this._scrollTop != target.scrollTop) {
      this._scrollTop = target.scrollTop;
      this.scrollVerticalTimer = setTimeout(() => {
        this._handleScrollVertical(target);
      }, 10);
    }
  }
  _handleFileDrop(event) {
    console.dir("## _handleFileDrop");
  }
  _handleDragOver(event) {
    console.dir("## _handleDragOver");
  }
  _handleInput(event) {
    this.showEditor(this.edit.value);
  }
  _handleMouseWheel(event, delta) {
    console.dir("## _handleMouseWheel");
  }
  getColLeft(aCol) {
    let cell = this.getTableCellByActualIndex(aCol, 1);
    if (cell)
      return cell.offsetLeft;
    let r = 0;
    for (let i = 0; i < this._fixedCol; i++) {
      r = r + this.getColWidth(i);
    }
    for (let i = this._leftCol; i < aCol; i++) {
      r = r + this.getColWidth(i);
    }
    return r;
  }
  getColRight(aCol) {
    let cell = this.getTableCellByActualIndex(aCol, 1);
    if (cell)
      return cell.offsetLeft + this.getColWidth(aCol);
    let r = 0;
    for (let i = 0; i < this._fixedCol; i++) {
      r = r + this.getColWidth(i);
    }
    for (let i = this._leftCol; i < aCol; i++) {
      r = r + this.getColWidth(i);
    }
    return r + this.getColWidth(aCol);
  }
  getColWidth(col) {
    let column = this.cols(col);
    if (column && column._visible === false)
      return 0;
    let w = this.colWidths[col];
    if (w != void 0)
      return w;
    else
      return this._defaultColWidth;
  }
  getRowHeight(row) {
    let h = this._rowHeights[row];
    if (h)
      return h;
    else
      return this._defaultRowHeight;
  }
  _updateTotalRowHeight() {
    this._totalRowHeight = 0;
    for (let i = 0; i < this._rowCount; i++) {
      this._totalRowHeight = this._totalRowHeight + this.getRowHeight(i) + 0.8;
    }
    this.placeHolder.style.height = this._totalRowHeight + "px";
  }
  _updateTotalColWidth() {
    this._totalColWidth = 0;
    for (let i = 0; i < this._colCount; i++) {
      this._totalColWidth = this._totalColWidth + this.getColWidth(i);
    }
    if (this._totalColWidth < this["width"])
      this.placeHolder.style.width = "100%";
    else
      this.placeHolder.style.width = this._totalColWidth + "px";
  }
  _updateTableRows() {
    for (let i = this._table.rows.length - 1; i >= 0; i--) {
      this._table.deleteRow(i);
    }
    this.visibleRowCount = Math.round(this.heightValue / this._defaultRowHeight) + 1;
    if (this.visibleRowCount > this._rowCount)
      this.visibleRowCount = this._rowCount;
    for (let i = this._table.rows.length; i < this.visibleRowCount; i++) {
      let r = this._table.insertRow(this._table.rows.length);
    }
    ;
  }
  getActualColIdx(col) {
    if (col < this._fixedCol)
      return col;
    else
      return col + this._leftCol - this._fixedCol;
  }
  getActualRowIdx(row) {
    if (row < this._fixedRow)
      return row;
    else {
      let result = row + this._topRow - this._fixedRow;
      for (let i = this._topRow; i <= result; i++) {
        if (this.gridRows.rows[i] && this.gridRows.rows[i]._visible == false)
          result++;
      }
      ;
      return result;
    }
    ;
  }
  cols(colIdx) {
    return this.columns.getColumn(colIdx);
  }
  _updateTableCellDiv(tableCell, col, row) {
    if (!tableCell.div) {
      let div = this.createElement("div");
      tableCell.div = div;
      div.owner = this;
      if (row < this._fixedRow)
        tableCell.className = "header grid_fixed_cell";
      else if (col < this._fixedCol)
        tableCell.className = "grid_fixed_cell";
      let actCol = this.getActualColIdx(col);
      let actRow = this.getActualRowIdx(row);
      let cell = this.data.cells(actCol, actRow);
      let w = 0;
      let h = 0;
      if (cell && cell.mergeRect) {
        let divRect = this.createElement("div");
        divRect.style.overflow = "hidden";
        divRect.style.position = "relative";
        tableCell.appendChild(divRect);
        w = this.getColWidth(cell.mergeRect.startCol) - 2;
        h = this.getRowHeight(cell.mergeRect.startRow) - 1;
        for (let i = cell.mergeRect.startCol + 1; i <= cell.mergeRect.endCol; i++)
          w = w + this.getColWidth(i) - 2;
        for (let i = cell.mergeRect.startRow + 1; i <= cell.mergeRect.endRow; i++)
          h = h + this.getRowHeight(i) - 2;
        let left = 0;
        let top = 0;
        if (cell.mergeRect.startCol > this._fixedCol && cell.mergeRect.startCol < this._leftCol) {
          for (let i = cell.mergeRect.startCol; i < this._leftCol; i++)
            left = left + this.getColWidth(i) - 2;
        }
        if (cell.mergeRect.startRow > this._fixedRow && cell.mergeRect.startRow < this._topRow) {
          for (let i = cell.mergeRect.startRow; i < this._topRow; i++)
            top = top + this.getRowHeight(i) - 1;
        }
        divRect.appendChild(div);
        divRect.style.width = w - left + "px";
        divRect.style.height = h - top + "px";
        div.style.position = "absolute";
        div.style.left = -left + "px";
        div.style.top = -top + "px";
      } else {
        w = this.getColWidth(actCol) - 2;
        let column = this.cols(actCol);
        if (column && column._visible === false)
          tableCell.className += " grid_cell_hidden";
        h = this.getRowHeight(actRow) - 2;
        if (row < this._fixedRow)
          tableCell.style.minWidth = w + "px";
        tableCell.style.position = "relative";
        tableCell.appendChild(div);
      }
      div.style.width = w + "px";
      div.style.height = "auto";
      div.style.whiteSpace = "wrap";
      div.style.maxHeight = h + "px";
      div.style.overflow = "hidden";
      if (col == 0)
        div.style.minHeight = h + "px";
      div.className = "grid_cell_value";
    }
    ;
  }
  _updateTableCols() {
    let w = 0;
    for (let i = 0; i < this._fixedCol; i++)
      w = w + this.getColWidth(i);
    this.visibleColCount = this._fixedCol;
    let width = this.widthValue;
    if (width == 0)
      this._needUpdate = true;
    else
      this._needUpdate = false;
    for (let i = this._leftCol; i < this._colCount; i++) {
      w = w + this.getColWidth(i);
      this.visibleColCount++;
      if (w >= width)
        break;
    }
    ;
    for (let row = 0; row < this._table.rows.length; row++) {
      let r = this._table.rows[row];
      this.tableCells[row] = [];
      for (let col = 0; col < this.visibleColCount; col++) {
        let tableCell = r.insertCell(r.cells.length);
        if (col == 0)
          tableCell.style.height = this._defaultRowHeight + "px";
        tableCell.owner = this;
        if ((col + this._leftCol) % 2 == 0)
          tableCell.className = "grid_cell even_col";
        else
          tableCell.className = "grid_cell odd_col";
        if ((row + this._topRow) % 2 == 0)
          tableCell.className += " even_row";
        else
          tableCell.className += " odd_row";
        this._updateTableCellDiv(tableCell, col, row);
        this.tableCells[row][col] = tableCell;
        if (row == 0 && (col < this._fixedCol && col == this.sortingCol || (col >= this._fixedCol && col + (this._leftCol > 0 ? this._leftCol - this._fixedCol : 0)) == this.sortingCol)) {
          tableCell.style.position = "relative";
          let elm = this.createElement("div");
          elm.style.position = "absolute";
          elm.style.width = "6px";
          elm.style.height = "6px";
          elm.style.right = "4px";
          if (this.sortingDescending) {
            elm.style.top = "2px";
            elm.className = "fa fa-sort-desc";
          } else {
            elm.style.top = "6px";
            elm.className = "fa fa-sort-asc";
          }
          tableCell.appendChild(elm);
        }
      }
    }
  }
  setColWidth(aColIndex, width, trigerEvent) {
    let orig = 0;
    orig = this.colWidths[aColIndex];
    this.colWidths[aColIndex] = width;
    for (let i = 0; i < this.tableCells.length; i++) {
      let tableCell = this.getTableCell(aColIndex, i);
      let tableCellDiv = tableCell == null ? void 0 : tableCell.div;
      let column = this.cols(aColIndex);
      if (tableCell && tableCell.div && !column._checkBox && !column._radioButton)
        tableCellDiv.style.width = width - 3 + "px";
    }
    for (let i = 0; i < this._rowCount; i++) {
      let cell = this.cells(aColIndex, i);
      if (cell)
        cell._height = void 0;
    }
    if (trigerEvent && this.onColResize) {
      if (this.resizeTimer)
        clearTimeout(this.resizeTimer);
      this.resizeTimer = setTimeout(() => {
        this.onColResize(this, aColIndex, width);
      }, 50);
    }
    this.enableUpdateTimer(true, true);
  }
  _updateTableMergedCells() {
    console.dir("### _updateTableMergedCells");
  }
  sort(col, descending) {
    let currRow = this.data.data[this._row];
    if (this.editorMode)
      this.hideEditor();
    this._rowHeights = [];
    if (this.data.data.length > this._rowCount)
      this.data.data.length = this._rowCount;
    if (col >= 0)
      this.data.sort(col, descending);
    this.sortingDescending = descending || false;
    this.sortingCol = col;
    if (currRow)
      this._row = this.data.data.indexOf(currRow);
    this.enableUpdateTimer();
  }
  getEditor(col, cell) {
    let editor = this.createElement("input", this);
    editor.setAttribute("autocomplete", "disabled");
    editor.className = "grid_edit";
    this.appendChild(editor);
    return editor;
  }
  handleEditControlChange(event) {
    console.dir("## handleEditControlChange");
  }
  _handleDblClick(event, stopPropagation) {
    return true;
  }
  colLeft() {
    let aRow = this._row;
    let aCol = this._col - 1;
    while (aCol > this._fixedCol) {
      let column = this.cols(aCol);
      if (column && column.visible === false)
        aCol--;
      else
        break;
    }
    ;
    if (aCol < this._colCount) {
      let cell = this.data.cells(aCol, aRow);
      if (cell && cell.mergeRect) {
        if (cell.mergeRect.startRow != aRow) {
          aRow = cell.mergeRect.endRow + 1;
        }
        ;
        this.setCurrCell(aCol, aRow, true);
      } else
        this.setCurrCell(aCol, aRow, true);
    }
    ;
  }
  colRight() {
    let aRow = this._row;
    let aCol = this._col + 1;
    while (aCol < this._colCount - 1) {
      let column = this.cols(aCol);
      if (column && column.visible === false)
        aCol++;
      else
        break;
    }
    ;
    if (aCol < this._colCount) {
      let cell = this.data.cells(aCol, aRow);
      if (cell && cell.mergeRect) {
        if (cell.mergeRect.startRow != aRow) {
          aRow = cell.mergeRect.endRow + 1;
        }
        this.setCurrCell(aCol, aRow, true);
      } else
        this.setCurrCell(aCol, aRow, true);
    }
    ;
  }
  autoAddRow() {
    if (!this._readOnly && !this.options._rowSelect && this.options._autoAddRow && this._row == this._rowCount - 1) {
      let emptyRow = this.checkEmptyRow(this._row);
      if (!emptyRow) {
        this._rowCount = this._rowCount + 1;
        this.setCurrCell(this._col, this._row + 1, true);
        let cell = this.data.getCell(0, this._row);
        if (this._dataBindingContext) {
          cell._newRow = true;
          let rd = this._dataBindingContext["append"]();
          this.setObject(0, this._row, rd);
          this._skipRefreshData = true;
          if (this._bindingRecordSet)
            this._bindingRecordSet["current"] = rd;
          this._dataBindingContext["current"] = rd;
        }
        this._updateTotalRowHeight();
        this.enableUpdateTimer();
      }
    }
  }
  rowDown(disableAutoAddRow) {
    let aCol = this._col;
    let aRow = this._row + 1;
    while (aRow < this._rowCount - 1 && this.gridRows.rows[aRow] && this.gridRows.rows[aRow]._visible == false) {
      aRow++;
    }
    if (this.gridRows.rows[aRow] && this.gridRows.rows[aRow]._visible == false)
      aRow = this._row;
    this.gridRows.rows[aRow] && this.gridRows.rows[aRow]._visible == false;
    if (!disableAutoAddRow)
      this.autoAddRow();
    if (aRow < this._rowCount) {
      let cell = this.data.cells(aCol, aRow);
      if (cell && cell.mergeRect) {
        if (cell.mergeRect.startRow != aRow) {
          aRow = cell.mergeRect.endRow + 1;
        }
        this.setCurrCell(aCol, aRow, true);
      } else
        this.setCurrCell(aCol, aRow, true);
    }
    ;
  }
  calcBottomRow(topRowIdx) {
    if (topRowIdx == this._rowCount - 1)
      return topRowIdx;
    let row = topRowIdx;
    let height = this._scrollBox.clientHeight;
    if (this.layout == "card") {
    } else {
      for (let i = 0; i < this._fixedRow; i++)
        height = height - this.getRowHeight(i) - 0.8;
      height = height - this.getRowHeight(row);
      while (row < this._rowCount - 1) {
        let h = this.getRowHeight(row - 1) + 0.8;
        height = height - h;
        if (height <= 0)
          return row;
        row++;
      }
      ;
    }
    ;
    return row;
  }
  calcLeftCol(colIdx) {
    if (colIdx == this._fixedCol)
      return colIdx;
    let col = colIdx;
    let width = this._scrollBox.clientWidth;
    for (let i = 0; i < this._fixedCol; i++)
      width = width - this.getColWidth(i) - 0.8;
    width = width - this.getColWidth(col) - 0.8;
    while (col > this._fixedCol - 1) {
      let w = this.getColWidth(col - 1) + 0.8;
      width = width - w;
      if (width <= 0) {
        return col;
      }
      col--;
    }
    return col;
  }
  rowUp() {
    let aCol = this._col;
    let aRow = this._row - 1;
    let cell = this.data.cells(aCol, aRow);
    if (cell && cell.mergeRect) {
      if (cell.mergeRect.endRow != aRow) {
        aRow = cell.mergeRect.startRow - 1;
      }
      ;
      this.setCurrCell(aCol, aRow, true);
    } else
      this.setCurrCell(aCol, aRow, true);
  }
  restoreOrigCellValue() {
    if (this.origValue != void 0) {
      if (this.editorMode)
        this.editor.value = this.origValue;
      else
        this._currCell.div.textContent = this.origValue;
    }
    ;
  }
  _handleKeyDown(event, stopPropagation) {
    if (!this.editorMode)
      this.edit.focus();
    if (!this.enabled)
      return false;
    else if (event.keyCode == 229) {
      setTimeout(() => {
      }, 10);
      return true;
    }
    ;
    let keyCode = event.keyCode;
    switch (keyCode) {
      case 9: {
        if (event.shiftKey)
          this.colLeft();
        else
          this.colRight();
        return true;
      }
      case 13: {
        if (this.editorMode) {
          if (!event.shiftKey) {
            this.hideEditor(true);
            this.colRight();
          }
        } else {
          this.setCurrCell(this._col + 1, this._row, true);
        }
        return true;
      }
      case 32: {
        let col = this.cols(this._col);
        let cell = this.cells(this._col, this._row);
        if (cell && cell.checkBox || col && (col.checkBox || col.radioButton)) {
          if (this._currCell) {
            this.toggleCellValue(col, cell);
            this._updateCell(this._currCell, cell, col);
          }
          ;
          event.stopPropagation();
        }
        break;
      }
      case 33: {
        let bottomRow = this.calcBottomRow(this._topRow);
        let row = this.calcTopRow(bottomRow);
        row = this.calcTopRow(row);
        this.setCurrCell(this._col, row);
        return true;
      }
      case 34: {
        let bottomRow = this.calcBottomRow(this._topRow);
        let row = this.calcBottomRow(bottomRow);
        this.setCurrCell(this._col, row);
        return true;
      }
      case 35: {
        if (!this.editorMode) {
          if (event.ctrlKey) {
            this.setCurrCell(this._colCount - 1, this._rowCount - 1);
          } else
            this.setCurrCell(this._colCount - 1, this._row);
        }
        return true;
      }
      case 36: {
        if (!this.editorMode) {
          if (event.ctrlKey)
            this.setCurrCell(this._fixedCol, this._fixedRow);
          else
            this.setCurrCell(this._fixedCol, this._row);
        }
        return true;
      }
      case 38: {
        this.rowUp();
        return true;
      }
      case 40: {
        if (this.editorMode) {
          this.hideEditor(true);
        }
        this.rowDown();
        return true;
      }
      default: {
        let col = this.cols(this._col);
        let cell = this.cells(this._col, this._row);
        if (cell && cell.checkBox || col && (col.checkBox || col.radioButton))
          event.stopPropagation();
      }
    }
    ;
    if (this.editorMode) {
      switch (keyCode) {
        case 27:
          this.restoreOrigCellValue();
          this.hideEditor();
          this.focus();
          return true;
        case 37:
          return;
        case 39:
          return;
      }
      ;
    } else {
      switch (keyCode) {
        case 37:
          this.colLeft();
          return true;
        case 39:
          this.colRight();
          return true;
      }
    }
    ;
  }
  _handleBlur(event, stopPropagation) {
    return true;
  }
  showEditor(inputValue) {
    let column = this.columns.getColumn(this._col);
    let contextReadonly = false;
    if (this._dataBindingContext) {
      contextReadonly = this._dataBindingContext["readOnly"] || this._dataBindingContext["_context"]["options"]["_readOnly"];
    }
    if (!column._file && contextReadonly)
      return;
    if (!column._file && this.checkCellReadOnly())
      return;
    let cell = this.data.cells(this._col, this._row);
    this._currCell = this.getTableCellByActualIndex(this._col, this._row);
    if (this._currCell && !this.editorMode) {
      let top = this._currCell.offsetTop - 1;
      this.editorMode = true;
      this.origValue = this._currCell.div.innerHTML || "";
      if (this.editor) {
        this.editor.owner = null;
        this.editor["onChange"] = null;
        this.editor["onDblClick"] = null;
        this.editor["onKeyDown"] = null;
        this.editor["onHideDropDownPanel"] = null;
      }
      let editor;
      if (this.onGetEditControl) {
        editor = this.onGetEditControl(this, cell);
        if (editor)
          this.appendChild(editor);
      }
      if (!editor) {
        editor = this.getEditor(this._col, cell);
      }
      if (editor) {
        editor.onchange = this.handleEditControlChange.bind(this);
        editor.ondblclick = this._handleDblClick.bind(this);
        editor.onkeydown = this._handleKeyDown.bind(this);
        editor.onblur = this._handleBlur.bind(this);
        this.editor = editor;
        editor.style.position = "absolute";
        editor.style.display = "block";
        editor.value = this.edit.value;
        editor.focus();
        if (cell.mergeRect) {
          let w = 0;
          let h = 0;
          for (let i = cell.mergeRect.startCol; i < cell.mergeRect.endCol; i++)
            w += this.getColWidth(i);
          editor.style.width = w - 1 + "px";
          for (let i = cell.mergeRect.startCol; i < cell.mergeRect.endCol; i++)
            h += this.getRowHeight(i) + 0.8;
          editor.style.height = h - 1 + "px";
          this.editor["setTop"](this._currCell.offsetTop + 1);
          this.editor["setLeft"](this._currCell.offsetLeft + 1);
        } else {
          editor.style.width = this.getColWidth(this._col) - 2 + "px";
          editor.style.height = this.getRowHeight(this._row) - 2 + "px";
          editor.style.top = this._currCell.offsetTop + 2 + "px";
          editor.style.left = this._currCell.offsetLeft + 2 + "px";
        }
      }
      if (this.onEditModeChanged) {
        this.onEditModeChanged(this);
      }
      ;
      this.editor = editor;
      let self = this;
      setTimeout(() => {
        if (editor) {
          editor.style.zIndex = "9999";
        }
        ;
      }, 10);
    } else
      this.edit.value = "";
  }
  _handleMouseDown(event) {
    if (!this.enabled)
      return true;
    let target = event.target;
    if (target && target.isSpliter)
      return true;
    let aCol = 0;
    let aRow = 0;
    if (target == this.editor) {
      return true;
    } else {
      let rect = this.getBoundingClientRect();
      let x = getCursorPosX(event) - rect.left;
      let y = getCursorPosY(event) - rect.top;
      if (x > this._scrollBox.clientWidth || y > this._scrollBox.clientHeight)
        return true;
      for (let row = 0; row < this._table.rows.length; row++) {
        let tableCell = this.tableCells[row][0];
        if (tableCell.offsetTop + tableCell.clientHeight >= y) {
          let r = this.tableCells[row];
          for (let col = 0; col < r.length; col++) {
            tableCell = r[col];
            if (tableCell && tableCell.offsetLeft + tableCell.clientWidth >= x && tableCell.offsetTop + tableCell.clientHeight >= y) {
              let tableCellDiv = tableCell == null ? void 0 : tableCell.div;
              aCol = this.getActualColIdx(col);
              aRow = this.getActualRowIdx(row);
              let cell = this.cells(aCol, aRow);
              this.lastClickCell = cell;
              let elms = tableCellDiv.querySelectorAll("button");
              if (elms.length > 0) {
                let offsetX = x - tableCell.offsetLeft;
                for (let i = 0; i < elms.length; i++) {
                  if (elms[i].offsetLeft + elms[i].clientWidth > offsetX) {
                    this.setCurrCell(aCol, aRow, true);
                    let btn;
                    if (Array.isArray(cell._value))
                      btn = cell._value[i];
                    else
                      btn = cell._value;
                    if (this.onButtonClick) {
                      this.onButtonClick(this, cell, btn);
                    }
                    if (this.onCellClick) {
                      this.onCellClick(this, cell);
                    }
                  }
                }
                return true;
              }
              let column = this.columns.getColumn(aCol);
              if (column && (cell && cell._checkBox || column._checkBox || column._radioButton)) {
                if (aRow >= this._fixedRow || !cell.readOnly && cell._checkBox) {
                  this.toggleCellValue(column, cell);
                  this._updateCell(tableCell, cell, column);
                  this.setCurrCell(aCol, aRow, true);
                } else if (this.options._sortOnClick && column._sortable) {
                  if (aCol == this.sortingCol)
                    this.sort(aCol, !this.sortingDescending);
                  else
                    this.sort(aCol);
                }
              } else if (aCol == this._col && aRow == this._row) {
                if (!this.editorMode) {
                  let cell2 = this.data.cells(aCol, aRow);
                  this.edit.value = cell2._displayValue || cell2._value || "";
                  this.showEditor();
                }
              } else if (aRow < this._fixedRow) {
                application.globalEvents.abortEvent(event);
                if (this.editorMode)
                  this.hideEditor();
                if (this.options._sortOnClick) {
                  if (aCol == this.sortingCol)
                    this.sort(aCol, !this.sortingDescending);
                  else
                    this.sort(aCol);
                }
              } else {
                this.setCurrCell(aCol, aRow, true);
              }
              if (cell && this.onCellClick)
                this.onCellClick(this, cell);
              break;
            }
          }
          if (aRow != void 0)
            break;
        }
      }
    }
    if (aRow == void 0 && this.editorMode) {
      this.hideEditor(true);
    }
    if (!this.editorMode) {
      this.edit.focus();
    }
    ;
    return true;
  }
  _updateCell(tableCell, cell, column) {
    let tableCellDiv = tableCell == null ? void 0 : tableCell.div;
    let _cell = cell;
    let _column = column;
    let _tableCell = tableCell;
    let withDispValue = false;
    let disp;
    if (tableCellDiv) {
      tableCell.style.display = "";
      if (cell._encrypted)
        tableCellDiv.style.color = "green";
      else
        tableCellDiv.style.color = "";
      tableCellDiv.style.display = "";
      if (cell) {
        _cell._tableCell = tableCellDiv;
        let font = {
          "bold": this.font.bold,
          "color": this.font.color,
          "italic": this.font.italic,
          "name": this.font.name,
          "size": this.font.size,
          "underline": this.font.underline
        };
        let value;
        if (this.onDisplayCell) {
          disp = {
            "button": _cell._button,
            "checkBox": _cell._checkBox,
            "col": _cell._col,
            "color": _cell._color,
            "dataType": _cell._dataType,
            "font": font,
            "formula": _cell._formula,
            "horizontalAlign": _cell._horizontalAlign,
            "html": _cell._html,
            "image": _cell._image,
            "object": _cell._object,
            "readOnly": _cell._readOnly,
            "row": _cell._row,
            "text": _cell._text,
            "value": _cell._value,
            "visible": _cell._visible
          };
          try {
            this.onDisplayCell(this, disp);
            if (disp.value != _cell._value) {
              _cell._displayValue = disp["value"];
              withDispValue = true;
            }
            value = disp["value"];
          } catch (e) {
            value = "";
          }
        } else if (column && _column._formula) {
          if (this.formula) {
            this.formulaCell = cell;
            value = this.formula["parse"](column._formula)["result"];
          } else {
          }
        } else
          value = _cell._value;
        let c = (_cell ? _cell._color : "") || (_column ? _column._color : "");
        tableCell.classList.remove("bg-warning", "bg-success", "bg-info", "bg-danger", "bg-highlight");
        if (c) {
          if (["warning", "success", "info", "danger", "highlight"].indexOf(c) > -1)
            tableCell.classList.add("bg-" + c);
          else
            tableCell.style.backgroundColor = c;
        } else
          tableCellDiv.style.backgroundColor = "";
        let align;
        if (_cell._horizontalAlign != void 0)
          align = _cell._horizontalAlign;
        else if (_column && _column._horizontalAlign != void 0) {
          align = _column._horizontalAlign;
        }
        if (align != void 0) {
          switch (align) {
            case 0:
              tableCellDiv.style.textAlign = "center";
              break;
            case 1:
              tableCellDiv.style.textAlign = "left";
              break;
            case 2:
              tableCellDiv.style.textAlign = "right";
              break;
          }
        }
        if (!_cell.visible)
          tableCellDiv.style.display = "none";
        else
          tableCellDiv.style.display = "";
        if (_column && _column._type == "image" && _cell._file && _cell._file["url"]) {
          tableCellDiv.classList.add("image");
          tableCellDiv.style.height = this._defaultRowHeight + "px";
          tableCellDiv.innerHTML = '<img src="' + withDispValue ? _cell._displayValue : _cell._file["url"] + '?size=t" style="max-height:100%;max-width=100%"/>';
        } else if (disp && disp.image) {
          tableCellDiv.classList.add("image");
          tableCellDiv.style.height = this._defaultRowHeight + "px";
          tableCellDiv.innerHTML = '<img src="' + withDispValue ? value : disp.value + '"/>';
        } else if (disp && disp.html) {
          tableCellDiv.innerHTML = withDispValue ? value : application.xssSanitize(disp.value);
        } else if (_cell && (_cell.image || _cell._dataType == 5) || _column && _column._dataType == 5) {
          tableCellDiv.classList.add("image");
          tableCellDiv.style.height = this._defaultRowHeight + "px";
          tableCellDiv.innerHTML = '<img src="' + withDispValue ? value : _cell._value + '"/>';
        } else if (_cell && (_cell.html || _cell._dataType == 6) || _column && _column._dataType == 6) {
          tableCellDiv.innerHTML = withDispValue ? value : application.xssSanitize(_cell._value);
        } else if (value && !Array.isArray(value) && !(value instanceof Date) && typeof value == "object") {
          if (Array.isArray(value)) {
            let html = "";
            for (let i = 0; i < value.length; i++)
              html += "<button>" + (value[i]["caption"] || "...") + "</button>";
            tableCellDiv.innerHTML = html;
          } else
            tableCellDiv.innerHTML = "<button>" + (value["caption"] || "...") + "</button>";
        } else if (_column && _column._button) {
          tableCellDiv.innerHTML = "<button>" + (value || "...") + "</button>";
        } else if (_cell && _cell._checkBox || _column && _column._checkBox) {
          if (value)
            tableCellDiv.className = "check_box_checked";
          else
            tableCellDiv.className = "check_box_unchecked";
          tableCellDiv.style.position = "relative";
          tableCellDiv.style.margin = "auto";
          tableCellDiv.style.top = (this._defaultRowHeight - 13) / 2 + "px";
          tableCellDiv.style.left = "1px";
          tableCellDiv.style["height"] = "100%";
          tableCellDiv.style["width"] = "13px";
        } else if (_column && _column._radioButton) {
          if (value)
            tableCellDiv.className = "radio_button.checked";
          else
            tableCellDiv.className = "radio_button.unchecked";
          tableCellDiv.style.position = "relative";
          tableCellDiv.style.margin = "auto";
          tableCellDiv.style.top = (this._defaultRowHeight - 13) / 2 + "px";
          tableCellDiv.style.left = "1px";
          tableCellDiv.style["height"] = "100%";
          tableCellDiv.style["width"] = "13px";
        } else {
          if (_cell._dispValue && tableCell.classList.contains("grid_fixed_cell")) {
            tableCellDiv.textContent = _cell._dispValue;
          } else if (withDispValue) {
            tableCellDiv.textContent = value;
          } else if (_cell.row < this._fixedRow) {
            tableCellDiv.textContent = value;
          } else {
            if (column && _column._type == "lookupDetail") {
              let rd;
              if (_cell._record)
                rd = _cell._record;
              else {
                let record = this.getObject(0, _cell._row);
                if (record) {
                  let rs = record[_column._lookupTable];
                  if (rs) {
                    rd = rs.first;
                    _cell._field = _column._lookupField;
                    let v1 = _column._lookupDetailValue;
                    switch (_column._lookupDetailType) {
                      case "date":
                        v1 = new Date(v1);
                        v1.setHours(0, 0, 0, 0);
                        break;
                      case "numeric":
                        if (typeof v1 == "string")
                          v1 = parseFloat(v1);
                        break;
                    }
                    while (rd) {
                      let v2 = rd[_column._lookupField];
                      switch (_column._lookupDetailType) {
                        case "date":
                          v2 = new Date(rd[_column._lookupDetailField]);
                          v2.setHours(0, 0, 0, 0);
                          break;
                        case "numeric":
                          if (typeof v2 == "string")
                            v2 = parseFloat(v2);
                          break;
                      }
                      if (v1 == v2)
                        break;
                      else if (_column._lookupDetailType == "date" && v1.getTime() == v2.getTime())
                        break;
                      rd = rs["next"];
                    }
                  }
                }
              }
              if (rd) {
                _cell._value = rd[_column._lookupField];
                _cell._record = rd;
                tableCellDiv.textContent = rd[_column._lookupField];
              }
            } else if (column && _column._type == "listOfValue" && _column._listOfValue) {
              let lsv = this._listOfValue[_column._listOfValue];
              if (lsv != void 0)
                tableCellDiv.textContent = lsv[value] || value;
              else
                tableCellDiv.textContent = value;
            } else if (column && (_column._type == "lookup" || _column._type == "lookupCombo")) {
            } else if (_column && _column._type == "{userAccount}") {
            } else {
              let type = typeof value;
              if (type != "undefined") {
                if (type == "number")
                  tableCellDiv.textContent = parseNumber(value.toPrecision(12)).toString();
                else {
                  tableCellDiv.textContent = value;
                }
              } else
                tableCellDiv.textContent = "";
            }
          }
        }
      } else {
        if (cell && _cell._checkBox || column && _column._checkBox) {
          tableCellDiv.className = "check_box_unchecked";
          tableCellDiv.style.position = "relative";
          tableCellDiv.style.top = "1px";
          tableCellDiv.style.left = "1px";
          tableCellDiv.style["height"] = "13px";
          tableCellDiv.style["width"] = "13px";
        } else if (column && _column._radioButton) {
          tableCellDiv.className = "radio_button.unchecked";
          tableCellDiv.style.position = "relative";
          tableCellDiv.style.top = "1px";
          tableCellDiv.style.left = "1px";
          tableCellDiv.style["height"] = "13px";
          tableCellDiv.style["width"] = "13px";
        } else
          tableCellDiv.textContent = "";
      }
    }
  }
  checkCellReadOnly(col, row) {
    if (!this._enabled || this._readOnly || this.options._rowSelect)
      return true;
    else {
      if (col == void 0)
        col = this._col;
      if (row == void 0)
        row = this._row;
      if ((col < this._fixedCol || row < this._fixedRow) && this.layout != "card")
        return true;
      let column = this.cols(col);
      if (column._readOnly)
        return true;
      else {
        let record = this.getObject(0, row);
        if (record && record["_isReadOnly"])
          return true;
        let cell = this.data.cells(col, row);
        if (cell)
          return cell.readOnly || !cell.visible;
        else
          return false;
      }
      ;
    }
    ;
  }
  toggleCellValue(column, cell) {
    if (!this.checkCellReadOnly(cell.col, cell.row)) {
      cell._value = !cell._value;
      if (this._dataBindingContext) {
        let record = this.getObject(0, cell._row);
        let field = this.getObject(cell._col, 0);
        if (!record && field) {
          record = this._dataBindingContext["append"]();
          this.setObject(0, cell._row, record);
        }
        if (record && field) {
          record[field] = cell._value;
        }
        this.enableUpdateTimer();
      }
      this.updateBindingData(cell, column);
      if (this.onCellChange)
        this.onCellChange(this, cell, !cell._value, cell._value);
    }
  }
  _handleMouseMove(event) {
    if (application.globalEvents._leftMouseButtonDown) {
    }
    if (this._colResizing) {
      let pos = getCursorPosX(event);
      this.setColWidth(this.resizeCol, this.origColWidth + (pos - this.mouseDownPosX), true);
      this.showData(100);
      this.highlightCurrCell();
      return true;
    }
    return true;
  }
  _handleMouseUp(event) {
    if (this._colResizing) {
      this._colResizing = false;
      this._updateTableSplitter();
    }
    return true;
  }
  _handleColumnResizeStart(event) {
    if (this.editorMode) {
      this.hideEditor(true);
    }
    ;
    let pos = getCursorPosX(event);
    this.mouseDownPosX = pos;
    this.resizeCol = this.getActualColIdx(event.target.cellIndex);
    this.origColWidth = this.getColWidth(this.resizeCol);
    this._colResizing = true;
  }
  _updateTableSplitter() {
    let splitter;
    for (let i = this.tableSplitters.length - 1; i < this.visibleColCount; i++) {
      splitter = this.tableSplitters[i];
      if (splitter)
        splitter.style.display = "none";
    }
    ;
    for (let col = 0; col < this.visibleColCount; col++) {
      splitter = this.tableSplitters[col];
      if (!splitter) {
        splitter = this.createElement("div", this);
        this.tableSplitters[col] = splitter;
        splitter.isSpliter = true;
        splitter.owner = this;
        splitter.cellIndex = col;
        splitter.onmousedown = this._handleColumnResizeStart.bind(this);
        this.appendChild(splitter);
        splitter.style.zIndex = 5;
        splitter.style.cursor = "e-resize";
        splitter.style.position = "absolute";
        splitter.style.top = "0px";
        splitter.style.width = "6px";
      }
      ;
      let colIdx = this.getActualColIdx(col);
      let left = this.getColRight(colIdx);
      let height = 0;
      for (let row = 0; row < this._fixedRow; row++) {
        height = height + this.getRowHeight(row) + 0.8;
      }
      splitter.style.left = left + "px";
      if (this._fixedCol > 0 && col == this._fixedCol - 1)
        splitter.style.height = this.heightValue + "px";
      else
        splitter.style.height = height + "px";
      splitter.style.display = "";
    }
  }
  _showDataInternalGrid() {
    if (!this._table)
      return;
    for (let r = 0; r < this._fixedRow; r++) {
      for (let c = 0; c < this._fixedCol; c++) {
        let tableCell = this.getTableCell(c, r);
        let column = null;
        if (this.columns)
          column = this.columns.getColumn(c);
        if (tableCell) {
          let cell = this.data.cells(c, r);
          this._updateCell(tableCell, cell, column);
        }
      }
    }
    for (let r = 0; r < this._fixedRow; r++) {
      for (let c = this._fixedCol; c < this.visibleColCount; c++) {
        let tableCell = this.getTableCell(c, r);
        if (tableCell) {
          let cell = this.data.cells(this.getActualColIdx(c), r);
          if (cell)
            tableCell.cell = cell;
          this._updateCell(tableCell, cell);
        }
      }
    }
    for (let r = this._fixedRow; r < this.visibleRowCount; r++) {
      for (let c = 0; c < this._fixedCol; c++) {
        let column = this.columns.getColumn(c);
        let tableCell = this.getTableCell(c, r);
        if (tableCell) {
          let cell = this.data.cells(c, this.getActualRowIdx(r));
          if (cell)
            tableCell.cell = cell;
          this._updateCell(tableCell, cell, column);
        }
      }
    }
    for (let c = this._fixedCol; c < this.visibleColCount; c++) {
      let colIdx = this.getActualColIdx(c);
      let _column = this.columns.getColumn(colIdx);
      if (_column && (_column._type == "lookup" || _column._type == "lookupCombo")) {
      }
    }
    for (let r = this._fixedRow; r < this.visibleRowCount; r++) {
      let rowIdx = this.getActualRowIdx(r);
      for (let c = this._fixedCol; c < this.visibleColCount; c++) {
        let colIdx = this.getActualColIdx(c);
        let column = this.columns.getColumn(colIdx);
        let tableCell = this.getTableCell(c, r);
        if (tableCell) {
          let cell = this.data.cells(colIdx, rowIdx);
          tableCell.cell = cell;
          this._updateCell(tableCell, cell, column);
        }
        ;
      }
      ;
    }
    ;
    if (this.options._autoRowHeight) {
      for (let r = 0; r < this.visibleRowCount; r++) {
        if (this._table.rows[r].clientHeight > this._defaultRowHeight) {
          for (let c = 0; c < this.visibleColCount; c++) {
            let tableCell = this.getTableCell(c, r);
            if (tableCell && tableCell.cell) {
              let cell = tableCell.cell;
              let row2 = this.getActualRowIdx(r);
              if (!cell._height) {
                cell._height = tableCell.div.clientHeight + 3;
              }
              if (!this._rowHeights[row2] || this._rowHeights[row2] < cell._height) {
                this._rowHeights[row2] = cell._height;
              }
            }
          }
        }
      }
    }
    ;
    let row = this._table.rows[0];
    if (row) {
      if (row.cells.length > this._colCount - this._leftCol + this._fixedCol) {
        for (let r = 0; r < this._table.rows.length; r++) {
          let row2 = this._table.rows[r];
          for (let c = this._colCount - this._leftCol + this._fixedCol; c < row2.cells.length; c++) {
            row2.cells[c].style.display = "none";
          }
          ;
        }
        ;
      }
      ;
    }
    ;
    if (this._table.rows.length > this._rowCount - this._topRow + this._fixedRow) {
      for (let c = this._rowCount - this._topRow + this._fixedRow; c < this._table.rows.length; c++) {
        if (c > -1) {
          this._table.rows[c].style.display = "none";
        }
        ;
      }
      ;
    }
    ;
    this.highlightCurrCell();
  }
  showDataInternal() {
    this.showDataFlag = false;
    if (!this.showDataInternalFlag) {
      this.showDataInternalFlag = true;
      try {
        if (this.layout == "card") {
        } else
          this._showDataInternalGrid();
      } finally {
        this.showDataInternalFlag = false;
      }
      ;
    }
    ;
  }
  _updateTableInternal(updateRowHeightFlag, updateColWidthFlag) {
    if (!this._updateTableInternalFlag) {
      this._updateTableInternalFlag = true;
      try {
        if (this.layout == "card") {
        } else {
          if (updateRowHeightFlag) {
            this._updateTotalRowHeight();
          }
          ;
          if (updateColWidthFlag) {
            this._updateTotalColWidth();
          }
          ;
          this.tableCells = [[]];
          if (this._totalColWidth < this.width)
            this.placeHolder.style.width = "100%";
          else
            this.placeHolder.style.width = this._totalColWidth + "px";
          this.placeHolder.style.height = this._totalRowHeight + "px";
          this._updateTableRows();
          this._updateTableCols();
          this._updateTableMergedCells();
          this._updateTableSplitter();
        }
      } catch (err) {
      } finally {
        this._updateTableInternalFlag = false;
      }
      ;
    }
    ;
  }
  enableUpdateTimer(updateRowHeightFlag, updateColWidthFlag) {
    updateRowHeightFlag = updateRowHeightFlag || false;
    updateColWidthFlag = updateColWidthFlag || false;
    clearTimeout(this._updateTableTimer);
    this._updateTableTimer = setTimeout(() => {
      if (this._scrollBox.clientWidth) {
        this._updateTableTimer = void 0;
        this._sorting = false;
        if (updateRowHeightFlag)
          this._rowHeights = [];
        this._updateTableInternal(updateRowHeightFlag, updateColWidthFlag);
        this.showDataInternal();
      } else {
        this._updateTableTimer = setTimeout(() => {
          this._sorting = false;
          if (updateRowHeightFlag)
            this._rowHeights = [];
          this._updateTableInternal(updateRowHeightFlag, updateColWidthFlag);
          this.showDataInternal();
        }, 100);
      }
    }, 10);
  }
};
DataGrid = __decorateClass([
  customElements2("i-data-grid")
], DataGrid);

// packages/markdown/src/style/markdown.css.ts
var Theme14 = theme_exports.ThemeVars;
cssRule("i-markdown", {
  display: "inline-block",
  color: Theme14.text.primary,
  fontFamily: Theme14.typography.fontFamily,
  fontSize: Theme14.typography.fontSize,
  $nest: {
    h1: {
      fontSize: "48px",
      fontWeight: "900",
      marginBottom: "16px",
      marginTop: "1.5em",
      $nest: {
        "@media (max-width: 700px)": {
          fontSize: "24px"
        }
      }
    },
    h2: {
      fontSize: "24px",
      lineHeight: "1.5",
      fontWeight: "600",
      marginBottom: "16px",
      marginTop: "1.5em",
      $nest: {
        "@media (max-width: 700px)": {
          fontSize: "20px"
        }
      }
    },
    h3: {
      fontSize: "20px",
      lineHeight: "24px",
      fontWeight: "600",
      marginBottom: "16px",
      marginTop: "1.5em",
      $nest: {
        "@media (max-width: 700px)": {
          fontSize: "16px"
        }
      }
    },
    h4: {
      fontSize: "16px",
      fontWeight: "600",
      marginBottom: "16px",
      marginTop: "1.5em"
    },
    h5: {
      fontSize: "14px",
      fontWeight: "600",
      marginBottom: "16px",
      marginTop: "1.5em"
    },
    h6: {
      fontSize: "13.6px",
      fontWeight: "600",
      marginBottom: "16px",
      marginTop: "1.5em"
    },
    p: {
      display: "block",
      lineHeight: "150%",
      marginBottom: "1em",
      marginTop: "0",
      fontSize: "15px"
    },
    "p > img": {
      width: "50%",
      float: "left",
      $nest: {
        "@media (max-width: 700px)": {
          width: "100%"
        }
      }
    },
    "p img:nth-child(odd)": {
      paddingRight: "6px",
      $nest: {
        "@media (max-width: 700px)": {
          padding: "0"
        }
      }
    },
    "p img:nth-child(even)": {
      paddingLeft: "6px",
      $nest: {
        "@media (max-width: 700px)": {
          padding: "0"
        }
      }
    },
    "p img:only-child": {
      width: "100%"
    },
    "p a": {
      display: "contents"
    },
    "table": {
      borderSpacing: "0",
      border: "1px solid #393939",
      width: "100%",
      marginBottom: "20px",
      $nest: {
        "thead": {
          background: "#FFF"
        },
        "th": {
          padding: "10px"
        },
        "td": {
          padding: "10px",
          borderTop: "1px solid #393939"
        },
        "tbody": {
          $nest: {
            "tr:nth-child(odd)": {
              backgroundColor: "#EEE"
            },
            "tr:nth-child(even)": {
              backgroundColor: "#FFF"
            }
          }
        }
      }
    },
    strong: {
      fontWeight: "600"
    },
    blockquote: {
      background: "#e3e3ff",
      borderLeft: "0.25em solid #55f",
      display: "block",
      padding: "15px 30px 15px 15px",
      color: "#6a737d",
      fontSize: "16px",
      margin: "0 0 16px",
      $nest: {
        p: {
          marginBottom: "0"
        }
      }
    },
    hr: {
      border: "1px solid #dfe2e5",
      boxSizing: "content-box",
      margin: "1.5em 0",
      overflow: "hidden",
      padding: "0"
    },
    ol: {
      marginBottom: "1em",
      marginTop: "0",
      paddingLeft: "2em",
      $nest: {
        li: {
          fontSize: "16px"
        },
        "li+li": {
          marginTop: "0.5em"
        }
      }
    },
    ul: {
      marginBottom: "1em",
      marginTop: "0",
      paddingLeft: "2em",
      $nest: {
        li: {
          fontSize: "16px"
        },
        "li+li": {
          marginTop: "0.5em"
        }
      }
    },
    "ol ol, ul ul, ol ul, ul ol": {
      marginTop: "0.5em"
    },
    "code, pre code": {
      borderRadius: "3px",
      background: "#ebeff3",
      overflowX: "scroll",
      border: "0",
      display: "inline",
      margin: "0",
      overflow: "visible",
      padding: "0",
      whiteSpace: "pre",
      wordBreak: "normal",
      wordWrap: "normal"
    },
    "a, a:hover": {
      color: "#55f",
      textDecoration: "none"
    }
  }
});

// packages/markdown/src/markdown.ts
var libs = [`${LibPath}lib/marked/marked.umd.js`];
var Markdown = class extends Control {
  constructor() {
    super();
    this.gitbookProcess = true;
  }
  async load(text) {
    if (!this.marked)
      this.marked = await this.loadLib();
    text = await this.marked.parse(text);
    text = await this.processText(text);
    this.innerHTML = text;
    return this.innerHTML;
  }
  async beforeRender(text) {
    this.innerHTML = text;
  }
  async processText(text) {
    if (this.gitbookProcess) {
      text = text.replace(/\*\*\*\*/g, "\n	").replace(/\\/g, "");
    }
    return text;
  }
  async loadLib() {
    return new Promise((resolve, reject) => {
      RequireJS.require(libs, async (marked) => {
        resolve(marked);
      });
    });
  }
  init() {
    super.init();
  }
};
Markdown = __decorateClass([
  customElements2("i-markdown")
], Markdown);

// packages/markdown-editor/src/markdown-editor.ts
var TOOLBAR_ITEMS_DEFAULT = [
  ["heading", "bold", "italic", "strike"],
  ["hr", "quote"],
  ["ul", "ol", "task", "indent", "outdent"],
  ["table", "image", "link"],
  ["code", "codeblock"]
];
RequireJS.config({
  paths: {
    "tui-color-picker": `${LibPath}lib/tui-editor/tui-color-picker.min.js`
  }
});
var libs2 = [`${LibPath}lib/tui-editor/toastui-editor-all.min.js`];
var libPlugins = [
  { name: "colorSyntax", path: [`${LibPath}lib/tui-editor/toastui-editor-plugin-color-syntax.min.js`] },
  { name: "codeSyntaxHighlight", path: [`${LibPath}lib/tui-editor/toastui-editor-plugin-code-syntax-highlight-all.min.js`] },
  { name: "tableMergedCell", path: [`${LibPath}lib/tui-editor/toastui-editor-plugin-table-merged-cell.min.js`] },
  { name: "uml", path: [`${LibPath}lib/tui-editor/toastui-editor-plugin-uml.min.js`] }
];
var editorCSS = [
  { name: "toastui-editor", href: `${LibPath}lib/tui-editor/toastui-editor.min.css` },
  { name: "toastui-plugins", href: `${LibPath}lib/tui-editor/toastui-plugins.min.css` }
];
var MarkdownEditor = class extends Control {
  constructor(parent, options) {
    super(parent, options);
    this.editorPlugins = {};
    this._theme = "light";
    this._mode = "markdown";
    this._previewStyle = "vertical";
    this._value = "";
    this._viewer = false;
    this._heightValue = "500px";
    this._toolbarItems = TOOLBAR_ITEMS_DEFAULT;
    this._customPlugins = [];
    this._widgetRules = [];
  }
  get mode() {
    return this._mode;
  }
  set mode(value) {
    this._mode = value;
    if (this.viewer)
      return;
    if (this.editorObj) {
      this.editorObj.changeMode(value, false);
    }
  }
  get theme() {
    return this._theme;
  }
  set theme(value) {
    this._theme = value;
    if (!this.editor)
      return;
    this.renderEditor(true);
  }
  get previewStyle() {
    return this._previewStyle;
  }
  set previewStyle(value) {
    this._previewStyle = value;
    if (this.viewer)
      return;
    if (this.editorObj) {
      this.editorObj.changePreviewStyle(value);
    }
  }
  get viewer() {
    return this._viewer;
  }
  set viewer(value) {
    if (this._viewer === value)
      return;
    this._viewer = value;
    if (!this.editor)
      return;
    this.renderEditor(true);
  }
  get value() {
    return this._value;
  }
  set value(value) {
    this._value = value;
    const targetObj = this.viewer ? this.viewerObj : this.editorObj;
    if (targetObj) {
      targetObj.setMarkdown(value);
    }
  }
  get height() {
    return this._heightValue;
  }
  set height(value) {
    this._heightValue = value;
    if (this.viewer)
      return;
    if (this.editorObj) {
      this.editorObj.setHeight(value);
    }
  }
  get toolbarItems() {
    return this._toolbarItems || TOOLBAR_ITEMS_DEFAULT;
  }
  set toolbarItems(items) {
    this._toolbarItems = items;
    if (!this.editor)
      return;
    this.renderEditor(true);
  }
  get plugins() {
    return this._customPlugins || [];
  }
  set plugins(plugins) {
    this._customPlugins = plugins;
    if (!this.editor)
      return;
    this.renderEditor(true);
  }
  get widgetRules() {
    return this._widgetRules || [];
  }
  set widgetRules(rules) {
    this._widgetRules = rules;
    if (!this.editor)
      return;
    this.renderEditor(true);
  }
  static async create(options, parent) {
    let self = new this(parent, options);
    await self.ready();
    return self;
  }
  async loadLib() {
    return new Promise((resolve, reject) => {
      RequireJS.require(libs2, async (marked) => {
        resolve(marked);
      });
    });
  }
  async loadPlugin(plugin) {
    return new Promise((resolve, reject) => {
      RequireJS.require(plugin, async (marked) => {
        resolve(marked);
      });
    });
  }
  async loadPlugins() {
    for (const _plugin of libPlugins) {
      this.editorPlugins[_plugin.name] = await this.loadPlugin(_plugin.path);
    }
  }
  addCSS(href, name) {
    const css = document.head.querySelector(`[name="${name}"]`);
    if (css)
      return;
    let link = document.createElement("link");
    link.setAttribute("type", "text/css");
    link.setAttribute("rel", "stylesheet");
    link.setAttribute("name", name);
    link.href = href;
    document.head.append(link);
  }
  async initEditor() {
    for (const item of editorCSS) {
      this.addCSS(item.href, item.name);
    }
    this.editor = await this.loadLib();
    await this.loadPlugins();
    try {
      this.renderEditor();
    } catch (e) {
    }
  }
  renderEditor(valueChanged) {
    const editorPlugins = Object.values(this.editorPlugins);
    if (this.viewer) {
      if (this.editorObj) {
        this.editorObj.destroy();
      }
      if (!this.elm) {
        this.elm = this.createElement("div", this);
      } else {
        this.elm.innerHTML = "";
        this.elm.style.height = "auto";
      }
      this.viewerObj = this.editor.factory({
        el: this.elm,
        viewer: true,
        initialValue: this.value,
        theme: this.theme,
        plugins: [...editorPlugins, ...this.plugins],
        widgetRules: this.widgetRules
      });
    } else {
      if (this.viewerObj) {
        this.viewerObj.destroy();
      }
      if (!this.elm) {
        this.elm = this.createElement("div", this);
      } else {
        this.elm.innerHTML = "";
      }
      const currentValue = valueChanged && this.editorObj ? this.editorObj.getMarkdown() : this.value;
      this.editorObj = new this.editor({
        el: this.elm,
        previewStyle: this.previewStyle,
        height: this.height,
        initialEditType: this.mode,
        initialValue: currentValue,
        theme: this.theme,
        toolbarItems: this.toolbarItems,
        plugins: [...editorPlugins, ...this.plugins],
        widgetRules: this.widgetRules
      });
    }
  }
  getMarkdownValue() {
    if (this.editorObj && !this.viewer) {
      return this.editorObj.getMarkdown();
    }
    return "";
  }
  getEditorElm() {
    if (this.editorObj && !this.viewer) {
      return this.editorObj;
    }
    return null;
  }
  getViewerElm() {
    if (this.viewerObj && this.viewer) {
      return this.viewerObj;
    }
    return null;
  }
  async init() {
    super.init();
    const mode = this.getAttribute("mode", true, "");
    if (mode) {
      this._mode = mode;
    }
    const previewStyle = this.getAttribute("previewStyle", true, "");
    if (previewStyle) {
      this._previewStyle = previewStyle;
    }
    const value = this.getAttribute("value", true, "");
    if (value) {
      this._value = value;
    }
    const viewer = this.getAttribute("viewer", true, null);
    if (viewer !== null) {
      this.viewer = viewer;
    }
    const height = this.getAttribute("height", true, "");
    if (height) {
      this._heightValue = height;
    }
    const width = this.getAttribute("width", true, "");
    if (width) {
      this.width = width;
    }
    const theme = this.getAttribute("theme", true, "");
    if (theme) {
      this._theme = theme;
    }
    const toolbarItems = this.getAttribute("toolbarItems", true, "");
    if (toolbarItems) {
      this._toolbarItems = toolbarItems;
    }
    const plugins = this.getAttribute("plugins", true, "");
    if (plugins) {
      this._customPlugins = plugins;
    }
    const widgetRules = this.getAttribute("widgetRules", true, "");
    if (widgetRules) {
      this._widgetRules = widgetRules;
    }
    this.initEditor();
  }
};
MarkdownEditor = __decorateClass([
  customElements2("i-markdown-editor")
], MarkdownEditor);

// packages/modal/src/style/modal.css.ts
var Theme15 = theme_exports.ThemeVars;
var wrapperStyle = style({
  position: "fixed",
  left: 0,
  top: 0,
  width: "100%",
  height: "100%",
  backgroundColor: "rgba(12, 18, 52, 0.7)",
  opacity: 0,
  visibility: "hidden",
  transform: "scale(1.1)",
  transition: "visibility 0s linear .25s,opacity .25s 0s,transform .25s",
  zIndex: 1e3,
  overflow: "auto"
});
var noBackdropStyle = style({
  position: "inherit",
  top: 0,
  left: 0,
  opacity: 0,
  visibility: "hidden",
  transform: "scale(1.1)",
  transition: "visibility 0s linear .25s,opacity .25s 0s,transform .25s",
  zIndex: 1e3,
  overflow: "auto",
  width: "100%",
  maxWidth: "inherit",
  $nest: {
    ".modal": {
      margin: "0"
    }
  }
});
var visibleStyle = style({
  opacity: "1",
  visibility: "visible",
  transform: "scale(1)",
  transition: "visibility 0s linear 0s,opacity .25s 0s,transform .25s"
});
var modalStyle = style({
  fontFamily: "Helvetica",
  fontSize: "14px",
  padding: "10px 10px 5px 10px",
  backgroundColor: Theme15.background.modal,
  position: "relative",
  borderRadius: "2px",
  minWidth: "300px",
  width: "inherit",
  maxWidth: "100%"
});
var titleStyle = style({
  fontSize: "18px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  $nest: {
    "span": {
      color: Theme15.colors.primary.main
    },
    "i-icon": {
      display: "inline-block",
      cursor: "pointer"
    }
  }
});

// packages/modal/src/modal.ts
var Theme16 = theme_exports.ThemeVars;
var showEvent = new Event("show");
var Modal = class extends Container {
  constructor(parent, options) {
    super(parent, options, {
      showClose: true,
      showBackdrop: true,
      closeOnBackdropClick: true,
      popupPlacement: "center"
    });
  }
  get visible() {
    var _a;
    return ((_a = this.wrapperDiv) == null ? void 0 : _a.classList.contains(visibleStyle)) || false;
  }
  set visible(value) {
    var _a, _b;
    if (value) {
      this.wrapperDiv.classList.add(visibleStyle);
      this.dispatchEvent(showEvent);
      if (this.showBackdrop) {
        document.body.style.overflow = "hidden";
        const parentModal = (_a = this.parentElement) == null ? void 0 : _a.closest("i-modal");
        if (parentModal) {
          parentModal.wrapperDiv.style.overflow = "hidden";
          parentModal.wrapperDiv.scrollTop = 0;
        }
        this.wrapperDiv.style.overflow = "hidden auto";
      }
    } else {
      this.wrapperDiv.classList.remove(visibleStyle);
      if (this.showBackdrop) {
        const parentModal = (_b = this.parentElement) == null ? void 0 : _b.closest("i-modal");
        if (parentModal) {
          parentModal.wrapperDiv.style.overflow = "hidden auto";
          document.body.style.overflow = "hidden";
        } else {
          document.body.style.overflow = "hidden auto";
        }
      }
      this.onClose && this.onClose(this);
    }
  }
  get onOpen() {
    return this._onOpen;
  }
  set onOpen(callback) {
    this._onOpen = callback;
  }
  get title() {
    const titleElm = this.titleSpan.querySelector("span");
    return (titleElm == null ? void 0 : titleElm.innerHTML) || "";
  }
  set title(value) {
    const titleElm = this.titleSpan.querySelector("span");
    titleElm && (titleElm.innerHTML = value || "");
  }
  get popupPlacement() {
    return this._placement;
  }
  set popupPlacement(value) {
    this._placement = value;
  }
  get closeIcon() {
    return this._closeIcon;
  }
  set closeIcon(elm) {
    if (this._closeIcon && this.titleSpan.contains(this._closeIcon))
      this.titleSpan.removeChild(this._closeIcon);
    this._closeIcon = elm;
    if (this._closeIcon) {
      this._closeIcon.classList.add("i-modal-close");
      this._closeIcon.onClick = () => this.visible = false;
      this.titleSpan.appendChild(this._closeIcon);
    }
  }
  get closeOnBackdropClick() {
    return this._closeOnBackdropClick;
  }
  set closeOnBackdropClick(value) {
    this._closeOnBackdropClick = typeof value === "boolean" ? value : true;
  }
  get showBackdrop() {
    return this._showBackdrop;
  }
  set showBackdrop(value) {
    this._showBackdrop = typeof value === "boolean" ? value : true;
    if (this._showBackdrop) {
      this.wrapperDiv.classList.add(wrapperStyle);
      this.style.position = "unset";
    } else {
      this.style.position = "absolute";
      this.style.left = "0px";
      this.style.top = "0px";
      this.wrapperDiv.classList.add(noBackdropStyle);
    }
  }
  get item() {
    return this.modalDiv.children[0];
  }
  set item(value) {
    if (value instanceof Control) {
      this.modalDiv.innerHTML = "";
      value && this.modalDiv.appendChild(value);
    }
  }
  get position() {
    return this._wrapperPositionAt;
  }
  set position(value) {
    this._wrapperPositionAt = value;
  }
  positionAt(placement) {
    if (this.showBackdrop) {
      this.positionAtFix(placement);
    } else {
      this.positionAtAbsolute(placement);
    }
  }
  positionAtFix(placement) {
    let parent = document.body;
    let coords = this.getWrapperFixCoords(parent, placement);
    this.wrapperDiv.style.width = "100%";
    this.wrapperDiv.style.height = "100%";
    this.wrapperDiv.style.paddingLeft = coords.left + "px";
    this.wrapperDiv.style.paddingTop = coords.top + "px";
    const innerModal = this.querySelector("i-modal");
    if (innerModal) {
      innerModal.wrapperDiv.style.width = "0px";
      innerModal.wrapperDiv.style.height = "0px";
    }
  }
  positionAtAbsolute(placement) {
    let parent = this._parent || this.linkTo || this.parentElement || document.body;
    let coords;
    if (this.position === "fixed") {
      coords = this.getWrapperFixCoords(parent, placement);
    } else {
      coords = this.getWrapperAbsoluteCoords(parent, placement);
    }
    this.wrapperDiv.style.height = "inherit";
    this.wrapperDiv.style.width = "inherit";
    this.wrapperDiv.style.left = coords.left + "px";
    this.wrapperDiv.style.top = coords.top + "px";
  }
  getWrapperFixCoords(parent, placement) {
    const parentCoords = parent.getBoundingClientRect();
    let left = 0;
    let top = 0;
    const parentHeight = this.showBackdrop ? (parentCoords.height || window.innerHeight) - 1 : parentCoords.height;
    switch (placement) {
      case "center":
        top = parentHeight / 2 - this.modalDiv.offsetHeight / 2;
        left = parentCoords.width / 2 - this.modalDiv.offsetWidth / 2 - 1;
        break;
      case "top":
        top = this.showBackdrop ? 0 : parentCoords.top;
        left = parentCoords.left + (parent.offsetWidth - this.modalDiv.offsetWidth) / 2 - 1;
        break;
      case "topLeft":
        top = this.showBackdrop ? 0 : parentCoords.top;
        left = parentCoords.left;
        break;
      case "topRight":
        top = this.showBackdrop ? 0 : parentCoords.top;
        left = parentCoords.left + parent.offsetWidth - this.modalDiv.offsetWidth - 1;
        break;
      case "bottom":
        top = parentCoords.top + parentHeight;
        if (this.showBackdrop)
          top = top - this.modalDiv.offsetHeight - 1;
        left = parentCoords.left + (parent.offsetWidth - this.modalDiv.offsetWidth) / 2 - 1;
        break;
      case "bottomLeft":
        top = parentCoords.top + parentHeight;
        if (this.showBackdrop)
          top = top - this.modalDiv.offsetHeight;
        left = parentCoords.left;
        break;
      case "bottomRight":
        top = parentCoords.top + parentHeight;
        if (this.showBackdrop)
          top = top - this.modalDiv.offsetHeight;
        left = parentCoords.left + parent.offsetWidth - this.modalDiv.offsetWidth - 1;
        break;
      case "rightTop":
        top = parentCoords.top;
        left = parentCoords.right;
        if (parentCoords.right + this.modalDiv.offsetWidth > document.documentElement.clientWidth) {
          left = document.documentElement.clientWidth - this.modalDiv.offsetWidth;
        }
        break;
    }
    left = left < 0 ? parentCoords.left : left;
    top = top < 0 ? parentCoords.top : top;
    return { top, left };
  }
  getWrapperAbsoluteCoords(parent, placement) {
    const parentCoords = parent.getBoundingClientRect();
    let left = 0;
    let top = 0;
    switch (placement) {
      case "center":
        left = (parentCoords.width - this.modalDiv.offsetWidth) / 2;
        top = (parentCoords.height - this.modalDiv.offsetHeight) / 2;
        break;
      case "top":
      case "topLeft":
        top = this.getParentOccupiedTop();
        left = this.getParentOccupiedLeft();
        break;
      case "topRight":
        top = this.getParentOccupiedTop();
        left = parentCoords.width - this.getParentOccupiedRight() - this.modalDiv.offsetWidth;
        break;
      case "bottom":
      case "bottomLeft":
        left = 0;
        top = parentCoords.height;
        break;
      case "bottomRight":
        top = parentCoords.height;
        left = parentCoords.width - this.modalDiv.offsetWidth;
        break;
      case "rightTop":
        top = 0;
        left = parentCoords.width;
        break;
    }
    if (placement !== "bottomRight")
      left = left < 0 ? parentCoords.left : left;
    top = top < 0 ? parentCoords.top : top;
    return { top, left };
  }
  _handleOnShow(event) {
    if (this.popupPlacement && this.enabled)
      this.positionAt(this.popupPlacement);
    if (this.enabled && this._onOpen) {
      event.preventDefault();
      this._onOpen(this);
    }
  }
  _handleClick(event) {
    const target = event.target;
    if (this.closeOnBackdropClick) {
      if (!this.modalDiv.contains(target) && this.visible)
        this.visible = false;
    }
    return true;
  }
  updateModal(name, value) {
    if (!isNaN(Number(value)))
      this.modalDiv.style[name] = value + "px";
    else
      this.modalDiv.style[name] = value;
  }
  refresh() {
    super.refresh(true);
    if (this.visible && this.popupPlacement) {
      this.positionAt(this.popupPlacement);
    }
  }
  get background() {
    return this._background;
  }
  set background(value) {
    if (!this._background) {
      this._background = new Background(this.modalDiv, value);
    } else {
      this._background.setBackgroundStyle(value);
    }
  }
  get width() {
    return !isNaN(this._width) ? this._width : this.offsetWidth;
  }
  set width(value) {
    this._width = value;
    this.updateModal("width", value);
  }
  get border() {
    return this._border;
  }
  set border(value) {
    this._border = new Border(this.modalDiv, value);
  }
  init() {
    var _a;
    if (!this.wrapperDiv) {
      if ((_a = this.options) == null ? void 0 : _a.onClose)
        this.onClose = this.options.onClose;
      this.popupPlacement = this.getAttribute("popupPlacement", true);
      this.closeOnBackdropClick = this.getAttribute("closeOnBackdropClick", true);
      this.wrapperDiv = this.createElement("div", this);
      this.showBackdrop = this.getAttribute("showBackdrop", true);
      this.modalDiv = this.createElement("div", this.wrapperDiv);
      this.titleSpan = this.createElement("div", this.modalDiv);
      this.titleSpan.classList.add(titleStyle, "i-modal_header");
      this.createElement("span", this.titleSpan);
      this.title = this.getAttribute("title", true);
      const closeIconAttr = this.getAttribute("closeIcon", true);
      if (closeIconAttr) {
        closeIconAttr.height = closeIconAttr.height || "16px";
        closeIconAttr.width = closeIconAttr.width || "16px";
        closeIconAttr.fill = closeIconAttr.fill || Theme16.colors.primary.main;
        this.closeIcon = new Icon(void 0, closeIconAttr);
      }
      while (this.childNodes.length > 1) {
        this.modalDiv.appendChild(this.childNodes[0]);
      }
      this.modalDiv.classList.add(modalStyle);
      this.modalDiv.classList.add("modal");
      this.addEventListener("show", this._handleOnShow.bind(this));
      window.addEventListener("keydown", (event) => {
        if (!this.visible)
          return;
        if (event.key === "Escape") {
          this.visible = false;
        }
      });
      document.body.addEventListener("click", (event) => {
        if (!this.visible || this.showBackdrop || !this.closeOnBackdropClick)
          return;
        const target = event.target;
        let parent = this._parent || this.linkTo || this.parentElement;
        if (!this.modalDiv.contains(target) && !(parent == null ? void 0 : parent.contains(target))) {
          this.visible = false;
        }
      });
      const itemAttr = this.getAttribute("item", true);
      if (itemAttr)
        this.item = itemAttr;
      super.init();
      this.maxWidth && this.updateModal("maxWidth", this.maxWidth);
      this.minWidth && this.updateModal("minWidth", this.minWidth);
      this.minHeight && this.updateModal("minHeight", this.minHeight);
      this.maxHeight && this.updateModal("maxHeight", this.maxHeight);
      let border = this.getAttribute("border", true);
      if (border) {
        this._border = new Border(this.modalDiv, border);
        this.style.border = "none";
      }
    }
  }
  static async create(options, parent) {
    let self = new this(parent, options);
    await self.ready();
    return self;
  }
};
Modal = __decorateClass([
  customElements2("i-modal")
], Modal);

// packages/menu/src/style/menu.css.ts
var Theme17 = theme_exports.ThemeVars;
var fadeInRight = keyframes({
  "0%": {
    opacity: 0,
    transform: "translate3d(100%, 0, 0)"
  },
  "100%": {
    opacity: 1,
    transform: "translate3d(0, 0, 0)"
  }
});
var menuStyle = style({
  fontFamily: Theme17.typography.fontFamily,
  fontSize: Theme17.typography.fontSize,
  position: "relative",
  display: "block",
  overflow: "hidden",
  $nest: {
    "*": {
      boxSizing: "border-box"
    },
    ".menu": {
      display: "block",
      margin: 0,
      padding: 0,
      listStyle: "none"
    },
    ".menu-horizontal": {
      display: "flex",
      flexWrap: "nowrap"
    },
    ".menu-inline": {
      $nest: {
        ".menu-item": {
          paddingLeft: "calc(1.5rem + var(--menu-item-level, 0) * 1rem)"
        },
        ".menu-item-arrow": {
          marginTop: "-14px",
          right: "6px",
          padding: "8px"
        },
        ".menu-item-arrow-active": {
          transform: "rotate(180deg)",
          transition: "transform 0.25s",
          fill: `${Theme17.text.primary} !important`
        },
        "li": {
          position: "relative",
          $nest: {
            "&:hover": {
              $nest: {
                ".menu-item": {
                  color: Theme17.colors.primary.main
                },
                ".menu-item-arrow-active": {
                  fill: "currentColor !important"
                }
              }
            }
          }
        }
      }
    }
  }
});
var meunItemStyle = style({
  position: "relative",
  display: "block",
  color: Theme17.text.secondary,
  $nest: {
    ".menu-item": {
      position: "relative",
      display: "inline-flex",
      padding: "0 1.5rem",
      border: 0,
      borderRadius: 5,
      cursor: "pointer",
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
      lineHeight: "36px",
      width: "100%",
      alignItems: "center"
    },
    "&:not(.hide-arrow-icon) .menu-item.has-children": {
      paddingRight: "2.25rem"
    },
    ".menu-item.menu-active, .menu-item.menu-selected, .menu-item:hover": {
      background: Theme17.action.hover,
      color: Theme17.text.primary
    },
    ".menu-item.menu-active > .menu-item-arrow": {
      transform: "rotate(180deg)",
      transition: "transform 0.25s"
    },
    ".menu-item-arrow": {
      position: "absolute",
      top: "50%",
      right: 18,
      marginTop: -6,
      cursor: "pointer"
    },
    ".menu-item-icon": {
      display: "inline-block",
      verticalAlign: "middle",
      marginRight: "8px",
      textAlign: "center",
      fill: "currentColor",
      $nest: {
        "> i-image": {
          display: "flex"
        }
      }
    },
    "i-link, a": {
      display: "block"
    },
    "i-link > a": {
      textDecoration: "unset"
    },
    "i-link:hover *": {
      color: "unset"
    },
    "li": {
      listStyle: "none"
    },
    "&.hide-arrow-icon .menu-item-arrow": {
      display: "none"
    }
  }
});
var modalStyle2 = style({
  $nest: {
    ".reverse-menu": {
      display: "flex",
      flexDirection: "column-reverse"
    },
    "> div": {
      transform: "unset",
      transition: "background 0.2s cubic-bezier(0.4, 0, 1, 1), color 0.2s cubic-bezier(0.4, 0, 1, 1)",
      overflow: "visible"
    },
    ".modal": {
      background: "#252a48",
      minWidth: 0,
      padding: 0,
      borderRadius: "5px"
    }
  }
});

// packages/menu/src/menu.ts
var menuPopupTimeout = 150;
var Menu = class extends Control {
  constructor() {
    super(...arguments);
    this._oldWidth = 0;
  }
  get mode() {
    return this._mode;
  }
  set mode(value) {
    if (this._mode === value)
      return;
    if (this._mode) {
      this.menuElm.classList.remove(`menu-${this._mode}`);
    }
    this._mode = value;
    this.menuElm.classList.add(`menu-${this._mode}`);
    this.handleUpdateMode(value);
  }
  get data() {
    return this._data;
  }
  set data(value) {
    this.clear();
    this._data = value;
    this.renderItem(value);
  }
  get items() {
    return this._items;
  }
  set items(items) {
    this.clear();
    this._items = items;
  }
  get menuItems() {
    if (this.moreItem) {
      return [...this.items, ...this.moreItem.items];
    }
    return this.items;
  }
  clear() {
    this._items = [];
    this.itemsWidth = [];
    this.menuElm.innerHTML = "";
    if (this.moreItem)
      this.moreItem.items = [];
  }
  async renderItem(items) {
    const _items = [];
    const menuItemElm = [];
    for (const item of items) {
      const menuItem = await MenuItem.create({ ...item, linkTo: this, level: 0 }, this);
      menuItemElm.push(menuItem);
      _items.push(menuItem);
    }
    this.menuElm.innerHTML = "";
    this.menuElm.append(...menuItemElm);
    this._items = _items;
    if (this._mode === "horizontal")
      this.handleResize();
  }
  async handleUpdateMode(mode) {
    if (this._mode === "horizontal") {
      if (!this.moreItem) {
        this.moreItem = await MenuItem.create({ title: "\u22EF", linkTo: this, level: 0 });
        this.moreItem.classList.add("more-menu-item", "hide-arrow-icon");
      }
      window.addEventListener("resize", this.handleResize);
    } else {
      window.removeEventListener("resize", this.handleResize);
      if (this.moreItem)
        this.menuElm.removeChild(this.moreItem);
    }
  }
  onResize() {
    const newWidth = Math.ceil(window.innerWidth);
    let offsetWidth = Math.ceil(this.menuElm.offsetWidth);
    let scrollWidth = Math.ceil(this.menuElm.scrollWidth);
    if (this._oldWidth >= newWidth) {
      let i = this._items.length - 1;
      const tmpItems = [];
      while (scrollWidth > offsetWidth && i >= 0) {
        if (!this.menuElm.contains(this.moreItem)) {
          this.menuElm.appendChild(this.moreItem);
        }
        this.itemsWidth.push(this._items[i].offsetWidth);
        tmpItems.push(this._items[i]);
        this._items[i].level = 1;
        this.menuElm.removeChild(this._items[i]);
        this._items.splice(i, 1);
        offsetWidth = Math.ceil(this.menuElm.offsetWidth);
        scrollWidth = Math.ceil(this.menuElm.scrollWidth);
        i--;
      }
      if (tmpItems.length) {
        const moreItems = this.moreItem.items;
        this.moreItem.items = [...moreItems, ...tmpItems];
      }
    } else if (this._oldWidth <= newWidth && this.moreItem.items.length) {
      let i = this.moreItem.items.length - 1 || 0;
      let totalItemsWidth = this._items.reduce((prev, curr) => prev + Math.ceil(curr.offsetWidth), 0) + this.moreItem.offsetWidth + this.itemsWidth[0];
      let index = -1;
      while (totalItemsWidth <= offsetWidth && i >= 0) {
        index = i;
        const menuItem = this.moreItem.items[i];
        this.menuElm.insertBefore(menuItem, this.moreItem);
        this._items.push(menuItem);
        menuItem.level = 0;
        offsetWidth = Math.ceil(this.menuElm.offsetWidth);
        totalItemsWidth += this.itemsWidth.shift() || 0;
        i--;
      }
      if (index != -1) {
        this.moreItem.items = this.moreItem.items.slice(0, index);
      }
      if (!this.moreItem.items.length && this.menuElm.contains(this.moreItem)) {
        this.menuElm.removeChild(this.moreItem);
      }
    }
    this._oldWidth = newWidth;
  }
  handleResize() {
    setTimeout(() => {
      this.onResize();
    }, 200);
  }
  init() {
    if (!this.initialized) {
      super.init();
      this.classList.add(menuStyle);
      this.itemsWidth = [];
      this.handleResize = this.handleResize.bind(this);
      this.onResize = this.onResize.bind(this);
      this.menuElm = this.createElement("ul", this);
      this.menuElm.classList.add("menu");
      this.mode = this.getAttribute("mode", true, "horizontal");
      this.data = this.getAttribute("data", true, []);
      const items = this.getAttribute("items", true, []);
      if (items && items.length)
        this.items = items;
    }
  }
  disconnectedCallback() {
    window.removeEventListener("resize", this.handleResize);
  }
  static async create(options, parent) {
    let self = new this(parent, options);
    await self.ready();
    return self;
  }
};
Menu = __decorateClass([
  customElements2("i-menu")
], Menu);
var MenuItem = class extends Control {
  constructor(parent, options) {
    super(parent, options);
  }
  get title() {
    return this.captionElm.innerHTML;
  }
  set title(value) {
    this.captionElm.innerHTML = value || "";
  }
  get link() {
    if (!this._link) {
      this._link = Link.create({
        href: "#",
        target: "_self",
        font: this.font
      }, this);
    }
    return this._link;
  }
  set link(value) {
    if (this._link) {
      this._link.prepend(this.itemWrapperElm);
      this._link.remove();
    }
    this._link = value;
    if (this._link) {
      this._link.append(this.itemWrapperElm);
      this.itemElm.appendChild(this._link);
    }
  }
  get icon() {
    if (!this._icon) {
      this._icon = Icon.create({
        width: 16,
        height: 16
      }, this);
    }
    ;
    return this._icon;
  }
  set icon(elm) {
    if (this._icon)
      this.itemWrapperElm.removeChild(this._icon);
    this._icon = elm;
    this.icon.classList.add("menu-item-icon");
    if (this._icon)
      this.itemWrapperElm.prepend(this._icon);
  }
  get items() {
    return this._items;
  }
  set items(items) {
    this._items = items;
    this.renderArrowIcon();
    this.renderSubMenuItem();
  }
  set level(value) {
    this.updateLevel(value);
  }
  get selected() {
    return this.itemWrapperElm.classList.contains("menu-selected");
  }
  set selected(isSelected) {
    if (!this.itemWrapperElm)
      return;
    const isInline = this.menuMode() === "inline";
    if (isSelected) {
      this.itemWrapperElm.classList.add("menu-selected");
      if (this.arrowIcon && isInline) {
        this.arrowIcon.classList.add("menu-item-arrow-active");
      }
    } else {
      this.itemWrapperElm.classList.remove("menu-selected");
      if (this.arrowIcon && isInline) {
        this.arrowIcon.classList.remove("menu-item-arrow-active");
      }
    }
  }
  updateLevel(level) {
    if (this._linkTo) {
      this._level = level;
      if (this.modal) {
        this.modal.popupPlacement = this.getModalPlacement();
        if (this._level > 0) {
          this.modal.position = "absolute";
          this.appendChild(this.modal);
        } else {
          this.modal.position = "fixed";
          this.getModalContainer().appendChild(this.modal);
        }
      }
    }
  }
  menuMode() {
    let mode = "horizontal";
    if (this._linkTo) {
      mode = this._linkTo.mode;
    }
    return mode;
  }
  async renderArrowIcon() {
    const isInline = this.menuMode() === "inline";
    if (!this.arrowIcon) {
      this.arrowIcon = await Icon.create({
        width: isInline ? 30 : 12,
        height: isInline ? 30 : 12,
        name: "chevron-down",
        fill: "currentColor"
      });
      this.arrowIcon.classList.add("menu-item-arrow");
    }
    if (this._items && this._items.length) {
      if (!isInline && !this.itemWrapperElm.contains(this.arrowIcon)) {
        this.itemWrapperElm.appendChild(this.arrowIcon);
      } else if (isInline && !this.itemElm.contains(this.arrowIcon)) {
        this.itemElm.appendChild(this.arrowIcon);
      }
      this.itemWrapperElm.classList.add("has-children");
    } else {
      if (!isInline && this.itemWrapperElm.contains(this.arrowIcon)) {
        this.itemWrapperElm.removeChild(this.arrowIcon);
      } else if (isInline && this.itemElm.contains(this.arrowIcon)) {
        this.itemElm.removeChild(this.arrowIcon);
      }
      this.itemWrapperElm.classList.remove("has-children");
    }
  }
  renderSubMenuItem() {
    let mode = this.menuMode();
    if (mode === "inline") {
      this.itemWrapperElm.style.setProperty("--menu-item-level", this._level.toString());
      if (!this._items.length && !this.subMenu)
        return;
      this.itemElm.removeEventListener("mouseenter", this.handleModalOpen);
      this.itemElm.removeEventListener("mouseleave", this.handleModalClose);
      if (this.modal) {
        this.modal.removeEventListener("mouseenter", this.handleModalOpen);
        this.modal.removeEventListener("mouseleave", this.handleModalClose);
        this.modal.remove();
      }
      if (!this.subMenu) {
        this.subMenu = this.createElement("div", this);
        this.subMenu.classList.add("sub-menu");
        this.subMenu.style.display = "none";
      }
      this.subMenu.append(...this.items);
    } else {
      if (this.items && this.items.length) {
        this.itemElm.addEventListener("mouseenter", this.handleModalOpen);
        this.itemElm.addEventListener("mouseleave", this.handleModalClose);
      } else {
        this.itemElm.removeEventListener("mouseenter", this.handleModalOpen);
        this.itemElm.removeEventListener("mouseleave", this.handleModalClose);
      }
      if (this.subMenu) {
        this.subMenu.remove();
      }
      this.itemWrapperElm.style.removeProperty("--menu-item-level");
    }
  }
  async renderItemModal() {
    if (!this.modal) {
      const placement = this.getModalPlacement();
      this.modal = await Modal.create({
        showBackdrop: false,
        height: "auto",
        width: "auto",
        popupPlacement: placement
      });
      this.modal.linkTo = this;
      this.modal.visible = false;
      this.modal.classList.add("menu-item-modal", modalStyle2);
      this.modal.addEventListener("mouseenter", this.handleModalOpen);
      this.modal.addEventListener("mouseleave", this.handleModalClose);
      if (this._level > 0) {
        this.appendChild(this.modal);
      } else {
        this.modal.position = "fixed";
        this.getModalContainer().appendChild(this.modal);
      }
    }
    if (!this.itemPanel) {
      this.itemPanel = await Panel.create();
      if (this.className.includes("more-menu-item")) {
        this.itemPanel.classList.add("reverse-menu");
      }
    }
    this.itemPanel.innerHTML = "";
    if (this._items && this._items.length) {
      this.itemPanel.append(...this.items);
    }
    this.modal.item = this.itemPanel;
  }
  getModalPlacement() {
    let mode = this.menuMode();
    let placement = "bottomLeft";
    switch (mode) {
      case "vertical":
        placement = "rightTop";
        break;
      case "horizontal":
        placement = this._level > 0 ? "rightTop" : "bottomLeft";
    }
    return placement;
  }
  getModalContainer() {
    let span = document.getElementById("modal-container");
    if (!span) {
      span = this.createElement("span", document.body);
      span.id = "modal-container";
    }
    return span;
  }
  setSelectedItem() {
    if (this._linkTo) {
      let mode = this._linkTo.mode;
      this.selected = this.items && this.items.length ? !this.selected : true;
      if (this.subMenu) {
        this.subMenu.style.display = this.selected ? "block" : "none";
      }
      this.handleSelectItem(this._linkTo.menuItems, mode);
    } else {
      this.selected = true;
    }
  }
  handleSelectItem(items, mode) {
    items.forEach((item) => {
      const isCurrItem = item.isSameNode(this);
      if (isCurrItem)
        return;
      const containsItem = item.contains(this);
      if (!isCurrItem)
        item.selected = containsItem ? this.selected : false;
      if (mode === "inline" && item.subMenu && !containsItem) {
        item.subMenu.style.display = "none";
      }
      if (item.items)
        this.handleSelectItem(item.items, mode);
    });
  }
  _handleClick(event) {
    this.setSelectedItem();
    if (this._linkTo.onItemClick)
      this._linkTo.onItemClick(this._linkTo, this);
    return super._handleClick(event, true);
  }
  async handleModalOpen(event) {
    await this.renderItemModal();
    clearTimeout(this.closeTimeout);
    this.itemWrapperElm.classList.add("menu-active");
    this.openTimeout = setTimeout(() => {
      if (this._items && this._items.length)
        this.modal.visible = true;
    }, menuPopupTimeout);
  }
  handleModalClose(event) {
    clearTimeout(this.openTimeout);
    this.itemWrapperElm.classList.remove("menu-active");
    this.closeTimeout = setTimeout(() => {
      if (this.modal)
        this.modal.visible = false;
    }, menuPopupTimeout);
  }
  init() {
    if (!this.initialized) {
      super.init();
      this.classList.add(meunItemStyle);
      this.handleModalOpen = this.handleModalOpen.bind(this);
      this.handleModalClose = this.handleModalClose.bind(this);
      this.itemElm = this.createElement("li", this);
      this.itemWrapperElm = this.createElement("div", this.itemElm);
      this.itemWrapperElm.classList.add("menu-item");
      this.captionElm = this.createElement("span", this.itemWrapperElm);
      this.level = this.getAttribute("level", true, 0);
      this.title = this.getAttribute("title", true);
      const link = this.getAttribute("link", true);
      if (link) {
        link.target = link.target || "_self";
        this.link = new Link(this, link);
      }
      const icon = this.getAttribute("icon", true);
      if (icon) {
        icon.height = icon.height || "16px";
        icon.width = icon.width || "16px";
        this.icon = new Icon(this, icon);
      }
      ;
      const _items = this.getAttribute("items", true, []);
      const menuItems = [];
      for (const item of _items) {
        const menuItem = new MenuItem(void 0, { ...item, linkTo: this._linkTo, level: this._level + 1 });
        menuItems.push(menuItem);
      }
      this.items = menuItems;
    }
  }
  static async create(options, parent) {
    let self = new this(parent, options);
    await self.ready();
    return self;
  }
};
MenuItem = __decorateClass([
  customElements2("i-menu-item")
], MenuItem);

// packages/module/src/module.ts
function ProxySetter(obj, prop, value) {
  obj["__target"][prop] = value;
  return true;
}
function ProxyGetter(target, prop) {
  if (typeof target.__target[prop] == "function")
    return target.__target[prop].bind(target.__target);
  if (prop == "__target")
    return target["__target"];
  else if (prop == "__path")
    return target["__path"];
  else if (prop == "$renderElms" && target.__target)
    return target.__target["$renderElms"];
  let path;
  if (target.__root)
    path = [];
  else
    path = target.__path || [];
  path.push(prop);
  return ProxyObject({
    __target: target.__target,
    __path: path
  });
}
function ProxyObject(target, root) {
  if (target.__root)
    root = true;
  let path;
  if (root)
    path = [];
  else
    path = target.__path || [];
  if (target.__target)
    target = target.__target;
  return new Proxy({ __root: root, __target: target, __path: path }, {
    get: ProxyGetter,
    set: ProxySetter
  });
}
function getObservable(target, paths) {
  if (isObservable(target))
    return target;
  let path = paths.shift();
  if (paths.length == 0) {
    if (typeof target["observables"] == "function")
      return target["observables"](path);
    else if (path && typeof target == "object")
      return target[path];
  } else
    return getObservable(target[path], paths);
}
function bindObservable(elm, prop) {
  return function(changes) {
    elm[prop] = changes[0].value;
  };
}
var Module = class extends Container {
  constructor(parent, options, defaults) {
    super(parent, options, defaults);
    this.$renderElms = [];
    let proxy = ProxyObject(this, true);
    this.$render = this._render.bind(proxy);
  }
  static async create(options, parent, defaults) {
    let self = new this(parent, options, defaults);
    await self.ready();
    return self;
  }
  init() {
    super.init();
    this.$renderElms = [];
    let proxy = ProxyObject(this, true);
    let render = this.render.bind(proxy);
    let r = window["Render"];
    window["Render"] = this._render.bind(proxy);
    render();
    for (let i = 0; i < this.$renderElms.length; i++) {
      let elm = this.$renderElms[i].elm;
      let options = this.$renderElms[i].options;
      for (let prop in options) {
        let value = options[prop];
        if (value == null ? void 0 : value.__target) {
          let target = value.__target;
          let paths = value.__path;
          let targetValue = this.getAttributeValue(target, paths);
          let observable3 = getObservable(target, paths);
          if (isObservable(observable3)) {
            if (paths.length > 0)
              Observe(observable3, bindObservable(elm, prop), { path: paths.join(".") });
            else {
              Observe(observable3, bindObservable(elm, prop));
            }
          }
          elm[prop] = targetValue;
        }
      }
    }
    this.$renderElms = [];
    window["Render"] = r;
  }
  flattenArray(arr) {
    return arr.reduce((result, item) => {
      if (Array.isArray(item)) {
        const temp = this.flattenArray(item);
        result = result.concat(temp);
      } else {
        result.push(item);
      }
      return result;
    }, []);
  }
  _render(...params) {
    let tag = params[0];
    let options = params[1];
    let elm = this.createElement(tag);
    if (options) {
      this.$renderElms.push({
        elm,
        options
      });
      elm.attrs = options;
      for (let v in options) {
        if (v == "id") {
          this[options[v]] = elm;
          elm.id = options[v];
        } else if (typeof options[v] == "function")
          elm[v] = options[v].bind(this);
        else if (typeof options[v] != "object")
          elm.setAttribute(v, options[v]);
      }
    }
    const newParams = this.flattenArray(params);
    for (let i = 2; i < newParams.length; i++) {
      elm.appendChild(newParams[i]);
    }
    this.appendChild(elm);
    return elm;
  }
  render() {
  }
  onLoad() {
  }
  onShow(options) {
  }
  onHide() {
  }
};
Module = __decorateClass([
  customElements2("i-module")
], Module);

// packages/tree-view/src/style/treeView.css.ts
var Theme18 = theme_exports.ThemeVars;
cssRule("i-tree-view", {
  display: "block",
  overflowY: "auto",
  overflowX: "hidden",
  fontFamily: Theme18.typography.fontFamily,
  fontSize: Theme18.typography.fontSize,
  $nest: {
    ".i-tree-node_content": {
      display: "flex",
      alignItems: "center",
      paddingLeft: "1em",
      border: "1px solid transparent"
    },
    "> i-tree-node > .i-tree-node_content": {
      paddingLeft: 0
    },
    "i-tree-node": {
      display: "block",
      position: "relative"
    },
    "> i-tree-node:not(.has-children) .i-tree-node_icon:not(.custom-icon)": {
      display: "none"
    },
    "i-tree-node.is-checked > .i-tree-node_children": {
      display: "block"
    },
    "i-tree-node.is-checked > .i-tree-node_content > .i-tree-node_icon": {
      transform: "rotate(90deg)"
    },
    'input[type="checkbox"]': {
      position: "absolute",
      clip: "rect(0, 0, 0, 0)"
    },
    ".i-tree-node_children": {
      display: "none"
    },
    ".i-tree-node_label": {
      position: "relative",
      display: "inline-block",
      color: Theme18.text.primary,
      cursor: "pointer",
      fontSize: 14
    },
    ".i-tree-node_icon": {
      display: "inline-block",
      transition: "all ease 0.4s",
      $nest: {
        "svg": {
          width: 14,
          height: 14
        },
        "i-image": {
          display: "flex"
        },
        "&:not(.custom-icon)": {
          display: "none"
        }
      }
    },
    "input ~ .i-tree-node_icon:not(.custom-icon), input ~ .is-right > .i-tree-node_icon:not(.custom-icon)": {
      display: "inline-block"
    },
    "input ~ .i-tree-node_label": {
      maxWidth: "calc(100% - 15px)"
    },
    ".i-tree-node_icon + .i-tree-node_label": {
      paddingLeft: "0.3em"
    },
    "&.i-tree-view": {
      padding: 0,
      position: "relative",
      $nest: {
        ".is-checked:before": {
          borderLeft: `1px solid ${Theme18.divider}`,
          height: "calc(100% - 1em)",
          top: "1em"
        },
        ".i-tree-node_children > .is-checked:before": {
          height: "calc(100% - 25px)",
          top: 25
        },
        "i-tree-node.active > .i-tree-node_content": {
          backgroundColor: Theme18.action.selected,
          border: `1px solid ${Theme18.colors.info.dark}`,
          color: Theme18.text.primary
        },
        ".i-tree-node_content:hover": {
          backgroundColor: Theme18.action.hover,
          $nest: {
            "> .is-right .button-group *": {
              display: "inline-flex"
            },
            ".hide-on-show": {
              display: "none !important"
            }
          }
        },
        'input[type="checkbox"]': {
          margin: 0
        },
        ".i-tree-node_label": {
          padding: ".2rem .3rem .2em 0",
          maxWidth: "calc(100% - 30px)",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis"
        }
      }
    },
    "&.shown-line": {
      $nest: {
        "> i-tree-node.has-children": {
          marginLeft: "1em"
        },
        "input ~ .i-tree-node_label:before": {
          background: Theme18.colors.primary.main,
          color: Theme18.colors.primary.contrastText,
          position: "relative",
          zIndex: "1",
          float: "left",
          margin: "0 1em 0 -2em",
          width: "1em",
          height: "1em",
          borderRadius: "0.2em",
          content: "'+'",
          textAlign: "center",
          lineHeight: ".9em"
        },
        "input:checked ~ .i-tree-node_label:before": {
          content: "'\u2013'"
        },
        "i-tree-node": {
          padding: "0 0 1em 1em",
          $nest: {
            "&.active": {
              $nest: {
                "> .i-tree-node_label": {
                  color: "#55f"
                }
              }
            }
          }
        },
        ".i-tree-node_children i-tree-node": {
          padding: ".5em 0 0 .9em"
        },
        "i-tree-node:last-of-type:before": {
          height: "1em",
          bottom: "auto"
        },
        " i-tree-node:before": {
          position: "absolute",
          top: "0",
          bottom: "0",
          left: "-.1em",
          display: "block",
          width: "1px",
          borderLeft: `1px solid ${Theme18.divider}`,
          content: "''"
        },
        ".i-tree-node_icon:not(.custom-icon)": {
          display: "none"
        },
        ".i-tree-node_content": {
          paddingLeft: `0 !important`
        },
        "i-tree-node .i-tree-node_label:after": {
          position: "absolute",
          top: ".25em",
          left: "-1em",
          display: "block",
          height: "0.5em",
          width: "1em",
          borderBottom: `1px solid ${Theme18.divider}`,
          borderLeft: `1px solid ${Theme18.divider}`,
          borderRadius: " 0 0 0 0",
          content: "''"
        },
        "i-tree-node input:checked ~ .i-tree-node_label:after": {
          borderRadius: "0 .1em 0 0",
          borderTop: `1px solid ${Theme18.divider}`,
          borderRight: `0.5px solid ${Theme18.divider}`,
          borderBottom: "0",
          borderLeft: "0",
          bottom: "0",
          height: "auto",
          top: ".5em"
        },
        ".i-tree-node_label": {
          overflow: "unset"
        }
      }
    },
    ".text-input": {
      border: "none",
      outline: "0",
      height: "100%",
      width: "100%",
      $nest: {
        "&:focus": {
          borderBottom: `2px solid ${Theme18.colors.primary.main}`
        }
      }
    },
    ".button-group": {
      display: "inline-flex",
      alignItems: "center",
      position: "relative",
      zIndex: 999,
      transition: ".3s all ease",
      gap: 5,
      cursor: "pointer",
      marginLeft: 5,
      $nest: {
        "*": {
          display: "none"
        }
      }
    },
    ".is-right": {
      marginLeft: "auto",
      width: "auto"
    }
  }
});

// packages/tree-view/src/treeView.ts
var Theme19 = theme_exports.ThemeVars;
var beforeExpandEvent = new Event("beforeExpand");
var defaultIcon3 = {
  name: "caret-right",
  fill: Theme19.text.secondary,
  width: 12,
  height: 12
};
var TreeView = class extends Control {
  constructor(parent, options) {
    super(parent, options, {
      editable: false
    });
    this._items = [];
    this._alwaysExpanded = false;
  }
  get activeItem() {
    return this._activeItem;
  }
  set activeItem(value) {
    this._activeItem = value;
    const treeNodes = Array.from(this.querySelectorAll("i-tree-node"));
    treeNodes.forEach((treeNode) => treeNode.active = false);
    if (value)
      value.active = true;
  }
  get alwaysExpanded() {
    return this._alwaysExpanded;
  }
  set alwaysExpanded(value) {
    this._alwaysExpanded = value;
  }
  get data() {
    return this._items.map((node) => node.data);
  }
  set data(value) {
    this.clear();
    this.renderTree(value);
  }
  get items() {
    return this._items || [];
  }
  get editable() {
    return this._editable;
  }
  set editable(value) {
    this._editable = value;
  }
  get actionButtons() {
    return this._actionButtons;
  }
  set actionButtons(value) {
    this._actionButtons = value;
    const groups = Array.from(this.querySelectorAll(".button-group"));
    if (groups && groups.length) {
      groups.forEach((group) => {
        this.renderActions(group);
      });
    }
  }
  add(parentNode, caption) {
    const childData = { caption, children: [] };
    const childNode = new TreeNode(this, { ...childData });
    this.initNode(childNode);
    childNode.editable = this.editable;
    childNode.alwaysExpanded = this.alwaysExpanded;
    if (this.onRenderNode)
      this.onRenderNode(this, childNode);
    if (parentNode) {
      parentNode.appendNode(childNode);
      const parentContent = parentNode.querySelector(".i-tree-node_content");
      const childContent = childNode.querySelector(".i-tree-node_content");
      if (parentContent && childContent) {
        const parentLeft = parentContent.style.paddingLeft || 0;
        childContent.style.paddingLeft = `calc(${parentLeft} + 1em)`;
      }
    } else {
      this.appendChild(childNode);
    }
    return childNode;
  }
  delete(node) {
    node.remove();
  }
  clear() {
    this.clearInnerHTML();
    this._items = [];
  }
  _setActiveItem(node, event) {
    const prevNode = this.activeItem;
    this.activeItem = node;
    if (event && typeof this.onActiveChange === "function") {
      this.onActiveChange(this, prevNode, event);
    }
    ;
  }
  handleMouseEnter(node) {
    const fn = this.onMouseEnterNode;
    if (fn && typeof fn === "function")
      fn(this, node);
  }
  handleMouseLeave(node) {
    const fn = this.onMouseLeaveNode;
    if (fn && typeof fn === "function")
      fn(this, node);
  }
  handleLazyLoad(node) {
    const fn = this.onLazyLoad;
    if (fn && typeof fn === "function")
      fn(this, node);
  }
  initNode(node) {
    this.registerEvents(node);
    const groupElm = node.querySelector(".button-group");
    if (this.actionButtons)
      this.renderActions(groupElm);
  }
  registerEvents(node) {
    node.addEventListener("mouseenter", () => this.handleMouseEnter(node));
    node.addEventListener("mouseleave", () => this.handleMouseLeave(node));
    node.addEventListener("beforeExpand", (event) => this.handleLazyLoad(node));
    this.onRenderNode && this.onRenderNode(this, node);
  }
  renderTreeNode(node, parent, paths = [], level) {
    const treeNode = new TreeNode(parent, node);
    treeNode.editable = this.editable;
    this.initNode(treeNode);
    const treeContent = treeNode.querySelector(".i-tree-node_content");
    treeContent && (treeContent.style.paddingLeft = `${level}em`);
    const name = node.caption || "";
    if (node.children) {
      paths.push({ name });
      if (!node.isLazyLoad) {
        for (const child2 of node.children) {
          const childWrapper = treeNode.querySelector(".i-tree-node_children");
          if (childWrapper) {
            const childNode = this.renderTreeNode(child2, parent, paths, level + 1);
            childWrapper && childWrapper.appendChild(childNode);
          }
        }
      }
    } else {
    }
    return treeNode;
  }
  renderTree(value) {
    if (!value || !value.length)
      return;
    for (const node of value) {
      let treeNode = this.renderTreeNode(node, this, [], 0);
      this.appendChild(treeNode);
      const activedNodes = treeNode.querySelectorAll(".active");
      if (activedNodes.length) {
        const activedNode = activedNodes[activedNodes.length - 1];
        treeNode.expanded = true;
        const treeNodes = Array.from(treeNode.querySelectorAll("i-tree-node.has-children"));
        treeNodes.forEach((treeNode2) => {
          if (treeNode2.contains(activedNode))
            treeNode2.expanded = true;
        });
        this.activeItem = activedNode;
      }
      this._items.push(treeNode);
    }
  }
  renderActions(group) {
    if (!group)
      return;
    group.innerHTML = "";
    this.actionButtons.forEach((button) => {
      const buttonElm = new Button(void 0, button);
      if (this.onActionButtonClick && typeof this.onActionButtonClick === "function")
        buttonElm.onClick = (source, event) => {
          var _a;
          event.preventDefault();
          event.stopImmediatePropagation();
          const node = buttonElm.closest("i-tree-node");
          if (node && !((_a = this.activeItem) == null ? void 0 : _a.isSameNode(node)))
            this.activeItem = node;
          this.onActionButtonClick(this, buttonElm, event);
        };
      group.appendChild(buttonElm);
    });
  }
  init() {
    var _a;
    if (!this.initialized) {
      super.init();
      this.classList.add("i-tree-view");
      if ((_a = this.options) == null ? void 0 : _a.onRenderNode)
        this.onRenderNode = this.options.onRenderNode;
      this.alwaysExpanded = this.getAttribute("alwaysExpanded", true, false);
      this.editable = this.getAttribute("editable", true, false);
      this.actionButtons = this.getAttribute("actionButtons", true);
      this.data = this.getAttribute("data", true);
      const activeAttr = this.getAttribute("activeItem", true);
      activeAttr && (this.activeItem = activeAttr);
    }
  }
  static async create(options, parent) {
    let self = new this(parent, options);
    await self.ready();
    return self;
  }
};
TreeView = __decorateClass([
  customElements2("i-tree-view")
], TreeView);
var TreeNode = class extends Control {
  constructor(parent, options) {
    super(parent, options);
    this._editable = false;
    this._alwaysExpanded = false;
    options && (this.data = options);
    this.handleEdit = this.handleEdit.bind(this);
  }
  get data() {
    return this._data;
  }
  set data(value) {
    this._data = value;
  }
  get caption() {
    return this._caption;
  }
  set caption(value) {
    this._caption = value;
    if (this._captionElm)
      this._captionElm.innerHTML = value;
  }
  get collapsible() {
    return this._collapsible;
  }
  set collapsible(value) {
    if (typeof value === "boolean") {
      this._collapsible = value;
    } else {
      this._collapsible = true;
    }
  }
  get expanded() {
    return this._expanded;
  }
  set expanded(value) {
    if (typeof value === "boolean") {
      this._expanded = value;
      if (this._expandElm)
        this._expandElm.checked = value;
      if (this._expanded)
        this.classList.add("is-checked");
      else
        this.classList.remove("is-checked");
    } else {
      this._expanded = false;
      if (this._expandElm)
        this._expandElm.checked = false;
      this.classList.remove("is-checked");
    }
  }
  get alwaysExpanded() {
    return this._alwaysExpanded;
  }
  set alwaysExpanded(value) {
    this._alwaysExpanded = value;
  }
  get active() {
    return this._active;
  }
  set active(value) {
    if (typeof value === "boolean") {
      this._active = value;
      this.active ? this.classList.add("active") : this.classList.remove("active");
    } else {
      this._active = false;
      this.classList.remove("active");
    }
  }
  get isLazyLoad() {
    return this._isLazyLoad;
  }
  set isLazyLoad(value) {
    this._isLazyLoad = value;
  }
  get editable() {
    return this._editable;
  }
  set editable(value) {
    this._editable = value;
  }
  get rootParent() {
    return this.closest("i-tree-view");
  }
  get icon() {
    if (!this._iconElm) {
      this._iconElm = Icon.create(defaultIcon3);
    }
    ;
    return this._iconElm;
  }
  get rightIcon() {
    if (!this._iconRightElm)
      this._iconRightElm = Icon.create(defaultIcon3);
    return this._iconRightElm;
  }
  handleChange(target, oldValue, newValue) {
    const fn = this.rootParent.onChange;
    if (fn && typeof fn === "function")
      fn(this.rootParent, target, oldValue, newValue);
  }
  renderEditMode() {
    const captionInput = this.createElement("input");
    captionInput.value = this.caption;
    captionInput.classList.add("text-input");
    this._captionElm.innerHTML = "";
    this._captionElm.appendChild(captionInput);
    captionInput.focus();
    this.click();
    let isUpdating = false;
    const updateCaption = () => {
      const newValue = captionInput.value;
      if (newValue !== this.caption)
        this.handleChange(this, this.caption, newValue);
      this.caption = newValue;
    };
    captionInput.addEventListener("blur", (event) => {
      event.preventDefault();
      if (isUpdating)
        return;
      updateCaption();
    });
    captionInput.addEventListener("keyup", (event) => {
      event.preventDefault();
      if (event.key === "Enter" || event.keyCode === 13) {
        isUpdating = true;
        updateCaption();
        isUpdating = false;
      }
    });
  }
  handleEdit(event) {
    event.stopImmediatePropagation();
    event.preventDefault();
    this.renderEditMode();
  }
  edit() {
    this.editable = true;
    this.renderEditMode();
  }
  appendNode(childNode) {
    if (!this._childNodeElm)
      this.initChildNodeElm();
    this._childNodeElm.appendChild(childNode);
    if (!this.data.children)
      this.data.children = [];
    this.data.children.push(childNode.data);
  }
  initChildNodeElm() {
    this.classList.add("has-children");
    this._expandElm = this.createElement("input", this._wrapperElm);
    this._expandElm.type = "checkbox";
    if (this.expanded)
      this._expandElm.checked = true;
    if (this._iconElm)
      this._wrapperElm.insertBefore(this._expandElm, this._iconElm);
    else
      this._wrapperElm.insertBefore(this._expandElm, this._captionElm);
    this._childNodeElm = this.createElement("div", this);
    this._childNodeElm.classList.add("i-tree-node_children");
  }
  _handleClick(event) {
    const target = event.target;
    if (this.collapsible && this._expandElm) {
      this._expandElm.checked = !this._expandElm.checked;
      if (this._expandElm.checked)
        this.classList.add("is-checked");
      else if (!this.alwaysExpanded)
        this.classList.remove("is-checked");
    }
    ;
    const parent = this._parent || target.closest("i-tree-view");
    if (parent instanceof TreeView) {
      parent._setActiveItem(this, event);
      if (parent.onClick)
        parent.onClick(parent, event);
    }
    if (this.isLazyLoad) {
      this.dispatchEvent(beforeExpandEvent);
    }
    return super._handleClick(event, true);
  }
  _handleDblClick(event) {
    const target = event.target;
    const parent = this._parent || target.closest("i-tree-view");
    if (this.editable) {
      this.handleEdit(event);
    } else if (parent instanceof TreeView) {
      if (parent.onDblClick)
        parent.onDblClick(parent, event);
    }
    ;
    return super._handleClick(event, true);
  }
  _handleContextMenu(event) {
    const target = event.target;
    const parent = this._parent || target.closest("i-tree-view");
    if (parent instanceof TreeView) {
      if (parent.onContextMenu)
        parent.onContextMenu(parent, event);
    }
    return super._handleClick(event, true);
  }
  init() {
    var _a, _b;
    if (!this._captionElm) {
      this.classList.add("i-tree-node");
      this.data = this.options;
      let caption = this.getAttribute("caption", true, "");
      let icon = this.getAttribute("icon", true);
      let rightIcon = this.getAttribute("rightIcon", true);
      let collapsible = this.getAttribute("collapsible", true);
      let expanded = this.getAttribute("expanded", true);
      let active = this.getAttribute("active", true, false);
      let isLazyLoad = this.getAttribute("isLazyLoad", true, false);
      this.collapsible = collapsible;
      this.expanded = expanded;
      this.active = active;
      this.isLazyLoad = isLazyLoad;
      this._wrapperElm = this.createElement("div", this);
      this._wrapperElm.classList.add("i-tree-node_content");
      const iconData = icon || defaultIcon3;
      iconData.height = iconData.height || "12px";
      iconData.width = iconData.width || "12px";
      this._iconElm = new Icon(void 0, iconData);
      this._iconElm.classList.add("i-tree-node_icon");
      icon && this._iconElm.classList.add("custom-icon");
      this._wrapperElm.appendChild(this._iconElm);
      this._captionElm = this.createElement("label", this._wrapperElm);
      this._captionElm.classList.add("i-tree-node_label");
      this.caption = caption;
      const rightWrap = this.createElement("div", this._wrapperElm);
      rightWrap.classList.add("is-right");
      const actionGroup = this.createElement("div", rightWrap);
      actionGroup.classList.add("button-group");
      if (rightIcon) {
        rightIcon.height = rightIcon.height || "12px";
        rightIcon.width = rightIcon.width || "12px";
        this._iconRightElm = new Icon(void 0, rightIcon);
        this._iconRightElm.classList.add("i-tree-node_icon");
        rightIcon && this._iconRightElm.classList.add("custom-icon");
        rightWrap.appendChild(this._iconRightElm);
        rightWrap.insertBefore(this._iconRightElm, actionGroup);
      }
      if ((_b = (_a = this.data) == null ? void 0 : _a.children) == null ? void 0 : _b.length)
        this.initChildNodeElm();
    }
    super.init();
  }
  static async create(options, parent) {
    let self = new this(parent, options);
    await self.ready();
    return self;
  }
};
TreeNode = __decorateClass([
  customElements2("i-tree-node")
], TreeNode);

// packages/switch/src/style/switch.css.ts
var Theme20 = theme_exports.ThemeVars;
cssRule("i-switch", {
  display: "block",
  fontFamily: Theme20.typography.fontFamily,
  fontSize: Theme20.typography.fontSize,
  $nest: {
    ".wrapper": {
      width: "48px",
      height: "22px",
      position: "relative",
      display: "inline-flex",
      flexShrink: 0,
      overflow: "hidden",
      zIndex: 0,
      verticalAlign: "middle"
    },
    ".switch-base": {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      outline: 0,
      border: 0,
      margin: 0,
      cursor: "pointer",
      userSelect: "none",
      verticalAlign: "middle",
      textDecoration: "none",
      padding: "1px",
      borderRadius: "50%",
      position: "absolute",
      top: 0,
      bottom: 0,
      left: 0,
      zIndex: 1,
      color: "#fff",
      transition: "left 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,transform 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
      $nest: {
        "&.checked": {
          transform: "translateX(26px)",
          $nest: {
            ".thumb:before": {
              backgroundImage: "var(--checked-background)"
            },
            ".thumb-text:before": {
              content: "var(--thumb-checked-text)"
            },
            "+.track": {
              backgroundColor: "#1976d2",
              $nest: {
                "&::before": {
                  opacity: 1
                },
                "&::after": {
                  opacity: 0
                }
              }
            }
          }
        }
      }
    },
    input: {
      position: "absolute",
      top: 0,
      left: "-100%",
      width: "300%",
      height: "100%",
      opacity: 0,
      margin: 0,
      padding: 0,
      cursor: "inherit",
      zIndex: 1
    },
    ".thumb": {
      width: "16px",
      height: "16px",
      margin: "2px",
      backgroundColor: "currentColor",
      borderRadius: "50%",
      boxShadow: "none"
    },
    ".thumb:before": {
      content: '""',
      position: "absolute",
      width: "100%",
      height: "100%",
      left: 0,
      top: 0,
      backgroundRepeat: "no-repeat",
      backgroundPosition: "center",
      backgroundSize: "14px",
      backgroundImage: "var(--background)"
    },
    ".thumb.thumb-text:before": {
      content: "var(--thumb-text)",
      position: "absolute",
      width: "inherit",
      height: "inherit",
      top: "auto",
      left: "auto",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "#fff"
    },
    ".track": {
      width: "100%",
      height: "100%",
      zIndex: -1,
      borderRadius: "11px",
      backgroundColor: "#000",
      transition: "opacity 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,background-color 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
      $nest: {
        "&::before": {
          content: "var(--checked-text)",
          position: "absolute",
          left: "4px",
          top: "calc(50% - 0.6px)",
          transform: "translateY(-50%)",
          fontSize: "10px",
          color: "white",
          opacity: 0
        },
        "&::after": {
          content: "var(--text)",
          position: "absolute",
          right: "6px",
          top: "calc(50% - 0.6px)",
          transform: "translateY(-50%)",
          fontSize: "10px",
          color: "white",
          opacity: 1
        }
      }
    }
  }
});

// packages/switch/src/switch.ts
var Switch = class extends Control {
  constructor(parent, options) {
    super(parent, options);
  }
  get checked() {
    return this._checked;
  }
  set checked(value) {
    if (this._checked === value)
      return;
    this._checked = value;
    this._checked ? this.switchBaseElm.classList.add("checked") : this.switchBaseElm.classList.remove("checked");
    if (this._checked) {
      if (this.checkedThumbColor)
        this.switchBaseElm.style.color = this.checkedThumbColor;
      if (this.checkedTrackColor)
        this.trackElm.style.backgroundColor = this.checkedTrackColor;
    } else {
      if (this.uncheckedThumbColor)
        this.switchBaseElm.style.color = this.uncheckedThumbColor;
      if (this.uncheckedTrackColor)
        this.trackElm.style.backgroundColor = this.uncheckedTrackColor;
    }
  }
  get checkedThumbColor() {
    return this._checkedThumbColor;
  }
  set checkedThumbColor(value) {
    if (this._checkedThumbColor === value)
      return;
    this._checkedThumbColor = value;
    if (this._checked) {
      this.switchBaseElm.style.color = this.checkedThumbColor;
    }
  }
  get uncheckedThumbColor() {
    return this._uncheckedThumbColor;
  }
  set uncheckedThumbColor(value) {
    if (this._uncheckedThumbColor === value)
      return;
    this._uncheckedThumbColor = value;
    if (!this._checked) {
      this.switchBaseElm.style.color = value;
    }
  }
  get checkedTrackColor() {
    return this._checkedTrackColor;
  }
  set checkedTrackColor(value) {
    if (this._checkedTrackColor === value)
      return;
    this._checkedTrackColor = value;
    if (this._checked) {
      this.trackElm.style.backgroundColor = value;
    }
  }
  get uncheckedTrackColor() {
    return this._uncheckedTrackColor;
  }
  set uncheckedTrackColor(value) {
    if (this._uncheckedTrackColor === value)
      return;
    this._uncheckedTrackColor = value;
    if (!this._checked) {
      this.trackElm.style.backgroundColor = value;
    }
  }
  get checkedText() {
    return this._checkedText;
  }
  set checkedText(value) {
    this._checkedText = value;
    this.trackElm.style.setProperty("--checked-text", `"${value}"`);
  }
  get uncheckedText() {
    return this._uncheckedText;
  }
  set uncheckedText(value) {
    this._uncheckedText = value;
    this.trackElm.style.setProperty("--text", `"${value}"`);
  }
  get checkedThumbText() {
    return this._checkedThumbText;
  }
  set checkedThumbText(value) {
    this._checkedThumbText = value;
    this.thumbElm.classList.add("thumb-text");
    this.thumbElm.style.setProperty("--thumb-text", `'${value || ""}'`);
  }
  get uncheckedThumbText() {
    return this._uncheckedThumbText;
  }
  set uncheckedThumbText(value) {
    this._uncheckedThumbText = value;
    this.thumbElm.classList.add("thumb-text");
    this.thumbElm.style.setProperty("--thumb-checked-text", `'${value || ""}'`);
  }
  setAttributeToProperty(propertyName) {
    const prop = this.getAttribute(propertyName, true);
    if (prop)
      this[propertyName] = prop;
  }
  _handleClick(event) {
    if (!this.onClick) {
      this.checked = !this.checked;
      if (this.onChanged)
        this.onChanged(this, event);
    }
    return super._handleClick(event, true);
  }
  init() {
    if (!this.wrapperElm) {
      this.wrapperElm = this.createElement("div", this);
      this.wrapperElm.classList.add("wrapper");
      this.switchBaseElm = this.createElement("div");
      this.switchBaseElm.classList.add("switch-base");
      this.wrapperElm.appendChild(this.switchBaseElm);
      this.trackElm = this.createElement("div");
      this.trackElm.classList.add("track");
      this.wrapperElm.appendChild(this.trackElm);
      this.inputElm = this.createElement("input");
      this.inputElm.setAttribute("type", "checkbox");
      this.switchBaseElm.appendChild(this.inputElm);
      this.thumbElm = this.createElement("div");
      this.thumbElm.classList.add("thumb");
      this.switchBaseElm.appendChild(this.thumbElm);
      this.rippleElm = this.createElement("div");
      this.rippleElm.classList.add("ripple");
      this.switchBaseElm.appendChild(this.rippleElm);
      this.checked = this.getAttribute("checked", true) || false;
      this.setAttributeToProperty("checkedThumbColor");
      this.setAttributeToProperty("uncheckedThumbColor");
      this.setAttributeToProperty("checkedTrackColor");
      this.setAttributeToProperty("uncheckedTrackColor");
      this.setAttributeToProperty("checkedText");
      this.setAttributeToProperty("uncheckedText");
      this.setAttributeToProperty("checkedThumbText");
      this.setAttributeToProperty("uncheckedThumbText");
      super.init();
    }
  }
  static async create(options, parent) {
    let self = new this(parent, options);
    await self.ready();
    return self;
  }
};
Switch = __decorateClass([
  customElements2("i-switch")
], Switch);

// packages/chart/src/chart.ts
var Chart = class extends Control {
  constructor(parent, options) {
    super(parent, options);
  }
  get data() {
    return this._data;
  }
  set data(value) {
    this._data = value;
    this.drawChart();
  }
  get dataObj() {
    try {
      return JSON.parse(JSON.stringify(this.data));
    } catch (e) {
      return null;
    }
  }
  showLoading() {
    this._chartIns && this._chartIns.showLoading();
  }
  drawChart() {
    if (this._chartIns) {
      this.updateChartOptions();
      return;
    }
    RequireJS.require([`${LibPath}lib/echarts/echarts.min.js`], (echart) => {
      const chartDom = document.getElementById(`main-${this._timeCreated}`);
      if (chartDom) {
        this._chartIns = echart.init(chartDom);
        this.updateChartOptions();
      }
    });
  }
  updateChartOptions() {
    this._chartIns.hideLoading();
    this.dataObj && this._chartIns.setOption(this.dataObj);
  }
  resize() {
    this.dataObj && this._chartIns.resize();
  }
  init() {
    this._timeCreated = Date.now();
    super.init();
    this.style.display = "inline-block";
    let captionDiv = this.createElement("div", this);
    captionDiv.id = `main-${this._timeCreated}`;
    captionDiv.style.display = "inline-block";
    captionDiv.style.height = "100%";
    captionDiv.style.width = "100%";
    this.data = this.getAttribute("data", true);
  }
};

// packages/chart/src/lineChart.ts
var LineChart = class extends Chart {
  constructor(parent, options) {
    super(parent, options);
  }
  init() {
    super.init();
  }
};
LineChart = __decorateClass([
  customElements2("i-line-chart")
], LineChart);

// packages/chart/src/barChart.ts
var BarChart = class extends Chart {
  constructor(parent, options) {
    super(parent, options);
  }
  init() {
    super.init();
  }
};
BarChart = __decorateClass([
  customElements2("i-bar-chart")
], BarChart);

// packages/chart/src/barStackChart.ts
var BarStackChart = class extends Chart {
  constructor(parent, options) {
    super(parent, options);
  }
  init() {
    super.init();
  }
};
BarStackChart = __decorateClass([
  customElements2("i-bar-stack-chart")
], BarStackChart);

// packages/chart/src/pieChart.ts
var PieChart = class extends Chart {
  constructor(parent, options) {
    super(parent, options);
  }
  init() {
    super.init();
  }
};
PieChart = __decorateClass([
  customElements2("i-pie-chart")
], PieChart);

// packages/chart/src/scatterChart.ts
var ScatterChart = class extends Chart {
  constructor(parent, options) {
    super(parent, options);
  }
  init() {
    super.init();
  }
};
ScatterChart = __decorateClass([
  customElements2("i-scatter-chart")
], ScatterChart);

// packages/chart/src/scatterLineChart.ts
var ScatterLineChart = class extends Chart {
  constructor(parent, options) {
    super(parent, options);
  }
  init() {
    super.init();
  }
};
ScatterLineChart = __decorateClass([
  customElements2("i-scatter-line-chart")
], ScatterLineChart);

// packages/upload/src/style/upload.css.ts
var Theme21 = theme_exports.ThemeVars;
cssRule("i-upload", {
  margin: "1rem 0",
  listStyle: "none",
  minHeight: 200,
  minWidth: 200,
  height: "100%",
  width: "100%",
  display: "flex",
  flexWrap: "wrap",
  $nest: {
    ".i-upload-wrapper": {
      position: "relative",
      border: `2px dashed ${Theme21.divider}`,
      width: "100%",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      marginBottom: "1rem"
    },
    "i-upload-drag": {
      position: "absolute",
      width: "100%",
      height: "100%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    },
    ".i-upload-drag_area": {
      marginTop: "4rem"
    },
    ".i-upload-dragger_active": {
      border: `2px dashed ${Theme21.colors.primary.main}`,
      backgroundColor: Theme21.colors.info.light,
      opacity: "0.8"
    },
    'input[type="file"]': {
      display: "none"
    },
    ".i-upload_preview": {
      display: "none",
      minHeight: 200,
      position: "relative",
      overflow: "hidden",
      width: "100%",
      height: "100%"
    },
    ".i-upload_preview img": {
      maxHeight: "inherit",
      maxWidth: "100%"
    },
    ".i-upload_preview-img": {
      maxHeight: "inherit",
      maxWidth: "100%",
      display: "table"
    },
    ".i-upload_preview-crop": {
      position: "absolute",
      border: `1px dashed ${Theme21.background.paper}`,
      width: 150,
      height: 150,
      left: "50%",
      top: "50%",
      transform: "translate(-50%, -50%)",
      boxSizing: "border-box",
      boxShadow: "0 0 0 9999em",
      color: "rgba(0, 0, 0, 0.5)",
      overflow: "hidden",
      cursor: "crosshair"
    },
    ".i-upload_preview-remove": {
      position: "absolute",
      top: 0,
      left: 0,
      visibility: "hidden",
      opacity: 0,
      width: "100%",
      height: "100%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "rgba(0, 0, 0, 0.58)",
      cursor: "pointer",
      $nest: {
        "> span": {
          padding: "1rem",
          border: "2px solid #fff",
          borderRadius: "5px",
          color: "#fff",
          fontWeight: "bold"
        }
      }
    },
    ".i-upload_preview:hover .i-upload_preview-remove.active": {
      visibility: "visible",
      opacity: 1
    },
    ".i-upload_list": {
      margin: "1rem 0 2rem",
      display: "flex",
      gap: 7,
      width: "100%"
    },
    ".i-upload_list.i-upload_list-picture": {
      flexDirection: "row"
    },
    ".i-upload_list.i-upload_list-text": {
      flexDirection: "column",
      alignContent: "center"
    },
    ".i-upload_list.i-upload_list-text i-icon": {
      position: "unset"
    },
    ".i-upload_list-item": {
      display: "inline-flex",
      position: "relative",
      justifyContent: "space-between"
    },
    ".i-upload_list-item:hover i-icon": {
      display: "block"
    },
    ".i-upload_list.i-upload_list-text .i-upload_list-item:hover": {
      backgroundColor: ThemeVars.background.default
    },
    ".i-upload_list.i-upload_list-text .i-upload_list-item": {
      width: "100%",
      padding: ".25rem"
    },
    ".i-upload_list-item .i-upload_list-img": {
      width: 100,
      height: 50,
      objectFit: "cover"
    },
    ".i-upload_list-item i-icon": {
      cursor: "pointer",
      position: "absolute",
      right: -5,
      top: -5,
      display: "none"
    }
  }
});

// packages/upload/src/upload.ts
var Theme22 = theme_exports.ThemeVars;
var fileId = 1;
var genFileId = () => Date.now() + fileId++;
var UploadDrag = class extends Control {
  constructor(parent, options) {
    super(parent, options);
    this.counter = 0;
  }
  get caption() {
    return this._caption;
  }
  set caption(value) {
    this._caption = value;
    this._labelElm.textContent = this._caption || "";
    if (!value)
      this._labelElm.style.display = "none";
    else
      this._labelElm.style.display = "";
  }
  get disabled() {
    return this._disabled;
  }
  set disabled(value) {
    this._disabled = value;
  }
  handleOnDragEnter(source, event) {
    var _a;
    source.preventDefault();
    if (this.disabled)
      return;
    this.counter++;
    (_a = this.parentElement) == null ? void 0 : _a.classList.add("i-upload-dragger_active");
  }
  handleOnDragOver(source, event) {
    source.preventDefault();
  }
  handleOnDragLeave(source, event) {
    var _a;
    if (this.disabled)
      return;
    this.counter--;
    if (this.counter === 0) {
      (_a = this.parentElement) == null ? void 0 : _a.classList.remove("i-upload-dragger_active");
    }
  }
  handleOnDrop(source, event) {
    var _a, _b;
    source.preventDefault();
    if (this.disabled)
      return;
    this.counter = 0;
    (_a = this.parentElement) == null ? void 0 : _a.classList.remove("i-upload-dragger_active");
    const accept = (_b = this.parentElement) == null ? void 0 : _b.getAttribute("accept");
    if (!accept) {
      if (this.onDrop)
        this.onDrop(this, source.dataTransfer.files);
      return;
    }
    const valids = [].slice.call(source.dataTransfer.files).filter((file) => {
      const { type, name } = file;
      const extension = name.indexOf(".") > -1 ? `.${name.split(".").pop()}` : "";
      const baseType = type.replace(/\/.*$/, "");
      return accept.split(",").map((type2) => type2.trim()).filter((type2) => type2).some((acceptedType) => {
        if (/\..+$/.test(acceptedType)) {
          return extension === acceptedType;
        }
        if (/\/\*$/.test(acceptedType)) {
          return baseType === acceptedType.replace(/\/\*$/, "");
        }
        if (/^[^\/]+\/[^\/]+$/.test(acceptedType)) {
          return type === acceptedType;
        }
        return false;
      });
    });
    if (this.onDrop)
      this.onDrop(this, valids);
  }
  init() {
    if (!this._wrapperElm) {
      super.init();
      this.onDrop = this.getAttribute("onDrop", true) || this.onDrop;
      this._wrapperElm = this.createElement("div", this);
      this._wrapperElm.classList.add("i-upload-drag_area");
      this._labelElm = this.createElement("span", this._wrapperElm);
      this._labelElm.style.color = Theme22.text.primary;
      this.caption = this.getAttribute("caption", true);
      this.disabled = this.getAttribute("disabled", true);
      this.addEventListener("dragenter", this.handleOnDragEnter.bind(this));
      this.addEventListener("dragover", this.handleOnDragOver.bind(this));
      this.addEventListener("dragleave", this.handleOnDragLeave.bind(this));
      this.addEventListener("drop", this.handleOnDrop.bind(this));
    }
  }
  static async create(options, parent) {
    let self = new this(parent, options);
    await self.ready();
    return self;
  }
};
UploadDrag = __decorateClass([
  customElements2("i-upload-drag")
], UploadDrag);
var Upload = class extends Control {
  constructor(parent, options) {
    super(parent, options, {
      multiple: false
    });
    this._dt = new DataTransfer();
    this._fileList = [];
    this.handleRemoveImagePreview = (event) => {
      if (!this.isPreviewing || !this.enabled)
        return;
      event.stopPropagation();
      const file = this._dt.files.length ? this._dt.files[0] : void 0;
      this.clear();
      if (this.onRemoved)
        this.onRemoved(this, file);
    };
    this.toBase64 = (file) => new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  }
  get caption() {
    return this._caption;
  }
  set caption(value) {
    this._caption = value;
  }
  get accept() {
    return this._accept;
  }
  set accept(value) {
    this._accept = value;
    this._fileElm && value && this._fileElm.setAttribute("accept", `${value}`);
  }
  get draggable() {
    return this._draggable;
  }
  set draggable(value) {
    this._draggable = value;
    if (value)
      this.classList.add("el-upload-dragger");
    else
      this.classList.remove("el-upload-dragger");
  }
  get multiple() {
    return this._multiple;
  }
  set multiple(value) {
    this._multiple = value;
    if (this._fileElm && value)
      this._fileElm.setAttribute("multiple", `${value}`);
  }
  get fileList() {
    return this._fileList;
  }
  set fileList(value) {
    this._fileList = value;
    if (value && value.length) {
      value.forEach((f) => {
        this._dt.items.add(f);
      });
      if (this._fileElm) {
        this._fileElm.files = this._dt.files;
        this.updateFileListUI(this._fileElm.files);
      }
    }
  }
  get enabled() {
    return super.enabled;
  }
  set enabled(value) {
    super.enabled = value;
    if (this._uploadDragElm)
      this._uploadDragElm.disabled = !value || !this.draggable;
    if (!this._previewRemoveElm)
      return;
    if (value)
      this._previewRemoveElm.classList.add("active");
    else
      this._previewRemoveElm.classList.remove("active");
  }
  addFile(file) {
    this._dt.items.add(file);
    this._fileList.push(file);
    if (this.onAdded)
      this.onAdded(this, file);
  }
  previewFile(files) {
    if (!files || !files.length)
      return;
    const imgUrl = URL.createObjectURL(files[files.length - 1]);
    this.preview(imgUrl);
  }
  handleUpload(source, event) {
    const files = source.target.files;
    this.proccessFiles(files);
  }
  async proccessFiles(files) {
    if (!files || !files.length)
      return;
    if (!this.fileList)
      this._dt = new DataTransfer();
    for (let file of files) {
      const rawFile = file;
      rawFile.uid = genFileId();
      if (!!this.onUploading)
        await this.checkBeforeUpload(rawFile);
      else
        this.addFile(rawFile);
    }
    this.updateFileListUI(this._dt.files);
    this.previewFile(this._dt.files);
    if (this.onChanged)
      this.onChanged(this, this.fileList);
  }
  async checkBeforeUpload(file) {
    const before = this.onUploading(this, file);
    if (before && before.then) {
      before.then((value) => {
        if (value)
          this.addFile(file);
      }, () => {
        if (this.onRemoved)
          this.onRemoved(this, file);
      });
    } else {
      if (this.onRemoved)
        this.onRemoved(this, file);
    }
  }
  updateFileListUI(files) {
    if (this._fileListElm) {
      this._fileListElm.innerHTML = "";
      for (let file of files) {
        const itemElm = this.createElement("div", this._fileListElm);
        itemElm.classList.add("i-upload_list-item");
        if (file.type.includes("image/")) {
          this._fileListElm.classList.add("i-upload_list-picture");
          const imgElm = new Image();
          imgElm.src = URL.createObjectURL(file);
          imgElm.classList.add("i-upload_list-img");
          imgElm.onload = function() {
            URL.revokeObjectURL(imgElm.src);
          };
          itemElm.appendChild(imgElm);
        } else {
          this._fileListElm.classList.add("i-upload_list-text");
          const spanElm = this.createElement("span", itemElm);
          spanElm.textContent = file.name;
        }
        const removeIcon = new Icon(void 0, {
          width: 12,
          height: 12,
          fill: Theme22.action.active,
          name: "trash"
        });
        itemElm.appendChild(removeIcon);
        removeIcon.addEventListener("click", () => this.handleRemove(file));
      }
      this._fileListElm.style.display = files.length ? "flex" : "none";
    }
  }
  renderPreview() {
    this._previewElm = this.createElement("div", this._wrapperElm);
    this._previewElm.classList.add("i-upload_preview");
    this._wrapImgElm = this.createElement("div", this._previewElm);
    this._wrapImgElm.classList.add("i-upload_preview-img");
    this._previewRemoveElm = this.createElement("div", this._previewElm);
    if (this.enabled) {
      this._previewRemoveElm.classList.add("active");
    } else {
      this._previewRemoveElm.classList.remove("active");
    }
    this._previewRemoveElm.classList.add("i-upload_preview-remove");
    this._previewRemoveElm.onclick = this.handleRemoveImagePreview;
    const span = this.createElement("span", this._previewRemoveElm);
    span.style.fontFamily = Theme22.typography.fontFamily;
    span.innerHTML = "Click to remove";
  }
  handleRemove(file) {
    const rawFile = file;
    for (let i = 0; i < this._dt.items.length; i++) {
      if (rawFile.uid === this._dt.files[i].uid) {
        this._dt.items.remove(i);
        this.fileList = this._fileList.filter((f) => f.uid !== rawFile.uid);
        if (this.onRemoved)
          this.onRemoved(this, file);
        break;
      }
    }
    this._fileElm.files = this._dt.files;
    this.updateFileListUI(this._dt.files);
    if (!this._dt.items.length)
      this.clear();
  }
  preview(uri) {
    if (!uri)
      return;
    this.isPreviewing = true;
    this._wrapImgElm.innerHTML = "";
    this._previewImgElm = new Image2();
    this._wrapImgElm.appendChild(this._previewImgElm);
    this._previewImgElm.url = uri;
    this._previewElm.style.display = "block";
    this._wrapperFileElm.style.display = "none";
    if (this._uploadDragElm)
      this._uploadDragElm.style.display = "none";
  }
  clear() {
    this._fileElm.value = "";
    this._wrapperFileElm.style.display = "block";
    if (this._uploadDragElm)
      this._uploadDragElm.style.display = this.draggable ? "flex" : "none";
    if (this._previewElm)
      this._previewElm.style.display = "none";
    this._wrapImgElm && (this._wrapImgElm.innerHTML = "");
    if (this._fileListElm)
      this._fileListElm.style.display = "none";
    this._dt = new DataTransfer();
    this.isPreviewing = false;
    this._fileList = [];
  }
  addFiles() {
  }
  addFolder() {
  }
  init() {
    if (!this.initialized) {
      super.init();
      this._wrapperElm = this.createElement("div", this);
      this._wrapperElm.classList.add("i-upload-wrapper");
      this._wrapperFileElm = this.createElement("div", this._wrapperElm);
      this.caption = this.getAttribute("caption", true);
      this.draggable = this.getAttribute("draggable", true, false);
      this._uploadDragElm = new UploadDrag(this, {
        caption: this.caption,
        disabled: !this.enabled || !this.draggable,
        onDrop: (source, value) => {
          value && this.proccessFiles(value);
        }
      });
      this._wrapperElm.appendChild(this._uploadDragElm);
      this._fileElm = this.createElement("input", this._wrapperFileElm);
      this._fileElm.type = "file";
      this.multiple = this.getAttribute("multiple", true);
      this.accept = this.getAttribute("accept");
      if (!this.enabled)
        this._fileElm.setAttribute("disabled", "");
      const btn = new Button(this, {
        caption: "Choose an image"
      });
      btn.className = `i-upload_btn ${!this.enabled && "disabled"}`;
      this._wrapperFileElm.appendChild(btn);
      const fileListAttr = this.getAttribute("showFileList", true);
      if (fileListAttr && !this._fileListElm) {
        this._fileListElm = this.createElement("div", this);
        this._fileListElm.classList.add("i-upload_list");
        this._fileListElm.style.display = "none";
      }
      this.renderPreview();
      const fileList = this.getAttribute("fileList", true);
      fileList && (this.fileList = fileList);
      this._wrapperElm.addEventListener("click", (event) => {
        event.stopPropagation();
        if (!this.enabled)
          return;
        if (!this.isPreviewing)
          this._fileElm.click();
      });
      this._fileElm.addEventListener("change", this.handleUpload.bind(this));
    }
  }
  static async create(options, parent) {
    let self = new this(parent, options);
    await self.ready();
    return self;
  }
};
Upload = __decorateClass([
  customElements2("i-upload")
], Upload);

// packages/tab/src/style/tab.css.ts
var Theme23 = theme_exports.ThemeVars;
cssRule("i-tabs", {
  display: "block",
  $nest: {
    ".tabs-nav-wrap": {
      display: "flex",
      flex: "none",
      overflow: "hidden"
    },
    "&:not(.vertical) .tabs-nav-wrap": {
      $nest: {
        "&:hover": {
          overflowX: "auto",
          overflowY: "hidden"
        },
        "&::-webkit-scrollbar-thumb": {
          background: "#4b4b4b",
          borderRadius: "5px"
        },
        "&::-webkit-scrollbar": {
          height: "3px"
        }
      }
    },
    ".tabs-nav": {
      position: "relative",
      display: "flex",
      flex: "none",
      overflow: "hidden",
      whiteSpace: "nowrap",
      borderBottom: `1px solid #252525`,
      margin: 0
    },
    "&.vertical": {
      display: "flex",
      $nest: {
        ".tabs-nav": {
          display: "flex",
          flexDirection: "column"
        },
        ".tabs-nav:hover": {
          overflowY: "auto"
        },
        ".tabs-nav::-webkit-scrollbar-thumb": {
          background: "#4b4b4b",
          borderRadius: "5px"
        },
        ".tabs-nav::-webkit-scrollbar": {
          width: "3px"
        }
      }
    },
    "i-tab": {
      position: "relative",
      display: "inline-flex",
      overflow: "hidden",
      color: "rgba(255, 255, 255, 0.55)",
      background: "#2e2e2e",
      marginBottom: "-1px",
      border: `1px solid #252525`,
      alignItems: "center",
      font: "inherit",
      textAlign: "center",
      minHeight: "36px",
      $nest: {
        "&:not(.disabled):hover": {
          cursor: "pointer",
          color: "#fff"
        },
        "&:not(.disabled).active.border": {
          borderColor: `${Theme23.divider} ${Theme23.divider} #fff`,
          borderBottomWidth: "1.5px"
        },
        ".tab-item": {
          position: "relative",
          display: "flex",
          alignItems: "center",
          cursor: "pointer",
          padding: "0.5rem 1rem",
          gap: "5px",
          $nest: {
            "i-image": {
              display: "flex"
            }
          }
        }
      }
    },
    "i-tab:not(.disabled).active": {
      backgroundColor: "#1d1d1d",
      borderBottomColor: "transparent",
      color: "#fff"
    },
    ".tabs-content": {
      position: "relative",
      overflow: "hidden",
      display: "flex",
      width: "100%",
      height: "100%",
      minHeight: "200px",
      $nest: {
        "&::after": {
          clear: "both"
        },
        "i-label .f1yauex0": {
          whiteSpace: "normal"
        },
        ".content-pane": {
          position: "relative",
          width: "100%",
          height: "100%",
          flex: "none"
        }
      }
    },
    "span.close": {
      width: "18px",
      height: "18px",
      marginLeft: "5px",
      marginRight: "-5px",
      borderRadius: "5px",
      lineHeight: "18px",
      fontSize: "18px",
      visibility: "hidden",
      opacity: 0,
      $nest: {
        "&:hover": {
          background: "rgba(78, 78, 78, 0.48)"
        }
      }
    },
    ".tabs-nav:not(.is-closable) span.close": {
      display: "none"
    },
    ".tabs-nav.is-closable i-tab:not(.disabled):hover span.close, .tabs-nav.is-closable i-tab:not(.disabled).active span.close": {
      visibility: "visible",
      opacity: 1
    }
  }
});
var getTabMediaQueriesStyleClass = (mediaQueries) => {
  let styleObj = getControlMediaQueriesStyle(mediaQueries);
  for (let mediaQuery of mediaQueries) {
    let mediaQueryRule;
    if (mediaQuery.minWidth && mediaQuery.maxWidth) {
      mediaQueryRule = `@media (min-width: ${mediaQuery.minWidth}) and (max-width: ${mediaQuery.maxWidth})`;
    } else if (mediaQuery.minWidth) {
      mediaQueryRule = `@media (min-width: ${mediaQuery.minWidth})`;
    } else if (mediaQuery.maxWidth) {
      mediaQueryRule = `@media (max-width: ${mediaQuery.maxWidth})`;
    }
    if (mediaQueryRule) {
      const nestObj = styleObj["$nest"][mediaQueryRule]["$nest"] || {};
      const ruleObj = styleObj["$nest"][mediaQueryRule];
      styleObj["$nest"][mediaQueryRule] = {
        ...ruleObj,
        $nest: {
          ...nestObj,
          ".tabs-nav": {}
        }
      };
      if (mediaQuery.properties.mode) {
        const mode = mediaQuery.properties.mode;
        styleObj["$nest"][mediaQueryRule]["display"] = mode === "vertical" ? "flex !important" : "block !important";
        if (mode === "horizontal") {
          styleObj["$nest"][mediaQueryRule]["$nest"][".tabs-nav"]["flexDirection"] = "row !important";
          styleObj["$nest"][mediaQueryRule]["$nest"][".tabs-nav"]["width"] = "100%";
          styleObj["$nest"][mediaQueryRule]["$nest"][".tabs-nav"]["justifyContent"] = "center";
        } else {
          styleObj["$nest"][mediaQueryRule]["$nest"][".tabs-nav"]["flexDirection"] = "column !important";
          styleObj["$nest"][mediaQueryRule]["$nest"][".tabs-nav"]["width"] = "auto";
          styleObj["$nest"][mediaQueryRule]["$nest"][".tabs-nav"]["justifyContent"] = "start";
        }
      }
      if (typeof mediaQuery.properties.visible === "boolean") {
        const visible = mediaQuery.properties.visible;
        styleObj["$nest"][mediaQueryRule]["display"] = visible ? "block !important" : "none !important";
      }
    }
  }
  return style(styleObj);
};

// packages/tab/src/tab.ts
var Tabs = class extends Container {
  constructor(parent, options) {
    super(parent, options);
    this.accumTabIndex = 0;
    this.dragStartHandler = this.dragStartHandler.bind(this);
    this.dragOverHandler = this.dragOverHandler.bind(this);
    this.dropHandler = this.dropHandler.bind(this);
  }
  get activeTab() {
    return this._tabs[this.activeTabIndex];
  }
  get activeTabIndex() {
    return this._activeTabIndex;
  }
  set activeTabIndex(index) {
    var _a;
    if (index < 0 || this._activeTabIndex === index)
      return;
    const prevTab = this._tabs[this._activeTabIndex];
    if (prevTab) {
      prevTab.classList.remove("active");
      this.contentPanes[this._activeTabIndex].style.display = "none";
    }
    this._activeTabIndex = index;
    (_a = this.activeTab) == null ? void 0 : _a.classList.add("active");
    if (this.contentPanes[index])
      this.contentPanes[index].style.display = "";
  }
  get items() {
    return this._tabs;
  }
  get closable() {
    return this._closable;
  }
  set closable(value) {
    this._closable = value;
    if (value) {
      this.tabsNavElm.classList.add("is-closable");
    } else {
      this.tabsNavElm.classList.remove("is-closable");
    }
  }
  get draggable() {
    return this._draggable;
  }
  set draggable(value) {
    if (this._draggable === value)
      return;
    this._draggable = value;
    if (this.draggable) {
      this.tabsNavElm.ondragover = this.dragOverHandler;
      this.tabsNavElm.ondrop = this.dropHandler;
    } else {
      this.tabsNavElm.ondragover = null;
      this.tabsNavElm.ondrop = null;
    }
    this.handleTagDrag(this._tabs);
  }
  get mode() {
    const isVertical = this.classList.contains("vertical");
    return isVertical ? "vertical" : "horizontal";
  }
  set mode(type) {
    if (type === "vertical") {
      this.classList.add("vertical");
    } else {
      this.classList.remove("vertical");
    }
  }
  get mediaQueries() {
    return this._mediaQueries;
  }
  set mediaQueries(value) {
    this._mediaQueries = value;
    let style2 = getTabMediaQueriesStyleClass(this._mediaQueries);
    this._mediaStyle && this.classList.remove(this._mediaStyle);
    this._mediaStyle = style2;
    this.classList.add(style2);
  }
  add(options) {
    const tab = new Tab(this, options);
    if (options == null ? void 0 : options.children) {
      tab.append(options == null ? void 0 : options.children);
    }
    if (this.draggable) {
      this.handleTagDrag([tab]);
    }
    this.appendTab(tab);
    this.activeTabIndex = tab.index;
    return tab;
  }
  delete(tab) {
    const index = this._tabs.findIndex((t) => t.id === tab.id);
    const activeIndex = this.activeTabIndex;
    if (index >= 0) {
      this._tabs.splice(index, 1);
      const pane = this.contentPanes[index];
      this.contentPanes.splice(index, 1);
      pane.remove();
      if (activeIndex >= index) {
        let newActiveIndex = activeIndex > index ? activeIndex - 1 : this._tabs[activeIndex] ? activeIndex : this._tabs.length - 1;
        this._activeTabIndex = newActiveIndex;
        if (this.activeTab) {
          this.activeTab.classList.add("active");
          this.contentPanes[newActiveIndex].style.display = "";
        }
      }
    }
    tab.remove();
  }
  appendTab(tab) {
    tab._container = this.tabsContentElm;
    tab.parent = this;
    this._tabs.push(tab);
    if (!tab.id)
      tab.id = `tab-${this.accumTabIndex++}`;
    this.tabsNavElm.appendChild(tab);
    const contentPane = this.createElement("div", this.tabsContentElm);
    tab._contentElm = contentPane;
    contentPane.classList.add("content-pane");
    contentPane.style.display = "none";
    this.contentPanes.push(contentPane);
    const children = tab.children;
    for (let i = 0; i < children.length; i++) {
      if (children[i].classList.contains("tab-item"))
        continue;
      if (children[i] instanceof Control) {
        children[i].parent = tab;
      }
    }
    ;
  }
  handleTagDrag(tabs) {
    tabs.forEach((tab) => {
      if (this.draggable) {
        tab.setAttribute("draggable", "true");
        tab.ondragstart = this.dragStartHandler;
      } else {
        tab.removeAttribute("draggable");
        tab.ondragstart = null;
      }
    });
  }
  _handleClick(event) {
    return super._handleClick(event, true);
  }
  dragStartHandler(event) {
    if (!(event.target instanceof Tab))
      return;
    this.curDragTab = event.target;
  }
  dragOverHandler(event) {
    event.preventDefault();
  }
  dropHandler(event) {
    event.preventDefault();
    if (!this.curDragTab)
      return;
    const target = event.target;
    const dropTab = target instanceof Tab ? target : target.closest("i-tab");
    if (dropTab && !this.curDragTab.isSameNode(dropTab)) {
      const curActiveTab = this.activeTab;
      const dragIndex = this.curDragTab.index;
      const dropIndex = dropTab.index;
      const [dragTab] = this._tabs.splice(dragIndex, 1);
      this._tabs.splice(dropIndex, 0, dragTab);
      const [dragContent] = this.contentPanes.splice(dragIndex, 1);
      this.contentPanes.splice(dropIndex, 0, dragContent);
      if (dragIndex > dropIndex) {
        this.tabsNavElm.insertBefore(this.curDragTab, dropTab);
      } else {
        dropTab.after(this.curDragTab);
      }
      this.activeTabIndex = curActiveTab.index;
      if (this.onChanged)
        this.onChanged(this, this.activeTab);
    }
    this.curDragTab = null;
  }
  refresh() {
    if (this.dock) {
      super.refresh(true);
      const height = this.mode === "horizontal" ? this.clientHeight - this.tabsNavElm.clientHeight : this.clientHeight;
      this.tabsContentElm.style.height = height + "px";
      this.refreshControls();
    }
  }
  init() {
    super.init();
    if (!this.tabsNavElm) {
      this.contentPanes = [];
      this._tabs = [];
      const _tabs = [];
      this.childNodes.forEach((node) => {
        if (node instanceof Tab) {
          _tabs.push(node);
        } else {
          node.remove();
        }
      });
      const tabsNavWrapElm = this.createElement("div", this);
      tabsNavWrapElm.classList.add("tabs-nav-wrap");
      tabsNavWrapElm.addEventListener("wheel", (event) => {
        if (this.mode !== "horizontal")
          return;
        event.preventDefault();
        tabsNavWrapElm.scrollLeft += event.deltaY;
      });
      this.tabsNavElm = this.createElement("div", tabsNavWrapElm);
      this.tabsNavElm.classList.add("tabs-nav");
      this.tabsContentElm = this.createElement("div", this);
      this.tabsContentElm.classList.add("tabs-content");
      this.closable = this.getAttribute("closable", true) || false;
      this.mode = this.getAttribute("mode", true) || "horizontal";
      for (const tab of _tabs) {
        this.appendTab(tab);
      }
      this.draggable = this.getAttribute("draggable", true) || false;
      const activeTabIndex = this.getAttribute("activeTabIndex", true);
      if (this._tabs.length)
        this.activeTabIndex = activeTabIndex || 0;
      this.mediaQueries = this.getAttribute("mediaQueries", true, []);
    }
  }
  static async create(options, parent) {
    let self = new this(parent, options);
    await self.ready();
    return self;
  }
};
Tabs = __decorateClass([
  customElements2("i-tabs")
], Tabs);
var Tab = class extends Container {
  active() {
    this._parent.activeTabIndex = this.index;
  }
  addChildControl(control) {
    if (this._contentElm)
      this._contentElm.appendChild(control);
  }
  removeChildControl(control) {
    if (this._contentElm && this._contentElm.contains(control))
      this._contentElm.removeChild(control);
  }
  get caption() {
    return this.captionElm.innerHTML;
  }
  set caption(value) {
    this.captionElm.innerHTML = value;
  }
  close() {
    this.handleCloseTab();
  }
  get index() {
    return this._parent.items.findIndex((t) => t.id === this.id);
  }
  get icon() {
    if (!this._icon) {
      this._icon = Icon.create({
        width: 16,
        height: 16
      }, this);
    }
    ;
    return this._icon;
  }
  set icon(elm) {
    if (this._icon)
      this.tabContainer.removeChild(this._icon);
    this._icon = elm;
    if (this._icon)
      this.tabContainer.prepend(this._icon);
  }
  get innerHTML() {
    return this._contentElm.innerHTML;
  }
  set innerHTML(value) {
    this._contentElm.innerHTML = value;
  }
  get font() {
    return {
      color: this.captionElm.style.color,
      name: this.captionElm.style.fontFamily,
      size: this.captionElm.style.fontSize,
      bold: this.captionElm.style.fontStyle.indexOf("bold") >= 0,
      style: this.captionElm.style.fontStyle,
      transform: this.captionElm.style.textTransform,
      weight: this.captionElm.style.fontWeight
    };
  }
  set font(value) {
    if (this.captionElm) {
      this.captionElm.style.color = value.color || "";
      this.captionElm.style.fontSize = value.size || "";
      this.captionElm.style.fontFamily = value.name || "";
      this.captionElm.style.fontStyle = value.style || "";
      this.captionElm.style.textTransform = value.transform || "none";
      this.captionElm.style.fontWeight = value.bold ? "bold" : `${value.weight}` || "";
    }
  }
  _handleClick(event) {
    if (!this._parent || !this.enabled || this._parent.activeTab.isSameNode(this))
      return false;
    if (this._parent) {
      if (this._parent.activeTab != this)
        this._parent.activeTabIndex = this.index;
      if (this._parent.onChanged)
        this._parent.onChanged(this._parent, this._parent.activeTab);
    }
    return super._handleClick(event);
  }
  handleCloseTab(event) {
    if (event) {
      event.stopPropagation();
      event.preventDefault();
    }
    if (!this._parent || !this.enabled || event && !this._parent.closable)
      return;
    const isActiveChange = this._parent.activeTab.isSameNode(this);
    if (this._parent.onCloseTab)
      this._parent.onCloseTab(this._parent, this);
    this._parent.delete(this);
    if (isActiveChange && this._parent.onChanged)
      this._parent.onChanged(this._parent, this._parent.activeTab);
  }
  init() {
    if (!this.captionElm) {
      super.init();
      this.tabContainer = this.createElement("div", this);
      this.tabContainer.classList.add("tab-item");
      this.captionElm = this.createElement("div", this.tabContainer);
      this.caption = this.getAttribute("caption", true) || "";
      const font = this.getAttribute("font", true);
      if (font)
        this.font = font;
      const icon = this.getAttribute("icon", true);
      if (icon) {
        icon.height = icon.height || "16px";
        icon.width = icon.width || "16px";
        this.icon = new Icon(void 0, icon);
      }
      ;
      const closeButton = this.createElement("span", this.tabContainer);
      closeButton.classList.add("close");
      closeButton.innerHTML = "&times;";
      closeButton.onclick = this.handleCloseTab.bind(this);
    }
  }
  static async create(options, parent) {
    let self = new this(parent, options);
    await self.ready();
    return self;
  }
};
Tab = __decorateClass([
  customElements2("i-tab")
], Tab);

// packages/iframe/src/iframe.ts
var Iframe = class extends Control {
  constructor(parent, options) {
    super(parent, options, {
      width: 800,
      height: 600
    });
    window.addEventListener("mousedown", () => {
      if (this.iframeElm)
        this.iframeElm.style.pointerEvents = "none";
    });
    window.addEventListener("mouseup", () => {
      if (this.iframeElm)
        this.iframeElm.style.pointerEvents = "auto";
    });
  }
  reload() {
    let iframe = this.iframeElm;
    return new Promise((resolve) => {
      iframe.src = iframe.src;
      iframe.onload = function() {
        resolve();
        iframe.onload = null;
      };
    });
  }
  get url() {
    return this._url;
  }
  set url(value) {
    this._url = value;
    if (value && !this.iframeElm) {
      this.iframeElm = this.createElement("iframe", this);
    }
    if (this.iframeElm) {
      this.iframeElm.src = value;
      this.iframeElm.width = "100%";
      this.iframeElm.height = "100%";
      this.iframeElm.setAttribute("frameBorder", "0");
    }
  }
  init() {
    super.init();
    this.url = this.getAttribute("url", true);
  }
  static async create(options, parent) {
    let self = new this(parent, options);
    await self.ready();
    return self;
  }
};
Iframe = __decorateClass([
  customElements2("i-iframe")
], Iframe);

// packages/pagination/src/style/pagination.css.ts
var Theme24 = theme_exports.ThemeVars;
cssRule("i-pagination", {
  display: "block",
  width: "100%",
  maxWidth: "100%",
  verticalAlign: "baseline",
  fontFamily: Theme24.typography.fontFamily,
  fontSize: Theme24.typography.fontSize,
  lineHeight: "25px",
  color: Theme24.text.primary,
  "$nest": {
    ".pagination": {
      display: "inline-flex",
      flexWrap: "wrap",
      justifyContent: "center"
    },
    ".pagination a": {
      color: Theme24.text.primary,
      float: "left",
      padding: "4px 8px",
      textAlign: "center",
      textDecoration: "none",
      transition: "background-color .3s",
      border: "1px solid #ddd",
      minWidth: 36
    },
    ".pagination a.active": {
      backgroundColor: "#4CAF50",
      color: "white",
      border: "1px solid #4CAF50",
      cursor: "default"
    },
    ".pagination a.disabled": {
      color: Theme24.text.disabled,
      pointerEvents: "none"
    }
  }
});

// packages/pagination/src/pagination.ts
var pagerCount = 7;
var pagerCountMobile = 5;
var defaultCurrentPage = 1;
var pageSize = 10;
var Pagination = class extends Control {
  constructor(parent, options) {
    super(parent, options, { pageSize });
    this._showPrevMore = false;
    this._showNextMore = false;
    this.pagerCount = pagerCount;
  }
  get totalPages() {
    return this._totalPages;
  }
  set totalPages(value) {
    if (this._totalPages === value)
      return;
    this._totalPages = value;
    this.onDisablePrevNext();
    this.renderPageItem(value);
  }
  get currentPage() {
    return this._curPage;
  }
  set currentPage(value) {
    const oldData = this._curPage;
    this._curPage = value || defaultCurrentPage;
    const index = value - 1;
    this.pageItems[index] && this.onActiveItem(this.pageItems[index]);
    if (this.onPageChanged && oldData !== this._curPage)
      this.onPageChanged(this, oldData);
  }
  get pageSize() {
    return this._pageSize || pageSize;
  }
  set pageSize(value) {
    this._pageSize = value;
  }
  onActiveItem(item) {
    if (this.activeItem) {
      this.activeItem.classList.remove("active");
    }
    if (item) {
      item.classList.add("active");
      this.activeItem = item;
    }
  }
  onDisablePrevNext() {
    if (this._prevElm)
      this.currentPage <= 1 ? this._prevElm.classList.add("disabled") : this._prevElm.classList.remove("disabled");
    if (this._nextElm)
      this.currentPage >= this.totalPages ? this._nextElm.classList.add("disabled") : this._nextElm.classList.remove("disabled");
  }
  _handleOnClickIndex(value, event) {
    if (!this.enabled)
      return;
    this.currentPage = value;
    this.onActiveItem(event.target);
    this.onDisablePrevNext();
  }
  _handleOnClickMore(value, event) {
    this.currentPage = this.currentPage + value * (this.pagerCount - 2);
    this.renderPageItem(this.totalPages);
  }
  _handleOnNext(event) {
    if (!this.enabled || this.currentPage >= this.totalPages)
      return;
    const nextPage = Number(this._curPage) <= 0 ? 1 : Number(this._curPage) + 1;
    this.currentPage = nextPage;
    this.renderPageItem(this.totalPages);
    this.onDisablePrevNext();
  }
  _handleOnPrev(event) {
    if (!this.enabled || this.currentPage <= 1)
      return;
    const prevPage = Number(this._curPage) - 1;
    this.currentPage = prevPage;
    this.renderPageItem(this.totalPages);
    this.onDisablePrevNext();
  }
  onMouseenter(direction, event) {
    if (!this.enabled)
      return;
    const target = event.target;
    target.innerHTML = direction === -1 ? "&laquo;" : "&raquo;";
  }
  renderEllipsis(step) {
    let item = this.createElement("a", this._paginationDiv);
    item.id = step === -1 ? "prevMoreElm" : "nextMoreElm";
    item.setAttribute("href", "#");
    item.innerHTML = "...";
    item.classList.add("paginate_button");
    item.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      this._handleOnClickMore(step, e);
    });
    item.addEventListener("mouseenter", (e) => {
      e.preventDefault();
      this.onMouseenter(step, e);
    });
    item.addEventListener("mouseout", (e) => {
      e.preventDefault();
      item.innerHTML = "...";
    });
  }
  renderPage(index) {
    let item = this.createElement("a", this._paginationDiv);
    this.pageItems.push(item);
    item.setAttribute("href", "#");
    item.innerHTML = `${index}`;
    item.classList.add("paginate_button");
    item.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      this._handleOnClickIndex(index, e);
    });
    if (index === this.currentPage)
      this.onActiveItem(item);
  }
  updatePagers() {
    const halfPagerCount = (this.pagerCount - 1) / 2;
    const currentPage = Number(this.currentPage);
    const pageCount = Number(this.totalPages);
    let showPrevMore = false;
    let showNextMore = false;
    if (pageCount > this.pagerCount) {
      if (currentPage > this.pagerCount - halfPagerCount) {
        showPrevMore = true;
      }
      if (currentPage < pageCount - halfPagerCount) {
        showNextMore = true;
      }
    }
    const array = [];
    if (showPrevMore && !showNextMore) {
      const startPage = pageCount - (this.pagerCount - 2);
      for (let i = startPage; i < pageCount; i++) {
        array.push(i);
      }
    } else if (!showPrevMore && showNextMore) {
      for (let i = 2; i < this.pagerCount; i++) {
        array.push(i);
      }
    } else if (showPrevMore && showNextMore) {
      const offset = Math.floor(this.pagerCount / 2) - 1;
      for (let i = currentPage - offset; i <= currentPage + offset; i++) {
        array.push(i);
      }
    } else {
      for (let i = 2; i < pageCount; i++) {
        array.push(i);
      }
    }
    this.pagers = array;
    this._showPrevMore = showPrevMore;
    this._showNextMore = showNextMore;
  }
  renderPageItem(size) {
    this.visible = size > 0;
    this._paginationDiv.innerHTML = "";
    if (this._prevElm) {
      this._paginationDiv.appendChild(this._prevElm);
    }
    this.pageItems = [];
    if (size > 0) {
      if (size > this.pagerCount) {
        this.updatePagers();
        this.renderPage(1);
        this._showPrevMore && this.renderEllipsis(-1);
        for (let i = 0; i < this.pagers.length; i++) {
          this.renderPage(this.pagers[i]);
        }
        this._showNextMore && this.renderEllipsis(1);
        this.renderPage(size);
      } else {
        for (let i = 1; i <= size; i++) {
          this.renderPage(i);
        }
      }
    } else if (size < 0) {
      const _s = this.pageItems.length + size;
      for (let i = this.pageItems.length - 1; i >= _s; i--) {
        this._paginationDiv.removeChild(this.pageItems[i]);
        this.pageItems.pop();
      }
    }
    if (this._nextElm) {
      this._paginationDiv.append(this._nextElm);
    }
  }
  init() {
    this.pagerCount = window.innerWidth > 767 ? pagerCount : pagerCountMobile;
    if (!this._paginationDiv) {
      this.pageItems = [];
      this._paginationDiv = this.createElement("div", this);
      this._paginationDiv.classList.add("pagination", "pagination-main");
      this._prevElm = this.createElement("a", this._paginationDiv);
      this._prevElm.setAttribute("href", "#");
      this._prevElm.innerHTML = "&laquo;";
      this._prevElm.classList.add("paginate_button", "previous");
      this._prevElm.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        this._handleOnPrev(e);
      });
      this.currentPage = +this.getAttribute("currentPage", true, defaultCurrentPage);
      this.totalPages = +this.getAttribute("totalPages", true, 0);
      this.pageSize = +this.getAttribute("pageSize", true, pageSize);
      this._nextElm = this.createElement("a", this._paginationDiv);
      this._nextElm.setAttribute("href", "#");
      this._nextElm.innerHTML = "&raquo;";
      this._nextElm.classList.add("paginate_button", "next");
      this._nextElm.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        this._handleOnNext(e);
      });
      this.onDisablePrevNext();
    }
    super.init();
  }
  static async create(options, parent) {
    let self = new this(parent, options);
    await self.ready();
    return self;
  }
};
Pagination = __decorateClass([
  customElements2("i-pagination")
], Pagination);

// packages/progress/src/style/progress.css.ts
var Theme25 = theme_exports.ThemeVars;
var loading = keyframes({
  "0%": {
    left: "-100%"
  },
  "100%": {
    left: "100%"
  }
});
cssRule("i-progress", {
  display: "block",
  maxWidth: "100%",
  verticalAlign: "baseline",
  fontFamily: Theme25.typography.fontFamily,
  fontSize: Theme25.typography.fontSize,
  color: Theme25.text.primary,
  position: "relative",
  $nest: {
    "&.is-loading .i-progress_overlay": {
      transform: "translateZ(0)",
      animation: `${loading} 3s infinite`
    },
    ".i-progress": {
      boxSizing: "border-box",
      margin: 0,
      minWidth: 0,
      width: "100%",
      display: "block"
    },
    ".i-progress--grid": {
      display: "grid",
      gap: 20,
      gridTemplateColumns: "auto 1fr 80px",
      alignItems: "center"
    },
    ".i-progress--exception": {
      $nest: {
        "> .i-progress_wrapbar > .i-progress_overlay": {
          backgroundColor: Theme25.colors.error.light
        },
        "> .i-progress_wrapbar > .i-progress_bar .i-progress_bar-item": {
          backgroundColor: Theme25.colors.error.light
        },
        ".i-progress_item.i-progress_item-start": {
          borderColor: Theme25.colors.error.light
        },
        ".i-progress_item.i-progress_item-end": {}
      }
    },
    ".i-progress--success": {
      $nest: {
        "> .i-progress_wrapbar > .i-progress_overlay": {
          backgroundColor: Theme25.colors.success.light
        },
        "> .i-progress_wrapbar > .i-progress_bar .i-progress_bar-item": {
          backgroundColor: Theme25.colors.success.light
        },
        ".i-progress_item.i-progress_item-start": {
          borderColor: Theme25.colors.success.light
        },
        ".i-progress_item.i-progress_item-end": {}
      }
    },
    ".i-progress--warning": {
      $nest: {
        "> .i-progress_wrapbar > .i-progress_overlay": {
          backgroundColor: Theme25.colors.warning.light
        },
        "> .i-progress_wrapbar > .i-progress_bar .i-progress_bar-item": {
          backgroundColor: Theme25.colors.warning.light
        },
        ".i-progress_item.i-progress_item-start": {
          borderColor: Theme25.colors.warning.light
        },
        ".i-progress_item.i-progress_item-end": {}
      }
    },
    ".i-progress--active": {
      $nest: {
        "> .i-progress_wrapbar > .i-progress_overlay": {
          backgroundColor: Theme25.colors.primary.light
        },
        "> .i-progress_wrapbar > .i-progress_bar .i-progress_bar-item": {
          backgroundColor: Theme25.colors.primary.light
        },
        ".i-progress_item.i-progress_item-start": {
          backgroundColor: "transparent",
          borderColor: Theme25.colors.primary.light
        }
      }
    },
    ".i-progress_wrapbar": {
      position: "relative",
      overflow: "hidden",
      boxSizing: "border-box",
      minWidth: 0,
      order: 2,
      minHeight: 2,
      $nest: {
        ".i-progress_bar": {
          boxSizing: "border-box",
          width: "100%",
          height: "100%",
          position: "absolute",
          display: "flex",
          alignItems: "center",
          gap: "1px",
          $nest: {
            "&.has-bg": {
              backgroundColor: Theme25.divider
            },
            ".i-progress_bar-item": {
              flex: "auto",
              backgroundColor: Theme25.divider
            }
          }
        },
        ".i-progress_overlay": {
          position: "absolute",
          minWidth: 0,
          height: "100%"
        }
      }
    },
    ".i-progress_item": {
      boxSizing: "border-box",
      margin: "0px -1.2px 0px 0px",
      minWidth: 0,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      position: "relative",
      $nest: {
        "&.i-progress_item-start": {
          borderWidth: 1,
          borderStyle: "solid",
          borderImage: "initial",
          borderRadius: 14,
          borderColor: Theme25.divider,
          padding: "4px 12px",
          order: 1
        },
        "&.i-progress_item-end": {
          boxSizing: "border-box",
          margin: 0,
          minWidth: 0,
          display: "flex",
          flexDirection: "column",
          cursor: "default",
          position: "relative",
          order: 3,
          alignItems: "flex-start"
        }
      }
    },
    "&.i-progress--stretch": {
      $nest: {
        "@media only screen and (max-width: 768px)": {
          $nest: {
            ".i-progress_wrapbar": {
              display: "none !important"
            },
            ".i-progress_item-end": {
              display: "none !important"
            },
            ".is-mobile": {
              display: "inline-block"
            },
            ".i-progress--grid": {
              gridTemplateColumns: "auto",
              justifyContent: "center"
            }
          }
        }
      }
    },
    ".i-progress--circle ~ .i-progress_text": {
      position: "absolute",
      top: "50%",
      left: 0,
      width: "100%",
      textAlign: "center",
      transform: "translateY(-50%)"
    },
    ".i-progress--line ~ .i-progress_text": {
      display: "inline-block",
      position: "absolute",
      left: "50%",
      transform: "translateX(-50%)"
    }
  }
});

// packages/progress/src/progress.ts
var Theme26 = theme_exports.ThemeVars;
var defaultVals = {
  percent: 0,
  height: 20,
  loading: false,
  steps: 1,
  type: "line"
};
var Progress = class extends Control {
  constructor(parent, options) {
    super(parent, options, {
      ...defaultVals
    });
    if (options == null ? void 0 : options.onRenderStart)
      this.onRenderStart = options.onRenderStart;
    if (options == null ? void 0 : options.onRenderEnd)
      this.onRenderEnd = options.onRenderEnd;
  }
  get percent() {
    return this._percent;
  }
  set percent(value) {
    this._percent = +value < 0 ? 0 : +value > 100 ? 100 : +value;
    const overlayElm = this.querySelector(".i-progress_overlay");
    if (overlayElm)
      overlayElm.style.width = `${this._percent}%`;
    if (this._percent > 0 && this._percent < 100)
      this._wrapperElm.classList.add("i-progress--active");
    else if (this._percent === 100)
      this._wrapperElm.classList.add("i-progress--success");
    if (this.format) {
      if (!this._textElm) {
        this._textElm = this.createElement("span", this);
        this._textElm.classList.add("i-progress_text");
        this._textElm.style.fontSize = this.progressTextSize + "px";
        this._textElm.style.color = this.strokeColor;
      }
      this._textElm.innerHTML = this.format(this._percent);
    }
    if (this.type === "circle") {
      this.updateCircleInner();
    }
  }
  get strokeColor() {
    return this._strokeColor || Theme26.colors.primary.main;
  }
  set strokeColor(value) {
    this._strokeColor = value;
  }
  get loading() {
    return this._loading;
  }
  set loading(value) {
    this._loading = value;
    if (value)
      this.classList.add("is-loading");
    else
      this.classList.remove("is-loading");
  }
  get steps() {
    return this._steps;
  }
  set steps(value) {
    this._steps = +value;
    const wrapbarElm = this.querySelector(".i-progress_bar");
    const overlayElm = this.querySelector(".i-progress_overlay");
    wrapbarElm.innerHTML = "";
    if (this._steps > 1) {
      const unitStep = 100 / this._steps;
      const percentStep = Math.ceil(this.percent / unitStep);
      const remainder = this.percent % unitStep;
      for (let i = 0; i < this._steps; i++) {
        const barItem = this.createElement("div");
        barItem.style.width = unitStep + "%";
        barItem.style.height = `${i + 1}px`;
        if (i === percentStep - 1 && remainder !== 0) {
          const childElm = this.createElement("div");
          childElm.classList.add("i-progress_bar-item");
          childElm.style.width = remainder * 100 / unitStep + "%";
          childElm.style.height = `${i + 1}px`;
          barItem.appendChild(childElm);
        } else if (i < percentStep) {
          barItem.classList.add("i-progress_bar-item");
        }
        wrapbarElm.appendChild(barItem);
      }
      wrapbarElm.classList.remove("has-bg");
      overlayElm && (overlayElm.style.display = "none");
    } else {
      wrapbarElm.classList.add("has-bg");
      overlayElm && (overlayElm.style.display = "block");
    }
  }
  get type() {
    return this._type;
  }
  set type(value) {
    this._type = value;
    if (value === "circle") {
      this.renderCircle();
    } else {
      this.renderLine();
    }
  }
  get strokeWidth() {
    return this._strokeWidth;
  }
  set strokeWidth(value) {
    this._strokeWidth = value || 2;
    const overlayElm = this.querySelector(".i-progress_wrapbar");
    if (overlayElm)
      overlayElm.style.height = `${this._strokeWidth}px`;
  }
  get font() {
    return {
      color: this._textElm.style.color,
      name: this._textElm.style.fontFamily,
      size: this._textElm.style.fontSize,
      bold: this._textElm.style.fontStyle.indexOf("bold") >= 0,
      style: this._textElm.style.fontStyle,
      transform: this._textElm.style.textTransform,
      weight: this._textElm.style.fontWeight
    };
  }
  set font(value) {
    if (this._textElm) {
      this._textElm.style.color = value.color || "";
      this._textElm.style.fontSize = value.size || "";
      this._textElm.style.fontWeight = value.bold ? "bold" : "";
      this._textElm.style.fontFamily = value.name || "";
      this._textElm.style.fontStyle = value.style || "";
      this._textElm.style.textTransform = value.transform || "none";
      this._textElm.style.fontWeight = value.bold ? "bold" : `${value.weight}` || "";
    }
  }
  get relativeStrokeWidth() {
    return (this.strokeWidth / +this.width * 100).toFixed(1);
  }
  get radius() {
    if (this.type === "circle") {
      const value = 50 - parseFloat(this.relativeStrokeWidth) / 2;
      return parseInt(value.toFixed(1), 10);
    } else {
      return 0;
    }
  }
  get trackPath() {
    const radius = this.radius;
    return `
          M 50 50
          m 0 -${radius}
          a ${radius} ${radius} 0 1 1 0 ${radius * 2}
          a ${radius} ${radius} 0 1 1 0 -${radius * 2}
          `;
  }
  get perimeter() {
    return 2 * Math.PI * this.radius;
  }
  get rate() {
    return 1;
  }
  get strokeDashoffset() {
    const offset = -1 * this.perimeter * (1 - this.rate) / 2;
    return `${offset}px`;
  }
  get trailPathStyle() {
    const strokeDasharray = `${this.perimeter * this.rate}px, ${this.perimeter}px`;
    const strokeDashoffset = this.strokeDashoffset;
    return `stroke-dasharray: ${strokeDasharray}; stroke-dashoffset: ${strokeDashoffset};`;
  }
  get circlePathStyle() {
    const strokeDasharray = `${this.perimeter * this.rate * (this.percent / 100)}px, ${this.perimeter}px`;
    const strokeDashoffset = this.strokeDashoffset;
    const transition = "stroke-dasharray 0.6s ease 0s, stroke 0.6s ease";
    return `stroke-dasharray: ${strokeDasharray}; stroke-dashoffset: ${strokeDashoffset}; transition: ${transition};`;
  }
  get stroke() {
    let ret = this.strokeColor;
    if (this.percent === 100)
      ret = Theme26.colors.success.main;
    return ret;
  }
  get trackColor() {
    return Theme26.divider;
  }
  get progressTextSize() {
    return this.type === "line" ? 12 + this.strokeWidth * 0.4 : +this.width * 0.111111 + 2;
  }
  renderLine() {
    this._wrapperElm.classList.add("i-progress--line");
    this._barElm = this.createElement("div", this._wrapperElm);
    this._barElm.classList.add("i-progress_wrapbar");
    this._barElm.innerHTML = `<div class="i-progress_bar"></div><div class="i-progress_overlay" style="background-color:${this.strokeColor}"></div>`;
  }
  renderCircle() {
    this._wrapperElm.classList.add("i-progress--circle");
    if (this.width)
      this.height = this.width;
  }
  renderCircleInner() {
    const templateHtml = `<svg viewBox="0 0 100 100">
            <path class="i-progress-circle__track"
            d="${this.trackPath}"
            stroke="${this.trackColor}"
            stroke-width="${this.relativeStrokeWidth}"
            fill="none"
            style="${this.trailPathStyle}"></path>
            <path
            class="i-progress-circle__path"
            d="${this.trackPath}"
            stroke="${this.stroke}"
            fill="none"
            stroke-linecap="round"
            stroke-width="${this.percent ? this.relativeStrokeWidth : 0}"
            style="${this.circlePathStyle}"></path>
        </svg>`;
    this._wrapperElm.innerHTML = "";
    this._wrapperElm.innerHTML = templateHtml;
  }
  updateCircleInner() {
    const svgPath = this._wrapperElm.querySelector(".i-progress-circle__path");
    if (svgPath) {
      svgPath.style.strokeDasharray = `${this.perimeter * this.rate * (this.percent / 100)}px, ${this.perimeter}px`;
      svgPath.setAttribute("stroke-width", `${this.percent ? this.relativeStrokeWidth : 0}`);
    }
  }
  init() {
    var _a, _b;
    if (!this.initialized) {
      super.init();
      if ((_a = this.options) == null ? void 0 : _a.onRenderStart)
        this.onRenderStart = this.options.onRenderStart;
      if ((_b = this.options) == null ? void 0 : _b.onRenderEnd)
        this.onRenderEnd = this.options.onRenderEnd;
      this.loading = this.getAttribute("loading", true);
      this.strokeColor = this.getAttribute("strokeColor", true);
      this._wrapperElm = this.createElement("div", this);
      this._wrapperElm.classList.add("i-progress");
      this.type = this.getAttribute("type", true);
      this.percent = this.getAttribute("percent", true);
      this.strokeWidth = this.getAttribute("strokeWidth", true);
      if (this.type === "line") {
        this.steps = this.getAttribute("steps", true);
        if (this.onRenderStart && typeof this.onRenderStart === "function") {
          this._wrapperElm.classList.add("i-progress--grid");
          this._startElm = this.createElement("div", this._wrapperElm);
          this._startElm.classList.add("i-progress_item", "i-progress_item-start");
          this.onRenderStart(this._startElm);
        }
        if (this.onRenderEnd && typeof this.onRenderEnd === "function") {
          this._wrapperElm.classList.add("i-progress--grid");
          this._endElm = this.createElement("div", this._wrapperElm);
          this._endElm.classList.add("i-progress_item", "i-progress_item-end");
          this.onRenderEnd(this._endElm);
        }
      }
      if (this.type === "circle")
        this.renderCircleInner();
    }
  }
  static async create(options, parent) {
    let self = new this(parent, options);
    await self.ready();
    return self;
  }
};
Progress = __decorateClass([
  customElements2("i-progress")
], Progress);

// packages/table/src/style/table.css.ts
var Theme27 = theme_exports.ThemeVars;
var tableStyle = style({
  fontFamily: Theme27.typography.fontFamily,
  fontSize: Theme27.typography.fontSize,
  color: Theme27.text.primary,
  display: "block",
  $nest: {
    "> .i-table-container": {
      overflowX: "auto"
    },
    ".i-table-cell": {
      padding: "1rem",
      overflowWrap: "break-word",
      position: "relative",
      textOverflow: "ellipsis",
      whiteSpace: "normal"
    },
    "> .i-table-container > table": {
      width: "100%",
      textAlign: "left",
      borderCollapse: "separate",
      borderSpacing: 0
    },
    ".i-table-header>tr>th": {
      fontWeight: 600,
      transition: "background .3s ease",
      borderBottom: `1px solid ${Theme27.divider}`
    },
    ".i-table-body>tr>td": {
      borderBottom: `1px solid ${Theme27.divider}`,
      transition: "background .3s ease"
    },
    "tr:hover td": {
      background: Theme27.background.paper,
      color: Theme27.text.secondary
    },
    "&.i-table--bordered": {
      $nest: {
        "> .i-table-container > table": {
          borderTop: `1px solid ${Theme27.divider}`,
          borderLeft: `1px solid ${Theme27.divider}`,
          borderRadius: "2px"
        },
        "> .i-table-container > table .i-table-cell": {
          borderRight: `1px solid ${Theme27.divider} !important`,
          borderBottom: `1px solid ${Theme27.divider}`
        }
      }
    },
    ".i-table-header i-table-column": {
      display: "inline-flex",
      gap: 10,
      alignItems: "center"
    },
    ".i-table-sort": {
      position: "relative",
      display: "inline-flex",
      flexDirection: "column",
      alignItems: "center",
      width: 20,
      $nest: {
        ".sort-icon": {
          display: "block",
          cursor: "pointer"
        },
        ".sort-icon.sort-icon--active > svg": {
          fill: Theme27.colors.primary.main
        },
        ".sort-icon.sort-icon--desc": {
          marginTop: -5
        }
      }
    },
    ".i-table-pagi": {
      display: "flex",
      width: "100%",
      $nest: {
        "&.is--left": {
          justifyContent: "flex-start"
        },
        "&.is--right": {
          justifyContent: "flex-end"
        },
        "&.is--center": {
          justifyContent: "center"
        }
      }
    },
    ".i-table-cell--expand": {
      cursor: "pointer",
      $nest: {
        "i-icon": {
          display: "inline-block"
        },
        "i-icon svg": {
          fill: Theme27.text.primary
        }
      }
    },
    ".i-table-row--child > td": {
      borderRight: `1px solid ${Theme27.divider}`
    },
    "@media (max-width: 767px)": {
      $nest: {
        ".hidden-mobile": {
          display: "none !important"
        }
      }
    },
    "@media (min-width: 768px)": {
      $nest: {
        ".hidden-desktop": {
          display: "none !important"
        }
      }
    }
  }
});
var getTableMediaQueriesStyleClass = (columns, mediaQueries) => {
  let styleObj = getControlMediaQueriesStyle(mediaQueries);
  for (let mediaQuery of mediaQueries) {
    let mediaQueryRule;
    if (mediaQuery.minWidth && mediaQuery.maxWidth) {
      mediaQueryRule = `@media (min-width: ${mediaQuery.minWidth}) and (max-width: ${mediaQuery.maxWidth})`;
    } else if (mediaQuery.minWidth) {
      mediaQueryRule = `@media (min-width: ${mediaQuery.minWidth})`;
    } else if (mediaQuery.maxWidth) {
      mediaQueryRule = `@media (max-width: ${mediaQuery.maxWidth})`;
    }
    if (mediaQueryRule) {
      const ruleObj = styleObj["$nest"][mediaQueryRule];
      styleObj["$nest"][mediaQueryRule] = {
        ...ruleObj,
        $nest: {}
      };
      if (mediaQuery.properties.fieldNames) {
        const fieldNames = mediaQuery.properties.fieldNames;
        for (let column of columns) {
          const fieldName = column.fieldName || "action";
          if (!fieldNames.includes(column.fieldName)) {
            styleObj["$nest"][mediaQueryRule]["$nest"][`[data-fieldname="${fieldName}"]`] = {
              display: "none"
            };
          } else if (column.visible === false) {
            styleObj["$nest"][mediaQueryRule]["$nest"][`[data-fieldname="${fieldName}"]`] = {
              display: "table-cell !important"
            };
            styleObj["$nest"][mediaQueryRule]["$nest"][`[data-fieldname="${fieldName}"]`] = {
              display: "table-cell !important",
              $nest: {
                "> i-table-column": {
                  display: "table-cell !important"
                }
              }
            };
            console.log(fieldName, styleObj["$nest"][mediaQueryRule]["$nest"][`[data-fieldname="${fieldName}"]`]);
          }
        }
      }
      if (mediaQuery.properties.expandable) {
        const expandable = mediaQuery.properties.expandable;
        styleObj["$nest"][mediaQueryRule]["$nest"][".i-table-row--child"] = {
          display: expandable.rowExpandable ? "none" : "none !important"
        };
      }
    }
  }
  return style(styleObj);
};

// packages/table/src/tableColumn.ts
var Theme28 = theme_exports.ThemeVars;
var TableColumn = class extends Control {
  constructor(parent, options) {
    super(parent, options);
  }
  get data() {
    return this._data;
  }
  set data(value) {
    this._data = value;
    this.columnElm.innerHTML = `${value}`;
  }
  get rowData() {
    return this._rowData;
  }
  set rowData(value) {
    this._rowData = value;
  }
  get sortOrder() {
    return this._sortOrder;
  }
  set sortOrder(value) {
    this._sortOrder = value;
    if (value === "asc") {
      this.ascElm && this.ascElm.classList.add("sort-icon--active");
      this.descElm && this.descElm.classList.remove("sort-icon--active");
    } else if (value === "desc") {
      this.ascElm && this.ascElm.classList.remove("sort-icon--active");
      this.descElm && this.descElm.classList.add("sort-icon--active");
    } else {
      this.ascElm && this.ascElm.classList.remove("sort-icon--active");
      this.descElm && this.descElm.classList.remove("sort-icon--active");
    }
    if (value && this.onSortChange)
      this.onSortChange(this, this.fieldName, value);
  }
  get textAlign() {
    return this._textAlign;
  }
  set textAlign(value) {
    this._textAlign = value || "left";
    this.style.textAlign = value;
  }
  renderSort() {
    if (!this.sortable) {
      this.sortElm && (this.sortElm.style.display = "none");
      return;
    }
    if (!this.sortElm) {
      this.sortElm = this.createElement("div", this);
      this.sortElm.classList.add("i-table-sort");
      this.ascElm = new Icon(this, {
        name: "caret-up",
        width: 14,
        height: 14,
        fill: Theme28.text.primary
      });
      this.ascElm.classList.add("sort-icon", "sort-icon--asc");
      this.ascElm.onClick = () => this.sortOrder = this.sortOrder === "asc" ? "none" : "asc";
      this.descElm = new Icon(this, {
        name: "caret-down",
        width: 14,
        height: 14,
        fill: Theme28.text.primary
      });
      this.descElm.classList.add("sort-icon", "sort-icon--desc");
      this.descElm.onClick = () => this.sortOrder = this.sortOrder === "desc" ? "none" : "desc";
      this.sortElm.appendChild(this.ascElm);
      this.sortElm.appendChild(this.descElm);
    }
    this.sortElm.style.display = "block";
  }
  async appendNode(params) {
    if (!params)
      return;
    const { tdElm, rowData, rowIndex, cell } = params;
    this.rowData = rowData;
    if (!this.columnElm || !this.onRenderCell)
      return;
    let node = await this.onRenderCell(this, this.data, rowData, rowIndex, cell);
    if (!node)
      return;
    if (cell.rowSpan === 0 || cell.columnSpan === 0) {
      this.remove();
      tdElm.remove();
      return;
    }
    cell.columnSpan > 1 && tdElm.setAttribute("colspan", cell.columnSpan + "");
    cell.rowSpan > 1 && tdElm.setAttribute("rowspan", cell.rowSpan + "");
    if (typeof node === "string" || typeof node === "number") {
      this.columnElm.innerHTML = node + "";
    } else {
      this.columnElm.innerHTML = "";
      this.columnElm.appendChild(node);
    }
  }
  init() {
    if (!this.columnElm) {
      this.caption = this.options.title;
      this.fieldName = this.options.fieldName;
      if (this.options.key)
        this.key = this.options.key;
      if (this.options.onRenderCell)
        this.onRenderCell = this.options.onRenderCell.bind(this);
      if (this.options.grid)
        this.grid = this.options.grid;
      if (this.options.display)
        this.display = this.options.display;
      if (this.options.textAlign)
        this.textAlign = this.options.textAlign;
      this.isHeader = this.options.header || false;
      this.visible = typeof this.options.visible === "boolean" ? this.options.visible : true;
      this.columnElm = this.createElement("div", this);
      this.data = this.getAttribute("data", true);
      if (this.isHeader) {
        this.columnElm.innerHTML = this.caption;
        this.sortable = this.getAttribute("sortable", true, false);
        if (this.options.onSortChange)
          this.onSortChange = this.options.onSortChange;
        if (this.options.sorter)
          this.sorter = this.options.sorter;
        this.renderSort();
        const sortOrder = this.getAttribute("sortOrder", true);
        if (sortOrder)
          this.sortOrder = sortOrder;
      }
    }
  }
};
TableColumn = __decorateClass([
  customElements2("i-table-column")
], TableColumn);

// packages/table/src/utils.ts
var paginate = (array, pageSize2, pageNumber) => {
  return array.slice((pageNumber - 1) * pageSize2, pageNumber * pageSize2);
};
var getSorter = (columns, key2) => {
  const findedColumn = columns.find((column) => column.fieldName === key2);
  return findedColumn ? findedColumn.sorter : null;
};
var orderBy = (list, sortConfig, columns) => {
  if (!sortConfig.length)
    return list;
  const sortFn = (a, b) => {
    let sorterCond;
    for (const config of sortConfig) {
      const { key: key2, direction } = config;
      const sortDirection = direction === "asc" ? 1 : -1;
      const sorter = getSorter(columns, key2);
      const value = sorter ? sorter(a, b) * sortDirection : (a[key2] > b[key2] ? 1 : a[key2] < b[key2] ? -1 : 0) * sortDirection;
      sorterCond = sorterCond || value;
    }
    return sorterCond || 0;
  };
  return list.sort((a, b) => sortFn(a, b));
};

// packages/table/src/tableRow.ts
var TableRow = class {
  constructor(cells) {
    this.cells = cells;
  }
  get cells() {
    return this._cells;
  }
  set cells(value) {
    this._cells = value;
  }
};

// packages/table/src/tableCell.ts
var TableCell = class {
  constructor(options) {
    this.rowSpan = options.rowSpan;
    this.columnSpan = options.columnSpan;
    this.value = options.value;
  }
  get rowSpan() {
    return this._rowSpan;
  }
  set rowSpan(value) {
    this._rowSpan = value;
  }
  get columnSpan() {
    return this._columnSpan;
  }
  set columnSpan(value) {
    this._columnSpan = value;
  }
  get value() {
    return this._value;
  }
  set value(data) {
    this._value = data;
  }
};

// packages/table/src/table.ts
var Table = class extends Control {
  constructor(parent, options) {
    super(parent, options, {
      heading: true
    });
    this._rows = [];
    this.firstLoad = true;
    this._sortConfig = {};
  }
  get data() {
    return this._data;
  }
  set data(value) {
    this._data = value;
    this.filteredData = value;
    if (this.pagination)
      this.pagination.totalPages = Math.ceil(value.length / this.pagination.pageSize);
    this.renderBody && this.renderBody();
  }
  get filteredData() {
    return this.sortFn(this._filteredData);
  }
  set filteredData(value) {
    this._filteredData = value;
  }
  get hasData() {
    return this.filteredData && this.filteredData.length;
  }
  get sortConfig() {
    if (!this._sortConfig || !Object.keys(this._sortConfig).length)
      return [];
    const list = [];
    for (const col of this.columns) {
      const direction = this._sortConfig[col.fieldName];
      if (direction && direction !== "none") {
        list.push({ key: col.fieldName, direction });
      }
    }
    return list;
  }
  sortFn(list) {
    if (!list)
      return [];
    if (this.sortConfig.length) {
      return orderBy([...list], this.sortConfig, this.columns);
    }
    return list;
  }
  get columns() {
    return this._columns || [];
  }
  set columns(value) {
    this._columns = value;
    this._heading && this.renderHeader();
    !this.firstLoad && this.renderBody && this.renderBody();
  }
  get rows() {
    return this._rows;
  }
  get pagination() {
    return this._pagination;
  }
  set pagination(value) {
    if (typeof value === "string") {
      const elm = document.querySelector(`#${value}`);
      if (elm instanceof Pagination)
        this._pagination = elm;
    } else if (value) {
      this._pagination = value;
      this.pagingElm.innerHTML = "";
      this.pagingElm.appendChild(this.pagination);
    }
    if (this._pagination) {
      this.pagingElm.style.display = "flex";
      if (this.data)
        this._pagination.totalPages = Math.ceil(this.data.length / this._pagination.pageSize);
      this._pagination.onPageChanged = this.onPageChanged.bind(this);
      this.renderBody();
    } else {
      this.pagingElm.style.display = "none";
    }
  }
  get expandable() {
    return this._expandable;
  }
  set expandable(value) {
    this._expandable = value;
  }
  get hasExpandColumn() {
    return this.expandable && !!this.expandable.onRenderExpandIcon;
  }
  get columnLength() {
    return this.columns.length;
  }
  get mediaQueries() {
    return this._mediaQueries;
  }
  set mediaQueries(value) {
    this._mediaQueries = value;
    const style2 = getTableMediaQueriesStyleClass(this.columns, this._mediaQueries);
    this._mediaStyle && this.classList.remove(this._mediaStyle);
    this._mediaStyle = style2;
    this.classList.add(style2);
  }
  onPageChanged(source, value) {
    this.renderBody();
  }
  onSortChange(source, key2, value) {
    this._sortConfig = this._sortConfig || {};
    this._sortConfig[key2] = value;
    if (this.filteredData)
      this.renderBody();
    if (this.onColumnSort)
      this.onColumnSort(this, key2, value);
  }
  renderHeader() {
    this.tHeadElm.innerHTML = "";
    const rowElm = this.createElement("tr", this.tHeadElm);
    if (this.hasExpandColumn) {
      const thElm = this.createElement("th", rowElm);
      thElm.classList.add("i-table-cell", "i-table-cell--expand", "text-center");
    }
    this.columns.forEach((column, colIndex) => {
      const thElm = this.createElement("th", rowElm);
      column.visible === false && (thElm.style.display = "none");
      thElm.classList.add("i-table-cell");
      thElm.setAttribute("data-fieldname", column.fieldName || "action");
      if (column.width)
        thElm.style.width = typeof column.width === "number" ? `${column.width}px` : column.width;
      column.textAlign && (thElm.style.textAlign = column.textAlign);
      const columnElm = new TableColumn(void 0, { ...column, header: true });
      columnElm.onSortChange = this.onSortChange.bind(this);
      thElm.appendChild(columnElm);
      rowElm.appendChild(thElm);
    });
  }
  _handleClick(event) {
    const target = event.target;
    if (target && this.hasData) {
      const rowElm = target.closest(".i-table-row");
      let colElm = target.closest("i-table-column");
      if (!colElm)
        colElm = target.firstChild;
      const tdElm = target.closest("td");
      const rowData = colElm ? colElm.rowData : null;
      const rowIndex = (rowElm == null ? void 0 : rowElm.getAttribute("data-index")) || -1;
      const colIndex = (tdElm == null ? void 0 : tdElm.getAttribute("data-index")) || -1;
      if (this.onCellClick)
        this.onCellClick(this, +rowIndex, +colIndex, rowData);
      if (this.expandable && rowElm) {
        const expandTd = rowElm.querySelector(".i-table-cell--expand");
        this.expandRow(rowElm, expandTd);
      }
    }
    return super._handleClick(event, true);
  }
  expandRow(rowElm, expandTd) {
    rowElm.classList.toggle("is--expanded");
    const expandElm = rowElm.nextElementSibling;
    if (expandElm) {
      const hidden = expandElm.style.display === "none";
      if (expandTd && this.expandable.onRenderExpandIcon) {
        expandTd.innerHTML = "";
        expandTd.appendChild(this.expandable.onRenderExpandIcon(this, hidden));
      }
      expandElm.style.display = hidden ? "table-row" : "none";
    }
  }
  async renderRow(rowElm, rowData, rowIndex) {
    if (this.expandable) {
      const expandIcon = this.expandable.onRenderExpandIcon;
      if (expandIcon) {
        const expandTd = this.createElement("td", rowElm);
        expandTd.appendChild(expandIcon(this, false));
        expandTd.classList.add("i-table-cell", "i-table-cell--expand", "text-center");
      }
    }
    let row = [];
    for (let colIndex = 0; colIndex < this.columns.length; colIndex++) {
      const column = this.columns[colIndex];
      const columnData = rowData[column.fieldName];
      const cell = new TableCell({
        columnSpan: 1,
        rowSpan: 1,
        value: columnData != null ? columnData : "--"
      });
      const tdElm = this.createElement("td", rowElm);
      column.visible === false && (tdElm.style.display = "none");
      tdElm.classList.add("i-table-cell");
      tdElm.setAttribute("data-index", colIndex.toString());
      tdElm.setAttribute("data-fieldname", column.fieldName || "action");
      if (column.width)
        tdElm.style.width = typeof column.width === "number" ? `${column.width}px` : column.width;
      column.textAlign && (tdElm.style.textAlign = column.textAlign);
      const columnElm = new TableColumn(this, {
        ...column,
        data: columnData != null ? columnData : "--"
      });
      tdElm.appendChild(columnElm);
      await columnElm.appendNode({ tdElm, rowData, rowIndex, cell });
      row.push(cell);
    }
    if (this._rows)
      this._rows[rowIndex] = new TableRow(row);
  }
  renderBody() {
    var _a, _b;
    this.tBodyElm.innerHTML = "";
    if (this.hasData) {
      const currentPage = ((_a = this.pagination) == null ? void 0 : _a.currentPage) || 1;
      const pageSize2 = ((_b = this.pagination) == null ? void 0 : _b.pageSize) || 10;
      const dataList = this.pagination ? paginate(this.filteredData, pageSize2, currentPage) : this.filteredData;
      dataList.forEach(async (row, rowIndex) => {
        const rowElm = this.createElement("tr", this.tBodyElm);
        rowElm.classList.add("i-table-row");
        const orderClass = (rowIndex + 1) % 2 === 0 ? "even" : "odd";
        rowElm.classList.add(orderClass);
        const rIndex = rowIndex + (currentPage - 1) * pageSize2;
        rowElm.setAttribute("data-index", rIndex.toString());
        this.renderRow(rowElm, row, rowIndex);
        if (this.expandable && this.expandable.onRenderExpandedRow) {
          const childElm = this.createElement("tr", this.tBodyElm);
          childElm.classList.add("i-table-row--child");
          childElm.style.display = "none";
          const tdChild = this.createElement("td", childElm);
          tdChild.setAttribute("colspan", `${this.columnLength + (this.hasExpandColumn ? 1 : 0)}`);
          const expandElm = await this.expandable.onRenderExpandedRow(row);
          if (typeof expandElm === "string")
            tdChild.innerHTML = expandElm;
          else
            tdChild.appendChild(expandElm);
          const hideExpanded = this.expandable.rowExpandable === false;
          if (hideExpanded)
            childElm.classList.add("hidden-desktop");
        }
      });
    } else {
      const rowElm = this.createElement("tr", this.tBodyElm);
      const tdElm = this.createElement("td", rowElm);
      tdElm.setAttribute("colspan", `${this.columnLength + (this.hasExpandColumn ? 1 : 0)}`);
      tdElm.classList.add("text-center");
      if (this.onRenderEmptyTable) {
        this.onRenderEmptyTable(this);
      } else {
        const label = this.createElement("span");
        label.textContent = "No data";
        tdElm.appendChild(label);
      }
    }
    this.firstLoad = false;
  }
  createTable() {
    const tableID = "TTable_" + Date.now();
    this._tableID = tableID;
    this.tableElm = this.createElement("table", this.wrapperElm);
    this.tableElm.id = tableID;
    this.tableElm.style.width = "100%";
    if (this._heading) {
      this.tHeadElm = this.createElement("thead", this.tableElm);
      this.tHeadElm.classList.add("i-table-header");
    }
    this.tBodyElm = this.createElement("tbody", this.tableElm);
    this.tBodyElm.classList.add("i-table-body");
  }
  filter(predicate) {
    const dataList = [...this.data];
    this.filteredData = dataList.filter(predicate);
    this.renderBody();
  }
  init() {
    var _a, _b, _c;
    if (!this.tableElm) {
      this.classList.add("i-table", tableStyle);
      if ((_a = this.options) == null ? void 0 : _a.onRenderEmptyTable)
        this.onRenderEmptyTable = this.options.onRenderEmptyTable;
      if ((_b = this.options) == null ? void 0 : _b.onColumnSort)
        this.onColumnSort = this.options.onColumnSort;
      if ((_c = this.options) == null ? void 0 : _c.onCellClick)
        this.onCellClick = this.options.onCellClick;
      this.wrapperElm = this.createElement("div", this);
      this.wrapperElm.classList.add("i-table-container");
      this._heading = this.getAttribute("heading", true, false);
      this.createTable();
      this.expandable = this.getAttribute("expandable", true);
      const columnsAttr = this.getAttribute("columns", true);
      columnsAttr && (this.columns = columnsAttr);
      this.pagingElm = this.createElement("div", this.wrapperElm);
      this.pagingElm.classList.add("i-table-pagi");
      this.pagingElm.style.display = "none";
      const paginationAttr = this.getAttribute("pagination");
      paginationAttr && (this.pagination = paginationAttr);
      const dataAttr = this.getAttribute("data", true);
      dataAttr && (this.data = dataAttr);
      const mediaQueries = this.getAttribute("mediaQueries", true);
      if (mediaQueries)
        this.mediaQueries = mediaQueries;
      super.init();
    }
  }
  connectedCallback() {
    super.connectedCallback();
    if (!this.pagination) {
      const pagination = this.getAttribute("pagination");
      pagination && (this.pagination = pagination);
    }
  }
  static async create(options, parent) {
    let self = new this(parent, options);
    await self.ready();
    return self;
  }
};
Table = __decorateClass([
  customElements2("i-table")
], Table);

// packages/carousel/src/style/carousel.css.ts
var Theme29 = theme_exports.ThemeVars;
cssRule("i-carousel-slider", {
  display: "block",
  position: "relative",
  width: "100%",
  overflow: "hidden",
  margin: 0,
  padding: 0,
  $nest: {
    ".wrapper-slider": {
      display: "flex",
      alignItems: "center"
    },
    ".wrapper-slider-list": {
      display: "block",
      width: "100%",
      overflow: "hidden"
    },
    ".slider-arrow": {
      width: 28,
      height: 28,
      fill: Theme29.colors.primary.main,
      cursor: "pointer"
    },
    ".slider-arrow-hidden": {
      visibility: "hidden"
    },
    ".slider-list": {
      display: "flex",
      position: "relative",
      transition: "transform 500ms ease"
    },
    ".slider-list > *": {
      flexShrink: "0"
    },
    ".dots-pagination": {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      margin: 0,
      padding: 0,
      marginTop: "1rem",
      listStyle: "none",
      gap: "0.4rem",
      $nest: {
        ".--dot": {
          display: "flex",
          cursor: "pointer"
        },
        ".--dot > span": {
          display: "inline-block",
          minWidth: "0.8rem",
          minHeight: "0.8rem",
          backgroundColor: "transparent",
          border: `2px solid ${Theme29.colors.primary.main}`,
          borderRadius: "50%",
          transition: "background-color 0.35s ease-in-out",
          textAlign: "center",
          fontSize: ".75rem",
          width: "auto",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis"
        },
        ".--active > span": {
          backgroundColor: Theme29.colors.primary.main
        }
      }
    }
  }
});

// packages/carousel/src/carousel.ts
var CarouselSlider = class extends Control {
  constructor(parent, options) {
    super(parent, options, { activeSlide: 0 });
    this._type = "dot";
    this.posX1 = 0;
    this.posX2 = 0;
    this.threshold = 30;
  }
  get slidesToShow() {
    return this._slidesToShow;
  }
  set slidesToShow(value) {
    this._slidesToShow = value;
    this.renderItems(this.items);
    if (this.isArrow) {
      this.renderArrows();
    } else {
      this.renderDotPagination();
    }
  }
  get transitionSpeed() {
    return this._transitionSpeed;
  }
  set transitionSpeed(value) {
    this._transitionSpeed = value;
    this.sliderListElm.style.transitionDuration = value + "ms";
  }
  get autoplay() {
    return this._autoplay;
  }
  set autoplay(value) {
    this._autoplay = value;
    this.setAutoplay();
  }
  get autoplaySpeed() {
    return this._autoplaySpeed;
  }
  set autoplaySpeed(value) {
    this._autoplaySpeed = value;
    this.setAutoplay();
  }
  get activeSlide() {
    return this._activeSlide || 0;
  }
  set activeSlide(value) {
    var _a;
    if (this.isArrow) {
      this.updateSliderByArrows(value);
      return;
    }
    const validValue = value >= 0 && value < this.dotsElm.length ? value : 0;
    this._activeSlide = validValue;
    const currentActive = this.dotPagination.querySelector("li.--active");
    const dot = this.dotsElm[this._activeSlide];
    currentActive && currentActive.classList.remove("--active");
    dot && dot.classList.add("--active");
    if (this._slider && this._slider.length) {
      const min = this.slidesToShow * validValue;
      const max = this.slidesToShow * (validValue + 1);
      for (let i = 0; i < this._slider.length; i++) {
        if (i >= min && i < max)
          this._slider[i].classList.add("is-actived");
        else
          this._slider[i].classList.remove("is-actived");
      }
    }
    const fixedWidth = this.slidesToShow === 1 && this._slider && ((_a = this._slider[0]) == null ? void 0 : _a.offsetWidth) && this._slider[0].offsetWidth !== this.offsetWidth;
    const tx = fixedWidth ? -this._slider[0].offsetWidth * this._activeSlide : -this.offsetWidth * this._activeSlide;
    this.sliderListElm.style.transform = `translateX(${tx}px)`;
  }
  get items() {
    return this._items;
  }
  set items(nodes) {
    this.renderItems(nodes);
    if (this.isArrow) {
      this.renderArrows();
    } else {
      this.renderDotPagination();
    }
    this.setAutoplay();
  }
  get type() {
    return this._type;
  }
  set type(value) {
    this._type = value;
    this.updateWrapperClass();
    if (this.isArrow) {
      this.renderArrows();
    } else {
      this.renderDotPagination();
    }
    if (this.arrowPrev)
      this.arrowPrev.visible = this.isArrow;
    if (this.arrowNext)
      this.arrowNext.visible = this.isArrow;
  }
  get swipe() {
    return this._swipe;
  }
  set swipe(value) {
    this._swipe = value;
    if (this._swipe) {
      this.sliderListElm.onmousedown = this.dragStartHandler;
      this.sliderListElm.addEventListener("touchstart", this.dragStartHandler);
      this.sliderListElm.addEventListener("touchend", this.dragEndHandler);
      this.sliderListElm.addEventListener("touchmove", this.dragHandler);
    } else {
      this.sliderListElm.onmousedown = null;
      this.sliderListElm.removeEventListener("touchstart", this.dragStartHandler);
      this.sliderListElm.removeEventListener("touchend", this.dragEndHandler);
      this.sliderListElm.removeEventListener("touchmove", this.dragHandler);
    }
  }
  get isArrow() {
    return this.type === "arrow";
  }
  disconnectCallback() {
    this.sliderListElm.onmousedown = null;
    this.sliderListElm.removeEventListener("touchstart", this.dragStartHandler);
    this.sliderListElm.removeEventListener("touchend", this.dragEndHandler);
    this.sliderListElm.removeEventListener("touchmove", this.dragHandler);
  }
  updateArrows(prev, next) {
    if (this.arrowPrev && this.arrowNext) {
      if (prev) {
        this.arrowPrev.classList.remove("slider-arrow-hidden");
      } else {
        this.arrowPrev.classList.add("slider-arrow-hidden");
      }
      if (next) {
        this.arrowNext.classList.remove("slider-arrow-hidden");
      } else {
        this.arrowNext.classList.add("slider-arrow-hidden");
      }
    }
  }
  updateSliderByArrows(value) {
    var _a;
    if (!this._slider)
      return;
    const lastIdx = value + this.slidesToShow;
    const validValue = value >= 0 && lastIdx <= this._slider.length ? value : 0;
    this.updateArrows(validValue > 0, lastIdx < this._slider.length);
    this._activeSlide = validValue;
    const fixedWidth = this.slidesToShow === 1 && this._slider && ((_a = this._slider[0]) == null ? void 0 : _a.offsetWidth) && this._slider[0].offsetWidth !== this.offsetWidth - 50;
    const itemWidth = this._slider && this._slider[0] ? this._slider[0].offsetWidth : (this.offsetWidth - 50) / this.slidesToShow;
    const tx = fixedWidth ? -this._slider[0].offsetWidth * this._activeSlide : -itemWidth * this._activeSlide;
    this.sliderListElm.style.transform = `translateX(${tx}px)`;
    if (this._slider && this._slider.length) {
      const min = validValue;
      const max = this.slidesToShow + validValue;
      for (let i = 0; i < this._slider.length; i++) {
        if (i >= min && i < max)
          this._slider[i].classList.add("is-actived");
        else
          this._slider[i].classList.remove("is-actived");
      }
    }
  }
  updateWrapperClass() {
    if (!this.wrapperSliderElm)
      return;
    if (this.isArrow) {
      this.wrapperSliderElm.classList.add("wrapper-slider");
    } else {
      this.wrapperSliderElm.classList.remove("wrapper-slider");
    }
  }
  renderItems(items) {
    if (!this.sliderListElm)
      return;
    this._items = items;
    this.sliderListElm.innerHTML = "";
    if (!items)
      return;
    let list = [];
    const min = this.slidesToShow * this.activeSlide;
    const max = this.slidesToShow * (this.activeSlide + 1);
    items.forEach((item, index) => {
      const carouselItem = new CarouselItem(this, item);
      carouselItem.style.width = 100 / this.slidesToShow + "%";
      if (index >= min && index < max)
        carouselItem.classList.add("is-actived");
      list.push(carouselItem);
      this._slider = list;
      this.sliderListElm.appendChild(carouselItem);
    });
  }
  renderDotPagination() {
    if (!this.dotPagination)
      return;
    this.dotPagination.innerHTML = "";
    this.dotsElm = [];
    if (this.isArrow) {
      this.dotPagination.classList.add("hidden");
      return;
    }
    this.dotPagination.classList.remove("hidden");
    if (this.hasChildNodes() && this.sliderListElm.childNodes.length) {
      const childLength = this.sliderListElm.childNodes.length;
      const totalDots = this.slidesToShow > 0 ? Math.ceil(childLength / this.slidesToShow) : childLength;
      for (let i = 0; i < totalDots; i++) {
        const dotElm = this.createElement("li", this.dotPagination);
        dotElm.classList.add("--dot");
        if (this.activeSlide === i)
          dotElm.classList.add("--active");
        this.createElement("span", dotElm);
        dotElm.addEventListener("click", () => {
          this.onDotClick(i);
          this.setAutoplay();
        });
        this.dotsElm.push(dotElm);
      }
    }
  }
  renderArrows() {
    if (!this.arrowPrev || !this.arrowNext)
      return;
    if (this.dotPagination) {
      this.dotPagination.innerHTML = "";
      this.dotPagination.classList.add("hidden");
      this.dotsElm = [];
    }
    if (this.hasChildNodes() && this.sliderListElm.childNodes.length) {
      const childLength = this.sliderListElm.childNodes.length;
      const isArrowShown = childLength > this.slidesToShow && this.isArrow;
      this.updateArrows(isArrowShown, isArrowShown);
    } else {
      this.updateArrows(false, false);
    }
  }
  onDotClick(index) {
    this.activeSlide = index;
  }
  setAutoplay() {
    if (this.timer) {
      clearInterval(this.timer);
    }
    if (this.autoplay) {
      if (!this.isArrow && this.dotsElm.length > 1) {
        this.timer = setInterval(() => {
          const index = this.activeSlide + 1 >= this.dotsElm.length ? 0 : this.activeSlide + 1;
          this.onDotClick(index);
        }, this.autoplaySpeed);
      } else if (this.isArrow) {
        this.timer = setInterval(() => {
          if (this._slider && this._slider.length > this.slidesToShow) {
            let idx = 0;
            if (this._slider) {
              idx = this.activeSlide + this.slidesToShow >= this._slider.length ? 0 : this.activeSlide + 1;
            }
            this.updateSliderByArrows(idx);
          }
        }, this.autoplaySpeed);
      }
    }
  }
  prev() {
    const index = this.activeSlide - 1 < 0 ? this.activeSlide : this.activeSlide - 1;
    this.activeSlide = index;
    this.setAutoplay();
  }
  next() {
    let index;
    if (!this.isArrow) {
      const total = this.slidesToShow > 0 ? Math.ceil(this._slider.length / this.slidesToShow) : this._slider.length;
      index = this.activeSlide + 1 >= total ? this.activeSlide : this.activeSlide + 1;
    } else {
      index = this.activeSlide + this.slidesToShow >= this._slider.length ? this.activeSlide : this.activeSlide + 1;
    }
    this.activeSlide = index;
    this.setAutoplay();
  }
  refresh() {
    super.refresh();
    if (this._slider && this._slider.length) {
      if (this.isArrow) {
        this.updateSliderByArrows(this.activeSlide);
        return;
      }
      const fixedWidth = this.slidesToShow === 1 && this._slider[0] && this._slider[0].offsetWidth && this._slider[0].offsetWidth !== this.offsetWidth;
      const tx = fixedWidth ? -this._slider[0].offsetWidth * this._activeSlide : -this.offsetWidth * this._activeSlide;
      this.sliderListElm.style.transform = `translateX(${tx}px)`;
    }
  }
  dragStartHandler(event) {
    if (event instanceof TouchEvent) {
      this.posX1 = event.touches[0].clientX;
      this.posX2 = 0;
    } else {
      event.preventDefault();
      this.posX1 = event.clientX;
      this.posX2 = 0;
      this.sliderListElm.onmouseup = this.dragEndHandler;
      this.sliderListElm.onmouseleave = this.dragEndHandler;
      this.sliderListElm.onmousemove = this.dragHandler;
    }
    this.isSwiping = false;
    if (this.onSwipeStart)
      this.onSwipeStart();
  }
  dragHandler(event) {
    var _a, _b;
    if (event instanceof TouchEvent) {
      this.posX2 = this.posX1 - event.touches[0].clientX;
    } else {
      this.posX2 = this.posX1 - event.clientX;
    }
    if (this.isArrow) {
      const fixedWidth = this.slidesToShow === 1 && this._slider && ((_a = this._slider[0]) == null ? void 0 : _a.offsetWidth) && this._slider[0].offsetWidth !== this.offsetWidth - 50;
      const itemWidth = this._slider && this._slider[0] ? this._slider[0].offsetWidth : (this.offsetWidth - 50) / this.slidesToShow;
      const tx = fixedWidth ? -this._slider[0].offsetWidth * this._activeSlide : -itemWidth * this._activeSlide;
      const tx2 = Math.min(Math.abs(this.posX2), itemWidth);
      this.sliderListElm.style.transform = `translateX(${tx - (this.posX2 > 0 ? tx2 : -tx2)}px)`;
    } else {
      const fixedWidth = this.slidesToShow === 1 && this._slider && ((_b = this._slider[0]) == null ? void 0 : _b.offsetWidth) && this._slider[0].offsetWidth !== this.offsetWidth;
      const tx = fixedWidth ? -this._slider[0].offsetWidth * this._activeSlide : -this.offsetWidth * this._activeSlide;
      this.sliderListElm.style.transform = `translateX(${tx - this.posX2}px)`;
    }
    this.isSwiping = Math.abs(this.posX2) > this.threshold;
  }
  dragEndHandler(event) {
    if (this.posX2 < -this.threshold) {
      this.prev();
    } else if (this.posX2 > this.threshold) {
      this.next();
    } else {
      this.refresh();
    }
    this.sliderListElm.onmouseup = null;
    this.sliderListElm.onmouseleave = null;
    this.sliderListElm.onmousemove = null;
    if (this.onSwipeEnd)
      this.onSwipeEnd(this.isSwiping);
  }
  init() {
    super.init();
    this.dragStartHandler = this.dragStartHandler.bind(this);
    this.dragHandler = this.dragHandler.bind(this);
    this.dragEndHandler = this.dragEndHandler.bind(this);
    this.type = this.getAttribute("type", true, "dot");
    this.wrapperSliderElm = this.createElement("div", this);
    this.updateWrapperClass();
    const wrapper = this.createElement("div", this.wrapperSliderElm);
    wrapper.classList.add("wrapper-slider-list");
    this.slidesToShow = this.getAttribute("slidesToShow", true, 1);
    this.sliderListElm = this.createElement("div", wrapper);
    this.sliderListElm.classList.add("slider-list");
    this.transitionSpeed = this.getAttribute("transitionSpeed", true, 500);
    this.arrowPrev = new Icon(void 0, { name: "angle-left", visible: this.isArrow });
    this.arrowNext = new Icon(void 0, { name: "angle-right", visible: this.isArrow });
    this.arrowPrev.classList.add("slider-arrow");
    this.arrowNext.classList.add("slider-arrow");
    this.arrowPrev.onClick = () => this.prev();
    this.arrowNext.onClick = () => this.next();
    this.wrapperSliderElm.prepend(this.arrowPrev);
    this.wrapperSliderElm.append(this.arrowNext);
    this.renderArrows();
    this.dotPagination = this.createElement("ul", this);
    this.dotPagination.classList.add("dots-pagination");
    this.renderDotPagination();
    this.autoplaySpeed = this.getAttribute("autoplaySpeed", true, 3e3);
    this.autoplay = this.getAttribute("autoplay", true);
    this.items = this.getAttribute("items", true, []);
    this.activeSlide = this.getAttribute("activeSlide", true, 0);
    this.swipe = this.getAttribute("swipe", true, false);
  }
  static async create(options, parent) {
    let self = new this(parent, options);
    await self.ready();
    return self;
  }
};
CarouselSlider = __decorateClass([
  customElements2("i-carousel-slider")
], CarouselSlider);
var CarouselItem = class extends Container {
  constructor(parent, options) {
    super(parent, options);
  }
  get name() {
    return this._name;
  }
  set name(value) {
    this._name = value;
  }
  addChildControl(control) {
    this.appendChild(control);
  }
  init() {
    this.name = this.options.name;
    this._controls = this.options.controls || [];
    super.init();
    this._controls.forEach((child2) => {
      this.addChildControl(child2);
    });
  }
  static async create(options, parent) {
    let self = new this(parent, options);
    await self.ready();
    return self;
  }
};
CarouselItem = __decorateClass([
  customElements2("i-carousel-item")
], CarouselItem);

// packages/moment/src/index.ts
RequireJS.config({
  paths: {
    "@moment": `${LibPath}lib/moment/2.29.1/moment.js`
  }
});
var moment;
RequireJS.require(["@moment"], (_moment) => {
  moment = _moment;
});

// packages/video/src/style/video.css.ts
cssRule("i-video", {
  $nest: {}
});

// packages/video/src/video.ts
var reqs = ["video-js"];
RequireJS.config({
  baseUrl: `${LibPath}lib/video-js`,
  paths: {
    "video-js": "video-js"
  }
});
function loadCss() {
  const cssId = "videoCss";
  if (!document.getElementById(cssId)) {
    const head = document.getElementsByTagName("head")[0];
    const link = document.createElement("link");
    link.id = cssId;
    link.rel = "stylesheet";
    link.type = "text/css";
    link.href = `${LibPath}lib/video-js/video-js.css`;
    link.media = "all";
    head.appendChild(link);
  }
}
var Video = class extends Container {
  get url() {
    return this._url;
  }
  set url(value) {
    this._url = value;
    if (value && !this.sourceElm)
      this.sourceElm = this.createElement("source", this.videoElm);
    if (this.sourceElm)
      this.sourceElm.src = value;
  }
  init() {
    if (!this.initialized) {
      super.init();
      loadCss();
      const self = this;
      let id = `video-${new Date().getTime()}`;
      this.videoElm = this.createElement("video-js", this);
      this.videoElm.id = id;
      this.videoElm.setAttribute("controls", "true");
      this.videoElm.setAttribute("preload", "auto");
      this.videoElm.classList.add("vjs-default-skin");
      this.sourceElm = this.createElement("source", this.videoElm);
      this.sourceElm.type = "application/x-mpegURL";
      this.url = this.getAttribute("url", true);
      RequireJS.require(reqs, function(videojs) {
        self.player = videojs(id, {
          playsinline: true,
          autoplay: false,
          controls: true,
          fluid: true,
          aspectRatio: "16:9",
          responsive: true,
          inactivityTimeout: 500,
          preload: "auto",
          techOrder: ["html5"],
          plugins: {}
        });
      });
    }
  }
  static async create(options, parent) {
    let self = new this(parent, options);
    await self.ready();
    return self;
  }
};
Video = __decorateClass([
  customElements2("i-video")
], Video);
/*!-----------------------------------------------------------
* Copyright (c) IJS Technologies. All rights reserved.
* Released under dual AGPLv3/commercial license
* https://ijs.network
*-----------------------------------------------------------*/
//! authors : Tim Wood, Iskren Chernev, Moment.js contributors
//! license : MIT
//! moment.js
//! momentjs.com
//! version : 2.29.4
  
});