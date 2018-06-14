<?php

namespace easyiplookup\model;
use Illuminate\Database\Eloquent\Model;

/**
 * Description of Tag
 * 
 * @property int $id
 * @property string $ip
 * @property int $port
 * @property string $name
 * 
 * @author patrick<easyiplookup>
 */
class Name extends Model
{
  /**
   * The table associated with the model.
   *
   * @var string
   */
  protected $table = 'Names';
  
  /**
   * The primary key for the model.
   *
   * @var string
   */
  protected $primaryKey = 'id';
  
  /**
   * The attributes that are mass assignable.
   *
   * @var array
   */
  protected $fillable = [
    'ip',
    'port',
    'name'
  ];
  
  public function delete()
  {
    return Name::where( 'id', $this->Id )->delete();
  }
}
