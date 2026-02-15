const express = require('express')
const axios = require('axios')
const { GoogleAuth } = require('google-auth-library')

const app = express()
app.use(express.json())

app.post('/dialogflow', async (req, res) => {
  try {
    const message = req.body.message

    const auth = new GoogleAuth({
      keyFile: 'service-account.json',
      scopes: 'https://www.googleapis.com/auth/cloud-platform'
    })

    const client = await auth.getClient()
    const accessToken = await client.getAccessToken()

    const response = await axios.post(
      `https://dialogflow.googleapis.com/v2/projects/withdrawal-uuok/agent/sessions/123456:detectIntent`,
      {
        queryInput: {
          text: {
            text: message,
            languageCode: 'en'
          }
        }
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken.token}`
        }
      }
    )

    res.json({
      reply: response.data.queryResult.fulfillmentText
    })

  } catch (error) {
    console.error(error)
    res.status(500).send("Error")
  }
})

app.listen(3000)
