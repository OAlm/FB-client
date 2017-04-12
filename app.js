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
  
    function arraySimilarity(arr1, arr2) {
        var simCount = 0;
        // käy läpi alkiot
        for(var entry1 of arr1) {
           if(arr2.indexOf(entry1) != -1) {
             simCount++;
           }
        }
        // suhteellinen esiintymien lkm
        return simCount/ ((arr1.length+arr2.length)/2)
    }
  
    // similarity between 0..100,
    // 100 --> much similarity, 
    // 0 --> not similar at all
    function getSimilarity(movie1, movie2) {
    		var value = 0; 
        var sameDirector = movie1.director == movie2.director;
        var genreSimilarity = arraySimilarity(movie1.genre, movie2.genre);
        console.log('g: '+genreSimilarity);
        var actorSimilarity = arraySimilarity(movie1.actors, movie2.actors);
        console.log('a: '+actorSimilarity);
        value = genreSimilarity*0.5+actorSimilarity*0.5;
        if(sameDirector) {
        	value = value*1.2;
        }
        return value;
    }
  
    function compareMovies(movieName1, movieName2) {
        var encodedMovie1 = encodeURIComponent(movieName1);
        var encodedMovie2 = encodeURIComponent(movieName2);
        $.ajax({
          'url': 'http://www.omdbapi.com/?t='+encodedMovie1,
          'dataType': 'json',
          'success': function(result1) {
                              
              $.ajax({
                    'url': 'http://www.omdbapi.com/?t='+encodedMovie2,
                    'dataType': 'json',
                    'success': function(result2) {
                        var movie1 = getMovieInfo(result1);
                        var movie2 = getMovieInfo(result2);
                        printMovie(movie1);
                        printMovie(movie2);
                        console.log(getSimilarity(movie1, movie2));
                    }
             });
          }
        });
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
  
  	function getMovieInfo(omdbItem) {
       // console.log(data);
      var movieInfo = {};
      movieInfo.title = omdbItem.Title;
      movieInfo.genre = omdbItem.Genre.split(', ');
      movieInfo.actors = omdbItem.Actors.split(', ');
      movieInfo.director = omdbItem.Director;
      // ratings
      var ratingsArray = omdbItem.Ratings;
      var rottenValue;
      for(rating of ratingsArray) {
         if(rating.Source == 'Rotten Tomatoes') {
           rottenValue = rating.Value;
         }
      }
      if(rottenValue) {
        movieInfo.rottenValue = rottenValue;
      }
      return movieInfo;
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
    //getMovie('iron man');
    compareMovies('iron man', 'star wars');
  
  
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
    //getUserMovies('matti');

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