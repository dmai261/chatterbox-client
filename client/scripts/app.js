
class App {
  constructor(username, message, room, server) {
    this.username = 'Lmao';
    this.message = 'watdafak';
    this.room = 'R00M';
    this.server = 'http://parse.sfm6.hackreactor.com/chatterbox/classes/messages';
  }
  init() {
    let THIS = this;

    $(document).ready(function () {
      $('.username').on('click', () => {
        THIS.handleUsernameClick();
      });

      $('#submitButton').on('click', () => {
        let newObj = {};
        newObj.username = THIS.username;
        newObj.message = $('#post').val();
        newObj.room = THIS.room;
        console.log(newObj);
        
        THIS.handleSubmit(newObj);
      });
    });
  }

  send(message) {
    console.log("insideSend", message);
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
    $.ajax({
      url: this.server,
      type: 'GET',
      data: 'order=-createdAt',
      contentType: 'application/json',
      success: (data) => {
        $.each(data.results, (index, data) => {
          this.renderUsername(data);
          this.renderMessage(data);
        });
        
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
    $('#chats').append(`<div class="username">User: ${user.username}
    </div>`);
  }
  renderMessage(message) {
    $('#chats').append(`<div id="message">Message: ${message.text}
    </div>`);
  }

  renderRoom(room) {
    $('#roomSelect').append(`<div>${room}</div>`);
  }

  handleUsernameClick() {
    console.log('wtf');
  }

  handleSubmit(message) {
    this.send(message);
  }
}

let app = new App();
app.init();
app.fetch();