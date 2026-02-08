# 📍 New Routes & URLs Reference

## Admin Routes (Protected)

### Category Tree Management
**URL:** `/admin/categories-tree`
**Purpose:** Create, edit, delete, and manage unlimited nested categories
**Features:**
- Visual tree with expand/collapse
- Inline actions (create child, edit, delete)
- Drag to reorder (future)
- Real-time updates

### Validation Tools
**URL:** `/admin/validation`
**Purpose:** Run data integrity checks and view statistics
**Features:**
- Orphaned category detection
- Circular reference detection
- Path consistency validation
- Category statistics dashboard

### Legacy Admin (Still Active)
- `/admin/subjects` - Old subject management
- `/admin/categories` - Old category management
- `/admin/notes` - Note management (may need V2 update)

---

## User Routes (Public to Authenticated)

### Graph Navigation - Root View
**URL:** `/graph`
**Purpose:** Interactive graph view of all root categories
**Features:**
- Radial layout of root categories
- Click to navigate deeper
- Zoom/pan controls
- Mini-map

### Graph Navigation - Focused View
**URL:** `/graph/:categoryId`
**Purpose:** Interactive graph focused on a specific category
**Features:**
- Selected category in center
- Children arranged in circle
- Click category nodes to navigate
- Click note nodes to view content
- Breadcrumb navigation back

### Home Page (Updated)
**URL:** `/`
**Features:**
- Added "Graph View" button in hero section
- Links to `/graph` for graph navigation
- Original grid layout preserved

### Legacy Routes (Still Active)
- `/subjects` - Old subject list
- `/category/:id` - Old category view
- `/note/:id` - Note content view (works with V2)
- `/dashboard` - Progress dashboard
- `/review` - Flashcard review

---

## API Endpoints (Firestore)

### Collections

#### `categories` (V2 Unified)
**Structure:**
```
{
  parentId: string | null,
  name: string,
  description?: string,
  icon?: string,
  color?: string,
  isLeaf: boolean,
  order: number,
  depth: number,
  path: string[],
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

**Queries:**
- Get by parentId: `where('parentId', '==', parentId)`
- Get by depth: `where('depth', '==', level)`
- Get leafs: `where('isLeaf', '==', true)`

**Indexes:**
- `(parentId ASC, order ASC)` - For efficient child queries

#### `notes` (V2 Compatible)
**Structure:**
```
{
  categoryId: string,
  title: string,
  content: string,
  path: string[],
  // ... other fields
}
```

**Queries:**
- Get by category: `where('categoryId', '==', categoryId)`
- Get by path: `where('path', 'array-contains', categoryId)`

---

## Component Usage

### Import Paths

```typescript
// Hooks
import { useCategoriesV2, useCategoryV2 } from '@/hooks/useCategoriesV2'
import { useCategoryTree } from '@/hooks/useCategoryTree'
import { useCategoryPath, useCategoryBreadcrumbs } from '@/hooks/useCategoryPath'
import { useNotesV2, useNoteV2 } from '@/hooks/useNotesV2'
import { useRadialLayout } from '@/hooks/useRadialLayout'
import { useGraphNavigation } from '@/hooks/useGraphNavigation'

// Components
import { CategoryTreeView } from '@/components/CategoryTreeView'
import { CategoryFormModal } from '@/components/CategoryFormModal'
import { CategorySelector } from '@/components/CategorySelector'
import { CategoryBreadcrumb } from '@/components/CategoryBreadcrumb'
import { CategoryGraphView } from '@/components/graph/CategoryGraphView'

// Admin Functions
import {
  createCategoryV2,
  updateCategoryV2,
  deleteCategoryV2,
  getCategoryById,
  getCategoryChildren,
  getCategoryDescendants,
  getCategoryAncestors,
  canDeleteCategory,
} from '@/lib/admin'

