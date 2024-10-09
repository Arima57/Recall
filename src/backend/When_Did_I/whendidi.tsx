import { Groq } from "groq-sdk";
import { Filesystem, Directory, Encoding } from "@capacitor/filesystem";


interface Activity {
    timestamp: string;
    description: string;
}

class WhenDidI {
    public activities: Activity[];
    private client: Groq;

    constructor() {
        this.activities = [];
        this.client = new Groq({ apiKey: "", //left empty
            dangerouslyAllowBrowser: true,
         });
        this.loadActivities();
    }

    public getActivities(): Activity[] {
        return JSON.parse(JSON.stringify(this.activities));
    }
    private async loadActivities(): Promise<void> {
        try {
            const { files } = await Filesystem.readdir({
                path: '',
                directory: Directory.Data
            });

            if (files.some(file => file.name === 'activities.json')) {
                const { data } = await Filesystem.readFile({
                    path: 'activities.json',
                    directory: Directory.Data,
                    encoding: Encoding.UTF8,
                }) as { data: string };
                this.activities = JSON.parse(data);
            } else {
                this.activities = [];
            }
        } catch (error: any) {
            console.error('Error loading activities:', error);
            this.activities = [];
        }
    }

    private async saveActivities(): Promise<void> {
        const fileName = 'activities.json';
        const data = JSON.stringify(this.activities);
        
        try {
            await Filesystem.writeFile({
                path: fileName,
                data: data,
                directory: Directory.Data,
                encoding: Encoding.UTF8,
                recursive: true
            });
        } catch (error: any) {
            console.error('Error saving activities:', error);
        }
    }
    async addActivity(activityDescription: string): Promise<void> {
        if (!activityDescription.trim()) {
            console.log("Attempted to add empty activity, ignoring.");
            return;
        }
        console.log("Adding activity:", activityDescription);
        const timestamp = new Date().toISOString();
        this.activities.push({ timestamp, description: activityDescription });
        console.log(this.activities)
        await this.saveActivities();
        console.log("Activity added successfully.");
    }

    async queryActivities(query: string): Promise<string> {
        const chunkSize = 200;
        const results: string[] = [];

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
            if (!response.choices[0].message.content) {
                throw new Error("No response from the model");
            }
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
        if (!finalResponse.choices[0].message.content) {
            throw new Error("No response from the model");
        }
        return finalResponse.choices[0].message.content.trim();
    }

    async delete(index:number): Promise<void> {
        console.log(JSON.stringify(this.activities))
        if (index >= 0 && index < this.activities.length) {
            this.activities.splice(index, 1);
            await this.saveActivities();
            console.log("Activity deleted successfully.");
        } else {
            console.error("Invalid index. Activities is " + this.activities.length);
        }
    }
}

export default WhenDidI;
