export interface SampleStory {
  id: string;
  badge: string;
  title: string;
  url: string;
  previewText: string;
  fullStory: string;
  suggestedStyle: string;
  suggestedMood: string;
}

export const SAMPLE_STORIES: SampleStory[] = [
  {
    id: 'deep-space',
    badge: 'Space Science',
    title: 'James Webb Telescope Spots Atmosphere on Super-Earth K2-18b',
    url: 'https://science.nasa.gov/missions/webb/atmosphere-detected-on-habitable-zone-exoplanet',
    previewText: 'Astronomers detect carbon molecules and potential signs of biological processes...',
    fullStory: `Astronomers analyzing spectroscopic transmission data from the James Webb Space Telescope have identified carbon-bearing molecules, including methane and carbon dioxide, in the atmosphere of exoplanet K2-18b.

K2-18b is a sub-Neptune exoplanet 8.6 times the mass of Earth, located approximately 120 light-years away in the constellation Leo. It orbits within the habitable zone of its cool red dwarf star. The atmospheric data suggests K2-18b may possess a hydrogen-rich atmosphere over a water ocean surface, classifying it as a candidate Hycean world.

Remarkably, the spectrum also revealed weak traces of dimethyl sulfide (DMS). On Earth, DMS is almost exclusively produced by living organisms—primarily marine phytoplankton. While scientists urge caution until further observational confirmation is completed, this marks the most promising chemical biosignature ever recorded outside our solar system.`,
    suggestedStyle: 'Documentary',
    suggestedMood: 'Mysterious',
  },
  {
    id: 'ai-energy',
    badge: 'Tech Breakthrough',
    title: 'Superconducting Material Discovery Speeds Up Clean Fusion Power',
    url: 'https://nature.com/articles/high-temperature-superconductors-fusion-breakthrough',
    previewText: 'New room-pressure magnetic coils reach 20 Tesla, compressing plasma stability...',
    fullStory: `A consortium of nuclear physicists and robotics engineers have demonstrated a compact magnetic confinement reactor running stabilized plasma at 100 million degrees Celsius for over 18 minutes.

By employing high-temperature rare-earth barium copper oxide (REBCO) superconducting tape wound by specialized autonomous micro-actuators, researchers achieved magnetic field strengths surpassing 20 Tesla in a vessel one-fifth the size of traditional tokamaks.

This leap in magnetic density solves the catastrophic heat flux problem that previously melted divertor tiles. Commercial grid connection pilots are now slated for 2028, potentially providing virtually limitless carbon-free base-load electricity without long-lived radioactive waste.`,
    suggestedStyle: 'Investigative',
    suggestedMood: 'Dramatic',
  },
  {
    id: 'ancient-ruins',
    badge: 'Archaeology Mystery',
    title: 'LiDAR Scans Uncover Lost Megacity Hidden Under Amazon Rainforest',
    url: 'https://archaeology.org/news/amazon-lidar-survey-reveals-hidden-urbanism',
    previewText: 'Advanced laser airborne sensors pierce the dense canopy to expose vast canals...',
    fullStory: `Airborne LiDAR scanning over the Upano Valley in eastern Ecuador has revealed an enormous network of interconnected settlements dating back over 2,500 years.

The laser pulses penetrated thick jungle foliage to map more than 6,000 earthen mounds arranged around central plazas, linked by sunken roads stretching over tens of kilometers. Agricultural field terraces, drainage canals, and defensive ditches indicate an advanced society numbering between 30,000 and 100,000 inhabitants.

Archaeologists note this discovery fundamentally disproves long-standing assumptions that the Amazon was only inhabited by small nomadic hunter-gatherer tribes prior to European contact, proving instead that intricate agrarian urbanism flourished here alongside ancient Rome and Classical Greece.`,
    suggestedStyle: 'Storytelling',
    suggestedMood: 'Suspenseful',
  },
];
