var express = require('express');
var bodyParser = require('body-parser');

var app = express();
app.use(bodyParser.json());

app.use(express.static('./public'));

app.post('/api/users',(request,response) => {
    // setTimeout(function(){
        var startPage = request.body.startPage;
        var endPage = request.body.endPage;
        if(!startPage && !endPage){
            response.send({
                resultSet:data[0].resultSet.concat(data[1].resultSet),
                totalItems:40
            });
            // response.send({
            //     "resultSet":[],
            //     "totalItems":0
            // });
        }else{
            if(startPage===1 && (endPage===4 || endPage===3)){
                response.send(data[0]);
            }else if(startPage===5 && endPage===5){
                response.send(data[1]);
            }else if(startPage===9 && endPage===12){
                response.send(data[2]);
            }else if(startPage===13 && endPage===13){
                response.send(data[3]);
            }else{
                console.log(startPage,endPage);
            }
            // response.send({
            //     "resultSet":[],
            //     "totalItems":0
            // });
        }
    // },1000);
});

app.post('/api/demo',function(request,response){
    response.send({
        resultSet:[{"id":1,"rowContent":"Row Content","info1":"Info---1","info2":"Info---2","isRush":1,"docCategory":2,"source":2}],
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
            {"id":1,"name":"","skill":"Skill1","info1":null,"info2":"1","isRush":0,"docCategory":1,"isPolicy":true,"isNonPolicy":false,"isOthers":false,"isDmsOnly":true,"isEpicOnly":false},
            {"id":2,"name":"2","skill":null,"info1":"2","info2":"","isRush":0,"docCategory":2,"isPolicy":false,"isNonPolicy":true,"isOthers":false,"isDmsOnly":false,"isEpicOnly":false},
            {"id":3,"name":null,"skill":"3","info1":"3","info2":"3","isRush":1,"docCategory":3,"isPolicy":false,"isNonPolicy":false,"isOthers":true,"isDmsOnly":false,"isEpicOnly":true},
            {"id":4,"name":"Name4","skill":"4","info1":"4","info2":"4","isRush":0,"docCategory":0,"isPolicy":false,"isNonPolicy":false,"isOthers":false,"isDmsOnly":false,"isEpicOnly":false},
            {"id":5,"name":"Name5","skill":"Skill5","info1":"5","info2":"5","isRush":1,"docCategory":0,"isPolicy":false,"isNonPolicy":false,"isOthers":false,"isDmsOnly":true,"isEpicOnly":false},
            {"id":6,"name":"6","skill":"6","info1":"6","info2":"6","isRush":0,"docCategory":0,"isPolicy":false,"isNonPolicy":false,"isOthers":false,"isDmsOnly":false,"isEpicOnly":false},
            {"id":7,"name":"7","skill":"7","info1":"7","info2":"7","isRush":0,"docCategory":0,"isPolicy":false,"isNonPolicy":false,"isOthers":false,"isDmsOnly":false,"isEpicOnly":false},
            {"id":8,"name":"8","skill":"8","info1":"8","info2":"8","isRush":1,"docCategory":0,"isPolicy":false,"isNonPolicy":false,"isOthers":false,"isDmsOnly":false,"isEpicOnly":false},
            {"id":9,"name":"9","skill":"9","info1":"9","info2":"9","isRush":0,"docCategory":0,"isPolicy":false,"isNonPolicy":false,"isOthers":false,"isDmsOnly":false,"isEpicOnly":false},
            {"id":10,"name":"10","skill":"10","info1":"10","info2":"10","isRush":0,"docCategory":0,"isPolicy":false,"isNonPolicy":false,"isOthers":false,"isDmsOnly":false,"isEpicOnly":false},
            {"id":11,"name":"11","skill":"11","info1":"11","info2":"11","isRush":1,"docCategory":0,"isPolicy":false,"isNonPolicy":false,"isOthers":false,"isDmsOnly":false,"isEpicOnly":false},
            {"id":12,"name":"12","skill":"12","info1":"12","info2":"12","isRush":0,"docCategory":0,"isPolicy":false,"isNonPolicy":false,"isOthers":false,"isDmsOnly":false,"isEpicOnly":false}
        ],
        "totalItems":12
    },
    {
        "resultSet":[
            {"id":101,"name":"51","skill":"51","info1":"51","info2":"51","isRush":0,"docCategory":0,"isPolicy":false,"isNonPolicy":false,"isOthers":false,"isDmsOnly":false,"isEpicOnly":false},
            {"id":102,"name":"52","skill":"52","info1":"52","info2":"52","isRush":0,"docCategory":0,"isPolicy":false,"isNonPolicy":false,"isOthers":false,"isDmsOnly":false,"isEpicOnly":false},
            {"id":103,"name":"53","skill":"53","info1":"53","info2":"53","isRush":0,"docCategory":0,"isPolicy":false,"isNonPolicy":false,"isOthers":false,"isDmsOnly":false,"isEpicOnly":false},
            {"id":104,"name":"54","skill":"54","info1":"54","info2":"54","isRush":0,"docCategory":0,"isPolicy":false,"isNonPolicy":false,"isOthers":false,"isDmsOnly":false,"isEpicOnly":false},
            {"id":105,"name":"55","skill":"55","info1":"55","info2":"55","isRush":0,"docCategory":0,"isPolicy":false,"isNonPolicy":false,"isOthers":false,"isDmsOnly":false,"isEpicOnly":false},
            {"id":106,"name":"56","skill":"56","info1":"56","info2":"56","isRush":1,"docCategory":0,"isPolicy":false,"isNonPolicy":false,"isOthers":false,"isDmsOnly":false,"isEpicOnly":false},
            {"id":107,"name":"57","skill":"57","info1":"57","info2":"57","isRush":0,"docCategory":0,"isPolicy":false,"isNonPolicy":false,"isOthers":false,"isDmsOnly":false,"isEpicOnly":false},
            {"id":108,"name":"58","skill":"58","info1":"58","info2":"58","isRush":0,"docCategory":0,"isPolicy":false,"isNonPolicy":false,"isOthers":false,"isDmsOnly":false,"isEpicOnly":false},
            {"id":109,"name":"59","skill":"59","info1":"59","info2":"59","isRush":0,"docCategory":0,"isPolicy":false,"isNonPolicy":false,"isOthers":false,"isDmsOnly":false,"isEpicOnly":false},
            {"id":110,"name":"60","skill":"60","info1":"60","info2":"60","isRush":0,"docCategory":0,"isPolicy":false,"isNonPolicy":false,"isOthers":false,"isDmsOnly":false,"isEpicOnly":false}
        ],
        "totalItems":110
    },
    {
        "resultSet":[
            {"id":41,"name":"41","skill":"41","info1":"41","info2":"41","isRush":0,"docCategory":0,"isPolicy":false,"isNonPolicy":false,"isOthers":false,"isDmsOnly":false,"isEpicOnly":false},
            {"id":42,"name":"42","skill":"42","info1":"42","info2":"42","isRush":0,"docCategory":0,"isPolicy":false,"isNonPolicy":false,"isOthers":false,"isDmsOnly":false,"isEpicOnly":false},
            {"id":43,"name":"43","skill":"43","info1":"43","info2":"43","isRush":0,"docCategory":0,"isPolicy":false,"isNonPolicy":false,"isOthers":false,"isDmsOnly":false,"isEpicOnly":false},
            {"id":44,"name":"44","skill":"44","info1":"44","info2":"44","isRush":0,"docCategory":0,"isPolicy":false,"isNonPolicy":false,"isOthers":false,"isDmsOnly":false,"isEpicOnly":false},
            {"id":45,"name":"45","skill":"45","info1":"45","info2":"45","isRush":0,"docCategory":0,"isPolicy":false,"isNonPolicy":false,"isOthers":false,"isDmsOnly":false,"isEpicOnly":false},
            {"id":46,"name":"46","skill":"46","info1":"46","info2":"46","isRush":0,"docCategory":0,"isPolicy":false,"isNonPolicy":false,"isOthers":false,"isDmsOnly":false,"isEpicOnly":false},
            {"id":47,"name":"47","skill":"47","info1":"47","info2":"47","isRush":0,"docCategory":0,"isPolicy":false,"isNonPolicy":false,"isOthers":false,"isDmsOnly":false,"isEpicOnly":false},
            {"id":48,"name":"48","skill":"48","info1":"48","info2":"48","isRush":0,"docCategory":0,"isPolicy":false,"isNonPolicy":false,"isOthers":false,"isDmsOnly":false,"isEpicOnly":false},
            {"id":49,"name":"49","skill":"49","info1":"49","info2":"49","isRush":1,"docCategory":0,"isPolicy":false,"isNonPolicy":false,"isOthers":false,"isDmsOnly":false,"isEpicOnly":false},
            {"id":50,"name":"50","skill":"50","info1":"50","info2":"50","isRush":0,"docCategory":0,"isPolicy":false,"isNonPolicy":false,"isOthers":false,"isDmsOnly":false,"isEpicOnly":false},
            {"id":51,"name":"51","skill":"51","info1":"51","info2":"51","isRush":0,"docCategory":0,"isPolicy":false,"isNonPolicy":false,"isOthers":false,"isDmsOnly":false,"isEpicOnly":false},
            {"id":52,"name":"52","skill":"52","info1":"52","info2":"52","isRush":0,"docCategory":0,"isPolicy":false,"isNonPolicy":false,"isOthers":false,"isDmsOnly":false,"isEpicOnly":false},
            {"id":53,"name":"53","skill":"53","info1":"53","info2":"53","isRush":0,"docCategory":0,"isPolicy":false,"isNonPolicy":false,"isOthers":false,"isDmsOnly":false,"isEpicOnly":false},
            {"id":54,"name":"54","skill":"54","info1":"54","info2":"54","isRush":0,"docCategory":0,"isPolicy":false,"isNonPolicy":false,"isOthers":false,"isDmsOnly":false,"isEpicOnly":false},
            {"id":55,"name":"55","skill":"55","info1":"55","info2":"55","isRush":0,"docCategory":0,"isPolicy":false,"isNonPolicy":false,"isOthers":false,"isDmsOnly":false,"isEpicOnly":false},
            {"id":56,"name":"56","skill":"56","info1":"56","info2":"56","isRush":1,"docCategory":0,"isPolicy":false,"isNonPolicy":false,"isOthers":false,"isDmsOnly":false,"isEpicOnly":false},
            {"id":57,"name":"57","skill":"57","info1":"57","info2":"57","isRush":0,"docCategory":0,"isPolicy":false,"isNonPolicy":false,"isOthers":false,"isDmsOnly":false,"isEpicOnly":false},
            {"id":58,"name":"58","skill":"58","info1":"58","info2":"58","isRush":0,"docCategory":0,"isPolicy":false,"isNonPolicy":false,"isOthers":false,"isDmsOnly":false,"isEpicOnly":false},
            {"id":59,"name":"59","skill":"59","info1":"59","info2":"59","isRush":0,"docCategory":0,"isPolicy":false,"isNonPolicy":false,"isOthers":false,"isDmsOnly":false,"isEpicOnly":false},
            {"id":60,"name":"60","skill":"60","info1":"60","info2":"60","isRush":0,"docCategory":0,"isPolicy":false,"isNonPolicy":false,"isOthers":false,"isDmsOnly":false,"isEpicOnly":false}
        ],
        "totalItems":62
    },
    {
        "resultSet":[
            {"id":61,"name":"61","skill":"61","info1":"61","info2":"61","isRush":0,"docCategory":0,"isPolicy":false,"isNonPolicy":false,"isOthers":false,"isDmsOnly":false,"isEpicOnly":false},
            {"id":62,"name":"62","skill":"62","info1":"62","info2":"62","isRush":0,"docCategory":0,"isPolicy":false,"isNonPolicy":false,"isOthers":false,"isDmsOnly":false,"isEpicOnly":false}
        ],
        "totalItems":62
    }
];