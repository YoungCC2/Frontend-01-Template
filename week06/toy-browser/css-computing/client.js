const net = require("net")
const parser = require('./parser')

class ResponseParser {
    
    constructor(){
        this.WAITING_STATUS_LINE = 0
        this.WAITING_SATTUS_LINE_END = 1;

        this.WAITING_HEADER_NAME = 2
        this.WAITING_HEADER_SPACE = 3
        this.WAITING_HEADER_VALUE = 4
        this.WAITING_HEADER_LINE_END = 5

        this.WAITING_HEADER_BLOCK_END = 6
        this.WAITING_BODY = 7


        this.current = this.WAITING_STATUS_LINE;
        this.statusLine = "";
        this.headers = {};
        this.headerName = "";
        this.headerValue = "";

        this.bodyParser = null;

    }

    receive(string){
        for(let i=0;i< string.length; i++){
            this.receiveChar(string.charAt(i));
        }

    }

    
    get isFinished (){
        return this.bodyParser && this.bodyParser.isFinished
    }

    get response () {
        this.statusLine.match(/HTTP\/1.1 ([0-9]+) ([\s\S]+)/)
        return {
            statusCode: RegExp.$1,
            statusText: RegExp.$2,
            headers: this.headers,
            body: this.bodyParser.content.join('')
        }
    }


    receiveChar(char) {
        if(this.current === this.WAITING_STATUS_LINE){
            // console.log(char.charCodeAt(0))
            if(char === '\r'){
                // console.log("\\r")
                this.current = this.WAITING_HEADER_LINE_END
            }else if(char === '\n'){
                this.current = this.WAITING_HEADER_NAME
            }else{
                this.statusLine += char;
            }
            
        } else if(this.current === this.WAITING_HEADER_LINE_END){
            if(char === '\n'){
                this.current = this.WAITING_HEADER_NAME
            }
        } else if(this.current === this.WAITING_HEADER_NAME){
            if(char === ':'){
                this.current = this.WAITING_HEADER_SPACE;
            }else if(char === '\r'){
                this.current = this.WAITING_HEADER_BLOCK_END;

                // 创建 body
                if(this.headers["Transfer-Encoding"] === 'chunked'){
                    this.bodyParser = new TrunkedBodyParser();
                }
                
            } else{
                this.headerName += char
            }
        } else if(this.current === this.WAITING_HEADER_SPACE){
            if(char === ' '){
                this.current = this.WAITING_HEADER_VALUE
            }
        } else if(this.current === this.WAITING_HEADER_VALUE){
            if(char === '\r'){
               
                this.current = this.WAITING_HEADER_LINE_END;
                this.headers[this.headerName] = this.headerValue;
                this.headerName = "";
                this.headerValue = "";
                
            }else{
                this.headerValue += char
            }
        } else if(this.current === this.WAITING_HEADER_LINE_END){
            if(char === '\n'){
                this.current = this.WAITING_HEADER_NAME
            }
        }else if(this.current === this.WAITING_HEADER_BLOCK_END){
            if(char === '\n'){
                this.current = this.WAITING_BODY
            }
        }else if(this.current === this.WAITING_BODY){
            // body 
            // if(char === '\n'){
            // }
            // console.log("---")
            this.bodyParser.receiveChar(char);
        }

    }

}


class TrunkedBodyParser {
    
    constructor(){
        this.WAITING_LENGTH = 0
        this.WAITING_LENGTH_LINE_END = 1
        this.READING_TRUNK = 2
        this.WAITING_NEW_LINE = 3
        this.WAITING_NEW_LINE_END = 4

        this.length = 0
        this.content = []
        this.isFinished = false
        this.current = this.WAITING_LENGTH

       

    }

