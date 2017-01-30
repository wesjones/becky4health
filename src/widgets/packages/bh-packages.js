define('bhPackages', ['hb.directive'], function(directive) {
    directive('bhPackages', function() {
        return {
            scope: true,
            tplUrl: "widgets/packages/bh-packages.html",
            link: ['scope', 'el', function(scope, el) {

            }]
        }
    })
});