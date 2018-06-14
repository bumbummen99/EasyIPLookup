(function ( $ ) {
  var body;
  var gallery;
  var viewers = [];
  var postIdViewer = {};
  var posts = [];
  var thumbs = [];
  var currentPost = null;
  var currentThumb = null;
  var curentPostId = 1;
  var lastPostId = function()
  {
    if( posts.length == 0 )
      return 0;
    
    var lastid = posts[posts.length-1].id;
    return lastid;
  };
  var firstPostId = function()
  {
    return posts.length>0?posts[0].id:0;
  };
  var lastViewerPostId = function(){}
  var firstViewerPostId = function(){}
  
  var settings = null;
  
  //var Post = (function _Post( id , thumbnail, media, tags, comments) {

  
  $.fn.gallery = function( options ) {
    gallery = this;
    body = $('body');
    settings = $.extend({
      initialPosts: 30,
      viewerAmount: 20,
      skipRequestLimit: 3,
    }, options );
    
    listeners();
    
    getPosts().done(function(){
      for( var i=0; i < settings.viewerAmount; i++ )
      {
        viewers[i] = body.viewer({
          viewerId: i
        });
      }
      setViewers();
    });
  };
  
  function getPosts()
  {
    //create our deferred object
    var def = $.Deferred();

    //get our JSON and listen for done
    $.getJSON( "?q=GetPosts&p="+lastPostId()+'&a='+settings.initialPosts+'&d=0')
      .done(function(data){       
        appendPostsToGallery(data);

        def.resolve();
      });
    
    //return the deferred for listening
    return def;
  }
  
  function getPostsRanged( startInc, endInc ) {
    //create our deferred object
    var def = $.Deferred();

    //get our JSON and listen for done
    $.getJSON("?q=GetPosts&s="+startInc+'&e='+endInc)
      .done(function(data){
        appendPostsToGallery(data);

        def.resolve();
      });

    //return the deferred for listening
    return def;
  }
  
  function getDistantPosts( targetPostId ) {
    //create our deferred object
    var def = $.Deferred();

    //get our JSON and listen for done
    $.getJSON("?q=GetPosts&s="+startInc+'&e='+endInc)
      .done(function(data){
        appendPostsToGallery(data);

        def.resolve();
      });

    //return the deferred for listening
    return def;
  }
  
  function appendPostsToGallery(data)
  {
    $.each( data, function( key, value ) {
      if(posts[value.id] != null)
      {
        posts[value.id] = {
          id: value.id,
          media: value.media,
          thumbnail: value.thumbnail,
          tags: value.tags,
          comments : value.comments
        };
        var thumb = $(thumbnailHtml( posts[value.id].thumbnail, posts[value.id].media, posts[value.id].id ));
        listenThumb(thumb);
        thumbs[value.id] = thumb;
        var appendAfter;
        //if( lastPostId() < value.id);
        gallery.append(thumb);
      }
    });
    return true;
  }
  
  function updateViewer( viewerId, post )
  {
    if(viewers[viewerId].getPostId() == post.id)
      return;
    
    postIdViewer[viewers[viewerId].getPostId()] == null;
    viewers[viewerId].updateViewer(post);
    postIdViewer[post.id] = viewerId; 
  }
  
  function updateViewers()
  {
    for( var i=0; i < viewerAmount; i++ )
    {
      if( i == 0 )
        updateViewer (i, posts[curentPostId]);
      else if( i % 2 > 0 && curentPostId - i )
        updateViewer (i, posts[curentPostId - i]);
      updateViewer (i, posts[curentPostId + i]);
    } 
  }
  
  function openViewer( PostId )
  {    
    if( posts[PostId] == null )
    {
      //getPosts first
      var offset = PostId - lastPostId();
      var requests = Math.ceil(offset / settings.initialPosts);
      if(requests <= settings.skipRequestLimit)
      {
          getPosts().done(openViewer(PostId));
      }
      else
      {
        gallery.empty();
        getDistantPosts(PostId).done(openViewer(PostId));
      }
      return;
    }
    
    curentPostId = PostId;
    updateViewers();
    
    postIdViewer[curentPostId].openViewer();
  }
  
  function thumbnailHtml(thumbnail, src, id){
    return '<div class="col-6 col-sm-4 col-md-3 col-lg-2"><img data-postid="'+id+'" data-fullsrc="'+src+'" class="thumb" src="'+thumbnail+'"></div>';
  }
  
  function getPostReady()
  {
    
  }
  
  function postReady(postId)
  {
    for(var i=0; i < viewers.length; i++)
    {
      if(viewers[i].getPostId() == postId)
        return viewers[i];
    }
    return false;
  }
  
  function listeners()
  {
    
  }
  
  function listenThumb(obj)
  {
    obj.on('click', function(){
      currentThumb = $(this);
      gallery.openViewer(currentThumb.data('postid'));
    });
  }
}( jQuery ));