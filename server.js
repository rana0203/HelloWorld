
const http = require('http');
const redis = require('redis');

/*
 * {
  "rediscloud": [
    {
      "name": "rediscloud-42",
      "label": "rediscloud",
      "plan": "20mb",
      "credentials": {
        "port"": "6379",
        "hostname": "pub-redis-6379.us-east-1-2.3.ec2.redislabs.com",
        "password": "your_redis_password"
      }
    }
  ]
}

*/

//parsing rediscloud credentials
var vcap_services = process.env.VCAP_SERVICES;
var rediscloud_service = JSON.parse(vcap_services)["rediscloud"][0]
var credentials = rediscloud_service.credentials;

var client = redis.createClient(credentials.port, credentials.hostname, {no_ready_check: true});
client.auth(credentials.password);

client.set('Test', 'Success');

var valueFromRedis;

client.get('Test', function (err, reply) {
    
	if ( err ){
    	valueFromRedis = err;
    }else {
    	valueFromRedis = reply.toString(); // Will print `Success`
    }
	
});


var port = process.env.PORT || 7001;

let server = http.createServer( function (req, res) {
	
	res.writeHead(200, {'Content-Type' : 'text/plain'});
	res.end(`Hello World - ${valueFromRedis} \n`);	

	});

server.listen(port);

console.log("Server listening on port " +  port);


