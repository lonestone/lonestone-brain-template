// The company the wiki belongs to. Every place that names the company (sidebar, document
// header and footer, deck chrome, page titles) reads it from here, so adopting the template
// starts with this file and the palette in `styles/global.css`.

export const SITE = {
  /** Company name, shown in the sidebar, document headers and deck chrome. */
  name: "Exemple",
  /** Public website, printed in document footers. Leave empty to hide it. */
  website: "exemple.fr",
  /** Fallback contact for document footers when no author carries an email. */
  email: "contact@exemple.fr",
  /** Title of the wiki home page. */
  wikiTitle: "Wiki Exemple",
} as const;
