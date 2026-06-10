import Bakery from "$lib/assets/svgs/pois/bakery.svg?raw"
import GroceryStore from "$lib/assets/svgs/pois/grocery-store.svg?raw"
import FoodDrinks from "$lib/assets/svgs/pois/food-drinks.svg?raw"
import Campsite from "$lib/assets/svgs/pois/campsite.svg?raw"
import Hotel from "$lib/assets/svgs/pois/hotel.svg?raw"
import Hut from "$lib/assets/svgs/pois/hut.svg?raw"
import Viewpoint from "$lib/assets/svgs/pois/viewpoint.svg?raw"
import Attraction from "$lib/assets/svgs/pois/attraction.svg?raw"
import Barrier from "$lib/assets/svgs/pois/barrier.svg?raw"
import Toilet from "$lib/assets/svgs/pois/toilet.svg?raw"
import Shelter from "$lib/assets/svgs/pois/shelter.svg?raw"
import Shower from "$lib/assets/svgs/pois/shower.svg?raw"
import Summit from "$lib/assets/svgs/pois/summit.svg?raw"
import MountainPass from "$lib/assets/svgs/pois/mountain-pass.svg?raw"
import Climbing from "$lib/assets/svgs/pois/climbing.svg?raw"
import BicycleShop from "$lib/assets/svgs/pois/bike-repair.svg?raw"
import BicycleRental from "$lib/assets/svgs/pois/bike-rental.svg?raw"
import BicycleParking from "$lib/assets/svgs/pois/bike-parking.svg?raw"
import Garage from "$lib/assets/svgs/pois/garage.svg?raw"
import GasStation from "$lib/assets/svgs/pois/gas-station.svg?raw"
import Parking from "$lib/assets/svgs/pois/parking.svg?raw"
import Water from "$lib/assets/svgs/pois/water.svg?raw"
import RailwayStation from "$lib/assets/svgs/pois/train.svg?raw"
import SubwayStop from "$lib/assets/svgs/pois/subway.svg?raw"
import TramStop from "$lib/assets/svgs/pois/tram.svg?raw"
import BusStop from "$lib/assets/svgs/pois/bus.svg?raw"
import Ferry from "$lib/assets/svgs/pois/ferry.svg?raw"
import Picnic from "$lib/assets/svgs/pois/picnic.svg?raw"

import type { FilterSpecification, MapMouseEvent, Marker, StyleSpecification } from "maplibre-gl"

export interface BaseLayer {
    markers?: Record<string, Marker>,
    spec: StyleSpecification,
    filter?: FilterSpecification,
    listeners?: Record<string, {
        onMouseUp?: (e: MapMouseEvent) => void,
        onMouseDown?: (e: MapMouseEvent) => void,
        onEnter?: (e: MapMouseEvent) => void,
        onLeave?: (e: MapMouseEvent) => void,
        onMouseMove?: (e: MapMouseEvent) => void,
    }>

}

export const baseMapStyles: Record<string, string | StyleSpecification> = {
    "高德标准": {
        version: 8,
        sources: {
            amapStandard: {
                type: 'raster',
                tiles: [
                    'https://webrd01.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}',
                    'https://webrd02.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}',
                    'https://webrd03.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}',
                    'https://webrd04.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}',
                ],
                tileSize: 256,
                maxzoom: 18,
                attribution:
                    '&copy; <a href="https://www.amap.com" target="_blank">高德地图</a>',
            },
        },
        layers: [
            {
                id: 'amapStandard',
                type: 'raster',
                source: 'amapStandard',
            },
        ],
    },
    "高德卫星": {
        version: 8,
        sources: {
            amapSatellite: {
                type: 'raster',
                tiles: [
                    'https://webst01.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}',
                    'https://webst02.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}',
                    'https://webst03.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}',
                    'https://webst04.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}',
                ],
                tileSize: 256,
                maxzoom: 18,
                attribution:
                    '&copy; <a href="https://www.amap.com" target="_blank">高德地图</a>',
            },
        },
        layers: [
            {
                id: 'amapSatellite',
                type: 'raster',
                source: 'amapSatellite',
            },
        ],
    },
    "高德夜间": {
        version: 8,
        sources: {
            amapDark: {
                type: 'raster',
                tiles: [
                    'https://webrd01.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=7&x={x}&y={y}&z={z}',
                    'https://webrd02.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=7&x={x}&y={y}&z={z}',
                    'https://webrd03.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=7&x={x}&y={y}&z={z}',
                    'https://webrd04.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=7&x={x}&y={y}&z={z}',
                ],
                tileSize: 256,
                maxzoom: 18,
                attribution:
                    '&copy; <a href="https://www.amap.com" target="_blank">高德地图</a>',
            },
        },
        layers: [
            {
                id: 'amapDark',
                type: 'raster',
                source: 'amapDark',
            },
        ],
    },
}

// 覆盖层说明：原 waymarkedtrails.org 覆盖层（徒步/骑行/山地/滑雪）在中国大陆无法访问。
// 可通过 Settings -> Map 自定义 tileset 添加替代覆盖层，或自建 waymarkedtrails 实例。
export const overlays: Record<string, StyleSpecification> = {}

