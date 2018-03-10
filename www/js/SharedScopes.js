module.factory('SharedScopes', function($rootScope) {
    var sharedScopes = {};
    var shared = {};
    return {
        setScope: function(key, value) {
            sharedScopes[key] = value;
        },
        getScope: function(key) {
            return sharedScopes[key];
        },
        set: function(value) {
            shared = value;
        },
        get: function() {
            return shared;
        },
        delete: function() {
            shared = {};
        }
    };
});

