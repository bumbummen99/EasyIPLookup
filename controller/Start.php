<?php

namespace easyiplookup\controller;

use easyiplookup\model\Name;
/**
 * Description of Start
 *
 * @author patrick
 */
class Start extends \qck\core\abstracts\Controller
{
  protected function proxyRun()
  {
    $Content = array();    
    $Password = "Sgn9e3t80234";
    
    $IP = $_SERVER["REMOTE_ADDR"];
    $Port = isset($_GET['port']) ? $_GET['port'] : null;
    $Name = isset($_GET['name']) ? $_GET['name'] : null;
    $UserPassword = isset($_GET['password']) ? $_GET['password'] : null;
    
    if($Name != null)
    {
      $N = Name::where(['name' => $Name])->first();
      
      if( $UserPassword != null && $UserPassword == $Password && $IP != null && $Port != null)
      {
        if($N == null)
          $N = new Name();
        
        $N->ip = $IP;
        $N->port = $Port;
        $N->name = $Name;
        $N->save();
        
        $Content = ['status' => 2, 'name' => $Name, 'ip' => $IP, 'port' => $Port];
      }
      else {
        if($N != null)
          $Content = ['status' => 1, 'ip' => $N->ip, 'port' => $N->port];
        else
          $Content = ['status' => 0, 'error' => 'Name does not exist'];
      }
    }
    else {
      $Content = ['status' => 0, 'error' => 'Missing name.'];
    }
    
    $Response = new \qck\core\Response();
    $Response->setContentType( 'Content-Type: application/json; charset=utf-8' );
    $Response->setContents(json_encode($Content));
    return $Response;
  }
}
