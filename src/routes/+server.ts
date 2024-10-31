// src/routes/svg/[size]/+server.ts
import { SvelteComponent } from '../components/TonesCircle.svelte';
import { render } from 'svelte/server';
import type { RequestHandler } from './$types';

export const prerender = true;

// What to prerender
export function entries() {
  return Object.keys(configs).map(size => ({ size }));
}

export const GET: RequestHandler = ({ params }) => {
  const size = params.size as keyof typeof configs;
  const config = configs[size];

  if (!config) {
    return new Response('Size not found', { status: 404 });
  }

  const { html } = render(SvelteComponent, config);

  return new Response(html, {
    headers: {
      'Content-Type': 'image/svg+xml'
    }
  });
}