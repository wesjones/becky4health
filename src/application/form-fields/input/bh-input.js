define('bhInput', ['hb.directive'], function(directive) {
    directive('bhInput', function() {
        return {
            scope: true,
            replace: true,
            tplUrl: "input/bh-input.html",
            link: ['scope', 'el', 'alias', function(scope, el, alias) {
                scope.field = scope.$eval(alias.value);
            }]
        };
    });
});