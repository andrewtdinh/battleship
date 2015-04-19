/* global Firebase:true */

'use strict';

var root, users, myKey, myCharacter, battleships, $about, $signUp;
var myFireSound = 'assets/pickupCoin.wav';
var enemyFireSound = 'assets/pickupCoin.wav';
var hitSound = 'assets/pickupCoin.wav';
var $myFire, $enemyFire, $hitSound;
var shipTypes = ['scooter', 'razor', 'scorcher', 'crusher', 'weirder'];
var shipImgs = {scooter: 'url("/assets/scooter.png")',
                razor: 'url("/assets/razor.png")',
                scorcher: 'url("/assets/scorcher.png")',
                crusher: 'url("/assets/crusher.png")',
                weirder: 'url("/assets/weirder.png")'
};

$(document).ready(init);
//
function init(){
  root = new Firebase('https://batship.firebaseio.com/');
  users = root.child('users');
  battleships = root.child('battleships');
  $('#create-user').click(createUser);
  $('#login-user').click(loginUser);
  $('#creatingUser').on('click', '#logout-user',logoutUser);
  $('#creatingUser').on('click', '#create-character',createCharacter);
  // $('#start-user').click(startUser);
  // users.on('child_added', characterAdded);
  // users.on('child_changed', characterChanged);
  // battleships.on('child_added', itemAdded);
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
function createCharacter(){
  var handle = $('#handle').val();
  var avatar = $('#avatarInput').val();
  var uid = root.getAuth().uid;

  users.push({
    handle: handle,
    avatar: avatar,
    uid: uid,
    points: 5000
  }, function(error){
    if (error) {
      alert('Error creating handle.  Please recheck handle and avatar url!');
    }
    else {
      alert('Successfully added handle and avatar!');
    }
  });
}

function characterAdded(snapshot){
  var character = snapshot.val();
  console.log(snapshot.val());
  var myUid = root.getAuth() ? root.getAuth().uid : '';
  // var active = '';

  if(myUid === character.uid){
    myKey = snapshot.key();   //send key value to global var
    myCharacter = character;
    // active = 'active';
    $('#welcome').text('Welcome to Battle Galatica, ' +character.handle+ '!!');
    var tdHandleName = '<td id="handleName">'+character.handle+'</td>';
    var tdAvatarImg = '<td><img src="'+character.avatar+'"></td>';
    $('#characters').find('tr').append(tdHandleName).append(tdAvatarImg);
    $('#characters').addClass('animated slideInLeft');
    $('#handleName').text(character.handle);
    showShipCreateDiv();
  }
}

function showShipCreateDiv(){
  var shipType = '<label>Ship Type <select id="shipType">';
  var option;
  shipTypes.forEach(function(type){
    option = '<option>'+type+'</option>';
    shipType += option;
  });
  shipType += '</label>';
  var $shipType = $(shipType);
  $('#shipCreation').append($shipType);
  // var $inputHandle = $('<input id="handle" type="text" placeholder="handle">');
  // var $inputAvatar = $('<input id="avatarInput" type="url" placeholder="url to avatar">');
  // var $btnCreate = $('<button id="create-character">Create Character</button>');
  // var $btnSignOut = $('<button id="logout-user">Sign Out</button>');
}

function createAndPlaceShip(){
  createShip();
  placeShip();
}

function createShip(){

}

function placeShip(){

}

function logoutUser(){
  root.unauth();
  myKey = null;
  myCharacter = null;
  $('#users > tbody > tr.active').removeClass('active');
  $('#welcomeDiv > h4').removeClass('slideInLeft');
  $('#welcomeDiv > h4').addClass('animated slideOutRight');
  $('#creatingUser').removeClass('slideInLeft');
  $('#creatingUser').addClass('animated slideOutRight');
  $('#shipCreation').removeClass('slideInLeft');
  $('#shipCreation').addClass('animated slideOutRight');
  $('#battlestation').removeClass('slideInLeft');
  $('#battlestation').addClass('animated slideOutRight');
  $('#characters').find('td').removeClass('slideInLeft');
  $('#characters').find('td').addClass('animated slideOutRight');

}

function hideAndWelcome(){
  $signUp = $('#signingUp');
  $signUp.addClass('animated slideOutRight');
  $signUp.remove();
  $about = $('#welcomeDiv > h4');
  $about.removeClass('slideInLeft');
  $about.addClass('animated slideOutRight');
  $about.remove();
  var email = root.getAuth().password.email;
  var emailName = email.slice(0, email.indexOf('@'));
  var h4 = '<h4 id="welcome">Welcome to Battle Galatica, '+emailName+'!!</h4>';
  $('#welcomeDiv').append(h4);
  $('#welcomeDiv').addClass('animated slideInLeft');
}

function displayUserCreation(){
  var $inputHandle = $('<input id="handle" type="text" placeholder="handle">');
  var $inputAvatar = $('<input id="avatarInput" type="url" placeholder="url to avatar">');
  var $btnCreate = $('<button id="create-character">Create Character</button>');
  var $btnSignOut = $('<button id="logout-user">Sign Out</button>');
  $('#creatingUser').append($inputHandle).append($inputAvatar).append($btnCreate).append($btnSignOut);
  $('#creatingUser').removeClass('animated slideOutRight');
  $('#creatingUser').addClass('animated slideInLeft');
}

function loginUser(){
  var email = $('#email').val();
  var password = $('#password').val();
  root.authWithPassword({
    email    : email,
    password : password
  }, function(error){
    if(error){
      console.log('Error logging in:', error);
      alert('There is a problem with your username/password combination!!');
    }
    else{
      hideAndWelcome();
      displayUserCreation();
      redrawusers();
    }
  });
}
//
// function startUser(){
//   var x = Math.floor(Math.random() * 10);
//   var y = Math.floor(Math.random() * 10);
//   users.child(myKey).update({x:x, y:y});
// }
//
function redrawusers(){
  $('#characters > tbody > tr').children().remove();
  users.on('child_added', characterAdded);
  // users.on('child_changed', characterChanged);
}

function createUser(){
  var email = $('#email').val();
  var password = $('#password').val();

  root.createUser({
    email    : email,
    password : password
  }, function(error){
    if(error){
      console.log('Error creating user:', error);
      alert('Either a user already exists or there is a problem with your username/password combination!!');
    }
    else {
      loginUser();
    }
  });
}
