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

app.directive('ngFileSelect', ['$parse', '$http',
    function($parse, $http) {
        if ($http.uploadFile === undefined) {
            $http.uploadFile = function(config) {
                console.log(config)
                return $http({
                    method: 'POST',
                    url: config.url,
                    headers: {
                        'Content-Type': false
                    },
                    transformRequest: function(data) {
                        var formData = new FormData();
                        formData.append('file', config.file);
                        return formData;
                    }
                });
            };
        }
 
        return function(scope, elem, attr) {
            var fn = $parse(attr['ngFileSelect']);
            elem.bind('change', function(evt) {
                var files = [];
                var fileList = evt.target.files;
                for (var i = 0; i < fileList.length; i++) {
                    files.push(fileList.item(i));
                }
                scope.$apply(function() {
                    fn(scope, {
                        files: files,
                        $event: evt
                    });
                });
            });
        };
    }
]);