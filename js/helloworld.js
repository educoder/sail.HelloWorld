/*jslint devel: true, regexp: true, browser: true, unparam: true, debug: true, sloppy: true, sub: true, es5: true, vars: true, evil: true, fragment: true, plusplus: true, nomen: true, white: false, eqeq: false */
/*globals Sail, Rollcall, $, window */

var HelloWorld = {
    rollcallURL: '/rollcall',
    run: {name: 'helloworld'}, // will join this groupchat room helloworld@conference.your.xmpp.domain (as defined in config.json)
    
    init: function() {
        Sail.app.rollcall = new Rollcall.Client(Sail.app.rollcallURL);
        
        Sail.modules
            .load('Rollcall.Authenticator', {mode: 'username-and-password'})
            .load('Strophe.AutoConnector')
            .load('AuthStatusWidget')
            .thenRun(function () {
                Sail.autobindEvents(HelloWorld);
                
                // note that Sail.app === HelloWorld
                $(Sail.app).trigger('initialized');
                return true;
            });
    },
    
    
    // event responders auto-bound by Sail.autobindEvents(HelloWorld)
    
    events: {
        initialized: function(ev) {
            HelloWorld.authenticate();
        },
        
        connected: function(ev) {
            HelloWorld.info("Joined <strong>"+Sail.app.groupchatRoom+"</strong>!");
        },
        
        unauthenticated: function(ev) {
            HelloWorld.authenticate();
        }
    },
    
    
    // helper functions
    
    authenticate: function() {
        Sail.app.token = Sail.app.rollcall.getCurrentToken()

        if (!Sail.app.token) {
            Rollcall.Authenticator.requestLogin();
        } else {
            Sail.app.rollcall.fetchSessionForToken(Sail.app.token, function(data) {
                    Sail.app.session = data.session;
                    $(Sail.app).trigger('authenticated');
                },
                function(error) {
                    console.warn("Token '"+Sail.app.token+"' is invalid. Will try to re-authenticate...");
                    Rollcall.Authenticator.unauthenticate();
                }
            );
        }
    },
    
    info: function(msg) {
        $("body").append("<p class='info'>"+msg+"</p>");
    }
};