# Lightweight coding standards

Keep the starter easy to extend:

- Put reusable React components, layout logic, and styles in `src/ui/`.
- Put project content and future canvas or renderer integration in `src/content/`.
- Use one component per file, name React components in PascalCase, and name helpers by the behavior they provide.
- Keep imports within a layer when possible; UI may receive content through props, while content should not own the UI shell.
- Keep the starter renderer-free until a project explicitly adds a renderer and its lifecycle responsibilities.
- Prefer small focused changes and update the focused tests when a source boundary or layout contract changes.
