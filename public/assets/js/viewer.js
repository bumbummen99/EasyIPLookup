(function ( $ ) {
  var viewer = null;
  var viewerImage = null;
  var viewerClose = null;
  var viewerPrev = null;
  var viewerNext = null;
  var viewerTagsForm = null;
  var viewerTagslist = null;
  var post = null;
  
  var settings = null;
  
  function openViewer()
  {
    viewer.css('overflow-y', 'hidden');
    viewer.show();
  }
  
  function closeViewer()
  {
    viewer.css('overflow-y', 'auto');
    viewer.hide();
  }
  
  function updateViewer( _post )
  {
    post = _post;
    updateImage(post.media);
    setTags(JSON.parse(post.tags));
    setComments(post.comments);
  }
  
  function updateImage(base64)
  {
    viewerImage.attr('src', base64);
  }
  
  function updateMeta()
  {
    $.getJSON( "?q=GetPostMeta&p="+postId, function( data ) {
      if( data.error )
        return;
      
      var tags = JSON.parse(data.tags);
      setTags(tags);
      setComments(data.comments);
    });
  }
  
  function setTags( tags )
  {
    var html = '';
    $.each( tags, function( key, value ) {
      html += tagHtml( value.content );
    });
    viewerTagslist.empty();
    viewerTagslist.append(html);
  }
  
  function tagHtml( content )
  {
    return '<span class="tag">'+content+'</span>';
  }
  
  function setComments( comments )
  {
    var comments = $($.parseHTML(comments));
    comments.find('.collapse').collapse();
    viewerCommentslist.html(comments);
    
    viewerCommentform.attr('action', '?q=AddComment&p='+post.id);
    viewerCommentslist.find('.commentForm').unbind('submit').on('submit',function(e){
      e.preventDefault();
      
      $.getJSON( $(this).attr('action')+'&'+$(this).serialize(), function( data ) {
        if(data.success)
          updateMeta();
      });
    });
  }
  
    
  $.fn.viewer = function( options ) {
    viewer = this;
    settings = $.extend({
      viewerId: 1
    }, options );
  
    insertViewer(settings.viewerId);
    
    function insertViewer( viewerId )
    {
      viewer = $($.parseHTML(getViewerHtml(viewerId)));
      viewerImage = viewer.find('#viewer-'+settings.viewerId+'-image');
      viewerClose = viewer.find('#viewer-'+viewerId+'-close');
      viewerPrev = viewer.find('#viewer-'+viewerId+'-next');
      viewerNext = viewer.find('#viewer-'+viewerId+'-prev');
      viewerTagsForm = viewer.find('#viewer-'+viewerId+'-tagsform');
      viewerTagslist = viewer.find('#viewer-'+viewerId+'-taglist');
      viewerCommentslist = viewer.find('#viewer-'+viewerId+'-commentslist');
      viewerCommentform = viewer.find('#viewer-'+viewerId+'-commentForm');
      
      viewer.append(viewer);      
      listenViewer();
    }
    
    function listenViewer()
    {
      viewerClose.on('click', function(e){
        closeViewer();
      });
      viewerImage.on('click', function(e){
        closeViewer();
      });
      viewerNext.on('click', function(e){
        if (settings.onNext !== undefined) {
          options.onNext(settings.viewerId);
        }
      });
      viewerPrev.on('click', function(e){
        if (settings.onPrev !== undefined) {
          options.onPrev(settings.viewerId);
        }
      });
      
      viewerTagsForm.tagsInput({
        'interactive':true,
        'defaultText':'Tags hinzufügen',
        'delimiter': [','],
        'removeWithBackspace' : true,
        'minChars' : 3,
        'maxChars' : 35,
        'placeholderColor' : '#666666'
      });
    }
    
    function getViewerHtml( viewerId ){
      return '<section id="viewer-'+viewerId+'" class="fullscreen" style="display:none;">'+
        '<div class="container-fluid">'+
         '<div class="row">'+
              '<div class="col image" style="align-items:center;display:flex;">'+
                '<span id="viewer-'+viewerId+'-close" class="icon" style="top:0;right:15px;"><i class="fa fa-close"></i></span>'+
                '<span id="viewer-'+viewerId+'-next" class="icon" style="left:15px;"><i class="fa fa-chevron-left"></i></span>'+
                '<span id="viewer-'+viewerId+'-prev" class="icon" style="position:absolute;right:15px;"><i class="fa fa-chevron-right"></i></span>'+
                '<img id="viewer-'+viewerId+'-image" src="" class="img-fluid mx-auto" />'+
              '</div>'+
              '<div class="col-12 col-md-4 comments-bar">'+
                  '<div class="row mt-4">'+
                      '<div class="col">'+
                          '<form id="viewer-'+viewerId+'-tagsform" method="GET" action="?q=AddTags">'+
                              '<div class="form-group"><input class="form-control" id="viewer-'+viewerId+'-tagsinput" name="c" type="text"></div>'+
                              '<div class="form-group"><button class="btn btn-primary btn-sm btn-block" id="viewer-'+viewerId+'-tagsbutton" type="submit">Tags hinzufügen</button></div>'+
                          '</form>'+
                      '</div>'+
                  '</div>'+
                  '<div class="row">'+
                      '<div class="col tag-list" id="viewer-'+viewerId+'-taglist">'+
                      '</div>'+
                  '</div>'+
                  '<div class="row">'+
                    '<div class="col">'+
                      '<form class="commentForm" id="viewer-'+viewerId+'-commentForm" method="GET" action="?q=AddComment&p=">'+
                          '<div class="form-group">'+
                            '<textarea name="c" placeholder="Kommentar eingeben." spellcheck="true" minlength="3" class="form-control form-control-sm"></textarea>'+
                          '</div>'+
                          '<div class="form-group">'+
                            '<button class="btn btn-primary btn-block btn-sm" type="submit">Button</button>'+
                          '</div>'+
                      '</form>'+
                    '</div>'+
                  '/div>'+
                  '<div class="row comments" id="viewer-'+viewerId+'-commentslist">'+
                
              '</div>'+
          '</div>'+
      '</div>'+
    '</section>';
    }
  };
  
  $.fn.openViewer = function() {
    openViewer();
  };
  
  $.fn.closeViewer = function() {
    closeViewer();
  };
  
  $.fn.updateViewer = function(_post) {
    updateViewer(_post);
  };
  
  $.fn.getPostId = function() {
    return post.id;
  };
}( jQuery ));