<?php

namespace App\Controllers\Partials;

trait InteractiveMap {
    // Create a CMS stored transient to save a version of the data from CMS to prevent repeated queries
    private static $map_data_transient_slug = 'mapdata_events_data_cache';

    public static function getInteractiveMapData($clean = false)
    {
        // delete_transient(self::$map_data_transient_slug);

        if( ($data = get_transient(self::$map_data_transient_slug)) === false || $clean) {
            $data = [];
            $eventSpaces = [];
            //Get the ID of the map page as set in CMS
            $page_for_map = get_field('page_for_map', 'option');

            //Retrieve all Event Spaces
            $query = new \WP_Query([
                'post_type' => 'event-space',
                'posts_per_page' => -1,
                'post_parent' => '0'
            ]);

            //Reshape each of the retrieved Event Spaces to return only necessary object data
            if($query->found_posts) {
                $posts = $query->posts;
                
                foreach($posts as $post):
                    $eventSpaces[] = self::reshapeEventSpaceForMap($post);
                endforeach;
            }
            
            //return all ecessary data for the application
            $data = [
                'eventSpaces' => $eventSpaces,
                'mapBase' => wp_get_original_image_url(get_field('map_assets', $page_for_map)['map_background']),
                'mapOverlay' => get_field('map_assets', $page_for_map)['map_overlay'],
                'mapLegend' => get_field('map_legend', $page_for_map),
                'apiKey' => get_field('site_google_api_key', 'option'),
                'mapID' => get_field('google_maps_mapid', 'option'),
            ];

            if(!$clean) {
                $data = json_encode($data);
                set_transient(self::$map_data_transient_slug, $data, WEEK_IN_SECONDS);
            }
        }

        return $data;
    }
}

function my_acf_google_map_api( $api ){
    $api['key'] = get_field('site_google_api_key', 'option');
    return $api;
}
add_filter('acf/fields/google_map/api', __NAMESPACE__ . '\\my_acf_google_map_api');