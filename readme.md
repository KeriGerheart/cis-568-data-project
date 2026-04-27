# Energy Production Explorer Project

An interactive web-based data visualization that explores how energy production evolves over time across countries and energy sources.

---

## How to run

### Option 1 — Local
1. Download or clone this repository
2. Open `index.html` in a web browser

### Option 2 — Online
View the live project [on github pages](https://kerigerheart.github.io/cis-568-data-project/)

---

## How to use

- Select a country to view its energy production trends
- Use the year range slider to filter the time period
- Select an energy source to compare across countries
- Hover over charts to view exact values in tooltips

All visualizations are **linked** and update together based user selections in the top control area.

---

## Visualization explanation

This project uses three coordinated visualizations:

### Chart 1 — Energy Production by Source (Line Chart)
- Displays energy production over time for a selected country  
- X-axis: Year  
- Y-axis: Energy production (TWh)  
- Each line represents a different energy source  
- Supports trend analysis over time

---

### Chart 2 — Country Comparison (Multi-line Chart)
- Compares multiple countries for a selected energy source  
- X-axis: Year  
- Y-axis: Energy production (TWh)  
- Each line represents a country  
- Supports cross-country comparison

---

### Chart 3 — Energy Mix Summary (Bar Chart)
- Shows average energy production by source for the selected country and time range  
- X-axis: Energy source  
- Y-axis: Average production (TWh)  
- Supports composition and comparison

---

## Interaction design

- **Linked views**: All charts update together
- **Range filtering**: Year slider filters all data
- **Tooltips**: Show precise values on hover
- **Crosshair guide**: Highlights selected year in line charts
- **Dropdown controls**: Enable focused exploration

---

## Data source

- **Source:** Our World in Data  
- **Dataset:** [Global energy production by source and country](https://ourworldindata.org/grapher/electricity-prod-source-stacked)  
- Includes:
  - Country (Entity)
  - Year
  - Energy production by source (Solar, Wind, Hydropower, Oil, Gas, Coal)

---

## Technologies used

- D3.js (data visualization)
- noUiSlider (range slider)
- HTML, CSS, JavaScript

---

## Screenshot

![Visualization](screenshot.png)

---

## Notes / Future improvements

- Normalize values (e.g., percentage of total energy globally)
- Increase number of countries shown while keeping the UI clean
- Enhance accessibility (keyboard navigation, ARIA labels)