$(function() {
  
    // -------------
    // OMDB movie request, response
    // -------------
  	function getMovie(movieName) {
      
      var encodedMovieName = encodeURIComponent(movieName);
      $.ajax({
          'url': 'http://www.omdbapi.com/?t='+encodedMovieName,
          'dataType': 'json',
          'success': onMovieInfo
      });
    }
  
    function getSimilarity(movie1, movie2) {
    		var value = 0;
        
        return value;
    }
    
    function printMovie(movieInfo) {
      console.log('Title: '+movieInfo.title);
      console.log('Genre: '+movieInfo.genre);
      console.log('Director: '+movieInfo.director);
      console.log('Actors: '+movieInfo.actors);
      if(movieInfo.rottenValue) {
        console.log('Rotten Tomatoes points: '+movieInfo.rottenValue);
      }
   
    }
    
    // from OMDB
    function onMovieInfo(data) {
       // console.log(data);
      var movieInfo = {};
      movieInfo.title = data.Title;
      movieInfo.genre = data.Genre.split(', ');
      movieInfo.actors = data.Actors.split(', ');
      movieInfo.director = data.Director;
      // ratings
      var ratingsArray = data.Ratings;
      var rottenValue;
      for(rating of ratingsArray) {
         if(rating.Source == 'Rotten Tomatoes') {
           rottenValue = rating.Value;
         }
      }
      if(rottenValue) {
        movieInfo.rottenValue = rottenValue;
      }
      printMovie(movieInfo);    
    }
    getMovie('iron man');
  
  
    // -------------
    // OMDB ends here
    // -------------
  
  
    // Handler for .ready() called.
    
    var currentName;
    // http://localhost:3000/database
    function getUserMovies(userName) {
            currentName = userName;
            $.ajax({
                'url': 'http://localhost:3000/database',
                'dataType': 'json',
                'success': onMovieData
            });
    }
    
    function onMovieData(data) {
        //console.log('onMovieData: '+JSON.stringify(data));
        var result = {};
        for(var entry of data) {
           // console.log(entry);
           
           if(entry.name.toLowerCase().includes(currentName.toLowerCase())) {
             result[entry.name] = entry.movies;
           }
        }
        console.log(result);       
    }
    getUserMovies('matti');

    function getUser(name) {
            $.ajax({
                'url': 'http://localhost:3000/user/'+name,
                'dataType': 'json',
                'success': onUserData
            });
    }

    function onUserData(arr) {
    console.log('onUserData: '+JSON.stringify(arr));
    if(arr[0]) {
        $( '#result' ).append( arr[0].name+'<br>');
    } else {
        console.log('Not found!');
    }

    }

    $('#searchButton').click(function() {
    var userName = $( '#nameInput' ).val();
    console.log(userName);
    getUser(userName);  
    });

});


