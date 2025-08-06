# Badge Usage in Grid Component

The grid component now supports displaying values as colored badges based on conditions. This is useful for showing status, capacity levels, or any other conditional information.

## Setup

### 1. Import Required Dependencies

```typescript
import { ColumnTypeEnum } from '../../../shared/enums/column.type.enum';
import { BadgeHelper } from '../../../shared/helpers/badge.helper';
import { TranslateService } from '@ngx-translate/core';
```

### 2. Add Badge Column Configuration

```typescript
// In your component class
private translate = inject(TranslateService);

columns: GridColumn[] = [
  // ... other columns
  
  // Example 1: Capacity Status Badge
  { 
    field: 'capacityStatus', 
    title: this.translate.instant('groups.list.capacityStatus'), 
    columnType: ColumnTypeEnum.badge, 
    sortable: false, 
    filterType: ColumnFilterTypeEnum.text,
    badgeConfig: BadgeHelper.createCapacityBadge(this.translate, 'capacity', 'numberOfStudents')
  },
  
  // Example 2: Status Badge (if model has isActive property)
  { 
    field: 'status', 
    title: this.translate.instant('shared.fields.status'), 
    columnType: ColumnTypeEnum.badge, 
    sortable: false, 
    filterType: ColumnFilterTypeEnum.text,
    badgeConfig: BadgeHelper.createStatusBadge(this.translate, 'isActive')
  },
  
  // Example 3: Custom Badge
  { 
    field: 'customStatus', 
    title: this.translate.instant('custom.status'), 
    columnType: ColumnTypeEnum.badge, 
    sortable: false, 
    filterType: ColumnFilterTypeEnum.text,
    badgeConfig: BadgeHelper.createCustomBadge(
      this.translate,
      (item: any) => {
        // Custom logic to determine display value
        return item.someField > 10 ? 'High' : 'Low';
      },
      (item: any) => {
        // Custom logic to determine color
        return item.someField > 10 ? '#28a745' : '#dc3545';
      },
      (item: any) => {
        // Optional: Custom CSS classes
        return 'text-white';
      }
    )
  }
];
```

## Available Helper Functions

### 1. `BadgeHelper.createCapacityBadge()`

Creates a badge that shows capacity status based on percentage.

**Parameters:**
- `translate`: TranslateService instance
- `capacityField`: Field name for capacity (default: 'capacity')
- `currentField`: Field name for current count (default: 'numberOfStudents')

**Colors:**
- Red (#dc3545): ≥90% full
- Orange (#fd7e14): ≥70% full
- Yellow (#ffc107): ≥50% full
- Green (#28a745): <50% full

### 2. `BadgeHelper.createStatusBadge()`

Creates a badge that shows active/inactive status.

**Parameters:**
- `translate`: TranslateService instance
- `statusField`: Field name for status (default: 'isActive')

**Colors:**
- Green (#28a745): Active
- Gray (#6c757d): Inactive

### 3. `BadgeHelper.createCustomBadge()`

Creates a completely custom badge configuration.

**Parameters:**
- `translate`: TranslateService instance
- `getValueFn`: Function to get the display value
- `getColorFn`: Function to get the background color
- `getClassFn`: Optional function to get CSS classes

## Translation Keys

Add these keys to your translation files:

### Arabic (ar.json)
```json
{
  "shared": {
    "badges": {
      "full": "ممتلئة",
      "almostFull": "شبه ممتلئة",
      "halfFull": "نصف ممتلئة",
      "available": "متاحة",
      "active": "نشط",
      "inactive": "غير نشط"
    }
  }
}
```

### English (en.json)
```json
{
  "shared": {
    "badges": {
      "full": "Full",
      "almostFull": "Almost Full",
      "halfFull": "Half Full",
      "available": "Available",
      "active": "Active",
      "inactive": "Inactive"
    }
  }
}
```

## Styling

The badges are styled with the following CSS classes:

```scss
.badge {
    padding: 0.375rem 0.75rem;
    font-size: 0.875rem;
    font-weight: 500;
    border-radius: 0.375rem;
    display: inline-block;
    text-align: center;
    min-width: 80px;
}
```

## Examples

### Example 1: Group Capacity Status
```typescript
// Shows capacity status based on numberOfStudents vs capacity
badgeConfig: BadgeHelper.createCapacityBadge(this.translate, 'capacity', 'numberOfStudents')
```

### Example 2: User Status
```typescript
// Shows active/inactive status
badgeConfig: BadgeHelper.createStatusBadge(this.translate, 'isActive')
```

### Example 3: Custom Priority Badge
```typescript
badgeConfig: BadgeHelper.createCustomBadge(
  this.translate,
  (item: any) => {
    if (item.priority === 'high') return this.translate.instant('priority.high');
    if (item.priority === 'medium') return this.translate.instant('priority.medium');
    return this.translate.instant('priority.low');
  },
  (item: any) => {
    if (item.priority === 'high') return '#dc3545';
    if (item.priority === 'medium') return '#ffc107';
    return '#28a745';
  }
)
```

## Notes

- Badge columns are not sortable by default
- The badge configuration functions receive the entire item object, so you can access any property
- Colors can be hex codes, RGB values, or CSS color names
- The `getClass` function is optional and can be used to add additional CSS classes 