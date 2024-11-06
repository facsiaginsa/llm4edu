const { createBrainstormTrainData, createBrainstorm } = require("./service")
const axios = require('axios');
const { OPENAI_API_KEY } = require('../../configs');

module.exports = function (app, opts, done) {
    app.get('/', async () => {

    })

    // Create (POST) - Generate brainstorming ideas using ChatGPT
    app.post('/', async (request, reply) => {
        const { prompt } = request.body;

        try {
            let [ err, result ] = await createBrainstorm(prompt)
            //console.log(result)

            
            //reply.raw.setHeader('Access-Control-Allow-Origin', '*');
            //reply.raw.setHeader('Access-Control-Allow-Methods', 'GET');
            //reply.raw.setHeader('Access-Control-Allow-Headers', 'Content-Type');
            //reply.raw.setHeader('Content-Type', 'text/event-stream');
            //reply.raw.setHeader('Cache-Control', 'no-cache');
            //reply.raw.setHeader('Connection', 'keep-alive');
            /*
            for await (const item of result) {
                if (!item.response_metadata?.messageStop?.stopReason) {
                    process.stdout.write(item.content);
                    reply.raw.write(`data: ${item.content}\n\n`)
                } else {
                    return reply.raw.end()
                }
            } 
            */
            //console.log(result.raw.end())

            
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


