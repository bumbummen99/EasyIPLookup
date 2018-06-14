# EasyIPLookup
An easy solution for quick name lookups. This can be used to update a list of names/keys with 
a combination of an ip address and a port. This allows to simply access your home network while 
not being at home. It supports http redirects and a JSON api.

# Requirements
- PHP 5.6
- Composer
- Illuminate
- Quick
- SQlite3 (Can be changed to any system supported by Illuminate)

# Installation
 - Clone the git repository
 - Navigate to the created folder and run "composer install"
 - Now navigate to public and run "php install.php" (Remove the file afterwards on a public host)
 - Edit your http server configuration so that the web-root points to the /public directory of the application.

# API

### Add / update name
http://yourname.com/index.php?password=Password&name=YourName&port=12345
  
### Get ip and port for a given name
http://yourname.com/index.php?name=YourName

### Get json answer
&json
  
  
  The JSON Api has the following data pattern
  
  status
   - 0 Not found or missing name
   - 1 Success
   - 2 Updated entry
  error
   - Contains the error message.
  ip
   - Contains the port
  port
   - Contains the port
