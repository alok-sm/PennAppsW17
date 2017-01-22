var audio = document.getElementById('AudioElement') || new Audio();
var playing = null;

// function textToAlexa(text){
//   var xhr = new XMLHttpRequest();
//   xhr.open("GET", "/text?text="+text, true);
//   xhr.responseType = "blob";
//   xhr.onload = function(evt){
//     if(xhr.status = 200){
//       var blob = new Blob([xhr.response], {type: 'audio/wav'});
//       var objectUrl = URL.createObjectURL(blob);
//       audio.addEventListener("ended", function(){
//         if(playing == 'response'){
//           draw("white");
//         }
//         playing = null;
//       });
//       audio.src = objectUrl;
//       audio.onload = function(evt){
//         URL.revokeObjectUrl(objectUrl);
//       };
//       draw('#00ff00');
//       audio.play();
//       playing = "response";
//     }
//   }
//   xhr.send();
// }

// $(document).ready(function(){
//   setInterval(function(){
//     $.getJSON( "/trigger", function( data ) {
//       if(data["trigger"] == true){
//         textToAlexa("open train brain");
//       }
//     });
//   }, 500);
// });
