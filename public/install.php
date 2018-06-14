<?php

// BASIC ERROR REPORTING
ini_set( "display_errors", 1 );
ini_set( "log_errors", 1 );
set_time_limit ( 60 * 5 );
error_reporting( E_ALL );

// this should point to the main PSR-4 Autoloader
require_once('../vendor/autoload.php');

use Illuminate\Database\Capsule\Manager as Capsule;
use easyiplookup\AppConfigFactory;


// create & run application
$app = new \qck\core\App( new AppConfigFactory( null ) );

$Config = $app->getAppConfig();

if( file_exists ( $Config->getDatabaseFile() ) )
  unlink($Config->getDatabaseFile());
new SQLite3($Config->getDatabaseFile());

$capsule = new Capsule;
$capsule->addConnection([
  "driver" => "sqlite",
  "database" => $Config->getDatabaseFile()
]);
$capsule->setAsGlobal();
$capsule->bootEloquent();

//============= Tables
$NamesTable = new \easyiplookup\model\schema\Names();
$NamesTable->run();

echo "Complete";