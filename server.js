var express = require('express');
var bodyParser=require('body-parser');

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
            if(startPage===1 && endPage===4){
                response.send(data[0]);
            }else if(startPage===5 && endPage===8){
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


var ipaddress = process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1";
var port = process.env.OPENSHIFT_NODEJS_PORT || 8080;
app.listen(port, ipaddress, function() {
    console.log('listening at : http://'+ipaddress+':'+port);
});



var data = [
    {
        "resultSet":[
            {"id":1,"name":"","skill":"1","info1":null,"info2":"1"},
            {"id":2,"name":"2","skill":null,"info1":"2","info2":""},
            {"id":3,"name":null,"skill":"3","info1":"3","info2":"3"},
            {"id":4,"name":"4","skill":"4","info1":"4","info2":"4"},
            {"id":5,"name":"5","skill":"5","info1":"5","info2":"5"},
            {"id":6,"name":"6","skill":"6","info1":"6","info2":"6"},
            {"id":7,"name":"7","skill":"7","info1":"7","info2":"7"},
            {"id":8,"name":"8","skill":"8","info1":"8","info2":"8"},
            {"id":9,"name":"9","skill":"9","info1":"9","info2":"9"},
            {"id":10,"name":"10","skill":"10","info1":"10","info2":"10"},
            {"id":11,"name":"11","skill":"11","info1":"11","info2":"11"},
            {"id":12,"name":"12","skill":"12","info1":"12","info2":"12"},
            {"id":13,"name":"13","skill":"13","info1":"13","info2":"13"},
            {"id":14,"name":"14","skill":"14","info1":"14","info2":"14"},
            {"id":15,"name":"15","skill":"15","info1":"15","info2":"15"},
            {"id":16,"name":"16","skill":"16","info1":"16","info2":"16"},
            {"id":17,"name":"17","skill":"17","info1":"17","info2":"17"},
            {"id":18,"name":"18","skill":"18","info1":"18","info2":"18"},
            {"id":19,"name":"19","skill":"19","info1":"19","info2":"19"},
            {"id":20,"name":"20","skill":"20","info1":"20","info2":"20"}
        ],
        "totalItems":62
    },
    {
        "resultSet":[
            {"id":21,"name":"21","skill":"21","info1":"21","info2":"21"},
            {"id":22,"name":"22","skill":"22","info1":"22","info2":"22"},
            {"id":23,"name":"23","skill":"23","info1":"23","info2":"23"},
            {"id":24,"name":"24","skill":"24","info1":"24","info2":"24"},
            {"id":25,"name":"25","skill":"25","info1":"25","info2":"25"},
            {"id":26,"name":"26","skill":"26","info1":"26","info2":"26"},
            {"id":27,"name":"27","skill":"27","info1":"27","info2":"27"},
            {"id":28,"name":"28","skill":"28","info1":"28","info2":"28"},
            {"id":29,"name":"29","skill":"29","info1":"29","info2":"29"},
            {"id":30,"name":"30","skill":"30","info1":"30","info2":"30"},
            {"id":31,"name":"31","skill":"31","info1":"31","info2":"31"},
            {"id":32,"name":"32","skill":"32","info1":"32","info2":"32"},
            {"id":33,"name":"33","skill":"33","info1":"33","info2":"33"},
            {"id":34,"name":"34","skill":"34","info1":"34","info2":"34"},
            {"id":35,"name":"35","skill":"35","info1":"35","info2":"35"},
            {"id":36,"name":"36","skill":"36","info1":"36","info2":"36"},
            {"id":37,"name":"37","skill":"37","info1":"37","info2":"37"},
            {"id":38,"name":"38","skill":"38","info1":"38","info2":"38"},
            {"id":39,"name":"39","skill":"39","info1":"39","info2":"39"},
            {"id":40,"name":"40","skill":"40","info1":"40","info2":"40"}
        ],
        "totalItems":62
    },
    {
        "resultSet":[
            {"id":41,"name":"41","skill":"41","info1":"41","info2":"41"},
            {"id":42,"name":"42","skill":"42","info1":"42","info2":"42"},
            {"id":43,"name":"43","skill":"43","info1":"43","info2":"43"},
            {"id":44,"name":"44","skill":"44","info1":"44","info2":"44"},
            {"id":45,"name":"45","skill":"45","info1":"45","info2":"45"},
            {"id":46,"name":"46","skill":"46","info1":"46","info2":"46"},
            {"id":47,"name":"47","skill":"47","info1":"47","info2":"47"},
            {"id":48,"name":"48","skill":"48","info1":"48","info2":"48"},
            {"id":49,"name":"49","skill":"49","info1":"49","info2":"49"},
            {"id":50,"name":"50","skill":"50","info1":"50","info2":"50"},
            {"id":51,"name":"51","skill":"51","info1":"51","info2":"51"},
            {"id":52,"name":"52","skill":"52","info1":"52","info2":"52"},
            {"id":53,"name":"53","skill":"53","info1":"53","info2":"53"},
            {"id":54,"name":"54","skill":"54","info1":"54","info2":"54"},
            {"id":55,"name":"55","skill":"55","info1":"55","info2":"55"},
            {"id":56,"name":"56","skill":"56","info1":"56","info2":"56"},
            {"id":57,"name":"57","skill":"57","info1":"57","info2":"57"},
            {"id":58,"name":"58","skill":"58","info1":"58","info2":"58"},
            {"id":59,"name":"59","skill":"59","info1":"59","info2":"59"},
            {"id":60,"name":"60","skill":"60","info1":"60","info2":"60"}
        ],
        "totalItems":62
    },
    {
        "resultSet":[
            {"id":61,"name":"61","skill":"61","info1":"61","info2":"61"},
            {"id":62,"name":"62","skill":"62","info1":"62","info2":"62"}
        ],
        "totalItems":62
    }
];