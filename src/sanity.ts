import { createClient } from '@sanity/client';

const client = createClient({
  projectId: "mvu8y4dl",
  dataset: "production",
  apiVersion: '2025-01-17',
  token:"skEDrgaqvsFaDBOkZ5aF3jbG0vUvyUwhSuPyCJyJ73CcR1v0ZxDklfSsOZTb97rID4SE7lm9A189M2ofP3bGAkonW8tnSEdeRbOQbBtmQoESgDTttL2Q5v6fJ0XovftmpkJGckcSuUYJkr503HvfJBSG4LkMCG0RGJWXYgY2eAgEtsBtqVfI",
  useCdn: true,
});

export default client;