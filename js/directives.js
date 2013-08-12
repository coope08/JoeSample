'use strict';

var app = angular.module('chatterUI', []);

app.directive('cmcChatter', function(){

    return {
        scope: {
            settings: '=settings',
            target: '=target',
            source: '=source'
        },
        controller: ChatterTemplateCtrl,
        restrict: 'E',
        templateUrl: 'chatter-template.html'
    };
});