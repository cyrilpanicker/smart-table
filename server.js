var express = require('express');
var bodyParser=require('body-parser');

var app = express();
app.use(bodyParser.json());

app.use(express.static('./public'));

app.post('/api/users',(request,response) => {
    setTimeout(function(){
        var startPage = request.body.startPage;
        var endPage = request.body.endPage;
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
    },1000);
});

app.listen(8080,function(){
    console.log('listening at port 8080');
});



var data = [
    {
        "resultSet":[
            {"id":1,"name":"1"},
            {"id":2,"name":"2"},
            {"id":3,"name":"3"},
            {"id":4,"name":"4"},
            {"id":5,"name":"5"},
            {"id":6,"name":"6"},
            {"id":7,"name":"7"},
            {"id":8,"name":"8"},
            {"id":9,"name":"9"},
            {"id":10,"name":"10"},
            {"id":11,"name":"11"},
            {"id":12,"name":"12"},
            {"id":13,"name":"13"},
            {"id":14,"name":"14"},
            {"id":15,"name":"15"},
            {"id":16,"name":"16"},
            {"id":17,"name":"17"},
            {"id":18,"name":"18"},
            {"id":19,"name":"19"},
            {"id":20,"name":"20"}
        ],
        "totalItems":62
    },
    {
        "resultSet":[
            {"id":21,"name":"21"},
            {"id":22,"name":"22"},
            {"id":23,"name":"23"},
            {"id":24,"name":"24"},
            {"id":25,"name":"25"},
            {"id":26,"name":"26"},
            {"id":27,"name":"27"},
            {"id":28,"name":"28"},
            {"id":29,"name":"29"},
            {"id":30,"name":"30"},
            {"id":31,"name":"31"},
            {"id":32,"name":"32"},
            {"id":33,"name":"33"},
            {"id":34,"name":"34"},
            {"id":35,"name":"35"},
            {"id":36,"name":"36"},
            {"id":37,"name":"37"},
            {"id":38,"name":"38"},
            {"id":39,"name":"39"},
            {"id":40,"name":"40"}
        ],
        "totalItems":62
    },
    {
        "resultSet":[
            {"id":41,"name":"41"},
            {"id":42,"name":"42"},
            {"id":43,"name":"43"},
            {"id":44,"name":"44"},
            {"id":45,"name":"45"},
            {"id":46,"name":"46"},
            {"id":47,"name":"47"},
            {"id":48,"name":"48"},
            {"id":49,"name":"49"},
            {"id":50,"name":"50"},
            {"id":51,"name":"51"},
            {"id":52,"name":"52"},
            {"id":53,"name":"53"},
            {"id":54,"name":"54"},
            {"id":55,"name":"55"},
            {"id":56,"name":"56"},
            {"id":57,"name":"57"},
            {"id":58,"name":"58"},
            {"id":59,"name":"59"},
            {"id":60,"name":"60"}
        ],
        "totalItems":62
    },
    {
        "resultSet":[
            {"id":61,"name":"61"},
            {"id":62,"name":"62"}
        ],
        "totalItems":62
    }
];