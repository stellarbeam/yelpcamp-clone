const   mongoose    = require("mongoose"),
        Campground  = require("./models/campground"),
        Comment     = require("./models/comment");

var data = [
    {
        name: "Cloud's Rest", 
        url: "https://farm4.staticflickr.com/3795/10131087094_c1c0a1c859.jpg",
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"
    },
    {
        name: "Desert Mesa", 
        url: "https://farm6.staticflickr.com/5487/11519019346_f66401b6c1.jpg",
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"
    },
    {
        name: "Canyon Floor", 
        url: "https://farm1.staticflickr.com/189/493046463_841a18169e.jpg",
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"
    }
]

function seedDB(){
   //Remove all campgrounds
    Campground.remove({}, function(err){
        if(err){
            console.log(err);
        }
        // console.log("removed campgrounds!");
        // data.forEach( campground => {
        //     Campground.create(campground, (err, newCampground) => {
        //         if(err) {
        //             console.log(err);
        //         } else {
        //             console.log("campground added.")
        //             Comment.create({
        //                 text: "This place is great, but I wish there was network.",
        //                 author: "Homer"
        //             }, (err, comment) => {
        //                 if(err) {
        //                     console.log(err);
        //                 } else {
        //                     newCampground.comments.push(comment);
        //                     newCampground.save();
        //                     console.log("Added a comment");
        //                 }
        //             })
        //         }
        //     })
        // })
    }); 
}

module.exports = seedDB;