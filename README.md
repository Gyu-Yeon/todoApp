# todoApp

# Today's lessons.

## 1. How to send delete request to server from HTML.
- first you need jquery cdn or jqeury script file.
- write the ajax method between script tag.
<br> ex)
<br> < script >
<br> $.ajax({
<br>  method: "DELET",
<br>  url: '/delete',
<br>  data; { _id: e.target.dataset.id}    
<br> }).done(function() {
<br>  $( this ).addClass( "done" );
<br> });
<br> < script >
- for data write down what you want to send to server with ajax request.
- for url write down the path that this request will run.
- for method choose the kind of request you want to send.


 


2022.01.15
