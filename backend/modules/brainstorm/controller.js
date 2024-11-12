const { createBrainstormTrainData, createBrainstorm } = require("./service")
const axios = require('axios');
const { OPENAI_API_KEY } = require('../../configs');

module.exports = function (app, opts, done) {
    app.get('/', async () => {

    })

    // Create (POST) - Generate brainstorming ideas using ChatGPT
    app.post('/', async (request, reply) => {
        const { prompt } = request.body;
        const promptInput = JSON.stringify(prompt);
        
        try {
            let [ err, result ] = await createBrainstorm(prompt)
            
            reply.code(201).send(result);

        } catch (error) {
            console.error(error);
            reply.code(500).send({ error: 'Failed to generate brainstorming idea' });
        }
    });

    app.post('/train', async (req, res) => {
        let { documents } = req.body

        let [ err, result ] = await createBrainstormTrainData(documents)

        if (err) return res.status(err.code).send({
            message: err.message
        })

        return res.status(200).send({
            message: result
        })
    })

    done()

}


