const { sendConversation } = require("./model")

let createConversation = async (text) => {
    try {

        let formattedMessage = [
            ["system", 
                "You are a proficient assistant. Please rephrase the given sentence to enhance its correctness, " +
                "clarity, engagement, and delivery, while also adopting a more academic tone. " +
                "Use the previous two examples as reference. "],
            ["user", "In this digital era, security and data privacy is a top concern for developers. We should not let our user’s data be stolen by irresponsible people. 3 common cryptography techniques are used to secure your data as developers."],
            ["assistant", "In the digital age, ensuring security and data privacy is a paramount concern for developers. It is imperative to safeguard user data from unauthorized access by malicious actors. To achieve this, developers commonly employ three cryptographic techniques."],
            ["user", "If you deploy the Kubernetes cluster on-premise, then you will need a dedicated load balancer to process the incoming traffic to your cluster. There are 2 popular load balancer options for this, HAProxy and Nginx. For this use case, I recommend using HAProxy because it supports high-availability features like health checks. This feature is not directly supported in the Opensource version of Nginx."],
            ["assistant", "When deploying a Kubernetes cluster on-premises, it is essential to have a dedicated load balancer to manage incoming traffic to the cluster. Among the popular options for this purpose are HAProxy and Nginx. For this scenario, I recommend utilizing HAProxy due to its support for high-availability features, such as health checks. In contrast, these features are not directly supported in the open-source version of Nginx."],
            ["user", text]
        ]

        let result = await sendConversation(formattedMessage)
        
        return [ null, result]
    } catch (error) {
        console.log("error", error);
        return [ { code: 500, message: "There is error in the server"}, null ]
    }
}

module.exports = {
    createConversation
}