/**
 * This creates and bootstraps the application
 **/
/**
 * @typedef {Function} internal
 */
internal('app', ['module', 'dispatcher', 'ready', 'loader', 'findScriptUrls'],
    function (module, dispatcher, ready, loader, findScriptUrls) {

        dispatcher(exports);// if it is already a dispatcher it does nothing.

        var name = 'widgets';

        var app = dispatcher(module('app'));

        app.preLink = function (el, directive) {
            if (directive.alias.name.indexOf('hb-') === -1 && directive.alias.name.indexOf('-') !== -1) {
                el.classList.add(directive.alias.name);
                el.setAttribute('ng-non-bindable', '');
            }
        };

        var assets = [name + '.css'];
        var urls = findScriptUrls(new RegExp(name + '(\.min)?\.js$'), 'i');
        if (urls.length) {
            var scriptUrl = urls[0].substring(0, urls[0].lastIndexOf('/'));
            var len = assets.length;
            for (var i = 0; i < len; i += 1) {
                assets[i] = scriptUrl + '/' + assets[i];
            }

            loader.load(assets, function () {
                ready(function () {
                    app.bootstrap(document.body);
                    delete exports.$$;

                    exports.fire('ready', app);
                });
            });
        }

        return app;
    });
