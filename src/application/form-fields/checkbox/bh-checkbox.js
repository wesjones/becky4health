define('bhCheckbox', ['hb.directive'], function(directive) {
    directive('bhCheckbox', function() {
        return {
            scope: true,
            replace: true,
            tplUrl: "checkbox/bh-checkbox.html",
            link: ['scope', 'el', 'alias', function(scope, el, alias) {
                scope.field = scope.$eval(alias.value);
            }]
        };
    });
});