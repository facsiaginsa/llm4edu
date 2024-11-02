const { createBrainstormTrainData } = require("./service")

module.exports = function (app, opts, done) {
    app.get('/', async () => {

    })

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

    done()
}
*/

const axios = require('axios');
const { OPENAI_API_KEY } = require('../../configs');

module.exports = function (app, opts, done) {
    // Create (POST) - Generate brainstorming ideas using ChatGPT
    app.post('/', async (request, reply) => {
        const { prompt } = request.body;

        try {
            const response = await axios.post(
                'https://api.openai.com/v1/chat/completions',
                {
                    model: 'gpt-4o-mini', // atau model lain yang Anda gunakan
                    messages: [
                        { role: 'system', content: 'You are a creative brainstorming assistant who only make an insightful title. Do not answer if the user ask out of topic. Give only five topics using this json format {"topic1":"...", ...,  "topic5":"..." }' },
                        { role: 'user', content: prompt }
                    ],
                    max_tokens: 100
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${OPENAI_API_KEY}`
                    }
                }
            );

            const brainstormIdea = response.data.choices[0].message.content;
            reply.code(201).send({ prompt, brainstormIdea });
        } catch (error) {
            console.error(error);
            reply.code(500).send({ error: 'Failed to generate brainstorming idea' });
        }
    });

    /*

    // Read All (GET) - Return a list of past brainstorming prompts and ideas
    app.get('/', async (request, reply) => {
        // Logic untuk mengambil semua brainstorming ideas dari database (atau storage lokal sementara)
        const brainstormList = []; // Simpan data Anda di sini
        reply.send(brainstormList);
    });

    // Read One (GET by ID) - Get specific brainstorming idea by ID
    app.get('/:id', async (request, reply) => {
        const { id } = request.params;
        // Logic untuk mengambil brainstorming idea berdasarkan ID
        const brainstorm = { id, prompt: "Example Prompt", brainstormIdea: "Generated Idea" }; // Ganti dengan data aktual
        reply.send(brainstorm);
    });

    // Update (PUT) - Update specific brainstorming idea by ID
    app.put('/:id', async (request, reply) => {
        const { id } = request.params;
        const { prompt } = request.body;

        try {
            const response = await axios.post(
                'https://api.openai.com/v1/chat/completions',
                {
                    model: 'gpt-3.5-turbo',
                    messages: [
                        { role: 'system', content: 'You are a creative brainstorming assistant.' },
                        { role: 'user', content: prompt }
                    ],
                    max_tokens: 100
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${OPENAI_API_KEY}`
                    }
                }
            );

            const updatedIdea = response.data.choices[0].message.content;
            reply.send({ id, prompt, updatedIdea });
        } catch (error) {
            console.error(error);
            reply.code(500).send({ error: 'Failed to update brainstorming idea' });
        }
    });

    // Delete (DELETE) - Delete brainstorming idea by ID
    app.delete('/:id', async (request, reply) => {
        const { id } = request.params;
        // Logic untuk menghapus brainstorming idea berdasarkan ID dari database atau storage
        reply.code(204).send(); // 204 No Content
    });

    */

    done();
};
