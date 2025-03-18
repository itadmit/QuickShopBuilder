#!/bin/bash

# יצירת תיקיית הפרויקט הראשית
# יצירת תיקיות הפרויקט
mkdir -p src/components/editor
mkdir -p src/components/sections
mkdir -p src/contexts
mkdir -p src/hooks
mkdir -p src/styles
mkdir -p src/mock-data
mkdir -p public/images/placeholders

# יצירת קבצי קונטקסט
touch src/contexts/EditorContext.jsx

# יצירת קבצי ריאקט עבור העורך
touch src/components/editor/Editor.jsx
touch src/components/editor/Sidebar.jsx
touch src/components/editor/Canvas.jsx
touch src/components/editor/PropertyPanel.jsx
touch src/components/editor/Toolbar.jsx

# יצירת קבצי בקרה
mkdir -p src/components/editor/controls
touch src/components/editor/controls/ColorPicker.jsx
touch src/components/editor/controls/ImagePicker.jsx
touch src/components/editor/controls/RangeSlider.jsx
touch src/components/editor/controls/SelectControl.jsx
touch src/components/editor/controls/SwitchControl.jsx

# יצירת סקשנים
touch src/components/sections/HeroSection.jsx
touch src/components/sections/ProductsSection.jsx
touch src/components/sections/BannerSection.jsx
touch src/components/sections/TextWithImageSection.jsx
touch src/components/sections/TestimonialsSection.jsx
touch src/components/sections/CollectionListSection.jsx
touch src/components/sections/NewsletterSection.jsx

# יצירת קבצי סגנונות
touch src/styles/editor.css

# יצירת קבצי מוק
touch src/mock-data/sections.json
touch src/mock-data/products.json
touch src/mock-data/collections.json

# יצירת קבצים נוספים
touch src/components/editor/ProductSelector.jsx

echo "מבנה התיקיות והקבצים נוצר בהצלחה!"