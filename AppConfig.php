<?php

namespace easyiplookup;
use Illuminate\Database\Capsule\Manager as Capsule;

/**
 * Description of AppConfig
 *
 * @author patrick
 */
class AppConfig extends \qck\ext\abstracts\AppConfig
{

  function __construct( $Argv = null )
  {
    $this->Argv = $Argv;
  }

  public function getControllerFactory()
  {
    return $this->getSingleton( "ControllerFactory", function()
        {
          $Ns = "\\easyiplookup\\controller";
          return new \qck\core\ControllerFactory( $Ns, $this->Argv );
        } );
  }
  
  /**
    * Get a registered connection instance.
    * @return \Illuminate\Database\Connection
    */
  function getDBConnection()
  {
    $DBFile = $this->getDatabaseFile();
    return $this->getSingleton( "DBConnection", function() use($DBFile)
      {
        $Capsule = new Capsule;
        // Same as database configuration file of Laravel.
        $Capsule->addConnection([
          'driver'   => 'sqlite',
          'database' => $DBFile,
          'prefix'   => '',
        ], 'default');
        $Capsule->bootEloquent();
        $Capsule->setAsGlobal();
        // Hold a reference to established connection just in case.
        $DBConnection = $Capsule->getConnection('default');
        return $DBConnection;
      } );
  }
  
  function getDatabaseFile()
  {
    return $this->getDataDir() . DIRECTORY_SEPARATOR . "easyiplookup.db";
  }

  public function getAppName()
  {
    return "EasyIPLookup";
  }

  private $Argv;

}
