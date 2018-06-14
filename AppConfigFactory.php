<?php

namespace easyiplookup;

/**
 * Description of AppConfigFactory
 *
 * @author micha
 */
class AppConfigFactory implements \qck\core\interfaces\AppConfigFactory
{

  function __construct( $Argv = null )
  {
    $this->Argv = $Argv;
  }

  /**
   * 
   * @return AppConfig
   */
  public function create()
  {
    $LocalConfigName = __DIR__ . "/LocalAppConfig.php";
    if ( file_exists( $LocalConfigName ) )
    {
      $class = require_once $LocalConfigName;
      return new LocalAppConfig( $this->Argv );
    }
    else
      return new AppConfig( $this->Argv );
  }

  private $Argv;

}
