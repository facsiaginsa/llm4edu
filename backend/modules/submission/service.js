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
                text: "In 1 to 3 word(s), without any punctuation mark, tell me What is the research area of this document?",
                }]
        })

        let getRequirementMessage = [
            ["system", 
                "You are a helpful assistant."
            ],
            ["user",
                "What are the requirements for publishing an academic paper in " + publisher + "? " +
                "Do not include any requirement regarding submission process, expert review, payment, and plagiarism check. " +
                "If you cannot find the specific requirements, " + 
                "please provide a list of general criteria for a good academic paper. " + 
                "Ensure each requirement is written in a list of single sentence with semicolon ending, and follow this format:\n" +
                "1. {1st requirement}.\n" + 
                "2. {2nd requirement}.\n" +
                "3. {nth requirement}." 
            ]
        ]

        let getResearchAreaMessage = [
            ["system", "You are a helpful researchers"],
            ...[humanMessage1]
        ]

        let [ result1, result2 ] = await Promise.all([ 
            sendConversation(getRequirementMessage, "invoke"),
            sendConversation(getResearchAreaMessage, "invoke")
         ])

        console.log("requirement: ", result1.content)
        console.log("research area: ", result2.content)

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
                text: "requirements:\n ###\n" + result1.content + "\n###"
                }]
        })

        let getReviewMessage = [
            ["system", 
                "You are a peer reviewer from " + publisher + " and an expert in " + result2.content + ". " +
                "Your task is to identify any issue on the uploaded academic documents based on the requirements provided by user. " +
                "If you identify an issue on the document, specify the words, sentences, paragraphs, tables, " +
                "or images that require attention, along with the page number, and then for each of the issue, please provide some corrections, guidance, or example accordingly. " + 
                "Each requirements may produce multiple issue, and each issue can produce multiple solutions. " +
                "Ensure your solutions is concise and easy to understand. If you cannot proof the issue, " +
                "simply ignore it and move on to the next. Please use the following HTML format for each of your solutions:" +
                "\n\n" +
                "<li class='review-response'>" +
                "<p><strong>Issue {issue number}</strong></p>\n" +
                "<p>{Describe the issue, relevan to the requirement}</p>\n" +
                "<p><strong>Recommendation:</strong> {Provide corrections, guidance, and example on how to fix the issue based on your expertise, do not use any html element}</p>" +
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