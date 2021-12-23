const express = require('express')
const { PrismaClient } = require('@prisma/client')
const axios = require('axios');
const parseString = require('xml2js').parseString;
const fs = require('fs');
const { raw } = require('express');

const env_ip = process.env.IP;

let firstGoogle = false;
let firstNamecheap = false;
let firstWordpress = false;

const prisma = new PrismaClient()
const app = express()

app.use(express.json())

let domains, rdapEvents, rdapDomainStatus, lastRegistrar, lastRegistrationTime, clashDate, premiumDomain = 'false', registrationRes, beforeRegTime, status, namecheapData, lastGoogleTime = '', firstGoogleTime = '', EAPfee, tier;

async function sendRegister(domain, cost, tier, ncIP, premiumPrice, registrationRes, firstGoogleTime, lastGoogleTime) {
  
  let date = new Date();

  if(tier === 'standard') {

    beforeRegTime = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " +  date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds() + ":" + date.getMilliseconds();;

    await axios.get(`https://api.namecheap.com/xml.response?ApiUser=reachnames4&ApiKey=r0d665627eb0440cea0387ecb2c3e4a46&UserName=reachnames4&Command=namecheap.domains.create&ClientIp=${ncIP}&DomainName=${domain}&Years=1&AuxBillingFirstName=Charlie&AuxBillingLastName=Coe&AuxBillingAddress1=7%20The%20Close%20,%20Muswell%20Avenue&AuxBillingStateProvince=London&AuxBillingPostalCode=N102ED&AuxBillingCountry=UK&AuxBillingPhone=+44.2084447848&AuxBillingEmailAddress=charlie@reachnames.com&AuxBillingOrganizationName=Dot31&AuxBillingCity=London&TechFirstName=Charlie&TechLastName=Coe&TechAddress1=7%20The%20Close%20,%20Muswell%20Avenue&TechStateProvince=London&TechPostalCode=N102ED&TechCountry=UK&TechPhone=+44.2084447848&TechEmailAddress=charlie@reachnames.com&TechOrganizationName=Dot31&TechCity=London&AdminFirstName=Charlie&AdminLastName=Coe&AdminAddress1=7%20The%20Close%20,%20Muswell%20Avenue&AdminStateProvince=London&AdminPostalCode=N102ED&AdminCountry=UK&AdminPhone=+44.2084447848&AdminEmailAddress=charlie@reachnames.com&AdminOrganizationName=Dot31&AdminCity=London&RegistrantFirstName=Charlie&RegistrantLastName=Coe&RegistrantAddress1=7%20The%20Close%20,%20Muswell%20Avenue&RegistrantStateProvince=London&RegistrantPostalCode=N102ED&RegistrantCountry=UK&RegistrantPhone=+44.2084447848&RegistrantEmailAddress=charlie@reachnames.com&RegistrantOrganizationName=Dot31&RegistrantCity=London&AddFreeWhoisguard=yes&WGEnabled=no&GenerateAdminOrderRefId=False`)
    .then(response => {

        parseString(response.data, {mergeAttrs: true}, async function (err, result) {
              
            status = result.ApiResponse.Status[0];

            if( status === 'ERROR' ) {

              registrationRes = 'Namecheap check registration request had an error: ' + result.ApiResponse.Errors[0].Error[0]._;
              
              ncRegTime = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " +  date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds() + ":" + date.getMilliseconds();;

              if(firstGoogleTime !== '') {
                await prisma.wp_options.update({
                  where: {
                    option_name: 'options_ipv6_0_add_ipv6s_' + env_ip + '_status_ip_registration_result'
                  },
                  data: {
                    option_value: 'Namecheap response: ' + registrationRes + '\n\n' + 'Google Request: ' + lastGoogleTime + '\n\n' +  'Before Registration attempt: ' + beforeRegTime + '\n\n'  + 'After Registration attempt: ' + ncRegTime
                  }
                })
              }

              else if(lastGoogleTime !== '') {

                await prisma.wp_options.update({
                  where: {
                    option_name: 'options_ipv6_0_add_ipv6s_' + env_ip + '_status_ip_registration_result_2'
                  },
                  data: {
                    option_value: 'Namecheap response: ' + registrationRes + '\n\n' + 'Google Request: ' + lastGoogleTime + '\n\n' +  'Before Registration attempt: ' + beforeRegTime + '\n\n'  + 'After Registration attempt: ' + ncRegTime
                  }
                })

              }
            
            } else if(status === 'OK') {

              registrationRes = 'registered successfully'
              
              ncRegTime = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " +  date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds() + ":" + date.getMilliseconds();;

              if(firstGoogleTime !== '') {
                await prisma.wp_options.update({
                  where: {
                    option_name: 'options_ipv6_0_add_ipv6s_' + env_ip + '_status_ip_registration_result'
                  },
                  data: {
                    option_value: 'Namecheap response: ' + registrationRes + '\n\n' + 'Google Request: ' + lastGoogleTime + '\n\n' +  'Before Registration attempt: ' + beforeRegTime + '\n\n'  + 'After Registration attempt: ' + ncRegTime
                  }
                })
              }

              else if(lastGoogleTime !== '') {

                await prisma.wp_options.update({
                  where: {
                    option_name: 'options_ipv6_0_add_ipv6s_' + env_ip + '_status_ip_registration_result_2'
                  },
                  data: {
                    option_value: 'Namecheap response: ' + registrationRes + '\n\n' + 'Google Request: ' + lastGoogleTime + '\n\n' +  'Before Registration attempt: ' + beforeRegTime + '\n\n'  + 'After Registration attempt: ' + ncRegTime
                  }
                })

              }

            }

        });

    })
    
  }
  
  else if(tier === 'premium' ) {

      if( cost >= premiumPrice) {

        beforeRegTime = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " +  date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds() + ":" + date.getMilliseconds();;

        await axios.get(`https://api.namecheap.com/xml.response?ApiUser=reachnames4&ApiKey=r0d665627eb0440cea0387ecb2c3e4a46&UserName=reachnames4&Command=namecheap.domains.create&ClientIp=${ncIP}&DomainName=${domain}&Years=1&AuxBillingFirstName=Charlie&AuxBillingLastName=Coe&AuxBillingAddress1=7%20The%20Close%20,%20Muswell%20Avenue&AuxBillingStateProvince=London&AuxBillingPostalCode=N102ED&AuxBillingCountry=UK&AuxBillingPhone=+44.2084447848&AuxBillingEmailAddress=charlie@reachnames.com&AuxBillingOrganizationName=Dot31&AuxBillingCity=London&TechFirstName=Charlie&TechLastName=Coe&TechAddress1=7%20The%20Close%20,%20Muswell%20Avenue&TechStateProvince=London&TechPostalCode=N102ED&TechCountry=UK&TechPhone=+44.2084447848&TechEmailAddress=charlie@reachnames.com&TechOrganizationName=Dot31&TechCity=London&AdminFirstName=Charlie&AdminLastName=Coe&AdminAddress1=7%20The%20Close%20,%20Muswell%20Avenue&AdminStateProvince=London&AdminPostalCode=N102ED&AdminCountry=UK&AdminPhone=+44.2084447848&AdminEmailAddress=charlie@reachnames.com&AdminOrganizationName=Dot31&AdminCity=London&RegistrantFirstName=Charlie&RegistrantLastName=Coe&RegistrantAddress1=7%20The%20Close%20,%20Muswell%20Avenue&RegistrantStateProvince=London&RegistrantPostalCode=N102ED&RegistrantCountry=UK&RegistrantPhone=+44.2084447848&RegistrantEmailAddress=charlie@reachnames.com&RegistrantOrganizationName=Dot31&RegistrantCity=London&AddFreeWhoisguard=yes&WGEnabled=no&GenerateAdminOrderRefId=False&IsPremiumDomain=True&PremiumPrice=${premiumPrice}&EapFee=0.0`)
        .then(response => {

          parseString(response.data, {mergeAttrs: true}, async function (err, result) {
            
            status = result.ApiResponse.Status[0];

            if( status === 'ERROR' ) {
              
                registrationRes = 'Namecheap check registration request had an error: ' + result.ApiResponse.Errors[0].Error[0]._;
                
                ncRegTime = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " +  date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds() + ":" + date.getMilliseconds();;
                
              //send email + block domain name in wp db

              if(firstGoogleTime !== '') {
                await prisma.wp_options.update({
                  where: {
                    option_name: 'options_ipv6_0_add_ipv6s_' + env_ip + '_status_ip_registration_result'
                  },
                  data: {
                    option_value: 'Namecheap response: ' + registrationRes + '\n\n' + 'Google Request: ' + lastGoogleTime + '\n\n' +  'Before Registration attempt: ' + beforeRegTime + '\n\n'  + 'After Registration attempt: ' + ncRegTime
                  }
                })
              }

              else if(lastGoogleTime !== '') {

                await prisma.wp_options.update({
                  where: {
                    option_name: 'options_ipv6_0_add_ipv6s_' + env_ip + '_status_ip_registration_result_2'
                  },
                  data: {
                    option_value: 'Namecheap response: ' + registrationRes + '\n\n' + 'Google Request: ' + lastGoogleTime + '\n\n' +  'Before Registration attempt: ' + beforeRegTime + '\n\n'  + 'After Registration attempt: ' + ncRegTime
                  }
                })

              }
              
            } else if( status === 'OK' ) {

              if(firstGoogleTime !== '') {
                await prisma.wp_options.update({
                  where: {
                    option_name: 'options_ipv6_0_add_ipv6s_' + env_ip + '_status_ip_registration_result'
                  },
                  data: {
                    option_value: 'Namecheap response: ' + registrationRes + '\n\n' + 'Google Request: ' + lastGoogleTime + '\n\n' +  'Before Registration attempt: ' + beforeRegTime + '\n\n'  + 'After Registration attempt: ' + ncRegTime
                  }
                })
              }

              else if(lastGoogleTime !== '') {

                await prisma.wp_options.update({
                  where: {
                    option_name: 'options_ipv6_0_add_ipv6s_' + env_ip + '_status_ip_registration_result_2'
                  },
                  data: {
                    option_value: 'Namecheap response: ' + registrationRes + '\n\n' + 'Google Request: ' + lastGoogleTime + '\n\n' +  'Before Registration attempt: ' + beforeRegTime + '\n\n'  + 'After Registration attempt: ' + ncRegTime
                  }
                })

              }

            }

          });
          
        })
        .catch(error => {
          // send email over error on actual request
        });
      }
      else {
        registrationRes = 'Price higher than set cost'
        
        ncRegTime = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " +  date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds() + ":" + date.getMilliseconds();;
      }

  }

}

