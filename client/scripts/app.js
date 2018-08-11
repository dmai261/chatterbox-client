class App {
  constructor(username, message, room, server) {
    this.username = JSON.stringify(window.location.search.slice(10)).replace(/[^A-Za-z]/g, " ");
    this.room = 'R00M';
    this.server = 'http://parse.sfm6.hackreactor.com/chatterbox/classes/messages';
  }
  init() {
    let THIS = this;

    $(document).ready(function () {
      $('body').on('click', '.username',() => {
        THIS.handleUsernameClick();
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
        console.log($('#roomSelect').val());
        $.ajax({
          url: THIS.server,
          type: 'GET',
          data: 'order=-createdAt',
          contentType: 'application/json',
          success: (data) => {
            $.each(data.results, (index, data) => {
              // console.log(data);
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
    // console.log("insideSend", message);
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
    $.ajax({
      url: this.server,
      type: 'GET',
      data: 'order=-createdAt',
      contentType: 'application/json',
      success: (data) => {
        $.each(data.results, (index, data) => {
          // console.log(data);
          console.log(data);
          roomList.push(data);
          
          // this.renderRoom(_.escape(data.roomname));
          this.renderUsername(_.escape(data.username));
          this.renderMessage(_.escape(data.text));
        });
      },
      error: function (data) {
        console.error('chatterbox: Failed to send message', data);
      }
    });
    console.log(roomList);
    var uniqRooms = _.uniq(roomList);
    console.log("uniqRooms",uniqRooms)
    uniqRooms.forEach(function(element) {
      THIS.renderRoom(element);
    });
    
  }
  
  clearMessages() {
    $('#chats').empty();
  }
  renderUsername(user) {
    $('#chats').append(`<div class="username"> ${user}
    </div>`);
  }
  renderMessage(message) { 
    $('#chats').append(`<div id="message">Message: ${message}
    </div>`);
  }

  renderRoom(room) {
    
    $('#roomSelect').append(`<option>${room}</option>`);
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


// class App {
//   constructor(username, message, room, server) {
//     this.username = JSON.stringify(window.location.search.slice(10)).replace(/[^A-Za-z]/g, " ");
//     this.room = 'R00M';
//     this.server = 'http://parse.sfm6.hackreactor.com/chatterbox/classes/messages';
//   }
//   init() {
//     let THIS = this;

//     $(document).ready(function () {
//       $('.username').on('click', () => {
//         THIS.handleUsernameClick();
//       });
      
//       $('.submit').on('click', () => {
//         let newObj = {};
//         newObj.username = THIS.username;
//         newObj.text = $('#post').val();
//         newObj.roomname = THIS.room;
        
//         THIS.handleSubmit(newObj);
//       });
      
//       $('#refreshButton').on('click', () => {
//         window.location.reload();
//         THIS.fetch();
//       });
//     });
//   }

//   send(message) {
//     console.log("insideSend", message);
//     $.ajax({
//       url: this.server,
//       type: 'POST',
//       data: JSON.stringify(message),
//       contentType: 'application/json',
//       success: function (data) {
//         console.log('chatterbox: Message sent');
//       },
//       error: function (data) {
//         // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
//         console.error('chatterbox: Failed to send message', data);
//       }
//     });
//   }
  
//   fetch() {
//     $.ajax({
//       url: this.server,
//       type: 'GET',
//       data: 'order=-createdAt',
//       contentType: 'application/json',
//       success: (data) => {
//         $.each(data.results, (index, data) => {
//           console.log(data);
//           this.renderUsername(_.escape(data.username));
//           this.renderMessage(_.escape(data.text));
//         });
        
//       },
//       error: function (data) {
//         console.error('chatterbox: Failed to send message', data);
//       }
//     });
//   }
  
//   clearMessages() {
//     $('#chats').empty();
//   }
//   renderUsername(user) {
//     $('#chats').append(`<div class="username"> ${user}
//     </div>`);
//   }
//   renderMessage(message) { 
//     $('#chats').append(`<div id="message">Message: ${message}
//     </div>`);
//   }

//   renderRoom(room) {
//     $('#roomSelect').append(`<div>${room}</div>`);
//   }

//   handleUsernameClick() {
//     console.log('wtf');
//   }

//   handleSubmit(message) {
//     this.send(message);
//   }
// }

// let app = new App();
// app.init();
// app.fetch();