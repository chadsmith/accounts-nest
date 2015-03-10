Package.describe({
  name: 'chadsmith:nest',
  version: '0.0.1',
  summary: 'Nest OAuth flow'
});

Package.onUse(function(api) {
  api.use('oauth2', ['client', 'server']);
  api.use('oauth', ['client', 'server']);
  api.use('http', ['server']);
  api.use('templating', 'client');
  api.use('underscore', 'server');
  api.use('random', 'client');
  api.use('service-configuration', ['client', 'server']);

  api.export('Nest');

  api.addFiles(
    ['nest_configure.html', 'nest_configure.js'],
    'client');

  api.addFiles('nest_server.js', 'server');
  api.addFiles('nest_client.js', 'client');
});