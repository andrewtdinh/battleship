/* global Firebase:true */

'use strict';

var root, users, myKey, myCharacter, battleships, $about, $signUp, engaging;
var myFireSound = 'assets/myFire.wav';
var enemyFireSound = 'assets/enemyFire.wav';
var hitSound = 'assets/explosion.wav';
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
  $('#shipCreation').on('click', '#createShip', createAndPlaceShip);
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
  shipType += '</select></label>';
  var $shipType = $(shipType);

  var selectXCoord = '<label>Starting X-Coordinate <select id="originX">';
  var selectYCoord = '<label>Starting Y-Coordinate <select id="originY">';
  for (var i=0; i < 12; i++){
    option = '<option>'+i+'</option>';
    selectXCoord += option;
    selectYCoord += option;
  }
  var $selectXCoord = $(selectXCoord + '</select></label>');
  var $selectYCoord = $(selectYCoord + '</select></label>');

  var $selectOrientation = $('<label>Ship Type <select id="shipOrientation"><option>horizontal</option><option>vertical</option></select></label>');
  var $btnCreateShip = $('<button id="createShip">Deploy Ship</button>');
  $('#shipCreation').append($shipType).append($selectXCoord).append($selectYCoord).append($selectOrientation).append($btnCreateShip);
  $('#shipCreation').removeClass('slideOutRight');
  $('#shipCreation').addClass('animated slideInLeft');
}

function createAndPlaceShip(){
  createShip();
  placeShip();
}

function createShip(){
  var startX = $('#originX').val() * 1;
  var startY = $('#originY').val() * 1;
  var orientation = $('#shipOrientation').val();
  var shipType = $('#shipType').val();
  var xLength, yLength;
  switch(shipType){
    case 'scooter':
      if (orientation === 'horizontal'){
        if(startX + 2 <= 12){
          xLength = 2;
        } else {
          xLength = 2;
          startX -= 1;
        }
        yLength = 1;
      } else {    // orientation = vertical
        if(startY + 2 <= 12){
          yLength = 2;
        } else {
          yLength = 2;
          startY -= 1;
        }
        xLength = 1;
      }
      break;
    case 'razor':
      if (orientation === 'horizontal'){
        if(startX + 3 <= 12){
          xLength = 3;
        } else {
          xLength = 3;
          startX -= 2;
        }
        yLength = 1;
      } else {  // orientation = vertical
        if(startY + 3 <= 12){
          yLength = 3;
        } else {
          yLength = 3;
          startY -= 2;
        }
        xLength = 1;
      }
      break;
    case 'scorcher':
      if (orientation === 'horizontal'){
        if(startX + 4 <= 12){
          xLength = 4;
        } else {
          xLength = 4;
          startX -= 3;
        }
        yLength = 1;
      } else {  // orientation = vertical
        if(startY + 4 <= 12){
          yLength = 4;
        } else {
          yLength = 4;
          startY -= 3;
        }
        xLength = 1;
      }
      break;
    case 'crusher':
      if (orientation === 'horizontal'){
        if(startX + 4 <= 12){
          xLength = 4;
        } else {
          xLength = 4;
          startX -= 3;
        }
        if(startY + 2 <= 12){
          yLength = 2;
        } else {
          yLength = 2;
          startY -= 1;
        }
      } else {  // orientation = vertical
        if(startY + 4 <= 12){
          yLength = 4;
        } else {
          yLength = 4;
          startY -= 3;
        }
        if(startX + 2 <= 12){
          xLength = 2;
        } else {
          xLength = 2;
          startX -= 1;
        }
      }
      break;
    case 'weirder':
      if (orientation === 'horizontal'){
        if(startX + 3 <= 12){
          xLength = 3;
        } else {
          xLength = 3;
          startX -= 2;
        }
        if(startY + 3 <= 12){
          yLength = 3;
        } else {
          yLength = 3;
          startY -= 2;
        }
      } else {  // orientation = vertical
        if(startY + 3 <= 12){
          yLength = 3;
        } else {
          yLength = 3;
          startY -= 2;
        }
        if(startX + 3 <= 12){
          xLength = 3;
        } else {
          xLength = 3;
          startX -= 2;
        }
      }
  }
  placeShip(shipType, orientation, startX, startY, xLength, yLength);
}

function placeShip(shipType, orientation, startX, startY, xLength, yLength){
  var assetUrl;
  switch(shipType){
    case 'scooter':
      assetUrl = 'url("/assets/scooter.png")';
      break;
    case 'razor':
      assetUrl = 'url("/assets/razor.png")';
      break;
    case 'scorcher':
      assetUrl = 'url("/assets/scorcher.png")';
      break;
    case 'crusher':
      assetUrl = 'url("/assets/crusher.png")';
      break;
    case 'weirder':
      assetUrl = 'url("/assets/weirder.png")';
  }
  var fromLeft = 1 + startX * 52;
  var fromTop = 1 + startY * 52;
  var $div = $('<div id="'+shipType+'"></div>');
  $div.css('background-image', assetUrl);
  $div.css('background-size', 'cover');
  $div.css('position', 'absolute');
  $div.css('top', fromTop +'px');
  $div.css('left', fromLeft +'px');
  $div.css('width', (1 + xLength * 51) + 'px');
  $div.css('height', (1 + yLength * 51) + 'px');
  if (orientation === 'vertical') {
    $div.css('-webkit-transform', 'rotate(90deg)');
    $div.css('-webkit-transform-origin', '0 0');
    $div.css('-moz-transform', 'rotate(90deg)');
    $div.css('-moz-transform-origin', '0 0');
    $div.css('width', (1 + yLength * 51) + 'px');
    $div.css('height', (1 + xLength * 51) + 'px');
    $div.css('left', (50 + fromLeft) +'px');
    if (shipType === 'crusher'){
      $div.css('left', (100 + fromLeft) +'px');
    }
    if (shipType === 'weirder'){
      $div.css('left', (150 + fromLeft) +'px');
    }
  }
  $('#board').append($div);

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
