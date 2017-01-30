internal('bhApp', ['app', 'hb.debug.dev', 'hb.directive', 'each'],
    function (app, debug, directive, each) {

        // :: PUBLIC API ::
        exports.boot = function () {
            //document.body.insertAdjacentHTML("beforeEnd", '<application class="hb"></application>');
            app.bootstrap(document.body);
        };
        window.validateForm = function () {
            return false;
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
                                pattern: '^(\\+\\d{1,2}\\s)?\\(?\\d{3}\\)?[\\s.-]?\\d{3}[\\s.-]?\\d{4}$',
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
                                    {name: 'male', label: 'Male'},
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
                                pattern: '\\d+ft(\\s+\\d+in)?',
                                error: 'Please enter your height like (5ft 2in).',
                                classes: 'mdl-textfield-sml'
                            },
                            relationship: {
                                name: 'relationship',
                                label: 'Relationship Status',
                                options: [
                                    {name: 'married', label: 'Married'},
                                    {name: 'single', label: 'Single'},
                                    {name: 'divorced', label: 'Divorced'},
                                    {name: 'other', label: 'Other'}
                                ]
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
                                pattern: '\\w+',
                                error: 'Please provide your state abreviation',
                                classes: 'mdl-textfield-mini'
                            },
                            zip: {
                                name: 'zip',
                                label: 'Zipcode',
                                pattern: '\\d{5}',
                                error: 'Please enter your zipcode',
                                classes: 'mdl-textfield-sml'
                            },
                            childrenAges: {
                                name: 'childrenAges',
                                label: 'Children/Ages',
                                subtext: '(e:Boy 10, Girl 8, ...)',
                                pattern: '',
                                error: "Please enter your children's ages",
                                classes: 'mdl-textfield-long'
                            },
                            pets: {
                                name: 'pets',
                                label: 'Pets',
                                options: [
                                    {name: 'no-pets', label: 'No', selected: true},
                                    {name: 'yes-pets', label: 'Yes'}
                                ]
                            },
                            doYouSmoke: {
                                name: 'doYouSmoke',
                                label: 'Do you Smoke?',
                                options: [
                                    {name: 'non-smoker', label: 'No', selected: true},
                                    {name: 'smoker', label: 'Yes'}
                                ]

                            },
                            drinkAlcohol: {
                                name: 'drinkAlcohol',
                                label: 'Drink Alcohol?',
                                options: [
                                    {name: 'no-alcohol', label: 'No', selected: true},
                                    {name: 'yes-alcoho', label: 'Yes'}
                                ]
                            },
                            occupation: {
                                name: 'occupation',
                                label: 'Occupation',
                                pattern: '',
                                error: "Please enter your occupation",
                                classes: 'mdl-textfield-med'
                            },
                            hoursOfWorkPerWeek: {
                                name: 'HoursOfWorkPerWeek',
                                label: 'Hours of work per week',
                                pattern: '',
                                error: "Please enter how many hours you work per week",
                                classes: 'mdl-textfield-long'
                            },
                            whatPromptedYouToContactMe: {
                                name: 'whatPromptedYouToContactMe',
                                label: 'What prompted you to contact me?',
                                pattern: '',
                                error: "Please say why you contact me",
                                classes: 'mdl-textfield-long'
                            },
                            inGeneralHowWouldYouRateYourOverallHealth: {
                                name: 'inGeneralHowWouldYouRateYourOverallHealth',
                                label: 'In general how would you rate your overall health?',
                                pattern: '',
                                error: "Please rate your overall health",
                                classes: 'mdl-textfield-long'
                            },
                            mainHealthConcerns: {
                                name: 'mainHealthConcerns',
                                label: 'What are your main health concerns?',
                                pattern: '',
                                error: "Please enter your main health concerns",
                                classes: 'mdl-textfield-long'
                            },
                            atWhatPointInYourLifeHaveYouFeltYourBest: {
                                name: 'atWhatPointInYourLifeHaveYouFeltYourBest',
                                label: 'At what point in your life have you felt your best?',
                                pattern: '',
                                error: "Please enter the time that you have felt your best",
                                classes: 'mdl-textfield-long'
                            },
                            howManyHoursDoYouSleep: {
                                name: 'howManyHoursDoYouSleep',
                                label: 'How many hours do you sleep per night?',
                                pattern: '',
                                error: "Please enter how many hours you sleep",
                                classes: 'mdl-textfield-long'
                            },
                            doYouWakeUpAtNight: {
                                name: 'doYouWakeUpAtNight',
                                label: 'Do you wake up during the night?',
                                pattern: '',
                                error: "Please enter if you wake up at night?",
                                classes: 'mdl-textfield-long'
                            },
                            timeToBed: {
                                name: 'timeToBed',
                                label: 'What time do you go to bed?',
                                pattern: '',
                                error: "Please enter the time you usually go to bed",
                                classes: 'mdl-textfield-long'
                            },
                            howDoYouFeelWhenYouWakeUp: {
                                name: 'howDoYouFeelWhenYouWakeUp',
                                label: 'How do you feel when you wake up?',
                                pattern: '',
                                error: "Please enter how you feel after you wake up",
                                classes: 'mdl-textfield-long'
                            },
                            anyPainStiffnessOrSwelling: {
                                name: 'anyPainStiffnessOrSwelling',
                                label: 'Do you have any pain, stiffness,or swelling?',
                                pattern: '',
                                error: "Please enter if you have any pain stiffness or swelling",
                                classes: 'mdl-textfield-long'
                            },
                            howIsYourDigestion: {
                                name: 'howIsYourDigestion',
                                label: 'How is your digestion?',
                                pattern: '',
                                error: "Please enter how is your digestion",
                                classes: 'mdl-textfield-long'
                            },
                            doYouExperienceConstipationBloatingDiarrhea: {
                                name: 'doYouExperienceConstipationBloatingDiarrhea',
                                label: 'Do you experience constipation, bloating, or diarrhea?',
                                pattern: '',
                                error: "Please enter if you have any of the listed above",
                                classes: 'mdl-textfield-long'
                            },
                            doYouHaveAllergiesOrSensitivities: {
                                name: 'doYouHaveAllergiesOrSensitivities',
                                label: 'Do you have allergies or sensitivities?',
                                pattern: '',
                                error: "Please enter what allergies or sensitivities that you have",
                                classes: 'mdl-textfield-long'
                            },
                            doYouTakeAnyMedicationSupplementsOrVitamins: {
                                name: 'doYouTakeAnyMedicationSupplementsOrVitamins',
                                label: 'Do you take any medication, supplements, or vitamins?',
                                pattern: '',
                                error: "Please enter if you take any medication listed above",
                                classes: 'mdl-textfield-long'
                            },
                            howMuchStressDoYouHaveInYourLifeRightNow: {
                                name: 'howMuchStressDoYouHaveInYourLifeRightNow',
                                label: 'How much stress do you have right now?',
                                options: [
                                    {name: 'stress-none', label: 'None'},
                                    {name: 'stress-moderate', label: 'Moderate'},
                                    {name: 'stress-decent', label: 'Decent'},
                                    {name: 'stress-surviving', label: 'Surviving'},
                                    {name: 'stress-overwhelmed', label: 'Overwhelmed'}
                                ],
                                classes: 'mdl-textfield-long'
                            },
                            whatIsYOurPrimaryStressInYourLifeAtThisTime: {
                                name: 'whatIsYOurPrimaryStressInYourLifeAtThisTime',
                                label: 'What is your primary stress in your life?',
                                pattern: '',
                                error: "Please enter what is the primary stress in your life now",
                                classes: 'mdl-textfield-long'
                            },
                            howOftenDoYouFeelRelaxedOrAtPeace: {
                                name: 'howOftenDoYouFeelRelaxedOrAtPeace',
                                label: 'How Often do you feel relaxed or at peace?',
                                options: [
                                    {name: 'always', label: 'Always'},
                                    {name: 'often', label: 'Often',},
                                    {name: 'sometimes', label: 'Sometimes'},
                                    {name: 'rarely', label: 'Rarely'},
                                    {name: 'never', label: 'Never'}
                                ],
                                classes: 'mdl-textfield-long'
                            },
                            areYouBeingTreatedForAnyEmotionalOrPhysicalConditionAtThisTime: {
                                name: 'areYouBeingTreatedForAnyEmotionalOrPhysicalConditionAtThisTime',
                                label: 'Are you being treated for any emotional or physical condition?',
                                pattern: '',
                                error: "Please enter if you are being treated for any emotional or physical condition now",
                                classes: 'mdl-textfield-long'
                            },
                            howIsYOurEnergyLevelThroughoutTheDay: {
                                name: 'howIsYOurEnergyLevelThroughoutTheDay',
                                label: 'How is your energy level throughout the day?',
                                pattern: '',
                                error: "Please enter how your energy is during the day",
                                classes: 'mdl-textfield-long'
                            },
                            whatGivesYouEnergy: {
                                name: 'whatGivesYouEnergy',
                                label: 'What gives you energy?',
                                pattern: '',
                                error: "Please enter what gives you energy",
                                classes: 'mdl-textfield-long'
                            },
                            whatZapsYouOfYourEnergy: {
                                name: 'whatZapsYouOfYourEnergy',
                                label: 'What zaps you of your energy?',
                                pattern: '',
                                error: "Please enter what zaps you of your energy",
                                classes: 'mdl-textfield-long'
                            },
                            doYouHaveAMorningRoutineThatYouPractice: {
                                name: 'doYouHaveAMorningRoutineThatYouPractice',
                                label: 'Do you have a morning routine that you practice?',
                                pattern: '',
                                error: "Please enter what your morning routine is",
                                classes: 'mdl-textfield-long'
                            },
                            doYouExercise: {
                                name: 'doYouExercise',
                                label: 'How many hours a week do you exercise?',
                                pattern: '',
                                error: "Please enter the hours you exercise per week.",
                                classes: 'mdl-textfield-long'
                            },
                            howDoYouExercise: {
                                name: 'howDoYouExercise',
                                label: 'What do you do for exercise?',
                                pattern: '',
                                error: "Please enter what you do for exercise.",
                                classes: 'mdl-textfield-long'
                            },
                            howSatisfiedAreYouWithYourExerciseLevel: {
                                name: 'howSatisfiedAreYouWithYourExerciseLevel',
                                label: 'How satisfied are you with your exercise level?',
                                pattern: '',
                                error: "Please enter how satisfied you are with your exercise level",
                                classes: 'mdl-textfield-long'
                            },
                            howSatisfiedAreYouWithYourCurrentEatingAndNutrition: {
                                name: 'howSatisfiedAreYouWithYourCurrentEatingAndNutrition',
                                label: 'How satisfied are you with your current eating and nutrition?',
                                pattern: '',
                                error: "Please enter how your are with your eating and nutrition now",
                                classes: 'mdl-textfield-long'
                            },
                            howSatisfiedAreYouWithYourWeight: {
                                name: 'howSatisfiedAreYouWithYourWeight',
                                label: 'How satisfied are you with your with your weight?',
                                pattern: '',
                                error: "Please enter how your weight or with is satisfied",
                                classes: 'mdl-textfield-long'
                            },
                            howSatisfiedAreYouWithYourLifeInGeneral: {
                                name: 'HowSatisfiedAreYouWithYourLifeInGeneral',
                                label: 'How satisfied is your life in general?',
                                pattern: '',
                                error: "Please enter how your life is in general",
                                classes: 'mdl-textfield-long'
                            },
                            whatWouldYouLikeToDoToChangeForTheBetter: {
                                name: 'whatWouldYouLikeToDoToChangeForTheBetter',
                                label: 'What would you like to do to change for the better?',
                                pattern: '',
                                error: "Please enter what you would like to do to change for the better.",
                                classes: 'mdl-textfield-long'
                            },
                            howWouldYouRateYourOverallSelfEsteem: {
                                name: 'howWouldYouRateYourOverallSelfEsteem',
                                label: 'How would you rate your overall Self-Esteem?',
                                options: [
                                    {name: 'esteem-poor', label: 'Poor'},
                                    {name: 'esteem-fair', label: 'Fair'},
                                    {name: 'esteem-good', label: 'Good'},
                                    {name: 'esteem-very-good', label: 'Very Good'},
                                    {name: 'esteem-excellent', label: 'Excellent'}
                                ],
                                classes: 'mdl-textfield-long'
                            },
                            whatPositiveQualitiesDoYouHaveThatWillHelpYouReachYourGoals: {
                                name: 'whatPositiveQualitiesDoYouHaveThatWillHelpYouReachYourGoals',
                                label: 'What positive qualities do you have that will help you reach your goals?',
                                pattern: '',
                                error: "Please enter the qualities that will help you reach your goals",
                                classes: 'mdl-textfield-long'
                            },
                            whatPositiveQualitiesWouldYouLikeToDevelop: {
                                name: 'whatPositiveQualitiesWouldYouLikeToDevelop',
                                label: 'What positive qualities would you like to develop?',
                                pattern: '',
                                error: "Please enter the qualities that that you want to develop",
                                classes: 'mdl-textfield-long'
                            },
                            ifMoneyOrTimeWereNotRelativeHowWouldYouLikeToSpendYourTime: {
                                name: 'ifMoneyOrTimeWereNotRelativeHowWouldYouLikeToSpendYourTime',
                                label: 'If money or time were not relative, how would you like to spend your time?',
                                pattern: '',
                                error: "Please enter what you would do to this question",
                                classes: 'mdl-textfield-long'
                            },
                            whatIsTheHardestThingInLifeSoFarHaveYouHadToOvercome: {
                                name: 'whatIsTheHardestThingInLifeSoFarHaveYouHadToOvercome',
                                label: 'What is the hardest thing in life so far have you had to overcome?',
                                pattern: '',
                                error: "Please enter what has been the hardest thing you have overcome",
                                classes: 'mdl-textfield-long'
                            },
                            inSixMonthsFromNowWhatWouldYouLikeYourLifeToLookLite: {
                                name: 'inSixMonthsFromNowWhatWouldYouLikeYourLifeToLookLite',
                                label: 'In 6 months from now, what would you like your life to look like?',
                                pattern: '',
                                error: "Please enter what you would like your life too look like from now on",
                                classes: 'mdl-textfield-long'
                            },
                            whatAreYourHobbiesOrSpecialInterests: {
                                name: 'whatAreYourHobbiesOrSpecialInterests',
                                label: 'What are your hobbies or special interests?',
                                pattern: '',
                                error: "Please enter what your hobbies or special interests are",
                                classes: 'mdl-textfield-long'
                            },
                            doYouHaveAnyConcernsOrReservationsAboutWorkingWithACoach: {
                                name: 'doYouHaveAnyConcernsOrReservationsAboutWorkingWithACoach',
                                label: 'Do you have any concerns or reservations about working with a coach?',
                                pattern: '',
                                error: "Please enter if you have reservations about working with a coach",
                                classes: 'mdl-textfield-long'
                            },
                            howWouldYouLikeToBeCoached: {
                                name: 'howWouldYouLikeToBeCoached',
                                label: 'How would you like to be coached?',
                                pattern: '',
                                error: "Please enter how you would like to be coached",
                                classes: 'mdl-textfield-long'
                            },
                            whatAreYourExpectationsForMeAsACoach: {
                                name: 'whatAreYourExpectationsForMeAsACoach',
                                label: 'What are your expectations for me as your coach?',
                                pattern: '',
                                error: "Please enter what your expectations are for me as a coach",
                                classes: 'mdl-textfield-long'
                            },
                            whatAreasDoYouWantToWorkOnWithMe: {
                                name: 'whatAreasDoYouWantToWorkOnWithMe',
                                label: 'What areas do you want to work on with me?',
                                options: [
                                    {name: 'nutrition', label: 'Nutrition', selected: false},
                                    {name: 'exercise', label: 'Exercise', selected: false},
                                    {name: 'de-stressing', label: 'De-Stressing', selected: false},
                                    {name: 'relationships', label: 'Relationships', selected: false},
                                    {name: 'spirituality', label: 'Spirituality', selected: false},
                                    {name: 'emotionalSupport', label: 'Emotional Support', selected: false}
                                ],
                                classes: 'mdl-textfield-long'
                            },
                            isThereAnythingElseYouWouldLikeMeToKnowAboutYouThatWouldHelpOurCoachingSessionTogether: {
                                name: 'isThereAnythingElseYouWouldLikeMeToKnowAboutYouThatWouldHelpOurCoachingSessionTogether',
                                label: 'Is there anything else you would like me to know about you?',
                                pattern: '',
                                error: "Please enter if there is anything else you would like me to know about you",
                                classes: 'mdl-textfield-full'
                            },
                            doYouHaveAnyQuestionsForMeAsYourCoach: {
                                name: 'doYouHaveAnyQuestionsForMeAsYourCoach',
                                label: 'Do you have any questions for me as your coach?',
                                pattern: '',
                                error: "Please enter if there is anything else you would like me to know about you that would help our coaching session together",
                                classes: 'mdl-textfield-full'
                            },
                            whichWaysCanICommunicateWithYou: {
                                name: 'whichWaysCanICommunicateWithYou',
                                label: 'Which ways can I communicate with you?',
                                options: [
                                    {name: 'by-text', label: 'Text'},
                                    {name: 'by-phone', label: 'Phone'},
                                    {name: 'by-email', label: 'Email'},
                                    {name: 'by-skype', label: 'Skype'},
                                    {name: 'in-person', label: 'In Person (local only)'}
                                ]
                            },
                        }
                    };
                    scope.submit = function () {
                        // we need to validate here.
                        var total = scope.$c.length;
                        var filled = 0;
                        each(scope.$c, function ($s) {
                            if ($s.field.value !== undefined) {
                                filled += 1;
                            }
                        });

                        function send() {
                            var form = el.querySelector('form');
                            form.action = "php/form.php";
                            form.method = "POST";
                            form.enctype = "multipart/form-data";
                            form.onsubmit = "";
                            form.submit();
                        }

                        if (filled < total) {
                            var result = confirm("You have only filled in " + ((filled/total)*100).toFixed(1) + "% of the form. Are you sure you want to send it now?");
                            if (result) {
                                send();
                            }
                        }
                    };
                }]
            };
        });
    });
