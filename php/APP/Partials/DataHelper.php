<?php

namespace App\Controllers\Partials;

trait DataHelper {
  //Retrieve only the necessary event type data for the application
  public static function reshapeEventType($post) {
      $id = $post->ID;

      return [
          'id' => $id,
          'title' => $post->post_title,
          'singular_title' => get_field('singular_title', $id) ? get_field('singular_title', $id) : $post->post_title,
          'slug' => $post->post_name,
          'filtered_by' => get_field('filtered_by', $id),
          'post_type' => 'event-type',
          'permalink' => get_permalink($id),
      ];
  }

  //Retrieve only the necessary event space data for the application
  public static function reshapeEventSpaceForMap($post) {
    $id = $post->ID;

    $types = [];
    $eventTypes = get_field('event_types', $id);
    if(!empty($eventTypes)):
      foreach($eventTypes as $eventType):
        $types[] = self::reshapeEventType($eventType);
      endforeach;
    endif;

    return [
      'id' => $id,
      'title' => $post->post_title,
      'slug' => $post->post_name,
      'status' => $post->post_status,
      'tagline' => get_field('tagline', $id),
      'permalink' => get_permalink($id),
      'capacity' => get_field('capacity', $id),
      'size' => get_field('size', $id),
      'excerpt' => get_the_excerpt($id) ?: get_field('intro', $id),
      'types' => $types,
      'gallery' => get_field('map_marker_gallery', $id),
      'map_location' => get_field('map_location', $id),
      'brandmark' => get_field('brandmark', $id),
      'marker_label' => get_field('marker_label', $id) ? get_field('marker_label', $id) : ' ',
      'marker_text_label' => get_field('marker_text_label', $id),
    ];
  }
}
