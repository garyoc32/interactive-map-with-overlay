{{-- Blade Template File that retrieves my interactive map data and adds to the component using a data tag --}}
@php
    $data = App::getInteractiveMapData();
@endphp

<section class="map-page">
    <div class="map-page-container">
        <div id="interactive-map" class="interactive-map" data-interactive-map="{{ $data }}"></div>
    </div>
</section>