import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/api/')({
    server: {
        handlers: {
            GET: async ({ request }) => {
                return new Response(
                    JSON.stringify({
                        message: 'API is working!',
                        method: request.method,
                        url: request.url,
                    }),
                    {
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    }
                )
            },
        },
    },
})
