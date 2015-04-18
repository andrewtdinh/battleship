/* global Firebase:true */

'use strict';

var root, users, myKey, myCharacter, battleships;
// var move = 'assets/pickupCoin.wav';
// var itemImgs = {health: 'url("/assets/health.png")',
//                 weapon: 'url("/assets/weapon.png")',
//                 blackhole: 'url("/assets/blackhole.png")'
// };
// var itemNames = ['health', 'weapon', 'blackhole'];
// var $sound;
//
$(document).ready(init);
//
function init(){
  root = new Firebase('https://batship.firebaseio.com/');
  users = root.child('users');
  battleships = root.child('battleships');
  hotspots = root.child('hotspots');
  // $('#create-user').click(createUser);
  // $('#login-user').click(loginUser);
  // $('#logout-user').click(logoutUser);
  // $('#start-user').click(startUser);
  // users.on('child_added', characterAdded);
  // users.on('child_changed', characterChanged);
  // battleships.on('child_added', itemAdded);
  // $('#create-character').click(createCharacter);
  // $(document).keydown(keyDown);
  // $sound = $('#sound');
  // startTimer();
}
//
// function itemAdded(snapshot){
//   var item = snapshot.val();
//   var key = snapshot.key();
//
//   var $item = $('#board td[data-y='+item.y+'][data-x='+item.x+']');
//   itemNames.forEach(function(itm){
//     $item.removeClass(itm);
//   });
//   $item.addClass(item.name);
//   $item.attr('data-key', key);
//   $item.css('background-image', item.img);
// }
//
// function startTimer(){
//   //setInterval(dropbattleships, 7000);
// }
//
// function dropbattleships(){
//   var names = itemNames;
//   var rnd = Math.floor(Math.random() * names.length);
//   var rndx = Math.floor(Math.random() * 10);
//   var rndy = Math.floor(Math.random() * 10);
//   var name = names[rnd];
//   battleships.push({
//     name: name,
//     x: rndx,
//     y: rndy,
//     img: itemImgs[name]
//   });
// }
//
//
// function keyDown(event){
//   $sound.attr('src', move);
//   $sound[0].play();
//   var x = $('.'+myCharacter.handle).data('x');
//   var y = $('.'+myCharacter.handle).data('y');
//   switch (event.keyCode) {
//     case 37:
//       if (x === 0){
//         break;
//       }
//       x -= 1;
//       break;
//     case 38:
//       if (y === 0){
//         break;
//       }
//       y -= 1;
//       break;
//     case 39:
//       if (x === 9){
//         break;
//       }
//       x += 1;
//       break;
//     case 40:
//       if (y === 9){
//         break;
//       }
//       y += 1;
//   }
//   users.child(myKey).update({x:x, y:y});
//   event.preventDefault();
// }
//
// function characterChanged(snapshot){
//   var character = snapshot.val();
//   var $td = $('#board td[data-y='+character.y+'][data-x='+character.x+']');
//   $('#board > tbody td.' + character.handle).css('background-image', '');
//   $('#board > tbody td').removeClass(character.handle);
//   var itemKey = $td.attr('data-key');
//   console.log('itemKey', itemKey);
//   $td.attr('data-key', '');
//   // $td.data('key', '');
//   if (itemKey){
//     battleships.child(itemKey).remove();
//   }
//   $td.addClass(character.handle);
//   $td.css('background-image', 'url("'+character.avatar+'")');
// }
//
// function createCharacter(){
//   var handle = $('#handle').val();
//   var avatar = $('#avatar').val();
//   var uid = root.getAuth().uid;
//
//   users.push({
//     handle: handle,
//     avatar: avatar,
//     uid: uid
//   });
// }
//
// function characterAdded(snapshot){
//   var character = snapshot.val();
//   var myUid = root.getAuth() ? root.getAuth().uid : '';
//   var active = '';
//
//   if(myUid === character.uid){
//     myKey = snapshot.key();   //send key value to global var
//     myCharacter = character;
//     active = 'active';
//   }
//
//   var tr = '<tr class="'+active+'"><td>'+character.handle+'</td><td><img src="'+character.avatar+'"></td></tr>';
//   $('#users > tbody').append(tr);
// }
//
// function logoutUser(){
//   root.unauth();
//   myKey = null;
//   $('#users > tbody > tr.active').removeClass('active');
// }
//
// function loginUser(){
//   var email = $('#email').val();
//   var password = $('#password').val();
//
//   root.authWithPassword({
//     email    : email,
//     password : password
//   }, function(error){
//     if(error){
//       console.log('Error logging in:', error);
//     }else{
//       redrawusers();
//     }
//   });
// }
//
// function startUser(){
//   var x = Math.floor(Math.random() * 10);
//   var y = Math.floor(Math.random() * 10);
//   users.child(myKey).update({x:x, y:y});
// }
//
// function redrawusers(){
//   $('#users > tbody').empty();
//   users.off('child_added',characterAdded);
//   users.on('child_added', characterAdded);
// }
//
// function createUser(){
//   var email = $('#email').val();
//   var password = $('#password').val();
//
//   root.createUser({
//     email    : email,
//     password : password
//   }, function(error){
//     if(error){
//       console.log('Error creating user:', error);
//     }
//   });
// }
