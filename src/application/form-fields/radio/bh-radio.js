define('bhRadio', ['hb.directive'], function(directive) {
    directive('bhRadio', function() {
        return {
            scope: true,
            replace: true,
            tplUrl: "application/form-fields/radio/bh-radio.html",
            link: ['scope', 'el', 'alias', function(scope, el, alias) {
                scope.field = scope.$eval(alias.value);
            }]
        };
    });
});