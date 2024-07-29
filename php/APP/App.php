<?php

namespace App\Controllers;

use Sober\Controller\Controller;

class App extends Controller
{
  use Partials\DataHelper;
  use Partials\InteractiveMap;
  
  /**
   * Returns the site Name
   */
  public function siteName()
  {
    return get_bloginfo('name');
  }

  /**
   * Get Google API Key
   */
  public static function googleApiKey()
  {
    return get_field('site_google_api_key', 'option');
  }

  // /**
  //  * Pass an address to return a link to google maps
  //  * with the appropriate search query already formatted.
  //  *
  //  * @param $search
  //  *
  //  * @return string
  //  */
  // public static function googleMapsSearchUrl($search)
  // {
  //     $search = urlencode(preg_replace('/<[^>]*>/', '', $search));

  //     return "https://www.google.com.au/maps/search/{$search}";
  // }

  /**
   * Format number to phone
   * @return string
   */
  public static function format_phone($phone)
  {
    $re = '/([()\s])/';
    return preg_replace($re, '', $phone);
  }
}