// Validation
import {
  runAllValidations,
  findOrphanedCategories,
  detectCircularReferences,
  validateCategoryPaths,
  findExcessiveDepth,
  getCategoryStatistics,
} from '@/lib/validation'
```

---

## Quick Navigation Map

```
Root (/)
  │
  ├─ Graph View (/graph)
  │   └─ Category Graph (/graph/:id)
  │       └─ Note View (/note/:id)
  │
  ├─ Subjects (/subjects) [Legacy]
  │   └─ Category (/category/:id) [Legacy]
  │       └─ Note View (/note/:id)
  │
  ├─ Dashboard (/dashboard)
  │
  ├─ Review (/review)
  │
  └─ Admin (/admin)
      ├─ Subjects (/admin/subjects) [Legacy]
      ├─ Categories (/admin/categories) [Legacy]
      ├─ Categories Tree (/admin/categories-tree) [V2]
      ├─ Notes (/admin/notes)
      └─ Validation (/admin/validation) [V2]
```

---

## Testing URLs

### Development
```
http://localhost:5173/
http://localhost:5173/graph
http://localhost:5173/admin/categories-tree
http://localhost:5173/admin/validation
```

### Production (Update with your domain)
```
https://yourdomain.com/
https://yourdomain.com/graph
https://yourdomain.com/admin/categories-tree
https://yourdomain.com/admin/validation
```

---

## Keyboard Shortcuts (Future Enhancement)

Planned shortcuts:
- `Ctrl/Cmd + K` - Quick search
- `Ctrl/Cmd + N` - New category
- `Ctrl/Cmd + E` - Edit category
- `Escape` - Close modal
- `Arrow keys` - Navigate graph
- `+/-` - Zoom in/out
- `Space` - Center view

---

## URL Parameters

### Graph View
- `?focus=true` - Auto-fit to view (future)
- `?layout=radial|tree|force` - Layout type (future)
- `?depth=3` - Show only 3 levels (future)

### Admin
- `?parent=categoryId` - Pre-select parent (future)
- `?edit=categoryId` - Open edit modal (future)

---

## Deep Linking Examples

### Direct to Specific Category Graph
```
/graph/abc123def456
```

### Direct to Edit Modal (Future)
```
/admin/categories-tree?edit=abc123def456
```

### Direct to Create with Parent (Future)
```
/admin/categories-tree?parent=abc123def456&action=create
```

---

## Mobile-Friendly URLs

All routes are mobile-responsive:
- Touch gestures on graph
- Responsive tree view
- Mobile-optimized forms

---

## SEO-Friendly URLs (Future)

Consider implementing slug-based URLs:
```
/learn/programming/frontend/react
```

Instead of:
```
/graph/abc123def456
```

This requires:
- Add `slug` field to categories
- URL routing update
- Breadcrumb slug resolution

---

## API Rate Limits

Firestore limits:
- **Reads:** 50,000/day (free tier)
- **Writes:** 20,000/day (free tier)
- **Deletes:** 20,000/day (free tier)

For high-traffic apps:
- Enable caching
- Use pagination
- Implement lazy loading

---

## Analytics Tracking (Optional)

Track these events:
```typescript
// Navigation
analytics.logEvent('graph_view', { categoryId })
analytics.logEvent('category_click', { categoryId, depth })
analytics.logEvent('note_click', { noteId })

// Admin
analytics.logEvent('category_create', { depth, isLeaf })
analytics.logEvent('category_edit', { categoryId })
analytics.logEvent('category_delete', { cascade: boolean })

// Validation
analytics.logEvent('validation_run', { hasIssues: boolean })
```

---

## Quick Links

- **Documentation:** See `README_V2_SYSTEM.md`
- **Getting Started:** See `START_HERE.md`
- **Testing:** See `TESTING_CHECKLIST.md`
- **Deployment:** See `DEPLOYMENT_GUIDE.md`

---

**Last Updated:** February 2026
**Version:** 2.0.0
**Status:** Production Ready
