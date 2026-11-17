const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, 'data');
const jpl = JSON.parse(fs.readFileSync(path.join(dataDir, 'jpl_data.json'), 'utf8'));
const stations = JSON.parse(fs.readFileSync(path.join(dataDir, 'stations_data.json'), 'utf8'));
const restHouses = JSON.parse(fs.readFileSync(path.join(dataDir, 'rest_houses_data.json'), 'utf8'));
const railwayLines = JSON.parse(fs.readFileSync(path.join(dataDir, 'railway_lines.json'), 'utf8'));

const bundleContent = `// Auto-generated data bundle for offline file:// and web access
window.KAI_DATA = {
  jpl: ${JSON.stringify(jpl)},
  stations: ${JSON.stringify(stations)},
  restHouses: ${JSON.stringify(restHouses)},
  railwayLines: ${JSON.stringify(railwayLines)}
};
console.log("KAI Data Bundle loaded successfully:", {
  jplCount: window.KAI_DATA.jpl.length,
  stationsCount: window.KAI_DATA.stations.length,
  restHousesCount: window.KAI_DATA.restHouses.length,
  railLinesCount: window.KAI_DATA.railwayLines.features.length
});
`;

fs.writeFileSync(path.join(dataDir, 'data_bundle.js'), bundleContent, 'utf8');
console.log("Created data/data_bundle.js successfully!");