    receiveChar(char){
        // console.log(JSON.stringify(char))
        if(this.current === this.WAITING_LENGTH){
            // console.log(char.charCodeAt(0))
            if(char === '\r'){
                // console.log("\\r")
                
                if(this.length === 0){
                    this.isFinished = true 
                }
                this.current = this.WAITING_LENGTH_LINE_END
            }else {
                this.length *= 16;
                this.length += parseInt(char,16)
            }
            
        }else if(this.current === this.WAITING_LENGTH_LINE_END){
            if(char === '\n'){
                this.current = this.READING_TRUNK
            }
        }else if(this.current === this.READING_TRUNK){
            this.content.push(char)
            this.length--
            if(this.length===0){
                this.current = this.WAITING_NEW_LINE
            }
        }else if(this.current === this.WAITING_NEW_LINE){
            if(char === '\r'){
                this.current = this.WAITING_NEW_LINE_END
            }
        }else if(this.current === this.WAITING_NEW_LINE_END){
            if(char === '\n'){
                this.current = this.WAITING_LENGTH
            }
        }
    }

}



class Request {
    // method, url = host + port + path
    // body: k/v
    // headers

    constructor(options){
        this.method = options.method || "GET"
        this.host = options.host
        this.port = options.port || 80;
        this.path = options.path || "/"

        this.body = options.body || {};

        this.headers = options.headers || {}
        
        if(!this.headers["Content-Type"]){
            this.headers["Content-Type"] = "application/x-wwww-form-urlencoded"
        }
        
        if(this.headers["Content-Type"] === "application/json"){
            this.bodyText = JSON.stringify(this.body);
        }else if(this.headers["Content-Type"] === "application/x-wwww-form-urlencoded"){
            this.bodyText = Object.keys(this.body).map(key => `${key}=${encodeURIComponent(this.body[key])}`).join('&')
        }   
   
        this.headers["Content-Length"] = this.bodyText.length
    }

    toString() {
        return `${this.method} ${this.path} HTTP/1.1\r
${Object.keys(this.headers).map(key => `${key}: ${this.headers[key]}`).join('\r\n')}
\r
${this.bodyText}`
    }


    send(connection){
        return new Promise((resolve,reject)=>{
            const parser = new ResponseParser;

            if(connection){
                connection.write(this.toString())
            }else {
                connection = net.createConnection({
                    host: this.host,
                    port: this.port
                },()=>{
                    connection.write(this.toString())
                })
            }

            connection.on('data', (data) => {
                parser.receive(data.toString())
                // console.log(parser.statusLine);
                // console.log(parser.headers);
                if(parser.isFinished){
                    resolve(parser.response)
                }
                connection.end();
            });

            connection.on('end', () =>  {
                reject('disconnected from server');
            });

            connection.on('error', (err) => {
                reject(err)
                connection.end()
              })
        })
        
        
    }


}

class Response {

}

void async function (){
    let req = new Request({
        method: "POST",
        host: "127.0.0.1",
        port: "8088",
        path: "/",
        headers: {
            ["X-Foo2"]: "customed"
        },
        body: {
            name: "yhyhy"
        }
    })
    
    let response =  await req.send()
    let dom = parser.parserHTML(response.body);
    console.log(JSON.stringify(dom));
}();




// 
/*
const client = net.createConnection({
    host: "127.0.0.1",
    port: 8088,
    onread: {
        // Reuses a 4KiB Buffer for every read from the socket.
        buffer: Buffer.alloc(4 * 1024),
        callback: function(nread, buf) {
          // Received data is available in `buf` from 0 to `nread`.
          console.log(buf.toString('utf8', 0, nread));
        }
      }
}, () => {
    // 'connect' listener.
    console.log('connected to server!');
    let req = new Request({
        method: "POST",
        host: "127.0.0.1",
        post: "8088",
        path: "/",
        headers: {
            ["X-Foo2"]: "customed"
        },
        body: {
            name: "yhyhy"
        }
    })

    console.log(req.toString())
    client.write(req.toString())
    // client.write('POST / HTTP/1.1\r\n');
    // client.write('HOST: 127.0.0.1\r\n');
    // client.write('Content-Type: application/x-wwww-form-urlencoded\r\n');
    // client.write('Content-Length: 20\r\n');
    // client.write('\r\n');
    // client.write('file1=aaa&code=aaaxxx\r\n');
    // client.write('\r\n');

    
});
client.on('data', (data) => {
    console.log(data.toString());
    client.end();
});
client.on('end', () => {
    console.log('disconnected from server');
});*/