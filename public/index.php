<?php

// BASIC ERROR REPORTING
ini_set( "display_errors", 0 );
ini_set( "log_errors", 1 );
error_reporting( E_ALL );

// this should point to the main PSR-4 Autoloader
require_once('../vendor/autoload.php');

use Illuminate\Database\Capsule\Manager as Capsule;


// create & run application
$app = new \qck\core\App( new \easyiplookup\AppConfigFactory( null ) );

$Config = $app->getAppConfig();
$capsule = new Capsule;
$capsule->addConnection([
   "driver" => "sqlite",
   "database" => $Config->getDatabaseFile(),
]);
$capsule->setAsGlobal();
$capsule->bootEloquent();

$app->run();
