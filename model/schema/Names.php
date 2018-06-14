<?php

namespace easyiplookup\model\schema;
use Illuminate\Database\Capsule\Manager as Capsule;

/**
 * Description of Comments
 *
 * @author patrick<easyiplookup>
 */
class Names
{
  public function run()
  {   
    /* @var \Illuminate\Database\Schema\Blueprint $table */
    if (!Capsule::schema()->hasTable( 'Comments' ))
      Capsule::schema()->create('Comments', function ($table) {
        $table->increments('id');
        
        $table->string('ip')->unique();
        $table->integer('port');
        $table->string('name')->unique();
        
        $table->timestamps();
      });
  }
}