module.exports = function (io) {
    var clients = [];
    var rooms = [];
    var db = [];
    var chat = [];
    io.on('connection', function (socket) {
       socket.on('create-room', function (data) {
            clients.push({
                socket: socket,
                room: data.url,
                type: 'teacher'
            });
            chat.push({
                room: data.url,
                state: false
            });
            socket.join(data.url);
       });
       socket.on('join-room', function (data) {
            clients.push({
                socket: socket,
                room: data.url,
                type: 'student'
            });
            socket.join(data.url);
            if (rooms[data.url]) ++rooms[data.url];
            else rooms[data.url] = 1;
            io.to(data.url).emit('change-user', {
               studentno: rooms[data.url]
            });
       });
       socket.on('disconnect', function () {
            for (var i=0; i<clients.length; ++i) {
                if (clients[i].socket !== socket) continue;
                if (clients[i].type !== 'student') continue;
                --rooms[clients[i].room];
                io.to(clients[i].room).emit('change-user', {
                   studentno: rooms[clients[i].room]
                });
            }
       });
       socket.on('draw', function (data) {
           io.to(data.url).emit('draw-update', data);
       });
       socket.on('togglechat', function (data) {
           for (var i=0; i<chat.length; ++i) {
               console.log(chat[i]);
               if (chat[i].room !== data.url) continue;
               chat[i].state = !chat[i].state;
               if (chat[i].state) io.to(data.url).emit('openchat');
               else io.to(data.url).emit('closechat');
           }
       });
        
       socket.on('create-poll', function (data) {
           console.log(data.num);
           db[data.url] = [];
           for (var i = 0; i < data.num; i++) db[data.url][i] = 0;
           io.to(data.url).emit('show-poll', data);
       });
       socket.on('submit-poll', function (data) {
           db[data.url][data.optionNo]++;
       });
       socket.on('close-poll', function (data) {
           console.log(db[data.url]);
           io.to(data.url).emit('return-results', {results: db[data.url]});
           db[data.url] = null;
       });
       socket.on('student-message', function (data) {
           io.to(data.url).emit('student-message', data);
       });
       socket.on('teacher-message', function (data) {
           io.to(data.url).emit('teacher-message', data);
       });
    });
};