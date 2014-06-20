var request = require('request');




exports.getPhotos = function(req, res, next) {

  request('https://api.instagram.com/v1/tags/dogs/media/recent?client_id=60aab4799550415a9d28233fbfa5e74a', function(err, data){
    var imageArr = [];
    var results = JSON.parse(data.body).data;

    for (var i = 0; i < results.length; i++){
      imageArr.push(results[i].images.low_resolution.url)
    }

    res.json({image: imageArr})

  });
};