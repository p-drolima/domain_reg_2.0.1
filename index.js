const express = require('express')
const { PrismaClient } = require('@prisma/client')
const whoiser = require('whoiser')
const os = require("os")
const axios = require('axios');
const tor_axios = require('tor-axios');
const parseString = require('xml2js').parseString;


const prisma = new PrismaClient()
const app = express()

const hostname = os.hostname();

const messagebird = require('messagebird')('289L9PbqsahhVCXvqZ6DUBGeu');

messagebird.balance.read(function (err, data) {
    if (err) {
      return err;
    }
    console.log(data);
  });

app.use(express.json())

function semdRegister(domain) {

    axios.post('http://127.0.0.1:3000', {domain: domain})
    .then(function (data) {
            // handle success
        console.log('NC: ', data);
    })
    .catch(function (error) {
        // handle error
        console.log('Error NC Full: ', error);
    })
    .then(function () {
        // always executed
    });

}

function callGoogle(domain) {
    
    //axios.get(`https://pubapi-dot-domain-registry.appspot.com/whois/${domain}`)
    axios.get(`https://pubapi-dot-domain-registry.appspot.com/whois/tarragona.app`)
    .then(function (data) {
            // handle success
        console.log('Full: ', data.status);
    })
    .catch(function (error) {
        // handle error - which is what we want if error is just a 404 status - asumption that 404 potential can mean domain is available to register
        
        error.response.status = '404'
        ? semdRegister('tarragona.app') : false;

        console.log('Error Full: ', error.response);
    })
    .then(function () {
        // always executed
    });

}

let messageSent = [];
let clashDate = ''
let currentServer = '';

async function getDomains() {

    const env_ip = process.env.IP;

    let date = new Date();

    let voidDate = date.getDate().toString() + date.getMonth().toString() + date.getFullYear().toString() + date.getHours().toString() + date.getMinutes().toString();

    if(date.getMinutes() === 00 && voidDate !== clashDate ) {
        clashDate = date.getDate().toString() + date.getMonth().toString() + date.getFullYear().toString() + date.getHours().toString() + date.getMinutes().toString();

    }

    const options = await prisma.wp_options.findMany({
        where: {
            option_name: {
                startsWith: 'options_',
            }
        }
    });

    const ipNumber = options.filter(n => n.option_name === 'options_ipv6_0_add_ipv6s').map((v) => {
      let ip_count = v.option_value
      return ip_count;
    }).toString();

    let domains = options.filter((option => option.option_name === 'options_ipv6_0_add_ipv6s_' + env_ip + '_add_domain_0_domain_name'));
    let serverRate = options.filter((option => option.option_name === 'options_ipv6_0_add_ipv6s_' + env_ip + '_ipv6_request_time_period')).map((r) => {
      return r.option_value;
    });
    let maxCost = options.filter((option => option.option_name === 'options_ipv6_0_add_ipv6s_' + env_ip + '_add_domain_0_max_cost'));

    let autoRegister = '';
    let getStatus = '';
    
    domains.forEach(function(obj,index,collection) {

      const domainName = obj.option_value.toString();

        setTimeout(function() {

            (async () => {

                callGoogle(domainName);
                
                getDomains();
            
            })();

        }, parseInt(serverRate.toString()));

    });

}

getDomains();