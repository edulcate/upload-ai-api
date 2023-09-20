import { FastifyInstance } from 'fastify';
import { prisma } from '../lib/prisma';

export async function getAllPrompts(app: FastifyInstance) {
	app.get('/prompts', async () => {
		const prompts = prisma.prompt.findMany();

		return prompts;
	});
}