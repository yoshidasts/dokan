var mysql = require('mysql');

var conn = mysql.createConnection({
    host     : 'yoshidasts-cluster.cluster-ctbdtzpzc93f.ap-northeast-1.rds.amazonaws.com',
    user     : 'yoshidasts',
    password : 'i424q7io24',
    port     : '3306',
    database : 'yoshidasts'
});

exports.handler = function(event, context){
    conn.connect();
    conn.query("select * from item where sku = '" + event.id + "';", function(err, rows, fields) {
        if(err){
            context.done(err);
        }else{
            console.log(rows);
            console.log(fields);
            conn.destroy();
            context.done(null, rows[0]);
        }
    });
};