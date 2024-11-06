const { uploadDoc, getDoc, sendConversation } = require("./model")
const { HumanMessage } = require('@langchain/core/messages');
const crypto = require("crypto")

let saveDocument = async (data) => {
    try {
        let docIdSeed = crypto.randomUUID()
        let docId = crypto.createHash("md5").update(docIdSeed).digest("hex")

        let result = await uploadDoc(docId, await data.toBuffer(), {
            name: data.filename,
            mimetype: data.mimetype,
            encoding: data.encoding,
        })

        return [ null, result ]
    } catch (error) {
        console.log(error)
        return [ { code: 500, message: "There is error in the server"}, null ]
    }
}


let reviewDocument = async (publisher, docId) => {
    try {

        let getRequirementMessage = [
            ["system", 
                "You are a helpful an expert paper reviewer" +
                "Your task is to search for the paper submission requirements from the given publisher. " +
                "If you cannot find the requirements, please answer with a list of the general requirements" + 
                "for a good academic paper. Answer directly in numbered list format without needing an introduction"
            ],
            ["human", "What is the requirements to publish an academic paper in " + publisher + "?"]
        ]

        let result1 = await sendConversation(getRequirementMessage, "invoke")

        // let requirement = result1.content
        // if (result1.content.search("no requirement") >= 0) {
        //     NO_REQUIREMENT = true
        //     let resultArray = result1.content.split(";")
        //     resultArray.shift()
        //     requirement = resultArray.toString(";")
        // }

        let document = await getDoc(docId)

        console.log("requirement", result1.content)

        // let getReviewMessage = [
        //     ["system", 
        //         "You are a peer reviewer from " + publisher + ". " +
        //         "Your task is to review an academic document that is uploaded based on the given requirement" +
        //         "If you notice any corrections needed in the document, " +
        //         "please specify the words, sentences, paragraphs, tables, or images, along with the page number." + 
        //         "Please use this format to answer:" +
        //         "\n\n" +
        //         "Page: <specify the page number where the issue is located>\n" +
        //         "Issue: <specify the issue>\n" +
        //         "Recommendation: <tell the user how to fix the issue>" +
        //         "\n\n" +
        //         "Ensure your answer is concise and easy to understand. Separate each answer with ###"
        //     ],
            // ["human", 
            //     "Please review this document based on this requirement:" + 
            //     "\n\n" +
            //     "document: " + document +
            //     "\n\n" +
            //     "requirement:\n" + 
            //     "'''" +
            //     result1.content +
            //     "'''"
            // ]
        // ]

        let humanMessage = new HumanMessage({
            content: [
                {type: "text", text: "What is the title of the document?"},
                {type: "text", text: `data:application/vnd.openxmlformats-officedocument.wordprocessingml.document;base64,${document}`}
            ]
        })

        let getReviewMessage = [
            ["system", "you are a helpful assistant that summarize a document given to you"],
            ...[humanMessage]
        ]
 
        let result2 = await sendConversation(getReviewMessage, "stream")

        return [ null, result2 ]

    } catch (error) {
        console.log(error)
        return [ { code: 500, message: "There is error in the server"}, null ]
    }
}

let downloadDocument = async (docId) => {
    try {
        let document = await getDoc(docId)

        return [ null, document ]
    } catch (error) {
        console.log(error)
        return [ { code: 500, message: "There is error in the server"}, null ]
    }
    

}

module.exports = {
    saveDocument,
    reviewDocument,
    downloadDocument
}