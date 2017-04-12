$(function() {
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
           console.log(entry);
           if(entry.name.includes(currentName)) {
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