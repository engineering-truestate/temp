const withMT = require("@material-tailwind/react/utils/withMT");
const { min } = require("date-fns");

/** @type {import('tailwindcss').Config} */
module.exports = withMT({
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@material-tailwind/react/components/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@material-tailwind/react/theme/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "custom-color1": "#032E2C",
        "custom-color2": "#011A19",
        "custom-color3": "#FFCC84",
        "custom-color4": "#D67D00",
        "vault-start": "#FFEFCD",
        "vault-end": "#FAFBFC",
        AthensGrey: 'rgba(243,244,246,1)',
        GreenBlack: 'rgba(30,37,33,1)',
        DefaultWhite: 'rgba(255,255,255,1)',
        GableGreen: 'rgba(21,62,59,1)',
        ShadedGrey: 'rgba(37,34,30,0.66)',
        ShadedWhite: 'rgba(209,209,209,1)',
        RegentGray: 'rgba(143,153,168,1)',
        FlouresenceGreen: 'rgba(250,255,255,1)',
        background:'#fafafa',
        AquamarineBlue: 'rgba(106,226,197,1)',
        DarkGreen: 'rgba(23,131,123,1)',
        White0_2: 'rgba(255,255,255,0)',
        Anzac: 'rgba(230,180,79,1)',
      },
      backgroundImage: {
        "custom-gradient": "linear-gradient(to bottom, #032E2C, #011A19)",
        "radial-gradient": "radial-gradient(circle, var(--tw-gradient-stops))",
        "vault-gradient": "linear-gradient(to bottom, #FFEFCD, #FAFBFC)",
        'linear3': 'linear-gradient(90deg, #00201E 0%, #153E3B 100%)',
        'linear4': 'linear-gradient(66deg, #2B896C 6%,#042D2B  82%)',
        'linear5': 'linear-gradient(180deg, #032E2C 0%, #011A19  100%)',
        'linear6': 'radial-gradient(circle, white 40%, #faffff 100$)', // Create radial gradient for mobile view navbar
      },
      fontFamily: {
        noticiaText: ["Noticia Text", "sans-serif"],
        montserrat: ["Montserrat", "sans-serif"],
        lato: ["Lato", "sans-serif"],
        'body': ['Lato', 'sans-serif'],
        'heading': ['Lora', 'serif'],
        'subheading': ['Montserrat', 'sans-serif'],
        'home': ['Lato', 'sans-serif'],
      },
      fontSize: {'xsm': '10px',

          // Display Styles
          'display-xxxs': ['20px', { lineHeight: '1.5', letterSpacing: '0', fontWeight: '700' }],
          'display-xxs': ['24px', { lineHeight: '1.5', letterSpacing: '0', fontWeight: '700' }],
          'display-xs': ['28px', { lineHeight: '1.5', letterSpacing: '0', fontWeight: '700' }],
          'display-sm': ['36px', { lineHeight: '1.3', letterSpacing: '0', fontWeight: '700' }],
          'display-md': ['44px', { lineHeight: '1.3', letterSpacing: '0', fontWeight: '700' }],
          'display-lg': ['56px', { lineHeight: '1.3', letterSpacing: '0', fontWeight: '700' }],

          // Heading Bold Styles
          'heading-bold-xxxxs': ['10px', { lineHeight: '1.2', letterSpacing: '0', fontWeight: '700' }],
          'heading-bold-xxxs': ['12px', { lineHeight: '1.2', letterSpacing: '0', fontWeight: '700' }],
          'heading-bold-xxs': ['14px', { lineHeight: '1.2', letterSpacing: '0', fontWeight: '700' }],
          'heading-bold-xs': ['16px', { lineHeight: '1.2', letterSpacing: '0.25px', fontWeight: '700' }],
          'heading-bold-sm': ['18px', { lineHeight: '1.2', letterSpacing: '0', fontWeight: '700' }],
          'heading-bold-md2': ['22px', { lineHeight: '1.2', letterSpacing: '0', fontWeight: '700' }],
          'heading-bold-md': ['24px', { lineHeight: '1.2', letterSpacing: '0', fontWeight: '700' }],
          'heading-bold-lg': ['30px', { lineHeight: '1.2', letterSpacing: '0', fontWeight: '700' }],
          'heading-bold-xl': ['36px', { lineHeight: '1.2', letterSpacing: '0', fontWeight: '700' }],
          'heading-bold-xxl': ['45px', { lineHeight: '1.2', letterSpacing: '0', fontWeight: '700' }],

          // Heading Medium Styles
          'heading-medium-xxxxs': ['10px', { lineHeight: '1.2', letterSpacing: '0', fontWeight: '500' }],
          'heading-medium-xxxs': ['12px', { lineHeight: '1.2', letterSpacing: '0', fontWeight: '500' }],
          'heading-medium-xxs': ['14px', { lineHeight: '1.2', letterSpacing: '0', fontWeight: '500' }],
          'heading-medium-xs': ['16px', { lineHeight: '1.2', letterSpacing: '0', fontWeight: '500' }],
          'heading-medium-sm': ['18px', { lineHeight: '1.2', letterSpacing: '0', fontWeight: '500' }],
          'heading-medium-md': ['24px', { lineHeight: '1.2', letterSpacing: '0', fontWeight: '500' }],
          'heading-medium-lg': ['30px', { lineHeight: '1.2', letterSpacing: '0', fontWeight: '500' }],
          'heading-medium-xl': ['36px', { lineHeight: '1.2', letterSpacing: '0', fontWeight: '500' }],
          'heading-medium-xxl': ['45px', { lineHeight: '1.2', letterSpacing: '0', fontWeight: '500' }],

          // Heading Semi-Bold Styles
          'heading-semibold-xxxs': ['12px', { lineHeight: '1.2', letterSpacing: '0', fontWeight: '600' }],
          'heading-semibold-xxs': ['14px', { lineHeight: '1.2', letterSpacing: '0', fontWeight: '600' }],
          'heading-semibold-xs': ['16px', { lineHeight: '1.2', letterSpacing: '0.25px', fontWeight: '600' }],
          'heading-semibold-sm': ['18px', { lineHeight: '1.2', letterSpacing: '0', fontWeight: '600' }],
          'heading-semibold-md': ['24px', { lineHeight: '1.2', letterSpacing: '0', fontWeight: '600' }],
          'heading-semibold-lg': ['30px', { lineHeight: '1.2', letterSpacing: '0', fontWeight: '600' }],
          'heading-semibold-xl': ['36px', { lineHeight: '1.2', letterSpacing: '0', fontWeight: '600' }],
          'heading-semibold-xxl': ['45px', { lineHeight: '1.2', letterSpacing: '0', fontWeight: '600' }],

          // Paragraph Regular Styles
          'paragraph-xxxs': ['10px', { lineHeight: '1.5', letterSpacing: '0', fontWeight: '400' }],
          'paragraph-xxs': ['12px', { lineHeight: '1.5', letterSpacing: '0', fontWeight: '400' }],
          'paragraph-xs': ['14px', { lineHeight: '1.5', letterSpacing: '0', fontWeight: '400' }],
          'paragraph-sm': ['16px', { lineHeight: '1.5', letterSpacing: '0', fontWeight: '400' }],
          'paragraph-md': ['16px', { lineHeight: '1.5', letterSpacing: '0', fontWeight: '400' }],
          'paragraph-lg': ['18px', { lineHeight: '1.5', letterSpacing: '0', fontWeight: '400' }],
          'paragraph-xl': ['20px', { lineHeight: '1.5', letterSpacing: '0', fontWeight: '400' }],

          // Paragraph Bold Styles
          'paragraph-bold-xxs': ['10px', { lineHeight: '1.5', letterSpacing: '0', fontWeight: '700' }],
          'paragraph-bold-xs': ['12px', { lineHeight: '1.5', letterSpacing: '0', fontWeight: '700' }],
          'paragraph-bold-sm': ['14px', { lineHeight: '1.5', letterSpacing: '0', fontWeight: '700' }],
          'paragraph-bold-md': ['16px', { lineHeight: '1.5', letterSpacing: '0', fontWeight: '700' }],
          'paragraph-bold-lg': ['18px', { lineHeight: '1.5', letterSpacing: '0', fontWeight: '700' }],
          'paragraph-bold-xl': ['20px', { lineHeight: '1.5', letterSpacing: '0', fontWeight: '700' }],

          // Label Styles
          'label-xxxs': ['8px', { lineHeight: '1.2', letterSpacing: '0', fontWeight: '500' }],
          'label-xxs': ['10px', { lineHeight: '1.2', letterSpacing: '0', fontWeight: '500' }],
          'label-xs': ['12px', { lineHeight: '1.2', letterSpacing: '0', fontWeight: '500' }],
          'label-sm': ['14px', { lineHeight: '1.2', letterSpacing: '0', fontWeight: '500' }],
          'label-md': ['16px', { lineHeight: '1.2', letterSpacing: '0', fontWeight: '500' }],
          'label-lg': ['18px', { lineHeight: '1.2', letterSpacing: '0', fontWeight: '500' }],},

      lineHeight: {
        'large': '120%',
        'small': '150%',
      },

      padding: {
        '30': '7.5rem', 
        '22.5': '5.625rem', 
        '25':'100px',
      },

      backdropBlur: {
        'custom-blur': '8px', // Custom background blur
        'about-blur' : '3px'//for about us page
      },

      boxShadow: {
        'custom-shadow': '0 4px 4px rgba(0, 0, 0, 0.25)',
        'home-shadow': '0px 0px 25.7px rgba(21, 62, 59, 0.08)',
        'HowItWorks-shadow' : '0px 2px 13px -1px rgba(23, 131, 123, 0.4)',
        'insetGreen': 'inset 0 -21px 0 -1px rgba(21, 62, 59, 0.18)', //For hero page, overview section
        'insetWhite': 'inset 0 -21px 0 -1px rgba(226, 254, 252, 0.15)', //For hero page, working section
        'PerfectInvestment': '0px 0px 5px 2px rgba(223, 244, 243, 1)', //For hero page, working section

        'custom-career': '0px 0px 40px 0px rgba(0, 0, 0, 0.07)',
        'about-shadow': '0px 0px 25px 0px rgba(0, 0, 0, 0.04)',
        'about-team-shadow': '0px 0px 25.7px rgba(0,0,0,0.07)',
        'card-shadow': '0px 0px 4px 0px rgba(0, 0, 0, 0.08)', //For academy cards
        'card-shadow-hover': '0px 0px 12px 0px rgba(0, 0, 0, 0.1)', //for hover on academy cards
      },

      container: {
        center: true,
        
      },

      maxWidth: {
        '8xl': '90rem',
        '9xl': '100rem',
        '10xl': '110rem',
        '1440': '1440px',
      },

      screens: {
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1440px',
        sl: {min:"424px",max:"767px"},
        sr:{min:"374px",max:"423px"},
        vs:{min:"319px",max:"374px"},
        pr: { min: "601px", max: "900px" },
        ld: { min: "901px", max: "1279px" },
      },

      opacity: {
        '10': '0.10',
        '22': '0.22',
        '78': '0.78',
        '90': '0.90',
      },

      textShadow: {
        'sm': '1px 1px 2px rgba(0, 0, 0, 0.25)',
        'md': '2px 2px 4px rgba(0, 0, 0, 0.25)',
        'lg': '3px 3px 6px rgba(0, 0, 0, 0.3)',
        'xl': '4px 4px 8px rgba(0, 0, 0, 0.35)',
        'none': 'none',
      },
    },
  },
  plugins: [
    // require("tailwindcss-inner-border"),
  ],
});
