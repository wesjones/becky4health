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
                                options: [
                                    {name: 'no', label: 'No', selected: true},
                                    {name: 'yes', label: 'Yes'}
                                ]
                            },
                            doYouSmoke: {
                                name: 'doYouSmoke',
                                label: 'Do you Smoke?',
                                options: [
                                    {name: 'no', label: 'No', selected: true},
                                    {name: 'yes', label: 'Yes'}
                                ]

                            },
                            drinkAlcohol: {
                                name: 'drinkAlcohol',
                                label: 'Drink Alcohol?',
                                options: [
                                    {name: 'no', label: 'No', selected: true},
                                    {name: 'yes', label: 'Yes'}
                                ]
                            },
                            occupation: {
                                name: 'occupation',
                                label: 'Occupation',
                                pattern: '\\d+$',
                                error: "Please enter your occupation",
                                classes: 'mdl-textfield-med'
                            },
                            hoursOfWorkPerWeek: {
                                name: 'HoursOfWorkPerWeek',
                                label: 'Hours of work per week',
                                pattern: '\\d+$',
                                error: "Please enter how many hours you work per week",
                                classes: 'mdl-textfield-long'
                            },
                            whatPromptedYouToContactMe: {
                                name: 'whatPromptedYouToContactMe',
                                label: 'What prompted you to contact me?',
                                pattern: '\\d+$',
                                error: "Please say why you contact me",
                                classes: 'mdl-textfield-long'
                            },
                            inGeneralHowWouldYouRateYourOverallHealth: {
                                name: 'inGeneralHowWouldYouRateYourOverallHealth',
                                label: 'In general how would you rate your overall health',
                                pattern: '\\d+$',
                                error: "Please rate your overall health",
                                classes: 'mdl-textfield-long'
                            },
                            mainHealthConcerns: {
                                name: 'mainHealthConcerns',
                                label: 'Main Health Concerns',
                                pattern: '\\d+$',
                                error: "Please enter your main health concerns",
                                classes: 'mdl-textfield-long'
                            },
                            anyOtherConcerns: {
                                name: 'anyOtherConcerns',
                                label: 'Any other concerns',
                                pattern: '\\d+$',
                                error: "Please enter all your concerns",
                                classes: 'mdl-textfield-long'
                            },
                            atWhatPointInYourLifeHaveYouFeltYourBest: {
                                name: 'atWhatPointInYourLifeHaveYouFeltYourBest',
                                label: 'At What point in your life have you felt your best',
                                pattern: '\\d+$',
                                error: "Please enter the time that you have felt your best",
                                classes: 'mdl-textfield-long'
                            },
                            wellnessGoals: {
                                name: 'wellnessGoals',
                                label: 'Wellness Goals',
                                pattern: '\\d+$',
                                error: "Please enter your wellness goals",
                                classes: 'mdl-textfield-long'
                            },
                            howIsYourSleep: {
                                name: 'howIsYourSleep',
                                label: 'How is your sleep Goals',
                                pattern: '\\d+$',
                                error: "Please enter if you sleep good or not",
                                classes: 'mdl-textfield-long'
                            },
                            howManyHoursDoYouSleep: {
                                name: 'howManyHoursDoYouSleep',
                                label: 'How many hours do you sleep?',
                                pattern: '\\d+$',
                                error: "Please enter how many hours you sleep",
                                classes: 'mdl-textfield-long'
                            },
                            doYouWakeUpAtNight: {
                                name: 'doYouWakeUpAtNight',
                                label: 'Do you wake up at night?',
                                pattern: '\\d+$',
                                error: "Please enter if you wake up at night?",
                                classes: 'mdl-textfield-long'
                            },
                            timeToBed: {
                                name: 'timeToBed',
                                label: 'Time to Bed',
                                pattern: '\\d+$',
                                error: "Please enter the time you usually go to bed",
                                classes: 'mdl-textfield-long'
                            },
                            timeWakeUp: {
                                name: 'timeWakeUp',
                                label: 'Time wake up',
                                pattern: '\\d+$',
                                error: "Please enter the time you usually wake up",
                                classes: 'mdl-textfield-long'
                            },
                            howDoYouFeelWhenYouWakeUp: {
                                name: 'howDoYouFeelWhenYouWakeUp',
                                label: 'How do you feel when you wake up?',
                                pattern: '\\d+$',
                                error: "Please enter how you feel after you wake up",
                                classes: 'mdl-textfield-long'
                            },
                            anyPainStiffnessOrSwelling: {
                                name: 'anyPainStiffnessOrSwelling',
                                label: 'Any Pain,Stiffness,or swelling?',
                                pattern: '\\d+$',
                                error: "Please enter if you have any pain stiffness or swelling",
                                classes: 'mdl-textfield-long'
                            },
                            whatDoYouDoForIt: {
                                name: 'whatDoYouDoForIt',
                                label: 'What do you do for it?',
                                pattern: '\\d+$',
                                error: "Please enter what you do for it",
                                classes: 'mdl-textfield-long'
                            },
                            howIsYourDigestion: {
                                name: 'howIsYourDigestion',
                                label: 'How is your digestion?',
                                pattern: '\\d+$',
                                error: "Please enter how is your digestion",
                                classes: 'mdl-textfield-long'
                            },
                            doYouExperienceConstipationBloatingDiarrhea: {
                                name: 'doYouExperienceConstipationBloatingDiarrhea',
                                label: 'Do you experience Constipation,Bloating,Diarrhea?',
                                pattern: '\\d+$',
                                error: "Please enter if you have any of the listed above",
                                classes: 'mdl-textfield-long'
                            },
                            doYouHaveAllergiesOrSensitivities: {
                                name: 'doYouHaveAllergiesOrSensitivities',
                                label: 'Do you have Allergies or Sensitivities?',
                                pattern: '\\d+$',
                                error: "Please enter what allergies or sensitivities that you have",
                                classes: 'mdl-textfield-long'
                            },
                            doYouTakeAnyMedicationSupplementsOrVitamins: {
                                name: 'doYouTakeAnyMedicationSupplementsOrVitamins',
                                label: 'Do you take any medication, supplements, or Vitamins?',
                                pattern: '\\d+$',
                                error: "Please enter if you take any medication listed above",
                                classes: 'mdl-textfield-long'
                            },
                            howMuchStressDoYouHaveInYourLifeRigtNow: {
                                name: 'howMuchStressDoYouHaveInYourLifeRigtNow',
                                label: 'How much stress do you have in your life right now?(On a scale of 1-10)',
                                pattern: '\\d+$',
                                error: "Please enter the stress you have in your life now",
                                classes: 'mdl-textfield-long'
                            },
                            whatIsYOurPrimaryStresserInYourLifeAtThisTime: {
                                name: 'whatIsYOurPrimaryStresserInYourLifeAtThisTime',
                                label: 'What is your primary stresser in your life at this time?',
                                pattern: '\\d+$',
                                error: "Please enter what is the primary stresser in your life now",
                                classes: 'mdl-textfield-long'
                            },
                            howOftenDoYouFeelRelaxedOrAtPeace: {
                                name: 'howOftenDoYouFeelRelaxedOrAtPeace',
                                label: 'How Often do you feel relaxed or at peace?',
                                pattern: '\\d+$',
                                error: "Please enter how often you feel relaxed or at peace",
                                classes: 'mdl-textfield-long'
                            },
                            mostOfTheTimeSometimesRarelyorNever: {
                                name: 'mostOfTheTimeSometimesRarelyorNever',
                                label: 'Most of the time, Sometimes, Rarely, or Never',
                                pattern: '\\d+$',
                                error: "Please enter if you feel stressed sometimes, rareley, or never",
                                classes: 'mdl-textfield-long'
                            },
                            areYouBeingTreatedForAnyEmotionalOrPhysicalConditionAtThisTime: {
                                name: 'areYouBeingTreatedForAnyEmotionalOrPhysicalConditionAtThisTime',
                                label: 'Are you being treated for any emotional or physical condition at this time?',
                                pattern: '\\d+$',
                                error: "Please enter if you are being treated for any emotional or physical condition now",
                                classes: 'mdl-textfield-long'
                            },
                            howIsYOurEnergyLevelThroughoutTheDay: {
                                name: 'howIsYOurEnergyLevelThroughoutTheDay',
                                label: 'How is your energy level throughout the day?',
                                pattern: '\\d+$',
                                error: "Please enter how your energy is during the day",
                                classes: 'mdl-textfield-long'
                            },
                            whatGivesYouEnergy: {
                                name: 'whatGivesYouEnergy',
                                label: 'What gives you energy?',
                                pattern: '\\d+$',
                                error: "Please enter what gives you energy",
                                classes: 'mdl-textfield-long'
                            },
                            whatZapsYouOfYourEnergy: {
                                name: 'whatZapsYouOfYourEnergy',
                                label: 'What zaps you of your energy?',
                                pattern: '\\d+$',
                                error: "Please enter what zaps you of your energy",
                                classes: 'mdl-textfield-long'
                            },
                            doYouHaveAMorningRoutineThatYouPractice: {
                                name: 'doYouHaveAMorningRoutineThatYouPractice',
                                label: 'Do you have a morning routine that you practice?',
                                pattern: '\\d+$',
                                error: "Please enter what your morning routine is",
                                classes: 'mdl-textfield-long'
                            },
                            doYouExercise: {
                                name: 'doYouExercise',
                                label: 'Do you exercise?',
                                pattern: '\\d+$',
                                error: "Please enter if you exercise or not",
                                classes: 'mdl-textfield-long'
                            },
                            howSatisfiedAreYouWithYourExcerciseLevel: {
                                name: 'howSatisfiedAreYouWithYourExcerciseLevel',
                                label: 'How satisfied are you with your exercise level?',
                                pattern: '\\d+$',
                                error: "Please enter how satisfied you are with your exercise level",
                                classes: 'mdl-textfield-long'
                            },
                            whatDoYouLikeToDoForPhysicalActivity: {
                                name: 'whatDoYouLikeToDoForPhysicalActivity',
                                label: 'How satisfied are you with your physical activity?',
                                pattern: '\\d+$',
                                error: "Please enter how satisfied you are with your physical activity",
                                classes: 'mdl-textfield-long'
                            },
                            howSatisfiedAreYouWithYOurCurrentEatingAndNurtrition: {
                                name: 'howSatisfiedAreYouWithYOurCurrentEatingAndNutrition',
                                label: 'How Satisfied are you with your current eating and nutrition?',
                                pattern: '\\d+$',
                                error: "Please enter how your are with your eating and nutrition now",
                                classes: 'mdl-textfield-long'
                            },
                            howSatisfiedAreYOuWithOurWeight: {
                                name: 'howSatisfiedAreYouWithOurWeight',
                                label: 'How Satisfied are you with your with or weight ',
                                pattern: '\\d+$',
                                error: "Please enter how your weight or with is satisfied",
                                classes: 'mdl-textfield-long'
                            },
                            howSatisfiedAreYouWithYourLifeInGeneral: {
                                name: 'HowSatisfiedAreYouWithYourLifeInGeneral',
                                label: 'How Satisfied are your life in general ',
                                pattern: '\\d+$',
                                error: "Please enter how your life is in general",
                                classes: 'mdl-textfield-long'
                            },
                            whatWouldYouLikeToDoToChangeForTheBetter: {
                                name: 'whatWouldYouLikeToDoToChangeForTheBetter',
                                label: 'What would you like to do to change for the better? ',
                                pattern: '\\d+$',
                                error: "Please enter what you would like to do to change for the better.",
                                classes: 'mdl-textfield-long'
                            }
                        }
                    };
                }]
            };
        });
    });
