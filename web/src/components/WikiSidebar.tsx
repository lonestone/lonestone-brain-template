import { useEffect, useMemo, useState } from "react";
import { SITE } from "../lib/site-config";
import type { WikiNode } from "../lib/wiki";

interface Props {
  tree: WikiNode[];
  currentPath: string;
}

const LS_COLLAPSED = "wiki.sidebar.collapsed";
const LS_EXPANDED = "wiki.sidebar.expanded";
const LS_FAVORITES = "wiki.sidebar.favorites";

function normalize(p: string): string {
  return p.replace(/\/+$/, "") || "/";
}

function readSet(key: string): Set<string> {
  if (typeof localStorage === "undefined") return new Set();
  try {
    const raw = localStorage.getItem(key);
    return new Set(raw ? (JSON.parse(raw) as string[]) : []);
  } catch {
    return new Set();
  }
}

function writeSet(key: string, set: Set<string>) {
  try {
    localStorage.setItem(key, JSON.stringify([...set]));
  } catch {
    /* ignore */
  }
}

// ---- icons (inline, no external deps) ------------------------------------

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      className={`shrink-0 transition-transform ${open ? "rotate-90" : ""}`}
      style={{ color: "currentColor" }}
    >
      <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Star({ filled }: { filled: boolean }) {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill={filled ? "var(--color-accent)" : "none"}>
      <path
        d="M12 3l2.7 5.5 6 .9-4.3 4.2 1 6-5.4-2.8L6.6 22l1-6L3.3 9.4l6-.9L12 3z"
        stroke={filled ? "var(--color-accent)" : "currentColor"}
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function FileDot() {
  return <span className="inline-block w-1 h-1 rounded-full bg-zinc-400 shrink-0" />;
}

// ---- flatten helpers -----------------------------------------------------

/** Folder paths that contain the active href somewhere in their subtree. */
function ancestorsOfActive(nodes: WikiNode[], activeHref: string): Set<string> {
  const result = new Set<string>();
  const walk = (node: WikiNode): boolean => {
    let hit = node.href ? normalize(node.href) === activeHref : false;
    if (node.children) {
      for (const child of node.children) {
        if (walk(child)) hit = true;
      }
    }
    if (hit && node.type === "folder") result.add(node.path);
    return hit;
  };
  nodes.forEach(walk);
  return result;
}

function findNode(nodes: WikiNode[], path: string): WikiNode | null {
  for (const n of nodes) {
    if (n.path === path) return n;
    if (n.children) {
      const found = findNode(n.children, path);
      if (found) return found;
    }
  }
  return null;
}

// ---- tree row ------------------------------------------------------------

interface RowProps {
  node: WikiNode;
  depth: number;
  activeHref: string;
  expanded: Set<string>;
  toggleExpand: (path: string) => void;
  favorites: Set<string>;
  toggleFav: (path: string) => void;
  filter: string;
}

function matchesFilter(node: WikiNode, filter: string): boolean {
  if (!filter) return true;
  if (node.name.toLowerCase().includes(filter)) return true;
  if (node.children) return node.children.some((c) => matchesFilter(c, filter));
  return false;
}

function Row(props: RowProps) {
  const { node, depth, activeHref, expanded, toggleExpand, favorites, toggleFav, filter } = props;
  if (!matchesFilter(node, filter)) return null;

  const isFolder = node.type === "folder";
  const open = isFolder && (filter ? true : expanded.has(node.path));
  const href = node.href ? node.href : undefined;
  const isActive = href ? normalize(href) === activeHref : false;
  const pad = 8 + depth * 12;

  return (
    <div>
      <div
        className={`group flex items-center gap-1 rounded-md pr-1.5 text-sm cursor-pointer select-none ${
          isActive ? "bg-accent/20 text-zinc-900 font-medium" : "text-zinc-700 hover:bg-zinc-100"
        }`}
        style={{ paddingLeft: pad }}
      >
        {isFolder ? (
          <button
            type="button"
            aria-label={open ? "Replier" : "Déplier"}
            className="flex items-center justify-center w-4 h-5 text-zinc-400 hover:text-zinc-700"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleExpand(node.path);
            }}
          >
            <Chevron open={open} />
          </button>
        ) : (
          <span className="flex items-center justify-center w-4 h-5">
            <FileDot />
          </span>
        )}

        {href ? (
          <a href={href} className="flex-1 truncate py-1 no-underline hover:no-underline">
            {node.name}
          </a>
        ) : (
          <span
            className="flex-1 truncate py-1"
            onClick={() => isFolder && toggleExpand(node.path)}
          >
            {node.name}
          </span>
        )}

        {isFolder && (
          <button
            type="button"
            aria-label={favorites.has(node.path) ? "Retirer des favoris" : "Ajouter aux favoris"}
            className={`shrink-0 p-0.5 text-zinc-300 hover:text-amber-500 ${
              favorites.has(node.path) ? "opacity-100" : "opacity-0 group-hover:opacity-100"
            }`}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleFav(node.path);
            }}
          >
            <Star filled={favorites.has(node.path)} />
          </button>
        )}
      </div>

      {isFolder && open && node.children && (
        <div>
          {node.children.map((child) => (
            <Row key={child.path} {...props} node={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

// ---- sidebar -------------------------------------------------------------

export default function WikiSidebar({ tree, currentPath }: Props) {
  const activeHref = normalize(currentPath);

  const [collapsed, setCollapsed] = useState(false);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [filter, setFilter] = useState("");
  const [ready, setReady] = useState(false);

  // Hydrate from localStorage, then auto-expand the active page's ancestors.
  useEffect(() => {
    setCollapsed(localStorage.getItem(LS_COLLAPSED) === "1");
    const savedExpanded = readSet(LS_EXPANDED);
    if (savedExpanded.size === 0) {
      // First visit: expand top-level folders.
      for (const n of tree) if (n.type === "folder") savedExpanded.add(n.path);
    }
    for (const p of ancestorsOfActive(tree, activeHref)) savedExpanded.add(p);
    setExpanded(savedExpanded);
    setFavorites(readSet(LS_FAVORITES));
    setReady(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleExpand = (path: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(path)) next.delete(path);
      else next.add(path);
      writeSet(LS_EXPANDED, next);
      return next;
    });
  };

  const toggleFav = (path: string) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(path)) next.delete(path);
      else next.add(path);
      writeSet(LS_FAVORITES, next);
      return next;
    });
  };

  const setCollapsedPersist = (v: boolean) => {
    setCollapsed(v);
    try {
      localStorage.setItem(LS_COLLAPSED, v ? "1" : "0");
    } catch {
      /* ignore */
    }
  };

  const favNodes = useMemo(
    () =>
      [...favorites]
        .map((p) => findNode(tree, p))
        .filter((n): n is WikiNode => !!n),
    [favorites, tree],
  );

  const normFilter = filter.trim().toLowerCase();

  if (collapsed) {
    return (
      <aside className="print:hidden shrink-0 w-11 border-r border-zinc-200 bg-chrome flex flex-col items-center py-3 gap-3 sticky top-0 h-screen">
        <button
          type="button"
          aria-label="Ouvrir la navigation"
          className="p-1.5 rounded-md text-zinc-500 hover:bg-zinc-100"
          onClick={() => setCollapsedPersist(false)}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
        <a href={"/"} aria-label="Accueil" className="p-1.5 rounded-md text-zinc-500 hover:bg-zinc-100">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M3 11l9-8 9 8M5 10v10h14V10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>
      </aside>
    );
  }

  return (
    <aside className="print:hidden shrink-0 w-64 border-r border-zinc-200 bg-chrome sticky top-0 h-screen flex flex-col">
      {/* header */}
      <div className="flex items-center justify-between px-3 h-12 shrink-0 border-b border-zinc-100">
        <a href={"/"} className="flex items-center gap-2 no-underline hover:no-underline">
          <span className="w-5 h-5 rounded bg-brand text-ink text-[11px] font-bold flex items-center justify-center">{SITE.name.charAt(0)}</span>
          <span className="font-semibold text-sm text-zinc-900">{SITE.name}</span>
        </a>
        <button
          type="button"
          aria-label="Replier la navigation"
          className="p-1.5 rounded-md text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700"
          onClick={() => setCollapsedPersist(true)}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>


      {/* search */}
      <div className="px-2 pt-2 shrink-0">
        <input
          type="search"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="Rechercher…"
          className="w-full px-2.5 py-1.5 text-sm rounded-md bg-zinc-100 border border-transparent focus:border-zinc-300 focus:bg-white outline-none placeholder:text-zinc-400"
        />
      </div>

      {/* scrollable tree */}
      <nav className="flex-1 overflow-y-auto px-1.5 py-2 min-h-0">
        {ready && favNodes.length > 0 && !normFilter && (
          <div className="mb-2">
            <div className="px-2 py-1 text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
              Favoris
            </div>
            {favNodes.map((n) => (
              <Row
                key={"fav-" + n.path}
                node={n}
                depth={0}
                activeHref={activeHref}
                expanded={expanded}
                toggleExpand={toggleExpand}
                favorites={favorites}
                toggleFav={toggleFav}
                filter={normFilter}
              />
            ))}
            <div className="mx-2 my-2 border-b border-zinc-100" />
          </div>
        )}

        {tree.map((n) => (
          <Row
            key={n.path}
            node={n}
            depth={0}
            activeHref={activeHref}
            expanded={expanded}
            toggleExpand={toggleExpand}
            favorites={favorites}
            toggleFav={toggleFav}
            filter={normFilter}
          />
        ))}
      </nav>
    </aside>
  );
}
