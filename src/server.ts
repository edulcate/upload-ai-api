import { fastify } from 'fastify';
import { getAllPrompts } from './routes/get-all-prompts';
import { uploadVideo } from './routes/upload-video';
import { createTranscription } from './routes/create-transcription';
import { createAICompletion } from './routes/create-ai-completion';
import { fastifyCors } from '@fastify/cors';

const app = fastify();

app.register(fastifyCors, {
	origin: '*'
});

app.register(getAllPrompts);
app.register(uploadVideo);
app.register(createTranscription);
app.register(createAICompletion);

app.listen({
	port: process.env.PORT ? Number(process.env.PORT) : 3333,
	host: '0.0.0.0'
})
	.then(response => {
		console.log('HTTP Server Running!');
	});
