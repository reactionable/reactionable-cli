export default `[build.environment]
  NODE_VERSION = "<%= it.nodeVersion %>"

# Build command
[build]
  publish = "./build"

  command = """\\
  npm rebuild node-sass && \\
  npm run test --if-present && \\
  npm run build
  """

[context.production.environment]

# Production dns redirects
[[redirects]]
  from = "https://<%= it.projectBranch %>--<%= it.projectName %>.netlify.com/*"
  to = "https://<%= it.projectName %>.netlify.com/:splat"
  status = 301
  force = true

# The following redirect is intended for use with most SPAs that handle
# routing internally.
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200`;
