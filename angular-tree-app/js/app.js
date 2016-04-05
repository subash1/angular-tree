window.App = angular.module('app', []);
window.Events = {
    FileDataLoaded : 'app.fileDataLoaded'
};

App.dataServiceUrl = {
    getFiles : 'http://localhost:8080/KDB/getfiles'
};