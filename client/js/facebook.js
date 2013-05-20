/*
	About: Facebook integration
	
	Create a facebook.private.js file with the following window variables to enable Facebook integration
	
	Parameters:
	
		window.appID - the application ID (Visit <https://developers.facebook.com/apps> to create one)
		window.channelURL - the path to your channel.html file. Refer to <https://developers.facebook.com/docs/reference/javascript/#channel> for more.
	
	Include facebook.js and facebook.private.js on index.html and game.html
*/

window.fbAsyncInit = function() {
	FB.init({
		appId      : window.appID,
		channelUrl : window.channelURL,
		status     : true,
		cookie     : true,
		xfbml      : true
	});

	FB.Event.subscribe('auth.authResponseChange', function(response) {
		if (response.status === 'connected') {
			facebookIntegration();
		}
		else if (response.status === 'not_authorized') {
			FB.login();
		}
		else {
			FB.login();
		}
	});
};

// Load the Facebook SDK asynchronously
(function(d){
	var js, id = 'facebook-jssdk', ref = d.getElementsByTagName('script')[0];
	if (d.getElementById(id)) {return;}
	js = d.createElement('script'); js.id = id; js.async = true;
	js.src = "//connect.facebook.net/en_US/all.js";
	ref.parentNode.insertBefore(js, ref);
}(document));


/*
	Function: facebookIntegration
	Enables Facebook integration features.
	
	You must have an fb-root div on every page that you want to use with Facebook integration, as well as
	a div with the id "facebook".
*/
function facebookIntegration() {
	$("#facebook").html("Loading...");
	FB.api("/me", function(response) {
		$("#facebook").html("Good to see you, " + response.name + ".");
		
		/*FB.ui({method: 'apprequests',
			title: 'Play chess with me!',
			message: "Join me for a game of multiplayer chess.",
		});*/
	});
}