const { uploadDoc, getDoc, sendConversation } = require("./model")
const { HumanMessage } = require('@langchain/core/messages');
const crypto = require("crypto");

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
                "You are a helpful and expert paper reviewer" +
                "Your task is to search for the paper submission requirements from the given publisher. " +
                "If you cannot find the requirements, please answer with a list of the general requirements" + 
                "for a good academic paper. Answer directly in numbered list format without needing an introduction"
            ],
            ["human", "What is the requirements to publish an academic paper in " + publisher + "?"]
        ]

        let result1 = await sendConversation(getRequirementMessage, "invoke")

        let document = await getDoc(docId)

        let humanMessage1 = new HumanMessage({
            role: "user",
            content: [{
                type: "document", 
                document: {
                    format: "docx",
                    name: "document",
                    source: {
                        bytes: document
                    }
                }
                }, {
                type: "text", 
                text: "In 1 to 3 word(s), please tell me What is the research area of this document?",
                }]
        })


        let getResearchAreaMessage = [
            ["system", "You are a helpful researchers"],
            ...[humanMessage1]
        ]

        let result2 = await sendConversation(getResearchAreaMessage, "invoke")

        let humanMessage2 = new HumanMessage({
            role: "user",
            content: [{
                type: "document", 
                document: {
                    format: "docx",
                    name: "document",
                    source: {
                        bytes: document
                    }
                }
                }, {
                type: "text", 
                text: "Please review this document according to the given requirement below"
                }, {
                type: "text", 
                text: "requirement:\n\n " + result1.content
                }]
        })

        let getReviewMessage = [
            ["system", 
                "You are a peer reviewer from " + publisher + " and an expert in " + result2.content + ". " +
                "Your task is to review an uploaded academic document based on the provided requirements." +
                "If you identify any corrections needed in the document, " +
                "specify the words, sentences, paragraphs, tables, or images that require attention, along with the page number." + 
                "Ensure your feedback is concise and easy to understand. If you cannot check one of the requirements," +
                "simply ignore it and move on to the next. Please use the following HTML format for each of your reviews:" +
                "\n\n" +
                "<li class='review-response'>" +
                "<p><strong>Page:</strong> {Specify the page number where the issue is located. Write '-' if the issue is not relevant to a specific page}</p>\n" +
                "<p><strong>Issue:</strong> {Describe the issue}</p>\n" +
                "<p><strong>Recommendation:</strong> {Provide guidance & example on how to fix the issue}</p>" +
                "</li>"
            ],
            ...[ humanMessage2 ]
        ]

        let result3 = await sendConversation(getReviewMessage, "stream")

        return [ null, result3 ]

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