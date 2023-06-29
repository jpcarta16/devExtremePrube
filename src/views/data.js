export const complaintsData = [
    { complaint: 'Cold pizza', count: 780 },
    { complaint: 'Not enough cheese', count: 120 },
    { complaint: 'Underbaked or Overbaked', count: 52 },
    { complaint: 'Delayed delivery', count: 1123 },
    { complaint: 'Damaged pizza', count: 321 },
    { complaint: 'Incorrect billing', count: 89 },
    { complaint: 'Wrong size delivered', count: 222 },
  ];

  export const areas = [{
    country: 'Russia',
    area: 12,
  }, {
    country: 'Canada',
    area: 7,
  }, {
    country: 'USA',
    area: 7,
  }, {
    country: 'China',
    area: 7,
  }, {
    country: 'Brazil',
    area: 6,
  }, {
    country: 'Australia',
    area: 5,
  }, {
    country: 'India',
    area: 2,
  }, {
    country: 'Others',
    area: 55,
  }];

  export const BeesArray = [
    {
      plane: {
        x0: 0,
        y0: 0,
        xe: 800, // Obligatorio
        ye: 600, // Obligatorio
      },
      bee1: {
        step: 3,
        start: [10, 10],
        paths: [
          { xMov: 40 },
          { yMov: 90 },
          { xMov: 40 },
        ],
      },
      bee2: {
        step: 3,
        start: [50, 15],
        paths: [
          { xMov: 20 },
          { yMov: 50 },
        ],
      },
      bee3: {
        step: 3,
        start: [225, 600],
        paths: [
          { yMov: 50 },
          { xMov: 90 },
          { yMov: 50 },
        ],
      },
      bee4: {
        step: 3,
        start: [100, 500],
        paths: [
          { yMov: 100 },
          { xMov: 90 },
          { yMov: 40 },
          { xMov: 30 },
        ],
      },
      bee5: {
        step: 3,
        start: [300, 400],
        paths: [
          { xMov: 120 },
          { yMov: 190 },
        ],
      },
    },
  ];
  