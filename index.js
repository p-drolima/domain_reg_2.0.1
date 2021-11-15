const express = require('express')
const { PrismaClient } = require('@prisma/client')
const whoiser = require('whoiser')
const os = require("os")
const axios = require('axios');
const parseString = require('xml2js').parseString;
//const forever = require('forever-monitor');
const postmark = require("postmark");

var email = new postmark.Client("f5d8c559-1498-49e9-a53f-f7fc98a716f7");

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

function transEmail(msg, subject = currentServer + ' notification') {

    client.sendEmail({
      "From": "charlie@reachnames.com",
      "To": "pedro@pedrolima.me",
      "Subject": subject,
      "TextBody": msg
    });
  
}

async function getDomains() {

    const domains = await prisma.wp_posts.findMany({
        where: {
          post_type: 'domains',
          post_status: 'publish'
        },
        select: {
          ID: true,
          post_title: true,
          wp_postmeta: {
            where: {
              OR: [
                { meta_key: 'is_active' },
                { meta_key: 'select_server' },
                { meta_key: 'automatic_registration' },
                { meta_key: 'price_range_1' },
                { meta_key: 'price_range_2' },
                { meta_key: 'current_status' },
                { meta_key: 'reset_domain' }
              ]
            }
          }
        },
    });

    console.log(domains);

}

getDomains();