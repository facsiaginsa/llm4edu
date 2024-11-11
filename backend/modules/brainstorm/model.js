const { MONGO_DATABASE } = require("../../configs")
const { mongoClient } = require("../../loaders/mongodb.js")
const { converse, embedding } = require("../../loaders/langchain.js")
const { collectionWithVector, collectionWithVectorRetriever } = require("../../loaders/langchain.js");
const { ChatPromptTemplate, PromptTemplate  } = require("@langchain/core/prompts")

let collection = mongoClient.db(MONGO_DATABASE).collection("paper")

let insertDocumentVector = async (vectors, documents) => {
    let index = await collectionWithVector(collection)
    return await index.addVectors(vectors, documents)
}

let searchDocumentVector = async (query) =>{
    let retriever = collectionWithVector(collection).as_retriever()
}

let sendBrainstorm = async (conversation) => {

        /*
        const systemPrompt =
            "You are an assistant for question-answering tasks. " +
            "Use the following pieces of retrieved context to answer " +
            "the question. If you don't know the answer, say that you " +
            "don't know. Use three sentences maximum and keep the " +
            "answer concise." +
            "\n\n" +
            "{context}";

           
        const prompt = ChatPromptTemplate.fromMessages([
            ["system", systemPrompt],
            ["human", "{input}"],
        ]);
        */
       /*
        const prompt = PromptTemplate.fromTemplate(`You are a helpful assistant.

            Here is the context of the question:

            {context}

            Now, answer (to the point - without numbering and quotation mark) 5 title and its abstract (in three lines) for the following question:
            
            {content}
            
            `);
        */
        const prompt = PromptTemplate.fromTemplate(`You are a creative brainstorming assistant who only make an insightful title.

            
            Here is the idea of the question:

            {context}

            Use the provided information as a suggestion rather than a strict constraint:
            - If the context is relevant, create titles that reflect its essence.
            - Aim to stay concise, insightful, and without redundancies.
            - if out of topic, answer {{none}}
            - Without numbering and quotation mark
            - 5 titles and its abstract (in 3 lines)
            - format: '1. Title:{{title}}. Abstract:{{abstract}},  
            2. Title:{{title}}. Abstract:{{abstract}},   
            3. Title:{{title}}. Abstract:{{abstract}},  
            4. Title:{{title}}. Abstract:{{abstract}},  
            5. Title:{{title}}. Abstract:{{abstract}}.  

            {content}`
        )


        // Collection Vector
        const vectorStore = await collectionWithVector(collection);
        //conversation = JSON.stringify(conversation)
        let iniEmbeddings = await embedding.embedQuery(conversation)
        iniEmbeddings = JSON.stringify(iniEmbeddings)
        iniEmbeddings = JSON.parse(iniEmbeddings);

        let basicOutput = await vectorStore.similaritySearchVectorWithScore(iniEmbeddings, 4);
        
        //console.log("basic output: ", basicOutput)
        
        // Chain
        const llm = converse(0.9, 0.1)
        const chain = prompt.pipe(llm);
        const response = await chain.invoke({ content: conversation, context: basicOutput});
        typeof("di model: ", typeof(response))
        //return await converse.stream(conversation)
    return response
}

/**
 * Create other models here
 */

module.exports = {
    insertDocumentVector,
    sendBrainstorm,
    searchDocumentVector
}

