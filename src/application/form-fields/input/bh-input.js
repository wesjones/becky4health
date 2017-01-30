define('bhInput', ['hb.directive'], function(directive) {
    directive('bhInput', function() {
        return {
            scope: true,
            replace: true,
            tplUrl: "application/form-fields/input/bh-input.html",
            link: ['scope', 'el', 'alias', function(scope, el, alias) {
                scope.field = scope.$eval(alias.value);
            }]
        };
    });
});