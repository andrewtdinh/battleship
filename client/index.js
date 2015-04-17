/* global Firebase: true */

'use strict';

$(document).ready(init);

var root, characters;

function init(){
  root = new Firebase('https://zeldandy.firebaseio.com/');
  characters = root.child('characters');
  $('#create-user').click(createUser);
  $('#login-user').click(loginUser);
  $('#logout-user').click(logoutUser);
  characters.on('child_added', characterAdded);
  $('#create-character').click(createCharacter);
}

function logoutUser(){
  root.unauth();
  $('#characters > tbody >tr.active').removeClass('active');
}

function createCharacter(){
  var handle = $('#handle').val();
  var avatar = $('#avatar').val();
  var uid = root.getAuth().uid;

  characters.push({
    handle: handle,
    avatar: avatar,
    uid: uid
  });
}

function characterAdded(snapshot){
  var character = snapshot.val();
  var myUid = root.getAuth() ? root.getAuth().uid : '';
  var active = '';

  if(myUid === character.uid){
    active ='active';
  }

  console.log(myUid);
  var tr = '<tr class= "'+active+'"><td>'+character.handle+'</td><td><img src="'+character.avatar+'"></td></tr>';
  $('#characters > tbody').append(tr);
}

function loginUser(){
  var email = $('#email').val();
  var password = $('#password').val();

  root.authWithPassword({
      email    : email,
      password : password
  }, function(error, authData) {
      if (error) {
        console.log("Login Failed!", error);
      } else {
        redrawCharacters();
      }
  });
}

function redrawCharacters(){
  $('#characters > tbody').empty();
  characters.off('child_added');
  characters.on('child_added', characterAdded);
}

function createUser(){
  var email = $('#email').val();
  var password = $('#password').val();


  root.createUser({
    email    : email,
    password : password
  }, function(error, userData) {
    if (error) {
      console.log("Error creating user:", error);
    } else {
      console.log("Successfully created user account with uid:", userData.uid);
    }
  });
}
