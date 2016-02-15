Router.configure({
	layoutTemplate : 'application_layout'
});

Router.route('/',function () {
	this.render('navbar',{
		to : 'navbar'
	});
	this.render('website_list')
});

Router.route('/website/:id',function () {
	this.render('navbar',{
		to : 'navbar'
	});
	this.render('comments_list',{
		to : 'footer',
		data : function () {
			return Websites.findOne({ _id : this.params.id });
		}
	});
	this.render('website_details',{
		data : function () {
			return Websites.findOne({ _id : this.params.id });
		}
	});
});

Websites = new Mongo.Collection("websites");
Comments = new Mongo.Collection("comments");

// Security over
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

// Security over comments
Comments.allow({
	insert : function (user_id, doc) {
		return Meteor.user();
	},
	remove : function (user_id, doc) {
		return Meteor.user();
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

	var website_helpers = {
		total_votes : function () {
			return this.votes ? this.votes : 0;
		},
		total_comments : function () {
			return Comments.find({ website : this._id }).count();
		}
	};

	Template.website.helpers(website_helpers);
	Template.website_details.helpers(website_helpers);

	Template.website.events({
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

			var target = event.target;
			
			//  put your website saving code in here!
			if(Meteor.user()){

				Websites.insert({
					title : 		target.title.value,
					url : 			target.url.value,
					description : 	target.description.value,
					created_on : 	new Date()
				});

				// clean after insert
				target.title.value = "";
				target.url.value = "";
				target.description.value = "";

				// close form
				$("#website_form").hide("slow");

			}

			// prevent propagation
			event.preventDefault();

		}
	});

	Template.comments_list.helpers({
		comments : function () {
			return Comments.find({ website : this._id },{ sort : { created_on : -1 }});
		}
	});

	Template.comment.helpers({
		author_name : function () {
			return Meteor.users.findOne({ _id : this.author }).username;
		}
	});

	Template.comments_form.events({
		"submit .js-add-comment" : function (event) {

			event.preventDefault();

			if(Meteor.user()){
				
				Comments.insert({
					website: this._id,
					content : event.target.content.value,
					author : Meteor.user()._id,
					created_on : new Date()
				});

				event.target.content.value = "";

			}

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
    		created_on:new Date()
    	});
    	
    	Websites.insert({
    		title:"University of London", 
    		url:"http://www.londoninternational.ac.uk/courses/undergraduate/goldsmiths/bsc-creative-computing-bsc-diploma-work-entry-route", 
    		description:"University of London International Programme.", 
    		created_on:new Date()
    	});
    	
    	Websites.insert({
    		title:"Coursera", 
    		url:"http://www.coursera.org", 
    		description:"Universal access to the world’s best education.", 
    		created_on:new Date()
    	});
    	
    	Websites.insert({
    		title:"Google", 
    		url:"http://www.google.com", 
    		description:"Popular search engine.", 
    		created_on:new Date()
    	});

    }

});
}
