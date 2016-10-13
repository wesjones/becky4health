define('bhHome', ['hb.directive'], function(directive) {
    directive('bhHome', function() {
        return {
            scope: true,
            link: ['scope', 'el', 'alias', function(scope, el, alias) {
                scope.goToForm = function() {
                    document.location.href = "./questionaire.html";
                };
            }]
        };
    });
});