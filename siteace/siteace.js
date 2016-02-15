Websites = new Mongo.Collection("websites");

// Security over remove and insert for Websites
Websites.allow({
	insert : function (user_id, doc) {
		return Meteor.user();
	},
	remove : function (user_id, doc) {
		return false;
	},
	update : function (user_id, doc) {
		return Meteor.user();
	}
});

if (Meteor.isClient) {

	// Auhtentication using username and email
	Accounts.ui.config({
		passwordSignupFields : "USERNAME_AND_EMAIL"
	});

	/////
	// template helpers 
	/////

	// helper function that returns all available websites
	Template.website_list.helpers({
		websites:function(){
			return Websites.find({},{ sort : { votes : -1 }});
		}
	});


	/////
	// template events 
	/////

	Template.website_item.events({
		"click .js-upvote":function(event){

			if(Meteor.user()){
				Websites.update({ _id : this._id },{ $inc : { votes : 1 }});
			}

			event.preventDefault();

		}, 
		"click .js-downvote":function(event){

			if (Meteor.user()) {
				Websites.update({ _id : this._id },{ $inc : { votes : -1 }});
			};

			event.preventDefault();

		}
	})

	Template.website_form.events({
		"click .js-toggle-website-form":function(event){
			$("#website_form").toggle('slow');
		}, 
		"submit .js-save-website-form":function(event){
			
			//  put your website saving code in here!
			if(Meteor.user()){

				console.log("Insert new website");

				Websites.insert({
					title : 		event.target.title.value,
					url : 			event.target.url.value,
					description : 	event.target.description.value,
					createdOn : 	new Date()
				});

			}

			// prevent propagation
			event.preventDefault();

		}
	});
}


if (Meteor.isServer) {

	// start up function that creates entries in the Websites databases.
	Meteor.startup(function () {

    // code to run on server at startup
    if (!Websites.findOne()){
    	
    	console.log("No websites yet. Creating starter data.");
    	
    	Websites.insert({
    		title:"Goldsmiths Computing Department", 
    		url:"http://www.gold.ac.uk/computing/", 
    		description:"This is where this course was developed.", 
    		createdOn:new Date()
    	});
    	
    	Websites.insert({
    		title:"University of London", 
    		url:"http://www.londoninternational.ac.uk/courses/undergraduate/goldsmiths/bsc-creative-computing-bsc-diploma-work-entry-route", 
    		description:"University of London International Programme.", 
    		createdOn:new Date()
    	});
    	
    	Websites.insert({
    		title:"Coursera", 
    		url:"http://www.coursera.org", 
    		description:"Universal access to the world’s best education.", 
    		createdOn:new Date()
    	});
    	
    	Websites.insert({
    		title:"Google", 
    		url:"http://www.google.com", 
    		description:"Popular search engine.", 
    		createdOn:new Date()
    	});

    }

});
}
