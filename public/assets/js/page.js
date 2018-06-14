$( document ).ready(function() { 
  
  var viewer = {
    getOlderPosts: function(){
      $.getJSON( "?q=GetPosts&p="+viewer.getLastPostId()+'&d=0', function( data ) {
        $.each( data, function( key, value ) {
          var html = viewer.createNewThumb( value.thumbnail, value.media, value.id );
          viewer.thumbsContainer.append(html);
        });
        viewer.listenImages();
      });
    },
    createNewThumb: function(thumbnail, src, id){
      return '<div class="col-6 col-sm-4 col-md-3 col-lg-2"><img data-postid="'+id+'" data-fullsrc="'+src+'" class="thumb" src="'+thumbnail+'"></div>'
    },
    createNewTag: function(content){
      return '<span class="tag">'+content+'</span>';
    },
    listenImages: function(){
      $('.thumb').on('click', function(){
        viewer.currentThumb = $(this);
        viewer.update();
        viewer.openViewer();
      });
    },
    
    currentThumb:null,
    getCurrentPostId: function(){
      return viewer.currentThumb.data('postid');
    },
    getLastPostId: function(){
      var lastid = viewer.thumbsContainer.children().last().children().last().data('postid');
      return lastid;
    },    
    openViewer: function(){
      viewer.body.css('overflow-y', 'hidden');
      viewer.section.show();
    },
    closeViewer: function(){
      viewer.body.css('overflow-y', 'auto');
      viewer.section.hide();
    },
    update: function(){
      viewer.updateTags();
      viewer.updateTagsForm();
      viewer.updateComments();
      viewer.image.attr('src', viewer.currentThumb.data('fullsrc'));
    },
    updateTags: function(){
      $.getJSON( "?q=GetPostMeta&p="+viewer.getCurrentPostId(), function( data ) {
        var tags = JSON.parse(data.tags);
        viewer.taglist.empty();
        $.each( tags, function( key, value ) {
          var html = '';
          html += viewer.createNewTag( value.content );
          viewer.taglist.append(html);
        });
      });
    },
    updateComments: function(){
      viewer.commentform.attr('action', '?q=AddComment&p='+viewer.getCurrentPostId());
      viewer.listenCommentForm();
      $.getJSON( "?q=GetPostComments&p="+viewer.getCurrentPostId(), function( data ) {
        if(!data.error)
        {
          viewer.commentslist.html(data.content);
          $('.collapse').collapse();
          viewer.listenCommentForm();
        }
      });
    },
    listenCommentForm: function(){
      //$('.commentform').off('submit');
      $('.commentForm').unbind('submit').on('submit',function(e){
        e.preventDefault();
        $.getJSON( $(this).attr('action')+'&'+$(this).serialize(), function( data ) {
          if(data.success)
            viewer.updateComments();
        });
      });
    },
    getTagsString: function(){
      var $keywords = viewer.tagsform.siblings(".tagsinput").children(".tag");  
      var tags = [];  
      for (var i = $keywords.length; i--;) {  
          tags.push($($keywords[i]).text().substring(0, $($keywords[i]).text().length -  1).trim());  
      }
      return viewer.tagsInput.val();
    },
    updateTagsForm(){
      viewer.tagsform.attr('action', '?q=AddTags&id='+viewer.getCurrentPostId()+'&c='+viewer.getTagsString());
    },
    nextPost: function(){
      var nextPost = viewer.currentThumb.parent().prev().children();
      if(nextPost.length)
      {
        viewer.currentThumb = nextPost;
        viewer.update();
      }
    },
    prevPost: function(){
      if( viewer.getCurrentPostId() - 1 == viewer.getLastPostId() && viewer.getLastPostId() > 1)
        viewer.getOlderPosts();
             
      var prevPost = viewer.currentThumb.parent().next().children();
      if(prevPost.length)
      {
        viewer.currentThumb = prevPost;
        viewer.update();
      }
    },
    
    body: $('body'),
    section: $('#viewer'),
    thumbsContainer: $('#thumbs'),
    tagsform: $('#tagsform'),
    tagsInput: $('#tagsinput'),
    tagsButton: $('#tagsbutton'),
    taglist: $('#taglist'),
    commentform: $('#NewComment'),
    commentslist: $('#commentslist'),
    image: $('#viewer-image'),
    prevButton: $('#viewer-prev'),
    nextButton: $('#viewer-next'),
    closeButton: $('#viewer-close')
    
  };
  
  function getUrlParameter(sParam) {
    var sPageURL = decodeURIComponent(window.location.search.substring(1)),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
      sParameterName = sURLVariables[i].split('=');

      if (sParameterName[0] === sParam) {
        return sParameterName[1] === undefined ? true : sParameterName[1];
      }
    }
  };
  
  viewer.closeButton.on('click', function(e){
    viewer.closeViewer();
  });
  viewer.image.on('click', function(e){
    viewer.closeViewer();
  });
  viewer.nextButton.on('click', function(e){
    viewer.nextPost();
  });
  viewer.prevButton.on('click', function(e){
    viewer.prevPost();
  });
  
  $(document).keydown(function(event) {
    if( getUrlParameter('q') != 'Neu' || getUrlParameter('q') != 'Top' )
    
    var activeEleTag = $( document.activeElement ).prop("tagName");
    if( activeEleTag == 'INPUT' || activeEleTag == 'TEXTAREA' )
      return;
    
    if( event.keyCode == 65 || event.keyCode == 37 )
      viewer.nextPost();
    else if( event.keyCode == 68 || event.keyCode == 39 )
      viewer.prevPost();
  });
  
  $(window).scroll(function() {
    if( getUrlParameter('q') == 'Neu' || getUrlParameter('q') == 'Top' )
    if( viewer.getLastPostId() > 1 )
    if($(window).scrollTop() == $(document).height() - $(window).height()) {
      viewer.getOlderPosts();
    }
  });
  
  viewer.tagsInput.tagsInput({
    'interactive':true,
    'defaultText':'Tags hinzufügen',
    'delimiter': [','],
    'removeWithBackspace' : true,
    'minChars' : 3,
    'maxChars' : 35,
    'placeholderColor' : '#666666'
  });
  
  viewer.tagsButton.on('click', function(e){
    e.preventDefault();
    viewer.updateTagsForm();
    
    $.getJSON( viewer.tagsform.attr('action'), function( data ) 
    {
      if(data.error)
        return;
      else if(data.success)
      {
        viewer.tagsInput.importTags('');
        viewer.updateTags();
      }
    });
  });
  
  
  viewer.listenImages();
  viewer.listenCommentForm();
});