class App {
  constructor(username, message, room, server) {
    this.username = JSON.stringify(window.location.search.slice(10)).replace(/[^A-Za-z]/g, " ");
    this.room = [];
    this.server = 'http://parse.sfm6.hackreactor.com/chatterbox/classes/messages';
  }
  init() {
    let THIS = this;

    $(document).ready(function () {
      $('body').on('click', '#username', (event) => {
        THIS.handleUsernameClick($(event.target).text().toString());
        // THIS.handleUsernameClick($('.username').);
      });
      
      $('.submit').on('click', () => {
        let newObj = {};
        newObj.username = THIS.username;
        newObj.text = $('#post').val();
        newObj.roomname = THIS.room;
        
        THIS.handleSubmit(newObj);
      });
      
      $('#refreshButton').on('click', () => {
        window.location.reload();
        THIS.fetch();
      });
      
      $('#roomSelect').change(function() {
        THIS.clearMessages();
        $.ajax({
          url: THIS.server,
          type: 'GET',
          data: 'order=-createdAt',
          contentType: 'application/json',
          success: (data) => {
            $.each(data.results, (index, data) => {
              if (data.roomname === $('#roomSelect').val()) {
                THIS.renderUsername(_.escape(data.username));
                THIS.renderMessage(_.escape(data.text));
              }
            });
          },
          error: function (data) {
            console.error('chatterbox: Failed to send message', data);
          }
        });
      });
    });
  }

  send(message) {
    $.ajax({
      url: this.server,
      type: 'POST',
      data: JSON.stringify(message),
      contentType: 'application/json',
      success: function (data) {
        console.log('chatterbox: Message sent');
      },
      error: function (data) {
        // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to send message', data);
      }
    });
  }
  
  fetch() {
    var roomList = [];
    var users = {};
    var THIS = this;
    $.ajax({
      url: this.server,
      type: 'GET',
      data: 'order=-createdAt',
      contentType: 'application/json',
      success: (data) => {
        $.each(data.results, (index, data = _.escape(data)) => {
          roomList.push(data.roomname);
          //let currentUsername = 
          //_.escape((data.username).replace([/\W/g], "ASDFASDFASDF"));
          console.log('currentUsername', data.username.replace([/\W+/g], ''));
          if (!users[data.username]) {
            users[data.username] = [];
          } else {
            users[data.username].push(data.text);
          }
        });

        _.uniq(roomList).forEach(function(element) {
          if (element) {
            THIS.renderRoom(element);
          }
        });
        
        //iterating over users object then iterating over the user's message array
        for (var user in users) {
          users[user].forEach(function(msg) { 
            //render each user and a msg
            THIS.renderUsername(user);
            THIS.renderMessage(user, msg);
          });
        }
      },
      error: function (data) {
        console.error('chatterbox: Failed to send message', data);
      }
    });
  }
  
  clearMessages() {
    $('#chats').empty();
  }

  renderUsername(user) {
    $('#chats').append(`<div  id="username" class=${user}> ${user} </div>`);
  }
  renderMessage(user, message) { 
    $('#chats').append(`<div id="message" class=${user}>Message: ${message} </div>`);
  }

  renderRoom(room) {
    $('#roomSelect').append(`<option>${room}</option>`);
  }

  handleUsernameClick(username) {
    username = username.trim();
    // console.log(username);
    $(`.${username}`).css('font-weight', 'bold');
  }
  
  handleSubmit(message) {
    this.send(message);
  }
}

let app = new App();
app.init();
app.fetch();