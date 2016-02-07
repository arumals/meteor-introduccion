if (Meteor.isClient) {

  Template.my_time.helpers({
    current_time : new Date()
  });

}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
