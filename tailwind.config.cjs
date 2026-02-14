module.exports = {
  content: [
    './index.html',
    './js/**/*.js'
  ],
  theme: {
    extend: {
      colors: {
        'deep-charcoal': '#1a1a1a',
        'vibrant-crimson': '#dc2626',
        'crimson-hover': '#b91c1c',
        'soft-gray': '#9ca3af',
        'darker-charcoal': '#0f0f0f'
      },
      fontFamily: {
        display: ['Playfair Display', 'serif'],
        body: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace']
      }
    }
  },
  plugins: []
}
