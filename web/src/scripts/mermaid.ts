// Renders every mermaid diagram of the page, loaded once by each page shell
// (Layout, DeckLayout). Both markdown pipelines emit the
// same `<pre class="mermaid">`, see `lib/mermaid-fence.ts`. The theme follows
// the brand colour, lightened: at document scale a saturated accent turns every
// node into a bright block.
const nodes = document.querySelectorAll<HTMLElement>("pre.mermaid");

if (nodes.length > 0) {
  const { default: mermaid } = await import("mermaid");
  mermaid.initialize({
    startOnLoad: false,
    theme: "base",
    themeVariables: {
      primaryColor: "#fff7b3",
      secondaryColor: "#fffbd9",
      tertiaryColor: "#fffdeb",
      primaryTextColor: "#000",
      lineColor: "#000",
    },
  });
  await mermaid.run({ nodes: Array.from(nodes) });
}
