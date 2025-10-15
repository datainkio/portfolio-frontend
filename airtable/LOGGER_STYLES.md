# Airtable Logger Styles Reference

Custom logger styles for visual debugging of Airtable operations.

## Style Definitions

```javascript
// In airtable/fetchAirtableData.js
import logger, { LoggerStyle } from '../js/utils/logger/index.js';

const airtableStyle = new LoggerStyle('#F97316', '🗄️'); // Orange - Database ops
const cachingStyle = new LoggerStyle('#8B5CF6', '💾'); // Purple - Cache ops
const processingStyle = new LoggerStyle('#06B6D4', '⚙️'); // Cyan - Processing
```

## Usage Mapping

| Operation           | Style             | Prefix | Color  | Example                                         |
| ------------------- | ----------------- | ------ | ------ | ----------------------------------------------- |
| Force refresh table | `airtableStyle`   | 🗄️     | Orange | `Force refreshing table: { table: "Projects" }` |
| Cache expired       | `airtableStyle`   | 🗄️     | Orange | `Cache expired, refreshing: { table: "Work" }`  |
| Using cache         | `cachingStyle`    | 💾     | Purple | `Using cached data: { table: "Projects" }`      |
| Data cached         | `cachingStyle`    | 💾     | Purple | `Data cached successfully: { records: 30 }`     |
| Processing records  | `processingStyle` | ⚙️     | Cyan   | `Processing records: { count: 10 }`             |
| Errors              | Auto-detected     | ❌     | Red    | `Airtable fetch error: [Error]`                 |
| Slug errors         | `'error'`         | ❌     | Red    | `Could not build slug: { recordId: "rec123" }`  |

## Visual Output Example

When running with `DEBUG=true`:

```
💾 Using cached data: { table: "Projects" }

🗄️ Cache expired, refreshing: { table: "Work" }
  ⚙️ Processing records: { table: "Work", count: 5 }
  ⚙️ Processing records: { table: "Work", count: 10 }
  ❌ Could not build slug: { recordId: "rec123" }
  ⚙️ Processing records: { table: "Work", count: 15 }
💾 Data cached successfully: { table: "Work", records: 15 }

🗄️ Force refreshing table: { table: "BlogPosts", reason: "FORCE_REFRESH=true" }
  ⚙️ Processing records: { table: "BlogPosts", count: 25 }
💾 Data cached successfully: { table: "BlogPosts", records: 25 }
```

## Testing Styles

Preview all styles in action:

```bash
DEBUG=true node test/airtable-styles-preview.js
```

## Color Palette

- **Orange (#F97316)** - Airtable database operations (fetch, refresh)
- **Purple (#8B5CF6)** - Cache operations (read, write, validate)
- **Cyan (#06B6D4)** - Processing operations (records, fields, files)
- **Red (#EF4444)** - Errors (auto-detected from Error objects)

## Benefits

✅ **Visual Scanning** - Quickly identify operation types in logs
✅ **Debug Efficiency** - Color-coded operations reduce cognitive load
✅ **Pattern Recognition** - Spot unusual patterns (too many refreshes, cache misses)
✅ **Operation Flow** - Understand data pipeline at a glance