async function callGoogle(domain, cost, ncIP) {

    console.log(domain);

    let date = new Date();

    let result, status;

    let voidDate = date.getDate().toString() + date.getMonth().toString() + date.getFullYear().toString() + date.getHours().toString() + date.getMinutes().toString();

    if(firstNamecheap === false || date.getMinutes() === 0 || date.getMinutes() === 20 || date.getMinutes() === 40 && voidDate !== clashDate ) {

      clashDate = date.getDate().toString() + date.getMonth().toString() + date.getFullYear().toString() + date.getHours().toString() + date.getMinutes().toString();
      firstNamecheap = true;
      // call namecheap availability

      await axios.get(`https://api.namecheap.com/xml.response?ApiUser=reachnames4&ApiKey=r0d665627eb0440cea0387ecb2c3e4a46&UserName=reachnames4&Command=namecheap.domains.check&ClientIp=${ncIP}&DomainList=${domain}`)
        .then( response => {

            // cache this in to json file for all 16 ips to access
            
            console.log('Namecheap API response: ', response.data);

            parseString(response.data, {mergeAttrs: true},  function (err, result) {

                status = result.ApiResponse.Status[0];

                if(status === 'OK') {

                    premiumDomain = result.ApiResponse.CommandResponse[0].DomainCheckResult[0].IsPremiumName[0];

                    if(premiumDomain === 'true') {
                      premiumPrice = parseFloat(result.ApiResponse.CommandResponse[0].DomainCheckResult[0].PremiumRegistrationPrice[0]).toFixed(2)
                      premiumPrice = premiumPrice.toString();

                      namecheapData = { 
                        
                        domain: domain,
                        price: premiumPrice,

                      };
                      
                      namecheapData = JSON.stringify(namecheapData);
                      fs.writeFileSync(`${domain}.json`, namecheapData);

                    }

                } 
                
                else if(status === 'ERROR') {

                    registrationRes = 'Namecheap check availability request had an error: ' + result.ApiResponse.Errors[0].Error[0]._;
                    
                }

            })
          })

    }

    result = await axios.get(`https://pubapi-dot-domain-registry.appspot.com/check?domain=${domain}`)
    .then(async function (data) {
        // handle success

        console.log('Full: ', data.data.available);

        result = data.data.available;

        tier = data.data.tier;

        await prisma.wp_options.update({
            where: {
              option_name: 'options_ipv6_0_add_ipv6s_' + env_ip + '_status_ip_ip_health'
            },
            data: {
              option_value: 'Google request: Healthy'
            }
        })

        if(data.data.available === true && firstGoogle === false) {

            firstGoogle = true;
            
            let firstGoogleTime = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " +  date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds() + ":" + date.getMilliseconds();

            let rawdata = fs.readFileSync(`${domain}.json`);

            premiumPrice = JSON.parse(rawdata).price;
            
            sendRegister(domain, cost, tier, ncIP, premiumPrice, registrationRes, firstGoogleTime, lastGoogleTime)

            await prisma.wp_options.update({
              where: {
                option_name: 'options_ipv6_0_add_ipv6s_' + env_ip + '_status_ip_domain_health'
              },
              data: {
                option_value: 'Namecheap response: ' + registrationRes
              }
            })

        } 
        
        else if(data.data.available === true && firstGoogle === true) {

            
            let lastGoogleTime = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " +  date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds() + ":" + date.getMilliseconds();
            
            sendRegister(domain, cost, tier, ncIP, premiumPrice, registrationRes, firstGoogleTime, lastGoogleTime)

            await prisma.wp_options.update({
              where: {
                option_name: 'options_ipv6_0_add_ipv6s_' + env_ip + '_status_ip_domain_health'
              },
              data: {
                option_value: 'Namecheap response: ' + registrationRes
              }
            })
            

        }
        
        else {
            await prisma.wp_options.update({
                where: {
                  option_name: 'options_ipv6_0_add_ipv6s_' + env_ip + '_status_ip_domain_health'
                },
                data: {
                  option_value: 'Domain available: Not Available'
                }
            })
        }

        let rdap = axios.get(`https://www.registry.google/rdap/domain/${domain}`)
        .then( async function (rdapData) {

          rdapEvents = rdapData.data.events;
          rdapDomainStatus = rdapData.data.status
          rdapEvents.map( (v) => {
            console.log(v.eventAction)
            switch(v.eventAction) {
              case 'registration':
                lastRegistrar = 'Registrar: ' + v.eventActor;
                lastRegistrationTime = 'Registration Time: ' + v.eventDate
                break;
            }
          });

          await prisma.wp_options.update({
            where: {
              option_name: 'options_ipv6_0_add_ipv6s_' + env_ip + '_status_ip_rdap_data'
            },
            data: {
              option_value: lastRegistrar + '\n\n' + lastRegistrationTime + '\n\n' + 'ICANN STATUS: ' + rdapDomainStatus
            }
          })

        })
        .catch( function (rdapError) {

          console.log('rdap ERROR: ', rdapError)

        })

        return result;

    })
    .catch(async function (error) {
        await prisma.wp_options.update({
            where: {
              option_name: 'options_ipv6_0_add_ipv6s_' + env_ip + '_status_ip_ip_health'
            },
            data: {
              option_value: 'Google request error: ' + error.data
            }
          })
        console.log('Error Full: ', error);

        result = error.data;

    })

}

