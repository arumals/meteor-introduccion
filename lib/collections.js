// This is the image_share.js
Images = new Mongo.Collection("images");

// setup security on Images Collection
Images.allow({
	insert : function(user_id, doc){
		console.log("testing securit on image insert");
		if(!Meteor.user()){ // denied if user not logged in
			return false;
		}
		doc.created_by = Meteor.user()._id;
		return true;
	},
	remove : function (user_id, doc) {
		return false;
	}
});