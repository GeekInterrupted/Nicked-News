$(document).ready(function() {
    //navbar mobile
    $(".button-collapse").sideNav();

    //add comment from the form
    $(".add-comment-button").on("click", function() {
        var articleId = $(this).data("id");

        var baseURL = window.location.origin;

        var formName = "form-add-" + articleId;
        var theForm = $("#" + formName);

        //add Comment 
        $.ajax({
                url: baseURL + "/add/comment/" + articleId,
                type: "POST",
                //use serialize to encode a set of form elements as a string for submission
                data: theForm.serialize(),
            })
            .done(function() {
                location.reload();
            });
        //prevent default
        return false;
    });


    //delete comment
    $(".delete-comment-button").on("click", function() {
        var commentId = $(this).data("id");
        var baseURL = window.location.origin;

        $.ajax({
                url: baseURL + "/remove/comment/" + commentId,
                type: "POST",
            })
            .done(function() {
                location.reload();
            });
        return false;
    });
    
//save article
$(".save-article-button").on("click", function() {
    var articleId = $(this).data("id");
    var baseURL = window.location,origin;

    $.ajax({
        url: baseURL + "/save/article/" + articleId,
        type: "POST",
    })
    .done(function() {
        location.reload();
});
    return false;
});

});




