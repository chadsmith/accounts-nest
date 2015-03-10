Template.configureLoginServiceDialogForNest.helpers({
  siteUrl: function () {
    return Meteor.absoluteUrl();
  }
});

Template.configureLoginServiceDialogForNest.fields = function () {
  return [
    {property: 'clientId', label: 'Client ID'},
    {property: 'clientSecret', label: 'Client Secret'}
  ];
};