export type POI = {
    tags:
    | Record<string, string | boolean | string[]>
    | Record<string, string | boolean | string[]>[], icon: { svg: any, bg: string }
}
export const pois: Record<string, POI> = {
    bakery: {
        icon: {
            svg: Bakery,
            bg: 'Coral',
        },
        tags: {
            shop: 'bakery',
        },
    },
    'grocery-store': {
        icon: {
            svg: GroceryStore,
            bg: 'Coral',
        },
        tags: {
            shop: ['supermarket', 'convenience'],
        },

    },
    "food-drinks": {
        icon: {
            svg: FoodDrinks,
            bg: 'Coral',
        },
        tags: {
            amenity: ['restaurant', 'fast_food', 'cafe', 'pub', 'bar'],
        },

    },
    toilets: {
        icon: {
            svg: Toilet,
            bg: 'DeepSkyBlue',
        },
        tags: {
            amenity: 'toilets',
        },

    },
    water: {
        icon: {
            svg: Water,
            bg: 'DeepSkyBlue',
        },
        tags: [
            {
                amenity: ['drinking_water', 'water_point'],
            },
            {
                natural: 'spring',
                drinking_water: 'yes',
            },
        ],

    },
    shower: {
        icon: {
            svg: Shower,
            bg: 'DeepSkyBlue',
        },
        tags: {
            amenity: 'shower',
        },

    },
    shelter: {
        icon: {
            svg: Shelter,
            bg: '#000000',
        },
        tags: {
            amenity: 'shelter',
        },

    },
    'gas-station': {
        icon: {
            svg: GasStation,
            bg: '#000000',
        },
        tags: {
            amenity: 'fuel',
        },

    },
    parking: {
        icon: {
            svg: Parking,
            bg: '#000000',
        },
        tags: {
            amenity: 'parking',
        },

    },
    garage: {
        icon: {
            svg: Garage,
            bg: '#000000',
        },
        tags: {
            shop: ['car_repair', 'motorcycle_repair'],
        },

    },
    barrier: {
        icon: {
            svg: Barrier,
            bg: '#000000',
        },
        tags: {
            barrier: true,
        },
    },
    attraction: {
        icon: {
            svg: Attraction,
            bg: 'Green',
        },
        tags: {
            tourism: 'attraction',
        },
    },
    viewpoint: {
        icon: {
            svg: Viewpoint,
            bg: 'Green',
        },
        tags: {
            tourism: 'viewpoint',
        },

    },
    hotel: {
        icon: {
            svg: Hotel,
            bg: '#e6c100',
        },
        tags: {
            tourism: ['hotel', 'hostel', 'guest_house', 'motel'],
        },

    },
    campsite: {
        icon: {
            svg: Campsite,
            bg: '#e6c100',
        },
        tags: {
            tourism: 'camp_site',
        },

    },
    hut: {
        icon: {
            svg: Hut,
            bg: '#e6c100',
        },
        tags: {
            tourism: ['alpine_hut', 'wilderness_hut'],
        },

    },
    picnic: {
        icon: {
            svg: Picnic,
            bg: 'Green',
        },
        tags: {
            tourism: 'picnic_site',
        },

    },
    summit: {
        icon: {
            svg: Summit,
            bg: 'Green',
        },
        tags: {
            natural: 'peak',
        },

    },
    "mountain-pass": {
        icon: {
            svg: MountainPass,
            bg: 'Green',
        },
        tags: {
            mountain_pass: 'yes',
        },
    },
    climbing: {
        icon: {
            svg: Climbing,
            bg: 'Green',
        },
        tags: {
            sport: 'climbing',
        },
    },
    'bicycle-parking': {
        icon: {
            svg: BicycleParking,
            bg: 'HotPink',
        },
        tags: {
            amenity: 'bicycle_parking',
        },

    },
    'bicycle-rental': {
        icon: {
            svg: BicycleRental,
            bg: 'HotPink',
        },
        tags: {
            amenity: 'bicycle_rental',
        },
    },
    'bicycle-shop': {
        icon: {
            svg: BicycleShop,
            bg: 'HotPink',
        },
        tags: {
            shop: 'bicycle',
        },
    },
    'railway-station': {
        icon: {
            svg: RailwayStation,
            bg: 'DarkBlue',
        },
        tags: {
            railway: 'station',
        },

    },
    'tram-stop': {
        icon: {
            svg: TramStop,
            bg: 'DarkBlue',
        },
        tags: {
            railway: 'tram_stop',
        },

    },
    'subway-stop': {
        icon: {
            svg: SubwayStop,
            bg: 'DarkBlue',
        },
        tags: {
            railway: 'subway_entrance',
        },

    },
    'bus-stop': {
        icon: {
            svg: BusStop,
            bg: 'DarkBlue',
        },
        tags: {
            public_transport: ['stop_position', 'platform'],
            bus: 'yes',
        },

    },
    ferry: {
        icon: {
            svg: Ferry,
            bg: 'DarkBlue',
        },
        tags: {
            amenity: 'ferry_terminal',
        },

    },
};


export type MapState = {
    base: keyof typeof baseMapStyles,
    overlays: { [K in keyof typeof overlays]: boolean }
    pois: Record<string, Record<string, boolean>>
}

export const defaultMapState: MapState = {
    base: "高德标准",
    overlays: {
        hiking: false,
        cycling: false,
        MTB: false,
        skiing: false,
    },
    pois: {
        food: {
            "food-drinks": false,
            "grocery-store": false,
            bakery: false,
        },
        tourism: {
            campsite: false,
            attraction: false,
            hotel: false,
            hut: false,
            viewpoint: false,
        },
        amenity: {
            water: false,
            barrier: false,
            shelter: false,
            shower: false,
            toilets: false,
        },
        hiking: {
            "mountain-pass": false,
            climbing: false,
            summit: false,
        },
        cycling: {
            "bicycle-rental": false,
            "bicycle-shop": false,
            "bicycle-parking": false,
        },
        "car-motorcycle": {
            "garage": false,
            "gas-station": false,
            parking: false,
        },
        "public-transport": {
            "railway-station": false,
            "subway-stop": false,
            "tram-stop": false,
            "bus-stop": false,
            ferry: false,
        }
    }
}