    var config;
    var baseUrl = 'http://api.themoviedb.org/3/';
    var apiKey = '0a92b9230aa4a56d3f4157df21755d11';


    function initialize(callback) {
        $.get(baseUrl + 'configuration', {
            api_key: '0a92b9230aa4a56d3f4157df21755d11'
        },function(res) {
            config = res;
            console.log(config);
            callback(config);
        });
    }

    function setEventHandlers(config) {
        $('#form-search').submit(function() {
            var query = $('.input-query').val();
            searchMovie(query);
            return  false;
        });

        $('.btn-now-showing').click(function() {
            loadNowShowing();
        });

        loadNowShowing();

        $('.btn-upcoming').click(function() {
            upcoming();
            
        });

        upcoming();

        $('.btn-popular').click(function() {
            popular();
            
        });

        popular();

        $('.btn-top-rated').click(function() {
            toprated();
            
        });

        toprated();
    }
    function searchMovie(query) {
        var searchUrl = baseUrl + 'search/movie';
        $('.movies-list').html('');
        $.get(searchUrl, {
            query: query,
            api_key: apiKey
        }, function(response) {
            displayMovies(response);
        });
    }


    function displayMovies(data,category) {
        $('.movies-list').html('');
        if(data.results.length > 0){
            var headerStr = [
                            '<div class="col-md-12">',
                                '<h2 style="color:black;" class="page-header"><font face="Arial">'+category+'</font></h2>',
                            '</div>'
                        ];
                         $('.movies-list').append($(headerStr.join('')));

        data.results.forEach(function(movie){
            var imageSrc = config.images.base_url + config.images.poster_sizes[3] + movie.backdrop_path;
            var imagesrc = config.images.base_url + config.images.poster_sizes[3] + movie.poster_path;
           
               var object = {
                    "movie-id" : movie.id,
                    "img" : imageSrc,
                    "imaged" : imagesrc,
                    "title": movie.title,
                    

               };
        var raw = $("#tpl-displaymovies").html();
        var template = Handlebars.compile(raw);
        var html = template(object);
        $('.movies-list').append(html);

           })();
        }

        else{
            var htmlStr = [
                    '<h2>',
                        'Sorry. No Results Found.',
                    '</h2>'
            ];
            $('.movies-list').append($(htmlStr.join('')));
        }
    }
    

    function upcoming() {
        var upcomingUrl = baseUrl + 'movie/upcoming';
        $('.movies-list').html('');
        $.get(upcomingUrl, {
            api_key: apiKey
        }, function(response) {
            displayMovies(response, "Next Attraction");
        });
    }
    

    function popular() {
        var popularUrl = baseUrl + 'movie/popular';
        $('.movies-list').html('');
        $.get(popularUrl, {
            api_key: apiKey
        }, function(response) {
            displayMovies(response, "Now Trending");
        });
    }

    function toprated() {
        var topratedUrl = baseUrl + 'movie/top-rated';
        $('.movies-list').html('');
        $.get(topratedUrl, {
            api_key: apiKey
        }, function(response) {
            displayMovies(response, "Top Rated");
        });
    }
    
    function loadNowShowing() {
        var nowShowingUrl = baseUrl + 'movie/now_playing';
        $('.movies-list').html('');
        $.get(nowShowingUrl, {
            api_key: apiKey
        }, function(response) {
            displayMovies(response, "Now Showing");
        });
    }    

    function viewMovie(id){
    $(".movie-list").hide();
    console.log(id);
    url = baseUrl + "movie/"+id;
    reqParam = {api_key:apiKey};
    $.get(url,reqParam,function(response){
        $("#title").html(response.original_title);

        $("#overview").html(response.overview);

        url = baseUrl + "movie/"+id+"/videos";
        $.get(url,reqParam,function(response){
            var html = '<embed width="600" height="490" style="border-style:solid;border-width:5px;border-color:white;" src="https://www.youtube.com/v/'+response.results[0].key+'" type="application/x-shockwave-flash">'
            $("#trailer").html(html);
        });


        url = baseUrl + "movie/"+id+"/credits";
        $.get(url,reqParam,function(response){
            var casts = response.cast;
            var allCasts = "";    
            var imageSrc = config.images.base_url + config.images.poster_sizes[3] ;                  
            for(var i=0;i<casts.length;i++){
                allCasts += '<div id="casts" class="col-xs-6">'                                
                              
            }
            $("#casts").html(allCasts);
        });


        url = baseUrl + "movie/"+id+"/similar";
        $.get(url,reqParam,function(response){
            var movies = response.results;
            var allMovies = "";
            var imageSrc = config.images.base_url + config.images.poster_sizes[3];            
            for(var i=0;i<movies.length;i++){
              
            }
            $("#similar").html(allMovies);
        });

    });
}
$(document).ready(function(){

    $(".btn-now-showing, .btn-top-rated, .btn-popular, .btn-upcoming").click(function(){
        $(".movie-view").hide();
        $(".movies-list").show();
    });
    initialize(setEventHandlers);
});