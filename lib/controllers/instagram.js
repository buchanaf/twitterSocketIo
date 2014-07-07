var request = require('request');




exports.getPhotos = function(req, res, next) {
  var tag = req.query.phrase
  request('https://api.instagram.com/v1/tags/' + tag +
    '/media/recent?client_id=60aab4799550415a9d28233fbfa5e74a', function(err, data){
    var imageArr = [];
    var results = JSON.parse(data.body).data;

    if(results === undefined){
      return
    }

    for (var i = 0; i < results.length; i++){
      imageArr.push(results[i].images.low_resolution.url)
    }

    res.json({image: imageArr})

  });
};