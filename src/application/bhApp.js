internal('bhApp', ['app', 'hb.debug.dev', 'hb.directive'],
    function (app, debug, directive) {

        // :: PUBLIC API ::
        exports.boot = function () {
            //document.body.insertAdjacentHTML("beforeEnd", '<application class="hb"></application>');
            app.bootstrap(document.body);
        };

        directive('bhApp', function () {
            return {
                scope: true,
                link: ['scope', 'el', 'attr', function (scope, el, attr) {
                    scope.model = {
                        title: 'Becky For Health Signup Form',
                        profile: {
                            firstName: {
                                name: 'first_name',
                                label: 'First Name',
                                pattern: '[A-Za-z]+',
                                error: 'Please enter your first name.',
                                classes: ''
                            },
                            lastName: {
                                name: 'last_name',
                                label: 'Last Name',
                                pattern: '[A-Za-z]+',
                                error: 'Please enter your last name.',
                                classes: ''
                            },
                            email: {
                                name: 'email',
                                label: 'Email',
                                pattern: '[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,3}$',
                                error: 'Please enter a valid email address.',
                                classes: ''
                            },
                            phone: {
                                name: 'phone',
                                label: 'Phone',
                                subtext: '###-###-####',
                                pattern: '^(\\+\\d{1,2}\\s)?\\(?\\d{3}\\)?[\\s.-]\\d{3}[\\s.-]\\d{4}$',
                                error: 'Please enter a valid phone number.',
                                classes: ''
                            },
                            age: {
                                name: 'age',
                                label: 'Age',
                                pattern: '\\d+$',
                                error: 'You must be at least 13 years of age.',
                                classes: 'mdl-textfield-mini'
                            },
                            gender: {
                                name: 'gender',
                                label: 'Gender',
                                options: [
                                    {name: 'male', label: 'Male', selected: true},
                                    {name: 'female', label: 'Female'}
                                ]
                            },
                            weight: {
                                name: 'weight',
                                label: 'Weight',
                                pattern: '\\d+(lbs)?$',
                                error: 'Please enter your weight.',
                                classes: 'mdl-textfield-sml'
                            },
                            height: {
                                name: 'height',
                                label: 'Height',
                                subtext: '(e:5ft 2in)',
                                pattern: '\d+ft(\s+\d+in)?$',
                                error: 'Please enter your height like (5ft 2in).',
                                classes: 'mdl-textfield-sml'
                            },
                            relationship: {
                                name: 'relationship',
                                label: 'Relationship Status',
                                pattern: '[\\w\\s]+$',
                                error: 'Please describe your relationship status.',
                                classes: 'mdl-textfield-long'
                            },
                            mailingAddress: {
                                name: 'mailingAddress',
                                label: 'Mailing Address',
                                pattern: '[\\w\\s\\.\\-]+$',
                                error: 'Please provide your maliing address',
                                classes: ''
                            },
                            city: {
                                name: 'city',
                                label: 'City',
                                pattern: '[\\w\\s]+$',
                                error: 'Please provide your City',
                                classes: 'mdl-textfield-med'
                            },
                            state: {
                                name: 'state',
                                label: 'State',
                                pattern: '[A-Za-z]{2}',
                                error: 'Please provide your state abreviation',
                                classes: 'mdl-textfield-mini'
                            },
                            zip: {
                                name: 'zip',
                                label: 'Zipcode',
                                pattern: '\\d{5}(\\-\\d+)?$',
                                error: 'Please enter your zipcode',
                                classes: 'mdl-textfield-sml'
                            },
                            childrenAges: {
                                name: 'childrenAges',
                                label: 'Children/Ages',
                                pattern: '\\d+$',
                                error: "Please enter your children's ages",
                                classes: 'mdl-textfield-sml'
                            },
                            pets: {
                                name: 'pets',
                                label: 'Pets',
                                pattern: '\\d+$',
                                error: "Please enter if you have pets",
                                classes: 'mdl-textfield-sml'
                            },
                            doYouSmoke: {
                                name: 'doYouSmoke',
                                label: 'Do you Smoke?',
                                pattern: '\\d+$',
                                error: "Please enter if you smoke",
                                classes: 'mdl-textfield-sml'
                            },
                            drinkAlcohol: {
                                name: 'drinkAlcohol',
                                label: 'Drink Alcohol?',
                                pattern: '\\d+$',
                                error: "Please enter if you drink alcohol",
                                classes: 'mdl-textfield-sml'
                            },
                            occupation: {
                                name: 'occupation',
                                label: 'Occupation',
                                pattern: '\\d+$',
                                error: "Please enter your occupation",
                                classes: 'mdl-textfield-sml'
                            },
                            hoursOfWorkPerWeek: {
                                name: 'HoursOfWorkPerWeek',
                                label: 'Hours of work per week',
                                pattern: '\\d+$',
                                error: "Please enter how many hours you work per week",
                                classes: 'mdl-textfield-sml'
                            },
                            whatPromptedYouToContactMe: {
                                name: 'whatPromptedYouToContactMe',
                                label: 'What prompted you to contact me?',
                                pattern: '\\d+$',
                                error: "Please say why you contacted me",
                                classes: 'mdl-textfield-sml'
                            }
                        }
                    };
                }]
            };
        });
    });
