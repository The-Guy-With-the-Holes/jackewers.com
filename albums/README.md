# Photo Albums - Optimized System

## Features

✅ **JSON-driven** - All albums configured in one file  
✅ **Pagination** - Loads 24 photos at a time with "Load More" button  
✅ **Lazy loading** - Images load only when scrolling into view  
✅ **Performance optimized** - Handles thousands of photos efficiently  
✅ **Expandable dialogs** - Click album → View all photos → Click photo for lightbox  
✅ **Keyboard navigation** - Arrow keys in lightbox, Escape to close  
✅ **Fallback support** - Works even if JSON fails to load  

## How to Add a New Album

### 1. Add your photos to the media server

Upload your photos to: `https://media.bloodweb.net/jackewers/images/carousel/[album-name]/`

### 2. Edit `albums.json`

Add a new entry to the `albums` array:

```json
{
  "id": "app2025",
  "name": "APP 2025",
  "description": "Conference highlights from APP 2025",
  "coverImage": "app2025_0.webp",
  "photoCount": 45,
  "basePath": "https://media.bloodweb.net/jackewers/images/carousel/app2025/",
  "photos": [
    "app2025_0.webp",
    "app2025_1.webp",
    "app2025_2.webp",
    ...
    "app2025_44.webp"
  ]
}
```

### 3. That's it!

The page will automatically:
- Generate the album card
- Create the carousel preview
- Set up pagination in the dialog
- Enable lazy loading for all images

## JSON Schema

```typescript
{
  "albums": [
    {
      "id": string,              // Unique identifier (lowercase, no spaces)
      "name": string,             // Display name
      "description"?: string,     // Optional description
      "coverImage": string,       // Filename for thumbnail (optional, uses first photo)
      "photoCount": number,       // Total number of photos
      "basePath": string,         // Base URL for all photos in this album
      "photos": string[]          // Array of photo filenames
    }
  ]
}
```

## Configuration

Edit these constants in `index.html` to customize behavior:

```javascript
const PHOTOS_PER_PAGE = 24;      // How many photos to load per batch
const CAROUSEL_INTERVAL = 5000;  // Auto-advance interval (milliseconds)
```

## Performance Notes

- **Small albums (< 24 photos)**: All load immediately
- **Large albums (> 24 photos)**: Load 24 at a time with "Load More" button
- **Lazy loading**: Images only load when visible (50px margin)
- **Fallback**: Hardcoded data used if JSON fails to load

## Future Enhancements

Consider adding:
- Thumbnail generation (smaller preview images for faster loading)
- Album grouping by year/event
- Search/filter functionality
- Image metadata (dates, locations, captions)
- Download album as ZIP
