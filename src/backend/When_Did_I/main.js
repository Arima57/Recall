const { Groq } = require("groq-sdk");

const fs = require('fs/promises');

process.env.GROQ_API_KEY = "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"

const helper = new Groq({ apiKey: process.env.GROQ_API_KEY });

async function prompt(query) {
    const response = await helper.chat.completions.create({
        messages: [
            { role: "user", content: query }
        ],
        model: "mixtral-8x7b-32768",
        temperature: 0.5,
        max_tokens: 1000
    });
    return response.choices[0].message.content.trim();
}

class WhenDidI {
    constructor() {
        this.activities = [];
        this.client = new Groq("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");
        this.loadActivities();
    }

    async loadActivities() {
        try {
            const data = await fs.readFile('activities.json', 'utf8');
            this.activities = JSON.parse(data);
        } catch (error) {
            if (error.code === 'ENOENT') {
                this.activities = [];
            } else {
                throw error;
            }
        }
    }

    async saveActivities() {
        await fs.writeFile('activities.json', JSON.stringify(this.activities));
    }

    async addActivity(activityDescription) {
        const timestamp = new Date().toISOString();
        this.activities.push({ timestamp, description: activityDescription });
        await this.saveActivities();
        console.log("Activity added successfully.");
    }

    async queryActivities(query) {
        const chunkSize = 200;
        const results = [];

        for (let i = 0; i < this.activities.length; i += chunkSize) {
            const chunk = this.activities.slice(i, i + chunkSize);
            const prompt = `
            Given the following list of activities:
            ${JSON.stringify(chunk, null, 2)}

            Answer the query: "${query}"
            Provide a concise and relevant answer based on these activities.
            Return the answer with precise dates and times (do whatever bit of calculation is necessary)
            Return the specific entries with a match before returning a summary.
            `;

            const response = await this.client.chat.completions.create({
                messages: [
                    { role: "system", content: "You are a helpful assistant that answers questions about recorded activities." },
                    { role: "user", content: prompt }
                ],
                model: "mixtral-8x7b-32768",
                temperature: 0.5,
                max_tokens: 10000
            });

            results.push(response.choices[0].message.content.trim());
        }

        const finalPrompt = `
        Given the following partial answers to the query: "${query}"

        ${JSON.stringify(results, null, 2)}

        Provide a final, concise, and coherent answer that summarizes the information from all partial answers.
        Return the answer with precise dates and times (do whatever bit of calculation is necessary)
        Return the specific entries with a match before returning a summary.
        `;

        const finalResponse = await this.client.chat.completions.create({
            messages: [
                { role: "system", content: "You are a helpful assistant that summarizes answers about recorded activities." },
                { role: "user", content: finalPrompt }
            ],
            model: "mixtral-8x7b-32768",
            temperature: 0.5,
            max_tokens: 10000
        });

        return finalResponse.choices[0].message.content.trim();
    }
}
