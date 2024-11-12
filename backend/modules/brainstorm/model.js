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

        // Collection Vector
        const vectorStore = await collectionWithVector(collection);
        //conversation = JSON.stringify(conversation)
        let iniEmbeddings = await embedding.embedQuery(conversation)
        // iniEmbeddings = JSON.stringify(iniEmbeddings)
        // iniEmbeddings = JSON.parse(iniEmbeddings);

        let basicOutput = await vectorStore.similaritySearchVectorWithScore(iniEmbeddings, 4);
            
        let filteredOutput = basicOutput.filter(document => document[1] > 0.6)

        let llm = converse(0.8, 0.9)
        let response = ""
        let prompt = ""
        console.log(filteredOutput)
        if (filteredOutput.length > 0) {
            let context = ""
            filteredOutput.forEach((record) => {
                context = context + "\n\n" + record[0].pageContent
            })

            prompt = PromptTemplate.fromTemplate(`
                You are a helpful researcher.
    
                Your task is to generate 3 to 5 insightful research ideas related to the given research area. 
                Each research idea should include a title that is one sentence long, an abstract that is 3-5 sentences long,
                and add 3-4 keyword related to the research idea seperated by comma.  
                You may use some of the provided research as reference, 
                but please also leverage your expertise as a researcher to generate these ideas.
    
                research: {context}
                
                research area: {content}
    
                idea:
    
                please follow this html template for your ideas:
                <strong><p>[The title of research]</p></strong>
                <strong><p>Abstract:</strong> [The abstract of the research]</p>
                <p><strong>Keywords:</strong> [The keywords of the idea]</p>
                <br/>
                `
            )

            const chain = prompt.pipe(llm);
            response = await chain.invoke({ content: conversation, context: context});
        } else {
            prompt = PromptTemplate.fromTemplate(`
                You are a helpful researcher.
    
                Your task is to generate 3 to 5 insightful research ideas related to the given research area. 
                Each research idea should include a title that is one sentence long, an abstract that is 3-5 sentences long,
                and add 3-4 keyword related to the research idea seperated by comma. 
                Please leverage your expertise as a researcher to generate these ideas.
                
                research area: {content}
    
                idea:
    
                Please follow this html template for your ideas:
                <p><strong>[The title of research]</strong></p>
                <p><strong>Abstract:</strong> [The abstract of the research]</p>
                <p><strong>Keywords:</strong> [The keywords of the idea]</p>
                <br/>
                `
            )

            const chain = prompt.pipe(llm);
            response = await chain.invoke({ content: conversation});
        }
        
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

