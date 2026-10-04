export const temple = {
  name: "Watford Velmurugan Hindu Temple",
  shortName: "Watford Velmurugan Hindu Temple",
  locationNote: "Former Beechwood Family Centre",
  address: "453 St Albans Road, Watford, WD24 7RZ",
  phone: "01923 229564",
  mobile: "+44 7590 908756",
  email: "temple@watfordvelmurugan.org",
  charityNumber: "1174203",
  trustName: "Watford Velmurugan Trust (WVMT UK)",
  hours: {
    morning: "Morning - 10am to 2pm",
    evening: "Evening - 5pm to 9pm",
    note: "Open daily. Closed between 2pm and 5pm.",
  },
  social: {
    facebook: "https://facebook.com/watfordvelmurugan",
    instagram: "https://instagram.com/watford_velmurugan_temple",
    youtube: "https://www.youtube.com/channel/UCru1bKwe3nXbz-lE2-POTbg",
  },
  bank: {
    accountName: "Watford Velmurugan Trust (WVMT UK)",
    bankName: "HSBC PLC",
    accountNumber: "21480510",
    sortCode: "40-13-33",
  },
};

export const landAppeal = {
  url: "https://www.zeffy.com/en-GB/donation-form/help-save-watford-velmurugan-hindu-temple",
  shortText: "Help secure a permanent home for our temple",
  title: "Help secure a permanent home for our temple",
  text: "Help us secure a permanent home for Watford Velmurugan Hindu Temple. The temple site is now available for purchase, and we must raise the necessary funds to secure the place. Your support can help create a lasting place for worship, culture and community for generations to come.",
  goal: "£1.8 million fundraising goal",
  note: "Every contribution counts. Donate, support and share today.",
};

export const landAppealUrl = landAppeal.url;

// "Register as a devotee" campaign: footprint data for Watford Council to show the need to
// save the temple. Shown on the home page. Set url to '' to hide it when the campaign ends.
export const devoteeRegistration = {
  url: "/register",
  title: "Get Involved",
  text: "We would like you to register your interest with the temple to keep up to date with happenings in our temple community.",
  note: "Would you like to stay connected with the temple and receive news, festival updates, or event details? If yes, please register.",
};

export const executiveCommittee = [
  { role: "Chairman", name: "Dharmarajen Vencataswamy" },
  {
    role: "Vice Chairman",
    name: "Senthuren Sathiyabalasingam",
  },
  { role: "Secretary", name: "Nisanthan Shanmugaratnam" },
  { role: "Assistant Secretary", name: "Vinusha Ravanam" },
  { role: "Treasurer", name: "Vimalaraj Markandu" },
  { role: "Assistant Treasurer", name: "Shanmugapriya Sureshkumar" },
];

export const committeeMembers = [
  "Imaiyaal Pugalenthy",
  "Shanthini Shiva",
  "Dilleswari Srinivas",
  "Leela Srinivas Yadavalli",
  "Pathick Shah",
];

export const boardOfTrustees = [
  "Dharmarajen Vencataswamy",
  "Senthuren Sathiyabalasingam",
  "Nisanthan Shanmugaratnam",
  "Vimalaraj Markandu",
  "Vinusha Ravanam",
];

export const nav = [
  { label: "Home", to: "/" },
  { label: "Our Story", to: "/about-us" },
  { label: "Committee", to: "/committee" },
  { label: "Register", to: "/register" },
  { label: "Consent", to: "/consent" },
  { label: "Donate", to: "/donate" },
  { label: "Contact Us", to: "/contact-us" },
];
