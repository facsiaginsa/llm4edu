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
    //let result_query = await collectionWithVector(collection).similaritySearch(query, k=1)
    //let as_output = result_query[0].page_content
    let retriever = collectionWithVector(collection).as_retriever()
    //let qa = RetrievalQA.
}

let sendBrainstorm = async (conversation) => {


        const systemPrompt =
            "You are an assistant for question-answering tasks. " +
            "Use the following pieces of retrieved context to answer " +
            "the question. If you don't know the answer, say that you " +
            "don't know. Use three sentences maximum and keep the " +
            "answer concise." +
            "\n\n" +
            "{context}";

        /*    
        const prompt = ChatPromptTemplate.fromMessages([
            ["system", systemPrompt],
            ["human", "{input}"],
        ]);
        */
        const prompt = PromptTemplate.fromTemplate(`You are a helpful assistant.

            Here is the context of the question:

            {context}
            
            Now, answer 5 title for the following question:
            
            {content}`);


        // Collection Vector
        const vectorStore = await collectionWithVector(collection);
        //conversation = JSON.stringify(conversation)
        let iniEmbeddings = await embedding.embedQuery(conversation)
        iniEmbeddings = JSON.stringify(iniEmbeddings)
        iniEmbeddings = JSON.parse(iniEmbeddings);

        let basicOutput = await vectorStore.similaritySearchVectorWithScore(iniEmbeddings, 4);
        
        //console.log("basic output: ", basicOutput)
        
        // Chain
        const llm = converse
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

