var express = require('express');
var bodyParser = require('body-parser');

var app = express();
app.use(bodyParser.json());

app.use(express.static('./public'));

app.post('/api/users',(request,response) => {
    response.send(data[0]);
});

app.post('/api/demo',function(request,response){
    response.send({
        resultSet:[{"id":1,"rowContent":"Row Content","info1":"Info---1","info2":"Info---2","isRush":true,"isPolicy":true,"isNonPolicy":false,"isOthers":false,"isDmsOnly":true,"isEpicOnly":false}],
        totalItems:1
    });
});


var ipaddress = process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1";
var port = process.env.OPENSHIFT_NODEJS_PORT || 9000;
app.listen(port, ipaddress, function() {
    console.log('listening at : http://'+ipaddress+':'+port);
});



var data = [
    {
        "resultSet":[
            {"id":{value:"1",span:1},"name":{value:"1",span:1},"skill":{value:"1",span:1},"info1":{value:"1",span:1},"info2":{value:"1",span:1}},
            {"id":{value:"2",span:2},"name":{value:"2",span:2},"skill":{value:"2",span:2},"info1":{value:"a",span:1},"info2":{value:"c",span:1}},
            {"id":"//","name":"//","skill":"//","info1":{value:"b",span:1},"info2":{value:"d",span:1}},
            {"id":{value:"3",span:1},"name":{value:"3",span:1},"skill":{value:"3",span:1},"info1":{value:"3",span:1},"info2":{value:"3",span:1}},
            {"id":{value:"4",span:1},"name":{value:"4",span:1},"skill":{value:"4",span:1},"info1":{value:"4",span:1},"info2":{value:"4",span:1}}
        ],
        "totalItems":5
    },
    {
        "resultSet":[
            {"id":21,"name":"21","skill":"21","info1":"21","info2":"21","isRush":false,"isPolicy":false,"isNonPolicy":false,"isOthers":false,"isDmsOnly":false,"isEpicOnly":false},
            {"id":22,"name":"22","skill":"22","info1":"22","info2":"22","isRush":false,"isPolicy":false,"isNonPolicy":false,"isOthers":false,"isDmsOnly":false,"isEpicOnly":false},
            {"id":23,"name":"23","skill":"23","info1":"23","info2":"23","isRush":true,"isPolicy":false,"isNonPolicy":false,"isOthers":false,"isDmsOnly":false,"isEpicOnly":false},
            {"id":24,"name":"24","skill":"24","info1":"24","info2":"24","isRush":false,"isPolicy":false,"isNonPolicy":false,"isOthers":false,"isDmsOnly":false,"isEpicOnly":false},
            {"id":25,"name":"25","skill":"25","info1":"25","info2":"25","isRush":false,"isPolicy":false,"isNonPolicy":false,"isOthers":false,"isDmsOnly":false,"isEpicOnly":false},
            {"id":26,"name":"26","skill":"26","info1":"26","info2":"26","isRush":false,"isPolicy":false,"isNonPolicy":false,"isOthers":false,"isDmsOnly":false,"isEpicOnly":false},
            {"id":27,"name":"27","skill":"27","info1":"27","info2":"27","isRush":false,"isPolicy":false,"isNonPolicy":false,"isOthers":false,"isDmsOnly":false,"isEpicOnly":false},
            {"id":28,"name":"28","skill":"28","info1":"28","info2":"28","isRush":false,"isPolicy":false,"isNonPolicy":false,"isOthers":false,"isDmsOnly":false,"isEpicOnly":false},
            {"id":29,"name":"29","skill":"29","info1":"29","info2":"29","isRush":true,"isPolicy":false,"isNonPolicy":false,"isOthers":false,"isDmsOnly":false,"isEpicOnly":false},
            {"id":30,"name":"30","skill":"30","info1":"30","info2":"30","isRush":false,"isPolicy":false,"isNonPolicy":false,"isOthers":false,"isDmsOnly":false,"isEpicOnly":false},
            {"id":31,"name":"31","skill":"31","info1":"31","info2":"31","isRush":true,"isPolicy":false,"isNonPolicy":false,"isOthers":false,"isDmsOnly":false,"isEpicOnly":false},
            {"id":32,"name":"32","skill":"32","info1":"32","info2":"32","isRush":false,"isPolicy":false,"isNonPolicy":false,"isOthers":false,"isDmsOnly":false,"isEpicOnly":false},
            {"id":33,"name":"33","skill":"33","info1":"33","info2":"33","isRush":false,"isPolicy":false,"isNonPolicy":false,"isOthers":false,"isDmsOnly":false,"isEpicOnly":false},
            {"id":34,"name":"34","skill":"34","info1":"34","info2":"34","isRush":false,"isPolicy":false,"isNonPolicy":false,"isOthers":false,"isDmsOnly":false,"isEpicOnly":false},
            {"id":35,"name":"35","skill":"35","info1":"35","info2":"35","isRush":false,"isPolicy":false,"isNonPolicy":false,"isOthers":false,"isDmsOnly":false,"isEpicOnly":false},
            {"id":36,"name":"36","skill":"36","info1":"36","info2":"36","isRush":false,"isPolicy":false,"isNonPolicy":false,"isOthers":false,"isDmsOnly":false,"isEpicOnly":false},
            {"id":37,"name":"37","skill":"37","info1":"37","info2":"37","isRush":true,"isPolicy":false,"isNonPolicy":false,"isOthers":false,"isDmsOnly":false,"isEpicOnly":false},
            {"id":38,"name":"38","skill":"38","info1":"38","info2":"38","isRush":false,"isPolicy":false,"isNonPolicy":false,"isOthers":false,"isDmsOnly":false,"isEpicOnly":false},
            {"id":39,"name":"39","skill":"39","info1":"39","info2":"39","isRush":false,"isPolicy":false,"isNonPolicy":false,"isOthers":false,"isDmsOnly":false,"isEpicOnly":false},
            {"id":40,"name":"40","skill":"40","info1":"40","info2":"40","isRush":false,"isPolicy":false,"isNonPolicy":false,"isOthers":false,"isDmsOnly":false,"isEpicOnly":false}
        ],
        "totalItems":62
    },
    {
        "resultSet":[
            {"id":41,"name":"41","skill":"41","info1":"41","info2":"41","isRush":false,"isPolicy":false,"isNonPolicy":false,"isOthers":false,"isDmsOnly":false,"isEpicOnly":false},
            {"id":42,"name":"42","skill":"42","info1":"42","info2":"42","isRush":false,"isPolicy":false,"isNonPolicy":false,"isOthers":false,"isDmsOnly":false,"isEpicOnly":false},
            {"id":43,"name":"43","skill":"43","info1":"43","info2":"43","isRush":false,"isPolicy":false,"isNonPolicy":false,"isOthers":false,"isDmsOnly":false,"isEpicOnly":false},
            {"id":44,"name":"44","skill":"44","info1":"44","info2":"44","isRush":false,"isPolicy":false,"isNonPolicy":false,"isOthers":false,"isDmsOnly":false,"isEpicOnly":false},
            {"id":45,"name":"45","skill":"45","info1":"45","info2":"45","isRush":false,"isPolicy":false,"isNonPolicy":false,"isOthers":false,"isDmsOnly":false,"isEpicOnly":false},
            {"id":46,"name":"46","skill":"46","info1":"46","info2":"46","isRush":false,"isPolicy":false,"isNonPolicy":false,"isOthers":false,"isDmsOnly":false,"isEpicOnly":false},
            {"id":47,"name":"47","skill":"47","info1":"47","info2":"47","isRush":false,"isPolicy":false,"isNonPolicy":false,"isOthers":false,"isDmsOnly":false,"isEpicOnly":false},
            {"id":48,"name":"48","skill":"48","info1":"48","info2":"48","isRush":false,"isPolicy":false,"isNonPolicy":false,"isOthers":false,"isDmsOnly":false,"isEpicOnly":false},
            {"id":49,"name":"49","skill":"49","info1":"49","info2":"49","isRush":true,"isPolicy":false,"isNonPolicy":false,"isOthers":false,"isDmsOnly":false,"isEpicOnly":false},
            {"id":50,"name":"50","skill":"50","info1":"50","info2":"50","isRush":false,"isPolicy":false,"isNonPolicy":false,"isOthers":false,"isDmsOnly":false,"isEpicOnly":false},
            {"id":51,"name":"51","skill":"51","info1":"51","info2":"51","isRush":false,"isPolicy":false,"isNonPolicy":false,"isOthers":false,"isDmsOnly":false,"isEpicOnly":false},
            {"id":52,"name":"52","skill":"52","info1":"52","info2":"52","isRush":false,"isPolicy":false,"isNonPolicy":false,"isOthers":false,"isDmsOnly":false,"isEpicOnly":false},
            {"id":53,"name":"53","skill":"53","info1":"53","info2":"53","isRush":false,"isPolicy":false,"isNonPolicy":false,"isOthers":false,"isDmsOnly":false,"isEpicOnly":false},
            {"id":54,"name":"54","skill":"54","info1":"54","info2":"54","isRush":false,"isPolicy":false,"isNonPolicy":false,"isOthers":false,"isDmsOnly":false,"isEpicOnly":false},
            {"id":55,"name":"55","skill":"55","info1":"55","info2":"55","isRush":false,"isPolicy":false,"isNonPolicy":false,"isOthers":false,"isDmsOnly":false,"isEpicOnly":false},
            {"id":56,"name":"56","skill":"56","info1":"56","info2":"56","isRush":true,"isPolicy":false,"isNonPolicy":false,"isOthers":false,"isDmsOnly":false,"isEpicOnly":false},
            {"id":57,"name":"57","skill":"57","info1":"57","info2":"57","isRush":false,"isPolicy":false,"isNonPolicy":false,"isOthers":false,"isDmsOnly":false,"isEpicOnly":false},
            {"id":58,"name":"58","skill":"58","info1":"58","info2":"58","isRush":false,"isPolicy":false,"isNonPolicy":false,"isOthers":false,"isDmsOnly":false,"isEpicOnly":false},
            {"id":59,"name":"59","skill":"59","info1":"59","info2":"59","isRush":false,"isPolicy":false,"isNonPolicy":false,"isOthers":false,"isDmsOnly":false,"isEpicOnly":false},
            {"id":60,"name":"60","skill":"60","info1":"60","info2":"60","isRush":false,"isPolicy":false,"isNonPolicy":false,"isOthers":false,"isDmsOnly":false,"isEpicOnly":false}
        ],
        "totalItems":62
    },
    {
        "resultSet":[
            {"id":61,"name":"61","skill":"61","info1":"61","info2":"61","isRush":false,"isPolicy":false,"isNonPolicy":false,"isOthers":false,"isDmsOnly":false,"isEpicOnly":false},
            {"id":62,"name":"62","skill":"62","info1":"62","info2":"62","isRush":false,"isPolicy":false,"isNonPolicy":false,"isOthers":false,"isDmsOnly":false,"isEpicOnly":false}
        ],
        "totalItems":62
    }
];