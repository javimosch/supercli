// DCLI Client-side utilities
// Highlight active nav item based on current URL
(function() {
  const path = window.location.pathname
  if (path.startsWith('/api/commands') || path.startsWith('/commands')) {
    const el = document.getElementById('nav-commands')
    if (el) el.classList.add('nav-active')
  } else if (path.startsWith('/api/specs') || path.startsWith('/specs')) {
    const el = document.getElementById('nav-specs')
    if (el) el.classList.add('nav-active')
  } else if (path.startsWith('/api/mcp') || path.startsWith('/mcp')) {
    const el = document.getElementById('nav-mcp')
    if (el) el.classList.add('nav-active')
  }
})()
