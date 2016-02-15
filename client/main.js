Router.configure({
    layoutTemplate : 'ApplicationLayout'
});

Router.route('/', function () {
  this.render('welcome',{
    to : 'main'
  });
});

Router.route('/images', function () {
  this.render('navbar',{
    to : 'navbar'
  });
  this.render('images',{
    to : 'main'
  })
});

Router.route('/image/:_id',function () {
    this.render('navbar',{
        to : 'navbar'
    });
    this.render('image',{
        to : 'main',
        data : function () {
            return Images.findOne({ _id : this.params._id });
        }
    });
});

Session.set('image_limit',8);

lastScrollTop = 0;

$(window).scroll(function (event) {

    var scrollTop = $(this).scrollTop();

    // if we are reching the bottom of the window
    if($(window).scrollTop() + $(window).height() > $(document).height() - 100){
        
        var scrollTop = $(this).scrollTop();

        if(scrollTop > lastScrollTop){
            Session.set('image_limit', Session.get('image_limit') + 4);
        }

        lastScrollTop = scrollTop;

    }

});

Accounts.ui.config({
    passwordSignupFields : "USERNAME_AND_EMAIL"
});

Template.images.helpers({
    images : function () {

        if (Session.get('user_filter')) {

            return Images.find({created_by : Session.get('user_filter')},{ 
                sort : {  created_on : -1,  rating : -1 },
                limit : Session.get('image_limit')
            });

        }

        return Images.find({},{ 
            sort : {  created_on : -1, rating : -1 },
            limit : Session.get('image_limit')
        });

    },
    getUser : function (user_id) {
        var user = Meteor.users.findOne({ _id : user_id });
        if (user) {
            return user.username;
        } else {
            return "anonymous";
        }
    },
    filtering_images : function () {
        return Session.get('user_filter');
    },
    getFilterUser :function () {
        return Meteor.users.findOne({ _id : Session.get('user_filter') }).username ;
    }
});

Template.body.helpers({
    username : function () {
        if (Meteor.user()) {
            return Meteor.user().username;
        }

        return "anonymous internet user";
    }
});

Template.images.events({
    'click .js-image' : function(event){
        $(event.target).css("width", "50px");
    },
    'click .js-del-image' : function (event) {
        var id = this._id;
        $("#" + id).hide('slow',function () {
            Images.remove({"_id" : id});
        });
    },
    'click .js-rate-image' : function (event) {
        var rating = $(event.currentTarget).data('userrating');
        var image_id = this.id;
        Images.update({ "_id" : image_id},{$set : {rating : rating}});
    },
    'click .js-show-image-form' : function  (event) {
        $('#image_form_modal').modal('show');
    },
    'click .js-set-user-filter' : function (event) {
        Session.set('user_filter', this.created_by);
        event.preventDefault();
    },
    'click .js-unset-image-filter' : function (event) {
        Session.set('user_filter',null);
        event.preventDefault();
    }
});

Template.image_add_form.events({
    'submit .js-add-image' : function (event) {
        
        var img_src, img_alt;

        img_src = event.target.img_src.value;
        img_alt = event.target.img_alt.value;

        if (Meteor.user()) {
          
            Images.insert({ 
                img_src : img_src, 
                img_alt : img_alt,
                created_on : new Date(),
                created_by : Meteor.user()._id
            });

        };

        event.preventDefault();

        $('#image_form_modal').modal('hide');

    }
});