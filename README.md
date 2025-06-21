# react-mdxutils

[![npm version](https://badge.fury.io/js/react-mdxutils.svg)](https://www.npmjs.com/package/react-mdxutils)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

`react-mdxutils` is a lightweight and versatile utility package for extracting Table of Contents (TOC) items and a React hook to manage the active heading link based on scroll position.

## 📦 Installation

You can install `react-mdxutils` using npm or yarn:

```bash
npm install mdxutils
```

## ✨ Features

- Extract Table of Contents: Easily get a structured list of headings (and their slugs) from any MDX or Markdown string.
- GitHub-compatible Slugs: Generates slugs that are compatible with how GitHub renders heading IDs.
- Active Heading Tracking Hook: A React hook (useActiveHeading) to automatically highlight the current heading in view as the user scrolls, and manage a dynamic indicator.
- TypeScript Support: Built with TypeScript for type safety and better developer experience.

## 🚀 Usage

`react-mdxutils` provides two main exports: a utility function (generateTocFromMdx) and a React hook (useActiveHeading).

### 1. generateTocFromMdx(mdxContent: string): TocItem[]

This function modify the generated toc using `mdast-util-toc` and returns an array of heading objects, suitable for building a perfect Table of Contents.

```tsx
import { generateTocFromMdx } from "mdxutils";
const toc = generateTocFromMdx(mdxContent);

<ul className="leading-7">
  {toc.map((item, i: number) => {
    return (
      <Link href={`#${item.slug}`} key={i} className="">
        <li style={{ marginLeft: `${(item.level - 2) * 10}px` }}>
          {item.content}
        </li>
      </Link>
    );
  })}
</ul>;
```

### How it Works Under the Hood:
`generateTocFromMdx` acts as a wrapper that orchestrates the robust parsing and slug generation process.

- Core TOC Generation: It internally leverages` mdast-util-toc` to parse your MDX content into an Abstract Syntax Tree (AST) and then derive an initial, nested Table of Contents structure from it. This library is a well-established tool in the unified ecosystem for precisely this purpose.

- Reliable Slug Generation: Critically, generateTocFromMdx ensures that the slug (the unique ID for each heading that enables anchor links) is generated consistently and reliably. It achieves this by utilizing github-slugger. This ensures that the generated slugs for your headings perfectly match the IDs that GitHub and other compliant Markdown renderers would produce, guaranteeing seamless deep-linking within your documentation. The function then flattens this enriched, nested TOC structure into the straightforward TocItem[] array you receive.

In essence, generateTocFromMdx takes care of the complexities of parsing and slugging, providing you with a ready-to-use, robust Table of Contents data structure.

### 2. useActiveHeading(content: string) React Hook
This hook tracks the currently visible heading in a scrollable area and updates an "active" state, which can be used to highlight the corresponding link in your Table of Contents. It also provides refs for the TOC links, an active indicator element, and the TOC container itself, enabling dynamic visual effects.

**Example Usage in a React Component**

```tsx
import { generateTocFromMdx } from "mdxutils";

const toc = generateTocFromMdx(mdxContent);
const {
activeHeading,
handleActiveHeading,
headingListRefs,
activeIndicatorRef,
asideRef,
} = useActiveHeading(mdxContent);

<aside className="w-[300px] overflow-y-auto" ref={asideRef}>
<ul className="w-full leading-7 relative">
    {toc.map((item, i: number) => {
        return (
        <Link href={`#${item.slug}`} key={i} className="">
            <li
            ref={(el) => {
                headingListRefs.current[item.slug] = el;
            }}
            onClick={() => {
                handleActiveHeading(headingListRefs.current[item.slug] as HTMLElement, `#${item.slug}`);
            }}
            className={`one_line_ellipsis w-fit px-2 text-read_2 ${activeHeading === `#${item.slug}` ? "text-pm_purple-600 font-medium" : "text-text-color_2"}`}
            style={{ marginLeft: `${(item.level - 2) * 10}px` }}
            >
            {item.content}
            </li>
        </Link>
        );
    })}
    <div
        ref={activeIndicatorRef}
        className="absolute transition-all duration-200 h-[28px] bg-background-color_850C left-0 top-0 rounded-tiny -z-10"
    ></div>
</ul>
</aside>
```

### How the useActiveHeading Hook Works:
- `activeHeading` State: Stores the `hash` (e.g., `#section-one`) of the currently visible heading.

- `headingListRefs`: A `useRef` object that maps heading slugs to their corresponding HTMLElement in the Table of Contents sidebar. This is crucial for correctly positioning the visual indicator and scrolling the sidebar.

- `activeIndicatorRef`: A `useRef` for the actual DOM element that acts as the moving indicator.

- `asideRef`: A `useRef` for the Table of Contents sidebar container. This reference is crucial for managing the sidebar's scroll position programmatically, ensuring that the currently active heading link remains visible and centered within the sidebar's viewport, without affecting the main page's scroll.

- `handleActiveHeading`: A `useCallback` function that takes a DOM element (btn) and a hashLink. It sets the activeHeading state and uses requestAnimationFrame to smoothly animate the activeIndicatorRef's position and size to match the btn's dimensions.

#### Why content: string is a parameter for `useActiveHeading`:
The `useActiveHeading` hook takes content: string as a parameter to ensure its internal logic, specifically the Intersection Observer, is re-initialized and re-attached to the correct heading elements whenever your MDX or Markdown content changes.

## 🤝 Contributing
Contributions are welcome! If you find a bug, have a feature request, or want to improve the code, please open an issue or submit a pull request on the [GitHub repository](https://github.com/gitmahin/react-mdxutils).
