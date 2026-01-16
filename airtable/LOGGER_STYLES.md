# Airtable Logger Styles Reference

Custom logger styles for visual debugging of Airtable operations.

## Style Definitions

```javascript
// In airtable/fetchAirtableData.js
import logger, { LumberjackStyle } from '@datainkio/lumberjack';

const msgStyle = new LumberjackStyle('#0A9396', '🗄️');
const cachedStyle = new LumberjackStyle('#CA6702', '•');
const refreshStyle = new LumberjackStyle('#CA6702', '↻');
```

## Usage Mapping

| Operation           | Style          | Prefix | Color                   | Example                                        |
| ------------------- | -------------- | ------ | ----------------------- | ---------------------------------------------- |
| Force refresh table | `refreshStyle` | ↻      | Warm orange (`#CA6702`) | `Refreshing: { table: "Projects" }`            |
| Using cache         | `cachedStyle`  | •      | Warm orange (`#CA6702`) | `Projects: cached`                             |
| General messages    | `msgStyle`     | 🗄️     | Teal (`#0A9396`)        | `Projects: fetching`                           |
| Errors              | Auto-detected  | ❌     | Red                     | `Airtable fetch error: [Error]`                |
| Slug errors         | `'error'`      | ❌     | Red                     | `Could not build slug: { recordId: "rec123" }` |

## Visual Output Example

When running with `DEBUG=true`:

```
• Projects: cached

🗄️ Work:
↻ refresh
  ❌ Could not build slug: { recordId: "rec123" }

🗄️ BlogPosts:
↻ refresh
```

## Testing Styles

Preview all styles in action:

```bash
DEBUG=true node test/airtable-styles-preview.js
```

## Color Palette

- **Teal (#0A9396)** - Airtable message prefix / table label
- **Warm orange (#CA6702)** - Cache + refresh indicators
- **Red (#EF4444)** - Errors (auto-detected from Error objects)

## Benefits

✅ **Visual Scanning** - Quickly identify operation types in logs
✅ **Debug Efficiency** - Color-coded operations reduce cognitive load
✅ **Pattern Recognition** - Spot unusual patterns (too many refreshes, cache misses)
✅ **Operation Flow** - Understand data pipeline at a glance
