async function getAIResponse(question) {
    const response = await fetch("/ai/knowledge.json");
    const data = await response.json();

    question = question.toLowerCase();

    if (question.includes("anas ali"))
        return "Anas Ali is a trusted trader providing USDT and crypto services in Pakistan and UAE.";

    if (question.includes("service"))
        return "We offer services: " + data.services.join(", ");

    if (question.includes("payment"))
        return data.payment_instructions.join(" | ");

    if (question.includes("usdt"))
        return "USDT TRC20 is accepted. Send exact amount to the address shown on the payment page.";

    if (question.includes("contact"))
        return data.faq.how_to_contact;

    return "I am here to assist with CryptoMinePro services. Ask me anything!";
}

export { getAIResponse };