async function getDomains() {

  let date = new Date();

  console.log('current minute:: ', date.getMinutes())
  console.log('is true:: ', date.getMinutes() === 38)

  if(firstWordpress === false || date.getMinutes() === 0 || date.getMinutes() === 20 || date.getMinutes() === 40) {

    console.log('WP:: ', typeof date.getMinutes());

    clashDate = date.getDate().toString() + date.getMonth().toString() + date.getFullYear().toString() + date.getHours().toString() + date.getMinutes().toString();
    
    firstWordpress = true

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

    ncIP = options.filter(n => n.option_name === 'options_namecheap_ipv4_address').map((v) => {
        let ncIP = v.option_value
        return ncIP;
      }).toString();

    domains = options.filter((option => option.option_name === 'options_ipv6_0_add_ipv6s_' + env_ip + '_add_domain_0_domain_name'));
    serverRate = options.filter((option => option.option_name === 'options_ipv6_0_add_ipv6s_' + env_ip + '_ipv6_request_time_period')).map((r) => {
      return r.option_value;
    });
    maxCost = options.filter((option => option.option_name === 'options_ipv6_0_add_ipv6s_' + env_ip + '_add_domain_0_max_cost')).map((r) => {
        return r.option_value;
      });

  }
    
    domains.forEach(function(obj, index, collection) {

      const domain = obj.option_value.toString();

        setTimeout(function() {

            (async () => {

                callGoogle(domain, maxCost, ncIP);
                
                getDomains();
            
            })();

        }, parseInt(serverRate.toString()));

    });

}

getDomains();