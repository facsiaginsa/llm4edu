const { MONGO_DATABASE } = require("../../configs")
const { mongoClient } = require("../../loaders/mongodb.js")
const { converse } = require("../../loaders/langchain.js")
const { collectionWithVector, collectionWithVectorRetriever } = require("../../loaders/langchain.js");
import { createRetrievalChain } from "langchain/chains/retrieval";

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

    const prompt = ChatPromptTemplate.fromMessages([
        ["system", systemPrompt],
        ["human", "{input}"],
    ]);

    const connector = collectionWithVectorRetriever(collection);

    const questionAnswerChain = await createStuffDocumentsChain({
        converse,
        prompt,
      });

    const ragChain = await createRetrievalChain({
        connector,
        combineDocsChain: questionAnswerChain,
    });

    return await converse.invoke(conversation)
}

/**
 * Create other models here
 */

module.exports = {
    insertDocumentVector,
    sendBrainstorm,
    searchDocumentVector
}

