import { createClient } from '@sanity/client';

const client = createClient({
  projectId: "yhjqtjbt",
  dataset: "production",
  apiVersion: '2025-01-17',
  token:"sk8aSwOInWRdF6LTqYQCQgFdlTG6K0ziZxxiCFZP00826ZvWsgVQ1ML1aItKvfgzn9klbwUV7O8IgUl4EfmHl9HEnAs4N2JFjLspIRx4Diaxf1wV5kU92s2B3YdxbItoDEJCIwbTXaYV6kivz0e9k0xIuyJC18WxigQlQDjMdyI5YU6Q1ijD",
  useCdn: true,
});

export default client;