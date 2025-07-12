class AzureConfig {
  // Azure AD configuration for Trackademic Mobile
  static const String clientId = 'a1840241-8f73-46fb-a4b3-7141a0a0d480';
  static const String tenantId = '77040219-1098-4565-850f-f21d083689bb';
  static const String redirectUri = 'msauth://com.trackademic.app.trackademicApp';
  
  // Microsoft Graph scopes
  static const List<String> scopes = [
    'User.Read',
    'Directory.Read.All',
  ];
  
  // Azure AD authority URL - simplified for better compatibility
  static const String authority = 'https://login.microsoftonline.com/common';
}
