const { EmailClient } = require("@azure/communication-email");

const AZURE_CONNECTION_STRING = process.env.AZURE_CONNECTION_STRING
const AZURE_SENDER_EMAIL = process.env.AZURE_SENDER_EMAIL
const client = new EmailClient("endpoint=https://project-email.uk.communication.azure.com/;accesskey=Fwz5TdRAF/0cYkq1ow5Lh0wfqWniaTddjC28gNAZhoGMgqkPEbeVYiCgRy7fjDxdqnY3ljddjf0S9O/6WWceJA==");

const emailSender = async (to, subject, html) =>{
    const message = {
        senderAddress: "donot-reply@cb6bedbb-c0c9-4be5-8412-be4722d081b3.azurecomm.net",
        content: {
          subject,
          html
        },
        recipients: {
          to
        },
      };
      
      const poller = await client.beginSend(message);
      const response = await poller.pollUntilDone();
      return response
}

module.exports = emailSender;