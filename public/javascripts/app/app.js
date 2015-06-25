angular
  .module('tcgApp', ['ngMaterial', 'ndGame', 'ui.router', 'ngMessages'])
  .config(function($mdThemingProvider){
    $mdThemingProvider.theme('default')
        .primaryPalette('indigo')
        .accentPalette('lime');

    $mdThemingProvider.theme('docs-dark')
        .primaryPalette('yellow')
        .dark();
  });

angular.module('tcgApp')
  .config(function($stateProvider, $urlRouterProvider) {

  $urlRouterProvider.otherwise("/404");

  // Now set up the states
  $stateProvider
    .state('landing', {
      url: '/',
      templateUrl: 'partials/landing.html'
    })
    .state('viewcards', {
      url: '/cardlist',
      templateUrl: 'partials/cards.html',
      controller: 'CardListCtrl'
    })
    .state('viewabilities', {
      url: '/abilitylist',
      templateUrl: 'partials/abilities.html',
      controller: 'AbilityListCtrl'
    })
    .state('createcard', {
      url: '/card/create',
      templateUrl: 'partials/createcard.html',
      controller: 'CardCtrl'
    })
    // .state('createability', {
    //   url: '/ability/create',
    //   templateUrl: 'partials/ability.html',
    //   controller: 'AbilityCtrl'
    // })
    .state('editability', {
      url: '/ability/:abilityId',
      templateUrl: 'partials/ability.html',
      controller: 'AbilityCtrl',
      resolve: {
        data: ['$stateParams', 'AbilityService', function($stateParams, AbilityService) {
          return $stateParams.abilityId ? AbilityService.get($stateParams.abilityId) : {};
        }]
      }
    })
    .state('404', {
      url: '/404',
      templateUrl: 'partials/404.html'
    })
  });

angular.module('tcgApp')
  .config(function($locationProvider) {
    $locationProvider.html5Mode(true);
  });

angular.module('tcgApp')
  .run(['$rootScope', '$state', function($rootScope, $state) {
    $rootScope.$state = $state;
  }]);
