import { defineSecret } from 'firebase-functions/params';
import { GoogleGenerativeAI } from '@google/generative-ai';

export const geminiApiKey = defineSecret('GEMINI_API_KEY');

let genAI: GoogleGenerativeAI | null = null;

function getClient(): GoogleGenerativeAI {
	if (!genAI) {
		genAI = new GoogleGenerativeAI(geminiApiKey.value());
	}
	return genAI;
}

export async function generateJsonResponse<T>(prompt: string): Promise<T> {
	const model = getClient().getGenerativeModel({
		model: 'gemini-2.5-flash',
		generationConfig: { responseMimeType: 'application/json' },
	});
	const result = await model.generateContent(prompt);
	return JSON.parse(result.response.text()) as T;
}

export async function generateImage(prompt: string): Promise<string | null> {
	try {
		const model = getClient().getGenerativeModel({
			model: 'gemini-3-pro-image-preview',
		});
		const result = await model.generateContent({
			contents: [{ role: 'user', parts: [{ text: prompt }] }],
			generationConfig: {
				// @ts-expect-error responseModalities not yet in SDK types
				responseModalities: ['IMAGE', 'TEXT'],
			},
		});
		const parts = result.response.candidates?.[0]?.content?.parts;
		if (parts) {
			for (const part of parts) {
				if (part.inlineData) {
					return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
				}
			}
		}
		return null;
	} catch (error) {
		console.error('Image generation failed:', error);
		return null;
	}
}
