# Legacy App Rescue — visual thesis

## Direction

**Botanical field guide.** An old APK is treated like a fragile specimen: observed, labelled, dated, and stored without altering it. The page borrows the rigor of a naturalist's field ledger rather than the polish of a software dashboard. Fine rules, clipped specimen labels, quiet paper grain, and oxide-red verdict stamps make preservation work feel careful and legible.

The visual metaphor stops at organization. Product copy always says APK, device, manifest, and data export. No botanical euphemism hides the job.

## Palette

| Token | Value | Use |
| --- | --- | --- |
| `--paper` | `#F2EBD9` | warm field-note background |
| `--paper-deep` | `#E5D8BA` | section bands and tags |
| `--ink` | `#16251C` | primary text; 13.2:1 on paper |
| `--ink-soft` | `#4B594F` | secondary text; 6.4:1 on paper |
| `--moss` | `#2D5A3D` | primary actions and focus anchors |
| `--moss-dark` | `#173B27` | action hover and dark surfaces |
| `--lichen` | `#A7B58A` | rules and quiet highlights |
| `--oxide` | `#9C3F2D` | warnings, paid stamp, incompatibility |
| `--sun` | `#D6A744` | focus ring and small markers |
| `--night` | `#0D1812` | terminal field and dark treatment |
| `--cream` | `#FFF9EA` | text on moss/night |

The product uses one deliberately light, paper-like mode. The terminal provides a dark treatment inside it. This keeps the ledger metaphor intact and avoids a theme switch becoming another setup task.

## Type

- Display and labels: **Georgia**, then `Times New Roman`, serif. Its bookish shapes fit catalog headings and need no network font.
- Body and controls: **Atkinson Hyperlegible**, self-hosted WOFF2, with Arial as fallback. Open forms help filenames and package IDs remain distinct.
- Terminal and measurements: `ui-monospace`, SFMono-Regular, Consolas, monospace with tabular numbers.

The type scale is 16, 18, 22, 30, and clamp(40–68) px. Body measure stays under 68 characters.

## Spacing and shape

- Base unit: 8 px. Section rhythm: 64/96/128 px according to viewport.
- Content width: 1184 px; reading width: 68ch.
- Corners are clipped or lightly rounded at 2–12 px. A specimen label may use one clipped corner; buttons stay rectangular and unmistakable.
- Rules and dotted leaders organize related facts before cards are introduced.

## Interaction grammar

- Primary actions are dense moss rectangles with a pressed two-pixel shadow.
- Links keep visible underlines. Focus uses a 3 px sun outline with 3 px offset.
- Compatibility results arrive as a physical-looking stamped label. Color is always paired with text and a symbol.
- Demo mode pins a narrow paper tag below the header. It names the sandbox and provides Reset demo and Start for real.

## Motion

One signature motion: specimen labels settle downward by 8 px as results appear, like a label placed beside a sample. Duration is 220 ms with a restrained cubic curve. The terminal playback advances only while visible and has pause/replay controls. Nothing loops.

With `prefers-reduced-motion: reduce`, labels appear without translation, scrolling is instant, and terminal lines render together. No essential state depends on motion.

## Original asset plan and provenance

- Hero plate: an original generated gouache-and-ink field-guide illustration of a fern archiving an abstract Android package, with no brands, UI, or readable text. It clarifies the preservation metaphor while leaving copy outside the image.
- Product mark and interface icons: hand-drawn SVG line work created in this repository. They use simple fern, tag, file, shield, and cable shapes.
- Open Graph image: composed locally from the generated plate and the product's own color system.

Generation prompt (factory `gen-image.sh`, deployment recorded by its JSON sidecar):

> Botanical field guide plate for a software preservation utility. A pressed fern frond carefully sheltering a small abstract archive box and a coiled device cable, arranged like catalogued specimens on warm antique field-note paper. Precise gouache and ink illustration, restrained moss green, lichen, charcoal, and oxide red, subtle paper fibers, asymmetric composition with generous quiet space on the left, top-down view. No logos, no Android mascot, no screens, no readable text, no watermark, no gradient, no photorealism.

The generated source is retained in `art-source/`. The served WebP derivatives are optimized below 300 KB. Generated imagery is used under the factory's asset-generation terms; repository-authored SVG and layout are MIT licensed with the code.
